
import { Calendar, MapPin, Ticket } from "lucide-react";
import { format } from "date-fns";
import { ExamSchedule } from "@/types/exams";
import { VenueRoom } from "@/types/venues";

interface ExamInformationProps {
  examSchedule?: ExamSchedule;
  room?: VenueRoom;
}

export function ExamInformation({ examSchedule, room }: ExamInformationProps) {
  if (!examSchedule) return null;
  
  return (
    <div>
      <h3 className="font-medium text-lg">Exam Information</h3>
      <div className="space-y-3 mt-2">
        <div className="flex items-start gap-2">
          <Ticket className="h-4 w-4 mt-0.5 text-muted-foreground" />
          <div>
            <p className="font-medium">{examSchedule.title}</p>
            <p className="text-sm text-muted-foreground">
              {examSchedule.exam_type?.code} - {examSchedule.exam_type?.name_key}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <p className="text-sm">
            Date: {examSchedule.date && format(new Date(examSchedule.date), 'PPP')}
          </p>
        </div>
        
        {room && (
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <p className="text-sm">
              Location: {room.name}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
