import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Product } from "@/types";
import { getClient } from "@/lib/supabase/client";
import { toast } from "sonner";

// Helper to normalize product ID for comparison (extract the numeric part)
const normalizeProductId = (id: string): string => {
  if (id.includes("-")) {
    // Extract last segment and remove leading zeros
    const lastSegment = id.split("-").pop() || "";
    return String(parseInt(lastSegment, 10));
  }
  return id;
};

interface WishlistState {
  items: Product[];
  shareToken: string | null;
  isPublic: boolean;
  isLoading: boolean;
  isSynced: boolean;
  hasHydrated: boolean;

  // Actions
  addToWishlist: (product: Product) => Promise<void>;
  removeFromWishlist: (productId: string) => Promise<void>;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
  syncWithServer: (userId: string) => Promise<void>;
  getShareLink: () => Promise<string | null>;
  togglePublic: () => Promise<void>;
  setHasHydrated: (state: boolean) => void;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      shareToken: null,
      isPublic: false,
      isLoading: false,
      isSynced: false,
      hasHydrated: false,

      setHasHydrated: (state) => {
        set({ hasHydrated: state });
      },

      addToWishlist: async (product) => {
        // Check if already in wishlist first (using normalized IDs)
        const currentItems = get().items;
        const normalizedProductId = normalizeProductId(product.id);
        if (currentItems.some((item) => normalizeProductId(item.id) === normalizedProductId)) {
          return; // Already in wishlist, do nothing
        }

        // Add to local state immediately (this is synchronous)
        set({ items: [...currentItems, product] });

        // Show toast immediately
        toast.success("Added to wishlist");

        // Sync to server if logged in (non-blocking)
        try {
          const supabase = getClient();
          const {
            data: { user },
          } = await supabase.auth.getUser();

          if (user) {
            // Map product ID for database (handle string vs UUID)
            const productId = product.id.includes("-")
              ? product.id
              : `00000000-0000-0000-0000-00000000000${product.id}`;

            await supabase.from("wishlist_items").upsert(
              {
                user_id: user.id,
                product_id: productId,
              } as never,
              { onConflict: "user_id,product_id" }
            );
          }
        } catch (error) {
          // Server sync failed, but local state is already updated
          console.error("Error syncing wishlist to server:", error);
        }
      },

      removeFromWishlist: async (productId) => {
        // Remove from local state immediately (this is synchronous)
        const currentItems = get().items;
        const normalizedId = normalizeProductId(productId);
        set({ items: currentItems.filter((item) => normalizeProductId(item.id) !== normalizedId) });

        // Show toast immediately
        toast.success("Removed from wishlist");

        // Sync to server if logged in (non-blocking)
        try {
          const supabase = getClient();
          const {
            data: { user },
          } = await supabase.auth.getUser();

          if (user) {
            const dbProductId = productId.includes("-")
              ? productId
              : `00000000-0000-0000-0000-00000000000${productId}`;

            await supabase
              .from("wishlist_items")
              .delete()
              .eq("user_id", user.id)
              .eq("product_id", dbProductId);
          }
        } catch (error) {
          // Server sync failed, but local state is already updated
          console.error("Error syncing wishlist removal to server:", error);
        }
      },

      isInWishlist: (productId) => {
        const normalizedId = normalizeProductId(productId);
        return get().items.some((item) => normalizeProductId(item.id) === normalizedId);
      },

      clearWishlist: () => {
        set({ items: [], isSynced: false });
      },

