import { Router } from "express";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { requireAuth } from "../middleware/auth.js";
import { Message } from "../models/Message.js";
import { Order } from "../models/Order.js";
import { Service } from "../models/Service.js";
import { getWalletSnapshot, roundMoney } from "../services/wallet.js";

export const dashboardRouter = Router();

dashboardRouter.get(
  "/",
  requireAuth,
  asyncHandler(async (req, res) => {
    const role = req.user.activeRole;
    const orderFilter = role === "freelancer" ? { freelancer: req.user._id } : { client: req.user._id };
    const [orders, unreadMessages, services, wallet] = await Promise.all([
      Order.find(orderFilter)
        .sort({ updatedAt: -1 })
        .limit(12)
        .populate("client", "name email profile")
        .populate("freelancer", "name email profile stripeOnboardingComplete")
        .populate("service", "title category price deliveryDays"),
      Message.countDocuments({ recipient: req.user._id, readAt: null }),
      role === "freelancer" ? Service.find({ seller: req.user._id }).sort({ createdAt: -1 }).limit(12) : [],
      getWalletSnapshot(req.user._id, { limit: 8 }),
    ]);

    const stats = summarizeOrders(orders, role);
    const journey = buildJourney(req.user, { role, orders, services, unreadMessages });
    res.json({
      role,
      stats: {
        ...stats,
        unreadMessages,
        publishedServices: services.length,
      },
      orders,
      services,
      journey,
      finance: buildFinance({ orders, role, wallet }),
      user: req.user.toPublicJSON(),
    });
  }),
);

function summarizeOrders(orders, role) {
  const activeStatuses = ["funded", "in_progress", "submitted", "revision_requested", "disputed"];
  const activeOrders = orders.filter((order) => activeStatuses.includes(order.status));
  const completedOrders = orders.filter((order) => order.status === "completed");
  const pendingReview = orders.filter((order) => order.status === "submitted");
  const protectedFunds = activeOrders.reduce((sum, order) => sum + order.amount, 0);
  const earned = completedOrders.reduce((sum, order) => sum + order.freelancerAmount, 0);
  const spent = completedOrders.reduce((sum, order) => sum + order.amount, 0);

  return {
    activeOrders: activeOrders.length,
    pendingReview: pendingReview.length,
    protectedFunds,
    completedOrders: completedOrders.length,
    earningsOrSpend: role === "freelancer" ? earned : spent,
  };
}

function buildFinance({ orders, role, wallet }) {
  const completed = orders.filter((order) => order.status === "completed");
  const active = orders.filter((order) => ["funded", "in_progress", "submitted", "revision_requested", "disputed"].includes(order.status));
  const incoming = role === "freelancer"
    ? completed.reduce((sum, order) => sum + order.freelancerAmount, 0)
    : wallet.credits;
  const outgoing = role === "client"
    ? orders.filter((order) => order.paymentStatus === "paid").reduce((sum, order) => sum + order.amount, 0)
    : 0;

  const months = Array.from({ length: 6 }, (_, offset) => {
    const date = new Date();
    date.setDate(1);
    date.setMonth(date.getMonth() - (5 - offset));
    return {
      key: `${date.getFullYear()}-${date.getMonth()}`,
      label: date.toLocaleDateString("en-US", { month: "short" }),
      incoming: 0,
      outgoing: 0,
    };
  });
  const monthMap = new Map(months.map((month) => [month.key, month]));

  orders.forEach((order) => {
    const date = new Date(order.createdAt || Date.now());
    const month = monthMap.get(`${date.getFullYear()}-${date.getMonth()}`);
    if (!month) return;
    if (role === "freelancer" && order.status === "completed") month.incoming += order.freelancerAmount;
    if (role === "client" && order.paymentStatus === "paid") month.outgoing += order.amount;
  });
  wallet.transactions
    .filter((transaction) => transaction.status === "succeeded" && transaction.direction === "credit")
    .forEach((transaction) => {
      const date = new Date(transaction.createdAt || Date.now());
      const month = monthMap.get(`${date.getFullYear()}-${date.getMonth()}`);
      if (month && role === "client") month.incoming += transaction.amount;
    });

  return {
    walletBalance: wallet.balance,
    walletCredits: wallet.credits,
    walletDebits: wallet.debits,
    incoming: roundMoney(incoming),
    outgoing: roundMoney(outgoing),
    protectedFunds: roundMoney(active.reduce((sum, order) => sum + order.amount, 0)),
    completedValue: roundMoney(completed.reduce((sum, order) => sum + order.amount, 0)),
    monthly: months.map((month) => ({
      ...month,
      incoming: roundMoney(month.incoming),
      outgoing: roundMoney(month.outgoing),
    })),
  };
}

function buildJourney(user, { role, orders, services, unreadMessages }) {
  const onboarding = user.onboarding || {};
  const profile = user.profile || {};
  const freelancerFields = [profile.specialty, profile.headline, profile.bio, ...(profile.skills || [])].filter(Boolean);
  const profileCompletion = role === "freelancer"
    ? Math.min(100, Math.round((freelancerFields.length / 5) * 100))
    : onboarding.clientComplete
      ? 100
      : 35;
  const nextSteps = [];

  if (role === "client") {
    if (!onboarding.clientComplete) {
      nextSteps.push(step("finish-client-onboarding", "sparkles", "Shape your workspace", "Tell us what you want to get done so we can make better starting suggestions."));
    }
    if (!orders.length) {
      nextSteps.push(step("browse-services", "search", "Find the right specialist", "Start with a focused brief or explore work by category."));
    }
    if (unreadMessages) {
      nextSteps.push(step("review-messages", "messages-square", "Review messages", `${unreadMessages} conversation update${unreadMessages === 1 ? "" : "s"} need your attention.`));
    }
  }

  if (role === "freelancer") {
    if (!onboarding.freelancerComplete) {
      nextSteps.push(step("finish-freelancer-profile", "wand-sparkles", "Finish your freelancer profile", "Turn your skills into a clear profile and a strong first service idea."));
    }
    if (!services.length) {
      nextSteps.push(step("publish-service", "file-plus-2", "Publish your first service", "Package one focused outcome clients can buy with confidence."));
    }
    if (!user.stripeOnboardingComplete) {
      nextSteps.push(step("setup-payouts", "landmark", "Set up payout details", "Add your payout method before your first completed order."));
    }
    if (unreadMessages) {
      nextSteps.push(step("review-messages", "messages-square", "Review messages", `${unreadMessages} conversation update${unreadMessages === 1 ? "" : "s"} need your attention.`));
    }
  }

  return {
    profileCompletion,
    nextSteps: nextSteps.slice(0, 3),
    greeting: role === "freelancer" ? "Build a profile people remember." : "Make your next project feel straightforward.",
  };
}

function step(id, icon, title, description) {
  return { id, icon, title, description };
}
