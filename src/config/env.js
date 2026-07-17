import dotenv from "dotenv";

dotenv.config();

const requiredInProduction = [
  "JWT_SECRET",
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
  paymentProvider: "demo",
  platformFeePercent: Number(process.env.PLATFORM_FEE_PERCENT || 12),
  smtp: {
    host: process.env.SMTP_HOST || "",
    port: Number(process.env.SMTP_PORT || 587),
    secure: String(process.env.SMTP_SECURE || "false") === "true",
    user: process.env.SMTP_USER || "",
    pass: process.env.SMTP_PASS || "",
    from: process.env.MAIL_FROM || "FreelanceHub <no-reply@freelancehub.local>",
  },
  googleClientId: process.env.GOOGLE_CLIENT_ID || "",
  openai: {
    apiKey: process.env.OPENAI_API_KEY || "",
    model: process.env.OPENAI_MODEL || "gpt-5.6",
  },
};

export function assertRuntimeConfig() {
  if (!env.mongoUri) {
    console.warn("Warning: MONGODB_URI not set. App will start without database connectivity.");
  }
}
