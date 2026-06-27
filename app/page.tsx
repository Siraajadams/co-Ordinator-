import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#fff8f6] text-slate-800">
      <nav className="bg-white/90 border-b border-rose-100 px-8 py-5 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-serif text-rose-700">Co-Ordinator</h1>
          <p className="text-xs tracking-[0.3em] text-rose-400">WEDDINGS</p>
        </div>

        <div className="flex gap-6 text-sm">
          <Link href="/" className="hover:text-rose-600">Home</Link>
          <Link href="/register-wedding" className="hover:text-rose-600">Register</Link>
          <Link href="/login" className="hover:text-rose-600">Planner Login</Link>
        </div>
      </nav>

      <section className="grid grid-cols-1 lg:grid-cols-2 min-h-[80vh]">
        <div className="flex items-center px-10 lg:px-20 py-20">
          <div>
            <p className="uppercase tracking-[0.3em] text-rose-500 text-sm mb-6">
              Timeless. Romantic. Unforgettable.
            </p>

            <h2 className="text-6xl lg:text-7xl font-serif leading-tight mb-6">
              Peonies & <br />
              <span className="text-rose-500">Perfect Moments</span>
            </h2>

            <p className="text-lg text-slate-600 max-w-xl mb-8">
              A luxury wedding planning platform for managing enquiries,
              budgets, supplier quotes, approvals and wedding coordination.
            </p>

            <div className="flex gap-4">
              <Link
                href="/register-wedding"
                className="bg-rose-500 text-white px-8 py-4 rounded-xl shadow hover:bg-rose-600"
              >
                Start Planning
              </Link>

              <Link
                href="/dashboard"
                className="border border-rose-300 text-rose-700 px-8 py-4 rounded-xl hover:bg-rose-50"
              >
                Planner Dashboard
              </Link>
            </div>
          </div>
        </div>

        <div className="relative bg-gradient-to-br from-rose-100 via-pink-50 to-white flex items-center justify-center p-10">
          <div className="bg-white/70 backdrop-blur rounded-[3rem] p-10 shadow-xl border border-rose-100 max-w-lg">
            <div className="text-8xl mb-6">🌸</div>
            <h3 className="text-4xl font-serif text-rose-700 mb-4">
              Peony Wedding Theme
            </h3>
            <p className="text-slate-600">
              Soft blush tones, luxury florals, candlelight, glassware,
              elegant tablescapes and unforgettable venue styling.
            </p>
          </div>
        </div>
      </section>

      <section className="px-10 lg:px-20 py-16 bg-white">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            ["💐", "Flower Budget"],
            ["🍽️", "Catering Quotes"],
            ["📸", "Photography"],
            ["💰", "Budget Tracking"],
          ].map(([icon, title]) => (
            <div key={title} className="p-6 rounded-2xl bg-[#fff8f6] border border-rose-100">
              <div className="text-4xl mb-4">{icon}</div>
              <h4 className="font-semibold text-lg">{title}</h4>
              <p className="text-sm text-slate-500 mt-2">
                Track suppliers, quotes, approvals and spend in one place.
              </p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
