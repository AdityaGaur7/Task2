"use client";

import Link from "next/link";
import { useState } from "react";
import { apiFetch } from "@/app/lib/client";
import { Alert } from "@/app/components/Alert";
import { Field } from "@/app/components/Field";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"USER" | "ADMIN">("USER");
  const [status, setStatus] = useState<{ kind: "success" | "error"; msg: string } | null>(
    null,
  );
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    const res = await apiFetch<{ user: { id: string; email: string; role: string } }>(
      "/api/v1/auth/register",
      { method: "POST", json: { email, password, role } },
    );

    setLoading(false);
    if (!res.ok) {
      setStatus({ kind: "error", msg: res.error.message });
      return;
    }
    setStatus({ kind: "success", msg: "Registered. You are now logged in." });
  }

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-xl flex-col justify-center px-6 py-12">
      <div className="rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold tracking-tight">Create account</h1>
          <p className="mt-1 text-sm text-zinc-600">
            This uses a JWT stored in an httpOnly cookie.
          </p>
        </div>

        <form className="grid gap-4" onSubmit={onSubmit}>
          <Field
            label="Email"
            value={email}
            onChange={setEmail}
            placeholder="you@example.com"
          />
          <Field label="Password" type="password" value={password} onChange={setPassword} />

          <label className="grid gap-2 text-sm">
            <span className="font-medium text-zinc-900">
              Role <span className="text-zinc-500">(dev only)</span>
            </span>
            <select
              className="h-11 rounded-xl border border-zinc-200 bg-white px-3 outline-none ring-zinc-900/10 focus:ring-4"
              value={role}
              onChange={(e) => setRole(e.target.value as "USER" | "ADMIN")}
            >
              <option value="USER">USER</option>
              <option value="ADMIN">ADMIN</option>
            </select>
          </label>

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
            {loading ? "Creating..." : "Create account"}
          </button>

          <div className="text-sm text-zinc-600">
            Already have an account?{" "}
            <Link className="font-medium text-zinc-900 underline" href="/login">
              Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

