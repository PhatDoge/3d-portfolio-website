import { Tilt } from "react-tilt";
import { motion } from "framer-motion";
import { memo, useMemo, useCallback, useState, useEffect } from "react";
import { styles } from "../styles";
import { github } from "../assets";
import { SectionWrapper } from "../hoc";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { ExternalLinkIcon } from "lucide-react";
import PropTypes from "prop-types";

// Moved animation variants outside component to prevent recreation
const fadeInVariants = {
  hidden: (direction) => ({
    x:
      direction === "left" ? 100
      : direction === "right" ? -100
      : 0,
    y:
      direction === "up" ? 100
      : direction === "down" ? -100
      : 0,
    opacity: 0,
  }),
  show: (custom) => ({
    x: 0,
    y: 0,
    opacity: 1,
    transition: {
      type: custom.type || "spring",
      delay: custom.delay || 0,
      duration: custom.duration || 0.6,
      ease: "easeOut",
    },
  }),
};

const textVariants = {
  hidden: { y: -50, opacity: 0 },
  show: (delay) => ({
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      duration: 1.25,
      delay: delay,
    },
  }),
};

// Optimized color system - reduced to essential colors
const tagColors = [
  { bg: "bg-blue-500/20", border: "border-blue-400/50", text: "text-blue-300" },
  {
    bg: "bg-emerald-500/20",
    border: "border-emerald-400/50",
    text: "text-emerald-300",
  },
  {
    bg: "bg-purple-500/20",
    border: "border-purple-400/50",
    text: "text-purple-300",
  },
  { bg: "bg-pink-500/20", border: "border-pink-400/50", text: "text-pink-300" },
  {
    bg: "bg-yellow-500/20",
    border: "border-yellow-400/50",
    text: "text-yellow-300",
  },
  { bg: "bg-red-500/20", border: "border-red-400/50", text: "text-red-300" },
  { bg: "bg-cyan-500/20", border: "border-cyan-400/50", text: "text-cyan-300" },
  {
    bg: "bg-orange-500/20",
    border: "border-orange-400/50",
    text: "text-orange-300",
  },
];

// Memoized color function
const getTagColor = (tagName, index) => {
  const colorIndex = (tagName.length + index) % tagColors.length;
  return tagColors[colorIndex];
};

// Memoized Tilt options to prevent recreation
const tiltOptions = { max: 25, scale: 1.02, speed: 450 };

