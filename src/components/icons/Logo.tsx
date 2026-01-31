"use client";

interface LogoProps {
    className?: string;
    color?: string;
}

export default function Logo({ className = "", color = "currentColor" }: LogoProps) {
    return (
        <svg
            viewBox="0 0 40 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
        >
            <path
                d="M8 28C8 28 12 32 20 32C28 32 32 28 32 24C32 20 28 18 24 18C20 18 16 16 16 12C16 8 20 8 24 8C28 8 32 10 32 10"
                stroke={color}
                strokeWidth="3"
                strokeLinecap="round"
                fill="none"
            />
            <circle cx="10" cy="12" r="2" fill={color} />
        </svg>
    );
}