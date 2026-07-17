import mongoose from "mongoose";

const orderEventSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    actor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    at: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false },
);

const orderSchema = new mongoose.Schema(
  {
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    freelancer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    requirements: {
      type: String,
      required: true,
      trim: true,
      maxlength: 5000,
    },
    deliveryNotes: {
      type: String,
      trim: true,
      maxlength: 5000,
    },
    status: {
      type: String,
      enum: [
        "payment_pending",
        "funded",
        "in_progress",
        "submitted",
        "revision_requested",
        "completed",
        "disputed",
        "cancelled",
        "refunded",
      ],
      default: "payment_pending",
      index: true,
    },
    paymentStatus: {
      type: String,
      enum: ["unpaid", "paid", "failed", "refunded"],
      default: "unpaid",
    },
    paymentProvider: {
      type: String,
      enum: ["demo", "cashfree", "stripe"],
      default: "demo",
      index: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 1,
    },
    platformFee: {
      type: Number,
      required: true,
      min: 0,
    },
    freelancerAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    currency: {
      type: String,
      required: true,
      default: "usd",
    },
    dueAt: Date,
    fundedAt: Date,
    submittedAt: Date,
    completedAt: Date,
    disputedAt: Date,
    cashfreeOrderId: {
      type: String,
      index: true,
    },
    cashfreeCfOrderId: String,
    cashfreePaymentSessionId: String,
    cashfreePaymentId: String,
    stripeCheckoutSessionId: {
      type: String,
      index: true,
    },
    stripePaymentIntentId: String,
    stripeTransferId: String,
    stripeTransferGroup: String,
    disputeReason: {
      type: String,
      trim: true,
      maxlength: 3000,
    },
    events: [orderEventSchema],
  },
  { timestamps: true },
);

orderSchema.methods.addEvent = function addEvent(type, message, actor) {
  this.events.push({ type, message, actor });
};

export const Order = mongoose.model("Order", orderSchema);
