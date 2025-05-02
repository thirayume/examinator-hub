
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function ExamSkeletonCard() {
  return (
    <Card className="overflow-hidden flex flex-col">
      <CardHeader className="p-4">
        <div className="flex items-start justify-between">
          <div>
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-4 w-20 mt-2" />
          </div>
          <Skeleton className="h-6 w-16 rounded-full" />
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0 flex-1">
        <div className="space-y-3">
          <div className="flex items-center">
            <Skeleton className="h-4 w-4 mr-2 rounded-full" />
            <Skeleton className="h-4 w-full" />
          </div>
          <div className="flex items-center">
            <Skeleton className="h-4 w-4 mr-2 rounded-full" />
            <Skeleton className="h-4 w-full" />
          </div>
          <div className="flex items-center">
            <Skeleton className="h-4 w-4 mr-2 rounded-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
          <div className="flex items-center">
            <Skeleton className="h-4 w-4 mr-2 rounded-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </div>
      </CardContent>
      <CardFooter className="border-t p-4">
        <div className="flex items-center justify-between w-full">
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-10 w-28" />
        </div>
      </CardFooter>
    </Card>
  );
}
