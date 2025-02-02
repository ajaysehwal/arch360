import { Skeleton } from "@/components/ui/skeleton"

export function ProjectSkeleton() {
  return (
    <div className="flex flex-col gap-2 p-4 border-b">
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-[120px]" />
        <Skeleton className="h-4 w-[80px]" />
      </div>
      <Skeleton className="h-4 w-[100px]" />
      <Skeleton className="h-3 w-[260px]" />
    </div>
  )
}