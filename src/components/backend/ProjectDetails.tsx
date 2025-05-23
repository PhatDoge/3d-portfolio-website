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

import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api"; // adjust path as needed

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

const ProjectDetails = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      header: "",
      description: "",
    },
  });

  const createProjectDetails = useMutation(
    api.projectdetails.createProjectDetails
  );

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const id = await createProjectDetails(values);
      console.log("introduction created with ID:", id);
      form.reset();
      window.location.href = "/";
    } catch (error) {
      console.error("Failed to create introduction:", error);
    }
  }

  return (
    <div className="bg-[#18181b] border border-gray-700 rounded-xl p-6 shadow-lg max-w-xl mx-auto mb-8">
      {/* Section Header */}
      <div className="pb-4 border-b border-gray-700/50 mb-5">
        <h3 className="text-xl font-semibold">
          <span className="orange-text-gradient">Detalles</span>{" "}
          <span className="green-text-gradient">Personales</span>
        </h3>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          {/* Header Field */}
          <FormField
            control={form.control}
            name="header"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-200 font-normal text-left block mb-1">
                  Cabezera
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Ingresa tu Cabezera"
                    {...field}
                    className="bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-purple-500/20 transition-all duration-300"
                  />
                </FormControl>
                <FormMessage className="text-red-400 mt-1" />
              </FormItem>
            )}
          />

          {/* Title Field */}
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-200 font-normal text-left block mb-1">
                  Titulo
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Ingresa tu Titulo"
                    className="resize-none bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-purple-500/20 transition-all duration-300 min-h-24"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-red-400 mt-1" />
              </FormItem>
            )}
          />

          {/* Description Field */}
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-200 font-normal text-left block mb-1">
                  Resumen
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Ingresa tu Resumen"
                    className="resize-none bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-purple-500/20 transition-all duration-300 min-h-24"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-red-400 mt-1" />
              </FormItem>
            )}
          />

          {/* Submit Button */}
          <div className="flex items-center justify-center pt-2 mt-5">
            <Button
              type="submit"
              className="px-6 py-2 green-pink-gradient text-white font-semibold rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/25 hover:scale-105 border-0"
            >
              Guardar Detalles
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default ProjectDetails;
