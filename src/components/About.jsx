import { motion } from "framer-motion";
import Slider from "react-slick";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";

import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { SectionWrapper } from "../hoc";
import { styles } from "../styles";
import { fadeIn, textVariant } from "../utils/motion";
import SkillCard from "../components/SkillCard";
const About = () => {
  const skills = useQuery(api.skills.getAllSkills);

  const introductions = useQuery(api.introduction.getIntroductions);

  // Handle loading state
  if (!introductions || !skills) {
    return (
      <div className="h-screen flex items-center justify-center text-white">
        Loading...
      </div>
    );
  }

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 2000,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    rtl: false, // Left to right direction
    arrows: false, // This removes the side arrows
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
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
          {introduction.header}
        </p>
        <h2 className={`${styles.heroHeadText} text-center`}>
          {introduction.title}
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
          {introduction.description}
        </motion.p>
      </div>

      <div className="mt-20">
        <Slider {...sliderSettings}>
          {skills.map((skill, index) => (
            <div key={skill._id} className="px-4">
              <SkillCard index={index} {...skill} />
            </div>
          ))}
        </Slider>
      </div>

      {/* Add the required CSS styles */}
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

        /* Enhanced border styles for tilt effect */
        .green-pink-gradient {
          background: linear-gradient(90.13deg, #00cea8 1.9%, #bf61ff 97.5%);
        }

        /* Subtle glow effect on hover without changing border appearance */
        .shadow-card:hover {
          box-shadow:
            0 10px 30px rgba(191, 97, 255, 0.15),
            0 0 20px rgba(0, 206, 168, 0.1);
        }

        /* Keep original card appearance */
        .card-face {
          background-clip: padding-box;
        }
      `}</style>
    </section>
  );
};

export default SectionWrapper(About, "about");
