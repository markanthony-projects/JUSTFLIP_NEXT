import { useEffect, useRef, useState } from "react";

export function useItemsPerView({
    itemWidth,
    gap = 0,
    min = 1,
    max = Infinity
}) {
    const containerRef = useRef(null);
    const [itemsPerView, setItemsPerView] = useState(min);

    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;

        const calculate = () => {
            const width = el.offsetWidth;
            if (!width) return;

            const count = width / (itemWidth + gap);
            const next = Math.min(max, Math.max(min, count));

            setItemsPerView(prev => (prev === next ? prev : next));
        };

        calculate();

        const ro = new ResizeObserver(calculate);
        ro.observe(el);

        return () => ro.disconnect();
    }, [itemWidth, gap, min, max]);

    return { containerRef, itemsPerView };
}
