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

import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";

const addTechnologySchema = z.object({
  name: z
    .string()
    .min(2, { message: "Name must be at least 2 characters." })
    .max(50),
  icon: z.string().min(1, { message: "Icon URL is required." }),
});

// Component for managing individual technology visibility
const TechnologyItem = ({ technology, onToggle }) => {
  const [isUpdating, setIsUpdating] = useState(false);

  const handleToggle = async () => {
    setIsUpdating(true);
    try {
      await onToggle(technology._id, !technology.isVisible);
    } finally {
      setIsUpdating(false);
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
              (e.target as HTMLImageElement).style.display = "none";
              (e.target as HTMLImageElement).nextSibling.style.display =
                "block";
            }}
          />
          <div className="hidden text-xs text-gray-400">❌</div>
        </div>
        <div>
          <h3 className="text-white font-medium">{technology.name}</h3>
          <p className="text-sm text-gray-400">{technology.icon}</p>
        </div>
      </div>
      <div className="flex items-center space-x-3">
        <Badge variant={technology.isVisible ? "default" : "secondary"}>
          {technology.isVisible ? "Visible" : "Hidden"}
        </Badge>
        <Checkbox
          checked={technology.isVisible}
          onCheckedChange={handleToggle}
          disabled={isUpdating}
          className="data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600"
        />
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
        <CardTitle className="text-xl text-white">Add New Technology</CardTitle>
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
                      Technology Name
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
                    <FormLabel className="text-gray-200">Icon URL</FormLabel>
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
              Add Technology
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

// Main component that handles data loading and management
const TechnologyManagement = () => {
  const technologies = useQuery(api.technologies.getTechnologies);
  const createTechnology = useMutation(api.technologies.createTechnology);
  const toggleVisibility = useMutation(
    api.technologies.toggleTechnologyVisibility
  );
  const bulkInsert = useMutation(api.technologies.bulkInsertTechnologies);

  const [isInitializing, setIsInitializing] = useState(false);

  // Show loading state while data is being fetched
  if (technologies === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-white text-lg">Loading technologies...</div>
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

  // Initialize with default technologies (for first-time setup)
  const initializeDefaultTechnologies = async () => {
    setIsInitializing(true);
    try {
      const defaultTechnologies = [
        { name: "HTML 5", icon: "/icons/html.png", isVisible: true, order: 1 },
        { name: "CSS 3", icon: "/icons/css.png", isVisible: true, order: 2 },
        {
          name: "JavaScript",
          icon: "/icons/javascript.png",
          isVisible: true,
          order: 3,
        },
        {
          name: "TypeScript",
          icon: "/icons/typescript.png",
          isVisible: true,
          order: 4,
        },
        {
          name: "React JS",
          icon: "/icons/reactjs.png",
          isVisible: true,
          order: 5,
        },
        {
          name: "Redux Toolkit",
          icon: "/icons/redux.png",
          isVisible: true,
          order: 6,
        },
        {
          name: "Node.js",
          icon: "/icons/nodejs.png",
          isVisible: true,
          order: 7,
        },
        {
          name: "MongoDB",
          icon: "/icons/mongodb.png",
          isVisible: true,
          order: 8,
        },
        {
          name: "Three.js",
          icon: "/icons/threejs.svg",
          isVisible: true,
          order: 9,
        },
        { name: "Git", icon: "/icons/git.png", isVisible: true, order: 10 },
        { name: "Figma", icon: "/icons/figma.png", isVisible: true, order: 11 },
        {
          name: "Docker",
          icon: "/icons/docker.png",
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
              Technology Management
            </span>
          </h1>
          <p className="text-gray-400">
            Manage which technologies are displayed on your portfolio
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
              <p className="text-gray-400 mb-4">No technologies found.</p>
              <Button
                onClick={initializeDefaultTechnologies}
                disabled={isInitializing}
                className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
              >
                {isInitializing ?
                  "Initializing..."
                : "Initialize Default Technologies"}
              </Button>
            </CardContent>
          </Card>
        : <Card className="bg-gray-900/80 border-gray-700">
            <CardHeader>
              <CardTitle className="text-xl text-white">
                Manage Technologies
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {technologies.map((technology) => (
                  <TechnologyItem
                    key={technology._id}
                    technology={technology}
                    onToggle={handleToggleVisibility}
                  />
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
