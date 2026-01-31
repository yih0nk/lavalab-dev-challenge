"use client";

import { motion } from "framer-motion";
import { useCartStore } from "@/store/cartStore";

export default function CartBadge() {
    const { items } = useCartStore();
    const cartCount = items.reduce((total, item) => total + item.quantity, 0);

    if (cartCount === 0) return null;

    return (
        <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-primary text-white text-[10px] font-bold rounded-full flex items-center justify-center"
        >
            {cartCount > 9 ? "9+" : cartCount}
        </motion.span>
    );
}
