import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

import { close, menu } from "../assets";
import { navLinks } from "../constants";
import { styles } from "../styles";

import logo from "../assets/logo.png";

const Navbar = () => {
  const navigate = useNavigate();
  const [active, setActive] = useState("");
  const [toggle, setToggle] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // OTP Modal states
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [passkey, setPasskey] = useState("");
  const [error, setError] = useState("");

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
      setPasskey("");
      setError("");
    }
  };

  // Validate the entered passkey
  const validatePasskey = (e) => {
    e.preventDefault();

    // For now, use a simple comparison - you can add encryption later
    const adminPasskey = import.meta.env?.VITE_ADMIN_PASSKEY || "123456"; // fallback

    if (passkey === adminPasskey) {
      try {
        // Store the passkey (you can add encryption later)
        localStorage.setItem("accessKey", passkey);
        setShowOtpModal(false);
        setPasskey("");
        setError("");
        navigate("/dashboard");
      } catch (error) {
        console.error("Error storing key:", error);
        setError("Error al procesar la clave. Intenta de nuevo.");
      }
    } else {
      setError("Clave de acceso incorrecta");
    }
  };

  // Close modal and reset states
  const closeModal = () => {
    setShowOtpModal(false);
    setPasskey("");
    setError("");
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

  return (
    <>
      <nav
        className={`${styles.paddingX} w-full flex items-center py-5 fixed top-0 z-20 transition-all duration-300 ${
          scrolled ? "bg-primary/80 backdrop-blur-md" : "bg-primary"
        }`}
      >
        <a
          href="#"
          onClick={handleAdminClick}
          className="text-purple-400/50 absolute top-3 right-3 text-xs hover:text-purple-400 transition-colors duration-200 cursor-pointer"
        >
          admin
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
            {navLinks.map((link) => (
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
                {navLinks.map((link) => (
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

      {/* Simple OTP Modal - Basic Implementation */}
      {showOtpModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">
                Verificación de acceso administrador
              </h2>
              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>

            <p className="text-gray-600 mb-6">
              Para acceder al modo de administrador, ingresa tu clave de acceso.
            </p>

            <div className="mb-4">
              <input
                type="password"
                maxLength={6}
                value={passkey}
                onChange={(e) => setPasskey(e.target.value)}
                placeholder="Ingresa la clave de 6 dígitos"
                className="w-full p-3 border border-gray-300 rounded-md text-center text-lg tracking-widest"
              />
            </div>

            {error && (
              <p className="text-red-500 text-sm text-center mb-4">{error}</p>
            )}

            <button
              onClick={validatePasskey}
              disabled={passkey.length !== 6}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              Ingresar clave de administrador
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
