import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true },
  });
  if (!user) {
    return NextResponse.json({ error: "Utilisateur introuvable" }, { status: 404 });
  }

  const [enrollments, purchases] = await Promise.all([
    prisma.enrollment.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      include: {
        course: {
          select: {
            id: true,
            slug: true,
            title: true,
            subtitle: true,
            image: true,
            duration: true,
            level: true,
          },
        },
      },
    }),
    prisma.productPurchase.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      include: {
        product: {
          select: {
            id: true,
            slug: true,
            title: true,
            image: true,
            category: true,
            fileUrl: true,
            demoUrl: true,
          },
        },
      },
    }),
  ]);

  return NextResponse.json({
    enrollments: enrollments.map((e) => ({
      id: e.id,
      status: e.status,
      createdAt: e.createdAt,
      course: e.course,
    })),
    purchases: purchases.map((p) => ({
      id: p.id,
      status: p.status,
      createdAt: p.createdAt,
      product: {
        id: p.product.id,
        slug: p.product.slug,
        title: p.product.title,
        image: p.product.image,
        category: p.product.category,
        demoUrl: p.product.demoUrl,
        hasFile: !!p.product.fileUrl,
      },
      downloadUrl:
        p.status === "active" && p.product.fileUrl
          ? `/api/shop/download/${p.product.id}`
          : null,
    })),
  });
}
