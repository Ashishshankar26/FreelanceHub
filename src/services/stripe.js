import Stripe from "stripe";
import { env } from "../config/env.js";

export const stripe = env.stripeSecretKey ? new Stripe(env.stripeSecretKey) : null;

export function requireStripe() {
  if (!stripe) {
    const error = new Error("Stripe is not configured. Add STRIPE_SECRET_KEY to .env.");
    error.statusCode = 503;
    throw error;
  }
  return stripe;
}

export function toStripeAmount(amount) {
  return Math.round(Number(amount) * 100);
}

export function fromStripeAmount(amount) {
  return Math.round(Number(amount || 0)) / 100;
}

export function isStripeConfigured() {
  return Boolean(stripe);
}
