"use client";

import { useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

export default function RegisterWeddingPage() {
  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const [form, setForm] = useState({
    bride_name: "",
    groom_name: "",
    contact_name: "",
    email: "",
    mobile: "",
    wedding_date: "",
    venue_name: "",
    venue_address: "",
    guest_count: "",
    theme: "Peonies & Blush",
    total_budget: "",
    package_name: "Full Planning",
    colour_palette: "Blush, Ivory and Champagne",
    pinterest_link: "",
    wedding_notes: "",
  });

  function update(name: string, value: string) {
    setForm({ ...form, [name]: value });
  }

  async function submitWedding(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage("Saving wedding enquiry...");

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
      package_name: form.package_name,
      colour_palette: form.colour_palette,
      pinterest_link: form.pinterest_link,
      wedding_notes: form.wedding_notes,
      status: "New Enquiry",
      planning_stage: "New Enquiry",
    });

    setSaving(false);

    if (error) {
      setMessage("Could not save wedding: " + error.message);
      return;
    }

    setMessage("Wedding registration submitted successfully.");
  }

  return (
    <main className="page">
      <style>{css}</style>

      <header className="header">
        <Link href="/" className="logo">
          <span className="flower">🌸</span>
          <span>
            <strong>Co-Ordinator</strong>
            <small>WEDDINGS</small>
          </span>
        </Link>

        <nav>
          <Link href="/">Home</Link>
          <Link href="/login">Planner Login</Link>
        </nav>
      </header>

      <section className="layout">
        <aside className="intro">
          <p className="eyebrow">Luxury Wedding Planning CRM</p>
          <h1>Register your wedding</h1>
          <p>
            Complete this short registration. Your wedding will be created as a
            CRM profile for the planner to manage quotes, suppliers, budgets and
            approvals.
          </p>

          <div className="themeCard">
            <div className="bigFlower">🌸</div>
            <h3>Peonies & Blush</h3>
            <p>
              Soft florals, champagne tones, romantic styling and luxury supplier
              coordination.
            </p>
          </div>

          <div className="steps">
            {[1, 2, 3, 4].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setStep(n)}
                className={step === n ? "active" : ""}
              >
                {n}. {["Couple", "Wedding", "Budget", "Inspiration"][n - 1]}
              </button>
            ))}
          </div>
        </aside>

        <form onSubmit={submitWedding} className="formCard">
          <h2>Register Your Wedding</h2>
          <p className="stepText">Step {step} of 4</p>

          <div className="bar">
            <div style={{ width: `${step * 25}%` }} />
          </div>

          {step === 1 && (
            <>
              <Section title="Couple Details" />
              <div className="grid">
                <Input label="Bride Name" name="bride_name" value={form.bride_name} update={update} required />
                <Input label="Groom Name" name="groom_name" value={form.groom_name} update={update} required />
                <Input label="Contact Person" name="contact_name" value={form.contact_name} update={update} required />
                <Input label="Email" name="email" value={form.email} update={update} required />
                <Input label="Mobile" name="mobile" value={form.mobile} update={update} />
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <Section title="Wedding Details" />
              <div className="grid">
                <Input label="Wedding Date" name="wedding_date" type="date" value={form.wedding_date} update={update} required />
                <Input label="Venue Name" name="venue_name" value={form.venue_name} update={update} />
                <Input label="Venue Address" name="venue_address" value={form.venue_address} update={update} />
                <Input label="Guest Count" name="guest_count" value={form.guest_count} update={update} />
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <Section title="Budget & Package" />
              <div className="grid">
                <Input label="Total Budget" name="total_budget" value={form.total_budget} update={update} />
                <div className="field">
                  <label>Package</label>
                  <select value={form.package_name} onChange={(e) => update("package_name", e.target.value)}>
                    <option>Full Planning</option>
                    <option>Partial Planning</option>
                    <option>Day Coordination</option>
                    <option>Supplier Management</option>
                  </select>
                </div>
                <div className="field">
                  <label>Wedding Theme</label>
                  <select value={form.theme} onChange={(e) => update("theme", e.target.value)}>
                    <option>Peonies & Blush</option>
                    <option>White & Gold Luxury</option>
                    <option>Modern Minimalist</option>
                    <option>Garden Romance</option>
                    <option>Classic Elegance</option>
                  </select>
                </div>
              </div>
            </>
          )}

          {step === 4 && (
            <>
              <Section title="Inspiration & Notes" />
              <div className="grid">
                <Input label="Colour Palette" name="colour_palette" value={form.colour_palette} update={update} />
                <Input label="Pinterest / Inspiration Link" name="pinterest_link" value={form.pinterest_link} update={update} />
              </div>

              <div className="field">
                <label>Wedding Notes</label>
                <textarea
                  value={form.wedding_notes}
                  onChange={(e) => update("wedding_notes", e.target.value)}
                  placeholder="Tell us about your dream wedding..."
                />
              </div>
            </>
          )}

          <div className="actions">
            {step > 1 && (
              <button type="button" className="secondary" onClick={() => setStep(step - 1)}>
                Back
              </button>
            )}

            {step < 4 ? (
              <button type="button" onClick={() => setStep(step + 1)}>
                Next
              </button>
            ) : (
              <button type="submit" disabled={saving}>
                {saving ? "Saving..." : "Submit Wedding Enquiry ♥"}
              </button>
            )}
          </div>

          {message && <p className="message">{message}</p>}
        </form>
      </section>
    </main>
  );
}

