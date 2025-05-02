
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";

interface RegistrationDetailSkeletonProps {
  onBack: () => void;
}

export function RegistrationDetailSkeleton({ onBack }: RegistrationDetailSkeletonProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <Skeleton className="h-8 w-64" />
        </div>
        <Skeleton className="h-10 w-40" />
      </div>
      
      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <Skeleton className="h-6 w-48" />
                  <Skeleton className="h-4 w-32 mt-2" />
                </div>
                <div className="flex gap-2">
                  <Skeleton className="h-6 w-24 rounded-full" />
                  <Skeleton className="h-6 w-28 rounded-full" />
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div>
                <Skeleton className="h-5 w-40 mb-2" />
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <Skeleton className="h-4 w-4 mt-0.5" />
                    <div>
                      <Skeleton className="h-4 w-60" />
                      <Skeleton className="h-3 w-40 mt-1" />
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-4" />
                    <Skeleton className="h-4 w-48" />
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-4" />
                    <Skeleton className="h-4 w-56" />
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <Skeleton className="h-5 w-40 mb-2" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </div>
            </CardContent>
            
            <CardFooter className="border-t flex justify-between">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-4 w-48" />
            </CardFooter>
          </Card>
        </div>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-4 w-56 mt-1" />
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center pt-4 pb-6">
              <div className="p-4 bg-white shadow-sm rounded-md">
                <Skeleton className="h-48 w-48" />
              </div>
              <Skeleton className="h-6 w-32 mt-4" />
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 space-y-4">
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-10 w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
