"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { apiFetch, ApiResp } from "@/app/lib/client";
import { Alert } from "@/app/components/Alert";
import { Field } from "@/app/components/Field";

type Me = { user: { sub: string; email: string; role: "USER" | "ADMIN" } };
type Task = {
  id: string;
  title: string;
  description: string | null;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
};

export default function DashboardPage() {
  const router = useRouter();
  const [me, setMe] = useState<Me["user"] | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [flash, setFlash] = useState<{ kind: "success" | "error" | "info"; msg: string } | null>(
    null,
  );

  const completedCount = useMemo(() => tasks.filter((t) => t.completed).length, [tasks]);

  async function load() {
    setLoading(true);
    setFlash(null);

    const meRes = await apiFetch<Me>("/api/v1/auth/me");
    if (!meRes.ok) {
      setLoading(false);
      router.push("/login");
      return;
    }
    setMe(meRes.data.user);

    const tasksRes = await apiFetch<{ tasks: Task[] }>("/api/v1/tasks");
    if (!tasksRes.ok) {
      setFlash({ kind: "error", msg: tasksRes.error.message });
      setLoading(false);
      return;
    }
    setTasks(tasksRes.data.tasks);
    setLoading(false);
  }

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function logout() {
    await apiFetch("/api/v1/auth/logout", { method: "POST" });
    router.push("/login");
  }

  async function createTask(e: React.FormEvent) {
    e.preventDefault();
    setFlash(null);

    const res = await apiFetch<{ task: Task }>("/api/v1/tasks", {
      method: "POST",
      json: { title, description: description.trim() ? description : undefined },
    });
    if (!res.ok) return setFlash({ kind: "error", msg: res.error.message });

    setTitle("");
    setDescription("");
    setTasks((prev) => [res.data.task, ...prev]);
    setFlash({ kind: "success", msg: "Task created." });
  }

  async function toggleCompleted(task: Task) {
    const res = await apiFetch<{ task: Task }>(`/api/v1/tasks/${task.id}`, {
      method: "PATCH",
      json: { completed: !task.completed },
    });
    if (!res.ok) return setFlash({ kind: "error", msg: res.error.message });
    setTasks((prev) => prev.map((t) => (t.id === task.id ? res.data.task : t)));
  }

  async function remove(task: Task) {
    const res = (await apiFetch<{ deleted: boolean }>(`/api/v1/tasks/${task.id}`, {
      method: "DELETE",
    })) as ApiResp<{ deleted: boolean }>;
    if (!res.ok) return setFlash({ kind: "error", msg: res.error.message });
    setTasks((prev) => prev.filter((t) => t.id !== task.id));
    setFlash({ kind: "success", msg: "Task deleted." });
  }

  async function loadUsersAdmin() {
    const res = await apiFetch<{ users: Array<{ id: string; email: string; role: string }> }>(
      "/api/v1/admin/users",
    );
    if (!res.ok) return setFlash({ kind: "error", msg: res.error.message });
    setFlash({ kind: "info", msg: `Admin endpoint OK. Users: ${res.data.users.length}` });
  }

  if (loading) {
    return (
      <div className="mx-auto flex min-h-screen w-full max-w-3xl items-center px-6">
        <div className="text-sm text-zinc-600">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="mx-auto min-h-screen w-full max-w-3xl px-6 py-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
          <p className="mt-1 text-sm text-zinc-600">
            Signed in as <span className="font-medium text-zinc-900">{me?.email}</span> (
            {me?.role})
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/docs"
            className="rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm font-medium"
          >
            API Docs
          </Link>
          <button
            onClick={logout}
            className="rounded-xl bg-zinc-900 px-3 py-2 text-sm font-medium text-white"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="mt-6 grid gap-4">
        {flash ? (
          <Alert
            kind={flash.kind}
            title={flash.kind === "error" ? "Error" : flash.kind === "success" ? "Success" : "Info"}
            message={flash.msg}
          />
        ) : null}

        <div className="rounded-3xl border border-zinc-200 bg-white p-6">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="text-sm text-zinc-600">
              Tasks: <span className="font-medium text-zinc-900">{tasks.length}</span> · Completed:{" "}
              <span className="font-medium text-zinc-900">{completedCount}</span>
            </div>
            {me?.role === "ADMIN" ? (
              <button
                onClick={loadUsersAdmin}
                className="rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm font-medium"
              >
                Test admin/users
              </button>
            ) : null}
          </div>

          <form className="mt-4 grid gap-3" onSubmit={createTask}>
            <Field label="Title" value={title} onChange={setTitle} placeholder="e.g., Buy milk" />
            <label className="grid gap-2 text-sm">
              <span className="font-medium text-zinc-900">Description (optional)</span>
              <textarea
                className="min-h-24 rounded-xl border border-zinc-200 bg-white px-3 py-2 outline-none ring-zinc-900/10 focus:ring-4"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Extra details..."
              />
            </label>
            <button className="h-11 rounded-xl bg-zinc-900 px-4 text-sm font-medium text-white">
              Create task
            </button>
          </form>
        </div>

        <div className="grid gap-2">
          {tasks.map((t) => (
            <div
              key={t.id}
              className="flex items-start justify-between gap-3 rounded-2xl border border-zinc-200 bg-white p-4"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleCompleted(t)}
                    className={`mt-0.5 h-5 w-5 rounded border ${
                      t.completed ? "border-emerald-400 bg-emerald-400" : "border-zinc-300 bg-white"
                    }`}
                    aria-label="Toggle completed"
                  />
                  <div className="min-w-0">
                    <div
                      className={`truncate font-medium ${
                        t.completed ? "text-zinc-500 line-through" : "text-zinc-900"
                      }`}
                    >
                      {t.title}
                    </div>
                    {t.description ? (
                      <div className="mt-1 line-clamp-2 text-sm text-zinc-600">{t.description}</div>
                    ) : null}
                  </div>
                </div>
              </div>
              <button
                onClick={() => remove(t)}
                className="rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm font-medium text-zinc-900"
              >
                Delete
              </button>
            </div>
          ))}

          {tasks.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-zinc-300 bg-white p-6 text-sm text-zinc-600">
              No tasks yet. Create your first one above.
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

