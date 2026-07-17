import crypto from "node:crypto";
import { env } from "../config/env.js";

export function isCashfreeConfigured() {
  return Boolean(env.cashfree.clientId && env.cashfree.clientSecret);
}

export function requireCashfree() {
  if (!isCashfreeConfigured()) {
    const error = new Error("Cashfree is not configured. Add CASHFREE_CLIENT_ID and CASHFREE_CLIENT_SECRET to .env.");
    error.statusCode = 503;
    throw error;
  }

  return true;
}

export async function createCashfreeOrder(payload) {
  return cashfreeRequest("/orders", {
    method: "POST",
    body: payload,
    idempotencyKey: crypto.randomUUID(),
  });
}

export async function getCashfreeOrder(orderId) {
  return cashfreeRequest(`/orders/${encodeURIComponent(orderId)}`, { method: "GET" });
}

export function verifyCashfreeWebhook({ signature, timestamp, rawBody }) {
  const webhookSecret = env.cashfree.webhookSecret || env.cashfree.clientSecret;
  if (!signature || !timestamp || !rawBody || !webhookSecret) return false;

  const timestampNumber = Number(timestamp);
  if (!Number.isFinite(timestampNumber) || Math.abs(Date.now() - timestampNumber) > 5 * 60 * 1000) {
    return false;
  }

  const rawText = Buffer.isBuffer(rawBody) ? rawBody.toString("utf8") : String(rawBody);
  const expected = crypto
    .createHmac("sha256", webhookSecret)
    .update(`${timestamp}${rawText}`)
    .digest("base64");

  const expectedBuffer = Buffer.from(expected);
  const receivedBuffer = Buffer.from(String(signature));
  return expectedBuffer.length === receivedBuffer.length && crypto.timingSafeEqual(expectedBuffer, receivedBuffer);
}

async function cashfreeRequest(path, { method, body, idempotencyKey } = {}) {
  requireCashfree();

  const response = await fetch(`${env.cashfree.baseUrl}${path}`, {
    method,
    headers: {
      accept: "application/json",
      "content-type": "application/json",
      "x-api-version": env.cashfree.apiVersion,
      "x-client-id": env.cashfree.clientId,
      "x-client-secret": env.cashfree.clientSecret,
      "x-request-id": crypto.randomUUID(),
      ...(idempotencyKey ? { "x-idempotency-key": idempotencyKey } : {}),
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });

  const raw = await response.text();
  let data;
  try {
    data = raw ? JSON.parse(raw) : {};
  } catch {
    data = { message: raw };
  }

  if (!response.ok) {
    const error = new Error(data.message || data.type || `Cashfree request failed with status ${response.status}.`);
    error.statusCode = response.status >= 500 ? 502 : response.status;
    error.details = data;
    throw error;
  }

  return data;
}
