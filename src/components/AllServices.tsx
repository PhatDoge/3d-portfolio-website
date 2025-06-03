import { motion } from "framer-motion";
import { useState, useMemo } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import ServiceCard from "./ServiceCard";
import { styles } from "../styles";
interface Service {
  _id: string;
  category: string;
  isActive?: boolean;
  active?: boolean;
  iconUrl: string;
  projectCount: number;
}

interface AllServicesProps {
  services: Service[];
}

const CATEGORY_DISPLAY_NAMES: Record<string, string> = {
  design: "Diseño",
  consulting: "Consulta",
  development: "Desarrollo",
};

const ANIMATION_VARIANTS = {
  filterContainer: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { delay: 0.3, duration: 0.6 },
  },
  singleService: {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.6 },
  },
  multipleServices: {
    initial: { opacity: 0, y: 40 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8 },
  },
  statistics: {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { delay: 1 },
  },
};

const AllServices: React.FC<AllServicesProps> = ({ services }) => {
  const [activeFilter, setActiveFilter] = useState("Todos");

  // Memoized computations
  const activeServices = useMemo(
    () =>
      services?.filter((service) => service.isActive || service.active) || [],
    [services]
  );

  const categories = useMemo(
    () => [
      "Todos",
      ...Array.from(new Set(activeServices.map((service) => service.category))),
    ],
    [activeServices]
  );

  const filteredServices = useMemo(
    () =>
      activeFilter === "Todos" ? activeServices : (
        activeServices.filter((service) => service.category === activeFilter)
      ),
    [activeFilter, activeServices]
  );

  const shouldShowFilters = activeServices.length >= 3;

  const totalProjects = useMemo(
    () =>
      activeServices.reduce(
        (acc, service) => acc + (service.projectCount || 0),
        0
      ),
    [activeServices]
  );

  // Slider configuration
  const sliderSettings = useMemo(
    () => ({
      dots: true,
      infinite: filteredServices.length > 3, // Large screens: infinite if more than 3
      speed: 600,
      slidesToShow: Math.min(3, filteredServices.length),
      slidesToScroll: 1,
      autoplay: filteredServices.length > 1,
      autoplaySpeed: 3000,
      pauseOnHover: true,
      rtl: false,
      prevArrow: null,
      nextArrow: null,
      responsive: [
        {
          breakpoint: 1200,
          settings: {
            slidesToShow: Math.min(3, filteredServices.length),
            slidesToScroll: 1,
            infinite: filteredServices.length > 2, // Medium screens: infinite if more than 2
          },
        },
        {
          breakpoint: 1024,
          settings: {
            slidesToShow: Math.min(2, filteredServices.length),
            slidesToScroll: 1,
            infinite: filteredServices.length > 2, // Medium screens: infinite if more than 2
          },
        },
        {
          breakpoint: 768,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
            infinite: true, // Small screens: always infinite
          },
        },
      ],
      customPaging: () => <div className="custom-dot" />,
      dotsClass: "slick-dots custom-dots",
    }),
    [filteredServices.length]
  );

  // Early returns
  if (!services || services.length === 0) {
    return <EmptyServicesState />;
  }

  const getCategoryDisplayName = (category: string): string =>
    CATEGORY_DISPLAY_NAMES[category] || category;

  return (
    <section id="services" className="services-section">
      <p className={`${styles.sectionSubText} text-center`}>introduccion</p>
      <h2 className={`${styles.heroHeadText} text-center`}>
        Contrata servicios
      </h2>
      <div className="description-wrapper mb-8">
        <p className="description-text">
          Esto es una descripción de la sección, aqui podría ir una breve
          explicación de lo que se ofrece en esta sección. como tal podría ir
          una breve explicación de lo que se ofrece en esta sección.
        </p>
      </div>
      {/* Filter Buttons */}
      {shouldShowFilters && categories.length > 1 && (
        <FilterButtons
          categories={categories}
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
          getCategoryDisplayName={getCategoryDisplayName}
        />
      )}

      {/* Services Display */}
      <div className="services-container">
        <ServicesDisplay
          filteredServices={filteredServices}
          sliderSettings={sliderSettings}
        />
      </div>

      {/* Services Statistics */}
      {activeServices.length > 0 && (
        <Statistics
          activeServicesCount={activeServices.length}
          totalProjects={totalProjects}
          categoriesCount={categories.length - 1}
        />
      )}
    </section>
  );
};

