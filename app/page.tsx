import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="mx-auto flex min-h-screen w-full max-w-3xl flex-col justify-center px-6 py-12">
        <div className="rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm">
          <h1 className="text-3xl font-semibold tracking-tight">Task2: Auth + RBAC + CRUD API</h1>
          <p className="mt-3 text-zinc-600">
            REST API v1 with JWT (httpOnly cookie), role-based access, and a simple UI to test it.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/register"
              className="rounded-xl bg-zinc-900 px-4 py-2 text-sm font-medium text-white"
            >
              Register
            </Link>
            <Link
              href="/login"
              className="rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm font-medium"
            >
              Login
            </Link>
            <Link
              href="/dashboard"
              className="rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm font-medium"
            >
              Dashboard
            </Link>
            <Link
              href="/docs"
              className="rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm font-medium"
            >
              Swagger Docs
            </Link>
          </div>

          <div className="mt-6 rounded-2xl border border-zinc-200 bg-zinc-50 p-4 text-sm text-zinc-700">
            <div className="font-medium text-zinc-900">API base</div>
            <code>/api/v1</code>
            <div className="mt-3 font-medium text-zinc-900">Try</div>
            <code>POST /api/v1/auth/register</code>, <code>POST /api/v1/auth/login</code>,{" "}
            <code>GET /api/v1/tasks</code>
          </div>
        </div>
      </div>
    </div>
  );
}
