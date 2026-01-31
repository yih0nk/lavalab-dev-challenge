"use client";

/*
 * PRODUCT DETAIL PAGE
 *
 * Dynamic route: /product/[id]
 *
 * Layout (matching Figma):
 * - Left side: Main product image + thumbnail gallery
 * - Right side: Product info, color/size selectors, add to cart, buy now
 * - Bottom: Expandable accordion sections (Details, Shipping, Reviews)
 *
 * Features:
 * - Image gallery with thumbnail navigation
 * - Color swatch selection
 * - Size selector (6-12)
 * - Quantity selector
 * - Add to Cart / Buy Now buttons
 * - Accordion sections for details
 */

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Minus, Plus, ChevronDown } from "lucide-react";
import { getProductById } from "@/data/products";
import { useCartStore } from "@/store/cartStore";

export default function ProductDetailPage() {
    const params = useParams();
    const router = useRouter();
    const productId = params.id as string;
    const product = getProductById(productId);

    // State for selections
    const [selectedImage, setSelectedImage] = useState(0);
    const [selectedColor, setSelectedColor] = useState(product?.colors[0] || "");
    const [selectedSize, setSelectedSize] = useState<number | null>(null);
    const [quantity, setQuantity] = useState(1);

    // Accordion state
    const [openSection, setOpenSection] = useState<string | null>("details");

    // Cart actions
    const { addToCart, openCart } = useCartStore();

    // Handle product not found
    if (!product) {
        return (
            <div className="container-main py-20 text-center">
                <h1 className="font-display text-4xl text-primary mb-4">Product Not Found</h1>
                <p className="text-neutral-500 mb-8">The product you're looking for doesn't exist.</p>
                <button
                    onClick={() => router.push("/")}
                    className="px-6 py-3 bg-primary text-white font-medium hover:bg-primary-light transition-colors"
                >
                    Back to Home
                </button>
            </div>
        );
    }

    // Get images array (use main image if no gallery)
    const images = product.images || [product.image];
    const sizes = product.sizes || [6, 7, 8, 9, 10, 11, 12];

    // Handlers
    const handleAddToCart = () => {
        if (!selectedSize) {
            alert("Please select a size");
            return;
        }
        addToCart(product, selectedColor, selectedSize);
    };

    const handleBuyNow = () => {
        if (!selectedSize) {
            alert("Please select a size");
            return;
        }
        addToCart(product, selectedColor, selectedSize);
        router.push("/checkout");
    };

    const incrementQuantity = () => setQuantity((q) => q + 1);
    const decrementQuantity = () => setQuantity((q) => (q > 1 ? q - 1 : 1));

    const toggleSection = (section: string) => {
        setOpenSection(openSection === section ? null : section);
    };

    // Render star rating
    const renderStars = (rating: number) => {
        return Array.from({ length: 5 }, (_, i) => (
            <Star
                key={i}
                size={16}
                className={`${
                    i < Math.floor(rating)
                        ? "fill-amber-400 text-amber-400"
                        : i < rating
                        ? "fill-amber-400/50 text-amber-400"
                        : "text-neutral-300"
                }`}
            />
        ));
    };

    return (
        <div className="bg-white min-h-screen">
            <div className="container-main py-8 lg:py-12">
                {/* Main Product Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
                    {/* Left: Image Gallery */}
                    <div className="space-y-4">
                        {/* Main Image */}
                        <div className="aspect-square bg-surface-muted overflow-hidden">
                            <motion.div
                                key={selectedImage}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.3 }}
                                className="relative w-full h-full"
                            >
                                <Image
                                    src={images[selectedImage]}
                                    alt={product.name}
                                    fill
                                    className="object-contain p-8"
                                    priority
                                />
                            </motion.div>
                        </div>

                        {/* Thumbnail Gallery */}
                        {images.length > 1 && (
                            <div className="flex gap-3">
                                {images.map((img, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setSelectedImage(index)}
                                        className={`w-20 h-20 bg-surface-muted overflow-hidden transition-all cursor-pointer ${
                                            selectedImage === index
                                                ? "ring-2 ring-primary"
                                                : "hover:ring-1 hover:ring-neutral-300"
                                        }`}
                                    >
                                        <Image
                                            src={img}
                                            alt={`${product.name} view ${index + 1}`}
                                            width={80}
                                            height={80}
                                            className="object-contain w-full h-full p-2"
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Right: Product Info */}
                    <div className="space-y-6">
                        {/* Product Name */}
                        <h1 className="font-display text-3xl lg:text-4xl font-semibold text-primary tracking-wide">
                            {product.name}
                        </h1>

                        {/* Rating */}
                        <div className="flex items-center gap-2">
                            <div className="flex items-center gap-0.5">{renderStars(product.rating)}</div>
                            <span className="text-sm text-neutral-500">
                                ({product.reviewCount} reviews)
                            </span>
                        </div>

                        {/* Price */}
                        <div className="flex items-center gap-3">
                            <span className="text-2xl font-semibold text-primary">
                                ${product.price.toFixed(2)}
                            </span>
                            {product.originalPrice && (
                                <span className="text-lg text-neutral-400 line-through">
                                    ${product.originalPrice.toFixed(2)}
                                </span>
                            )}
                        </div>

                        {/* Description */}
                        {product.description && (
                            <p className="text-neutral-600 leading-relaxed">
                                {product.description}
                            </p>
                        )}

                        {/* Color Selection */}
                        <div className="space-y-3">
                            <label className="text-sm font-semibold text-primary uppercase tracking-wider">
                                Color
                            </label>
                            <div className="flex items-center gap-3">
                                {product.colors.map((color) => (
                                    <button
                                        key={color}
                                        onClick={() => setSelectedColor(color)}
                                        className={`w-8 h-8 rounded-full transition-all cursor-pointer ${
                                            selectedColor === color
                                                ? "ring-2 ring-offset-2 ring-primary"
                                                : "hover:scale-110"
                                        }`}
                                        style={{ backgroundColor: color }}
                                        aria-label={`Select color ${color}`}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Size Selection */}
                        <div className="space-y-3">
                            <label className="text-sm font-semibold text-primary uppercase tracking-wider">
                                Size
                            </label>
                            <div className="flex flex-wrap gap-2">
                                {sizes.map((size) => (
                                    <button
                                        key={size}
                                        onClick={() => setSelectedSize(size)}
                                        className={`w-12 h-12 flex items-center justify-center text-sm font-medium transition-all cursor-pointer ${
                                            selectedSize === size
                                                ? "bg-primary text-white"
                                                : "bg-surface-muted text-primary hover:bg-neutral-200"
                                        }`}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Quantity */}
                        <div className="space-y-3">
                            <label className="text-sm font-semibold text-primary uppercase tracking-wider">
                                Quantity
                            </label>
                            <div className="flex items-center gap-1 w-fit">
                                <button
                                    onClick={decrementQuantity}
                                    className="w-10 h-10 flex items-center justify-center bg-surface-muted hover:bg-neutral-200 transition-colors cursor-pointer"
                                    aria-label="Decrease quantity"
                                >
                                    <Minus size={16} />
                                </button>
                                <span className="w-12 h-10 flex items-center justify-center bg-surface-muted font-medium">
                                    {quantity}
                                </span>
                                <button
                                    onClick={incrementQuantity}
                                    className="w-10 h-10 flex items-center justify-center bg-surface-muted hover:bg-neutral-200 transition-colors cursor-pointer"
                                    aria-label="Increase quantity"
                                >
                                    <Plus size={16} />
                                </button>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-3 pt-4">
                            <button
                                onClick={handleAddToCart}
                                className="flex-1 py-4 px-8 bg-primary text-white font-semibold uppercase tracking-wider hover:bg-primary-light transition-colors cursor-pointer"
                            >
                                Add to Cart
                            </button>
                            <button
                                onClick={handleBuyNow}
                                className="flex-1 py-4 px-8 bg-accent text-white font-semibold uppercase tracking-wider hover:bg-accent-light transition-colors cursor-pointer"
                            >
                                Buy Now
                            </button>
                        </div>

                        {/* Accordion Sections */}
                        <div className="border-t border-surface-border pt-6 space-y-0">
                            {/* Product Details */}
                            <div className="border-b border-surface-border">
                                <button
                                    onClick={() => toggleSection("details")}
                                    className="w-full py-4 flex items-center justify-between text-left cursor-pointer"
                                >
                                    <span className="font-semibold text-primary">Product Details</span>
                                    <ChevronDown
                                        size={20}
                                        className={`text-neutral-400 transition-transform ${
                                            openSection === "details" ? "rotate-180" : ""
                                        }`}
                                    />
                                </button>
                                <AnimatePresence>
                                    {openSection === "details" && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.2 }}
                                            className="overflow-hidden"
                                        >
                                            <ul className="pb-4 space-y-2 text-neutral-600">
                                                {product.details?.map((detail, index) => (
                                                    <li key={index} className="flex items-start gap-2">
                                                        <span className="text-primary mt-1">•</span>
                                                        {detail}
                                                    </li>
                                                ))}
                                            </ul>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Shipping & Returns */}
                            <div className="border-b border-surface-border">
                                <button
                                    onClick={() => toggleSection("shipping")}
                                    className="w-full py-4 flex items-center justify-between text-left cursor-pointer"
                                >
                                    <span className="font-semibold text-primary">Shipping & Returns</span>
                                    <ChevronDown
                                        size={20}
                                        className={`text-neutral-400 transition-transform ${
                                            openSection === "shipping" ? "rotate-180" : ""
                                        }`}
                                    />
                                </button>
                                <AnimatePresence>
                                    {openSection === "shipping" && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.2 }}
                                            className="overflow-hidden"
                                        >
                                            <div className="pb-4 space-y-2 text-neutral-600">
                                                <p>• Free standard shipping on orders over $100</p>
                                                <p>• Express shipping available (2-3 business days)</p>
                                                <p>• Free returns within 30 days of purchase</p>
                                                <p>• Items must be unworn with original tags attached</p>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Reviews */}
                            <div className="border-b border-surface-border">
                                <button
                                    onClick={() => toggleSection("reviews")}
                                    className="w-full py-4 flex items-center justify-between text-left cursor-pointer"
                                >
                                    <span className="font-semibold text-primary">
                                        Reviews ({product.reviewCount})
                                    </span>
                                    <ChevronDown
                                        size={20}
                                        className={`text-neutral-400 transition-transform ${
                                            openSection === "reviews" ? "rotate-180" : ""
                                        }`}
                                    />
                                </button>
                                <AnimatePresence>
                                    {openSection === "reviews" && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.2 }}
                                            className="overflow-hidden"
                                        >
                                            <div className="pb-4 text-neutral-600">
                                                <p className="italic">
                                                    Reviews will be loaded from the backend. This section will
                                                    display customer reviews with ratings, comments, and
                                                    helpful votes.
                                                </p>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
