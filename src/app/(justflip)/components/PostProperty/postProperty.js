export const PostProperty = ({ children }) => {
    return (
        <div className="px-0  w-full">
            <div className="grid grid-cols-1  lg:grid-cols-5 gap-4 md:gap-8 py-8">
                {children}
            </div>
        </div>
    );
};
