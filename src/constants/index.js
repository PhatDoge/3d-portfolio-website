import {
  mobile,
  backend,
  creator,
  web,
  javascript,
  typescript,
  html,
  css,
  reactjs,
  redux,
  tailwind,
  nodejs,
  mongodb,
  git,
  figma,
  docker,
  meta,
  starbucks,
  tesla,
  php,
  ux,
  freelancer,
  shopify,
  carrent,
  jobit,
  tripguide,
  threejs,
} from "../assets";

export const navLinks = [
  {
    id: "about",
    title: "Sobre",
  },
  {
    id: "work",
    title: "Trabajos",
  },
  {
    id: "contact",
    title: "Contacto",
  },
  {
    id: "projects",
    title: "Proyectos",
  },
  {
    id: "services",
    title: "Servicios",
  },
];

export const sidebarLinks = [
  {
    id: "dashboard",
    title: "Dashboard",
  },
  {
    id: "documents",
    title: "Documentos",
  },
  {
    id: "project-card",
    title: "Project Card",
  },
];

const services = [
  {
    title: "Desarrollador Web",
    icon: web,
  },
  {
    title: "Desarrollador React",
    icon: mobile,
  },
  {
    title: "Desarrollador Frontend",
    icon: backend,
  },
  {
    title: "Diseño Web",
    icon: creator,
  },
];

const technologies = [
  {
    name: "HTML 5",
    icon: html,
  },
  {
    name: "CSS 3",
    icon: css,
  },
  {
    name: "JavaScript",
    icon: javascript,
  },
  {
    name: "TypeScript",
    icon: typescript,
  },
  {
    name: "React JS",
    icon: reactjs,
  },
  {
    name: "Redux Toolkit",
    icon: redux,
  },
  {
    name: "Tailwind CSS",
    icon: tailwind,
  },
  {
    name: "Node JS",
    icon: nodejs,
  },
  {
    name: "MongoDB",
    icon: mongodb,
  },
  {
    name: "Three JS",
    icon: threejs,
  },
  {
    name: "git",
    icon: git,
  },
  {
    name: "figma",
    icon: figma,
  },
  {
    name: "docker",
    icon: docker,
  },
];

const experiences = [
  {
    title: "Php, Aspx Desarrollador",
    company_name: "Rehelu LTDA.",
    icon: php,
    iconBg: "#383E56",
    date: "Julio 2016 - Abril 2017",
    points: [
      "Desarrollo y mantenimiento de aplicaciones web utilizando tecnologías como PHP, ASP.NET, HTML, CSS y JavaScript.",
      "Colaboración con equipos multifuncionales, incluidos diseñadores, clientes y otros desarrolladores para crear productos de alta calidad.",
      "Implementación de diseño responsivo que garantize la compatibilidad entre navegadores.",
      "Participación en revisiones de código y proporcionar retroalimentación constructiva con otros desarrolladores.",
    ],
  },
  {
    title: "Desarrollador Frontend",
    company_name: "Infocom LTDA",
    icon: ux,
    iconBg: "#E6DEDD",
    date: "Febrero 2018 - Diciembre 2018",
    points: [
      "Desarrollo y mantenimiento de aplicaciones web utilizando tecnologías como PHP, HTML, CSS y JavaScript.",
      "Desarrollo de interfaces de usuario interactivas y atractivas utilizando programas como Photoshop, Ilustrator y Adobe Xd.",
      "Implementación de diseño responsivo que garantize la compatibilidad entre navegadores.",
      "Participación en revisiones de código y proporcionar retroalimentación constructiva con otros desarrolladores.",
    ],
  },
  {
    title: "Desarrollador Web",
    company_name: "Freelance",
    icon: freelancer,
    iconBg: "#383E56",
    date: "Feb 2020- Presente",
    points: [
      "Desarrollar paginas web usando tecnologias como HTML5, CSS3, JS, React.js, Tailwind, Next.js entre varios.",
      "Desarrollar aplicaciones web utilizando tecnologías como Node.js, Express.js, MySql, PHP, .Net, Python.",
      "Implementación de diseño responsivo que garantize la compatibilidad entre navegadores.",
      "Mantener una comunicacion cercana con los clientes y entender sus necesidades, objetivos y ayudandolos a plasmar sus ideas",
    ],
  },
  // {
  //   title: "Full stack Developer",
  //   company_name: "Meta",
  //   icon: meta,
  //   iconBg: "#E6DEDD",
  //   date: "Jan 2023 - Present",
  //   points: [
  //     "Developing and maintaining web applications using React.js and other related technologies.",
  //     "Collaborating with cross-functional teams including designers, product managers, and other developers to create high-quality products.",
  //     "Implementing responsive design and ensuring cross-browser compatibility.",
  //     "Participating in code reviews and providing constructive feedback to other developers.",
  //   ],
  // },
];

export { services, technologies, experiences };
