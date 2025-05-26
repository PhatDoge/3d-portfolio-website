import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Create a new work experience entry
export const createWorkExperience = mutation({
  args: {
    icon: v.string(), // Storage ID
    workplace: v.string(),
    workTitle: v.string(),
    description: v.string(), // Bullet-separated string
    startDate: v.number(), // Start date as timestamp
    endDate: v.optional(v.number()), // End date as timestamp (optional)
    isCurrentJob: v.boolean(), // Flag for current position
  },
  handler: async (ctx, args) => {
    const workExperienceId = await ctx.db.insert("workExperience", {
      icon: args.icon,
      workplace: args.workplace,
      workTitle: args.workTitle,
      description: args.description,
      startDate: args.startDate,
      endDate: args.endDate,
      isCurrentJob: args.isCurrentJob,
    });

    return workExperienceId;
  },
});

// Generate upload URL for icon images
export const generateUploadUrl = mutation(async (ctx) => {
  return await ctx.storage.generateUploadUrl();
});

// Get all work experiences (for displaying)
export const getAllWorkExperiences = query({
  handler: async (ctx) => {
    const workExperiences = await ctx.db
      .query("workExperience")
      .order("desc") // Most recent first
      .collect();

    // Get the actual image URLs for each work experience
    const workExperiencesWithUrls = await Promise.all(
      workExperiences.map(async (exp) => ({
        ...exp,
        iconUrl: await ctx.storage.getUrl(exp.icon),
        // Convert bullet-separated string back to array if needed
        descriptionArray: exp.description ? exp.description.split(" • ") : [],
        // Ensure endDate is properly handled for current jobs
        endDate: exp.isCurrentJob ? undefined : exp.endDate,
      }))
    );

    return workExperiencesWithUrls;
  },
});

// Get the latest/most recent work experience entry (no ID needed)
export const getLatestWorkExperience = query({
  handler: async (ctx) => {
    const workExperience = await ctx.db
      .query("workExperience")
      .order("desc") // Most recent first
      .first(); // Get just the first (latest) one

    if (!workExperience) {
      return null; // Return null if no work experience exists
    }

    return {
      ...workExperience,
      iconUrl: await ctx.storage.getUrl(workExperience.icon),
      descriptionArray:
        workExperience.description ?
          workExperience.description.split(" • ")
        : [],
      // Ensure endDate is properly handled for current jobs
      endDate: workExperience.isCurrentJob ? undefined : workExperience.endDate,
    };
  },
});

// Update work experience (you can still use this with ID if needed)
export const updateWorkExperience = mutation({
  args: {
    id: v.id("workExperience"),
    icon: v.optional(v.string()),
    workplace: v.optional(v.string()),
    workTitle: v.optional(v.string()),
    description: v.optional(v.string()),
    startDate: v.optional(v.number()),
    endDate: v.optional(v.number()),
    isCurrentJob: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;

    // Remove undefined values
    const cleanUpdates = Object.fromEntries(
      Object.entries(updates).filter(([_, value]) => value !== undefined)
    );

    await ctx.db.patch(id, cleanUpdates);
    return id;
  },
});

// Update the latest work experience (no ID needed)
export const updateLatestWorkExperience = mutation({
  args: {
    icon: v.optional(v.string()),
    workplace: v.optional(v.string()),
    workTitle: v.optional(v.string()),
    description: v.optional(v.string()),
    startDate: v.optional(v.number()),
    endDate: v.optional(v.number()),
    isCurrentJob: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    // Get the latest work experience
    const latestWorkExperience = await ctx.db
      .query("workExperience")
      .order("desc")
      .first();

    if (!latestWorkExperience) {
      throw new Error("No work experience found to update");
    }

    // Remove undefined values
    const cleanUpdates = Object.fromEntries(
      Object.entries(args).filter(([_, value]) => value !== undefined)
    );

    await ctx.db.patch(latestWorkExperience._id, cleanUpdates);
    return latestWorkExperience._id;
  },
});

// Delete work experience
export const deleteWorkExperience = mutation({
  args: { id: v.id("workExperience") },
  handler: async (ctx, args) => {
    const workExperience = await ctx.db.get(args.id);

    if (!workExperience) {
      throw new Error("Work experience not found");
    }

    // Delete the associated icon from storage
    await ctx.storage.delete(workExperience.icon);

    // Delete the work experience record
    await ctx.db.delete(args.id);

    return args.id;
  },
});

// Delete the latest work experience (no ID needed)
export const deleteLatestWorkExperience = mutation({
  handler: async (ctx) => {
    const latestWorkExperience = await ctx.db
      .query("workExperience")
      .order("desc")
      .first();

    if (!latestWorkExperience) {
      throw new Error("No work experience found to delete");
    }

    // Delete the associated icon from storage
    await ctx.storage.delete(latestWorkExperience.icon);

    // Delete the work experience record
    await ctx.db.delete(latestWorkExperience._id);

    return latestWorkExperience._id;
  },
});
