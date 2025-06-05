import { useState, useEffect, useCallback, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

import { close, menu } from "../assets";
import { navLinks } from "../constants";
import { styles } from "../styles";
import OtpModal from "./OTP";
import logo from "../assets/logo.png";

const SCROLL_THRESHOLD = 100;
const SMOOTH_SCROLL_DELAY = 100;
const CONTENT_LOAD_DELAY = 500;

const Navbar = () => {
  const navigate = useNavigate();
  const [active, setActive] = useState("");
  const [toggle, setToggle] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);

  // Query services data from Convex
  const hasActiveServices = useQuery(api.services.hasActiveServices);

  // Memoized scroll handler
  const handleScroll = useCallback(() => {
    const scrollTop = window.scrollY;
    setScrolled(scrollTop > SCROLL_THRESHOLD);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  // Memoized auth check function
  const checkAuthStatus = useCallback(() => {
    try {
      const encryptedkey = localStorage.getItem("accessKey");
      return Boolean(encryptedkey);
    } catch (error) {
      console.error("Error checking auth status:", error);
      return false;
    }
  }, []);

  // Handle admin link click
  const handleAdminClick = useCallback(
    (e) => {
      e.preventDefault();

      if (checkAuthStatus()) {
        navigate("/user");
      } else {
        setShowOtpModal(true);
      }
    },
    [checkAuthStatus, navigate]
  );

  // Handle smooth scroll for navigation links
  const handleSmoothScroll = useCallback((elementId, linkTitle) => {
    setActive(linkTitle);

    setTimeout(() => {
      const element = document.getElementById(elementId);
      if (!element) return;

      const scrollToElement = () => {
        element.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      };

      const hasContent = element.offsetHeight > 100;
      if (hasContent) {
        scrollToElement();
      } else {
        setTimeout(scrollToElement, CONTENT_LOAD_DELAY);
      }
    }, SMOOTH_SCROLL_DELAY);
  }, []);

  // Handle mobile menu item click
  const handleMobileMenuClick = useCallback(
    (e, elementId, linkTitle) => {
      e.preventDefault();
      setToggle(false);
      handleSmoothScroll(elementId, linkTitle);
    },
    [handleSmoothScroll]
  );

  // Handle logo click
  const handleLogoClick = useCallback(() => {
    setActive("");
    window.scrollTo(0, 0);
  }, []);

  // Filter navLinks based on active services
  const filteredNavLinks = useMemo(() => {
    return navLinks.filter((link) => {
      if (link.title === "Servicios") {
        return hasActiveServices === true;
      }
      return true;
    });
  }, [hasActiveServices]);

  // Close OTP modal handler
  const closeOtpModal = useCallback(() => setShowOtpModal(false), []);

  return (
    <>
      <nav
        className={`${styles.paddingX} w-full flex items-center py-4 fixed top-0 z-20 transition-all duration-500 ease-out ${
          scrolled ?
            "bg-black/80 backdrop-blur-xl shadow-2xl border-b border-purple-500/20"
          : "bg-transparent"
        }`}
      >
        {/* Animated background gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/10 via-transparent to-blue-900/10 opacity-50"></div>

        {/* Admin Link */}
        <div className="absolute top-4 right-6 z-30">
          <button
            onClick={handleAdminClick}
            className="group relative overflow-hidden rounded-full p-2 bg-gradient-to-r from-purple-600/20 to-blue-600/20 backdrop-blur-sm border border-purple-400/30 hover:border-purple-400/60 transition-all duration-300 hover:scale-110 hidden lg:block"
            aria-label="Admin Dashboard"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/30 to-blue-600/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <img
              src="/assets/dashboard/admin.png"
              alt="admin"
              className="w-5 h-5 relative z-10 filter brightness-0 invert group-hover:brightness-100 group-hover:invert-0 transition-all duration-300"
            />
          </button>
        </div>

        <div className="w-full flex justify-between items-center max-w-7xl mx-auto relative z-10">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-3 group"
            onClick={handleLogoClick}
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full blur-lg opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
              <img
                src={logo}
                alt="logo"
                className="w-10 h-10 object-contain relative z-10 group-hover:scale-110 transition-transform duration-300"
                width={309}
                height={200}
              />
            </div>
            <div className="text-white text-[20px] font-bold cursor-pointer flex items-center">
              <span className="bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent">
                Alonso
              </span>
              <span className="hidden lg:block text-purple-400">
                &nbsp;|&nbsp;
              </span>
              <span className="hidden lg:block bg-gradient-to-r from-purple-200 to-blue-200 bg-clip-text text-transparent">
                Castillo
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden sm:flex items-center">
            <ul className="list-none flex flex-row gap-2">
              {filteredNavLinks.map((link) => (
                <li key={link.id} className="relative group">
                  <a
                    href={`#${link.id}`}
                    className={`relative px-6 py-3 font-medium cursor-pointer transition-all duration-300 text-[16px] lg:text-[17px] md:text-[15px] sm:text-[14px] block overflow-hidden
                      ${
                        active === link.title ?
                          "text-white"
                        : "text-gray-300 hover:text-white"
                      }
                    `}
                    onClick={(e) => {
                      e.preventDefault();
                      handleSmoothScroll(link.id, link.title);
                    }}
                  >
                    {/* Text */}
                    <span className="relative z-10">{link.title}</span>
                    {/* Animated underline */}
                    <span
                      className={`absolute left-1/2 -translate-x-1/2 bottom-2 h-0.5 w-0 bg-gradient-to-r from-purple-400 via-blue-400 to-blue-500 rounded-full transition-all duration-300 group-hover:w-3/4 group-hover:opacity-100 ${active === link.title ? "w-3/4 opacity-100" : "opacity-0"}`}
                    ></span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Mobile Menu Button */}
          <div className="sm:hidden flex flex-1 justify-end items-center">
            <button
              className="relative w-10 h-10 rounded-full bg-gradient-to-r from-purple-600/20 to-blue-600/20 backdrop-blur-sm border border-purple-400/30 hover:border-purple-400/60 transition-all duration-300 hover:scale-110 flex items-center justify-center group"
              onClick={() => setToggle(!toggle)}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600/30 to-blue-600/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full"></div>
              <img
                src={toggle ? close : menu}
                alt="menu"
                className="w-6 h-6 object-contain relative z-10 filter brightness-0 invert group-hover:brightness-100 group-hover:invert-0 transition-all duration-300"
              />
            </button>

            {/* Mobile Menu Dropdown */}
            <div
              className={`${
                !toggle ?
                  "opacity-0 pointer-events-none scale-95"
                : "opacity-100 pointer-events-auto scale-100"
              } absolute top-16 right-0 mx-4 my-2 min-w-[200px] z-50 transition-all duration-300 ease-out transform origin-top-right`}
            >
              <div className="bg-black/90 backdrop-blur-xl rounded-2xl border border-purple-400/30 shadow-2xl shadow-purple-500/20 overflow-hidden">
                {/* Menu header */}
                <div className="px-6 py-4 border-b border-purple-400/20">
                  <div className="text-sm text-gray-400">Navegación</div>
                </div>

                <ul className="list-none flex flex-col p-2">
                  {filteredNavLinks.map((link) => (
                    <li key={link.id} className="group">
                      <a
                        href={`#${link.id}`}
                        className={`relative block px-4 py-3 font-medium cursor-pointer transition-all duration-300 text-[15px] overflow-hidden
                          ${
                            active === link.title ?
                              "text-white"
                            : "text-gray-300 hover:text-white"
                          }
                        `}
                        onClick={(e) =>
                          handleMobileMenuClick(e, link.id, link.title)
                        }
                      >
                        <span className="relative z-10">{link.title}</span>
                        {/* Animated underline */}
                        <span
                          className={`absolute left-1/2 -translate-x-1/2 bottom-2 h-0.5 w-0 bg-gradient-to-r from-purple-400 via-blue-400 to-blue-500 rounded-full transition-all duration-300 group-hover:w-3/4 group-hover:opacity-100 ${active === link.title ? "w-3/4 opacity-100" : "opacity-0"}`}
                        ></span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom border gradient */}
        <div
          className={`absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-400/50 to-transparent transition-opacity duration-500 ${scrolled ? "opacity-100" : "opacity-0"}`}
        ></div>
      </nav>

      <OtpModal isOpen={showOtpModal} onClose={closeOtpModal} />
    </>
  );
};

export default Navbar;
