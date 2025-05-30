import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});

// Get image URL from storage ID
export const getImageUrl = query({
  args: { storageId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.storage.getUrl(args.storageId);
  },
});

// Get all active services ordered by displayOrder with image URLs
export const getServices = query({
  args: {},
  handler: async (ctx) => {
    const services = await ctx.db.query("services").order("asc").collect();

    // Get image URLs for all services
    const servicesWithImages = await Promise.all(
      services.map(async (service) => {
        const imageUrl = await ctx.storage.getUrl(service.icon);
        return {
          ...service,
          iconUrl: imageUrl, // Add the actual URL
        };
      })
    );

    return servicesWithImages;
  },
});

// Get services by category with image URLs
export const getServicesByCategory = query({
  args: { category: v.string() },
  handler: async (ctx, args) => {
    const services = await ctx.db
      .query("services")
      .filter((q) =>
        q.and(
          q.eq(q.field("category"), args.category),
          q.eq(q.field("isActive"), true)
        )
      )
      .order("asc")
      .collect();

    // Get image URLs for all services
    const servicesWithImages = await Promise.all(
      services.map(async (service) => {
        const imageUrl = await ctx.storage.getUrl(service.icon);
        return {
          ...service,
          iconUrl: imageUrl,
        };
      })
    );

    return servicesWithImages;
  },
});

// Create new service
export const createService = mutation({
  args: {
    title: v.string(),
    icon: v.string(),
    subtitle: v.optional(v.string()),
    badgeText: v.optional(v.string()),
    accentColor: v.optional(v.string()),
    description: v.string(),
    keyFeatures: v.string(),
    technologies: v.string(),
    experienceLevel: v.string(),
    projectCount: v.number(),
    ctaText: v.string(),
    ctaLink: v.string(),
    startingPrice: v.optional(v.number()),
    currency: v.optional(v.string()),
    priceType: v.optional(v.string()),
    deliveryTime: v.optional(v.string()),
    category: v.string(),
    displayOrder: v.number(),
  },
  handler: async (ctx, args) => {
    const serviceId = await ctx.db.insert("services", {
      ...args,
      isActive: true,
      createdAt: Date.now(),
    });
    return serviceId;
  },
});

// Update service
export const updateService = mutation({
  args: {
    id: v.id("services"),
    title: v.optional(v.string()),
    icon: v.optional(v.string()),
    subtitle: v.optional(v.string()),
    badgeText: v.optional(v.string()),
    accentColor: v.optional(v.string()),
    description: v.optional(v.string()),
    keyFeatures: v.optional(v.string()),
    technologies: v.optional(v.string()),
    experienceLevel: v.optional(v.string()),
    projectCount: v.optional(v.number()),
    ctaText: v.optional(v.string()),
    ctaLink: v.optional(v.string()),
    startingPrice: v.optional(v.number()),
    currency: v.optional(v.string()),
    priceType: v.optional(v.string()),
    deliveryTime: v.optional(v.string()),
    category: v.optional(v.string()),
    displayOrder: v.optional(v.number()),
    isActive: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    await ctx.db.patch(id, {
      ...updates,
      updatedAt: Date.now(),
    });
  },
});

// Delete service (hard delete) ya no cambia el estado ya que se agrego un campo en la db
export const deleteService = mutation({
  args: { id: v.id("services") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

// Get single service by ID with image URL
export const getService = query({
  args: { id: v.id("services") },
  handler: async (ctx, args) => {
    const service = await ctx.db.get(args.id);
    if (!service) return null;

    const imageUrl = await ctx.storage.getUrl(service.icon);
    return {
      ...service,
      iconUrl: imageUrl,
    };
  },
});

// Get services with pagination (for admin panel)
export const getServicesPaginated = query({
  args: {
    limit: v.optional(v.number()),
    cursor: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit || 10;

    let query = ctx.db.query("services").order("desc");

    if (args.cursor) {
      query = query.filter((q) =>
        q.lt(q.field("_creationTime"), parseInt(args.cursor))
      );
    }

    const services = await query.take(limit + 1);
    const hasMore = services.length > limit;
    const items = hasMore ? services.slice(0, -1) : services;

    // Get image URLs for all services
    const servicesWithImages = await Promise.all(
      items.map(async (service) => {
        const imageUrl = await ctx.storage.getUrl(service.icon);
        return {
          ...service,
          iconUrl: imageUrl,
        };
      })
    );

    return {
      services: servicesWithImages,
      hasMore,
      nextCursor:
        hasMore ? items[items.length - 1]._creationTime.toString() : null,
    };
  },
});

// Example data insertion (updated to include more realistic data)
export const seedServices = mutation({
  args: {},
  handler: async (ctx) => {
    // Check if services already exist
    const existingServices = await ctx.db.query("services").collect();
    if (existingServices.length > 0) {
      return { message: "Services already exist" };
    }

    // Example service entries

    // Insert all services
    const insertedServices = [];
    for (const service of services) {
      const serviceId = await ctx.db.insert("services", service);
      insertedServices.push(serviceId);
    }

    return {
      message: "Services seeded successfully",
      count: insertedServices.length,
      serviceIds: insertedServices,
    };
  },
});

// Get services count by category
export const getServicesCountByCategory = query({
  args: {},
  handler: async (ctx) => {
    const services = await ctx.db
      .query("services")
      .filter((q) => q.eq(q.field("isActive"), true))
      .collect();

    const categoryCounts = services.reduce((acc, service) => {
      acc[service.category] = (acc[service.category] || 0) + 1;
      return acc;
    }, {});

    return categoryCounts;
  },
});

// Get featured services (with badgeText)
export const getFeaturedServices = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const limit = args.limit || 3;

    const services = await ctx.db
      .query("services")
      .filter((q) =>
        q.and(
          q.eq(q.field("isActive"), true),
          q.neq(q.field("badgeText"), undefined)
        )
      )
      .order("asc")
      .take(limit);

    // Get image URLs for featured services
    const servicesWithImages = await Promise.all(
      services.map(async (service) => {
        const imageUrl = await ctx.storage.getUrl(service.icon);
        return {
          ...service,
          iconUrl: imageUrl,
        };
      })
    );

    return servicesWithImages;
  },
});

// Search services
export const searchServices = query({
  args: {
    searchTerm: v.string(),
    category: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let services = await ctx.db
      .query("services")
      .filter((q) => q.eq(q.field("isActive"), true))
      .collect();

    // Filter by category if provided
    if (args.category) {
      services = services.filter(
        (service) => service.category === args.category
      );
    }

    // Search in title, description, technologies, and keyFeatures
    const searchTerm = args.searchTerm.toLowerCase();
    services = services.filter(
      (service) =>
        service.title.toLowerCase().includes(searchTerm) ||
        service.description.toLowerCase().includes(searchTerm) ||
        service.technologies.toLowerCase().includes(searchTerm) ||
        service.keyFeatures.toLowerCase().includes(searchTerm)
    );

    // Get image URLs for search results
    const servicesWithImages = await Promise.all(
      services.map(async (service) => {
        const imageUrl = await ctx.storage.getUrl(service.icon);
        return {
          ...service,
          iconUrl: imageUrl,
        };
      })
    );

    return servicesWithImages;
  },
});
// Check if there are any active services
export const hasActiveServices = query({
  args: {},
  handler: async (ctx) => {
    const activeServices = await ctx.db
      .query("services")
      .filter((q) => q.eq(q.field("isActive"), true))
      .first(); // Just get the first one to check existence

    return activeServices !== null;
  },
});
