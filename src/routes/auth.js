import bcrypt from "bcryptjs";
import { Router } from "express";
import { z } from "zod";
import { OAuth2Client } from "google-auth-library";
import { User } from "../models/User.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { requireAuth } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { sendLoginEmail, sendWelcomeEmail } from "../services/mailer.js";
import { authCookieOptions, signAuthToken } from "../services/tokens.js";
import { env } from "../config/env.js";

export const authRouter = Router();
const googleClient = new OAuth2Client(env.googleClientId);

const signupSchema = z.object({
  body: z.object({
    name: z.string().trim().min(2).max(80),
    email: z.string().trim().email().max(160),
    password: z.string().min(8).max(128),
    role: z.enum(["client", "freelancer", "both"]).default("client"),
  }),
});

const loginSchema = z.object({
  body: z.object({
    email: z.string().trim().email().max(160),
    password: z.string().min(1).max(128),
  }),
});

const roleSchema = z.object({
  body: z.object({
    activeRole: z.enum(["client", "freelancer", "admin"]),
  }),
});

const addRoleSchema = z.object({
  body: z.object({
    role: z.enum(["client", "freelancer"]),
  }),
});

authRouter.post(
  "/signup",
  validate(signupSchema),
  asyncHandler(async (req, res) => {
    const { name, email, password, role } = req.validated.body;
    const existing = await User.findOne({ email });
    if (existing) {
      const error = new Error("An account already exists for this email.");
      error.statusCode = 409;
      throw error;
    }

    const roles = role === "both" ? ["client", "freelancer"] : [role];
    const user = await User.create({
      name,
      email,
      passwordHash: await bcrypt.hash(password, 12),
      roles,
      activeRole: roles[0],
    });

    await sendWelcomeEmail(user);

    const token = signAuthToken(user);
    res.cookie("fh_token", token, authCookieOptions());
    res.status(201).json({ user: user.toPublicJSON() });
  }),
);

authRouter.post(
  "/login",
  validate(loginSchema),
  asyncHandler(async (req, res) => {
    const { email, password } = req.validated.body;
    const user = await User.findOne({ email }).select("+passwordHash");
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      const error = new Error("Invalid email or password.");
      error.statusCode = 401;
      throw error;
    }

    user.lastLoginAt = new Date();
    await user.save();
    await sendLoginEmail(user);

    const token = signAuthToken(user);
    res.cookie("fh_token", token, authCookieOptions());
    res.json({ user: user.toPublicJSON() });
  }),
);

const googleAuthSchema = z.object({
  body: z.object({
    token: z.string().min(1),
    role: z.enum(["client", "freelancer", "both"]).default("client"),
  }),
});

authRouter.post(
  "/google",
  validate(googleAuthSchema),
  asyncHandler(async (req, res) => {
    const { token: credential, role } = req.validated.body;
    let payload;
    try {
      const ticket = await googleClient.verifyIdToken({
        idToken: credential,
        audience: env.googleClientId,
      });
      payload = ticket.getPayload();
    } catch (error) {
      const e = new Error("Invalid Google token.");
      e.statusCode = 401;
      throw e;
    }

    const { sub: googleId, email, name, picture: avatar } = payload;

    let user = await User.findOne({ email });
    let isNewUser = false;

    if (!user) {
      isNewUser = true;
      const roles = role === "both" ? ["client", "freelancer"] : [role];
      user = await User.create({
        name,
        email,
        googleId,
        avatar,
        roles,
        activeRole: roles[0],
      });
    } else {
      // Link Google account if not linked
      if (!user.googleId) {
        user.googleId = googleId;
        user.avatar = user.avatar || avatar;
      }
      user.lastLoginAt = new Date();
      await user.save();
    }

    if (isNewUser) {
      await sendWelcomeEmail(user);
    } else {
      await sendLoginEmail(user);
    }

    const token = signAuthToken(user);
    res.cookie("fh_token", token, authCookieOptions());
    res.json({ user: user.toPublicJSON(), isNew: isNewUser });
  }),
);

authRouter.post("/logout", (_req, res) => {
  res.clearCookie("fh_token", authCookieOptions());
  res.json({ ok: true });
});

authRouter.get("/me", requireAuth, (req, res) => {
  res.json({ user: req.user.toPublicJSON() });
});

authRouter.patch(
  "/role",
  requireAuth,
  validate(roleSchema),
  asyncHandler(async (req, res) => {
    const { activeRole } = req.validated.body;
    if (!req.user.roles.includes(activeRole)) {
      const error = new Error("This role is not enabled for your account.");
      error.statusCode = 400;
      throw error;
    }

    req.user.activeRole = activeRole;
    await req.user.save();
    res.json({ user: req.user.toPublicJSON() });
  }),
);

authRouter.patch(
  "/roles",
  requireAuth,
  validate(addRoleSchema),
  asyncHandler(async (req, res) => {
    const { role } = req.validated.body;
    if (!req.user.roles.includes(role)) {
      req.user.roles.push(role);
    }
    req.user.activeRole = role;
    await req.user.save();
    res.json({ user: req.user.toPublicJSON() });
  }),
);
