
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useUpdateRegistration } from "@/hooks/useRegistrations";
import { supabase } from "@/integrations/supabase/client";
import { sanitizeError, logError } from "@/lib/error-utils";

interface PaymentVerificationFormProps {
  onVerify?: () => void;
}

export function PaymentVerificationForm({ onVerify }: PaymentVerificationFormProps) {
  const [registrationCode, setRegistrationCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const updateRegistration = useUpdateRegistration();
  const { toast } = useToast();

  const handleVerify = async () => {
    // Validate input
    const trimmedCode = registrationCode.trim().toUpperCase();
    if (!trimmedCode) {
      toast({
        title: "Registration code required",
        description: "Please enter a valid registration code",
        variant: "destructive",
      });
      return;
    }

    // Validate code format (alphanumeric, max 20 chars)
    if (!/^[A-Z0-9]{1,20}$/.test(trimmedCode)) {
      toast({
        title: "Invalid code format",
        description: "Registration code must be alphanumeric",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // First, verify user has admin/staff role
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError || !userData.user) {
        toast({
          title: "Authentication required",
          description: "Please sign in to verify payments",
          variant: "destructive",
        });
        return;
      }

      // Check user role - must be admin or staff
      const { data: userProfile, error: profileError } = await supabase
        .from("user_profiles")
        .select("role")
        .eq("id", userData.user.id)
        .single();

      if (profileError || !userProfile) {
        logError('PaymentVerificationForm:checkRole', profileError);
        toast({
          title: "Access denied",
          description: "Unable to verify your permissions",
          variant: "destructive",
        });
        return;
      }

      if (!['admin', 'staff'].includes(userProfile.role)) {
        toast({
          title: "Access denied",
          description: "Only administrators and staff can verify payments",
          variant: "destructive",
        });
        return;
      }

      // Get the registration by code
      const { data: registrationData, error: registrationError } = await supabase
        .from("registrations")
        .select("id, registration_code, payment_status, status")
        .eq("registration_code", trimmedCode)
        .single();

      if (registrationError || !registrationData) {
        logError('PaymentVerificationForm:findRegistration', registrationError);
        toast({
          title: "Registration not found",
          description: "No registration found with this code",
          variant: "destructive",
        });
        return;
      }

      // Check if already paid
      if (registrationData.payment_status === "paid") {
        toast({
          title: "Already verified",
          description: "This registration has already been marked as paid",
        });
        return;
      }

      // Update payment status
      await updateRegistration.mutateAsync({
        id: registrationData.id,
        payment_status: "paid",
        status: "confirmed"
      });

      toast({
        title: "Payment verified",
        description: "Registration has been marked as paid and confirmed",
      });

      setRegistrationCode("");
      
      if (onVerify) {
        onVerify();
      }
    } catch (error) {
      logError('PaymentVerificationForm:verify', error);
      toast({
        title: "Verification failed",
        description: sanitizeError(error),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Verify Payment</CardTitle>
        <CardDescription>
          Manually verify payment for a registration (Admin/Staff only)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="registration-code">Registration Code</Label>
            <Input
              id="registration-code"
              placeholder="Enter registration code"
              value={registrationCode}
              onChange={(e) => setRegistrationCode(e.target.value.toUpperCase())}
              maxLength={20}
            />
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleVerify}
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? "Verifying..." : "Verify Payment"}
        </Button>
      </CardFooter>
    </Card>
  );
}
