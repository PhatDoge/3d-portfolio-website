import { zodResolver } from "@hookform/resolvers/zod";
import React, { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "../ui/button";
import { Card, CardContent, CardHeader } from "../ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";

import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { LanguageContext } from "./Dashboard";
import { projectTranslations } from "./translations";

const ProjectCard = () => {
  // Move context usage inside the component
  const { language } = useContext(LanguageContext);
  const t = projectTranslations[language];

  // Move schema definition inside component so it has access to translations
  const formSchema = z.object({
    image: z.string().min(1, { message: t.imageRequired }),
    cardTitle: z
      .string()
      .min(2, { message: t.titleMinLength })
      .max(100, { message: t.titleMaxLength }),
    cardDescription: z
      .string()
      .min(2, { message: t.descriptionMinLength })
      .max(500, { message: t.descriptionMaxLength }),
    tag: z.string().min(2, { message: t.tagRequired }),
    githubLink: z.string().url({ message: t.validGithubUrl }),
    websiteLink: z.string().url({ message: t.validWebsiteUrl }).optional(),
  });

  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState<string>("");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      image: "",
      cardTitle: "",
      cardDescription: "",
      tag: "",
      githubLink: "",
      websiteLink: "",
    },
  });

  const createProject = useMutation(api.projects.createProject);
  const generateUploadUrl = useMutation(api.projects.generateUploadUrl);

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTagKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" || event.key === ",") {
      event.preventDefault();
      const trimmedTag = currentTag.trim();

      if (trimmedTag && !tags.includes(trimmedTag)) {
        const newTags = [...tags, trimmedTag];
        setTags(newTags);
        setCurrentTag("");

        // Update the form field with joined tags
        form.setValue("tag", newTags.join(", "));
      }
    }
  };

  const removeTag = (tagToRemove: string) => {
    const newTags = tags.filter((tag) => tag !== tagToRemove);
    setTags(newTags);

    // Update the form field
    form.setValue("tag", newTags.length > 0 ? newTags.join(", ") : "");
  };

  const uploadImage = async (file: File): Promise<string> => {
    try {
      // Get upload URL from Convex
      const uploadUrl = await generateUploadUrl();

      // Upload file to Convex
      const result = await fetch(uploadUrl, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      });

      const { storageId } = await result.json();
      return storageId;
    } catch (error) {
      console.error("Failed to upload image:", error);
      throw new Error("Image upload failed");
    }
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!selectedImage) {
      form.setError("image", { message: t.imageRequired });
      return;
    }

    if (tags.length === 0) {
      form.setError("tag", { message: t.addOneTag });
      return;
    }

    try {
      setIsUploading(true);

      // Upload image first
      const imageStorageId = await uploadImage(selectedImage);

      // Create project with uploaded image ID and tags as string
      const projectData = {
        ...values,
        image: imageStorageId,
        tag: tags.join(", "),
        githubLink: values.githubLink || "",
        cardTitle: values.cardTitle || "",
        cardDescription: values.cardDescription || "",
      };

      const id = await createProject(projectData);
      console.log("Project created with ID:", id);

      // Reset form and state
      form.reset();
      setSelectedImage(null);
      setImagePreview("");
      setTags([]);
      setCurrentTag("");

      window.location.href = "/"; // navigate to the root route
    } catch (error) {
      console.error("Failed to create project:", error);
      form.setError("root", {
        message: t.createProjectError,
      });
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900 p-6 flex items-center justify-center">
      <div className="w-full max-w-2xl px-6 py-10 relative">
        {/* Glowing border effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-blue-500/20 rounded-2xl blur-xl pointer-events-none"></div>
        <Card className="relative z-10 backdrop-blur-md bg-gray-900/80 border border-gray-700 rounded-2xl shadow-2xl overflow-hidden">
          <div className="absolute inset-0 violet-gradient opacity-5"></div>

          <CardHeader className="relative z-10 text-center pb-8">
            <div className="text-center pb-4 mb-6">
              <h3 className="text-2xl font-bold">
                <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                  {t.createProject}
                </span>
              </h3>
              <div className="w-24 h-1 bg-gradient-to-r from-purple-400 to-blue-400 mx-auto rounded-full mt-2"></div>
            </div>
          </CardHeader>

          <CardContent className="relative z-10">
            {/* Project Card Form */}
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                {/* Image Upload Field */}
                <div className="mt-5">
                  <FormField
                    control={form.control}
                    name="image"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-200 font-medium">
                          {t.projectImage}
                        </FormLabel>
                        <FormControl>
                          <div className="space-y-4">
                            <Input
                              type="file"
                              accept="image/*"
                              onChange={(e) => {
                                handleImageSelect(e);
                                field.onChange(e.target.files?.[0]?.name || "");
                              }}
                              className="bg-gray-800/50 border border-gray-600/50 text-white file:bg-purple-600 file:text-white file:border-0 file:rounded-md file:px-4 file:py-2 file:mr-4 hover:file:bg-purple-700 transition-all duration-300 rounded-lg shadow-lg focus:border-purple-400/50 focus:ring-2 focus:ring-purple-400/20"
                            />
                            {imagePreview && (
                              <div className="mt-2">
                                <img
                                  src={imagePreview}
                                  alt={t.preview}
                                  className="w-full h-32 object-cover rounded-md border border-gray-600/50 shadow-lg"
                                />
                              </div>
                            )}
                          </div>
                        </FormControl>
                        <FormMessage className="text-red-400" />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Card Title Field */}
                <div className="mt-5">
                  <FormField
                    control={form.control}
                    name="cardTitle"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-200 font-medium">
                          {t.projectTitle}
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder={t.projectTitlePlaceholder}
                            {...field}
                            className="bg-gray-800/50 border border-gray-600/50 text-white placeholder-gray-400 focus:border-purple-400/50 focus:ring-2 focus:ring-purple-400/20 transition-all duration-300 rounded-lg shadow-lg"
                          />
                        </FormControl>
                        <FormMessage className="text-red-400" />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Card GithubLink Field */}
                <div className="mt-5">
                  <FormField
                    control={form.control}
                    name="githubLink"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-200 font-medium">
                          {t.githubLink}
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder={t.githubLinkPlaceholder}
                            {...field}
                            className="bg-gray-800/50 border border-gray-600/50 text-white placeholder-gray-400 focus:border-purple-400/50 focus:ring-2 focus:ring-purple-400/20 transition-all duration-300 rounded-lg shadow-lg"
                          />
                        </FormControl>
                        <FormMessage className="text-red-400" />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Card website Link Field */}
                <div className="mt-5">
                  <FormField
                    control={form.control}
                    name="websiteLink"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-200 font-medium">
                          {t.websiteAddress}
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder={t.websiteAddressPlaceholder}
                            {...field}
                            className="bg-gray-800/50 border border-gray-600/50 text-white placeholder-gray-400 focus:border-purple-400/50 focus:ring-2 focus:ring-purple-400/20 transition-all duration-300 rounded-lg shadow-lg"
                          />
                        </FormControl>
                        <FormMessage className="text-red-400" />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Card Description Field */}
                <div className="mt-5">
                  <FormField
                    control={form.control}
                    name="cardDescription"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-200 font-medium">
                          {t.projectDescription}
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder={t.projectDescriptionPlaceholder}
                            className="resize-none bg-gray-800/50 border border-gray-600/50 text-white placeholder-gray-400 focus:border-purple-400/50 focus:ring-2 focus:ring-purple-400/20 transition-all duration-300 min-h-24 rounded-lg shadow-lg"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-red-400" />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Tag Field */}
                <div className="mt-5">
                  <FormField
                    control={form.control}
                    name="tag"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-200 font-medium">
                          {t.tags}
                        </FormLabel>
                        <FormControl>
                          <div className="space-y-2">
                            <Input
                              placeholder={t.tagsPlaceholder}
                              value={currentTag}
                              onChange={(e) => setCurrentTag(e.target.value)}
                              onKeyDown={handleTagKeyPress}
                              className="bg-gray-800/50 border border-gray-600/50 text-white placeholder-gray-400 focus:border-purple-400/50 focus:ring-2 focus:ring-purple-400/20 transition-all duration-300 rounded-lg shadow-lg"
                            />
                            {tags.length > 0 && (
                              <div className="flex flex-wrap gap-2 mt-2">
                                {tags.map((tag, index) => (
                                  <span
                                    key={index}
                                    className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-purple-600/70 text-white shadow-md border border-purple-400/30 hover:bg-purple-700/80 transition-all duration-300"
                                  >
                                    {tag}
                                    <button
                                      type="button"
                                      onClick={() => removeTag(tag)}
                                      className="ml-2 text-purple-200 hover:text-white focus:outline-none"
                                    >
                                      ×
                                    </button>
                                  </span>
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

                <div className="flex items-center justify-center mt-5">
                  <Button
                    type="submit"
                    disabled={isUploading}
                    className="px-6 py-2 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 text-white font-semibold rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/25 hover:scale-105 border-0 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isUploading ? t.creatingProject : t.createProjectButton}
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

export default ProjectCard;