// Enhanced Loading Section
const LoadingSection = () => (
  <section className="min-h-screen w-full relative flex flex-col items-center justify-center">
    <div className="absolute inset-0 bg-gradient-to-br from-purple-900/5 via-transparent to-blue-900/5 pointer-events-none"></div>

    <motion.div
      className="text-center p-8 mb-12"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Animated loading icon */}
      <motion.div
        className="w-20 h-20 mx-auto mb-8 flex items-center justify-center"
        animate={{ rotate: 360 }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
      >
        <div className="w-16 h-16 border-4 border-purple-400 border-t-transparent rounded-full animate-spin"></div>
      </motion.div>

      {/* Animated title */}
      <motion.h2
        className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        Cargando Proyectos
      </motion.h2>

      {/* Animated description */}
      <motion.p
        className="text-gray-400 text-lg mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.6 }}
      >
        Preparando mi portafolio de proyectos...
      </motion.p>

      {/* Animated progress bar */}
      <div className="w-80 h-2 bg-gray-700 rounded-full mx-auto overflow-hidden mb-8">
        <motion.div
          className="h-full bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 rounded-full"
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="w-24 h-1 bg-gradient-to-r from-purple-400 to-blue-400 mx-auto rounded-full"></div>
    </motion.div>

    {/* Skeleton project cards */}
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 justify-center items-start max-w-7xl mx-auto px-4">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <motion.div
          key={i}
          className="w-full p-4"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.1, duration: 0.5 }}
        >
          <div className="relative">
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-blue-500/20 rounded-2xl blur-xl"
              animate={{ opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
            />

            <div className="relative backdrop-blur-xl bg-gradient-to-br from-gray-800/40 via-slate-800/30 to-gray-900/40 border border-gray-600/30 rounded-2xl overflow-hidden shadow-xl">
              {/* Image skeleton */}
              <motion.div
                className="w-full h-[280px] bg-gradient-to-br from-gray-700/50 to-gray-800/50"
                animate={{ opacity: [0.4, 0.8, 0.4] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.1 }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-purple-900/10 via-pink-900/5 to-blue-900/10"></div>
              </motion.div>

              {/* Content skeleton */}
              <div className="p-6 space-y-4">
                <div className="space-y-3">
                  <motion.div
                    className="h-4 bg-gray-600/50 rounded-lg"
                    animate={{ opacity: [0.3, 0.7, 0.3] }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      delay: i * 0.15,
                    }}
                  />
                  <motion.div
                    className="h-4 bg-gray-600/30 rounded-lg w-4/5"
                    animate={{ opacity: [0.3, 0.7, 0.3] }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      delay: i * 0.15 + 0.2,
                    }}
                  />
                  <motion.div
                    className="h-4 bg-gray-600/20 rounded-lg w-3/5"
                    animate={{ opacity: [0.3, 0.7, 0.3] }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      delay: i * 0.15 + 0.4,
                    }}
                  />
                </div>

                <div className="flex gap-2">
                  {[1, 2, 3].map((j) => (
                    <motion.div
                      key={j}
                      className="h-6 w-16 bg-gray-600/40 rounded-lg"
                      animate={{ opacity: [0.3, 0.7, 0.3] }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        delay: i * 0.1 + j * 0.1,
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  </section>
);

// Enhanced Empty State component
const EmptyStateSection = () => (
  <section
    id="projects"
    className="min-h-screen w-full relative flex flex-col items-center justify-center"
  >
    <div className="absolute inset-0 bg-gradient-to-br from-purple-900/5 via-transparent to-blue-900/5 pointer-events-none"></div>

    <motion.div
      className="text-center p-8 max-w-2xl mx-auto"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
    >
      {/* Animated project icon */}
      <motion.div
        className="w-32 h-32 mx-auto mb-8 flex items-center justify-center"
        animate={{
          rotate: [0, -5, 5, -5, 0],
          scale: [1, 1.05, 1],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          repeatDelay: 2,
        }}
      >
        <div className="w-24 h-24 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-purple-400/30">
          <motion.span
            className="text-6xl"
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            💼
          </motion.span>
        </div>
      </motion.div>

      {/* Animated title */}
      <motion.h2
        className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        ¡Proyectos en Camino!
      </motion.h2>

      {/* Animated description */}
      <motion.p
        className="text-gray-400 text-xl mb-8 leading-relaxed"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
      >
        Pronto habra proyectos para mostrar!
      </motion.p>

      <motion.p
        className="text-gray-500 text-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.6 }}
      >
        ¡Vuelve pronto para ver mi trabajo!
      </motion.p>

      {/* Animated dots */}
      <div className="flex justify-center gap-3 mt-8">
        {[1, 2, 3, 4].map((i) => (
          <motion.div
            key={i}
            className="w-4 h-4 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full"
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: i * 0.2,
            }}
          />
        ))}
      </div>

      <div className="w-32 h-1 bg-gradient-to-r from-purple-400 to-blue-400 mx-auto rounded-full mt-8"></div>
    </motion.div>
  </section>
);

// Memoized ProjectCard component
const ProjectCard = memo(
  ({
    index,
    cardTitle,
    cardDescription,
    githubLink,
    websiteLink,
    tag,
    imageUrl,
    _id,
  }) => {
    // Memoize parsed tags to prevent recalculation
    const parsedTags = useMemo(() => {
      if (!tag) return [];

      return tag
        .split(",")
        .map((t, tagIndex) => {
          const trimmed = t.trim();
          return trimmed ?
              {
                name: trimmed,
                colors: getTagColor(trimmed, tagIndex),
              }
            : null;
        })
        .filter(Boolean)
        .slice(0, 4); // Limit to 4 tags immediately
    }, [tag]);

    // Memoize image error handler
    const handleImageError = useCallback((e) => {
      e.target.src = "/placeholder-image.jpg";
    }, []);

    // Memoize animation custom values
    const fadeInCustom = useMemo(
      () => ({
        type: "spring",
        delay: index * 0.15,
        duration: 0.6,
      }),
      [index]
    );

    return (
      <motion.div
        custom={fadeInCustom}
        variants={fadeInVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        className="w-full p-4 group"
        whileHover={{ y: -8 }}
        transition={{ duration: 0.15, ease: "easeOut" }}
        style={{ willChange: "transform" }}
      >
        <div className="relative" style={{ willChange: "transform" }}>
          {/* Simplified glowing border - removed complex animation */}
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/30 via-pink-500/30 to-blue-500/30 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

          <Tilt
            options={tiltOptions}
            className="relative backdrop-blur-xl bg-gradient-to-br from-gray-800/60 via-slate-800/50 to-gray-900/60 border border-gray-600/40 rounded-2xl overflow-hidden shadow-2xl group-hover:border-purple-400/50 transition-all duration-500"
          >
            {/* Card header with image */}
            <div
              className="relative w-full h-[280px] overflow-hidden"
              style={{ willChange: "transform" }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-pink-900/10 to-blue-900/20 z-10"></div>

              <img
                src={imageUrl || "/placeholder-image.jpg"}
                alt={cardTitle}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                onError={handleImageError}
                loading="lazy"
                style={{ willChange: "transform" }}
              />

              <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-gray-900/90 via-gray-900/50 to-transparent z-20"></div>

              {/* Simplified action buttons */}
              <div className="absolute top-4 right-4 flex gap-2 z-30">
                {githubLink && (
                  <motion.a
                    href={githubLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="backdrop-blur-md bg-gray-900/70 hover:bg-gray-800/80 border border-gray-600/50 hover:border-gray-500/70 w-12 h-12 rounded-xl flex justify-center items-center cursor-pointer shadow-lg transition-all duration-300"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <img
                      src={github}
                      alt="github"
                      className="w-6 h-6 object-contain filter brightness-0 invert opacity-80 hover:opacity-100 transition-opacity duration-300"
                    />
                  </motion.a>
                )}

                {websiteLink && (
                  <motion.a
                    href={websiteLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="backdrop-blur-md bg-gray-900/70 hover:bg-gray-800/80 border border-gray-600/50 hover:border-purple-400/70 w-12 h-12 rounded-xl flex justify-center items-center cursor-pointer shadow-lg transition-all duration-300"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <ExternalLinkIcon className="w-5 h-5 text-gray-300 hover:text-purple-300 transition-colors duration-300" />
                  </motion.a>
                )}
              </div>

              {/* Project title overlay */}
              <div className="absolute bottom-4 left-6 right-6 z-30">
                <h3 className="text-white font-bold text-2xl leading-tight drop-shadow-lg">
                  {cardTitle}
                </h3>
                <div className="w-12 h-1 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full mt-2 opacity-80"></div>
              </div>
            </div>

            {/* Card content */}
            <div className="p-6 space-y-4">
              {/* Description */}
              <div className="min-h-[60px] flex items-start">
                <p className="text-gray-300 text-sm leading-relaxed line-clamp-3">
                  {cardDescription}
                </p>
              </div>

              {/* Tags - simplified rendering */}
              <div className="flex flex-wrap gap-2 min-h-[32px]">
                {parsedTags.map((tagItem, tagIndex) => (
                  <motion.span
                    key={`${_id}-tag-${tagIndex}`}
                    className={`inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-lg border transition-all duration-300 hover:scale-105 ${tagItem.colors.bg} ${tagItem.colors.border} ${tagItem.colors.text} backdrop-blur-sm`}
                    whileHover={{ y: -2 }}
                  >
                    #{tagItem.name}
                  </motion.span>
                ))}
                {tag && tag.split(",").length > 4 && (
                  <span className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-gray-400 bg-gray-700/30 border border-gray-600/50 rounded-lg backdrop-blur-sm">
                    +{tag.split(",").length - 4}
                  </span>
                )}
              </div>
            </div>

            {/* Subtle inner glow effect */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/5 via-transparent to-transparent pointer-events-none"></div>
          </Tilt>
        </div>
      </motion.div>
    );
  }
);

ProjectCard.propTypes = {
  _id: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired,
  cardTitle: PropTypes.string.isRequired,
  cardDescription: PropTypes.string.isRequired,
  githubLink: PropTypes.string,
  websiteLink: PropTypes.string,
  tag: PropTypes.string,
  imageUrl: PropTypes.string,
};

ProjectCard.displayName = "ProjectCard";

const Works = () => {
  // Fetch projects from Convex
  const projects = useQuery(api.projects.getProjects);
  const projectsDetails = useQuery(api.projectdetails.getProjectDetails);
  const [isDataReady, setIsDataReady] = useState(false);
  const [showEmptyState, setShowEmptyState] = useState(false);

  const details = projectsDetails?.[0];

  // Enhanced data loading effect with timeout for empty state
  useEffect(() => {
    if (projectsDetails && projects !== undefined) {
      if (projects.length > 0) {
        // Use requestAnimationFrame for smoother transition
        const timer = requestAnimationFrame(() => {
          setIsDataReady(true);
        });
        return () => cancelAnimationFrame(timer);
      } else {
        // Show empty state after a brief delay
        const emptyTimer = setTimeout(() => {
          setShowEmptyState(true);
        }, 1500);
        return () => clearTimeout(emptyTimer);
      }
    }
  }, [projectsDetails, projects]);

  // Loading state - show while data is undefined
  if (
    !projectsDetails ||
    projects === undefined ||
    (!isDataReady && !showEmptyState)
  ) {
    return <LoadingSection />;
  }

  // Empty state - show when no projects are available
  if (projects.length === 0 && showEmptyState) {
    return <EmptyStateSection />;
  }

  // Main content with entrance animation
  return (
    <motion.section
      id="projects"
      className="min-h-screen w-full relative"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/5 via-transparent to-blue-900/5 pointer-events-none"></div>

      <motion.div
        custom={0}
        variants={textVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        className="relative z-10"
      >
        <p className={`${styles.sectionSubText} text-center`}>
          {details?.projectHeader || "Mis Proyectos (header)."}
        </p>
        <h2
          className={`${styles.sectionHeadText} text-center bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent`}
        >
          {details?.projectTitle || "Mis Proyectos (title)."}
        </h2>
        <div className="w-24 h-1 bg-gradient-to-r from-purple-400 to-blue-400 mx-auto rounded-full mt-4"></div>
      </motion.div>

      <div className="w-full flex justify-center items-center text-center relative z-10">
        <motion.p
          custom={{ type: "spring", delay: 0.1, duration: 1 }}
          variants={fadeInVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="mt-8 text-gray-300 text-lg max-w-4xl leading-relaxed"
        >
          {details?.projectDescription || "Mis proyectos (description)."}
        </motion.p>
      </div>

      <motion.div
        className="mt-20 grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 justify-center items-start relative z-10"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        {projects.map((project, index) => (
          <ProjectCard key={project._id} index={index} {...project} />
        ))}
      </motion.div>
    </motion.section>
  );
};

const WrappedContact = SectionWrapper(Works, "");
export default WrappedContact;
