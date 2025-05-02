
import { DashboardLayout } from "@/components/DashboardLayout";
import { useAuth } from "@/hooks/useAuth";
import { useUserRegistrations } from "@/hooks/useRegistrations";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin, Ticket } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { useNavigate, useLocation } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";

const Dashboard = () => {
  const { user } = useAuth();
  const { data: registrations, isLoading } = useUserRegistrations();
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const defaultTab = searchParams.get("tab") || "overview";

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

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">
            Welcome back{user?.user_metadata?.name ? `, ${user.user_metadata.name}` : ''}!
          </p>
        </div>

        <Tabs defaultValue={defaultTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="registrations">My Registrations</TabsTrigger>
            <TabsTrigger value="results">Exam Results</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    Active Registrations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {isLoading 
                      ? <Skeleton className="h-8 w-12" /> 
                      : registrations?.filter(r => r.status !== "cancelled").length || 0}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="ghost" className="w-full" onClick={() => navigate("/dashboard?tab=registrations")}>
                    View All
                  </Button>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    Upcoming Exams
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {isLoading 
                      ? <Skeleton className="h-8 w-12" /> 
                      : registrations?.filter(r => 
                          r.status !== "cancelled" && 
                          r.exam_schedule && 
                          new Date(r.exam_schedule.date) > new Date()
                        ).length || 0}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="ghost" className="w-full" onClick={() => navigate("/registrations")}>
                    Register for Exams
                  </Button>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    Completed Exams
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {isLoading 
                      ? <Skeleton className="h-8 w-12" /> 
                      : registrations?.filter(r => 
                          r.exam_schedule && 
                          new Date(r.exam_schedule.date) < new Date()
                        ).length || 0}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="ghost" className="w-full" onClick={() => navigate("/dashboard?tab=results")}>
                    View Results
                  </Button>
                </CardFooter>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>
                  Your recent registrations and exams
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {isLoading && (
                  Array(3).fill(0).map((_, i) => (
                    <div key={i} className="flex items-center gap-4">
                      <Skeleton className="h-12 w-12 rounded-full" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-[200px]" />
                        <Skeleton className="h-4 w-[150px]" />
                      </div>
                    </div>
                  ))
                )}
                
                {!isLoading && (!registrations || registrations.length === 0) && (
                  <p className="text-muted-foreground text-center py-4">
                    No recent activity found
                  </p>
                )}
                
                {!isLoading && registrations && registrations.slice(0, 5).map(reg => (
                  <div key={reg.id} className="flex items-start justify-between border-b pb-4 last:border-0">
                    <div className="flex items-start gap-4">
                      <div className="p-2 bg-primary/10 rounded-full">
                        <Ticket className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{reg.exam_schedule?.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {reg.exam_schedule?.date && format(new Date(reg.exam_schedule.date), 'PPP')}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {getStatusBadge(reg.status)}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="registrations" className="space-y-4">
            {isLoading && (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3].map(i => (
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
            
            {!isLoading && (!registrations || registrations.length === 0) && (
              <Card className="p-8 text-center">
                <div className="space-y-4">
                  <div className="mx-auto bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center">
                    <Ticket className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-medium">No registrations found</h3>
                  <p className="text-muted-foreground">
                    You haven't registered for any exams yet.
                  </p>
                  <Button onClick={() => navigate("/registrations")}>
                    Browse Available Exams
                  </Button>
                </div>
              </Card>
            )}
            
            {!isLoading && registrations && registrations.length > 0 && (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {registrations.map((registration) => (
                  <Card key={registration.id} className="overflow-hidden flex flex-col">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-xl">
                            {registration.exam_schedule?.title || "Untitled Exam"}
                          </CardTitle>
                          <CardDescription>
                            {registration.exam_schedule?.exam_type?.code || "Unknown Type"}
                          </CardDescription>
                        </div>
                        <div className="flex flex-col gap-2">
                          {getStatusBadge(registration.status)}
                          {getPaymentStatusBadge(registration.payment_status)}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="flex-1">
                      <div className="space-y-3 text-sm">
                        <div className="flex items-center text-muted-foreground">
                          <Calendar className="w-4 h-4 mr-2" />
                          {registration.exam_schedule?.date 
                            ? format(new Date(registration.exam_schedule.date), 'PPP')
                            : "Date not set"}
                        </div>
                        
                        {registration.room && (
                          <div className="flex items-center text-muted-foreground">
                            <MapPin className="w-4 h-4 mr-2" />
                            {registration.room.name}
                          </div>
                        )}
                        
                        <div className="flex items-center text-muted-foreground">
                          <Clock className="w-4 h-4 mr-2" />
                          Registered: {format(new Date(registration.created_at), 'PP')}
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="border-t pt-4">
                      <Button 
                        className="w-full" 
                        variant={registration.status === "cancelled" ? "outline" : "default"}
                        onClick={() => navigate(`/registrations/${registration.id}`)}
                      >
                        View Details
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
            
            <div className="flex justify-center mt-4">
              <Button onClick={() => navigate("/registrations")}>
                Register for More Exams
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="results" className="space-y-4">
            <Card className="p-8 text-center">
              <div className="space-y-4">
                <div className="mx-auto bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center">
                  <Ticket className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-medium">No exam results yet</h3>
                <p className="text-muted-foreground">
                  Your exam results will appear here once they are available.
                </p>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
