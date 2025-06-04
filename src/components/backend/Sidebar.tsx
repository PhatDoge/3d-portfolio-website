import React, { useState, useCallback, useMemo, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import MobileNavbar from "../MobileNavbar";
import LanguageToggle from "../LanguageToggle";
import { sidebarTranslations } from "./translations";
import { LanguageContext } from "./Dashboard";

const getSidebarLinks = (t: any) => [
  {
    id: "dashboard",
    title: t.user,
    path: "/user",
    icon: "/assets/dashboard/programmer.png",
  },
  // {
  //   id: "introduction",
  //   title: t.introduction,
  //   path: "/create-introduction",
  //   icon: "/assets/dashboard/introduction.png",
  // },
  {
    id: "skills",
    title: t.skills,
    path: "/create-skill",
    icon: "/assets/dashboard/skill.png",
    hasSubmenu: true,
    submenu: [
      {
        id: "create-skill",
        title: t.createSkill,
        path: "/create-skill",
      },
      {
        id: "skill-list",
        title: t.allSkills,
        path: "/skill-list",
      },
      {
        id: "skill-details",
        title: t.skillDetails,
        path: "/skill-details",
      },
    ],
  },
  {
    id: "technologies",
    title: t.technologies,
    path: "/create-technology",
    icon: "/assets/dashboard/technologies.png",
  },
  {
    id: "project-card",
    title: t.projects,
    path: "/create-project",
    icon: "/assets/dashboard/project.png",
    hasSubmenu: true,
    submenu: [
      {
        id: "create-project",
        title: t.createProject,
        path: "/create-project",
      },
      {
        id: "project-list",
        title: t.allProjects,
        path: "/project-list",
      },
      {
        id: "project-details",
        title: t.projectDetails,
        path: "/project-details",
      },
    ],
  },
  {
    id: "experience",
    title: t.experience,
    path: "/experience",
    icon: "/assets/dashboard/experience.png",
    hasSubmenu: true,
    submenu: [
      {
        id: "create-experience",
        title: t.createExperience,
        path: "/create-experience",
      },
      {
        id: "experience-list",
        title: t.allExperiences,
        path: "/experience-list",
      },
      {
        id: "experience-details",
        title: t.experienceDetails,
        path: "/experience-details",
      },
    ],
  },
  {
    id: "services",
    title: t.services,
    path: "/services",
    icon: "/assets/dashboard/payment.png",
    hasSubmenu: true,
    submenu: [
      {
        id: "create-service",
        title: t.createService,
        path: "/create-service",
      },
      {
        id: "service-list",
        title: t.allServices,
        path: "/service-list",
      },
      {
        id: "service-details",
        title: t.serviceDetails,
        path: "/service-details",
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
const useSidebarLogic = (sidebarLinks) => {
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
      const item = sidebarLinks.find((link) => link.id === itemId);
      if (item?.hasSubmenu) {
        setOpenSubmenu((prev) => (prev === itemId ? null : itemId));
        setSelectedMainItem(itemId);
      } else {
        navigate(linkPath);
        setSelectedMainItem(null);
        setOpenSubmenu(null); // Close any open submenus
      }
    },
    [navigate, sidebarLinks]
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
  t: any;
}

// Submenu Item Component
const SubmenuItem = React.memo(
  ({ subItem, currentPath, onSubmenuClick, t }: SubmenuItemProps) => {
    const isSubActive = currentPath === subItem.path;

    return (
      <button
        onClick={() => onSubmenuClick(subItem.path)}
        className={`w-full flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-200 ${
          isSubActive ?
            "bg-blue-500 text-white"
          : "text-gray-400 hover:text-gray-200 hover:bg-slate-800"
        }`}
        aria-label={`${t.navigateTo} ${subItem.title}`}
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

interface MainMenuProps {
  item: any;
  isActive: any;
  isSubmenuOpen: any;
  onLinkClick: any;
  onSubmenuClick: any;
  currentPath: any;
  t: any;
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
    t,
  }: MainMenuProps) => (
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
            `${item.title} - ${isSubmenuOpen ? t.collapse : t.expand} ${t.submenu}`
          : `${t.navigateTo} ${item.title}`
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
          aria-label={`${t.submenuOf} ${item.title}`}
        >
          {item.submenu.map((subItem) => (
            <SubmenuItem
              key={subItem.id}
              subItem={subItem}
              currentPath={currentPath}
              onSubmenuClick={onSubmenuClick}
              t={t}
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

  // Get language context and translations
  const { language, toggleLanguage } = useContext(LanguageContext);
  const t = sidebarTranslations[language];

  // Generate sidebar links with current translations
  const sidebarLinks = useMemo(() => getSidebarLinks(t), [t]);

  const {
    selectedMainItem,
    openSubmenu,
    currentPath,
    isItemActive,
    handleLinkClick,
    handleSubmenuClick,
    handleLogoClick,
    handleLogout,
  } = useSidebarLogic(sidebarLinks);

  // Memoize navigation items to prevent unnecessary re-renders
  const navigationItems = useMemo(
    () =>
      sidebarLinks.map((item) => {
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
            t={t}
          />
        );
      }),
    [
      sidebarLinks,
      selectedMainItem,
      openSubmenu,
      currentPath,
      isItemActive,
      handleLinkClick,
      handleSubmenuClick,
      t,
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
        aria-label={t.mainNavigation}
      >
        <div>
          {/* Logo */}
          <div className="flex justify-center w-full mb-8">
            <button
              onClick={handleLogoClick}
              className="flex items-center justify-center gap-3 cursor-pointer rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900 transition-all duration-200 hover:scale-105"
              aria-label={t.goToHome}
            >
              <img
                src="/assets/dashboard/alonso_logo.png"
                height={120}
                width={120}
                alt={t.logoAlt}
                className="rounded-full"
                loading="eager"
              />
            </button>
          </div>

          <LanguageToggle language={language} toggleLanguage={toggleLanguage} />

          {/* Menú de navegación */}
          <nav className="flex flex-1 flex-col gap-1" role="menubar">
            {navigationItems}
          </nav>
        </div>

        {/* Sección para cerrar sesión */}
        <div className="mt-auto pt-6 border-t border-gray-700">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-start gap-4 p-4 rounded-lg cursor-pointer bg-gradient-to-r from-red-600 to-red-800 text-white hover:from-red-700 hover:to-red-900 shadow-md hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-slate-900"
            aria-label={t.logout}
          >
            <LogoutIcon />
            <span className="font-semibold max-lg:hidden text-white">
              {t.logout}
            </span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default LeftSidebar;
