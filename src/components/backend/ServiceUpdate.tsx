import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState, useEffect, useContext } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "../ui/button";
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
import { serviceUpdateTranslations } from "./translations";

// Same form schema as create form
const formSchema = z.object({
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
  ctaText: z
    .string()
    .min(2, { message: "CTA text must be at least 2 characters." })
    .max(30, { message: "CTA text must be less than 30 characters." }),
  ctaLink: z.string().min(1, { message: "CTA link is required." }),
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
  category: z.enum(["design", "development", "consulting"], {
    required_error: "Please select a category.",
  }),
  displayOrder: z
    .number()
    .min(1, { message: "Display order must be at least 1." })
    .max(100, { message: "Display order must be less than 100." }),
});

interface ServiceUpdateProps {
  service: any;
  onCancel: () => void;
  onSuccess: () => void;
}

const ServiceUpdate: React.FC<ServiceUpdateProps> = ({
  service,
  onCancel,
  onSuccess,
}) => {
  const { language } = useContext(LanguageContext);
  const t = serviceUpdateTranslations[language];

  const [selectedIcon, setSelectedIcon] = useState<File | null>(null);
  const [iconPreview, setIconPreview] = useState<string>(service.iconUrl || "");
  const [isUploading, setIsUploading] = useState(false);
  const [keyFeatures, setKeyFeatures] = useState<string[]>([]);
  const [currentFeature, setCurrentFeature] = useState<string>("");
  const [technologies, setTechnologies] = useState<string[]>([]);
  const [currentTechnology, setCurrentTechnology] = useState<string>("");

  // Parse existing features and technologies from the service
  useEffect(() => {
    if (service.keyFeatures) {
      const features = service.keyFeatures.split(" • ").filter(Boolean);
      setKeyFeatures(features);
    }
    if (service.technologies) {
      const techs = service.technologies.split(", ").filter(Boolean);
      setTechnologies(techs);
    }
  }, [service]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: service.title || "",
      icon: service.icon || "",
      subtitle: service.subtitle || "",
      badgeText: service.badgeText || "",
      accentColor: service.accentColor || "",
      description: service.description || "",
      keyFeatures: service.keyFeatures || "",
      technologies: service.technologies || "",
      experienceLevel: service.experienceLevel || undefined,
      projectCount: service.projectCount || 0,
      ctaText: service.ctaText || "",
      ctaLink: service.ctaLink || "",
      startingPrice: service.startingPrice || undefined,
      currency: service.currency || "$",
      priceType: service.priceType || undefined,
      deliveryTime: service.deliveryTime || "",
      category: service.category || undefined,
      displayOrder: service.displayOrder || 1,
    },
  });

  // Convex mutations
  const updateService = useMutation(api.services.updateService);
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

    if (keyFeatures.length === 0) {
      form.setError("keyFeatures", {
        message: t.addFeatureError,
      });
      return;
    }

    if (technologies.length === 0) {
      form.setError("technologies", {
        message: t.addTechnologyError,
      });
      return;
    }

    try {
      setIsUploading(true);

      let iconStorageId = service.icon; // Use existing icon by default

      // Upload new icon if selected
      if (selectedIcon) {
        iconStorageId = await uploadIcon(selectedIcon);
      }

      // Prepare update data
      const updateData = {
        id: service._id,
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

      await updateService(updateData);
      console.log("Service updated successfully");
      onSuccess();
    } catch (error) {
      console.error("Failed to update service:", error);
      form.setError("root", {
        message: t.updateError,
      });
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <tr className="bg-gray-800/50">
      <td colSpan={9} className="p-6">
        <div className="bg-gray-900/80 border border-gray-600 rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-blue-400">
              {t.editService}: {service.title}
            </h3>
            <Button
              onClick={onCancel}
              variant="ghost"
              size="sm"
              className="text-gray-400 hover:text-gray-300"
            >
              ✕
            </Button>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Column - Front Side Content */}
                <div className="space-y-4">
                  <h4 className="text-lg font-medium text-purple-400 border-b border-purple-400/30 pb-2">
                    {t.frontContent}
                  </h4>

                  {/* Title Field */}
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-200 text-sm">
                          {t.serviceTitle} {t.required}
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder={t.titlePlaceholder}
                            {...field}
                            className="bg-gray-800/50 border-gray-600 text-white text-sm h-9"
                          />
                        </FormControl>
                        <FormMessage className="text-red-400 text-xs" />
                      </FormItem>
                    )}
                  />

                  {/* Icon Upload Field */}
                  <FormField
                    control={form.control}
                    name="icon"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-200 text-sm">
                          {t.serviceIcon}
                        </FormLabel>
                        <FormControl>
                          <div className="space-y-2">
                            <Input
                              type="file"
                              accept="image/*"
                              onChange={(e) => {
                                handleIconSelect(e);
                                field.onChange(
                                  e.target.files?.[0]?.name || field.value
                                );
                              }}
                              className="bg-gray-800/50 border-gray-600 text-white text-sm h-9"
                            />
                            {iconPreview && (
                              <div className="mt-2">
                                <img
                                  src={iconPreview}
                                  alt="Icon Preview"
                                  className="w-12 h-12 object-cover rounded border border-gray-600"
                                />
                              </div>
                            )}
                          </div>
                        </FormControl>
                        <FormMessage className="text-red-400 text-xs" />
                      </FormItem>
                    )}
                  />

                  {/* Subtitle Field */}
                  <FormField
                    control={form.control}
                    name="subtitle"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-200 text-sm">
                          {t.subtitle}
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder={t.subtitlePlaceholder}
                            {...field}
                            className="bg-gray-800/50 border-gray-600 text-white text-sm h-9"
                          />
                        </FormControl>
                        <FormMessage className="text-red-400 text-xs" />
                      </FormItem>
                    )}
                  />

                  {/* Badge Text Field */}
                  <FormField
                    control={form.control}
                    name="badgeText"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-200 text-sm">
                          {t.badgeText}
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder={t.badgePlaceholder}
                            {...field}
                            className="bg-gray-800/50 border-gray-600 text-white text-sm h-9"
                          />
                        </FormControl>
                        <FormMessage className="text-red-400 text-xs" />
                      </FormItem>
                    )}
                  />

                  {/* Accent Color Field */}
                  <FormField
                    control={form.control}
                    name="accentColor"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-200 text-sm">
                          {t.accentColor}
                        </FormLabel>
                        <FormControl>
                          <div className="flex gap-2">
                            <Input
                              placeholder={t.colorPlaceholder}
                              {...field}
                              className="bg-gray-800/50 border-gray-600 text-white text-sm h-9"
                            />
                            <input
                              type="color"
                              value={field.value || "#00cea8"}
                              onChange={(e) => field.onChange(e.target.value)}
                              className="w-9 h-9 rounded border border-gray-600 bg-gray-800"
                            />
                          </div>
                        </FormControl>
                        <FormMessage className="text-red-400 text-xs" />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Right Column - Back Side Content */}
                <div className="space-y-4">
                  <h4 className="text-lg font-medium text-green-400 border-b border-green-400/30 pb-2">
                    {t.backContent}
                  </h4>

                  {/* Description Field */}
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-200 text-sm">
                          {t.description}
                          {t.required}
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder={t.descriptionPlaceholder}
                            {...field}
                            rows={3}
                            className="bg-gray-800/50 border-gray-600 text-white text-sm resize-none"
                          />
                        </FormControl>
                        <FormMessage className="text-red-400 text-xs" />
                      </FormItem>
                    )}
                  />

                  {/* Key Features Field */}
                  <FormField
                    control={form.control}
                    name="keyFeatures"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-200 text-sm">
                          {t.keyFeatures}
                          {t.required}
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
                              className="bg-gray-800/50 border-gray-600 text-white text-sm h-9"
                            />
                            {keyFeatures.length > 0 && (
                              <div className="space-y-1 max-h-24 overflow-y-auto">
                                {keyFeatures.map((feature, index) => (
                                  <div
                                    key={index}
                                    className="flex items-center gap-2 p-2 bg-gray-800/30 rounded text-sm"
                                  >
                                    <span className="text-purple-400">•</span>
                                    <span className="text-gray-200 flex-1">
                                      {feature}
                                    </span>
                                    <button
                                      type="button"
                                      onClick={() => removeFeature(feature)}
                                      className="text-red-400 hover:text-red-300 text-xs"
                                    >
                                      ×
                                    </button>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </FormControl>
                        <FormMessage className="text-red-400 text-xs" />
                      </FormItem>
                    )}
                  />

                  {/* Technologies Field */}
                  <FormField
                    control={form.control}
                    name="technologies"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-200 text-sm">
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
                              className="bg-gray-800/50 border-gray-600 text-white text-sm h-9"
                            />
                            {technologies.length > 0 && (
                              <div className="flex flex-wrap gap-1">
                                {technologies.map((tech, index) => (
                                  <div
                                    key={index}
                                    className="flex items-center gap-1 px-2 py-1 bg-gray-800/30 rounded text-xs"
                                  >
                                    <span className="text-gray-200">
                                      {tech}
                                    </span>
                                    <button
                                      type="button"
                                      onClick={() => removeTechnology(tech)}
                                      className="text-red-400 hover:text-red-300"
                                    >
                                      ×
                                    </button>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </FormControl>
                        <FormMessage className="text-red-400 text-xs" />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Bottom Section - Additional Fields */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-700">
                {/* Experience Level */}
                <FormField
                  control={form.control}
                  name="experienceLevel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-200 text-sm">
                        {t.experienceLevel} {t.required}
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="bg-gray-800/50 border-gray-600 text-white h-9">
                            <SelectValue placeholder={t.selectOption} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-gray-800 border-gray-600">
                          <SelectItem value="Beginner">{t.beginner}</SelectItem>
                          <SelectItem value="Intermediate">
                            {t.intermediate}
                          </SelectItem>
                          <SelectItem value="Expert">{t.expert}</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage className="text-red-400 text-xs" />
                    </FormItem>
                  )}
                />

                {/* Project Count */}
                <FormField
                  control={form.control}
                  name="projectCount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-200 text-sm">
                        {t.projects} {t.required}
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="0"
                          {...field}
                          onChange={(e) =>
                            field.onChange(parseInt(e.target.value) || 0)
                          }
                          className="bg-gray-800/50 border-gray-600 text-white text-sm h-9"
                        />
                      </FormControl>
                      <FormMessage className="text-red-400 text-xs" />
                    </FormItem>
                  )}
                />

                {/* Category */}
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-200 text-sm">
                        {t.category} {t.required}
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="bg-gray-800/50 border-gray-600 text-white h-9">
                            <SelectValue placeholder="Seleccionar" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-gray-800 border-gray-600">
                          <SelectItem value="design">{t.design}</SelectItem>
                          <SelectItem value="development">
                            {t.development}
                          </SelectItem>
                          <SelectItem value="consulting">
                            {t.consulting}
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage className="text-red-400 text-xs" />
                    </FormItem>
                  )}
                />
              </div>

              {/* CTA and Pricing Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-700">
                <FormField
                  control={form.control}
                  name="ctaText"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-200 text-sm">
                        {t.buttonText} {t.required}
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t.buttonTextPlaceholder}
                          {...field}
                          className="bg-gray-800/50 border-gray-600 text-white text-sm h-9"
                        />
                      </FormControl>
                      <FormMessage className="text-red-400 text-xs" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="ctaLink"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-200 text-sm">
                        {t.buttonLink} {t.required}
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t.buttonLinkPlaceholder}
                          {...field}
                          className="bg-gray-800/50 border-gray-600 text-white text-sm h-9"
                        />
                      </FormControl>
                      <FormMessage className="text-red-400 text-xs" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="startingPrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-200 text-sm">
                        {t.startingPrice}
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="0"
                          placeholder={t.pricePlaceholder}
                          {...field}
                          onChange={(e) =>
                            field.onChange(
                              parseFloat(e.target.value) || undefined
                            )
                          }
                          className="bg-gray-800/50 border-gray-600 text-white text-sm h-9"
                        />
                      </FormControl>
                      <FormMessage className="text-red-400 text-xs" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="displayOrder"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-200 text-sm">
                        {t.displayOrder} {t.required}
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="1"
                          max="100"
                          {...field}
                          onChange={(e) =>
                            field.onChange(parseInt(e.target.value) || 1)
                          }
                          className="bg-gray-800/50 border-gray-600 text-white text-sm h-9"
                        />
                      </FormControl>
                      <FormMessage className="text-red-400 text-xs" />
                    </FormItem>
                  )}
                />
              </div>

              {/* Form Error Message */}
              {form.formState.errors.root && (
                <div className="bg-red-900/20 border border-red-600 rounded p-3">
                  <p className="text-red-400 text-sm">
                    {form.formState.errors.root.message}
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-4">
                <Button
                  type="button"
                  onClick={onCancel}
                  variant="ghost"
                  className="text-gray-400 hover:text-gray-300 hover:bg-gray-700/50"
                >
                  {t.cancel}
                </Button>
                <Button
                  type="submit"
                  disabled={isUploading}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white disabled:opacity-50"
                >
                  {isUploading ?
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      {t.updating}
                    </div>
                  : t.updateService}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </td>
    </tr>
  );
};

export default ServiceUpdate;
