// File: components/Tech.tsx
import { BallCanvas } from "./canvas";
import { SectionWrapper } from "../hoc";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

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
      <div className="flex flex-col items-center justify-center gap-2 text-gray-400 py-8">
        <span className="text-6xl animate-bounce">🛠️</span>
        <p className="text-lg font-semibold">
          ¡Ups! No se encontraron tecnologías.
        </p>
        <p className="text-sm text-gray-500">
          Agrega tecnologías para mostrarlas en tu portafolio.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-row flex-wrap justify-center gap-10">
      {technologies.map((technology) => (
        <div className="w-28 h-28" key={technology._id}>
          <BallCanvas icon={technology.icon} />
        </div>
      ))}
    </div>
  );
};

const WrappedTech = SectionWrapper(Tech, "");
export default WrappedTech;
