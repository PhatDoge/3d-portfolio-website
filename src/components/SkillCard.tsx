import { motion } from "framer-motion";
import PropTypes from "prop-types";
import { Tilt } from "react-tilt";
import { fadeIn } from "../utils/motion";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

// Helper component to handle image display
const SkillIcon = ({ iconUrl, iconFile, title }) => {
  const fileUrl = useQuery(
    api.skills.getImageUrl,
    iconFile ? { storageId: iconFile } : "skip"
  );

  const imageSrc = iconFile ? fileUrl : iconUrl;

  if (!imageSrc) {
    // Enhanced fallback icon with gradient
    return (
      <div className="about-skill-icon-fallback w-20 h-20 bg-gradient-to-br from-purple-500 via-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg animate-pulse">
        <span className="text-white text-3xl drop-shadow-lg">📦</span>
      </div>
    );
  }

  return (
    <div className="about-skill-icon-wrapper relative group">
      <div className="about-skill-icon-glow absolute inset-0 bg-gradient-to-br from-purple-400 via-pink-400 to-cyan-400 rounded-2xl blur opacity-75 group-hover:opacity-100 transition-opacity duration-300"></div>
      <img
        src={imageSrc}
        alt={title}
        className="about-skill-icon relative w-20 h-20 object-contain rounded-2xl shadow-xl border-2 border-white/20 backdrop-blur-sm bg-white/10"
      />
    </div>
  );
};