// Extracted Components
const EmptyServicesState: React.FC = () => (
  <div className="empty-services">
    <div className="empty-services-card">
      <p className="empty-services-text">No hay servicios disponibles.</p>
      <a href="/admin/services" className="add-services-btn">
        <span>Agregar servicios</span>
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M12 5v14M5 12h14" />
        </svg>
      </a>
    </div>
  </div>
);

interface FilterButtonsProps {
  categories: string[];
  activeFilter: string;
  onFilterChange: (filter: string) => void;
  getCategoryDisplayName: (category: string) => string;
}

const FilterButtons: React.FC<FilterButtonsProps> = ({
  categories,
  activeFilter,
  onFilterChange,
  getCategoryDisplayName,
}) => (
  <motion.div
    className="filter-container"
    {...ANIMATION_VARIANTS.filterContainer}
    viewport={{ once: true, amount: 0.25 }}
  >
    <div className="filter-wrapper">
      <div className="filter-glow" />
      <div className="filter-buttons">
        {categories.map((category, index) => (
          <motion.button
            key={`category-${index}`}
            onClick={() => onFilterChange(category)}
            className={`filter-btn ${activeFilter === category ? "active" : ""}`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {activeFilter === category && (
              <motion.div
                layoutId="activeFilter"
                className="filter-btn-bg"
                transition={{
                  type: "spring",
                  bounce: 0.2,
                  duration: 0.6,
                }}
              />
            )}
            <div className="filter-btn-hover" />
            <span className="filter-btn-text">
              {getCategoryDisplayName(category)}
            </span>
            {activeFilter === category && <div className="filter-btn-glow" />}
          </motion.button>
        ))}
      </div>
      <div className="filter-accent" />
    </div>
  </motion.div>
);

interface ServicesDisplayProps {
  filteredServices: Service[];
  sliderSettings: any;
}

const ServicesDisplay: React.FC<ServicesDisplayProps> = ({
  filteredServices,
  sliderSettings,
}) => {
  if (filteredServices.length === 1) {
    return (
      <motion.div
        className="single-service"
        {...ANIMATION_VARIANTS.singleService}
      >
        <div className="single-service-wrapper">
          <ServiceCard
            index={0}
            {...filteredServices[0]}
            iconUrl={filteredServices[0].iconUrl}
          />
        </div>
      </motion.div>
    );
  }

  if (filteredServices.length === 2) {
    return (
      <motion.div
        className="two-services"
        {...ANIMATION_VARIANTS.multipleServices}
      >
        {filteredServices.map((service, index) => (
          <div key={service._id} className="two-services-item">
            <div className="two-services-wrapper">
              <ServiceCard
                index={index}
                {...service}
                iconUrl={service.iconUrl}
              />
            </div>
          </div>
        ))}
      </motion.div>
    );
  }

  return (
    <motion.div
      className="services-slider"
      {...ANIMATION_VARIANTS.multipleServices}
    >
      <Slider {...sliderSettings}>
        {filteredServices.map((service, index) => (
          <div key={service._id} className="slider-item">
            <div className="slider-wrapper">
              <ServiceCard
                index={index}
                {...service}
                iconUrl={service.iconUrl}
              />
            </div>
          </div>
        ))}
      </Slider>
    </motion.div>
  );
};

interface StatisticsProps {
  activeServicesCount: number;
  totalProjects: number;
  categoriesCount: number;
}

const Statistics: React.FC<StatisticsProps> = ({
  activeServicesCount,
  totalProjects,
  categoriesCount,
}) => (
  <motion.div className="statistics" {...ANIMATION_VARIANTS.statistics}>
    <div className="statistics-container">
      <div className="stat-item">
        <div className="stat-number">{activeServicesCount}+</div>
        <div className="stat-label">Servicios Disponibles</div>
      </div>
      <div className="stat-item">
        <div className="stat-number purple">{totalProjects}+</div>
        <div className="stat-label">Proyectos Completados</div>
      </div>
      <div className="stat-item">
        <div className="stat-number blue">{categoriesCount}</div>
        <div className="stat-label">Categorías de Servicio</div>
      </div>
    </div>
  </motion.div>
);

export default AllServices;
