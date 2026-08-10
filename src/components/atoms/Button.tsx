import React from "react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children?: React.ReactNode;
    onClick?: React.MouseEventHandler<HTMLButtonElement>;
    className?: string;
}

export default function Button({ children, onClick, className = "", ...props }: ButtonProps) {
    return (
        <button onClick={onClick} className={`px-3 py-1 text-sm font-medium   rounded-lg ${className}`} {...props} >
            {children}
        </button>
    );
}