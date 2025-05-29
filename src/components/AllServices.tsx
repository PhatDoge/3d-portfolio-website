import { motion } from "framer-motion";
import { useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import ServiceCard from "./ServiceCard";

const AllServices = ({ services }) => {
  const [activeFilter, setActiveFilter] = useState("Todos");
  const activeServices =
    services?.filter((service: any) => service.isActive || service.active) ||
    [];

  // Handle empty services
  if (!services || services.length === 0) {
    return (
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
    );
  }

  // Get unique categories for filter
  const categories = [
    "Todos",
    ...Array.from(
      new Set<string>(activeServices.map((service) => service.category))
    ),
  ];

  // Only show filters if there are 3 or more services
  const shouldShowFilters = activeServices.length >= 3;
  // Filter services based on active filter
  const filteredServices =
    activeFilter === "Todos" ? activeServices : (
      activeServices.filter((service) => service.category === activeFilter)
    );

  const sliderSettings = {
    dots: true,
    infinite: filteredServices.length > 3,
    speed: 600,
    slidesToShow: Math.min(3, filteredServices.length),
    slidesToScroll: 1,
    autoplay: filteredServices.length > 1,
    autoplaySpeed: 3000,
    pauseOnHover: true,
    rtl: false,
    prevArrow: null,
    nextArrow: null,
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
    customPaging: (i) => (
      <div className="w-3 h-3 rounded-full bg-white/30 hover:bg-white/60 transition-all duration-300 mt-8" />
    ),
    dotsClass: "slick-dots custom-dots",
  };

  return (
    <section id="services" className="mb-28">
      {/* Filter Buttons - Only show if 3+ services and multiple categories */}
      {shouldShowFilters && categories.length > 1 && (
        <motion.div
          className="flex justify-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          viewport={{ once: true, amount: 0.25 }}
        >
          <div className="relative">
            {/* Background glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 via-blue-600/20 to-purple-600/20 rounded-3xl blur-xl" />

            {/* Filter container */}
            <div className="relative flex gap-2 p-2 bg-black/40 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl">
              {categories.map((category, index) => {
                let displayName = category;
                if (category === "design") displayName = "Diseño";
                else if (category === "consulting") displayName = "Consulta";
                else if (category === "development") displayName = "Desarrollo";
                return (
                  <motion.button
                    key={`category-${index}`}
                    onClick={() => setActiveFilter(category)}
                    className={`relative px-6 py-3 rounded-2xl font-semibold text-sm transition-all duration-500 overflow-hidden group ${
                      activeFilter === category ? "text-white" : (
                        "text-gray-400 hover:text-white"
                      )
                    }`}
                    initial={{ opacity: 1, y: 0 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {/* Fondo activo del botón */}
                    {activeFilter === category && (
                      <motion.div
                        layoutId="activeFilter"
                        className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl shadow-lg"
                        transition={{
                          type: "spring",
                          bounce: 0.2,
                          duration: 0.6,
                        }}
                      />
                    )}

                    {/* Efecto hover para botones inactivos */}
                    <div className="absolute inset-0 bg-white/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    {/* Texto del botón */}
                    <span className="relative z-10 tracking-wide">
                      {displayName}
                    </span>

                    {/* Glow activo */}
                    {activeFilter === category && (
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-600 to-blue-600 opacity-30 blur-sm" />
                    )}
                  </motion.button>
                );
              })}
            </div>

            {/* Bottom accent line */}
            <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-16 h-0.5 bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />
          </div>
        </motion.div>
      )}

      {/* Services Display */}
      <div className="px-4">
        {filteredServices.length === 1 ?
          // Single service - centered display with max width
          <motion.div
            className="flex justify-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <div className="max-w-sm sm:max-w-md lg:max-w-lg w-auto">
              <ServiceCard
                index={0}
                {...filteredServices[0]}
                iconUrl={filteredServices[0].iconUrl}
              />
            </div>
          </motion.div>
        : filteredServices.length === 2 ?
          // Two services - justify between
          <motion.div
            className="flex justify-between gap-8 max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {filteredServices.map((service, index) => (
              <div key={service._id} className="flex-1 flex justify-center">
                <div className="max-w-sm w-full">
                  <ServiceCard
                    index={index}
                    {...service}
                    iconUrl={service.iconUrl}
                  />
                </div>
              </div>
            ))}
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
                <div key={service._id} className="px-3 h-full">
                  <div className="h-full">
                    <ServiceCard
                      index={index}
                      {...service}
                      iconUrl={service.iconUrl}
                    />
                  </div>
                </div>
              ))}
            </Slider>
          </motion.div>
        }
      </div>

      {/* Services Statistics */}
      {activeServices.length > 0 && (
        <motion.div
          className="mt-20 flex justify-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
        >
          <div className="flex flex-row gap-8 max-w-2xl w-full justify-center">
            <div className="flex-1 text-center">
              <div className="text-3xl font-bold text-white mb-2">
                {activeServices.length}+
              </div>
              <div className="text-gray-400 text-sm">Servicios Disponibles</div>
            </div>
            <div className="flex-1 text-center">
              <div className="text-3xl font-bold text-purple-400 mb-2">
                {activeServices.reduce(
                  (acc, service) => acc + service.projectCount,
                  0
                )}
                +
              </div>
              <div className="text-gray-400 text-sm">Proyectos Completados</div>
            </div>
            <div className="flex-1 text-center">
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

      {/* Custom CSS for Slider - UPDATED WITH EQUAL HEIGHTS */}
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

        /* CRITICAL FIX: Equal heights for slider cards */
        .services-slider .slick-track {
          display: flex !important;
          align-items: stretch !important;
        }

        .services-slider .slick-slide {
          height: auto !important;
          display: flex !important;
        }

        .services-slider .slick-slide > div {
          height: 100% !important;
          display: flex !important;
          flex-direction: column !important;
        }

        .services-slider .slick-slide > div > div {
          height: 100% !important;
          display: flex !important;
          flex-direction: column !important;
        }

        /* Force all cards to have the same height */
        .services-slider .slick-list {
          overflow: visible;
        }

        /* Alternative approach - set minimum height */
        .services-slider .slick-slide {
          min-height: 700px;
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

        /* Enhanced filter button animations */
        @keyframes filterGlow {
          0%,
          100% {
            box-shadow: 0 0 20px rgba(147, 51, 234, 0.3);
          }
          50% {
            box-shadow: 0 0 30px rgba(59, 130, 246, 0.4);
          }
        }
      `}</style>
    </section>
  );
};

export default AllServices;