      syncWithServer: async (userId) => {
        const supabase = getClient();

        try {
          set({ isLoading: true });

          // Fetch wishlist items with product details
          const { data: wishlistItems, error: wishlistError } = await supabase
            .from("wishlist_items")
            .select(
              `
              product_id,
              products (*)
            `
            )
            .eq("user_id", userId);

          if (wishlistError) throw wishlistError;

          // Fetch wishlist settings
          const { data: wishlistSettings, error: settingsError } =
            await supabase
              .from("wishlists")
              .select("share_token, is_public")
              .eq("user_id", userId)
              .single();

          if (settingsError && settingsError.code !== "PGRST116") {
            throw settingsError;
          }

          const settings = wishlistSettings as {
            share_token: string | null;
            is_public: boolean;
          } | null;

          // Transform database products to our Product type
          type WishlistItemRow = {
            product_id: string;
            products: Record<string, unknown> | null;
          };
          const items = wishlistItems as WishlistItemRow[];
          const products: Product[] = items
            .filter((item) => item.products)
            .map((item) => {
              const p = item.products as Record<string, unknown>;
              return {
                id: p.id as string,
                name: p.name as string,
                price: Number(p.price),
                originalPrice: p.original_price
                  ? Number(p.original_price)
                  : undefined,
                rating: Number(p.rating),
                reviewCount: p.review_count as number,
                image: p.image as string,
                images: p.images as string[] | undefined,
                colors: p.colors as string[],
                sizes: p.sizes as number[] | undefined,
                category: p.category as "new-arrivals" | "trending",
                description: p.description as string | undefined,
                details: p.details as string[] | undefined,
              };
            });

          // Merge with local items (prioritize server)
          const localItems = get().items;
          const mergedItems = [...products];

          // Add local items that aren't on server yet
          for (const localItem of localItems) {
            const normalizedLocalId = normalizeProductId(localItem.id);
            if (
              !mergedItems.some(
                (item) => normalizeProductId(item.id) === normalizedLocalId
              )
            ) {
              mergedItems.push(localItem);
              // Sync this item to server
              const productId = localItem.id.includes("-")
                ? localItem.id
                : `00000000-0000-0000-0000-00000000000${localItem.id}`;

              await supabase.from("wishlist_items").upsert(
                {
                  user_id: userId,
                  product_id: productId,
                } as never,
                { onConflict: "user_id,product_id" }
              );
            }
          }

          set({
            items: mergedItems,
            shareToken: settings?.share_token || null,
            isPublic: settings?.is_public || false,
            isLoading: false,
            isSynced: true,
          });
        } catch (error) {
          console.error("Error syncing wishlist:", error);
          set({ isLoading: false });
        }
      },

      getShareLink: async () => {
        const supabase = getClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          toast.error("Please sign in to share your wishlist");
          return null;
        }

        try {
          // Get or create share token
          let { data: wishlist, error } = await supabase
            .from("wishlists")
            .select("share_token")
            .eq("user_id", user.id)
            .single();

          if (error && error.code === "PGRST116") {
            // No wishlist exists, create one
            const { data: newWishlist, error: createError } = await supabase
              .from("wishlists")
              .insert({ user_id: user.id } as never)
              .select("share_token")
              .single();

            if (createError) throw createError;
            wishlist = newWishlist;
          } else if (error) {
            throw error;
          }

          const wishlistData = wishlist as { share_token: string } | null;
          const shareToken = wishlistData?.share_token;
          if (shareToken) {
            set({ shareToken });
            const shareUrl = `${window.location.origin}/wishlist/shared/${shareToken}`;

            // Make wishlist public
            await supabase
              .from("wishlists")
              .update({ is_public: true } as never)
              .eq("user_id", user.id);

            set({ isPublic: true });

            return shareUrl;
          }

          return null;
        } catch (error) {
          console.error("Error getting share link:", error);
          toast.error("Failed to generate share link");
          return null;
        }
      },

      togglePublic: async () => {
        const supabase = getClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) return;

        const newIsPublic = !get().isPublic;

        try {
          const { error } = await supabase
            .from("wishlists")
            .update({ is_public: newIsPublic } as never)
            .eq("user_id", user.id);

          if (error) throw error;

          set({ isPublic: newIsPublic });
          toast.success(
            newIsPublic ? "Wishlist is now public" : "Wishlist is now private"
          );
        } catch (error) {
          console.error("Error toggling wishlist visibility:", error);
          toast.error("Failed to update wishlist visibility");
        }
      },
    }),
    {
      name: "shopall-wishlist",
      partialize: (state) => ({
        items: state.items,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
