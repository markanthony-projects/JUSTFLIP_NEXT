import React from 'react';
import { AiOutlinePlus } from 'react-icons/ai';

export default function CompareEmptyState({ onAddClick }) {
    return (
        <section className="flex flex-col items-center justify-center p-12 bg-white rounded-3xl border border-gray-100 shadow-sm text-center min-h-[400px]">
            <div className="w-20 h-20 bg-[#f6f9fc] rounded-full flex items-center justify-center mb-4 text-[#002B5B]">
                <AiOutlinePlus size={32} />
            </div>
            <h2 className="text-xl font-bold text-[#002B5B] mb-2">No properties to compare</h2>
            <p className="text-gray-500 mb-6 max-w-md">
                Add properties to your comparison list to evaluate them side-by-side and find your perfect match.
            </p>
            <button 
                onClick={onAddClick} 
                className="bg-[#002B5B] text-white px-6 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
            >
                Add Property
            </button>
        </section>
    );
}
