import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState } from "react";

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
import { Checkbox } from "../ui/checkbox";
import { Badge } from "../ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";

import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import TechnologyUpdate from "./TechnologyUpdate";

const addTechnologySchema = z.object({
  name: z
    .string()
    .min(2, { message: "Name must be at least 2 characters." })
    .max(50),
  icon: z.string().min(1, { message: "Icon URL is required." }),
});

// Component for managing individual technology visibility with edit/delete buttons
const TechnologyItem = ({
  technology,
  onToggle,
  onEdit,
  onDelete,
  isEditing,
}) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleToggle = async () => {
    setIsUpdating(true);
    try {
      await onToggle(technology._id, !technology.isVisible);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onDelete(technology._id);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex items-center justify-between p-4 bg-gray-800/30 rounded-lg border border-gray-700">
      <div className="flex items-center space-x-4">
        <div className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center overflow-hidden">
          <img
            src={technology.icon}
            alt={technology.name}
            className="w-8 h-8 object-contain"
            onError={(e) => {
              e.target.style.display = "none";
              e.target.nextSibling.style.display = "block";
            }}
          />
          <div className="hidden text-xs text-gray-400">❌</div>
        </div>
        <div>
          <h3 className="text-white font-medium pb-2">{technology.name}</h3>
          <p className="text-sm text-gray-400">{technology.icon}</p>
          {/* {technology.order !== undefined && (
            <p className="text-xs text-gray-500">Orden: {technology.order}</p>
          )} */}
        </div>
      </div>
      <div className="flex items-center space-x-3">
        <Badge variant={technology.isVisible ? "default" : "secondary"}>
          {technology.isVisible ? "Visible" : "Esconder"}
        </Badge>
        <Checkbox
          checked={technology.isVisible}
          onCheckedChange={handleToggle}
          disabled={isUpdating || isEditing}
          className="data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600 border-white"
        />

        {/* Add this condition to check if it's NOT a system icon */}
        {!(
          technology.order &&
          technology.order >= 1 &&
          technology.order <= 12
        ) && (
          <>
            {/* Edit Button */}
            <Button
              onClick={() => onEdit(technology)}
              disabled={isEditing}
              variant="ghost"
              size="sm"
              className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 p-2 h-8 w-8"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
            </Button>

            {/* Delete Button */}
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  disabled={isEditing}
                  variant="ghost"
                  size="sm"
                  className="text-red-400 hover:text-red-300 hover:bg-red-500/10 p-2 h-8 w-8"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="border border-gray-700 bg-gray-900">
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-gray-200">
                    ¿Eliminar tecnología?
                  </AlertDialogTitle>
                  <AlertDialogDescription className="text-gray-400">
                    Esta acción no se puede deshacer. La tecnología "
                    {technology.name}" será eliminada permanentemente.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="border-gray-600 hover:bg-gray-700/50">
                    Cancelar
                  </AlertDialogCancel>
                  <AlertDialogAction
                    className="bg-red-600 text-white hover:bg-red-700"
                    onClick={handleDelete}
                    disabled={isDeleting}
                  >
                    {isDeleting ? "Eliminando..." : "Eliminar"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </>
        )}
      </div>
    </div>
  );
};

// Form component for adding new technologies
const AddTechnologyForm = ({ onAdd }) => {
  const form = useForm<z.infer<typeof addTechnologySchema>>({
    resolver: zodResolver(addTechnologySchema),
    defaultValues: {
      name: "",
      icon: "",
    },
  });

  async function onSubmit(values: z.infer<typeof addTechnologySchema>) {
    try {
      await onAdd(values);
      form.reset();
    } catch (error) {
      console.error("Failed to add technology:", error);
    }
  }

  return (
    <Card className="bg-gray-900/80 border-gray-700 mb-6">
      <CardHeader>
        <CardTitle className="text-xl text-white">Agregar Tecnología</CardTitle>
      </CardHeader>
      <CardContent>
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
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold rounded-lg transition-all duration-300"
            >
              Agregar Tecnología
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

// Main component that handles data loading and management
const TechnologyManagement = () => {
  const [editingTechnology, setEditingTechnology] = useState<any | null>(null);

  const technologies = useQuery(api.technologies.getTechnologies);
  const createTechnology = useMutation(api.technologies.createTechnology);
  const toggleVisibility = useMutation(
    api.technologies.toggleTechnologyVisibility
  );
  const deleteTechnology = useMutation(api.technologies.deleteTechnology);
  const bulkInsert = useMutation(api.technologies.bulkInsertTechnologies);

  const [isInitializing, setIsInitializing] = useState(false);

  // Show loading state while data is being fetched
  if (technologies === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-white text-lg">Cargando tecnologías...</div>
      </div>
    );
  }

  // Handle adding new technology
  const handleAddTechnology = async (values) => {
    try {
      await createTechnology({
        name: values.name,
        icon: values.icon,
        isVisible: true,
      });
    } catch (error) {
      console.error("Failed to add technology:", error);
    }
  };

  // Handle toggling visibility
  const handleToggleVisibility = async (id, isVisible) => {
    try {
      await toggleVisibility({ id, isVisible });
    } catch (error) {
      console.error("Failed to toggle visibility:", error);
    }
  };

  // Handle editing technology
  const startEditing = (technology) => {
    setEditingTechnology(technology);
  };

  // Handle canceling edit
  const cancelEditing = () => {
    setEditingTechnology(null);
  };

  // Handle successful update
  const handleUpdateSuccess = () => {
    setEditingTechnology(null);
  };

  // Handle deleting technology
  const handleDeleteTechnology = async (id) => {
    try {
      const result = await deleteTechnology({ id });
      if (result?.success) {
        console.log("Technology deleted successfully");
      } else {
        throw new Error("Failed to delete technology");
      }
    } catch (error) {
      console.error("Failed to delete technology:", error);
      alert("Error al eliminar la tecnología. Inténtalo de nuevo.");
    }
  };

  // Initialize with default technologies (for first-time setup)
  const initializeDefaultTechnologies = async () => {
    setIsInitializing(true);
    try {
      const defaultTechnologies = [
        {
          name: "HTML 5",
          icon: "/tech/html.png",
          isVisible: true,
          order: 1,
        },
        {
          name: "CSS 3",
          icon: "/tech/css.png",
          isVisible: true,
          order: 2,
        },
        {
          name: "JavaScript",
          icon: "/tech/javascript.png",
          isVisible: true,
          order: 3,
        },
        {
          name: "TypeScript",
          icon: "/tech/typescript.png",
          isVisible: true,
          order: 4,
        },
        {
          name: "React JS",
          icon: "/tech/reactjs.png",
          isVisible: true,
          order: 5,
        },
        {
          name: "Redux Toolkit",
          icon: "/tech/redux.png",
          isVisible: true,
          order: 6,
        },
        {
          name: "Node.js",
          icon: "/tech/nodejs.png",
          isVisible: true,
          order: 7,
        },
        {
          name: "MongoDB",
          icon: "/tech/mongodb.png",
          isVisible: true,
          order: 8,
        },
        {
          name: "Three.js",
          icon: "/tech/threejs.svg",
          isVisible: true,
          order: 9,
        },
        {
          name: "Git",
          icon: "/tech/git.png",
          isVisible: true,
          order: 10,
        },
        {
          name: "Figma",
          icon: "/tech/figma.png",
          isVisible: true,
          order: 11,
        },
        {
          name: "Docker",
          icon: "/tech/docker.png",
          isVisible: true,
          order: 12,
        },
      ];

      await bulkInsert({ technologies: defaultTechnologies });
    } catch (error) {
      console.error("Failed to initialize default technologies:", error);
    } finally {
      setIsInitializing(false);
    }
  };

  const visibleCount = technologies.filter((tech) => tech.isVisible).length;
  const totalCount = technologies.length;

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Administracion de Tecnologias
            </span>
          </h1>
          <p className="text-gray-400">
            Administra tus tecnologias y controla su visibilidad en tu
            portafolio.
          </p>
          <div className="mt-4 flex justify-center space-x-4">
            <Badge
              variant="outline"
              className="text-green-400 border-green-400"
            >
              {visibleCount} Visible
            </Badge>
            <Badge variant="outline" className="text-gray-400 border-gray-400">
              {totalCount} Total
            </Badge>
          </div>
        </div>

        <AddTechnologyForm onAdd={handleAddTechnology} />

        {technologies.length === 0 ?
          <Card className="bg-gray-900/80 border-gray-700 text-center p-8">
            <CardContent>
              <p className="text-gray-400 mb-4">
                No se encontraron tecnologias
              </p>
              <Button
                onClick={initializeDefaultTechnologies}
                disabled={isInitializing}
                className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
              >
                {isInitializing ?
                  "Inicializando..."
                : "Iniciar con tecnologias predeterminadas"}
              </Button>
            </CardContent>
          </Card>
        : <Card className="bg-gray-900/80 border-gray-700">
            <CardHeader>
              <CardTitle className="text-xl text-white">
                Lista de Tecnologias
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {technologies.map((technology) => (
                  <div key={technology._id}>
                    <TechnologyItem
                      technology={technology}
                      onToggle={handleToggleVisibility}
                      onEdit={startEditing}
                      onDelete={handleDeleteTechnology}
                      isEditing={editingTechnology?._id === technology._id}
                    />

                    {/* Edit Form - Render below the technology item */}
                    {editingTechnology?._id === technology._id && (
                      <div className="mt-3">
                        <TechnologyUpdate
                          technology={editingTechnology}
                          onCancel={cancelEditing}
                          onSuccess={handleUpdateSuccess}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        }
      </div>
    </div>
  );
};

export default TechnologyManagement;
