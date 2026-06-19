import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ bookmarks: [] });
  }

  const bookmarks = await prisma.bookmark.findMany({
    where: { userId: session.user.id },
  });

  return Response.json({ bookmarks });
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { itemType, itemId } = await req.json();

  const existing = await prisma.bookmark.findUnique({
    where: { userId_itemType_itemId: { userId: session.user.id, itemType, itemId } },
  });

  if (existing) {
    await prisma.bookmark.delete({ where: { id: existing.id } });
    return Response.json({ bookmarked: false });
  }

  await prisma.bookmark.create({
    data: { userId: session.user.id, itemType, itemId },
  });

  return Response.json({ bookmarked: true });
}
