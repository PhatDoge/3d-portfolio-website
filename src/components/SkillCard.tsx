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
                  <a
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="about-cta-link group/btn relative overflow-hidden"
                    style={{ maxWidth: "2rem" }} // Ensures the button doesn't overflow
                  >
                    <div className="about-cta-button relative w-8 h-8 bg-gradient-to-r from-cyan-500 via-purple-600 to-pink-500 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 border-2 border-white/30 flex items-center justify-center backdrop-blur-sm">
                      <svg
                        className="about-cta-icon size-5 text-white transform group-hover/btn:scale-100 transition-transform duration-200"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                        />
                      </svg>
                    </div>
                  </a>
                </div>
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
