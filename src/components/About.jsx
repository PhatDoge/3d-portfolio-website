import React from "react";
import { Tilt } from "react-tilt";
import { motion } from "framer-motion";

import { styles } from "../styles";
import { services } from "../constants";
import { fadeIn, textVariant } from "../utils/motion";
import { SectionWrapper } from "../hoc";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

const ServiceCard = ({ index, title, icon }) => {
  return (
    <Tilt className="xs:w-[250px] w-full">
      <motion.div
        variants={fadeIn("right", "spring", 0.5 * index, 0.75)}
        className="w-full green-pink-gradient p-[1px] rounded-[20px] shadow-card"
      >
        <div
          options={{
            max: 45,
            scale: 1,
            speed: 450,
          }}
          className="bg-tertiary rounded-[20px] py-5 px-12 min-h-[280px] flex justify-evenly items-center flex-col"
        >
          <img src={icon} alt="title" className="w-16 h-16 object-contain" />
          <h3 className="text-white text-[20px] font-bold text-center">
            {title}
          </h3>
        </div>
      </motion.div>
    </Tilt>
  );
};

const About = () => {
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
          {/* Soy un desarrollador web con experiencia en HTML, CSS y JavaScript,
          además de framworks como React, Node.js, Three.js y Tailwind CSS. Soy
          un aprendiz rápido y disfruto colaborando con otros. Además de mis
          habilidades técnicas, destaco por mi capacidad para trabajar bien con
          personas, siendo comunicativo y colaborativo. Mi enfoque es crear
          soluciones atractivas, funcionales y accesibles para los usuarios. */}
        </motion.p>
      </div>

      <div className="mt-20 flex flex-wrap gap-10">
        {services.map((services, index) => (
          <ServiceCard key={services.title} index={index} {...services} />
        ))}
      </div>
    </>
  );
};

export default SectionWrapper(About, "about");
