import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { checkPaymentStatus } from "@/lib/cinetpay";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const transactionId = body.cpm_trans_id;

    if (!transactionId) {
      return NextResponse.json({ error: "Transaction ID manquant" }, { status: 400 });
    }

    // Verify with CinetPay API
    const result = await checkPaymentStatus(transactionId);

    const payment = await prisma.payment.findUnique({
      where: { transactionId },
    });

    if (!payment) {
      console.error("Payment not found:", transactionId);
      return NextResponse.json({ error: "Paiement introuvable" }, { status: 404 });
    }

    const status = result.data?.status || "REFUSED";
    const paymentMethod = result.data?.payment_method || null;
    const operator = result.data?.operator_id || null;

    // Update payment record
    await prisma.payment.update({
      where: { transactionId },
      data: {
        status,
        paymentMethod,
        operator,
        cinetpayData: JSON.stringify(result.data),
      },
    });

    // If payment accepted, activate the related resource
    if (status === "ACCEPTED") {
      const svc = payment.serviceType || "";

      if (svc.startsWith("course:")) {
        await prisma.enrollment.updateMany({
          where: { transactionId },
          data: { status: "active" },
        });
      } else if (svc.startsWith("product:")) {
        await prisma.productPurchase.updateMany({
          where: { transactionId },
          data: { status: "active" },
        });
      } else if (payment.plan) {
        const updateData: { plan: string; cvCredits?: number } = {
          plan: payment.plan,
        };
        if (payment.plan === "pro") {
          updateData.cvCredits = 1;
        } else if (payment.plan === "business") {
          updateData.cvCredits = 999;
        }
        await prisma.user.update({
          where: { id: payment.userId },
          data: updateData,
        });
      }
    }

    return NextResponse.json({ status: "OK" });
  } catch (error) {
    console.error("Payment notify error:", error);
    return NextResponse.json({ error: "Erreur webhook" }, { status: 500 });
  }
}
