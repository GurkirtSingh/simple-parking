import { Skeleton } from "@/components/ui/skeleton"

export default function Loading(){
    return null
}

export function LoadingPropertyStalls() {
  return (
    <div className="flex w-full flex-col gap-6">
      {/* Tab List Skeleton */}
      <div className="flex space-x-4 border-b pb-2">
        {Array.from({ length: 2 }).map((_, i) => (
          <Skeleton key={i} className="h-8 w-20" />
        ))}
      </div>

      {/* Tab Content Skeletons */}
      {Array.from({ length: 2 }).map((_, levelIdx) => (
        <div key={levelIdx} className="space-y-4">
          {/* Level title */}
          <Skeleton className="h-6 w-40" />

          {/* Stall cards */}
          <div className="flex flex-wrap gap-4">
            {Array.from({ length: 4 }).map((_, cardIdx) => (
              <Skeleton key={cardIdx} className="w-full md:w-52 h-48" />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}