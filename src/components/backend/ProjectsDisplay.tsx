import React, { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Button } from "../ui/button";
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
import ProjectUpdateForm from "./ProjectUpdate";

const ProjectsDisplay = () => {
  // Edit mode state
  const [editingProject, setEditingProject] = useState<string | null>(null);

  // Convex queries and mutations
  const projects = useQuery(api.projects.getProjects);
  const deleteProject = useMutation(api.projects.deleteProject);

  // Functions
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleDeleteProject = async (projectId: string) => {
    try {
      await deleteProject({ id: projectId as any });
      console.log("Project deleted successfully");
    } catch (error) {
      console.error("Failed to delete project:", error);
      alert("Error al eliminar el proyecto. Inténtalo de nuevo.");
    }
  };

  const startEditing = (project: any) => {
    setEditingProject(project._id);
  };

  const cancelEditing = () => {
    setEditingProject(null);
  };

  const handleUpdateSuccess = () => {
    setEditingProject(null);
  };

  return (
    <div className="w-full max-w-7xl px-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold">
          <span className="orange-text-gradient">Todos los</span>{" "}
          <span className="green-text-gradient">Proyectos</span>
        </h2>
      </div>

      {projects === undefined ?
        <div className="flex justify-center items-center py-12">
          <div className="text-gray-400 text-lg">Cargando proyectos...</div>
        </div>
      : projects.length === 0 ?
        <div className="flex justify-center items-center py-12">
          <div className="text-gray-400 text-lg">
            No hay proyectos creados aún.
          </div>
        </div>
      : <div className="backdrop-blur-sm bg-gray-900/80 border border-gray-700 rounded-lg overflow-hidden shadow-2xl">
          <table className="w-full">
            {/* Table Header */}
            <thead className="bg-gray-800/50 border-b border-gray-700">
              <tr>
                <th className="text-left p-4 text-sm font-medium text-gray-300 w-20">
                  Imagen
                </th>
                <th className="text-center p-4 text-sm font-medium text-gray-300">
                  Título
                </th>
                <th className="text-center p-4 text-sm font-medium text-gray-300">
                  Tags
                </th>
                <th className="text-left p-4 text-sm font-medium text-gray-300 w-40">
                  Creado
                </th>
                <th className="text-left p-4 text-sm font-medium text-gray-300 w-32">
                  Actualizado
                </th>
                <th className="text-center p-4 text-sm font-medium text-gray-300 w-24">
                  Acciones
                </th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody className="divide-y divide-gray-700">
              {projects.map((project, index) => (
                <React.Fragment key={project._id}>
                  <tr
                    className={`hover:bg-gray-800/30 transition-colors duration-200 ${
                      index % 2 === 0 ? "bg-gray-900/40" : "bg-gray-900/20"
                    }`}
                  >
                    {/* Image */}
                    <td className="p-4">
                      {project.imageUrl ?
                        <img
                          src={project.imageUrl}
                          alt={project.cardTitle}
                          className="w-16 h-12 object-cover rounded border border-gray-600"
                        />
                      : <div className="w-16 h-12 bg-gray-700 rounded border border-gray-600 flex items-center justify-center">
                          <span className="text-gray-400 text-xs">
                            Sin imagen
                          </span>
                        </div>
                      }
                    </td>

                    {/* Title */}
                    <td className="p-4">
                      <div>
                        <h3 className="text-white text-center font-medium text-sm leading-tight mb-1">
                          {project.cardTitle}
                        </h3>
                        <p className="text-gray-400 text-xs line-clamp-2 text-center">
                          {project.cardDescription}
                        </p>
                      </div>
                    </td>

                    {/* Tags */}
                    <td className="p-4 text-center">
                      <div className="flex flex-wrap gap-1">
                        {project.tag
                          .split(", ")
                          .slice(0, 3)
                          .map((tag: string, tagIndex: number) => (
                            <span
                              key={tagIndex}
                              className="inline-block px-2 py-1 text-xs bg-purple-600/70 text-white rounded-full"
                            >
                              {tag.trim()}
                            </span>
                          ))}
                        {project.tag.split(", ").length > 3 && (
                          <span className="text-gray-400 text-xs">
                            +{project.tag.split(", ").length - 3}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Created Date */}
                    <td className="p-4 text-left">
                      <span className="text-gray-300 text-sm">
                        {formatDate(project.createdAt)}
                      </span>
                    </td>

                    {/* Updated Date */}
                    <td className="p-4 text-center">
                      <span className="text-gray-300 text-sm">
                        {(
                          project.updatedAt &&
                          project.updatedAt !== project.createdAt
                        ) ?
                          formatDate(project.updatedAt)
                        : "-"}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="p-4 text-center">
                      <div className="flex gap-2 justify-center">
                        {/* Edit Button */}
                        <Button
                          onClick={() => startEditing(project)}
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
                                ¿Eliminar proyecto?
                              </AlertDialogTitle>
                              <AlertDialogDescription className="text-gray-400">
                                Esta acción no se puede deshacer. El proyecto
                                será eliminado permanentemente.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel className="border-gray-600 hover:bg-gray-700/50">
                                Cancelar
                              </AlertDialogCancel>
                              <AlertDialogAction
                                className="bg-red-600 text-white hover:bg-red-700"
                                onClick={() => handleDeleteProject(project._id)}
                              >
                                Eliminar
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </td>
                  </tr>

                  {/* Edit Row - Using the extracted component */}
                  {editingProject === project._id && (
                    <ProjectUpdateForm
                      project={project}
                      onCancel={cancelEditing}
                      onSuccess={handleUpdateSuccess}
                    />
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      }
    </div>
  );
};

export default ProjectsDisplay;
