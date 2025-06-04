import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  header: defineTable({
    name: v.string(),
    description: v.string(),
  }),

  technologies: defineTable({
    name: v.string(),
    icon: v.string(), // URL or path to the icon
    isVisible: v.boolean(),
    order: v.optional(v.number()), // For custom ordering
  }),
  skills: defineTable({
    iconUrl: v.optional(v.string()), // Make optional since we might have iconFile instead
    iconFile: v.optional(v.id("_storage")), // Add field for uploaded file
    title: v.string(),
    description: v.string(),
    link: v.string(),
  }),
  projects: defineTable({
    image: v.string(), // Storage ID for the uploaded image
    cardTitle: v.string(),
    cardDescription: v.string(),
    tag: v.string(),
    githubLink: v.string(),
    websiteLink: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.optional(v.number()),
  }),
  projectdetails: defineTable({
    projectTitle: v.optional(v.string()),
    projectHeader: v.optional(v.string()),
    projectDescription: v.optional(v.string()),
    serviceTitle: v.optional(v.string()),
    serviceHeader: v.optional(v.string()),
    serviceDescription: v.optional(v.string()),
    ExperienceTitle: v.optional(v.string()),
    ExperienceHeader: v.optional(v.string()),
    ExperienceDescription: v.optional(v.string()),
    skillTitle: v.optional(v.string()),
    skillHeader: v.optional(v.string()),
    skillDescription: v.optional(v.string()),
  }),

  workExperience: defineTable({
    icon: v.string(), // Storage ID for company icon/logo
    workplace: v.string(), // Company name
    workTitle: v.string(), // Job position title
    description: v.string(), // Bullet-separated responsibilities (using " • ")
    startDate: v.float64(), // Start date as timestamp
    endDate: v.optional(v.float64()), // End date as timestamp (optional for current jobs)
    isCurrentJob: v.boolean(), // Flag to indicate if this is a current position
  }),
  // NEW: Services table for  flip cards
  services: defineTable({
    // Front Side Content
    title: v.string(), // Main service title (e.g., "Diseño Web", "Desarrollador React")
    icon: v.string(), // Storage ID for the service icon
    subtitle: v.optional(v.string()), // Optional subtitle for front side
    badgeText: v.optional(v.string()), // Badge text (e.g., "Popular", "New", "Especialidad")
    accentColor: v.optional(v.string()), // Hex color for customization (e.g., "#00cea8")

    // Back Side Content
    description: v.string(), // Detailed description of the service
    keyFeatures: v.string(), // Comma or bullet-separated features (e.g., "React & Next.js • TypeScript • Tailwind CSS")
    technologies: v.string(), // Technologies used (comma-separated: "React, Next.js, TypeScript")
    experienceLevel: v.string(), // "Beginner", "Intermediate", "Expert"
    projectCount: v.number(), // Number of projects completed in this area

    // Call to Action
    ctaText: v.string(), // Button text (e.g., "Ver Proyectos", "Contactar")
    ctaLink: v.string(), // Link for the CTA button

    // Optional Pricing Info
    startingPrice: v.optional(v.number()), // Starting price
    currency: v.optional(v.string()), // Currency symbol ("$", "€", etc.)
    priceType: v.optional(v.string()), // "project", "hour", "fixed"
    deliveryTime: v.optional(v.string()), // Estimated delivery time

    // Metadata
    category: v.string(), // Category for filtering ("design", "development", "consulting")
    isActive: v.boolean(), // Whether to show this card
    displayOrder: v.number(), // Order in which to display (1, 2, 3, etc.)
    createdAt: v.number(), // Creation timestamp
    updatedAt: v.optional(v.number()), // Last update timestamp
  }),
});
