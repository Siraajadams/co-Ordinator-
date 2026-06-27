import Link from "next/link";

const s: Record<string, React.CSSProperties> = {
  page: { minHeight: "100vh", background: "linear-gradient(135deg,#fff8f6,#fff,#fdecef)", color: "#263238" },
  nav: { maxWidth: 1180, margin: "0 auto", padding: "26px 22px", display: "flex", justifyContent: "space-between", alignItems: "center" },
  brand: { fontFamily: "Georgia, serif", color: "#9f4662", fontSize: 28, fontWeight: 700 },
  links: { display: "flex", gap: 22, fontSize: 14, color: "#6b7280" },
  hero: { maxWidth: 1180, margin: "0 auto", padding: "44px 22px 70px", display: "grid", gridTemplateColumns: "1.05fr .95fr", gap: 38, alignItems: "center" },
  eyebrow: { color: "#be607b", letterSpacing: 4, textTransform: "uppercase", fontSize: 12, fontWeight: 700 },
  h1: { fontFamily: "Georgia, serif", fontSize: 68, lineHeight: 1.02, margin: "18px 0", color: "#2f2a2b" },
  text: { fontSize: 18, lineHeight: 1.7, color: "#667085", maxWidth: 610 },
  buttons: { display: "flex", gap: 14, marginTop: 32, flexWrap: "wrap" },
  primary: { background: "#c95d7b", color: "white", padding: "15px 24px", borderRadius: 999, fontWeight: 700, boxShadow: "0 14px 30px rgba(201,93,123,.25)" },
  secondary: { background: "white", color: "#9f4662", padding: "15px 24px", borderRadius: 999, fontWeight: 700, border: "1px solid #f3cbd6" },
  visual: { borderRadius: 34, padding: 28, background: "linear-gradient(160deg,#fff,#fbe5eb)", boxShadow: "0 28px 80px rgba(159,70,98,.2)", border: "1px solid #f7d8df" },
  photo: { minHeight: 470, borderRadius: 28, background: "radial-gradient(circle at 25% 20%,#fff 0,#fff 10%,transparent 11%), radial-gradient(circle at 80% 30%,#fff 0,#fff 8%,transparent 9%), linear-gradient(145deg,#f7becd,#fff1f4 45%,#f7d1db)", display: "flex", alignItems: "end", padding: 30 },
  glass: { background: "rgba(255,255,255,.78)", borderRadius: 24, padding: 24, backdropFilter: "blur(8px)", border: "1px solid #fff" },
  section: { maxWidth: 1180, margin: "0 auto", padding: "40px 22px 80px" },
  grid4: { display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 18 },
  card: { background: "white", borderRadius: 24, padding: 24, boxShadow: "0 16px 40px rgba(31,41,55,.07)", border: "1px solid #f8dce3" },
  cta: { maxWidth: 1180, margin: "0 auto 80px", borderRadius: 34, padding: 44, background: "#2f2a2b", color: "white", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 24 }
};

export default function HomePage() {
  return (
    <main style={s.page}>
      <nav style={s.nav}>
        <Link href="/" style={s.brand}>Co-Ordinator <span style={{ color: "#d88aa0" }}>Weddings</span></Link>
        <div style={s.links}>
          <Link href="/register-wedding">Register Wedding</Link>
          <Link href="/login">Planner Login</Link>
          <Link href="/dashboard">Dashboard</Link>
        </div>
      </nav>

      <section style={s.hero}>
        <div>
          <p style={s.eyebrow}>Luxury wedding planning CRM</p>
          <h1 style={s.h1}>Peonies, planning & perfect moments.</h1>
          <p style={s.text}>
            A premium wedding coordination platform for client enquiries, supplier quotes,
            approvals, budgets and wedding dashboards — styled around romantic blush peonies.
          </p>
          <div style={s.buttons}>
            <Link href="/register-wedding" style={s.primary}>Start Wedding Registration</Link>
            <Link href="/login" style={s.secondary}>Planner Login</Link>
          </div>
        </div>

        <div style={s.visual}>
          <div style={s.photo}>
            <div style={s.glass}>
              <div style={{ fontSize: 52 }}>🌸</div>
              <h2 style={{ fontFamily: "Georgia, serif", fontSize: 34, margin: "8px 0", color: "#9f4662" }}>
                Peony Elegance
              </h2>
              <p style={{ color: "#667085", lineHeight: 1.6 }}>
                Soft blush florals, candlelight, luxury tablescapes, draping and venue styling.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section style={s.section}>
        <div style={s.grid4}>
          {[
            ["💐", "Budget Manager", "Track flower, venue, décor and catering budgets."],
            ["📋", "Quote CRM", "Review supplier quotes in a simple sales-style pipeline."],
            ["✅", "Approvals", "Approve, reject or request changes before spend is committed."],
            ["💰", "Income View", "Monitor budget, actual spend, payments and margin."],
          ].map(([icon, title, text]) => (
            <div style={s.card} key={title}>
              <div style={{ fontSize: 40 }}>{icon}</div>
              <h3 style={{ margin: "16px 0 8px", fontSize: 20 }}>{title}</h3>
              <p style={{ color: "#667085", lineHeight: 1.55 }}>{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section style={s.cta}>
        <div>
          <h2 style={{ fontFamily: "Georgia, serif", fontSize: 36, margin: 0 }}>Create a beautiful wedding profile today.</h2>
          <p style={{ color: "#f5d4dc", marginBottom: 0 }}>Client registration feeds directly into the planner CRM dashboard.</p>
        </div>
        <Link href="/register-wedding" style={{ ...s.primary, background: "#fff", color: "#9f4662" }}>Register Now</Link>
      </section>
    </main>
  );
}
