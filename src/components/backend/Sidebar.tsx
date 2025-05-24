import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

// Constants for sidebar links - using public directory paths
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
    id: "project-card",
    title: "Proyectos",
    path: "/project-card",
    icon: "/assets/dashboard/project.png",
  },
  {
    id: "experience",
    title: "Experiencia",
    path: "/experience",
    icon: "/assets/dashboard/experience.png",
  },
];

const LeftSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const path = location.pathname;

  const handleLinkClick = (linkPath) => {
    navigate(linkPath);
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
    <section className="bg-slate-800 border-gray-500 sticky left-0 top-0 flex h-screen flex-col justify-between overflow-y-auto p-6 pt-10 shadow max-sm:hidden lg:w-[240px]">
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
          />
        </div>

        <div className="flex flex-1 flex-col gap-6">
          {sidebarLinks.map((item) => {
            const isActive =
              (path.includes(item.path) && item.path.length > 1) ||
              path === item.path;

            return (
              <div
                key={item.id}
                onClick={() => handleLinkClick(item.path)}
                className={`flex items-center justify-start gap-4 p-4 rounded-lg cursor-pointer transition-all duration-200 ${
                  isActive ?
                    "bg-[#6A9AB0] text-white"
                  : "text-gray-400 hover:text-gray-200 hover:bg-slate-700"
                }`}
              >
                <img
                  src={item.icon}
                  alt={item.title}
                  width={20}
                  height={20}
                  className={`${isActive ? "" : "opacity-75"} stroke-white w-7 h-7`}
                />
                <p
                  className={`${isActive ? "font-bold" : "font-medium"} max-lg:hidden`}
                >
                  {item.title}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Logout Button */}
      <div className="mt-auto pt-6 border-t border-gray-600">
        <div
          onClick={logout}
          className="flex items-center justify-start gap-4 p-4 rounded-lg cursor-pointer text-red-400 hover:text-red-300 hover:bg-red-900/20 transition-all duration-200"
        >
          <svg
            className="w-7 h-7"
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
          <p className="font-medium max-lg:hidden">Cerrar Sesión</p>
        </div>
      </div>
    </section>
  );
};

export default LeftSidebar;
