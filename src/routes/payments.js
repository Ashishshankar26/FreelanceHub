import { Router } from "express";
import { z } from "zod";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { requireAuth, requireRole } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { User } from "../models/User.js";
import { WalletTransaction } from "../models/WalletTransaction.js";
import { env } from "../config/env.js";
import { createCashfreeOrder, requireCashfree } from "../services/cashfree.js";
import { requireStripe, toStripeAmount } from "../services/stripe.js";
import { getWalletSnapshot } from "../services/wallet.js";

export const paymentsRouter = Router();

const walletTopUpSchema = z.object({
  body: z.object({
    amount: z.coerce.number().min(50).max(100000),
    phone: z.string().trim().regex(/^\+?[0-9]{10,15}$/).optional().or(z.literal("")),
  }),
});

paymentsRouter.get(
  "/wallet",
  requireAuth,
  asyncHandler(async (req, res) => {
    const wallet = await getWalletSnapshot(req.user._id);
    res.json({
      wallet: {
        ...wallet,
        currency: env.paymentProvider === "stripe" ? env.stripeCurrency.toUpperCase() : env.cashfree.currency,
        provider: env.paymentProvider,
        phone: req.user.phone || "",
      },
    });
  }),
);

paymentsRouter.post(
  "/wallet/top-up",
  requireAuth,
  validate(walletTopUpSchema),
  asyncHandler(async (req, res) => {
    const amount = Math.round(req.validated.body.amount * 100) / 100;
    const suppliedPhone = req.validated.body.phone || "";
    const isCashfree = env.paymentProvider === "cashfree";

    if (env.paymentProvider === "demo") {
      const transaction = await WalletTransaction.create({
        user: req.user._id,
        type: "top_up",
        direction: "credit",
        amount,
        currency: "INR",
        status: "succeeded",
        paymentProvider: "demo",
        description: "Demo wallet top-up",
        completedAt: new Date(),
      });
      const wallet = await getWalletSnapshot(req.user._id);
      return res.status(201).json({
        transactionId: transaction._id,
        paymentProvider: "demo",
        demoConfirmed: true,
        wallet,
      });
    }

    if (isCashfree) {
      requireCashfree();
      const customerPhone = suppliedPhone || req.user.phone || (env.cashfree.environment === "sandbox" ? "9999999999" : "");
      if (!customerPhone) {
        const error = new Error("Add a mobile number before funding your wallet with a live Cashfree payment.");
        error.statusCode = 400;
        throw error;
      }
      if (customerPhone !== req.user.phone) {
        req.user.phone = customerPhone;
        await req.user.save();
      }

      const transaction = await WalletTransaction.create({
        user: req.user._id,
        type: "top_up",
        direction: "credit",
        amount,
        currency: env.cashfree.currency,
        paymentProvider: "cashfree",
        description: "Wallet top-up",
      });
      const cashfreeOrderId = `fh_wallet_${transaction._id.toString()}`;
      const order = await createCashfreeOrder({
        order_id: cashfreeOrderId,
        order_amount: amount,
        order_currency: env.cashfree.currency,
        customer_details: {
          customer_id: req.user._id.toString(),
          customer_name: req.user.name,
          customer_email: req.user.email,
          customer_phone: customerPhone,
        },
        order_meta: {
          return_url: `${env.clientUrl}/?wallet=return&transaction=${transaction._id.toString()}`,
          notify_url: `${env.appUrl}/api/webhooks/cashfree`,
        },
        order_note: `FreelanceHub wallet top-up ${transaction._id.toString()}`,
        order_tags: {
          kind: "wallet_top_up",
          walletTransactionId: transaction._id.toString(),
          userId: req.user._id.toString(),
        },
      });
      transaction.cashfreeOrderId = order.order_id || cashfreeOrderId;
      await transaction.save();
      return res.status(201).json({
        transactionId: transaction._id,
        paymentProvider: "cashfree",
        paymentMode: env.cashfree.environment,
        paymentSessionId: order.payment_session_id,
      });
    }

    const stripe = requireStripe();
    if (!req.user.stripeCustomerId) {
      const customer = await stripe.customers.create({
        email: req.user.email,
        name: req.user.name,
        metadata: { userId: req.user._id.toString() },
      });
      req.user.stripeCustomerId = customer.id;
      await req.user.save();
    }

    const transaction = await WalletTransaction.create({
      user: req.user._id,
      type: "top_up",
      direction: "credit",
      amount,
      currency: env.stripeCurrency.toUpperCase(),
      paymentProvider: "stripe",
      description: "Wallet top-up",
    });
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer: req.user.stripeCustomerId,
      line_items: [
        {
          price_data: {
            currency: env.stripeCurrency,
            product_data: { name: "FreelanceHub wallet credit" },
            unit_amount: toStripeAmount(amount),
          },
          quantity: 1,
        },
      ],
      success_url: `${env.clientUrl}/?wallet=return&transaction=${transaction._id.toString()}`,
      cancel_url: `${env.clientUrl}/?wallet=cancelled&transaction=${transaction._id.toString()}`,
      metadata: {
        kind: "wallet_top_up",
        walletTransactionId: transaction._id.toString(),
        userId: req.user._id.toString(),
      },
      payment_intent_data: {
        metadata: {
          kind: "wallet_top_up",
          walletTransactionId: transaction._id.toString(),
        },
      },
    });
    transaction.stripeCheckoutSessionId = session.id;
    await transaction.save();
    return res.status(201).json({ transactionId: transaction._id, paymentProvider: "stripe", checkoutUrl: session.url });
  }),
);

