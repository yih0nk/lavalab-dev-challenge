"use client";

/*
 * PRODUCT GRID COMPONENT
 *
 * Displays products in a tabbed grid layout:
 * - "New Arrivals" tab (default)
 * - "What's Trending" tab
 *
 * Layout: 2 columns on mobile, 4 columns on desktop
 * Shows 8 products per tab (2 rows of 4)
 *
 * Uses Framer Motion for smooth tab transitions and staggered product animations.
 */

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ProductCard from "@/components/ui/ProductCard";
import { products } from "@/data/products";

type TabType = "new-arrivals" | "trending";

export default function ProductGrid() {
    const [activeTab, setActiveTab] = useState<TabType>("new-arrivals");

    const filteredProducts = products.filter(
        (product) => product.category === activeTab
    );

    return (
        <section className="py-10 lg:py-16 bg-white">
            <div className="container-main">
                {/* Tab Buttons - Pill shaped */}
                <div className="flex items-center gap-[36px] mb-18 lg:mb-20">
                    <button
                        onClick={() => setActiveTab("trending")}
                        className="px-[33px] py-[16px] text-[20px] font-bold tracking-[0.05em] leading-none uppercase transition-all duration-200 cursor-pointer rounded-[100px] bg-[#77794E] text-white border-4 border-[#9FA16D] hover:bg-white hover:text-[#9FA16D]"
                    >
                        What&apos;s Trending
                    </button>
                    <button
                        onClick={() => setActiveTab("new-arrivals")}
                        className="px-[33px] py-[16px] text-[20px] font-bold tracking-[0.05em] leading-none uppercase transition-all duration-200 cursor-pointer rounded-[100px] bg-[#4A4C6C] text-white border-4 border-[#7C7EA1] hover:bg-white hover:text-[#7C7EA1]"
                    >
                        New Arrivals
                    </button>
                </div>

                {/* Product Grid - 4 columns on desktop, 2 on mobile */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-10"
                    >
                        {filteredProducts.slice(0, 8).map((product, index) => (
                            <motion.div
                                key={product.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.2, delay: index * 0.03 }}
                            >
                                <ProductCard product={product} />
                            </motion.div>
                        ))}
                    </motion.div>
                </AnimatePresence>

                {/* Divider line */}
                <div className="mt-36 lg:mt-40 border-t border-[#1A1A1A] opacity-33" />
            </div>
        </section>
    );
}