import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { es } from "date-fns/locale";

import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Calendar } from "../ui/calendar";
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

const formSchema = z
  .object({
    icon: z.string().min(1, { message: "Please select an icon image." }),
    workplace: z
      .string()
      .min(2, { message: "Workplace must be at least 2 characters." })
      .max(100),
    workTitle: z
      .string()
      .min(2, { message: "Work title must be at least 2 characters." })
      .max(100),
    description: z
      .string()
      .min(10, { message: "Description must be at least 10 characters." })
      .max(1000),
    startDate: z.date({
      required_error: "Start date is required.",
    }),
    endDate: z.date().optional(),
    isCurrentJob: z.boolean().default(false),
  })
  .refine(
    (data) => {
      // If it's not a current job, end date is required
      if (!data.isCurrentJob && !data.endDate) {
        return false;
      }
      // If both dates are provided, end date should be after start date
      if (data.endDate && data.startDate) {
        return data.endDate >= data.startDate;
      }
      return true;
    },
    {
      message:
        "End date must be after start date, or check 'Current Job' if this is your current position.",
      path: ["endDate"],
    }
  );

const WorkExperience = () => {
  const [selectedIcon, setSelectedIcon] = useState<File | null>(null);
  const [iconPreview, setIconPreview] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);
  const [descriptions, setDescriptions] = useState<string[]>([]);
  const [currentDescription, setCurrentDescription] = useState<string>("");

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

  // Replace with your actual Convex mutations
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
      form.setError("icon", { message: "Please select an icon." });
      return;
    }

    if (descriptions.length === 0) {
      form.setError("description", {
        message: "Please add at least one description bullet point.",
      });
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
      form.setError("root", {
        message: "Failed to create work experience. Please try again.",
      });
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 mt-4">
      <div className="w-full max-w-2xl px-6 py-10 bg-gray-800/20 rounded-2xl shadow-inner border border-gray-700">
        <Card className="backdrop-blur-sm bg-gray-900/80 border-gray-700 shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 violet-gradient opacity-5"></div>

          <CardHeader className="relative z-10 text-center pb-8">
            <CardTitle className="text-3xl font-bold mb-2">
              <span className="orange-text-gradient">Crear</span>{" "}
              <span className="blue-text-gradient">Experiencia</span>{" "}
              <span className="green-text-gradient">Laboral</span>
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
                          Icono de la Empresa
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
                              className="bg-gray-800/50 border-gray-600 text-white file:bg-purple-600 file:text-white file:border-0 file:rounded-md file:px-4 file:py-2 file:mr-4 hover:file:bg-purple-700 transition-all duration-300"
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
                          Empresa
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Nombre de la empresa"
                            {...field}
                            className="bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-purple-500/20 transition-all duration-300"
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
                          Título del Puesto
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Tu puesto de trabajo"
                            {...field}
                            className="bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-purple-500/20 transition-all duration-300"
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
                          Fecha de Inicio
                        </FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                className={`w-full pl-3 text-left font-normal bg-gray-800/50 border-gray-600 text-white hover:bg-gray-700/50 hover:text-white ${
                                  !field.value && "text-gray-400"
                                }`}
                              >
                                {field.value ?
                                  format(field.value, "PPP", { locale: es })
                                : <span>Selecciona fecha de inicio</span>}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>

                          <PopoverContent
                            className="w-auto p-0 bg-gray-800 border-gray-600 calendar-popover"
                            align="start"
                          >
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) =>
                                date > new Date() ||
                                date < new Date("1900-01-01")
                              }
                              initialFocus
                              className="bg-gray-800 text-white"
                              locale={es}
                              classNames={{
                                head_cell:
                                  "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem] uppercase",
                                head_row: "flex",
                              }}
                              formatters={{
                                formatWeekday: (date, options) =>
                                  date.toLocaleDateString("es-ES", {
                                    weekday: "narrow",
                                  }),
                              }}
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
                            Trabajo Actual
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
                            Fecha de Finalización
                          </FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant="outline"
                                  className={`w-full pl-3 text-left font-normal bg-gray-800/50 border-gray-600 text-white hover:bg-gray-700/50 hover:text-white ${
                                    !field.value && "text-gray-400"
                                  }`}
                                >
                                  {field.value ?
                                    format(field.value, "PPP", { locale: es })
                                  : <span>
                                      Selecciona fecha de finalización
                                    </span>
                                  }
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent
                              className="w-auto p-0 bg-gray-800 border-gray-600 calendar-popover"
                              align="start"
                            >
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) =>
                                  date > new Date() ||
                                  date < new Date("1900-01-01")
                                }
                                initialFocus
                                className="bg-gray-800 text-white"
                                locale={es}
                                classNames={{
                                  head_cell:
                                    "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem] uppercase",
                                  head_row: "flex",
                                }}
                                formatters={{
                                  formatWeekday: (date, options) =>
                                    date.toLocaleDateString("es-ES", {
                                      weekday: "narrow",
                                    }),
                                }}
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
                          Descripción de Responsabilidades
                        </FormLabel>
                        <FormControl>
                          <div className="space-y-2">
                            <Input
                              placeholder="Escribe una responsabilidad y presiona Enter"
                              value={currentDescription}
                              onChange={(e) =>
                                setCurrentDescription(e.target.value)
                              }
                              onKeyDown={handleDescriptionKeyPress}
                              className="bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-purple-500/20 transition-all duration-300"
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
                    className="px-4 py-2 green-pink-gradient text-white font-semibold rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/25 hover:scale-105 border-0 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isUploading ?
                      "Creando experiencia..."
                    : "Crear Experiencia"}
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
