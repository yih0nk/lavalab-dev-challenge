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
                <div className="flex items-center gap-3 mb-8 lg:mb-10">
                    <button
                        onClick={() => setActiveTab("new-arrivals")}
                        className={`px-6 py-2.5 text-sm font-medium tracking-wide uppercase transition-all duration-200 cursor-pointer rounded-full ${
                            activeTab === "new-arrivals"
                                ? "bg-[#4A4C6C] text-white"
                                : "bg-white text-[#4A4C6C] border border-[#4A4C6C] hover:bg-gray-50"
                        }`}
                    >
                        New Arrivals
                    </button>
                    <button
                        onClick={() => setActiveTab("trending")}
                        className={`px-6 py-2.5 text-sm font-medium tracking-wide uppercase transition-all duration-200 cursor-pointer rounded-full ${
                            activeTab === "trending"
                                ? "bg-[#8B8B4B] text-white"
                                : "bg-white text-[#8B8B4B] border border-[#8B8B4B] hover:bg-gray-50"
                        }`}
                    >
                        What&apos;s Trending
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
                        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6"
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
            </div>
        </section>
    );
}