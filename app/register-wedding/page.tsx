"use client";

import { useState } from "react";
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
    theme: "",
    total_budget: "",
    notes: "",
  });

  const [message, setMessage] = useState("");

  function updateField(name: string, value: string) {
    setForm({ ...form, [name]: value });
  }

  async function submitWedding(e: React.FormEvent) {
    e.preventDefault();
    setMessage("Submitting...");

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

    if (error) {
      setMessage(error.message);
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
      theme: "",
      total_budget: "",
      notes: "",
    });
  }

  return (
    <main className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow">
        <h1 className="text-3xl font-bold mb-6">Register Your Wedding</h1>

        <form onSubmit={submitWedding} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            ["bride_name", "Bride Name"],
            ["groom_name", "Groom Name"],
            ["contact_name", "Contact Person"],
            ["email", "Email"],
            ["mobile", "Mobile"],
            ["wedding_date", "Wedding Date"],
            ["venue_name", "Venue Name"],
            ["venue_address", "Venue Address"],
            ["guest_count", "Guest Count"],
            ["theme", "Wedding Theme"],
            ["total_budget", "Total Budget"],
          ].map(([name, label]) => (
            <div key={name}>
              <label className="block text-sm font-medium mb-1">{label}</label>
              <input
                type={name === "wedding_date" ? "date" : "text"}
                value={(form as any)[name]}
                onChange={(e) => updateField(name, e.target.value)}
                required={["bride_name", "groom_name", "email", "wedding_date"].includes(name)}
                className="w-full border rounded-xl p-3"
              />
            </div>
          ))}

          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">Notes</label>
            <textarea
              value={form.notes}
              onChange={(e) => updateField("notes", e.target.value)}
              className="w-full border rounded-xl p-3 min-h-[120px]"
            />
          </div>

          <button className="md:col-span-2 bg-black text-white p-4 rounded-xl">
            Submit Wedding Enquiry
          </button>
        </form>

        {message && <p className="mt-4">{message}</p>}
      </div>
    </main>
  );
}
