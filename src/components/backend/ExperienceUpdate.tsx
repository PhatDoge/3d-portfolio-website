import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState, useEffect, useContext } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { es } from "date-fns/locale";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { LanguageContext } from "./Dashboard";
import { experienceUpdateTranslations } from "./translations";

const createFormSchema = (t: any) =>
  z
    .object({
      icon: z.string().optional(),
      workplace: z.string().min(2, { message: t.workplaceMinLength }).max(100),
      workTitle: z.string().min(2, { message: t.workTitleMinLength }).max(100),
      description: z
        .string()
        .min(10, { message: t.descriptionMinLength })
        .max(1000),
      startDate: z.date({ required_error: t.startDateRequired }),
      endDate: z.date().optional(),
      isCurrentJob: z.boolean().default(false),
    })
    .refine(
      (data) => {
        if (!data.isCurrentJob && !data.endDate) {
          return false;
        }
        if (data.endDate && data.startDate) {
          return data.endDate >= data.startDate;
        }
        return true;
      },
      {
        message: t.endDateValidation,
        path: ["endDate"],
      }
    );

// Register Spanish locale for react-datepicker
registerLocale("es", es);

interface ExperienceUpdateProps {
  experience: any;
  onCancel: () => void;
  onSuccess: () => void;
}

