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

// Skeleton card component
const SkeletonCard = () => (
  <div className="skeleton-card">
    <div className="skeleton-card-wrapper">
      <div className="skeleton-card-content">
        <div className="skeleton-icon"></div>
        <div className="skeleton-text"></div>
      </div>
    </div>
  </div>
);

// Loading component for better reusability
const LoadingSection = () => (
  <section id="about" className="loading-section">
    <div className="text-center">
      <p className={`${styles.sectionSubText} text-center animate-pulse`}>
        Loading...
      </p>
      <h2 className={`${styles.heroHeadText} text-center animate-pulse`}>
        Please wait
      </h2>
    </div>
    <div className="skeleton-container">
      <div className="skeleton-cards-wrapper">
        {[...Array(3)].map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    </div>
  </section>
);

const About = () => {
  const introductions = useQuery(api.introduction.getIntroductions);
  const skills = useQuery(api.skills.getAllSkills);
  const [isDataReady, setIsDataReady] = useState(false);

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

  // Optimized data loading effect
  useEffect(() => {
    if (introductions && skills && skills.length > 0) {
      // Use requestAnimationFrame for smoother transition
      const timer = requestAnimationFrame(() => {
        setIsDataReady(true);
      });
      return () => cancelAnimationFrame(timer);
    }
  }, [introductions, skills]);

  // Early return for loading state
  if (!introductions || !skills || !isDataReady) {
    return <LoadingSection />;
  }

  const introduction = introductions[0] || {};

  return (
    <section id="about" className="about-section">
      <motion.div
        variants={textVariant()}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.25 }}
      >
        <p className={`${styles.sectionSubText} text-center`}>
          {introduction.header || "header example"}
        </p>
        <h2 className={`${styles.heroHeadText} text-center`}>
          {introduction.title || "title example"}
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
          {introduction.description || "description example"}
        </motion.p>
      </div>

      <div className="skills-section">
        <div className="carousel-container">
          <Slider {...sliderSettings}>
            {skills.map((skill, index) => (
              <div key={skill._id} className="skill-slide">
                <SkillCard index={index} {...skill} />
              </div>
            ))}
          </Slider>
        </div>
      </div>
    </section>
  );
};

export default SectionWrapper(About, "about");
