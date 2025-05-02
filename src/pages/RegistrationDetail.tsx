import { useParams, useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/DashboardLayout";
import { useRegistration, useUpdateRegistration } from "@/hooks/useRegistrations";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import { ArrowLeft, Clock, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { RegistrationStatusBadge } from "@/components/registrations/RegistrationStatusBadge";
import { ExamInformation } from "@/components/registrations/ExamInformation";
import { PaymentInformation } from "@/components/registrations/PaymentInformation";
import { RegistrationQrCode } from "@/components/registrations/RegistrationQrCode";
import { RegistrationActionCard } from "@/components/registrations/RegistrationActionCard";
import { RegistrationDetailSkeleton } from "@/components/registrations/RegistrationDetailSkeleton";
import { RegistrationError } from "@/components/registrations/RegistrationError";

const RegistrationDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: registration, isLoading, isError, error } = useRegistration(id);
  const updateRegistration = useUpdateRegistration();
  const { toast } = useToast();

  const handleCancel = async () => {
    if (!registration) return;
    
    try {
      await updateRegistration.mutateAsync({
        id: registration.id,
        status: "cancelled"
      });
      
      toast({
        title: "Registration cancelled",
        description: "Your registration has been cancelled successfully.",
      });
    } catch (error) {
      toast({
        title: "Cancellation failed",
        description: "There was an error cancelling your registration.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <RegistrationDetailSkeleton onBack={() => navigate(-1)} />
      </DashboardLayout>
    );
  }

  if (isError || !registration) {
    return (
      <DashboardLayout>
        <RegistrationError 
          onBack={() => navigate(-1)} 
          errorMessage={error instanceof Error ? error.message : undefined}
        />
      </DashboardLayout>
    );
  }

  const examSchedule = registration.exam_schedule;
  
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <h2 className="text-3xl font-bold tracking-tight">Registration Details</h2>
          </div>
          <div className="flex gap-2">
            {registration.status === "pending" && (
              <Button variant="destructive" onClick={handleCancel}>
                Cancel Registration
              </Button>
            )}
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl">Registration #{registration.registration_code}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Created on {format(new Date(registration.created_at), 'PPP')}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <RegistrationStatusBadge status={registration.status} type="registration" />
                    <RegistrationStatusBadge status={registration.payment_status} type="payment" />
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <ExamInformation examSchedule={examSchedule} room={registration.room} />
                
                <Separator />
                
                <PaymentInformation registration={registration} examSchedule={examSchedule} />
              </CardContent>
              
              <CardFooter className="border-t flex justify-between">
                <div className="text-sm text-muted-foreground">
                  <User className="h-4 w-4 inline mr-1" />
                  Registration ID: {registration.id}
                </div>
                <div className="text-sm text-muted-foreground">
                  <Clock className="h-4 w-4 inline mr-1" />
                  Last Updated: {format(new Date(registration.updated_at), 'Pp')}
                </div>
              </CardFooter>
            </Card>
          </div>
          
          <div className="space-y-6">
            <RegistrationQrCode registrationCode={registration.registration_code} />
            
            {registration.payment_status === "pending" && (
              <RegistrationActionCard type="payment" registration={registration} />
            )}
            
            {registration.status === "confirmed" && (
              <RegistrationActionCard type="download" />
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default RegistrationDetail;
