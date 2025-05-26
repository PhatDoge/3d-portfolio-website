import React, { useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { motion } from "framer-motion";

import { styles } from "../styles";
import { fadeIn, textVariant } from "../utils/motion";
import { SectionWrapper } from "../hoc";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import ServiceCard from "../components/ServiceCard";

// Custom Arrow Components
const CustomPrevArrow = ({ onClick }) => (
  <button
    onClick={onClick}
    className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white shadow-lg transition-all duration-300 hover:scale-110 backdrop-blur-sm border border-white/20"
  >
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
    >
      <path d="M15 18l-6-6 6-6" />
    </svg>
  </button>
);

const CustomNextArrow = ({ onClick }) => (
  <button
    onClick={onClick}
    className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white shadow-lg transition-all duration-300 hover:scale-110 backdrop-blur-sm border border-white/20"
  >
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
    >
      <path d="M9 18l6-6-6-6" />
    </svg>
  </button>
);

const About = () => {
  const [activeFilter, setActiveFilter] = useState("Todos");
  const introductions = useQuery(api.introduction.getIntroductions);
  const services = useQuery(api.services.getServices);

  // Handle loading state
  if (!introductions || !services) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-6">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin"></div>
          </div>
          <div className="text-center">
            <p className="text-white text-lg font-semibold mb-2">
              Cargando servicios...
            </p>
            <p className="text-gray-400 text-sm">
              Preparando una experiencia increíble
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Handle empty services
  if (services.length === 0) {
    return (
      <section id="about" className="min-h-screen w-full relative">
        <motion.div
          variants={textVariant()}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.25 }}
          className="text-center mb-16"
        >
          <p className={`${styles.sectionSubText} text-center text-purple-400`}>
            {introductions[0]?.header || "Introducción"}
          </p>
          <h2
            className={`${styles.heroHeadText} text-center bg-gradient-to-r from-white via-purple-200 to-white bg-clip-text text-transparent`}
          >
            {introductions[0]?.title || "Sobre Mí"}
          </h2>
        </motion.div>

        <div className="w-full flex justify-center items-center text-center px-8">
          <motion.p
            variants={fadeIn("", "", 0.1, 1)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.25 }}
            className="mt-4 text-gray-300 text-lg max-w-4xl leading-relaxed"
          >
            {introductions[0]?.description || "No hay descripción disponible."}
          </motion.p>
        </div>

        <div className="mt-20 flex justify-center">
          <div className="bg-white/5 backdrop-blur-sm border border-white/20 rounded-2xl p-8 text-center">
            <p className="text-gray-300 text-lg mb-4">
              No hay servicios disponibles.
            </p>
            <a
              href="/admin/services"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-semibold rounded-xl transition-all duration-300 hover:scale-105 shadow-lg"
            >
              <span>Agregar servicios</span>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M12 5v14M5 12h14" />
              </svg>
            </a>
          </div>
        </div>
      </section>
    );
  }

  // Get unique categories for filter
  const categories = [
    "Todos",
    ...new Set(services.map((service) => service.category)),
  ];

  // Filter services based on active filter
  const filteredServices =
    activeFilter === "Todos" ? services : (
      services.filter((service) => service.category === activeFilter)
    );

  const sliderSettings = {
    dots: true,
    infinite: filteredServices.length > 3,
    speed: 800,
    slidesToShow: Math.min(4, filteredServices.length), // Show 4 cards instead of 3
    slidesToScroll: 1,
    autoplay: filteredServices.length > 1,
    autoplaySpeed: 5000,
    pauseOnHover: true,
    rtl: false,
    prevArrow: <CustomPrevArrow />,
    nextArrow: <CustomNextArrow />,
    responsive: [
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: Math.min(3, filteredServices.length),
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: Math.min(2, filteredServices.length),
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
    // Custom dot styling
    customPaging: (i) => (
      <div className="w-3 h-3 rounded-full bg-white/30 hover:bg-white/60 transition-all duration-300 mt-8" />
    ),
    dotsClass: "slick-dots custom-dots",
  };

  const introduction = introductions[0];

  return (
    <>
      <section
        id="about"
        className="min-h-screen w-full relative overflow-hidden"
      >
        <div className="relative z-10">
          {/* Header */}
          <motion.div
            variants={textVariant()}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.25 }}
            className="text-center mb-16 pt-20"
          >
            <motion.p
              className={`${styles.sectionSubText} text-center text-purple-400 mb-4`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {introduction?.header || "Introducción"}
            </motion.p>
            <motion.h2
              className={`${styles.heroHeadText} text-center bg-gradient-to-r from-white via-purple-200 to-white bg-clip-text text-transparent`}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              {introduction?.title || "Sobre Mí"}
            </motion.h2>
          </motion.div>

          {/* Description */}
          <div className="w-full flex justify-center items-center text-center px-8 mb-16">
            <motion.p
              variants={fadeIn("", "", 0.1, 1)}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.25 }}
              className="text-gray-300 text-lg max-w-4xl leading-relaxed font-medium"
            >
              {introduction?.description || "No hay descripción disponible."}
            </motion.p>
          </div>

          {/* Filter Buttons */}
          {categories.length > 1 && (
            <motion.div
              className="flex justify-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <div className="flex gap-3 p-2 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setActiveFilter(category)}
                    className={`px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-300 ${
                      activeFilter === category ?
                        "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg scale-105"
                      : "text-gray-300 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Services Display */}
          <div className="mt-8 px-4">
            {
              filteredServices.length === 1 ?
                // Single service - centered display
                <motion.div
                  className="flex justify-center"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6 }}
                >
                  <ServiceCard
                    index={0}
                    {...filteredServices[0]}
                    iconUrl={filteredServices[0].iconUrl}
                  />
                </motion.div>
                // Multiple services - slider
              : <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                  className="services-slider"
                >
                  <Slider {...sliderSettings}>
                    {filteredServices.map((service, index) => (
                      <div key={service._id} className="px-3">
                        {" "}
                        {/* Reduced padding */}
                        <ServiceCard
                          index={index}
                          {...service}
                          iconUrl={service.iconUrl}
                        />
                      </div>
                    ))}
                  </Slider>
                </motion.div>

            }
          </div>

          {/* Services Statistics */}
          {services.length > 0 && (
            <motion.div
              className="mt-20 flex justify-center"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl">
                <div className="text-center">
                  <div className="text-3xl font-bold text-white mb-2">
                    {services.length}+
                  </div>
                  <div className="text-gray-400 text-sm">
                    Servicios Disponibles
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-400 mb-2">
                    {services.reduce(
                      (acc, service) => acc + service.projectCount,
                      0
                    )}
                    +
                  </div>
                  <div className="text-gray-400 text-sm">
                    Proyectos Completados
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-400 mb-2">
                    {categories.length - 1}
                  </div>
                  <div className="text-gray-400 text-sm">
                    Categorías de Servicio
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* Custom CSS for Slider */}
      <style jsx global>{`
        .services-slider .slick-dots {
          bottom: -60px;
          text-align: center;
        }

        .services-slider .slick-dots li {
          margin: 0 8px;
        }

        .services-slider .slick-dots li div {
          transition: all 0.3s ease;
        }

        .services-slider .slick-dots li.slick-active div {
          background: rgba(147, 51, 234, 0.8);
          transform: scale(1.2);
        }

        .services-slider .slick-track {
          display: flex;
          align-items: center;
        }

        .services-slider .slick-slide {
          height: inherit;
        }

        .services-slider .slick-slide > div {
          height: 100%;
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .services-slider .slick-slide {
          animation: slideIn 0.6s ease-out;
        }
      `}</style>
    </>
  );
};

export default SectionWrapper(About, "about");
