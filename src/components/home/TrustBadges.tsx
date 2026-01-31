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
import { Truck, Headphones, ShieldCheck } from "lucide-react";

const badges = [
    {
        icon: Truck,
        title: "FREE AND FAST DELIVERY",
        description: "Free delivery for all orders over $140",
    },
    {
        icon: Headphones,
        title: "24/7 CUSTOMER SERVICE",
        description: "Friendly 24/7 customer support",
    },
    {
        icon: ShieldCheck,
        title: "MONEY BACK GUARANTEE",
        description: "We return money within 30 days",
    },
];

export default function TrustBadges() {
    return (
        <section className="py-16 lg:py-20 bg-surface-muted border-t border-surface-border">
            <div className="container-main">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
                    {badges.map((badge, index) => (
                        <motion.div
                            key={badge.title}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="flex flex-col items-center text-center"
                        >
                            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mb-4">
                                <badge.icon size={28} className="text-white" />
                            </div>
                            <h3 className="text-sm font-bold tracking-wider uppercase text-primary mb-2">
                                {badge.title}
                            </h3>
                            <p className="text-sm text-neutral-600">{badge.description}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}