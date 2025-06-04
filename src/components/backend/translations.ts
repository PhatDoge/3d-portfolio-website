//admin-backend translations
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
    title: "Lista de Habilidades",
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
    namePlaceholder: "ejemplo: Node JS, React JS",
    iconLabel: "URL de Icono",
    iconPlaceholder: "https://ejemplo.com/icon.png",
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
    headerDetails: "Detalles de Proyecto",
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
    headerDetails: "Project Details",
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

export const serviceDetailsTranslations = {
  es: {
    headerDetails: "Detalles de Servicios",
    header: "Cabezera de Servicio",
    headerPlaceholder: "Ingresa la cabezera de tu servicio",
    title: "Titulo del Servicio",
    titlePlaceholder: "Ingresa el titulo de tu servicio",
    summary: "Descripción del Servicio",
    summaryPlaceholder: "Ingresa la descripción de tu servicio",
    saveDetails: "Guardar Detalles del Servicio",
    loadingServiceDetails: "Cargando detalles del servicio...",
    // Form validation messages
    titleMinLength: "El titulo debe tener al menos 2 caracteres.",
    titleMaxLength: "El titulo no debe exceder 50 caracteres.",
    headerMinLength: "La cabezera debe tener al menos 2 caracteres.",
    headerMaxLength: "La cabezera no debe exceder 50 caracteres.",
    descriptionMinLength: "La descripción debe tener al menos 2 caracteres.",
    descriptionMaxLength: "La descripción no debe exceder 1000 caracteres.",
  },
  en: {
    headerDetails: "Service Details",
    header: "Service Header",
    headerPlaceholder: "Enter your service header",
    title: "Service Title",
    titlePlaceholder: "Enter your service title",
    summary: "Service Description",
    summaryPlaceholder: "Enter your service description",
    saveDetails: "Save Service Details",
    loadingServiceDetails: "Loading service details...",
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

export const workExperienceTranslations = {
  es: {
    // Form title
    cardTitle: "Crear Experiencia Laboral",

    // Form labels
    companyIcon: "Icono de la Empresa",
    company: "Empresa",
    jobTitle: "Título del Puesto",
    startDate: "Fecha de Inicio",
    endDate: "Fecha de Finalización",
    currentJob: "Trabajo Actual",
    responsibilities: "Descripción de Responsabilidades",

    // Placeholders
    companyPlaceholder: "Nombre de la empresa",
    jobTitlePlaceholder: "Tu puesto de trabajo",
    startDatePlaceholder: "Selecciona fecha de inicio",
    endDatePlaceholder: "Selecciona fecha de finalización",
    responsibilityPlaceholder: "Escribe una responsabilidad y presiona Enter",

    // Button states
    submitButton: "Crear Experiencia",
    submitButtonLoading: "Creando experiencia...",

    // Validation messages
    iconRequired: "Please select an icon image.",
    iconRequiredCustom: "Please select an icon.",
    workplaceMinLength: "Workplace must be at least 2 characters.",
    workTitleMinLength: "Work title must be at least 2 characters.",
    descriptionMinLength: "Description must be at least 10 characters.",
    startDateRequired: "Start date is required.",
    endDateValidation:
      "End date must be after start date, or check 'Current Job' if this is your current position.",
    descriptionRequired: "Please add at least one description bullet point.",
    submissionError: "Failed to create work experience. Please try again.",
  },
  en: {
    // Form title
    cardTitle: "Create Work Experience",

    // Form labels
    companyIcon: "Company Icon",
    company: "Company",
    jobTitle: "Job Title",
    startDate: "Start Date",
    endDate: "End Date",
    currentJob: "Current Job",
    responsibilities: "Job Responsibilities",

    // Placeholders
    companyPlaceholder: "Company name",
    jobTitlePlaceholder: "Your job position",
    startDatePlaceholder: "Select start date",
    endDatePlaceholder: "Select end date",
    responsibilityPlaceholder: "Write a responsibility and press Enter",

    // Button states
    submitButton: "Create Experience",
    submitButtonLoading: "Creating experience...",

    // Validation messages
    iconRequired: "Please select an icon image.",
    iconRequiredCustom: "Please select an icon.",
    workplaceMinLength: "Workplace must be at least 2 characters.",
    workTitleMinLength: "Work title must be at least 2 characters.",
    descriptionMinLength: "Description must be at least 10 characters.",
    startDateRequired: "Start date is required.",
    endDateValidation:
      "End date must be after start date, or check 'Current Job' if this is your current position.",
    descriptionRequired: "Please add at least one description bullet point.",
    submissionError: "Failed to create work experience. Please try again.",
  },
};

export const experienceListTranslations = {
  es: {
    title: "Lista de Experiencias",
    loading: "Cargando experiencias...",
    noExperiences: "No hay experiencias creadas aún.",
    tableHeaders: {
      icon: "Icono",
      company: "Empresa",
      position: "Puesto",
      description: "Descripción",
      startDate: "Inicio",
      endDate: "Fin",
      actions: "Acciones",
    },
    noIcon: "Sin icono",
    current: "Actual",
    moreItems: "más",
    deleteDialog: {
      title: "¿Eliminar experiencia?",
      description:
        "Esta acción no se puede deshacer. La experiencia será eliminada permanentemente.",
      cancel: "Cancelar",
      confirm: "Eliminar",
    },
    deleteError: "Error al eliminar la experiencia. Inténtalo de nuevo.",
  },
  en: {
    title: "All Experiences",
    loading: "Loading experiences...",
    noExperiences: "No experiences created yet.",
    tableHeaders: {
      icon: "Icon",
      company: "Company",
      position: "Position",
      description: "Description",
      startDate: "Start",
      endDate: "End",
      actions: "Actions",
    },
    noIcon: "No icon",
    current: "Current",
    moreItems: "more",
    deleteDialog: {
      title: "Delete experience?",
      description:
        "This action cannot be undone. The experience will be permanently deleted.",
      cancel: "Cancel",
      confirm: "Delete",
    },
    deleteError: "Error deleting experience. Please try again.",
  },
};

export const experienceUpdateTranslations = {
  es: {
    editExperience: "Editar Experiencia",
    companyIcon: "Icono de la Empresa",
    company: "Empresa",
    companyPlaceholder: "Nombre de la empresa",
    jobTitle: "Título del Puesto",
    jobTitlePlaceholder: "Tu puesto de trabajo",
    currentJob: "Trabajo Actual",
    startDate: "Fecha de Inicio",
    endDate: "Fecha de Finalización",
    selectStartDate: "Selecciona fecha de inicio",
    selectEndDate: "Selecciona fecha de finalización",
    responsibilitiesDescription: "Descripción de Responsabilidades",
    responsibilityPlaceholder: "Escribe una responsabilidad y presiona Enter",
    cancel: "Cancelar",
    updating: "Actualizando...",
    updateExperience: "Actualizar Experiencia",
    addOneDescription: "Please add at least one description bullet point.",
    updateFailed: "Failed to update work experience. Please try again.",
    endDateValidation:
      "End date must be after start date, or check 'Current Job' if this is your current position.",
  },
  en: {
    editExperience: "Edit Experience",
    companyIcon: "Company Icon",
    company: "Company",
    companyPlaceholder: "Company name",
    jobTitle: "Job Title",
    jobTitlePlaceholder: "Your job position",
    currentJob: "Current Job",
    startDate: "Start Date",
    endDate: "End Date",
    selectStartDate: "Select start date",
    selectEndDate: "Select end date",
    responsibilitiesDescription: "Responsibilities Description",
    responsibilityPlaceholder: "Write a responsibility and press Enter",
    cancel: "Cancel",
    updating: "Updating...",
    updateExperience: "Update Experience",
    addOneDescription: "Please add at least one description bullet point.",
    updateFailed: "Failed to update work experience. Please try again.",
    endDateValidation:
      "End date must be after start date, or check 'Current Job' if this is your current position.",
  },
};

export const serviceTranslations = {
  es: {
    // Page Title
    pageTitle: "Crear Nuevo Servicio",

    // Section Headers
    frontSideHeader: "Crea un Nuevo Servicio",

    // Form Fields Labels
    serviceTitle: "Título del Servicio",
    serviceIcon: "Icono del Servicio",
    subtitle: "Subtítulo (Opcional)",
    badgeText: "Texto de Etiqueta (Opcional)",
    accentColor: "Color de Acento (Opcional)",
    detailedDescription: "Descripción Detallada",
    keyFeatures: "Características Clave",
    technologies: "Tecnologías",
    experienceLevel: "Nivel de Experiencia",
    projectCount: "Número de Proyectos",
    category: "Categoría",
    buttonText: "Texto del Botón",
    buttonLink: "Enlace del Botón",
    startingPrice: "Precio Inicial (Opcional)",
    currency: "Moneda",
    priceType: "Tipo de Precio",
    deliveryTime: "Tiempo de Entrega",
    displayOrder: "Orden de Visualización",

    // Placeholders
    titlePlaceholder: "ej. Diseño Web, Desarrollador React",
    subtitlePlaceholder: "ej. UI/UX Design, Frontend Development",
    badgePlaceholder: "ej. Popular, Nuevo, Especialidad",
    descriptionPlaceholder: "Descripción detallada del servicio...",
    featurePlaceholder: "Escribe una característica y presiona Enter",
    technologyPlaceholder: "Escribe una tecnología y presiona Enter",
    ctaTextPlaceholder: "ej. Ver Proyectos, Contactar",
    ctaLinkPlaceholder: "ej. /portfolio/design, /contact",
    pricePlaceholder: "500",
    currencyPlaceholder: "$",
    deliveryPlaceholder: "ej. 2-3 semanas",
    orderPlaceholder: "1",

    // Select Options
    selectLevel: "Seleccionar nivel",
    selectCategory: "Seleccionar categoría",
    selectPriceType: "Tipo",
    beginner: "Principiante",
    intermediate: "Intermedio",
    expert: "Experto",
    design: "Diseño",
    development: "Desarrollo",
    consulting: "Consultoría",
    perProject: "Por Proyecto",
    perHour: "Por Hora",
    fixedPrice: "Precio Fijo",

    // Buttons and Actions
    createService: "Crear Servicio",
    creatingService: "Creando Servicio...",

    // Helper Text
    orderHelper: "Número más bajo aparece primero (1-100)",

    // Required Fields
    required: "*",

    // Error Messages
    selectIcon: "Por favor selecciona un icono.",
    addFeature: "Por favor agrega al menos una característica clave.",
    addTechnology: "Por favor agrega al menos una tecnología.",
    createError: "Error al crear servicio. Por favor intenta de nuevo.",
  },
  en: {
    // Page Title
    pageTitle: "Create New Service",

    // Section Headers
    frontSideHeader: "Create a New Service",

    // Form Fields Labels
    serviceTitle: "Service Title",
    serviceIcon: "Service Icon",
    subtitle: "Subtitle (Optional)",
    badgeText: "Badge Text (Optional)",
    accentColor: "Accent Color (Optional)",
    detailedDescription: "Detailed Description",
    keyFeatures: "Key Features",
    technologies: "Technologies",
    experienceLevel: "Experience Level",
    projectCount: "Project Count",
    category: "Category",
    buttonText: "Button Text",
    buttonLink: "Button Link",
    startingPrice: "Starting Price (Optional)",
    currency: "Currency",
    priceType: "Price Type",
    deliveryTime: "Delivery Time",
    displayOrder: "Display Order",

    // Placeholders
    titlePlaceholder: "e.g. Web Design, React Developer",
    subtitlePlaceholder: "e.g. UI/UX Design, Frontend Development",
    badgePlaceholder: "e.g. Popular, New, Specialty",
    descriptionPlaceholder: "Detailed service description...",
    featurePlaceholder: "Type a feature and press Enter",
    technologyPlaceholder: "Type a technology and press Enter",
    ctaTextPlaceholder: "e.g. View Projects, Contact",
    ctaLinkPlaceholder: "e.g. /portfolio/design, /contact",
    pricePlaceholder: "500",
    currencyPlaceholder: "$",
    deliveryPlaceholder: "e.g. 2-3 weeks",
    orderPlaceholder: "1",

    // Select Options
    selectLevel: "Select level",
    selectCategory: "Select category",
    selectPriceType: "Type",
    beginner: "Beginner",
    intermediate: "Intermediate",
    expert: "Expert",
    design: "Design",
    development: "Development",
    consulting: "Consulting",
    perProject: "Per Project",
    perHour: "Per Hour",
    fixedPrice: "Fixed Price",

    // Buttons and Actions
    createService: "Create Service",
    creatingService: "Creating Service...",

    // Helper Text
    orderHelper: "Lower number appears first (1-100)",

    // Required Fields
    required: "*",

    // Error Messages
    selectIcon: "Please select an icon.",
    addFeature: "Please add at least one key feature.",
    addTechnology: "Please add at least one technology.",
    createError: "Failed to create service. Please try again.",
  },
};

export const serviceListTranslations = {
  es: {
    // Page title
    allServices: "Todos los Servicios",

    // Loading and empty states
    loadingServices: "Cargando servicios...",
    noServicesYet: "No hay servicios creados aún.",

    // Table headers
    icon: "Icono",
    titleTag: "Título/Tag",
    category: "Categoría",
    experience: "Experiencia",
    projects: "Proyectos",
    price: "Precio",
    order: "Orden",
    status: "Estado",
    actions: "Acciones",

    // Categories
    design: "Diseño",
    development: "Desarrollo",
    consulting: "Consultoría",

    // Experience levels
    beginner: "Principiante",
    intermediate: "Intermedio",
    expert: "Experto",

    // Price types
    project: "Por Proyecto",
    hour: "Por Hora",
    fixed: "Precio Fijo",

    // Status
    active: "Activo",
    inactive: "Inactivo",

    // Icons and placeholders
    noIcon: "Sin icono",

    // Action buttons
    editService: "Editar servicio",
    deleteService: "Eliminar servicio",

    // Delete confirmation dialog
    deleteServiceTitle: "¿Eliminar servicio?",
    deleteConfirmation:
      "Esta acción no se puede deshacer. El servicio será marcado como inactivo.",
    cancel: "Cancelar",
    delete: "Eliminar",

    // Error messages
    deleteError: "Error al eliminar el servicio. Inténtalo de nuevo.",
    statusUpdateError: "Error al actualizar el estado del servicio.",
  },
  en: {
    // Page title
    allServices: "All Services",

    // Loading and empty states
    loadingServices: "Loading services...",
    noServicesYet: "No services created yet.",

    // Table headers
    icon: "Icon",
    titleTag: "Title/Tag",
    category: "Category",
    experience: "Experience",
    projects: "Projects",
    price: "Price",
    order: "Order",
    status: "Status",
    actions: "Actions",

    // Categories
    design: "Design",
    development: "Development",
    consulting: "Consulting",

    // Experience levels
    beginner: "Beginner",
    intermediate: "Intermediate",
    expert: "Expert",

    // Price types
    project: "Per Project",
    hour: "Per Hour",
    fixed: "Fixed Price",

    // Status
    active: "Active",
    inactive: "Inactive",

    // Icons and placeholders
    noIcon: "No icon",

    // Action buttons
    editService: "Edit service",
    deleteService: "Delete service",

    // Delete confirmation dialog
    deleteServiceTitle: "Delete service?",
    deleteConfirmation:
      "This action cannot be undone. The service will be marked as inactive.",
    cancel: "Cancel",
    delete: "Delete",

    // Error messages
    deleteError: "Error deleting service. Please try again.",
    statusUpdateError: "Error updating service status.",
  },
};

export const serviceUpdateTranslations = {
  es: {
    // Header
    editService: "Editar Servicio",

    // Section Headers
    frontContent: "Contenido Frontal",
    backContent: "Contenido Posterior",

    // Form Labels
    serviceTitle: "Título del Servicio",
    serviceIcon: "Icono del Servicio",
    subtitle: "Subtítulo",
    badgeText: "Texto de Etiqueta",
    accentColor: "Color de Acento",
    description: "Descripción",
    keyFeatures: "Características Clave",
    technologies: "Tecnologías",
    experienceLevel: "Nivel de Experiencia",
    projects: "Proyectos",
    category: "Categoría",
    buttonText: "Texto del Botón",
    buttonLink: "Enlace del Botón",
    startingPrice: "Precio Inicial",
    displayOrder: "Orden",

    // Placeholders
    titlePlaceholder: "ej. Diseño Web",
    subtitlePlaceholder: "ej. UI/UX Design",
    badgePlaceholder: "ej. Popular",
    colorPlaceholder: "#00cea8",
    descriptionPlaceholder: "Descripción detallada...",
    featurePlaceholder: "Añadir característica (Enter)",
    technologyPlaceholder: "Añadir tecnología (Enter)",
    buttonTextPlaceholder: "Ver Proyectos",
    buttonLinkPlaceholder: "/portafolio",
    pricePlaceholder: "500",

    // Select Options
    selectOption: "Seleccionar",
    beginner: "Principiante",
    intermediate: "Intermedio",
    expert: "Experto",
    design: "Diseño",
    development: "Desarrollo",
    consulting: "Consultoría",

    // Buttons
    cancel: "Cancelar",
    updateService: "Actualizar Servicio",
    updating: "Actualizando...",

    // Error Messages
    addFeatureError: "Please add at least one key feature.",
    addTechnologyError: "Please add at least one technology.",
    updateError: "Failed to update service. Please try again.",

    // Required indicator
    required: "*",
  },
  en: {
    // Header
    editService: "Edit Service",

    // Section Headers
    frontContent: "Front Content",
    backContent: "Back Content",

    // Form Labels
    serviceTitle: "Service Title",
    serviceIcon: "Service Icon",
    subtitle: "Subtitle",
    badgeText: "Badge Text",
    accentColor: "Accent Color",
    description: "Description",
    keyFeatures: "Key Features",
    technologies: "Technologies",
    experienceLevel: "Experience Level",
    projects: "Projects",
    category: "Category",
    buttonText: "Button Text",
    buttonLink: "Button Link",
    startingPrice: "Starting Price",
    displayOrder: "Display Order",

    // Placeholders
    titlePlaceholder: "e.g. Web Design",
    subtitlePlaceholder: "e.g. UI/UX Design",
    badgePlaceholder: "e.g. Popular",
    colorPlaceholder: "#00cea8",
    descriptionPlaceholder: "Detailed description...",
    featurePlaceholder: "Add feature (Enter)",
    technologyPlaceholder: "Add technology (Enter)",
    buttonTextPlaceholder: "View Projects",
    buttonLinkPlaceholder: "/portfolio",
    pricePlaceholder: "500",

    // Select Options
    selectOption: "Select",
    beginner: "Beginner",
    intermediate: "Intermediate",
    expert: "Expert",
    design: "Design",
    development: "Development",
    consulting: "Consulting",

    // Buttons
    cancel: "Cancel",
    updateService: "Update Service",
    updating: "Updating...",

    // Error Messages
    addFeatureError: "Please add at least one key feature.",
    addTechnologyError: "Please add at least one technology.",
    updateError: "Failed to update service. Please try again.",

    // Required indicator
    required: "*",
  },
};

//SIDEBAR TRANSLATIONS
export const sidebarTranslations = {
  es: {
    // Main navigation items
    user: "Usuario",
    introduction: "Introducción",
    skills: "Habilidades",
    technologies: "Tecnologías",
    projects: "Proyectos",
    experience: "Experiencia",
    services: "Servicios",

    // Submenu items
    createSkill: "Crear Habilidad",
    allSkills: "Lista de Habilidades",
    createProject: "Crear Proyecto",
    allProjects: "Lista de Proyectos",
    createExperience: "Crear Experiencia",
    allExperiences: "Lista deExperiencias",
    createService: "Crear Servicio",
    allServices: "Lista de Servicios",
    serviceDetails: "Cambiar detalles",
    projectDetails: "Cambiar detalles",
    experienceDetails: "Cambiar detalles",
    skillDetails: "Cambiar detalles",

    // Actions and accessibility
    logout: "Cerrar Sesión",
    mainNavigation: "Navegación principal",
    goToHome: "Ir al inicio",
    navigateTo: "Navegar a",
    expand: "Expandir",
    collapse: "Contraer",
    submenu: "submenú",
    submenuOf: "Submenú de",
    logoAlt: "Logo de Alonso",
  },
  en: {
    // Main navigation items
    user: "User",
    introduction: "Introduction",
    skills: "Skills",
    technologies: "Technologies",
    projects: "Projects",
    experience: "Experience",
    services: "Services",

    // Submenu items
    createSkill: "Create Skill",
    allSkills: "All Skills",
    createProject: "Create Project",
    allProjects: "All Projects",
    createExperience: "Create Experience",
    allExperiences: "All Experiences",
    createService: "Create Service",
    allServices: "All Services",
    serviceDetails: "Change details",
    projectDetails: "Change details",
    experienceDetails: "Change details",
    skillDetails: "Change details",

    // Actions and accessibility
    logout: "Logout",
    mainNavigation: "Main navigation",
    goToHome: "Go to home",
    navigateTo: "Navigate to",
    expand: "Expand",
    collapse: "Collapse",
    submenu: "submenu",
    submenuOf: "Submenu of",
    logoAlt: "Alonso's Logo",
  },
};

export const experienceDetailsTranslations = {
  es: {
    headerDetails: "Detalles de Experiencia",
    title: "Título",
    header: "Cabecera",
    summary: "Descripción",
    titlePlaceholder: "Ingresa el título de tu experiencia",
    headerPlaceholder: "Ingresa la cabecera de tu experiencia",
    summaryPlaceholder: "Ingresa la descripción de tu experiencia",
    saveDetails: "Guardar Detalles",
    loadingExperienceDetails: "Cargando detalles de experiencia...",
    titleMinLength: "El título debe tener al menos 2 caracteres",
    titleMaxLength: "El título no puede exceder 50 caracteres",
    headerMinLength: "La cabecera debe tener al menos 2 caracteres",
    headerMaxLength: "La cabecera no puede exceder 50 caracteres",
    descriptionMinLength: "La descripción debe tener al menos 2 caracteres",
    descriptionMaxLength: "La descripción no puede exceder 1000 caracteres",
  },
  en: {
    headerDetails: "Experience Details",
    title: "Title",
    header: "Header",
    summary: "Description",
    titlePlaceholder: "Enter your experience title",
    headerPlaceholder: "Enter your experience header",
    summaryPlaceholder: "Enter your experience description",
    saveDetails: "Save Details",
    loadingExperienceDetails: "Loading experience details...",
    titleMinLength: "Title must be at least 2 characters long",
    titleMaxLength: "Title cannot exceed 50 characters",
    headerMinLength: "Header must be at least 2 characters long",
    headerMaxLength: "Header cannot exceed 50 characters",
    descriptionMinLength: "Description must be at least 2 characters long",
    descriptionMaxLength: "Description cannot exceed 1000 characters",
  },
};

export const skillDetailsTranslations = {
  es: {
    // Main header
    headerDetails: "Detalles de Habilidades",

    // Form labels
    header: "Encabezado",
    title: "Título",
    summary: "Resumen",

    // Placeholders
    headerPlaceholder: "Ingresa el encabezado de tus habilidades",
    titlePlaceholder: "Ingresa el título de tus habilidades",
    summaryPlaceholder: "Ingresa un resumen de tus habilidades",

    // Validation messages
    titleMinLength: "El título debe tener al menos 2 caracteres",
    titleMaxLength: "El título no puede tener más de 50 caracteres",
    headerMinLength: "El encabezado debe tener al menos 2 caracteres",
    headerMaxLength: "El encabezado no puede tener más de 50 caracteres",
    descriptionMinLength: "La descripción debe tener al menos 2 caracteres",
    descriptionMaxLength:
      "La descripción no puede tener más de 1000 caracteres",

    // Button and loading
    saveDetails: "Guardar Detalles",
    loadingSkillDetails: "Cargando detalles de habilidades...",
  },
  en: {
    // Main header
    headerDetails: "Skill Details",

    // Form labels
    header: "Header",
    title: "Title",
    summary: "Summary",

    // Placeholders
    headerPlaceholder: "Enter your skills header",
    titlePlaceholder: "Enter your skills title",
    summaryPlaceholder: "Enter a summary of your skills",

    // Validation messages
    titleMinLength: "Title must be at least 2 characters",
    titleMaxLength: "Title cannot be more than 50 characters",
    headerMinLength: "Header must be at least 2 characters",
    headerMaxLength: "Header cannot be more than 50 characters",
    descriptionMinLength: "Description must be at least 2 characters",
    descriptionMaxLength: "Description cannot be more than 1000 characters",

    // Button and loading
    saveDetails: "Save Details",
    loadingSkillDetails: "Loading skill details...",
  },
};
