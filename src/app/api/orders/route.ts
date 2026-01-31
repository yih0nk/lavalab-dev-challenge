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
    const { data: orders, error } = await supabase
      .from("orders")
      .select(
        `
        *,
        order_items (*)
      `
      )
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) throw error;

    return NextResponse.json({ orders });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
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
    const { items, shipping_address } = body;

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "No items in order" }, { status: 400 });
    }

    // Calculate totals
    const subtotal = items.reduce(
      (sum: number, item: { price: number; quantity: number }) =>
        sum + item.price * item.quantity,
      0
    );
    const tax = subtotal * 0.08; // 8% tax
    const shipping = subtotal >= 100 ? 0 : 10; // Free shipping over $100
    const total = subtotal + tax + shipping;

    // Create order
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        user_id: user.id,
        status: "pending",
        subtotal,
        tax,
        shipping,
        total,
        shipping_address,
      } as never)
      .select()
      .single();

    if (orderError) throw orderError;
    if (!order) throw new Error("Failed to create order");

    const orderData = order as { id: string };

    // Create order items
    const orderItems = items.map(
      (item: {
        product_id: string;
        product: Record<string, unknown>;
        quantity: number;
        selected_color: string;
        selected_size?: number;
        price: number;
      }) => ({
        order_id: orderData.id,
        product_id: item.product_id,
        product_snapshot: item.product,
        quantity: item.quantity,
        selected_color: item.selected_color,
        selected_size: item.selected_size || null,
        price_at_purchase: item.price,
      })
    );

    const { error: itemsError } = await supabase
      .from("order_items")
      .insert(orderItems);

    if (itemsError) throw itemsError;

    // Update product stock
    for (const item of items) {
      await supabase
        .from("products")
        .update({ stock: item.quantity } as never)
        .eq("id", item.product_id);
    }

    // Clear the user's cart
    await supabase.from("cart_items").delete().eq("user_id", user.id);

    return NextResponse.json({ order });
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}
