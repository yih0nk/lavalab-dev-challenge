import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Product, CartItem } from "@/types";
import { getClient } from "@/lib/supabase/client";
import { toast } from "sonner";

/*
 * CART STORE
 *
 * Global state management for the shopping cart using Zustand.
 * Persisted to localStorage so cart survives page refreshes.
 * Syncs with Supabase when user is logged in.
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
 * - syncWithServer: Sync cart with database
 *
 * Getters:
 * - getTotalItems: Sum of all quantities
 * - getTotalPrice: Sum of (price × quantity)
 */

interface CartStore {
    items: CartItem[];
    isCartOpen: boolean;
    isSyncing: boolean;
    addToCart: (product: Product, color: string, size?: number) => void;
    removeFromCart: (productId: string, color: string) => void;
    updateQuantity: (productId: string, color: string, quantity: number) => void;
    clearCart: () => void;
    toggleCart: () => void;
    openCart: () => void;
    closeCart: () => void;
    getTotalItems: () => number;
    getTotalPrice: () => number;
    syncWithServer: (userId: string) => Promise<void>;
    syncItemToServer: (item: CartItem, userId: string) => Promise<void>;
}

// Helper to convert product ID for database
const toDbProductId = (id: string) => {
    if (id.includes("-")) return id;
    // Pad the ID to ensure proper UUID format
    const paddedId = id.padStart(12, "0");
    return `00000000-0000-0000-0000-${paddedId}`;
};

// Helper to normalize product ID for comparison (extract the numeric part)
const normalizeProductId = (id: string): string => {
    if (id.includes("-")) {
        // Extract last segment and remove leading zeros
        const lastSegment = id.split("-").pop() || "";
        return String(parseInt(lastSegment, 10));
    }
    return id;
};

