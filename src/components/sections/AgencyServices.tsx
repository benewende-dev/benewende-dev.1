"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Globe,
  Smartphone,
  Cpu,
  Bot,
  ShoppingBag,
  GraduationCap,
  ArrowRight,
  Check,
  LucideIcon,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Pillar {
  id: string;
  icon: LucideIcon;
  title: string;
  tagline: string;
  bullets: string[];
  cta: { label: string; href: string };
  accent: string;
  gradient: string;
}

const pillars: Pillar[] = [
  {
    id: "web",
    icon: Globe,
    title: "Sites Web",
    tagline: "Vitrines, landing pages et plateformes performantes qui convertissent.",
    bullets: ["Design moderne & responsive", "SEO & Core Web Vitals", "CMS & back-office sur mesure"],
    cta: { label: "Demander un devis", href: "#contact" },
    accent: "text-blue-500",
    gradient: "from-blue-500/20 to-blue-600/5",
  },
  {
    id: "app",
    icon: Smartphone,
    title: "Applications Mobiles",
    tagline: "Apps iOS & Android natives ou cross-platform, pensées produit.",
    bullets: ["React Native / Expo", "API & backend cloud", "Stores iOS + Play Store"],
    cta: { label: "Discuter de mon app", href: "#contact" },
    accent: "text-pink-500",
    gradient: "from-pink-500/20 to-pink-600/5",
  },
  {
    id: "software",
    icon: Cpu,
    title: "Logiciels Métier",
    tagline: "ERP, CRM, dashboards et outils internes taillés pour vos process.",
    bullets: ["Audit & cadrage métier", "Intégrations API (ERP, paiement, RH)", "Hébergement cloud + monitoring"],
    cta: { label: "Cadrer mon logiciel", href: "#contact" },
    accent: "text-purple-500",
    gradient: "from-purple-500/20 to-purple-600/5",
  },
  {
    id: "ia-agentic",
    icon: Bot,
    title: "IA Agentic",
    tagline: "Agents IA autonomes qui exécutent, automatisent et apprennent.",
    bullets: ["Agents multi-outils (RAG, MCP)", "Automatisation workflows (n8n, custom)", "LLM intégrés à vos données"],
    cta: { label: "Lancer mon agent IA", href: "#contact" },
    accent: "text-cyan-500",
    gradient: "from-cyan-500/20 to-cyan-600/5",
  },
  {
    id: "ecommerce",
    icon: ShoppingBag,
    title: "E-commerce",
    tagline: "Boutiques Shopify, Next-commerce ou sur mesure, prêtes à vendre.",
    bullets: ["Catalogue + paiement Mobile Money", "Logistique & livraison", "Marketing automation"],
    cta: { label: "Lancer ma boutique", href: "#contact" },
    accent: "text-green-500",
    gradient: "from-green-500/20 to-green-600/5",
  },
  {
    id: "cours",
    icon: GraduationCap,
    title: "Cours & Formations",
    tagline: "Bootcamps et formations en ligne pour monter en compétences.",
    bullets: ["Web, mobile, IA, no-code", "Sessions live + replay", "Certifications & projets pratiques"],
    cta: { label: "Voir les formations", href: "/cours" },
    accent: "text-amber-500",
    gradient: "from-amber-500/20 to-amber-600/5",
  },
];

export default function AgencyServices() {
  return (
    <section id="services" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <Badge variant="outline" className="mb-4">
            Nos pôles
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Une agence, <span className="gradient-text">six expertises</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            OpenBaara couvre tout le cycle de vie de votre produit digital :
            stratégie, design, développement, IA, lancement et formation.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pillars.map((p, i) => {
            const Icon = p.icon;
            return (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                <Card className="h-full group hover:glow-sm transition-all duration-300 hover:border-primary/30 bg-card/50 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div
                      className={`h-14 w-14 rounded-2xl bg-gradient-to-br ${p.gradient} flex items-center justify-center ring-1 ring-white/5 mb-4 group-hover:scale-105 transition-transform`}
                    >
                      <Icon className={`h-6 w-6 ${p.accent}`} />
                    </div>
                    <h3 className="text-lg font-bold mb-2">{p.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{p.tagline}</p>
                    <ul className="space-y-2 mb-6">
                      {p.bullets.map((b) => (
                        <li
                          key={b}
                          className="flex items-start gap-2.5 text-sm text-muted-foreground"
                        >
                          <div className="h-4 w-4 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                            <Check className="h-2.5 w-2.5 text-primary" />
                          </div>
                          {b}
                        </li>
                      ))}
                    </ul>
                    <a href={p.cta.href}>
                      <Button variant="outline" size="sm" className="w-full gap-2">
                        {p.cta.label}
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </a>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
