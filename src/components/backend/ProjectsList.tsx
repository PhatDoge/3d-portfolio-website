import React, { useContext, useState } from "react";
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
import { LanguageContext } from "./Dashboard";
import { projectsListTranslations } from "./translations";

const ProjectsList = () => {
  const formatDate = (timestamp: number, language: string) => {
    const locale = language === "es" ? "es-ES" : "en-US";
    return new Date(timestamp).toLocaleDateString(locale, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const { language } = useContext(LanguageContext);
  const t = projectsListTranslations[language];
  const [editingProject, setEditingProject] = useState<string | null>(null);

  const projects = useQuery(api.projects.getProjects);
  const deleteProject = useMutation(api.projects.deleteProject);

  const handleDeleteProject = async (projectId: string) => {
    try {
      await deleteProject({ id: projectId as any });
      console.log(t.messages.deleteSuccess);
    } catch (error) {
      console.error("Failed to delete project:", error);
      alert(t.errors.deleteError);
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

  const truncateText = (text: string, maxLength: number) => {
    return text.length > maxLength ?
        text.substring(0, maxLength) + "..."
      : text;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
              {t.title}
            </span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-purple-400 to-blue-400 mx-auto rounded-full"></div>
        </div>

        {projects === undefined ?
          <div className="flex justify-center items-center py-12">
            <div className="relative">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-400"></div>
              <div className="text-gray-300 text-lg mt-4">{t.loading}</div>
            </div>
          </div>
        : projects.length === 0 ?
          <div className="flex justify-center items-center py-12">
            <div className="bg-gradient-to-r from-gray-800/50 to-slate-800/50 backdrop-blur-sm border border-gray-600/50 rounded-xl p-8 shadow-xl">
              <div className="text-gray-300 text-lg text-center">
                {t.noProjects}
              </div>
            </div>
          </div>
        : <div className="relative">
            {/* Glowing border effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-blue-500/20 rounded-2xl blur-xl"></div>

            <div className="relative backdrop-blur-md bg-gray-800/60 border border-gray-600/50 rounded-2xl overflow-hidden shadow-2xl">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-gray-800/80 via-slate-800/80 to-gray-800/80 border-b border-gray-600/50">
                  <tr>
                    <th className="text-left p-6 text-sm font-semibold text-gray-200 w-20 uppercase tracking-wider">
                      {t.tableHeaders.image}
                    </th>
                    <th className="text-center p-6 text-sm font-semibold text-gray-200 uppercase tracking-wider">
                      {t.tableHeaders.title}
                    </th>
                    <th className="text-center p-6 text-sm font-semibold text-gray-200 uppercase tracking-wider">
                      {t.tableHeaders.tags}
                    </th>
                    <th className="text-left p-6 text-sm font-semibold text-gray-200 w-40 uppercase tracking-wider">
                      {t.tableHeaders.created}
                    </th>
                    <th className="text-left p-6 text-sm font-semibold text-gray-200 w-32 uppercase tracking-wider">
                      {t.tableHeaders.updated}
                    </th>
                    <th className="text-center p-6 text-sm font-semibold text-gray-200 w-24 uppercase tracking-wider">
                      {t.tableHeaders.actions}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-600/30">
                  {projects.map((project, index) => (
                    <React.Fragment key={project._id}>
                      <tr
                        className={`group hover:bg-gradient-to-r hover:from-purple-500/10 hover:via-pink-500/5 hover:to-blue-500/10 transition-all duration-300 ${
                          index % 2 === 0 ? "bg-gray-800/30" : "bg-slate-800/20"
                        } hover:shadow-lg hover:scale-[1.01] hover:border-l-4 hover:border-l-purple-400/50`}
                      >
                        {/* Imagen del proyecto */}
                        <td className="p-6">
                          {project.imageUrl ?
                            <div className="relative">
                              <img
                                src={project.imageUrl}
                                alt={project.cardTitle}
                                className="w-16 h-12 object-cover rounded-lg border-2 border-gray-600/50 shadow-lg group-hover:border-purple-400/50 transition-all duration-300"
                              />
                              <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/10 to-blue-500/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            </div>
                          : <div className="w-16 h-12 bg-gradient-to-br from-gray-700 to-slate-700 rounded-lg border-2 border-gray-600/50 flex items-center justify-center group-hover:border-purple-400/50 transition-all duration-300 shadow-lg">
                              <span className="text-gray-400 text-xs font-medium">
                                {t.noImage}
                              </span>
                            </div>
                          }
                        </td>

                        {/* Título del proyecto */}
                        <td className="p-6">
                          <div>
                            <h3 className="text-white font-semibold text-base leading-tight mb-1 group-hover:text-purple-300 transition-colors duration-300 text-center">
                              {project.cardTitle}
                            </h3>
                            <div className="w-0 group-hover:w-8 h-0.5 bg-gradient-to-r from-purple-400 to-blue-400 transition-all duration-300 rounded-full mx-auto"></div>
                            <p className="text-gray-400 text-xs line-clamp-2 text-center mt-1">
                              {truncateText(project.cardDescription, 100)}
                            </p>
                          </div>
                        </td>

                        {/* Etiquetas (tags) del proyecto */}
                        <td className="p-6 text-center">
                          <div className="flex flex-wrap gap-1 justify-center">
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

                        {/* Fecha de creación */}
                        <td className="p-6 text-left">
                          <span className="text-gray-300 text-sm">
                            {formatDate(project.createdAt, language)}
                          </span>
                        </td>

                        {/* Fecha de actualización */}
                        <td className="p-6 text-center">
                          <span className="text-gray-300 text-sm">
                            {(
                              project.updatedAt &&
                              project.updatedAt !== project.createdAt
                            ) ?
                              formatDate(project.updatedAt, language)
                            : "-"}
                          </span>
                        </td>

                        {/* Acciones: editar y eliminar */}
                        <td className="p-6 text-center">
                          <div className="flex gap-3 justify-center">
                            {/* Botón para editar el proyecto */}
                            <Button
                              onClick={() => startEditing(project)}
                              variant="ghost"
                              size="sm"
                              className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/20 p-2 h-9 w-9 rounded-lg border border-transparent hover:border-blue-400/30 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/25"
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

                            {/* Botón para eliminar el proyecto con confirmación */}
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-red-400 hover:text-red-300 hover:bg-red-500/20 p-2 h-9 w-9 rounded-lg border border-transparent hover:border-red-400/30 transition-all duration-300 hover:shadow-lg hover:shadow-red-500/25"
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
                              <AlertDialogContent className="border border-gray-600/50 bg-gray-800/95 backdrop-blur-md shadow-2xl">
                                <AlertDialogHeader>
                                  <AlertDialogTitle className="text-gray-100 text-lg font-semibold">
                                    {t.deleteDialog.title}
                                  </AlertDialogTitle>
                                  <AlertDialogDescription className="text-gray-300">
                                    {t.deleteDialog.description}
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel className="border-gray-500/50 hover:bg-gray-700/50 text-gray-300 hover:text-white transition-all duration-300">
                                    {t.deleteDialog.cancel}
                                  </AlertDialogCancel>
                                  <AlertDialogAction
                                    className="bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800 transition-all duration-300 shadow-lg hover:shadow-red-500/25"
                                    onClick={() =>
                                      handleDeleteProject(project._id)
                                    }
                                  >
                                    {t.deleteDialog.confirm}
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </td>
                      </tr>

                      {/* Fila de edición: muestra el formulario de actualización si está en modo edición */}
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
          </div>
        }
      </div>
    </div>
  );
};

export default ProjectsList;
