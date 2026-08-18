// src/Offices/shared/OfficeReports.jsx
import { useState } from "react";
import {
  Search,
  ChevronDown,
  MoreHorizontal,
  CheckCircle,
  XCircle,
  MapPin,
  Download,
} from "lucide-react";
import OfficeLayout from "../OfficeLayout";

const statuses = ["All", "Pending", "Under Review", "Assigned", "In Progress", "Resolved"];

export default function OfficeReports({ office }) {
  const [reports, setReports] = useState(office.recentReports);
  const [selectedReport, setSelectedReport] = useState(reports[0]);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All Categories");

  const normalizedQuery = query.trim().toLowerCase();

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
      ]
        .filter(Boolean)
        .some((field) => field.toLowerCase().includes(normalizedQuery));

    const matchesStatus =
      statusFilter === "All" || report.status === statusFilter;
    const matchesCategory =
      categoryFilter === "All Categories" ||
      report.category === categoryFilter;

    return matchesQuery && matchesStatus && matchesCategory;
  });

  const selectedIsVisible =
    selectedReport &&
    filteredReports.some((report) => report.id === selectedReport.id);
  const visibleReport = selectedIsVisible
    ? selectedReport
    : filteredReports[0] || null;

  const handleResolve = () => {
    if (!visibleReport) return;
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
    setStatusFilter("All");
    setCategoryFilter("All Categories");
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
              Reports Management
            </h1>
          </div>

          <div className="flex flex-col gap-3 sm:items-end">
            <p className="font-mono text-[11px] font-medium tracking-wide text-gray-500">
              <span className="font-bold text-gray-900">{reports.length}</span>{" "}
              ACTIVE REPORTS · SYNCED 09:41 AM
            </p>

            <button className="flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-bold text-gray-700 transition hover:bg-gray-50 active:translate-y-px sm:w-auto">
              <Download size={17} />
              Export
            </button>
          </div>
        </header>

        {/* Filters */}
        <section
          className="animate-fade-up rounded-2xl border border-gray-200/70 bg-white p-4 shadow-sm sm:p-5"
          style={{ animationDelay: "40ms" }}
        >
          <div className="grid gap-4 lg:grid-cols-[1fr_auto_auto]">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search issue, location, barangay..."
                className="h-12 w-full rounded-xl border border-gray-200 bg-gray-50 pl-11 pr-4 text-sm outline-none transition placeholder:text-gray-500 focus:border-red-700 focus:ring-1 focus:ring-red-700"
              />
            </div>

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
                <h2 className="text-lg font-extrabold text-gray-900">
                  Assigned Citizen Reports
                </h2>
                <p className="text-sm text-gray-500">
                  Reports routed to {office.name}.
                </p>
              </div>

              <p className="font-mono text-[11px] font-medium text-gray-500">
                {filteredReports.length} OF {reports.length}
              </p>
            </div>

            <div className="mt-5 overflow-x-auto">
              <table className="w-full min-w-176 text-left text-sm">
                <thead>
                  <tr className="border-b border-gray-200 text-[11px] uppercase tracking-wider text-gray-500">
                    <th className="px-3 py-3 text-left font-semibold">Report</th>
                    <th className="px-3 py-3 text-left font-semibold">Location</th>
                    <th className="px-3 py-3 text-left font-semibold">Category</th>
                    <th className="px-3 py-3 text-left font-semibold">Priority</th>
                    <th className="px-3 py-3 text-left font-semibold">Status</th>
                    <th className="px-3 py-3 text-left font-semibold">Action</th>
                  </tr>
                </thead>

                <tbody>
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
              <h2 className="text-lg font-extrabold text-gray-900">
                Report Details
              </h2>
              <button className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-700">
                <MoreHorizontal size={18} />
              </button>
            </div>

            {visibleReport ? (
              <div className="mt-5">
                <div className="relative">
                  <img
                    src={visibleReport.image}
                    alt={visibleReport.issue || visibleReport.title}
                    className="h-44 w-full rounded-2xl object-cover sm:h-48"
                  />
                  <span className="absolute left-3 top-3 rounded-lg bg-white/90 px-2.5 py-1 font-mono text-[11px] font-bold text-gray-700 shadow-sm backdrop-blur">
                    {visibleReport.id}
                  </span>
                </div>

                <div className="mt-5 space-y-4">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-gray-500">
                      Issue
                    </p>
                    <h3 className="mt-1.5 text-base font-extrabold text-gray-900">
                      {visibleReport.issue || visibleReport.title}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-gray-500">
                      {visibleReport.description}
                    </p>
                  </div>

                  <div className="flex items-start gap-3 rounded-2xl bg-gray-50 p-4">
                    <MapPin size={19} className="mt-0.5 shrink-0 text-red-700" />
                    <div>
                      <p className="text-sm font-bold text-gray-900">
                        {visibleReport.location}
                      </p>
                      <p className="text-xs text-gray-500">
                        {visibleReport.barangay}, Malaybalay City
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <InfoBox label="Category">
                      <p className="text-sm font-semibold text-gray-800">
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
                      <p className="font-mono text-xs font-bold text-gray-800">
                        {visibleReport.reported}
                      </p>
                    </InfoBox>
                  </div>

                  <div className="grid grid-cols-1 gap-3 pt-2 sm:grid-cols-2">
                    <button
                      onClick={handleResolve}
                      disabled={visibleReport.status === "Resolved"}
                      className="flex items-center justify-center gap-2 rounded-xl bg-red-700 px-4 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-red-800 active:translate-y-px disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <CheckCircle size={17} />
                      Resolve
                    </button>

                    <button
                      onClick={handleReject}
                      disabled={visibleReport.status === "Rejected"}
                      className="flex items-center justify-center gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm font-bold text-red-700 transition hover:bg-red-100 active:translate-y-px disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <XCircle size={17} />
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
        className="h-12 w-full min-w-0 appearance-none rounded-xl border border-gray-200 bg-white pl-4 pr-10 text-sm font-bold text-gray-700 outline-none transition hover:bg-gray-50 focus:border-red-700 focus:ring-1 focus:ring-red-700 sm:min-w-44"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <ChevronDown
        size={16}
        className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400"
      />
    </div>
  );
}

function ReportRow({ report, selected, onClick }) {
  return (
    <tr
      onClick={onClick}
      className={`cursor-pointer border-b border-gray-100 transition last:border-b-0 ${
        selected ? "bg-red-50/60" : "hover:bg-gray-50/60"
      }`}
    >
      <td className="px-3 py-4">
        <div className="flex items-center gap-3">
          <img
            src={report.image}
            alt={report.issue || report.title}
            className="h-12 w-12 rounded-lg object-cover"
          />
          <div className="min-w-0 max-w-72">
            <p className="truncate text-sm font-bold text-gray-900">
              {report.issue || report.title}
            </p>
            <p className="mt-0.5 font-mono text-[11px] font-medium text-gray-500">
              {report.reported}
            </p>
          </div>
        </div>
      </td>

      <td className="px-3 py-4">
        <p className="text-sm font-semibold text-gray-700">{report.barangay}</p>
        <p className="mt-0.5 text-xs text-gray-500">{report.location}</p>
      </td>

      <td className="px-3 py-4 text-xs font-medium text-gray-600">
        {report.category}
      </td>

      <td className="px-3 py-4">
        <PriorityBadge priority={report.priority} />
      </td>

      <td className="px-3 py-4">
        <StatusBadge status={report.status} />
      </td>

      <td className="px-3 py-4">
        <button className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-700">
          <MoreHorizontal size={18} />
        </button>
      </td>
    </tr>
  );
}

function PriorityBadge({ priority }) {
  const styles = {
    Critical: { dot: "bg-red-700", text: "text-red-700" },
    High: { dot: "bg-red-500", text: "text-red-600" },
    Medium: { dot: "bg-amber-500", text: "text-amber-700" },
    Low: { dot: "bg-gray-400", text: "text-gray-500" },
  };

  const style = styles[priority] || styles.Low;

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
    Resolved: { dot: "bg-emerald-600", text: "text-emerald-700" },
    Rejected: { dot: "bg-rose-600", text: "text-rose-700" },
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
    <div className="rounded-2xl bg-gray-50 p-4">
      <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-gray-500">
        {label}
      </p>
      {children}
    </div>
  );
}