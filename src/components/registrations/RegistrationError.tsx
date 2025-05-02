
import { ArrowLeft, AlertTriangle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

interface RegistrationErrorProps {
  onBack: () => void;
  errorMessage?: string;
}

export function RegistrationError({ onBack, errorMessage }: RegistrationErrorProps) {
  return (
    <div className="space-y-6">
      <Button variant="ghost" size="sm" onClick={onBack}>
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back
      </Button>
      
      <Card className="border-destructive/20">
        <CardHeader className="bg-destructive/5 border-b border-destructive/20">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            <h3 className="font-medium text-destructive">Error Loading Registration</h3>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <Alert variant="destructive">
            <AlertTitle>Access Error</AlertTitle>
            <AlertDescription>
              {errorMessage || 
                "Could not load the registration details. The registration may have been deleted or you don't have permission to view it."}
            </AlertDescription>
          </Alert>
          
          <div className="mt-6">
            <Button variant="outline" onClick={onBack} className="w-full sm:w-auto">
              Return to Registrations
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
