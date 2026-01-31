import type { Metadata } from "next";
import { Teko } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CartDrawer from "@/components/cart/CartDrawer";
import AuthProvider from "@/components/auth/AuthProvider";
import { Toaster } from "sonner";

/*
 * FONTS:
 * - Cabinet Grotesk: Main body font (loaded via CSS from Fontshare)
 * - Teko: Display font for headings, product names, hero text
 */
const teko = Teko({
    subsets: ["latin"],
    weight: ["300", "400", "500", "600", "700"],
    variable: "--font-teko",
});

export const metadata: Metadata = {
    title: "SHOPALL | Premium Athletic Footwear",
    description: "Premium Athletic Footwear - Shop the latest in running shoes, trail shoes, and athletic wear.",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" className={teko.variable}>
            <body>
                <AuthProvider>
                    <Header />
                    <main>{children}</main>
                    <Footer />
                    <CartDrawer />
                    <Toaster position="top-center" richColors />
                </AuthProvider>
            </body>
        </html>
    );
}