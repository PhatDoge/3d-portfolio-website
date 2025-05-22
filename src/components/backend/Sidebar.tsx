import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

// Constants for sidebar links
const sidebarLinks = [
  {
    id: "dashboard",
    title: "Dashboard",
    path: "/dashboard",
    icon: "/assets/icons/dashboard.svg", // You'll need to add the actual icon path
  },
  {
    id: "documents",
    title: "Documentos",
    path: "/documents",
    icon: "/assets/icons/documents.svg", // You'll need to add the actual icon path
  },
];

const LeftSidebar = ({ params = { userId: "" } }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const path = location.pathname;

  // If the current path is "/" or the specific patient register path, return null to hide the sidebar
  if (
    path === "/" ||
    path.match(/^\/patients\/[^/]+\/register$/) ||
    path.match(/^\/patients\/[^/]+\/new-appointment$/) ||
    path.match(/^\/patients\/[^/]+\/new-appointment\/success$/)
  ) {
    return null;
  }

  const logout = () => {
    localStorage.removeItem("accessKey");
    navigate("/"); // Redirect to the homepage
  };

  const handleLinkClick = (linkPath) => {
    navigate(linkPath);
  };

  return (
    <section className="bg-slate-800 border-gray-500 sticky left-0 top-0 flex h-screen flex-col justify-between overflow-y-auto p-6 pt-10 shadow max-sm:hidden lg:w-[240px]">
      <div
        onClick={() => navigate("/")}
        className="flex items-center gap-3 mb-8 cursor-pointer"
      >
        <img
          src="/assets/icons/logo-full.svg"
          height={32}
          width={162}
          alt="logo"
          className="h-8"
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

      {/* Logout Button */}
      <button
        onClick={logout}
        className="flex items-center gap-4 p-4 mt-4 rounded-lg bg-red-600 text-white hover:bg-red-700"
      >
        <img
          src="/assets/icons/logout.svg"
          alt="logout"
          width={20}
          height={20}
          className="opacity-75"
        />
        <p className="font-medium">Cerrar sesión</p>
      </button>
    </section>
  );
};

export default LeftSidebar;