function Section({ title }: { title: string }) {
  return <h3 className="sectionTitle">{title}</h3>;
}

function Input({
  label,
  name,
  value,
  update,
  type = "text",
  required = false,
}: {
  label: string;
  name: string;
  value: string;
  update: (name: string, value: string) => void;
  type?: string;
  required?: boolean;
}) {
  return (
    <div className="field">
      <label>
        {label} {required && <span>*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => update(name, e.target.value)}
        required={required}
      />
    </div>
  );
}

const css = `
* {
  box-sizing: border-box;
}

body {
  margin: 0;
}

.page {
  min-height: 100vh;
  background: linear-gradient(135deg, #fff8f6, #fff1f4);
  color: #33282d;
  font-family: Arial, Helvetica, sans-serif;
  overflow-x: hidden;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  padding: 20px 6vw;
  background: white;
  border-bottom: 1px solid #f1d5d8;
}

.logo {
  display: flex;
  align-items: center;
  gap: 12px;
  text-decoration: none;
  color: #9b3e54;
}

.logo strong {
  display: block;
  font-family: Georgia, serif;
  font-size: 34px;
  line-height: 1;
}

.logo small {
  display: block;
  letter-spacing: 5px;
  font-size: 11px;
  margin-top: 6px;
  color: #c46b7f;
}

.flower {
  font-size: 38px;
}

.header nav {
  display: flex;
  gap: 18px;
}

.header nav a {
  color: #6b5f66;
  font-weight: 700;
  text-decoration: none;
}

.layout {
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;
  padding: 48px 24px;
  display: grid;
  grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr);
  gap: 34px;
  align-items: start;
}

.intro h1 {
  font-family: Georgia, serif;
  font-size: clamp(44px, 8vw, 82px);
  line-height: 0.95;
  margin: 12px 0 20px;
}

.intro p {
  font-size: 20px;
  line-height: 1.6;
  color: #6e6470;
}

.eyebrow {
  text-transform: uppercase;
  letter-spacing: 5px;
  color: #b94f65;
  font-size: 13px !important;
  font-weight: 900;
}

.themeCard {
  background: white;
  border: 1px solid #f0cdd3;
  border-radius: 28px;
  padding: 28px;
  margin-top: 28px;
  box-shadow: 0 20px 50px rgba(143,52,69,0.08);
}

.bigFlower {
  font-size: 62px;
}

.themeCard h3 {
  font-family: Georgia, serif;
  color: #9b3e54;
  font-size: 28px;
  margin: 10px 0;
}

.steps {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 14px;
  margin-top: 24px;
}

.steps button {
  min-height: 58px;
  border-radius: 18px;
  border: 1px solid #eac1c9;
  background: white;
  color: #9b3e54;
  font-weight: 900;
  font-size: 16px;
}

.steps button.active {
  background: #c95675;
  color: white;
}

.formCard {
  width: 100%;
  background: white;
  border: 1px solid #f0cdd3;
  border-radius: 32px;
  padding: clamp(24px, 5vw, 46px);
  box-shadow: 0 30px 80px rgba(143,52,69,0.14);
}

.formCard h2 {
  font-family: Georgia, serif;
  font-size: clamp(42px, 7vw, 68px);
  line-height: 1;
  margin: 0 0 14px;
}

.stepText {
  font-size: 20px;
  color: #6e6470;
  margin: 0 0 8px;
}

.bar {
  width: 100%;
  height: 12px;
  background: #f4d3dc;
  border-radius: 999px;
  overflow: hidden;
  margin-bottom: 34px;
}

.bar div {
  height: 100%;
  background: #c95675;
}

.sectionTitle {
  font-family: Georgia, serif;
  color: #9b3e54;
  font-size: 34px;
  margin: 0 0 18px;
}

.grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px;
}

.field {
  width: 100%;
}

.field label {
  display: block;
  font-weight: 800;
  margin-bottom: 8px;
  color: #46363d;
  font-size: 15px;
}

.field label span {
  color: #c95675;
}

.field input,
.field select,
.field textarea {
  width: 100%;
  min-height: 56px;
  border: 1px solid #e8bdc7;
  border-radius: 16px;
  padding: 14px 16px;
  font-size: 16px;
  outline: none;
  background: white;
}

.field textarea {
  min-height: 130px;
  resize: vertical;
}

.actions {
  display: flex;
  justify-content: space-between;
  gap: 14px;
  margin-top: 28px;
}

.actions button {
  min-height: 56px;
  border: none;
  border-radius: 999px;
  padding: 0 28px;
  background: #a63d4f;
  color: white;
  font-weight: 900;
  font-size: 16px;
}

.actions .secondary {
  background: white;
  color: #9b3e54;
  border: 1px solid #e8bdc7;
}

.message {
  margin-top: 18px;
  padding: 14px;
  border-radius: 14px;
  background: #fff1f4;
  color: #9b3e54;
  font-weight: 700;
}

/* MOBILE FIX */
@media (max-width: 760px) {
  .header {
    align-items: flex-start;
    padding: 18px 18px;
  }

  .logo strong {
    font-size: 28px;
  }

  .logo small {
    letter-spacing: 3px;
  }

  .header nav {
    flex-direction: column;
    gap: 8px;
    align-items: flex-end;
  }

  .layout {
    display: block;
    padding: 26px 16px;
  }

  .intro {
    margin-bottom: 24px;
  }

  .intro h1 {
    font-size: 46px;
  }

  .intro p {
    font-size: 17px;
  }

  .themeCard {
    padding: 22px;
  }

  .steps {
    grid-template-columns: 1fr 1fr;
  }

  .steps button {
    font-size: 14px;
    min-height: 54px;
  }

  .formCard {
    width: 100%;
    padding: 24px;
    border-radius: 26px;
  }

  .formCard h2 {
    font-size: 44px;
  }

  .sectionTitle {
    font-size: 30px;
  }

  .grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .field input,
  .field select,
  .field textarea {
    width: 100%;
    min-height: 58px;
    font-size: 16px;
  }

  .actions {
    flex-direction: column;
  }

  .actions button {
    width: 100%;
  }
}
`;
