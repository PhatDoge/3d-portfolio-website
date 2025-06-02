export const userTranslations = {
  es: {
    title: "Cambia tu cabezera",
    name: "Nombre",
    description: "Descripción",
    namePlaceholder: "Ingresa tu Nombre",
    descPlaceholder: "Ingresa tu Descripción",
    button: "Cambiar detalles",
    loading: "Cargando...",
  },
  en: {
    title: "Change your header",
    name: "Name",
    description: "Description",
    namePlaceholder: "Enter your Name",
    descPlaceholder: "Enter your Description",
    button: "Change details",
    loading: "Loading...",
  },
};

export const introductionTranslations = {
  es: {
    title: "Cambia tu introducción",
    header: "Cabezera",
    headerPlaceholder: "Ingresa tu Cabezera",
    formTitle: "Titulo",
    formTitlePlaceholder: "Ingresa tu Titulo",
    description: "Resumen",
    descriptionPlaceholder: "Ingresa tu Resumen",
    button: "Cambiar detalles",
    loading: "Cargando...",
  },
  en: {
    title: "Change your introduction",
    header: "Header",
    headerPlaceholder: "Enter your Header",
    formTitle: "Title",
    formTitlePlaceholder: "Enter your Title",
    description: "Summary",
    descriptionPlaceholder: "Enter your Summary",
    button: "Change details",
    loading: "Loading...",
  },
};

export const skillTranslations = {
  es: {
    title: "Agregar nueva habilidad",
    formTitle: "Título",
    formTitlePlaceholder: "Ingresa el título de la habilidad",
    description: "Descripción",
    descriptionPlaceholder: "Describe la habilidad",
    iconLabel: "Icono (URL o subir imagen)",
    iconPlaceholder: "https://ejemplo.com/icono.png",
    or: "o",
    fileButton: "Subir imagen",
    link: "Enlace",
    linkPlaceholder: "https://ejemplo.com/proyecto",
    submit: "Crear habilidad",
    loading: "Cargando...",
    fileError: "Proporcione una URL del icono o suba una imagen",
  },
  en: {
    title: "Add new skill",
    formTitle: "Title",
    formTitlePlaceholder: "Enter the skill title",
    description: "Description",
    descriptionPlaceholder: "Describe the skill",
    iconLabel: "Icon (URL or upload image)",
    iconPlaceholder: "https://example.com/icon.png",
    or: "or",
    fileButton: "Upload image",
    link: "Link",
    linkPlaceholder: "https://example.com/project",
    submit: "Create skill",
    loading: "Loading...",
    fileError: "Please provide either an icon URL or upload an image",
  },
};

export const skillListTranslations = {
  es: {
    title: "Todas las Habilidades",
    loading: "Cargando habilidades...",
    noSkills: "No hay habilidades creadas aún.",
    iconHeader: "Icono",
    titleHeader: "Título",
    descriptionHeader: "Descripción",
    linkHeader: "Enlace",
    actionsHeader: "Acciones",
    noIcon: "Sin icono",
    viewLink: "Ver enlace",
    noLink: "-",
    deleteTitle: "¿Eliminar habilidad?",
    deleteDescription:
      "Esta acción no se puede deshacer. La habilidad será eliminada permanentemente.",
    cancel: "Cancelar",
    delete: "Eliminar",
    deleteSuccess: "Skill deleted successfully",
    deleteError: "Error al eliminar la habilidad. Inténtalo de nuevo.",
  },
  en: {
    title: "All Skills",
    loading: "Loading skills...",
    noSkills: "No skills created yet.",
    iconHeader: "Icon",
    titleHeader: "Title",
    descriptionHeader: "Description",
    linkHeader: "Link",
    actionsHeader: "Actions",
    noIcon: "No icon",
    viewLink: "View link",
    noLink: "-",
    deleteTitle: "Delete skill?",
    deleteDescription:
      "This action cannot be undone. The skill will be permanently deleted.",
    cancel: "Cancel",
    delete: "Delete",
    deleteSuccess: "Skill deleted successfully",
    deleteError: "Error deleting skill. Please try again.",
  },
};

