
import { format } from "date-fns";
import { Calendar, Clock, MapPin, Users } from "lucide-react";
import { ExamSchedule } from "@/types/exams";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface AvailableExamCardProps {
  exam: ExamSchedule;
  onRegister: (examId: string) => void;
}

export function AvailableExamCard({ exam, onRegister }: AvailableExamCardProps) {
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
          <Button onClick={() => onRegister(exam.id)}>
            Register
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
