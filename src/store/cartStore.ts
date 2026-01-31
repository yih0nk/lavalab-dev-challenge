import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Product, CartItem } from "@/types";

/*
 * CART STORE
 *
 * Global state management for the shopping cart using Zustand.
 * Persisted to localStorage so cart survives page refreshes.
 *
 * State:
 * - items: Array of cart items (product + quantity + selected options)
 * - isCartOpen: Controls cart drawer visibility
 *
 * Actions:
 * - addToCart: Add product with selected color/size
 * - removeFromCart: Remove item by product ID + color combination
 * - updateQuantity: Change quantity of an item
 * - clearCart: Empty the cart
 * - toggleCart: Open/close cart drawer
 * - openCart/closeCart: Explicit open/close
 *
 * Getters:
 * - getTotalItems: Sum of all quantities
 * - getTotalPrice: Sum of (price × quantity)
 */

interface CartStore {
    items: CartItem[];
    isCartOpen: boolean;
    addToCart: (product: Product, color: string, size?: number) => void;
    removeFromCart: (productId: string, color: string) => void;
    updateQuantity: (productId: string, color: string, quantity: number) => void;
    clearCart: () => void;
    toggleCart: () => void;
    openCart: () => void;
    closeCart: () => void;
    getTotalItems: () => number;
    getTotalPrice: () => number;
}

export const useCartStore = create<CartStore>()(
    persist(
        (set, get) => ({
            items: [],
            isCartOpen: false,

            addToCart: (product, color, size) => {
                set((state) => {
                    // Check if same product with same color already exists
                    const existingItem = state.items.find(
                        (item) =>
                            item.product.id === product.id &&
                            item.selectedColor === color &&
                            item.selectedSize === size
                    );

                    if (existingItem) {
                        // Increment quantity
                        return {
                            items: state.items.map((item) =>
                                item.product.id === product.id &&
                                item.selectedColor === color &&
                                item.selectedSize === size
                                    ? { ...item, quantity: item.quantity + 1 }
                                    : item
                            ),
                            isCartOpen: true, // Open cart when item added
                        };
                    }

                    // Add new item
                    return {
                        items: [
                            ...state.items,
                            { product, quantity: 1, selectedColor: color, selectedSize: size },
                        ],
                        isCartOpen: true, // Open cart when item added
                    };
                });
            },

            removeFromCart: (productId, color) => {
                set((state) => ({
                    items: state.items.filter(
                        (item) => !(item.product.id === productId && item.selectedColor === color)
                    ),
                }));
            },

            updateQuantity: (productId, color, quantity) => {
                if (quantity <= 0) {
                    get().removeFromCart(productId, color);
                    return;
                }
                set((state) => ({
                    items: state.items.map((item) =>
                        item.product.id === productId && item.selectedColor === color
                            ? { ...item, quantity }
                            : item
                    ),
                }));
            },

            clearCart: () => set({ items: [] }),

            toggleCart: () => set((state) => ({ isCartOpen: !state.isCartOpen })),

            openCart: () => set({ isCartOpen: true }),

            closeCart: () => set({ isCartOpen: false }),

            getTotalItems: () => {
                return get().items.reduce((total, item) => total + item.quantity, 0);
            },

            getTotalPrice: () => {
                return get().items.reduce(
                    (total, item) => total + item.product.price * item.quantity,
                    0
                );
            },
        }),
        {
            name: "shopall-cart", // localStorage key
        }
    )
);