import { redirect } from "next/navigation";

export default async function LevelPage({ params }: { params: Promise<{ level: string }> }) {
  const { level } = await params;
  redirect(`/${level}/vocabulary`);
}
