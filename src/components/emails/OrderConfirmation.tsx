import {
    Body,
    Container,
    Column,
    Head,
    Heading,
    Hr,
    Html,
    Preview,
    Row,
    Section,
    Text,
} from "@react-email/components";

interface OrderItem {
    name: string;
    quantity: number;
    price: number;
    color: string;
    size?: number;
}

interface OrderConfirmationEmailProps {
    customerName: string;
    orderNumber: string;
    orderDate: string;
    items: OrderItem[];
    subtotal: number;
    tax: number;
    shipping: number;
    total: number;
    shippingAddress: {
        street: string;
        city: string;
        state: string;
        zipCode: string;
        country: string;
    };
}

// Helper to get a readable color name from hex
const getColorName = (color: string): string => {
    const colorMap: Record<string, string> = {
        "#000000": "Black",
        "#FFFFFF": "White",
        "#FF0000": "Red",
        "#00FF00": "Green",
        "#0000FF": "Blue",
        "#FFFF00": "Yellow",
        "#FF6B00": "Orange",
        "#800080": "Purple",
        "#FFC0CB": "Pink",
        "#808080": "Gray",
        "#A52A2A": "Brown",
        "#000080": "Navy",
        "#008080": "Teal",
        "#F5F5DC": "Beige",
    };
    return colorMap[color.toUpperCase()] || color;
};

export default function OrderConfirmationEmail({
    customerName,
    orderNumber,
    orderDate,
    items,
    subtotal,
    tax,
    shipping,
    total,
    shippingAddress,
}: OrderConfirmationEmailProps) {
    return (
        <Html>
            <Head>
                <style>
                    {`
                        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap');
                    `}
                </style>
            </Head>
            <Preview>Your SHOPALL order #{orderNumber} has been confirmed!</Preview>
            <Body style={main}>
                <Container style={container}>
                    {/* Header */}
                    <Section style={header}>
                        <Heading style={logo}>SHOPALL</Heading>
                    </Section>

                    {/* Success Banner */}
                    <Section style={successBanner}>
                        <Text style={checkmark}>✓</Text>
                        <Heading style={successTitle}>Order Confirmed!</Heading>
                        <Text style={successSubtitle}>
                            We&apos;ve received your order and are getting it ready.
                        </Text>
                    </Section>

                    {/* Order Confirmation */}
                    <Section style={content}>
                        <Text style={greeting}>
                            Hi {customerName},
                        </Text>
                        <Text style={paragraph}>
                            Thank you for shopping with SHOPALL! Your order has been confirmed and will be shipped soon. We&apos;ll send you a shipping confirmation email once your items are on the way.
                        </Text>

                        {/* Order Details Box */}
                        <Section style={orderInfoBox}>
                            <Row>
                                <Column style={orderInfoColumn}>
                                    <Text style={orderInfoLabel}>Order Number</Text>
                                    <Text style={orderInfoValue}>#{orderNumber}</Text>
                                </Column>
                                <Column style={orderInfoColumn}>
                                    <Text style={orderInfoLabel}>Order Date</Text>
                                    <Text style={orderInfoValue}>{orderDate}</Text>
                                </Column>
                                <Column style={orderInfoColumn}>
                                    <Text style={orderInfoLabel}>Total</Text>
                                    <Text style={orderInfoValueHighlight}>${total.toFixed(2)}</Text>
                                </Column>
                            </Row>
                        </Section>

                        <Hr style={hr} />

                        {/* Order Items */}
                        <Heading style={h2}>Items Ordered</Heading>

                        {items.map((item, index) => (
                            <Section key={index} style={itemContainer}>
                                <Row>
                                    <Column style={itemDetails}>
                                        <Text style={itemName}>{item.name}</Text>
                                        <Row style={itemMeta}>
                                            <Column style={colorSwatchContainer}>
                                                <div
                                                    style={{
                                                        ...colorSwatch,
                                                        backgroundColor: item.color,
                                                    }}
                                                />
                                            </Column>
                                            <Column>
                                                <Text style={itemMetaText}>
                                                    {getColorName(item.color)}
                                                    {item.size ? ` • Size ${item.size}` : ""}
                                                    {` • Qty: ${item.quantity}`}
                                                </Text>
                                            </Column>
                                        </Row>
                                    </Column>
                                    <Column style={itemPriceColumn}>
                                        <Text style={itemPrice}>${(item.price * item.quantity).toFixed(2)}</Text>
                                        {item.quantity > 1 && (
                                            <Text style={itemUnitPrice}>${item.price.toFixed(2)} each</Text>
                                        )}
                                    </Column>
                                </Row>
                            </Section>
                        ))}

                        <Hr style={hr} />

                        {/* Order Totals */}
                        <Section style={totalsSection}>
                            <Row style={totalRow}>
                                <Column>
                                    <Text style={totalLabel}>Subtotal</Text>
                                </Column>
                                <Column style={totalValueColumn}>
                                    <Text style={totalValue}>${subtotal.toFixed(2)}</Text>
                                </Column>
                            </Row>
                            <Row style={totalRow}>
                                <Column>
                                    <Text style={totalLabel}>Shipping</Text>
                                </Column>
                                <Column style={totalValueColumn}>
                                    <Text style={shipping === 0 ? freeShipping : totalValue}>
                                        {shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}
                                    </Text>
                                </Column>
                            </Row>
                            <Row style={totalRow}>
                                <Column>
                                    <Text style={totalLabel}>Tax</Text>
                                </Column>
                                <Column style={totalValueColumn}>
                                    <Text style={totalValue}>${tax.toFixed(2)}</Text>
                                </Column>
                            </Row>
                            <Hr style={totalsDivider} />
                            <Row style={grandTotalRow}>
                                <Column>
                                    <Text style={grandTotalLabel}>Total</Text>
                                </Column>
                                <Column style={totalValueColumn}>
                                    <Text style={grandTotalValue}>${total.toFixed(2)}</Text>
                                </Column>
                            </Row>
                        </Section>

                        <Hr style={hr} />

                        {/* Shipping Address */}
                        <Heading style={h2}>Shipping To</Heading>
                        <Section style={addressBox}>
                            <Text style={addressText}>
                                {shippingAddress.street !== "Not provided" ? (
                                    <>
                                        {shippingAddress.street}
                                        <br />
                                        {shippingAddress.city}
                                        {shippingAddress.state && `, ${shippingAddress.state}`}
                                        {shippingAddress.zipCode && ` ${shippingAddress.zipCode}`}
                                        <br />
                                        {shippingAddress.country}
                                    </>
                                ) : (
                                    "Address not provided"
                                )}
                            </Text>
                        </Section>

                        <Hr style={hr} />

                        {/* Help Section */}
                        <Section style={helpSection}>
                            <Text style={helpTitle}>Need Help?</Text>
                            <Text style={helpText}>
                                If you have any questions about your order, feel free to contact our customer support team. We&apos;re here to help!
                            </Text>
                        </Section>
                    </Section>

                    {/* Footer */}
                    <Section style={footer}>
                        <Text style={footerText}>
                            Thank you for shopping with SHOPALL!
                        </Text>
                        <Text style={footerCopy}>
                            © {new Date().getFullYear()} SHOPALL. All rights reserved.
                        </Text>
                    </Section>
                </Container>
            </Body>
        </Html>
    );
}

