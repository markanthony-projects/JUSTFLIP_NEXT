import { TABS } from "./tabs";
import { useEffect, useRef, useState } from "react";

export interface TabsSectionProps {
    value: string;
    onChange: (value: string) => void;
    containerClass?: string;
    tabClass?: string;
    activeTabClass?: string;
    indicatorClass?: string;
    height?: string;
}

const TabsSection = ({
    value,
    onChange,
    containerClass = "",
    tabClass = "",
    activeTabClass = "",
    indicatorClass = "",
    height = "h-10",
}: TabsSectionProps) => {
    const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
    const [indicatorStyle, setIndicatorStyle] = useState<React.CSSProperties>({});

    useEffect(() => {
        const activeIndex = TABS.findIndex((t) => t.value === value);
        const activeTab = tabRefs.current[activeIndex];

        if (activeTab) {
            setIndicatorStyle({
                width: activeTab.offsetWidth + "px",
                left: activeTab.offsetLeft + "px",
            });
        }
    }, [value, TABS]);
    
    return (
        <div className={`relative flex overflow-hidden ${containerClass}`}>
            {/* Indicator */}
            <div
                className={`absolute top-0 left-0 transition-all duration-300 ease-out will-change-transform ${indicatorClass}`}
                style={indicatorStyle}
            />
            {TABS?.map((tab, index) => {
                const isActive = value === tab?.value;
                
                return (
                    <button
                        key={tab.value}
                        ref={(el) => { tabRefs.current[index] = el; }}
                        role="tab"
                        aria-selected={isActive}
                        onClick={() => onChange(tab?.value)}
                        className={`
                            cursor-pointer relative z-10 flex-1 ${height}
                            text-sm font-medium transition-colors duration-200
                            ${tabClass}
                            ${isActive ? activeTabClass : ""}
                        `}
                    >
                        {tab?.label}
                    </button>
                );
            })}
        </div>
    );
};

export default TabsSection;