// src/Barangay/BarangayDashboard.jsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ClipboardList,
  Clock,
  Wrench,
  CheckCircle2,
  Share2,
  Sparkles,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  Building2,
  MapPin,
  Layers,
  Activity,
} from "lucide-react";
import BarangayLayout from "./BarangayLayout";
import { getStoredComplaints } from "../services/complaintsStore";
import { getActiveBarangaySession, getBarangayStats } from "./barangayData";

export default function BarangayDashboard() {
  const [session, setSession] = useState(getActiveBarangaySession());
  const [complaints, setComplaints] = useState(getStoredComplaints());
  const [stats, setStats] = useState(getBarangayStats(session.barangayName));

  useEffect(() => {
    function loadData() {
      const active = getActiveBarangaySession();
      setSession(active);
      const all = getStoredComplaints();
      setComplaints(all);
      setStats(getBarangayStats(active.barangayName));
    }
    loadData();
    window.addEventListener("acors_complaints_updated", loadData);
    return () => {
      window.removeEventListener("acors_complaints_updated", loadData);
    };
  }, []);

  const barangayComplaints = complaints.filter((c) =>
    c.barangay.toLowerCase().includes(session.slug.toLowerCase()) ||
    session.barangayName.toLowerCase().includes(c.barangay.toLowerCase())
  );

  const recentComplaints = barangayComplaints.slice(0, 5);

  const statCards = [
    {
      title: "Total Complaints",
      value: stats.total || barangayComplaints.length,
      icon: ClipboardList,
      color: "bg-red-700 text-white",
      border: "border-red-200",
      link: "/barangay/complaints",
      subtext: "All community reports",
    },
    {
      title: "Pending Review",
      value: stats.pendingReview,
      icon: Clock,
      color: "bg-amber-500 text-white",
      border: "border-amber-200",
      link: "/barangay/pending",
      subtext: "Requires Barangay action",
    },
    {
      title: "In Progress",
      value: stats.inProgress,
      icon: Wrench,
      color: "bg-sky-600 text-white",
      border: "border-sky-200",
      link: "/barangay/in-progress",
      subtext: "Action being executed",
    },
    {
      title: "Resolved",
      value: stats.resolved,
      icon: CheckCircle2,
      color: "bg-emerald-600 text-white",
      border: "border-emerald-200",
      link: "/barangay/resolved",
      subtext: "Addressed by Barangay",
    },
    {
      title: "Escalated to LGU",
      value: stats.escalated,
      icon: Share2,
      color: "bg-red-600 text-white",
      border: "border-red-200",
      link: "/barangay/escalated",
      subtext: "Forwarded to City Office",
    },
  ];

  return (
    <BarangayLayout header="Barangay Operations Console">
      <div className="space-y-6">
        {/* Welcome Banner */}
        <div className="relative overflow-hidden rounded-3xl border border-red-200/80 bg-gradient-to-r from-red-900 via-red-800 to-red-950 p-6 text-white shadow-sm">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-white/20 px-3 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-red-100 backdrop-blur-xs">
                  Tier 1 Desk · {session.barangayName}
                </span>
                <span className="text-xs text-red-200">Population: {session.population}</span>
              </div>
              <h2 className="mt-2 text-2xl font-extrabold tracking-tight sm:text-3xl">
                Community Complaint Dashboard
              </h2>
              <p className="mt-1 text-xs text-red-100/90 max-w-xl">
                As the first-level respondent, review incoming resident reports, dispatch local Barangay teams, or escalate out-of-scope issues to LGU departments.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link
                to="/barangay/pending"
                className="rounded-2xl bg-white px-5 py-3 text-xs font-extrabold text-red-800 shadow-md transition hover:bg-red-50 active:scale-95"
              >
                Review Pending ({stats.pendingReview})
              </Link>
            </div>
          </div>
        </div>

        {/* 5 Stats Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {statCards.map((card) => {
            const Icon = card.icon;
            return (
              <Link
                key={card.title}
                to={card.link}
                className="group rounded-3xl border border-zinc-200/80 bg-white p-5 shadow-xs transition hover:border-red-300 hover:shadow-md hover:-translate-y-0.5"
              >
                <div className="flex items-center justify-between">
                  <div
                    className={`flex h-11 w-11 items-center justify-center rounded-2xl ${card.color} shadow-xs`}
                  >
                    <Icon size={20} />
                  </div>
                  <span className="text-xs font-bold text-zinc-400 group-hover:text-red-700 transition">
                    View →
                  </span>
                </div>

                <p className="mt-4 font-mono text-3xl font-extrabold text-zinc-900">
                  {card.value}
                </p>
                <p className="mt-1 text-xs font-bold text-zinc-800">{card.title}</p>
                <p className="text-[11px] text-zinc-400">{card.subtext}</p>
              </Link>
            );
          })}
        </div>

        {/* Recent Table + AI Protocol summary */}
        <div className="grid gap-6 xl:grid-cols-12">
          {/* Recent Queue */}
          <div className="rounded-3xl border border-zinc-200/80 bg-white p-5 shadow-xs xl:col-span-8">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-zinc-100">
              <div>
                <h3 className="text-sm font-extrabold text-zinc-900">
                  Recent Community Complaints
                </h3>
                <p className="text-xs text-zinc-500">
                  Latest submissions received for {session.barangayName}
                </p>
              </div>
              <Link
                to="/barangay/complaints"
                className="text-xs font-bold text-red-700 hover:text-red-800"
              >
                View all ({barangayComplaints.length})
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-140 text-left text-xs">
                <thead>
                  <tr className="border-b border-zinc-100 text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                    <th className="pb-2 pl-2">Complaint ID</th>
                    <th className="pb-2">Resident</th>
                    <th className="pb-2">Issue</th>
                    <th className="pb-2">Category</th>
                    <th className="pb-2">Status</th>
                    <th className="pb-2 text-right pr-2">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {recentComplaints.map((item) => (
                    <tr key={item.id} className="hover:bg-zinc-50/70 transition">
                      <td className="py-3 pl-2 font-mono text-[11px] font-bold text-zinc-800">
                        {item.id}
                      </td>
                      <td className="py-3 font-semibold text-zinc-900">
                        {item.residentName}
                      </td>
                      <td className="py-3 text-zinc-700 max-w-40 truncate">
                        {item.title}
                      </td>
                      <td className="py-3">
                        <span className="rounded-md bg-zinc-100 px-2 py-0.5 text-[10px] font-bold text-zinc-700">
                          {item.category}
                        </span>
                      </td>
                      <td className="py-3">
                        <StatusBadge status={item.status} />
                      </td>
                      <td className="py-3 text-right pr-2">
                        <Link
                          to="/barangay/complaints"
                          className="rounded-xl border border-zinc-200 bg-white px-2.5 py-1 text-xs font-bold text-zinc-700 hover:bg-red-50 hover:text-red-700 transition"
                        >
                          Manage
                        </Link>
                      </td>
                    </tr>
                  ))}
                  {recentComplaints.length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-zinc-400">
                        No recent complaints for this Barangay.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Right Architecture Card */}
          <div className="rounded-3xl border border-zinc-200/80 bg-white p-5 shadow-xs xl:col-span-4 space-y-4">
            <div>
              <div className="flex items-center gap-2 text-red-700 font-extrabold text-sm mb-1">
                <Layers size={18} />
                <span>3-Tier Architecture Protocol</span>
              </div>
              <p className="text-xs text-zinc-500 leading-relaxed">
                ACORS routes every citizen report to the local Barangay first.
              </p>
            </div>

            <div className="space-y-3 rounded-2xl bg-zinc-50 p-4 border border-zinc-100 text-xs">
              <div className="flex items-center gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-red-100 font-bold text-red-700">
                  1
                </span>
                <div>
                  <p className="font-bold text-zinc-900">Resident Submits</p>
                  <p className="text-[11px] text-zinc-500">AI auto-detects Barangay and severity</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-red-700 font-bold text-white">
                  2
                </span>
                <div>
                  <p className="font-bold text-red-700">Barangay Assesses (Tier 1)</p>
                  <p className="text-[11px] text-zinc-500">Accept, request info, solve, or escalate</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-zinc-200 font-bold text-zinc-700">
                  3
                </span>
                <div>
                  <p className="font-bold text-zinc-900">LGU Intervenes (Tier 2)</p>
                  <p className="text-[11px] text-zinc-500">Heavy equipment &amp; departmental teams</p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-red-200 bg-red-50/50 p-3.5">
              <p className="text-[11px] font-bold text-red-800 flex items-center gap-1.5">
                <Sparkles size={14} className="text-red-700" />
                AI Assistant Recommendation
              </p>
              <p className="mt-1 text-[11px] text-zinc-600 leading-relaxed">
                Always record before/after photos upon resolution. If heavy asphalt equipment or major drainage works are needed, use the <strong>"Escalate to LGU"</strong> action.
              </p>
            </div>
          </div>
        </div>
      </div>
    </BarangayLayout>
  );
}

function StatusBadge({ status }) {
  const styles = {
    "BARANGAY REVIEW": "bg-amber-100 text-amber-800 border-amber-200",
    SUBMITTED: "bg-zinc-100 text-zinc-700 border-zinc-200",
    ACCEPTED: "bg-blue-100 text-blue-800 border-blue-200",
    "IN PROGRESS": "bg-sky-100 text-sky-800 border-sky-200",
    "INFORMATION REQUIRED": "bg-orange-100 text-orange-800 border-orange-200",
    "INFORMATION SUBMITTED": "bg-purple-100 text-purple-800 border-purple-200",
    RESOLVED: "bg-emerald-100 text-emerald-800 border-emerald-200",
    "ESCALATED TO LGU": "bg-red-100 text-red-800 border-red-200",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-extrabold ${
        styles[status] || "bg-zinc-100 text-zinc-700 border-zinc-200"
      }`}
    >
      {status}
    </span>
  );
}
