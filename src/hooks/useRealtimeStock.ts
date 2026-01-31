"use client";

import { useEffect, useState } from "react";
import { getClient } from "@/lib/supabase/client";
import { RealtimeChannel } from "@supabase/supabase-js";

interface StockUpdate {
    productId: string;
    stock: number;
}

interface UseRealtimeStockOptions {
    productIds?: string[];
    onStockUpdate?: (update: StockUpdate) => void;
}

export function useRealtimeStock(options: UseRealtimeStockOptions = {}) {
    const { productIds, onStockUpdate } = options;
    const [stockData, setStockData] = useState<Record<string, number>>({});
    const [isSubscribed, setIsSubscribed] = useState(false);

    useEffect(() => {
        const supabase = getClient();
        let channel: RealtimeChannel | null = null;

        const subscribeToStock = async () => {
            // First, fetch initial stock data
            if (productIds && productIds.length > 0) {
                const dbProductIds = productIds.map((id) =>
                    id.includes("-") ? id : `00000000-0000-0000-0000-${id.padStart(12, "0")}`
                );

                const { data: products } = await supabase
                    .from("products")
                    .select("id, stock")
                    .in("id", dbProductIds);

                if (products) {
                    const initialStock: Record<string, number> = {};
                    (products as Array<{ id: string; stock: number }>).forEach((p) => {
                        initialStock[p.id] = p.stock;
                        // Also store with short ID for compatibility
                        const shortId = p.id.split("-").pop()?.replace(/^0+/, "");
                        if (shortId) {
                            initialStock[shortId] = p.stock;
                        }
                    });
                    setStockData(initialStock);
                }
            }

            // Subscribe to realtime changes
            channel = supabase
                .channel("products-stock-changes")
                .on(
                    "postgres_changes",
                    {
                        event: "UPDATE",
                        schema: "public",
                        table: "products",
                    },
                    (payload) => {
                        const newStock = payload.new.stock as number;
                        const productId = payload.new.id as string;

                        setStockData((prev) => {
                            const updated = { ...prev, [productId]: newStock };
                            // Also update with short ID
                            const shortId = productId.split("-").pop()?.replace(/^0+/, "");
                            if (shortId) {
                                updated[shortId] = newStock;
                            }
                            return updated;
                        });

                        if (onStockUpdate) {
                            onStockUpdate({ productId, stock: newStock });
                        }
                    }
                )
                .subscribe((status) => {
                    setIsSubscribed(status === "SUBSCRIBED");
                });
        };

        subscribeToStock();

        return () => {
            if (channel) {
                supabase.removeChannel(channel);
            }
        };
    }, [productIds?.join(","), onStockUpdate]);

    const getStock = (productId: string): number | null => {
        return stockData[productId] ?? null;
    };

    const isLowStock = (productId: string, threshold: number = 10): boolean => {
        const stock = getStock(productId);
        return stock !== null && stock <= threshold && stock > 0;
    };

    const isOutOfStock = (productId: string): boolean => {
        const stock = getStock(productId);
        return stock !== null && stock === 0;
    };

    return {
        stockData,
        isSubscribed,
        getStock,
        isLowStock,
        isOutOfStock,
    };
}
