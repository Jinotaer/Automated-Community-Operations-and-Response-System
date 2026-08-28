// src/Citizen/Reports.jsx
import { useEffect, useState } from "react";
import {
  MapPin,
  Clock3,
  X,
  Check,
  Building,
  Share2,
  HelpCircle,
  Sparkles,
  Send,
  CheckCircle2,
  AlertTriangle,
  Layers,
  ChevronRight,
} from "lucide-react";
import CitizenLayout from "../Layouts/CitizenLayouts";
import { Link } from "react-router-dom";
import {
  getStoredComplaints,
  residentSubmitAdditionalInfo,
} from "../services/complaintsStore";

const filters = [
  "All",
  "Barangay Review",
  "In Progress",
  "Escalated to LGU",
  "Resolved",
];

export default function MyReports() {
  const [complaints, setComplaints] = useState(getStoredComplaints());
  const [activeFilter, setActiveFilter] = useState("All");
  const [selectedReport, setSelectedReport] = useState(null);

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

  const filteredReports = complaints.filter((r) => {
    if (activeFilter === "All") return true;
    if (activeFilter === "Barangay Review") {
      return (
        r.status === "BARANGAY REVIEW" ||
        r.status === "SUBMITTED" ||
        r.status === "INFORMATION REQUIRED" ||
        r.status === "INFORMATION SUBMITTED"
      );
    }
    if (activeFilter === "In Progress") {
      return (
        r.status === "IN PROGRESS" ||
        r.status === "ACCEPTED" ||
        r.status === "LGU ACCEPTED" ||
        r.status === "LGU IN PROGRESS"
      );
    }
    if (activeFilter === "Escalated to LGU") {
      return (
        r.status === "ESCALATED TO LGU" ||
        r.status === "LGU REVIEW" ||
        r.status === "LGU ACCEPTED" ||
        r.status === "LGU IN PROGRESS"
      );
    }
    if (activeFilter === "Resolved") {
      return r.status === "RESOLVED";
    }
    return true;
  });

  return (
    <CitizenLayout hideNavigation={Boolean(selectedReport)}>
      {/* Mobile View */}
      <div className="lg:hidden">
        <section className="px-5 pt-5">
          <div className="flex items-center justify-between mb-3">
            <h1 className="text-xl font-extrabold text-gray-900">My Reports</h1>
            <span className="text-xs font-bold text-red-600 font-mono">
              {complaints.length} Total
            </span>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-bold transition-colors ${
                  activeFilter === filter
                    ? "bg-red-600 text-white shadow-xs"
                    : "bg-gray-100 text-gray-600 hover:bg-red-50 hover:text-red-600"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </section>

        <main className="space-y-3.5 px-5 pt-3 pb-16">
          {filteredReports.length > 0 ? (
            filteredReports.map((report) => (
              <ReportCard
                key={report.id}
                report={report}
                onSelect={() => setSelectedReport(report)}
              />
            ))
          ) : (
            <p className="py-12 text-center text-xs text-gray-400">
              No reports found for &ldquo;{activeFilter}&rdquo;.
            </p>
          )}
        </main>
      </div>

      {/* Desktop View */}
      <div className="hidden lg:block">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">
              My Community Reports
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Track the 3-tier status &amp; updates of your submitted reports across Barangay and LGU levels.
            </p>
          </div>

          <Link
            to="/report-issue"
            className="rounded-2xl bg-red-600 px-5 py-3 text-xs font-extrabold text-white hover:bg-red-700 shadow-sm transition"
          >
            Submit New Report
          </Link>
        </header>

        <section className="mt-8 rounded-3xl bg-white p-6 shadow-xs border border-zinc-100">
          <div className="mb-5 flex flex-wrap gap-2">
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`rounded-full px-4 py-2 text-xs font-bold transition-colors ${
                  activeFilter === filter
                    ? "bg-red-600 text-white shadow-xs"
                    : "bg-gray-100 text-gray-600 hover:bg-red-50 hover:text-red-600"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          <div className="grid gap-3.5">
            {filteredReports.length > 0 ? (
              filteredReports.map((report) => (
                <DesktopReportCard
                  key={report.id}
                  report={report}
                  onSelect={() => setSelectedReport(report)}
                />
              ))
            ) : (
              <p className="py-12 text-center text-sm text-gray-400">
                No reports found for &ldquo;{activeFilter}&rdquo;.
              </p>
            )}
          </div>
        </section>
      </div>

      {selectedReport && (
        <ReportDetailModal
          report={selectedReport}
          onClose={() => setSelectedReport(null)}
          onInfoSubmitted={() => {
            const updated = getStoredComplaints().find((c) => c.id === selectedReport.id);
            if (updated) setSelectedReport(updated);
          }}
        />
      )}
    </CitizenLayout>
  );
}

function ReportCard({ report, onSelect }) {
  return (
    <button
      onClick={onSelect}
      className="w-full rounded-2xl bg-white p-3.5 text-left shadow-xs border border-zinc-100 transition hover:border-red-200 active:scale-98"
    >
      <div className="flex gap-3">
        <img
          src={report.image}
          alt={report.title}
          className="h-20 w-20 rounded-xl object-cover shrink-0"
        />

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-1.5">
            <h2 className="line-clamp-1 text-xs font-extrabold text-gray-900">
              {report.title}
            </h2>
            <StatusBadge status={report.status} />
          </div>

          <p className="font-mono text-[10px] font-bold text-red-700 mt-0.5">
            {report.id}
          </p>

          <div className="mt-1 flex items-center gap-1 text-[11px] text-gray-500">
            <MapPin size={11} className="text-red-600 shrink-0" />
            <span className="line-clamp-1">{report.barangay || report.location}</span>
          </div>

          <p className="mt-1.5 text-[10px] text-gray-400">
            Updated: {report.submittedAt}
          </p>
        </div>
      </div>
    </button>
  );
}

function DesktopReportCard({ report, onSelect }) {
  return (
    <div
      onClick={onSelect}
      className="flex cursor-pointer items-center gap-5 rounded-2xl border border-gray-100 bg-white p-4 transition hover:border-red-200 hover:bg-red-50/20"
    >
      <img
        src={report.image}
        alt={report.title}
        className="h-20 w-28 rounded-xl object-cover shrink-0"
      />

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2.5">
          <h2 className="text-base font-extrabold text-gray-900">
            {report.title}
          </h2>
          <StatusBadge status={report.status} />
        </div>

        <p className="font-mono text-xs font-bold text-red-700 mt-0.5">{report.id}</p>

        <div className="mt-1.5 flex items-center gap-1 text-xs text-gray-500">
          <MapPin size={13} className="text-red-600" />
          <span>{report.barangay} · {report.location}</span>
        </div>

        <p className="mt-1 text-[11px] text-gray-400">
          Submitted: {report.submittedAt}
        </p>
      </div>

      <div className="text-right">
        <p className="text-[10px] font-bold uppercase tracking-wide text-gray-400">
          Tier 1 Receiver
        </p>
        <p className="text-xs font-extrabold text-zinc-900">{report.barangay}</p>

        <span
          onClick={onSelect}
          className="mt-3 inline-flex cursor-pointer items-center gap-1.5 rounded-xl bg-red-600 px-3.5 py-1.5 text-xs font-bold text-white transition hover:bg-red-700"
        >
          Track Progress
        </span>
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const styles = {
    "BARANGAY REVIEW": "bg-amber-100 text-amber-800",
    SUBMITTED: "bg-zinc-100 text-zinc-700",
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
      className={`shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-extrabold ${
        styles[status] || "bg-gray-100 text-gray-700"
      }`}
    >
      {status}
    </span>
  );
}

function ReportDetailModal({ report, onClose, onInfoSubmitted }) {
  const [residentText, setResidentText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const handleInfoSubmit = (e) => {
    e.preventDefault();
    if (!residentText.trim()) return;
    setSubmitting(true);
    setTimeout(() => {
      residentSubmitAdditionalInfo(report.id, { responseText: residentText.trim() });
      setSubmitting(false);
      setResidentText("");
      if (onInfoSubmitted) onInfoSubmitted();
    }, 600);
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-end justify-center bg-zinc-950/60 backdrop-blur-xs sm:items-center sm:p-6 animate-in fade-in"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-t-3xl bg-white p-6 shadow-2xl sm:rounded-3xl animate-in zoom-in-95"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
          <div className="flex items-center gap-2">
            <StatusBadge status={report.status} />
            <span className="font-mono text-xs font-bold text-red-700">
              {report.id}
            </span>
          </div>

          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-100 text-gray-400 hover:text-gray-600"
          >
            <X size={16} />
          </button>
        </div>

        <h2 className="mt-3 text-base font-extrabold text-gray-900 leading-snug">
          {report.title}
        </h2>

        <div className="mt-1 flex items-center gap-1 text-xs text-gray-500">
          <MapPin size={13} className="text-red-600" />
          <span>{report.barangay} · {report.location}</span>
        </div>

        <p className="mt-3 text-xs leading-relaxed text-gray-600 bg-zinc-50 p-3 rounded-xl border border-zinc-100">
          {report.description}
        </p>

        {report.image && (
          <img
            src={report.image}
            alt={report.title}
            className="mt-3.5 h-40 w-full rounded-2xl object-cover border border-zinc-200"
          />
        )}

        {/* Action needed if status === INFORMATION REQUIRED */}
        {report.status === "INFORMATION REQUIRED" && (
          <div className="mt-4 rounded-2xl border border-amber-300 bg-amber-50 p-4 text-xs">
            <div className="flex items-center gap-2 font-bold text-amber-900 mb-1">
              <HelpCircle size={15} className="text-amber-700" />
              <span>Barangay Requested Additional Information</span>
            </div>
            <p className="text-zinc-700 mt-1 leading-relaxed">
              &ldquo;{report.infoRequest?.messageToResident || "Please provide clearer landmark details."}&rdquo;
            </p>

            <form onSubmit={handleInfoSubmit} className="mt-3 space-y-2">
              <textarea
                rows={2}
                required
                value={residentText}
                onChange={(e) => setResidentText(e.target.value)}
                placeholder="Type your response or additional location details here..."
                className="w-full rounded-xl border border-amber-300 bg-white p-2.5 text-xs text-zinc-900 outline-none focus:border-red-600 resize-none"
              />
              <button
                type="submit"
                disabled={submitting}
                className="flex items-center gap-1.5 rounded-xl bg-amber-600 px-4 py-2 text-xs font-extrabold text-white hover:bg-amber-700 transition"
              >
                <Send size={13} />
                {submitting ? "Sending..." : "Submit to Barangay"}
              </button>
            </form>
          </div>
        )}

        {/* Complete Live 3-Tier Timeline Tracking */}
        <div className="mt-5 border-t border-zinc-100 pt-4">
          <div className="flex items-center justify-between mb-3">
            <p className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400">
              Live Multi-Tier Timeline
            </p>
            <span className="text-[10px] font-mono text-zinc-400">
              Resident → Barangay → LGU
            </span>
          </div>

          <div className="space-y-3">
            {report.timeline?.map((step, index) => {
              const isEscalated = step.step.toLowerCase().includes("escalat");
              const isResolved = step.step.toLowerCase().includes("resolved");
              const isWarning = step.step.toLowerCase().includes("unable");

              return (
                <div key={index} className="flex items-start gap-2.5 text-xs">
                  <span
                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold mt-0.5 ${
                      isResolved
                        ? "bg-emerald-100 text-emerald-700"
                        : isEscalated
                        ? "bg-red-100 text-red-700"
                        : isWarning
                        ? "bg-amber-100 text-amber-700"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {isResolved ? (
                      <Check size={11} />
                    ) : isEscalated ? (
                      <Share2 size={10} />
                    ) : (
                      <Check size={10} />
                    )}
                  </span>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1">
                      <p className="font-extrabold text-gray-900">{step.step}</p>
                      <span className="font-mono text-[10px] text-gray-400">
                        {step.time}
                      </span>
                    </div>
                    {step.note && (
                      <p className="text-[11px] text-gray-600 mt-0.5 leading-snug">
                        {step.note}
                      </p>
                    )}
                    {step.actor && (
                      <p className="text-[10px] text-zinc-400 font-mono mt-0.5">
                        By: {step.actor}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
