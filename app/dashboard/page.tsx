"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

type Wedding = {
  id: string;
  bride_name: string;
  groom_name: string;
  wedding_date: string;
  venue_name: string;
  total_budget: number;
  status: string;
};

export default function DashboardPage() {
  const [weddings, setWeddings] = useState<Wedding[]>([]);

  useEffect(() => {
    loadWeddings();
  }, []);

  async function loadWeddings() {
    const { data } = await supabase
      .from("weddings")
      .select("*")
      .order("wedding_date", { ascending: true });

    setWeddings(data || []);
  }

  const totalBudget = weddings.reduce((sum, w) => sum + Number(w.total_budget || 0), 0);
  const pending = weddings.filter((w) => w.status !== "Completed").length;

  return (
    <main className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Wedding Planner Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card title="Total Weddings" value={weddings.length} />
          <Card title="Active Weddings" value={pending} />
          <Card title="Total Budget" value={`R ${totalBudget.toLocaleString()}`} />
          <Card title="Pending Quotes" value="Review" />
        </div>

        <h2 className="text-xl font-semibold mb-4">Wedding CRM Pipeline</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {weddings.map((wedding) => (
            <Link
              key={wedding.id}
              href={`/weddings/${wedding.id}`}
              className="bg-white rounded-2xl shadow p-5 hover:shadow-lg"
            >
              <p className="text-sm text-slate-500">{wedding.status}</p>
              <h3 className="text-xl font-bold">
                {wedding.bride_name} & {wedding.groom_name}
              </h3>
              <p>Date: {wedding.wedding_date}</p>
              <p>Venue: {wedding.venue_name}</p>
              <p>Budget: R {Number(wedding.total_budget || 0).toLocaleString()}</p>
            </Link>
          ))}
        </div>
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
