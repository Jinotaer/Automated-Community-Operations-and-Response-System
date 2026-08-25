// src/Citizen/Reports.jsx
import { useEffect, useState } from "react";
import { MapPin, Clock3, X, Check } from "lucide-react";
import CitizenLayout from "../Layouts/CitizenLayouts";
import pothole from "../assets/national-highway.jpg";
import outage from "../assets/outage.jpg";
import light from "../assets/light.jpg";

const reports = [
  {
    id: "MBY-2024-00123",
    title: "Large pothole along National Highway",
    location: "Casisang, Malaybalay City",
    updated: "June 8, 2025 · 10:30 AM",
    status: "In Progress",
    category: "Road Damage",
    image: pothole,
    description:
      "A large pothole along the national highway in Casisang is forcing vehicles to slow down and swerve. City Engineering has marked the area for patching.",
    timeline: [
      { label: "Report submitted", time: "June 5, 2025 · 9:05 AM" },
      { label: "Received by City Hall", time: "June 5, 2025 · 9:20 AM" },
      { label: "Assigned to City Engineering", time: "June 6, 2025 · 1:00 PM" },
      { label: "Patching in progress", time: "" },
    ],
  },
  {
    id: "MBY-2024-00120",
    title: "Garbage accumulation near the river",
    location: "Sumpong, Malaybalay City",
    updated: "June 7, 2025 · 2:15 PM",
    status: "Under Review",
    category: "Garbage and Waste",
    image: outage,
    description:
      "Garbage has been accumulating near the river in Sumpong. The City Environment Office is reviewing the schedule for a cleanup run.",
    timeline: [
      { label: "Report submitted", time: "June 5, 2025 · 7:30 AM" },
      { label: "Received by City Hall", time: "June 5, 2025 · 7:45 AM" },
      { label: "Under LGU review", time: "" },
    ],
  },
  {
    id: "MBY-2024-00115",
    title: "Broken streetlight in front of school",
    location: "Kalasungay, Malaybalay City",
    updated: "June 6, 2025 · 8:45 AM",
    status: "Resolved",
    category: "Street Lights",
    image: light,
    description:
      "The streetlight in front of the school in Kalasungay was repaired and is now working normally for the evening pedestrian route.",
    timeline: [
      { label: "Report submitted", time: "June 2, 2025 · 6:10 PM" },
      { label: "Received by City Hall", time: "June 2, 2025 · 6:25 PM" },
      { label: "Assigned to City Engineering", time: "June 3, 2025 · 8:00 AM" },
      { label: "Repairs completed", time: "June 6, 2025 · 7:50 AM" },
      { label: "Marked resolved", time: "June 6, 2025 · 8:45 AM" },
    ],
  },
];

const filters = ["All", "Pending", "In Progress", "Resolved", "Closed"];

export default function MyReports() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [selectedReport, setSelectedReport] = useState(null);

  const filteredReports =
    activeFilter === "All"
      ? reports
      : reports.filter((r) => r.status === activeFilter);

  return (
    <CitizenLayout hideNavigation={Boolean(selectedReport)}>
      {/* Mobile View */}
      <div className="lg:hidden">
        <section className="px-5 pt-5">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`shrink-0 rounded-full px-4 py-2 text-xs font-bold transition-colors ${
                  activeFilter === filter
                    ? "bg-red-600 text-white"
                    : "bg-gray-100 text-gray-500 hover:bg-red-50 hover:text-red-600"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </section>

        <main className="space-y-4 px-5 pt-3">
          {filteredReports.length > 0 ? (
            filteredReports.map((report) => (
              <ReportCard
                key={report.id}
                report={report}
                onSelect={() => setSelectedReport(report)}
              />
            ))
          ) : (
            <p className="py-10 text-center text-sm text-gray-400">
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
              My Reports
            </h1>
            <p className="mt-1 text-gray-500">
              Track the status and updates of your submitted reports.
            </p>
          </div>

          <button className="rounded-2xl bg-red-600 px-5 py-3 text-sm font-semibold text-white hover:bg-red-700">
            Submit New Report
          </button>
        </header>

        <section className="mt-8 rounded-3xl bg-white p-6 shadow-sm">
          <div className="mb-5 flex flex-wrap gap-2">
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`rounded-full px-5 py-2 text-sm font-bold transition-colors ${
                  activeFilter === filter
                    ? "bg-red-600 text-white"
                    : "bg-gray-100 text-gray-500 hover:bg-red-50 hover:text-red-600"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          <div className="grid gap-4">
            {filteredReports.length > 0 ? (
              filteredReports.map((report) => (
                <DesktopReportCard
                  key={report.id}
                  report={report}
                  onSelect={() => setSelectedReport(report)}
                />
              ))
            ) : (
              <p className="py-10 text-center text-sm text-gray-400">
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
        />
      )}
    </CitizenLayout>
  );
}

