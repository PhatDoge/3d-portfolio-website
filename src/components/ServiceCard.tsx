import { motion } from "framer-motion";
import PropTypes from "prop-types";
import React, { useState } from "react";

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

  // Get gradient background based on index for variety
  const getCardGradient = (cardIndex: number) => {
    const gradients = [
      "linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(168, 85, 247, 0.05) 50%, rgba(59, 130, 246, 0.1) 100%)",
      "linear-gradient(135deg, rgba(236, 72, 153, 0.1) 0%, rgba(244, 63, 94, 0.05) 50%, rgba(249, 115, 22, 0.1) 100%)",
      "linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(5, 150, 105, 0.05) 50%, rgba(6, 182, 212, 0.1) 100%)",
      "linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(217, 119, 6, 0.05) 50%, rgba(251, 191, 36, 0.1) 100%)",
      "linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(124, 58, 237, 0.05) 50%, rgba(147, 51, 234, 0.1) 100%)",
      "linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(220, 38, 38, 0.05) 50%, rgba(248, 113, 113, 0.1) 100%)",
    ];
    return gradients[cardIndex % gradients.length];
  };

  // Get experience level styling
  const getExperienceStyle = (level: string) => {
    switch (level.toLowerCase()) {
      case "beginner":
        return {
          bg: "bg-gradient-to-br from-amber-500/15 to-yellow-500/10",
          text: "text-amber-400",
          border: "border-amber-500/30",
          icon: "🌱",
        };
      case "intermediate":
        return {
          bg: "bg-gradient-to-br from-blue-500/15 to-cyan-500/10",
          text: "text-blue-400",
          border: "border-blue-500/30",
          icon: "⚡",
        };
      case "expert":
        return {
          bg: "bg-gradient-to-br from-emerald-500/15 to-green-500/10",
          text: "text-emerald-400",
          border: "border-emerald-500/30",
          icon: "🏆",
        };
      default:
        return {
          bg: "bg-gradient-to-br from-gray-500/15 to-slate-500/10",
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
  const cardGradient = getCardGradient(index);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 * index }}
      className="w-full h-full" // Changed: removed max-width and made it fully responsive
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <div
        className="relative backdrop-blur-sm rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-500 hover:scale-[1.02] group border border-white/20 h-full flex flex-col min-h-[340px]" // min-h changed from 400px to 340px (card height)
        style={{
          background: `${cardGradient}, rgba(30, 41, 59, 0.4)`,
          boxShadow:
            isHovered ?
              `0 15px 35px -10px ${accentColor}20, 0 0 0 1px ${accentColor}20`
            : "0 10px 20px -5px rgba(0, 0, 0, 0.1)",
        }}
      >
        {/* Animated background overlay */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background: `radial-gradient(circle at 50% 50%, ${accentColor}08 0%, transparent 70%)`,
          }}
        />

        {/* Premium Badge */}
        {badgeText && (
          <div className="absolute top-4 left-4 z-20">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="relative"
            >
              <div
                className="px-3 py-1.5 text-xs font-bold text-white rounded-full shadow-lg backdrop-blur-sm border border-white/20"
                style={{
                  background: `linear-gradient(135deg, ${accentColor}, #bf61ff)`,
                  boxShadow: `0 4px 16px ${accentColor}30`,
                }}
              >
                {badgeText}
              </div>
            </motion.div>
          </div>
        )}

        <div className="relative p-3 sm:p-4 z-10 flex-1 flex flex-col">
          {" "}
          {/* p-4 sm:p-6 -> p-3 sm:p-4 (card padding) */}{" "}
          {/* Enhanced Header Section */}
          <div className="text-center mb-3 sm:mb-4">
            {" "}
            {/* mb-4 sm:mb-6 -> mb-3 sm:mb-4 (header margin) */}{" "}
            {/* Made margin responsive */}
            <motion.div
              className="relative w-9 h-9 sm:w-12 sm:h-12 mx-auto mb-2 sm:mb-3" // w-12 h-12 sm:w-16 sm:h-16 -> w-9 h-9 sm:w-12 sm:h-12 (icon size)
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <div
                className="absolute inset-0 rounded-xl backdrop-blur-sm border border-white/30"
                style={{
                  background: `linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)`,
                  boxShadow: `0 4px 16px ${accentColor}15`,
                }}
              />
              <div className="relative w-full h-full p-1.5 sm:p-2 rounded-xl">
                {" "}
                {/* p-2 sm:p-3 -> p-1.5 sm:p-2 (icon padding) */}{" "}
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
            <h3 className="text-white text-base sm:text-lg font-bold mb-1 leading-tight tracking-tight">
              {" "}
              {/* text-lg sm:text-xl -> text-base sm:text-lg (title font size) */}{" "}
              {title}
            </h3>
            {subtitle && (
              <p className="text-gray-300 text-[11px] sm:text-xs font-medium opacity-80">
                {" "}
                {/* text-xs sm:text-sm -> text-[11px] sm:text-xs (subtitle font size) */}{" "}
                {subtitle}
              </p>
            )}
          </div>
          {/* Enhanced Stats Section with subtle gradients */}
          <div className="grid grid-cols-3 gap-1 sm:gap-2 mb-3 sm:mb-4">
            {" "}
            {/* gap-2 sm:gap-3 mb-4 sm:mb-6 -> gap-1 sm:gap-2 mb-3 sm:mb-4 (stats section) */}{" "}
            {/* Experience Level */}
            <div
              className={`${experienceStyle.bg} ${experienceStyle.border} border rounded-lg p-1.5 sm:p-2 text-center backdrop-blur-sm relative overflow-hidden`}
            >
              {" "}
              {/* p-2 sm:p-3 -> p-1.5 sm:p-2 (stats card padding) */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-50" />
              <div className="relative z-10">
                <div className="text-[11px] sm:text-xs mb-1">
                  {" "}
                  {/* text-xs sm:text-sm -> text-[11px] sm:text-xs (icon font size) */}
                  {experienceStyle.icon}
                </div>{" "}
                {/* Made font size responsive */}
                <div
                  className={`text-[11px] font-bold ${experienceStyle.text} mb-1`}
                >
                  {" "}
                  {/* text-xs -> text-[11px] (level font size) */}
                  {experienceLevel}
                </div>
                <div className="text-gray-400 text-[10px]">
                  {" "}
                  {/* text-xs -> text-[10px] (label font size) */}
                  Nivel
                </div>
              </div>
            </div>
            {/* Project Count */}
            <div className="bg-gradient-to-br from-white/10 to-white/5 border border-white/30 rounded-lg p-1.5 sm:p-2 text-center backdrop-blur-sm relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5" />
              <div className="relative z-10">
                <div className="text-[11px] sm:text-xs mb-1">🚀</div>
                <div className="text-white text-[11px] sm:text-xs font-bold mb-1">
                  {projectCount}+
                </div>
                <div className="text-gray-400 text-[10px]">Proyectos</div>
              </div>
            </div>
            {/* Price */}
            {startingPrice && (
              <div className="bg-gradient-to-br from-white/10 to-white/5 border border-white/30 rounded-lg p-1.5 sm:p-2 text-center backdrop-blur-sm relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-emerald-500/5" />
                <div className="relative z-10">
                  <div className="text-[11px] sm:text-xs mb-1">💰</div>
                  <div
                    className="text-[11px] sm:text-xs font-bold mb-1"
                    style={{ color: accentColor }}
                  >
                    {formatPrice()}
                  </div>
                  <div className="text-gray-400 text-[10px]">Desde</div>
                </div>
              </div>
            )}
          </div>
          {/* Enhanced Description */}
          <div className="mb-3 sm:mb-4">
            {" "}
            {/* mb-4 sm:mb-6 -> mb-3 sm:mb-4 (desc margin) */}{" "}
            <p className="text-gray-200 text-[11px] sm:text-xs leading-relaxed text-center font-medium">
              {" "}
              {/* Made font size responsive */}
              {description}
            </p>
          </div>
          {/* Enhanced Key Features with subtle gradient background */}
          <div className="mb-3 sm:mb-4">
            {" "}
            {/* mb-4 sm:mb-6 -> mb-3 sm:mb-4 (features margin) */}{" "}
            <div className="flex items-center mb-1.5 sm:mb-2">
              {" "}
              {/* mb-2 sm:mb-3 -> mb-1.5 sm:mb-2 (features header margin) */}{" "}
              <div
                className="w-1.5 h-1.5 rounded-full mr-2"
                style={{ backgroundColor: accentColor }}
              />{" "}
              {/* w-2 h-2 -> w-1.5 h-1.5 (dot size) */}
              <h4 className="text-white text-[11px] sm:text-xs font-bold tracking-wide">
                {" "}
                CARACTERÍSTICAS CLAVE
              </h4>
            </div>
            <div className="space-y-1.5 p-1.5 sm:p-2 rounded-lg bg-gradient-to-br from-white/5 to-transparent border border-white/10">
              {" "}
              {/* space-y-2 p-2 sm:p-3 -> space-y-1.5 p-1.5 sm:p-2 (features list) */}{" "}
              {featuresArray.slice(0, 3).map((feature, idx) => (
                <motion.div
                  key={idx}
                  className="flex items-start gap-1.5 group/feature"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * idx }}
                >
                  <div
                    className="w-2.5 h-2.5 sm:w-3 h-3 rounded-full flex items-center justify-center text-[10px] font-bold text-white mt-0.5 flex-shrink-0 shadow-lg"
                    style={{ backgroundColor: accentColor }}
                  >
                    ✓
                  </div>{" "}
                  {/* w-3 h-3 sm:w-4 sm:h-4 -> w-2.5 h-2.5 sm:w-3 h-3 (check size) */}
                  <span className="text-gray-200 text-[11px] sm:text-xs leading-relaxed group-hover/feature:text-white transition-colors duration-200">
                    {" "}
                    {/* Made font size responsive */}
                    {feature}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
          {/* Enhanced Technologies with gradient container */}
          <div className="mb-3 sm:mb-4">
            {" "}
            {/* mb-4 sm:mb-6 -> mb-3 sm:mb-4 (tech margin) */}{" "}
            <div className="flex items-center mb-1.5 sm:mb-2">
              {" "}
              {/* mb-2 sm:mb-3 -> mb-1.5 sm:mb-2 (tech header margin) */}{" "}
              <div
                className="w-1.5 h-1.5 rounded-full mr-2"
                style={{ backgroundColor: accentColor }}
              />
              <h4 className="text-white text-[11px] sm:text-xs font-bold tracking-wide">
                {" "}
                TECNOLOGÍAS
              </h4>
            </div>
            <div className="p-1.5 sm:p-2 rounded-lg bg-gradient-to-br from-white/5 to-transparent border border-white/10">
              {" "}
              {/* Made padding responsive */}
              <div className="flex flex-wrap gap-1 sm:gap-1.5">
                {" "}
                {/* gap-1 sm:gap-2 -> gap-1 sm:gap-1.5 (tech tag gap) */}{" "}
                {techArray.slice(0, 6).map((tech, idx) => (
                  <motion.span
                    key={idx}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.05 * idx }}
                    className="px-1.5 py-0.5 text-[10px] font-semibold rounded-md text-white bg-gradient-to-r from-white/15 to-white/10 backdrop-blur-sm border border-white/20 hover:border-white/40 transition-all duration-300 hover:scale-105 cursor-default" // px-2 py-1 text-xs -> px-1.5 py-0.5 text-[10px] (tech tag size)
                  >
                    {tech}
                  </motion.span>
                ))}
              </div>
            </div>
          </div>
          {/* Enhanced Delivery Time */}
          {deliveryTime && (
            <div className="mb-3 sm:mb-4">
              {" "}
              {/* mb-4 sm:mb-6 -> mb-3 sm:mb-4 (delivery margin) */}{" "}
              <div className="bg-gradient-to-r from-white/10 to-white/5 rounded-lg p-1.5 sm:p-2 border border-white/20 backdrop-blur-sm relative overflow-hidden">
                {" "}
                {/* p-2 sm:p-3 -> p-1.5 sm:p-2 (delivery padding) */}{" "}
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 to-orange-500/5" />
                <div className="relative z-10 flex items-center justify-center gap-1.5">
                  {" "}
                  {/* gap-2 -> gap-1.5 (delivery gap) */}
                  <div className="text-[11px] sm:text-xs">⏱️</div>{" "}
                  <span className="text-[10px] text-gray-300 font-medium">
                    Tiempo de entrega:
                  </span>
                  <span className="text-[11px] sm:text-xs text-white font-bold">
                    {" "}
                    {/* Made font size responsive */}
                    {deliveryTime}
                  </span>
                </div>
              </div>
            </div>
          )}
          {/* Enhanced CTA Button with improved gradient */}
          <motion.a
            href={ctaLink}
            className="relative block w-full py-1.5 sm:py-2 px-2 sm:px-3 text-center text-white font-bold rounded-xl transition-all duration-500 overflow-hidden group/cta border border-white/20 mt-auto" // py-2 sm:py-3 px-3 sm:px-4 -> py-1.5 sm:py-2 px-2 sm:px-3 (button size)
            style={{
              background: `linear-gradient(135deg, ${accentColor}, #bf61ff)`,
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {/* Button Background Effects */}
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover/cta:translate-x-[100%] transition-transform duration-1000" />
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover/cta:opacity-100 transition-opacity duration-300" />
            <span className="relative z-10 tracking-wide text-[11px] sm:text-xs">
              {" "}
              {/* text-xs sm:text-sm -> text-[11px] sm:text-xs (button font size) */}{" "}
              {ctaText}
            </span>
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
