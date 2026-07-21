
import { redirect } from "next/navigation";
import Homeview from "@/components/home";
import { requireAuth } from "@/lib/auth.until";
import { prisma } from "@/lib/prisma";

export default async function Home() {
  const session = await requireAuth();

  if (!session) redirect("/login");

  const dbUser = await prisma.user.findUnique({
    where: { id: session.user.id }
  });

  const plan = dbUser?.plan || "FREE";

  return (
    <div>
      <Homeview plan={plan} />
    </div>
  );
}

