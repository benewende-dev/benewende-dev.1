"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Package, ShoppingBag, Search } from "lucide-react";
import Navigation from "@/components/sections/Navigation";
import Footer from "@/components/sections/Footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useCurrency } from "@/components/currency-provider";
import { Currency } from "@/data/services";

interface ProductSummary {
  id: string;
  slug: string;
  title: string;
  description: string;
  image?: string;
  category?: string;
  amountXOF?: number;
  featured?: boolean;
  price: Record<Currency, string>;
  tags?: string[];
}

const categoryLabel: Record<string, string> = {
  template: "Templates",
  script: "Scripts",
  preset: "Presets",
  asset: "Assets",
  other: "Autres",
};

const categories = ["all", "template", "script", "preset", "asset", "other"] as const;

export default function ShopPage() {
  const [products, setProducts] = useState<ProductSummary[]>([]);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<(typeof categories)[number]>("all");
  const [loading, setLoading] = useState(true);
  const { currency } = useCurrency();

  useEffect(() => {
    fetch("/api/shop/products")
      .then((r) => (r.ok ? r.json() : []))
      .then((d) => Array.isArray(d) && setProducts(d))
      .finally(() => setLoading(false));
  }, []);

  const filtered = products.filter((p) => {
    if (category !== "all" && (p.category || "other") !== category) return false;
    if (query) {
      const q = query.toLowerCase();
      return (
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
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
              <ShoppingBag className="h-3 w-3 mr-1" /> Boutique OpenBaara
            </Badge>
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">
              Produits <span className="gradient-text">digitaux</span>
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Templates Next.js, scripts d&apos;automatisation, packs IA, assets de
              design. Téléchargez et utilisez immédiatement.
            </p>
          </motion.div>

          <div className="flex flex-col md:flex-row gap-3 mb-10">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Chercher un produit..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex gap-1.5 overflow-x-auto">
              {categories.map((c) => (
                <Button
                  key={c}
                  variant={category === c ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCategory(c)}
                  className="shrink-0"
                >
                  {c === "all" ? "Tous" : categoryLabel[c]}
                </Button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="text-center py-12 text-muted-foreground">Chargement…</div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">
                Aucun produit pour le moment. Revenez bientôt !
              </p>
              <Link href="/#contact">
                <Button variant="outline" className="gap-2">
                  Suggérer un produit
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((p, i) => (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                >
                  <Card className="h-full overflow-hidden group hover:glow-sm transition-all hover:border-primary/30 bg-card/50 backdrop-blur-sm">
                    <div className="aspect-video relative bg-gradient-to-br from-green-500/15 via-emerald-500/10 to-teal-500/10 overflow-hidden">
                      {p.image && p.image !== "/projects/placeholder.png" ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={p.image}
                          alt={p.title}
                          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Package className="h-12 w-12 text-green-500/30" />
                        </div>
                      )}
                      {p.category && (
                        <div className="absolute top-3 left-3">
                          <Badge className="bg-background/80 backdrop-blur-sm text-foreground border-border">
                            {categoryLabel[p.category] || p.category}
                          </Badge>
                        </div>
                      )}
                    </div>
                    <CardContent className="p-5">
                      <h3 className="text-lg font-semibold mb-1.5 line-clamp-1 group-hover:text-primary transition-colors">
                        {p.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                        {p.description}
                      </p>
                      <div className="flex items-center justify-between pt-3 border-t border-border">
                        <span className="text-base font-bold text-primary">
                          {p.price[currency]}
                        </span>
                        <Link href={`/shop/${p.slug}`}>
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