paymentsRouter.post(
  "/connect/onboard",
  requireAuth,
  requireRole("freelancer"),
  asyncHandler(async (req, res) => {
    if (env.paymentProvider === "demo") {
      return res.json({ demo: true });
    }
    if (env.paymentProvider !== "stripe") {
      const error = new Error("Cashfree Easy Split seller onboarding must be activated before payouts can be connected.");
      error.statusCode = 503;
      throw error;
    }

    const stripe = requireStripe();
    let accountId = req.user.stripeAccountId;

    if (!accountId) {
      const account = await stripe.accounts.create({
        type: "express",
        email: req.user.email,
        business_type: "individual",
        capabilities: {
          transfers: { requested: true },
        },
        metadata: {
          userId: req.user._id.toString(),
        },
      });
      accountId = account.id;
      req.user.stripeAccountId = accountId;
      await req.user.save();
    }

    const accountLink = await stripe.accountLinks.create({
      account: accountId,
      refresh_url: `${env.clientUrl}/?connect=refresh`,
      return_url: `${env.clientUrl}/?connect=return`,
      type: "account_onboarding",
    });

    res.json({ url: accountLink.url });
  }),
);

paymentsRouter.get(
  "/connect/status",
  requireAuth,
  requireRole("freelancer"),
  asyncHandler(async (req, res) => {
    if (env.paymentProvider === "demo") {
      return res.json({ connected: true, onboardingComplete: true, provider: "demo" });
    }

    if (env.paymentProvider === "cashfree") {
      return res.json({ connected: false, onboardingComplete: false, provider: "cashfree" });
    }

    if (!req.user.stripeAccountId) {
      return res.json({ connected: false, onboardingComplete: false });
    }

    const stripe = requireStripe();
    const account = await stripe.accounts.retrieve(req.user.stripeAccountId);
    const onboardingComplete = Boolean(account.details_submitted && account.payouts_enabled);

    if (req.user.stripeOnboardingComplete !== onboardingComplete) {
      await User.findByIdAndUpdate(req.user._id, { stripeOnboardingComplete: onboardingComplete });
    }

    return res.json({
      connected: true,
      onboardingComplete,
      payoutsEnabled: account.payouts_enabled,
      chargesEnabled: account.charges_enabled,
    });
  }),
);
