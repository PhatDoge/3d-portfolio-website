import { zodResolver } from "@hookform/resolvers/zod";
import React, { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Textarea } from "../ui/textarea";

import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { LanguageContext } from "./Dashboard";
import { serviceTranslations } from "./translations";

const formSchema = z.object({
  // Front Side Content
  title: z
    .string()
    .min(2, { message: "Title must be at least 2 characters." })
    .max(100, { message: "Title must be less than 100 characters." }),
  icon: z.string().min(1, { message: "Please select an icon image." }),
  subtitle: z
    .string()
    .max(50, { message: "Subtitle must be less than 50 characters." })
    .optional(),
  badgeText: z
    .string()
    .max(20, { message: "Badge text must be less than 20 characters." })
    .optional(),
  accentColor: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/, {
      message: "Please enter a valid hex color (e.g., #00cea8)",
    })
    .optional(),

  // Back Side Content
  description: z
    .string()
    .min(20, { message: "Description must be at least 20 characters." })
    .max(500, { message: "Description must be less than 500 characters." }),
  keyFeatures: z
    .string()
    .min(10, { message: "Key features must be at least 10 characters." })
    .max(300, { message: "Key features must be less than 300 characters." }),
  technologies: z
    .string()
    .min(5, { message: "Technologies must be at least 5 characters." })
    .max(200, { message: "Technologies must be less than 200 characters." }),
  experienceLevel: z.enum(["Beginner", "Intermediate", "Expert"], {
    required_error: "Please select an experience level.",
  }),
  projectCount: z
    .number()
    .min(0, { message: "Project count must be 0 or greater." })
    .max(1000, { message: "Project count must be less than 1000." }),

  // Call to Action
  ctaText: z
    .string()
    .min(2, { message: "CTA text must be at least 2 characters." })
    .max(30, { message: "CTA text must be less than 30 characters." }),
  ctaLink: z.string().min(1, { message: "CTA link is required." }),

  // Optional Pricing Info
  startingPrice: z
    .number()
    .min(0, { message: "Starting price must be 0 or greater." })
    .optional(),
  currency: z
    .string()
    .max(5, { message: "Currency must be less than 5 characters." })
    .optional(),
  priceType: z.enum(["project", "hour", "fixed"]).optional(),
  deliveryTime: z
    .string()
    .max(50, { message: "Delivery time must be less than 50 characters." })
    .optional(),

  // Metadata
  category: z.enum(["design", "development", "consulting"], {
    required_error: "Please select a category.",
  }),
  displayOrder: z
    .number()
    .min(1, { message: "Display order must be at least 1." })
    .max(100, { message: "Display order must be less than 100." }),
});

