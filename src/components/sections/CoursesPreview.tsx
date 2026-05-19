"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Clock, GraduationCap, Globe2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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

export default function CoursesPreview() {
  const [courses, setCourses] = useState<CourseSummary[]>([]);
  const { currency } = useCurrency();

  useEffect(() => {
    fetch("/api/courses")
      .then((r) => (r.ok ? r.json() : []))
      .then((d) => Array.isArray(d) && setCourses(d.slice(0, 3)))
      .catch(() => {});
  }, []);

  if (courses.length === 0) return null;

  return (
    <section id="cours" className="py-24 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-amber-500/[0.02] to-transparent" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12"
        >
          <div>
            <Badge variant="outline" className="mb-3">
              <GraduationCap className="h-3 w-3 mr-1" /> Cours & Formations
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold">
              Apprenez avec <span className="gradient-text">OpenBaara Academy</span>
            </h2>
            <p className="text-muted-foreground mt-3 max-w-2xl">
              Des formations pratiques, conçues par des builders en activité. Web,
              mobile, IA, no-code et marketing.
            </p>
          </div>
          <Link href="/cours">
            <Button variant="outline" className="gap-2">
              Toutes les formations
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((c, i) => (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
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
                      <Button size="sm" variant="outline" className="gap-1.5">
                        Voir
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
