import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  header: defineTable({
    name: v.string(),
    description: v.string(),
  }),
  introduction: defineTable({
    // Add this line
    header: v.string(),
    description: v.string(),
    title: v.string(),
  }),
  projects: defineTable({
    image: v.string(), // Storage ID for the uploaded image
    cardTitle: v.string(),
    cardDescription: v.string(),
    tag: v.string(),
    createdAt: v.number(),
    updatedAt: v.optional(v.number()),
  }),
  projectdetails: defineTable({
    title: v.string(),
    header: v.string(),
    description: v.string(),
  }),
});
