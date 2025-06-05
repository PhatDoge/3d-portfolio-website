import { motion } from "framer-motion";
import Slider from "react-slick";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import { useState, useEffect, useMemo } from "react";

import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { SectionWrapper } from "../hoc";
import { styles } from "../styles";
import { fadeIn, textVariant } from "../utils/motion";
import SkillCard from "./SkillCard";
import PropTypes from "prop-types";

// Enhanced Loading component with better animations
const LoadingSection = () => (
  <section
    id="about"
    className="min-h-[400px] flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900 rounded-2xl border border-gray-700/60 shadow-lg"
  >
    <motion.div
      className="text-center p-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Animated loading icon */}
      <motion.div
        className="w-16 h-16 mx-auto mb-6 flex items-center justify-center"
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
      >
        <div className="w-12 h-12 border-4 border-purple-400 border-t-transparent rounded-full animate-spin"></div>
      </motion.div>

      {/* Animated title */}
      <motion.h2
        className="text-3xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        Cargando Habilidades
      </motion.h2>

      {/* Animated description */}
      <motion.p
        className="text-gray-400 text-lg mb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.6 }}
      >
        Preparando mi stack tecnológico...
      </motion.p>

      {/* Animated progress bar */}
      <div className="w-64 h-2 bg-gray-700 rounded-full mx-auto overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-purple-400 to-blue-400 rounded-full"
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* Skeleton skill cards */}
      <div className="flex justify-center gap-6 mt-8">
        {[1, 2, 3].map((i) => (
          <motion.div
            key={i}
            className="w-20 h-24 bg-gray-800 rounded-lg"
            animate={{ opacity: [0.3, 0.7, 0.3] }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: i * 0.2,
            }}
          />
        ))}
      </div>
    </motion.div>
  </section>
);

// Enhanced Error/Empty State component
const EmptyStateSection = ({ message = "No se encontraron habilidades" }) => (
  <section
    id="about"
    className="min-h-[400px] flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900 rounded-2xl border border-gray-700/60 shadow-lg"
  >
    <motion.div
      className="text-center p-8"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Animated emoji */}
      <motion.span
        className="text-8xl block mb-4"
        animate={{
          rotate: [0, -10, 10, -10, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatDelay: 1,
        }}
      >
        🛠️
      </motion.span>

      <motion.h3
        className="text-2xl font-bold mb-2 text-white"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        ¡Ups! {message}
      </motion.h3>

      <motion.p
        className="text-gray-400 text-lg"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        Las habilidades se están cargando o no están disponibles en este
        momento.
      </motion.p>

      {/* Animated dots */}
      <div className="flex justify-center gap-2 mt-6">
        {[1, 2, 3].map((i) => (
          <motion.div
            key={i}
            className="w-3 h-3 bg-purple-400 rounded-full"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{
              duration: 0.8,
              repeat: Infinity,
              delay: i * 0.2,
            }}
          />
        ))}
      </div>
    </motion.div>
  </section>
);
EmptyStateSection.propTypes = {
  message: PropTypes.string,
};

const About = () => {
  const skills = useQuery(api.skills.getAllSkills);
  const [isDataReady, setIsDataReady] = useState(false);
  const [showEmptyState, setShowEmptyState] = useState(false);
  const skillDetails = useQuery(api.projectdetails.getProjectDetails);

  const details = skillDetails?.[0] || {
    skillTitle: "Mi Stack",
    skillHeader: "Habilidades",
    skillDescription: "Estas son las tecnologias con las que trabajo",
  };

  // Memoize slider settings to prevent unnecessary re-renders
  const sliderSettings = useMemo(() => {
    const skillsLength = skills?.length || 0;

    return {
      dots: true,
      infinite: skillsLength > 3,
      speed: 2000,
      slidesToShow: Math.min(skillsLength || 3, 3),
      slidesToScroll: 1,
      autoplay: skillsLength > 1,
      autoplaySpeed: 3000,
      rtl: false,
      arrows: false,
      adaptiveHeight: false,
      responsive: [
        {
          breakpoint: 1024,
          settings: {
            slidesToShow: Math.min(skillsLength || 2, 2),
            slidesToScroll: 1,
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
  }, [skills?.length]);

  // Enhanced data loading effect with timeout for empty state
  useEffect(() => {
    if (skillDetails && skills !== undefined) {
      if (skills.length > 0) {
        // Use requestAnimationFrame for smoother transition
        const timer = requestAnimationFrame(() => {
          setIsDataReady(true);
        });
        return () => cancelAnimationFrame(timer);
      } else {
        // Show empty state after a brief delay
        const emptyTimer = setTimeout(() => {
          setShowEmptyState(true);
        }, 1000);
        return () => clearTimeout(emptyTimer);
      }
    }
  }, [skillDetails, skills]);

  // Loading state - show while data is undefined
  if (
    !skillDetails ||
    skills === undefined ||
    (!isDataReady && !showEmptyState)
  ) {
    return <LoadingSection />;
  }

  // Empty state - show when no skills are available
  if (skills.length === 0 && showEmptyState) {
    return <EmptyStateSection />;
  }

  // Main content with entrance animation
  return (
    <motion.section
      id="about"
      className="about-section"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <motion.div
        variants={textVariant()}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.25 }}
      >
        <p className={`${styles.sectionSubText} text-center`}>
          {details.skillHeader}
        </p>
        <h2 className={`${styles.heroHeadText} text-center`}>
          {details.skillTitle}
        </h2>
      </motion.div>

      <div className="description-wrapper">
        <motion.p
          variants={fadeIn("", "", 0.1, 1)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.25 }}
          className="description-text"
        >
          {details.skillDescription}
        </motion.p>
      </div>

      <motion.div
        className="skills-section"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <div className="carousel-container">
          <Slider {...sliderSettings}>
            {skills.map((skill, index) => (
              <div key={skill._id} className="skill-slide">
                <SkillCard index={index} {...skill} />
              </div>
            ))}
          </Slider>
        </div>
      </motion.div>
    </motion.section>
  );
};
const WrappedAbout = SectionWrapper(About, "about");
export default WrappedAbout;
