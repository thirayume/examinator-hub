
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { ExamSchedule } from "@/types/exams";
import { ExamSkeletonCard } from "./ExamSkeletonCard";
import { AvailableExamCard } from "./AvailableExamCard";

interface ExamTabsProps {
  examSchedules: ExamSchedule[] | undefined;
  isLoading: boolean;
  onRegister: (examId: string) => void;
}

export function ExamTabs({ examSchedules, isLoading, onRegister }: ExamTabsProps) {
  return (
    <Tabs defaultValue="available" className="space-y-4">
      <TabsList>
        <TabsTrigger value="available">Available Exams</TabsTrigger>
        <TabsTrigger value="upcoming">Upcoming Exams</TabsTrigger>
      </TabsList>
      
      <TabsContent value="available" className="space-y-4">
        {isLoading && (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <ExamSkeletonCard key={i} />
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
              <AvailableExamCard 
                key={exam.id}
                exam={exam}
                onRegister={onRegister}
              />
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
  );
}
