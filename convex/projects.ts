// File: convex/projects.ts
import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Create a new project
export const createProject = mutation({
  args: {
    image: v.string(), // This will be the storage ID from Convex file storage
    cardTitle: v.string(),
    cardDescription: v.string(),
    tag: v.string(),
    githubLink: v.string(),
    websiteLink: v.optional(v.string()),
  },
  handler: async (
    ctx,
    { image, cardTitle, cardDescription, tag, githubLink, websiteLink }
  ) => {
    try {
      const newProjectId = await ctx.db.insert("projects", {
        image,
        cardTitle,
        cardDescription,
        githubLink,
        tag,
        websiteLink,
        createdAt: Date.now(),
      });
      return newProjectId;
    } catch (error) {
      console.error("Error creating project:", error);
      return null;
    }
  },
});

// Generate upload URL for image files
export const generateUploadUrl = mutation(async (ctx) => {
  return await ctx.storage.generateUploadUrl();
});

// Get image URL from storage ID
export const getImageUrl = query({
  args: { storageId: v.string() },
  handler: async (ctx, { storageId }) => {
    return await ctx.storage.getUrl(storageId);
  },
});

// Get all projects (most recent first)
export const getProjects = query(async (ctx) => {
  const projects = await ctx.db.query("projects").order("desc").collect();

  // Get image URLs for each project
  const projectsWithImages = await Promise.all(
    projects.map(async (project) => {
      const imageUrl = await ctx.storage.getUrl(project.image);
      return {
        ...project,
        imageUrl,
      };
    })
  );

  return projectsWithImages;
});

// Get a specific project by ID
export const getProjectById = query({
  args: { id: v.id("projects") },
  handler: async (ctx, { id }) => {
    const project = await ctx.db.get(id);
    if (!project) return null;

    const imageUrl = await ctx.storage.getUrl(project.image);
    return {
      ...project,
      imageUrl,
    };
  },
});

// Update a project
export const updateProject = mutation({
  args: {
    id: v.id("projects"),
    image: v.optional(v.string()),
    cardTitle: v.optional(v.string()),
    cardDescription: v.optional(v.string()),
    tag: v.optional(v.string()),
  },
  handler: async (ctx, { id, ...updates }) => {
    try {
      await ctx.db.patch(id, {
        ...updates,
        updatedAt: Date.now(),
      });
      return id;
    } catch (error) {
      console.error("Error updating project:", error);
      return null;
    }
  },
});

// Delete a project
export const deleteProject = mutation({
  args: { id: v.id("projects") },
  handler: async (ctx, { id }) => {
    try {
      const project = await ctx.db.get(id);
      if (project) {
        // Optionally delete the image from storage
        // await ctx.storage.delete(project.image);
        await ctx.db.delete(id);
      }
      return id;
    } catch (error) {
      console.error("Error deleting project:", error);
      return null;
    }
  },
});

// Get projects by tag
export const getProjectsByTag = query({
  args: { tag: v.string() },
  handler: async (ctx, { tag }) => {
    const projects = await ctx.db
      .query("projects")
      .filter((q) => q.eq(q.field("tag"), tag))
      .order("desc")
      .collect();

    const projectsWithImages = await Promise.all(
      projects.map(async (project) => {
        const imageUrl = await ctx.storage.getUrl(project.image);
        return {
          ...project,
          imageUrl,
        };
      })
    );

    return projectsWithImages;
  },
});

// // Save title, header, and description for a project
export const createProjectHeader = mutation({
  args: {
    image: v.string(), // This will be the storage ID from Convex file storage
    cardTitle: v.string(),
    cardDescription: v.string(),
    tag: v.string(),
  },
  handler: async (ctx, { image, cardTitle, cardDescription, tag }) => {
    try {
      const newProjectId = await ctx.db.insert("projectdetails", {
        image,
        cardTitle,
        cardDescription,
        tag,
        createdAt: Date.now(),
      });
      return newProjectId;
    } catch (error) {
      console.error("Error creating project:", error);
      return null;
    }
  },
});
