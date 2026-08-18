import { SkeletonBlock } from "./SkeletonSection";

export default function DeveloperCardSkeleton() {
  return (
    <div className="w-full relative h-[260px] rounded-2xl overflow-hidden bg-gray-200 animate-pulse shadow-md">
        {/* Glassmorphism panel skeleton at the bottom */}
        <div className="absolute bottom-3 left-3 right-3 bg-white/40 p-3 rounded-xl flex items-center justify-between">
            
            <div className="flex items-center gap-3 overflow-hidden w-full">
                {/* Logo Skeleton */}
                <div className="w-12 h-12 shrink-0 rounded-full bg-white/60"></div>

                {/* Text Skeletons */}
                <div className="flex flex-col gap-2 w-full pr-4">
                    <div className="h-4 w-3/4 bg-white/60 rounded"></div>
                    <div className="h-3 w-1/2 bg-white/50 rounded"></div>
                </div>
            </div>

            {/* Arrow Skeleton */}
            <div className="w-8 h-8 rounded-full bg-white/50 shrink-0"></div>
        </div>
    </div>
  );
}