import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import React, { useState } from "react";

import { Input } from "../ui/input";
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { Textarea } from "../ui/textarea";

import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import ProjectDetails from "./ProjectDetails";
import ProjectUpdateForm from "./ProjectUpdate";

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
});

const ProjectCard = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState<string>("");

  // Edit mode state - simplified
  const [editingProject, setEditingProject] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      image: "",
      cardTitle: "",
      cardDescription: "",
      tag: "",
      githubLink: "",
    },
  });

  const createProject = useMutation(api.projects.createProject);
  const generateUploadUrl = useMutation(api.projects.generateUploadUrl);
  const deleteProject = useMutation(api.projects.deleteProject);
  const projects = useQuery(api.projects.getProjects);

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

  const startEditing = (project: any) => {
    setEditingProject(project._id);
  };

  const cancelEditing = () => {
    setEditingProject(null);
  };

  const handleUpdateSuccess = () => {
    setEditingProject(null);
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
        tag: tags.join(", "), // Ensure tags are saved as comma-separated string
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

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleDeleteProject = async (projectId: string) => {
    try {
      await deleteProject({ id: projectId as any });
      console.log("Project deleted successfully");
    } catch (error) {
      console.error("Failed to delete project:", error);
      alert("Error al eliminar el proyecto. Inténtalo de nuevo.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 mt-4">
      <div className="w-full max-w-2xl px-6 py-10 bg-gray-800/20 rounded-2xl shadow-inner border border-gray-700 mb-8">
        <Card className="backdrop-blur-sm bg-gray-900/80 border-gray-700 shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 violet-gradient opacity-5"></div>

          <CardHeader className="relative z-10 text-center pb-8">
            <div className="text-center pb-4 mb-6">
              <h3 className="text-2xl font-bold">
                <span className="orange-text-gradient">Crear</span>{" "}
                <span className="green-text-gradient">Proyecto</span>
              </h3>
            </div>
          </CardHeader>

          <CardContent className="relative z-10">
            {/* Project Details Section */}

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
            {/* Add ProjectDetails HERE - outside the project form container */}
            <div className="w-full max-w-2xl px-6 py-10 mt-8 ...">
              <ProjectDetails />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Projects Display Section */}
      <div className="w-full max-w-7xl px-6">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold">
            <span className="orange-text-gradient">Todos los</span>{" "}
            <span className="green-text-gradient">Proyectos</span>
          </h2>
        </div>

        {projects === undefined ?
          <div className="flex justify-center items-center py-12">
            <div className="text-gray-400 text-lg">Cargando proyectos...</div>
          </div>
        : projects.length === 0 ?
          <div className="flex justify-center items-center py-12">
            <div className="text-gray-400 text-lg">
              No hay proyectos creados aún.
            </div>
          </div>
        : <div className="backdrop-blur-sm bg-gray-900/80 border border-gray-700 rounded-lg overflow-hidden shadow-2xl">
            <table className="w-full">
              {/* Table Header */}
              <thead className="bg-gray-800/50 border-b border-gray-700">
                <tr>
                  <th className="text-left p-4 text-sm font-medium text-gray-300 w-20">
                    Imagen
                  </th>
                  <th className="text-left p-4 text-sm font-medium text-gray-300">
                    Título
                  </th>
                  <th className="text-left p-4 text-sm font-medium text-gray-300">
                    Tags
                  </th>
                  <th className="text-left p-4 text-sm font-medium text-gray-300 w-40">
                    Creado
                  </th>
                  <th className="text-left p-4 text-sm font-medium text-gray-300 w-32">
                    Actualizado
                  </th>
                  <th className="text-center p-4 text-sm font-medium text-gray-300 w-24">
                    Acciones
                  </th>
                </tr>
              </thead>

              {/* Table Body */}
              <tbody className="divide-y divide-gray-700">
                {projects.map((project, index) => (
                  <React.Fragment key={project._id}>
                    <tr
                      className={`hover:bg-gray-800/30 transition-colors duration-200 ${
                        index % 2 === 0 ? "bg-gray-900/40" : "bg-gray-900/20"
                      }`}
                    >
                      {/* Image */}
                      <td className="p-4">
                        {project.imageUrl ?
                          <img
                            src={project.imageUrl}
                            alt={project.cardTitle}
                            className="w-16 h-12 object-cover rounded border border-gray-600"
                          />
                        : <div className="w-16 h-12 bg-gray-700 rounded border border-gray-600 flex items-center justify-center">
                            <span className="text-gray-400 text-xs">
                              Sin imagen
                            </span>
                          </div>
                        }
                      </td>

                      {/* Title */}
                      <td className="p-4">
                        <div>
                          <h3 className="text-white text-center font-medium text-sm leading-tight mb-1">
                            {project.cardTitle}
                          </h3>
                          <p className="text-gray-400 text-xs line-clamp-2 text-center">
                            {project.cardDescription}
                          </p>
                        </div>
                      </td>

                      {/* Tags */}
                      <td className="p-4 text-center">
                        <div className="flex flex-wrap gap-1">
                          {project.tag
                            .split(", ")
                            .slice(0, 3)
                            .map((tag: string, tagIndex: number) => (
                              <span
                                key={tagIndex}
                                className="inline-block px-2 py-1 text-xs bg-purple-600/70 text-white rounded-full"
                              >
                                {tag.trim()}
                              </span>
                            ))}
                          {project.tag.split(", ").length > 3 && (
                            <span className="text-gray-400 text-xs">
                              +{project.tag.split(", ").length - 3}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Created Date */}
                      <td className="p-4 text-center">
                        <span className="text-gray-300 text-sm">
                          {formatDate(project.createdAt)}
                        </span>
                      </td>

                      {/* Updated Date */}
                      <td className="p-4 text-center">
                        <span className="text-gray-300 text-sm">
                          {(
                            project.updatedAt &&
                            project.updatedAt !== project.createdAt
                          ) ?
                            formatDate(project.updatedAt)
                          : "-"}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="p-4 text-center">
                        <div className="flex gap-2 justify-center">
                          {/* Edit Button */}
                          <Button
                            onClick={() => startEditing(project)}
                            variant="ghost"
                            size="sm"
                            className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 p-2 h-8 w-8"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                              />
                            </svg>
                          </Button>

                          {/* Delete Button */}
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-red-400 hover:text-red-300 hover:bg-red-500/10 p-2 h-8 w-8"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-4 w-4"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                  />
                                </svg>
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="border border-gray-700 bg-gray-900">
                              <AlertDialogHeader>
                                <AlertDialogTitle className="text-gray-200">
                                  ¿Eliminar proyecto?
                                </AlertDialogTitle>
                                <AlertDialogDescription className="text-gray-400">
                                  Esta acción no se puede deshacer. El proyecto
                                  será eliminado permanentemente.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel className="border-gray-600 hover:bg-gray-700/50">
                                  Cancelar
                                </AlertDialogCancel>
                                <AlertDialogAction
                                  className="bg-red-600 text-white hover:bg-red-700"
                                  onClick={() =>
                                    handleDeleteProject(project._id)
                                  }
                                >
                                  Eliminar
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </td>
                    </tr>

                    {/* Edit Row - Using the extracted component */}
                    {editingProject === project._id && (
                      <ProjectUpdateForm
                        project={project}
                        onCancel={cancelEditing}
                        onSuccess={handleUpdateSuccess}
                      />
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        }
      </div>
    </div>
  );
};

export default ProjectCard;
