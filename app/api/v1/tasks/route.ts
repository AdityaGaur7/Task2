import { getAuthUserFromCookies } from "@/app/lib/auth";
import { prisma } from "@/app/lib/db";
import { jsonError, jsonOk, zodToDetails } from "@/app/lib/http";
import { taskCreateSchema } from "@/app/lib/validation";
import { ZodError } from "zod";

export async function GET() {
  const auth = await getAuthUserFromCookies();
  if (!auth) return jsonError("UNAUTHORIZED", "Not authenticated", 401);

  const tasks = await prisma.task.findMany({
    where: { userId: auth.sub },
    orderBy: { createdAt: "desc" },
  });
  return jsonOk({ tasks });
}

export async function POST(req: Request) {
  const auth = await getAuthUserFromCookies();
  if (!auth) return jsonError("UNAUTHORIZED", "Not authenticated", 401);

  try {
    const body = taskCreateSchema.parse(await req.json());
    const task = await prisma.task.create({
      data: {
        title: body.title,
        description: body.description,
        userId: auth.sub,
      },
    });
    return jsonOk({ task }, { status: 201 });
  } catch (err) {
    if (err instanceof ZodError) {
      return jsonError("VALIDATION_ERROR", "Invalid input", 400, zodToDetails(err));
    }
    console.error(err);
    return jsonError("INTERNAL_ERROR", "Unexpected error", 500);
  }
}

