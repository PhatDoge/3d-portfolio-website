import { Tilt } from "react-tilt";
import { motion } from "framer-motion";
import { styles } from "../styles";
import { github } from "../assets";
import { SectionWrapper } from "../hoc";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

// Updated fadeIn function for faster animations
const fadeIn = (direction, type, delay, duration) => {
  return {
    hidden: {
      x:
        direction === "left" ? 100
        : direction === "right" ? -100
        : 0,
      y:
        direction === "up" ? 100
        : direction === "down" ? -100
        : 0,
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

// Array of predefined colors for tags
const tagColors = [
  "text-blue-400",
  "text-green-400",
  "text-purple-400",
  "text-pink-400",
  "text-yellow-400",
  "text-red-400",
  "text-indigo-400",
  "text-cyan-400",
  "text-orange-400",
  "text-emerald-400",
  "text-violet-400",
  "text-rose-400",
];

// Function to get color for each tag consistently
const getTagColor = (tagName, index) => {
  // Use a combination of tag name and index to ensure consistent coloring
  const colorIndex = (tagName.length + index) % tagColors.length;
  return tagColors[colorIndex];
};

// ProjectCard component - Updated to handle comma-separated tags with different colors
const ProjectCard = ({
  index,
  cardTitle,
  cardDescription,
  githubLink,
  tag,
  imageUrl,
  _id,
}) => {
  // Parse tags from comma-separated string
  const parsedTags =
    tag ?
      tag
        .split(",")
        .map((t, tagIndex) => ({
          name: t.trim(),
          color: getTagColor(t.trim(), tagIndex),
        }))
        .filter((tagItem) => tagItem.name) // Remove empty tags
    : [];

  return (
    <motion.div
      variants={fadeIn("up", "spring", index * 0.2, 0.5)} // Faster animations
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }} // Trigger animation when 20% of the element is visible
      // className="w-full xs:w-[100%] sm:w-[100%] md:w-[80%] lg:w-[45%] xl:w-[30%] p-4"
      className="w-full p-4"
    >
      <Tilt
        options={{ max: 45, scale: 1, speed: 450 }}
        className="bg-tertiary p-5 rounded-2xl"
      >
        <div className="relative w-full h-[230px]">
          <img
            src={imageUrl || "/placeholder-image.jpg"} // Fallback image
            alt={cardTitle}
            className="w-full h-full object-cover rounded-2xl"
            onError={(e) => {
              e.target.src = "/placeholder-image.jpg"; // Fallback if image fails to load
            }}
          />
          <div className="absolute inset-0 flex justify-end m-3">
            <div
              onClick={() => {
                console.log(`View project: ${_id}`);
              }}
              className="black-gradient w-10 h-10 rounded-full flex justify-center items-center cursor-pointer"
            >
              {githubLink && (
                <a
                  href={githubLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="black-gradient w-10 h-10 rounded-full flex justify-center items-center cursor-pointer"
                >
                  <img
                    src={github}
                    alt="github"
                    className="w-1/2 h-1/2 object-contain"
                  />
                </a>
              )}
            </div>
          </div>
        </div>
        <div className="mt-5">
          <h3 className="text-white font-bold text-[24px]">{cardTitle}</h3>
          <p className="mt-2 text-secondary text-[14px]">{cardDescription}</p>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {parsedTags.map((tagItem, tagIndex) => (
            <span
              key={`${_id}-tag-${tagIndex}`}
              className={`text-[14px] ${tagItem.color} bg-black-200 px-2 py-1 rounded-md border border-gray-600 hover:bg-gray-700 transition-colors duration-200`}
            >
              #{tagItem.name}
            </span>
          ))}
        </div>
      </Tilt>
    </motion.div>
  );
};

// Loading component
const LoadingCard = ({ index }) => (
  <motion.div
    variants={fadeIn("up", "spring", index * 0.2, 0.5)}
    initial="hidden"
    animate="show"
    // className="w-full xs:w-[100%] sm:w-[100%] md:w-[80%] lg:w-[45%] xl:w-[30%] p-4"
    className="w-full p-4"
  >
    <div className="bg-tertiary p-5 rounded-2xl animate-pulse">
      <div className="w-full h-[230px] bg-gray-600 rounded-2xl mb-5"></div>
      <div className="h-6 bg-gray-600 rounded mb-2"></div>
      <div className="h-4 bg-gray-600 rounded mb-4"></div>
      <div className="flex gap-2">
        <div className="h-4 w-16 bg-gray-600 rounded"></div>
        <div className="h-4 w-20 bg-gray-600 rounded"></div>
      </div>
    </div>
  </motion.div>
);

// Works component - Updated to use Convex
// Works component - Updated to use Convex with proper null checking
const Works = () => {
  // Fetch projects from Convex
  const projects = useQuery(api.projects.getProjects);
  const projectsDetails = useQuery(api.projectdetails.getProjectDetails);

  const details = projectsDetails?.[0];

  return (
    <>
      <motion.div
        variants={textVariant(0)}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
      >
        <p className={`${styles.sectionSubText} text-center`}>
          {details?.header || "Mis Proyectos (header)."}
        </p>
        <h2 className={`${styles.sectionHeadText} text-center`}>
          {details?.title || "Mis Proyectos (title)."}
        </h2>
      </motion.div>

      <div className="w-full flex justify-center items-center text-center">
        <motion.p
          variants={fadeIn("", "", 0.1, 1)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="mt-3 text-secondary text-[17px] max-w-3xl leading-[30px]"
        >
          {details?.description || "Mis proyectos (description)."}
        </motion.p>
      </div>

      <div className="mt-20 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-7 justify-center items-center">
        {projects === undefined ?
          // Loading state - show skeleton cards
          Array.from({ length: 3 }).map((_, index) => (
            <LoadingCard key={`loading-${index}`} index={index} />
          ))
        : projects.length === 0 ?
          // Empty state
          <motion.div
            variants={fadeIn("up", "spring", 0, 0.5)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            className="text-center py-20"
          >
            <p className="text-secondary text-[18px]">
              No hay proyectos disponibles aún.
            </p>
            <p className="text-secondary text-[14px] mt-2">
              ¡Agrega tu primer proyecto para comenzar!
            </p>
          </motion.div>
          // Display actual projects
        : projects.map((project, index) => (
            <ProjectCard key={project._id} index={index} {...project} />
          ))
        }
      </div>
    </>
  );
};

export default SectionWrapper(Works, "");
