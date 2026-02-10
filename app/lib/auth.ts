import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import { z } from "zod";

export const roleSchema = z.enum(["USER", "ADMIN"]);
export type Role = z.infer<typeof roleSchema>;

const jwtSecret = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("Missing JWT_SECRET");
  return new TextEncoder().encode(secret);
};

export const JWT_COOKIE_NAME = "task2_token";

export const jwtExpiresInSeconds = () => {
  const raw = process.env.JWT_EXPIRES_IN_SECONDS;
  const parsed = raw ? Number(raw) : 3600;
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 3600;
};

export async function hashPassword(password: string) {
  const saltRounds = 12;
  return bcrypt.hash(password, saltRounds);
}

export async function verifyPassword(password: string, passwordHash: string) {
  return bcrypt.compare(password, passwordHash);
}

export type JwtUser = {
  sub: string; // user id
  email: string;
  role: Role;
};

export async function signUserJwt(payload: JwtUser) {
  const expiresIn = jwtExpiresInSeconds();
  const now = Math.floor(Date.now() / 1000);
  return new SignJWT({ email: payload.email, role: payload.role })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(payload.sub)
    .setIssuedAt(now)
    .setExpirationTime(now + expiresIn)
    .sign(jwtSecret());
}

export async function verifyUserJwt(token: string) {
  const { payload } = await jwtVerify(token, jwtSecret(), { algorithms: ["HS256"] });
  const role = roleSchema.safeParse(payload.role);
  if (!payload.sub || typeof payload.sub !== "string") throw new Error("Invalid token subject");
  if (!payload.email || typeof payload.email !== "string") throw new Error("Invalid token email");
  if (!role.success) throw new Error("Invalid token role");
  return { sub: payload.sub, email: payload.email, role: role.data } satisfies JwtUser;
}

export function setAuthCookie(token: string) {
  const secure = process.env.NODE_ENV === "production";
  cookies().set({
    name: JWT_COOKIE_NAME,
    value: token,
    httpOnly: true,
    secure,
    sameSite: "lax",
    path: "/",
    maxAge: jwtExpiresInSeconds(),
  });
}

export function clearAuthCookie() {
  cookies().set({
    name: JWT_COOKIE_NAME,
    value: "",
    httpOnly: true,
    path: "/",
    maxAge: 0,
  });
}

export async function getAuthUserFromCookies() {
  const token = cookies().get(JWT_COOKIE_NAME)?.value;
  if (!token) return null;
  try {
    return await verifyUserJwt(token);
  } catch {
    return null;
  }
}