function ReportCard({ report, onSelect }) {
  return (
    <button
      onClick={onSelect}
      className="w-full rounded-2xl bg-white p-3 text-left shadow-sm transition hover:scale-[1.01]"
    >
      <div className="flex gap-3">
        <img
          src={report.image}
          alt={report.title}
          className="h-24 w-24 rounded-xl object-cover"
        />

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <h2 className="line-clamp-2 text-sm font-extrabold leading-snug text-gray-900">
              {report.title}
            </h2>

            <StatusBadge status={report.status} />
          </div>

          <p className="mt-1 text-[11px] font-medium text-gray-400">
            #{report.id}
          </p>

          <div className="mt-1 flex items-center gap-1 text-[11px] font-medium text-gray-500">
            <MapPin size={12} />
            <span className="line-clamp-1">{report.location}</span>
          </div>

          <p className="mt-2 text-[11px] text-gray-400">
            Updated: {report.updated}
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
      className="flex cursor-pointer items-center gap-5 rounded-2xl border border-gray-100 bg-white p-4 transition hover:border-red-200 hover:bg-red-50/30"
    >
      <img
        src={report.image}
        alt={report.title}
        className="h-24 w-32 rounded-2xl object-cover"
      />

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-extrabold text-gray-900">
            {report.title}
          </h2>
          <StatusBadge status={report.status} />
        </div>

        <p className="mt-1 text-sm text-gray-400">#{report.id}</p>

        <div className="mt-2 flex items-center gap-1 text-sm text-gray-500">
          <MapPin size={15} />
          <span>{report.location}</span>
        </div>

        <p className="mt-2 text-sm text-gray-400">
          Updated: {report.updated}
        </p>
      </div>

      <div className="text-right">
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
          Category
        </p>
        <p className="mt-1 font-bold text-gray-800">{report.category}</p>

        <span
          onClick={onSelect}
          className="mt-4 inline-flex cursor-pointer items-center gap-2 rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
        >
          View Details
        </span>
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const styles = {
    "In Progress": "bg-yellow-100 text-yellow-700",
    "Under Review": "bg-blue-100 text-blue-700",
    Resolved: "bg-red-100 text-red-600",
    Pending: "bg-gray-100 text-gray-600",
    Closed: "bg-gray-200 text-gray-700",
  };

  return (
    <span
      className={`shrink-0 rounded-full px-3 py-1 text-[10px] font-extrabold ${
        styles[status] || "bg-gray-100 text-gray-600"
      }`}
    >
      {status}
    </span>
  );
}

function ReportDetailModal({ report, onClose }) {
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

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-end justify-center bg-zinc-950/60 backdrop-blur-sm animate-fade-in sm:items-center sm:p-6"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg rounded-t-3xl bg-white p-6 shadow-2xl sm:rounded-3xl animate-modal-in"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <StatusBadge status={report.status} />
            <span className="font-mono text-xs text-gray-400">#{report.id}</span>
          </div>

          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-100 text-gray-400 hover:text-gray-600"
          >
            <X size={16} />
          </button>
        </div>

        <h2 className="mt-3 text-lg font-extrabold text-gray-900">
          {report.title}
        </h2>

        <div className="mt-1 flex items-center gap-1 text-xs text-gray-500">
          <MapPin size={13} />
          <span>{report.location}</span>
        </div>

        <p className="mt-3 text-xs leading-5 text-gray-600">
          {report.description}
        </p>

        {report.image && (
          <img
            src={report.image}
            alt={report.title}
            className="mt-4 h-44 w-full rounded-2xl object-cover"
          />
        )}

        <div className="mt-4 space-y-2 border-t border-zinc-100 pt-3">
          <p className="text-[11px] font-extrabold uppercase tracking-wider text-gray-400">
            Timeline
          </p>
          {report.timeline.map((step, index) => (
            <div key={index} className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-red-100 text-[10px] font-bold text-red-600">
                  <Check size={10} />
                </span>
                <span className="font-medium text-gray-700">{step.label}</span>
              </div>
              <span className="font-mono text-[11px] text-gray-400">{step.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
