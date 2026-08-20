interface SummaryCardProps {
  label: string;
  value: string | number | undefined;
  dotClass: string;
  borderClass?: string;
}

export default function SummaryCard({ label, value, dotClass, borderClass = "border-gray-200" }: SummaryCardProps) {
  return (
    <div className={`flex items-center justify-between rounded-xl border ${borderClass} bg-white p-3 sm:p-4 shadow-sm`}>
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        <span className={`h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full shrink-0 ${dotClass}`} />
        <span className="truncate text-xs sm:text-sm font-medium text-gray-600">{label}</span>
      </div>
      <span className="ml-3 text-xs sm:text-sm md:text-base font-semibold text-gray-900 break-all text-right">
        ₹ {Number(value || 0).toLocaleString("en-IN")}
      </span>
    </div>
  );
}