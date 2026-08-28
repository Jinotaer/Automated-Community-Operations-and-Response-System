// src/Barangay/BarangayEscalated.jsx
import { useState, useEffect } from "react";
import {
  Search,
  ChevronDown,
  MapPin,
  Sparkles,
  Share2,
  Building,
  CheckCircle2,
  Clock,
  Wrench,
  AlertTriangle,
  Send,
  MessageSquare,
  ShieldCheck,
  RotateCcw,
  Layers,
  ArrowUpRight,
  Filter,
} from "lucide-react";
import BarangayLayout from "./BarangayLayout";
import { getStoredComplaints } from "../services/complaintsStore";
import { getActiveBarangaySession } from "./barangayData";
import { Link } from "react-router-dom";

export default function BarangayEscalated() {
  const [complaints, setComplaints] = useState(getStoredComplaints());
  const [session, setSession] = useState(getActiveBarangaySession());
  const [query, setQuery] = useState("");
  const [officeFilter, setOfficeFilter] = useState("All Offices");
  const [reasonFilter, setReasonFilter] = useState("All Reasons");
  const [lguStatusFilter, setLguStatusFilter] = useState("All");
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [followUpNotes, setFollowUpNotes] = useState("");
  const [followUpSuccess, setFollowUpSuccess] = useState(false);

  useEffect(() => {
    function loadData() {
      const active = getActiveBarangaySession();
      setSession(active);
      const data = getStoredComplaints();
      setComplaints(data);
      if (selectedComplaint) {
        const refreshed = data.find((c) => c.id === selectedComplaint.id);
        if (refreshed) setSelectedComplaint(refreshed);
      }
    }
    loadData();
    window.addEventListener("acors_complaints_updated", loadData);
    return () => {
      window.removeEventListener("acors_complaints_updated", loadData);
    };
  }, [selectedComplaint]);

  // Only get active/unresolved escalated complaints belonging to this Barangay
  const escalatedComplaints = complaints.filter((c) => {
    const isThisBarangay =
      c.barangay.toLowerCase().includes(session.slug.toLowerCase()) ||
      session.barangayName.toLowerCase().includes(c.barangay.toLowerCase());

    const isEscalated =
      (c.status === "ESCALATED TO LGU" ||
      c.status === "LGU REVIEW" ||
      c.status === "LGU ACCEPTED" ||
      c.status === "LGU IN PROGRESS" ||
      Boolean(c.escalation)) &&
      c.status !== "RESOLVED";

    return isThisBarangay && isEscalated;
  });

  const filtered = escalatedComplaints.filter((c) => {
    const q = query.toLowerCase().trim();
    const matchesSearch =
      q === "" ||
      c.id.toLowerCase().includes(q) ||
      c.title.toLowerCase().includes(q) ||
      c.residentName.toLowerCase().includes(q) ||
      c.escalation?.reason?.toLowerCase().includes(q) ||
      c.escalation?.recommendedOffice?.toLowerCase().includes(q) ||
      c.location.toLowerCase().includes(q);

    const matchesOffice =
      officeFilter === "All Offices" ||
      c.escalation?.recommendedOffice?.toLowerCase().includes(officeFilter.toLowerCase()) ||
      c.aiAnalysis?.suggestedLguOffice?.toLowerCase().includes(officeFilter.toLowerCase());

    const matchesReason =
      reasonFilter === "All Reasons" ||
      c.escalation?.reason?.toLowerCase().includes(reasonFilter.toLowerCase());

    let matchesLguStatus = true;
    if (lguStatusFilter === "Pending LGU Review") {
      matchesLguStatus = c.status === "ESCALATED TO LGU" || c.status === "LGU REVIEW";
    } else if (lguStatusFilter === "LGU Accepted") {
      matchesLguStatus = c.status === "LGU ACCEPTED";
    } else if (lguStatusFilter === "LGU In Progress") {
      matchesLguStatus = c.status === "LGU IN PROGRESS";
    } else if (lguStatusFilter === "LGU Resolved") {
      matchesLguStatus = c.status === "RESOLVED";
    }

    return matchesSearch && matchesOffice && matchesReason && matchesLguStatus;
  });

  const activeComplaint =
    selectedComplaint && filtered.some((c) => c.id === selectedComplaint.id)
      ? filtered.find((c) => c.id === selectedComplaint.id)
      : filtered[0] || null;

  // Stats calculation
  const totalEscalated = escalatedComplaints.length;
  const pendingReview = escalatedComplaints.filter(
    (c) => c.status === "ESCALATED TO LGU" || c.status === "LGU REVIEW"
  ).length;
  const lguActive = escalatedComplaints.filter(
    (c) => c.status === "LGU ACCEPTED" || c.status === "LGU IN PROGRESS"
  ).length;
  const lguResolved = escalatedComplaints.filter((c) => c.status === "RESOLVED").length;

  const handleSendFollowUp = (e) => {
    e.preventDefault();
    if (!followUpNotes.trim()) return;
    setFollowUpSuccess(true);
    setFollowUpNotes("");
    setTimeout(() => setFollowUpSuccess(false), 3500);
  };

  return (
    <BarangayLayout header="Escalated to LGU Console">
      <div className="space-y-6">
        {/* Header Banner */}
        <div className="rounded-3xl border border-red-200/80 bg-gradient-to-r from-red-950 via-zinc-900 to-zinc-900 p-6 text-white shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="flex h-6 items-center gap-1.5 rounded-full bg-red-600 px-3 text-[11px] font-extrabold uppercase tracking-wide text-white">
                  <Share2 size={12} />
                  Tier 2 Transfers
                </span>
                <span className="text-xs text-zinc-300 font-medium">
                  {session.barangayName}
                </span>
              </div>
              <h1 className="mt-2 text-2xl font-black tracking-tight sm:text-3xl">
                Escalated Complaints to City LGU
              </h1>
              <p className="mt-1 text-xs text-zinc-300 max-w-2xl leading-relaxed">
                Complaints requiring city-level engineering, specialized equipment, or municipal funding forwarded directly to Malaybalay City Hall departments.
              </p>
            </div>
          </div>
        </div>

        {/* Filters Bar */}
        <div className="rounded-3xl border border-zinc-200/80 bg-white p-4 sm:p-5 shadow-xs">
          <div className="grid gap-3 sm:grid-cols-1 md:grid-cols-[1fr_auto_auto_auto]">
            {/* Search */}
            <div className="relative">
              <Search
                size={18}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400"
              />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search escalated ID, issue, reason, target office..."
                className="h-11 w-full rounded-2xl border border-zinc-200 bg-zinc-50 pl-10 pr-4 text-xs font-semibold text-zinc-900 outline-none transition focus:border-red-600 focus:bg-white"
              />
            </div>

            {/* Target Office Filter */}
            <div className="relative min-w-44">
              <select
                value={officeFilter}
                onChange={(e) => setOfficeFilter(e.target.value)}
                className="h-11 w-full appearance-none rounded-2xl border border-zinc-200 bg-white pl-4 pr-9 text-xs font-bold text-zinc-700 outline-none hover:bg-zinc-50 focus:border-red-600"
              >
                <option value="All Offices">All Target Offices</option>
                <option value="City Engineering">City Engineering Office</option>
                <option value="CENRO">CENRO (Environment)</option>
                <option value="CDRRMO">CDRRMO (Disaster)</option>
                <option value="Traffic">Traffic Management (TMC)</option>
                <option value="City Health">City Health Office</option>
              </select>
              <ChevronDown
                size={15}
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400"
              />
            </div>

            {/* Reason Filter */}
            <div className="relative min-w-44">
              <select
                value={reasonFilter}
                onChange={(e) => setReasonFilter(e.target.value)}
                className="h-11 w-full appearance-none rounded-2xl border border-zinc-200 bg-white pl-4 pr-9 text-xs font-bold text-zinc-700 outline-none hover:bg-zinc-50 focus:border-red-600"
              >
                <option value="All Reasons">All Escalation Reasons</option>
                <option value="Requires Specialized Equipment">Specialized Equipment</option>
                <option value="Beyond Barangay Authority">Beyond Authority</option>
                <option value="Requires LGU Budget">Requires Budget</option>
                <option value="City-wide Impact">City-wide Impact</option>
              </select>
              <ChevronDown
                size={15}
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400"
              />
            </div>

            {/* LGU Status Filter */}
            <div className="relative min-w-40">
              <select
                value={lguStatusFilter}
                onChange={(e) => setLguStatusFilter(e.target.value)}
                className="h-11 w-full appearance-none rounded-2xl border border-zinc-200 bg-white pl-4 pr-9 text-xs font-bold text-zinc-700 outline-none hover:bg-zinc-50 focus:border-red-600"
              >
                <option value="All">All Active LGU Statuses</option>
                <option value="Pending LGU Review">Pending Review</option>
                <option value="LGU Accepted">LGU Accepted</option>
                <option value="LGU In Progress">LGU In Progress</option>
              </select>
              <ChevronDown
                size={15}
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400"
              />
            </div>
          </div>
        </div>

        {/* Main Content Split: Escalated List & Escalation Dossier */}
        <div className="grid gap-6 lg:grid-cols-12">
          {/* Table of Escalated Complaints */}
          <div className="rounded-3xl border border-zinc-200/80 bg-white p-5 shadow-xs lg:col-span-7 xl:col-span-8">
            <div className="flex items-center justify-between pb-4 border-b border-zinc-100 mb-4">
              <div>
                <h2 className="text-base font-extrabold text-zinc-900">
                  Transferred Escalations Queue
                </h2>
                <p className="text-xs text-zinc-500">
                  Showing {filtered.length} of {escalatedComplaints.length} transferred complaints
                </p>
              </div>

              <span className="rounded-full bg-red-50 px-3 py-1 font-mono text-xs font-extrabold text-red-700">
                {session.barangayName}
              </span>
            </div>

            {filtered.length > 0 ? (
              <div className="space-y-3">
                {filtered.map((item) => {
                  const isSelected = activeComplaint?.id === item.id;
                  return (
                    <div
                      key={item.id}
                      onClick={() => setSelectedComplaint(item)}
                      className={`cursor-pointer rounded-2xl border p-4 transition ${
                        isSelected
                          ? "border-red-600 bg-red-50/40 shadow-xs"
                          : "border-zinc-200/80 bg-white hover:border-zinc-300 hover:bg-zinc-50/60"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-bold text-red-700 bg-red-100/60 px-2 py-0.5 rounded-md">
                              {item.id}
                            </span>
                            <span className="rounded-md bg-zinc-100 px-2 py-0.5 text-[10px] font-bold text-zinc-700">
                              {item.category}
                            </span>
                          </div>
                          <h3 className="mt-1 text-sm font-extrabold text-zinc-900">
                            {item.title}
                          </h3>
                        </div>

                        <LguStatusBadge status={item.status} />
                      </div>

                      <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs bg-white p-3 rounded-xl border border-zinc-100">
                        <div>
                          <span className="text-[10px] font-bold uppercase text-zinc-400">
                            Target LGU Department
                          </span>
                          <p className="font-bold text-red-700 flex items-center gap-1">
                            <Building size={13} />
                            {item.escalation?.recommendedOffice || item.aiAnalysis?.suggestedLguOffice || "City Engineering"}
                          </p>
                        </div>
                        <div>
                          <span className="text-[10px] font-bold uppercase text-zinc-400">
                            Reason for Escalation
                          </span>
                          <p className="font-bold text-zinc-800 truncate">
                            {item.escalation?.reason || "Specialized Intervention"}
                          </p>
                        </div>
                      </div>

                      <div className="mt-2.5 flex items-center justify-between text-[11px] text-zinc-400">
                        <span>Escalated by {item.escalation?.escalatedBy || session.staffName}</span>
                        <span className="font-mono">{item.escalation?.escalatedAt || item.submittedAt}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="py-16 text-center text-zinc-400">
                <Share2 size={36} className="mx-auto mb-2 text-zinc-300 stroke-1" />
                <p className="text-xs font-bold">No escalated complaints found.</p>
                <p className="text-[11px] text-zinc-400 mt-1">
                  Complaints escalated from the main Complaints tab will appear here.
                </p>
              </div>
            )}
          </div>

          {/* Escalation Dossier & LGU Tracking Panel */}
          <div className="rounded-3xl border border-zinc-200/80 bg-white p-5 shadow-xs lg:col-span-5 xl:col-span-4">
            {activeComplaint ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
                  <div>
                    <span className="font-mono text-xs font-bold text-red-700">
                      {activeComplaint.id}
                    </span>
                    <h3 className="mt-1 text-sm font-extrabold text-zinc-900">
                      Escalation Dossier
                    </h3>
                  </div>
                  <LguStatusBadge status={activeComplaint.status} />
                </div>

                {activeComplaint.image && (
                  <img
                    src={activeComplaint.image}
                    alt={activeComplaint.title}
                    className="h-36 w-full rounded-2xl object-cover border border-zinc-200"
                  />
                )}

                {/* Escalation Details Card */}
                <div className="rounded-2xl border-2 border-red-200 bg-red-50/70 p-4 text-xs space-y-2.5">
                  <div className="flex items-center gap-1.5 font-black text-red-900 text-xs uppercase tracking-wide">
                    <AlertTriangle size={15} />
                    <span>Barangay Escalation Summary</span>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold uppercase text-zinc-500">
                      Target LGU Office:
                    </span>
                    <p className="font-extrabold text-red-800 text-xs">
                      {activeComplaint.escalation?.recommendedOffice || "City Engineering Office"}
                    </p>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold uppercase text-zinc-500">
                      Primary Escalation Reason:
                    </span>
                    <p className="font-bold text-zinc-900">
                      {activeComplaint.escalation?.reason || "Specialized Intervention Required"}
                    </p>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold uppercase text-zinc-500">
                      Barangay Assessment Provided:
                    </span>
                    <p className="mt-1 rounded-xl bg-white p-2.5 text-zinc-800 leading-relaxed border border-red-100">
                      &ldquo;{activeComplaint.escalation?.barangayAssessment || "Forwarded to LGU for heavy equipment and engineering dispatch."}&rdquo;
                    </p>
                  </div>
                </div>

                {/* Follow-up Note to LGU */}
                <form onSubmit={handleSendFollowUp} className="rounded-2xl bg-zinc-50 p-3.5 border border-zinc-100 text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-zinc-800 flex items-center gap-1.5">
                      <MessageSquare size={14} className="text-red-700" />
                      Follow-up / Note to LGU
                    </span>
                  </div>
                  <textarea
                    rows={2}
                    value={followUpNotes}
                    onChange={(e) => setFollowUpNotes(e.target.value)}
                    placeholder="Send urgent follow-up or additional notes to City Hall desk..."
                    className="w-full rounded-xl border border-zinc-200 bg-white p-2.5 text-xs text-zinc-900 outline-none focus:border-red-600 resize-none"
                  />
                  <button
                    type="submit"
                    className="flex items-center gap-1.5 rounded-xl bg-red-700 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-red-800 transition"
                  >
                    <Send size={12} />
                    Send Follow-up
                  </button>
                  {followUpSuccess && (
                    <p className="text-[11px] font-bold text-emerald-700 animate-in fade-in">
                      ✓ Follow-up transmitted to City Hall dispatch.
                    </p>
                  )}
                </form>

                {/* Live Timeline Tracker */}
                <div className="border-t border-zinc-100 pt-3">
                  <p className="text-[10px] font-extrabold uppercase tracking-wider text-zinc-400 mb-2">
                    LGU Dispatch History
                  </p>
                  <div className="space-y-2 max-h-40 overflow-y-auto pr-1 text-xs">
                    {activeComplaint.timeline?.map((step, idx) => (
                      <div key={idx} className="rounded-xl bg-zinc-50 p-2 border border-zinc-100">
                        <div className="flex items-center justify-between font-bold text-zinc-900">
                          <span>{step.step}</span>
                          <span className="font-mono text-[10px] text-zinc-400">{step.time}</span>
                        </div>
                        {step.note && (
                          <p className="text-[11px] text-zinc-600 mt-0.5 leading-snug">
                            {step.note}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-16 text-center text-zinc-400">
                <p className="text-xs font-bold">Select an escalation to inspect</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </BarangayLayout>
  );
}

function LguStatusBadge({ status }) {
  if (status === "LGU ACCEPTED") {
    return (
      <span className="rounded-full bg-indigo-100 px-2.5 py-0.5 text-[10px] font-extrabold text-indigo-800">
        LGU Accepted
      </span>
    );
  }
  if (status === "LGU IN PROGRESS") {
    return (
      <span className="rounded-full bg-cyan-100 px-2.5 py-0.5 text-[10px] font-extrabold text-cyan-800">
        LGU In Progress
      </span>
    );
  }
  if (status === "RESOLVED") {
    return (
      <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-extrabold text-emerald-800">
        LGU Resolved
      </span>
    );
  }
  return (
    <span className="rounded-full bg-red-100 px-2.5 py-0.5 text-[10px] font-extrabold text-red-800">
      Awaiting LGU Review
    </span>
  );
}
