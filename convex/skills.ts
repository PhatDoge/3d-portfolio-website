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

export const updateSkill = mutation({
  args: {
    id: v.id("skills"),
    title: v.string(),
    description: v.string(),
    iconUrl: v.optional(v.string()),
    iconFile: v.optional(v.id("_storage")),
    link: v.string(),
  },
  handler: async (
    { db },
    { id, title, description, iconUrl, iconFile, link }
  ) => {
    const updateData: {
      title: string;
      description: string;
      link: string;
      iconUrl?: string;
      iconFile?: string;
    } = {
      title,
      description,
      link,
    };

    // Handle icon updates - prioritize iconFile over iconUrl
    if (iconFile) {
      updateData.iconFile = iconFile;
      updateData.iconUrl = undefined; // Clear iconUrl if iconFile is provided
    } else if (iconUrl) {
      updateData.iconUrl = iconUrl;
      updateData.iconFile = undefined; // Clear iconFile if iconUrl is provided
    }

    return await db.patch(id, updateData);
  },
});

export const deleteSkill = mutation({
  args: {
    id: v.id("skills"),
  },
  handler: async ({ db }, { id }) => {
    return await db.delete(id);
  },
});

export const getAllSkills = query(async (ctx) => {
  const skills = await ctx.db.query("skills").order("desc").collect();

  // Process skills to include proper icon URLs
  const processedSkills = await Promise.all(
    skills.map(async (skill) => {
      let iconUrl = skill.iconUrl;

      // If skill has iconFile, get its URL
      if (skill.iconFile) {
        try {
          iconUrl = await ctx.storage.getUrl(skill.iconFile);
        } catch (error) {
          console.error("Failed to get icon URL:", error);
          iconUrl = skill.iconUrl; // fallback to iconUrl if available
        }
      }

      return {
        ...skill,
        iconUrl,
      };
    })
  );

  return processedSkills;
});

export const getSkillById = query({
  args: { id: v.id("skills") },
  handler: async (ctx, { id }) => {
    const skill = await ctx.db.get(id);
    if (!skill) return null;

    let iconUrl = skill.iconUrl;

    // If skill has iconFile, get its URL
    if (skill.iconFile) {
      try {
        iconUrl = await ctx.storage.getUrl(skill.iconFile);
      } catch (error) {
        console.error("Failed to get icon URL:", error);
        iconUrl = skill.iconUrl; // fallback to iconUrl if available
      }
    }

    return {
      ...skill,
      iconUrl,
    };
  },
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
