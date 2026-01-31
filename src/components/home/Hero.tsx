"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Teko } from "next/font/google";

const teko = Teko({
    subsets: ["latin"],
    weight: ["400", "700"],
});

/**
 * HERO
 *
 * The Figma is web-first; you asked for adaptive sizing across laptop/desktop.
 * So this hero avoids fixed pixel sizes and uses fluid clamps.
 */
export default function Hero() {
    return (
        <section className="bg-white">
            <div className="container-main">
                <div className="relative flex items-center justify-center overflow-hidden min-h-[clamp(520px,55vw,700px)]">
                    {/* Background Text - SHOP ALL */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
                        <motion.h1
                            initial={{ opacity: 0, scale: 0.96 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8 }}
                            className={teko.className + " uppercase leading-none"}
                            style={{
                                fontSize: "clamp(120px, 22vw, 300px)",
                                fontWeight: 700,
                                color: "rgba(74, 76, 108, 0.17)",
                            }}
                        >
                            SHOP ALL
                        </motion.h1>
                    </div>

                    {/* ADJUStable (top-left-ish label) */}
                    <motion.div
                        initial={{ opacity: 0, x: -16 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.25 }}
                        className="absolute z-10"
                        style={{
                            top: "clamp(24px, 4vw, 72px)",
                            left: "clamp(24px, 18vw, 380px)",
                        }}
                    >
                        <span
                            className={teko.className}
                            style={{
                                fontSize: "clamp(16px, 1.6vw, 24px)",
                                fontWeight: 400,
                                color: "#181818",
                                letterSpacing: "0.15em",
                                textTransform: "uppercase",
                            }}
                        >
                            ADJUStable
                        </span>
                    </motion.div>

                    {/* Center Shoe Image */}
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                            duration: 0.8,
                            delay: 0.15,
                            type: "spring",
                            stiffness: 90,
                        }}
                        className="relative z-10"
                    >
                        <motion.div
                            animate={{ y: [0, -10, 0] }}
                            transition={{
                                duration: 3,
                                repeat: Infinity,
                                ease: "easeInOut",
                            }}
                            className="w-[min(70vw,753px)]"
                        >
                            <Image
                                src="/images/hero-shoe.png"
                                alt="Featured Shoe"
                                width={753}
                                height={552}
                                sizes="(max-width: 1024px) 70vw, 753px"
                                className="h-auto w-full object-contain drop-shadow-2xl"
                                priority
                            />
                        </motion.div>
                        {/* Shadow ellipse */}
                        <div
                            aria-hidden
                            className="pointer-events-none absolute left-40 -translate-x-1/2 bottom-0 w-[min(64%,483px)] h-[52px] rounded-[50%] bg-black/[0.41] blur-[18px]"
                        />
                    </motion.div>

                    {/* Soft Pad (bottom-right-ish label) */}
                    <motion.div
                        initial={{ opacity: 0, x: 16 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        className="absolute z-10"
                        style={{
                            bottom: "clamp(40px, 6vw, 170px)",
                            right: "clamp(24px, 14vw, 320px)",
                        }}
                    >
                        <span
                            className={teko.className}
                            style={{
                                fontSize: "clamp(16px, 1.6vw, 24px)",
                                fontWeight: 400,
                                color: "#181818",
                                letterSpacing: "0.15em",
                                textTransform: "uppercase",
                            }}
                        >
                            Soft Pad
                        </span>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
