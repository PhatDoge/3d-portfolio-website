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
});
