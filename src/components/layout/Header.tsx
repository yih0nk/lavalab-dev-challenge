"use client";

/*
 * HEADER COMPONENT
 *
 * Structure:
 * 1. Promo Banner (pink) - editable message, can be connected to backend
 * 2. Main Header - logo, navigation, action icons
 * 3. Mobile Menu - collapsible navigation for mobile
 *
 * The promo banner message could be fetched from an API for dynamic updates.
 */

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, ShoppingCart, User, Menu, X } from "lucide-react";
import { useCartStore } from "@/store/cartStore";

// Navigation links - matches Figma design
const navLinks = [
    { name: "Women", href: "/women" },
    { name: "Men", href: "/men" },
    { name: "Kids", href: "/kids" },
    { name: "Classics", href: "/classics" },
    { name: "Sport", href: "/sport" },
    { name: "Sale", href: "/sale" },
];

// Promo banner message - this could come from a backend API
const PROMO_MESSAGE = "New here? Save 20% with code: YR24";

export default function Header() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { items, toggleCart } = useCartStore();
    const itemCount = items.reduce((total, item) => total + item.quantity, 0);

    return (
        <header className="sticky top-0 z-50 bg-white">
            {/* Promo Banner */}
            <div className="bg-[#4A4C6C] text-white text-center py-2.5">
                <p className="text-xs font-medium tracking-wide">
                    {PROMO_MESSAGE}
                </p>
            </div>

            {/* Main Header */}
            <div className="border-b border-[#F5F5F5]">
                <div className="container-main">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo and Navigation */}
                        <div className="flex items-center gap-8">
                            {/* Logo - Bird/Checkmark Icon */}
                            <Link href="/" className="flex items-center">
                                <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
                                    <path
                                        d="M4 18L12 26L28 6"
                                        stroke="#1A1A1A"
                                        strokeWidth="4"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        fill="none"
                                    />
                                    <path
                                        d="M4 10L10 16"
                                        stroke="#1A1A1A"
                                        strokeWidth="4"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        fill="none"
                                    />
                                </svg>
                            </Link>

                            {/* Desktop Navigation */}
                            <nav className="hidden lg:flex items-center gap-6">
                                {navLinks.map((link) => (
                                    <Link
                                        key={link.name}
                                        href={link.href}
                                        className="text-sm font-medium text-neutral-600 hover:text-primary transition-colors duration-200"
                                    >
                                        {link.name}
                                    </Link>
                                ))}
                            </nav>
                        </div>

                        {/* Right Actions - Heart, Cart, User */}
                        <div className="flex items-center gap-1">
                            {/* Wishlist Heart Button */}
                            <Link
                                href="/wishlist"
                                className="p-2.5 hover:bg-gray-100 rounded-full transition-colors duration-200 cursor-pointer"
                                aria-label="Wishlist"
                            >
                                <Heart size={20} className="text-[#1A1A1A]" />
                            </Link>

                            {/* Cart Button */}
                            <button
                                onClick={toggleCart}
                                className="p-2.5 hover:bg-gray-100 rounded-full transition-colors duration-200 relative cursor-pointer"
                                aria-label="Shopping cart"
                            >
                                <ShoppingCart size={20} className="text-[#1A1A1A]" />
                                {itemCount > 0 && (
                                    <motion.span
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-primary text-white text-[10px] font-bold rounded-full flex items-center justify-center"
                                    >
                                        {itemCount > 9 ? "9+" : itemCount}
                                    </motion.span>
                                )}
                            </button>

                            {/* User Account Button */}
                            <Link
                                href="/account"
                                className="p-2.5 hover:bg-gray-100 rounded-full transition-colors duration-200 cursor-pointer"
                                aria-label="Account"
                            >
                                <User size={20} className="text-[#1A1A1A]" />
                            </Link>

                            {/* Mobile Menu Toggle */}
                            <button
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className="lg:hidden p-2.5 hover:bg-surface-muted rounded-full transition-colors duration-200 cursor-pointer ml-1"
                                aria-label="Menu"
                            >
                                {isMobileMenuOpen ? (
                                    <X size={20} className="text-primary" />
                                ) : (
                                    <Menu size={20} className="text-primary" />
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="lg:hidden bg-white border-b border-surface-border overflow-hidden"
                    >
                        <nav className="container-main py-4 space-y-1">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    className="block py-3 text-base font-medium text-neutral-600 hover:text-primary transition-colors duration-200"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    {link.name}
                                </Link>
                            ))}
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}