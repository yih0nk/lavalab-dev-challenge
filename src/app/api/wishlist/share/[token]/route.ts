import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params;
  const supabase = await createClient();

  try {
    // Get wishlist by share token
    const { data: wishlist, error: wishlistError } = await supabase
      .from("wishlists")
      .select("id, user_id, title, is_public")
      .eq("share_token", token)
      .single();

    if (wishlistError || !wishlist) {
      return NextResponse.json(
        { error: "Wishlist not found" },
        { status: 404 }
      );
    }

    const wishlistData = wishlist as {
      id: string;
      user_id: string;
      title: string;
      is_public: boolean;
    };

    if (!wishlistData.is_public) {
      return NextResponse.json(
        { error: "This wishlist is private" },
        { status: 403 }
      );
    }

    // Get wishlist items with product details
    const { data: items, error: itemsError } = await supabase
      .from("wishlist_items")
      .select(
        `
        id,
        product_id,
        created_at,
        products (*)
      `
      )
      .eq("user_id", wishlistData.user_id);

    if (itemsError) throw itemsError;

    // Get owner's profile
    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name")
      .eq("id", wishlistData.user_id)
      .single();

    const profileData = profile as { full_name: string | null } | null;

    return NextResponse.json({
      title: wishlistData.title,
      ownerName: profileData?.full_name || "Someone",
      items,
    });
  } catch (error) {
    console.error("Error fetching shared wishlist:", error);
    return NextResponse.json(
      { error: "Failed to fetch wishlist" },
      { status: 500 }
    );
  }
}
