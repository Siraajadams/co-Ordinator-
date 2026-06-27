import Link from "next/link";

export default function HomePage() {
  return (
    <main style={styles.page}>
      <header style={styles.header}>
        <Link href="/" style={styles.logoWrap}>
          <div style={styles.logoIcon}>🌸</div>
          <div>
            <h1 style={styles.logo}>Co-Ordinator</h1>
            <p style={styles.logoSub}>WEDDINGS</p>
          </div>
        </Link>

        <nav style={styles.nav}>
          <Link href="/register-wedding" style={styles.navLink}>
            Register
          </Link>
          <Link href="/login" style={styles.navLink}>
            Login
          </Link>
          <Link href="/dashboard" style={styles.navButton}>
            Dashboard
          </Link>
        </nav>
      </header>

      <section style={styles.hero}>
        <div style={styles.heroText}>
          <p style={styles.eyebrow}>Luxury Wedding Planning CRM</p>

          <h2 style={styles.heroTitle}>
            Peonies, planning & perfect moments.
          </h2>

          <p style={styles.heroSub}>
            A premium wedding coordination platform for enquiries, supplier
            quotes, approvals, budgets and beautiful wedding experiences.
          </p>

          <div style={styles.actions}>
            <Link href="/register-wedding" style={styles.primaryButton}>
              Register Your Wedding
            </Link>
            <Link href="/login" style={styles.secondaryButton}>
              Planner Login
            </Link>
          </div>
        </div>

        <div style={styles.heroCard}>
          <div style={styles.flower}>🌸</div>
          <h3 style={styles.cardTitle}>Peonies & Blush</h3>
          <p style={styles.cardText}>
            Soft florals, champagne tones, romantic styling and luxury supplier
            coordination.
          </p>
        </div>
      </section>

      <section style={styles.features}>
        {[
          ["💍", "Client Registration", "Capture wedding enquiries beautifully."],
          ["🌸", "Supplier CRM", "Track florists, caterers and photographers."],
          ["💰", "Budget Tracker", "Monitor budget, quotes and approvals."],
          ["📅", "Timeline", "Plan tasks from enquiry to wedding day."],
        ].map(([icon, title, text]) => (
          <div key={title} style={styles.featureCard}>
            <div style={styles.featureIcon}>{icon}</div>
            <h3 style={styles.featureTitle}>{title}</h3>
            <p style={styles.featureText}>{text}</p>
          </div>
        ))}
      </section>
    </main>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #fff8f6 0%, #fff1f4 100%)",
    color: "#33282d",
    fontFamily: "Arial, Helvetica, sans-serif",
    overflowX: "hidden",
  },
  header: {
    width: "100%",
    padding: "22px clamp(20px, 5vw, 72px)",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 18,
    background: "rgba(255,255,255,0.88)",
    borderBottom: "1px solid #f1d5d8",
    position: "sticky",
    top: 0,
    zIndex: 10,
  },
  logoWrap: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    textDecoration: "none",
    minWidth: 0,
  },
  logoIcon: {
    fontSize: 32,
  },
  logo: {
    margin: 0,
    color: "#9b3e54",
    fontFamily: "Georgia, serif",
    fontSize: "clamp(24px, 4vw, 38px)",
    lineHeight: 1,
  },
  logoSub: {
    margin: "6px 0 0",
    color: "#c46b7f",
    fontSize: 11,
    letterSpacing: 4,
  },
  nav: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    flexWrap: "wrap",
    justifyContent: "flex-end",
  },
  navLink: {
    color: "#6b5f66",
    textDecoration: "none",
    fontWeight: 700,
    fontSize: 14,
    padding: "10px 8px",
  },
  navButton: {
    background: "#a63d4f",
    color: "white",
    textDecoration: "none",
    fontWeight: 800,
    fontSize: 14,
    padding: "11px 16px",
    borderRadius: 999,
  },
  hero: {
    display: "grid",
    gridTemplateColumns: "minmax(0, 1.1fr) minmax(280px, 0.9fr)",
    gap: "clamp(26px, 5vw, 70px)",
    alignItems: "center",
    padding: "clamp(44px, 8vw, 100px) clamp(20px, 6vw, 88px)",
  },
  heroText: {
    maxWidth: 760,
  },
  eyebrow: {
    color: "#b94f65",
    textTransform: "uppercase",
    letterSpacing: 5,
    fontSize: "clamp(11px, 2.6vw, 14px)",
    fontWeight: 900,
    marginBottom: 18,
  },
  heroTitle: {
    fontFamily: "Georgia, serif",
    fontSize: "clamp(48px, 12vw, 112px)",
    lineHeight: 0.95,
    margin: "0 0 24px",
    color: "#2f292c",
    letterSpacing: "-3px",
  },
  heroSub: {
    fontSize: "clamp(18px, 4vw, 25px)",
    lineHeight: 1.55,
    color: "#6e6470",
    maxWidth: 700,
    marginBottom: 30,
  },
  actions: {
    display: "flex",
    gap: 14,
    flexWrap: "wrap",
  },
  primaryButton: {
    background: "#a63d4f",
    color: "white",
    textDecoration: "none",
    padding: "16px 22px",
    borderRadius: 16,
    fontWeight: 900,
    boxShadow: "0 15px 35px rgba(166,61,79,0.22)",
  },
  secondaryButton: {
    background: "white",
    color: "#a63d4f",
    border: "1px solid #e6b8c1",
    textDecoration: "none",
    padding: "16px 22px",
    borderRadius: 16,
    fontWeight: 900,
  },
  heroCard: {
    background: "rgba(255,255,255,0.82)",
    border: "1px solid #f0cdd3",
    borderRadius: 36,
    padding: "clamp(28px, 5vw, 48px)",
    boxShadow: "0 30px 80px rgba(143,52,69,0.14)",
    minHeight: 360,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
  flower: {
    fontSize: 86,
    marginBottom: 18,
  },
  cardTitle: {
    fontFamily: "Georgia, serif",
    color: "#9b3e54",
    fontSize: 38,
    margin: "0 0 14px",
  },
  cardText: {
    color: "#6e6470",
    fontSize: 18,
    lineHeight: 1.6,
  },
  features: {
    padding: "0 clamp(20px, 6vw, 88px) 70px",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: 18,
  },
  featureCard: {
    background: "white",
    border: "1px solid #f1d5d8",
    borderRadius: 26,
    padding: 24,
    boxShadow: "0 18px 40px rgba(143,52,69,0.08)",
  },
  featureIcon: {
    fontSize: 36,
    marginBottom: 14,
  },
  featureTitle: {
    margin: "0 0 8px",
    color: "#8f3445",
    fontSize: 20,
  },
  featureText: {
    margin: 0,
    color: "#6f6269",
    lineHeight: 1.5,
  },
};
