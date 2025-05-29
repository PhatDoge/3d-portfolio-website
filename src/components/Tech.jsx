// File: components/Tech.tsx
import { BallCanvas } from "./canvas";
import { SectionWrapper } from "../hoc";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import html from "../assets/tech/html.png";
import css from "../assets/tech/css.png";
import javascript from "../assets/tech/javascript.png";
import typescript from "../assets/tech/typescript.png";
import reactjs from "../assets/tech/reactjs.png";
import redux from "../assets/tech/redux.png";
import tailwind from "../assets/tech/tailwind.png";
import nodejs from "../assets/tech/nodejs.png";
import mongodb from "../assets/tech/mongodb.png";
import threejs from "../assets/tech/threejs.svg";
import git from "../assets/tech/git.png";
import figma from "../assets/tech/figma.png";
import docker from "../assets/tech/docker.png";

const Tech = () => {
  // Get visible technologies from the database
  const technologies = useQuery(api.technologies.getVisibleTechnologies);

  // Show loading state while data is being fetched
  if (technologies === undefined) {
    return (
      <div className="flex flex-row flex-wrap justify-center gap-10">
        {/* Loading skeleton */}
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="w-28 h-28 bg-gray-800 rounded-full animate-pulse"
          />
        ))}
      </div>
    );
  }

  // Handle empty state
  if (technologies.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 text-gray-400">
        <p>No technologies configured yet.</p>
      </div>
    );
  }

  const iconMap = {
    "HTML 5": html,
    "CSS 3": css,
    JavaScript: javascript,
    TypeScript: typescript,
    "React JS": reactjs,
    "Redux Toolkit": redux,
    "Tailwind CSS": tailwind,
    "Node JS": nodejs,
    MongoDB: mongodb,
    "Three JS": threejs,
    git: git,
    figma: figma,
    docker: docker,
  };

  return (
    <div className="flex flex-row flex-wrap justify-center gap-10">
      {technologies.map((technology) => {
        let iconSrc = iconMap[technology.name];
        if (!iconSrc && typeof technology.icon === "string") {
          // Fix DB path if it starts with /icons/
          if (technology.icon.startsWith("/icons/")) {
            iconSrc = technology.icon.replace("/icons/", "/assets/tech/");
          } else {
            iconSrc = technology.icon;
          }
        }
        return (
          <div className="w-28 h-28" key={technology._id}>
            <BallCanvas icon={iconSrc} />
          </div>
        );
      })}
    </div>
  );
};

export default SectionWrapper(Tech, "");
