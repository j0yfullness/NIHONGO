import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { quizId, lessonId, score, passed, completed } = await req.json();

  const data: Record<string, unknown> = { userId: session.user.id };
  if (quizId) data.quizId = quizId;
  if (lessonId) data.lessonId = lessonId;
  if (typeof score === "number") data.score = score;
  if (typeof passed === "boolean") data.passed = passed;
  if (typeof completed === "boolean") data.completed = completed;

  await prisma.userProgress.create({ data: data as Prisma.UserProgressCreateInput });

  return Response.json({ ok: true });
}

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ progress: [] });
  }

  const progress = await prisma.userProgress.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  return Response.json({ progress });
}
