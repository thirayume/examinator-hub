
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

// CORS headers for browser requests
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Create Supabase client using service role key (to bypass RLS)
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { 
        auth: { persistSession: false }
      }
    );

    // Parse webhook payload
    const payload = await req.json();
    
    // Log webhook content for debugging
    console.log("Payment webhook received:", payload);

    // In a real implementation, verify webhook signature here
    // For example, with PromptPay integration or bank API callbacks

    // Extract payment information from payload
    // This depends on your payment provider's webhook format
    // Below is a simplified example
    const {
      registration_code,
      payment_status,
      payment_reference,
      transaction_id
    } = payload;

    if (!registration_code || !payment_status) {
      throw new Error("Missing required payment information");
    }

    // Update registration payment status in database
    const { data, error } = await supabaseAdmin
      .from("registrations")
      .update({
        payment_status: payment_status,
        payment_reference: payment_reference || transaction_id,
        // If payment is successful, update registration status to confirmed
        ...(payment_status === "paid" && { status: "confirmed" }),
        updated_at: new Date().toISOString()
      })
      .eq("registration_code", registration_code)
      .select()
      .single();

    if (error) {
      throw error;
    }

    // Log the successful update
    console.log("Updated registration:", data);

    // Return success response
    return new Response(
      JSON.stringify({ 
        success: true,
        message: "Payment status updated successfully"
      }),
      {
        headers: { "Content-Type": "application/json", ...corsHeaders },
        status: 200
      }
    );
  } catch (error) {
    console.error("Error processing payment webhook:", error.message);
    
    // Return error response
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message 
      }),
      {
        headers: { "Content-Type": "application/json", ...corsHeaders },
        status: 400
      }
    );
  }
});
