"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import {
  ArrowLeft,
  Clock,
  GraduationCap,
  Globe2,
  Check,
  Lock,
  Loader2,
  Sparkles,
  ShieldCheck,
  Mail,
} from "lucide-react";
import Navigation from "@/components/sections/Navigation";
import Footer from "@/components/sections/Footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useCurrency } from "@/components/currency-provider";
import { Currency } from "@/data/services";

interface Module {
  title: string;
  description?: string;
  duration?: string;
}

interface CourseDetail {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  description: string;
  longDescription?: string;
  image?: string;
  level?: string;
  duration?: string;
  language?: string;
  instructorName?: string;
  status?: string;
  amountXOF?: number;
  price: Record<Currency, string>;
  modules?: Module[];
  tags?: string[];
}

const levelLabel: Record<string, string> = {
  debutant: "Débutant",
  intermediaire: "Intermédiaire",
  avance: "Avancé",
};

export default function CourseDetailPage() {
  const params = useParams<{ slug: string }>();
  const router = useRouter();
  const { data: session } = useSession();
  const { currency } = useCurrency();

  const [course, setCourse] = useState<CourseDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [buying, setBuying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preregistered, setPreregistered] = useState(false);

  useEffect(() => {
    fetch(`/api/courses/${params.slug}`)
      .then(async (r) => {
        if (r.status === 404) {
          setNotFound(true);
          return null;
        }
        return r.ok ? r.json() : null;
      })
      .then((d) => d && setCourse(d))
      .finally(() => setLoading(false));
  }, [params.slug]);

  const handleBuy = async () => {
    if (!course) return;
    setError(null);
    if (!session) {
      router.push(`/auth/login?callbackUrl=/cours/${course.slug}`);
      return;
    }
    setBuying(true);
    try {
      const res = await fetch("/api/payment/init", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "course", id: course.id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur paiement");
      window.location.href = data.paymentUrl;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur paiement");
    } finally {
      setBuying(false);
    }
  };

  const handlePreregister = async () => {
    if (!course) return;
    setError(null);
    if (!session?.user?.email) {
      router.push(`/auth/login?callbackUrl=/cours/${course.slug}`);
      return;
    }
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: session.user.name || "Pré-inscription",
          email: session.user.email,
          project: `Pré-inscription cours : ${course.title}`,
          message: `Je souhaite être notifié(e) lors du lancement de la formation "${course.title}" (${course.slug}).`,
        }),
      });
      if (!res.ok) throw new Error("Erreur lors de l'inscription");
      setPreregistered(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur");
    }
  };

  if (loading) {
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

  if (notFound || !course) {
    return (
      <>
        <Navigation />
        <main className="pt-24 pb-24 min-h-[60vh] flex items-center justify-center text-center px-4">
          <div>
            <h1 className="text-2xl font-bold mb-2">Formation introuvable</h1>
            <p className="text-muted-foreground mb-6">
              Cette formation n&apos;existe pas ou n&apos;est plus disponible.
            </p>
            <Link href="/cours">
              <Button variant="outline" className="gap-2">
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

  const isComingSoon = course.status === "coming-soon" || (course.amountXOF || 0) <= 0;

  return (
    <>
      <Navigation />
      <main className="pt-24 pb-24">
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/cours" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6">
            <ArrowLeft className="h-4 w-4" />
            Toutes les formations
          </Link>

          <div className="grid lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2 space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  <Badge variant="outline">
                    <GraduationCap className="h-3 w-3 mr-1" />
                    OpenBaara Academy
                  </Badge>
                  {course.level && (
                    <Badge variant="secondary">{levelLabel[course.level] || course.level}</Badge>
                  )}
                  {isComingSoon && <Badge className="bg-blue-500 text-white">Bientôt</Badge>}
                </div>
                <h1 className="text-3xl sm:text-4xl font-bold mb-2">{course.title}</h1>
                {course.subtitle && (
                  <p className="text-lg text-muted-foreground mb-6">{course.subtitle}</p>
                )}
                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6">
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

              {course.image && course.image !== "/projects/placeholder.png" && (
                <div className="aspect-video rounded-2xl overflow-hidden bg-gradient-to-br from-amber-500/20 via-orange-500/10 to-yellow-500/10">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={course.image} alt={course.title} className="w-full h-full object-cover" />
                </div>
              )}

              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-bold mb-3">À propos de cette formation</h2>
                  <p className="text-muted-foreground whitespace-pre-line">
                    {course.longDescription || course.description}
                  </p>
                </CardContent>
              </Card>

              {course.modules && course.modules.length > 0 && (
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-xl font-bold mb-4">Programme</h2>
                    <ol className="space-y-3">
                      {course.modules.map((m, idx) => (
                        <li key={idx} className="flex gap-4">
                          <div className="h-7 w-7 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center shrink-0">
                            {idx + 1}
                          </div>
                          <div className="flex-1">
                            <div className="font-medium">{m.title}</div>
                            {m.description && (
                              <p className="text-sm text-muted-foreground mt-0.5">{m.description}</p>
                            )}
                            {m.duration && (
                              <p className="text-xs text-muted-foreground mt-1">
                                <Clock className="h-3 w-3 inline mr-1" />
                                {m.duration}
                              </p>
                            )}
                          </div>
                        </li>
                      ))}
                    </ol>
                  </CardContent>
                </Card>
              )}

              {course.tags && course.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {course.tags.map((t) => (
                    <Badge key={t} variant="secondary" className="text-xs">
                      {t}
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <aside className="lg:col-span-1">
              <div className="sticky top-24 space-y-4">
                <Card className="border-primary/30 shadow-lg shadow-primary/5">
                  <CardContent className="p-6">
                    <div className="flex items-baseline gap-2 mb-4">
                      <span className="text-3xl font-bold text-primary">
                        {course.price[currency]}
                      </span>
                    </div>

                    {isComingSoon ? (
                      preregistered ? (
                        <div className="bg-green-500/10 text-green-600 dark:text-green-400 rounded-lg p-3 text-sm flex items-center gap-2">
                          <Check className="h-4 w-4" />
                          Pré-inscription enregistrée. Nous vous écrirons au lancement.
                        </div>
                      ) : (
                        <Button onClick={handlePreregister} size="lg" className="w-full gap-2">
                          <Mail className="h-4 w-4" />
                          {session ? "Pré-inscription gratuite" : "Se connecter pour la pré-inscription"}
                        </Button>
                      )
                    ) : (
                      <Button onClick={handleBuy} disabled={buying} size="lg" className="w-full gap-2">
                        {buying ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Sparkles className="h-4 w-4" />
                        )}
                        {session ? "S'inscrire maintenant" : "Se connecter pour s'inscrire"}
                      </Button>
                    )}

                    {error && (
                      <p className="text-xs text-destructive mt-2">{error}</p>
                    )}

                    <div className="mt-5 pt-5 border-t border-border space-y-2.5 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-primary" />
                        Accès à vie au contenu
                      </div>
                      <div className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-primary" />
                        Certificat de complétion
                      </div>
                      <div className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-primary" />
                        Support communauté privée
                      </div>
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="h-4 w-4 text-primary" />
                        Paiement Mobile Money sécurisé
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {!session && !isComingSoon && (
                  <Card className="bg-muted/30 border-dashed">
                    <CardContent className="p-4 flex items-start gap-3">
                      <Lock className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <p className="text-xs text-muted-foreground">
                        Vous devez avoir un compte pour finaliser l&apos;inscription.
                        Création gratuite en 30 secondes.
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </aside>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
