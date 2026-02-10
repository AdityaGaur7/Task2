export type ApiOk<T> = { ok: true; data: T };
export type ApiErr = {
  ok: false;
  error: { code: string; message: string; details?: unknown };
};
export type ApiResp<T> = ApiOk<T> | ApiErr;

export async function apiFetch<T>(
  path: string,
  init?: RequestInit & { json?: unknown },
): Promise<ApiResp<T>> {
  const res = await fetch(path, {
    ...init,
    method: init?.method ?? (init?.json ? "POST" : "GET"),
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
    body: init?.json ? JSON.stringify(init.json) : init?.body,
    credentials: "include",
  });

  const data = (await res.json().catch(() => null)) as ApiResp<T> | null;
  if (data && typeof data === "object" && "ok" in data) return data as ApiResp<T>;
  return { ok: false, error: { code: "INTERNAL_ERROR", message: "Bad JSON response" } };
}

