import React, { useState, useCallback, useContext, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { LanguageContext } from "./backend/Dashboard";
import { sidebarTranslations } from "./backend/translations";
import LanguageToggle from "./LanguageToggle";

// Menu icon component
const MenuIcon = () => (
  <svg
    className="w-6 h-6 text-white"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M4 6h16M4 12h16M4 18h16"
    />
  </svg>
);

// Close icon component
const CloseIcon = () => (
  <svg
    className="w-6 h-6 text-white"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M6 18L18 6M6 6l12 12"
    />
  </svg>
);

// Chevron down icon for submenus
const ChevronDownIcon = ({ isOpen }: { isOpen: boolean }) => (
  <svg
    className={`w-4 h-4 transition-transform duration-200 text-gray-400 ${
      isOpen ? "rotate-180" : ""
    }`}
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

// Logout icon
const LogoutIcon = () => (
  <svg
    className="w-5 h-5 text-white"
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

// Sidebar links (updated to match Sidebar.tsx)
const getSidebarLinks = (t: any) => [
  {
    id: "dashboard",
    title: t.user,
    path: "/user",
    icon: "/assets/dashboard/programmer.png",
  },
  {
    id: "introduction",
    title: t.introduction,
    path: "/create-introduction",
    icon: "/assets/dashboard/introduction.png",
  },
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
    ],
  },
];

interface MobileNavbarProps {
  className?: string;
  onMenuToggle?: (isOpen: boolean) => void;
}

const MobileNavbar: React.FC<MobileNavbarProps> = ({
  className = "",
  onMenuToggle,
}) => {
  // Language context and translations
  const { language, toggleLanguage } = useContext(LanguageContext);
  const t = sidebarTranslations[language];
  // Generate sidebar links with current translations
  const SIDEBAR_LINKS = useMemo(() => getSidebarLinks(t), [t]);

  const [isOpen, setIsOpen] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  const toggleMenu = useCallback(() => {
    const newState = !isOpen;
    setIsOpen(newState);
    onMenuToggle?.(newState);
    if (isOpen) {
      setOpenSubmenu(null);
    }
  }, [isOpen, onMenuToggle]);

  const closeMenu = useCallback(() => {
    setIsOpen(false);
    setOpenSubmenu(null);
    onMenuToggle?.(false);
  }, [onMenuToggle]);

  const isItemActive = useCallback((item: any, currentPath: string) => {
    return (
      (currentPath.includes(item.path) && item.path.length > 1) ||
      currentPath === item.path ||
      (item.submenu &&
        item.submenu.some((sub: any) => currentPath === sub.path))
    );
  }, []);

  const handleLinkClick = useCallback(
    (linkPath: string, itemId: string) => {
      const item = SIDEBAR_LINKS.find((link) => link.id === itemId);
      if (item?.hasSubmenu) {
        setOpenSubmenu((prev) => (prev === itemId ? null : itemId));
      } else {
        navigate(linkPath);
        closeMenu();
      }
    },
    [navigate, closeMenu]
  );

  const handleSubmenuClick = useCallback(
    (submenuPath: string) => {
      navigate(submenuPath);
      closeMenu();
    },
    [navigate, closeMenu]
  );

  const handleLogoClick = useCallback(() => {
    navigate("/");
    closeMenu();
  }, [navigate, closeMenu]);

  const handleLogout = useCallback(async () => {
    try {
      localStorage.removeItem("accessKey");
      navigate("/");
      closeMenu();
      console.log("Logged out successfully");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  }, [navigate, closeMenu]);

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={toggleMenu}
        className={`md:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-slate-800 shadow-lg ${className}`}
        aria-label={isOpen ? t.closeMenu : t.openMenu}
      >
        {isOpen ?
          <CloseIcon />
        : <MenuIcon />}
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={closeMenu}
          aria-hidden="true"
        />
      )}

      {/* Mobile sidebar */}
      <aside
        className={`md:hidden fixed left-0 top-0 h-full w-80 bg-slate-900 border-r border-gray-700 shadow-xl z-50 transform transition-transform duration-300 ease-in-out overflow-y-auto ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        role="navigation"
        aria-label={t.mobileNavigation}
      >
        <div className="flex flex-col h-full">
          {/* Header with logo */}
          <div className="p-6 pt-16">
            <button
              onClick={handleLogoClick}
              className="flex items-center justify-center w-full mb-8 cursor-pointer rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
              aria-label={t.goToHome}
            >
              <img
                src="/assets/dashboard/alonso_logo.png"
                height={80}
                width={80}
                alt={t.logoAlt}
                className="rounded-full"
                loading="eager"
              />
            </button>
          </div>

          {/* Language toggle */}
          <div className="px-6 pb-2">
            <LanguageToggle
              language={language}
              toggleLanguage={toggleLanguage}
            />
          </div>

          {/* Navigation menu */}
          <nav className="flex-1 px-6 pb-6">
            <div className="space-y-2">
              {SIDEBAR_LINKS.map((item) => {
                const isActive = isItemActive(item, location.pathname);
                const isSubmenuOpen = openSubmenu === item.id;

                return (
                  <div key={item.id}>
                    <button
                      onClick={() => handleLinkClick(item.path, item.id)}
                      className={`w-full flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                        isActive ?
                          "bg-blue-600 text-white shadow-md"
                        : "text-gray-400 hover:text-gray-200 hover:bg-slate-800"
                      }`}
                      aria-expanded={
                        item.hasSubmenu ? isSubmenuOpen : undefined
                      }
                      aria-label={
                        item.hasSubmenu ?
                          `${item.title} - ${
                            isSubmenuOpen ? t.collapse : t.expand
                          } ${t.submenu}`
                        : `${t.navigateTo} ${item.title}`
                      }
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={item.icon}
                          alt=""
                          width={20}
                          height={20}
                          className={`${isActive ? "" : "opacity-75"} w-5 h-5`}
                          loading="lazy"
                        />
                        <span
                          className={`$${
                            isActive ? "font-bold" : "font-medium"
                          } text-sm`}
                        >
                          {item.title}
                        </span>
                      </div>

                      {item.hasSubmenu && (
                        <ChevronDownIcon isOpen={isSubmenuOpen} />
                      )}
                    </button>

                    {/* Submenu */}
                    {item.hasSubmenu && isSubmenuOpen && (
                      <div
                        className="ml-4 mt-1 space-y-1"
                        role="menu"
                        aria-label={`${t.submenuOf} ${item.title}`}
                      >
                        {item.submenu.map((subItem) => {
                          const isSubActive =
                            location.pathname === subItem.path;
                          return (
                            <button
                              key={subItem.id}
                              onClick={() => handleSubmenuClick(subItem.path)}
                              className={`w-full flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-all duration-200 ${
                                isSubActive ?
                                  "bg-blue-500 text-white"
                                : "text-gray-400 hover:text-gray-200 hover:bg-slate-800"
                              }`}
                              aria-label={`${t.navigateTo} ${subItem.title}`}
                            >
                              <div className="w-2 h-2 rounded-full bg-current opacity-70" />
                              <span
                                className={`$${
                                  isSubActive ? "font-semibold" : "font-medium"
                                } text-sm`}
                              >
                                {subItem.title}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </nav>

          {/* Logout section */}
          <div className="p-6 border-t border-gray-700">
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-3 p-3 rounded-lg cursor-pointer bg-gradient-to-r from-red-600 to-red-800 text-white hover:from-red-700 hover:to-red-900 shadow-md hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500"
              aria-label={t.logout}
            >
              <LogoutIcon />
              <span className="font-semibold text-white text-sm">
                {t.logout}
              </span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default MobileNavbar;
