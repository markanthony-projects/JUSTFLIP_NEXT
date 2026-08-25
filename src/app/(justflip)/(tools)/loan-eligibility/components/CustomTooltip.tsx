const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    return (
      <div className="rounded-lg bg-[#0F172A] px-3.5 py-2 text-xs sm:text-sm font-semibold text-white shadow-xl border border-slate-700/50">
        {data.name} : ₹ {Number(data.value).toLocaleString("en-IN")}
      </div>
    );
  }
  return null;
};

export default CustomTooltip