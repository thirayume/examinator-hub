
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function ExamSkeletonCard() {
  return (
    <Card className="overflow-hidden">
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
  );
}
