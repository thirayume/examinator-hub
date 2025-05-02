
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface RegistrationActionCardProps {
  type: "payment" | "download";
}

export function RegistrationActionCard({ type }: RegistrationActionCardProps) {
  if (type === "payment") {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Complete Payment</CardTitle>
          <CardDescription>
            Pay to confirm your registration
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button className="w-full">
            Pay Now
          </Button>
        </CardContent>
      </Card>
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
        <Button className="w-full">
          Download
        </Button>
      </CardContent>
    </Card>
  );
}
