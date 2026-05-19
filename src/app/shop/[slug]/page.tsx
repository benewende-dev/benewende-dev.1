"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import {
  ArrowLeft,
  Check,
  Download,
  Lock,
  Loader2,
  Package,
  ShieldCheck,
  ExternalLink,
} from "lucide-react";
import Navigation from "@/components/sections/Navigation";
import Footer from "@/components/sections/Footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useCurrency } from "@/components/currency-provider";
import { Currency } from "@/data/services";

interface ProductDetail {
  id: string;
  slug: string;
  title: string;
  description: string;
  longDescription?: string;
  image?: string;
  category?: string;
  amountXOF?: number;
  fileUrl?: string;
  demoUrl?: string;
  price: Record<Currency, string>;
  tags?: string[];
}

const categoryLabel: Record<string, string> = {
  template: "Template",
  script: "Script",
  preset: "Preset",
  asset: "Asset",
  other: "Produit",
};

export default function ProductDetailPage() {
  const params = useParams<{ slug: string }>();
  const router = useRouter();
  const { data: session } = useSession();
  const { currency } = useCurrency();

  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [buying, setBuying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/shop/products/${params.slug}`)
      .then(async (r) => {
        if (r.status === 404) {
          setNotFound(true);
          return null;
        }
        return r.ok ? r.json() : null;
      })
      .then((d) => d && setProduct(d))
      .finally(() => setLoading(false));
  }, [params.slug]);

  const handleBuy = async () => {
    if (!product) return;
    setError(null);
    if (!session) {
      router.push(`/auth/login?callbackUrl=/shop/${product.slug}`);
      return;
    }
    setBuying(true);
    try {
      const res = await fetch("/api/payment/init", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "product", id: product.id }),
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

  if (notFound || !product) {
    return (
      <>
        <Navigation />
        <main className="pt-24 pb-24 min-h-[60vh] flex items-center justify-center text-center px-4">
          <div>
            <h1 className="text-2xl font-bold mb-2">Produit introuvable</h1>
            <p className="text-muted-foreground mb-6">
              Ce produit n&apos;existe pas ou n&apos;est plus disponible.
            </p>
            <Link href="/shop">
              <Button variant="outline" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Retour à la boutique
              </Button>
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const isFree = (product.amountXOF || 0) <= 0;

  return (
    <>
      <Navigation />
      <main className="pt-24 pb-24">
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/shop"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour à la boutique
          </Link>

          <div className="grid lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2 space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  {product.category && (
                    <Badge variant="secondary">
                      {categoryLabel[product.category] || product.category}
                    </Badge>
                  )}
                  {isFree && (
                    <Badge className="bg-green-500/90 text-white">Gratuit</Badge>
                  )}
                </div>
                <h1 className="text-3xl sm:text-4xl font-bold mb-3">{product.title}</h1>
                <p className="text-lg text-muted-foreground">{product.description}</p>
              </motion.div>

              <div className="aspect-video rounded-2xl overflow-hidden bg-gradient-to-br from-green-500/15 via-emerald-500/10 to-teal-500/10 flex items-center justify-center">
                {product.image && product.image !== "/projects/placeholder.png" ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Package className="h-20 w-20 text-green-500/30" />
                )}
              </div>

              {product.longDescription && (
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-xl font-bold mb-3">Description</h2>
                    <p className="text-muted-foreground whitespace-pre-line">
                      {product.longDescription}
                    </p>
                  </CardContent>
                </Card>
              )}

              {product.tags && product.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {product.tags.map((t) => (
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
                        {product.price[currency]}
                      </span>
                    </div>

                    {isFree && product.fileUrl ? (
                      <a href={product.fileUrl} target="_blank" rel="noopener noreferrer">
                        <Button size="lg" className="w-full gap-2">
                          <Download className="h-4 w-4" />
                          Télécharger gratuitement
                        </Button>
                      </a>
                    ) : (
                      <Button onClick={handleBuy} disabled={buying} size="lg" className="w-full gap-2">
                        {buying ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
                        {session ? "Acheter maintenant" : "Se connecter pour acheter"}
                      </Button>
                    )}

                    {product.demoUrl && (
                      <a href={product.demoUrl} target="_blank" rel="noopener noreferrer" className="block mt-2">
                        <Button variant="outline" size="lg" className="w-full gap-2">
                          <ExternalLink className="h-4 w-4" />
                          Voir la démo
                        </Button>
                      </a>
                    )}

                    {error && <p className="text-xs text-destructive mt-2">{error}</p>}

                    <div className="mt-5 pt-5 border-t border-border space-y-2.5 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-primary" />
                        Téléchargement instantané
                      </div>
                      <div className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-primary" />
                        Mises à jour incluses
                      </div>
                      <div className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-primary" />
                        Licence usage commercial
                      </div>
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="h-4 w-4 text-primary" />
                        Paiement Mobile Money sécurisé
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {!session && (
                  <Card className="bg-muted/30 border-dashed">
                    <CardContent className="p-4 flex items-start gap-3">
                      <Lock className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <p className="text-xs text-muted-foreground">
                        Un compte est nécessaire pour acheter et accéder à vos
                        téléchargements. Création gratuite en 30 secondes.
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
