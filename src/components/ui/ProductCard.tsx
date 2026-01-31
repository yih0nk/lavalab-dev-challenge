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

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Heart } from "lucide-react";
import { Product } from "@/types";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";
import { useAuth } from "@/hooks/useAuth";
import { useAuthModal } from "@/hooks/useAuthModal";
import { useRealtimeStock } from "@/hooks/useRealtimeStock";

interface ProductCardProps {
    product: Product;
    showStockBadge?: boolean;
}

export default function ProductCard({ product, showStockBadge = true }: ProductCardProps) {
    const [isHovered, setIsHovered] = useState(false);
    const [selectedColor, setSelectedColor] = useState(product.colors[0]);
    const [isFavorite, setIsFavorite] = useState(false);
    const addToCart = useCartStore((state) => state.addToCart);
    const { addToWishlist, removeFromWishlist } = useWishlistStore();
    const wishlistItems = useWishlistStore((state) => state.items);
    const { isAuthenticated } = useAuth();
    const { showLogin } = useAuthModal();
    const { getStock, isLowStock, isOutOfStock } = useRealtimeStock({
        productIds: [product.id],
    });
    const stock = getStock(product.id);
    const lowStock = isLowStock(product.id);
    const outOfStock = isOutOfStock(product.id);

    // Helper to normalize product ID for comparison
    const normalizeProductId = (id: string): string => {
        if (id.includes("-")) {
            const lastSegment = id.split("-").pop() || "";
            return String(parseInt(lastSegment, 10));
        }
        return id;
    };

    // Sync favorite state with wishlist store (handles hydration)
    useEffect(() => {
        const normalizedProductId = normalizeProductId(product.id);
        const isInWishlist = wishlistItems.some(
            (item) => normalizeProductId(item.id) === normalizedProductId
        );
        setIsFavorite(isInWishlist);
    }, [wishlistItems, product.id]);

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        addToCart(product, selectedColor);
    };

    const handleFavoriteToggle = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!isAuthenticated) {
            showLogin();
            return;
        }

        if (isFavorite) {
            await removeFromWishlist(product.id);
        } else {
            await addToWishlist(product);
        }
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
                className="w-full"
            >
                {/* Product Image Container - fluid, keeps square aspect */}
                <div className="relative w-full aspect-square bg-[#F5F5F5] overflow-hidden mb-3">
                    {/* Badges - top left */}
                    <div className="absolute top-3 left-3 z-10 flex flex-col gap-1">
                        {/* Discount Badge */}
                        {product.originalPrice && (
                            <div className="bg-[#E74C3C] text-white text-xs font-medium px-2 py-1 rounded">
                                -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                            </div>
                        )}
                        {/* Stock Badge */}
                        {showStockBadge && lowStock && !outOfStock && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="bg-amber-500 text-white text-xs font-medium px-2 py-1 rounded"
                            >
                                Only {stock} left!
                            </motion.div>
                        )}
                        {showStockBadge && outOfStock && (
                            <div className="bg-neutral-800 text-white text-xs font-medium px-2 py-1 rounded">
                                Out of Stock
                            </div>
                        )}
                    </div>

                    {/* Favorite/Wishlist Heart - top right */}
                    <button
                        onClick={handleFavoriteToggle}
                        className={`absolute top-3 right-3 z-10 p-1.5 cursor-pointer transition-all duration-200 rounded-full ${
                            isFavorite
                                ? "opacity-100 bg-red-50"
                                : "opacity-60 hover:opacity-100 hover:bg-white/80"
                        }`}
                        aria-label={isFavorite ? "Remove from wishlist" : "Add to wishlist"}
                    >
                        <Heart
                            size={20}
                            className={`transition-colors duration-200 ${
                                isFavorite
                                    ? "fill-red-500 text-red-500"
                                    : "text-neutral-600"
                            }`}
                        />
                    </button>

                    {/* Product Image - centered in display area */}
                    <div className="absolute inset-[12%]">
                        <Image
                            src={product.image}
                            alt={product.name}
                            fill
                            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                            className="object-contain transition-transform duration-300 group-hover:scale-105"
                        />
                    </div>

                    {/* Hover Add to Cart Button */}
                    <AnimatePresence>
                        {isHovered && !outOfStock && (
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
                <div className="space-y-1">
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