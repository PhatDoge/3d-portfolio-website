import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
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
import ProjectDetails from "./ProjectDetails";

const formSchema = z.object({
  image: z.string().min(1, { message: "Please select an image." }),
  cardTitle: z
    .string()
    .min(2, { message: "Card title must be at least 2 characters." })
    .max(100),
  cardDescription: z
    .string()
    .min(2, { message: "Card description must be at least 2 characters." })
    .max(500),
  tag: z.string().min(2, { message: "At least one tag is required." }),
  githubLink: z.string().url({ message: "Please enter a valid GitHub URL." }),
  websiteLink: z
    .string()
    .url({ message: "Please enter a valid website URL." })
    .optional(),
});

const ProjectCard = () => {
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
      form.setError("image", { message: "Please select an image." });
      return;
    }

    if (tags.length === 0) {
      form.setError("tag", { message: "Please add at least one tag." });
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
        message: "Failed to create project. Please try again.",
      });
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 mt-4">
      <div className="w-full max-w-2xl px-6 py-10 bg-gray-800/20 rounded-2xl shadow-inner border border-gray-700 mb-8">
        <Card className="backdrop-blur-sm bg-gray-900/80 border-gray-700 shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 violet-gradient opacity-5"></div>

          <CardHeader className="relative z-10 text-center pb-8">
            <div className="text-center pb-4 mb-6">
              <h3 className="text-2xl font-bold">
                <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                  Crear Proyecto
                </span>
              </h3>
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
                          Imagen del Proyecto
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
                              className="bg-gray-800/50 border-gray-600 text-white file:bg-purple-600 file:text-white file:border-0 file:rounded-md file:px-4 file:py-2 file:mr-4 hover:file:bg-purple-700 transition-all duration-300"
                            />
                            {imagePreview && (
                              <div className="mt-2">
                                <img
                                  src={imagePreview}
                                  alt="Preview"
                                  className="w-full h-32 object-cover rounded-md border border-gray-600"
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
                          Título del Proyecto
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Ingresa el título del proyecto"
                            {...field}
                            className="bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-purple-500/20 transition-all duration-300"
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
                          Enlace de GitHub
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Ingresa el enlace de GitHub"
                            {...field}
                            className="bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-purple-500/20 transition-all duration-300"
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
                          Direccion Web
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Ingresa la direccion web"
                            {...field}
                            className="bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-purple-500/20 transition-all duration-300"
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
                          Descripción del Proyecto
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Describe tu proyecto en detalle"
                            className="resize-none bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-purple-500/20 transition-all duration-300 min-h-24"
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
                          Etiquetas
                        </FormLabel>
                        <FormControl>
                          <div className="space-y-2">
                            <Input
                              placeholder="Escribe una etiqueta y presiona Enter o coma"
                              value={currentTag}
                              onChange={(e) => setCurrentTag(e.target.value)}
                              onKeyDown={handleTagKeyPress}
                              className="bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-purple-500/20 transition-all duration-300"
                            />
                            {tags.length > 0 && (
                              <div className="flex flex-wrap gap-2 mt-2">
                                {tags.map((tag, index) => (
                                  <span
                                    key={index}
                                    className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-purple-600 text-white"
                                  >
                                    {tag}
                                    <button
                                      type="button"
                                      onClick={() => removeTag(tag)}
                                      className="ml-2 text-purple-200 hover:text-white"
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
                    className="px-4 py-2 green-pink-gradient text-white font-semibold rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/25 hover:scale-105 border-0 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isUploading ? "Creando proyecto..." : "Crear Proyecto"}
                  </Button>
                </div>
              </form>
            </Form>
            <div className="w-full max-w-2xl px-6 py-10 mt-8">
              <ProjectDetails />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Projects Display Component
      <ProjectsDisplay /> */}
    </div>
  );
};

export default ProjectCard;
