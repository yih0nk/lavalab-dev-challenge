"use client";

import { motion } from "framer-motion";

interface TabButtonProps {
    active: boolean;
    onClick: () => void;
    children: React.ReactNode;
}

export default function TabButton({ active, onClick, children }: TabButtonProps) {
    return (
        <motion.button
            onClick={onClick}
            className={`relative px-5 py-2.5 text-xs font-semibold tracking-wide uppercase transition-colors duration-200 cursor-pointer ${active
                    ? "text-white"
                    : "text-neutral-600 hover:text-neutral-900 border border-neutral-300"
                }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
        >
            {active && (
                <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-neutral-900 rounded-sm"
                    initial={false}
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
            )}
            <span className="relative z-10">{children}</span>
        </motion.button>
    );
}