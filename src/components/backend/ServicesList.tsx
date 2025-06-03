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
import ServiceUpdate from "./ServiceUpdate";
import { LanguageContext } from "./Dashboard";
import { serviceListTranslations } from "./translations";

const ServicesList = () => {
  const { language } = useContext(LanguageContext);
  const t = serviceListTranslations[language];

  // Estado de edición para el formulario de actualización
  const [editingService, setEditingService] = useState<string | null>(null);

  // Consultas y mutaciones de Convex
  const services = useQuery(api.services.getServices);
  const deleteService = useMutation(api.services.deleteService);
  const updateServiceStatus = useMutation(api.services.updateService);

  // Función para formatear la fecha en formato local español
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Maneja la eliminación de un servicio
  const handleDeleteService = async (serviceId: string) => {
    try {
      await deleteService({ id: serviceId as any });
      console.log("Service deleted successfully");
    } catch (error) {
      console.error("Failed to delete service:", error);
      alert(t.deleteError);
    }
  };

  // Inicia el modo de edición para un servicio
  const startEditing = (service: any) => {
    setEditingService(service._id);
  };

  // Cancela la edición
  const cancelEditing = () => {
    setEditingService(null);
  };

  // Maneja el éxito al actualizar un servicio
  const handleUpdateSuccess = () => {
    setEditingService(null);
  };

  // Devuelve la etiqueta de la categoría en español
  const getCategoryLabel = (category: string) => {
    const categories = {
      design: t.design,
      development: t.development,
      consulting: t.consulting,
    };
    return categories[category as keyof typeof categories] || category;
  };

  // Devuelve la etiqueta del nivel de experiencia en español
  const getExperienceLevelLabel = (level: string) => {
    const levels = {
      Beginner: t.beginner,
      Intermediate: t.intermediate,
      Expert: t.expert,
    };
    return levels[level as keyof typeof levels] || level;
  };

  // Devuelve la etiqueta del tipo de precio en español
  const getPriceTypeLabel = (type: string) => {
    const types = {
      project: t.project,
      hour: t.hour,
      fixed: t.fixed,
    };
    return types[type as keyof typeof types] || type;
  };

  // Cambia el estado activo/inactivo de un servicio
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
      alert(t.statusUpdateError);
    }
  };

  // Renderizado principal de la lista de servicios
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
              {t.allServices}
            </span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-purple-400 to-blue-400 mx-auto rounded-full"></div>
        </div>

        {services === undefined ?
          // Estado de carga: muestra mensaje mientras se obtienen los servicios
          <div className="flex justify-center items-center py-12">
            <div className="relative">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-400"></div>
              <div className="text-gray-300 text-lg mt-4">
                {t.loadingServices}
              </div>
            </div>
          </div>
        : services.length === 0 ?
          // Estado vacío: no hay servicios creados
          <div className="flex justify-center items-center py-12">
            <div className="bg-gradient-to-r from-gray-800/50 to-slate-800/50 backdrop-blur-sm border border-gray-600/50 rounded-xl p-8 shadow-xl">
              <div className="text-gray-300 text-lg text-center">
                {t.noServicesYet}
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
                    <th className="text-left p-4 text-sm font-semibold text-gray-200 w-20 uppercase tracking-wider">
                      {t.icon}
                    </th>
                    <th className="text-center p-4 text-sm font-semibold text-gray-200 min-w-[280px] uppercase tracking-wider">
                      {t.titleTag}
                    </th>
                    <th className="text-left p-4 text-xs font-semibold text-gray-200 uppercase tracking-wider">
                      {t.category}
                    </th>
                    <th className="text-left p-4 text-xs font-semibold text-gray-200 uppercase tracking-wider">
                      {t.experience}
                    </th>
                    <th className="text-left p-4 text-sm font-semibold text-gray-200 uppercase tracking-wider">
                      {t.projects}
                    </th>
                    <th className="text-left p-4 text-sm font-semibold text-gray-200 uppercase tracking-wider">
                      {t.price}
                    </th>
                    <th className="p-4 text-sm font-semibold text-gray-200 text-center w-20 uppercase tracking-wider">
                      {t.order}
                    </th>
                    <th className="text-left p-4 text-sm font-semibold text-gray-200 w-28 uppercase tracking-wider">
                      {t.status}
                    </th>
                    <th className="text-center p-4 text-sm font-semibold text-gray-200 w-28 uppercase tracking-wider">
                      {t.actions}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-600/30">
                  {services.map((service, index) => (
                    <React.Fragment key={service._id}>
                      <tr
                        className={`group hover:bg-gradient-to-r hover:from-purple-500/10 hover:via-pink-500/5 hover:to-blue-500/10 transition-all duration-300 ${
                          index % 2 === 0 ? "bg-gray-800/30" : "bg-slate-800/20"
                        } hover:shadow-lg hover:scale-[1.01] hover:border-l-4 hover:border-l-purple-400/50`}
                      >
                        {/* Icon */}
                        <td className="p-4">
                          {service.iconUrl ?
                            <div className="relative">
                              <img
                                src={service.iconUrl}
                                alt={service.title}
                                className="w-16 h-12 object-cover rounded-lg border-2 border-gray-600/50 shadow-lg group-hover:border-purple-400/50 transition-all duration-300"
                              />
                              <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/10 to-blue-500/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            </div>
                          : <div className="w-16 h-12 bg-gradient-to-br from-gray-700 to-slate-700 rounded-lg border-2 border-gray-600/50 flex items-center justify-center group-hover:border-purple-400/50 transition-all duration-300 shadow-lg">
                              <span className="text-gray-400 text-xs font-medium">
                                {t.noIcon}
                              </span>
                            </div>
                          }
                        </td>
                        {/* Title & tags */}
                        <td className="p-4 justify-center">
                          <div className="space-y-2">
                            <div>
                              <h3 className="text-white text-center font-semibold text-base leading-tight mb-1 group-hover:text-purple-300 transition-colors duration-300">
                                {service.title}
                              </h3>
                              {service.subtitle && (
                                <p className="text-gray-400 text-xs mt-1 text-center">
                                  {service.subtitle}
                                </p>
                              )}
                              <div className="w-0 group-hover:w-8 h-0.5 bg-gradient-to-r from-purple-400 to-blue-400 transition-all duration-300 rounded-full mx-auto"></div>
                            </div>
                            <div className="flex flex-wrap gap-2 justify-center">
                              {service.badgeText && (
                                <span className="inline-flex items-center text-center px-2 py-1 bg-purple-600/20 text-purple-300 text-xs rounded-full border border-purple-600/30">
                                  {service.badgeText}
                                </span>
                              )}
                              <span className="inline-flex items-center px-2 py-1 bg-blue-600/20 text-blue-300 text-xs rounded-full border border-blue-600/30">
                                {getCategoryLabel(service.category)}
                              </span>
                              <span className="inline-flex items-center px-2 py-1 bg-green-600/20 text-green-300 text-xs rounded-full border border-green-600/30">
                                {getExperienceLevelLabel(
                                  service.experienceLevel
                                )}
                              </span>
                            </div>
                          </div>
                        </td>
                        {/* Category */}
                        <td className="p-4">
                          <span className="text-gray-300 text-sm">
                            {getCategoryLabel(service.category)}
                          </span>
                        </td>
                        {/* Experience */}
                        <td className="p-4">
                          <span className="text-gray-300 text-sm">
                            {getExperienceLevelLabel(service.experienceLevel)}
                          </span>
                        </td>
                        {/* Projects */}
                        <td className="p-4 text-center">
                          <span className="inline-flex items-center justify-center w-8 h-8 bg-gray-700/50 text-gray-300 text-sm rounded-full border border-gray-600">
                            {service.projectCount}
                          </span>
                        </td>
                        {/* Price */}
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
                        {/* Order */}
                        <td className="p-4 text-center">
                          <span className="inline-flex items-center justify-center w-8 h-8 bg-gray-700/50 text-gray-300 text-sm rounded-full border border-gray-600">
                            {service.displayOrder}
                          </span>
                        </td>
                        {/* Status */}
                        <td className="p-4">
                          <div className="flex flex-col gap-2">
                            <span
                              className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${service.isActive ? "bg-green-600/20 text-green-400 border border-green-600/30" : "bg-red-600/20 text-red-400 border border-red-600/30"}`}
                            >
                              {service.isActive ? t.active : t.inactive}
                            </span>
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={service.isActive}
                                onChange={() =>
                                  handleToggleActive(
                                    service._id,
                                    service.isActive
                                  )
                                }
                                className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500 focus:ring-2"
                              />
                              <span className="text-xs text-gray-400">
                                {t.active}
                              </span>
                            </label>
                            {service.createdAt && (
                              <span className="text-gray-400 text-xs">
                                {formatDate(service.createdAt)}
                              </span>
                            )}
                          </div>
                        </td>
                        {/* Actions */}
                        <td className="p-4 text-center">
                          <div className="flex gap-3 justify-center">
                            <Button
                              onClick={() => startEditing(service)}
                              variant="ghost"
                              size="sm"
                              className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/20 p-1.5 h-8 w-8 rounded-lg border border-transparent hover:border-blue-400/30 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/25"
                              title={t.editService}
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
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-red-400 hover:text-red-300 hover:bg-red-500/20 p-2 h-9 w-9 rounded-lg border border-transparent hover:border-red-400/30 transition-all duration-300 hover:shadow-lg hover:shadow-red-500/25"
                                  title={t.deleteService}
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
                                    {t.deleteServiceTitle}
                                  </AlertDialogTitle>
                                  <AlertDialogDescription className="text-gray-300">
                                    {t.deleteConfirmation}
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel className="border-gray-500/50 hover:bg-gray-700/50 text-gray-300 hover:text-white transition-all duration-300">
                                    {t.cancel}
                                  </AlertDialogCancel>
                                  <AlertDialogAction
                                    className="bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800 transition-all duration-300 shadow-lg hover:shadow-red-500/25"
                                    onClick={() =>
                                      handleDeleteService(service._id)
                                    }
                                  >
                                    {t.delete}
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </td>
                      </tr>
                      {/* Fila de edición: muestra el formulario de actualización si está en modo edición */}
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
          </div>
        }
      </div>
    </div>
  );
};

export default ServicesList;
