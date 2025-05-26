import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { motion } from "framer-motion";

import { styles } from "../styles";
import { fadeIn, textVariant } from "../utils/motion";
import { SectionWrapper } from "../hoc";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import ServiceCard from "../components/ServiceCard"; // Import the new component

const About = () => {
  const introductions = useQuery(api.introduction.getIntroductions);
  const services = useQuery(api.services.getServices); // Fetch services from Convex

  // Handle loading state
  if (!introductions || !services) {
    return (
      <div className="h-screen flex items-center justify-center text-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          <p>Cargando servicios...</p>
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
        >
          <p className={`${styles.sectionSubText} text-center`}>
            {introductions[0]?.header || "Introducción"}
          </p>
          <h2 className={`${styles.heroHeadText} text-center`}>
            {introductions[0]?.title || "Sobre Mí"}
          </h2>
        </motion.div>

        <div className="w-full flex justify-center items-center text-center">
          <motion.p
            variants={fadeIn("", "", 0.1, 1)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.25 }}
            className="mt-4 text-secondary text-[17px] max-w-3xl leading-[30px]"
          >
            {introductions[0]?.description || "No hay descripción disponible."}
          </motion.p>
        </div>

        <div className="mt-20 flex justify-center">
          <p className="text-secondary text-[16px]">
            No hay servicios disponibles.
            <a
              href="/admin/services"
              className="text-purple-400 hover:text-purple-300 ml-2"
            >
              Agregar servicios
            </a>
          </p>
        </div>
      </section>
    );
  }

  const sliderSettings = {
    dots: true,
    infinite: services.length > 3, // Only infinite if we have more than 3 services
    speed: 2000,
    slidesToShow: Math.min(3, services.length), // Show up to 3 or number of services
    slidesToScroll: 1,
    autoplay: services.length > 1, // Only autoplay if we have more than 1 service
    autoplaySpeed: 4000,
    rtl: false,
    arrows: false,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: Math.min(2, services.length),
          slidesToScroll: 1,
          arrows: false,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          arrows: false,
        },
      },
    ],
  };

  const introduction = introductions[0];

  return (
    <section id="about" className="min-h-screen w-full relative">
      <motion.div
        variants={textVariant()}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.25 }}
      >
        <p className={`${styles.sectionSubText} text-center`}>
          {introduction?.header || "Introducción"}
        </p>
        <h2 className={`${styles.heroHeadText} text-center`}>
          {introduction?.title || "Sobre Mí"}
        </h2>
      </motion.div>

      <div className="w-full flex justify-center items-center text-center">
        <motion.p
          variants={fadeIn("", "", 0.1, 1)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.25 }}
          className="mt-4 text-secondary text-[17px] max-w-3xl leading-[30px]"
        >
          {introduction?.description || "No hay descripción disponible."}
        </motion.p>
      </div>

      <div className="mt-20">
        {
          services.length === 1 ?
            // If only one service, display it centered without slider
            <div className="flex justify-center">
              <ServiceCard
                index={0}
                {...services[0]}
                // Handle potential undefined icon URL by using a fallback or converting storage ID to URL
                icon={services[0].icon} // You might need to convert this from storage ID to URL
              />
            </div>
            // Multiple services, use slider
          : <Slider {...sliderSettings}>
              {services.map((service, index) => (
                <div key={service._id} className="px-4">
                  <ServiceCard
                    index={index}
                    {...service}
                    // Handle potential undefined icon URL by using a fallback or converting storage ID to URL
                    icon={service.icon} // You might need to convert this from storage ID to URL
                  />
                </div>
              ))}
            </Slider>

        }
      </div>

      {/* Service Categories Filter (Optional Enhancement) */}
      {services.length > 3 && (
        <div className="mt-12 flex justify-center">
          <div className="flex gap-4 flex-wrap justify-center">
            <button className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-all duration-300">
              Todos
            </button>
            <button className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-all duration-300">
              Diseño
            </button>
            <button className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-all duration-300">
              Desarrollo
            </button>
            <button className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-all duration-300">
              Consultoría
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default SectionWrapper(About, "about");
