"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingCart, Gift, Loader2 } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { Product } from "@/types";
import { toast } from "sonner";

interface SharedWishlistData {
  title: string;
  ownerName: string;
  items: Array<{
    id: string;
    product_id: string;
    products: {
      id: string;
      name: string;
      price: number;
      original_price: number | null;
      image: string;
      colors: string[];
    };
  }>;
}

export default function SharedWishlistPage() {
  const params = useParams();
  const token = params.token as string;
  const [wishlistData, setWishlistData] = useState<SharedWishlistData | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { addToCart } = useCartStore();

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const response = await fetch(`/api/wishlist/share/${token}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to load wishlist");
        }

        setWishlistData(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load wishlist"
        );
      } finally {
        setIsLoading(false);
      }
    };

    if (token) {
      fetchWishlist();
    }
  }, [token]);

  const handleAddToCart = (item: SharedWishlistData["items"][0]) => {
    const product: Product = {
      id: item.products.id,
      name: item.products.name,
      price: item.products.price,
      originalPrice: item.products.original_price || undefined,
      rating: 5,
      reviewCount: 0,
      image: item.products.image,
      colors: item.products.colors,
      category: "new-arrivals",
    };
    addToCart(product, product.colors[0]);
    toast.success("Added to cart!");
  };

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 size={32} className="animate-spin text-neutral-400" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <Heart size={48} className="mx-auto text-neutral-300 mb-4" />
          <h1 className="text-2xl font-semibold text-[#181818] mb-2">
            Wishlist Not Found
          </h1>
          <p className="text-neutral-500 mb-6">{error}</p>
          <Link
            href="/"
            className="inline-block px-6 py-3 bg-[#181818] text-white font-medium rounded-md hover:bg-[#2D2D2D] transition-colors"
          >
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  if (!wishlistData) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-8 lg:py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-pink-50 text-pink-600 rounded-full mb-4">
            <Gift size={18} />
            <span className="text-sm font-medium">Shared Wishlist</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-semibold text-[#181818] mb-2">
            {wishlistData.title}
          </h1>
          <p className="text-neutral-500">
            {wishlistData.ownerName}&apos;s wishlist &middot;{" "}
            {wishlistData.items.length}{" "}
            {wishlistData.items.length === 1 ? "item" : "items"}
          </p>
        </div>

        {/* Empty State */}
        {wishlistData.items.length === 0 ? (
          <div className="text-center py-16">
            <Heart size={64} className="mx-auto text-neutral-200 mb-4" />
            <h2 className="text-xl font-semibold text-[#181818] mb-2">
              This wishlist is empty
            </h2>
            <p className="text-neutral-500 mb-6">
              Check back later for new items!
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
            {wishlistData.items.map((item) => (
              <div key={item.id} className="group">
                {/* Product Image */}
                <div className="relative aspect-square bg-[#F5F5F5] overflow-hidden mb-3">
                  <Link href={`/product/${item.products.id}`}>
                    <Image
                      src={item.products.image}
                      alt={item.products.name}
                      fill
                      className="object-contain p-4 transition-transform duration-300 group-hover:scale-105"
                    />
                  </Link>

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
                <Link href={`/product/${item.products.id}`}>
                  <h3 className="text-sm font-medium text-[#181818] mb-1 truncate">
                    {item.products.name}
                  </h3>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-sm font-semibold ${
                        item.products.original_price
                          ? "text-red-500"
                          : "text-[#181818]"
                      }`}
                    >
                      ${item.products.price}
                    </span>
                    {item.products.original_price && (
                      <span className="text-sm text-neutral-400 line-through">
                        ${item.products.original_price}
                      </span>
                    )}
                  </div>
                </Link>
              </div>
            ))}
          </div>
        )}

        {/* Call to Action */}
        <div className="mt-12 text-center">
          <p className="text-neutral-500 mb-4">
            Want to create your own wishlist?
          </p>
          <Link
            href="/"
            className="inline-block px-6 py-3 border border-[#181818] text-[#181818] font-medium rounded-md hover:bg-[#181818] hover:text-white transition-colors"
          >
            Start Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
