import { MdKeyboardDoubleArrowRight } from "react-icons/md";

export interface ToggleButtonProps {
    expanded: boolean;
    remainingCount: number;
    onToggle: () => void;
}

export default function ToggleButton({ expanded, remainingCount, onToggle }: ToggleButtonProps) {
    if (!expanded && remainingCount <= 0) return null;

    return (
        <button type="button" onClick={onToggle}
            aria-expanded={expanded}
            className="text-[#002B5B] text-xs font-medium flex items-center gap-1 hover:underline transition">
            {expanded ? ("Hide") : (<> View {remainingCount > 0 ? `+${remainingCount}` : "More"} <MdKeyboardDoubleArrowRight /> </>)}
        </button>
    );
}