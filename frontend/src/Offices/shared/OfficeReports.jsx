// src/Offices/shared/OfficeReports.jsx
import { useState, useEffect } from "react";
import {
  Search,
  ChevronDown,
  MoreHorizontal,
  CheckCircle,
  XCircle,
  MapPin,
  Download,
  AlertTriangle,
  Building,
  Share2,
  Filter,
} from "lucide-react";
import OfficeLayout from "../OfficeLayout";
import { getStoredComplaints, lguResolveComplaint, lguAcceptComplaint } from "../../services/complaintsStore";

const statuses = [
  "All Statuses",
  "Barangay Escalated",
  "Pending",
  "Under Review",
  "Assigned",
  "In Progress",
  "Resolved",
];

const barangaysList = [
  "All Barangays",
  "Barangay Casisang",
  "Barangay Sumpong",
  "Barangay Kalasungay",
  "Barangay Aglayan",
  "Barangay Bangcud",
  "Barangay Managok",
];

export default function OfficeReports({ office }) {
  const [reports, setReports] = useState(office.recentReports);
  const [selectedReport, setSelectedReport] = useState(reports[0]);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Statuses");
  const [categoryFilter, setCategoryFilter] = useState("All Categories");
  const [barangayFilter, setBarangayFilter] = useState("All Barangays");
  const [escalatedOnly, setEscalatedOnly] = useState(false);

  useEffect(() => {
    // Merge store complaints routed to this office
    const storeComplaints = getStoredComplaints().filter(
      (c) =>
        c.escalation?.recommendedOffice?.toLowerCase().includes(office.shortName.toLowerCase()) ||
        c.aiAnalysis?.suggestedLguOffice?.toLowerCase().includes(office.shortName.toLowerCase()) ||
        c.department?.toLowerCase().includes(office.shortName.toLowerCase()) ||
        (office.slug === "engineering" && (c.category?.toLowerCase().includes("road") || c.category?.toLowerCase().includes("pothole") || c.category?.toLowerCase().includes("infrastructure"))) ||
        (office.slug === "cenro" && (c.category?.toLowerCase().includes("garbage") || c.category?.toLowerCase().includes("dumping") || c.category?.toLowerCase().includes("waste"))) ||
        (office.slug === "cdrrmo" && (c.category?.toLowerCase().includes("flood") || c.category?.toLowerCase().includes("disaster") || c.category?.toLowerCase().includes("tree"))) ||
        (office.slug === "traffic" && c.category?.toLowerCase().includes("traffic")) ||
        (office.slug === "health" && c.category?.toLowerCase().includes("health"))
    );

    const formattedStore = storeComplaints.map((c) => ({
      id: c.id,
      issue: c.title,
      description: c.description,
      location: c.location,
      barangay: c.barangay,
      category: c.category,
      priority: c.priority,
      status: c.status,
      reported: c.submittedAt,
      image: c.image,
      escalation: c.escalation,
      isEscalated: Boolean(c.escalation || c.status?.includes("ESCALATED")),
    }));

    // Combine with office defaults avoiding duplicates
    const combined = [
      ...formattedStore,
      ...office.recentReports
        .filter((r) => !formattedStore.some((fs) => fs.id === r.id))
        .map((r) => ({
          ...r,
          isEscalated: r.id.includes("125") || r.status?.includes("Escalated"),
        })),
    ];

    setReports(combined);
    if (!selectedReport && combined.length > 0) setSelectedReport(combined[0]);
  }, [office]);

  const normalizedQuery = query.trim().toLowerCase();

  const escalatedCount = reports.filter((r) => r.isEscalated || r.escalation).length;

  const filteredReports = reports.filter((report) => {
    const matchesQuery =
      normalizedQuery === "" ||
      [
        report.id,
        report.title,
        report.issue,
        report.description,
        report.location,
        report.barangay,
        report.category,
        report.escalation?.reason,
      ]
        .filter(Boolean)
        .some((field) => field.toLowerCase().includes(normalizedQuery));

    let matchesStatus = true;
    if (escalatedOnly || statusFilter === "Barangay Escalated") {
      matchesStatus = Boolean(report.isEscalated || report.escalation);
    } else if (statusFilter === "Pending") {
      matchesStatus = report.status === "Pending" || report.status === "BARANGAY REVIEW" || report.status === "SUBMITTED";
    } else if (statusFilter === "In Progress") {
      matchesStatus = report.status === "In Progress" || report.status === "LGU IN PROGRESS" || report.status === "LGU ACCEPTED";
    } else if (statusFilter === "Resolved") {
      matchesStatus = report.status === "Resolved" || report.status === "RESOLVED";
    } else if (statusFilter !== "All Statuses") {
      matchesStatus = report.status === statusFilter;
    }

    const matchesCategory =
      categoryFilter === "All Categories" ||
      report.category === categoryFilter;

    const matchesBarangay =
      barangayFilter === "All Barangays" ||
      report.barangay?.toLowerCase().includes(barangayFilter.toLowerCase()) ||
      barangayFilter.toLowerCase().includes(report.barangay?.toLowerCase());

    return matchesQuery && matchesStatus && matchesCategory && matchesBarangay;
  });

  const selectedIsVisible =
    selectedReport &&
    filteredReports.some((report) => report.id === selectedReport.id);
  const visibleReport = selectedIsVisible
    ? selectedReport
    : filteredReports[0] || null;

  const handleResolve = () => {
    if (!visibleReport) return;
    lguResolveComplaint(visibleReport.id, {
      resolutionDescription: `Resolved by ${office.name}.`,
      staffName: `${office.shortName} Operations Team`,
    });
    setReports((prev) =>
      prev.map((report) =>
        report.id === visibleReport.id
          ? { ...report, status: "Resolved" }
          : report
      )
    );
    setSelectedReport((current) =>
      current ? { ...current, status: "Resolved" } : current
    );
  };

  const handleAcceptEscalation = () => {
    if (!visibleReport) return;
    lguAcceptComplaint(visibleReport.id, `${office.shortName} Lead Engineer`);
    setReports((prev) =>
      prev.map((report) =>
        report.id === visibleReport.id
          ? { ...report, status: "LGU ACCEPTED" }
          : report
      )
    );
    setSelectedReport((current) =>
      current ? { ...current, status: "LGU ACCEPTED" } : current
    );
  };

  const handleReject = () => {
    if (!visibleReport) return;
    setReports((prev) =>
      prev.map((report) =>
        report.id === visibleReport.id
          ? { ...report, status: "Rejected" }
          : report
      )
    );
    setSelectedReport((current) =>
      current ? { ...current, status: "Rejected" } : current
    );
  };

  const clearFilters = () => {
    setQuery("");
    setStatusFilter("All Statuses");
    setCategoryFilter("All Categories");
    setBarangayFilter("All Barangays");
    setEscalatedOnly(false);
  };

  return (
    <OfficeLayout office={office} header={`${office.shortName} Reports`}>
      <div className="space-y-4 sm:space-y-6">
        {/* Header */}
        <header className="flex animate-fade-up flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.22em] text-gray-500">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-600 opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-red-600" />
              </span>
              Malaybalay · {office.name}
            </p>
            <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">
              Department Reports Management
            </h1>
          </div>

          <div className="flex flex-col gap-3 sm:items-end">
            <p className="font-mono text-[11px] font-medium tracking-wide text-gray-500">
              <span className="font-bold text-gray-900">{reports.length}</span>{" "}
              ACTIVE REPORTS · {escalatedCount} ESCALATED FROM BARANGAYS
            </p>

            <button className="flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-bold text-gray-700 transition hover:bg-gray-50 active:translate-y-px sm:w-auto">
              <Download size={17} />
              Export
            </button>
          </div>
        </header>

        {/* Quick Filter Tabs: All vs Barangay Escalated */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => {
              setEscalatedOnly(false);
              setStatusFilter("All Statuses");
            }}
            className={`rounded-2xl px-4 py-2 text-xs font-extrabold transition ${
              !escalatedOnly && statusFilter !== "Barangay Escalated"
                ? "bg-red-700 text-white shadow-xs"
                : "bg-white text-zinc-600 border border-zinc-200 hover:bg-zinc-50"
            }`}
          >
            All Office Reports ({reports.length})
          </button>

          <button
            onClick={() => {
              setEscalatedOnly(true);
              setStatusFilter("Barangay Escalated");
            }}
            className={`relative rounded-2xl px-4 py-2 text-xs font-extrabold transition flex items-center gap-2 ${
              escalatedOnly || statusFilter === "Barangay Escalated"
                ? "bg-red-700 text-white shadow-xs"
                : "bg-white text-zinc-700 border border-red-200 hover:bg-red-50/60"
            }`}
          >
            <Share2 size={13} className={escalatedOnly ? "text-white" : "text-red-700"} />
            <span>Barangay Escalations</span>
            <span
              className={`rounded-full px-2 py-0.5 text-[10px] font-mono font-bold ${
                escalatedOnly ? "bg-white text-red-700" : "bg-red-100 text-red-700"
              }`}
            >
              {escalatedCount}
            </span>
          </button>
        </div>

        {/* Filters Band */}
        <section
          className="animate-fade-up rounded-2xl border border-gray-200/70 bg-white p-4 shadow-sm sm:p-5"
          style={{ animationDelay: "40ms" }}
        >
          <div className="grid gap-3 lg:grid-cols-[1fr_auto_auto_auto]">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search issue, location, barangay, escalation reason..."
                className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 pl-11 pr-4 text-xs font-semibold outline-none transition placeholder:text-gray-400 focus:border-red-700 focus:bg-white"
              />
            </div>

            {/* Filter by Barangay */}
            <SelectFilter
              label="Barangay"
              value={barangayFilter}
              onChange={setBarangayFilter}
              options={barangaysList}
            />

            {/* Filter by Status */}
            <SelectFilter
              label="Status"
              value={statusFilter}
              onChange={(val) => {
                setStatusFilter(val);
                if (val === "Barangay Escalated") setEscalatedOnly(true);
                else setEscalatedOnly(false);
              }}
              options={statuses}
            />

            {/* Filter by Category */}
            <SelectFilter
              label="Category"
              value={categoryFilter}
              onChange={setCategoryFilter}
              options={["All Categories", ...office.categories]}
            />
          </div>
        </section>

        {/* Main Content */}
        <section className="grid gap-6 xl:grid-cols-12">
          {/* Reports Table */}
          <div
            className="animate-fade-up rounded-3xl border border-gray-200/70 bg-white p-4 shadow-sm sm:p-5 xl:col-span-8"
            style={{ animationDelay: "80ms" }}
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-base font-extrabold text-gray-900">
                  {escalatedOnly ? "Escalated from Barangay Level" : `Assigned Reports — ${office.name}`}
                </h2>
                <p className="text-xs text-gray-500">
                  {escalatedOnly
                    ? "Complaints where Barangay requested heavy equipment or specialized LGU support."
                    : `Reports routed or escalated to ${office.name}.`}
                </p>
              </div>

              <p className="font-mono text-[11px] font-medium text-gray-500">
                {filteredReports.length} OF {reports.length}
              </p>
            </div>

            <div className="mt-5 overflow-x-auto">
              <table className="w-full min-w-176 text-left text-sm">
                <thead>
                  <tr className="border-b border-gray-200 text-[10px] uppercase tracking-wider text-gray-400">
                    <th className="px-3 py-3 font-semibold">Report</th>
                    <th className="px-3 py-3 font-semibold">Barangay (Tier 1)</th>
                    <th className="px-3 py-3 font-semibold">Category</th>
                    <th className="px-3 py-3 font-semibold">Priority</th>
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
                    />
                  ))}

                  {filteredReports.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-3 py-14 text-center">
                        <p className="font-mono text-xs font-medium uppercase tracking-[0.18em] text-gray-500">
                          No reports match your filters
                        </p>
                        <button
                          onClick={clearFilters}
                          className="mt-4 rounded-xl border border-gray-200 bg-white px-4 py-2 text-xs font-bold text-gray-700 transition hover:bg-gray-50 active:translate-y-px"
                        >
                          Clear Filters
                        </button>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Report Details Panel */}
          <aside
            className="animate-fade-up rounded-3xl border border-gray-200/70 bg-white p-4 shadow-sm sm:p-5 xl:col-span-4"
            style={{ animationDelay: "140ms" }}
          >
            <div className="flex items-center justify-between">
              <h2 className="text-base font-extrabold text-gray-900">
                Report Details
              </h2>
              <button className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-700">
                <MoreHorizontal size={18} />
              </button>
            </div>

            {visibleReport ? (
              <div className="mt-4">
                <div className="relative">
                  <img
                    src={visibleReport.image}
                    alt={visibleReport.issue || visibleReport.title}
                    className="h-40 w-full rounded-2xl object-cover"
                  />
                  <span className="absolute left-3 top-3 rounded-lg bg-white/90 px-2.5 py-1 font-mono text-[11px] font-bold text-gray-700 shadow-sm backdrop-blur">
                    {visibleReport.id}
                  </span>
                </div>

                <div className="mt-4 space-y-3.5 text-xs">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wide text-gray-400">
                      Issue Title
                    </span>
                    <h3 className="mt-0.5 text-base font-extrabold text-gray-900">
                      {visibleReport.issue || visibleReport.title}
                    </h3>
                    <p className="mt-1.5 leading-relaxed text-gray-600 bg-gray-50 p-2.5 rounded-xl border border-gray-100">
                      {visibleReport.description}
                    </p>
                  </div>

                  {/* Barangay Escalation Information Card */}
                  {visibleReport.escalation ? (
                    <div className="rounded-2xl border border-red-300 bg-red-50 p-3.5 text-zinc-800 space-y-1.5 shadow-2xs">
                      <div className="flex items-center gap-1.5 font-extrabold text-red-800 text-xs">
                        <Share2 size={14} />
                        <span>Escalated by {visibleReport.barangay}</span>
                      </div>
                      <p>
                        <span className="font-bold">Reason:</span> {visibleReport.escalation.reason}
                      </p>
                      <p>
                        <span className="font-bold">Barangay Assessment:</span> &ldquo;{visibleReport.escalation.barangayAssessment}&rdquo;
                      </p>
                      <p className="text-[10px] text-zinc-500 font-mono">
                        Escalated: {visibleReport.escalation.escalatedAt} by {visibleReport.escalation.escalatedBy}
                      </p>
                    </div>
                  ) : (
                    <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-2.5 text-zinc-600 flex items-center gap-2">
                      <Building size={14} className="text-zinc-500" />
                      <span>Origin: {visibleReport.barangay || "Malaybalay City"}</span>
                    </div>
                  )}

                  <div className="flex items-start gap-2.5 rounded-xl bg-gray-50 p-3">
                    <MapPin size={16} className="mt-0.5 shrink-0 text-red-700" />
                    <div>
                      <p className="font-bold text-gray-900">
                        {visibleReport.location}
                      </p>
                      <p className="text-[11px] text-gray-500">
                        {visibleReport.barangay}, Malaybalay City
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <InfoBox label="Category">
                      <p className="font-bold text-gray-800">
                        {visibleReport.category}
                      </p>
                    </InfoBox>

                    <InfoBox label="Priority">
                      <PriorityBadge priority={visibleReport.priority} />
                    </InfoBox>

                    <InfoBox label="Status">
                      <StatusBadge status={visibleReport.status} />
                    </InfoBox>

                    <InfoBox label="Reported On">
                      <p className="font-mono text-[11px] font-bold text-gray-800">
                        {visibleReport.reported}
                      </p>
                    </InfoBox>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-2">
                    {visibleReport.escalation && visibleReport.status === "ESCALATED TO LGU" ? (
                      <button
                        onClick={handleAcceptEscalation}
                        className="col-span-2 flex items-center justify-center gap-2 rounded-xl bg-red-700 py-3 text-xs font-bold text-white shadow-sm hover:bg-red-800 active:scale-95 transition"
                      >
                        <CheckCircle size={15} />
                        Accept Barangay Escalation
                      </button>
                    ) : (
                      <button
                        onClick={handleResolve}
                        disabled={visibleReport.status === "Resolved"}
                        className="flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 px-3 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-emerald-700 active:scale-95 transition disabled:opacity-50"
                      >
                        <CheckCircle size={15} />
                        Resolve (LGU)
                      </button>
                    )}

                    <button
                      onClick={handleReject}
                      disabled={visibleReport.status === "Rejected"}
                      className="flex items-center justify-center gap-1.5 rounded-xl bg-red-50 px-3 py-2.5 text-xs font-bold text-red-700 hover:bg-red-100 active:scale-95 transition disabled:opacity-50"
                    >
                      <XCircle size={15} />
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-14 text-center">
                <p className="font-mono text-xs font-medium uppercase tracking-[0.18em] text-gray-500">
                  Select a report
                </p>
              </div>
            )}
          </aside>
        </section>
      </div>
    </OfficeLayout>
  );
}

