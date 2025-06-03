import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { createContext, useContext, useState } from "react";
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
import { LanguageContext } from "./Dashboard";

import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { introductionTranslations } from "./translations";

const formSchema = z.object({
  title: z
    .string()
    .min(2, { message: "Title must be at least 2 characters." })
    .max(50),
  header: z
    .string()
    .min(2, { message: "Header must be at least 2 characters." })
    .max(50),
  description: z
    .string()
    .min(2, { message: "Description must be at least 2 characters." })
    .max(1000),
});

// Separate form component that only renders when data is available
const IntroductionForm = ({ data, createIntroduction }) => {
  const { language } = useContext(LanguageContext);
  const t = introductionTranslations[language];
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
      const id = await createIntroduction(values);
      console.log("introduction created with ID:", id);
      form.reset();
      window.location.href = "/";
    } catch (error) {
      console.error("Failed to create introduction:", error);
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
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                {t.title}
              </span>
            </CardTitle>
            <div className="w-24 h-1 bg-gradient-to-r from-purple-400 to-blue-400 mx-auto rounded-full mt-2"></div>
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
                    name="header"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-200 font-medium">
                          {t.header}
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Ingresa tu Cabezera"
                            {...field}
                            className="bg-gray-800/50 border border-gray-600/50 text-white placeholder-gray-400 focus:border-purple-400 focus:ring-purple-500/20 transition-all duration-300 rounded-lg shadow-inner px-4 py-2"
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
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-200 font-medium">
                          {t.formTitle}
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Ingresa tu Titulo"
                            className="resize-none bg-gray-800/50 border border-gray-600/50 text-white placeholder-gray-400 focus:border-purple-400 focus:ring-purple-500/20 transition-all duration-300 min-h-24 rounded-lg shadow-inner px-4 py-2"
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
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-200 font-medium">
                          {t.description}
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Ingresa tu Resumen"
                            className="resize-none bg-gray-800/50 border border-gray-600/50 text-white placeholder-gray-400 focus:border-purple-400 focus:ring-purple-500/20 transition-all duration-300 min-h-24 rounded-lg shadow-inner px-4 py-2"
                            {...field}
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
                    className="px-6 py-2 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 text-white font-semibold rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/25 hover:scale-105 border-0 shadow-md"
                  >
                    {t.button}
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
const Introduction = () => {
  const data = useQuery(api.introduction.getIntroductions);
  const createIntroduction = useMutation(api.introduction.createIntroduction);

  // Show loading state while data is being fetched
  if (data === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-white text-lg">Loading...</div>
      </div>
    );
  }

  // Render the form only when data is available
  return (
    <IntroductionForm data={data} createIntroduction={createIntroduction} />
  );
};

export default Introduction;
