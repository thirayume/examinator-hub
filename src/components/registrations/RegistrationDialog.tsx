
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { ExamSchedule } from "@/types/exams";
import { useCreateRegistration } from "@/hooks/useRegistrations";
import { useVenueRooms } from "@/hooks/useVenues";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface RegistrationDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedExam: ExamSchedule | undefined;
  selectedExamId: string | null;
}

export function RegistrationDialog({ 
  isOpen, 
  onOpenChange, 
  selectedExam, 
  selectedExamId 
}: RegistrationDialogProps) {
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [selectedSeatId, setSelectedSeatId] = useState<string | null>(null);
  const { data: rooms } = useVenueRooms(selectedExam?.exam_type?.id);
  const { toast } = useToast();
  const createRegistration = useCreateRegistration();
  const navigate = useNavigate();

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
      
      onOpenChange(false);
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

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
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
              {selectedExam?.title}
            </p>
            <p className="text-sm text-muted-foreground">
              Date: {selectedExam?.date && 
              format(new Date(selectedExam?.date || ''), 'PPP')}
            </p>
            <p className="text-sm font-semibold">
              Price: ฿{selectedExam?.price.toLocaleString()}
            </p>
          </div>

          {/* In future updates, add room and seat selection */}
        </div>
        
        <DialogFooter className="sm:justify-between">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleConfirmRegistration} disabled={createRegistration.isPending}>
            {createRegistration.isPending ? "Processing..." : "Confirm & Pay"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
