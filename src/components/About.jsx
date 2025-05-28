import { motion } from "framer-motion";
import Slider from "react-slick";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import { useState, useEffect } from "react";

import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { SectionWrapper } from "../hoc";
import { styles } from "../styles";
import { fadeIn, textVariant } from "../utils/motion";
import SkillCard from "./SkillCard";

// Skeleton card component
const SkeletonCard = () => (
  <div className="xs:w-[250px] w-full mx-auto my-4">
    <div className="w-full green-pink-gradient p-[1px] rounded-[20px] shadow-card">
      <div className="bg-tertiary rounded-[20px] py-5 px-12 min-h-[280px] flex justify-evenly items-center flex-col">
        <div className="w-16 h-16 bg-gray-600 rounded animate-pulse"></div>
        <div className="w-32 h-6 bg-gray-600 rounded animate-pulse"></div>
      </div>
    </div>
  </div>
);

const About = () => {
  const introductions = useQuery(api.introduction.getIntroductions);
  const skills = useQuery(api.skills.getAllSkills);
  const [isDataReady, setIsDataReady] = useState(false);

  // Wait for data to be fully loaded before rendering carousel
  useEffect(() => {
    if (introductions && skills && skills.length > 0) {
      // Small delay to ensure smooth transition
      const timer = setTimeout(() => {
        setIsDataReady(true);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [introductions, skills]);

  const sliderSettings = {
    dots: true,
    infinite: skills?.length > 3,
    speed: 2000,
    slidesToShow: Math.min(skills?.length || 3, 3),
    slidesToScroll: 1,
    autoplay: skills?.length > 1,
    autoplaySpeed: 3000,
    rtl: false,
    arrows: false,
    adaptiveHeight: false, // Keep consistent height
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: Math.min(skills?.length || 2, 2),
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

  // Show skeleton loading
  if (!introductions || !skills || !isDataReady) {
    return (
      <section id="about" className="min-h-screen w-full relative">
        <div className="text-center">
          <p className={`${styles.sectionSubText} text-center animate-pulse`}>
            Loading...
          </p>
          <h2 className={`${styles.heroHeadText} text-center animate-pulse`}>
            Please wait
          </h2>
        </div>

        <div className="mt-20">
          <div className="flex justify-center space-x-4">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        </div>
      </section>
    );
  }

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
          {introduction.header || "header example"}
        </p>
        <h2 className={`${styles.heroHeadText} text-center`}>
          {introduction.title || "title example"}
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
          {introduction.description || "description example"}
        </motion.p>
      </div>

      <div className="mt-20">
        {/* Fixed height container prevents layout shift */}
        <div className="carousel-container" style={{ height: "320px" }}>
          <Slider {...sliderSettings}>
            {skills.map((skill, index) => (
              <div key={skill._id} className="px-4 h-full">
                <SkillCard index={index} {...skill} />
              </div>
            ))}
          </Slider>
        </div>
      </div>

      <style jsx>{`
        .perspective-1000 {
          perspective: 1000px;
        }

        .transform-style-preserve-3d {
          transform-style: preserve-3d;
        }

        .backface-hidden {
          backface-visibility: hidden;
        }

        .rotate-y-180 {
          transform: rotateY(180deg);
        }

        .hover\\:rotate-y-180:hover {
          transform: rotateY(180deg);
        }

        .card-container:hover .card-inner {
          transform: rotateY(180deg);
        }

        .line-clamp-4 {
          display: -webkit-box;
          -webkit-line-clamp: 4;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .green-pink-gradient {
          background: linear-gradient(90.13deg, #00cea8 1.9%, #bf61ff 97.5%);
        }

        .shadow-card:hover {
          box-shadow:
            0 10px 30px rgba(191, 97, 255, 0.15),
            0 0 20px rgba(0, 206, 168, 0.1);
        }

        /* Robust carousel styling */
        .carousel-container {
          position: relative;
          overflow: hidden;
        }

        .slick-track {
          display: flex !important;
          align-items: center !important;
          height: 100% !important;
        }

        .slick-slide {
          height: 320px !important;
          display: flex !important;
          justify-content: center;
        }

        .slick-slide > div {
          width: 100% !important;
          height: 100% !important;
          display: flex !important;
          justify-content: center;
          align-items: center !important;
        }

        .card-face {
          background-clip: padding-box;
        }
      `}</style>
    </section>
  );
};

export default SectionWrapper(About, "about");
