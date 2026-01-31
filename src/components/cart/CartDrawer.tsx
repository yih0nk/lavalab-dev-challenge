"use client";

/*
 * CART DRAWER COMPONENT
 *
 * A slide-out drawer from the right side showing the shopping cart.
 *
 * Features:
 * - Backdrop overlay (click to close)
 * - Cart item list with:
 *   - Product image
 *   - Product name
 *   - Selected color indicator
 *   - Price
 *   - Quantity controls (+/-)
 *   - Remove button
 * - Subtotal
 * - Checkout button
 * - Continue Shopping link
 *
 * Uses Zustand cart store for state management.
 */

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Plus, Trash2 } from "lucide-react";
import { useCartStore } from "@/store/cartStore";

export default function CartDrawer() {
    const {
        items,
        isCartOpen,
        closeCart,
        removeFromCart,
        updateQuantity,
        getTotalPrice,
    } = useCartStore();

    // Prevent body scroll when cart is open
    useEffect(() => {
        if (isCartOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isCartOpen]);

    // Handle escape key to close
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape") closeCart();
        };
        window.addEventListener("keydown", handleEscape);
        return () => window.removeEventListener("keydown", handleEscape);
    }, [closeCart]);

    return (
        <AnimatePresence>
            {isCartOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 bg-black/50 z-50"
                        onClick={closeCart}
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "tween", duration: 0.3 }}
                        className="fixed top-0 right-0 h-full w-full max-w-md bg-white z-50 flex flex-col shadow-2xl"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-6 py-5 border-b border-surface-border">
                            <h2 className="font-display text-2xl font-semibold text-primary tracking-wide">
                                Your Cart ({items.length})
                            </h2>
                            <button
                                onClick={closeCart}
                                className="p-2 hover:bg-surface-muted rounded-full transition-colors cursor-pointer"
                                aria-label="Close cart"
                            >
                                <X size={24} className="text-primary" />
                            </button>
                        </div>

                        {/* Cart Items */}
                        <div className="flex-1 overflow-y-auto px-6 py-4">
                            {items.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full text-center">
                                    <p className="text-neutral-500 mb-4">Your cart is empty</p>
                                    <button
                                        onClick={closeCart}
                                        className="text-primary font-medium hover:underline"
                                    >
                                        Continue Shopping
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    {items.map((item) => (
                                        <div
                                            key={`${item.product.id}-${item.selectedColor}`}
                                            className="flex gap-4"
                                        >
                                            {/* Product Image */}
                                            <div className="w-24 h-24 bg-surface-muted flex-shrink-0">
                                                <Image
                                                    src={item.product.image}
                                                    alt={item.product.name}
                                                    width={96}
                                                    height={96}
                                                    className="object-contain w-full h-full p-2"
                                                />
                                            </div>

                                            {/* Product Details */}
                                            <div className="flex-1 min-w-0">
                                                {/* Name */}
                                                <h3 className="font-display text-lg font-medium text-primary tracking-wide truncate">
                                                    {item.product.name}
                                                </h3>

                                                {/* Color & Size */}
                                                <div className="flex items-center gap-2 mt-1">
                                                    <div
                                                        className="w-4 h-4 rounded-full border border-neutral-200"
                                                        style={{ backgroundColor: item.selectedColor }}
                                                    />
                                                    {item.selectedSize && (
                                                        <span className="text-sm text-neutral-500">
                                                            Size {item.selectedSize}
                                                        </span>
                                                    )}
                                                </div>

                                                {/* Price */}
                                                <p className="font-semibold text-primary mt-1">
                                                    ${item.product.price.toFixed(2)}
                                                </p>

                                                {/* Quantity Controls */}
                                                <div className="flex items-center justify-between mt-3">
                                                    <div className="flex items-center gap-1">
                                                        <button
                                                            onClick={() =>
                                                                updateQuantity(
                                                                    item.product.id,
                                                                    item.selectedColor,
                                                                    item.quantity - 1
                                                                )
                                                            }
                                                            className="w-8 h-8 flex items-center justify-center bg-surface-muted hover:bg-neutral-200 transition-colors cursor-pointer"
                                                            aria-label="Decrease quantity"
                                                        >
                                                            <Minus size={14} />
                                                        </button>
                                                        <span className="w-10 h-8 flex items-center justify-center text-sm font-medium">
                                                            {item.quantity}
                                                        </span>
                                                        <button
                                                            onClick={() =>
                                                                updateQuantity(
                                                                    item.product.id,
                                                                    item.selectedColor,
                                                                    item.quantity + 1
                                                                )
                                                            }
                                                            className="w-8 h-8 flex items-center justify-center bg-surface-muted hover:bg-neutral-200 transition-colors cursor-pointer"
                                                            aria-label="Increase quantity"
                                                        >
                                                            <Plus size={14} />
                                                        </button>
                                                    </div>

                                                    {/* Remove Button */}
                                                    <button
                                                        onClick={() =>
                                                            removeFromCart(item.product.id, item.selectedColor)
                                                        }
                                                        className="p-2 text-neutral-400 hover:text-red-500 transition-colors cursor-pointer"
                                                        aria-label="Remove item"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Footer - Subtotal & Checkout */}
                        {items.length > 0 && (
                            <div className="border-t border-surface-border px-6 py-5 space-y-4">
                                {/* Subtotal */}
                                <div className="flex items-center justify-between">
                                    <span className="text-lg font-medium text-neutral-600">Subtotal</span>
                                    <span className="text-xl font-semibold text-primary">
                                        ${getTotalPrice().toFixed(2)}
                                    </span>
                                </div>

                                {/* Checkout Button */}
                                <Link
                                    href="/checkout"
                                    onClick={closeCart}
                                    className="block w-full py-4 bg-primary text-white text-center font-semibold uppercase tracking-wider hover:bg-primary-light transition-colors"
                                >
                                    Checkout
                                </Link>

                                {/* Continue Shopping */}
                                <button
                                    onClick={closeCart}
                                    className="w-full text-center text-primary font-medium hover:underline cursor-pointer"
                                >
                                    Continue Shopping
                                </button>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