const Services = () => {
  const { language } = useContext(LanguageContext);
  const t = serviceTranslations[language];

  const [selectedIcon, setSelectedIcon] = useState<File | null>(null);
  const [iconPreview, setIconPreview] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);
  const [keyFeatures, setKeyFeatures] = useState<string[]>([]);
  const [currentFeature, setCurrentFeature] = useState<string>("");
  const [technologies, setTechnologies] = useState<string[]>([]);
  const [currentTechnology, setCurrentTechnology] = useState<string>("");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      icon: "",
      subtitle: "",
      badgeText: "",
      accentColor: "",
      description: "",
      keyFeatures: "",
      technologies: "",
      experienceLevel: undefined,
      projectCount: 0,
      ctaText: "",
      ctaLink: "",
      startingPrice: undefined,
      currency: "$",
      priceType: undefined,
      deliveryTime: "",
      category: undefined,
      displayOrder: 1,
    },
  });

  // Convex mutations
  const createService = useMutation(api.services.createService);
  const generateUploadUrl = useMutation(api.services.generateUploadUrl);

  const handleIconSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedIcon(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setIconPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFeatureKeyPress = (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === "Enter") {
      event.preventDefault();
      const trimmedFeature = currentFeature.trim();

      if (trimmedFeature && !keyFeatures.includes(trimmedFeature)) {
        const newFeatures = [...keyFeatures, trimmedFeature];
        setKeyFeatures(newFeatures);
        setCurrentFeature("");
        form.setValue("keyFeatures", newFeatures.join(" • "));
      }
    }
  };

  const handleTechnologyKeyPress = (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === "Enter") {
      event.preventDefault();
      const trimmedTechnology = currentTechnology.trim();

      if (trimmedTechnology && !technologies.includes(trimmedTechnology)) {
        const newTechnologies = [...technologies, trimmedTechnology];
        setTechnologies(newTechnologies);
        setCurrentTechnology("");
        form.setValue("technologies", newTechnologies.join(", "));
      }
    }
  };

  const removeFeature = (featureToRemove: string) => {
    const newFeatures = keyFeatures.filter(
      (feature) => feature !== featureToRemove
    );
    setKeyFeatures(newFeatures);
    form.setValue(
      "keyFeatures",
      newFeatures.length > 0 ? newFeatures.join(" • ") : ""
    );
  };

  const removeTechnology = (technologyToRemove: string) => {
    const newTechnologies = technologies.filter(
      (tech) => tech !== technologyToRemove
    );
    setTechnologies(newTechnologies);
    form.setValue(
      "technologies",
      newTechnologies.length > 0 ? newTechnologies.join(", ") : ""
    );
  };

  const uploadIcon = async (file: File): Promise<string> => {
    try {
      const uploadUrl = await generateUploadUrl();
      const result = await fetch(uploadUrl, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      });
      const { storageId } = await result.json();
      return storageId;
    } catch (error) {
      console.error("Failed to upload icon:", error);
      throw new Error("Icon upload failed");
    }
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Add any remaining typed content
    if (currentFeature.trim() && !keyFeatures.includes(currentFeature.trim())) {
      keyFeatures.push(currentFeature.trim());
      setKeyFeatures([...keyFeatures]);
      form.setValue("keyFeatures", keyFeatures.join(" • "));
    }

    if (
      currentTechnology.trim() &&
      !technologies.includes(currentTechnology.trim())
    ) {
      technologies.push(currentTechnology.trim());
      setTechnologies([...technologies]);
      form.setValue("technologies", technologies.join(", "));
    }

    if (!selectedIcon) {
      form.setError("icon", { message: t.selectIcon });
      return;
    }

    if (keyFeatures.length === 0) {
      form.setError("keyFeatures", { message: t.addFeature });

      return;
    }

    if (technologies.length === 0) {
      form.setError("technologies", { message: t.addTechnology });

      return;
    }

    try {
      setIsUploading(true);

      // Upload icon first
      const iconStorageId = await uploadIcon(selectedIcon);

      // Prepare service data
      const serviceData = {
        title: values.title,
        icon: iconStorageId,
        subtitle: values.subtitle || undefined,
        badgeText: values.badgeText || undefined,
        accentColor: values.accentColor || undefined,
        description: values.description,
        keyFeatures: keyFeatures.join(" • "),
        technologies: technologies.join(", "),
        experienceLevel: values.experienceLevel,
        projectCount: values.projectCount,
        ctaText: values.ctaText,
        ctaLink: values.ctaLink,
        startingPrice: values.startingPrice,
        currency: values.currency,
        priceType: values.priceType,
        deliveryTime: values.deliveryTime || undefined,
        category: values.category,
        displayOrder: values.displayOrder,
      };

      const id = await createService(serviceData);
      console.log("Service created with ID:", id);

      // Reset form and state
      form.reset();
      setSelectedIcon(null);
      setIconPreview("");
      setKeyFeatures([]);
      setCurrentFeature("");
      setTechnologies([]);
      setCurrentTechnology("");

      window.location.href = "/"; // Navigate to the root route
    } catch (error) {
      console.error("Failed to create service:", error);
      form.setError("root", { message: t.createError });
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 mt-4">
      <div className="w-full max-w-4xl px-6 py-10 bg-gray-800/20 rounded-2xl shadow-inner border border-gray-700">
        <Card className="backdrop-blur-sm bg-gray-900/80 border-gray-700 shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 violet-gradient opacity-5"></div>

          <CardHeader className="relative z-10 text-center pb-8">
            <CardTitle className="text-3xl font-bold mb-2">
              <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                {t.pageTitle}
              </span>
            </CardTitle>
          </CardHeader>

          <CardContent className="relative z-10">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Left Column - Front Side Content */}
                  <div className="space-y-6">
                    <h3 className="text-xl font-semibold text-purple-400 border-b border-purple-400/30 pb-2">
                      {t.frontSideHeader}
                    </h3>

                    {/* Title Field */}
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-200 font-medium">
                            {t.serviceTitle} {t.required}
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder={t.titlePlaceholder}
                              {...field}
                              className="bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-purple-500/20 transition-all duration-300"
                            />
                          </FormControl>
                          <FormMessage className="text-red-400" />
                        </FormItem>
                      )}
                    />

                    {/* Icon Upload Field */}
                    <FormField
                      control={form.control}
                      name="icon"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-200 font-medium">
                            {t.serviceIcon} {t.required}
                          </FormLabel>
                          <FormControl>
                            <div className="space-y-4">
                              <Input
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                  handleIconSelect(e);
                                  field.onChange(
                                    e.target.files?.[0]?.name || ""
                                  );
                                }}
                                className="bg-gray-800/50 border-gray-600 text-white file:bg-purple-600 file:text-white file:border-0 file:rounded-md file:px-4 file:py-2 file:mr-4 hover:file:bg-purple-700 transition-all duration-300"
                              />
                              {iconPreview && (
                                <div className="mt-2">
                                  <img
                                    src={iconPreview}
                                    alt="Icon Preview"
                                    className="w-16 h-16 object-cover rounded-lg border border-gray-600"
                                  />
                                </div>
                              )}
                            </div>
                          </FormControl>
                          <FormMessage className="text-red-400" />
                        </FormItem>
                      )}
                    />

                    {/* Subtitle Field */}
                    <FormField
                      control={form.control}
                      name="subtitle"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-200 font-medium">
                            {t.subtitle}
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder={t.subtitlePlaceholder}
                              {...field}
                              className="bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-purple-500/20 transition-all duration-300"
                            />
                          </FormControl>
                          <FormMessage className="text-red-400" />
                        </FormItem>
                      )}
                    />

                    {/* Badge Text Field */}
                    <FormField
                      control={form.control}
                      name="badgeText"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-200 font-medium">
                            {t.badgeText}
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder={t.badgePlaceholder}
                              {...field}
                              className="bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-purple-500/20 transition-all duration-300"
                            />
                          </FormControl>
                          <FormMessage className="text-red-400" />
                        </FormItem>
                      )}
                    />

                    {/* Accent Color Field */}
                    <FormField
                      control={form.control}
                      name="accentColor"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-200 font-medium">
                            {t.accentColor}
                          </FormLabel>
                          <FormControl>
                            <div className="flex gap-2">
                              <Input
                                placeholder="#00cea8"
                                {...field}
                                className="bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-purple-500/20 transition-all duration-300"
                              />
                              <input
                                type="color"
                                value={field.value || "#00cea8"}
                                onChange={(e) => field.onChange(e.target.value)}
                                className="w-12 h-10 rounded border border-gray-600 bg-gray-800"
                              />
                            </div>
                          </FormControl>
                          <FormMessage className="text-red-400" />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Right Column - */}
                  <div className="space-y-6">
                    <h3 className="text-xl font-semibold text-green-400 border-b border-green-400/30 pb-2">
                      &#8288;
                    </h3>

                    {/* Description Field */}
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-200 font-medium">
                            {t.detailedDescription} {t.required}
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder={t.descriptionPlaceholder}
                              {...field}
                              rows={4}
                              className="bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-purple-500/20 transition-all duration-300 resize-none"
                            />
                          </FormControl>
                          <FormMessage className="text-red-400" />
                        </FormItem>
                      )}
                    />

                    {/* Key Features Field */}
                    <FormField
                      control={form.control}
                      name="keyFeatures"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-200 font-medium">
                            {t.keyFeatures} {t.required}
                          </FormLabel>
                          <FormControl>
                            <div className="space-y-2">
                              <Input
                                placeholder={t.featurePlaceholder}
                                value={currentFeature}
                                onChange={(e) =>
                                  setCurrentFeature(e.target.value)
                                }
                                onKeyDown={handleFeatureKeyPress}
                                className="bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-purple-500/20 transition-all duration-300"
                              />
                              {keyFeatures.length > 0 && (
                                <div className="space-y-2 mt-2 max-h-32 overflow-y-auto">
                                  {keyFeatures.map((feature, index) => (
                                    <div
                                      key={index}
                                      className="flex items-start gap-2 p-2 bg-gray-800/30 rounded-md border border-gray-600"
                                    >
                                      <span className="text-purple-400 mt-1">
                                        •
                                      </span>
                                      <span className="text-gray-200 text-sm flex-1">
                                        {feature}
                                      </span>
                                      <button
                                        type="button"
                                        onClick={() => removeFeature(feature)}
                                        className="text-red-400 hover:text-red-300 ml-2"
                                      >
                                        ×
                                      </button>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          </FormControl>
                          <FormMessage className="text-red-400" />
                        </FormItem>
                      )}
                    />

                    {/* Technologies Field */}
                    <FormField
                      control={form.control}
                      name="technologies"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-200 font-medium">
                            {t.technologies} {t.required}
                          </FormLabel>
                          <FormControl>
                            <div className="space-y-2">
                              <Input
                                placeholder={t.technologyPlaceholder}
                                value={currentTechnology}
                                onChange={(e) =>
                                  setCurrentTechnology(e.target.value)
                                }
                                onKeyDown={handleTechnologyKeyPress}
                                className="bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-purple-500/20 transition-all duration-300"
                              />
                              {technologies.length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-2">
                                  {technologies.map((tech, index) => (
                                    <div
                                      key={index}
                                      className="flex items-center gap-1 px-2 py-1 bg-gray-800/30 rounded-md border border-gray-600 text-sm"
                                    >
                                      <span className="text-gray-200">
                                        {tech}
                                      </span>
                                      <button
                                        type="button"
                                        onClick={() => removeTechnology(tech)}
                                        className="text-red-400 hover:text-red-300 ml-1"
                                      >
                                        X
                                      </button>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          </FormControl>
                          <FormMessage className="text-red-400" />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Bottom Section - Additional Fields */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-gray-700">
                  {/* Experience Level */}
                  <FormField
                    control={form.control}
                    name="experienceLevel"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-200 font-medium">
                          {t.experienceLevel} {t.required}
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="bg-gray-800/50 border-gray-600 text-white">
                              <SelectValue placeholder="Seleccionar nivel" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-gray-800 border-gray-600">
                            <SelectItem value="Beginner" className="text-white">
                              {t.beginner}
                            </SelectItem>
                            <SelectItem
                              value="Intermediate"
                              className="text-white"
                            >
                              {t.intermediate}
                            </SelectItem>
                            <SelectItem value="Expert" className="text-white">
                              {t.expert}
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage className="text-red-400" />
                      </FormItem>
                    )}
                  />

                  {/* Project Count */}
                  <FormField
                    control={form.control}
                    name="projectCount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-200 font-medium">
                          {t.projectCount} {t.required}
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="0"
                            max="1000"
                            {...field}
                            onChange={(e) =>
                              field.onChange(parseInt(e.target.value) || 0)
                            }
                            className="bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-purple-500/20 transition-all duration-300"
                          />
                        </FormControl>
                        <FormMessage className="text-red-400" />
                      </FormItem>
                    )}
                  />

                  {/* Category */}
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-200 font-medium">
                          {t.category} {t.required}
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="bg-gray-800/50 border-gray-600 text-white">
                              <SelectValue placeholder="Seleccionar categoría" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-gray-800 border-gray-600">
                            <SelectItem value="design" className="text-white">
                              {t.design}
                            </SelectItem>
                            <SelectItem
                              value="development"
                              className="text-white"
                            >
                              {t.development}
                            </SelectItem>
                            <SelectItem
                              value="consulting"
                              className="text-white"
                            >
                              {t.consulting}
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage className="text-red-400" />
                      </FormItem>
                    )}
                  />
                </div>

                {/* CTA Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-gray-700">
                  <FormField
                    control={form.control}
                    name="ctaText"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-200 font-medium">
                          {t.buttonText} {t.required}
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder={t.ctaTextPlaceholder}
                            {...field}
                            className="bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-purple-500/20 transition-all duration-300"
                          />
                        </FormControl>
                        <FormMessage className="text-red-400" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="ctaLink"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-200 font-medium">
                          {t.buttonLink} {t.required}
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder={t.ctaLinkPlaceholder}
                            {...field}
                            className="bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-purple-500/20 transition-all duration-300"
                          />
                        </FormControl>
                        <FormMessage className="text-red-400" />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Optional Pricing Section */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pt-6 border-t border-gray-700">
                  <FormField
                    control={form.control}
                    name="startingPrice"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-200 font-medium">
                          {t.startingPrice}
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="0"
                            placeholder="500"
                            {...field}
                            onChange={(e) =>
                              field.onChange(
                                parseFloat(e.target.value) || undefined
                              )
                            }
                            className="bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-purple-500/20 transition-all duration-300"
                          />
                        </FormControl>
                        <FormMessage className="text-red-400" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="currency"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-200 font-medium">
                          {t.currency}
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="$"
                            {...field}
                            className="bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-purple-500/20 transition-all duration-300"
                          />
                        </FormControl>
                        <FormMessage className="text-red-400" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="priceType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-200 font-medium">
                          {t.priceType}
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="bg-gray-800/50 border-gray-600 text-white">
                              <SelectValue placeholder="Tipo" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-gray-800 border-gray-600">
                            <SelectItem value="project" className="text-white">
                              {t.perProject}
                            </SelectItem>
                            <SelectItem value="hour" className="text-white">
                              {t.perHour}
                            </SelectItem>
                            <SelectItem value="fixed" className="text-white">
                              {t.fixedPrice}
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage className="text-red-400" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="deliveryTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-200 font-medium">
                          {t.deliveryTime}
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="ej. 2-3 semanas"
                            {...field}
                            className="bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-purple-500/20 transition-all duration-300"
                          />
                        </FormControl>
                        <FormMessage className="text-red-400" />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Display Order */}
                <div className="pt-6 border-t border-gray-700">
                  <FormField
                    control={form.control}
                    name="displayOrder"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-200 font-medium">
                          {t.displayOrder}
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="1"
                            max="100"
                            placeholder="1"
                            {...field}
                            onChange={(e) =>
                              field.onChange(parseInt(e.target.value) || 1)
                            }
                            className="bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-purple-500/20 transition-all duration-300 max-w-xs"
                          />
                        </FormControl>
                        <p className="text-sm text-gray-400 mt-1">
                          {t.orderHelper}
                        </p>
                        <FormMessage className="text-red-400" />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Form Error Message */}
                {form.formState.errors.root && (
                  <div className="bg-red-900/20 border border-red-600 rounded-lg p-4">
                    <p className="text-red-400 text-sm">
                      {form.formState.errors.root.message}
                    </p>
                  </div>
                )}

                {/* Submit Button */}
                <div className="flex justify-center pt-8">
                  <Button
                    type="submit"
                    disabled={isUploading}
                    className="px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed min-w-[200px]"
                  >
                    {isUploading ?
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        {t.creatingService}
                      </div>
                    : t.createService}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Services;
