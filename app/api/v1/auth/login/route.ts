import { prisma } from "@/app/lib/db";
import { setAuthCookie, signUserJwt, verifyPassword } from "@/app/lib/auth";
import { jsonError, jsonOk, zodToDetails } from "@/app/lib/http";
import { loginSchema } from "@/app/lib/validation";
import { ZodError } from "zod";

export async function POST(req: Request) {
  try {
    const body = loginSchema.parse(await req.json());

    const user = await prisma.user.findUnique({
      where: { email: body.email },
      select: { id: true, email: true, role: true, passwordHash: true },
    });
    if (!user) return jsonError("UNAUTHORIZED", "Invalid credentials", 401);

    const ok = await verifyPassword(body.password, user.passwordHash);
    if (!ok) return jsonError("UNAUTHORIZED", "Invalid credentials", 401);

    const token = await signUserJwt({ sub: user.id, email: user.email, role: user.role });
    setAuthCookie(token);

    return jsonOk({ user: { id: user.id, email: user.email, role: user.role } });
  } catch (err) {
    if (err instanceof ZodError) {
      return jsonError("VALIDATION_ERROR", "Invalid input", 400, zodToDetails(err));
    }
    console.error(err);
    return jsonError("INTERNAL_ERROR", "Unexpected error", 500);
  }
}

