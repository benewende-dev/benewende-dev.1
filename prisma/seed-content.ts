import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Seed Projects
  const projectCount = await prisma.project.count();
  if (projectCount === 0) {
    await prisma.project.createMany({
      data: [
        {
          name: "CRM SaaS Platform",
          description: "Plateforme CRM compl\u00e8te pour PME avec gestion contacts, pipeline ventes et analytics.",
          image: "/projects/crm-saas.png",
          technologies: JSON.stringify(["Next.js", "TypeScript", "PostgreSQL", "Stripe", "Tailwind"]),
          status: "live", category: "saas",
          liveUrl: "https://example.com", githubUrl: "https://github.com/benewende",
          statsUsers: "500+", statsPerf: "99.9%", statsRoi: "3x", sortOrder: 0,
        },
        {
          name: "AI Content Generator",
          description: "Outil de g\u00e9n\u00e9ration de contenu marketing propuls\u00e9 par IA multi-mod\u00e8les.",
          image: "/projects/ai-content.png",
          technologies: JSON.stringify(["React", "Node.js", "OpenAI", "MongoDB", "Redis"]),
          status: "live", category: "ia",
          liveUrl: "https://example.com", githubUrl: "https://github.com/benewende",
          statsUsers: "1.2K", statsPerf: "98%", statsRoi: "5x", sortOrder: 1,
        },
        {
          name: "E-Commerce Platform",
          description: "Marketplace multi-vendeurs avec paiements mobile money et livraison int\u00e9gr\u00e9e.",
          image: "/projects/ecommerce.png",
          technologies: JSON.stringify(["Next.js", "Prisma", "Stripe", "AWS S3", "Tailwind"]),
          status: "live", category: "webapp",
          liveUrl: "https://example.com",
          statsUsers: "2K+", statsPerf: "97%", statsRoi: "4x", sortOrder: 2,
        },
        {
          name: "Analytics Dashboard SaaS",
          description: "Dashboard analytics temps r\u00e9el avec visualisation avanc\u00e9e et rapports automatis\u00e9s.",
          image: "/projects/analytics.png",
          technologies: JSON.stringify(["Next.js", "D3.js", "PostgreSQL", "WebSocket", "Docker"]),
          status: "in-progress", category: "saas",
          progress: 75, launchDate: "Q2 2026",
          githubUrl: "https://github.com/benewende", sortOrder: 3,
        },
        {
          name: "FinTech Mobile App",
          description: "Application mobile de gestion financi\u00e8re avec IA pr\u00e9dictive pour le march\u00e9 africain.",
          image: "/projects/fintech.png",
          technologies: JSON.stringify(["React Native", "Node.js", "PostgreSQL", "TensorFlow"]),
          status: "in-progress", category: "mobile",
          progress: 45, launchDate: "Q3 2026", sortOrder: 4,
        },
        {
          name: "CV Generator IA",
          description: "G\u00e9n\u00e9rateur de CV professionnel assist\u00e9 par IA avec templates premium et export PDF.",
          image: "/projects/cv-gen.png",
          technologies: JSON.stringify(["Next.js", "OpenRouter", "PDF-lib", "Framer Motion"]),
          status: "in-progress", category: "ia",
          progress: 90, launchDate: "Q1 2026",
          githubUrl: "https://github.com/benewende", sortOrder: 5,
        },
        {
          name: "Chatbot Builder",
          description: "Plateforme no-code pour cr\u00e9er des chatbots IA connect\u00e9s \u00e0 vos donn\u00e9es.",
          image: "/projects/chatbot.png",
          technologies: JSON.stringify(["Next.js", "LangChain", "Pinecone", "OpenAI"]),
          status: "prototype", category: "ia",
          githubUrl: "https://github.com/benewende", sortOrder: 6,
        },
        {
          name: "DevOps Monitor",
          description: "Outil de monitoring infrastructure avec alertes intelligentes et auto-scaling.",
          image: "/projects/devops.png",
          technologies: JSON.stringify(["Go", "Docker", "Prometheus", "Grafana", "WebSocket"]),
          status: "prototype", category: "prototype",
          githubUrl: "https://github.com/benewende", sortOrder: 7,
        },
      ],
    });
    console.log("  \u2713 Projects seeded");
  }

  // Seed Services
  const serviceCount = await prisma.serviceItem.count();
  if (serviceCount === 0) {
    await prisma.serviceItem.createMany({
      data: [
        {
          icon: "Rocket", title: "D\u00e9veloppement SaaS",
          description: "Cr\u00e9ation de plateformes SaaS compl\u00e8tes, de l'id\u00e9e au d\u00e9ploiement.",
          priceXOF: "1 500 000 FCFA", priceEUR: "2 500\u20ac", priceUSD: "$2,700",
          features: JSON.stringify(["Architecture scalable", "Design UI/UX premium", "Int\u00e9gration paiements", "D\u00e9ploiement & formation", "Support 3 mois inclus"]),
          sortOrder: 0,
        },
        {
          icon: "Palette", title: "Web App Sur Mesure",
          description: "Sites web et applications sur mesure, modernes et performants.",
          priceXOF: "600 000 FCFA", priceEUR: "1 000\u20ac", priceUSD: "$1,100",
          features: JSON.stringify(["Design responsive", "SEO optimis\u00e9", "Animations fluides", "CMS int\u00e9gr\u00e9", "Livraison 2-4 semaines"]),
          sortOrder: 1,
        },
        {
          icon: "Bot", title: "Solutions IA",
          description: "Int\u00e9grations IA & automatisation pour booster votre productivit\u00e9.",
          priceXOF: "Sur devis", priceEUR: "Sur devis", priceUSD: "Sur devis",
          features: JSON.stringify(["Chatbots intelligents", "Automatisation workflows", "Analyse de donn\u00e9es", "API IA sur mesure", "Formation \u00e9quipe"]),
          sortOrder: 2,
        },
        {
          icon: "FileText", title: "G\u00e9n\u00e9rateur CV Pro",
          description: "CV IA personnalis\u00e9 en 5 minutes avec templates premium.",
          priceXOF: "3 000 FCFA/CV", priceEUR: "5\u20ac/CV", priceUSD: "$5/CV",
          features: JSON.stringify(["Templates professionnels", "Optimisation ATS", "Suggestions IA", "Export PDF haute qualit\u00e9", "Multilingue FR/EN"]),
          sortOrder: 3,
        },
        {
          icon: "GraduationCap", title: "Formation & Mentorat",
          description: "Accompagnement tech personnalis\u00e9 pour juniors et seniors.",
          priceXOF: "25 000 FCFA/h", priceEUR: "40\u20ac/h", priceUSD: "$45/h",
          features: JSON.stringify(["Sessions 1-on-1", "Plan personnalis\u00e9", "Projets pratiques", "Code review", "Suivi progression"]),
          sortOrder: 4,
        },
        {
          icon: "Lightbulb", title: "Consulting Tech",
          description: "Audit technique, conseils architecture et strat\u00e9gie digitale.",
          priceXOF: "150 000 FCFA", priceEUR: "250\u20ac", priceUSD: "$270",
          features: JSON.stringify(["Audit code & archi", "Recommandations", "Roadmap technique", "Benchmark concurrence", "Rapport d\u00e9taill\u00e9"]),
          sortOrder: 5,
        },
      ],
    });
    console.log("  \u2713 Services seeded");
  }

  // Seed Skills
  const skillCount = await prisma.skillGroup.count();
  if (skillCount === 0) {
    await prisma.skillGroup.createMany({
      data: [
        { category: "Frontend", skills: JSON.stringify([{name:"React.js / Next.js",level:95,label:"Expert"},{name:"TypeScript",level:95,label:"Expert"},{name:"Tailwind CSS",level:95,label:"Expert"},{name:"Framer Motion",level:85,label:"Avanc\u00e9"},{name:"Vue.js",level:75,label:"Interm\u00e9diaire"}]), sortOrder: 0 },
        { category: "Backend", skills: JSON.stringify([{name:"Node.js / Express",level:95,label:"Expert"},{name:"PostgreSQL",level:90,label:"Expert"},{name:"Prisma ORM",level:95,label:"Expert"},{name:"MongoDB",level:80,label:"Avanc\u00e9"},{name:"REST & GraphQL APIs",level:90,label:"Expert"}]), sortOrder: 1 },
        { category: "SaaS & Architecture", skills: JSON.stringify([{name:"Next.js App Router",level:95,label:"Expert"},{name:"Stripe Integration",level:90,label:"Expert"},{name:"NextAuth.js",level:90,label:"Expert"},{name:"Vercel / Deploiement",level:95,label:"Expert"},{name:"Architecture Microservices",level:80,label:"Avanc\u00e9"}]), sortOrder: 2 },
        { category: "IA & Automation", skills: JSON.stringify([{name:"OpenAI / OpenRouter API",level:90,label:"Expert"},{name:"LangChain",level:75,label:"Avanc\u00e9"},{name:"Prompt Engineering",level:90,label:"Expert"},{name:"Automatisation Workflows",level:85,label:"Avanc\u00e9"}]), sortOrder: 3 },
        { category: "DevOps & Outils", skills: JSON.stringify([{name:"Git / GitHub",level:95,label:"Expert"},{name:"Docker",level:80,label:"Avanc\u00e9"},{name:"CI/CD Pipelines",level:80,label:"Avanc\u00e9"},{name:"AWS / GCP",level:65,label:"Interm\u00e9diaire"}]), sortOrder: 4 },
      ],
    });
    console.log("  \u2713 Skills seeded");
  }

  // Seed Testimonials
  const testimonialCount = await prisma.testimonialItem.count();
  if (testimonialCount === 0) {
    await prisma.testimonialItem.createMany({
      data: [
        { name: "Amadou Diallo", role: "CEO", company: "TechStart Ouaga", content: "Excellent travail sur notre plateforme SaaS. Livraison dans les temps, code propre et communication parfaite. Je recommande vivement Benewende pour tout projet web ambitieux.", rating: 5, sortOrder: 0 },
        { name: "Fatou Traor\u00e9", role: "Directrice Marketing", company: "DigiAgence BF", content: "Le site e-commerce livr\u00e9 a d\u00e9pass\u00e9 nos attentes. Les performances sont au rendez-vous et l'exp\u00e9rience utilisateur est fluide. Un vrai professionnel.", rating: 5, sortOrder: 1 },
        { name: "Ibrahim Sanogo", role: "CTO", company: "FinPlus Africa", content: "Benewende a transform\u00e9 notre vision en un produit fonctionnel en un temps record. Son expertise en IA et architecture cloud est impressionnante.", rating: 5, sortOrder: 2 },
        { name: "Marie Compaor\u00e9", role: "Fondatrice", company: "EduTech Sahel", content: "Gr\u00e2ce \u00e0 Benewende, notre plateforme \u00e9ducative est utilis\u00e9e par des milliers d'\u00e9tudiants. Qualit\u00e9, r\u00e9activit\u00e9 et passion pour le code.", rating: 5, sortOrder: 3 },
        { name: "Ousmane Kabor\u00e9", role: "Product Manager", company: "AgriSmart BF", content: "Un d\u00e9veloppeur qui comprend les enjeux business. Le dashboard analytics qu'il a cr\u00e9\u00e9 nous a permis d'augmenter notre productivit\u00e9 de 40%.", rating: 5, sortOrder: 4 },
      ],
    });
    console.log("  \u2713 Testimonials seeded");
  }

  // Seed Experiences
  const expCount = await prisma.experienceItem.count();
  if (expCount === 0) {
    await prisma.experienceItem.createMany({
      data: [
        { period: "2024 - Pr\u00e9sent", title: "Cr\u00e9ateur de SaaS & Freelance", company: "Benewende.dev", description: "D\u00e9veloppement de produits SaaS et accompagnement clients sur des projets web ambitieux.", achievements: JSON.stringify(["D\u00e9veloppement de 5+ SaaS en production", "Accompagnement de 20+ clients", "95% de satisfaction client"]), current: true, sortOrder: 0 },
        { period: "2022 - 2024", title: "D\u00e9veloppeur Full Stack Senior", company: "Tech Company", description: "Lead technique sur des projets d'envergure avec une \u00e9quipe de d\u00e9veloppeurs.", achievements: JSON.stringify(["Architecture de plateformes \u00e0 fort trafic", "Lead technique \u00e9quipe de 4 d\u00e9veloppeurs", "R\u00e9duction temps de chargement de 60%"]), sortOrder: 1 },
        { period: "2020 - 2022", title: "D\u00e9veloppeur Full Stack", company: "Digital Agency", description: "D\u00e9veloppement d'applications web et mobiles pour divers clients B2B.", achievements: JSON.stringify(["Stack React / Node.js", "15+ projets livr\u00e9s", "D\u00e9veloppement de features cl\u00e9s"]), sortOrder: 2 },
      ],
    });
    console.log("  \u2713 Experiences seeded");
  }

  // Seed Site Settings
  const settingCount = await prisma.siteSetting.count();
  if (settingCount === 0) {
    await prisma.siteSetting.createMany({
      data: [
        {
          id: "hero",
          value: JSON.stringify({
            title: "Nous construisons",
            badge: "Agence digitale",
            typingTexts: [
              "des sites e-commerce qui convertissent",
              "des applications mobiles qui scalent",
              "des logiciels m\u00e9tier sur mesure",
              "des agents IA autonomes",
              "des formations qui forment vos \u00e9quipes",
            ],
            subtitle:
              "OpenBaara \u2014 agence digitale full-stack bas\u00e9e \u00e0 Ouagadougou. Web, App, Logiciel, IA Agentic, E-commerce et formations.",
            available: true,
            availableText: "Nouveaux projets ouverts",
            stats: [
              { value: "25+", label: "Projets livr\u00e9s" },
              { value: "6", label: "P\u00f4les d'expertise" },
              { value: "100%", label: "Sur mesure" },
            ],
          }),
        },
        {
          id: "site",
          value: JSON.stringify({
            name: "OpenBaara",
            email: "contact@openbaara.dev",
            phone: "+226 07 26 71 19",
            whatsapp: "2250708454592",
            location: "Ouagadougou, Burkina Faso",
            github: "https://github.com/benewende",
            linkedin: "https://linkedin.com/in/benewende",
            twitter: "https://x.com/benewende",
          }),
        },
        {
          id: "footer",
          value: JSON.stringify({
            copyright: "\u00a9 2026 OpenBaara \u00b7 Benewende.dev. Tous droits r\u00e9serv\u00e9s.",
            tagline: "Web \u00b7 App \u00b7 Logiciel \u00b7 IA Agentic \u00b7 E-commerce \u00b7 Cours",
            description:
              "Agence digitale full-stack : Web, App, Logiciel, IA Agentic, E-commerce et formations. Bas\u00e9e \u00e0 Ouagadougou.",
          }),
        },
      ],
    });
    console.log("  \u2713 Site settings seeded");
  }

  // Seed Courses
  const courseCount = await prisma.course.count();
  if (courseCount === 0) {
    await prisma.course.createMany({
      data: [
        {
          slug: "nextjs-saas-zero-to-launch",
          title: "Next.js SaaS : de z\u00e9ro au lancement",
          subtitle: "Construire un SaaS production-ready en 6 semaines",
          description:
            "Apprenez \u00e0 construire, d\u00e9ployer et monetiser une plateforme SaaS compl\u00e8te avec Next.js, Prisma et Stripe.",
          longDescription:
            "Cette formation intensive vous guide pas \u00e0 pas dans la cr\u00e9ation d'un SaaS rentable : architecture, auth, base de donn\u00e9es, paiement, d\u00e9ploiement et marketing. \u00c0 la fin, vous lancez VOTRE produit.",
          image: "/projects/placeholder.png",
          level: "intermediaire",
          duration: "6 semaines \u00b7 24h de contenu",
          language: "Fran\u00e7ais",
          instructorName: "Benewende",
          priceXOF: "150 000 FCFA",
          priceEUR: "250\u20ac",
          priceUSD: "$270",
          amountXOF: 150000,
          modules: JSON.stringify([
            { title: "Architecture & stack", description: "Next.js App Router, Prisma, NextAuth, Tailwind.", duration: "4h" },
            { title: "Auth & comptes utilisateurs", description: "OAuth, email/password, gestion des r\u00f4les.", duration: "3h" },
            { title: "Paiement & abonnements", description: "Stripe ou Mobile Money, webhooks, gestion plans.", duration: "4h" },
            { title: "Dashboard & UX produit", description: "Composants, tableaux, animations Framer Motion.", duration: "5h" },
            { title: "D\u00e9ploiement & monitoring", description: "Vercel/Railway, logs, alerting.", duration: "4h" },
            { title: "Go-to-market", description: "Landing, SEO, growth, premiers utilisateurs.", duration: "4h" },
          ]),
          tags: JSON.stringify(["Next.js", "SaaS", "Prisma", "Stripe", "TypeScript"]),
          status: "published",
          featured: true,
          sortOrder: 0,
        },
        {
          slug: "ia-agentic-pour-developpeurs",
          title: "IA Agentic pour d\u00e9veloppeurs",
          subtitle: "Construire des agents autonomes avec LLM, RAG et MCP",
          description:
            "Construisez des agents IA capables d'utiliser des outils, d'appeler des API et d'ex\u00e9cuter des t\u00e2ches complexes.",
          longDescription:
            "Une plong\u00e9e pratique dans l'IA Agentic : architecture d'agents, RAG, tool use, MCP, m\u00e9moire, orchestration et \u00e9valuation. Vous construirez 3 agents production-ready.",
          image: "/projects/placeholder.png",
          level: "avance",
          duration: "5 semaines \u00b7 20h de contenu",
          language: "Fran\u00e7ais",
          instructorName: "Benewende",
          priceXOF: "200 000 FCFA",
          priceEUR: "320\u20ac",
          priceUSD: "$350",
          amountXOF: 200000,
          modules: JSON.stringify([
            { title: "Fondamentaux LLM & API", description: "Anthropic, OpenRouter, prompting structur\u00e9.", duration: "3h" },
            { title: "Tool use & function calling", description: "Donner des outils \u00e0 votre agent.", duration: "4h" },
            { title: "RAG production-ready", description: "Vectorisation, recherche hybride, citations.", duration: "4h" },
            { title: "MCP & int\u00e9grations", description: "Connecter l'agent \u00e0 vos syst\u00e8mes.", duration: "4h" },
            { title: "M\u00e9moire & orchestration", description: "Long-running tasks, multi-agents.", duration: "5h" },
          ]),
          tags: JSON.stringify(["LLM", "Agents", "RAG", "MCP", "Python", "TypeScript"]),
          status: "published",
          featured: true,
          sortOrder: 1,
        },
        {
          slug: "ecommerce-mobile-money-afrique",
          title: "E-commerce & Mobile Money en Afrique",
          subtitle: "Lancer une boutique rentable adapt\u00e9e au march\u00e9 africain",
          description:
            "Strat\u00e9gie, mise en place, paiement Mobile Money (CinetPay, Wave) et marketing pour vendre en ligne en Afrique de l'Ouest.",
          longDescription:
            "Tout ce qu'il faut pour lancer une boutique en ligne qui vend r\u00e9ellement sur le march\u00e9 africain : choix techno, paiement Mobile Money, logistique, photos produits, ads.",
          image: "/projects/placeholder.png",
          level: "debutant",
          duration: "4 semaines \u00b7 12h de contenu",
          language: "Fran\u00e7ais",
          instructorName: "OpenBaara",
          priceXOF: "75 000 FCFA",
          priceEUR: "125\u20ac",
          priceUSD: "$135",
          amountXOF: 75000,
          modules: JSON.stringify([
            { title: "Choisir sa plateforme", description: "Shopify, WooCommerce, sur mesure.", duration: "2h" },
            { title: "Catalogue & photos produits", description: "Fiches qui vendent.", duration: "3h" },
            { title: "Mobile Money & paiement", description: "CinetPay, Wave, Orange Money.", duration: "3h" },
            { title: "Logistique & livraison", description: "Partenaires, retours, SAV.", duration: "2h" },
            { title: "Marketing & ads", description: "WhatsApp, TikTok, Meta Ads, SEO local.", duration: "2h" },
          ]),
          tags: JSON.stringify(["E-commerce", "Mobile Money", "Shopify", "Afrique", "Marketing"]),
          status: "coming-soon",
          featured: false,
          sortOrder: 2,
        },
      ],
    });
    console.log("  \u2713 Courses seeded");
  }

  // Seed Digital Products
  const productCount = await prisma.digitalProduct.count();
  if (productCount === 0) {
    await prisma.digitalProduct.createMany({
      data: [
        {
          slug: "nextjs-saas-starter-kit",
          title: "Next.js SaaS Starter Kit",
          description:
            "Template Next.js 14 production-ready : auth, Prisma, Stripe, dashboard, dark mode.",
          longDescription:
            "Boilerplate complet pour d\u00e9marrer un SaaS en 1 journ\u00e9e : NextAuth + OAuth, Prisma + Postgres, Stripe + webhooks, dashboard utilisateur, admin, dark mode, Tailwind + shadcn/ui. Code propre, document\u00e9, pr\u00eat \u00e0 d\u00e9ployer sur Vercel ou Railway.",
          image: "/projects/placeholder.png",
          category: "template",
          priceXOF: "35 000 FCFA",
          priceEUR: "59\u20ac",
          priceUSD: "$65",
          amountXOF: 35000,
          tags: JSON.stringify(["Next.js", "TypeScript", "Prisma", "Stripe", "SaaS"]),
          featured: true,
          sortOrder: 0,
        },
        {
          slug: "pack-agents-ia-n8n",
          title: "Pack 12 agents IA n8n",
          description:
            "12 workflows n8n pr\u00eats \u00e0 l'emploi : support, lead, RAG, scraping, social, email.",
          longDescription:
            "Une collection cur\u00e9e de 12 workflows n8n avec agents IA int\u00e9gr\u00e9s : assistant support client, qualification de leads, scraping intelligent, RAG sur Notion, automation r\u00e9seaux sociaux, email triage, et plus. Import direct, documentation FR incluse.",
          image: "/projects/placeholder.png",
          category: "script",
          priceXOF: "25 000 FCFA",
          priceEUR: "42\u20ac",
          priceUSD: "$45",
          amountXOF: 25000,
          tags: JSON.stringify(["n8n", "IA", "Automatisation", "Agents"]),
          featured: true,
          sortOrder: 1,
        },
        {
          slug: "shopify-theme-afro-modern",
          title: "Th\u00e8me Shopify \u00ab Afro Modern \u00bb",
          description:
            "Th\u00e8me Shopify haut de gamme optimis\u00e9 pour le march\u00e9 africain et Mobile Money.",
          longDescription:
            "Th\u00e8me Shopify 2.0 design moderne, Core Web Vitals top, blocs sur mesure, sections pour Mobile Money / WhatsApp / livraison locale. Pens\u00e9 pour les marques africaines.",
          image: "/projects/placeholder.png",
          category: "template",
          priceXOF: "45 000 FCFA",
          priceEUR: "75\u20ac",
          priceUSD: "$80",
          amountXOF: 45000,
          tags: JSON.stringify(["Shopify", "E-commerce", "Th\u00e8me", "Mobile Money"]),
          featured: false,
          sortOrder: 2,
        },
      ],
    });
    console.log("  \u2713 Digital products seeded");
  }

  console.log("\n\u2705 Content seed complete!");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
