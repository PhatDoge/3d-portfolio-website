import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api"; // Adjust path as needed

import { close, menu } from "../assets";
import { navLinks } from "../constants";
import { styles } from "../styles";
import OtpModal from "./OTP";
import logo from "../assets/logo.png";

const Navbar = () => {
  const navigate = useNavigate();
  const [active, setActive] = useState("");
  const [toggle, setToggle] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);

  // Query services data from Convex
  const hasActiveServices = useQuery(api.services.hasActiveServices);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      if (scrollTop > 100) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Check if user is already authenticated
  const checkAuthStatus = () => {
    try {
      const encryptedkey = localStorage.getItem("accessKey");
      if (encryptedkey) {
        // For now, just check if the key exists
        // You can add decryption logic later when the utils are available
        return true; // Temporarily return true if key exists
      }
      return false;
    } catch (error) {
      console.error("Error checking auth status:", error);
      return false;
    }
  };

  // Handle admin link click
  const handleAdminClick = (e) => {
    e.preventDefault();

    if (checkAuthStatus()) {
      // User is already authenticated, go directly to dashboard
      navigate("/dashboard");
    } else {
      // Show OTP modal for authentication
      setShowOtpModal(true);
    }
  };

  // Handle smooth scroll for navigation links
  const handleSmoothScroll = (elementId, linkTitle) => {
    setActive(linkTitle);

    setTimeout(() => {
      const element = document.getElementById(elementId);
      if (element) {
        const hasContent = element.offsetHeight > 100;

        if (hasContent) {
          element.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        } else {
          setTimeout(() => {
            element.scrollIntoView({
              behavior: "smooth",
              block: "start",
            });
          }, 500);
        }
      }
    }, 100);
  };

  // Filter navLinks based on services data
  // Filter navLinks based on active services
  const getFilteredNavLinks = () => {
    return navLinks.filter((link) => {
      // If it's the "Servicio" link, only show it if we have active services
      if (link.title === "Servicios") {
        return hasActiveServices === true;
      }
      // Show all other links
      return true;
    });
  };

  return (
    <>
      <nav
        className={`${styles.paddingX}  w-full flex items-center py-5 fixed top-0 z-20 transition-all duration-300 ${
          scrolled ?
            "bg-primary/90 backdrop-blur-md shadow-lg"
          : "bg-transparent"
        }`}
      >
        <a
          href="#"
          onClick={handleAdminClick}
          className="text-purple-400/50 absolute top-3 right-3 text-xs hover:text-purple-400 transition-colors duration-200 cursor-pointer"
        >
          <img
            src="/assets/dashboard/admin.png"
            alt="admin"
            className="w-6 h-6 relative top-3 right-7"
          />
        </a>

        <div className="w-full flex justify-between items-center max-w-7xl mx-auto">
          <Link
            to="/"
            className="flex items-center gap-2"
            onClick={() => {
              setActive("");
              window.scrollTo(0, 0);
            }}
          >
            <img
              src={logo}
              alt="logo"
              className="w-9 h-9 object-contain"
              width={309}
              height={200}
            />
            <p className="text-white text-[18px] font-bold cursor-pointer flex">
              Alonso &nbsp;
              <span className="sm:block hidden ">|&nbsp; Castillo</span>
            </p>
          </Link>

          <ul className="list-none hidden sm:flex flex-row gap-10">
            {getFilteredNavLinks().map((link) => (
              <li
                key={link.id}
                className={`${
                  active === link.title ? "text-white" : "text-secondary"
                } hover:text-white text-[18px] font-medium cursor-pointer transition-colors duration-200`}
                onClick={(e) => {
                  e.preventDefault();
                  handleSmoothScroll(link.id, link.title);
                }}
              >
                <a href={`#${link.id}`}>{link.title}</a>
              </li>
            ))}
          </ul>

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
                {getFilteredNavLinks().map((link) => (
                  <li
                    key={link.id}
                    className={`${
                      active === link.title ? "text-white" : "text-secondary"
                    } font-poppins font-medium cursor-pointer text-[16px] transition-colors duration-200`}
                    onClick={(e) => {
                      e.preventDefault();
                      setToggle(false);
                      handleSmoothScroll(link.id, link.title);
                    }}
                  >
                    <a href={`#${link.id}`}>{link.title}</a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </nav>

      <OtpModal isOpen={showOtpModal} onClose={() => setShowOtpModal(false)} />
    </>
  );
};

export default Navbar;
