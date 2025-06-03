import { Tilt } from "react-tilt";
import { motion } from "framer-motion";
import { memo, useMemo, useCallback } from "react";
import { styles } from "../styles";
import { github } from "../assets";
import { SectionWrapper } from "../hoc";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { ExternalLinkIcon } from "lucide-react";

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
        transition={{ duration: 0.15, ease: "easeOut" }} // Reduced duration for snappier hover
        style={{ willChange: "transform" }} // Hint browser for GPU acceleration
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
                loading="lazy" // Added lazy loading
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

ProjectCard.displayName = "ProjectCard";

// Memoized LoadingCard component
const LoadingCard = memo(({ index }) => {
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
      animate="show"
      className="w-full p-4"
    >
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-pulse rounded-2xl"></div>

        <div className="backdrop-blur-xl bg-gradient-to-br from-gray-800/40 via-slate-800/30 to-gray-900/40 border border-gray-600/30 rounded-2xl overflow-hidden shadow-xl">
          <div className="w-full h-[280px] bg-gradient-to-br from-gray-700/50 to-gray-800/50 animate-pulse relative">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-900/10 via-pink-900/5 to-blue-900/10"></div>
          </div>

          <div className="p-6 space-y-4">
            <div className="space-y-2">
              <div className="h-4 bg-gray-600/50 rounded-lg animate-pulse"></div>
              <div className="h-4 bg-gray-600/30 rounded-lg animate-pulse w-4/5"></div>
              <div className="h-4 bg-gray-600/20 rounded-lg animate-pulse w-3/5"></div>
            </div>

            <div className="flex gap-2">
              <div className="h-6 w-16 bg-gray-600/40 rounded-lg animate-pulse"></div>
              <div className="h-6 w-20 bg-gray-600/30 rounded-lg animate-pulse"></div>
              <div className="h-6 w-14 bg-gray-600/20 rounded-lg animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
});

LoadingCard.displayName = "LoadingCard";

// Memoized EmptyState component
const EmptyState = memo(() => (
  <motion.div
    custom={{ type: "spring", delay: 0, duration: 0.6 }}
    variants={fadeInVariants}
    initial="hidden"
    whileInView="show"
    viewport={{ once: true, amount: 0.2 }}
    className="col-span-full text-center py-20"
  >
    <div className="backdrop-blur-xl bg-gradient-to-br from-gray-800/40 via-slate-800/30 to-gray-900/40 border border-gray-600/30 rounded-2xl p-12 shadow-2xl max-w-md mx-auto">
      <div className="w-16 h-16 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
        <svg
          className="w-8 h-8 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
          />
        </svg>
      </div>
      <p className="text-gray-300 text-xl font-medium mb-2">
        No hay proyectos disponibles aún.
      </p>
      <p className="text-gray-400 text-sm">
        ¡Agrega tu primer proyecto para comenzar!
      </p>
    </div>
  </motion.div>
));

EmptyState.displayName = "EmptyState";

const Works = () => {
  // Fetch projects from Convex
  const projects = useQuery(api.projects.getProjects);
  const projectsDetails = useQuery(api.projectdetails.getProjectDetails);

  const details = projectsDetails?.[0];

  // Memoize loading skeleton array
  const loadingCards = useMemo(
    () =>
      Array.from({ length: 6 }, (_, index) => (
        <LoadingCard key={`loading-${index}`} index={index} />
      )),
    []
  );

  return (
    <section id="projects" className="min-h-screen w-full relative">
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
          {details?.header || "Mis Proyectos (header)."}
        </p>
        <h2
          className={`${styles.sectionHeadText} text-center bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent`}
        >
          {details?.title || "Mis Proyectos (title)."}
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
          {details?.description || "Mis proyectos (description)."}
        </motion.p>
      </div>

      <div className="mt-20 grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 justify-center items-start relative z-10">
        {projects === undefined ?
          loadingCards
        : projects.length === 0 ?
          <EmptyState />
        : projects.map((project, index) => (
            <ProjectCard key={project._id} index={index} {...project} />
          ))
        }
      </div>
    </section>
  );
};

export default SectionWrapper(Works, "");
