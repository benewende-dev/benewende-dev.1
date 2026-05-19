import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const course = await prisma.course.findUnique({ where: { slug: params.slug } });
    if (!course || !course.visible) {
      return NextResponse.json({ error: "Cours introuvable" }, { status: 404 });
    }
    return NextResponse.json({
      ...course,
      modules: safeJson(course.modules, []),
      tags: safeJson(course.tags, []),
      price: { XOF: course.priceXOF, EUR: course.priceEUR, USD: course.priceUSD },
    });
  } catch (e) {
    console.error("Course detail error:", e);
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
