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
import ExperienceUpdate from "./ExperienceUpdate";

const ExperienceList = () => {
  // Edit mode state
  const [editingExperience, setEditingExperience] = useState<string | null>(
    null
  );

  // Convex queries and mutations
  const experiences = useQuery(api.workExperience.getAllWorkExperiences);
  const deleteExperience = useMutation(api.workExperience.deleteWorkExperience);

  // Functions
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleDeleteExperience = async (experienceId: string) => {
    try {
      await deleteExperience({ id: experienceId as any });
      console.log("Experience deleted successfully");
    } catch (error) {
      console.error("Failed to delete experience:", error);
      alert("Error al eliminar la experiencia. Inténtalo de nuevo.");
    }
  };

  const startEditing = (experience: any) => {
    setEditingExperience(experience._id);
  };

  const cancelEditing = () => {
    setEditingExperience(null);
  };

  const handleUpdateSuccess = () => {
    setEditingExperience(null);
  };

  return (
    <div className="w-full max-w-7xl px-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold">
          <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            Todas las Experiencias
          </span>
        </h2>
      </div>

      {experiences === undefined ?
        <div className="flex justify-center items-center py-12">
          <div className="text-gray-400 text-lg">Cargando experiencias...</div>
        </div>
      : experiences.length === 0 ?
        <div className="flex justify-center items-center py-12">
          <div className="text-gray-400 text-lg">
            No hay experiencias creadas aún.
          </div>
        </div>
      : <div className="backdrop-blur-sm bg-gray-900/80 border border-gray-700 rounded-lg overflow-hidden shadow-2xl">
          <table className="w-full">
            {/* Table Header */}
            <thead className="bg-gray-800/50 border-b border-gray-700">
              <tr>
                <th className="text-left p-4 text-sm font-medium text-gray-300 w-20">
                  Icono
                </th>
                <th className="text-left p-4 text-sm font-medium text-gray-300">
                  Empresa
                </th>
                <th className="text-left p-4 text-sm font-medium text-gray-300">
                  Puesto
                </th>
                <th className="text-left p-4 text-sm font-medium text-gray-300">
                  Descripción
                </th>
                <th className="text-left p-4 text-sm font-medium text-gray-300 w-32">
                  Inicio
                </th>
                <th className="text-left p-4 text-sm font-medium text-gray-300 w-32">
                  Fin
                </th>
                <th className="text-center p-4 text-sm font-medium text-gray-300 w-24">
                  Acciones
                </th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody className="divide-y divide-gray-700">
              {experiences.map((experience, index) => (
                <React.Fragment key={experience._id}>
                  <tr
                    className={`hover:bg-gray-800/30 transition-colors duration-200 ${
                      index % 2 === 0 ? "bg-gray-900/40" : "bg-gray-900/20"
                    }`}
                  >
                    {/* Icon */}
                    <td className="p-4">
                      {experience.iconUrl ?
                        <img
                          src={experience.iconUrl}
                          alt={experience.workplace}
                          className="w-16 h-12 object-cover rounded border border-gray-600"
                        />
                      : <div className="w-16 h-12 bg-gray-700 rounded border border-gray-600 flex items-center justify-center">
                          <span className="text-gray-400 text-xs">
                            Sin icono
                          </span>
                        </div>
                      }
                    </td>

                    {/* Workplace */}
                    <td className="p-4">
                      <div>
                        <h3 className="text-white font-medium text-sm leading-tight mb-1">
                          {experience.workplace}
                        </h3>
                      </div>
                    </td>

                    {/* Work Title */}
                    <td className="p-4">
                      <div>
                        <p className="text-gray-300 text-sm">
                          {experience.workTitle}
                        </p>
                      </div>
                    </td>

                    {/* Description */}
                    <td className="p-4">
                      <div className="max-w-xs">
                        {experience.descriptionArray.length > 0 && (
                          <div className="space-y-1">
                            {experience.descriptionArray
                              .slice(0, 2)
                              .map((desc: string, descIndex: number) => (
                                <div
                                  key={descIndex}
                                  className="flex items-start gap-1"
                                >
                                  <span className="text-purple-400 text-xs mt-0.5">
                                    •
                                  </span>
                                  <span className="text-gray-400 text-xs line-clamp-1">
                                    {desc}
                                  </span>
                                </div>
                              ))}
                            {experience.descriptionArray.length > 2 && (
                              <span className="text-gray-400 text-xs">
                                +{experience.descriptionArray.length - 2} más
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Start Date */}
                    <td className="p-4 text-center">
                      <span className="text-gray-300 text-sm">
                        {formatDate(experience.startDate)}
                      </span>
                    </td>

                    {/* End Date */}
                    <td className="p-4 text-center">
                      <span className="text-gray-300 text-sm">
                        {experience.isCurrentJob ?
                          <span className="text-green-400 font-medium">
                            Actual
                          </span>
                        : experience.endDate ?
                          formatDate(experience.endDate)
                        : "-"}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="p-4 text-center">
                      <div className="flex gap-2 justify-center">
                        {/* Edit Button */}
                        <Button
                          onClick={() => startEditing(experience)}
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
                                ¿Eliminar experiencia?
                              </AlertDialogTitle>
                              <AlertDialogDescription className="text-gray-400">
                                Esta acción no se puede deshacer. La experiencia
                                será eliminada permanentemente.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel className="border-gray-600 hover:bg-gray-700/50">
                                Cancelar
                              </AlertDialogCancel>
                              <AlertDialogAction
                                className="bg-red-600 text-white hover:bg-red-700"
                                onClick={() =>
                                  handleDeleteExperience(experience._id)
                                }
                              >
                                Eliminar
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </td>
                  </tr>

                  {/* Edit Row - Using the update form component */}
                  {editingExperience === experience._id && (
                    <ExperienceUpdate
                      experience={experience}
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

export default ExperienceList;
