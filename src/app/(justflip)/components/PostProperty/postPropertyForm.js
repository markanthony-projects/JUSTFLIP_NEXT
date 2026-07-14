export const PostPropertyForm = ({ children }) => (
    <div className="col-span-1 md:col-span-2 flex flex-col justify-center">
        <div className="bg-white shadow-xl shadow-slate-100 border border-slate-100 rounded-2xl p-4 md:p-8 space-y-6 w-full max-w-[500px] mx-auto">
            {children}
        </div>
    </div>
);