// Styles
const main = {
    backgroundColor: "#f4f4f5",
    fontFamily: "'Space Grotesk', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    padding: "40px 0",
};

const container = {
    backgroundColor: "#ffffff",
    margin: "0 auto",
    maxWidth: "600px",
    borderRadius: "12px",
    overflow: "hidden",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.05)",
};

const header = {
    backgroundColor: "#1a1a1a",
    padding: "32px 24px",
    textAlign: "center" as const,
};

const logo = {
    color: "#ffffff",
    fontSize: "32px",
    fontWeight: "700",
    margin: "0",
    letterSpacing: "3px",
};

const successBanner = {
    backgroundColor: "#ecfdf5",
    padding: "32px 24px",
    textAlign: "center" as const,
    borderBottom: "1px solid #d1fae5",
};

const checkmark = {
    fontSize: "48px",
    color: "#10b981",
    margin: "0 0 8px",
};

const successTitle = {
    color: "#065f46",
    fontSize: "24px",
    fontWeight: "700",
    margin: "0 0 8px",
};

const successSubtitle = {
    color: "#047857",
    fontSize: "14px",
    margin: "0",
};

const content = {
    padding: "32px 24px",
};

const greeting = {
    color: "#1a1a1a",
    fontSize: "16px",
    fontWeight: "600",
    margin: "0 0 12px",
};

const paragraph = {
    color: "#52525b",
    fontSize: "14px",
    lineHeight: "24px",
    margin: "0 0 24px",
};

