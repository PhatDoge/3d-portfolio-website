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
import { skillDetailsTranslations } from "./translations";

// Separate form component that only renders when data is available
const SkillDetailsForm = ({
  data,
  createProjectDetails,
  updateProjectDetails,
}) => {
  // Move context usage inside the component
  const { language } = useContext(LanguageContext);
  const t = skillDetailsTranslations[language];

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
      title: data[0]?.skillTitle || "",
      header: data[0]?.skillHeader || "",
      description: data[0]?.skillDescription || "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const recordId = data[0]?._id;

      // Map the form values to match your schema field names
      const mappedValues = {
        skillTitle: values.title,
        skillHeader: values.header,
        skillDescription: values.description,
      };

      let id;
      if (recordId) {
        // Update existing record
        id = await updateProjectDetails({
          id: recordId,
          ...mappedValues,
        });
        console.log("Skill details updated with ID:", id);
      } else {
        // Create new record
        id = await createProjectDetails(mappedValues);
        console.log("Skill details created with ID:", id);
      }

      form.reset();
      window.location.href = "/";
    } catch (error) {
      console.error("Failed to save skill details:", error);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900 p-6 flex items-center justify-center">
      <div className="w-full max-w-2xl px-6 py-10 relative">
        {/* Glowing border effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-blue-500/20 rounded-2xl blur-xl pointer-events-none"></div>
        <div className="relative z-10 backdrop-blur-md bg-gray-900/80 border border-gray-700 rounded-2xl shadow-2xl overflow-hidden">
          <div className="absolute inset-0 violet-gradient opacity-5"></div>
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
                        <FormLabel className="text-gray-200 font-medium">
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
                        <FormLabel className="text-gray-200 font-medium">
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
                        <FormLabel className="text-gray-200 font-medium">
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
const SkillDetails = () => {
  // Move context usage inside component
  const { language } = useContext(LanguageContext);
  const t = skillDetailsTranslations[language];

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
        <div className="text-white text-lg">{t.loadingSkillDetails}</div>
      </div>
    );
  }

  // Render the form only when data is available
  return (
    <SkillDetailsForm
      data={data}
      createProjectDetails={createProjectDetails}
      updateProjectDetails={updateProjectDetails}
    />
  );
};

export default SkillDetails;