function SelectFilter({ label, value, onChange, options }) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        aria-label={label}
        className="h-11 w-full min-w-0 appearance-none rounded-xl border border-gray-200 bg-white pl-3.5 pr-9 text-xs font-bold text-gray-700 outline-none hover:bg-gray-50 focus:border-red-700 sm:min-w-40"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <ChevronDown
        size={14}
        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
      />
    </div>
  );
}

function ReportRow({ report, selected, onClick }) {
  return (
    <tr
      onClick={onClick}
      className={`cursor-pointer transition ${
        selected ? "bg-red-50/70 font-semibold" : "hover:bg-gray-50/60"
      }`}
    >
      <td className="px-3 py-3">
        <div className="flex items-center gap-2.5">
          <img
            src={report.image}
            alt={report.issue || report.title}
            className="h-10 w-10 rounded-lg object-cover"
          />
          <div className="min-w-0 max-w-64">
            <p className="truncate text-xs font-bold text-gray-900">
              {report.issue || report.title}
            </p>
            <p className="mt-0.5 font-mono text-[10px] font-medium text-gray-400">
              {report.reported}
            </p>
          </div>
        </div>
      </td>

      <td className="px-3 py-3">
        <div className="flex items-center gap-1 text-red-700 font-bold text-xs">
          <span>{report.barangay}</span>
          {report.isEscalated && (
            <span className="rounded-full bg-red-100 px-1.5 py-0.2 text-[9px] font-extrabold text-red-800">
              Escalated
            </span>
          )}
        </div>
        <p className="mt-0.5 text-[10px] text-gray-400 truncate">{report.location}</p>
      </td>

      <td className="px-3 py-3">
        <span className="rounded-md bg-gray-100 px-2 py-0.5 text-[10px] font-bold text-gray-700">
          {report.category}
        </span>
      </td>

      <td className="px-3 py-3">
        <PriorityBadge priority={report.priority} />
      </td>

      <td className="px-3 py-3">
        <StatusBadge status={report.status} />
      </td>

      <td className="px-3 py-3 text-right pr-3">
        <button className="rounded-xl border border-gray-200 bg-white px-2.5 py-1 text-xs font-bold text-gray-700 hover:bg-red-50 hover:text-red-700">
          View
        </button>
      </td>
    </tr>
  );
}

