"use client";

import { motion } from "framer-motion";
import { useWishlistStore } from "@/store/wishlistStore";

export default function WishlistBadge() {
    const { items } = useWishlistStore();
    const wishlistCount = items.length;

    if (wishlistCount === 0) return null;

    return (
        <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center"
        >
            {wishlistCount > 9 ? "9+" : wishlistCount}
        </motion.span>
    );
}