const ExperienceUpdate: React.FC<ExperienceUpdateProps> = ({
  experience,
  onCancel,
  onSuccess,
}) => {
  const { language } = useContext(LanguageContext);
  const t = experienceUpdateTranslations[language];
  const [selectedIcon, setSelectedIcon] = useState<File | null>(null);
  const [iconPreview, setIconPreview] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);
  const [descriptions, setDescriptions] = useState<string[]>([]);
  const [currentDescription, setCurrentDescription] = useState<string>("");

  // Use translation-aware schema
  const formSchema = createFormSchema(t);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      icon: "",
      workplace: "",
      workTitle: "",
      description: "",
      startDate: undefined,
      endDate: undefined,
      isCurrentJob: false,
    },
  });

  // Initialize form with experience data
  useEffect(() => {
    if (experience) {
      form.setValue("workplace", experience.workplace);
      form.setValue("workTitle", experience.workTitle);
      form.setValue("startDate", new Date(experience.startDate));
      form.setValue(
        "endDate",
        experience.endDate ? new Date(experience.endDate) : undefined
      );
      form.setValue("isCurrentJob", experience.isCurrentJob);

      // Set descriptions from experience
      const experienceDescriptions = experience.descriptionArray || [];
      setDescriptions(experienceDescriptions);
      form.setValue("description", experienceDescriptions.join(" • "));

      // Set icon preview if exists
      if (experience.iconUrl) {
        setIconPreview(experience.iconUrl);
      }
    }
  }, [experience, form]);

  // Watch the isCurrentJob field to clear endDate when it's checked
  const isCurrentJob = form.watch("isCurrentJob");
  React.useEffect(() => {
    if (isCurrentJob) {
      form.setValue("endDate", undefined);
    }
  }, [isCurrentJob, form]);

  const updateWorkExperience = useMutation(
    api.workExperience.updateWorkExperience
  );
  const generateUploadUrl = useMutation(api.workExperience.generateUploadUrl);

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

  const handleDescriptionKeyPress = (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === "Enter") {
      event.preventDefault();
      const trimmedDescription = currentDescription.trim();

      if (trimmedDescription && !descriptions.includes(trimmedDescription)) {
        const newDescriptions = [...descriptions, trimmedDescription];
        setDescriptions(newDescriptions);
        setCurrentDescription("");
        form.setValue("description", newDescriptions.join(" • "));
      }
    }
  };

  const removeDescription = (descriptionToRemove: string) => {
    const newDescriptions = descriptions.filter(
      (desc) => desc !== descriptionToRemove
    );
    setDescriptions(newDescriptions);
    form.setValue(
      "description",
      newDescriptions.length > 0 ? newDescriptions.join(" • ") : ""
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
    // Add the last typed description if not already in the list
    if (currentDescription.trim()) {
      if (!descriptions.includes(currentDescription.trim())) {
        descriptions.push(currentDescription.trim());
      }
      setDescriptions([...descriptions]);
      form.setValue("description", descriptions.join(" • "));
    }

    if (descriptions.length === 0) {
      form.setError("description", {
        message: t.addOneDescription,
      });
      return;
    }

    try {
      setIsUploading(true);

      let iconStorageId = experience.icon; // Keep existing icon by default

      // Upload new icon if selected
      if (selectedIcon) {
        iconStorageId = await uploadIcon(selectedIcon);
      }

      // Update work experience
      const workExperienceData = {
        id: experience._id,
        icon: iconStorageId,
        workplace: values.workplace,
        workTitle: values.workTitle,
        description: descriptions.join(" • "),
        startDate: values.startDate.getTime(),
        endDate: values.endDate ? values.endDate.getTime() : undefined,
        isCurrentJob: values.isCurrentJob,
      };

      await updateWorkExperience(workExperienceData);
      console.log("Work experience updated successfully");

      // Call success callback
      onSuccess();
    } catch (error) {
      console.error("Failed to update work experience:", error);
      form.setError("root", {
        message: t.updateFailed,
      });
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <tr>
      <td colSpan={7} className="p-0">
        <div className="bg-gray-800/50 border-t border-gray-600 p-6">
          <div className="max-w-4xl mx-auto">
            <h3 className="text-lg font-semibold text-white mb-4">
              {t.editExperience}
            </h3>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Icon Upload Field */}
                  <div>
                    <FormField
                      control={form.control}
                      name="icon"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-200 font-medium">
                            {t.companyIcon}
                          </FormLabel>
                          <FormControl>
                            <div className="space-y-2">
                              <Input
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                  handleIconSelect(e);
                                  field.onChange(
                                    e.target.files?.[0]?.name || ""
                                  );
                                }}
                                className="bg-gray-700/50 border-gray-500 text-white file:bg-purple-600 file:text-white file:border-0 file:rounded-md file:px-3 file:py-1 file:mr-3 hover:file:bg-purple-700 text-sm"
                              />
                              {iconPreview && (
                                <div className="mt-2">
                                  <img
                                    src={iconPreview}
                                    alt="Icon Preview"
                                    className="w-12 h-12 object-cover rounded border border-gray-500"
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

                  {/* Workplace Field */}
                  <div>
                    <FormField
                      control={form.control}
                      name="workplace"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-200 font-medium">
                            {t.company}
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder={t.companyPlaceholder}
                              {...field}
                              className="bg-gray-700/50 border-gray-500 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-purple-500/20"
                            />
                          </FormControl>
                          <FormMessage className="text-red-400" />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Work Title Field */}
                  <div>
                    <FormField
                      control={form.control}
                      name="workTitle"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-200 font-medium">
                            {t.jobTitle}
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder={t.jobTitlePlaceholder}
                              {...field}
                              className="bg-gray-700/50 border-gray-500 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-purple-500/20"
                            />
                          </FormControl>
                          <FormMessage className="text-red-400" />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Current Job Checkbox */}
                  <div>
                    <FormField
                      control={form.control}
                      name="isCurrentJob"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 pt-6">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              className="border-gray-500 data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600"
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel className="text-gray-200 font-medium">
                              {t.currentJob}
                            </FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Start Date Field */}
                  <div>
                    <FormField
                      control={form.control}
                      name="startDate"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel className="text-gray-200 font-medium">
                            {t.startDate}
                          </FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant="outline"
                                  className={`w-full pl-3 text-left font-normal bg-gray-700/50 border-gray-500 text-white hover:bg-gray-600/50 hover:text-white ${
                                    !field.value && "text-gray-400"
                                  }`}
                                >
                                  {field.value ?
                                    format(field.value, "PPP", { locale: es })
                                  : <span>{t.selectStartDate}</span>}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent
                              className="w-auto p-0 bg-gray-800 border-gray-600"
                              align="start"
                            >
                              <DatePicker
                                selected={field.value}
                                onChange={field.onChange}
                                minDate={new Date("1900-01-01")}
                                maxDate={new Date()}
                                locale="es"
                                inline
                                calendarClassName="experience-datepicker"
                                showYearDropdown
                                scrollableYearDropdown
                                yearDropdownItemNumber={15}
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage className="text-red-400" />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* End Date Field - Only show if not current job */}
                  {!isCurrentJob && (
                    <div>
                      <FormField
                        control={form.control}
                        name="endDate"
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel className="text-gray-200 font-medium">
                              {t.endDate}
                            </FormLabel>
                            <Popover>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button
                                    variant="outline"
                                    className={`w-full pl-3 text-left font-normal bg-gray-700/50 border-gray-500 text-white hover:bg-gray-600/50 hover:text-white ${
                                      !field.value && "text-gray-400"
                                    }`}
                                  >
                                    {field.value ?
                                      format(field.value, "PPP", { locale: es })
                                    : <span>{t.selectEndDate}</span>}
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent
                                className="w-auto p-0 bg-gray-800 border-gray-600"
                                align="start"
                              >
                                <DatePicker
                                  selected={field.value}
                                  onChange={field.onChange}
                                  minDate={new Date("1900-01-01")}
                                  maxDate={new Date()}
                                  locale="es"
                                  inline
                                  calendarClassName="experience-datepicker"
                                  showYearDropdown
                                  scrollableYearDropdown
                                  yearDropdownItemNumber={15}
                                />
                              </PopoverContent>
                            </Popover>
                            <FormMessage className="text-red-400" />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}
                </div>

                {/* Description Field */}
                <div className="col-span-full">
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-200 font-medium">
                          {t.responsibilitiesDescription}
                        </FormLabel>
                        <FormControl>
                          <div className="space-y-2">
                            <Input
                              placeholder={t.responsibilityPlaceholder}
                              value={currentDescription}
                              onChange={(e) =>
                                setCurrentDescription(e.target.value)
                              }
                              onKeyDown={handleDescriptionKeyPress}
                              className="bg-gray-700/50 border-gray-500 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-purple-500/20"
                            />
                            {descriptions.length > 0 && (
                              <div className="space-y-2 mt-2 max-h-32 overflow-y-auto">
                                {descriptions.map((desc, index) => (
                                  <div
                                    key={index}
                                    className="flex items-start gap-2 p-2 bg-gray-700/30 rounded-md border border-gray-500"
                                  >
                                    <span className="text-purple-400 mt-1">
                                      •
                                    </span>
                                    <span className="text-gray-200 text-sm flex-1">
                                      {desc}
                                    </span>
                                    <button
                                      type="button"
                                      onClick={() => removeDescription(desc)}
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
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-end gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={onCancel}
                    className="border-gray-500 text-gray-300 hover:bg-gray-700/50"
                  >
                    {t.cancel}
                  </Button>
                  <Button
                    type="submit"
                    disabled={isUploading}
                    className="px-4 py-2 bg-gradient-to-r from-green-500 to-pink-500 text-white font-semibold rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/25 hover:scale-105 border-0 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isUploading ? t.updating : t.updateExperience}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </td>
    </tr>
  );
};

export default ExperienceUpdate;