export const skillUpdateTranslations = {
  es: {
    editSkill: "Editar Habilidad",
    title: "Título",
    titlePlaceholder: "Título de la habilidad",
    link: "Enlace",
    linkPlaceholder: "https://ejemplo.com/proyecto",
    description: "Descripción",
    descriptionPlaceholder: "Describe la habilidad",
    icon: "Icono (URL o subir imagen)",
    iconPlaceholder: "https://ejemplo.com/icono.png",
    or: "o",
    cancel: "Cancelar",
    update: "Actualizar",
    updating: "Actualizando...",
    uploadError: "Error al subir la imagen",
    updateError: "Error al actualizar la habilidad. Inténtalo de nuevo.",
  },
  en: {
    editSkill: "Edit Skill",
    title: "Title",
    titlePlaceholder: "Skill title",
    link: "Link",
    linkPlaceholder: "https://example.com/project",
    description: "Description",
    descriptionPlaceholder: "Describe the skill",
    icon: "Icon (URL or upload image)",
    iconPlaceholder: "https://example.com/icon.png",
    or: "or",
    cancel: "Cancel",
    update: "Update",
    updating: "Updating...",
    uploadError: "Error uploading image",
    updateError: "Error updating skill. Please try again.",
  },
};

export const technologyTranslations = {
  es: {
    // Main page
    title: "Administracion de Tecnologias",
    subtitle:
      "Administra tus tecnologias y controla su visibilidad en tu portafolio.",
    visibleBadge: "Visible",
    totalBadge: "Total",
    loading: "Cargando tecnologías...",

    // Technology Item
    visible: "Visible",
    hidden: "Esconder",

    // Add Technology Form
    addFormTitle: "Agregar Tecnología",
    nameLabel: "Nombre de la Tecnología",
    namePlaceholder: "e.g., React JS",
    iconLabel: "URL de Icono",
    iconPlaceholder: "https://example.com/icon.png",
    addButton: "Agregar Tecnología",

    // Technology List
    listTitle: "Lista de Tecnologias",
    noTechnologies: "No se encontraron tecnologias",
    initializeButton: "Iniciar con tecnologias predeterminadas",
    initializing: "Inicializando...",

    // Delete Dialog
    deleteTitle: "¿Eliminar tecnología?",
    deleteDescription:
      'Esta acción no se puede deshacer. La tecnología "{name}" será eliminada permanentemente.',
    cancel: "Cancelar",
    delete: "Eliminar",
    deleting: "Eliminando...",
    deleteError: "Error al eliminar la tecnología. Inténtalo de nuevo.",

    // Form validation messages
    nameMinError: "Name must be at least 2 characters.",
    iconRequiredError: "Icon URL is required.",

    // Console messages
    deleteSuccess: "Technology deleted successfully",
    addError: "Failed to add technology:",
    toggleError: "Failed to toggle visibility:",
    updateSuccess: "Technology updated successfully",
    deleteFailedError: "Failed to delete technology:",
    initializeError: "Failed to initialize default technologies:",
  },
  en: {
    // Main page
    title: "Technology Management",
    subtitle:
      "Manage your technologies and control their visibility in your portfolio.",
    visibleBadge: "Visible",
    totalBadge: "Total",
    loading: "Loading technologies...",

    // Technology Item
    visible: "Visible",
    hidden: "Hidden",

    // Add Technology Form
    addFormTitle: "Add Technology",
    nameLabel: "Technology Name",
    namePlaceholder: "e.g., React JS",
    iconLabel: "Icon URL",
    iconPlaceholder: "https://example.com/icon.png",
    addButton: "Add Technology",

    // Technology List
    listTitle: "Technology List",
    noTechnologies: "No technologies found",
    initializeButton: "Initialize with default technologies",
    initializing: "Initializing...",

    // Delete Dialog
    deleteTitle: "Delete technology?",
    deleteDescription:
      'This action cannot be undone. The technology "{name}" will be permanently deleted.',
    cancel: "Cancel",
    delete: "Delete",
    deleting: "Deleting...",
    deleteError: "Error deleting technology. Please try again.",

    // Form validation messages
    nameMinError: "Name must be at least 2 characters.",
    iconRequiredError: "Icon URL is required.",

    // Console messages
    deleteSuccess: "Technology deleted successfully",
    addError: "Failed to add technology:",
    toggleError: "Failed to toggle visibility:",
    updateSuccess: "Technology updated successfully",
    deleteFailedError: "Failed to delete technology:",
    initializeError: "Failed to initialize default technologies:",
  },
};

