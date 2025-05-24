import { Tilt } from "react-tilt";
import { motion } from "framer-motion";
import { styles } from "../styles";
import { github } from "../assets";
import { SectionWrapper } from "../hoc";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import React from "react"; // Added React import

// Type definitions for animation functions
type Direction = "left" | "right" | "up" | "down" | "";
type TransitionType = "spring" | "tween" | "inertia" | "just";

// Updated fadeIn function with TypeScript types
const fadeIn = (
  direction: Direction,
  type: TransitionType,
  delay: number,
  duration: number
) => {
  return {
    hidden: {
      x:
        direction === "left" ? 100 :
        direction === "right" ? -100 : 0,
      y:
        direction === "up" ? 100 :
        direction === "down" ? -100 : 0,
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

// Added type for textVariant parameter
const textVariant = (delay: number) => {
  return {
    hidden: {
      y: -50,
      opacity: 0,
    },
    show: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring" as const,
        duration: 1.25,
        delay: delay,
      },
    },
  };
};

// Type for TagItem
interface TagItem {
  name: string;
  color: string;
}

// Added parameter types for getTagColor
const getTagColor = (tagName: string, index: number): string => {
  const colorIndex = (tagName.length + index) % tagColors.length;
  return tagColors[colorIndex];
};

// ProjectCard props interface
interface ProjectCardProps {
  index: number;
  cardTitle: string;
  cardDescription: string;
  tag: string;
  imageUrl: string;
  _id: string;
}

// ProjectCard component with TypeScript props
const ProjectCard: React.FC<ProjectCardProps> = ({
  index,
  cardTitle,
  cardDescription,
  tag,
  imageUrl,
  _id,
}) => {
  const parsedTags: TagItem[] = tag
    ? tag
        .split(",")
        .map((t, tagIndex) => ({
          name: t.trim(),
          color: getTagColor(t.trim(), tagIndex),
        }))
        .filter((tagItem) => tagItem.name)
    : [];

  return (
    <motion.div
      variants={fadeIn("up", "spring", index * 0.2, 0.5)}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
      className="w-full xs:w-[100%] sm:w-[100%] md:w-[80%] lg:w-[45%] xl:w-[30%] p-4"
    >
      <Tilt
        options={{ max: 45, scale: 1, speed: 450 }}
        className="bg-tertiary p-5 rounded-2xl"
      >
        <div className="relative w-full h-[230px]">
          <img
            src={imageUrl || "/placeholder-image.jpg"}
            alt={cardTitle}
            className="w-full h-full object-cover rounded-2xl"
            onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
              e.currentTarget.src = "/placeholder-image.jpg";
            }}
          />
          {/* ... rest of the component remains the same ... */}
        </div>
      </Tilt>
    </motion.div>
  );
};

// LoadingCard props type
interface LoadingCardProps {
  index: number;
}

// LoadingCard with TypeScript props
const LoadingCard: React.FC<LoadingCardProps> = ({ index }) => (

);

// Project and ProjectDetail types based on Convex schema
interface Project {
  _id: string;
  cardTitle: string;
  cardDescription: string;
  tag: string;
  imageUrl: string;
}

interface ProjectDetail {
  header?: string;
  title?: string;
  description?: string;
}

// Works component with TypeScript
const Works: React.FC = () => {
  const projects = useQuery(api.projects.getProjects) as Project[] | undefined;
  const projectsDetails = useQuery(api.projectdetails.getProjectDetails) as ProjectDetail[] | undefined;

  const details = projectsDetails?.[0];

  return (
    {/* ... component implementation remains the same ... */}
  );
};

export default SectionWrapper(Works, "");