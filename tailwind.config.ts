import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            // Design system colors from Figma
            colors: {
                primary: {
                    DEFAULT: "#1A1A1A", // Main dark color (buttons, text, footer)
                    light: "#2D2D2D",
                },
                accent: {
                    DEFAULT: "#C9A961", // Gold/amber (Buy Now button)
                    light: "#D4B87A",
                },
                banner: {
                    DEFAULT: "#D63484", // Pink promo banner
                },
                surface: {
                    DEFAULT: "#FFFFFF",
                    muted: "#F5F5F5", // Light gray backgrounds
                    border: "#E5E5E5",
                },
            },
            // Font families
            fontFamily: {
                // Body font (Cabinet Grotesk) is loaded via globals.css.
                sans: ["var(--font-cabinet)", "sans-serif"],
                display: ["var(--font-teko)", "sans-serif"],
            },
            // Container max-width from Figma (1512px)
            maxWidth: {
                container: "1512px",
            },
            // Custom spacing if needed
            spacing: {
                18: "4.5rem",
                22: "5.5rem",
            },
        },
    },
    plugins: [],
};

export default config;