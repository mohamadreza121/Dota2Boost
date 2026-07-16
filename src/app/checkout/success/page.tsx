import type { Metadata } from "next";
import { PaymentConfirmation } from "@/components/commerce/payment-confirmation";

export const metadata: Metadata = { title: "Payment Confirmation", robots: { index: false, follow: false } };

export default async function CheckoutSuccessPage({ searchParams }: { searchParams: Promise<{ session_id?: string }> }) {
  const { session_id: sessionId } = await searchParams;
  return <PaymentConfirmation sessionId={sessionId} />;
}
