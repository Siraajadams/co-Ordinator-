"use client";

import { useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

export default function RegisterWeddingPage() {
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
    theme: "Peonies & Blush Elegance",
    total_budget: "",
    notes: "",
  });

  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  function updateField(name: string, value: string) {
    setForm({ ...form, [name]: value });
  }

  async function submitWedding(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage("Submitting enquiry...");

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
      notes: form.notes,
      status: "New Enquiry",
    });

    setSaving(false);

    if (error) {
      setMessage("Could not save wedding: " + error.message);
      return;
    }

    setMessage("Wedding registration submitted successfully.");
    setForm({
      bride_name: "",
      groom_name: "",
      contact_name: "",
      email: "",
      mobile: "",
      wedding_date: "",
      venue_name: "",
      venue_address: "",
      guest_count: "",
      theme: "Peonies & Blush Elegance",
      total_budget: "",
      notes: "",
    });
  }

  return (
    <main className="min-h-screen bg-[#fff8f6] text-slate-800">
      <nav className="bg-white border-b border-rose-100 px-8 py-5 flex justify-between items-center">
        <Link href="/">
          <h1 className="text-2xl font-serif text-rose-700">Co-Ordinator</h1>
          <p className="text-xs tracking-[0.3em] text-rose-400">WEDDINGS</p>
        </Link>

        <div className="flex gap-6 text-sm">
          <Link href="/" className="hover:text-rose-600">Home</Link>
          <Link href="/login" className="hover:text-rose-600">Planner Login</Link>
        </div>
      </nav>

      <section className="px-6 lg:px-20 py-14">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          <div className="pt-10">
            <p className="uppercase tracking-[0.3em] text-rose-500 text-sm mb-5">
              Your dream wedding
            </p>

            <h2 className="text-5xl lg:text-6xl font-serif leading-tight mb-6">
              Beautifully planned, <br />
              <span className="text-rose-500">expertly coordinated</span>
            </h2>

            <p className="text-slate-600 text-lg max-w-xl mb-8">
              Register your wedding enquiry and our planning team will create
              your personalised wedding dashboard, supplier quote tracker and
              budget plan.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                ["🌸", "Peony floral styling"],
                ["📋", "Supplier quote tracking"],
                ["💰", "Budget monitoring"],
                ["🤍", "Client approval process"],
              ].map(([icon, text]) => (
                <div key={text} className="bg-white p-5 rounded-2xl border border-rose-100 shadow-sm">
                  <div className="text-3xl mb-2">{icon}</div>
                  <p className="font-medium">{text}</p>
                </div>
              ))}
            </div>

            <div className="mt-10 bg-white/70 border border-rose-100 rounded-3xl p-6">
              <h3 className="font-serif text-2xl text-rose-700 mb-2">
                Peonies & Blush Elegance
              </h3>
              <p className="text-sm text-slate-600">
                Inspired by soft pink peonies, warm candlelight, luxury table
                décor, glassware and romantic floral arrangements.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-[2rem] shadow-xl border border-rose-100 p-8">
            <div className="text-center mb-8">
              <div className="text-5xl mb-3">🌸</div>
              <h1 className="text-4xl font-serif text-slate-800">
                Register Your Wedding
              </h1>
              <p className="text-slate-500 mt-2">
                Let us start planning something beautiful together.
              </p>
            </div>

            <form onSubmit={submitWedding} className="space-y-6">
              <SectionTitle title="Couple Details" />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="Bride Name" name="bride_name" value={form.bride_name} update={updateField} required />
                <Input label="Groom Name" name="groom_name" value={form.groom_name} update={updateField} required />
              </div>

              <Input label="Contact Person" name="contact_name" value={form.contact_name} update={updateField} required />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="Email Address" name="email" value={form.email} update={updateField} required />
                <Input label="Mobile Number" name="mobile" value={form.mobile} update={updateField} />
              </div>

              <SectionTitle title="Wedding Details" />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="Wedding Date" name="wedding_date" type="date" value={form.wedding_date} update={updateField} required />
                <Input label="Venue Name" name="venue_name" value={form.venue_name} update={updateField} />
              </div>

              <Input label="Venue Address" name="venue_address" value={form.venue_address} update={updateField} />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="Guest Count" name="guest_count" value={form.guest_count} update={updateField} />
                <div>
                  <label className="block text-sm font-medium mb-1 text-slate-700">
                    Wedding Theme
                  </label>
                  <select
                    value={form.theme}
                    onChange={(e) => updateField("theme", e.target.value)}
                    className="w-full border border-rose-100 rounded-xl p-3 bg-white focus:outline-none focus:ring-2 focus:ring-rose-300"
                  >
                    <option>Peonies & Blush Elegance</option>
                    <option>White & Gold Luxury</option>
                    <option>Modern Minimalist</option>
                    <option>Garden Romance</option>
                    <option>Classic Traditional</option>
                    <option>Rustic Chic</option>
                  </select>
                </div>
              </div>

              <SectionTitle title="Budget & Notes" />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="Total Budget" name="total_budget" value={form.total_budget} update={updateField} />
                <div>
                  <label className="block text-sm font-medium mb-1 text-slate-700">
                    Notes
                  </label>
                  <textarea
                    value={form.notes}
                    onChange={(e) => updateField("notes", e.target.value)}
                    placeholder="Tell us more about your dream wedding..."
                    className="w-full border border-rose-100 rounded-xl p-3 min-h-[90px] focus:outline-none focus:ring-2 focus:ring-rose-300"
                  />
                </div>
              </div>

              <button
                disabled={saving}
                className="w-full bg-rose-500 text-white py-4 rounded-xl font-semibold shadow hover:bg-rose-600 disabled:opacity-60"
              >
                {saving ? "Submitting..." : "Submit Wedding Enquiry ♥"}
              </button>

              {message && (
                <p className="text-center text-sm font-medium text-rose-700 bg-rose-50 border border-rose-100 p-3 rounded-xl">
                  {message}
                </p>
              )}

              <div className="bg-[#fff8f6] border border-rose-100 rounded-2xl p-4 text-center text-sm text-slate-600">
                🔒 Your information is safe with us. We will only use it to
                prepare your wedding planning profile.
              </div>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}

function SectionTitle({ title }: { title: string }) {
  return (
    <h2 className="text-sm uppercase tracking-[0.2em] text-rose-500 font-semibold border-b border-rose-100 pb-2">
      {title}
    </h2>
  );
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
    <div>
      <label className="block text-sm font-medium mb-1 text-slate-700">
        {label} {required && <span className="text-rose-500">*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => update(name, e.target.value)}
        required={required}
        placeholder={label}
        className="w-full border border-rose-100 rounded-xl p-3 bg-white focus:outline-none focus:ring-2 focus:ring-rose-300"
      />
    </div>
  );
}
