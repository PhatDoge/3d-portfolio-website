import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState } from "react";

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
import { Textarea } from "../ui/textarea";

import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useContext } from "react";
import { LanguageContext } from "./Dashboard";
import { experienceDetailsTranslations } from "./translations";

// Tooltip component with image display
const ImageTooltip = ({ imageUrl, children }) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        className="cursor-help"
      >
        {children}
      </div>
      {isVisible && imageUrl && (
        <div className="fixed top-4 right-4 z-50 pointer-events-none">
          <div className="relative">
            {/* Glowing border effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/30 via-pink-500/30 to-blue-500/30 rounded-lg blur-sm"></div>
            <div className="relative bg-gray-900/95 border border-gray-600/50 rounded-lg shadow-2xl overflow-hidden backdrop-blur-md">
              <img
                src={imageUrl}
                alt="Field example"
                className="w-96 h-auto max-h-fit object-contain"
                style={{ minWidth: "200px" }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Question mark icon component
const QuestionIcon = () => (
  <div className="inline-flex items-center justify-center w-4 h-4 ml-2 bg-gradient-to-r from-purple-400 to-blue-400 text-white text-xs font-bold rounded-full hover:from-purple-500 hover:to-blue-500 transition-all duration-200 hover:scale-110">
    ?
  </div>
);

// Separate form component that only renders when data is available
const ExperienceDetailsForm = ({
  data,
  createProjectDetails,
  updateProjectDetails,
}) => {
  // Move context usage inside the component
  const { language } = useContext(LanguageContext);
  const t = experienceDetailsTranslations[language];

  // Only keep header tooltip image
  const tooltipImages = {
    header: "/assets/tooltips/about_tooltip.png",
  };

  // Move schema definition inside component so it has access to translations
  const formSchema = z.object({
    title: z
      .string()
      .min(2, { message: t.titleMinLength })
      .max(50, { message: t.titleMaxLength })
      .optional(),
    header: z
      .string()
      .min(2, { message: t.headerMinLength })
      .max(50, { message: t.headerMaxLength })
      .optional(),
    description: z
      .string()
      .min(2, { message: t.descriptionMinLength })
      .max(1000, { message: t.descriptionMaxLength })
      .optional(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: data[0]?.ExperienceTitle || "",
      header: data[0]?.ExperienceHeader || "",
      description: data[0]?.ExperienceDescription || "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const recordId = data[0]?._id;

      // Map the form values to match your schema field names
      const mappedValues = {
        ExperienceTitle: values.title,
        ExperienceHeader: values.header,
        ExperienceDescription: values.description,
      };

      let id;
      if (recordId) {
        // Update existing record
        id = await updateProjectDetails({
          id: recordId,
          ...mappedValues,
        });
        console.log("Experience details updated with ID:", id);
      } else {
        // Create new record
        id = await createProjectDetails(mappedValues);
        console.log("Experience details created with ID:", id);
      }

      form.reset();
      window.location.href = "/";
    } catch (error) {
      console.error("Failed to save experience details:", error);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900 p-6 flex items-center justify-center">
      <div className="w-full max-w-2xl px-6 py-10 relative">
        {/* Glowing border effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-blue-500/20 rounded-2xl blur-xl pointer-events-none"></div>
        <div className="relative z-10 backdrop-blur-md bg-gray-900/80 border border-gray-700 rounded-2xl shadow-2xl overflow-hidden">
          <div className="absolute inset-0 violet-gradient opacity-5"></div>
          {/* Header Tooltip in the top-right corner */}
          <div className="absolute top-4 right-4 z-20">
            <ImageTooltip imageUrl={tooltipImages.header}>
              <QuestionIcon />
            </ImageTooltip>
          </div>
          <div className="relative z-10 text-center pb-8">
            <div className="text-center py-6 mb-6">
              <h3 className="text-2xl font-bold">
                <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                  {t.headerDetails}
                </span>
              </h3>
              <div className="w-24 h-1 bg-gradient-to-r from-purple-400 to-blue-400 mx-auto rounded-full mt-2"></div>
            </div>
          </div>
          <div className="relative z-10 p-6">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                {/* Header Field */}
                <div className="mt-5">
                  <FormField
                    control={form.control}
                    name="header"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-200 font-medium flex items-center">
                          {t.header}
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder={t.headerPlaceholder}
                            {...field}
                            className="bg-gray-800/50 border border-gray-600/50 text-white placeholder-gray-400 focus:border-purple-400/50 focus:ring-2 focus:ring-purple-400/20 transition-all duration-300 rounded-lg shadow-lg"
                          />
                        </FormControl>
                        <FormMessage className="text-red-400" />
                      </FormItem>
                    )}
                  />
                </div>
                {/* Title Field */}
                <div className="mt-5">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-200 font-medium flex items-center">
                          {t.title}
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder={t.titlePlaceholder}
                            className="resize-none bg-gray-800/50 border border-gray-600/50 text-white placeholder-gray-400 focus:border-purple-400/50 focus:ring-2 focus:ring-purple-400/20 transition-all duration-300 min-h-24 rounded-lg shadow-lg"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-red-400" />
                      </FormItem>
                    )}
                  />
                </div>
                {/* Description Field */}
                <div className="mt-5">
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-200 font-medium flex items-center">
                          {t.summary}
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder={t.summaryPlaceholder}
                            className="resize-none bg-gray-800/50 border border-gray-600/50 text-white placeholder-gray-400 focus:border-purple-400/50 focus:ring-2 focus:ring-purple-400/20 transition-all duration-300 min-h-24 rounded-lg shadow-lg"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-red-400" />
                      </FormItem>
                    )}
                  />
                </div>
                {/* Submit Button */}
                <div className="flex items-center justify-center mt-8 pt-4">
                  <Button
                    type="submit"
                    className="px-8 py-3 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 text-white font-semibold rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/25 hover:scale-105 border-0 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {t.saveDetails}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main component that handles data loading
const ExperienceDetails = () => {
  // Move context usage inside component
  const { language } = useContext(LanguageContext);
  const t = experienceDetailsTranslations[language];

  const data = useQuery(api.projectdetails.getProjectDetails);
  const createProjectDetails = useMutation(
    api.projectdetails.createProjectDetails
  );
  const updateProjectDetails = useMutation(
    api.projectdetails.updateProjectDetails
  );

  // Show loading state while data is being fetched
  if (data === undefined) {
    return (
      <div className="w-full mt-5 flex items-center justify-center">
        <div className="text-white text-lg">{t.loadingExperienceDetails}</div>
      </div>
    );
  }

  // Render the form only when data is available
  return (
    <ExperienceDetailsForm
      data={data}
      createProjectDetails={createProjectDetails}
      updateProjectDetails={updateProjectDetails}
    />
  );
};

export default ExperienceDetails;
