
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Registration } from "@/types/exams";
import { useUpdateRegistration } from "@/hooks/useRegistrations";
import { useToast } from "@/hooks/use-toast";
import { validatePaymentReference } from "@/lib/payment-utils";
import { RegistrationQrCode } from "@/components/registrations/RegistrationQrCode";

interface RegistrationActionCardProps {
  type: "payment" | "download";
  registration?: Registration;
}

export function RegistrationActionCard({ type, registration }: RegistrationActionCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"promptpay" | "bank">("promptpay");
  const [paymentReference, setPaymentReference] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const updateRegistration = useUpdateRegistration();
  const { toast } = useToast();

  const handlePaymentSubmit = async () => {
    if (!registration) return;
    
    if (paymentMethod === "bank" && !validatePaymentReference(paymentReference)) {
      toast({
        title: "Invalid reference",
        description: "Please enter a valid payment reference",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await updateRegistration.mutateAsync({
        id: registration.id,
        payment_status: "pending",
        payment_method: paymentMethod,
        payment_reference: paymentMethod === "bank" ? paymentReference : null
      });
      
      toast({
        title: "Payment information submitted",
        description: "Your payment is being verified. This may take a few minutes.",
      });
      
      setIsOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "There was a problem submitting your payment information",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDownload = () => {
    // This will be implemented later with PDF generation
    toast({
      title: "Coming Soon",
      description: "Admission card download will be available soon",
    });
  };

  if (type === "payment") {
    return (
      <>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Complete Payment</CardTitle>
            <CardDescription>
              Pay to confirm your registration
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" onClick={() => setIsOpen(true)}>
              Pay Now
            </Button>
          </CardContent>
        </Card>

        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Payment Options</DialogTitle>
              <DialogDescription>
                Choose your preferred payment method
              </DialogDescription>
            </DialogHeader>
            
            <Tabs defaultValue="promptpay" onValueChange={(value) => setPaymentMethod(value as "promptpay" | "bank")}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="promptpay">PromptPay QR</TabsTrigger>
                <TabsTrigger value="bank">Bank Transfer</TabsTrigger>
              </TabsList>
              
              <TabsContent value="promptpay" className="py-4">
                {registration && registration.exam_schedule && (
                  <div className="flex flex-col items-center space-y-4">
                    <RegistrationQrCode
                      registrationCode={registration.registration_code}
                      isPayment={true}
                      paymentAmount={registration.exam_schedule.price}
                    />
                    <p className="text-sm text-muted-foreground text-center">
                      Scan this QR code with your banking app to pay via PromptPay.
                      After payment, click "I've Paid" to confirm.
                    </p>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="bank" className="py-4">
                <div className="space-y-4">
                  <div>
                    <p className="font-medium">Bank Account Details</p>
                    <div className="mt-2 p-3 bg-muted rounded-md">
                      <p>Bank Name: Siam Commercial Bank</p>
                      <p>Account Name: NRRU Language Institute</p>
                      <p>Account Number: 555-555-5555</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="reference">Payment Reference</Label>
                    <Input
                      id="reference"
                      placeholder="Enter transaction reference"
                      value={paymentReference}
                      onChange={(e) => setPaymentReference(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">
                      Please enter the transaction ID or reference number from your bank transfer
                    </p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
            
            <DialogFooter className="sm:justify-start">
              <Button 
                onClick={handlePaymentSubmit} 
                disabled={paymentMethod === "bank" && !paymentReference || isSubmitting}
              >
                {isSubmitting ? "Processing..." : "I've Paid"}
              </Button>
              <Button variant="outline" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Download Admission Card</CardTitle>
        <CardDescription>
          Required for entry on exam day
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button className="w-full" onClick={handleDownload}>
          Download
        </Button>
      </CardContent>
    </Card>
  );
}
