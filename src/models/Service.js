import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema(
  {
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 12,
      maxlength: 140,
    },
    category: {
      type: String,
      required: true,
      enum: ["design", "tech", "marketing", "video", "writing", "business", "ai"],
      index: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      minlength: 40,
      maxlength: 1600,
    },
    price: {
      type: Number,
      required: true,
      min: 5,
      max: 50000,
    },
    deliveryDays: {
      type: Number,
      required: true,
      min: 1,
      max: 90,
    },
    revisions: {
      type: Number,
      default: 1,
      min: 0,
      max: 20,
    },
    tags: [{ type: String, trim: true, maxlength: 40 }],
    status: {
      type: String,
      enum: ["draft", "active", "paused", "archived"],
      default: "active",
      index: true,
    },
    ratingAverage: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    ratingCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    coverTheme: {
      type: String,
      default: "theme-design",
    },
    icon: {
      type: String,
      default: "sparkles",
    },
  },
  { timestamps: true },
);

serviceSchema.index({ title: "text", description: "text", tags: "text", category: "text" });

export const Service = mongoose.model("Service", serviceSchema);
