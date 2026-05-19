import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const product = await prisma.digitalProduct.findUnique({
      where: { slug: params.slug },
    });
    if (!product || !product.visible) {
      return NextResponse.json({ error: "Produit introuvable" }, { status: 404 });
    }
    return NextResponse.json({
      ...product,
      tags: safeJson(product.tags, []),
      price: { XOF: product.priceXOF, EUR: product.priceEUR, USD: product.priceUSD },
    });
  } catch (e) {
    console.error("Product detail error:", e);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

function safeJson<T>(value: string, fallback: T): T {
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}
