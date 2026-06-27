"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

type Wedding = {
  id: string;
  bride_name: string;
  groom_name: string;
  contact_name?: string;
  email?: string;
  mobile?: string;
  wedding_date?: string;
  venue_name?: string;
  guest_count?: number;
  theme?: string;
  total_budget?: number;
  status?: string;
  planning_stage?: string;
  created_at?: string;
};

type Supplier = {
  id: string;
  wedding_id: string;
  category: string;
  item: string;
  supplier_name: string;
  contact_person?: string;
  email?: string;
  mobile?: string;
  deposit_paid: string;
  cost_estimate: number;
  deposit_amount: number;
  paid: number;
  balance_owing: number;
  status: string;
  notes?: string;
  action_required?: string;
  due_date?: string;
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

const categories = [
  "Venue",
  "Catering",
  "Desserts",
  "Coffee",
  "Ice Cream",
  "Mocktails",
  "Beverages",
  "Invitations",
  "Stationery",
  "Favours",
  "Photographer",
  "Videographer",
  "Entertainment",
  "Sound & Lighting",
  "Live Illustrator",
  "Florals",
  "Decor Hire",
  "Furniture",
  "Tables",
  "Table Linen",
  "Lighting",
  "Bathrooms",
  "Transport",
  "Accommodation",
  "Hair & Makeup",
  "Cake",
  "Celebrant",
  "Security",
  "Cleaning",
  "Other",
];

const statuses = [
  "Not Started",
  "Awaiting Quote",
  "In Progress",
  "Booked",
  "Deposit Paid",
  "Payment to Confirm",
  "Completed",
  "Over Budget",
];

export default function DashboardPage() {
  const [weddings, setWeddings] = useState<Wedding[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [search, setSearch] = useState("");
  const [supplierFilter, setSupplierFilter] = useState("All");

  const [supplierForm, setSupplierForm] = useState({
    wedding_id: "",
    category: "Venue",
    item: "Venue",
    supplier_name: "",
    contact_person: "",
    email: "",
    mobile: "",
    deposit_paid: "No",
    cost_estimate: "",
    deposit_amount: "",
    paid: "",
    status: "Not Started",
    notes: "",
    action_required: "",
    due_date: "",
  });

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);

    const { data: weddingData, error: weddingError } = await supabase
      .from("weddings")
      .select("*")
      .order("created_at", { ascending: false });

    const { data: supplierData, error: supplierError } = await supabase
      .from("suppliers")
      .select("*")
      .order("created_at", { ascending: false });

    if (weddingError) setMessage(weddingError.message);
    if (supplierError) setMessage(supplierError.message);

    setWeddings(weddingData || []);
    setSuppliers(supplierData || []);
    setLoading(false);
  }

  async function updateStage(id: string, stage: string) {
    const { error } = await supabase
      .from("weddings")
      .update({ status: stage, planning_stage: stage })
      .eq("id", id);

    if (error) {
      alert(error.message);
      return;
    }

    loadData();
  }

  async function addSupplier(e: React.FormEvent) {
    e.preventDefault();

    if (!supplierForm.wedding_id) {
      alert("Please select a wedding.");
      return;
    }

    const { error } = await supabase.from("suppliers").insert({
      wedding_id: supplierForm.wedding_id,
      category: supplierForm.category,
      item: supplierForm.item,
      supplier_name: supplierForm.supplier_name,
      contact_person: supplierForm.contact_person,
      email: supplierForm.email,
      mobile: supplierForm.mobile,
      deposit_paid: supplierForm.deposit_paid,
      cost_estimate: Number(supplierForm.cost_estimate || 0),
      deposit_amount: Number(supplierForm.deposit_amount || 0),
      paid: Number(supplierForm.paid || 0),
      status: supplierForm.status,
      notes: supplierForm.notes,
      action_required: supplierForm.action_required,
      due_date: supplierForm.due_date || null,
    });

    if (error) {
      alert(error.message);
      return;
    }

    setSupplierForm({
      wedding_id: "",
      category: "Venue",
      item: "Venue",
      supplier_name: "",
      contact_person: "",
      email: "",
      mobile: "",
      deposit_paid: "No",
      cost_estimate: "",
      deposit_amount: "",
      paid: "",
      status: "Not Started",
      notes: "",
      action_required: "",
      due_date: "",
    });

    loadData();
  }

  async function updateSupplierStatus(id: string, status: string) {
    const { error } = await supabase
      .from("suppliers")
      .update({ status })
      .eq("id", id);

    if (error) {
      alert(error.message);
      return;
    }

    loadData();
  }

  const filteredWeddings = weddings.filter((w) => {
    const term = search.toLowerCase();
    return (
      w.bride_name?.toLowerCase().includes(term) ||
      w.groom_name?.toLowerCase().includes(term) ||
      w.venue_name?.toLowerCase().includes(term) ||
      w.email?.toLowerCase().includes(term)
    );
  });

  const filteredSuppliers = suppliers.filter((s) => {
    if (supplierFilter === "All") return true;
    if (supplierFilter === "Outstanding Payments") return Number(s.balance_owing || 0) > 0;
    if (supplierFilter === "Deposits Due") return s.deposit_paid !== "Yes";
    if (supplierFilter === "Awaiting Quotes") return s.status === "Awaiting Quote";
    if (supplierFilter === "Completed") return s.status === "Completed";
    return true;
  });

  const totalWeddingBudget = weddings.reduce(
    (sum, w) => sum + Number(w.total_budget || 0),
    0
  );

  const supplierEstimate = suppliers.reduce(
    (sum, s) => sum + Number(s.cost_estimate || 0),
    0
  );

  const supplierPaid = suppliers.reduce(
    (sum, s) => sum + Number(s.paid || 0),
    0
  );

  const supplierBalance = suppliers.reduce(
    (sum, s) => sum + Number(s.balance_owing || 0),
    0
  );

  const awaitingQuotes = suppliers.filter((s) => s.status === "Awaiting Quote").length;
  const depositsDue = suppliers.filter((s) => s.deposit_paid !== "Yes").length;
  const completedSuppliers = suppliers.filter((s) => s.status === "Completed").length;

  const pipelineGroups = useMemo(() => {
    return stages.map((stage) => ({
      stage,
      items: filteredWeddings.filter(
        (w) => (w.planning_stage || w.status || "New Enquiry") === stage
      ),
    }));
  }, [filteredWeddings]);

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
            <p style={styles.eyebrow}>Version 2</p>
            <h2 style={styles.title}>Wedding Project Management CRM</h2>
            <p style={styles.subtitle}>
              Manage weddings, suppliers, payments, balances, notes and approvals.
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
          <StatCard label="Supplier Estimate" value={`R ${supplierEstimate.toLocaleString()}`} />
          <StatCard label="Paid" value={`R ${supplierPaid.toLocaleString()}`} />
          <StatCard label="Balance Owing" value={`R ${supplierBalance.toLocaleString()}`} />
        </div>

        <section style={styles.section}>
          <div style={styles.sectionHeader}>
            <div>
              <h3 style={styles.sectionTitle}>Wedding CRM Pipeline</h3>
              <p style={styles.sectionSub}>Move each wedding through the planning process.</p>
            </div>
            <button onClick={loadData} style={styles.refreshButton}>Refresh</button>
          </div>

          {loading ? (
            <p>Loading...</p>
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
                      <span style={styles.badge}>{wedding.theme || "Wedding"}</span>
                      <h4 style={styles.cardTitle}>
                        {wedding.bride_name} & {wedding.groom_name}
                      </h4>
                      <p style={styles.cardText}><strong>Date:</strong> {formatDate(wedding.wedding_date)}</p>
                      <p style={styles.cardText}><strong>Venue:</strong> {wedding.venue_name || "TBC"}</p>
                      <p style={styles.cardText}><strong>Guests:</strong> {wedding.guest_count || 0}</p>
                      <p style={styles.cardText}>
                        <strong>Budget:</strong> R {Number(wedding.total_budget || 0).toLocaleString()}
                      </p>

                      <div style={styles.cardActions}>
                        <Link href={`/weddings/${wedding.id}`} style={styles.openButton}>
                          Open
                        </Link>

                        <select
                          value={wedding.planning_stage || wedding.status || "New Enquiry"}
                          onChange={(e) => updateStage(wedding.id, e.target.value)}
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
          <p style={styles.sectionSub}>All registered weddings and client profiles.</p>

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
                {filteredWeddings.map((w) => (
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
            Spreadsheet-style wedding supplier tracker with costs, payments, notes and actions.
          </p>

          <div style={styles.supplierStats}>
            <StatCard label="Total Suppliers" value={suppliers.length} />
            <StatCard label="Awaiting Quotes" value={awaitingQuotes} />
            <StatCard label="Deposits Due" value={depositsDue} />
            <StatCard label="Completed" value={completedSuppliers} />
          </div>

          <div style={styles.filterRow}>
            {["All", "Outstanding Payments", "Deposits Due", "Awaiting Quotes", "Completed"].map((f) => (
              <button
                key={f}
                onClick={() => setSupplierFilter(f)}
                style={supplierFilter === f ? styles.filterActive : styles.filterButton}
              >
                {f}
              </button>
            ))}
          </div>

          <form onSubmit={addSupplier} style={styles.supplierForm}>
            <select
              value={supplierForm.wedding_id}
              onChange={(e) => setSupplierForm({ ...supplierForm, wedding_id: e.target.value })}
              style={styles.input}
              required
            >
              <option value="">Select Wedding</option>
              {weddings.map((w) => (
                <option key={w.id} value={w.id}>
                  {w.bride_name} & {w.groom_name}
                </option>
              ))}
            </select>

            <select
              value={supplierForm.category}
              onChange={(e) =>
                setSupplierForm({
                  ...supplierForm,
                  category: e.target.value,
                  item: e.target.value,
                })
              }
              style={styles.input}
            >
              {categories.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>

            <input
              placeholder="Item"
              value={supplierForm.item}
              onChange={(e) => setSupplierForm({ ...supplierForm, item: e.target.value })}
              style={styles.input}
              required
            />

            <input
              placeholder="Supplier"
              value={supplierForm.supplier_name}
              onChange={(e) => setSupplierForm({ ...supplierForm, supplier_name: e.target.value })}
              style={styles.input}
            />

            <select
              value={supplierForm.deposit_paid}
              onChange={(e) => setSupplierForm({ ...supplierForm, deposit_paid: e.target.value })}
              style={styles.input}
            >
              <option>No</option>
              <option>Yes</option>
            </select>

            <input
              placeholder="Cost Estimate"
              value={supplierForm.cost_estimate}
              onChange={(e) => setSupplierForm({ ...supplierForm, cost_estimate: e.target.value })}
              style={styles.input}
            />

            <input
              placeholder="Deposit Amount"
              value={supplierForm.deposit_amount}
              onChange={(e) => setSupplierForm({ ...supplierForm, deposit_amount: e.target.value })}
              style={styles.input}
            />

            <input
              placeholder="Paid"
              value={supplierForm.paid}
              onChange={(e) => setSupplierForm({ ...supplierForm, paid: e.target.value })}
              style={styles.input}
            />

            <select
              value={supplierForm.status}
              onChange={(e) => setSupplierForm({ ...supplierForm, status: e.target.value })}
              style={styles.input}
            >
              {statuses.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>

            <input
              type="date"
              value={supplierForm.due_date}
              onChange={(e) => setSupplierForm({ ...supplierForm, due_date: e.target.value })}
              style={styles.input}
            />

            <input
              placeholder="Action Required"
              value={supplierForm.action_required}
              onChange={(e) => setSupplierForm({ ...supplierForm, action_required: e.target.value })}
              style={styles.inputWide}
            />

            <textarea
              placeholder="Notes"
              value={supplierForm.notes}
              onChange={(e) => setSupplierForm({ ...supplierForm, notes: e.target.value })}
              style={styles.textarea}
            />

            <button style={styles.addButton}>+ Add Supplier Item</button>
          </form>

          <div style={styles.tableWrap}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Supplier</th>
                  <th>Deposit</th>
                  <th>Estimate</th>
                  <th>Paid</th>
                  <th>Balance</th>
                  <th>Status</th>
                  <th>Due</th>
                  <th>Notes</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredSuppliers.map((s) => (
                  <tr key={s.id}>
                    <td>{s.item}</td>
                    <td>{s.supplier_name}</td>
                    <td>{s.deposit_paid}</td>
                    <td>R {Number(s.cost_estimate || 0).toLocaleString()}</td>
                    <td>R {Number(s.paid || 0).toLocaleString()}</td>
                    <td>R {Number(s.balance_owing || 0).toLocaleString()}</td>
                    <td>
                      <select
                        value={s.status}
                        onChange={(e) => updateSupplierStatus(s.id, e.target.value)}
                        style={statusStyle(s.status)}
                      >
                        {statuses.map((status) => (
                          <option key={status}>{status}</option>
                        ))}
                      </select>
                    </td>
                    <td>{s.due_date || "-"}</td>
                    <td>{s.notes}</td>
                    <td>{s.action_required}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section id="budgets" style={styles.section}>
          <h3 style={styles.sectionTitle}>Budget Dashboard</h3>
          <p style={styles.sectionSub}>Automatic supplier totals from the Supplier CRM.</p>

          <div style={styles.statsGrid}>
            <StatCard label="Client Budget" value={`R ${totalWeddingBudget.toLocaleString()}`} />
            <StatCard label="Supplier Estimate" value={`R ${supplierEstimate.toLocaleString()}`} />
            <StatCard label="Paid" value={`R ${supplierPaid.toLocaleString()}`} />
            <StatCard label="Outstanding" value={`R ${supplierBalance.toLocaleString()}`} />
          </div>
        </section>

        <section id="quotes" style={styles.section}>
          <h3 style={styles.sectionTitle}>Supplier Quotes</h3>
          <p style={styles.sectionSub}>Quotes can be tracked through supplier status and notes.</p>
        </section>

        <section id="approvals" style={styles.section}>
          <h3 style={styles.sectionTitle}>Client Approvals</h3>
          <p style={styles.sectionSub}>Pending approvals, rejected quotes and approved wedding items.</p>
        </section>

        <section id="timeline" style={styles.section}>
          <h3 style={styles.sectionTitle}>Wedding Timeline</h3>
          <p style={styles.sectionSub}>Planning checklist and key event dates.</p>
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
          <h3 style={styles.sectionTitle}>Reports</h3>
          <p style={styles.sectionSub}>Income statement, supplier spend and outstanding balance report.</p>
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

function statusStyle(status: string): React.CSSProperties {
  const base: React.CSSProperties = {
    border: "none",
    borderRadius: 999,
    padding: "8px 10px",
    fontWeight: 800,
  };

  if (status === "Completed") return { ...base, background: "#dcfce7", color: "#166534" };
  if (status === "Deposit Paid") return { ...base, background: "#ffedd5", color: "#9a3412" };
  if (status === "Awaiting Quote") return { ...base, background: "#fef9c3", color: "#854d0e" };
  if (status === "Booked") return { ...base, background: "#dbeafe", color: "#1e40af" };
  if (status === "Over Budget") return { ...base, background: "#fee2e2", color: "#991b1b" };

  return { ...base, background: "#f1f5f9", color: "#475569" };
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
    background: "linear-gradient(135deg, #ffffff 0%, #fff1f3 50%, #f9dce2 100%)",
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
  supplierStats: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
    gap: 14,
    marginBottom: 18,
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
  badge: {
    display: "inline-block",
    background: "#f9e4e7",
    color: "#9b2f43",
    borderRadius: 999,
    padding: "5px 10px",
    fontSize: 12,
    fontWeight: 800,
    marginBottom: 8,
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
  supplierForm: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: 12,
    marginBottom: 24,
    padding: 16,
    background: "#fff8f6",
    border: "1px solid #f1d5d8",
    borderRadius: 20,
  },
  input: {
    width: "100%",
    border: "1px solid #e9c6cc",
    borderRadius: 14,
    padding: "12px 14px",
    fontSize: 14,
    outline: "none",
  },
  inputWide: {
    width: "100%",
    border: "1px solid #e9c6cc",
    borderRadius: 14,
    padding: "12px 14px",
    fontSize: 14,
    outline: "none",
    gridColumn: "span 2",
  },
  textarea: {
    width: "100%",
    border: "1px solid #e9c6cc",
    borderRadius: 14,
    padding: "12px 14px",
    fontSize: 14,
    minHeight: 80,
    outline: "none",
    gridColumn: "span 2",
  },
  addButton: {
    background: "#a63d4f",
    color: "white",
    border: "none",
    borderRadius: 14,
    padding: "12px 16px",
    fontWeight: 800,
    cursor: "pointer",
  },
  filterRow: {
    display: "flex",
    gap: 10,
    flexWrap: "wrap",
    marginBottom: 18,
  },
  filterButton: {
    border: "1px solid #e9c6cc",
    background: "white",
    color: "#8f3445",
    borderRadius: 999,
    padding: "10px 14px",
    fontWeight: 800,
    cursor: "pointer",
  },
  filterActive: {
    border: "1px solid #a63d4f",
    background: "#a63d4f",
    color: "white",
    borderRadius: 999,
    padding: "10px 14px",
    fontWeight: 800,
    cursor: "pointer",
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
