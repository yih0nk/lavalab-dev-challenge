"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, Share2, Trash2, ShoppingCart, Copy, Check, Lock, Globe } from "lucide-react";
import { useWishlistStore } from "@/store/wishlistStore";
import { useCartStore } from "@/store/cartStore";
import { useAuth } from "@/hooks/useAuth";
import { useAuthModal } from "@/hooks/useAuthModal";
import { toast } from "sonner";
import SelectSizeModal from "@/components/ui/SelectSizeModal";
import { Product } from "@/types";

export default function WishlistPage() {
  const { user, isLoading: authLoading } = useAuth();
  const { showLogin } = useAuthModal();
  const {
    items,
    isPublic,
    isLoading,
    removeFromWishlist,
    syncWithServer,
    getShareLink,
    togglePublic,
  } = useWishlistStore();
  const { addToCart } = useCartStore();
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Size selection modal state
  const [sizeModalOpen, setSizeModalOpen] = useState(false);
  const [selectedSize, setSelectedSize] = useState<number | undefined>(undefined);
  const [itemToAdd, setItemToAdd] = useState<Product | null>(null);

  useEffect(() => {
    if (user && !authLoading) {
      syncWithServer(user.id);
    }
  }, [user, authLoading, syncWithServer]);

  const handleShare = async () => {
    const url = await getShareLink();
    if (url) {
      setShareUrl(url);
    }
  };

  const handleCopyLink = async () => {
    if (shareUrl) {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast.success("Link copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleAddToCart = (item: (typeof items)[0]) => {
    const sizes = item.sizes ?? [];
    const requiresSize = sizes.length > 0;

    if (requiresSize) {
      // Open size selection modal
      setItemToAdd(item as Product);
      setSelectedSize(undefined);
      setSizeModalOpen(true);
    } else {
      // Add directly without size
      addToCart(item as Product, item.colors[0], undefined, 1);
    }
  };

  const handleConfirmAddToCart = () => {
    if (itemToAdd && selectedSize != null) {
      addToCart(itemToAdd, itemToAdd.colors[0], selectedSize, 1);
      setSizeModalOpen(false);
      setItemToAdd(null);
      setSelectedSize(undefined);
    }
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-neutral-300 border-t-[#181818] rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <Heart size={48} className="mx-auto text-neutral-300 mb-4" />
          <h1 className="text-2xl font-semibold text-[#181818] mb-2">
            Your Wishlist
          </h1>
          <p className="text-neutral-500 mb-6">
            Sign in to save items to your wishlist and share it with friends and family.
          </p>
          <button
            onClick={showLogin}
            className="px-6 py-3 bg-[#181818] text-white font-medium rounded-md hover:bg-[#2D2D2D] transition-colors"
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-8 lg:py-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-semibold text-[#181818]">My Wishlist</h1>
            <p className="text-neutral-500 mt-1">
              {items.length} {items.length === 1 ? "item" : "items"}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Privacy Toggle */}
            <button
              onClick={togglePublic}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-md border transition-colors ${
                isPublic
                  ? "border-green-200 bg-green-50 text-green-700"
                  : "border-neutral-200 bg-white text-neutral-600"
              }`}
            >
              {isPublic ? <Globe size={18} /> : <Lock size={18} />}
              <span className="text-sm font-medium">
                {isPublic ? "Public" : "Private"}
              </span>
            </button>

            {/* Share Button */}
            <button
              onClick={handleShare}
              className="flex items-center gap-2 px-4 py-2.5 bg-[#181818] text-white rounded-md hover:bg-[#2D2D2D] transition-colors"
            >
              <Share2 size={18} />
              <span className="text-sm font-medium">Share Wishlist</span>
            </button>
          </div>
        </div>

        {/* Share URL Display */}
        {shareUrl && (
          <div className="mb-8 p-4 bg-neutral-50 rounded-lg border border-neutral-200">
            <p className="text-sm text-neutral-600 mb-2">
              Share this link with friends and family:
            </p>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={shareUrl}
                readOnly
                className="flex-1 px-3 py-2 bg-white border border-neutral-200 rounded-md text-sm text-neutral-700"
              />
              <button
                onClick={handleCopyLink}
                className="flex items-center gap-2 px-4 py-2 bg-[#181818] text-white rounded-md hover:bg-[#2D2D2D] transition-colors"
              >
                {copied ? <Check size={16} /> : <Copy size={16} />}
                <span className="text-sm">{copied ? "Copied!" : "Copy"}</span>
              </button>
            </div>
          </div>
        )}

        {/* Empty State */}
        {items.length === 0 ? (
          <div className="text-center py-16">
            <Heart size={64} className="mx-auto text-neutral-200 mb-4" />
            <h2 className="text-xl font-semibold text-[#181818] mb-2">
              Your wishlist is empty
            </h2>
            <p className="text-neutral-500 mb-6">
              Start adding items you love to your wishlist!
            </p>
            <Link
              href="/"
              className="inline-block px-6 py-3 bg-[#181818] text-white font-medium rounded-md hover:bg-[#2D2D2D] transition-colors"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          /* Wishlist Grid */
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {items.map((item) => (
              <div key={item.id} className="group">
                {/* Product Image */}
                <div className="relative aspect-square bg-[#F5F5F5] overflow-hidden mb-3">
                  <Link href={`/product/${item.id}`}>
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-contain p-4 transition-transform duration-300 group-hover:scale-105"
                    />
                  </Link>

                  {/* Action Buttons */}
                  <div className="absolute top-3 right-3 flex flex-col gap-2">
                    <button
                      onClick={() => removeFromWishlist(item.id)}
                      className="p-2 bg-white rounded-full shadow-md hover:bg-red-50 transition-colors"
                      aria-label="Remove from wishlist"
                    >
                      <Trash2 size={16} className="text-red-500" />
                    </button>
                  </div>

                  {/* Add to Cart Button */}
                  <button
                    onClick={() => handleAddToCart(item)}
                    className="absolute bottom-0 left-0 right-0 py-3 bg-[#181818] text-white text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2"
                  >
                    <ShoppingCart size={16} />
                    Add to Cart
                  </button>
                </div>

                {/* Product Info */}
                <Link href={`/product/${item.id}`}>
                  <h3 className="text-sm font-medium text-[#181818] mb-1 truncate">
                    {item.name}
                  </h3>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-sm font-semibold ${
                        item.originalPrice ? "text-red-500" : "text-[#181818]"
                      }`}
                    >
                      ${item.price}
                    </span>
                    {item.originalPrice && (
                      <span className="text-sm text-neutral-400 line-through">
                        ${item.originalPrice}
                      </span>
                    )}
                  </div>
                </Link>
              </div>
            ))}
          </div>
        )}

        {/* Size Selection Modal */}
        <SelectSizeModal
          open={sizeModalOpen}
          onClose={() => {
            setSizeModalOpen(false);
            setItemToAdd(null);
            setSelectedSize(undefined);
          }}
          sizes={itemToAdd?.sizes ?? []}
          selectedSize={selectedSize}
          onSelect={(size) => setSelectedSize(size)}
          onConfirm={handleConfirmAddToCart}
          title={itemToAdd ? `Select size for ${itemToAdd.name}` : "Select a size"}
        />
      </div>
    </div>
  );
}
