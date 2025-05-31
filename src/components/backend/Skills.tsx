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
import { useState } from "react";

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
    <div className="min-h-screen flex items-center justify-center p-4 mt-4 bg-gray-900">
      <div className="w-full max-w-2xl px-6 py-10 bg-gray-800/20 rounded-2xl shadow-inner border border-gray-700">
        <Card className="backdrop-blur-sm bg-gray-900/80 border-gray-700 shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 violet-gradient opacity-5"></div>

          <CardHeader className="relative z-10 text-center pb-8">
            <CardTitle className="text-3xl font-bold mb-2">
              <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                Agregar nueva habilidad
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
                          Título
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Ingresa el título de la habilidad"
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
                          Descripción
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Describe la habilidad"
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
                          Icono (URL o subir imagen)
                        </FormLabel>
                        <FormControl>
                          <div className="space-y-3">
                            <Input
                              placeholder="https://ejemplo.com/icono.png"
                              {...field}
                              className="bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-purple-500/20 transition-all duration-300"
                            />
                            <div className="text-gray-400 text-center text-sm">
                              o
                            </div>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={async (e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  const fileId = await handleFileUpload(file);
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
                          Enlace
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="https://ejemplo.com/proyecto"
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
                    Crear habilidad
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

// Main component that handles data loading
const Skills = () => {
  const data = useQuery(api.skills.getAllSkills);
  const createSkill = useMutation(api.skills.createSkill);

  // Show loading state while data is being fetched
  if (data === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-white text-lg">Loading...</div>
      </div>
    );
  }

  // Render the form only when data is available
  return <SkillsForm data={data} createSkill={createSkill} />;
};

export default Skills;
