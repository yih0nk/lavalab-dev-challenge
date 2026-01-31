"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Package, ArrowLeft, RefreshCw, Loader2, ShoppingCart } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useAuthModal } from "@/hooks/useAuthModal";
import { useCartStore } from "@/store/cartStore";
import { getClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { Product } from "@/types";

interface OrderItem {
  id: string;
  product_id: string;
  product_snapshot: {
    id: string;
    name: string;
    price: number;
    image: string;
    colors: string[];
  };
  quantity: number;
  selected_color: string;
  selected_size: number | null;
  price_at_purchase: number;
}

interface Order {
  id: string;
  status: string;
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  shipping_address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  created_at: string;
  order_items: OrderItem[];
}

export default function OrderHistoryPage() {
  const { user, isLoading: authLoading } = useAuth();
  const { showLogin } = useAuthModal();
  const { addToCart, openCart } = useCartStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [reorderingId, setReorderingId] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchOrders();
    } else if (!authLoading) {
      setIsLoading(false);
    }
  }, [user, authLoading]);

  const fetchOrders = async () => {
    if (!user) return;

    const supabase = getClient();

    const { data, error } = await supabase
      .from("orders")
      .select(
        `
        *,
        order_items (*)
      `
      )
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching orders:", error);
      toast.error("Failed to load orders");
    } else {
      setOrders(data || []);
    }

    setIsLoading(false);
  };

  const handleReorder = async (order: Order) => {
    setReorderingId(order.id);

    for (const item of order.order_items) {
      const product: Product = {
        id: item.product_snapshot.id,
        name: item.product_snapshot.name,
        price: item.price_at_purchase,
        rating: 5,
        reviewCount: 0,
        image: item.product_snapshot.image,
        colors: item.product_snapshot.colors,
        category: "new-arrivals",
      };

      for (let i = 0; i < item.quantity; i++) {
        await addToCart(product, item.selected_color, item.selected_size || undefined);
      }
    }

    toast.success("Items added to cart!");
    openCart();
    setReorderingId(null);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "confirmed":
        return "bg-blue-100 text-blue-800";
      case "shipped":
        return "bg-purple-100 text-purple-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      default:
        return "bg-neutral-100 text-neutral-800";
    }
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 size={32} className="animate-spin text-neutral-400" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <Package size={48} className="mx-auto text-neutral-300 mb-4" />
          <h1 className="text-2xl font-semibold text-[#181818] mb-2">
            Order History
          </h1>
          <p className="text-neutral-500 mb-6">
            Sign in to view your order history.
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
      <div className="max-w-4xl mx-auto px-4 md:px-6 lg:px-8 py-8 lg:py-12">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link
            href="/account"
            className="p-2 hover:bg-neutral-100 rounded-full transition-colors"
          >
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-3xl font-semibold text-[#181818]">
            Order History
          </h1>
        </div>

        {/* Empty State */}
        {orders.length === 0 ? (
          <div className="text-center py-16">
            <Package size={64} className="mx-auto text-neutral-200 mb-4" />
            <h2 className="text-xl font-semibold text-[#181818] mb-2">
              No orders yet
            </h2>
            <p className="text-neutral-500 mb-6">
              When you make a purchase, your orders will appear here.
            </p>
            <Link
              href="/"
              className="inline-block px-6 py-3 bg-[#181818] text-white font-medium rounded-md hover:bg-[#2D2D2D] transition-colors"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          /* Orders List */
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order.id}
                className="border border-neutral-200 rounded-lg overflow-hidden"
              >
                {/* Order Header */}
                <div className="bg-neutral-50 px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex flex-wrap items-center gap-4">
                    <div>
                      <p className="text-xs text-neutral-500 uppercase tracking-wider">
                        Order Placed
                      </p>
                      <p className="text-sm font-medium text-[#181818]">
                        {formatDate(order.created_at)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-neutral-500 uppercase tracking-wider">
                        Total
                      </p>
                      <p className="text-sm font-medium text-[#181818]">
                        ${order.total.toFixed(2)}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 text-xs font-medium rounded-full capitalize ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {order.status}
                    </span>
                  </div>

                  {/* Reorder Button */}
                  <button
                    onClick={() => handleReorder(order)}
                    disabled={reorderingId === order.id}
                    className="flex items-center gap-2 px-4 py-2 bg-[#181818] text-white text-sm font-medium rounded-md hover:bg-[#2D2D2D] transition-colors disabled:opacity-50"
                  >
                    {reorderingId === order.id ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <RefreshCw size={16} />
                    )}
                    Reorder
                  </button>
                </div>

                {/* Order Items */}
                <div className="divide-y divide-neutral-100">
                  {order.order_items.map((item) => (
                    <div key={item.id} className="px-6 py-4 flex gap-4">
                      {/* Product Image */}
                      <div className="w-20 h-20 bg-neutral-100 flex-shrink-0">
                        <Image
                          src={item.product_snapshot.image}
                          alt={item.product_snapshot.name}
                          width={80}
                          height={80}
                          className="object-contain w-full h-full p-2"
                        />
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-[#181818] truncate">
                          {item.product_snapshot.name}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <div
                            className="w-4 h-4 rounded-full border border-neutral-200"
                            style={{ backgroundColor: item.selected_color }}
                          />
                          {item.selected_size && (
                            <span className="text-sm text-neutral-500">
                              Size {item.selected_size}
                            </span>
                          )}
                          <span className="text-sm text-neutral-500">
                            Qty: {item.quantity}
                          </span>
                        </div>
                        <p className="text-sm font-medium text-[#181818] mt-1">
                          ${item.price_at_purchase.toFixed(2)}
                        </p>
                      </div>

                      {/* Add to Cart Button */}
                      <button
                        onClick={() => {
                          const product: Product = {
                            id: item.product_snapshot.id,
                            name: item.product_snapshot.name,
                            price: item.price_at_purchase,
                            rating: 5,
                            reviewCount: 0,
                            image: item.product_snapshot.image,
                            colors: item.product_snapshot.colors,
                            category: "new-arrivals",
                          };
                          addToCart(
                            product,
                            item.selected_color,
                            item.selected_size || undefined
                          );
                        }}
                        className="p-2 hover:bg-neutral-100 rounded-full transition-colors self-center"
                        aria-label="Add to cart"
                      >
                        <ShoppingCart size={18} className="text-neutral-600" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Order Footer */}
                <div className="bg-neutral-50 px-6 py-3 text-sm text-neutral-500">
                  <p>
                    Order #{order.id.slice(0, 8).toUpperCase()}
                    {order.shipping_address?.city && order.shipping_address?.state && (
                      <> &middot; Ships to {order.shipping_address.city}, {order.shipping_address.state}</>
                    )}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
