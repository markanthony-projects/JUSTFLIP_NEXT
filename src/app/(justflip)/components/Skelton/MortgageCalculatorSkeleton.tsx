import { SkeletonBlock } from "./SkeletonSection";

export function MortgageCalculatorSkeleton() {
    return (
        <div className="w-full rounded-md border border-gray-200 bg-white p-3 sm:p-4 md:p-6">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 md:gap-6 lg:gap-8">
                {/* LEFT */}
                <div className="space-y-4 sm:space-y-5">
                    {/* HEADER */}
                    <div className="flex items-center gap-3 sm:gap-4">
                        <SkeletonBlock className="h-11 w-11 sm:h-[52px] sm:w-[52px] md:h-[60px] md:w-[60px] rounded-full shrink-0" />
                        <div className="space-y-2">
                            <SkeletonBlock className="h-5 sm:h-6 w-40 sm:w-48" />
                            <SkeletonBlock className="h-3 sm:h-4 w-28 sm:w-32" />
                        </div>
                    </div>

                    {/* EMI HERO */}
                    <SkeletonBlock className="h-[90px] sm:h-[104px] md:h-[112px] w-full rounded-2xl" />

                    {/* LOAN INPUT */}
                    <SkeletonBlock className="h-[90px] sm:h-[104px] w-full rounded-2xl" />

                    {/* CONTROLS */}
                    <div className="space-y-4 sm:space-y-5">
                        <SkeletonBlock className="h-12 w-full rounded-md" />
                        <SkeletonBlock className="h-12 w-full rounded-md" />
                        <SkeletonBlock className="h-12 w-full rounded-md" />
                    </div>
                </div>

                {/* RIGHT */}
                <div className="space-y-4 sm:space-y-5">
                    <div className="space-y-2">
                        <SkeletonBlock className="h-5 sm:h-6 w-32" />
                        <SkeletonBlock className="h-3 sm:h-4 w-56 sm:w-64" />
                    </div>

                    {/* CHART + SUMMARY */}
                    <div className="relative flex flex-col items-center gap-5 sm:gap-6">
                        {/* CHART */}
                        <SkeletonBlock className="aspect-square w-full max-w-[240px] sm:max-w-[280px] md:max-w-[340px] rounded-full" />

                        {/* SUMMARY */}
                        <div className="w-full space-y-3 sm:space-y-4">
                            <SkeletonBlock className="h-[46px] sm:h-[52px] w-full rounded-xl" />
                            <SkeletonBlock className="h-[46px] sm:h-[52px] w-full rounded-xl" />
                            <SkeletonBlock className="h-[42px] sm:h-[52px] w-full rounded-xl" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
