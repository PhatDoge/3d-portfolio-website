// File: convex/header.ts
import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const createIntroduction = mutation({
  args: {
    header: v.string(),
    description: v.string(),
    title: v.string(),
  },
  handler: async (ctx, { header, description, title }) => {
    try {
      const newIntroductionId = await ctx.db.insert("introduction", {
        header,
        description,
        title,
      });
      return newIntroductionId;
    } catch (error) {
      console.error("Error creating introduction:", error);
      return null;
    }
  },
});

// Get all headers (most recent first)
export const getIntroductions = query(async (ctx) => {
  const introductions = await ctx.db
    .query("introduction")
    .order("desc")
    .collect();
  return introductions;
});

// // Optional: Get a specific header by ID
// export const getHeaderById = query({
//   args: { id: v.id("header") },
//   handler: async (ctx, { id }) => {
//     const header = await ctx.db.get(id);
//     return header;
//   },
// });
