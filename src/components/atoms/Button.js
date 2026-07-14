export default function Button({ children, onClick, className = "", ...props }) {
    return (
        <button onClick={onClick} className={`px-3 py-1 text-sm font-medium   rounded-lg ${className}`} {...props} >
            {children}
        </button>
    );
}