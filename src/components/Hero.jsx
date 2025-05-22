import { motion } from "framer-motion";
import { styles } from "../styles";
import { ComputersCanvas } from "./canvas";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

const Hero = () => {
  // Fetch header data from Convex
  const headers = useQuery(api.header.getHeader);

  // Handle loading state
  if (!headers) {
    return (
      <div className="h-screen flex items-center justify-center text-white">
        Loading...
      </div>
    );
  }

  // Get the first header from the list
  const header = headers[0] || {
    name: "Developer",
    description: "Creando experiencias webs y diseños únicos.",
  };

  return (
    <section className="relative w-full h-screen mx-auto">
      <div
        className={`absolute inset-0 top-[120px] max-w-7xl mx-auto ${styles.paddingX} flex flex-row items-start gap-5`}
      >
        <div className="flex flex-col justify-center items-center mt-5">
          <div className="w-5 h-5 rounded-full bg-[#915EFF]" />
          <div className="w-1 sm:h-80 h-40 violet-gradient" />
        </div>

        <div>
          <h1 className={`${styles.heroHeadText} text-white`}>
            Hola, soy <span className="text-[#915EFF]">{header.name}</span>
          </h1>
          <p className={`${styles.heroSubText} mt-2 text-white-100`}>
            {header.description.split(" y ").map((part, index, array) => (
              <span key={index}>
                {part}
                {index < array.length - 1 && (
                  <>
                    <br className="sm:block hidden" /> y{" "}
                  </>
                )}
              </span>
            ))}
          </p>
        </div>
      </div>

      <ComputersCanvas />

      <div className="absolute xs:bottom-10 bottom-32 w-full flex justify-center items-center">
        <a href="#about">
          <div className="w-[35px] h-[64px] rounded-3xl border-4 border-secondary flex justify-center items-center">
            <motion.div
              className="w-3 h-3 rounded-full bg-secondary"
              animate={{ y: [0, 16, 0] }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: [0.4, 0, 0.6, 1],
              }}
            />
          </div>
        </a>
      </div>
    </section>
  );
};

export default Hero;
