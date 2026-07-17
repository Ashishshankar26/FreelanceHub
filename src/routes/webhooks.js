import { env } from "../config/env.js";
import { Order } from "../models/Order.js";
import { User } from "../models/User.js";
import { WalletTransaction } from "../models/WalletTransaction.js";
import { getCashfreeOrder, requireCashfree, verifyCashfreeWebhook } from "../services/cashfree.js";
import { sendOrderEmail } from "../services/mailer.js";
import { requireStripe } from "../services/stripe.js";

export async function stripeWebhookHandler(req, res, next) {
  try {
    const stripe = requireStripe();
    const signature = req.headers["stripe-signature"];
    const event = env.stripeWebhookSecret
      ? stripe.webhooks.constructEvent(req.body, signature, env.stripeWebhookSecret)
      : JSON.parse(req.body.toString("utf8"));

    if (event.type === "checkout.session.completed") {
      if (event.data.object.metadata?.walletTransactionId) {
        await handleStripeWalletTopUp(event.data.object);
      } else {
        await handleCheckoutCompleted(event.data.object);
      }
    }

    if (event.type === "payment_intent.payment_failed") {
      await handlePaymentFailed(event.data.object);
    }

    if (event.type === "account.updated") {
      await handleAccountUpdated(event.data.object);
    }

    res.json({ received: true });
  } catch (error) {
    next(error);
  }
}

export async function cashfreeWebhookHandler(req, res, next) {
  try {
    requireCashfree();
    const signature = req.headers["x-webhook-signature"];
    const timestamp = req.headers["x-webhook-timestamp"];
    const rawBody = Buffer.isBuffer(req.body) ? req.body : Buffer.from(String(req.body || ""));

    if (!verifyCashfreeWebhook({ signature, timestamp, rawBody })) {
      const error = new Error("Invalid Cashfree webhook signature.");
      error.statusCode = 400;
      throw error;
    }

    const payload = JSON.parse(rawBody.toString("utf8"));
    const type = String(payload.type || payload.event || "").toUpperCase();
    const orderData = payload.data?.order || payload.data?.order_details || {};
    const paymentData = payload.data?.payment || payload.data?.payment_details || {};
    const cashfreeOrderId = orderData.order_id || payload.data?.order_id || payload.order_id;

    if (!cashfreeOrderId) {
      return res.json({ received: true });
    }

    if (type.includes("SUCCESS") || String(paymentData.payment_status).toUpperCase() === "SUCCESS") {
      const walletTransaction = await WalletTransaction.findOne({ cashfreeOrderId });
      if (walletTransaction) {
        await handleCashfreeWalletTopUp(cashfreeOrderId, paymentData, walletTransaction);
      } else {
        await handleCashfreePaymentSuccess(cashfreeOrderId, paymentData);
      }
    } else if (type.includes("FAILED") || String(paymentData.payment_status).toUpperCase() === "FAILED") {
      const walletTransaction = await WalletTransaction.findOne({ cashfreeOrderId });
      if (walletTransaction && walletTransaction.status === "pending") {
        walletTransaction.status = "failed";
        await walletTransaction.save();
      } else {
        await handleCashfreePaymentFailed(cashfreeOrderId);
      }
    }

    res.json({ received: true });
  } catch (error) {
    next(error);
  }
}

async function handleStripeWalletTopUp(session) {
  const transactionId = session.metadata?.walletTransactionId;
  if (!transactionId) return;
  const transaction = await WalletTransaction.findById(transactionId);
  if (!transaction || transaction.status === "succeeded") return;

  transaction.status = "succeeded";
  transaction.completedAt = new Date();
  transaction.stripeCheckoutSessionId = session.id;
  transaction.stripePaymentIntentId = typeof session.payment_intent === "string" ? session.payment_intent : session.payment_intent?.id;
  await transaction.save();
  await sendWalletTopUpEmail(transaction);
}

