"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Clock,
  GraduationCap,
  Globe2,
  Loader2,
  Lock,
  CheckCircle2,
  PlayCircle,
  ChevronRight,
  Hourglass,
  MessageCircle,
} from "lucide-react";
import Navigation from "@/components/sections/Navigation";
import Footer from "@/components/sections/Footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface Module {
  title: string;
  description?: string;
  duration?: string;
  videoUrl?: string;
}

interface CourseLearn {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  description: string;
  longDescription?: string;
  image?: string;
  duration?: string;
  language?: string;
  level?: string;
  instructorName?: string;
  modules: Module[];
  enrollment: { id: string; status: string; createdAt: string };
}

const levelLabel: Record<string, string> = {
  debutant: "Débutant",
  intermediaire: "Intermédiaire",
  avance: "Avancé",
};

export default function CourseLearnPage() {
  const params = useParams<{ slug: string }>();
  const router = useRouter();
  const { data: session, status: authStatus } = useSession();
  const [course, setCourse] = useState<CourseLearn | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorState, setErrorState] = useState<"forbidden" | "pending" | "not-found" | "auth" | null>(null);
  const [activeModule, setActiveModule] = useState(0);

  useEffect(() => {
    if (authStatus === "unauthenticated") {
      router.push(`/auth/login?callbackUrl=/cours/${params.slug}/learn`);
    }
  }, [authStatus, router, params.slug]);

  useEffect(() => {
    if (authStatus !== "authenticated") return;
    fetch(`/api/dashboard/courses/${params.slug}`)
      .then(async (r) => {
        if (r.status === 401) {
          setErrorState("auth");
          return null;
        }
        if (r.status === 403) {
          const data = await r.json();
          setErrorState(data.enrollmentStatus === "pending" ? "pending" : "forbidden");
          return null;
        }
        if (r.status === 404) {
          setErrorState("not-found");
          return null;
        }
        return r.ok ? r.json() : null;
      })
      .then((d) => d && setCourse(d))
      .finally(() => setLoading(false));
  }, [authStatus, params.slug]);

  if (authStatus === "loading" || loading) {
    return (
      <>
        <Navigation />
        <main className="pt-24 pb-24 min-h-[60vh] flex items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </main>
        <Footer />
      </>
    );
  }

  if (!session) return null;

  if (errorState === "pending") {
    return (
      <>
        <Navigation />
        <main className="pt-24 pb-24 max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="h-16 w-16 rounded-2xl bg-yellow-500/10 flex items-center justify-center mx-auto mb-6">
            <Hourglass className="h-8 w-8 text-yellow-500" />
          </div>
          <h1 className="text-2xl font-bold mb-3">Paiement en cours de validation</h1>
          <p className="text-muted-foreground mb-6">
            Votre inscription est en attente. Si vous venez de payer, l&apos;activation peut
            prendre quelques minutes. En cas de problème, contactez-nous.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link href={`/cours/${params.slug}`}>
              <Button variant="outline" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Retour au cours
              </Button>
            </Link>
            <a href="https://wa.me/2250708454592" target="_blank" rel="noopener noreferrer">
              <Button className="gap-2 bg-[#25D366] hover:bg-[#1da851] text-white">
                <MessageCircle className="h-4 w-4" />
                Contacter le support
              </Button>
            </a>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (errorState === "forbidden") {
    return (
      <>
        <Navigation />
        <main className="pt-24 pb-24 max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="h-16 w-16 rounded-2xl bg-muted/50 flex items-center justify-center mx-auto mb-6">
            <Lock className="h-8 w-8 text-muted-foreground" />
          </div>
          <h1 className="text-2xl font-bold mb-3">Inscription requise</h1>
          <p className="text-muted-foreground mb-6">
            Vous devez vous inscrire à cette formation pour accéder au contenu.
          </p>
          <Link href={`/cours/${params.slug}`}>
            <Button className="gap-2">
              S&apos;inscrire à la formation
              <ChevronRight className="h-4 w-4" />
            </Button>
          </Link>
        </main>
        <Footer />
      </>
    );
  }

  if (errorState === "not-found" || !course) {
    return (
      <>
        <Navigation />
        <main className="pt-24 pb-24 min-h-[60vh] flex items-center justify-center text-center px-4">
          <div>
            <h1 className="text-2xl font-bold mb-2">Cours introuvable</h1>
            <Link href="/cours">
              <Button variant="outline" className="gap-2 mt-4">
                <ArrowLeft className="h-4 w-4" />
                Retour au catalogue
              </Button>
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const current = course.modules[activeModule];

  return (
    <>
      <Navigation />
      <main className="pt-24 pb-24">
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Mon espace OpenBaara
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <Badge variant="outline">
                <GraduationCap className="h-3 w-3 mr-1" />
                OpenBaara Academy
              </Badge>
              {course.level && (
                <Badge variant="secondary">{levelLabel[course.level] || course.level}</Badge>
              )}
              <Badge className="bg-emerald-500 text-white">
                <CheckCircle2 className="h-3 w-3 mr-1" />
                Inscrit
              </Badge>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold">{course.title}</h1>
            {course.subtitle && (
              <p className="text-lg text-muted-foreground mt-2">{course.subtitle}</p>
            )}
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mt-3">
              {course.duration && (
                <span className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4" />
                  {course.duration}
                </span>
              )}
              {course.language && (
                <span className="flex items-center gap-1.5">
                  <Globe2 className="h-4 w-4" />
                  {course.language}
                </span>
              )}
              {course.instructorName && <span>· Par {course.instructorName}</span>}
            </div>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-6">
            <aside className="lg:col-span-1 lg:order-1 order-2">
              <Card>
                <CardContent className="p-4">
                  <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                    <PlayCircle className="h-4 w-4 text-primary" />
                    Programme
                  </h3>
                  {course.modules.length === 0 ? (
                    <p className="text-xs text-muted-foreground">
                      Le programme sera bientôt ajouté.
                    </p>
                  ) : (
                    <ol className="space-y-1.5">
                      {course.modules.map((m, idx) => (
                        <li key={idx}>
                          <button
                            onClick={() => setActiveModule(idx)}
                            className={`w-full text-left flex items-start gap-2.5 p-2.5 rounded-lg transition-colors ${
                              idx === activeModule
                                ? "bg-primary/10 ring-1 ring-primary/30"
                                : "hover:bg-muted/50"
                            }`}
                          >
                            <div
                              className={`h-6 w-6 rounded-full text-[10px] font-bold flex items-center justify-center shrink-0 ${
                                idx === activeModule
                                  ? "bg-primary text-primary-foreground"
                                  : "bg-muted text-muted-foreground"
                              }`}
                            >
                              {idx + 1}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p
                                className={`text-xs font-medium line-clamp-2 ${
                                  idx === activeModule ? "text-primary" : ""
                                }`}
                              >
                                {m.title}
                              </p>
                              {m.duration && (
                                <p className="text-[10px] text-muted-foreground mt-0.5">
                                  <Clock className="h-2.5 w-2.5 inline mr-0.5" />
                                  {m.duration}
                                </p>
                              )}
                            </div>
                          </button>
                        </li>
                      ))}
                    </ol>
                  )}
                </CardContent>
              </Card>
            </aside>

            <div className="lg:col-span-2 lg:order-2 order-1 space-y-5">
              {current ? (
                <>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">
                      Module {activeModule + 1} sur {course.modules.length}
                    </p>
                    <h2 className="text-2xl font-bold">{current.title}</h2>
                    {current.duration && (
                      <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5" />
                        {current.duration}
                      </p>
                    )}
                  </div>

                  <Card>
                    <CardContent className="p-0">
                      {current.videoUrl ? (
                        <div className="aspect-video bg-black rounded-t-lg overflow-hidden">
                          <video
                            key={current.videoUrl}
                            src={current.videoUrl}
                            controls
                            className="w-full h-full"
                          />
                        </div>
                      ) : (
                        <div className="aspect-video bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/5 flex flex-col items-center justify-center text-center p-6 rounded-t-lg">
                          <PlayCircle className="h-12 w-12 text-primary/40 mb-3" />
                          <p className="text-sm font-medium">
                            Contenu vidéo bientôt disponible
                          </p>
                          <p className="text-xs text-muted-foreground mt-1 max-w-xs">
                            Les modules de cette formation sont en cours de
                            production. Vous recevrez un email à chaque sortie.
                          </p>
                        </div>
                      )}
                      <div className="p-5">
                        <h3 className="text-sm font-semibold mb-2">À propos de ce module</h3>
                        <p className="text-sm text-muted-foreground whitespace-pre-line">
                          {current.description || "Description à venir."}
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  <div className="flex justify-between">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={activeModule === 0}
                      onClick={() => setActiveModule((i) => Math.max(0, i - 1))}
                      className="gap-2"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      Précédent
                    </Button>
                    <Button
                      size="sm"
                      disabled={activeModule >= course.modules.length - 1}
                      onClick={() =>
                        setActiveModule((i) => Math.min(course.modules.length - 1, i + 1))
                      }
                      className="gap-2"
                    >
                      Suivant
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </>
              ) : (
                <Card>
                  <CardContent className="p-8 text-center">
                    <p className="text-sm text-muted-foreground">
                      Le contenu de cette formation est en cours de production.
                      Vous serez notifié·e par email à chaque module mis en
                      ligne.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
