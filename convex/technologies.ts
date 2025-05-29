import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Create a new technology entry
export const createTechnology = mutation({
  args: {
    name: v.string(),
    icon: v.string(),
    isVisible: v.optional(v.boolean()),
    order: v.optional(v.number()),
  },
  handler: async (ctx, { name, icon, isVisible = true, order }) => {
    try {
      const newTechId = await ctx.db.insert("technologies", {
        name,
        icon,
        isVisible,
        order: order ?? Date.now(), // Default to timestamp for ordering
      });
      return newTechId;
    } catch (error) {
      console.error("Error creating technology:", error);
      return null;
    }
  },
});

// Add this new mutation for uploading files
export const uploadTechnologyIcon = mutation({
  args: {
    storageId: v.id("_storage"),
    name: v.string(),
    isVisible: v.optional(v.boolean()),
    order: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("technologies", {
      name: args.name,
      icon: args.storageId,
      isVisible: args.isVisible ?? true,
      order: args.order,
    });
  },
});

// Add this query to get technology with file URL
export const getTechnologiesWithUrls = query({
  handler: async (ctx) => {
    const technologies = await ctx.db.query("technologies").collect();

    return Promise.all(
      technologies.map(async (tech) => ({
        ...tech,
        iconUrl: await ctx.storage.getUrl(tech.icon),
      }))
    );
  },
});

// Get all technologies (ordered by custom order or creation time)
export const getTechnologies = query(async (ctx) => {
  const technologies = await ctx.db
    .query("technologies")
    .order("asc")
    .collect();

  // Sort by order field
  return technologies.sort((a, b) => (a.order || 0) - (b.order || 0));
});

// Get only visible technologies
export const getVisibleTechnologies = query(async (ctx) => {
  const technologies = await ctx.db
    .query("technologies")
    .filter((q) => q.eq(q.field("isVisible"), true))
    .order("asc")
    .collect();

  return technologies.sort((a, b) => (a.order || 0) - (b.order || 0));
});

// Toggle technology visibility
export const toggleTechnologyVisibility = mutation({
  args: {
    id: v.id("technologies"),
    isVisible: v.boolean(),
  },
  handler: async (ctx, { id, isVisible }) => {
    try {
      await ctx.db.patch(id, { isVisible });
      return { success: true };
    } catch (error) {
      console.error("Error toggling technology visibility:", error);
      return { success: false, error };
    }
  },
});

// Update technology details
export const updateTechnology = mutation({
  args: {
    id: v.id("technologies"),
    name: v.optional(v.string()),
    icon: v.optional(v.string()),
    isVisible: v.optional(v.boolean()),
    order: v.optional(v.number()),
  },
  handler: async (ctx, { id, ...updates }) => {
    try {
      await ctx.db.patch(id, updates);
      return { success: true };
    } catch (error) {
      console.error("Error updating technology:", error);
      return { success: false, error };
    }
  },
});

// Delete a technology
export const deleteTechnology = mutation({
  args: { id: v.id("technologies") },
  handler: async (ctx, { id }) => {
    try {
      await ctx.db.delete(id);
      return { success: true };
    } catch (error) {
      console.error("Error deleting technology:", error);
      return { success: false, error };
    }
  },
});

// Bulk insert technologies (useful for initial setup)
export const bulkInsertTechnologies = mutation({
  args: {
    technologies: v.array(
      v.object({
        name: v.string(),
        icon: v.string(),
        isVisible: v.optional(v.boolean()),
        order: v.optional(v.number()),
      })
    ),
  },
  handler: async (ctx, { technologies }) => {
    try {
      const insertPromises = technologies.map((tech, index) =>
        ctx.db.insert("technologies", {
          name: tech.name,
          icon: tech.icon,
          isVisible: tech.isVisible ?? true,
          order: tech.order ?? index,
        })
      );

      const results = await Promise.all(insertPromises);
      return { success: true, insertedIds: results };
    } catch (error) {
      console.error("Error bulk inserting technologies:", error);
      return { success: false, error };
    }
  },
});
