// src/Offices/BPLO/Overview.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FileText, ArrowUpRight, Sparkles, Clock3, CheckCircle2, AlertCircle, RefreshCw, Briefcase,
} from "lucide-react";
import OfficeLayout from "../OfficeLayout";
import { bploOffice } from "../officeData";
import { getBPLORequests } from "../../services/bploData";

export default function BPLOOverview() {
  const [requests, setRequests] = useState([]);

  const loadData = () => setRequests(getBPLORequests());

  useEffect(() => {
    document.title = "Business Permits & Licensing Office Overview — ACORS";
    loadData();
  }, []);

  const stats = {
    total: requests.length,
    renewals: requests.filter((r) => r.certificateType?.includes("Renewal")).length,
    closures: requests.filter((r) => r.certificateType?.includes("Closure")).length,
    retirements: requests.filter((r) => r.certificateType?.includes("Retirement")).length,
    pending: requests.filter((r) => r.status?.includes("Verification") || r.status === "Submitted" || r.status?.includes("Review")).length,
    aiPassed: requests.filter((r) => r.aiValidation?.status?.includes("READY") || r.aiValidation?.status === "PASSED").length,
    requiresCorrection: requests.filter((r) => r.status === "Requires Correction").length,
    approved: requests.filter((r) => r.status === "Approved").length,
  };

  const statCards = [
    { title: "Total Requests", value: stats.total, note: "All BPLO filings" },
    { title: "Permit Renewals", value: stats.renewals, note: "Mayor's Permit" },
    { title: "Pending Review", value: stats.pending, note: "Licensing queue" },
    { title: "AI Passed", value: stats.aiPassed, note: "Complete records" },
    { title: "Approved & Issued", value: stats.approved, note: "Active permits & certs" },
  ];

  function certTypeBadge(type) {
    if (type?.includes("Renewal")) return { label: "Renewal", cls: "bg-emerald-50 text-emerald-700" };
    if (type?.includes("Closure")) return { label: "Closure", cls: "bg-amber-50 text-amber-700" };
    if (type?.includes("Retirement")) return { label: "Retirement", cls: "bg-purple-50 text-purple-700" };
    return { label: type, cls: "bg-zinc-100 text-zinc-700" };
  }

  return (
    <OfficeLayout office={bploOffice} header="Business Permits &amp; Licensing Office">
      <div className="space-y-5 sm:space-y-6">
        {/* Header */}
        <header className="flex animate-fade-up flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.22em] text-gray-500">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-600 opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-red-600" />
              </span>
              City Government of Malaybalay · BPLO Licensing Executive Portal
            </p>
            <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">
              BPLO Dashboard
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={loadData} className="flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-3.5 py-2 text-xs font-bold text-gray-700 shadow-sm transition hover:bg-zinc-50">
              <RefreshCw size={14} /> Refresh
            </button>
            <Link to="/office/bplo/requests" className="flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-red-700">
              <FileText size={15} /> Open Licensing Console
            </Link>
          </div>
        </header>

        {/* Stats Band */}
        <section className="grid animate-fade-up grid-cols-2 divide-y divide-gray-100 rounded-3xl border border-gray-200/70 bg-white shadow-sm sm:grid-cols-3 xl:grid-cols-5 xl:divide-x xl:divide-y-0" style={{ animationDelay: "40ms" }}>
          {statCards.map((stat) => (
            <div key={stat.title} className="p-4 sm:p-5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-gray-500">{stat.title}</p>
              <p className="mt-1 font-mono text-3xl font-bold tracking-tight text-gray-900">{stat.value}</p>
              <p className="mt-1 font-mono text-[11px] text-gray-500">{stat.note}</p>
            </div>
          ))}
        </section>

        {/* Breakdown & Queue */}
        <section className="grid gap-6 xl:grid-cols-12">
          <div className="animate-fade-up rounded-3xl border border-gray-200/70 bg-white p-5 shadow-sm xl:col-span-7" style={{ animationDelay: "80ms" }}>
            <div className="flex items-center justify-between">
              <h2 className="text-base font-extrabold text-gray-900 sm:text-lg">Services Volume Distribution</h2>
              <span className="font-mono text-xs text-gray-400">Permits &amp; Certifications</span>
            </div>
            <div className="mt-5 space-y-4">
              {bploOffice.categoryBreakdown.map((item) => (
                <div key={item.name} className="space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-gray-800">{item.name}</span>
                    <span className="font-mono text-gray-500">{item.percent}</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-zinc-100">
                    <div className={`h-full rounded-full ${item.color}`} style={{ width: item.percent.split("%")[0] + "%" }} />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 rounded-2xl bg-zinc-50 p-4 text-xs text-gray-600">
              <div className="flex items-center gap-2 font-bold text-gray-900">
                <Sparkles size={16} className="text-red-600" />
                <span>AI Automated Pre-Screening Active</span>
              </div>
              <p className="mt-1 text-[11px] text-gray-500">
                AI cross-checks business permit numbers, DTI/SEC registration consistency, and barangay clearances. Official approval is finalized by BPLO licensing officers.
              </p>
            </div>
          </div>

          <div className="animate-fade-up rounded-3xl border border-gray-200/70 bg-white p-5 shadow-sm xl:col-span-5" style={{ animationDelay: "120ms" }}>
            <h2 className="text-base font-extrabold text-gray-900 sm:text-lg">Queue Status</h2>
            <div className="mt-5 space-y-4 text-xs">
              <div className="flex items-center justify-between rounded-2xl border border-emerald-100 bg-emerald-50/50 p-3.5">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-600 text-white"><CheckCircle2 size={18} /></div>
                  <div><span className="block font-bold text-gray-900">Approved & Issued</span><span className="text-[11px] text-gray-500">Permits & certs signed</span></div>
                </div>
                <span className="font-mono text-lg font-bold text-emerald-700">{stats.approved}</span>
              </div>
              <div className="flex items-center justify-between rounded-2xl border border-blue-100 bg-blue-50/50 p-3.5">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white"><Clock3 size={18} /></div>
                  <div><span className="block font-bold text-gray-900">Pending Verification</span><span className="text-[11px] text-gray-500">Awaiting licensing staff</span></div>
                </div>
                <span className="font-mono text-lg font-bold text-blue-700">{stats.pending}</span>
              </div>
              <div className="flex items-center justify-between rounded-2xl border border-amber-100 bg-amber-50/50 p-3.5">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500 text-white"><AlertCircle size={18} /></div>
                  <div><span className="block font-bold text-gray-900">Requires Correction</span><span className="text-[11px] text-gray-500">Missing barangay clearance</span></div>
                </div>
                <span className="font-mono text-lg font-bold text-amber-700">{stats.requiresCorrection}</span>
              </div>
            </div>
            <Link to="/office/bplo/requests" className="mt-6 flex w-full items-center justify-center gap-1.5 rounded-xl border border-zinc-200 py-3 text-xs font-bold text-gray-700 transition hover:bg-zinc-50">
              Manage All Applications <ArrowUpRight size={14} />
            </Link>
          </div>
        </section>

        {/* Recent Requests */}
        <section className="animate-fade-up rounded-3xl border border-gray-200/70 bg-white p-5 shadow-sm" style={{ animationDelay: "160ms" }}>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-extrabold text-gray-900 sm:text-lg">Recent BPLO Applications</h2>
              <p className="text-xs text-gray-500">Business license filings in Malaybalay City</p>
            </div>
            <Link to="/office/bplo/requests" className="text-xs font-bold text-red-600 hover:text-red-700">View Full Table</Link>
          </div>
          <div className="mt-5 overflow-x-auto">
            <table className="w-full min-w-180 text-left text-xs">
              <thead>
                <tr className="border-b border-gray-200 text-[11px] uppercase tracking-wider text-gray-500">
                  <th className="px-3.5 py-3 font-semibold">Request ID</th>
                  <th className="px-3.5 py-3 font-semibold">Service</th>
                  <th className="px-3.5 py-3 font-semibold">Business Name</th>
                  <th className="px-3.5 py-3 font-semibold">Owner</th>
                  <th className="px-3.5 py-3 font-semibold">AI Scan</th>
                  <th className="px-3.5 py-3 font-semibold">Status</th>
                  <th className="px-3.5 py-3 font-semibold">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {requests.slice(0, 6).map((req) => {
                  const badge = certTypeBadge(req.certificateType);
                  return (
                    <tr key={req.id} className="transition hover:bg-gray-50/70">
                      <td className="px-3.5 py-3.5 font-mono font-bold text-red-700">{req.id}</td>
                      <td className="px-3.5 py-3.5">
                        <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-mono text-[10px] font-bold ${badge.cls}`}>{badge.label}</span>
                      </td>
                      <td className="px-3.5 py-3.5 font-bold text-gray-900">{req.business?.businessName}</td>
                      <td className="px-3.5 py-3.5 text-gray-700">{req.owner?.fullName}</td>
                      <td className="px-3.5 py-3.5">
                        <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-mono text-[10px] font-bold ${req.aiValidation?.status?.includes("READY") || req.aiValidation?.status === "PASSED" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>
                          {req.aiValidation?.status?.includes("READY") || req.aiValidation?.status === "PASSED" ? "Complete" : "Needs Review"}
                        </span>
                      </td>
                      <td className="px-3.5 py-3.5 font-mono text-[11px] font-bold text-gray-700">{req.status}</td>
                      <td className="px-3.5 py-3.5 font-mono text-[11px] text-gray-500">{req.submittedAt}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </OfficeLayout>
  );
}
