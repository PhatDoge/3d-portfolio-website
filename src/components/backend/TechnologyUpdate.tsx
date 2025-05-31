import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";

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
import { Checkbox } from "../ui/checkbox";

const updateTechnologySchema = z.object({
  name: z
    .string()
    .min(2, { message: "Name must be at least 2 characters." })
    .max(50),
  icon: z.string().min(1, { message: "Icon URL is required." }),
  isVisible: z.boolean(),
  order: z.number().min(0).optional(),
});

interface TechnologyUpdateProps {
  technology: {
    _id: string;
    name: string;
    icon: string;
    isVisible: boolean;
    order?: number;
  };
  onCancel: () => void;
  onSuccess: () => void;
}

const TechnologyUpdate: React.FC<TechnologyUpdateProps> = ({
  technology,
  onCancel,
  onSuccess,
}) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const updateTechnology = useMutation(api.technologies.updateTechnology);

  const form = useForm<z.infer<typeof updateTechnologySchema>>({
    resolver: zodResolver(updateTechnologySchema),
    defaultValues: {
      name: technology.name,
      icon: technology.icon,
      isVisible: technology.isVisible,
      order: technology.order || 0,
    },
  });

  async function onSubmit(values: z.infer<typeof updateTechnologySchema>) {
    setIsUpdating(true);
    try {
      const result = await updateTechnology({
        id: technology._id as any,
        name: values.name,
        icon: values.icon,
        isVisible: values.isVisible,
        order: values.order,
      });

      if (result?.success) {
        console.log("Technology updated successfully");
        onSuccess();
      } else {
        throw new Error("Failed to update technology");
      }
    } catch (error) {
      console.error("Failed to update technology:", error);
      alert("Error al actualizar la tecnología. Inténtalo de nuevo.");
    } finally {
      setIsUpdating(false);
    }
  }

  return (
    <tr className="bg-gray-800/50 border-t border-gray-600">
      <td colSpan={5} className="p-6">
        <div className="bg-gray-900/60 rounded-lg p-6 border border-gray-600">
          <h3 className="text-lg font-semibold text-white mb-4">
            Editar Tecnología
          </h3>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-200">
                        Nombre de la Tecnología
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., React JS"
                          {...field}
                          className="bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-purple-500"
                        />
                      </FormControl>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="icon"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-200">
                        URL de Icono
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="https://example.com/icon.png"
                          {...field}
                          className="bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-purple-500"
                        />
                      </FormControl>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  disabled
                  control={form.control}
                  name="order"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-200">Orden</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="0"
                          {...field}
                          onChange={(e) =>
                            field.onChange(parseInt(e.target.value) || 0)
                          }
                          className="bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-purple-500"
                        />
                      </FormControl>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="isVisible"
                  render={({ field }) => (
                    <FormItem className="flex flex-col justify-end">
                      <div className="flex items-center space-x-2 h-10">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            className="data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600 border-white"
                          />
                        </FormControl>
                        <FormLabel className="text-gray-200 cursor-pointer">
                          Visible en portafolio
                        </FormLabel>
                      </div>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="submit"
                  disabled={isUpdating}
                  className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-semibold rounded-lg transition-all duration-300"
                >
                  {isUpdating ? "Actualizando..." : "Actualizar Tecnología"}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  onClick={onCancel}
                  disabled={isUpdating}
                  className="border-gray-600 text-gray-300 hover:bg-gray-700/50 hover:text-white"
                >
                  Cancelar
                </Button>
              </div>

              {/* Preview of the icon */}
              {form.watch("icon") && (
                <div className="mt-4 p-4 bg-gray-800/30 rounded-lg border border-gray-700">
                  <p className="text-sm text-gray-400 mb-2">
                    Vista previa del icono:
                  </p>
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center overflow-hidden">
                      <img
                        src={form.watch("icon")}
                        alt={form.watch("name")}
                        className="w-8 h-8 object-contain"
                        onError={(e) => {
                          e.target.style.display = "none";
                          e.target.nextSibling.style.display = "block";
                        }}
                      />
                      <div className="hidden text-xs text-gray-400">❌</div>
                    </div>
                    <span className="text-gray-300">{form.watch("name")}</span>
                  </div>
                </div>
              )}
            </form>
          </Form>
        </div>
      </td>
    </tr>
  );
};

export default TechnologyUpdate;
