import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const createSkill = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    iconUrl: v.string(),
    link: v.string(),
  },
  handler: async ({ db }, { title, description, iconUrl, link }) => {
    return await db.insert("skills", {
      title,
      description,
      iconUrl,
      link,
    });
  },
});

export const getAllSkills = query(async (ctx) => {
  const skills = await ctx.db.query("skills").order("desc").collect();
  return skills;
});
