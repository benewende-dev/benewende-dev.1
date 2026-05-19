import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { initPayment, PLANS, PlanId } from "@/lib/cinetpay";

type PurchaseType = "plan" | "course" | "product";

interface InitBody {
  planId?: string;
  type?: PurchaseType;
  id?: string;
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  try {
    const body = (await request.json()) as InitBody;
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });
    if (!user) {
      return NextResponse.json({ error: "Utilisateur introuvable" }, { status: 404 });
    }

    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
    const transactionId = `OPB-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

    let amount = 0;
    let description = "";
    let plan: string | undefined;
    let serviceType: string | undefined;

    if (body.type === "course" && body.id) {
      const course = await prisma.course.findUnique({ where: { id: body.id } });
      if (!course || !course.visible) {
        return NextResponse.json({ error: "Cours introuvable" }, { status: 404 });
      }
      if (course.amountXOF <= 0) {
        return NextResponse.json({ error: "Ce cours n'est pas en achat direct" }, { status: 400 });
      }
      amount = course.amountXOF;
      description = `OpenBaara — Inscription au cours « ${course.title} »`;
      serviceType = `course:${course.id}`;
      plan = course.slug;

      await prisma.enrollment.upsert({
        where: { userId_courseId: { userId: user.id, courseId: course.id } },
        update: { transactionId, status: "pending" },
        create: {
          userId: user.id,
          courseId: course.id,
          transactionId,
          status: "pending",
        },
      });
    } else if (body.type === "product" && body.id) {
      const product = await prisma.digitalProduct.findUnique({ where: { id: body.id } });
      if (!product || !product.visible) {
        return NextResponse.json({ error: "Produit introuvable" }, { status: 404 });
      }
      if (product.amountXOF <= 0) {
        return NextResponse.json({ error: "Ce produit n'est pas en achat direct" }, { status: 400 });
      }
      amount = product.amountXOF;
      description = `OpenBaara — Achat du produit « ${product.title} »`;
      serviceType = `product:${product.id}`;
      plan = product.slug;

      await prisma.productPurchase.create({
        data: {
          userId: user.id,
          productId: product.id,
          transactionId,
          status: "pending",
        },
      });
    } else {
      const planId = body.planId;
      if (!planId || !(planId in PLANS)) {
        return NextResponse.json({ error: "Plan invalide" }, { status: 400 });
      }
      const p = PLANS[planId as PlanId];
      amount = p.amount;
      description = p.description;
      plan = p.plan;
      serviceType = p.serviceType;
    }

    await prisma.payment.create({
      data: {
        userId: user.id,
        transactionId,
        amount,
        currency: "XOF",
        description,
        status: "PENDING",
        plan,
        serviceType,
      },
    });

    const result = await initPayment({
      transactionId,
      amount,
      description,
      customerName: user.name,
      customerEmail: user.email,
      returnUrl: `${baseUrl}/payment/status?tx=${transactionId}`,
      notifyUrl: `${baseUrl}/api/payment/notify`,
      channels: "ALL",
    });

    if (result.code !== "201") {
      return NextResponse.json(
        { error: result.message || "Erreur initialisation paiement" },
        { status: 400 }
      );
    }

    return NextResponse.json({
      paymentUrl: result.data.payment_url,
      paymentToken: result.data.payment_token,
      transactionId,
    });
  } catch (error) {
    console.error("Payment init error:", error);
    return NextResponse.json(
      { error: "Erreur lors de l'initialisation du paiement" },
      { status: 500 }
    );
  }
}
