// src/Admin/Reports.jsx
import { useEffect, useRef, useState } from "react";
import {
  Search,
  ChevronDown,
  MoreHorizontal,
  CheckCircle,
  XCircle,
  MapPin,
  Download,
  Plus,
  X,
  Share2,
  Building2,
  Building,
  RotateCcw,
  Sparkles,
  AlertTriangle,
  Layers,
  Wrench,
  Clock,
} from "lucide-react";
import AdminLayout from "../Layouts/AdminLayouts";
import {
  getStoredComplaints,
  lguAcceptComplaint,
  lguMarkInProgress,
  lguResolveComplaint,
  lguReturnToBarangay,
} from "../services/complaintsStore";
import { allOffices, officeFilterOptions } from "./adminData";

const statuses = [
  "All Statuses",
  "Escalated from Barangay",
  "Pending LGU Review",
  "LGU Accepted",
  "In Progress",
  "Resolved",
  "Barangay Review",
];

const barangays = ["Casisang", "Kalasungay", "Sumpong", "Aglayan", "Bangcud"];

export default function Reports() {
  const [complaints, setComplaints] = useState(getStoredComplaints());
  const [selectedReport, setSelectedReport] = useState(null);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Statuses");
  const [categoryFilter, setCategoryFilter] = useState("All Categories");
  const [officeFilter, setOfficeFilter] = useState("All Offices");
  const [activeTab, setActiveTab] = useState("all"); // 'all' | 'escalated'
  const [returnModalOpen, setReturnModalOpen] = useState(false);
  const [returnReason, setReturnReason] = useState("Within Barangay Operational Scope");
  const [returnNotes, setReturnNotes] = useState("");

  useEffect(() => {
    function loadData() {
      const data = getStoredComplaints();
      setComplaints(data);
      if (selectedReport) {
        const refreshed = data.find((c) => c.id === selectedReport.id);
        if (refreshed) setSelectedReport(refreshed);
      }
    }
    loadData();
    window.addEventListener("acors_complaints_updated", loadData);
    return () => {
      window.removeEventListener("acors_complaints_updated", loadData);
    };
  }, [selectedReport]);

  const normalizedQuery = query.trim().toLowerCase();

  const filteredReports = complaints.filter((report) => {
    const matchesQuery =
      normalizedQuery === "" ||
      [
        report.id,
        report.title,
        report.description,
        report.location,
        report.barangay,
        report.category,
        report.residentName,
        report.escalation?.recommendedOffice,
        report.escalation?.reason,
      ]
        .filter(Boolean)
        .some((field) => field.toLowerCase().includes(normalizedQuery));

    let matchesStatus = true;
    if (activeTab === "escalated") {
      matchesStatus =
        report.status === "ESCALATED TO LGU" ||
        report.status === "LGU REVIEW" ||
        report.status === "LGU ACCEPTED" ||
        report.status === "LGU IN PROGRESS" ||
        Boolean(report.escalation);
    } else if (statusFilter === "Escalated from Barangay") {
      matchesStatus =
        report.status === "ESCALATED TO LGU" ||
        report.status === "LGU REVIEW" ||
        report.status === "LGU ACCEPTED" ||
        report.status === "LGU IN PROGRESS";
    } else if (statusFilter === "Pending LGU Review") {
      matchesStatus =
        report.status === "ESCALATED TO LGU" || report.status === "LGU REVIEW";
    } else if (statusFilter === "LGU Accepted") {
      matchesStatus = report.status === "LGU ACCEPTED";
    } else if (statusFilter === "In Progress") {
      matchesStatus =
        report.status === "IN PROGRESS" || report.status === "LGU IN PROGRESS";
    } else if (statusFilter === "Resolved") {
      matchesStatus = report.status === "RESOLVED";
    } else if (statusFilter === "Barangay Review") {
      matchesStatus =
        report.status === "BARANGAY REVIEW" ||
        report.status === "SUBMITTED" ||
        report.status === "ACCEPTED";
    }

    const matchesCategory =
      categoryFilter === "All Categories" ||
      report.category === categoryFilter;

    const matchesOffice =
      officeFilter === "All Offices" ||
      report.escalation?.recommendedOffice === officeFilter ||
      report.aiAnalysis?.suggestedLguOffice === officeFilter;

    return matchesQuery && matchesStatus && matchesCategory && matchesOffice;
  });

  const visibleReport =
    selectedReport && filteredReports.some((r) => r.id === selectedReport.id)
      ? filteredReports.find((r) => r.id === selectedReport.id)
      : filteredReports[0] || null;

  // LGU Actions
  const handleLguAccept = () => {
    if (!visibleReport) return;
    const updated = lguAcceptComplaint(
      visibleReport.id,
      "LGU Administrator (City Hall Operations)"
    );
    setSelectedReport(updated);
  };

  const handleLguInProgress = () => {
    if (!visibleReport) return;
    const updated = lguMarkInProgress(visibleReport.id, {
      assignedTeam: `${visibleReport.escalation?.recommendedOffice || "LGU Department"} Response Team`,
      notes: "Mobilizing technical equipment and engineering crew.",
      staffName: "LGU Operations Desk",
    });
    setSelectedReport(updated);
  };

  const handleLguResolve = () => {
    if (!visibleReport) return;
    const updated = lguResolveComplaint(visibleReport.id, {
      resolutionDescription: `LGU engineering & technical intervention completed for ${visibleReport.title.toLowerCase()}.`,
      staffName: "LGU Admin / Department Lead",
    });
    setSelectedReport(updated);
  };

  const handleReturnSubmit = (e) => {
    e.preventDefault();
    if (!visibleReport) return;
    const updated = lguReturnToBarangay(visibleReport.id, {
      returnReason,
      notes: returnNotes || "Task returned for local Barangay implementation.",
      staffName: "LGU Review Officer",
    });
    setSelectedReport(updated);
    setReturnModalOpen(false);
    setReturnNotes("");
  };

  const escalatedCount = complaints.filter(
    (c) =>
      c.status === "ESCALATED TO LGU" ||
      c.status === "LGU REVIEW" ||
      c.status === "LGU ACCEPTED" ||
      c.status === "LGU IN PROGRESS" ||
      Boolean(c.escalation)
  ).length;

  return (
    <AdminLayout>
      <div className="space-y-4 sm:space-y-6">
        {/* Header */}
        <header className="flex animate-fade-up flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.22em] text-gray-500">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-600 opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-red-600" />
              </span>
              Malaybalay · Multi-Tier Complaint Management
            </p>
            <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">
              Citizen &amp; Barangay Complaints
            </h1>
          </div>

          <div className="flex flex-col gap-3 sm:items-end">
            <p className="font-mono text-[11px] font-medium tracking-wide text-gray-500">
              <span className="font-bold text-gray-900">{complaints.length}</span>{" "}
              ACTIVE COMPLAINTS · {escalatedCount} ESCALATED FROM BARANGAYS
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <button className="flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-xs font-bold text-gray-700 transition hover:bg-gray-50 active:translate-y-px sm:w-auto">
                <Download size={15} />
                Export CSV
              </button>
            </div>
          </div>
        </header>

        {/* View Switcher Tabs: All vs Barangay Escalations */}
        <div className="flex gap-2 border-b border-zinc-200 pb-2">
          <button
            onClick={() => {
              setActiveTab("all");
              setStatusFilter("All Statuses");
            }}
            className={`rounded-2xl px-5 py-2.5 text-xs font-extrabold transition ${
              activeTab === "all"
                ? "bg-red-700 text-white shadow-xs"
                : "bg-white text-zinc-600 border border-zinc-200 hover:bg-zinc-50"
            }`}
          >
            All Citizen Complaints ({complaints.length})
          </button>

          <button
            onClick={() => {
              setActiveTab("escalated");
              setStatusFilter("Escalated from Barangay");
            }}
            className={`relative rounded-2xl px-5 py-2.5 text-xs font-extrabold transition flex items-center gap-2 ${
              activeTab === "escalated"
                ? "bg-red-700 text-white shadow-xs"
                : "bg-white text-zinc-600 border border-zinc-200 hover:bg-zinc-50"
            }`}
          >
            <Share2 size={14} className={activeTab === "escalated" ? "text-white" : "text-red-600"} />
            <span>Barangay Escalations</span>
            <span
              className={`rounded-full px-2 py-0.5 text-[10px] font-mono font-bold ${
                activeTab === "escalated" ? "bg-white text-red-700" : "bg-red-100 text-red-700"
              }`}
            >
              {escalatedCount}
            </span>
          </button>
        </div>

        {/* Filters */}
        <section
          className="animate-fade-up rounded-2xl border border-gray-200/70 bg-white p-4 shadow-sm sm:p-5"
          style={{ animationDelay: "40ms" }}
        >
          <div className="grid gap-3 lg:grid-cols-[1fr_auto_auto_auto]">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search complaint ID, resident, barangay, escalation reason..."
                className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 pl-11 pr-4 text-xs font-semibold outline-none transition placeholder:text-gray-400 focus:border-red-700 focus:bg-white"
              />
            </div>

            <SelectFilter
              label="Recommended Office"
              value={officeFilter}
              onChange={setOfficeFilter}
              options={officeFilterOptions}
            />

            <SelectFilter
              label="Status"
              value={statusFilter}
              onChange={setStatusFilter}
              options={statuses}
            />

            <SelectFilter
              label="Category"
              value={categoryFilter}
              onChange={setCategoryFilter}
              options={[
                "All Categories",
                "Road Damage",
                "Potholes",
                "Garbage Accumulation",
                "Broken Streetlights",
                "Flooding",
                "Fallen Trees",
              ]}
            />
          </div>
        </section>

        {/* Main Content */}
        <section className="grid gap-6 xl:grid-cols-12">
          {/* Table */}
          <div
            className="animate-fade-up rounded-3xl border border-gray-200/70 bg-white p-4 shadow-sm sm:p-5 xl:col-span-8"
            style={{ animationDelay: "80ms" }}
          >
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mb-4">
              <div>
                <h2 className="text-base font-extrabold text-gray-900">
                  {activeTab === "escalated" ? "Barangay Escalation Queue" : "Municipal Complaint Records"}
                </h2>
                <p className="text-xs text-gray-500">
                  {activeTab === "escalated"
                    ? "Complaints where Barangay requested LGU heavy intervention."
                    : "Complaints across all Barangays and assigned LGU offices."}
                </p>
              </div>

              <p className="font-mono text-[11px] font-medium text-gray-500">
                {filteredReports.length} OF {complaints.length}
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-180 text-left text-xs">
                <thead>
                  <tr className="border-b border-gray-200 text-[10px] uppercase tracking-wider text-gray-400">
                    <th className="px-3 py-3 font-semibold">Complaint ID</th>
                    <th className="px-3 py-3 font-semibold">Resident</th>
                    <th className="px-3 py-3 font-semibold">Barangay</th>
                    <th className="px-3 py-3 font-semibold">Category</th>
                    <th className="px-3 py-3 font-semibold">
                      {activeTab === "escalated" ? "Escalated By" : "Recommended Office"}
                    </th>
                    <th className="px-3 py-3 font-semibold">Status</th>
                    <th className="px-3 py-3 text-right pr-3 font-semibold">Action</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {filteredReports.map((report) => (
                    <ReportRow
                      key={report.id}
                      report={report}
                      selected={visibleReport?.id === report.id}
                      onClick={() => setSelectedReport(report)}
                      isEscalatedView={activeTab === "escalated"}
                    />
                  ))}

                  {filteredReports.length === 0 && (
                    <tr>
                      <td colSpan={7} className="px-3 py-14 text-center text-gray-400">
                        <p className="text-xs font-bold">No complaints match your filters.</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Details & LGU Action Panel */}
          <aside
            className="animate-fade-up rounded-3xl border border-gray-200/70 bg-white p-5 shadow-sm xl:col-span-4"
            style={{ animationDelay: "140ms" }}
          >
            {visibleReport ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
                  <div>
                    <span className="font-mono text-xs font-bold text-red-700 bg-red-50 px-2 py-0.5 rounded-md">
                      {visibleReport.id}
                    </span>
                    <h3 className="mt-1 text-base font-extrabold text-gray-900 leading-snug">
                      {visibleReport.title}
                    </h3>
                  </div>
                  <StatusBadge status={visibleReport.status} />
                </div>

                {/* Evidence Photo */}
                {visibleReport.image && (
                  <div className="overflow-hidden rounded-2xl border border-gray-200">
                    <img
                      src={visibleReport.image}
                      alt={visibleReport.title}
                      className="h-40 w-full object-cover"
                    />
                  </div>
                )}

                {/* Resident & Location */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="rounded-xl bg-gray-50 p-3">
                    <span className="text-[10px] font-bold uppercase text-gray-400">Resident</span>
                    <p className="font-bold text-gray-900">{visibleReport.residentName}</p>
                    <p className="text-[10px] text-gray-500">{visibleReport.residentContact}</p>
                  </div>
                  <div className="rounded-xl bg-gray-50 p-3">
                    <span className="text-[10px] font-bold uppercase text-gray-400">Barangay (Tier 1)</span>
                    <p className="font-bold text-red-700">{visibleReport.barangay}</p>
                    <p className="text-[10px] text-gray-500 truncate">{visibleReport.location}</p>
                  </div>
                </div>

                {/* Description */}
                <div className="rounded-xl bg-gray-50 p-3 text-xs leading-relaxed text-gray-700">
                  {visibleReport.description}
                </div>

                {/* WHY WAS THIS COMPLAINT ESCALATED? */}
                {visibleReport.escalation && (
                  <div className="rounded-2xl border-2 border-red-200 bg-red-50/70 p-4 text-xs space-y-2">
                    <div className="flex items-center gap-2 text-red-800 font-extrabold text-xs">
                      <AlertTriangle size={15} />
                      <span>WHY WAS THIS COMPLAINT ESCALATED?</span>
                    </div>

                    <div>
                      <span className="text-[10px] font-bold uppercase text-gray-500">
                        Reason for Escalation:
                      </span>
                      <p className="font-bold text-red-900">{visibleReport.escalation.reason}</p>
                    </div>

                    <div>
                      <span className="text-[10px] font-bold uppercase text-gray-500">
                        Barangay Assessment:
                      </span>
                      <p className="text-zinc-800 leading-relaxed bg-white p-2.5 rounded-xl border border-red-100 mt-0.5">
                        &ldquo;{visibleReport.escalation.barangayAssessment}&rdquo;
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                      <div>
                        <span className="text-[10px] text-gray-400 font-semibold">Recommended Office:</span>
                        <p className="font-bold text-red-700">
                          {visibleReport.escalation.recommendedOffice}
                        </p>
                      </div>
                      <div>
                        <span className="text-[10px] text-gray-400 font-semibold">Escalated By:</span>
                        <p className="font-bold text-gray-800 truncate">
                          {visibleReport.escalation.escalatedBy}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* LGU ACTION CONTROLS */}
                <div className="border-t border-gray-100 pt-3">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2">
                    LGU Department Actions
                  </p>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={handleLguAccept}
                      disabled={
                        visibleReport.status === "LGU ACCEPTED" ||
                        visibleReport.status === "RESOLVED"
                      }
                      className="flex items-center justify-center gap-1.5 rounded-xl bg-red-700 px-3 py-2.5 text-xs font-bold text-white hover:bg-red-800 active:scale-95 disabled:opacity-40"
                    >
                      <CheckCircle size={14} />
                      Accept Escalation
                    </button>

                    <button
                      onClick={handleLguInProgress}
                      disabled={
                        visibleReport.status === "LGU IN PROGRESS" ||
                        visibleReport.status === "RESOLVED"
                      }
                      className="flex items-center justify-center gap-1.5 rounded-xl border border-zinc-200 bg-white px-3 py-2.5 text-xs font-bold text-zinc-700 hover:bg-zinc-50 active:scale-95 disabled:opacity-40"
                    >
                      <Wrench size={14} className="text-sky-600" />
                      In Progress
                    </button>

                    <button
                      onClick={handleLguResolve}
                      disabled={visibleReport.status === "RESOLVED"}
                      className="flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 px-3 py-2.5 text-xs font-bold text-white hover:bg-emerald-700 active:scale-95 disabled:opacity-40"
                    >
                      <CheckCircle size={14} />
                      Resolve (LGU)
                    </button>

                    <button
                      onClick={() => setReturnModalOpen(true)}
                      disabled={visibleReport.status === "RESOLVED"}
                      className="flex items-center justify-center gap-1.5 rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-xs font-bold text-red-700 hover:bg-red-100 active:scale-95 disabled:opacity-40"
                    >
                      <RotateCcw size={14} />
                      Return to Brgy
                    </button>
                  </div>
                </div>

                {/* Audit Trail */}
                <div className="border-t border-gray-100 pt-3">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2">
                    Complete Audit Trail
                  </p>
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                    {visibleReport.timeline?.map((t, idx) => (
                      <div key={idx} className="text-xs bg-gray-50 p-2 rounded-xl">
                        <div className="flex justify-between items-center font-bold text-gray-900">
                          <span>{t.step}</span>
                          <span className="font-mono text-[10px] text-gray-400">{t.time}</span>
                        </div>
                        <p className="text-[11px] text-gray-600 mt-0.5">{t.note}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-16 text-center text-gray-400">
                <p className="text-xs font-bold">Select a report to view details</p>
              </div>
            )}
          </aside>
        </section>
      </div>

      {/* Return to Barangay Modal */}
      {returnModalOpen && visibleReport && (
        <div
          onClick={() => setReturnModalOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/60 p-4 backdrop-blur-xs"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl animate-in zoom-in-95"
          >
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100 mb-4">
              <h3 className="text-base font-extrabold text-zinc-900">Return Complaint to Barangay</h3>
              <button
                onClick={() => setReturnModalOpen(false)}
                className="rounded-full p-1.5 text-zinc-400 hover:bg-zinc-100"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleReturnSubmit} className="space-y-4 text-xs">
              <div className="rounded-2xl bg-amber-50 p-3 text-amber-900">
                Return this complaint to <strong>{visibleReport.barangay}</strong> for local handling.
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">
                  Reason for Returning
                </label>
                <select
                  value={returnReason}
                  onChange={(e) => setReturnReason(e.target.value)}
                  className="w-full rounded-xl border border-zinc-200 p-2.5 text-xs font-bold focus:border-red-700 outline-none"
                >
                  <option value="Within Barangay Operational Scope">Within Barangay Operational Scope</option>
                  <option value="Minor Road/Debris - No Heavy Equipment Required">Minor Road/Debris - No Heavy Equipment Required</option>
                  <option value="Local Barangay Mediation Needed">Local Barangay Mediation Needed</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">
                  Instructions for Barangay Staff
                </label>
                <textarea
                  rows={3}
                  required
                  value={returnNotes}
                  onChange={(e) => setReturnNotes(e.target.value)}
                  placeholder="Provide guidance on local resolution steps..."
                  className="w-full rounded-xl border border-zinc-200 p-3 text-xs font-semibold focus:border-red-700 outline-none resize-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-zinc-100">
                <button
                  type="button"
                  onClick={() => setReturnModalOpen(false)}
                  className="rounded-xl border border-zinc-200 px-4 py-2 text-xs font-bold text-zinc-600 hover:bg-zinc-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-red-700 px-5 py-2 text-xs font-bold text-white hover:bg-red-800"
                >
                  Return to Barangay
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

function SelectFilter({ label, value, onChange, options }) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        aria-label={label}
        className="h-11 w-full min-w-0 appearance-none rounded-xl border border-gray-200 bg-white pl-4 pr-10 text-xs font-bold text-gray-700 outline-none hover:bg-gray-50 focus:border-red-700 sm:min-w-44"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <ChevronDown
        size={15}
        className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400"
      />
    </div>
  );
}

function ReportRow({ report, selected, onClick, isEscalatedView }) {
  const isEscalated =
    report.status === "ESCALATED TO LGU" ||
    report.status === "LGU REVIEW" ||
    report.status === "LGU ACCEPTED" ||
    report.status === "LGU IN PROGRESS" ||
    Boolean(report.escalation);

  return (
    <tr
      onClick={onClick}
      className={`cursor-pointer transition ${
        selected ? "bg-red-50/70 font-semibold" : "hover:bg-gray-50/60"
      }`}
    >
      <td className="px-3 py-3.5 font-mono text-[11px] font-bold text-gray-800">
        {report.id}
      </td>
      <td className="px-3 py-3.5">
        <p className="font-bold text-gray-900">{report.residentName}</p>
        <p className="text-[10px] text-gray-400">{report.submittedAt.split("·")[0]}</p>
      </td>
      <td className="px-3 py-3.5 text-red-700 font-bold">
        {report.barangay}
      </td>
      <td className="px-3 py-3.5">
        <span className="rounded-md bg-gray-100 px-2 py-0.5 text-[10px] font-bold text-gray-700">
          {report.category}
        </span>
      </td>
      <td className="px-3 py-3.5 font-medium text-gray-700">
        {isEscalatedView
          ? report.escalation?.escalatedBy || "Barangay Staff"
          : report.escalation?.recommendedOffice || report.aiAnalysis?.suggestedLguOffice || "City Engineering"}
      </td>
      <td className="px-3 py-3.5">
        <StatusBadge status={report.status} />
      </td>
      <td className="px-3 py-3.5 text-right pr-3">
        <button className="rounded-xl border border-gray-200 bg-white px-3 py-1 text-xs font-bold text-gray-700 hover:bg-red-50 hover:text-red-700">
          View
        </button>
      </td>
    </tr>
  );
}

function StatusBadge({ status }) {
  const styles = {
    "BARANGAY REVIEW": "bg-amber-100 text-amber-800",
    SUBMITTED: "bg-gray-100 text-gray-700",
    ACCEPTED: "bg-blue-100 text-blue-800",
    "IN PROGRESS": "bg-sky-100 text-sky-800",
    "INFORMATION REQUIRED": "bg-orange-100 text-orange-800",
    "INFORMATION SUBMITTED": "bg-purple-100 text-purple-800",
    RESOLVED: "bg-emerald-100 text-emerald-800",
    "ESCALATED TO LGU": "bg-red-100 text-red-800",
    "LGU ACCEPTED": "bg-indigo-100 text-indigo-800",
    "LGU IN PROGRESS": "bg-cyan-100 text-cyan-800",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-extrabold ${
        styles[status] || "bg-gray-100 text-gray-600"
      }`}
    >
      {status}
    </span>
  );
}