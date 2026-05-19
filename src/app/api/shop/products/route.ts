import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const items = await prisma.digitalProduct.findMany({
      where: { visible: true },
      orderBy: [{ featured: "desc" }, { sortOrder: "asc" }, { createdAt: "desc" }],
    });
    return NextResponse.json(
      items.map((p) => ({
        ...p,
        tags: safeJson(p.tags, []),
        price: { XOF: p.priceXOF, EUR: p.priceEUR, USD: p.priceUSD },
      }))
    );
  } catch (e) {
    console.error("Products list error:", e);
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
