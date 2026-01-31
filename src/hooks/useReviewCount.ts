import { useState, useEffect } from "react";
import { getClient } from "@/lib/supabase/client";

interface UseReviewCountResult {
    count: number;
    averageRating: number;
    isLoading: boolean;
}

export function useReviewCount(productId: string): UseReviewCountResult {
    const [count, setCount] = useState(0);
    const [averageRating, setAverageRating] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchReviewCount() {
            if (!productId) return;

            try {
                const supabase = getClient();

                // Convert product ID to UUID format if needed
                const dbProductId = productId.includes("-")
                    ? productId
                    : `00000000-0000-0000-0000-${productId.padStart(12, "0")}`;

                const { data, error } = await supabase
                    .from("reviews")
                    .select("rating")
                    .eq("product_id", dbProductId);

                if (error) {
                    // Table might not exist - fail silently
                    setCount(0);
                    setAverageRating(0);
                    return;
                }

                const reviews = data || [];
                setCount(reviews.length);

                if (reviews.length > 0) {
                    const avg = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
                    setAverageRating(avg);
                } else {
                    setAverageRating(0);
                }
            } catch (err) {
                console.error("Error fetching review count:", err);
                setCount(0);
                setAverageRating(0);
            } finally {
                setIsLoading(false);
            }
        }

        fetchReviewCount();
    }, [productId]);

    return { count, averageRating, isLoading };
}
