export const PostPropertyHeader = ({ title, subtitle }) => (
    <div className="space-y-3 mb-8">
        <h1 className="text-2xl lg:text-[28px] font-extrabold text-[#032B5B] tracking-tight">{title}</h1>
        <p className="text-[13px] lg:text-sm font-medium text-slate-500 leading-relaxed pr-4">{subtitle}</p>
    </div>
);