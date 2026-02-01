import { Product } from "@/types";

/*
 * PRODUCTS DATA
 * This would typically come from a database/API
 * For now, it's static data that matches the Figma design
 */

// Default sizes available for all shoes
const defaultSizes = [6, 7, 8, 9, 10, 11, 12];

// Default product details
const defaultDetails = [
    "Breathable mesh upper for enhanced ventilation",
    "GEL technology cushioning for superior comfort",
    "Durable rubber outsole with excellent grip",
    "Removable sockliner for custom orthotics",
    "Reflective details for low-light visibility",
];

// Image paths
const images = {
    white: "/images/products/air-zoom-pegasus-37.svg",
    red: "/images/products/Maroon.svg",
    blue: "/images/products/air-max-90-flyease.svg",
    green: "/images/products/cosmic-unity.svg",
};

export const products: Product[] = [
    // ==========================================
    // NEW ARRIVALS - Fresh drops, latest styles
    // ==========================================
    {
        id: "1",
        name: "Air Zoom Pegasus 40",
        price: 130,
        rating: 5,
        reviewCount: 124,
        image: images.white,
        colors: ["#f5f5f5", "#1a1a2e", "#e94560"],
        sizes: defaultSizes,
        category: "new-arrivals",
        description: "The latest Pegasus with responsive ZoomX foam for an energized ride.",
        details: defaultDetails,
    },
    {
        id: "2",
        name: "Ultraboost Light",
        price: 190,
        rating: 5,
        reviewCount: 89,
        image: images.red,
        colors: ["#c41e3a", "#1a1a2e", "#f5f5f5"],
        sizes: defaultSizes,
        category: "new-arrivals",
        description: "30% lighter than previous Ultraboost. Maximum energy return.",
        details: defaultDetails,
    },
    {
        id: "3",
        name: "Fresh Foam X 1080v13",
        price: 165,
        rating: 4.5,
        reviewCount: 67,
        image: images.blue,
        colors: ["#4169e1", "#1a1a2e", "#f5f5f5"],
        sizes: defaultSizes,
        category: "new-arrivals",
        description: "Plush comfort meets responsive performance. Your everyday essential.",
        details: defaultDetails,
    },
    {
        id: "4",
        name: "Gel-Kayano 30",
        price: 140,
        originalPrice: 180,
        rating: 4,
        reviewCount: 156,
        image: images.green,
        colors: ["#2e8b57", "#1a1a2e", "#f5f5f5"],
        sizes: defaultSizes,
        category: "new-arrivals",
        description: "30th anniversary edition with enhanced stability technology.",
        details: defaultDetails,
    },
    {
        id: "5",
        name: "Cloud X 4",
        price: 150,
        rating: 5,
        reviewCount: 203,
        image: images.blue,
        colors: ["#4169e1", "#1a1a2e", "#f5f5f5"],
        sizes: defaultSizes,
        category: "new-arrivals",
        description: "Versatile training shoe for gym sessions and short runs.",
        details: defaultDetails,
    },
    {
        id: "6",
        name: "Novablast 4",
        price: 115,
        originalPrice: 140,
        rating: 4.5,
        reviewCount: 92,
        image: images.green,
        colors: ["#2e8b57", "#1a1a2e", "#f5f5f5"],
        sizes: defaultSizes,
        category: "new-arrivals",
        description: "Bouncy FF Blast+ cushioning for a fun, energetic ride.",
        details: defaultDetails,
    },
    {
        id: "7",
        name: "Pegasus Trail 4",
        price: 145,
        rating: 4.5,
        reviewCount: 78,
        image: images.red,
        colors: ["#c41e3a", "#1a1a2e", "#f5f5f5"],
        sizes: defaultSizes,
        category: "new-arrivals",
        description: "Trail-ready traction with road-shoe comfort. Go anywhere.",
        details: defaultDetails,
    },
    {
        id: "8",
        name: "Glycerin 21",
        price: 130,
        originalPrice: 160,
        rating: 5,
        reviewCount: 187,
        image: images.white,
        colors: ["#f5f5f5", "#1a1a2e", "#e94560"],
        sizes: defaultSizes,
        category: "new-arrivals",
        description: "DNA LOFT v3 cushioning delivers a soft, smooth ride.",
        details: defaultDetails,
    },
    // ==========================================
    // TRENDING - Best sellers, fan favorites
    // ==========================================
    {
        id: "9",
        name: "Air Max 90",
        price: 130,
        rating: 5,
        reviewCount: 1247,
        image: images.green,
        colors: ["#2e8b57", "#1a1a2e", "#f5f5f5"],
        sizes: defaultSizes,
        category: "trending",
        description: "The icon returns. Visible Air cushioning since 1990.",
        details: defaultDetails,
    },
    {
        id: "10",
        name: "574 Core",
        price: 90,
        rating: 4.5,
        reviewCount: 2341,
        image: images.white,
        colors: ["#f5f5f5", "#1a1a2e"],
        sizes: defaultSizes,
        category: "trending",
        description: "Classic heritage style meets modern comfort. An icon.",
        details: defaultDetails,
    },
    {
        id: "11",
        name: "Cloudmonster",
        price: 170,
        rating: 5,
        reviewCount: 892,
        image: images.red,
        colors: ["#c41e3a", "#1a1a2e", "#f5f5f5"],
        sizes: defaultSizes,
        category: "trending",
        description: "Maximum cushioning, monster energy return. Go big.",
        details: defaultDetails,
    },
    {
        id: "12",
        name: "Gel-Nimbus 25",
        price: 135,
        originalPrice: 160,
        rating: 4.5,
        reviewCount: 567,
        image: images.blue,
        colors: ["#4169e1", "#1a1a2e", "#f5f5f5"],
        sizes: defaultSizes,
        category: "trending",
        description: "Pure comfort for long-distance runners. A best-seller.",
        details: defaultDetails,
    },
    {
        id: "13",
        name: "Vaporfly 3",
        price: 250,
        rating: 5,
        reviewCount: 423,
        image: images.red,
        colors: ["#c41e3a", "#f5f5f5", "#1a1a2e"],
        sizes: defaultSizes,
        category: "trending",
        description: "The record-breaking racing shoe. Elite performance.",
        details: defaultDetails,
    },
    {
        id: "14",
        name: "Saucony Kinvara 14",
        price: 120,
        rating: 4.5,
        reviewCount: 634,
        image: images.blue,
        colors: ["#4169e1", "#2e8b57", "#f5f5f5"],
        sizes: defaultSizes,
        category: "trending",
        description: "Lightweight and fast. Perfect for tempo runs.",
        details: defaultDetails,
    },
    {
        id: "15",
        name: "Ghost 15",
        price: 110,
        originalPrice: 140,
        rating: 5,
        reviewCount: 1823,
        image: images.white,
        colors: ["#f5f5f5", "#1a1a2e", "#4169e1"],
        sizes: defaultSizes,
        category: "trending",
        description: "Smooth transitions, soft cushioning. A runner favorite.",
        details: defaultDetails,
    },
    {
        id: "16",
        name: "Hoka Bondi 8",
        price: 165,
        rating: 5,
        reviewCount: 1456,
        image: images.green,
        colors: ["#2e8b57", "#1a1a2e", "#f5f5f5"],
        sizes: defaultSizes,
        category: "trending",
        description: "Ultra-cushioned comfort for all-day wear. Fan favorite.",
        details: defaultDetails,
    },
];

// Helper to normalize product ID (extract numeric part from UUID)
function normalizeProductId(id: string): string {
    if (id.includes("-")) {
        // Extract last segment and remove leading zeros
        const lastSegment = id.split("-").pop() || "";
        return String(parseInt(lastSegment, 10));
    }
    return id;
}

// Helper function to get product by ID (handles both simple IDs and UUIDs)
export function getProductById(id: string): Product | undefined {
    const normalizedId = normalizeProductId(id);
    return products.find((product) => normalizeProductId(product.id) === normalizedId);
}

// Helper function to get products by category
export function getProductsByCategory(category: Product["category"]): Product[] {
    return products.filter((product) => product.category === category);
}
