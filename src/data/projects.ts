export type ProjectStatus = "live" | "in-progress" | "prototype";
export type ProjectCategory = "saas" | "webapp" | "mobile" | "ia" | "prototype";

export interface Project {
  id: string;
  name: string;
  description: string;
  longDescription?: string;
  image: string;
  demoVideo?: string;
  featured?: boolean;
  technologies: string[];
  status: ProjectStatus;
  category: ProjectCategory;
  progress?: number;
  launchDate?: string;
  liveUrl?: string;
  githubUrl?: string;
  stats?: {
    users?: string;
    performance?: string;
    roi?: string;
  };
}

export const projects: Project[] = [
  {
    id: "baarali",
    name: "Baarali",
    description:
      "Plateforme d'orchestration d'agents IA pour entreprises. Gouvernance, tâches et coordination multi-agents en temps réel.",
    longDescription:
      "Baarali est une plateforme de contrôle d'entreprise pilotée par l'IA qui permet de recruter, orchestrer et superviser des agents intelligents. Elle offre un système de gouvernance, d'assignation de tâches, de suivi de progression et de coordination entre agents humains et artificiels.",
    image: "/projects/baarali.png",
    featured: true,
    technologies: ["Next.js", "TypeScript", "Tailwind CSS", "Prisma", "PostgreSQL", "OpenAI", "Node.js"],
    status: "live",
    category: "saas",
    liveUrl: "https://baarali.com",
    stats: { users: "Entreprises", performance: "99.9%", roi: "10x" },
  },
  {
    id: "openbaara",
    name: "OpenBaara",
    description:
      "Écosystème open-source et SaaS pour la gestion de communautés tech et de projets collaboratifs.",
    longDescription:
      "OpenBaara est une suite d'outils open-source et une plateforme SaaS dédiée à l'accompagnement des développeurs et créateurs africains. Elle centralise les ressources, la formation, la collaboration sur des projets tech et l'accès à des opportunités.",
    image: "/projects/openbaara.png",
    featured: true,
    technologies: ["Next.js", "TypeScript", "Tailwind CSS", "Supabase", "Stripe", "Vercel"],
    status: "live",
    category: "saas",
    liveUrl: "https://openbaara.com",
    stats: { users: "Communauté", performance: "99.9%", roi: "5x" },
  },
  {
    id: "outio",
    name: "Outio",
    description:
      "Application de productivité et gestion de tâches pensée pour les équipes distantes en Afrique.",
    longDescription:
      "Outio est une application web et mobile de productivité qui adapte les meilleures pratiques de gestion de projet aux réalités des équipes africaines : faible connectivité, paiements locaux, collaboration async et intégrations mobile money.",
    image: "/projects/outio.png",
    featured: true,
    technologies: ["React Native", "Next.js", "Node.js", "MongoDB", "Redis", "WebSocket"],
    status: "in-progress",
    category: "mobile",
    progress: 65,
    launchDate: "Q3 2026",
    stats: { users: "Beta", performance: "98%", roi: "3x" },
  },
  {
    id: "wenastudio",
    name: "WENA Studio",
    description:
      "Plateforme SaaS d'intelligence artificielle tout-en-un pour créateurs et entrepreneurs.",
    longDescription:
      "WENA Studio est une plateforme SaaS complète qui centralise l'accès à des agents IA spécialisés, la génération de contenu texte, images et vidéos, ainsi que des outils de productivité avancés.",
    image: "/projects/wenastudio.png",
    technologies: ["Next.js", "TypeScript", "Tailwind CSS", "OpenAI", "Prisma", "PostgreSQL", "Vercel"],
    status: "live",
    category: "saas",
    liveUrl: "https://wenastudio.com",
    stats: { users: "1K+", performance: "99.9%", roi: "5x" },
  },
  {
    id: "cv-generator",
    name: "CV Generator IA",
    description:
      "Générateur de CV professionnel assisté par IA avec templates premium et export PDF.",
    image: "/projects/cv-gen.png",
    technologies: ["Next.js", "OpenRouter", "PDF-lib", "Framer Motion"],
    status: "live",
    category: "ia",
    stats: { users: "500+", performance: "99%", roi: "2x" },
  },
  {
    id: "saas-crm",
    name: "CRM SaaS Platform",
    description:
      "Plateforme CRM complète pour PME avec gestion contacts, pipeline ventes et analytics.",
    image: "/projects/crm-saas.png",
    technologies: ["Next.js", "TypeScript", "PostgreSQL", "Stripe", "Tailwind"],
    status: "live",
    category: "saas",
    stats: { users: "500+", performance: "99.9%", roi: "3x" },
  },
];
