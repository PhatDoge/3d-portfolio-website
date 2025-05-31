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
import SkillUpdate from "./SkillUpdate";

const SkillsList = () => {
  // Edit mode state
  const [editingSkill, setEditingSkill] = useState<string | null>(null);

  // Convex queries and mutations
  const skills = useQuery(api.skills.getAllSkills);
  const deleteSkill = useMutation(api.skills.deleteSkill);

  // Functions
  const handleDeleteSkill = async (skillId: string) => {
    try {
      await deleteSkill({ id: skillId as any });
      console.log("Skill deleted successfully");
    } catch (error) {
      console.error("Failed to delete skill:", error);
      alert("Error al eliminar la habilidad. Inténtalo de nuevo.");
    }
  };

  const startEditing = (skill: any) => {
    setEditingSkill(skill._id);
  };

  const cancelEditing = () => {
    setEditingSkill(null);
  };

  const handleUpdateSuccess = () => {
    setEditingSkill(null);
  };

  const truncateText = (text: string, maxLength: number) => {
    return text.length > maxLength ?
        text.substring(0, maxLength) + "..."
      : text;
  };

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4">
            <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Todas las Habilidades
            </span>
          </h2>
        </div>

        {skills === undefined ?
          <div className="flex justify-center items-center py-12">
            <div className="text-gray-400 text-lg">Cargando habilidades...</div>
          </div>
        : skills.length === 0 ?
          <div className="flex justify-center items-center py-12">
            <div className="text-gray-400 text-lg">
              No hay habilidades creadas aún.
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
                    Título
                  </th>
                  <th className="text-left p-4 text-sm font-medium text-gray-300">
                    Descripción
                  </th>
                  <th className="text-left p-4 text-sm font-medium text-gray-300 w-32">
                    Enlace
                  </th>
                  <th className="text-center p-4 text-sm font-medium text-gray-300 w-24">
                    Acciones
                  </th>
                </tr>
              </thead>

              {/* Table Body */}
              <tbody className="divide-y divide-gray-700">
                {skills.map((skill, index) => (
                  <React.Fragment key={skill._id}>
                    <tr
                      className={`hover:bg-gray-800/30 transition-colors duration-200 ${
                        index % 2 === 0 ? "bg-gray-900/40" : "bg-gray-900/20"
                      }`}
                    >
                      {/* Icon */}
                      <td className="p-4">
                        {skill.iconUrl || skill.iconFile ?
                          <img
                            src={skill.iconUrl || skill.iconFile}
                            alt={skill.title}
                            className="w-16 h-12 object-cover rounded border border-gray-600"
                          />
                        : <div className="w-16 h-12 bg-gray-700 rounded border border-gray-600 flex items-center justify-center">
                            <span className="text-gray-400 text-xs">
                              Sin icono
                            </span>
                          </div>
                        }
                      </td>

                      {/* Title */}
                      <td className="p-4">
                        <div>
                          <h3 className="text-white font-medium text-sm leading-tight mb-1">
                            {skill.title}
                          </h3>
                        </div>
                      </td>

                      {/* Description */}
                      <td className="p-4">
                        <div className="max-w-xs">
                          <p className="text-gray-300 text-sm">
                            {truncateText(skill.description, 100)}
                          </p>
                        </div>
                      </td>

                      {/* Link */}
                      <td className="p-4">
                        <div>
                          {skill.link ?
                            <a
                              href={skill.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-purple-400 hover:text-purple-300 text-sm underline transition-colors duration-200"
                            >
                              Ver enlace
                            </a>
                          : <span className="text-gray-400 text-sm">-</span>}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="p-4 text-center">
                        <div className="flex gap-2 justify-center">
                          {/* Edit Button */}
                          <Button
                            onClick={() => startEditing(skill)}
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
                                  ¿Eliminar habilidad?
                                </AlertDialogTitle>
                                <AlertDialogDescription className="text-gray-400">
                                  Esta acción no se puede deshacer. La habilidad
                                  será eliminada permanentemente.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel className="border-gray-600 hover:bg-gray-700/50">
                                  Cancelar
                                </AlertDialogCancel>
                                <AlertDialogAction
                                  className="bg-red-600 text-white hover:bg-red-700"
                                  onClick={() => handleDeleteSkill(skill._id)}
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
                    {editingSkill === skill._id && (
                      <SkillUpdate
                        skill={skill}
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
    </div>
  );
};

export default SkillsList;
