
import { ArrowLeft } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

interface RegistrationErrorProps {
  onBack: () => void;
}

export function RegistrationError({ onBack }: RegistrationErrorProps) {
  return (
    <div className="space-y-6">
      <Button variant="ghost" size="sm" onClick={onBack}>
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back
      </Button>
      
      <Alert variant="destructive">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Could not load the registration details. The registration may have been deleted or you don't have permission to view it.
        </AlertDescription>
      </Alert>
    </div>
  );
}
