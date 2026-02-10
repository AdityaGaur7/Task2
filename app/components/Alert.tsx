"use client";

export function Alert({
  kind,
  title,
  message,
}: {
  kind: "success" | "error" | "info";
  title: string;
  message?: string;
}) {
  const styles =
    kind === "success"
      ? "border-emerald-200 bg-emerald-50 text-emerald-900"
      : kind === "error"
        ? "border-rose-200 bg-rose-50 text-rose-900"
        : "border-zinc-200 bg-zinc-50 text-zinc-900";

  return (
    <div className={`rounded-xl border px-4 py-3 text-sm ${styles}`}>
      <div className="font-medium">{title}</div>
      {message ? <div className="mt-1 opacity-90">{message}</div> : null}
    </div>
  );
}

