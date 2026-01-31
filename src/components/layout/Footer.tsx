"use client";

/*
 * FOOTER COMPONENT
 *
 * Dark footer with:
 * - SHOPALL logo and company info
 * - Social media links
 * - Shop links column
 * - Help links column
 * - Newsletter subscription
 * - Copyright notice
 */

import Link from "next/link";
import { Facebook, Twitter, Instagram, Youtube } from "lucide-react";

export default function Footer() {
    return (
        <footer className="bg-primary text-white">
            <div className="container-main py-12 lg:py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
                    {/* Logo & Info */}
                    <div className="space-y-5">
                        {/* Logo */}
                        <Link href="/" className="flex items-center gap-2">
                            <svg width="32" height="32" viewBox="0 0 40 40" fill="none">
                                <path
                                    d="M12 10C12 10 14 6 22 6C30 6 32 12 32 14C32 18 28 20 22 20C16 20 10 22 10 28C10 34 18 36 24 36C32 36 34 32 34 32"
                                    stroke="#ffffff"
                                    strokeWidth="3"
                                    strokeLinecap="round"
                                    fill="none"
                                />
                            </svg>
                            <span className="font-display text-2xl font-semibold tracking-tight">
                                SHOPALL
                            </span>
                        </Link>

                        {/* Address */}
                        <div className="space-y-1 text-sm">
                            <p className="font-semibold text-white">Address</p>
                            <p className="text-neutral-400">Los Angeles, California, USA</p>
                        </div>

                        {/* Contact */}
                        <div className="space-y-1 text-sm">
                            <p className="font-semibold text-white">Contact</p>
                            <p className="text-neutral-400">(123) 456-7890</p>
                            <p className="text-neutral-400">hello@shopall.com</p>
                        </div>

                        {/* Social Links */}
                        <div className="flex items-center gap-3 pt-2">
                            <Link
                                href="#"
                                className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors duration-200"
                                aria-label="Facebook"
                            >
                                <Facebook size={18} />
                            </Link>
                            <Link
                                href="#"
                                className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors duration-200"
                                aria-label="Twitter"
                            >
                                <Twitter size={18} />
                            </Link>
                            <Link
                                href="#"
                                className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors duration-200"
                                aria-label="Instagram"
                            >
                                <Instagram size={18} />
                            </Link>
                            <Link
                                href="#"
                                className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors duration-200"
                                aria-label="YouTube"
                            >
                                <Youtube size={18} />
                            </Link>
                        </div>
                    </div>

                    {/* Shop Links */}
                    <div className="space-y-5">
                        <h4 className="font-semibold text-sm uppercase tracking-wider">Shop</h4>
                        <nav className="space-y-3 text-sm text-neutral-400">
                            <Link href="/men" className="block hover:text-white transition-colors">
                                Men
                            </Link>
                            <Link href="/women" className="block hover:text-white transition-colors">
                                Women
                            </Link>
                            <Link href="/unisex" className="block hover:text-white transition-colors">
                                Unisex
                            </Link>
                            <Link href="/running" className="block hover:text-white transition-colors">
                                Running
                            </Link>
                            <Link href="/trail" className="block hover:text-white transition-colors">
                                Trail
                            </Link>
                        </nav>
                    </div>

                    {/* Help Links */}
                    <div className="space-y-5">
                        <h4 className="font-semibold text-sm uppercase tracking-wider">Help</h4>
                        <nav className="space-y-3 text-sm text-neutral-400">
                            <Link href="/contact" className="block hover:text-white transition-colors">
                                Contact Us
                            </Link>
                            <Link href="/faq" className="block hover:text-white transition-colors">
                                FAQ
                            </Link>
                            <Link href="/shipping" className="block hover:text-white transition-colors">
                                Shipping Info
                            </Link>
                            <Link href="/returns" className="block hover:text-white transition-colors">
                                Returns & Exchanges
                            </Link>
                            <Link href="/size-guide" className="block hover:text-white transition-colors">
                                Size Guide
                            </Link>
                        </nav>
                    </div>

                    {/* Newsletter */}
                    <div className="space-y-5">
                        <h4 className="font-semibold text-sm uppercase tracking-wider">Newsletter</h4>
                        <p className="text-sm text-neutral-400">
                            Subscribe to receive updates, access to exclusive deals, and more.
                        </p>
                        <form className="space-y-3">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="w-full px-4 py-3 bg-white/10 border border-white/20 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-accent transition-colors duration-200"
                            />
                            <button
                                type="submit"
                                className="w-full px-4 py-3 bg-accent hover:bg-accent-light text-white text-sm font-semibold uppercase tracking-wider transition-colors duration-200 cursor-pointer"
                            >
                                Subscribe
                            </button>
                        </form>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-white/10 mt-12 pt-8 text-center text-sm text-neutral-500">
                    <p>© 2026 SHOPALL. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}