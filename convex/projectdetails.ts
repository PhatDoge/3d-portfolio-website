import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Create a new project details entry
export const createProjectDetails = mutation({
  args: {
    title: v.string(),
    header: v.string(),
    description: v.string(),
  },
  handler: async (ctx, { title, header, description }) => {
    try {
      const newId = await ctx.db.insert("projectdetails", {
        title,
        header,
        description,
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
    title: v.optional(v.string()),
    header: v.optional(v.string()),
    description: v.optional(v.string()),
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
