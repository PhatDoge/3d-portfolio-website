import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Tilt } from "react-tilt";
import { motion } from "framer-motion";

import { styles } from "../styles";
import { services } from "../constants";
import { fadeIn, textVariant } from "../utils/motion";
import { SectionWrapper } from "../hoc";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import PropTypes from "prop-types";

const ServiceCard = ({ index, title, icon }) => {
  return (
    <Tilt className="xs:w-[250px] w-full mx-auto">
      <motion.div
        variants={fadeIn("right", "spring", 0.5 * index, 0.75)}
        className="w-full green-pink-gradient p-[1px] rounded-[20px] shadow-card"
      >
        <div className="card-container relative w-full min-h-[280px] perspective-1000">
          <div className="card-inner relative w-full h-full transition-transform duration-700 transform-style-preserve-3d hover:rotate-y-180">
            {/* Front side */}
            <div className="card-face card-front absolute inset-0 bg-tertiary rounded-[20px] py-5 px-12 min-h-[280px] flex justify-evenly items-center flex-col backface-hidden">
              <img
                src={icon}
                alt="title"
                className="w-16 h-16 object-contain"
              />
              <h3 className="text-white text-[20px] font-bold text-center">
                {title}
              </h3>
            </div>

            {/* Back side */}
            <div className="card-face card-back absolute inset-0 bg-tertiary rounded-[20px] py-4 px-6 min-h-[280px] flex justify-center items-center flex-col backface-hidden rotate-y-180 overflow-hidden">
              <div className="text-center w-full h-full flex flex-col justify-center items-center max-w-full">
                <h4 className="text-white text-[16px] font-semibold mb-3 truncate w-full">
                  About {title}
                </h4>
                <p className="text-secondary text-[12px] leading-5 mb-3 text-center overflow-hidden line-clamp-4">
                  {/* You can customize this text based on your service data */}
                  Detailed information about {title.toLowerCase()} services and
                  capabilities.
                </p>
                <div className="flex justify-center">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">+</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </Tilt>
  );
};
ServiceCard.propTypes = {
  title: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired,
};

const About = () => {
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
          arrows: false, // Ensure arrows are disabled on smaller screens too
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

  const introductions = useQuery(api.introduction.getIntroductions);

  // Handle loading state
  if (!introductions) {
    return (
      <div className="h-screen flex items-center justify-center text-white">
        Loading...
      </div>
    );
  }
  const introduction = introductions[0];
  return (
    <>
      <motion.div variants={textVariant()}>
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
          className="mt-4 text-secondary text-[17px] max-w-3xl leading-[30px] "
        >
          {introduction.description}
        </motion.p>
      </div>

      <div className="mt-20">
        <Slider {...sliderSettings}>
          {services.map((service, index) => (
            <div key={service.title} className="px-4">
              <ServiceCard index={index} {...service} />
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
    </>
  );
};

export default SectionWrapper(About, "about");
