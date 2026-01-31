"use client";

import { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "outline";
    size?: "sm" | "md" | "lg";
    children: ReactNode;
}

export default function Button({
    variant = "primary",
    size = "md",
    children,
    className = "",
    ...props
}: ButtonProps) {
    const baseStyles =
        "font-medium transition-all duration-200 rounded-sm inline-flex items-center justify-center cursor-pointer hover:scale-[1.02] active:scale-[0.98]";

    const variants = {
        primary: "bg-neutral-900 text-white hover:bg-neutral-800",
        secondary: "bg-amber-500 text-white hover:bg-amber-600",
        outline:
            "border-2 border-neutral-900 text-neutral-900 hover:bg-neutral-900 hover:text-white",
    };

    const sizes = {
        sm: "px-4 py-2 text-xs",
        md: "px-6 py-2.5 text-sm",
        lg: "px-8 py-3 text-base",
    };

    return (
        <button
            className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
}