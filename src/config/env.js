import dotenv from "dotenv";

dotenv.config();

const paymentProvider = (process.env.PAYMENT_PROVIDER || "demo").toLowerCase();
const requiredInProduction = [
  "MONGODB_URI",
  "JWT_SECRET",
  "SMTP_HOST",
  "SMTP_USER",
  "SMTP_PASS",
  ...(paymentProvider === "cashfree"
    ? ["CASHFREE_CLIENT_ID", "CASHFREE_CLIENT_SECRET"]
    : paymentProvider === "stripe"
      ? ["STRIPE_SECRET_KEY", "STRIPE_WEBHOOK_SECRET"]
      : []),
];

const isProduction = process.env.NODE_ENV === "production";
const missing = requiredInProduction.filter((key) => !process.env[key]);

if (isProduction && missing.length) {
  throw new Error(`Missing required production environment variables: ${missing.join(", ")}`);
}

export const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  isProduction,
  port: Number(process.env.PORT || 3000),
  appUrl: process.env.APP_URL || `http://localhost:${process.env.PORT || 3000}`,
  clientUrl: process.env.CLIENT_URL || process.env.APP_URL || `http://localhost:${process.env.PORT || 3000}`,
  mongoUri: process.env.MONGODB_URI || "",
  jwtSecret: process.env.JWT_SECRET || "development-only-change-me",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
  paymentProvider,
  cashfree: {
    clientId: process.env.CASHFREE_CLIENT_ID || "",
    clientSecret: process.env.CASHFREE_CLIENT_SECRET || "",
    webhookSecret: process.env.CASHFREE_WEBHOOK_SECRET || "",
    environment: (process.env.CASHFREE_ENV || "sandbox").toLowerCase(),
    apiVersion: process.env.CASHFREE_API_VERSION || "2025-01-01",
    currency: (process.env.CASHFREE_CURRENCY || "inr").toUpperCase(),
    baseUrl:
      (process.env.CASHFREE_ENV || "sandbox").toLowerCase() === "production"
        ? "https://api.cashfree.com/pg"
        : "https://sandbox.cashfree.com/pg",
  },
  stripeSecretKey: process.env.STRIPE_SECRET_KEY || "",
  stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET || "",
  stripeCurrency: (process.env.STRIPE_CURRENCY || "usd").toLowerCase(),
  platformFeePercent: Number(process.env.PLATFORM_FEE_PERCENT || 12),
  smtp: {
    host: process.env.SMTP_HOST || "",
    port: Number(process.env.SMTP_PORT || 587),
    secure: String(process.env.SMTP_SECURE || "false") === "true",
    user: process.env.SMTP_USER || "",
    pass: process.env.SMTP_PASS || "",
    from: process.env.MAIL_FROM || "FreelanceHub <no-reply@freelancehub.local>",
  },
  openai: {
    apiKey: process.env.OPENAI_API_KEY || "",
    model: process.env.OPENAI_MODEL || "gpt-5.6",
  },
};

export function assertRuntimeConfig() {
  if (!env.mongoUri) {
    throw new Error("MONGODB_URI is required. Add your MongoDB Atlas connection string to .env.");
  }
}