const orderInfoBox = {
    backgroundColor: "#fafafa",
    borderRadius: "12px",
    padding: "20px",
    border: "1px solid #e4e4e7",
};

const orderInfoColumn = {
    textAlign: "center" as const,
};

const orderInfoLabel = {
    color: "#71717a",
    fontSize: "11px",
    fontWeight: "500",
    textTransform: "uppercase" as const,
    letterSpacing: "0.5px",
    margin: "0 0 4px",
};

const orderInfoValue = {
    color: "#1a1a1a",
    fontSize: "15px",
    fontWeight: "600",
    margin: "0",
};

const orderInfoValueHighlight = {
    color: "#1a1a1a",
    fontSize: "18px",
    fontWeight: "700",
    margin: "0",
};

const h2 = {
    color: "#1a1a1a",
    fontSize: "16px",
    fontWeight: "600",
    margin: "0 0 16px",
    textTransform: "uppercase" as const,
    letterSpacing: "0.5px",
};

const hr = {
    borderColor: "#e4e4e7",
    borderWidth: "1px",
    margin: "24px 0",
};

const itemContainer = {
    backgroundColor: "#fafafa",
    borderRadius: "8px",
    padding: "16px",
    marginBottom: "12px",
};

const itemDetails = {
    verticalAlign: "top" as const,
};

const itemName = {
    color: "#1a1a1a",
    fontSize: "15px",
    fontWeight: "600",
    margin: "0 0 8px",
};

const itemMeta = {
    verticalAlign: "middle" as const,
};

const colorSwatchContainer = {
    width: "24px",
    verticalAlign: "middle" as const,
};

const colorSwatch = {
    width: "16px",
    height: "16px",
    borderRadius: "50%",
    border: "2px solid #e4e4e7",
    display: "inline-block",
};

const itemMetaText = {
    color: "#71717a",
    fontSize: "13px",
    margin: "0",
    verticalAlign: "middle" as const,
};

const itemPriceColumn = {
    textAlign: "right" as const,
    verticalAlign: "top" as const,
    width: "100px",
};

const itemPrice = {
    color: "#1a1a1a",
    fontSize: "15px",
    fontWeight: "600",
    margin: "0",
};

const itemUnitPrice = {
    color: "#a1a1aa",
    fontSize: "12px",
    margin: "4px 0 0",
};

const totalsSection = {
    padding: "0",
};

const totalRow = {
    marginBottom: "8px",
};

const totalLabel = {
    color: "#52525b",
    fontSize: "14px",
    margin: "0",
};

const totalValueColumn = {
    textAlign: "right" as const,
};

const totalValue = {
    color: "#1a1a1a",
    fontSize: "14px",
    margin: "0",
};

const freeShipping = {
    color: "#10b981",
    fontSize: "14px",
    fontWeight: "600",
    margin: "0",
};

const totalsDivider = {
    borderColor: "#e4e4e7",
    margin: "16px 0",
};

const grandTotalRow = {
    marginTop: "8px",
};

const grandTotalLabel = {
    color: "#1a1a1a",
    fontSize: "16px",
    fontWeight: "700",
    margin: "0",
};

const grandTotalValue = {
    color: "#1a1a1a",
    fontSize: "20px",
    fontWeight: "700",
    margin: "0",
};

const addressBox = {
    backgroundColor: "#fafafa",
    borderRadius: "8px",
    padding: "16px",
    border: "1px solid #e4e4e7",
};

const addressText = {
    color: "#52525b",
    fontSize: "14px",
    lineHeight: "22px",
    margin: "0",
};

const helpSection = {
    backgroundColor: "#f0f9ff",
    borderRadius: "8px",
    padding: "20px",
    textAlign: "center" as const,
};

const helpTitle = {
    color: "#0369a1",
    fontSize: "14px",
    fontWeight: "600",
    margin: "0 0 8px",
};

const helpText = {
    color: "#0c4a6e",
    fontSize: "13px",
    lineHeight: "20px",
    margin: "0",
};

const footer = {
    backgroundColor: "#1a1a1a",
    padding: "32px 24px",
    textAlign: "center" as const,
};

const footerText = {
    color: "#ffffff",
    fontSize: "14px",
    fontWeight: "500",
    margin: "0 0 8px",
};

const footerCopy = {
    color: "#a1a1aa",
    fontSize: "12px",
    margin: "0",
};
