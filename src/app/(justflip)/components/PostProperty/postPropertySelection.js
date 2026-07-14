export const PostPropertySelection = ({ label, options, value, onChange }) => (
    <div className="space-y-3">
        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">{label}</p>
        <div className="flex flex-wrap gap-3">
            {options.map((option) => {
                const isSelected = value === option.value;
                return (
                    <button
                        key={option.value}
                        onClick={() => onChange(option.value)}
                        className={`flex items-center justify-center gap-2 px-4 py-3 text-sm rounded-xl font-bold transition-all duration-200 border flex-1 min-w-[130px] ${isSelected
                                ? "bg-[#032B5B] text-white border-[#032B5B] shadow-md shadow-[#032B5B]/20"
                                : "bg-white text-slate-600 border-slate-200 hover:border-[#032B5B]"
                            }`}
                    >
                        <span className={`text-[1.1rem] ${isSelected ? "text-white" : "text-[#032B5B]"}`}>
                            {option.icon}
                        </span>
                        {option.label}
                    </button>
                );
            })}
        </div>
    </div>
);