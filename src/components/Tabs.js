"use client";

import { useEffect, useRef, useState } from "react";

const Tabs = ({
    tabs = [],
    value,
    onChange,
    containerClass = "",
    tabClass = "",
    activeTabClass = "",
    indicatorClass = "",
    height = "h-10",
}) => {
    const tabRefs = useRef([]);
    const [indicatorStyle, setIndicatorStyle] = useState({});

    useEffect(() => {
        const activeIndex = tabs.findIndex((t) => t.value === value);
        const activeTab = tabRefs.current[activeIndex];

        if (activeTab) {
            setIndicatorStyle({
                width: activeTab.offsetWidth + "px",
                left: activeTab.offsetLeft + "px",
            });
        }
    }, [value, tabs]);

    return (
        <div className={`relative flex gap-2 overflow-hidden ${containerClass}`}>
            {/* Indicator */}
            <div
                className={`absolute top-0 left-0 transition-all duration-400 ease-out will-change-transform ${indicatorClass}`}
                style={indicatorStyle}
            />

            {tabs.map((tab, index) => {
                const isActive = value === tab.value;

                return (
                    <button
                        key={tab.value}
                        ref={(el) => (tabRefs.current[index] = el)}
                        role="tab"
                        aria-selected={isActive}
                        onClick={() => onChange(tab.value)}
                        className={`
                            border-none outline-none cursor-pointer relative z-10 flex-1 ${height}
                            transition-colors duration-200
                            ${tabClass}
                            ${isActive ? activeTabClass : ""}
                        `}
                    >
                        {tab.label}
                    </button>
                );
            })}
        </div>
    );
};

export default Tabs;
