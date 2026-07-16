import "server-only";
import Stripe from "stripe";

let stripeClient: Stripe | undefined;

export function getStripe() {
  const secret = process.env.STRIPE_SECRET_KEY;
  if (!secret) throw new Error("Stripe is not configured.");
  stripeClient ??= new Stripe(secret, { typescript: true, appInfo: { name: "Highground Coaching", version: "0.1.0" } });
  return stripeClient;
}
