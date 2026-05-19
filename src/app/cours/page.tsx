"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Clock, GraduationCap, Globe2, Search } from "lucide-react";
import Navigation from "@/components/sections/Navigation";
import Footer from "@/components/sections/Footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useCurrency } from "@/components/currency-provider";
import { Currency } from "@/data/services";

interface CourseSummary {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  description: string;
  image?: string;
  level?: string;
  duration?: string;
  language?: string;
  status?: string;
  featured?: boolean;
  amountXOF?: number;
  price: Record<Currency, string>;
  tags?: string[];
}

const levelLabel: Record<string, string> = {
  debutant: "Débutant",
  intermediaire: "Intermédiaire",
  avance: "Avancé",
};

const levels = ["all", "debutant", "intermediaire", "avance"] as const;

export default function CoursesPage() {
  const [courses, setCourses] = useState<CourseSummary[]>([]);
  const [query, setQuery] = useState("");
  const [level, setLevel] = useState<(typeof levels)[number]>("all");
  const [loading, setLoading] = useState(true);
  const { currency } = useCurrency();

  useEffect(() => {
    fetch("/api/courses")
      .then((r) => (r.ok ? r.json() : []))
      .then((d) => Array.isArray(d) && setCourses(d))
      .finally(() => setLoading(false));
  }, []);

  const filtered = courses.filter((c) => {
    if (level !== "all" && (c.level || "debutant") !== level) return false;
    if (query) {
      const q = query.toLowerCase();
      return (
        c.title.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        (c.subtitle || "").toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <>
      <Navigation />
      <main className="pt-24 pb-24">
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <Badge variant="outline" className="mb-3">
              <GraduationCap className="h-3 w-3 mr-1" /> OpenBaara Academy
            </Badge>
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">
              Nos <span className="gradient-text">formations</span>
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Apprenez à construire de vrais produits : Web, Mobile, IA Agentic,
              E-commerce et plus. Sessions live, replay et projets pratiques.
            </p>
          </motion.div>

          <div className="flex flex-col md:flex-row gap-3 mb-10">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Chercher une formation..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex gap-1.5 overflow-x-auto">
              {levels.map((l) => (
                <Button
                  key={l}
                  variant={level === l ? "default" : "outline"}
                  size="sm"
                  onClick={() => setLevel(l)}
                  className="shrink-0"
                >
                  {l === "all" ? "Tous" : levelLabel[l]}
                </Button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="text-center py-12 text-muted-foreground">Chargement…</div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">
                Aucune formation pour le moment. Revenez bientôt !
              </p>
              <Link href="/#contact">
                <Button variant="outline" className="gap-2">
                  Suggérer une formation
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((c, i) => (
                <motion.div
                  key={c.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                >
                  <Card className="h-full overflow-hidden group hover:glow-sm transition-all hover:border-primary/30 bg-card/50 backdrop-blur-sm">
                    <div className="aspect-video relative bg-gradient-to-br from-amber-500/20 via-orange-500/10 to-yellow-500/10 overflow-hidden">
                      {c.image && c.image !== "/projects/placeholder.png" ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={c.image}
                          alt={c.title}
                          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <GraduationCap className="h-12 w-12 text-amber-500/30" />
                        </div>
                      )}
                      <div className="absolute top-3 left-3 flex gap-1.5">
                        {c.level && (
                          <Badge className="bg-background/80 backdrop-blur-sm text-foreground border-border">
                            {levelLabel[c.level] || c.level}
                          </Badge>
                        )}
                        {c.status === "coming-soon" && (
                          <Badge className="bg-blue-500/90 text-white">Bientôt</Badge>
                        )}
                      </div>
                    </div>
                    <CardContent className="p-5">
                      <h3 className="text-lg font-semibold mb-1.5 line-clamp-1 group-hover:text-primary transition-colors">
                        {c.title}
                      </h3>
                      {c.subtitle && (
                        <p className="text-xs text-muted-foreground mb-2 line-clamp-1">
                          {c.subtitle}
                        </p>
                      )}
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                        {c.description}
                      </p>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground mb-4">
                        {c.duration && (
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {c.duration}
                          </span>
                        )}
                        {c.language && (
                          <span className="flex items-center gap-1">
                            <Globe2 className="h-3 w-3" />
                            {c.language}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center justify-between pt-3 border-t border-border">
                        <span className="text-base font-bold text-primary">
                          {c.price[currency]}
                        </span>
                        <Link href={`/cours/${c.slug}`}>
                          <Button size="sm" className="gap-1.5">
                            Détails
                            <ArrowRight className="h-3.5 w-3.5" />
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}
