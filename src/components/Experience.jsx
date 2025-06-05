import { motion } from "framer-motion";
import {
  VerticalTimeline,
  VerticalTimelineElement,
} from "react-vertical-timeline-component";

import "react-vertical-timeline-component/style.min.css";

import { SectionWrapper } from "../hoc";
import { styles } from "../styles";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Loader } from "lucide-react";
import PropTypes from "prop-types";

// Custom motion variant that triggers very early
const earlyTextVariant = (delay = 0) => {
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
        duration: 0.8,
        delay: delay,
        ease: "easeOut",
      },
    },
  };
};

// Helper function to format date range - handles both old and new data formats
const formatDateRange = (experience) => {
  if (experience.dateRange) {
    return experience.dateRange;
  }

  // If new date fields exist, format them
  if (experience.startDate) {
    const formatDate = (timestamp) => {
      const date = new Date(timestamp);
      return date.toLocaleDateString("es-ES", {
        year: "numeric",
        month: "long",
      });
    };

    const startFormatted = formatDate(experience.startDate);

    if (experience.isCurrentJob) {
      return `${startFormatted} - Presente`;
    }

    if (experience.endDate) {
      const endFormatted = formatDate(experience.endDate);
      return `${startFormatted} - ${endFormatted}`;
    }

    return startFormatted;
  }

  // Fallback if neither format is available
  return "Fecha no disponible";
};

const ExperienceCard = ({ experience }) => {
  // Format the date range using the updated helper function
  const dateRange = formatDateRange(experience);

  return (
    <VerticalTimelineElement
      contentStyle={{
        background: "#1d1836",
        color: "#fff",
      }}
      contentArrowStyle={{ borderRight: "7px solid  #232631" }}
      date={dateRange}
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
        {experience.descriptionArray?.map((point, index) => (
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
    startDate: PropTypes.number.isRequired,
    endDate: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.oneOf([null, undefined]),
    ]),
    isCurrentJob: PropTypes.bool.isRequired,
    iconUrl: PropTypes.string.isRequired,
    workplace: PropTypes.string.isRequired,
    workTitle: PropTypes.string.isRequired,
    descriptionArray: PropTypes.arrayOf(PropTypes.string).isRequired,
  }).isRequired,
  index: PropTypes.number.isRequired,
};

const Experience = () => {
  const allExperiences = useQuery(api.workExperience.getAllWorkExperiences);
  const experienceDetails = useQuery(api.projectdetails.getProjectDetails);
  const details = experienceDetails?.[0] || {
    ExperienceTitle: "Mi experiencia",
    ExperienceHeader: "Experiencia",
    ExperienceDescription:
      "Tengo experiencia en diferentes tecnologias y frameworks, puedes verlas en la linea de tiempo.",
  };
  if (!allExperiences) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <Loader className="animate-spin w-8 h-8" />
      </div>
    );
  }

  return (
    <>
      <motion.div
        variants={earlyTextVariant()}
        initial="hidden"
        whileInView="show"
        viewport={{
          once: true,
          amount: 0.01, // Trigger when only 1% is visible
          margin: "0px 0px -200px 0px", // Start animation 200px before element enters viewport, maybe change later
        }}
      >
        <p className={`${styles.sectionSubText} text-center`}>
          {details.ExperienceHeader}
        </p>
        <h2 className={`${styles.sectionHeadText} text-center`}>
          {details.ExperienceTitle}
        </h2>
        <div className="description-wrapper mb-8">
          <p className="description-text">{details.ExperienceDescription}</p>
        </div>
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

const WrappedContact = SectionWrapper(Experience, "work");
export default WrappedContact;
