"use client";

/*
 * TRUST BADGES COMPONENT
 *
 * Displays trust indicators below the product grid:
 * - Free & Fast Delivery
 * - 24/7 Customer Service
 * - Money Back Guarantee
 *
 * These build customer confidence and are commonly used in e-commerce.
 */

import { motion } from "framer-motion";
import Image from "next/image";

const badges = [
    {
        icon: "/images/icons/icon-delivery.svg",
        title: "FREE AND FAST DELIVERY",
        description: "Free delivery for all orders over $140",
    },
    {
        icon: "/images/icons/Icon-Customer service.svg",
        title: "24/7 CUSTOMER SERVICE",
        description: "Friendly 24/7 customer support",
    },
    {
        icon: "/images/icons/Icon-secure.svg",
        title: "MONEY BACK GUARANTEE",
        description: "We return money within 30 days",
    },
];

export default function TrustBadges() {
    return (
        <section className="py-12 lg:py-14 mb-16 bg-white">
            <div className="container-main">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {badges.map((badge, index) => (
                        <motion.div
                            key={badge.title}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="flex flex-col items-center text-center gap-6"
                        >
                            <div className="w-20 h-20 bg-neutral-300 rounded-full flex items-center justify-center">
                                <div className="w-14 h-14 bg-neutral-900 rounded-full flex items-center justify-center">
                                    <Image
                                        src={badge.icon}
                                        alt={badge.title}
                                        width={28}
                                        height={28}
                                    />
                                </div>
                            </div>
                            <div>
                                <h3 className="text-lg font-bold tracking-wider uppercase text-neutral-900 mb-2">
                                    {badge.title}
                                </h3>
                                <p className="text-sm text-neutral-500">{badge.description}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}