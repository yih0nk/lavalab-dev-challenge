"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Loader2, CheckCircle, LogIn } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { useAuth } from "@/hooks/useAuth";
import { useAuthModal } from "@/hooks/useAuthModal";
import { getClient } from "@/lib/supabase/client";
import { toast } from "sonner";

export default function CheckoutPage() {
    const router = useRouter();
    const { items, getTotalPrice, clearCart } = useCartStore();
    const { user, isAuthenticated, isLoading: authLoading } = useAuth();
    const { showLogin } = useAuthModal();
    const [isProcessing, setIsProcessing] = useState(false);
    const [orderComplete, setOrderComplete] = useState(false);
    const [orderId, setOrderId] = useState<string | null>(null);
    const hasShownAuthPrompt = useRef(false);

    // Show login modal when not authenticated (after auth loading completes)
    useEffect(() => {
        if (!authLoading && !isAuthenticated && !hasShownAuthPrompt.current) {
            hasShownAuthPrompt.current = true;
            toast.info("Please sign in to complete your checkout");
            showLogin();
        }
    }, [authLoading, isAuthenticated, showLogin]);

    // Form state - all optional
    const [shippingAddress, setShippingAddress] = useState({
        fullName: "",
        address: "",
        city: "",
        state: "",
        zipCode: "",
        country: "",
    });

    const [paymentDetails, setPaymentDetails] = useState({
        cardNumber: "",
        expiryDate: "",
        cvv: "",
        nameOnCard: "",
    });

    const subtotal = getTotalPrice();
    const shipping = 0; // Free shipping
    const tax = subtotal * 0.1; // 10% tax
    const total = subtotal + shipping + tax;

    const handlePlaceOrder = async () => {
        if (!isAuthenticated || !user) {
            toast.error("Please sign in to complete your order");
            return;
        }

        if (items.length === 0) {
            toast.error("Your cart is empty");
            return;
        }

        setIsProcessing(true);

        try {
            const supabase = getClient();

            // Create the order
            const { data: order, error: orderError } = await supabase
                .from("orders")
                .insert({
                    user_id: user.id,
                    status: "confirmed",
                    subtotal: subtotal,
                    tax: tax,
                    shipping: shipping,
                    total: total,
                    shipping_address: shippingAddress,
                } as never)
                .select("id")
                .single();

            if (orderError) throw orderError;

            // Create order items and update stock
            for (const item of items) {
                // Convert product ID to UUID format if needed
                const productId = item.product.id.includes("-")
                    ? item.product.id
                    : `00000000-0000-0000-0000-00000000000${item.product.id}`;

                // Create order item
                const { error: itemError } = await supabase
                    .from("order_items")
                    .insert({
                        order_id: order.id,
                        product_id: productId,
                        product_snapshot: {
                            id: item.product.id,
                            name: item.product.name,
                            price: item.product.price,
                            image: item.product.image,
                            colors: item.product.colors,
                        },
                        quantity: item.quantity,
                        selected_color: item.selectedColor,
                        selected_size: item.selectedSize || null,
                        price_at_purchase: item.product.price,
                    } as never);

                if (itemError) {
                    console.error("Error creating order item:", itemError);
                }

                // Update stock (decrement by quantity purchased)
                const { error: stockError } = await supabase.rpc(
                    "decrement_stock",
                    {
                        p_product_id: productId,
                        p_quantity: item.quantity,
                    }
                );

                if (stockError) {
                    console.error("Error updating stock:", stockError);
                }
            }

            // Clear the cart
            clearCart();

            // Also clear server-side cart if logged in
            await supabase
                .from("cart_items")
                .delete()
                .eq("user_id", user.id);

            setOrderId(order.id);
            setOrderComplete(true);
            toast.success("Order placed successfully!");
        } catch (error) {
            console.error("Checkout error:", error);
            toast.error("Failed to place order. Please try again.");
        } finally {
            setIsProcessing(false);
        }
    };

    // Order complete screen
    if (orderComplete) {
        return (
            <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center px-4">
                <div className="max-w-md w-full bg-white rounded-lg shadow-sm p-8 text-center">
                    <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                    <h1 className="text-2xl font-semibold text-[#181818] mb-2">
                        Order Confirmed!
                    </h1>
                    <p className="text-neutral-600 mb-6">
                        Thank you for your purchase. Your order has been placed successfully.
                    </p>
                    {orderId && (
                        <p className="text-sm text-neutral-500 mb-6">
                            Order ID: {orderId.slice(0, 8)}...
                        </p>
                    )}
                    <div className="space-y-3">
                        <Link
                            href="/account/orders"
                            className="block w-full py-3 bg-[#181818] text-white font-medium rounded-md hover:bg-[#2D2D2D] transition-colors"
                        >
                            View Order History
                        </Link>
                        <Link
                            href="/"
                            className="block w-full py-3 border border-neutral-300 text-[#181818] font-medium rounded-md hover:bg-neutral-50 transition-colors"
                        >
                            Continue Shopping
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    // Empty cart
    if (items.length === 0) {
        return (
            <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center px-4">
                <div className="max-w-md w-full bg-white rounded-lg shadow-sm p-8 text-center">
                    <h1 className="text-2xl font-semibold text-[#181818] mb-2">
                        Your Cart is Empty
                    </h1>
                    <p className="text-neutral-600 mb-6">
                        Add some items to your cart before checking out.
                    </p>
                    <Link
                        href="/"
                        className="inline-block px-6 py-3 bg-[#181818] text-white font-medium rounded-md hover:bg-[#2D2D2D] transition-colors"
                    >
                        Continue Shopping
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#FAFAFA]">
            <div className="max-w-6xl mx-auto px-4 py-8">
                {/* Back Link */}
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-neutral-600 hover:text-[#181818] mb-8"
                >
                    <ArrowLeft size={20} />
                    Continue Shopping
                </Link>

                <h1 className="text-3xl font-semibold text-[#181818] mb-8">Checkout</h1>

                <div className="grid lg:grid-cols-2 gap-8">
                    {/* Left Column - Forms */}
                    <div className="space-y-6">
                        {/* Shipping Address */}
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <h2 className="text-lg font-semibold text-[#181818] mb-4">
                                Shipping Address
                            </h2>
                            <p className="text-sm text-neutral-500 mb-4">
                                Optional - Fill in for a complete experience
                            </p>
                            <div className="space-y-4">
                                <input
                                    type="text"
                                    placeholder="Full Name"
                                    value={shippingAddress.fullName}
                                    onChange={(e) =>
                                        setShippingAddress({ ...shippingAddress, fullName: e.target.value })
                                    }
                                    className="w-full px-4 py-3 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#181818]"
                                />
                                <input
                                    type="text"
                                    placeholder="Address"
                                    value={shippingAddress.address}
                                    onChange={(e) =>
                                        setShippingAddress({ ...shippingAddress, address: e.target.value })
                                    }
                                    className="w-full px-4 py-3 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#181818]"
                                />
                                <div className="grid grid-cols-2 gap-4">
                                    <input
                                        type="text"
                                        placeholder="City"
                                        value={shippingAddress.city}
                                        onChange={(e) =>
                                            setShippingAddress({ ...shippingAddress, city: e.target.value })
                                        }
                                        className="w-full px-4 py-3 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#181818]"
                                    />
                                    <input
                                        type="text"
                                        placeholder="State"
                                        value={shippingAddress.state}
                                        onChange={(e) =>
                                            setShippingAddress({ ...shippingAddress, state: e.target.value })
                                        }
                                        className="w-full px-4 py-3 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#181818]"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <input
                                        type="text"
                                        placeholder="ZIP Code"
                                        value={shippingAddress.zipCode}
                                        onChange={(e) =>
                                            setShippingAddress({ ...shippingAddress, zipCode: e.target.value })
                                        }
                                        className="w-full px-4 py-3 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#181818]"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Country"
                                        value={shippingAddress.country}
                                        onChange={(e) =>
                                            setShippingAddress({ ...shippingAddress, country: e.target.value })
                                        }
                                        className="w-full px-4 py-3 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#181818]"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Payment Details */}
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <h2 className="text-lg font-semibold text-[#181818] mb-4">
                                Payment Details
                            </h2>
                            <p className="text-sm text-neutral-500 mb-4">
                                Optional - For demo purposes only
                            </p>
                            <div className="space-y-4">
                                <input
                                    type="text"
                                    placeholder="Card Number"
                                    value={paymentDetails.cardNumber}
                                    onChange={(e) =>
                                        setPaymentDetails({ ...paymentDetails, cardNumber: e.target.value })
                                    }
                                    className="w-full px-4 py-3 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#181818]"
                                />
                                <input
                                    type="text"
                                    placeholder="Name on Card"
                                    value={paymentDetails.nameOnCard}
                                    onChange={(e) =>
                                        setPaymentDetails({ ...paymentDetails, nameOnCard: e.target.value })
                                    }
                                    className="w-full px-4 py-3 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#181818]"
                                />
                                <div className="grid grid-cols-2 gap-4">
                                    <input
                                        type="text"
                                        placeholder="MM/YY"
                                        value={paymentDetails.expiryDate}
                                        onChange={(e) =>
                                            setPaymentDetails({ ...paymentDetails, expiryDate: e.target.value })
                                        }
                                        className="w-full px-4 py-3 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#181818]"
                                    />
                                    <input
                                        type="text"
                                        placeholder="CVV"
                                        value={paymentDetails.cvv}
                                        onChange={(e) =>
                                            setPaymentDetails({ ...paymentDetails, cvv: e.target.value })
                                        }
                                        className="w-full px-4 py-3 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#181818]"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Order Summary */}
                    <div>
                        <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
                            <h2 className="text-lg font-semibold text-[#181818] mb-4">
                                Order Summary
                            </h2>

                            {/* Items */}
                            <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
                                {items.map((item, index) => (
                                    <div key={`${item.product.id}-${item.selectedColor}-${index}`} className="flex gap-4">
                                        <div className="w-16 h-16 bg-[#F5F5F5] flex-shrink-0 rounded">
                                            <Image
                                                src={item.product.image}
                                                alt={item.product.name}
                                                width={64}
                                                height={64}
                                                className="object-contain w-full h-full p-1"
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium text-[#181818] text-sm truncate">
                                                {item.product.name}
                                            </p>
                                            <div className="flex items-center gap-2 mt-1">
                                                <div
                                                    className="w-3 h-3 rounded-full border"
                                                    style={{ backgroundColor: item.selectedColor }}
                                                />
                                                {item.selectedSize && (
                                                    <span className="text-xs text-neutral-500">
                                                        Size {item.selectedSize}
                                                    </span>
                                                )}
                                                <span className="text-xs text-neutral-500">
                                                    × {item.quantity}
                                                </span>
                                            </div>
                                        </div>
                                        <p className="font-medium text-[#181818]">
                                            ${(item.product.price * item.quantity).toFixed(2)}
                                        </p>
                                    </div>
                                ))}
                            </div>

                            {/* Totals */}
                            <div className="border-t border-neutral-200 pt-4 space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-neutral-600">Subtotal</span>
                                    <span className="text-[#181818]">${subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-neutral-600">Shipping</span>
                                    <span className="text-green-600">Free</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-neutral-600">Tax (10%)</span>
                                    <span className="text-[#181818]">${tax.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-lg font-semibold pt-2 border-t border-neutral-200">
                                    <span className="text-[#181818]">Total</span>
                                    <span className="text-[#181818]">${total.toFixed(2)}</span>
                                </div>
                            </div>

                            {/* Place Order Button */}
                            {isAuthenticated ? (
                                <button
                                    onClick={handlePlaceOrder}
                                    disabled={isProcessing}
                                    className="w-full mt-6 py-4 bg-[#181818] text-white font-semibold rounded-md hover:bg-[#2D2D2D] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {isProcessing ? (
                                        <>
                                            <Loader2 size={20} className="animate-spin" />
                                            Processing...
                                        </>
                                    ) : (
                                        "Place Order"
                                    )}
                                </button>
                            ) : (
                                <div className="mt-6 space-y-3">
                                    <button
                                        onClick={showLogin}
                                        className="w-full py-4 bg-[#181818] text-white font-semibold rounded-md hover:bg-[#2D2D2D] transition-colors flex items-center justify-center gap-2"
                                    >
                                        <LogIn size={20} />
                                        Sign In to Checkout
                                    </button>
                                    <p className="text-sm text-neutral-500 text-center">
                                        Please sign in to complete your purchase and track your orders
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
