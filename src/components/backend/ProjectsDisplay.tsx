import React from "react";

const ProjectsDisplay = () => {
  return (
    <div className="w-full max-w-7xl px-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold">
          <span className="orange-text-gradient">Todos los</span>{" "}
          <span className="green-text-gradient">Proyectos</span>
        </h2>
      </div>

      {projects === undefined ?
        <div className="flex justify-center items-center py-12">
          <div className="text-gray-400 text-lg">Cargando proyectos...</div>
        </div>
      : projects.length === 0 ?
        <div className="flex justify-center items-center py-12">
          <div className="text-gray-400 text-lg">
            No hay proyectos creados aún.
          </div>
        </div>
      : <div className="backdrop-blur-sm bg-gray-900/80 border border-gray-700 rounded-lg overflow-hidden shadow-2xl">
          {/* Table Header */}
          <div className="bg-gray-800/50 border-b border-gray-700">
            <div className="grid grid-cols-12 gap-4 p-4 text-sm font-medium text-gray-300">
              <div className="col-span-2">Imagen</div>
              <div className="col-span-3">Título</div>
              <div className="col-span-3">Tags</div>
              <div className="col-span-2">Creado</div>
              <div className="col-span-1">Actualizado</div>
              <div className="col-span-1 text-center">Acciones</div>
            </div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-gray-700">
            {projects.map((project, index) => (
              <div
                key={project._id}
                className={`grid grid-cols-12 gap-4 p-4 hover:bg-gray-800/30 transition-colors duration-200 ${
                  index % 2 === 0 ? "bg-gray-900/40" : "bg-gray-900/20"
                }`}
              >
                {/* Image */}
                <div className="col-span-2">
                  {project.imageUrl ?
                    <img
                      src={project.imageUrl}
                      alt={project.cardTitle}
                      className="w-16 h-12 object-cover rounded border border-gray-600"
                    />
                  : <div className="w-16 h-12 bg-gray-700 rounded border border-gray-600 flex items-center justify-center">
                      <span className="text-gray-400 text-xs">Sin imagen</span>
                    </div>
                  }
                </div>

                {/* Title */}
                <div className="col-span-3 flex items-center">
                  <div>
                    <h3 className="text-white font-medium text-sm leading-tight mb-1 line-clamp-2">
                      {project.cardTitle}
                    </h3>
                    <p className="text-gray-400 text-xs line-clamp-2">
                      {project.cardDescription}
                    </p>
                  </div>
                </div>

                {/* Tags */}
                <div className="col-span-3 flex items-center">
                  <div className="flex flex-wrap gap-1">
                    {project.tag
                      .split(", ")
                      .slice(0, 3)
                      .map((tag: string, tagIndex: number) => (
                        <span
                          key={tagIndex}
                          className="inline-block px-2 py-1 text-xs bg-purple-600/70 text-white rounded-full"
                        >
                          {tag.trim()}
                        </span>
                      ))}
                    {project.tag.split(", ").length > 3 && (
                      <span className="text-gray-400 text-xs">
                        +{project.tag.split(", ").length - 3}
                      </span>
                    )}
                  </div>
                </div>

                {/* Created Date */}
                <div className="col-span-2 flex items-center">
                  <span className="text-gray-300 text-sm">
                    {formatDate(project.createdAt)}
                  </span>
                </div>

                {/* Updated Date */}
                <div className="col-span-1 flex items-center">
                  <span className="text-gray-300 text-sm">
                    {(
                      project.updatedAt &&
                      project.updatedAt !== project.createdAt
                    ) ?
                      formatDate(project.updatedAt)
                    : "-"}
                  </span>
                </div>

                {/* Actions */}
                <div className="col-span-1 flex items-center justify-center">
                  <Button
                    onClick={() => handleDeleteProject(project._id)}
                    variant="ghost"
                    size="sm"
                    className="text-red-400 hover:text-red-300 hover:bg-red-500/10 p-2 h-8 w-8"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      }
    </div>
  );
};

export default ProjectsDisplay;
