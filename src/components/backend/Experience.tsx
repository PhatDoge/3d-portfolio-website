import { zodResolver } from "@hookform/resolvers/zod";
import React, { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { es } from "date-fns/locale";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
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
import { workExperienceTranslations } from "./translations";
import { LanguageContext } from "./Dashboard"; // Make sure this import exists

const createFormSchema = (t: any) =>
  z
    .object({
      icon: z.string().min(1, { message: t.iconRequired }),
      workplace: z.string().min(2, { message: t.workplaceMinLength }).max(100),
      workTitle: z.string().min(2, { message: t.workTitleMinLength }).max(100),
      description: z
        .string()
        .min(10, { message: t.descriptionMinLength })
        .max(1000),
      startDate: z.date({ required_error: t.startDateRequired }),
      endDate: z.date().optional(),
      isCurrentJob: z.boolean(),
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

const WorkExperience = () => {
  // Add error handling for context
  const languageContext = useContext(LanguageContext);

  // Fallback if context is not available
  if (!languageContext) {
    console.error(
      "LanguageContext not found. Make sure the component is wrapped with LanguageContext.Provider"
    );
    return <div>Language context not available</div>;
  }

  const { language } = languageContext;
  const t =
    workExperienceTranslations[language] || workExperienceTranslations.es; // Fallback to Spanish

  const [selectedIcon, setSelectedIcon] = useState<File | null>(null);
  const [iconPreview, setIconPreview] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);
  const [descriptions, setDescriptions] = useState<string[]>([]);
  const [currentDescription, setCurrentDescription] = useState<string>("");

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

  // Watch the isCurrentJob field to clear endDate when it's checked
  const isCurrentJob = form.watch("isCurrentJob");
  React.useEffect(() => {
    if (isCurrentJob) {
      form.setValue("endDate", undefined);
    }
  }, [isCurrentJob, form]);

  const createWorkExperience = useMutation(
    api.workExperience.createWorkExperience
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

        // Update the form field with joined descriptions
        form.setValue("description", newDescriptions.join(" • "));
      }
    }
  };

  const removeDescription = (descriptionToRemove: string) => {
    const newDescriptions = descriptions.filter(
      (desc) => desc !== descriptionToRemove
    );
    setDescriptions(newDescriptions);

    // Update the form field
    form.setValue(
      "description",
      newDescriptions.length > 0 ? newDescriptions.join(" • ") : ""
    );
  };

  const uploadIcon = async (file: File): Promise<string> => {
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

    if (!selectedIcon) {
      form.setError("icon", { message: t.iconRequiredCustom });
      return;
    }

    if (descriptions.length === 0) {
      form.setError("description", { message: t.descriptionRequired });
      return;
    }

    try {
      setIsUploading(true);

      // Upload icon first
      const iconStorageId = await uploadIcon(selectedIcon);

      // Create work experience with uploaded icon ID and descriptions as string
      const workExperienceData = {
        icon: iconStorageId,
        workplace: values.workplace,
        workTitle: values.workTitle,
        description: descriptions.join(" • "), // Save as bullet-separated string
        startDate: values.startDate.getTime(), // Convert to timestamp
        endDate: values.endDate ? values.endDate.getTime() : undefined,
        isCurrentJob: values.isCurrentJob,
      };

      const id = await createWorkExperience(workExperienceData);
      console.log("Work experience created with ID:", id);

      // Reset form and state
      form.reset();
      setSelectedIcon(null);
      setIconPreview("");
      setDescriptions([]);
      setCurrentDescription("");

      window.location.href = "/"; // navigate to the root route
    } catch (error) {
      console.error("Failed to create work experience:", error);
      form.setError("root", { message: t.submissionError });
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900 p-6 flex items-center justify-center">
      <div className="w-full max-w-2xl px-6 py-10 relative">
        {/* Glowing border effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-blue-500/20 rounded-2xl blur-xl pointer-events-none"></div>
        <Card className="relative z-10 backdrop-blur-md bg-gray-800/60 border border-gray-600/50 rounded-2xl shadow-2xl overflow-hidden">
          <div className="absolute inset-0 violet-gradient opacity-5"></div>

          <CardHeader className="relative z-10 text-center pb-8">
            <CardTitle className="text-3xl font-bold mb-2">
              <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                {t.cardTitle}
              </span>
            </CardTitle>
          </CardHeader>

          <CardContent className="relative z-10">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                {/* Icon Upload Field */}
                <div className="mt-5">
                  <FormField
                    control={form.control}
                    name="icon"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-200 font-medium">
                          {t.companyIcon}
                        </FormLabel>
                        <FormControl>
                          <div className="space-y-4">
                            <Input
                              type="file"
                              accept="image/*"
                              onChange={(e) => {
                                handleIconSelect(e);
                                field.onChange(e.target.files?.[0]?.name || "");
                              }}
                              className="bg-gray-800/50 border border-gray-600/50 text-white file:bg-purple-600 file:text-white file:border-0 file:rounded-md file:px-4 file:py-2 file:mr-4 hover:file:bg-purple-700 transition-all duration-300 rounded-lg shadow-inner px-4 py-2"
                            />
                            {iconPreview && (
                              <div className="mt-2">
                                <img
                                  src={iconPreview}
                                  alt="Icon Preview"
                                  className="w-16 h-16 object-cover rounded-full border border-gray-600"
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
                <div className="mt-5">
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
                            className="bg-gray-800/50 border border-gray-600/50 text-white placeholder-gray-400 focus:border-purple-400 focus:ring-purple-500/20 transition-all duration-300 rounded-lg shadow-inner px-4 py-2"
                          />
                        </FormControl>
                        <FormMessage className="text-red-400" />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Work Title Field */}
                <div className="mt-5">
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
                            className="bg-gray-800/50 border border-gray-600/50 text-white placeholder-gray-400 focus:border-purple-400 focus:ring-purple-500/20 transition-all duration-300 rounded-lg shadow-inner px-4 py-2"
                          />
                        </FormControl>
                        <FormMessage className="text-red-400" />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Start Date Field */}
                <div className="mt-5">
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
                                className={`w-full pl-3 text-left font-normal bg-gray-800/50 border border-gray-600/50 text-white hover:bg-gray-700/50 hover:text-white rounded-lg shadow-inner px-4 py-2 transition-all duration-300 ${
                                  !field.value && "text-gray-400"
                                }`}
                              >
                                {field.value ?
                                  format(field.value, "PPP", { locale: es })
                                : <span>{t.startDatePlaceholder}</span>}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>

                          <PopoverContent
                            className="w-auto p-0 bg-gray-800 border border-gray-600 calendar-popover"
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

                {/* Current Job Checkbox */}
                <div className="mt-5">
                  <FormField
                    control={form.control}
                    name="isCurrentJob"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            className="border-gray-600 data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600"
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

                {/* End Date Field - Only show if not current job */}
                {!isCurrentJob && (
                  <div className="mt-5">
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
                                  className={`w-full pl-3 text-left font-normal bg-gray-800/50 border border-gray-600/50 text-white hover:bg-gray-700/50 hover:text-white rounded-lg shadow-inner px-4 py-2 transition-all duration-300 ${
                                    !field.value && "text-gray-400"
                                  }`}
                                >
                                  {field.value ?
                                    format(field.value, "PPP", { locale: es })
                                  : <span>{t.endDatePlaceholder}</span>}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent
                              className="w-auto p-0 bg-gray-800 border border-gray-600 calendar-popover"
                              align="start"
                            >
                              <DatePicker
                                selected={field.value}
                                onChange={field.onChange}
                                minDate={new Date("1900-01-01")}
                                maxDate={
                                  isCurrentJob ?
                                    new Date("2999-12-31")
                                  : new Date()
                                }
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

                {/* Description Field */}
                <div className="mt-5">
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-200 font-medium">
                          {t.responsibilities}
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
                              className="bg-gray-800/50 border border-gray-600/50 text-white placeholder-gray-400 focus:border-purple-400 focus:ring-purple-500/20 transition-all duration-300 rounded-lg shadow-inner px-4 py-2"
                            />
                            {descriptions.length > 0 && (
                              <div className="space-y-2 mt-2">
                                {descriptions.map((desc, index) => (
                                  <div
                                    key={index}
                                    className="flex items-start gap-2 p-2 bg-gray-800/30 rounded-md border border-gray-600"
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

                <div className="flex items-center justify-center mt-5">
                  <Button
                    type="submit"
                    disabled={isUploading}
                    className="px-6 py-2 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 text-white font-semibold rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/25 hover:scale-105 border-0 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isUploading ? t.submitButtonLoading : t.submitButton}
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

export default WorkExperience;
