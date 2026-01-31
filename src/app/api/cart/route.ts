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
    const { data: cartItems, error } = await supabase
      .from("cart_items")
      .select(
        `
        id,
        quantity,
        selected_color,
        selected_size,
        products (*)
      `
      )
      .eq("user_id", user.id);

    if (error) throw error;

    return NextResponse.json({ items: cartItems });
  } catch (error) {
    console.error("Error fetching cart:", error);
    return NextResponse.json(
      { error: "Failed to fetch cart" },
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
    const { product_id, quantity, selected_color, selected_size } = body;

    const { data, error } = await supabase
      .from("cart_items")
      .upsert(
        {
          user_id: user.id,
          product_id,
          quantity,
          selected_color,
          selected_size,
        } as never,
        { onConflict: "user_id,product_id,selected_color,selected_size" }
      )
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ item: data });
  } catch (error) {
    console.error("Error adding to cart:", error);
    return NextResponse.json(
      { error: "Failed to add to cart" },
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
    const itemId = searchParams.get("id");

    if (itemId) {
      // Delete specific item
      const { error } = await supabase
        .from("cart_items")
        .delete()
        .eq("id", itemId)
        .eq("user_id", user.id);

      if (error) throw error;
    } else {
      // Clear entire cart
      const { error } = await supabase
        .from("cart_items")
        .delete()
        .eq("user_id", user.id);

      if (error) throw error;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting cart item:", error);
    return NextResponse.json(
      { error: "Failed to delete cart item" },
      { status: 500 }
    );
  }
}
