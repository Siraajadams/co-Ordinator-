"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

type Wedding = {
  id: string;
  bride_name: string;
  groom_name: string;
  contact_name: string;
  email: string;
  mobile: string;
  wedding_date: string;
  venue_name: string;
  guest_count: number;
  theme: string;
  total_budget: number;
  status: string;
  planning_stage?: string;
  created_at: string;
};

const stages = [
  "New Enquiry",
  "Consultation Booked",
  "Proposal Sent",
  "Deposit Received",
  "Planning",
  "Supplier Booking",
  "Final Review",
  "Wedding Day",
  "Completed",
];

export default function DashboardPage() {
  const [weddings, setWeddings] = useState<Wedding[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadWeddings();
  }, []);

  async function loadWeddings() {
    setLoading(true);

    const { data, error } = await supabase
      .from("weddings")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) setMessage(error.message);
    else setWeddings(data || []);

    setLoading(false);
  }

  async function updateStage(id: string, stage: string) {
    const { error } = await supabase
      .from("weddings")
      .update({
        status: stage,
        planning_stage: stage,
      })
      .eq("id", id);

    if (error) {
      alert(error.message);
      return;
    }

    loadWeddings();
  }

  const filtered = weddings.filter((w) => {
    const term = search.toLowerCase();
    return (
      w.bride_name?.toLowerCase().includes(term) ||
      w.groom_name?.toLowerCase().includes(term) ||
      w.venue_name?.toLowerCase().includes(term) ||
      w.email?.toLowerCase().includes(term)
    );
  });

  const totalBudget = weddings.reduce(
    (sum, w) => sum + Number(w.total_budget || 0),
    0
  );

  const active = weddings.filter(
    (w) => !["Completed", "Cancelled", "Lost"].includes(w.status || "")
  ).length;

  const upcoming = weddings.filter((w) => {
    if (!w.wedding_date) return false;
    return new Date(w.wedding_date) >= new Date();
  }).length;

  const pipelineGroups = useMemo(() => {
    return stages.map((stage) => ({
      stage,
      items: filtered.filter(
        (w) => (w.planning_stage || w.status || "New Enquiry") === stage
      ),
    }));
  }, [filtered]);

  return (
    <main style={styles.page}>
      <aside style={styles.sidebar}>
        <h1 style={styles.logo}>Co-Ordinator</h1>
        <p style={styles.logoSub}>WEDDING CRM</p>

        <nav style={styles.nav}>
          <Link href="/dashboard" style={styles.navActive}>📊 Dashboard</Link>
          <a href="#weddings" style={styles.navItem}>💍 Weddings</a>
          <a href="#suppliers" style={styles.navItem}>🌸 Suppliers</a>
          <a href="#budgets" style={styles.navItem}>💰 Budgets</a>
          <a href="#quotes" style={styles.navItem}>📄 Quotes</a>
          <a href="#approvals" style={styles.navItem}>✅ Approvals</a>
          <a href="#timeline" style={styles.navItem}>📅 Timeline</a>
          <a href="#reports" style={styles.navItem}>📈 Reports</a>
        </nav>

        <Link href="/register-wedding" style={styles.newButton}>
          + New Wedding
        </Link>
      </aside>

      <section style={styles.content}>
        <div style={styles.header}>
          <div>
            <p style={styles.eyebrow}>Planner Workspace</p>
            <h2 style={styles.title}>Wedding Coordination Dashboard</h2>
            <p style={styles.subtitle}>
              Manage weddings, suppliers, budgets, quotes and approvals.
            </p>
          </div>

          <input
            placeholder="Search wedding, venue or client..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={styles.search}
          />
        </div>

        {message && <div style={styles.error}>{message}</div>}

        <div style={styles.statsGrid}>
          <StatCard label="Total Weddings" value={weddings.length} />
          <StatCard label="Active Weddings" value={active} />
          <StatCard label="Upcoming Weddings" value={upcoming} />
          <StatCard
            label="Total Pipeline Budget"
            value={`R ${totalBudget.toLocaleString()}`}
          />
        </div>

        <section style={styles.section}>
          <div style={styles.sectionHeader}>
            <div>
              <h3 style={styles.sectionTitle}>Wedding CRM Pipeline</h3>
              <p style={styles.sectionSub}>
                Move each wedding through the planning process.
              </p>
            </div>
            <button onClick={loadWeddings} style={styles.refreshButton}>
              Refresh
            </button>
          </div>

          {loading ? (
            <p>Loading weddings...</p>
          ) : (
            <div style={styles.pipeline}>
              {pipelineGroups.map((group) => (
                <div key={group.stage} style={styles.column}>
                  <div style={styles.columnHeader}>
                    <span>{group.stage}</span>
                    <strong>{group.items.length}</strong>
                  </div>

                  {group.items.length === 0 && (
                    <div style={styles.emptyCard}>No weddings</div>
                  )}

                  {group.items.map((wedding) => (
                    <div key={wedding.id} style={styles.card}>
                      <div style={styles.cardTop}>
                        <span style={styles.badge}>
                          {wedding.theme || "Wedding"}
                        </span>
                        <span style={styles.date}>
                          {formatDate(wedding.wedding_date)}
                        </span>
                      </div>

                      <h4 style={styles.cardTitle}>
                        {wedding.bride_name} & {wedding.groom_name}
                      </h4>

                      <p style={styles.cardText}>
                        <strong>Venue:</strong> {wedding.venue_name || "TBC"}
                      </p>

                      <p style={styles.cardText}>
                        <strong>Guests:</strong> {wedding.guest_count || 0}
                      </p>

                      <p style={styles.cardText}>
                        <strong>Budget:</strong> R{" "}
                        {Number(wedding.total_budget || 0).toLocaleString()}
                      </p>

                      <p style={styles.cardText}>
                        <strong>Contact:</strong> {wedding.contact_name || "-"}
                      </p>

                      <div style={styles.cardActions}>
                        <Link
                          href={`/weddings/${wedding.id}`}
                          style={styles.openButton}
                        >
                          Open
                        </Link>

                        <select
                          value={
                            wedding.planning_stage ||
                            wedding.status ||
                            "New Enquiry"
                          }
                          onChange={(e) =>
                            updateStage(wedding.id, e.target.value)
                          }
                          style={styles.stageSelect}
                        >
                          {stages.map((stage) => (
                            <option key={stage}>{stage}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}
        </section>

        <section id="weddings" style={styles.section}>
          <h3 style={styles.sectionTitle}>Wedding Management</h3>
          <p style={styles.sectionSub}>
            All registered weddings and client profiles.
          </p>

          <div style={styles.tableWrap}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th>Couple</th>
                  <th>Date</th>
                  <th>Venue</th>
                  <th>Guests</th>
                  <th>Budget</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((w) => (
                  <tr key={w.id}>
                    <td>{w.bride_name} & {w.groom_name}</td>
                    <td>{formatDate(w.wedding_date)}</td>
                    <td>{w.venue_name || "TBC"}</td>
                    <td>{w.guest_count || 0}</td>
                    <td>R {Number(w.total_budget || 0).toLocaleString()}</td>
                    <td>{w.planning_stage || w.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section id="suppliers" style={styles.section}>
          <h3 style={styles.sectionTitle}>Supplier CRM</h3>
          <p style={styles.sectionSub}>
            Manage florists, caterers, photographers, venues and musicians.
          </p>

          <div style={styles.grid3}>
            {[
              "🌸 Florists",
              "🍽 Caterers",
              "📷 Photographers",
              "🎻 Entertainment",
              "🏛 Venues",
              "🎂 Cakes",
            ].map((item) => (
              <div key={item} style={styles.miniCard}>{item}</div>
            ))}
          </div>
        </section>

        <section id="budgets" style={styles.section}>
          <h3 style={styles.sectionTitle}>Budget Dashboard</h3>
          <p style={styles.sectionSub}>
            Track estimated budget, approved spend and remaining balance.
          </p>

          <div style={styles.statsGrid}>
            <StatCard label="Estimated Budget" value={`R ${totalBudget.toLocaleString()}`} />
            <StatCard label="Approved Spend" value="R 0" />
            <StatCard label="Outstanding Quotes" value="0" />
            <StatCard label="Remaining Budget" value={`R ${totalBudget.toLocaleString()}`} />
          </div>
        </section>

        <section id="quotes" style={styles.section}>
          <h3 style={styles.sectionTitle}>Supplier Quotes</h3>
          <p style={styles.sectionSub}>
            Review quote status and supplier approvals.
          </p>
        </section>

        <section id="approvals" style={styles.section}>
          <h3 style={styles.sectionTitle}>Client Approvals</h3>
          <p style={styles.sectionSub}>
            Pending approvals, rejected quotes and approved wedding items.
          </p>
        </section>

        <section id="timeline" style={styles.section}>
          <h3 style={styles.sectionTitle}>Wedding Timeline</h3>
          <p style={styles.sectionSub}>
            Planning checklist and key event dates.
          </p>

          <div style={styles.timeline}>
            {[
              "Venue confirmed",
              "Supplier quotes requested",
              "Client approvals",
              "Final supplier payments",
              "Wedding day coordination",
            ].map((item, index) => (
              <div key={item} style={styles.timelineItem}>
                <strong>{index + 1}</strong>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </section>

        <section id="reports" style={styles.section}>
          <h3 style={styles.sectionTitle}>Business Reports</h3>
          <p style={styles.sectionSub}>
            Income statement, budget summary and wedding profitability.
          </p>
        </section>
      </section>
    </main>
  );
}

function StatCard({ label, value }: { label: string; value: any }) {
  return (
    <div style={styles.statCard}>
      <p style={styles.statLabel}>{label}</p>
      <h3 style={styles.statValue}>{value}</h3>
    </div>
  );
}

function formatDate(date?: string) {
  if (!date) return "Date TBC";
  return new Date(date).toLocaleDateString("en-ZA", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

const styles: { [key: string]: React.CSSProperties } = {
  page: {
    minHeight: "100vh",
    display: "flex",
    background: "#fff8f6",
    color: "#2f2933",
    fontFamily: "Arial, Helvetica, sans-serif",
  },
  sidebar: {
    width: 260,
    background: "#ffffff",
    borderRight: "1px solid #f1d5d8",
    padding: 28,
    position: "sticky",
    top: 0,
    height: "100vh",
    flexShrink: 0,
  },
  logo: {
    fontFamily: "Georgia, serif",
    color: "#8f3445",
    fontSize: 30,
    margin: 0,
  },
  logoSub: {
    letterSpacing: 5,
    fontSize: 11,
    color: "#c76a7c",
    marginBottom: 36,
  },
  nav: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },
  navItem: {
    padding: "12px 14px",
    borderRadius: 14,
    color: "#6b5c64",
    fontWeight: 700,
    textDecoration: "none",
  },
  navActive: {
    padding: "12px 14px",
    borderRadius: 14,
    background: "#f9e4e7",
    color: "#9b2f43",
    fontWeight: 800,
    textDecoration: "none",
  },
  newButton: {
    display: "block",
    marginTop: 30,
    background: "#a63d4f",
    color: "white",
    textAlign: "center",
    padding: "14px 16px",
    borderRadius: 16,
    fontWeight: 800,
    textDecoration: "none",
  },
  content: {
    flex: 1,
    padding: 34,
    overflowX: "hidden",
  },
  header: {
    background:
      "linear-gradient(135deg, #ffffff 0%, #fff1f3 50%, #f9dce2 100%)",
    border: "1px solid #f1d5d8",
    borderRadius: 28,
    padding: 32,
    display: "flex",
    justifyContent: "space-between",
    gap: 20,
    alignItems: "center",
    marginBottom: 24,
  },
  eyebrow: {
    textTransform: "uppercase",
    letterSpacing: 4,
    color: "#c35d70",
    fontSize: 12,
    fontWeight: 800,
  },
  title: {
    fontFamily: "Georgia, serif",
    fontSize: 42,
    margin: "8px 0",
    color: "#3b2a30",
  },
  subtitle: {
    color: "#715f67",
    fontSize: 16,
  },
  search: {
    width: 360,
    maxWidth: "100%",
    border: "1px solid #e9c6cc",
    borderRadius: 18,
    padding: "15px 18px",
    fontSize: 15,
    outline: "none",
  },
  error: {
    background: "#fee2e2",
    color: "#991b1b",
    padding: 14,
    borderRadius: 14,
    marginBottom: 18,
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: 18,
    marginBottom: 24,
  },
  statCard: {
    background: "#ffffff",
    border: "1px solid #f1d5d8",
    borderRadius: 22,
    padding: 22,
    boxShadow: "0 15px 35px rgba(143, 52, 69, 0.08)",
  },
  statLabel: {
    color: "#8b7280",
    fontSize: 13,
    margin: 0,
    fontWeight: 700,
  },
  statValue: {
    margin: "10px 0 0",
    fontSize: 28,
    color: "#8f3445",
  },
  section: {
    background: "#ffffff",
    border: "1px solid #f1d5d8",
    borderRadius: 28,
    padding: 24,
    marginBottom: 24,
    boxShadow: "0 15px 35px rgba(143, 52, 69, 0.08)",
  },
  sectionHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 26,
    fontFamily: "Georgia, serif",
    margin: 0,
  },
  sectionSub: {
    margin: "6px 0 20px",
    color: "#7c6971",
  },
  refreshButton: {
    border: "1px solid #d99aa6",
    background: "white",
    color: "#9b2f43",
    padding: "11px 16px",
    borderRadius: 14,
    fontWeight: 800,
    cursor: "pointer",
  },
  pipeline: {
    display: "flex",
    gap: 16,
    overflowX: "auto",
    paddingBottom: 14,
  },
  column: {
    minWidth: 310,
    background: "#fff8f6",
    border: "1px solid #f1d5d8",
    borderRadius: 22,
    padding: 14,
  },
  columnHeader: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: 14,
    color: "#8f3445",
    fontWeight: 900,
  },
  emptyCard: {
    border: "1px dashed #e3b8bf",
    borderRadius: 18,
    padding: 20,
    color: "#9f8790",
    textAlign: "center",
  },
  card: {
    background: "#ffffff",
    border: "1px solid #f1d5d8",
    borderRadius: 20,
    padding: 16,
    marginBottom: 14,
  },
  cardTop: {
    display: "flex",
    justifyContent: "space-between",
    gap: 10,
    marginBottom: 12,
  },
  badge: {
    background: "#f9e4e7",
    color: "#9b2f43",
    borderRadius: 999,
    padding: "5px 10px",
    fontSize: 12,
    fontWeight: 800,
  },
  date: {
    color: "#8b7280",
    fontSize: 12,
    fontWeight: 700,
  },
  cardTitle: {
    fontSize: 20,
    margin: "0 0 12px",
    color: "#3b2a30",
  },
  cardText: {
    fontSize: 14,
    color: "#6f5f66",
    margin: "7px 0",
  },
  cardActions: {
    display: "flex",
    gap: 10,
    marginTop: 14,
  },
  openButton: {
    background: "#a63d4f",
    color: "white",
    padding: "10px 14px",
    borderRadius: 12,
    fontWeight: 800,
    fontSize: 13,
    textDecoration: "none",
  },
  stageSelect: {
    flex: 1,
    border: "1px solid #e9c6cc",
    borderRadius: 12,
    padding: "9px 10px",
    fontWeight: 700,
  },
  grid3: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: 16,
  },
  miniCard: {
    background: "#fff8f6",
    border: "1px solid #f1d5d8",
    borderRadius: 18,
    padding: 20,
    fontWeight: 800,
    color: "#8f3445",
  },
  tableWrap: {
    overflowX: "auto",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  timeline: {
    display: "grid",
    gap: 12,
  },
  timelineItem: {
    display: "flex",
    gap: 14,
    alignItems: "center",
    background: "#fff8f6",
    border: "1px solid #f1d5d8",
    borderRadius: 16,
    padding: 16,
  },
};
