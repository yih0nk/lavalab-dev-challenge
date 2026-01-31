import { useState, useEffect } from "react";
import { getClient } from "@/lib/supabase/client";

export interface Review {
    id: string;
    product_id: string;
    author_name: string;
    rating: number;
    title: string | null;
    content: string;
    verified_purchase: boolean;
    helpful_count: number;
    created_at: string;
}

interface UseProductReviewsResult {
    reviews: Review[];
    isLoading: boolean;
    error: string | null;
    averageRating: number;
    totalReviews: number;
    ratingDistribution: { [key: number]: number };
}

export function useProductReviews(productId: string): UseProductReviewsResult {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchReviews() {
            if (!productId) return;

            setIsLoading(true);
            setError(null);

            try {
                const supabase = getClient();

                // Convert product ID to UUID format if needed
                const dbProductId = productId.includes("-")
                    ? productId
                    : `00000000-0000-0000-0000-${productId.padStart(12, "0")}`;

                const { data, error: fetchError } = await supabase
                    .from("reviews")
                    .select("*")
                    .eq("product_id", dbProductId)
                    .order("created_at", { ascending: false });

                if (fetchError) {
                    // Table might not exist yet - fail silently
                    if (fetchError.code === "42P01" || fetchError.message?.includes("does not exist")) {
                        console.warn("Reviews table not found. Please run the SQL schema.");
                        setReviews([]);
                        return;
                    }
                    throw fetchError;
                }

                setReviews(data || []);
            } catch (err) {
                console.error("Error fetching reviews:", err);
                // Don't show error to user, just show empty reviews
                setReviews([]);
            } finally {
                setIsLoading(false);
            }
        }

        fetchReviews();
    }, [productId]);

    // Calculate average rating
    const averageRating =
        reviews.length > 0
            ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
            : 0;

    // Calculate rating distribution
    const ratingDistribution = reviews.reduce(
        (acc, r) => {
            acc[r.rating] = (acc[r.rating] || 0) + 1;
            return acc;
        },
        { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } as { [key: number]: number }
    );

    return {
        reviews,
        isLoading,
        error,
        averageRating,
        totalReviews: reviews.length,
        ratingDistribution,
    };
}
