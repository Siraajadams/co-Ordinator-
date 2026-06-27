"use client";

import { useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

const inputStyle: React.CSSProperties = {
  width: "100%", border: "1px solid #f1c8d3", borderRadius: 14, padding: "12px 14px",
  fontSize: 15, outline: "none", background: "#fff"
};

const labelStyle: React.CSSProperties = {
  display: "block", fontSize: 13, fontWeight: 700, color: "#554247", marginBottom: 7
};

export default function RegisterWeddingPage() {
  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [form, setForm] = useState({
    bride_name: "", groom_name: "", contact_name: "", email: "", mobile: "",
    wedding_date: "", venue_name: "", venue_address: "", guest_count: "",
    theme: "Peonies & Blush Elegance", total_budget: "", priorities: "",
    package_name: "Signature Planning", colour_palette: "Blush, Ivory and Champagne",
    pinterest_link: "", notes: ""
  });

  function update(name: string, value: string) {
    setForm({ ...form, [name]: value });
  }

  async function submitWedding(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage("Submitting your wedding enquiry...");

    const { error } = await supabase.from("weddings").insert({
      bride_name: form.bride_name,
      groom_name: form.groom_name,
      contact_name: form.contact_name,
      email: form.email,
      mobile: form.mobile,
      wedding_date: form.wedding_date,
      venue_name: form.venue_name,
      venue_address: form.venue_address,
      guest_count: Number(form.guest_count || 0),
      theme: form.theme,
      total_budget: Number(form.total_budget || 0),
      priorities: form.priorities,
      package_name: form.package_name,
      colour_palette: form.colour_palette,
      pinterest_link: form.pinterest_link,
      notes: form.notes,
      status: "Lead"
    });

    setSaving(false);
    if (error) {
      setMessage("Could not save wedding: " + error.message);
      return;
    }
    setMessage("Wedding registration submitted successfully.");
  }

  return (
    <main style={{ minHeight: "100vh", background: "linear-gradient(135deg,#fff8f6,#fff,#fdecef)", color: "#263238" }}>
      <nav style={{ maxWidth: 1180, margin: "0 auto", padding: "24px 22px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Link href="/" style={{ fontFamily: "Georgia, serif", color: "#9f4662", fontSize: 26, fontWeight: 700 }}>Co-Ordinator Weddings</Link>
        <div style={{ display: "flex", gap: 20, color: "#6b7280", fontSize: 14 }}>
          <Link href="/">Home</Link>
          <Link href="/login">Planner Login</Link>
        </div>
      </nav>

      <section style={{ maxWidth: 1180, margin: "0 auto", padding: "28px 22px 70px", display: "grid", gridTemplateColumns: ".85fr 1.15fr", gap: 34, alignItems: "start" }}>
        <aside style={{ position: "sticky", top: 20 }}>
          <p style={{ color: "#be607b", letterSpacing: 4, textTransform: "uppercase", fontSize: 12, fontWeight: 800 }}>Wedding enquiry</p>
          <h1 style={{ fontFamily: "Georgia, serif", fontSize: 54, lineHeight: 1.05, margin: "15px 0", color: "#2f2a2b" }}>
            Let us plan your beautiful day.
          </h1>
          <p style={{ color: "#667085", fontSize: 17, lineHeight: 1.7 }}>
            Complete this short registration. Your wedding will be created as a CRM profile for the planner to manage quotes, suppliers, budgets and approvals.
          </p>

          <div style={{ marginTop: 26, background: "white", border: "1px solid #f4d5dd", borderRadius: 28, padding: 24, boxShadow: "0 20px 55px rgba(159,70,98,.12)" }}>
            <div style={{ fontSize: 50 }}>🌸</div>
            <h2 style={{ fontFamily: "Georgia, serif", color: "#9f4662", margin: "8px 0" }}>Peonies & Blush</h2>
            <p style={{ color: "#667085", lineHeight: 1.6, margin: 0 }}>Soft florals, champagne tones, romantic styling and luxury supplier coordination.</p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 18 }}>
            {["Couple", "Wedding", "Budget", "Inspiration"].map((name, i) => (
              <button key={name} onClick={() => setStep(i + 1)} style={{
                border: "1px solid #f1c8d3", borderRadius: 16, padding: 13,
                background: step === i + 1 ? "#c95d7b" : "white",
                color: step === i + 1 ? "white" : "#9f4662",
                fontWeight: 800, cursor: "pointer"
              }}>
                {i + 1}. {name}
              </button>
            ))}
          </div>
        </aside>

        <form onSubmit={submitWedding} style={{ background: "white", borderRadius: 34, padding: 32, border: "1px solid #f4d5dd", boxShadow: "0 28px 80px rgba(31,41,55,.10)" }}>
          <div style={{ marginBottom: 24 }}>
            <h2 style={{ fontFamily: "Georgia, serif", fontSize: 34, color: "#2f2a2b", margin: 0 }}>Register Your Wedding</h2>
            <p style={{ color: "#667085", marginTop: 8 }}>Step {step} of 4</p>
            <div style={{ height: 8, background: "#f8dbe3", borderRadius: 999, overflow: "hidden" }}>
              <div style={{ width: `${step * 25}%`, height: "100%", background: "#c95d7b" }} />
            </div>
          </div>

          {step === 1 && (
            <Panel title="Couple Details">
              <Grid>
                <Input label="Bride Name" name="bride_name" value={form.bride_name} update={update} required />
                <Input label="Groom Name" name="groom_name" value={form.groom_name} update={update} required />
                <Input label="Contact Person" name="contact_name" value={form.contact_name} update={update} required />
                <Input label="Email" name="email" value={form.email} update={update} required />
                <Input label="Mobile" name="mobile" value={form.mobile} update={update} />
              </Grid>
            </Panel>
          )}

          {step === 2 && (
            <Panel title="Wedding Details">
              <Grid>
                <Input type="date" label="Wedding Date" name="wedding_date" value={form.wedding_date} update={update} required />
                <Input label="Venue Name" name="venue_name" value={form.venue_name} update={update} />
                <Input label="Venue Address" name="venue_address" value={form.venue_address} update={update} />
                <Input label="Guest Count" name="guest_count" value={form.guest_count} update={update} />
                <Select label="Wedding Theme" name="theme" value={form.theme} update={update}
                  options={["Peonies & Blush Elegance","White & Gold Luxury","Modern Minimalist","Garden Romance","Rustic Chic","Classic Traditional"]} />
              </Grid>
            </Panel>
          )}

          {step === 3 && (
            <Panel title="Budget & Planning Package">
              <Grid>
                <Input label="Estimated Total Budget" name="total_budget" value={form.total_budget} update={update} />
                <Select label="Planning Package" name="package_name" value={form.package_name} update={update}
                  options={["Signature Planning","Full Wedding Coordination","On-the-Day Coordination","Luxury Bespoke Planning"]} />
                <TextArea label="Budget Priorities" name="priorities" value={form.priorities} update={update} placeholder="Example: flowers, food, photography, venue styling..." />
              </Grid>
            </Panel>
          )}

          {step === 4 && (
            <Panel title="Inspiration & Notes">
              <Grid>
                <Input label="Colour Palette" name="colour_palette" value={form.colour_palette} update={update} />
                <Input label="Pinterest / Inspiration Link" name="pinterest_link" value={form.pinterest_link} update={update} />
                <TextArea label="Wedding Notes" name="notes" value={form.notes} update={update} placeholder="Tell us about your dream wedding..." />
              </Grid>
            </Panel>
          )}

          <div style={{ display: "flex", gap: 12, justifyContent: "space-between", marginTop: 26 }}>
            <button type="button" disabled={step === 1} onClick={() => setStep(step - 1)} style={btn("#fff", "#9f4662", "#f1c8d3")}>Back</button>
            {step < 4 ? (
              <button type="button" onClick={() => setStep(step + 1)} style={btn("#c95d7b", "white", "#c95d7b")}>Continue</button>
            ) : (
              <button disabled={saving} style={btn("#c95d7b", "white", "#c95d7b")}>{saving ? "Submitting..." : "Submit Wedding Enquiry ♥"}</button>
            )}
          </div>

          {message && <p style={{ marginTop: 18, padding: 14, borderRadius: 16, background: "#fff2f5", color: "#9f4662", fontWeight: 700, textAlign: "center" }}>{message}</p>}
        </form>
      </section>
    </main>
  );
}

function btn(bg: string, color: string, border: string): React.CSSProperties {
  return { background: bg, color, border: `1px solid ${border}`, borderRadius: 999, padding: "14px 24px", fontWeight: 800, cursor: "pointer" };
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return <section><h3 style={{ fontFamily: "Georgia, serif", fontSize: 26, color: "#9f4662", marginTop: 0 }}>{title}</h3>{children}</section>;
}

function Grid({ children }: { children: React.ReactNode }) {
  return <div style={{ display: "grid", gridTemplateColumns: "repeat(2,minmax(0,1fr))", gap: 16 }}>{children}</div>;
}

function Input({ label, name, value, update, type = "text", required = false }: any) {
  return <div><label style={labelStyle}>{label} {required && <span style={{ color: "#c95d7b" }}>*</span>}</label><input type={type} value={value} required={required} onChange={(e) => update(name, e.target.value)} style={inputStyle} /></div>;
}

function Select({ label, name, value, update, options }: any) {
  return <div><label style={labelStyle}>{label}</label><select value={value} onChange={(e) => update(name, e.target.value)} style={inputStyle}>{options.map((o: string) => <option key={o}>{o}</option>)}</select></div>;
}

function TextArea({ label, name, value, update, placeholder }: any) {
  return <div style={{ gridColumn: "1 / -1" }}><label style={labelStyle}>{label}</label><textarea value={value} placeholder={placeholder} onChange={(e) => update(name, e.target.value)} style={{ ...inputStyle, minHeight: 105, resize: "vertical" }} /></div>;
}
