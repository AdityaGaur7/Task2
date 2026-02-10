import { getAuthUserFromCookies } from "@/app/lib/auth";
import { prisma } from "@/app/lib/db";
import { jsonError, jsonOk, zodToDetails } from "@/app/lib/http";
import { taskUpdateSchema } from "@/app/lib/validation";
import { ZodError } from "zod";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: Request, ctx: Ctx) {
  const auth = await getAuthUserFromCookies();
  if (!auth) return jsonError("UNAUTHORIZED", "Not authenticated", 401);

  const { id } = await ctx.params;
  const task = await prisma.task.findFirst({ where: { id, userId: auth.sub } });
  if (!task) return jsonError("NOT_FOUND", "Task not found", 404);
  return jsonOk({ task });
}

export async function PATCH(req: Request, ctx: Ctx) {
  const auth = await getAuthUserFromCookies();
  if (!auth) return jsonError("UNAUTHORIZED", "Not authenticated", 401);

  const { id } = await ctx.params;
  try {
    const body = taskUpdateSchema.parse(await req.json());
    const existing = await prisma.task.findFirst({ where: { id, userId: auth.sub } });
    if (!existing) return jsonError("NOT_FOUND", "Task not found", 404);

    const task = await prisma.task.update({
      where: { id },
      data: {
        title: body.title,
        description: body.description === undefined ? undefined : body.description,
        completed: body.completed,
      },
    });
    return jsonOk({ task });
  } catch (err) {
    if (err instanceof ZodError) {
      return jsonError("VALIDATION_ERROR", "Invalid input", 400, zodToDetails(err));
    }
    console.error(err);
    return jsonError("INTERNAL_ERROR", "Unexpected error", 500);
  }
}

export async function DELETE(_req: Request, ctx: Ctx) {
  const auth = await getAuthUserFromCookies();
  if (!auth) return jsonError("UNAUTHORIZED", "Not authenticated", 401);

  const { id } = await ctx.params;
  const existing = await prisma.task.findFirst({ where: { id, userId: auth.sub } });
  if (!existing) return jsonError("NOT_FOUND", "Task not found", 404);

  await prisma.task.delete({ where: { id } });
  return jsonOk({ deleted: true });
}

