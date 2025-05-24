import { motion } from "framer-motion";
import {
  VerticalTimeline,
  VerticalTimelineElement,
} from "react-vertical-timeline-component";

import "react-vertical-timeline-component/style.min.css";

import { SectionWrapper } from "../hoc";
import { styles } from "../styles";
import { textVariant } from "../utils/motion";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Loader } from "lucide-react";
import PropTypes from "prop-types";

const ExperienceCard = ({ experience, index }) => {
  return (
    <VerticalTimelineElement
      contentStyle={{
        background: "#1d1836",
        color: "#fff",
      }}
      contentArrowStyle={{ borderRight: "7px solid  #232631" }}
      date={experience.dateRange}
      iconStyle={{ background: "#383E56" }}
      icon={
        <div className="flex justify-center items-center w-full h-full">
          <img
            src={experience.iconUrl}
            alt={experience.workplace}
            className="w-full h-full object-fit rounded-full"
          />
        </div>
      }
    >
      <div>
        <h3 className="text-white text-[24px] font-bold">
          {experience.workTitle}
        </h3>
        <p
          className="text-secondary text-[16px] font-semibold"
          style={{ margin: 0 }}
        >
          {experience.workplace}
        </p>
      </div>

      <ul className="mt-5 list-disc ml-5 space-y-2">
        {experience.descriptionArray.map((point, index) => (
          <li
            key={`experience-point-${index}`}
            className="text-white-100 text-[14px] pl-1 tracking-wider"
          >
            {point}
          </li>
        ))}
      </ul>
    </VerticalTimelineElement>
  );
};

ExperienceCard.propTypes = {
  experience: PropTypes.shape({
    dateRange: PropTypes.string.isRequired,
    iconUrl: PropTypes.string.isRequired,
    workplace: PropTypes.string.isRequired,
    workTitle: PropTypes.string.isRequired,
    descriptionArray: PropTypes.arrayOf(PropTypes.string).isRequired,
  }).isRequired,
  index: PropTypes.number.isRequired,
};

const Experience = () => {
  // Option 1: Get all work experiences
  const allExperiences = useQuery(api.workExperience.getAllWorkExperiences);

  // Option 2: Get just the latest work experience
  // const latestExperience = useQuery(api.workExperience.getLatestWorkExperience);

  if (!allExperiences) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <Loader className="animate-spin w-8 h-8" />
      </div>
    );
  }

  return (
    <>
      <motion.div variants={textVariant()}>
        <p className={`${styles.sectionSubText} text-center`}>
          ¿Qué he hecho hasta ahora?
        </p>
        <h2 className={`${styles.sectionHeadText} text-center`}>
          Mi Experiencia.
        </h2>
      </motion.div>

      <div className="mt-20 flex flex-col">
        <VerticalTimeline>
          {allExperiences.map((experience, index) => (
            <ExperienceCard
              key={`experience-${index}`}
              experience={experience}
              index={index}
            />
          ))}
        </VerticalTimeline>
      </div>
    </>
  );
};

export default SectionWrapper(Experience, "work");
