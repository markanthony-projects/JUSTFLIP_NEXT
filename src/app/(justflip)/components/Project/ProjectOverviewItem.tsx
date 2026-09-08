import React from "react";

interface ProjectOverviewItemProps {
    icon?: React.ReactNode;
    label: string;
    value: React.ReactNode;
    helperText?: string;
}

export default function ProjectOverviewItem({
    icon,
    label,
    value,
    helperText,
}: ProjectOverviewItemProps) {
    return (
        <div className="flex items-center sm:items-start gap-3 sm:gap-3.5 p-3 sm:p-4 rounded-lg bg-white border border-gray-200/80 hover:border-gray-300 shadow-[0_1px_3px_rgba(0,0,0,0.03)] transition-all duration-200">
            {icon && (
                <div className="shrink-0 w-10 h-10 sm:w-11 sm:h-11 rounded-lg flex items-center justify-center bg-primary/5 text-primary border border-primary/10">
                    {icon}
                </div>
            )}
            <div className="flex flex-col min-w-0 flex-1 justify-center">
                <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-gray-500 mb-0.5 truncate">
                    {label}
                </span>
                <span className="text-sm sm:text-base font-bold text-gray-900 leading-snug break-words">
                    {value || "-"}
                </span>
                {helperText && (
                    <span className="text-[11px] text-gray-400 mt-0.5 truncate">
                        {helperText}
                    </span>
                )}
            </div>
        </div>
    );
}