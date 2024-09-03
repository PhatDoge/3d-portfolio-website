import { Tilt } from "react-tilt";
import { motion } from "framer-motion";
import { styles } from "../styles";
import { github } from "../assets";
import { SectionWrapper } from "../hoc";
import { projects } from "../constants";

// Updated fadeIn function for faster animations
const fadeIn = (direction, type, delay, duration) => {
  return {
    hidden: {
      x: direction === "left" ? 100 : direction === "right" ? -100 : 0,
      y: direction === "up" ? 100 : direction === "down" ? -100 : 0,
      opacity: 0,
    },
    show: {
      x: 0,
      y: 0,
      opacity: 1,
      transition: {
        type: type,
        delay: delay,
        duration: duration,
        ease: "easeOut",
      },
    },
  };
};

// Text variant for animations
const textVariant = (delay) => {
  return {
    hidden: {
      y: -50,
      opacity: 0,
    },
    show: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        duration: 1.25,
        delay: delay,
      },
    },
  };
};

// ProjectCard component
const ProjectCard = ({
  index,
  name,
  description,
  tags,
  image,
  source_code_link,
}) => {
  return (
    <motion.div
      variants={fadeIn("up", "spring", index * 0.2, 0.5)} // Faster animations
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }} // Trigger animation when 20% of the element is visible
      className="w-full xs:w-[100%] sm:w-[100%] md:w-[80%] lg:w-[45%] xl:w-[30%] p-4"
    >
      <Tilt
        options={{ max: 45, scale: 1, speed: 450 }}
        className="bg-tertiary p-5 rounded-2xl"
      >
        <div className="relative w-full h-[230px]">
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover rounded-2xl"
          />
          <div className="absolute inset-0 flex justify-end m-3">
            <div
              onClick={() => window.open(source_code_link, "_blank")}
              className="black-gradient w-10 h-10 rounded-full flex justify-center items-center cursor-pointer"
            >
              <img
                src={github}
                alt="github"
                className="w-1/2 h-1/2 object-contain"
              />
            </div>
          </div>
        </div>
        <div className="mt-5">
          <h3 className="text-white font-bold text-[24px]">{name}</h3>
          <p className="mt-2 text-secondary text-[14px]">{description}</p>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {tags.map((tag) => (
            <p key={tag.name} className={`text-[14px] ${tag.color}`}>
              #{tag.name}
            </p>
          ))}
        </div>
      </Tilt>
    </motion.div>
  );
};

// Works component
const Works = () => {
  return (
    <>
      <motion.div
        variants={textVariant(0)}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }} // Re-trigger when 20% of the element is in view
      >
        <p className={`${styles.sectionSubText} text-center`}>Mis Proyectos.</p>
        <h2 className={`${styles.sectionHeadText} text-center`}>Proyectos.</h2>
      </motion.div>

      <div className="w-full flex justify-center items-center text-center">
        <motion.p
          variants={fadeIn("", "", 0.1, 1)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }} // Consistent animation trigger
          className="mt-3 text-secondary text-[17px] max-w-3xl leading-[30px]"
        >
          Los proyectos que presento a continuación muestran mis habilidades y
          experiencia a través de ejemplos reales de mi trabajo. Cada proyecto
          está brevemente descrito, con enlaces a los repositorios de código y
          demostraciones en vivo. Reflejando mi capacidad para resolver
          problemas complejos, trabajar con diferentes tecnologías y gestionar
          proyectos de manera efectiva.
        </motion.p>
      </div>

      <div className="mt-20 flex flex-col sm:flex-row flex-wrap gap-7 justify-center items-center">
        {projects.map((project, index) => (
          <ProjectCard key={`project-${index}`} index={index} {...project} />
        ))}
      </div>
    </>
  );
};

export default SectionWrapper(Works, "");
