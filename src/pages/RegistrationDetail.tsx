
import { useParams, useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/DashboardLayout";
import { useRegistration, useUpdateRegistration } from "@/hooks/useRegistrations";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import { ArrowLeft, Calendar, Clock, MapPin, QrCode, Ticket, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";

const RegistrationDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: registration, isLoading, isError } = useRegistration(id);
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

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { class: string, label: string }> = {
      pending: { class: "bg-yellow-100 text-yellow-800", label: "Pending" },
      confirmed: { class: "bg-green-100 text-green-800", label: "Confirmed" },
      cancelled: { class: "bg-red-100 text-red-800", label: "Cancelled" },
      waitlisted: { class: "bg-blue-100 text-blue-800", label: "Waitlisted" }
    };
    
    const config = statusConfig[status] || statusConfig.pending;
    
    return <Badge className={config.class}>{config.label}</Badge>;
  };

  const getPaymentStatusBadge = (status: string) => {
    const statusConfig: Record<string, { class: string, label: string }> = {
      pending: { class: "bg-yellow-100 text-yellow-800", label: "Payment Pending" },
      paid: { class: "bg-green-100 text-green-800", label: "Paid" },
      failed: { class: "bg-red-100 text-red-800", label: "Payment Failed" },
      refunded: { class: "bg-purple-100 text-purple-800", label: "Refunded" }
    };
    
    const config = statusConfig[status] || statusConfig.pending;
    
    return <Badge className={config.class}>{config.label}</Badge>;
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <Skeleton className="h-8 w-64" />
          </div>
          
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-32 mt-2" />
            </CardHeader>
            <CardContent className="space-y-4">
              {[1, 2, 3, 4].map(i => (
                <Skeleton key={i} className="h-4 w-full" />
              ))}
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  if (isError || !registration) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
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
                    <CardDescription>
                      Created on {format(new Date(registration.created_at), 'PPP')}
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    {getStatusBadge(registration.status)}
                    {getPaymentStatusBadge(registration.payment_status)}
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-medium text-lg">Exam Information</h3>
                  <div className="space-y-3 mt-2">
                    <div className="flex items-start gap-2">
                      <Ticket className="h-4 w-4 mt-0.5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{examSchedule?.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {examSchedule?.exam_type?.code} - {examSchedule?.exam_type?.name_key}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <p className="text-sm">
                        Date: {examSchedule?.date && format(new Date(examSchedule.date), 'PPP')}
                      </p>
                    </div>
                    
                    {registration.room && (
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <p className="text-sm">
                          Location: {registration.room.name}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="font-medium text-lg">Payment Information</h3>
                  <div className="space-y-3 mt-2">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <p className="text-sm text-muted-foreground">Price</p>
                        <p className="font-medium">฿{examSchedule?.price.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Payment Status</p>
                        <p className="font-medium">{registration.payment_status}</p>
                      </div>
                      {registration.payment_method && (
                        <>
                          <div>
                            <p className="text-sm text-muted-foreground">Payment Method</p>
                            <p className="font-medium">{registration.payment_method}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Reference</p>
                            <p className="font-medium">{registration.payment_reference || "N/A"}</p>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
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
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Registration QR Code</CardTitle>
                <CardDescription>
                  Present this code on the exam day
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center justify-center pt-4 pb-6">
                <div className="p-4 bg-white shadow-sm rounded-md">
                  <div className="w-48 h-48 bg-gray-100 flex items-center justify-center">
                    <QrCode className="w-32 h-32 text-gray-300" />
                  </div>
                </div>
                <p className="text-center mt-4 font-mono tracking-wider text-lg">
                  {registration.registration_code}
                </p>
              </CardContent>
            </Card>
            
            {registration.payment_status === "pending" && (
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
            )}
            
            {registration.status === "confirmed" && (
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
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default RegistrationDetail;
