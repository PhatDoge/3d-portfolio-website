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
import LeftSidebar from "./components/backend/Sidebar";
import Introduction from "./components/backend/Introduction";
import ProjectCard from "./components/backend/ProjectCard";
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
  return (
    <div className="relative z-0 bg-primary">
      <div className="bg-hero-pattern bg-cover bg-no-repeat bg-center">
        <Navbar />
        <Hero />
      </div>
      <About />
      <Experience />
      <Tech />
      <Works />
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

        {/* Documents route (add this if you have a Documents component) */}
        {/* <Route
          path="/documents"
          element={
            <DashboardLayout>
              <Documents />
            </DashboardLayout>
          }
        /> */}

        {/* Add more dashboard routes as needed */}
        {/* 
        <Route
          path="/settings"
          element={
            <DashboardLayout>
              <Settings />
            </DashboardLayout>
          }
        />
        */}

        <Route
          path="/introduction"
          element={
            <DashboardLayout>
              <Introduction />
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
