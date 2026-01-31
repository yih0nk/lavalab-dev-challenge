import { Resend } from "resend";
import { NextResponse } from "next/server";
import OrderConfirmationEmail from "@/components/emails/OrderConfirmation";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const {
            customerEmail,
            customerName,
            orderNumber,
            orderDate,
            items,
            subtotal,
            tax,
            shipping,
            total,
            shippingAddress,
        } = body;

        // Validate required fields
        if (!customerEmail || !orderNumber) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        const { data, error } = await resend.emails.send({
            from: "SHOPALL <onboarding@resend.dev>",
            to: [customerEmail],
            subject: `Order Confirmed - #${orderNumber}`,
            react: OrderConfirmationEmail({
                customerName: customerName || "Valued Customer",
                orderNumber,
                orderDate: orderDate || new Date().toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                }),
                items: items || [],
                subtotal: subtotal || 0,
                tax: tax || 0,
                shipping: shipping || 0,
                total: total || 0,
                shippingAddress: shippingAddress || {
                    street: "",
                    city: "",
                    state: "",
                    zipCode: "",
                    country: "",
                },
            }),
        });

        if (error) {
            console.error("Resend error:", error);
            return NextResponse.json(
                { error: "Failed to send email" },
                { status: 500 }
            );
        }

        return NextResponse.json({ success: true, data });
    } catch (error) {
        console.error("Error sending order email:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
