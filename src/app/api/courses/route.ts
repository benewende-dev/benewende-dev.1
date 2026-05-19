import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const items = await prisma.course.findMany({
      where: { visible: true },
      orderBy: [{ featured: "desc" }, { sortOrder: "asc" }, { createdAt: "desc" }],
    });
    return NextResponse.json(
      items.map((c) => ({
        ...c,
        modules: safeJson(c.modules, []),
        tags: safeJson(c.tags, []),
        price: { XOF: c.priceXOF, EUR: c.priceEUR, USD: c.priceUSD },
      }))
    );
  } catch (e) {
    console.error("Courses list error:", e);
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