export const projectTranslations = {
  es: {
    createProject: "Crear Proyecto",
    projectImage: "Imagen del Proyecto",
    preview: "Preview",
    projectTitle: "Título del Proyecto",
    projectTitlePlaceholder: "Ingresa el título del proyecto",
    githubLink: "Enlace de GitHub",
    githubLinkPlaceholder: "Ingresa el enlace de GitHub",
    websiteAddress: "Direccion Web",
    websiteAddressPlaceholder: "Ingresa la direccion web",
    projectDescription: "Descripción del Proyecto",
    projectDescriptionPlaceholder: "Describe tu proyecto en detalle",
    tags: "Etiquetas",
    tagsPlaceholder: "Escribe una etiqueta y presiona Enter o coma",
    createProjectButton: "Crear Proyecto",
    creatingProject: "Creando proyecto...",
    // Form validation messages
    imageRequired: "Please select an image.",
    titleMinLength: "Card title must be at least 2 characters.",
    titleMaxLength: "Card title must not exceed 100 characters.",
    descriptionMinLength: "Card description must be at least 2 characters.",
    descriptionMaxLength: "Card description must not exceed 500 characters.",
    tagRequired: "At least one tag is required.",
    addOneTag: "Please add at least one tag.",
    validGithubUrl: "Please enter a valid GitHub URL.",
    validWebsiteUrl: "Please enter a valid website URL.",
    createProjectError: "Failed to create project. Please try again.",
  },
  en: {
    createProject: "Create Project",
    projectImage: "Project Image",
    preview: "Preview",
    projectTitle: "Project Title",
    projectTitlePlaceholder: "Enter the project title",
    githubLink: "GitHub Link",
    githubLinkPlaceholder: "Enter the GitHub link",
    websiteAddress: "Website Address",
    websiteAddressPlaceholder: "Enter the website address",
    projectDescription: "Project Description",
    projectDescriptionPlaceholder: "Describe your project in detail",
    tags: "Tags",
    tagsPlaceholder: "Type a tag and press Enter or comma",
    createProjectButton: "Create Project",
    creatingProject: "Creating project...",
    // Form validation messages
    imageRequired: "Please select an image.",
    titleMinLength: "Card title must be at least 2 characters.",
    titleMaxLength: "Card title must not exceed 100 characters.",
    descriptionMinLength: "Card description must be at least 2 characters.",
    descriptionMaxLength: "Card description must not exceed 500 characters.",
    tagRequired: "At least one tag is required.",
    addOneTag: "Please add at least one tag.",
    validGithubUrl: "Please enter a valid GitHub URL.",
    validWebsiteUrl: "Please enter a valid website URL.",
    createProjectError: "Failed to create project. Please try again.",
  },
};

export const projectDetailsTranslations = {
  es: {
    headerDetails: "Detalles de Cabezera",
    header: "Cabezera",
    headerPlaceholder: "Ingresa tu Cabezera",
    title: "Titulo",
    titlePlaceholder: "Ingresa tu Titulo",
    summary: "Resumen",
    summaryPlaceholder: "Ingresa tu Resumen",
    saveDetails: "Guardar Detalles",
    loadingProjectDetails: "Loading project details...",
    // Form validation messages
    titleMinLength: "Title must be at least 2 characters.",
    titleMaxLength: "Title must not exceed 50 characters.",
    headerMinLength: "Header must be at least 2 characters.",
    headerMaxLength: "Header must not exceed 50 characters.",
    descriptionMinLength: "Description must be at least 2 characters.",
    descriptionMaxLength: "Description must not exceed 1000 characters.",
  },
  en: {
    headerDetails: "Header Details",
    header: "Header",
    headerPlaceholder: "Enter your Header",
    title: "Title",
    titlePlaceholder: "Enter your Title",
    summary: "Summary",
    summaryPlaceholder: "Enter your Summary",
    saveDetails: "Save Details",
    loadingProjectDetails: "Loading project details...",
    // Form validation messages
    titleMinLength: "Title must be at least 2 characters.",
    titleMaxLength: "Title must not exceed 50 characters.",
    headerMinLength: "Header must be at least 2 characters.",
    headerMaxLength: "Header must not exceed 50 characters.",
    descriptionMinLength: "Description must be at least 2 characters.",
    descriptionMaxLength: "Description must not exceed 1000 characters.",
  },
};

