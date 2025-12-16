
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

// CORS headers for browser requests
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-webhook-signature, x-webhook-timestamp",
};

// Verify webhook signature using HMAC-SHA256
async function verifyWebhookSignature(
  payload: string,
  signature: string | null,
  timestamp: string | null,
  secret: string
): Promise<boolean> {
  if (!signature || !timestamp) {
    return false;
  }

  // Check timestamp to prevent replay attacks (5 minute window)
  const timestampMs = parseInt(timestamp, 10);
  const now = Date.now();
  const fiveMinutes = 5 * 60 * 1000;
  if (isNaN(timestampMs) || Math.abs(now - timestampMs) > fiveMinutes) {
    console.error("Webhook timestamp outside acceptable window");
    return false;
  }

  try {
    // Create the signed payload
    const signedPayload = `${timestamp}.${payload}`;
    
    // Import the secret key
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      "raw",
      encoder.encode(secret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"]
    );

    // Sign the payload
    const signatureBuffer = await crypto.subtle.sign(
      "HMAC",
      key,
      encoder.encode(signedPayload)
    );

    // Convert to hex string
    const expectedSignature = Array.from(new Uint8Array(signatureBuffer))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');

    // Constant-time comparison to prevent timing attacks
    if (signature.length !== expectedSignature.length) {
      return false;
    }
    
    let result = 0;
    for (let i = 0; i < signature.length; i++) {
      result |= signature.charCodeAt(i) ^ expectedSignature.charCodeAt(i);
    }
    return result === 0;
  } catch (error) {
    console.error("Error verifying signature:", error);
    return false;
  }
}

// Validate webhook payload
function validatePayload(payload: unknown): { 
  registration_code: string; 
  payment_status: string; 
  payment_reference?: string; 
  transaction_id?: string; 
} | null {
  if (typeof payload !== 'object' || payload === null) {
    return null;
  }
  
  const data = payload as Record<string, unknown>;
  
  // Required fields
  if (typeof data.registration_code !== 'string' || !data.registration_code.trim()) {
    return null;
  }
  if (typeof data.payment_status !== 'string' || !data.payment_status.trim()) {
    return null;
  }
  
  // Validate payment_status is one of allowed values
  const allowedStatuses = ['pending', 'paid', 'failed', 'refunded'];
  if (!allowedStatuses.includes(data.payment_status)) {
    return null;
  }
  
  // Sanitize registration code (alphanumeric only, max 20 chars)
  const registrationCode = data.registration_code.trim().toUpperCase();
  if (!/^[A-Z0-9]{1,20}$/.test(registrationCode)) {
    return null;
  }
  
  return {
    registration_code: registrationCode,
    payment_status: data.payment_status,
    payment_reference: typeof data.payment_reference === 'string' ? data.payment_reference.slice(0, 100) : undefined,
    transaction_id: typeof data.transaction_id === 'string' ? data.transaction_id.slice(0, 100) : undefined,
  };
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get webhook secret from environment
    const webhookSecret = Deno.env.get("WEBHOOK_SECRET");
    
    // Read raw body for signature verification
    const rawBody = await req.text();
    
    // Verify webhook signature if secret is configured
    if (webhookSecret) {
      const signature = req.headers.get("x-webhook-signature");
      const timestamp = req.headers.get("x-webhook-timestamp");
      
      const isValid = await verifyWebhookSignature(rawBody, signature, timestamp, webhookSecret);
      if (!isValid) {
        console.error("Invalid webhook signature");
        return new Response(
          JSON.stringify({ success: false, error: "Unauthorized" }),
          { headers: { "Content-Type": "application/json", ...corsHeaders }, status: 401 }
        );
      }
      console.log("Webhook signature verified successfully");
    } else {
      console.warn("WEBHOOK_SECRET not configured - signature verification skipped. This is insecure for production!");
    }

    // Parse and validate payload
    let payload: unknown;
    try {
      payload = JSON.parse(rawBody);
    } catch {
      return new Response(
        JSON.stringify({ success: false, error: "Invalid JSON payload" }),
        { headers: { "Content-Type": "application/json", ...corsHeaders }, status: 400 }
      );
    }

    const validatedPayload = validatePayload(payload);
    if (!validatedPayload) {
      console.error("Invalid payload structure");
      return new Response(
        JSON.stringify({ success: false, error: "Invalid payload" }),
        { headers: { "Content-Type": "application/json", ...corsHeaders }, status: 400 }
      );
    }

    // Create Supabase client using service role key
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    // Log webhook for auditing
    console.log("Processing payment webhook:", {
      registration_code: validatedPayload.registration_code,
      payment_status: validatedPayload.payment_status,
      timestamp: new Date().toISOString()
    });

    // Update registration payment status in database
    const { data, error } = await supabaseAdmin
      .from("registrations")
      .update({
        payment_status: validatedPayload.payment_status,
        payment_reference: validatedPayload.payment_reference || validatedPayload.transaction_id,
        ...(validatedPayload.payment_status === "paid" && { status: "confirmed" }),
        updated_at: new Date().toISOString()
      })
      .eq("registration_code", validatedPayload.registration_code)
      .select("id, registration_code, payment_status, status")
      .single();

    if (error) {
      console.error("Database update error:", error.code);
      return new Response(
        JSON.stringify({ success: false, error: "Unable to process payment" }),
        { headers: { "Content-Type": "application/json", ...corsHeaders }, status: 400 }
      );
    }

    if (!data) {
      console.error("Registration not found:", validatedPayload.registration_code);
      return new Response(
        JSON.stringify({ success: false, error: "Registration not found" }),
        { headers: { "Content-Type": "application/json", ...corsHeaders }, status: 404 }
      );
    }

    console.log("Payment processed successfully:", {
      registration_id: data.id,
      new_status: data.payment_status
    });

    return new Response(
      JSON.stringify({ success: true, message: "Payment status updated successfully" }),
      { headers: { "Content-Type": "application/json", ...corsHeaders }, status: 200 }
    );
  } catch (error) {
    console.error("Webhook processing error:", error);
    return new Response(
      JSON.stringify({ success: false, error: "Internal server error" }),
      { headers: { "Content-Type": "application/json", ...corsHeaders }, status: 500 }
    );
  }
});
