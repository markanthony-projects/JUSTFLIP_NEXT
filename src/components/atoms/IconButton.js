const IconButton = ({ onClick, icon: Icon, label, bg = "bg-[#002B5B]", ring = "focus:ring-[#002B5B]", }) => {
    return (
        <button onClick={onClick} aria-label={label} className={`group cursor-pointer flex h-11 w-11 items-center justify-center   rounded-full ${bg} shadow-lg   transition-all duration-300 hover:scale-110 active:scale-95  focus:outline-none focus:ring-2 focus:ring-offset-2 ${ring}`}    >
            <Icon className="text-white text-xl transition-transform group-hover:rotate-6" />
        </button>
    );
};

export default IconButton;