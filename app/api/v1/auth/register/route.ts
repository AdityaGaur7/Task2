import { prisma } from "@/app/lib/db";
import { hashPassword, setAuthCookie, signUserJwt } from "@/app/lib/auth";
import { jsonError, jsonOk, zodToDetails } from "@/app/lib/http";
import { registerSchema } from "@/app/lib/validation";
import { Prisma } from "@prisma/client";
import { ZodError } from "zod";

export async function POST(req: Request) {
  try {
    const body = registerSchema.parse(await req.json());

    const role =
      process.env.NODE_ENV === "development" ? body.role ?? "USER" : "USER";

    const passwordHash = await hashPassword(body.password);

    const user = await prisma.user.create({
      data: { email: body.email, passwordHash, role },
      select: { id: true, email: true, role: true, createdAt: true },
    });

    const token = await signUserJwt({
      sub: user.id,
      email: user.email,
      role: user.role,
    });
    setAuthCookie(token);

    return jsonOk({ user });
  } catch (err) {
    if (err instanceof ZodError) {
      return jsonError("VALIDATION_ERROR", "Invalid input", 400, zodToDetails(err));
    }
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
      return jsonError("CONFLICT", "Email already registered", 409);
    }
    console.error(err);
    return jsonError("INTERNAL_ERROR", "Unexpected error", 500);
  }
}