const SkillCard = ({ index, title, iconUrl, iconFile, description, link }) => {
  return (
    <motion.div
      variants={fadeIn("up", "spring", index * 0.1, 0.75)}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
      className="w-full max-w-[270px] h-[220px] mx-auto my-5" // Shrink card size
    >
      <Tilt
        className="about-skill-card-tilt w-full"
        options={{
          max: 20,
          scale: 1.01,
          speed: 400,
        }}
      >
        <div className="about-skill-card-wrapper relative w-full group">
          <div className="about-skill-card-main relative w-full bg-gradient-to-br from-gray-900 via-purple-900/50 to-gray-900 p-[2px] rounded-[20px] shadow-2xl backdrop-blur-sm">
            <div className="relative w-full min-h-[220px] rounded-[18px] overflow-hidden flex flex-col items-center justify-center px-4 py-6">
              {/* Front side only, no flip */}
              <div className="flex flex-col items-center w-full">
                <div className="about-icon-container mb-4">
                  <SkillIcon
                    iconUrl={iconUrl}
                    iconFile={iconFile}
                    title={title}
                  />
                </div>
                <h3 className="about-skill-title text-white text-lg font-bold text-center mb-2 bg-gradient-to-r from-white via-cyan-100 to-purple-100 bg-clip-text text-transparent">
                  {title}
                </h3>
                <div className="about-description-container bg-black/20 backdrop-blur-sm rounded-xl p-3 mt-2 border border-white/10 w-full">
                  <p className="about-description-text text-gray-200 text-xs leading-relaxed text-center about-line-clamp-4">
                    {description}
                  </p>
                </div>
                <div className="about-cta-container flex justify-center mt-4">
                  <motion.a
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="about-cta-link group/btn relative"
                    whileHover={{
                      scale: 1.05,
                      rotateY: 5,
                      rotateX: 5,
                    }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    {/* Outer rotating glow ring */}
                    <div className="absolute -inset-2 rounded-full opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500">
                      <div
                        className="w-14 h-14 rounded-full bg-gradient-to-r from-purple-500 via-violet-500 to-indigo-500 blur-sm animate-spin"
                        style={{ animationDuration: "3s" }}
                      ></div>
                    </div>

                    {/* Circular progress loader */}
                    <div className="absolute -inset-1 rounded-full opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300">
                      <svg className="w-12 h-12 -rotate-90" viewBox="0 0 48 48">
                        <circle
                          cx="24"
                          cy="24"
                          r="20"
                          fill="none"
                          stroke="rgba(147, 51, 234, 0.3)"
                          strokeWidth="2"
                        />
                        <circle
                          cx="24"
                          cy="24"
                          r="20"
                          fill="none"
                          stroke="url(#purpleGradient)"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeDasharray="125.6"
                          strokeDashoffset="125.6"
                          className="group-hover/btn:animate-[drawCircle_2s_ease-in-out_infinite]"
                        />
                        <defs>
                          <linearGradient
                            id="purpleGradient"
                            x1="0%"
                            y1="0%"
                            x2="100%"
                            y2="100%"
                          >
                            <stop offset="0%" stopColor="#a855f7" />
                            <stop offset="50%" stopColor="#8b5cf6" />
                            <stop offset="100%" stopColor="#7c3aed" />
                          </linearGradient>
                        </defs>
                      </svg>
                    </div>

                    {/* Floating particles */}
                    <div className="absolute inset-0 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500">
                      <div
                        className="absolute -top-1 -left-1 w-1 h-1 bg-purple-400 rounded-full animate-bounce"
                        style={{
                          animationDelay: "0s",
                          animationDuration: "1.5s",
                        }}
                      ></div>
                      <div
                        className="absolute -top-2 right-0 w-1 h-1 bg-violet-400 rounded-full animate-bounce"
                        style={{
                          animationDelay: "0.3s",
                          animationDuration: "1.8s",
                        }}
                      ></div>
                      <div
                        className="absolute -bottom-1 -right-1 w-1 h-1 bg-indigo-400 rounded-full animate-bounce"
                        style={{
                          animationDelay: "0.6s",
                          animationDuration: "1.2s",
                        }}
                      ></div>
                      <div
                        className="absolute -bottom-2 left-1 w-1 h-1 bg-purple-300 rounded-full animate-bounce"
                        style={{
                          animationDelay: "0.9s",
                          animationDuration: "1.6s",
                        }}
                      ></div>
                    </div>

                    {/* Main button */}
                    <div className="about-cta-button relative w-10 h-10 bg-gradient-to-br from-purple-600 via-violet-600 to-indigo-700 rounded-full shadow-2xl transition-all duration-500 border-2 border-purple-400/40 flex items-center justify-center backdrop-blur-sm overflow-hidden group-hover/btn:shadow-purple-500/50">
                      {/* Inner glow pulse */}
                      <div className="absolute inset-0 bg-gradient-to-br from-purple-400/30 via-transparent to-indigo-400/30 rounded-full opacity-0 group-hover/btn:opacity-100 group-hover/btn:animate-pulse transition-opacity duration-300"></div>

                      {/* Magical sparkle effect */}
                      <div className="absolute inset-0 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300">
                        <div
                          className="absolute top-2 left-2 w-0.5 h-0.5 bg-white rounded-full animate-ping"
                          style={{ animationDelay: "0.2s" }}
                        ></div>
                        <div
                          className="absolute top-3 right-3 w-0.5 h-0.5 bg-purple-200 rounded-full animate-ping"
                          style={{ animationDelay: "0.8s" }}
                        ></div>
                        <div
                          className="absolute bottom-2 left-3 w-0.5 h-0.5 bg-violet-200 rounded-full animate-ping"
                          style={{ animationDelay: "1.4s" }}
                        ></div>
                      </div>

                      {/* Icon with breathing animation */}
                      <motion.svg
                        className="about-cta-icon w-5 h-5 text-white relative z-10"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        strokeWidth={2.5}
                        animate={{
                          scale: [1, 1.1, 1],
                          rotate: [0, 2, -2, 0],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                        />
                      </motion.svg>
                    </div>

                    {/* Enhanced tooltip with purple theme */}
                    {/* <div className="absolute -top-14 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-purple-900/95 to-indigo-900/95 text-white text-xs px-4 py-2 rounded-xl opacity-0 group-hover/btn:opacity-100 transition-all duration-300 pointer-events-none backdrop-blur-sm border border-purple-400/30 whitespace-nowrap shadow-xl">
                      <span className="relative z-10">Explore Project</span>
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-indigo-600/20 rounded-xl"></div>
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-purple-900/95"></div>
                    </div> */}
                  </motion.a>
                </div>

                {/* Custom keyframe animation styles */}
                <style jsx>{`
                  @keyframes drawCircle {
                    0% {
                      stroke-dashoffset: 125.6;
                    }
                    50% {
                      stroke-dashoffset: 31.4;
                    }
                    100% {
                      stroke-dashoffset: 125.6;
                    }
                  }
                `}</style>
              </div>
            </div>
          </div>
        </div>
      </Tilt>
    </motion.div>
  );
};

SkillCard.propTypes = {
  title: PropTypes.string.isRequired,
  iconUrl: PropTypes.string,
  iconFile: PropTypes.string,
  index: PropTypes.number.isRequired,
  description: PropTypes.string.isRequired,
  link: PropTypes.string.isRequired,
};

export default SkillCard;
