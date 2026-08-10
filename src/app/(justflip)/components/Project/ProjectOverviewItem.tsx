import React from "react";

interface ProjectOverviewItemProps {
  label: string;
  value: React.ReactNode;
}

export default function ProjectOverviewItem({ label, value }: ProjectOverviewItemProps) {
  return (
      <div className="flex items-start gap-2 p-2 w-full">
        <div className="flex flex-col">
          <span className="text-sm font-semibold">{label}</span>
          <span className="text-sm font-normal">{value}</span>
        </div>
      </div>
  );
}