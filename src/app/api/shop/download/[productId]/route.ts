import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: NextRequest,
  { params }: { params: { productId: string } }
) {
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

  const purchase = await prisma.productPurchase.findFirst({
    where: {
      userId: user.id,
      productId: params.productId,
      status: "active",
    },
    include: {
      product: { select: { fileUrl: true, title: true } },
    },
  });

  if (!purchase) {
    return NextResponse.json(
      { error: "Achat introuvable ou non finalisé" },
      { status: 403 }
    );
  }

  if (!purchase.product.fileUrl) {
    return NextResponse.json(
      { error: "Fichier indisponible. Contactez le support." },
      { status: 404 }
    );
  }

  return NextResponse.redirect(purchase.product.fileUrl);
}
