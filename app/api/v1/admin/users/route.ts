import { getAuthUserFromCookies } from "@/app/lib/auth";
import { prisma } from "@/app/lib/db";
import { jsonError, jsonOk } from "@/app/lib/http";

export async function GET() {
  const auth = await getAuthUserFromCookies();
  if (!auth) return jsonError("UNAUTHORIZED", "Not authenticated", 401);
  if (auth.role !== "ADMIN") return jsonError("FORBIDDEN", "Admin only", 403);

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: { id: true, email: true, role: true, createdAt: true },
  });
  return jsonOk({ users });
}

