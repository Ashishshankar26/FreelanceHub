import mongoose from "mongoose";

const walletTransactionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: ["top_up", "purchase", "refund", "adjustment"],
      required: true,
      default: "top_up",
    },
    direction: {
      type: String,
      enum: ["credit", "debit"],
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 1,
    },
    currency: {
      type: String,
      required: true,
      default: "INR",
    },
    status: {
      type: String,
      enum: ["pending", "succeeded", "failed", "cancelled"],
      default: "pending",
      index: true,
    },
    paymentProvider: {
      type: String,
      enum: ["demo"],
      required: true,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 240,
    },
    completedAt: Date,
  },
  { timestamps: true },
);

walletTransactionSchema.index({ user: 1, createdAt: -1 });

export const WalletTransaction = mongoose.model("WalletTransaction", walletTransactionSchema);
