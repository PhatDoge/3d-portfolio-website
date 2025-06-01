import React, { useContext, useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Id } from "../../../convex/_generated/dataModel";
import { LanguageContext } from "./Dashboard";
import { skillUpdateTranslations } from "./translations";

const updateFormSchema = z
  .object({
    title: z
      .string()
      .min(2, { message: "Title must be at least 2 characters." })
      .max(50),
    description: z
      .string()
      .min(2, { message: "Description must be at least 2 characters." })
      .max(500),
    iconUrl: z.string().url().optional().or(z.literal("")),
    iconFile: z.any().optional(),
    link: z.string().url({ message: "Please enter a valid URL for the link." }),
  })
  .refine((data) => data.iconUrl || data.iconFile, {
    message: "Either provide an icon URL or upload an image",
    path: ["iconUrl"],
  });

interface SkillUpdateProps {
  skill: any;
  onCancel: () => void;
  onSuccess: () => void;
}

const SkillUpdate: React.FC<SkillUpdateProps> = ({
  skill,
  onCancel,
  onSuccess,
}) => {
  const { language } = useContext(LanguageContext); // Add this line
  const t = skillUpdateTranslations[language];
  const [uploadedFileId, setUploadedFileId] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const updateSkill = useMutation(api.skills.updateSkill);
  const generateUploadUrl = useMutation(api.skills.generateUploadUrl);

  const form = useForm<z.infer<typeof updateFormSchema>>({
    resolver: zodResolver(updateFormSchema),
    defaultValues: {
      title: skill.title || "",
      description: skill.description || "",
      iconUrl: skill.iconUrl || "",
      iconFile: undefined,
      link: skill.link || "",
    },
  });

  const handleFileUpload = async (file: File) => {
    try {
      const postUrl = await generateUploadUrl();
      const result = await fetch(postUrl, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      });
      const { storageId } = await result.json();
      setUploadedFileId(storageId);
      return storageId;
    } catch (error) {
      console.error("Failed to upload file:", error);
      throw error;
    }
  };

  const onSubmit = async (values: z.infer<typeof updateFormSchema>) => {
    setIsUpdating(true);
    try {
      const skillData: {
        id: Id<"skills">;
        title: string;
        description: string;
        link: string;
        iconFile?: Id<"_storage">;
        iconUrl?: string;
      } = {
        id: skill._id,
        title: values.title,
        description: values.description,
        link: values.link,
      };

      if (uploadedFileId) {
        skillData.iconFile = uploadedFileId;
      } else if (values.iconUrl) {
        skillData.iconUrl = values.iconUrl;
      }

      await updateSkill(skillData);
      console.log("Skill updated successfully");
      onSuccess();
    } catch (error) {
      console.error("Failed to update skill:", error);
      alert(t.updateError);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <tr>
      <td colSpan={5} className="p-0">
        <div className="bg-gray-800/40 border-t border-gray-700">
          <div className="p-6">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">
                  {t.editSkill}
                </h3>
              </div>

              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Title Field */}
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-200 font-medium text-sm">
                            {t.title}
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder={t.titlePlaceholder}
                              {...field}
                              className="bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-purple-500/20 transition-all duration-300 text-sm"
                            />
                          </FormControl>
                          <FormMessage className="text-red-400 text-xs" />
                        </FormItem>
                      )}
                    />

                    {/* Link Field */}
                    <FormField
                      control={form.control}
                      name="link"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-200 font-medium text-sm">
                            {t.link}
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder={t.linkPlaceholder}
                              {...field}
                              className="bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-purple-500/20 transition-all duration-300 text-sm"
                            />
                          </FormControl>
                          <FormMessage className="text-red-400 text-xs" />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Description Field */}
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-200 font-medium text-sm">
                          {t.description}
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder={t.descriptionPlaceholder}
                            className="resize-none bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-purple-500/20 transition-all duration-300 min-h-20 text-sm"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-red-400 text-xs" />
                      </FormItem>
                    )}
                  />

                  {/* Icon Field */}
                  <FormField
                    control={form.control}
                    name="iconUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-200 font-medium text-sm">
                          {t.icon}
                        </FormLabel>
                        <FormControl>
                          <div className="space-y-3">
                            <Input
                              placeholder={t.iconPlaceholder}
                              {...field}
                              className="bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-purple-500/20 transition-all duration-300 text-sm"
                            />
                            <div className="text-gray-400 text-center text-xs">
                              {t.or}
                            </div>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={async (e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  try {
                                    const fileId = await handleFileUpload(file);
                                    form.setValue("iconFile", fileId);
                                    form.setValue("iconUrl", "");
                                  } catch (error) {
                                    alert(t.uploadError);
                                  }
                                }
                              }}
                              className="w-full text-gray-400 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-purple-600 file:text-white hover:file:bg-purple-700"
                            />
                          </div>
                        </FormControl>
                        <FormMessage className="text-red-400 text-xs" />
                      </FormItem>
                    )}
                  />

                  {/* Action Buttons */}
                  <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-700">
                    <Button
                      type="button"
                      onClick={onCancel}
                      variant="ghost"
                      className="text-gray-400 hover:text-gray-300 hover:bg-gray-700/50 text-sm px-4 py-2"
                      disabled={isUpdating}
                    >
                      {t.cancel}
                    </Button>
                    <Button
                      type="submit"
                      disabled={isUpdating}
                      className="px-6 py-2 green-pink-gradient text-white font-semibold rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/25 hover:scale-105 border-0 text-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                    >
                      {isUpdating ? t.updating : t.update}
                    </Button>
                  </div>
                </form>
              </Form>
            </div>
          </div>
        </div>
      </td>
    </tr>
  );
};

export default SkillUpdate;
