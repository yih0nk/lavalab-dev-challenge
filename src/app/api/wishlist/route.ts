import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Get wishlist items with product details
    const { data: wishlistItems, error: itemsError } = await supabase
      .from("wishlist_items")
      .select(
        `
        id,
        product_id,
        created_at,
        products (*)
      `
      )
      .eq("user_id", user.id);

    if (itemsError) throw itemsError;

    // Get wishlist settings
    const { data: wishlistSettings, error: settingsError } = await supabase
      .from("wishlists")
      .select("share_token, is_public, title")
      .eq("user_id", user.id)
      .single();

    // Ignore "not found" error for settings
    if (settingsError && settingsError.code !== "PGRST116") {
      throw settingsError;
    }

    return NextResponse.json({
      items: wishlistItems,
      settings: wishlistSettings || { is_public: false, title: "My Wishlist" },
    });
  } catch (error) {
    console.error("Error fetching wishlist:", error);
    return NextResponse.json(
      { error: "Failed to fetch wishlist" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { product_id } = body;

    const { data, error } = await supabase
      .from("wishlist_items")
      .upsert(
        {
          user_id: user.id,
          product_id,
        } as never,
        { onConflict: "user_id,product_id" }
      )
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ item: data });
  } catch (error) {
    console.error("Error adding to wishlist:", error);
    return NextResponse.json(
      { error: "Failed to add to wishlist" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get("product_id");

    if (!productId) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from("wishlist_items")
      .delete()
      .eq("user_id", user.id)
      .eq("product_id", productId);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error removing from wishlist:", error);
    return NextResponse.json(
      { error: "Failed to remove from wishlist" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { is_public, title } = body;

    const { data, error } = await supabase
      .from("wishlists")
      .upsert(
        {
          user_id: user.id,
          is_public,
          title,
        } as never,
        { onConflict: "user_id" }
      )
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ wishlist: data });
  } catch (error) {
    console.error("Error updating wishlist settings:", error);
    return NextResponse.json(
      { error: "Failed to update wishlist settings" },
      { status: 500 }
    );
  }
}
