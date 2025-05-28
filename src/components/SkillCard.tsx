import { motion } from "framer-motion";
import PropTypes from "prop-types";
import { Tilt } from "react-tilt";
import { fadeIn } from "../utils/motion";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api"; // Adjust path as needed

// Helper component to handle image display
const SkillIcon = ({ iconUrl, iconFile, title }) => {
  const fileUrl = useQuery(
    api.skills.getImageUrl,
    iconFile ? { storageId: iconFile } : "skip"
  );

  const imageSrc = iconFile ? fileUrl : iconUrl;

  if (!imageSrc) {
    // Fallback icon if neither URL nor file is available
    return (
      <div className="w-16 h-16 bg-gray-600 rounded-lg flex items-center justify-center">
        <span className="text-white text-2xl">📦</span>
      </div>
    );
  }

  return (
    <img
      src={imageSrc}
      alt={title}
      className="w-16 h-16 object-contain rounded-lg"
    />
  );
};

const SKillCard = ({ index, title, iconUrl, iconFile, description, link }) => {
  return (
    <Tilt className="xs:w-[250px] w-full mx-auto my-4">
      <motion.div
        variants={fadeIn("right", "spring", 0.5 * index, 0.75)}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.25 }}
        className="w-full green-pink-gradient p-[1px] rounded-[20px] shadow-card"
      >
        <div className="card-container relative w-full min-h-[280px] perspective-1000">
          <div className="card-inner relative w-full h-full transition-all duration-700 transform-style-preserve-3d hover:rotate-y-180 hover:scale-95">
            {/* 
              CUSTOMIZATION AREA - Card Dimensions & Appearance:
              - Change 'min-h-[280px]' to adjust card height
              - Modify 'rounded-[20px]' for different border radius
              - Adjust 'hover:scale-95' value (0.9 = smaller, 1.05 = bigger)
              - Change 'duration-700' for faster/slower animations
              - Modify padding values 'py-5 px-12' and 'py-4 px-6' for spacing
            */}

            {/* Front side */}
            <div className="card-face card-front absolute inset-0 bg-tertiary rounded-[20px] py-5 px-12 min-h-[280px] flex justify-evenly items-center flex-col backface-hidden">
              <SkillIcon iconUrl={iconUrl} iconFile={iconFile} title={title} />
              <h3 className="text-white text-[20px] font-bold text-center">
                {title}
              </h3>
            </div>

            {/* Back side */}
            <div className="card-face card-back absolute inset-0 bg-tertiary rounded-[20px] py-4 px-6 min-h-[280px] flex justify-center items-center flex-col backface-hidden rotate-y-180 overflow-hidden">
              <div className="text-center w-full h-full flex flex-col justify-center items-center max-w-full">
                <h4 className="text-white text-[16px] font-semibold mb-4 truncate w-full">
                  {title}
                </h4>
                <p className="text-secondary text-[12px] leading-5 mb-4 text-center overflow-hidden line-clamp-4 px-2">
                  {description}
                </p>
                <div className="flex justify-center mt-4">
                  <a
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative group w-14 h-14 bg-gradient-to-r from-purple-400 via-pink-400 to-purple-500 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 border-2 border-white/20 flex items-center justify-center"
                  >
                    <span className="text-white text-xl font-bold">+</span>
                    {/* Cute sparkle effect */}
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-300 rounded-full opacity-75 animate-ping"></div>
                    <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-blue-300 rounded-full opacity-60 animate-pulse"></div>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </Tilt>
  );
};

SKillCard.propTypes = {
  title: PropTypes.string.isRequired,
  iconUrl: PropTypes.string, // Make optional since we might have iconFile instead
  iconFile: PropTypes.string, // Add iconFile prop
  index: PropTypes.number.isRequired,
  description: PropTypes.string.isRequired,
  link: PropTypes.string.isRequired,
};

export default SKillCard;
