export interface Experience {
  period: string;
  title: string;
  company: string;
  description: string;
  achievements: string[];
  current?: boolean;
}

export const experiences: Experience[] = [
  {
    period: "2024 - Présent",
    title: "Fondateur & CEO",
    company: "OpenBaara Corp",
    description:
      "Création et direction de plusieurs ventures tech (Baarali, OpenBaara, Outio) avec une vision centrée sur l'IA et l'écosystème africain.",
    achievements: [
      "Lancement de Baarali : orchestration d'agents IA en production",
      "Construction d'OpenBaara : communauté tech africaine",
      "Développement d'Outio : productivité pour équipes distantes",
    ],
    current: true,
  },
  {
    period: "2022 - 2024",
    title: "Développeur Full Stack Senior & Lead Tech",
    company: "Indépendant / Freelance",
    description:
      "Développement de produits SaaS et accompagnement clients sur des projets web ambitieux avant la création d'OpenBaara Corp.",
    achievements: [
      "Architecture de 5 plateformes à fort trafic",
      "3 SaaS déployés en production",
      "Lead technique d'équipes distribuées",
    ],
  },
  {
    period: "2020 - 2022",
    title: "Développeur Full Stack",
    company: "Digital Agency",
    description:
      "Développement d'applications web et mobiles pour divers clients B2B.",
    achievements: [
      "Stack React / Node.js / Next.js",
      "10+ projets livrés pour clients B2B",
      "Intégration API et paiements mobile money",
    ],
  },
];
