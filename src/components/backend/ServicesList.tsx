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
import ServiceUpdate from "./ServiceUpdate";

const ServicesList = () => {
  // Edit mode state
  const [editingService, setEditingService] = useState<string | null>(null);

  // Convex queries and mutations
  const services = useQuery(api.services.getServices);
  const deleteService = useMutation(api.services.deleteService);
  const updateServiceStatus = useMutation(api.services.updateService);

  // Functions
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleDeleteService = async (serviceId: string) => {
    try {
      await deleteService({ id: serviceId as any });
      console.log("Service deleted successfully");
    } catch (error) {
      console.error("Failed to delete service:", error);
      alert("Error al eliminar el servicio. Inténtalo de nuevo.");
    }
  };

  const startEditing = (service: any) => {
    setEditingService(service._id);
  };

  const cancelEditing = () => {
    setEditingService(null);
  };

  const handleUpdateSuccess = () => {
    setEditingService(null);
  };

  const getCategoryLabel = (category: string) => {
    const categories = {
      design: "Diseño",
      development: "Desarrollo",
      consulting: "Consultoría",
    };
    return categories[category as keyof typeof categories] || category;
  };

  const getExperienceLevelLabel = (level: string) => {
    const levels = {
      Beginner: "Principiante",
      Intermediate: "Intermedio",
      Expert: "Experto",
    };
    return levels[level as keyof typeof levels] || level;
  };

  const getPriceTypeLabel = (type: string) => {
    const types = {
      project: "Por Proyecto",
      hour: "Por Hora",
      fixed: "Precio Fijo",
    };
    return types[type as keyof typeof types] || type;
  };

  const handleToggleActive = async (
    serviceId: string,
    currentStatus: boolean
  ) => {
    try {
      await updateServiceStatus({
        id: serviceId as any,
        isActive: !currentStatus,
      });
      console.log("Service status updated successfully");
    } catch (error) {
      console.error("Failed to update service status:", error);
      alert("Error al actualizar el estado del servicio.");
    }
  };

  return (
    <div className="w-full max-w-7xl px-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold">
          <span className="orange-text-gradient">Todos los</span>{" "}
          <span className="green-text-gradient">Servicios</span>
        </h2>
      </div>

      {services === undefined ?
        <div className="flex justify-center items-center py-12">
          <div className="text-gray-400 text-lg">Cargando servicios...</div>
        </div>
      : services.length === 0 ?
        <div className="flex justify-center items-center py-12">
          <div className="text-gray-400 text-lg">
            No hay servicios creados aún.
          </div>
        </div>
      : <div className="backdrop-blur-sm bg-gray-900/80 border border-gray-700 rounded-lg overflow-hidden shadow-2xl">
          <table className="w-full">
            {/* Table Header */}
            <thead className="bg-gray-800/50 border-b border-gray-700">
              <tr>
                <th className="text-left p-4 text-sm font-medium text-gray-300 w-16">
                  Icono
                </th>
                <th className="text-left p-4 text-sm font-medium text-gray-300 min-w-[280px]">
                  Título / Tag
                </th>
                <th className="text-left p-4 text-sm font-medium text-gray-300">
                  Categoría
                </th>
                <th className="text-left p-4 text-sm font-medium text-gray-300">
                  Experiencia
                </th>
                <th className="text-left p-4 text-sm font-medium text-gray-300 text-center">
                  Proyectos
                </th>
                <th className="text-left p-4 text-sm font-medium text-gray-300">
                  Precio
                </th>
                <th className="text-left p-4 text-sm font-medium text-gray-300 text-center w-20">
                  Orden
                </th>
                <th className="text-left p-4 text-sm font-medium text-gray-300 w-32">
                  Estado / Activo
                </th>
                <th className="text-center p-4 text-sm font-medium text-gray-300 w-24">
                  Acciones
                </th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody className="divide-y divide-gray-700">
              {services.map((service, index) => (
                <React.Fragment key={service._id}>
                  <tr
                    className={`hover:bg-gray-800/30 transition-colors duration-200 ${
                      index % 2 === 0 ? "bg-gray-900/40" : "bg-gray-900/20"
                    }`}
                  >
                    {/* Icon */}
                    <td className="p-4">
                      {service.iconUrl ?
                        <img
                          src={service.iconUrl}
                          alt={service.title}
                          className="w-12 h-12 object-cover rounded border border-gray-600"
                        />
                      : <div className="w-12 h-12 bg-gray-700 rounded border border-gray-600 flex items-center justify-center">
                          <span className="text-gray-400 text-xs">
                            Sin icono
                          </span>
                        </div>
                      }
                    </td>

                    {/* Title and Tags */}
                    <td className="p-4">
                      <div className="space-y-2">
                        {/* Title and Subtitle */}
                        <div>
                          <h3 className="text-white font-medium text-sm leading-tight">
                            {service.title}
                          </h3>
                          {service.subtitle && (
                            <p className="text-gray-400 text-xs mt-1">
                              {service.subtitle}
                            </p>
                          )}
                        </div>

                        {/* Tags Row */}
                        <div className="flex flex-wrap gap-2">
                          {service.badgeText && (
                            <span className="inline-flex items-center px-2 py-1 bg-purple-600/20 text-purple-300 text-xs rounded-full border border-purple-600/30">
                              {service.badgeText}
                            </span>
                          )}

                          {/* Category Tag */}
                          <span className="inline-flex items-center px-2 py-1 bg-blue-600/20 text-blue-300 text-xs rounded-full border border-blue-600/30">
                            {getCategoryLabel(service.category)}
                          </span>

                          {/* Experience Level Tag */}
                          <span className="inline-flex items-center px-2 py-1 bg-green-600/20 text-green-300 text-xs rounded-full border border-green-600/30">
                            {getExperienceLevelLabel(service.experienceLevel)}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Category - Now simplified since it's shown in tags */}
                    <td className="p-4">
                      <span className="text-gray-300 text-sm">
                        {getCategoryLabel(service.category)}
                      </span>
                    </td>

                    {/* Experience Level - Now simplified since it's shown in tags */}
                    <td className="p-4">
                      <span className="text-gray-300 text-sm">
                        {getExperienceLevelLabel(service.experienceLevel)}
                      </span>
                    </td>

                    {/* Project Count */}
                    <td className="p-4 text-center">
                      <span className="inline-flex items-center justify-center w-8 h-8 bg-gray-700/50 text-gray-300 text-sm rounded-full border border-gray-600">
                        {service.projectCount}
                      </span>
                    </td>

                    {/* Pricing */}
                    <td className="p-4">
                      <div className="text-sm">
                        {service.startingPrice ?
                          <div>
                            <span className="text-green-400 font-semibold">
                              {service.currency || "$"}
                              {service.startingPrice}
                            </span>
                            {service.priceType && (
                              <div className="text-gray-400 text-xs mt-1">
                                {getPriceTypeLabel(service.priceType)}
                              </div>
                            )}
                          </div>
                        : <span className="text-gray-400">-</span>}
                      </div>
                    </td>

                    {/* Display Order */}
                    <td className="p-4 text-center">
                      <span className="inline-flex items-center justify-center w-8 h-8 bg-gray-700/50 text-gray-300 text-sm rounded-full border border-gray-600">
                        {service.displayOrder}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="p-4">
                      <div className="flex flex-col gap-2">
                        {/* Active/Inactive Badge */}
                        <span
                          className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${
                            service.isActive ?
                              "bg-green-600/20 text-green-400 border border-green-600/30"
                            : "bg-red-600/20 text-red-400 border border-red-600/30"
                          }`}
                        >
                          {service.isActive ? "Activo" : "Inactivo"}
                        </span>

                        {/* Active Checkbox */}
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={service.isActive}
                            onChange={() =>
                              handleToggleActive(service._id, service.isActive)
                            }
                            className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500 focus:ring-2"
                          />
                          <span className="text-xs text-gray-400">Activo</span>
                        </label>

                        {/* Created Date */}
                        {service.createdAt && (
                          <span className="text-gray-400 text-xs">
                            {formatDate(service.createdAt)}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="p-4 text-center">
                      <div className="flex gap-1 justify-center">
                        {/* Edit Button */}
                        <Button
                          onClick={() => startEditing(service)}
                          variant="ghost"
                          size="sm"
                          className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 p-2 h-8 w-8"
                          title="Editar servicio"
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
                              title="Eliminar servicio"
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
                                ¿Eliminar servicio?
                              </AlertDialogTitle>
                              <AlertDialogDescription className="text-gray-400">
                                Esta acción no se puede deshacer. El servicio
                                será marcado como inactivo.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel className="border-gray-600 hover:bg-gray-700/50">
                                Cancelar
                              </AlertDialogCancel>
                              <AlertDialogAction
                                className="bg-red-600 text-white hover:bg-red-700"
                                onClick={() => handleDeleteService(service._id)}
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
                  {editingService === service._id && (
                    <ServiceUpdate
                      service={service}
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

export default ServicesList;
