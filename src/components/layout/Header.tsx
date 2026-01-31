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
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, LogOut, User, Package } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { useAuth } from "@/hooks/useAuth";
import { useAuthModal } from "@/hooks/useAuthModal";
import { Space_Grotesk } from "next/font/google";
import CartBadge from "./CartBadge";
import WishlistBadge from "./WishlistBadge";

const spaceGrotesk = Space_Grotesk({
    subsets: ["latin"],
    weight: ["700"],
});

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
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

    const toggleCart = useCartStore((state) => state.toggleCart);
    const { user, isLoading, signOut } = useAuth();
    const { showLogin } = useAuthModal();

    const handleAccountClick = () => {
        if (isLoading) return;
        if (!user) {
            showLogin();
        } else {
            setIsUserMenuOpen(!isUserMenuOpen);
        }
    };

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
                <div className="w-full mx-auto px-4 md:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo and Navigation */}
                        <div className="flex items-center gap-8">
                            {/* Logo */}
                            <Link href="/" className="flex items-center">
                                <svg width="30" height="30" viewBox="0 0 30 30" fill="none">
                                    <path
                                        fillRule="evenodd"
                                        clipRule="evenodd"
                                        d="M15 0H0L15 15H0L15 30H30L15 15H30L15 0Z"
                                        fill="#181818"
                                    />
                                </svg>
                            </Link>

                            {/* Desktop Navigation */}
                            <nav className={`hidden lg:flex items-center gap-6 ${spaceGrotesk.className}`}>
                                {navLinks.map((link) => (
                                    <Link
                                        key={link.name}
                                        href={link.href}
                                        className="text-[16px] font-bold text-[#181818] leading-none hover:underline underline-offset-4 transition-all duration-200"
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
                                className="p-2.5 hover:bg-gray-100 rounded-full transition-colors duration-200 cursor-pointer relative"
                                aria-label="Wishlist"
                            >
                                <Image
                                    src="/images/icons/heart.svg"
                                    alt="Wishlist"
                                    width={24}
                                    height={24}
                                />
                                <WishlistBadge />
                            </Link>

                            {/* Cart Button */}
                            <button
                                onClick={toggleCart}
                                className="p-2.5 hover:bg-gray-100 rounded-full transition-colors duration-200 relative cursor-pointer"
                                aria-label="Shopping cart"
                            >
                                <Image
                                    src="/images/icons/cart.svg"
                                    alt="Cart"
                                    width={21}
                                    height={20}
                                />
                                <CartBadge />
                            </button>

                            {/* User Account Button */}
                            <div className="relative">
                                <button
                                    onClick={handleAccountClick}
                                    className="p-2.5 hover:bg-gray-100 rounded-full transition-colors duration-200 cursor-pointer flex items-center gap-2"
                                    aria-label="Account"
                                >
                                    {user?.user_metadata?.avatar_url ? (
                                        <Image
                                            src={user.user_metadata.avatar_url}
                                            alt="Profile"
                                            width={24}
                                            height={24}
                                            className="rounded-full"
                                        />
                                    ) : (
                                        <Image
                                            src="/images/icons/profile.svg"
                                            alt="Account"
                                            width={17}
                                            height={21}
                                        />
                                    )}
                                </button>

                                {/* User Dropdown Menu */}
                                <AnimatePresence>
                                    {isUserMenuOpen && user && (
                                        <>
                                            {/* Backdrop */}
                                            <div
                                                className="fixed inset-0 z-40"
                                                onClick={() => setIsUserMenuOpen(false)}
                                            />
                                            <motion.div
                                                initial={{ opacity: 0, y: -10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -10 }}
                                                transition={{ duration: 0.15 }}
                                                className="absolute right-0 top-full mt-2 w-56 bg-white rounded-lg shadow-lg border border-neutral-200 py-2 z-50"
                                            >
                                                <div className="px-4 py-2 border-b border-neutral-100">
                                                    <p className="text-sm font-medium text-[#181818] truncate">
                                                        {user.user_metadata?.full_name || user.email}
                                                    </p>
                                                    <p className="text-xs text-neutral-500 truncate">
                                                        {user.email}
                                                    </p>
                                                </div>
                                                <Link
                                                    href="/account"
                                                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-neutral-700 hover:bg-neutral-50 transition-colors"
                                                    onClick={() => setIsUserMenuOpen(false)}
                                                >
                                                    <User size={16} />
                                                    My Account
                                                </Link>
                                                <Link
                                                    href="/account/orders"
                                                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-neutral-700 hover:bg-neutral-50 transition-colors"
                                                    onClick={() => setIsUserMenuOpen(false)}
                                                >
                                                    <Package size={16} />
                                                    Order History
                                                </Link>
                                                <button
                                                    onClick={() => {
                                                        signOut();
                                                        setIsUserMenuOpen(false);
                                                    }}
                                                    className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                                                >
                                                    <LogOut size={16} />
                                                    Sign Out
                                                </button>
                                            </motion.div>
                                        </>
                                    )}
                                </AnimatePresence>
                            </div>

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
                        <nav className={`container-main py-4 space-y-1 ${spaceGrotesk.className}`}>
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    className="block py-3 text-[16px] font-bold text-[#181818] hover:text-neutral-500 transition-colors duration-200"
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