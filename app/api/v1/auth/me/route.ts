import { getAuthUserFromCookies } from "@/app/lib/auth";
import { jsonError, jsonOk } from "@/app/lib/http";

export async function GET() {
  const user = await getAuthUserFromCookies();
  if (!user) return jsonError("UNAUTHORIZED", "Not authenticated", 401);
  return jsonOk({ user });
}

