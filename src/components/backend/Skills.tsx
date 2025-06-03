import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

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
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";

import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useContext, useState } from "react";
import { LanguageContext } from "./Dashboard";
import { skillTranslations } from "./translations";

const formSchema = z

  .object({
    title: z
      .string()
      .min(2, { message: "Title must be at least 2 characters." })
      .max(50),
    description: z
      .string()
      .min(2, { message: "Description must be at least 2 characters." })
      .max(500),
    iconUrl: z.string().url().optional().or(z.literal("")), // Make optional
    iconFile: z.any().optional(), // Add for file upload
    link: z.string().url({ message: "Please enter a valid URL for the link." }),
  })
  .refine((data) => data.iconUrl || data.iconFile, {
    message: "Either provide an icon URL or upload an image",
    path: ["iconUrl"], // This will show the error on the iconUrl field
  });

// Separate form component that only renders when data is available
const SkillsForm = ({ data, createSkill }) => {
  const { language } = useContext(LanguageContext); // Add this line
  const t = skillTranslations[language];
  const [uploadedFileId, setUploadedFileId] = useState(null);
  const generateUploadUrl = useMutation(api.skills.generateUploadUrl);

  const handleFileUpload = async (file) => {
    const postUrl = await generateUploadUrl();
    const result = await fetch(postUrl, {
      method: "POST",
      headers: { "Content-Type": file.type },
      body: file,
    });
    const { storageId } = await result.json();
    setUploadedFileId(storageId);
    return storageId;
  };
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      iconUrl: "",
      iconFile: undefined, // Add this line
      link: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const skillData: {
        title: string;
        description: string;
        link: string;
        iconFile?: string;
        iconUrl?: string;
      } = {
        title: values.title,
        description: values.description,
        link: values.link,
      };

      if (uploadedFileId) {
        skillData.iconFile = uploadedFileId;
      } else if (values.iconUrl) {
        skillData.iconUrl = values.iconUrl;
      }

      const id = await createSkill(skillData);
      console.log("skill created with ID:", id);
      form.reset();
      setUploadedFileId(null);
      window.location.href = "/";
    } catch (error) {
      console.error("Failed to create skill:", error);
    }
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900 p-6 flex items-center justify-center">
      <div className="w-full max-w-2xl mx-auto">
        <div className="relative">
          {/* Glowing border effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-blue-500/20 rounded-2xl blur-xl"></div>

          <div className="relative backdrop-blur-md bg-gray-800/60 border border-gray-600/50 rounded-2xl overflow-hidden shadow-2xl">
            <Card className="bg-transparent border-none shadow-none relative overflow-visible">
              <CardHeader className="relative z-10 text-center pb-8">
                <CardTitle className="text-3xl font-bold mb-2">
                  <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                    {t.title}
                  </span>
                </CardTitle>
              </CardHeader>

              <CardContent className="relative z-10">
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-6"
                  >
                    <div className="mt-5">
                      <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-200 font-medium">
                              {t.formTitle}
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder={t.formTitlePlaceholder}
                                {...field}
                                className="bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-purple-500/20 transition-all duration-300"
                              />
                            </FormControl>
                            <FormMessage className="text-red-400" />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="mt-5">
                      <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-200 font-medium">
                              {t.description}
                            </FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder={t.descriptionPlaceholder}
                                className="resize-none bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-purple-500/20 transition-all duration-300 min-h-24"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage className="text-red-400" />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="mt-5">
                      <FormField
                        control={form.control}
                        name="iconUrl"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-200 font-medium">
                              {t.iconLabel}
                            </FormLabel>
                            <FormControl>
                              <div className="space-y-3">
                                <Input
                                  placeholder={t.iconPlaceholder}
                                  {...field}
                                  className="bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-purple-500/20 transition-all duration-300"
                                />
                                <div className="text-gray-400 text-center text-sm">
                                  {t.or}
                                </div>
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={async (e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                      const fileId =
                                        await handleFileUpload(file);
                                      form.setValue("iconFile", fileId);
                                      form.setValue("iconUrl", ""); // Clear URL when file is uploaded
                                    }
                                  }}
                                  className="w-full text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-purple-600 file:text-white hover:file:bg-purple-700"
                                />
                              </div>
                            </FormControl>
                            <FormMessage className="text-red-400" />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="mt-5">
                      <FormField
                        control={form.control}
                        name="link"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-200 font-medium">
                              {t.link}
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder={t.linkPlaceholder}
                                {...field}
                                className="bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-purple-500/20 transition-all duration-300"
                              />
                            </FormControl>
                            <FormMessage className="text-red-400" />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="flex items-center justify-center mt-5">
                      <Button
                        type="submit"
                        className="px-4 py-2 green-pink-gradient text-white font-semibold rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/25 hover:scale-105 border-0"
                      >
                        {t.submit}
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main component that handles data loading
const Skills = () => {
  const { language } = useContext(LanguageContext);
  const t = skillTranslations[language];

  const data = useQuery(api.skills.getAllSkills);
  const createSkill = useMutation(api.skills.createSkill);

  // Show loading state while data is being fetched
  if (data === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-white text-lg">{t.loading}</div>
      </div>
    );
  }

  // Render the form only when data is available
  return <SkillsForm data={data} createSkill={createSkill} />;
};

export default Skills;
