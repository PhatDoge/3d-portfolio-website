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
    <div className="min-h-screen flex items-center justify-center p-4 mt-4 bg-gray-900">
      <div className="w-full max-w-2xl px-6 py-10 bg-gray-800/20 rounded-2xl shadow-inner border border-gray-700">
        <Card className="backdrop-blur-sm bg-gray-900/80 border-gray-700 shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 violet-gradient opacity-5"></div>

          <CardHeader className="relative z-10 text-center pb-8">
            <CardTitle className="text-3xl font-bold mb-2">
              <span className="orange-text-gradient">Cambia tu</span>{" "}
              <span className="green-text-gradient">cabezera</span>
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
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-200 font-medium">
                          Nombre
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Ingresa tu Nombre"
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
                            placeholder="Ingresa tu Descripción"
                            className="resize-none bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-purple-500/20 transition-all duration-300 min-h-24"
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
                    className="px-4 py-2 green-pink-gradient text-white font-semibold rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/25 hover:scale-105 border-0"
                  >
                    Cambiar detalles
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
const Dashboard = () => {
  const data = useQuery(api.header.getHeader);
  const createHeader = useMutation(api.header.createHeader);

  // Show loading state while data is being fetched
  if (data === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-white text-lg">Loading...</div>
      </div>
    );
  }

  // Render the form only when data is available
  return <HeaderForm data={data} createHeader={createHeader} />;
};

export default Dashboard;