export const projectUpdateTranslations = {
  es: {
    editProject: "Editar Proyecto",
    projectImage: "Imagen del Proyecto",
    projectTitle: "Título del Proyecto",
    projectTitlePlaceholder: "Ingresa el título del proyecto",
    projectDescription: "Descripción del Proyecto",
    projectDescriptionPlaceholder: "Describe tu proyecto en detalle",
    tags: "Etiquetas",
    tagsPlaceholder: "Escribe una etiqueta y presiona Enter o coma",
    cancel: "Cancelar",
    updateProject: "Actualizar Proyecto",
    updating: "Actualizando...",
    // Form validation messages
    imageRequired: "Por favor selecciona una imagen.",
    titleMinLength: "El título debe tener al menos 2 caracteres.",
    descriptionMinLength: "La descripción debe tener al menos 2 caracteres.",
    tagRequired: "Se requiere al menos una etiqueta.",
    addOneTag: "Por favor agrega al menos una etiqueta.",
    updateFailed: "Error al actualizar el proyecto. Inténtalo de nuevo.",
    preview: "Vista previa",
  },
  en: {
    editProject: "Edit Project",
    projectImage: "Project Image",
    projectTitle: "Project Title",
    projectTitlePlaceholder: "Enter the project title",
    projectDescription: "Project Description",
    projectDescriptionPlaceholder: "Describe your project in detail",
    tags: "Tags",
    tagsPlaceholder: "Write a tag and press Enter or comma",
    cancel: "Cancel",
    updateProject: "Update Project",
    updating: "Updating...",
    // Form validation messages
    imageRequired: "Please select an image.",
    titleMinLength: "Title must be at least 2 characters.",
    descriptionMinLength: "Description must be at least 2 characters.",
    tagRequired: "At least one tag is required.",
    addOneTag: "Please add at least one tag.",
    updateFailed: "Failed to update project. Please try again.",
    preview: "Preview",
  },
};
export const projectsListTranslations = {
  es: {
    title: "Todos los Proyectos",
    loading: "Cargando proyectos...",
    noProjects: "No hay proyectos creados aún.",
    tableHeaders: {
      image: "Imagen",
      title: "Título",
      tags: "Tags",
      created: "Creado",
      updated: "Actualizado",
      actions: "Acciones",
    },
    noImage: "Sin imagen",
    deleteDialog: {
      title: "¿Eliminar proyecto?",
      description:
        "Esta acción no se puede deshacer. El proyecto será eliminado permanentemente.",
      cancel: "Cancelar",
      confirm: "Eliminar",
    },
    errors: {
      deleteError: "Error al eliminar el proyecto. Inténtalo de nuevo.",
    },
    messages: {
      deleteSuccess: "Project deleted successfully",
    },
  },
  en: {
    title: "All Projects",
    loading: "Loading projects...",
    noProjects: "No projects created yet.",
    tableHeaders: {
      image: "Image",
      title: "Title",
      tags: "Tags",
      created: "Created",
      updated: "Updated",
      actions: "Actions",
    },
    noImage: "No image",
    deleteDialog: {
      title: "Delete project?",
      description:
        "This action cannot be undone. The project will be permanently deleted.",
      cancel: "Cancel",
      confirm: "Delete",
    },
    errors: {
      deleteError: "Error deleting project. Please try again.",
    },
    messages: {
      deleteSuccess: "Project deleted successfully",
    },
  },
};
