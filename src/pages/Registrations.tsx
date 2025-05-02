
import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { useExamSchedules } from "@/hooks/useExams";
import { ExamTabs } from "@/components/registrations/ExamTabs";
import { RegistrationDialog } from "@/components/registrations/RegistrationDialog";

const Registrations = () => {
  const [selectedExamId, setSelectedExamId] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const { data: examSchedules, isLoading } = useExamSchedules({
    status: "active",
  });
  
  const handleRegister = (examId: string) => {
    setSelectedExamId(examId);
    setIsDialogOpen(true);
  };

  const selectedExam = examSchedules?.find(es => es.id === selectedExamId);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Exam Registration</h2>
          <p className="text-muted-foreground">
            Browse available exams and register for your preferred date and time.
          </p>
        </div>

        <ExamTabs 
          examSchedules={examSchedules} 
          isLoading={isLoading} 
          onRegister={handleRegister} 
        />

        <RegistrationDialog
          isOpen={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          selectedExam={selectedExam}
          selectedExamId={selectedExamId}
        />
      </div>
    </DashboardLayout>
  );
};

export default Registrations;
