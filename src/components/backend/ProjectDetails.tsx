import { zodResolver } from "@hookform/resolvers/zod";
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
import { Textarea } from "../ui/textarea";

import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useContext } from "react";
import { LanguageContext } from "./Dashboard";
import { projectDetailsTranslations } from "./translations";

// Separate form component that only renders when data is available
const ProjectDetailsForm = ({ data, createProjectDetails }) => {
  // Move context usage inside the component
  const { language } = useContext(LanguageContext);
  const t = projectDetailsTranslations[language];

  // Move schema definition inside component so it has access to translations
  const formSchema = z.object({
    title: z
      .string()
      .min(2, { message: t.titleMinLength })
      .max(50, { message: t.titleMaxLength }),
    header: z
      .string()
      .min(2, { message: t.headerMinLength })
      .max(50, { message: t.headerMaxLength }),
    description: z
      .string()
      .min(2, { message: t.descriptionMinLength })
      .max(1000, { message: t.descriptionMaxLength }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: data[0]?.title || "",
      header: data[0]?.header || "",
      description: data[0]?.description || "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const id = await createProjectDetails(values);
      console.log("Project details created with ID:", id);
      form.reset();
      window.location.href = "/";
    } catch (error) {
      console.error("Failed to create project details:", error);
    }
  }

  return (
    <div className="w-full mt-5">
      {/* Section Header */}
      <div className="text-center pb-4 mb-6">
        <h3 className="text-2xl font-bold">
          <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            {t.headerDetails}
          </span>
        </h3>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Header Field */}
          <div className="mt-5">
            <FormField
              control={form.control}
              name="header"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-200 font-medium">
                    {t.header}
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t.headerPlaceholder}
                      {...field}
                      className="bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-purple-500/20 transition-all duration-300"
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
                  <FormLabel className="text-gray-200 font-medium">
                    {t.title}
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={t.titlePlaceholder}
                      className="resize-none bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-purple-500/20 transition-all duration-300 min-h-24"
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
                  <FormLabel className="text-gray-200 font-medium">
                    {t.summary}
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={t.summaryPlaceholder}
                      className="resize-none bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-purple-500/20 transition-all duration-300 min-h-24"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />
          </div>

          {/* Submit Button */}
          <div className="flex items-center justify-center mt-5">
            <Button
              type="submit"
              className="px-4 py-2 green-pink-gradient text-white font-semibold rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/25 hover:scale-105 border-0"
            >
              {t.saveDetails}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

// Main component that handles data loading
const ProjectDetails = () => {
  // Move context usage inside component
  const { language } = useContext(LanguageContext);
  const t = projectDetailsTranslations[language];

  const data = useQuery(api.projectdetails.getProjectDetails);
  const createProjectDetails = useMutation(
    api.projectdetails.createProjectDetails
  );

  // Show loading state while data is being fetched
  if (data === undefined) {
    return (
      <div className="w-full mt-5 flex items-center justify-center">
        <div className="text-white text-lg">{t.loadingProjectDetails}</div>
      </div>
    );
  }

  // Render the form only when data is available
  return (
    <ProjectDetailsForm
      data={data}
      createProjectDetails={createProjectDetails}
    />
  );
};

export default ProjectDetails;
