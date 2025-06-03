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
        className={`${styles.paddingX} w-full flex items-center py-5 fixed top-0 z-20 transition-all duration-300 ${
          scrolled ?
            "bg-primary/90 backdrop-blur-md shadow-lg"
          : "bg-transparent"
        }`}
      >
        {/* Admin Link */}
        <a
          href="#"
          onClick={handleAdminClick}
          className="text-purple-400/50 absolute top-3 right-3 text-xs hover:text-purple-400 transition-colors duration-200 cursor-pointer hidden lg:block"
          aria-label="Admin Dashboard"
        >
          <img
            src="/assets/dashboard/admin.png"
            alt="admin"
            className="w-6 h-6 relative top-3 right-7"
          />
        </a>

        <div className="w-full flex justify-between items-center max-w-7xl mx-auto">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2"
            onClick={handleLogoClick}
          >
            <img
              src={logo}
              alt="logo"
              className="w-9 h-9 object-contain"
              width={309}
              height={200}
            />
            <p className="text-white text-[18px] font-bold cursor-pointer flex">
              <span className="max-[900px]:block hidden lg:block">
                Alonso &nbsp;
              </span>
              <span className="hidden lg:block">|&nbsp; Castillo</span>
            </p>
          </Link>

          {/* Desktop Navigation */}
          <ul className="list-none hidden sm:flex flex-row gap-10">
            {filteredNavLinks.map((link) => (
              <li
                key={link.id}
                className={`font-medium cursor-pointer transition-colors duration-200 text-[18px] lg:text-[18px] md:text-[16px] sm:text-[14px] max-[500px]:text-[12px]
                  ${active === link.title ? "text-white" : "text-secondary hover:text-gray-200"}
                `}
                onClick={(e) => {
                  e.preventDefault();
                  handleSmoothScroll(link.id, link.title);
                }}
              >
                <a href={`#${link.id}`}>{link.title}</a>
              </li>
            ))}
          </ul>

          {/* Mobile Menu */}
          <div className="sm:hidden flex flex-1 justify-end items-center">
            <img
              src={toggle ? close : menu}
              alt="menu"
              className="w-[28px] h-[28px] object-contain cursor-pointer"
              onClick={() => setToggle(!toggle)}
            />

            <div
              className={`${
                !toggle ? "hidden" : "flex"
              } p-6 black-gradient absolute top-20 right-0 mx-4 my-2 min-w-[140px] z-10 rounded-xl backdrop-blur-sm border border-white/10`}
            >
              <ul className="list-none flex items-start justify-end flex-col gap-4">
                {filteredNavLinks.map((link) => (
                  <li
                    key={link.id}
                    className={`font-poppins font-medium cursor-pointer transition-colors duration-200 text-[16px] lg:text-[16px] sm:text-[14px] max-[500px]:text-[12px]
                      ${active === link.title ? "text-white" : "text-secondary hover:text-gray-200"}
                    `}
                    onClick={(e) =>
                      handleMobileMenuClick(e, link.id, link.title)
                    }
                  >
                    <a href={`#${link.id}`}>{link.title}</a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </nav>

      <OtpModal isOpen={showOtpModal} onClose={closeOtpModal} />
    </>
  );
};

export default Navbar;
