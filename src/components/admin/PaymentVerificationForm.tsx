
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useUpdateRegistration } from "@/hooks/useRegistrations";
import { supabase } from "@/integrations/supabase/client";

interface PaymentVerificationFormProps {
  onVerify?: () => void;
}

export function PaymentVerificationForm({ onVerify }: PaymentVerificationFormProps) {
  const [registrationCode, setRegistrationCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const updateRegistration = useUpdateRegistration();
  const { toast } = useToast();

  const handleVerify = async () => {
    if (!registrationCode.trim()) {
      toast({
        title: "Registration code required",
        description: "Please enter a valid registration code",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // First, get the registration by code
      const { data: registrationData } = await supabase
        .from("registrations")
        .select("*")
        .eq("registration_code", registrationCode.trim())
        .single();

      if (!registrationData) {
        toast({
          title: "Registration not found",
          description: "No registration found with this code",
          variant: "destructive",
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
      console.error("Verification error:", error);
      toast({
        title: "Verification failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
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
          Manually verify payment for a registration
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
              onChange={(e) => setRegistrationCode(e.target.value)}
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
