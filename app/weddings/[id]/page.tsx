"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

const categories = [
  "Flowers",
  "Food",
  "Catering",
  "Venue",
  "Videographer",
  "Photographer",
  "Desserts",
  "Drinks",
  "Musician / DJ",
  "Venue Contract",
  "Lighting",
  "Draping",
  "Decor",
];

export default function WeddingProfilePage() {
  const params = useParams();
  const weddingId = params.id as string;

  const [wedding, setWedding] = useState<any>(null);
  const [budgetItems, setBudgetItems] = useState<any[]>([]);
  const [quotes, setQuotes] = useState<any[]>([]);

  const [budgetForm, setBudgetForm] = useState({
    category: "Flowers",
    budget_amount: "",
    supplier_name: "",
    notes: "",
  });

  const [quoteForm, setQuoteForm] = useState({
    category: "Flowers",
    supplier_name: "",
    supplier_contact: "",
    quote_amount: "",
    status: "Quote Received",
    planner_notes: "",
  });

  useEffect(() => {
    loadWedding();
  }, []);

  async function loadWedding() {
    const { data: weddingData } = await supabase
      .from("weddings")
      .select("*")
      .eq("id", weddingId)
      .single();

    const { data: budgetData } = await supabase
      .from("budget_items")
      .select("*")
      .eq("wedding_id", weddingId);

    const { data: quoteData } = await supabase
      .from("quotes")
      .select("*")
      .eq("wedding_id", weddingId);

    setWedding(weddingData);
    setBudgetItems(budgetData || []);
    setQuotes(quoteData || []);
  }

  async function addBudgetItem(e: React.FormEvent) {
    e.preventDefault();

    await supabase.from("budget_items").insert({
      wedding_id: weddingId,
      category: budgetForm.category,
      budget_amount: Number(budgetForm.budget_amount || 0),
      supplier_name: budgetForm.supplier_name,
      notes: budgetForm.notes,
      status: "Quote Needed",
    });

    setBudgetForm({
      category: "Flowers",
      budget_amount: "",
      supplier_name: "",
      notes: "",
    });

    loadWedding();
  }

  async function addQuote(e: React.FormEvent) {
    e.preventDefault();

    const relatedBudget = budgetItems.find(
      (item) => item.category === quoteForm.category
    );

    await supabase.from("quotes").insert({
      wedding_id: weddingId,
      budget_item_id: relatedBudget?.id || null,
      supplier_name: quoteForm.supplier_name,
      supplier_contact: quoteForm.supplier_contact,
      quote_amount: Number(quoteForm.quote_amount || 0),
      status: quoteForm.status,
      planner_notes: quoteForm.planner_notes,
    });

    if (relatedBudget) {
      await supabase
        .from("budget_items")
        .update({
          quote_amount: Number(quoteForm.quote_amount || 0),
          supplier_name: quoteForm.supplier_name,
          status: quoteForm.status,
        })
        .eq("id", relatedBudget.id);
    }

    setQuoteForm({
      category: "Flowers",
      supplier_name: "",
      supplier_contact: "",
      quote_amount: "",
      status: "Quote Received",
      planner_notes: "",
    });

    loadWedding();
  }

  async function updateQuoteStatus(id: string, status: string) {
    await supabase.from("quotes").update({ status }).eq("id", id);
    loadWedding();
  }

  if (!wedding) return <main className="p-6">Loading...</main>;

  const totalBudget = budgetItems.reduce((sum, i) => sum + Number(i.budget_amount || 0), 0);
  const totalQuotes = quotes.reduce((sum, q) => sum + Number(q.quote_amount || 0), 0);
  const remaining = Number(wedding.total_budget || 0) - totalQuotes;

  return (
    <main className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">
          {wedding.bride_name} & {wedding.groom_name}
        </h1>

        <p className="mb-6">
          {wedding.wedding_date} | {wedding.venue_name} | {wedding.status}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card title="Client Budget" value={`R ${Number(wedding.total_budget).toLocaleString()}`} />
          <Card title="Planned Budget" value={`R ${totalBudget.toLocaleString()}`} />
          <Card title="Quotes Received" value={`R ${totalQuotes.toLocaleString()}`} />
          <Card title="Remaining" value={`R ${remaining.toLocaleString()}`} />
        </div>

        <section className="bg-white p-6 rounded-2xl shadow mb-8">
          <h2 className="text-xl font-bold mb-4">Add Budget Item</h2>

          <form onSubmit={addBudgetItem} className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <select
              className="border p-3 rounded-xl"
              value={budgetForm.category}
              onChange={(e) => setBudgetForm({ ...budgetForm, category: e.target.value })}
            >
              {categories.map((c) => <option key={c}>{c}</option>)}
            </select>

            <input
              className="border p-3 rounded-xl"
              placeholder="Budget Amount"
              value={budgetForm.budget_amount}
              onChange={(e) => setBudgetForm({ ...budgetForm, budget_amount: e.target.value })}
            />

            <input
              className="border p-3 rounded-xl"
              placeholder="Supplier Name"
              value={budgetForm.supplier_name}
              onChange={(e) => setBudgetForm({ ...budgetForm, supplier_name: e.target.value })}
            />

            <button className="bg-black text-white rounded-xl">Add</button>
          </form>
        </section>

        <section className="bg-white p-6 rounded-2xl shadow mb-8">
          <h2 className="text-xl font-bold mb-4">Budget Tracker</h2>

          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b">
                <th>Category</th>
                <th>Budget</th>
                <th>Quote</th>
                <th>Supplier</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {budgetItems.map((item) => (
                <tr key={item.id} className="border-b">
                  <td className="py-3">{item.category}</td>
                  <td>R {Number(item.budget_amount).toLocaleString()}</td>
                  <td>R {Number(item.quote_amount).toLocaleString()}</td>
                  <td>{item.supplier_name}</td>
                  <td>{item.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section className="bg-white p-6 rounded-2xl shadow mb-8">
          <h2 className="text-xl font-bold mb-4">Add Supplier Quote</h2>

          <form onSubmit={addQuote} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <select
              className="border p-3 rounded-xl"
              value={quoteForm.category}
              onChange={(e) => setQuoteForm({ ...quoteForm, category: e.target.value })}
            >
              {categories.map((c) => <option key={c}>{c}</option>)}
            </select>

            <input
              className="border p-3 rounded-xl"
              placeholder="Supplier Name"
              value={quoteForm.supplier_name}
              onChange={(e) => setQuoteForm({ ...quoteForm, supplier_name: e.target.value })}
            />

            <input
              className="border p-3 rounded-xl"
              placeholder="Supplier Contact"
              value={quoteForm.supplier_contact}
              onChange={(e) => setQuoteForm({ ...quoteForm, supplier_contact: e.target.value })}
            />

            <input
              className="border p-3 rounded-xl"
              placeholder="Quote Amount"
              value={quoteForm.quote_amount}
              onChange={(e) => setQuoteForm({ ...quoteForm, quote_amount: e.target.value })}
            />

            <select
              className="border p-3 rounded-xl"
              value={quoteForm.status}
              onChange={(e) => setQuoteForm({ ...quoteForm, status: e.target.value })}
            >
              <option>Quote Requested</option>
              <option>Quote Received</option>
              <option>Under Review</option>
              <option>Sent to Client</option>
              <option>Approved by Client</option>
              <option>Rejected by Client</option>
              <option>Deposit Paid</option>
              <option>Fully Paid</option>
            </select>

            <button className="bg-black text-white rounded-xl">Add Quote</button>
          </form>
        </section>

        <section className="bg-white p-6 rounded-2xl shadow">
          <h2 className="text-xl font-bold mb-4">Quote CRM</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {quotes.map((quote) => (
              <div key={quote.id} className="border rounded-2xl p-4">
                <p className="text-sm text-slate-500">{quote.status}</p>
                <h3 className="font-bold text-lg">{quote.supplier_name}</h3>
                <p>R {Number(quote.quote_amount).toLocaleString()}</p>
                <p>{quote.supplier_contact}</p>

                <div className="mt-4 flex gap-2 flex-wrap">
                  <button
                    onClick={() => updateQuoteStatus(quote.id, "Approved by Client")}
                    className="bg-green-600 text-white px-3 py-2 rounded-xl text-sm"
                  >
                    Approve
                  </button>

                  <button
                    onClick={() => updateQuoteStatus(quote.id, "Rejected by Client")}
                    className="bg-red-600 text-white px-3 py-2 rounded-xl text-sm"
                  >
                    Reject
                  </button>

                  <button
                    onClick={() => updateQuoteStatus(quote.id, "Under Review")}
                    className="bg-yellow-500 text-white px-3 py-2 rounded-xl text-sm"
                  >
                    Review
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

function Card({ title, value }: { title: string; value: any }) {
  return (
    <div className="bg-white p-5 rounded-2xl shadow">
      <p className="text-sm text-slate-500">{title}</p>
      <h2 className="text-2xl font-bold">{value}</h2>
    </div>
  );
}
