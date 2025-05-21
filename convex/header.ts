// File: convex/header.ts
import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Create a new header entry
export const createHeader = mutation({
  args: {
    name: v.string(),
    description: v.string(),
  },
  handler: async (ctx, { name, description }) => {
    try {
      const newHeaderId = await ctx.db.insert("header", {
        name,
        description,
      });
      return newHeaderId;
    } catch (error) {
      console.error("Error creating header:", error);
      return null;
    }
  },
});

// Get all headers (most recent first)
export const getHeader = query(async (ctx) => {
  const headers = await ctx.db.query("header").order("desc").collect();
  return headers;
});

// Optional: Get a specific header by ID
export const getHeaderById = query({
  args: { id: v.id("header") },
  handler: async (ctx, { id }) => {
    const header = await ctx.db.get(id);
    return header;
  },
});