async function handleCashfreeWalletTopUp(cashfreeOrderId, paymentData, transaction) {
  const verifiedOrder = await getCashfreeOrder(cashfreeOrderId);
  if (String(verifiedOrder.order_status).toUpperCase() !== "PAID" || transaction.status === "succeeded") return;

  transaction.status = "succeeded";
  transaction.completedAt = new Date();
  transaction.cashfreePaymentId = paymentData.cf_payment_id || paymentData.payment_id;
  await transaction.save();
  await sendWalletTopUpEmail(transaction);
}

async function sendWalletTopUpEmail(transaction) {
  const user = await User.findById(transaction.user).select("name email");
  if (!user) return;
  await sendOrderEmail({
    user,
    subject: "Wallet funds added",
    title: "Wallet funded",
    message: `${transaction.amount} ${transaction.currency} was added to your FreelanceHub wallet after payment verification.`,
  });
}

async function handleCheckoutCompleted(session) {
  const orderId = session.metadata?.orderId;
  if (!orderId) return;

  const order = await Order.findById(orderId)
    .populate("client", "name email")
    .populate("freelancer", "name email");
  if (!order || order.paymentStatus === "paid") return;

  order.status = "funded";
  order.paymentStatus = "paid";
  order.fundedAt = new Date();
  order.stripeCheckoutSessionId = session.id;
  order.stripePaymentIntentId =
    typeof session.payment_intent === "string" ? session.payment_intent : session.payment_intent?.id;
  order.addEvent("payment_confirmed", "Stripe confirmed the client payment.");
  await order.save();

  await Promise.all([
    sendOrderEmail({
      user: order.client,
      subject: "Payment secured",
      title: "Payment secured",
      message: `Your payment for "${order.title}" is funded and protected until delivery is approved.`,
    }),
    sendOrderEmail({
      user: order.freelancer,
      subject: "New funded order",
      title: "New funded order",
      message: `${order.client.name} funded "${order.title}". You can start work from your freelancer dashboard.`,
    }),
  ]);
}

async function handlePaymentFailed(paymentIntent) {
  const orderId = paymentIntent.metadata?.orderId;
  if (!orderId) return;

  await Order.findByIdAndUpdate(orderId, {
    status: "payment_pending",
    paymentStatus: "failed",
    $push: {
      events: {
        type: "payment_failed",
        message: "Stripe reported a failed payment attempt.",
        at: new Date(),
      },
    },
  });
}

async function handleAccountUpdated(account) {
  const onboardingComplete = Boolean(account.details_submitted && account.payouts_enabled);
  await User.findOneAndUpdate(
    { stripeAccountId: account.id },
    { stripeOnboardingComplete: onboardingComplete },
  );
}

async function handleCashfreePaymentSuccess(cashfreeOrderId, paymentData) {
  const verifiedOrder = await getCashfreeOrder(cashfreeOrderId);
  if (String(verifiedOrder.order_status).toUpperCase() !== "PAID") return;

  const order = await Order.findOne({ cashfreeOrderId })
    .populate("client", "name email")
    .populate("freelancer", "name email");
  if (!order || order.paymentStatus === "paid") return;

  order.status = "funded";
  order.paymentStatus = "paid";
  order.fundedAt = new Date();
  order.cashfreePaymentId = paymentData.cf_payment_id || paymentData.payment_id;
  order.addEvent("payment_confirmed", "Cashfree confirmed the client payment.");
  await order.save();

  await Promise.all([
    sendOrderEmail({
      user: order.client,
      subject: "Payment secured",
      title: "Payment secured",
      message: `Your payment for "${order.title}" is funded and protected until delivery is approved.`,
    }),
    sendOrderEmail({
      user: order.freelancer,
      subject: "New funded order",
      title: "New funded order",
      message: `${order.client.name} funded "${order.title}". You can start work from your freelancer dashboard.`,
    }),
  ]);
}

async function handleCashfreePaymentFailed(cashfreeOrderId) {
  await Order.findOneAndUpdate(
    { cashfreeOrderId },
    {
      status: "payment_pending",
      paymentStatus: "failed",
      $push: {
        events: {
          type: "payment_failed",
          message: "Cashfree reported a failed payment attempt.",
          at: new Date(),
        },
      },
    },
  );
}
