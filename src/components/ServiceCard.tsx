import React, { useState } from "react";
import { motion } from "framer-motion";
import { fadeIn } from "../utils/motion";
import PropTypes from "prop-types";

interface ServiceCardProps {
  index: number;
  title: string;
  iconUrl: string;
  subtitle?: string;
  badgeText?: string;
  accentColor?: string;
  description: string;
  keyFeatures: string;
  technologies: string;
  experienceLevel: string;
  projectCount: number;
  ctaText: string;
  ctaLink: string;
  startingPrice?: number;
  currency?: string;
  priceType?: string;
  deliveryTime?: string;
}

const ServiceCard: React.FC<ServiceCardProps> = ({
  index,
  title,
  iconUrl,
  subtitle,
  badgeText,
  accentColor = "#00cea8",
  description,
  keyFeatures,
  technologies,
  experienceLevel,
  projectCount,
  ctaText,
  ctaLink,
  startingPrice,
  currency = "$",
  priceType,
  deliveryTime,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  // Convert keyFeatures string to array
  const featuresArray = keyFeatures
    .split(" • ")
    .filter((feature) => feature.trim());

  // Convert technologies string to array
  const techArray = technologies
    .split(",")
    .map((tech) => tech.trim())
    .filter((tech) => tech);

  // Get experience level styling
  const getExperienceStyle = (level: string) => {
    switch (level.toLowerCase()) {
      case "beginner":
        return {
          bg: "bg-gradient-to-r from-amber-500/10 to-yellow-500/10",
          text: "text-amber-400",
          border: "border-amber-500/30",
          icon: "🌱",
        };
      case "intermediate":
        return {
          bg: "bg-gradient-to-r from-blue-500/10 to-cyan-500/10",
          text: "text-blue-400",
          border: "border-blue-500/30",
          icon: "⚡",
        };
      case "expert":
        return {
          bg: "bg-gradient-to-r from-emerald-500/10 to-green-500/10",
          text: "text-emerald-400",
          border: "border-emerald-500/30",
          icon: "🏆",
        };
      default:
        return {
          bg: "bg-gradient-to-r from-gray-500/10 to-slate-500/10",
          text: "text-gray-400",
          border: "border-gray-500/30",
          icon: "📊",
        };
    }
  };

  // Format price display
  const formatPrice = () => {
    if (!startingPrice) return null;
    const typeText =
      priceType === "hour" ? "/hr"
      : priceType === "project" ? "/proyecto"
      : "";
    return `${currency}${startingPrice}${typeText}`;
  };

  const experienceStyle = getExperienceStyle(experienceLevel);

  return (
    <motion.div
      variants={fadeIn("up", "spring", 0.1 * index, 0.75)}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.25 }}
      className="w-full max-w-xs mx-auto" // Made smaller: max-w-xs instead of max-w-sm
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <div
        className="relative bg-slate-800/40 backdrop-blur-sm rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-500 hover:scale-[1.02] group border border-white/10" // Simplified background, smaller scale, smaller rounded corners
        style={{
          boxShadow:
            isHovered ?
              `0 15px 35px -10px ${accentColor}20, 0 0 0 1px ${accentColor}20` // Reduced shadow intensity
            : "0 10px 20px -5px rgba(0, 0, 0, 0.1)",
        }}
      >
        {/* Premium Badge - Fixed position to top-left */}
        {badgeText && (
          <div className="absolute top-4 left-4 z-20">
            {" "}
            {/* Changed from top-6 right-6 to top-4 left-4 */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="relative"
            >
              <div
                className="px-3 py-1.5 text-xs font-bold text-white rounded-full shadow-lg backdrop-blur-sm" // Reduced padding
                style={{
                  background: `linear-gradient(135deg, ${accentColor}, #bf61ff)`,
                  boxShadow: `0 4px 16px ${accentColor}30`, // Reduced shadow
                }}
              >
                {badgeText}
              </div>
            </motion.div>
          </div>
        )}

        <div className="relative p-6">
          {" "}
          {/* Reduced padding from p-8 to p-6 */}
          {/* Enhanced Header Section */}
          <div className="text-center mb-6">
            {" "}
            {/* Reduced margin */}
            <motion.div
              className="relative w-16 h-16 mx-auto mb-4" // Reduced size from w-24 h-24 to w-16 h-16
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <div
                className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/20" // Smaller rounded corners
                style={{ boxShadow: `0 4px 16px ${accentColor}15` }} // Reduced shadow
              />
              <div className="relative w-full h-full p-3 rounded-xl">
                {" "}
                {/* Reduced padding */}
                <img
                  src={iconUrl || "/default-service-icon.png"}
                  alt={title}
                  className="w-full h-full object-contain filter drop-shadow-lg"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "/default-service-icon.png";
                  }}
                />
              </div>
            </motion.div>
            <h3 className="text-white text-xl font-bold mb-2 leading-tight tracking-tight">
              {" "}
              {/* Reduced font size */}
              {title}
            </h3>
            {subtitle && (
              <p className="text-gray-300 text-sm font-medium opacity-80">
                {subtitle}
              </p>
            )}
          </div>
          {/* Enhanced Stats Section */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            {" "}
            {/* Reduced gap and margin */}
            {/* Experience Level */}
            <div
              className={`${experienceStyle.bg} ${experienceStyle.border} border rounded-lg p-3 text-center backdrop-blur-sm`} // Reduced padding and rounded corners
            >
              <div className="text-sm mb-1">{experienceStyle.icon}</div>{" "}
              {/* Reduced icon size */}
              <div className={`text-xs font-bold ${experienceStyle.text} mb-1`}>
                {experienceLevel}
              </div>
              <div className="text-gray-400 text-xs">Nivel</div>
            </div>
            {/* Project Count */}
            <div className="bg-gradient-to-br from-white/5 to-white/10 border border-white/20 rounded-lg p-3 text-center backdrop-blur-sm">
              <div className="text-sm mb-1">🚀</div>
              <div className="text-white text-sm font-bold mb-1">
                {projectCount}+
              </div>
              <div className="text-gray-400 text-xs">Proyectos</div>
            </div>
            {/* Price */}
            {startingPrice && (
              <div className="bg-gradient-to-br from-white/5 to-white/10 border border-white/20 rounded-lg p-3 text-center backdrop-blur-sm">
                <div className="text-sm mb-1">💰</div>
                <div
                  className="text-sm font-bold mb-1"
                  style={{ color: accentColor }}
                >
                  {formatPrice()}
                </div>
                <div className="text-gray-400 text-xs">Desde</div>
              </div>
            )}
          </div>
          {/* Enhanced Description */}
          <div className="mb-6">
            {" "}
            {/* Reduced margin */}
            <p className="text-gray-200 text-sm leading-relaxed text-center font-medium">
              {description}
            </p>
          </div>
          {/* Enhanced Key Features with Icons */}
          <div className="mb-6">
            {" "}
            {/* Reduced margin */}
            <div className="flex items-center mb-3">
              {" "}
              {/* Reduced margin */}
              <div
                className="w-2 h-2 rounded-full mr-2" // Reduced margin
                style={{ backgroundColor: accentColor }}
              />
              <h4 className="text-white text-sm font-bold tracking-wide">
                CARACTERÍSTICAS CLAVE
              </h4>
            </div>
            <div className="space-y-2">
              {" "}
              {/* Reduced spacing */}
              {featuresArray.slice(0, 3).map(
                (
                  feature,
                  idx // Show only 3 features instead of 4
                ) => (
                  <motion.div
                    key={idx}
                    className="flex items-start gap-2 group/feature" // Reduced gap
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * idx }}
                  >
                    <div
                      className="w-4 h-4 rounded-full flex items-center justify-center text-xs font-bold text-white mt-0.5 flex-shrink-0 shadow-lg" // Reduced size
                      style={{ backgroundColor: accentColor }}
                    >
                      ✓
                    </div>
                    <span className="text-gray-200 text-sm leading-relaxed group-hover/feature:text-white transition-colors duration-200">
                      {feature}
                    </span>
                  </motion.div>
                )
              )}
            </div>
          </div>
          {/* Enhanced Technologies with Better Styling */}
          <div className="mb-6">
            {" "}
            {/* Reduced margin */}
            <div className="flex items-center mb-3">
              <div
                className="w-2 h-2 rounded-full mr-2"
                style={{ backgroundColor: accentColor }}
              />
              <h4 className="text-white text-sm font-bold tracking-wide">
                TECNOLOGÍAS
              </h4>
            </div>
            <div className="flex flex-wrap gap-2">
              {techArray.slice(0, 6).map(
                (
                  tech,
                  idx // Limit to 6 technologies
                ) => (
                  <motion.span
                    key={idx}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.05 * idx }}
                    className="px-2 py-1 text-xs font-semibold rounded-md text-white bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-sm border border-white/20 hover:border-white/40 transition-all duration-300 hover:scale-105 cursor-default" // Reduced padding and rounded corners
                  >
                    {tech}
                  </motion.span>
                )
              )}
            </div>
          </div>
          {/* Enhanced Delivery Time */}
          {deliveryTime && (
            <div className="mb-6">
              {" "}
              {/* Reduced margin */}
              <div className="bg-gradient-to-r from-white/5 to-white/10 rounded-lg p-3 border border-white/20 backdrop-blur-sm">
                {" "}
                {/* Reduced padding and rounded corners */}
                <div className="flex items-center justify-center gap-2">
                  {" "}
                  {/* Reduced gap */}
                  <div className="text-sm">⏱️</div>
                  <span className="text-xs text-gray-300 font-medium">
                    Tiempo de entrega:
                  </span>
                  <span className="text-sm text-white font-bold">
                    {deliveryTime}
                  </span>
                </div>
              </div>
            </div>
          )}
          {/* Enhanced CTA Button */}
          <motion.a
            href={ctaLink}
            className="relative block w-full py-3 px-4 text-center text-white font-bold rounded-xl transition-all duration-500 overflow-hidden group/cta" // Reduced padding and rounded corners
            style={{
              background: `linear-gradient(135deg, ${accentColor}, #bf61ff)`,
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {/* Button Background Effects */}
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover/cta:translate-x-[100%] transition-transform duration-1000" />
            <span className="relative z-10 tracking-wide text-sm">
              {ctaText}
            </span>{" "}
            {/* Reduced font size */}
          </motion.a>
        </div>
      </div>
    </motion.div>
  );
};

ServiceCard.propTypes = {
  index: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  iconUrl: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  badgeText: PropTypes.string,
  accentColor: PropTypes.string,
  description: PropTypes.string.isRequired,
  keyFeatures: PropTypes.string.isRequired,
  technologies: PropTypes.string.isRequired,
  experienceLevel: PropTypes.string.isRequired,
  projectCount: PropTypes.number.isRequired,
  ctaText: PropTypes.string.isRequired,
  ctaLink: PropTypes.string.isRequired,
  startingPrice: PropTypes.number,
  currency: PropTypes.string,
  priceType: PropTypes.string,
  deliveryTime: PropTypes.string,
};

export default ServiceCard;
