"use client";

export function Field({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
}: {
  label: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="grid gap-2 text-sm">
      <span className="font-medium text-zinc-900">{label}</span>
      <input
        className="h-11 rounded-xl border border-zinc-200 bg-white px-3 outline-none ring-zinc-900/10 focus:ring-4"
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete={type === "password" ? "current-password" : "on"}
      />
    </label>
  );
}

