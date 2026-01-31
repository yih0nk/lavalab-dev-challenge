"use client";

/*
 * PRODUCT CARD COMPONENT
 *
 * Displays a single product in the grid with:
 * - 217.5 x 217.5 image container with grey background
 * - Heart/favorite icon in top-right for wishlist
 * - Color swatches (clickable to change selected color)
 * - Hover reveal "Add to Cart" button
 * - Product name (Teko font)
 * - Price (with original price strikethrough if on sale)
 * - Star rating with review count
 *
 * Clicking the card navigates to the product detail page.
 */

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Heart } from "lucide-react";
import { Product } from "@/types";
import { useCartStore } from "@/store/cartStore";

interface ProductCardProps {
    product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
    const [isHovered, setIsHovered] = useState(false);
    const [selectedColor, setSelectedColor] = useState(product.colors[0]);
    const [isFavorite, setIsFavorite] = useState(false);
    const addToCart = useCartStore((state) => state.addToCart);

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        addToCart(product, selectedColor);
    };

    const handleColorSelect = (e: React.MouseEvent, color: string) => {
        e.preventDefault();
        e.stopPropagation();
        setSelectedColor(color);
    };

    const handleFavoriteToggle = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsFavorite(!isFavorite);
        // TODO: Connect to wishlist store/backend
    };

    // Render star rating
    const renderStars = (rating: number) => {
        return Array.from({ length: 5 }, (_, i) => (
            <Star
                key={i}
                size={12}
                className={`${
                    i < Math.floor(rating)
                        ? "fill-amber-400 text-amber-400"
                        : i < rating
                        ? "fill-amber-400/50 text-amber-400"
                        : "text-neutral-300"
                }`}
            />
        ));
    };

    return (
        <Link href={`/product/${product.id}`} className="block group">
            <div
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                {/* Product Image Container - 217.5 x 217.5 with grey background */}
                <div className="relative w-[217.5px] h-[217.5px] bg-[#F5F5F5] overflow-hidden mb-3">
                    {/* Discount Badge - top left (only for sale items) */}
                    {product.originalPrice && (
                        <div className="absolute top-3 left-3 z-10 bg-[#E74C3C] text-white text-xs font-medium px-2 py-1 rounded">
                            -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                        </div>
                    )}

                    {/* Favorite/Wishlist Heart - top right */}
                    <button
                        onClick={handleFavoriteToggle}
                        className="absolute top-3 right-3 z-10 p-1 cursor-pointer"
                        aria-label={isFavorite ? "Remove from wishlist" : "Add to wishlist"}
                    >
                        <Heart
                            size={20}
                            className={`transition-colors duration-200 ${
                                isFavorite
                                    ? "fill-red-500 text-red-500"
                                    : "text-neutral-400 hover:text-neutral-600"
                            }`}
                        />
                    </button>

                    {/* Product Image */}
                    <div className="relative w-full h-full flex items-center justify-center p-4">
                        <Image
                            src={product.image}
                            alt={product.name}
                            width={217}
                            height={217}
                            className="object-contain transition-transform duration-300 group-hover:scale-105"
                        />
                    </div>

                    {/* Hover Add to Cart Button */}
                    <AnimatePresence>
                        {isHovered && (
                            <motion.div
                                initial={{ opacity: 0, y: 5 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 5 }}
                                transition={{ duration: 0.15 }}
                                className="absolute bottom-0 left-0 right-0"
                            >
                                <button
                                    onClick={handleAddToCart}
                                    className="w-full bg-[#1A1A1A] hover:bg-[#2D2D2D] text-white py-3 text-sm font-medium tracking-wide transition-colors duration-200 cursor-pointer"
                                >
                                    Add To Cart
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Product Info */}
                <div className="space-y-1 w-[217.5px]">
                    {/* Product Name */}
                    <h3 className="text-sm font-medium text-[#1A1A1A] leading-tight">
                        {product.name}
                    </h3>

                    {/* Price */}
                    <div className="flex items-center gap-2">
                        <span className={`text-sm font-semibold ${product.originalPrice ? "text-[#E74C3C]" : "text-[#1A1A1A]"}`}>
                            ${product.price}
                        </span>
                        {product.originalPrice && (
                            <span className="text-sm text-neutral-400 line-through">
                                ${product.originalPrice}
                            </span>
                        )}
                    </div>

                    {/* Rating */}
                    <div className="flex items-center gap-1.5">
                        <div className="flex items-center gap-0.5">{renderStars(product.rating)}</div>
                        <span className="text-xs text-neutral-500">({product.reviewCount})</span>
                    </div>
                </div>
            </div>
        </Link>
    );
}