function PriorityBadge({ priority = "Medium" }) {
  const styles = {
    Critical: { dot: "bg-red-700", text: "text-red-700" },
    High: { dot: "bg-red-500", text: "text-red-600" },
    Medium: { dot: "bg-amber-500", text: "text-amber-700" },
    Low: { dot: "bg-gray-400", text: "text-gray-500" },
  };

  const style = styles[priority] || styles.Medium;

  return (
    <span
      className={`inline-flex items-center gap-1.5 text-xs font-semibold ${style.text}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} />
      {priority}
    </span>
  );
}

function StatusBadge({ status }) {
  const styles = {
    Pending: { dot: "bg-gray-400", text: "text-gray-500" },
    "Under Review": { dot: "bg-amber-500", text: "text-amber-700" },
    Assigned: { dot: "bg-sky-600", text: "text-sky-700" },
    "In Progress": { dot: "bg-red-600", text: "text-red-700" },
    "LGU IN PROGRESS": { dot: "bg-sky-600", text: "text-sky-700" },
    "LGU ACCEPTED": { dot: "bg-indigo-600", text: "text-indigo-700" },
    Resolved: { dot: "bg-emerald-600", text: "text-emerald-700" },
    RESOLVED: { dot: "bg-emerald-600", text: "text-emerald-700" },
    Rejected: { dot: "bg-rose-600", text: "text-rose-700" },
    "ESCALATED TO LGU": { dot: "bg-red-600", text: "text-red-700" },
    "BARANGAY REVIEW": { dot: "bg-amber-500", text: "text-amber-700" },
  };

  const style = styles[status] || styles.Pending;

  return (
    <span
      className={`inline-flex items-center gap-1.5 text-xs font-semibold ${style.text}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} />
      {status}
    </span>
  );
}

function InfoBox({ label, children }) {
  return (
    <div className="rounded-xl bg-gray-50 p-2.5">
      <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-gray-400">
        {label}
      </p>
      {children}
    </div>
  );
}