import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 80,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    passwordHash: {
      type: String,
      required: true,
      select: false,
    },
    roles: [
      {
        type: String,
        enum: ["client", "freelancer", "admin"],
        required: true,
      },
    ],
    activeRole: {
      type: String,
      enum: ["client", "freelancer", "admin"],
      default: "client",
    },
    profile: {
      headline: { type: String, trim: true, maxlength: 120 },
      bio: { type: String, trim: true, maxlength: 1200 },
      skills: [{ type: String, trim: true, maxlength: 40 }],
      country: { type: String, trim: true, maxlength: 80 },
      specialty: { type: String, trim: true, maxlength: 80 },
      experienceLevel: { type: String, trim: true, maxlength: 40 },
      availability: { type: String, trim: true, maxlength: 60 },
      targetClient: { type: String, trim: true, maxlength: 120 },
      avatarColor: { type: String, default: "#13715F" },
    },
    onboarding: {
      roleChoiceComplete: { type: Boolean, default: false },
      clientComplete: { type: Boolean, default: false },
      freelancerComplete: { type: Boolean, default: false },
      clientFocus: { type: String, trim: true, maxlength: 240 },
      completedAt: Date,
    },
    stripeCustomerId: String,
    stripeAccountId: String,
    stripeOnboardingComplete: {
      type: Boolean,
      default: false,
    },
    phone: {
      type: String,
      trim: true,
      maxlength: 20,
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
    lastLoginAt: Date,
  },
  { timestamps: true },
);

userSchema.methods.toPublicJSON = function toPublicJSON() {
  return {
    id: this._id.toString(),
    name: this.name,
    email: this.email,
    roles: this.roles,
    activeRole: this.activeRole,
    profile: this.profile,
    onboarding: {
      roleChoiceComplete: Boolean(this.onboarding?.roleChoiceComplete),
      clientComplete: Boolean(this.onboarding?.clientComplete),
      freelancerComplete: Boolean(this.onboarding?.freelancerComplete),
      clientFocus: this.onboarding?.clientFocus || "",
      completedAt: this.onboarding?.completedAt || null,
    },
    stripeOnboardingComplete: this.stripeOnboardingComplete,
    createdAt: this.createdAt,
  };
};

export const User = mongoose.model("User", userSchema);
