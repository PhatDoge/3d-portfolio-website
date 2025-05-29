import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

// Sidebar links - using public directory paths
const sidebarLinks = [
  {
    id: "dashboard",
    title: "Usuario",
    path: "/dashboard",
    icon: "/assets/dashboard/programmer.png",
  },
  {
    id: "introduction",
    title: "Introducción",
    path: "/introduction",
    icon: "/assets/dashboard/introduction.png",
  },
  {
    id: "technologies",
    title: "Tecnologías",
    path: "/technologies",
    icon: "/assets/dashboard/introduction.png",
  },
  {
    id: "skills",
    title: "Habilidades",
    path: "/skills",
    icon: "/assets/dashboard/skill.png",
    hasSubmenu: true,
    submenu: [
      {
        id: "create-skill",
        title: "Crear Habilidad",
        path: "/skills",
      },
      {
        id: "skill-list",
        title: "Todas las Habilidades",
        path: "/skillsList",
      },
    ],
  },
  {
    id: "project-card",
    title: "Proyectos",
    path: "/project-card",
    icon: "/assets/dashboard/project.png",
    hasSubmenu: true,
    submenu: [
      {
        id: "project-list",
        title: "Todos los Proyectos",
        path: "/projectsDisplay",
      },
      {
        id: "create-project",
        title: "Crear Proyecto",
        path: "/project-card",
      },
    ],
  },
  {
    id: "experience",
    title: "Experiencia",
    path: "/experienc3",
    icon: "/assets/dashboard/experience.png",
    hasSubmenu: true,
    submenu: [
      {
        id: "create-experience",
        title: "Crear Experiencia",
        path: "/experience",
      },
      {
        id: "experience-list",
        title: "Todas las Experiencias",
        path: "/experienceList",
      },
    ],
  },
  {
    id: "services",
    title: "Servicios",
    path: "/services",
    icon: "/assets/dashboard/payment.png",
    hasSubmenu: true,
    submenu: [
      {
        id: "create-service",
        title: "Crear Servicio",
        path: "/services",
      },
      {
        id: "service-list",
        title: "Todos los Servicios",
        path: "/servicesList",
      },
    ],
  },
];

const LeftSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const path = location.pathname;
  const [openSubmenu, setOpenSubmenu] = useState(null);

  const handleLinkClick = (linkPath, itemId) => {
    const item = sidebarLinks.find((link) => link.id === itemId);
    if (item && item.hasSubmenu) {
      setOpenSubmenu(openSubmenu === itemId ? null : itemId);
    } else {
      navigate(linkPath);
    }
  };

  const handleSubmenuClick = (submenuPath) => {
    navigate(submenuPath);
  };

  const logout = () => {
    try {
      localStorage.removeItem("accessKey");
      navigate("/");
      console.log("Logged out successfully");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <section className="bg-slate-900 border-r border-gray-700 sticky left-0 top-0 flex h-screen flex-col justify-between overflow-y-auto p-6 pt-10 shadow max-sm:hidden lg:w-[280px]">
      <div>
        <div
          onClick={() => navigate("/")}
          className="flex items-center justify-center gap-3 mb-8 cursor-pointer"
        >
          <img
            src="/assets/dashboard/alonso_logo.png"
            height={120}
            width={120}
            alt="logo"
            className="rounded-full"
          />
        </div>

        <div className="flex flex-1 flex-col gap-1">
          {sidebarLinks.map((item) => {
            const isActive =
              (path.includes(item.path) && item.path.length > 1) ||
              path === item.path ||
              (item.submenu && item.submenu.some((sub) => path === sub.path));

            const isSubmenuOpen = openSubmenu === item.id;

            return (
              <div key={item.id}>
                <div
                  onClick={() => handleLinkClick(item.path, item.id)}
                  className={`flex items-center justify-between p-4 rounded-lg cursor-pointer transition-all duration-200 ${
                    isActive ?
                      "bg-blue-600 text-white shadow-md"
                    : "text-gray-400 hover:text-gray-200 hover:bg-slate-800"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={item.icon}
                      alt={item.title}
                      width={20}
                      height={20}
                      className={`${isActive ? "" : "opacity-75"} w-6 h-6`}
                    />
                    <p
                      className={`${
                        isActive ? "font-bold" : "font-medium"
                      } max-lg:hidden`}
                    >
                      {item.title}
                    </p>
                  </div>

                  {item.hasSubmenu && (
                    <svg
                      className={`w-4 h-4 transition-transform duration-200 transform ${
                        isSubmenuOpen ? "rotate-180" : ""
                      } ${isActive ? "text-white" : "text-gray-400"}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  )}
                </div>

                {/* Submenu */}
                {item.hasSubmenu && isSubmenuOpen && (
                  <div className="ml-6 mt-2 space-y-1">
                    {item.submenu.map((subItem) => {
                      const isSubActive = path === subItem.path;

                      return (
                        <div
                          key={subItem.id}
                          onClick={() => handleSubmenuClick(subItem.path)}
                          className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                            isSubActive ?
                              "bg-blue-500 text-white"
                            : "text-gray-400 hover:text-gray-200 hover:bg-slate-800"
                          }`}
                        >
                          <div className="w-2 h-2 rounded-full bg-current opacity-70"></div>
                          <p
                            className={`${
                              isSubActive ? "font-semibold" : "font-medium"
                            } max-lg:hidden text-sm`}
                          >
                            {subItem.title}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Logout Button */}
      <div className="mt-auto pt-6 border-t border-gray-700">
        <hr className="text-red-400 my-2 border border-top-2" />
        <div
          onClick={logout}
          className="flex items-center justify-start gap-4 p-4 rounded-lg cursor-pointer bg-gradient-to-r from-red-600 to-red-800 text-white hover:from-red-700 hover:to-red-900 shadow-md hover:shadow-lg transition-all duration-200"
        >
          <svg
            className="w-6 h-6 drop-shadow-md text-red-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>

          <p className="font-semibold max-lg:hidden text-red-500">
            Cerrar Sesión
          </p>
        </div>
      </div>
    </section>
  );
};

export default LeftSidebar;
