"use client";

/*
 * FOOTER COMPONENT
 *
 * Matches the provided web-first design:
 * - Single logo/info block on dark background
 * - Address + contact
 * - Social icons
 * - Copyright line
 */

import Link from "next/link";
import Image from "next/image";

const socialLinks = [
    { name: "Facebook", icon: "/images/icons/Facebook.svg", href: "#" },
    { name: "Instagram", icon: "/images/icons/Instagram.svg", href: "#" },
    { name: "X", icon: "/images/icons/X.svg", href: "#" },
    { name: "LinkedIn", icon: "/images/icons/LinkedIn.svg", href: "#" },
    { name: "YouTube", icon: "/images/icons/Youtube.svg", href: "#" },
];

export default function Footer() {
    return (
        <footer className="bg-[#303030] text-white">
            <div className="container-main py-10 lg:py-14">
                <div>
                    <Link href="/" className="block">
                        <svg width="30" height="30" viewBox="0 0 30 30" fill="none">
                            <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M15 0H0L15 15H0L15 30H30L15 15H30L15 0Z"
                                fill="#FFFFFF"
                            />
                        </svg>
                    </Link>

                    <div className="mt-6 space-y-4 text-sm">
                        <div>
                            <p className="font-semibold">Address:</p>
                            <p className="text-neutral-300">USA, California</p>
                        </div>
                        <div>
                            <p className="font-semibold">Contact:</p>
                            <Link href="tel:18001234567" className="block text-neutral-300 underline hover:text-white">
                                1800 123 4567
                            </Link>
                            <Link href="mailto:javaria.y2b@gmail.com" className="block text-neutral-300 underline hover:text-white">
                                javaria.y2b@gmail.com
                            </Link>
                        </div>
                    </div>

                    <div className="mt-6 flex items-center gap-4">
                        {socialLinks.map((social) => (
                            <Link
                                key={social.name}
                                href={social.href}
                                aria-label={social.name}
                                className="hover:opacity-70 transition-opacity"
                            >
                                <Image
                                    src={social.icon}
                                    alt={social.name}
                                    width={24}
                                    height={24}
                                />
                            </Link>
                        ))}
                    </div>
                </div>

                <div className="mt-10 border-t border-white/20 pt-6 text-center text-sm text-neutral-400">
                    <p>© 2023 Javaria. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}