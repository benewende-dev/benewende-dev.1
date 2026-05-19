import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: NextRequest,
  { params }: { params: { slug: string } }
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

  const course = await prisma.course.findUnique({
    where: { slug: params.slug },
  });
  if (!course || !course.visible) {
    return NextResponse.json({ error: "Cours introuvable" }, { status: 404 });
  }

  const enrollment = await prisma.enrollment.findUnique({
    where: { userId_courseId: { userId: user.id, courseId: course.id } },
  });

  if (!enrollment || enrollment.status !== "active") {
    return NextResponse.json(
      { error: "Inscription requise", enrollmentStatus: enrollment?.status || null },
      { status: 403 }
    );
  }

  let modules: unknown[] = [];
  try {
    modules = JSON.parse(course.modules);
  } catch {
    modules = [];
  }

  return NextResponse.json({
    id: course.id,
    slug: course.slug,
    title: course.title,
    subtitle: course.subtitle,
    description: course.description,
    longDescription: course.longDescription,
    image: course.image,
    duration: course.duration,
    language: course.language,
    instructorName: course.instructorName,
    level: course.level,
    modules,
    enrollment: {
      id: enrollment.id,
      status: enrollment.status,
      createdAt: enrollment.createdAt,
    },
  });
}
