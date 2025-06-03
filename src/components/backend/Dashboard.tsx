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

import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { userTranslations } from "./translations";

// Exporta el contexto y proveedor de idioma para uso global
export const LanguageContext = createContext({
  language: "es",
  toggleLanguage: () => {},
});

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState("es"); // 'es' o 'en'

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === "es" ? "en" : "es"));
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

const formSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Name must be at least 2 characters." })
    .max(50),
  description: z
    .string()
    .min(2, { message: "Description must be at least 2 characters." })
    .max(100),
});

// Separate form component that only renders when data is available
const HeaderForm = ({ data, createHeader }) => {
  const { language } = useContext(LanguageContext);
  const t = userTranslations[language];

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: data[0]?.name || "",
      description: data[0]?.description || "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const id = await createHeader(values);
      console.log("Header created with ID:", id);
      form.reset();
      window.location.href = "/";
    } catch (error) {
      console.error("Failed to create header:", error);
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
                {/* Título del formulario */}
                <CardTitle className="text-3xl font-bold mb-2">
                  <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                    {t.title}
                  </span>
                </CardTitle>
                <div className="w-24 h-1 bg-gradient-to-r from-purple-400 to-blue-400 mx-auto rounded-full"></div>
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
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-200 font-medium">
                              {t.name}
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder={t.namePlaceholder}
                                {...field}
                                className="bg-gray-800/50 border-gray-600/50 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-purple-500/20 transition-all duration-300 rounded-lg shadow-lg"
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
                                placeholder={t.descPlaceholder}
                                className="resize-none bg-gray-800/50 border-gray-600/50 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-purple-500/20 transition-all duration-300 min-h-24 rounded-lg shadow-lg"
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
                        className="px-4 py-2 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 text-white font-semibold rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/25 hover:scale-105 border-0"
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
      </div>
    </div>
  );
};

// Main component that handles data loading
const Dashboard = () => {
  const { language } = useContext(LanguageContext);
  const t = userTranslations[language];

  const data = useQuery(api.header.getHeader);
  const createHeader = useMutation(api.header.createHeader);

  // Muestra un estado de carga mientras se obtienen los datos
  if (data === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-white text-lg">{t.loading}</div>
      </div>
    );
  }

  // Renderiza el formulario solo cuando los datos están disponibles
  return <HeaderForm data={data} createHeader={createHeader} />;
};

// Componente principal envuelto con el proveedor de idioma
const DashboardWithLanguage = () => {
  return (
    <LanguageProvider>
      <Dashboard />
    </LanguageProvider>
  );
};

export default Dashboard;
