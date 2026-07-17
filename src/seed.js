import bcrypt from "bcryptjs";
import { connectDatabase } from "./config/db.js";
import { User } from "./models/User.js";
import { Service } from "./models/Service.js";

const seedPassword = "FreelanceHub123!";

const sellers = [
  {
    name: "Maya Singh",
    email: "maya@freelancehub.local",
    profile: { headline: "Brand designer", skills: ["Logo design", "Brand systems", "Pitch decks"] },
    service: {
      title: "I will design a crisp logo and mini brand kit for your launch",
      category: "design",
      description:
        "Get a polished logo direction, color palette, typography guidance, and a compact brand kit ready for your next launch.",
      price: 95,
      deliveryDays: 2,
      revisions: 2,
      tags: ["logo", "brand", "design"],
      icon: "pen-tool",
      coverTheme: "theme-design",
      ratingAverage: 4.98,
      ratingCount: 312,
    },
  },
  {
    name: "Jon Bell",
    email: "jon@freelancehub.local",
    profile: { headline: "Shopify and frontend fixer", skills: ["Shopify", "JavaScript", "Performance"] },
    service: {
      title: "I will fix Shopify layout bugs and speed issues in 24 hours",
      category: "tech",
      description:
        "Send over your Shopify issue list and I will repair layout, responsiveness, and common performance problems quickly.",
      price: 80,
      deliveryDays: 1,
      revisions: 1,
      tags: ["shopify", "frontend", "bug fix"],
      icon: "code-2",
      coverTheme: "theme-tech",
      ratingAverage: 4.91,
      ratingCount: 188,
    },
  },
  {
    name: "Rhea Mehta",
    email: "rhea@freelancehub.local",
    profile: { headline: "SEO strategist", skills: ["SEO", "Content", "Analytics"] },
    service: {
      title: "I will create a practical SEO action plan for your website",
      category: "marketing",
      description:
        "Receive a prioritized SEO plan with technical fixes, keyword opportunities, and content moves you can execute immediately.",
      price: 120,
      deliveryDays: 3,
      revisions: 1,
      tags: ["seo", "marketing", "audit"],
      icon: "megaphone",
      coverTheme: "theme-marketing",
      ratingAverage: 4.96,
      ratingCount: 244,
    },
  },
  {
    name: "Lena Park",
    email: "lena@freelancehub.local",
    profile: { headline: "Caption editor", skills: ["SRT", "Video captions", "Transcription"] },
    service: {
      title: "I will clean captions and deliver polished SRT files",
      category: "video",
      description:
        "I will repair caption timing, remove transcription errors, and deliver clean SRT files for product videos or courses.",
      price: 55,
      deliveryDays: 1,
      revisions: 1,
      tags: ["captions", "video", "srt"],
      icon: "clapperboard",
      coverTheme: "theme-video",
      ratingAverage: 4.89,
      ratingCount: 157,
    },
  },
  {
    name: "Omar Ruiz",
    email: "omar@freelancehub.local",
    profile: { headline: "Conversion copywriter", skills: ["Landing pages", "Email", "SaaS"] },
    service: {
      title: "I will write conversion-focused landing page copy",
      category: "writing",
      description:
        "Get a clear headline, page narrative, benefit sections, proof points, and calls to action written for conversion.",
      price: 140,
      deliveryDays: 2,
      revisions: 2,
      tags: ["copywriting", "landing page", "saas"],
      icon: "file-pen-line",
      coverTheme: "theme-writing",
      ratingAverage: 4.97,
      ratingCount: 391,
    },
  },
  {
    name: "Theo Nash",
    email: "theo@freelancehub.local",
    profile: { headline: "AI workflow builder", skills: ["AI agents", "Automation", "Support"] },
    service: {
      title: "I will prototype AI agents for your help center",
      category: "ai",
      description:
        "I will scope and prototype a support assistant that answers FAQs, routes edge cases, and summarizes user context.",
      price: 220,
      deliveryDays: 5,
      revisions: 2,
      tags: ["ai agents", "automation", "support"],
      icon: "bot",
      coverTheme: "theme-ai",
      ratingAverage: 4.94,
      ratingCount: 126,
    },
  },
];

async function main() {
  await connectDatabase();

  const passwordHash = await bcrypt.hash(seedPassword, 12);
  for (const seller of sellers) {
    const user = await User.findOneAndUpdate(
      { email: seller.email },
      {
        name: seller.name,
        email: seller.email,
        passwordHash,
        roles: ["freelancer"],
        activeRole: "freelancer",
        profile: seller.profile,
      },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    );

    await Service.findOneAndUpdate(
      { seller: user._id, title: seller.service.title },
      {
        ...seller.service,
        seller: user._id,
        status: "active",
      },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    );
  }

  await User.findOneAndUpdate(
    { email: "client@freelancehub.local" },
    {
      name: "Demo Client",
      email: "client@freelancehub.local",
      passwordHash,
      roles: ["client"],
      activeRole: "client",
      profile: { headline: "Client account" },
    },
    { upsert: true, new: true, setDefaultsOnInsert: true },
  );

  console.log(`Seed complete. Demo password for local accounts: ${seedPassword}`);
  process.exit(0);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
