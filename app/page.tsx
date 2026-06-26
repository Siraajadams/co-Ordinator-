import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
      <div className="bg-white max-w-xl w-full rounded-3xl shadow-xl p-10 text-center">
        <h1 className="text-4xl font-bold text-slate-900 mb-4">
          Wedding Coordinator
        </h1>

        <p className="text-slate-600 mb-8">
          Manage wedding enquiries, budgets, supplier quotes, approvals and planning dashboards.
        </p>

        <div className="flex flex-col gap-4">
          <Link
            href="/register-wedding"
            className="bg-pink-600 text-white py-4 rounded-xl font-semibold"
          >
            Register Wedding
          </Link>

          <Link
            href="/login"
            className="bg-slate-900 text-white py-4 rounded-xl font-semibold"
          >
            Planner Login
          </Link>

          <Link
            href="/dashboard"
            className="border border-slate-300 py-4 rounded-xl font-semibold"
          >
            Open Planner Dashboard
          </Link>
        </div>
      </div>
    </main>
  );
}
