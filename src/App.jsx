import PropTypes from "prop-types";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import {
  About,
  Contact,
  Experience,
  Hero,
  Navbar,
  StarsCanvas,
  Tech,
  Works,
} from "./components";
import Dashboard from "./components/backend/Dashboard";
import WorkExperience from "./components/backend/Experience";
import Introduction from "./components/backend/Introduction";
import ProjectCard from "./components/backend/ProjectCard";
import ProjectsDisplay from "./components/backend/ProjectsDisplay";
import LeftSidebar from "./components/backend/Sidebar";
import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import AllServices from "./components/AllServices";
import Services from "./components/backend/Services";
import ExperienceList from "./components/backend/ExperienceList";
import ServicesList from "./components/backend/ServicesList";
import Skills from "./components/backend/Skills";
import SkillsList from "./components/backend/SkillsList";
import TechnologyManagement from "./components/backend/Technology";
// import Documents from "./components/backend/Documents";

// Layout component for dashboard routes
const DashboardLayout = ({ children }) => {
  return (
    <div className="flex min-h-screen">
      <LeftSidebar />
      <main className="flex-1 overflow-auto bg-gray-900">{children}</main>
    </div>
  );
};

DashboardLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

// Home page layout component
const HomeLayout = ({ children }) => {
  const services = useQuery(api.services.getServices);
  if (!services) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-white text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="relative z-0 bg-primary">
      <div className="bg-hero-pattern bg-cover bg-no-repeat bg-center">
        <Navbar />
        <Hero />
      </div>

      <About />
      <Experience />
      <Tech />

      {/* Reduced margin between Works and AllServices */}
      <div className="mb-8">
        <Works />
      </div>

      <div className="mt-8 overflow-hidden">
        <AllServices services={services} />
      </div>

      {/* <Feedbacks /> */}
      <div className="relative z-0">
        <Contact />
        <StarsCanvas />
      </div>
      {children}
    </div>
  );
};

HomeLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Home route */}
        <Route path="/" element={<HomeLayout />} />

        {/* Dashboard routes with layout */}
        <Route
          path="/dashboard"
          element={
            <DashboardLayout>
              <Dashboard />
            </DashboardLayout>
          }
        />

        {/* experience route */}
        <Route
          path="/experience"
          element={
            <DashboardLayout>
              <WorkExperience />
            </DashboardLayout>
          }
        />
        <Route
          path="/technologies"
          element={
            <DashboardLayout>
              <TechnologyManagement />
            </DashboardLayout>
          }
        />

        <Route
          path="/projectsDisplay"
          element={
            <DashboardLayout>
              <ProjectsDisplay />
            </DashboardLayout>
          }
        />

        <Route
          path="/introduction"
          element={
            <DashboardLayout>
              <Introduction />
            </DashboardLayout>
          }
        />
        <Route
          path="/skills"
          element={
            <DashboardLayout>
              <Skills />
            </DashboardLayout>
          }
        />
        <Route
          path="/skillsList"
          element={
            <DashboardLayout>
              <SkillsList />
            </DashboardLayout>
          }
        />

        <Route
          path="/project-card"
          element={
            <DashboardLayout>
              <ProjectCard />
            </DashboardLayout>
          }
        />

        <Route
          path="/services"
          element={
            <DashboardLayout>
              <Services />
            </DashboardLayout>
          }
        />

        <Route
          path="/experienceList"
          element={
            <DashboardLayout>
              <ExperienceList />
            </DashboardLayout>
          }
        />
        <Route
          path="/servicesList"
          element={
            <DashboardLayout>
              <ServicesList />
            </DashboardLayout>
          }
        />

        {/* Catch-all route for 404 */}
        <Route
          path="*"
          element={
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
              <div className="text-center">
                <h1 className="text-4xl font-bold text-white mb-4">404</h1>
                <p className="text-gray-400 mb-8">Página no encontrada</p>
                <a
                  href="/"
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Volver al inicio
                </a>
              </div>
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
