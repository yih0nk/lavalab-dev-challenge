import { Product } from "@/types";

/*
 * PRODUCTS DATA
 * This would typically come from a database/API
 * For now, it's static data that matches the Figma design
 *
 * Image order:
 * - Row 1: White, Red, Blue, Green
 * - Row 2: Blue, Green, Red, White
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
    // NEW ARRIVALS - Row 1: White, Red, Blue, Green
    // ==========================================
    {
        id: "1",
        name: "HAVIT HV-G92 Gamepad",
        price: 160,
        rating: 5,
        reviewCount: 88,
        image: images.white,
        colors: ["#f5f5f5", "#1a1a2e", "#e94560"],
        sizes: defaultSizes,
        category: "new-arrivals",
        description: "Premium athletic footwear with cutting-edge technology and sleek design.",
        details: defaultDetails,
    },
    {
        id: "2",
        name: "HAVIT HV-G92 Gamepad",
        price: 160,
        rating: 5,
        reviewCount: 88,
        image: images.red,
        colors: ["#c41e3a", "#1a1a2e", "#f5f5f5"],
        sizes: defaultSizes,
        category: "new-arrivals",
        description: "Engineered for speed and comfort, delivering exceptional performance.",
        details: defaultDetails,
    },
    {
        id: "3",
        name: "HAVIT HV-G92 Gamepad",
        price: 160,
        rating: 5,
        reviewCount: 88,
        image: images.blue,
        colors: ["#4169e1", "#1a1a2e", "#f5f5f5"],
        sizes: defaultSizes,
        category: "new-arrivals",
        description: "Next-level cushioning technology for those who push boundaries.",
        details: defaultDetails,
    },
    {
        id: "4",
        name: "HAVIT HV-G92 Gamepad",
        price: 960,
        originalPrice: 1160,
        rating: 4,
        reviewCount: 75,
        image: images.green,
        colors: ["#2e8b57", "#1a1a2e", "#f5f5f5"],
        sizes: defaultSizes,
        category: "new-arrivals",
        description: "Premium comfort meets bold design. Now available at a special price.",
        details: defaultDetails,
    },
    // ==========================================
    // NEW ARRIVALS - Row 2: Blue, Green, Red, White
    // ==========================================
    {
        id: "5",
        name: "HAVIT HV-G92 Gamepad",
        price: 160,
        rating: 5,
        reviewCount: 88,
        image: images.blue,
        colors: ["#4169e1", "#1a1a2e", "#f5f5f5"],
        sizes: defaultSizes,
        category: "new-arrivals",
        description: "Clean aesthetics with powerful performance.",
        details: defaultDetails,
    },
    {
        id: "6",
        name: "HAVIT HV-G92 Gamepad",
        price: 960,
        originalPrice: 1160,
        rating: 4,
        reviewCount: 75,
        image: images.green,
        colors: ["#2e8b57", "#1a1a2e", "#f5f5f5"],
        sizes: defaultSizes,
        category: "new-arrivals",
        description: "Bold green colorway with trusted performance technology.",
        details: defaultDetails,
    },
    {
        id: "7",
        name: "HAVIT HV-G92 Gamepad",
        price: 160,
        rating: 5,
        reviewCount: 88,
        image: images.red,
        colors: ["#c41e3a", "#1a1a2e", "#f5f5f5"],
        sizes: defaultSizes,
        category: "new-arrivals",
        description: "Sleek red design for bold excellence.",
        details: defaultDetails,
    },
    {
        id: "8",
        name: "HAVIT HV-G92 Gamepad",
        price: 960,
        originalPrice: 1160,
        rating: 4,
        reviewCount: 75,
        image: images.white,
        colors: ["#f5f5f5", "#1a1a2e", "#e94560"],
        sizes: defaultSizes,
        category: "new-arrivals",
        description: "Classic white edition with enhanced breathability. Limited time offer.",
        details: defaultDetails,
    },
    // ==========================================
    // TRENDING - Row 1: White, Red, Blue, Green
    // ==========================================
    {
        id: "9",
        name: "HAVIT HV-G92 Gamepad",
        price: 160,
        rating: 5,
        reviewCount: 88,
        image: images.white,
        colors: ["#f5f5f5", "#1a1a2e"],
        sizes: defaultSizes,
        category: "trending",
        description: "A fan favorite that continues to dominate. Clean design, proven performance.",
        details: defaultDetails,
    },
    {
        id: "10",
        name: "HAVIT HV-G92 Gamepad",
        price: 160,
        rating: 5,
        reviewCount: 88,
        image: images.red,
        colors: ["#c41e3a", "#1a1a2e", "#f5f5f5"],
        sizes: defaultSizes,
        category: "trending",
        description: "Bold red meets everyday comfort. A trending choice.",
        details: defaultDetails,
    },
    {
        id: "11",
        name: "HAVIT HV-G92 Gamepad",
        price: 160,
        rating: 5,
        reviewCount: 88,
        image: images.blue,
        colors: ["#4169e1", "#1a1a2e", "#f5f5f5"],
        sizes: defaultSizes,
        category: "trending",
        description: "The blue edition everyone's talking about. Perfect 5-star rated.",
        details: defaultDetails,
    },
    {
        id: "12",
        name: "HAVIT HV-G92 Gamepad",
        price: 960,
        originalPrice: 1160,
        rating: 4,
        reviewCount: 75,
        image: images.green,
        colors: ["#2e8b57", "#1a1a2e", "#f5f5f5"],
        sizes: defaultSizes,
        category: "trending",
        description: "Green vibes at a special price. Trending for good reason.",
        details: defaultDetails,
    },
    // ==========================================
    // TRENDING - Row 2: Blue, Green, Red, White
    // ==========================================
    {
        id: "13",
        name: "HAVIT HV-G92 Gamepad",
        price: 160,
        rating: 5,
        reviewCount: 88,
        image: images.blue,
        colors: ["#4169e1", "#1a1a2e", "#f5f5f5"],
        sizes: defaultSizes,
        category: "trending",
        description: "The iconic blue design that started it all. A timeless favorite.",
        details: defaultDetails,
    },
    {
        id: "14",
        name: "HAVIT HV-G92 Gamepad",
        price: 160,
        rating: 5,
        reviewCount: 88,
        image: images.green,
        colors: ["#2e8b57", "#1a1a2e", "#f5f5f5"],
        sizes: defaultSizes,
        category: "trending",
        description: "Bold green colorway for those who dare to stand out.",
        details: defaultDetails,
    },
    {
        id: "15",
        name: "HAVIT HV-G92 Gamepad",
        price: 160,
        rating: 5,
        reviewCount: 88,
        image: images.red,
        colors: ["#c41e3a", "#1a1a2e", "#f5f5f5"],
        sizes: defaultSizes,
        category: "trending",
        description: "Clean red base with striking accents. Perfect 5-star comfort.",
        details: defaultDetails,
    },
    {
        id: "16",
        name: "HAVIT HV-G92 Gamepad",
        price: 960,
        originalPrice: 1160,
        rating: 4,
        reviewCount: 75,
        image: images.white,
        colors: ["#f5f5f5", "#1a1a2e", "#e94560"],
        sizes: defaultSizes,
        category: "trending",
        description: "Classic white meets cool performance. Now on sale.",
        details: defaultDetails,
    },
];

// Helper function to get product by ID
export function getProductById(id: string): Product | undefined {
    return products.find((product) => product.id === id);
}

// Helper function to get products by category
export function getProductsByCategory(category: Product["category"]): Product[] {
    return products.filter((product) => product.category === category);
}
