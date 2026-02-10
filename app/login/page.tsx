"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Alert } from "@/app/components/Alert";
import { Field } from "@/app/components/Field";
import { apiFetch } from "@/app/lib/client";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<{ kind: "success" | "error"; msg: string } | null>(
    null,
  );
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    const res = await apiFetch<{ user: { id: string; email: string; role: string } }>(
      "/api/v1/auth/login",
      { method: "POST", json: { email, password } },
    );

    setLoading(false);
    if (!res.ok) {
      setStatus({ kind: "error", msg: res.error.message });
      return;
    }
    setStatus({ kind: "success", msg: "Logged in. Redirecting..." });
    router.push("/dashboard");
  }

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-xl flex-col justify-center px-6 py-12">
      <div className="rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold tracking-tight">Login</h1>
          <p className="mt-1 text-sm text-zinc-600">Access your protected dashboard.</p>
        </div>

        <form className="grid gap-4" onSubmit={onSubmit}>
          <Field
            label="Email"
            value={email}
            onChange={setEmail}
            placeholder="you@example.com"
          />
          <Field label="Password" type="password" value={password} onChange={setPassword} />

          {status ? (
            <Alert
              kind={status.kind}
              title={status.kind === "success" ? "Success" : "Error"}
              message={status.msg}
            />
          ) : null}

          <button
            disabled={loading}
            className="mt-2 h-11 rounded-xl bg-zinc-900 px-4 text-sm font-medium text-white disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          <div className="text-sm text-zinc-600">
            New here?{" "}
            <Link className="font-medium text-zinc-900 underline" href="/register">
              Create an account
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

