// src/Offices/shared/OfficeResolve.jsx
import { useState } from "react";
import {
  Search,
  ChevronDown,
  MoreHorizontal,
  MapPin,
  CheckCircle2,
} from "lucide-react";
import OfficeLayout from "../OfficeLayout";

export default function OfficeResolve({ office }) {
  const [reports] = useState(office.recentReports);
  const [selectedReport, setSelectedReport] = useState(reports[0]);
  const [query, setQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All Categories");

  const resolvedReports = reports.filter(
    (report) => report.status === "Resolved"
  );

  const officeTotal = office.stats.find((stat) => stat.title === "Resolved");
  const avgResponse = office.stats.find(
    (stat) => stat.title === "Avg. Response"
  );

  const summary = [
    {
      label: "Resolved Reports",
      value: resolvedReports.length,
      tone: "text-emerald-700",
      accent: "bg-emerald-600",
    },
    {
      label: "Office Total Resolved",
      value: officeTotal?.value || "0",
      tone: "text-gray-900",
      accent: "bg-red-700",
    },
    {
      label: "Avg. Response",
      value: avgResponse?.value || "—",
      tone: "text-gray-900",
      accent: "bg-amber-500",
    },
  ];

  const normalizedQuery = query.trim().toLowerCase();

  const filteredReports = resolvedReports.filter((report) => {
    const matchesQuery =
      normalizedQuery === "" ||
      [
        report.id,
        report.issue,
        report.title,
        report.description,
        report.location,
        report.barangay,
        report.category,
      ]
        .filter(Boolean)
        .some((field) => field.toLowerCase().includes(normalizedQuery));

    const matchesCategory =
      categoryFilter === "All Categories" || report.category === categoryFilter;

    return matchesQuery && matchesCategory;
  });

  const selectedIsVisible =
    selectedReport &&
    filteredReports.some((report) => report.id === selectedReport.id);
  const visibleReport = selectedIsVisible
    ? selectedReport
    : filteredReports[0] || null;

  return (
    <OfficeLayout office={office} header={`${office.shortName} Resolve`}>
      <div className="space-y-4 sm:space-y-6">
        {/* Header */}
        <header className="flex animate-fade-up flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.22em] text-gray-500">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              Malaybalay · {office.name}
            </p>
            <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">
              Resolved Reports
            </h1>
          </div>

          <p className="font-mono text-[11px] font-medium tracking-wide text-gray-500">
            <span className="font-bold text-emerald-700">
              {resolvedReports.length}
            </span>{" "}
            RESOLVED · SYNCED 09:41 AM
          </p>
        </header>

        {/* Summary strip */}
        <section
          className="grid animate-fade-up grid-cols-1 divide-y divide-gray-100 rounded-3xl border border-gray-200/70 bg-white shadow-sm sm:grid-cols-3 sm:divide-x sm:divide-y-0"
          style={{ animationDelay: "40ms" }}
        >
          {summary.map((item) => (
            <div key={item.label} className="flex items-center gap-4 p-5">
              <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${item.accent}`} />
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-gray-500">
                  {item.label}
                </p>
                <p className={`mt-1 font-mono text-2xl font-extrabold ${item.tone}`}>
                  {item.value}
                </p>
              </div>
            </div>
          ))}
        </section>

        {/* Filters */}
        <section
          className="animate-fade-up rounded-2xl border border-gray-200/70 bg-white p-4 shadow-sm sm:p-5"
          style={{ animationDelay: "80ms" }}
        >
          <div className="grid gap-4 lg:grid-cols-[1fr_auto]">
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
            style={{ animationDelay: "120ms" }}
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-extrabold text-gray-900">
                  Resolved by {office.shortName}
                </h2>
                <p className="text-sm text-gray-500">
                  Reports that have been closed by {office.name}.
                </p>
              </div>

              <p className="font-mono text-[11px] font-medium text-gray-500">
                {filteredReports.length} OF {resolvedReports.length}
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
                    <th className="px-3 py-3 text-left font-semibold">Resolved On</th>
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
                      <td colSpan={5} className="px-3 py-14 text-center">
                        <p className="font-mono text-xs font-medium uppercase tracking-[0.18em] text-gray-500">
                          No resolved reports match your filters
                        </p>
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
            style={{ animationDelay: "180ms" }}
          >
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-extrabold text-gray-900">
                Resolution Details
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
                  <span className="absolute right-3 top-3 flex items-center gap-1.5 rounded-lg bg-emerald-600/95 px-2.5 py-1 text-[11px] font-bold text-white shadow-sm backdrop-blur">
                    <CheckCircle2 size={14} />
                    Resolved
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

                    <InfoBox label="Reported On">
                      <p className="font-mono text-xs font-bold text-gray-800">
                        {visibleReport.reported}
                      </p>
                    </InfoBox>

                    <InfoBox label="Resolved On">
                      <p className="font-mono text-xs font-bold text-emerald-700">
                        {visibleReport.resolved || "—"}
                      </p>
                    </InfoBox>
                  </div>

                  <div className="flex items-center gap-3 rounded-2xl bg-emerald-50 p-4">
                    <CheckCircle2 size={20} className="shrink-0 text-emerald-600" />
                    <p className="text-sm font-semibold text-emerald-800">
                      This report has been resolved by {office.shortName}.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-14 text-center">
                <p className="font-mono text-xs font-medium uppercase tracking-[0.18em] text-gray-500">
                  Select a resolved report
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
        selected ? "bg-emerald-50/60" : "hover:bg-gray-50/60"
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
              {report.id} · {report.reported}
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
        <span className="inline-flex items-center gap-1.5 font-mono text-xs font-semibold text-emerald-700">
          <CheckCircle2 size={14} />
          {report.resolved || "—"}
        </span>
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
