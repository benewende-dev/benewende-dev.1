"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ShoppingBag, Package } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
  template: "Template",
  script: "Script",
  preset: "Preset",
  asset: "Asset",
  other: "Produit",
};

export default function ShopPreview() {
  const [products, setProducts] = useState<ProductSummary[]>([]);
  const { currency } = useCurrency();

  useEffect(() => {
    fetch("/api/shop/products")
      .then((r) => (r.ok ? r.json() : []))
      .then((d) => Array.isArray(d) && setProducts(d.slice(0, 3)))
      .catch(() => {});
  }, []);

  if (products.length === 0) return null;

  return (
    <section id="shop" className="py-24 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-green-500/[0.02] to-transparent" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12"
        >
          <div>
            <Badge variant="outline" className="mb-3">
              <ShoppingBag className="h-3 w-3 mr-1" /> Boutique digitale
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold">
              Templates & <span className="gradient-text">produits digitaux</span>
            </h2>
            <p className="text-muted-foreground mt-3 max-w-2xl">
              Des templates Next.js, scripts d&apos;automatisation, packs IA et
              presets prêts à l&apos;emploi. Téléchargez et utilisez immédiatement.
            </p>
          </div>
          <Link href="/shop">
            <Button variant="outline" className="gap-2">
              Visiter la boutique
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
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
