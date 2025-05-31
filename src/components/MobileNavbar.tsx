import { useState, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { X, Menu } from "lucide-react";

import { navLinks } from "../constants";
// Import logo - adjust path as needed
const logo = "/assets/logo.png"; // or wherever your logo is located

const MobileNavbar = ({
  active,
  setActive,
  onSmoothScroll,
  onAdminClick,
  showOtpModal,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  // Query services data from Convex
  const hasActiveServices = useQuery(api.services.hasActiveServices);

  // Filter navLinks based on active services
  const filteredNavLinks = useMemo(() => {
    return navLinks.filter((link) => {
      if (link.title === "Servicios") {
        return hasActiveServices === true;
      }
      return true;
    });
  }, [hasActiveServices]);

  // Handle mobile menu item click
  const handleMobileMenuClick = useCallback(
    (e, elementId, linkTitle) => {
      e.preventDefault();
      setIsOpen(false); // Close mobile menu
      onSmoothScroll(elementId, linkTitle);
    },
    [onSmoothScroll]
  );

  // Handle logo click
  const handleLogoClick = useCallback(() => {
    setActive("");
    setIsOpen(false);
    window.scrollTo(0, 0);
  }, [setActive]);

  // Handle admin click in mobile
  const handleMobileAdminClick = useCallback(
    (e) => {
      e.preventDefault();
      setIsOpen(false);
      onAdminClick(e);
    },
    [onAdminClick]
  );

  return (
    <>
      {/* Mobile Menu Trigger */}
      <div className="md:hidden flex items-center">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 text-white hover:text-purple-400 transition-colors duration-200"
          aria-label="Toggle mobile menu"
        >
          {isOpen ?
            <X size={24} />
          : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Mobile Menu Content */}
      <div
        className={`fixed top-0 left-0 h-full w-80 max-w-[85vw] bg-primary/95 backdrop-blur-md shadow-xl z-50 transform transition-transform duration-300 ease-in-out md:hidden ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Mobile Menu Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={handleLogoClick}
          >
            <img src={logo} alt="logo" className="w-8 h-8 object-contain" />
            <p className="text-white text-lg font-bold">
              Alonso
              <span className="text-purple-400"> | Castillo</span>
            </p>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 text-white hover:text-purple-400 transition-colors duration-200"
            aria-label="Close mobile menu"
          >
            <X size={20} />
          </button>
        </div>

        {/* Mobile Navigation Links */}
        <div className="flex flex-col py-6">
          <nav className="flex flex-col space-y-2 px-6">
            {filteredNavLinks.map((link) => (
              <a
                key={link.id}
                href={`#${link.id}`}
                onClick={(e) => handleMobileMenuClick(e, link.id, link.title)}
                className={`${
                  active === link.title ?
                    "text-white bg-white/10 border-l-4 border-purple-400"
                  : "text-secondary hover:text-white hover:bg-white/5"
                } flex items-center px-4 py-3 text-lg font-medium transition-all duration-200 rounded-r-lg`}
              >
                {link.title}
              </a>
            ))}
          </nav>

          {/* Mobile Admin Section */}
          <div className="mt-8 px-6 pt-6 border-t border-white/10">
            <button
              onClick={handleMobileAdminClick}
              className="flex items-center gap-3 w-full px-4 py-3 text-purple-400/70 hover:text-purple-400 hover:bg-white/5 transition-all duration-200 rounded-lg"
            >
              <img
                src="/assets/dashboard/admin.png"
                alt="admin"
                className="w-5 h-5"
              />
              <span className="text-sm font-medium">
                Panel de Administración
              </span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default MobileNavbar;
