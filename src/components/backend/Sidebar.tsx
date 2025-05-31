import React, { useState, useCallback, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import MobileNavbar from "../MobileNavbar";

// Constants moved outside component to prevent re-creation
const SIDEBAR_LINKS = [
  {
    id: "dashboard",
    title: "Usuario",
    path: "/user",
    icon: "/assets/dashboard/programmer.png",
  },
  {
    id: "introduction",
    title: "Introducción",
    path: "/create-introduction",
    icon: "/assets/dashboard/introduction.png",
  },
  {
    id: "skills",
    title: "Habilidades",
    path: "/create-skill",
    icon: "/assets/dashboard/skill.png",
    hasSubmenu: true,
    submenu: [
      {
        id: "create-skill",
        title: "Crear Habilidad",
        path: "/create-skill",
      },
      {
        id: "skill-list",
        title: "Todas las Habilidades",
        path: "/skill-list",
      },
    ],
  },
  {
    id: "technologies",
    title: "Tecnologías",
    path: "/create-technology",
    icon: "/assets/dashboard/technologies.png",
  },
  {
    id: "project-card",
    title: "Proyectos",
    path: "/create-project",
    icon: "/assets/dashboard/project.png",
    hasSubmenu: true,
    submenu: [
      {
        id: "create-project",
        title: "Crear Proyecto",
        path: "/create-project",
      },
      {
        id: "project-list",
        title: "Todos los Proyectos",
        path: "/project-list",
      },
    ],
  },
  {
    id: "experience",
    title: "Experiencia",
    path: "/experience",
    icon: "/assets/dashboard/experience.png",
    hasSubmenu: true,
    submenu: [
      {
        id: "create-experience",
        title: "Crear Experiencia",
        path: "/create-experience",
      },
      {
        id: "experience-list",
        title: "Todas las Experiencias",
        path: "/experience-list",
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
        path: "/create-service",
      },
      {
        id: "service-list",
        title: "Todos los Servicios",
        path: "/service-list",
      },
    ],
  },
];

// Reusable components
const ChevronDownIcon = ({ isOpen, isActive }) => (
  <svg
    className={`w-4 h-4 transition-transform duration-200 ${
      isOpen ? "rotate-180" : ""
    } ${isActive ? "text-white" : "text-gray-400"}`}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M19 9l-7 7-7-7"
    />
  </svg>
);

const LogoutIcon = () => (
  <svg
    className="w-6 h-6 drop-shadow-md text-white"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013 3v1"
    />
  </svg>
);

// Custom hook for sidebar logic
const useSidebarLogic = () => {
  const [selectedMainItem, setSelectedMainItem] = useState(null);
  const [openSubmenu, setOpenSubmenu] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  const isItemActive = useCallback((item, currentPath, selectedItem) => {
    return (
      selectedItem === item.id ||
      (selectedItem === null &&
        ((currentPath.includes(item.path) && item.path.length > 1) ||
          currentPath === item.path ||
          (item.submenu &&
            item.submenu.some((sub) => currentPath === sub.path))))
    );
  }, []);

  const handleLinkClick = useCallback(
    (linkPath, itemId) => {
      const item = SIDEBAR_LINKS.find((link) => link.id === itemId);
      if (item?.hasSubmenu) {
        setOpenSubmenu((prev) => (prev === itemId ? null : itemId));
        setSelectedMainItem(itemId);
      } else {
        navigate(linkPath);
        setSelectedMainItem(null);
        setOpenSubmenu(null); // Close any open submenus
      }
    },
    [navigate]
  );

  const handleSubmenuClick = useCallback(
    (submenuPath) => {
      navigate(submenuPath);
      setSelectedMainItem(null);
    },
    [navigate]
  );

  const handleLogoClick = useCallback(() => {
    navigate("/");
  }, [navigate]);

  const handleLogout = useCallback(async () => {
    try {
      localStorage.removeItem("accessKey");
      navigate("/");
      console.log("Logged out successfully");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  }, [navigate]);

  return {
    selectedMainItem,
    openSubmenu,
    currentPath: location.pathname,
    isItemActive,
    handleLinkClick,
    handleSubmenuClick,
    handleLogoClick,
    handleLogout,
  };
};
interface SubmenuItemProps {
  subItem: any;
  currentPath: any;
  onSubmenuClick: any;
}
// Submenu Item Component
const SubmenuItem = React.memo(
  ({ subItem, currentPath, onSubmenuClick }: SubmenuItemProps) => {
    const isSubActive = currentPath === subItem.path;

    return (
      <button
        onClick={() => onSubmenuClick(subItem.path)}
        className={`w-full flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-200 ${
          isSubActive ?
            "bg-blue-500 text-white"
          : "text-gray-400 hover:text-gray-200 hover:bg-slate-800"
        }`}
        aria-label={`Navegar a ${subItem.title}`}
      >
        <div
          className="w-2 h-2 rounded-full bg-current opacity-70"
          aria-hidden="true"
        ></div>
        <span
          className={`${
            isSubActive ? "font-semibold" : "font-medium"
          } max-lg:hidden text-sm`}
        >
          {subItem.title}
        </span>
      </button>
    );
  }
);

SubmenuItem.displayName = "SubmenuItem";

interface MainMenuprops {
  item: any;
  isActive: any;
  isSubmenuOpen: any;
  onLinkClick: any;
  onSubmenuClick: any;
  currentPath: any;
}
// Main Item Component
const MainMenuItem = React.memo(
  ({
    item,
    isActive,
    isSubmenuOpen,
    onLinkClick,
    onSubmenuClick,
    currentPath,
  }: MainMenuprops) => (
    <div>
      <button
        onClick={() => onLinkClick(item.path, item.id)}
        className={`w-full flex items-center justify-between p-4 rounded-lg cursor-pointer transition-all duration-200 ${
          isActive ?
            "bg-blue-600 text-white shadow-md"
          : "text-gray-400 hover:text-gray-200 hover:bg-slate-800"
        }`}
        aria-expanded={item.hasSubmenu ? isSubmenuOpen : undefined}
        aria-label={
          item.hasSubmenu ?
            `${item.title} - ${isSubmenuOpen ? "Contraer" : "Expandir"} submenú`
          : `Navegar a ${item.title}`
        }
      >
        <div className="flex items-center gap-4">
          <img
            src={item.icon}
            alt=""
            width={24}
            height={24}
            className={`${isActive ? "" : "opacity-75"} w-6 h-6`}
            loading="lazy"
          />
          <span
            className={`${
              isActive ? "font-bold" : "font-medium"
            } max-lg:hidden`}
          >
            {item.title}
          </span>
        </div>

        {item.hasSubmenu && (
          <ChevronDownIcon isOpen={isSubmenuOpen} isActive={isActive} />
        )}
      </button>

      {/* Submenu */}
      {item.hasSubmenu && isSubmenuOpen && (
        <div
          className="ml-6 mt-2 space-y-1"
          role="menu"
          aria-label={`Submenú de ${item.title}`}
        >
          {item.submenu.map((subItem) => (
            <SubmenuItem
              key={subItem.id}
              subItem={subItem}
              currentPath={currentPath}
              onSubmenuClick={onSubmenuClick}
            />
          ))}
        </div>
      )}
    </div>
  )
);

MainMenuItem.displayName = "MainMenuItem";

const LeftSidebar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const {
    selectedMainItem,
    openSubmenu,
    currentPath,
    isItemActive,
    handleLinkClick,
    handleSubmenuClick,
    handleLogoClick,
    handleLogout,
  } = useSidebarLogic();

  // Memoize navigation items to prevent unnecessary re-renders
  const navigationItems = useMemo(
    () =>
      SIDEBAR_LINKS.map((item) => {
        const isActive = isItemActive(item, currentPath, selectedMainItem);
        const isSubmenuOpen = openSubmenu === item.id;

        return (
          <MainMenuItem
            key={item.id}
            item={item}
            isActive={isActive}
            isSubmenuOpen={isSubmenuOpen}
            onLinkClick={handleLinkClick}
            onSubmenuClick={handleSubmenuClick}
            currentPath={currentPath}
          />
        );
      }),
    [
      selectedMainItem,
      openSubmenu,
      currentPath,
      isItemActive,
      handleLinkClick,
      handleSubmenuClick,
    ]
  );

  return (
    <>
      <MobileNavbar onMenuToggle={(isOpen) => setIsMobileMenuOpen(isOpen)} />
      <aside
        className={`bg-slate-900 border-r border-gray-700 sticky left-0 top-0  h-screen flex-col justify-between overflow-y-auto p-6 pt-10 shadow hidden md:flex lg:w-[280px] ${
          isMobileMenuOpen ? "md:hidden" : ""
        }`}
        role="navigation"
        aria-label="Navegación principal"
      >
        <div>
          {/* Logo */}
          <button
            onClick={handleLogoClick}
            className="flex items-center justify-center gap-3 mb-8 cursor-pointer rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900 transition-all duration-200 hover:scale-105"
            aria-label="Ir al inicio"
          >
            <img
              src="/assets/dashboard/alonso_logo.png"
              height={120}
              width={120}
              alt="Logo de Alonso"
              className="rounded-full"
              loading="eager"
            />
          </button>

          {/* Navigation Menu */}
          <nav className="flex flex-1 flex-col gap-1" role="menubar">
            {navigationItems}
          </nav>
        </div>

        {/* Logout Section */}
        <div className="mt-auto pt-6 border-t border-gray-700">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-start gap-4 p-4 rounded-lg cursor-pointer bg-gradient-to-r from-red-600 to-red-800 text-white hover:from-red-700 hover:to-red-900 shadow-md hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-slate-900"
            aria-label="Cerrar sesión"
          >
            <LogoutIcon />
            <span className="font-semibold max-lg:hidden text-white">
              Cerrar Sesión
            </span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default LeftSidebar;
