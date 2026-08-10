import { useEffect, useRef, useState, MutableRefObject } from "react";

export interface UseItemsPerViewOptions {
    itemWidth: number;
    gap?: number;
    min?: number;
    max?: number;
}

export function useItemsPerView({
    itemWidth,
    gap = 0,
    min = 1,
    max = Infinity
}: UseItemsPerViewOptions): { containerRef: MutableRefObject<any>; itemsPerView: number } {
    const containerRef = useRef<HTMLElement | null>(null);
    const [itemsPerView, setItemsPerView] = useState<number>(min);

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
