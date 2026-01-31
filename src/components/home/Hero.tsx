"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Teko } from "next/font/google";

const teko = Teko({
    subsets: ["latin"],
    weight: ["400", "700"],
});

export default function Hero() {
    return (
        <section>
            <div className="max-w-[1440px] mx-auto">
                {/* Hero Frame - taller with more whitespace */}
                <div className="relative h-[700px] flex items-center justify-center overflow-hidden">

                    {/* Background Text - SHOP ALL */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
                        <motion.h1
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8 }}
                            className={teko.className}
                            style={{
                                fontSize: "300px",
                                fontWeight: 700,
                                color: "rgba(74, 76, 108, 0.17)",
                                lineHeight: "100%",
                                letterSpacing: "0",
                                textTransform: "uppercase",
                            }}
                        >
                            SHOP ALL
                        </motion.h1>
                    </div>

                    {/* ADJUStable */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="absolute top-17 left-[27%] z-10"
                    >
                        <span
                            className={teko.className}
                            style={{
                                fontSize: "24px",
                                fontWeight: 400,
                                color: "#181818",
                                letterSpacing: "0.15em",
                                textTransform: "uppercase",
                            }}
                        >
                            ADJUStable
                        </span>
                    </motion.div>

                    {/* Center Shoe Image with Animation */}
                    <motion.div
                        initial={{ opacity: 0, y: 50, rotate: 0 }}
                        animate={{ opacity: 1, y: 0, rotate: 0 }}
                        transition={{
                            duration: 0.8,
                            delay: 0.2,
                            type: "spring",
                            stiffness: 100
                        }}
                        className="relative z-10"
                    >
                        <motion.div
                            animate={{
                                y: [0, -10, 0],
                            }}
                            transition={{
                                duration: 3,
                                repeat: Infinity,
                                ease: "easeInOut",
                            }}
                        >
                            <Image
                                src="/images/hero-shoe.png"
                                alt="Featured Shoe"
                                width={753}
                                height={552}
                                className="object-contain drop-shadow-2xl w-[753px] h-auto"
                                priority
                            />
                        </motion.div>
                    </motion.div>

                    {/* Soft Pad - Bottom Right, closer to center */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.5 }}
                        className="absolute bottom-38 right-[21%] z-10"
                    >
                        <span
                            className={teko.className}
                            style={{
                                fontSize: "24px",
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