// src/Barangay/BarangayReportsSummary.jsx
import { useState } from "react";
import { BarChart3, Download, TrendingUp, CheckCircle, Clock, AlertTriangle, Building2, MapPin } from "lucide-react";
import BarangayLayout from "./BarangayLayout";
import { getActiveBarangaySession, getBarangayStats } from "./barangayData";
import { getStoredComplaints } from "../services/complaintsStore";

export default function BarangayReportsSummary() {
  const [session] = useState(getActiveBarangaySession());
  const [stats] = useState(getBarangayStats(session.barangayName));
  const complaints = getStoredComplaints().filter(
    (c) =>
      c.barangay.toLowerCase().includes(session.slug.toLowerCase()) ||
      session.barangayName.toLowerCase().includes(c.barangay.toLowerCase())
  );

  const categories = [
    { name: "Road Damage & Potholes", count: 42, pct: "35%", color: "bg-red-700" },
    { name: "Garbage & Waste Collection", count: 34, pct: "28%", color: "bg-emerald-600" },
    { name: "Streetlights & Electricity", count: 22, pct: "18%", color: "bg-amber-500" },
    { name: "Flooding & Drainage", count: 14, pct: "11%", color: "bg-sky-600" },
    { name: "Public Safety & Others", count: 10, pct: "8%", color: "bg-zinc-500" },
  ];

  return (
    <BarangayLayout header="Barangay Performance &amp; Analytics">
      <div className="space-y-6 max-w-6xl">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-3xl border border-zinc-200/80 bg-white p-5 shadow-xs">
          <div>
            <h2 className="text-base font-extrabold text-zinc-900">
              Community Operations Report — {session.barangayName}
            </h2>
            <p className="text-xs text-zinc-500">
              Monthly resolution rate, response times, and LGU escalation ratios.
            </p>
          </div>

          <button className="inline-flex items-center gap-2 rounded-2xl bg-red-700 px-4 py-2.5 text-xs font-extrabold text-white shadow-xs hover:bg-red-800 transition">
            <Download size={15} />
            Export Barangay Report (PDF)
          </button>
        </div>

        {/* Metrics Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-3xl border border-zinc-200/80 bg-white p-5 shadow-xs">
            <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
              Resolution Rate
            </p>
            <p className="mt-2 font-mono text-3xl font-extrabold text-emerald-600">
              78.4%
            </p>
            <p className="mt-1 text-xs text-zinc-500">
              +5.2% from last quarter
            </p>
          </div>

          <div className="rounded-3xl border border-zinc-200/80 bg-white p-5 shadow-xs">
            <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
              Average Response Time
            </p>
            <p className="mt-2 font-mono text-3xl font-extrabold text-zinc-900">
              2.4 hrs
            </p>
            <p className="mt-1 text-xs text-zinc-500">
              Initial staff assessment
            </p>
          </div>

          <div className="rounded-3xl border border-zinc-200/80 bg-white p-5 shadow-xs">
            <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
              LGU Escalation Ratio
            </p>
            <p className="mt-2 font-mono text-3xl font-extrabold text-red-700">
              11.2%
            </p>
            <p className="mt-1 text-xs text-zinc-500">
              Out-of-scope / heavy equipment cases
            </p>
          </div>
        </div>

        {/* Categories Breakdown */}
        <div className="rounded-3xl border border-zinc-200/80 bg-white p-6 shadow-xs">
          <h3 className="text-sm font-extrabold text-zinc-900 mb-4">
            Complaint Categories Volume Breakdown
          </h3>

          <div className="space-y-4">
            {categories.map((cat) => (
              <div key={cat.name} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-zinc-800">{cat.name}</span>
                  <span className="font-mono font-bold text-zinc-500">
                    {cat.count} reports ({cat.pct})
                  </span>
                </div>
                <div className="h-2.5 w-full overflow-hidden rounded-full bg-zinc-100">
                  <div className={`h-full rounded-full ${cat.color}`} style={{ width: cat.pct }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </BarangayLayout>
  );
}
