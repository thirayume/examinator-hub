
import { DashboardLayout } from "@/components/DashboardLayout";
import { useState } from "react";
import { useExamSchedules } from "@/hooks/useExams";
import { useCreateRegistration } from "@/hooks/useRegistrations";
import { useVenueRooms } from "@/hooks/useVenues";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin, Users } from "lucide-react";
import { format } from "date-fns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

const Registrations = () => {
  const [selectedExamId, setSelectedExamId] = useState<string | null>(null);
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [selectedSeatId, setSelectedSeatId] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { data: examSchedules, isLoading } = useExamSchedules({
    status: "active",
  });
  const { data: rooms } = useVenueRooms(
    examSchedules?.find(es => es.id === selectedExamId)?.exam_type?.id
  );
  const { toast } = useToast();
  const createRegistration = useCreateRegistration();
  const navigate = useNavigate();
  
  const handleRegister = (examId: string) => {
    setSelectedExamId(examId);
    setIsDialogOpen(true);
  };

  const handleConfirmRegistration = async () => {
    if (!selectedExamId) return;
    
    try {
      await createRegistration.mutateAsync({
        exam_schedule_id: selectedExamId,
        room_id: selectedRoomId,
        seat_id: selectedSeatId
      });
      
      toast({
        title: "Registration successful",
        description: "You have successfully registered for the exam.",
      });
      
      setIsDialogOpen(false);
      navigate("/dashboard?tab=registrations");
    } catch (error) {
      console.error("Registration error:", error);
      toast({
        title: "Registration failed",
        description: "There was an error processing your registration. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const statusClasses = {
      active: "bg-green-100 text-green-800",
      draft: "bg-gray-100 text-gray-800",
      cancelled: "bg-red-100 text-red-800",
      completed: "bg-blue-100 text-blue-800"
    };
    
    const statusClass = statusClasses[status as keyof typeof statusClasses] || statusClasses.draft;
    
    return (
      <Badge className={statusClass}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Exam Registration</h2>
          <p className="text-muted-foreground">
            Browse available exams and register for your preferred date and time.
          </p>
        </div>

        <Tabs defaultValue="available" className="space-y-4">
          <TabsList>
            <TabsTrigger value="available">Available Exams</TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming Exams</TabsTrigger>
          </TabsList>
          
          <TabsContent value="available" className="space-y-4">
            {isLoading && (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="overflow-hidden">
                    <CardHeader className="p-4">
                      <Skeleton className="h-5 w-40" />
                      <Skeleton className="h-4 w-20 mt-2" />
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-3/4" />
                      </div>
                    </CardContent>
                    <CardFooter className="p-4 border-t">
                      <Skeleton className="h-10 w-28" />
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}

            {!isLoading && (!examSchedules || examSchedules.length === 0) && (
              <Card className="p-8 text-center">
                <p className="text-muted-foreground">No available exams found</p>
              </Card>
            )}

            {examSchedules && examSchedules.length > 0 && (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {examSchedules.map((exam) => (
                  <Card key={exam.id} className="overflow-hidden flex flex-col">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-xl">{exam.title}</CardTitle>
                          <CardDescription>
                            {exam.exam_type?.code} - {exam.exam_type?.name_key}
                          </CardDescription>
                        </div>
                        {getStatusBadge(exam.status)}
                      </div>
                    </CardHeader>
                    <CardContent className="flex-1">
                      <div className="space-y-3 text-sm">
                        <div className="flex items-center text-muted-foreground">
                          <Calendar className="w-4 h-4 mr-2" />
                          Exam Date: {format(new Date(exam.date), 'PPP')}
                        </div>
                        <div className="flex items-center text-muted-foreground">
                          <Clock className="w-4 h-4 mr-2" />
                          Registration Deadline: {format(new Date(exam.registration_deadline), 'PPP')}
                        </div>
                        <div className="flex items-center text-muted-foreground">
                          <MapPin className="w-4 h-4 mr-2" />
                          Location: Various Test Centers
                        </div>
                        <div className="flex items-center text-muted-foreground">
                          <Users className="w-4 h-4 mr-2" />
                          Available Seats: {exam.max_candidates || 'Unlimited'}
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="border-t pt-4">
                      <div className="flex items-center justify-between w-full">
                        <p className="text-lg font-semibold">
                          ฿{exam.price.toLocaleString()}
                        </p>
                        <Button onClick={() => handleRegister(exam.id)}>
                          Register
                        </Button>
                      </div>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="upcoming" className="space-y-4">
            <Card className="p-8 text-center">
              <p className="text-muted-foreground">Coming soon - Upcoming exam schedule</p>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Registration Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Confirm Registration</DialogTitle>
              <DialogDescription>
                Please confirm your exam registration. You will need to complete payment to finalize your registration.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <h4 className="font-medium">Exam Details</h4>
                <p className="text-sm text-muted-foreground">
                  {examSchedules?.find(es => es.id === selectedExamId)?.title}
                </p>
                <p className="text-sm text-muted-foreground">
                  Date: {examSchedules?.find(es => es.id === selectedExamId)?.date && 
                  format(new Date(examSchedules?.find(es => es.id === selectedExamId)?.date || ''), 'PPP')}
                </p>
                <p className="text-sm font-semibold">
                  Price: ฿{examSchedules?.find(es => es.id === selectedExamId)?.price.toLocaleString()}
                </p>
              </div>

              {/* In future updates, add room and seat selection */}
            </div>
            
            <DialogFooter className="sm:justify-between">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleConfirmRegistration} disabled={createRegistration.isPending}>
                {createRegistration.isPending ? "Processing..." : "Confirm & Pay"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default Registrations;