export const useCartStore = create<CartStore>()(
    persist(
        (set, get) => ({
            items: [],
            isCartOpen: false,
            isSyncing: false,

            addToCart: (product, color, size) => {
                // Update local state IMMEDIATELY (synchronous)
                const currentItems = get().items;
                const normalizedProductId = normalizeProductId(product.id);
                const existingItem = currentItems.find(
                    (item) =>
                        normalizeProductId(item.product.id) === normalizedProductId &&
                        item.selectedColor === color &&
                        item.selectedSize === size
                );

                let newQuantity = 1;
                if (existingItem) {
                    newQuantity = existingItem.quantity + 1;
                    set({
                        items: currentItems.map((item) =>
                            normalizeProductId(item.product.id) === normalizedProductId &&
                            item.selectedColor === color &&
                            item.selectedSize === size
                                ? { ...item, quantity: newQuantity }
                                : item
                        ),
                        isCartOpen: true,
                    });
                } else {
                    set({
                        items: [
                            ...currentItems,
                            { product, quantity: 1, selectedColor: color, selectedSize: size },
                        ],
                        isCartOpen: true,
                    });
                }

                // Show toast immediately
                toast.success("Added to cart");

                // Sync to server in background (non-blocking)
                (async () => {
                    try {
                        const supabase = getClient();
                        const { data: { user } } = await supabase.auth.getUser();

                        if (user) {
                            await supabase.from("cart_items").upsert(
                                {
                                    user_id: user.id,
                                    product_id: toDbProductId(product.id),
                                    quantity: newQuantity,
                                    selected_color: color,
                                    selected_size: size || null,
                                } as never,
                                { onConflict: "user_id,product_id,selected_color,selected_size" }
                            );
                        }
                    } catch (error) {
                        console.error("Error syncing cart item:", error);
                    }
                })();
            },

            removeFromCart: (productId, color) => {
                // Update local state IMMEDIATELY
                const currentItems = get().items;
                const normalizedId = normalizeProductId(productId);
                set({
                    items: currentItems.filter(
                        (item) => !(normalizeProductId(item.product.id) === normalizedId && item.selectedColor === color)
                    ),
                });

                // Sync to server in background
                (async () => {
                    try {
                        const supabase = getClient();
                        const { data: { user } } = await supabase.auth.getUser();

                        if (user) {
                            await supabase
                                .from("cart_items")
                                .delete()
                                .eq("user_id", user.id)
                                .eq("product_id", toDbProductId(productId))
                                .eq("selected_color", color);
                        }
                    } catch (error) {
                        console.error("Error removing cart item:", error);
                    }
                })();
            },

            updateQuantity: (productId, color, quantity) => {
                if (quantity <= 0) {
                    get().removeFromCart(productId, color);
                    return;
                }

                // Update local state IMMEDIATELY
                const currentItems = get().items;
                const normalizedId = normalizeProductId(productId);
                set({
                    items: currentItems.map((item) =>
                        normalizeProductId(item.product.id) === normalizedId && item.selectedColor === color
                            ? { ...item, quantity }
                            : item
                    ),
                });

                // Sync to server in background
                (async () => {
                    try {
                        const supabase = getClient();
                        const { data: { user } } = await supabase.auth.getUser();

                        if (user) {
                            await supabase
                                .from("cart_items")
                                .update({ quantity } as never)
                                .eq("user_id", user.id)
                                .eq("product_id", toDbProductId(productId))
                                .eq("selected_color", color);
                        }
                    } catch (error) {
                        console.error("Error updating cart quantity:", error);
                    }
                })();
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

            syncWithServer: async (userId) => {
                const supabase = getClient();

                try {
                    set({ isSyncing: true });

                    // Fetch cart items with product details
                    const { data: cartItems, error } = await supabase
                        .from("cart_items")
                        .select(`
                            id,
                            quantity,
                            selected_color,
                            selected_size,
                            products (*)
                        `)
                        .eq("user_id", userId);

                    if (error) throw error;

                    // Transform database items to CartItem type
                    type CartItemRow = {
                        id: string;
                        quantity: number;
                        selected_color: string;
                        selected_size: number | null;
                        products: Record<string, unknown> | null;
                    };
                    const items = cartItems as CartItemRow[];
                    const serverItems: CartItem[] = items
                        .filter((item) => item.products)
                        .map((item) => {
                            const p = item.products as Record<string, unknown>;
                            return {
                                product: {
                                    id: p.id as string,
                                    name: p.name as string,
                                    price: Number(p.price),
                                    originalPrice: p.original_price ? Number(p.original_price) : undefined,
                                    rating: Number(p.rating),
                                    reviewCount: p.review_count as number,
                                    image: p.image as string,
                                    images: p.images as string[] | undefined,
                                    colors: p.colors as string[],
                                    sizes: p.sizes as number[] | undefined,
                                    category: p.category as "new-arrivals" | "trending",
                                    description: p.description as string | undefined,
                                    details: p.details as string[] | undefined,
                                },
                                quantity: item.quantity,
                                selectedColor: item.selected_color,
                                selectedSize: item.selected_size || undefined,
                            };
                        });

                    // Merge local cart with server cart
                    const localItems = get().items;
                    const mergedItems = [...serverItems];

                    // Add local items that don't exist on server
                    for (const localItem of localItems) {
                        const normalizedLocalId = normalizeProductId(localItem.product.id);
                        const existsOnServer = mergedItems.some(
                            (serverItem) => {
                                const normalizedServerId = normalizeProductId(serverItem.product.id);
                                return normalizedServerId === normalizedLocalId &&
                                    serverItem.selectedColor === localItem.selectedColor &&
                                    serverItem.selectedSize === localItem.selectedSize;
                            }
                        );

                        if (!existsOnServer) {
                            mergedItems.push(localItem);
                            // Sync to server
                            await supabase.from("cart_items").upsert(
                                {
                                    user_id: userId,
                                    product_id: toDbProductId(localItem.product.id),
                                    quantity: localItem.quantity,
                                    selected_color: localItem.selectedColor,
                                    selected_size: localItem.selectedSize || null,
                                } as never,
                                { onConflict: "user_id,product_id,selected_color,selected_size" }
                            );
                        }
                    }

                    set({ items: mergedItems, isSyncing: false });
                } catch (error) {
                    console.error("Error syncing cart:", error);
                    set({ isSyncing: false });
                }
            },

            syncItemToServer: async (item, userId) => {
                const supabase = getClient();

                try {
                    await supabase.from("cart_items").upsert(
                        {
                            user_id: userId,
                            product_id: toDbProductId(item.product.id),
                            quantity: item.quantity,
                            selected_color: item.selectedColor,
                            selected_size: item.selectedSize || null,
                        } as never,
                        { onConflict: "user_id,product_id,selected_color,selected_size" }
                    );
                } catch (error) {
                    console.error("Error syncing cart item:", error);
                }
            },
        }),
        {
            name: "shopall-cart", // localStorage key
        }
    )
);