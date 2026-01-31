/*
 * TYPES - TypeScript interfaces for the app
 * These define the shape of data used throughout the application
 */

// Product type - represents an item in the store
export interface Product {
    id: string;
    name: string;
    price: number;
    originalPrice?: number; // If present, shows as strikethrough (sale item)
    rating: number; // 1-5 stars
    reviewCount: number;
    image: string; // Primary product image URL
    images?: string[]; // Additional images for product detail gallery
    colors: string[]; // Array of hex color codes
    sizes?: number[]; // Available sizes (e.g., [6, 7, 8, 9, 10, 11, 12])
    category: "new-arrivals" | "trending";
    description?: string; // Full product description
    details?: string[]; // Product detail bullet points
}

// Cart item - a product added to cart with selected options
export interface CartItem {
    product: Product;
    quantity: number;
    selectedColor: string;
    selectedSize?: number;
}

// Promo banner - editable from backend (standout feature)
export interface PromoBanner {
    id: string;
    message: string;
    isActive: boolean;
    backgroundColor?: string;
    link?: string;
}

// User type for authentication (will be used with backend)
export interface User {
    id: string;
    email: string;
    name: string;
    createdAt: Date;
}

// Order type for checkout flow
export interface Order {
    id: string;
    userId: string;
    items: CartItem[];
    total: number;
    status: "pending" | "confirmed" | "shipped" | "delivered";
    shippingAddress: Address;
    createdAt: Date;
}

// Address type for shipping
export interface Address {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
}

// Re-export database types for convenience
export type {
    Profile,
    Product as DBProduct,
    CartItem as DBCartItem,
    WishlistItem,
    Wishlist,
    Order as DBOrder,
    OrderItem,
    CartItemWithProduct,
    WishlistItemWithProduct,
    OrderWithItems,
} from "@/lib/supabase/types";