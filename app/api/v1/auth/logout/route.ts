import { clearAuthCookie } from "@/app/lib/auth";
import { jsonOk } from "@/app/lib/http";

export async function POST() {
  clearAuthCookie();
  return jsonOk({ loggedOut: true });
}

