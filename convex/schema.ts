import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  header: defineTable({
    name: v.string(),
    description: v.string(),
  }),
  introduction: defineTable({
    header: v.string(),
    description: v.string(),
    title: v.string(),
  }),
  projects: defineTable({
    image: v.string(), // Storage ID for the uploaded image
    cardTitle: v.string(),
    cardDescription: v.string(),
    tag: v.string(),
    githubLink: v.string(),
    websiteLink: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.optional(v.number()),
  }),
  projectdetails: defineTable({
    title: v.string(),
    header: v.string(),
    description: v.string(),
  }),
  workExperience: defineTable({
    icon: v.string(), // Storage ID for company icon/logo
    workplace: v.string(), // Company name
    workTitle: v.string(), // Job position title
    description: v.string(), // Bullet-separated responsibilities (using " • ")
    startDate: v.float64(), // Start date as timestamp
    endDate: v.optional(v.float64()), // End date as timestamp (optional for current jobs)
    isCurrentJob: v.boolean(), // Flag to indicate if this is a current position
  }),
});
