import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import React, { useState, useEffect, useContext } from "react";

import { Input } from "../ui/input";
import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Textarea } from "../ui/textarea";

import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { LanguageContext } from "./Dashboard";
import { projectUpdateTranslations } from "./translations";

const createFormSchema = (t: any) =>
  z.object({
    image: z.string().min(1, { message: t.imageRequired }),
    cardTitle: z.string().min(2, { message: t.titleMinLength }).max(100),
    cardDescription: z
      .string()
      .min(2, { message: t.descriptionMinLength })
      .max(500),
    tag: z.string().min(2, { message: t.tagRequired }),
  });

interface ProjectUpdateFormProps {
  project: any;
  onCancel: () => void;
  onSuccess: () => void;
}

const ProjectUpdateForm: React.FC<ProjectUpdateFormProps> = ({
  project,
  onCancel,
  onSuccess,
}) => {
  const { language } = useContext(LanguageContext);
  const t = projectUpdateTranslations[language];

  const [editImage, setEditImage] = useState<File | null>(null);
  const [editImagePreview, setEditImagePreview] = useState<string>("");
  const [editTags, setEditTags] = useState<string[]>([]);
  const [editCurrentTag, setEditCurrentTag] = useState<string>("");
  const [isUpdating, setIsUpdating] = useState(false);

  const updateProject = useMutation(api.projects.updateProject);
  const generateUploadUrl = useMutation(api.projects.generateUploadUrl);

  const formSchema = createFormSchema(t);
  const editForm = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      image: "",
      cardTitle: "",
      cardDescription: "",
      tag: "",
    },
  });

  // Initialize form with project data
  useEffect(() => {
    if (project) {
      editForm.setValue("cardTitle", project.cardTitle);
      editForm.setValue("cardDescription", project.cardDescription);

      // Parse tags from string
      const projectTags = project.tag
        .split(", ")
        .map((tag: string) => tag.trim());
      setEditTags(projectTags);
      editForm.setValue("tag", project.tag);

      // Set current image preview
      setEditImagePreview(project.imageUrl || "");
      editForm.setValue("image", project.image);
    }
  }, [project, editForm]);

  const handleEditImageSelect = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      setEditImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setEditImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditTagKeyPress = (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === "Enter" || event.key === ",") {
      event.preventDefault();
      const trimmedTag = editCurrentTag.trim();

      if (trimmedTag && !editTags.includes(trimmedTag)) {
        const newTags = [...editTags, trimmedTag];
        setEditTags(newTags);
        setEditCurrentTag("");
        editForm.setValue("tag", newTags.join(", "));
      }
    }
  };

  const removeEditTag = (tagToRemove: string) => {
    const newTags = editTags.filter((tag) => tag !== tagToRemove);
    setEditTags(newTags);
    editForm.setValue("tag", newTags.length > 0 ? newTags.join(", ") : "");
  };

  const uploadImage = async (file: File): Promise<string> => {
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
      console.error("Failed to upload image:", error);
      throw new Error("Image upload failed");
    }
  };

  const handleUpdateProject = async (values: z.infer<typeof formSchema>) => {
    if (editTags.length === 0) {
      editForm.setError("tag", { message: t.addOneTag });
      return;
    }

    try {
      setIsUpdating(true);

      let imageStorageId = values.image;

      // Upload new image if one was selected
      if (editImage) {
        imageStorageId = await uploadImage(editImage);
      }

      // Update project
      const updateData: any = {
        id: project._id as any,
        cardTitle: values.cardTitle,
        cardDescription: values.cardDescription,
        tag: editTags.join(", "),
      };

      // Only include image if it was updated
      if (editImage) {
        updateData.image = imageStorageId;
      }

      await updateProject(updateData);
      console.log("Project updated successfully");
      onSuccess();
    } catch (error) {
      console.error("Failed to update project:", error);
      editForm.setError("root", {
        message: t.updateFailed,
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCancel = () => {
    setEditImage(null);
    setEditImagePreview("");
    setEditTags([]);
    setEditCurrentTag("");
    editForm.reset();
    onCancel();
  };

  return (
    <tr className="bg-gray-800/50">
      <td colSpan={6} className="p-6">
        <div className="bg-gray-900/80 rounded-lg p-6 border border-gray-600">
          <h4 className="text-white text-lg font-semibold mb-4">
            {t.editProject}
          </h4>

          <Form {...editForm}>
            <form
              onSubmit={editForm.handleSubmit(handleUpdateProject)}
              className="space-y-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Edit Image Upload */}
                <div>
                  <FormField
                    control={editForm.control}
                    name="image"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-200 font-medium">
                          {t.projectImage}
                        </FormLabel>
                        <FormControl>
                          <div className="space-y-2">
                            <Input
                              type="file"
                              accept="image/*"
                              onChange={(e) => {
                                handleEditImageSelect(e);
                                field.onChange(
                                  e.target.files?.[0]?.name || field.value
                                );
                              }}
                              className="bg-gray-800/50 border-gray-600 text-white file:bg-purple-600 file:text-white file:border-0 file:rounded-md file:px-2 file:py-1 file:mr-2 hover:file:bg-purple-700 transition-all duration-300 text-sm"
                            />
                            {editImagePreview && (
                              <div className="mt-2">
                                <img
                                  src={editImagePreview}
                                  alt={t.preview}
                                  className="w-full h-24 object-cover rounded-md border border-gray-600"
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

                {/* Edit Title */}
                <div>
                  <FormField
                    control={editForm.control}
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
                            className="bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-purple-500/20 transition-all duration-300"
                          />
                        </FormControl>
                        <FormMessage className="text-red-400" />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Edit Description */}
              <div>
                <FormField
                  control={editForm.control}
                  name="cardDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-200 font-medium">
                        {t.projectDescription}
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder={t.projectDescriptionPlaceholder}
                          className="resize-none bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-purple-500/20 transition-all duration-300 min-h-20"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />
              </div>

              {/* Edit Tags */}
              <div>
                <FormField
                  control={editForm.control}
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
                            value={editCurrentTag}
                            onChange={(e) => setEditCurrentTag(e.target.value)}
                            onKeyDown={handleEditTagKeyPress}
                            className="bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-purple-500/20 transition-all duration-300"
                          />
                          {editTags.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-2">
                              {editTags.map((tag, index) => (
                                <span
                                  key={index}
                                  className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-purple-600 text-white"
                                >
                                  {tag}
                                  <button
                                    type="button"
                                    onClick={() => removeEditTag(tag)}
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

              {/* Action Buttons */}
              <div className="flex gap-3 justify-end pt-4">
                <Button
                  type="button"
                  onClick={handleCancel}
                  variant="ghost"
                  className="px-4 py-2 text-gray-400 hover:text-white hover:bg-gray-700/50 transition-all duration-300"
                >
                  {t.cancel}
                </Button>
                <Button
                  type="submit"
                  disabled={isUpdating}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isUpdating ? t.updating : t.updateProject}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </td>
    </tr>
  );
};

export default ProjectUpdateForm;
