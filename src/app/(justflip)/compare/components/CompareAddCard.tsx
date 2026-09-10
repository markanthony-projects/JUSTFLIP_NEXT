import React from 'react';
import { AiOutlinePlus } from 'react-icons/ai';

export interface CompareAddCardProps {
    onClick: () => void;
}

export default function CompareAddCard({ onClick }: CompareAddCardProps) {
    return (
        <div
            onClick={onClick}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onClick(); }}
            className="w-[300px] min-w-[300px] md:w-[320px] md:min-w-[320px] lg:w-auto lg:min-w-0 shrink-0 lg:shrink snap-center bg-transparent border-2 border-dashed border-primary/20 rounded-lg flex flex-col items-center justify-center min-h-[400px] cursor-pointer hover:bg-white hover:border-primary/40 hover:shadow-lg transition-all duration-300 group"
            aria-label="Add another property to compare"
        >
            <div className="w-16 h-16 rounded-full bg-[#f6f9fc] flex items-center justify-center text-primary group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-300 mb-4 shadow-sm" aria-hidden="true">
                <AiOutlinePlus size={28} />
            </div>
            <p className="text-primary font-bold text-lg">Add to Compare</p>
            <p className="text-gray-400 text-sm mt-2 text-center px-6 max-w-[250px]">
                Select another property to evaluate features side-by-side
            </p>
        </div>
    );
}
