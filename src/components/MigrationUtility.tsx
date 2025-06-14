// File: components/MigrationUtility.tsx
// This component helps migrate your existing technologies array to the database
import { useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { useMutation } from "convex/react";
import { api } from "convex/_generated/api";

// Updated technologies with correct paths - now using public folder
//if you see import errors just ignore them lol its a issue with tsx and jsx compatibility i think

//* * Important!! this folder must be on public since vercel doesnt recognize src/folders..

const existingTechnologies = [
  {
    name: "HTML 5",
    icon: "/tech/html.png",
  },
  {
    name: "CSS 3",
    icon: "/tech/css.png",
  },
  {
    name: "JavaScript",
    icon: "/tech/javascript.png",
  },
  {
    name: "TypeScript",
    icon: "/tech/typescript.png",
  },
  {
    name: "React JS",
    icon: "/tech/reactjs.png",
  },
  {
    name: "Redux Toolkit",
    icon: "/tech/redux.png",
  },
  {
    name: "Node.js",
    icon: "/tech/nodejs.png",
  },
  {
    name: "MongoDB",
    icon: "/tech/mongodb.png",
  },
  {
    name: "Three.js",
    icon: "/tech/threejs.svg",
  },
  {
    name: "Git",
    icon: "/tech/git.png",
  },
  {
    name: "Figma",
    icon: "/tech/figma.png",
  },
  {
    name: "Docker",
    icon: "/tech/docker.png",
  },
];

const MigrationUtility = () => {
  const [isMigrating, setIsMigrating] = useState(false);
  const [migrationStatus, setMigrationStatus] = useState("");
  const bulkInsert = useMutation(api.technologies.bulkInsertTechnologies);

  const handleMigration = async () => {
    setIsMigrating(true);
    setMigrationStatus("Starting migration...");

    try {
      // Prepare technologies for database insertion
      const technologiesForDB = existingTechnologies.map((tech, index) => ({
        name: tech.name,
        icon: tech.icon,
        isVisible: true,
        order: index,
      }));

      const result = await bulkInsert({ technologies: technologiesForDB });

      if (result.success) {
        setMigrationStatus(
          `Successfully migrated ${technologiesForDB.length} technologies!`
        );
      } else {
        setMigrationStatus(
          "Migration failed. Please check the console for errors."
        );
      }
    } catch (error) {
      console.error("Migration error:", error);
      setMigrationStatus(
        "Migration failed with error. Check console for details."
      );
    } finally {
      setIsMigrating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 p-6 flex items-center justify-center">
      <Card className="bg-gray-900/80 border-gray-700 max-w-md w-full">
        <CardHeader>
          <CardTitle className="text-2xl text-center">
            <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
              Migration Utility
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-gray-300">
            This will migrate your existing technologies array to the database.
          </p>
          <p className="text-sm text-gray-400">
            Found {existingTechnologies.length} technologies to migrate.
          </p>

          {migrationStatus && (
            <div className="p-3 bg-gray-800 rounded-lg border border-gray-600">
              <p className="text-sm text-gray-300">{migrationStatus}</p>
            </div>
          )}

          <Button
            onClick={handleMigration}
            disabled={isMigrating}
            className="w-full bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 text-white font-semibold rounded-lg transition-all duration-300"
          >
            {isMigrating ? "Migrating..." : "Start Migration"}
          </Button>

          <div className="mt-6 p-4 bg-blue-900/20 border border-blue-700 rounded-lg">
            <h4 className="text-blue-300 font-medium mb-2">Instructions:</h4>
            <ol className="text-sm text-blue-200 space-y-1 text-left">
              <li>1. Move all icons from src/assets/tech/ to public/tech/</li>
              <li>2. All icon paths are now set to /tech/</li>
              <li>3. Run this migration once to populate your database</li>
            </ol>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MigrationUtility;
