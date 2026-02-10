import Swagger from "./Swagger";

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto w-full max-w-5xl px-6 py-6">
        <h1 className="text-2xl font-semibold tracking-tight">API Docs</h1>
        <p className="mt-1 text-sm text-zinc-600">
          Swagger UI for <code className="rounded bg-zinc-100 px-1">/api/v1</code>.
        </p>
      </div>
      <Swagger />
    </div>
  );
}

