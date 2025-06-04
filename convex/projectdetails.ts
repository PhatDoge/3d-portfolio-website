import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Create a new project details entry
export const createProjectDetails = mutation({
  args: {
    projectTitle: v.optional(v.string()),
    projectHeader: v.optional(v.string()),
    projectDescription: v.optional(v.string()),
    serviceTitle: v.optional(v.string()),
    serviceHeader: v.optional(v.string()),
    serviceDescription: v.optional(v.string()),
    ExperienceTitle: v.optional(v.string()),
    ExperienceHeader: v.optional(v.string()),
    ExperienceDescription: v.optional(v.string()),
  },
  handler: async (
    ctx,
    {
      projectTitle,
      projectHeader,
      projectDescription,
      serviceTitle,
      serviceHeader,
      serviceDescription,
      ExperienceTitle,
      ExperienceHeader,
      ExperienceDescription,
    }
  ) => {
    try {
      const newId = await ctx.db.insert("projectdetails", {
        projectTitle,
        projectHeader,
        projectDescription,
        serviceTitle,
        serviceHeader,
        serviceDescription,
        ExperienceTitle,
        ExperienceHeader,
        ExperienceDescription,
      });
      return newId;
    } catch (error) {
      console.error("Error creating project details:", error);
      return null;
    }
  },
});

// Get all project details (most recent first)
export const getProjectDetails = query(async (ctx) => {
  const details = await ctx.db.query("projectdetails").order("desc").collect();
  return details;
});

// Get a specific project details entry by ID
export const getProjectDetailsById = query({
  args: { id: v.id("projectdetails") },
  handler: async (ctx, { id }) => {
    const details = await ctx.db.get(id);
    return details;
  },
});

// Update a project details entry
export const updateProjectDetails = mutation({
  args: {
    id: v.id("projectdetails"),
    projectTitle: v.optional(v.string()),
    projectHeader: v.optional(v.string()),
    projectDescription: v.optional(v.string()),
    serviceTitle: v.optional(v.string()),
    serviceHeader: v.optional(v.string()),
    serviceDescription: v.optional(v.string()),
    ExperienceTitle: v.optional(v.string()),
    ExperienceHeader: v.optional(v.string()),
    ExperienceDescription: v.optional(v.string()),
  },
  handler: async (ctx, { id, ...updates }) => {
    try {
      await ctx.db.patch(id, {
        ...updates,
      });
      return id;
    } catch (error) {
      console.error("Error updating project details:", error);
      return null;
    }
  },
});

// Delete a project details entry
export const deleteProjectDetails = mutation({
  args: { id: v.id("projectdetails") },
  handler: async (ctx, { id }) => {
    try {
      await ctx.db.delete(id);
      return id;
    } catch (error) {
      console.error("Error deleting project details:", error);
      return null;
    }
  },
});
