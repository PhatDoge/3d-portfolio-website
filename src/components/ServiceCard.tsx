import React from "react";
import { motion } from "framer-motion";
import { fadeIn } from "../utils/motion";
import PropTypes from "prop-types";

interface ServiceCardProps {
  index: number;
  title: string;
  iconUrl: string; // Changed from icon to iconUrl
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
  iconUrl, // Changed from icon to iconUrl
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
  // Convert keyFeatures string to array
  const featuresArray = keyFeatures
    .split(" • ")
    .filter((feature) => feature.trim());

  // Convert technologies string to array
  const techArray = technologies
    .split(",")
    .map((tech) => tech.trim())
    .filter((tech) => tech);

  // Get experience level color
  const getExperienceColor = (level: string) => {
    switch (level) {
      case "Beginner":
        return "text-yellow-400 bg-yellow-400/10";
      case "Intermediate":
        return "text-blue-400 bg-blue-400/10";
      case "Expert":
        return "text-green-400 bg-green-400/10";
      default:
        return "text-gray-400 bg-gray-400/10";
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

  return (
    <motion.div
      variants={fadeIn("up", "spring", 0.1 * index, 0.75)}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.25 }}
      className="w-full max-w-sm mx-auto"
    >
      <div
        className="relative bg-[#1a1a2e] rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] group"
        style={{
          border: `1px solid ${accentColor}40`,
        }}
      >
        {/* Gradient Background Effect */}
        <div
          className="absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity duration-500"
          style={{
            background: `linear-gradient(135deg, ${accentColor}20, #bf61ff20)`,
          }}
        />

        {/* Badge */}
        {badgeText && (
          <div className="absolute top-4 right-4 z-10">
            <span
              className="px-3 py-1 text-xs font-semibold text-white rounded-full shadow-lg"
              style={{ backgroundColor: accentColor }}
            >
              {badgeText}
            </span>
          </div>
        )}

        <div className="relative p-8">
          {/* Header Section */}
          <div className="text-center mb-6">
            <div className="w-20 h-20 mx-auto mb-4 p-3 rounded-2xl bg-white/5 backdrop-blur-sm">
              {/* Use regular img instead of ConvexImage */}
              <img
                src={iconUrl || "/default-service-icon.png"}
                alt={title}
                className="w-full h-full object-contain"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "/default-service-icon.png";
                }}
              />
            </div>

            <h3 className="text-white text-xl font-bold mb-2 leading-tight">
              {title}
            </h3>

            {subtitle && <p className="text-gray-400 text-sm">{subtitle}</p>}
          </div>

          {/* Stats Row */}
          <div className="flex justify-between items-center mb-6 p-4 bg-white/5 rounded-xl backdrop-blur-sm">
            <div className="text-center flex-1">
              <div
                className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${getExperienceColor(experienceLevel)}`}
              >
                {experienceLevel}
              </div>
              <p className="text-gray-400 text-xs mt-1">Nivel</p>
            </div>

            <div className="text-center flex-1">
              <p className="text-white text-lg font-bold">{projectCount}+</p>
              <p className="text-gray-400 text-xs">Proyectos</p>
            </div>

            {startingPrice && (
              <div className="text-center flex-1">
                <p
                  className="text-white text-lg font-bold"
                  style={{ color: accentColor }}
                >
                  {formatPrice()}
                </p>
                <p className="text-gray-400 text-xs">Desde</p>
              </div>
            )}
          </div>

          {/* Description */}
          <div className="mb-6">
            <p className="text-gray-300 text-sm leading-relaxed text-center">
              {description}
            </p>
          </div>

          {/* Key Features */}
          <div className="mb-6">
            <h4 className="text-white text-sm font-semibold mb-3 flex items-center">
              <span
                className="w-2 h-2 rounded-full mr-2"
                style={{ backgroundColor: accentColor }}
              />
              Características Clave
            </h4>
            <div className="space-y-2">
              {featuresArray.slice(0, 4).map((feature, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <span
                    className="text-sm mt-0.5 flex-shrink-0"
                    style={{ color: accentColor }}
                  >
                    ✓
                  </span>
                  <span className="text-gray-300 text-sm leading-relaxed">
                    {feature}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Technologies */}
          <div className="mb-8">
            <h4 className="text-white text-sm font-semibold mb-3 flex items-center">
              <span
                className="w-2 h-2 rounded-full mr-2"
                style={{ backgroundColor: accentColor }}
              />
              Tecnologías
            </h4>
            <div className="flex flex-wrap gap-2">
              {techArray.map((tech, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 text-xs rounded-full text-white bg-white/10 backdrop-blur-sm border border-white/20"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Delivery Time */}
          {deliveryTime && (
            <div className="mb-6 p-3 bg-white/5 rounded-lg">
              <div className="flex items-center justify-center gap-2">
                <span className="text-xs text-gray-400">
                  Tiempo de entrega:
                </span>
                <span className="text-sm text-white font-medium">
                  {deliveryTime}
                </span>
              </div>
            </div>
          )}

          {/* CTA Button */}
          <a
            href={ctaLink}
            className="block w-full py-4 px-6 text-center text-white font-semibold rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg transform"
            style={{
              background: `linear-gradient(135deg, ${accentColor}, #bf61ff)`,
            }}
          >
            {ctaText}
          </a>
        </div>

        {/* Hover Glow Effect */}
        <div
          className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-500 pointer-events-none"
          style={{
            boxShadow: `0 0 40px ${accentColor}40`,
          }}
        />
      </div>
    </motion.div>
  );
};

ServiceCard.propTypes = {
  index: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  iconUrl: PropTypes.string.isRequired, // Changed from icon to iconUrl
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
