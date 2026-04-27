import Stripe from "stripe";

const key = process.env.STRIPE_SECRET_KEY;

// Lazy init so the app builds even when Stripe is not yet configured.
export function getStripe(): Stripe | null {
  if (!key) return null;
  return new Stripe(key);
}

export function stripePublicKey() {
  return process.env.NEXT_PUBLIC_STRIPE_KEY || "";
}
