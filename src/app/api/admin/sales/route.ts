import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { prisma } from "@/lib/prisma";

function isAdminToken(token: { role?: string } | null): boolean {
  return token?.role === "admin";
}

export async function GET(req: NextRequest) {
  const token = await getToken({ req });
  if (!isAdminToken(token as { role?: string } | null)) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
  }

  const [enrollments, purchases, payments] = await Promise.all([
    prisma.enrollment.findMany({
      orderBy: { createdAt: "desc" },
      take: 100,
      include: {
        course: { select: { id: true, title: true, slug: true } },
        user: { select: { id: true, name: true, email: true } },
      },
    }),
    prisma.productPurchase.findMany({
      orderBy: { createdAt: "desc" },
      take: 100,
      include: {
        product: { select: { id: true, title: true, slug: true } },
        user: { select: { id: true, name: true, email: true } },
      },
    }),
    prisma.payment.findMany({
      orderBy: { createdAt: "desc" },
      take: 100,
      select: {
        id: true,
        transactionId: true,
        amount: true,
        currency: true,
        description: true,
        status: true,
        plan: true,
        serviceType: true,
        paymentMethod: true,
        operator: true,
        createdAt: true,
      },
    }),
  ]);

  return NextResponse.json({ enrollments, purchases, payments });
}
