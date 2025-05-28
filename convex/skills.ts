import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const createSkill = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    iconUrl: v.optional(v.string()), // Make optional
    iconFile: v.optional(v.id("_storage")), // Add iconFile option
    link: v.string(),
  },
  handler: async ({ db }, { title, description, iconUrl, iconFile, link }) => {
    return await db.insert("skills", {
      title,
      description,
      iconUrl,
      iconFile,
      link,
    });
  },
});

export const getAllSkills = query(async (ctx) => {
  const skills = await ctx.db.query("skills").order("desc").collect();
  return skills;
});

export const generateUploadUrl = mutation(async (ctx) => {
  return await ctx.storage.generateUploadUrl();
});
export const getImageUrl = query({
  args: { storageId: v.id("_storage") },
  handler: async (ctx, { storageId }) => {
    return await ctx.storage.getUrl(storageId);
  },
});
