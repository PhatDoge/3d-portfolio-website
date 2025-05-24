import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

// Import your assets
import programmerIcon from "/src/assets/dashboard/programmer.png";
import introductionIcon from "/src/assets/dashboard/introduction.png";
import projectIcon from "/src/assets/dashboard/project.png";
import experienceIcon from "/src/assets/dashboard/experience.png";
import alonsoLogo from "/src/assets/dashboard/alonso_logo.png";

// Constants for sidebar links
const sidebarLinks = [
  {
    id: "dashboard",
    title: "Usuario",
    path: "/dashboard",
    icon: programmerIcon,
  },
  {
    id: "introduction",
    title: "Introducción",
    path: "/introduction",
    icon: introductionIcon,
  },
  {
    id: "project-card",
    title: "Proyectos",
    path: "/project-card",
    icon: projectIcon,
  },
  {
    id: "experience",
    title: "Experiencia",
    path: "/experience",
    icon: experienceIcon,
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
    localStorage.removeItem("accessKey");
    navigate("/");
  };

  return (
    <section className="bg-slate-800 border-gray-500 sticky left-0 top-0 flex h-screen flex-col justify-between overflow-y-auto p-6 pt-10 shadow max-sm:hidden lg:w-[240px]">
      <div
        onClick={() => navigate("/")}
        className="flex items-center justify-center gap-3 mb-8 cursor-pointer"
      >
        <img src={alonsoLogo} height={120} width={120} alt="logo" />
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
              className={`flex items-center justify-start gap-4 p-4 rounded-lg cursor-pointer ${
                isActive ?
                  "bg-[#6A9AB0] text-white"
                : "text-gray-400 hover:text-gray-200"
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
    </section>
  );
};

export default LeftSidebar;
