import { ZodError } from "zod";

export type ApiErrorCode =
  | "VALIDATION_ERROR"
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "CONFLICT"
  | "INTERNAL_ERROR";

export function jsonOk<T>(data: T, init?: ResponseInit) {
  return Response.json({ ok: true as const, data }, init);
}

export function jsonError(
  code: ApiErrorCode,
  message: string,
  status: number,
  details?: unknown,
) {
  return Response.json(
    { ok: false as const, error: { code, message, details } },
    { status },
  );
}

export function zodToDetails(err: ZodError) {
  return err.issues.map((i) => ({
    path: i.path.join("."),
    message: i.message,
    code: i.code,
  }));
}

