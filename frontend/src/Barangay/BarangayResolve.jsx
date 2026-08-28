// src/Barangay/BarangayResolve.jsx
import { useState, useEffect } from "react";
import {
  Search,
  ChevronDown,
  MapPin,
  CheckCircle2,
  Calendar,
  Building,
  Layers,
  UserCheck,
  ShieldCheck,
} from "lucide-react";
import BarangayLayout from "./BarangayLayout";
import { getStoredComplaints } from "../services/complaintsStore";
import { getActiveBarangaySession } from "./barangayData";

export default function BarangayResolve() {
  const [complaints, setComplaints] = useState(getStoredComplaints());
  const [session, setSession] = useState(getActiveBarangaySession());
  const [selectedReport, setSelectedReport] = useState(null);
  const [query, setQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All Categories");
  const [resolverFilter, setResolverFilter] = useState("All Resolvers");

  useEffect(() => {
    function loadData() {
      const active = getActiveBarangaySession();
      setSession(active);
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

  // Get all resolved complaints belonging to this Barangay (both Barangay-resolved and LGU-resolved)
  const allResolvedReports = complaints.filter((c) => {
    const isThisBarangay =
      c.barangay.toLowerCase().includes(session.slug.toLowerCase()) ||
      session.barangayName.toLowerCase().includes(c.barangay.toLowerCase());

    const isResolved = c.status === "RESOLVED";

    return isThisBarangay && isResolved;
  });

  const barangayResolvedCount = allResolvedReports.filter(
    (c) =>
      !c.escalation ||
      c.resolution?.resolvedBy?.toLowerCase().includes("barangay")
  ).length;

  const lguResolvedCount = allResolvedReports.filter(
    (c) =>
      Boolean(c.escalation) &&
      !c.resolution?.resolvedBy?.toLowerCase().includes("barangay")
  ).length;

  const summary = [
    {
      label: "Total Resolved Cases",
      value: allResolvedReports.length,
      tone: "text-emerald-700",
      accent: "bg-emerald-600",
    },
    {
      label: "Resolved by Barangay",
      value: barangayResolvedCount,
      tone: "text-gray-900",
      accent: "bg-red-700",
    },
    {
      label: "Resolved by LGU",
      value: lguResolvedCount,
      tone: "text-gray-900",
      accent: "bg-indigo-600",
    },
  ];

  const normalizedQuery = query.trim().toLowerCase();

  const filteredReports = allResolvedReports.filter((report) => {
    const isLguResolved =
      Boolean(report.escalation) &&
      !report.resolution?.resolvedBy?.toLowerCase().includes("barangay");

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
        report.resolution?.description,
        report.resolution?.resolvedBy,
        report.escalation?.recommendedOffice,
      ]
        .filter(Boolean)
        .some((field) => field.toLowerCase().includes(normalizedQuery));

    const matchesCategory =
      categoryFilter === "All Categories" || report.category === categoryFilter;

    let matchesResolver = true;
    if (resolverFilter === "Resolved by Barangay") {
      matchesResolver = !isLguResolved;
    } else if (resolverFilter === "Resolved by LGU") {
      matchesResolver = isLguResolved;
    }

    return matchesQuery && matchesCategory && matchesResolver;
  });

  const selectedIsVisible =
    selectedReport &&
    filteredReports.some((report) => report.id === selectedReport.id);
  const visibleReport = selectedIsVisible
    ? selectedReport
    : filteredReports[0] || null;

  const categoriesList = [
    "All Categories",
    "Road Damage",
    "Potholes",
    "Garbage Accumulation",
    "Broken Streetlights",
    "Flooding",
    "Infrastructure",
    "Illegal Dumping",
    "Traffic",
    "Public Health",
    "Sanitation",
    "Disaster Concern",
    "Fallen Trees",
  ];

  return (
    <BarangayLayout header="Resolved Complaints">
      <div className="space-y-4 sm:space-y-6">
        {/* Header */}
        <header className="flex animate-fade-up flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.22em] text-gray-500">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              Malaybalay · {session.barangayName}
            </p>
            <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">
              Resolved Complaints Console
            </h1>
            <p className="mt-1 text-xs text-zinc-500 max-w-2xl">
              Consolidated archive of all community cases resolved locally by the Barangay or completed by City LGU departments following escalation.
            </p>
          </div>

          <p className="font-mono text-[11px] font-medium tracking-wide text-gray-500">
            <span className="font-bold text-emerald-700">
              {allResolvedReports.length}
            </span>{" "}
            TOTAL RESOLVED · REAL-TIME
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
          <div className="grid gap-4 lg:grid-cols-[1fr_auto_auto]">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search resolved complaints by ID, title, location, resolver..."
                className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 pl-11 pr-4 text-xs font-semibold outline-none transition placeholder:text-gray-400 focus:border-red-700 focus:bg-white"
              />
            </div>

            {/* Resolver Type Filter */}
            <div className="relative">
              <select
                value={resolverFilter}
                onChange={(e) => setResolverFilter(e.target.value)}
                className="h-11 w-full appearance-none rounded-xl border border-gray-200 bg-white pl-4 pr-10 text-xs font-bold text-gray-700 outline-none hover:bg-gray-50 focus:border-red-700 sm:min-w-44"
              >
                <option value="All Resolvers">All Resolvers (Barangay & LGU)</option>
                <option value="Resolved by Barangay">Resolved by Barangay</option>
                <option value="Resolved by LGU">Resolved by LGU Department</option>
              </select>
              <ChevronDown
                size={14}
                className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400"
              />
            </div>

            {/* Category Filter */}
            <SelectFilter
              label="Category"
              value={categoryFilter}
              onChange={setCategoryFilter}
              options={categoriesList}
            />
          </div>
        </section>

        {/* Main Content */}
        <section className="grid gap-6 xl:grid-cols-12">
          {/* Resolved Reports Table */}
          <div
            className="animate-fade-up rounded-3xl border border-gray-200/70 bg-white p-4 shadow-sm sm:p-5 xl:col-span-8"
            style={{ animationDelay: "120ms" }}
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-base font-extrabold text-gray-900">
                  Closed Cases Archive
                </h2>
                <p className="text-xs text-gray-500">
                  Showing {filteredReports.length} of {allResolvedReports.length} closed complaints
                </p>
              </div>

              <span className="rounded-full bg-emerald-50 px-3 py-1 font-mono text-xs font-extrabold text-emerald-800">
                {session.barangayName}
              </span>
            </div>

            <div className="mt-5 overflow-x-auto">
              <table className="w-full min-w-176 text-left text-xs">
                <thead>
                  <tr className="border-b border-gray-200 text-[10px] uppercase tracking-wider text-gray-400">
                    <th className="px-3 py-3 font-semibold">Complaint ID</th>
                    <th className="px-3 py-3 font-semibold">Issue Title</th>
                    <th className="px-3 py-3 font-semibold">Resolved By</th>
                    <th className="px-3 py-3 font-semibold">Category</th>
                    <th className="px-3 py-3 font-semibold">Resolved Date</th>
                    <th className="px-3 py-3 text-right pr-3 font-semibold">Resolution Tier</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {filteredReports.map((report) => {
                    const isLguResolved =
                      Boolean(report.escalation) &&
                      !report.resolution?.resolvedBy?.toLowerCase().includes("barangay");

                    return (
                      <tr
                        key={report.id}
                        onClick={() => setSelectedReport(report)}
                        className={`cursor-pointer transition ${
                          visibleReport?.id === report.id
                            ? "bg-emerald-50/60 font-semibold"
                            : "hover:bg-gray-50/60"
                        }`}
                      >
                        <td className="px-3 py-3 font-mono text-[11px] font-bold text-gray-800">
                          {report.id}
                        </td>
                        <td className="px-3 py-3">
                          <p className="font-bold text-gray-900 truncate max-w-52">{report.title}</p>
                          <p className="text-[10px] text-gray-400">{report.location}</p>
                        </td>
                        <td className="px-3 py-3 font-semibold text-gray-700 truncate max-w-44">
                          {report.resolution?.resolvedBy || (isLguResolved ? report.escalation?.recommendedOffice : session.staffName)}
                        </td>
                        <td className="px-3 py-3">
                          <span className="rounded-md bg-gray-100 px-2 py-0.5 text-[10px] font-bold text-gray-700">
                            {report.category}
                          </span>
                        </td>
                        <td className="px-3 py-3 font-mono text-[10px] text-gray-500">
                          {report.resolution?.resolvedAt || report.submittedAt}
                        </td>
                        <td className="px-3 py-3 text-right pr-3">
                          {isLguResolved ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-indigo-100 px-2.5 py-0.5 text-[10px] font-extrabold text-indigo-800">
                              <Building size={11} />
                              LGU Resolved
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-extrabold text-emerald-800">
                              <CheckCircle2 size={11} />
                              Barangay
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}

                  {filteredReports.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-3 py-14 text-center text-gray-400">
                        <CheckCircle2 size={36} className="mx-auto mb-2 text-gray-300" />
                        <p className="text-xs font-bold">No resolved complaints match your filters.</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Details Side Panel */}
          <aside
            className="animate-fade-up rounded-3xl border border-gray-200/70 bg-white p-5 shadow-sm xl:col-span-4"
            style={{ animationDelay: "160ms" }}
          >
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
              <h2 className="text-base font-extrabold text-gray-900">
                Resolution Dossier
              </h2>
              {visibleReport?.escalation && !visibleReport.resolution?.resolvedBy?.toLowerCase().includes("barangay") ? (
                <span className="rounded-full bg-indigo-100 px-2.5 py-0.5 text-[10px] font-extrabold text-indigo-800">
                  LGU Completed
                </span>
              ) : (
                <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-extrabold text-emerald-800">
                  Barangay Resolved
                </span>
              )}
            </div>

            {visibleReport ? (
              <div className="mt-4 space-y-4 text-xs">
                {/* Evidence Image */}
                {visibleReport.image && (
                  <div className="overflow-hidden rounded-2xl border border-gray-200">
                    <img
                      src={visibleReport.image}
                      alt={visibleReport.title}
                      className="h-40 w-full object-cover"
                    />
                  </div>
                )}

                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[11px] font-bold text-red-700 bg-red-50 px-2 py-0.5 rounded-md">
                      {visibleReport.id}
                    </span>
                    <span className="rounded-md bg-zinc-100 px-2 py-0.5 text-[10px] font-bold text-zinc-700">
                      {visibleReport.category}
                    </span>
                  </div>
                  <h3 className="mt-1.5 text-base font-extrabold text-gray-900 leading-snug">
                    {visibleReport.title}
                  </h3>
                  <p className="mt-1 text-gray-600 leading-relaxed bg-gray-50 p-2.5 rounded-xl border border-gray-100">
                    {visibleReport.description}
                  </p>
                </div>

                {/* Resolution Summary Box */}
                <div
                  className={`rounded-2xl border p-4 space-y-2 ${
                    visibleReport.escalation && !visibleReport.resolution?.resolvedBy?.toLowerCase().includes("barangay")
                      ? "border-indigo-300 bg-indigo-50/70"
                      : "border-emerald-300 bg-emerald-50/70"
                  }`}
                >
                  <div className="flex items-center gap-1.5 font-extrabold text-xs">
                    <CheckCircle2
                      size={15}
                      className={
                        visibleReport.escalation && !visibleReport.resolution?.resolvedBy?.toLowerCase().includes("barangay")
                          ? "text-indigo-700"
                          : "text-emerald-700"
                      }
                    />
                    <span
                      className={
                        visibleReport.escalation && !visibleReport.resolution?.resolvedBy?.toLowerCase().includes("barangay")
                          ? "text-indigo-900"
                          : "text-emerald-900"
                      }
                    >
                      {visibleReport.escalation && !visibleReport.resolution?.resolvedBy?.toLowerCase().includes("barangay")
                        ? "LGU DEPARTMENT RESOLUTION SUMMARY"
                        : "BARANGAY RESOLUTION SUMMARY"}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold uppercase text-zinc-500">
                      Action Completed:
                    </span>
                    <p className="mt-0.5 rounded-xl bg-white p-2.5 text-zinc-800 leading-relaxed border border-zinc-200/60">
                      &ldquo;{visibleReport.resolution?.description || "Technical intervention completed and verified operational."}&rdquo;
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                    <div>
                      <span className="text-[10px] text-zinc-500 font-semibold">Resolved By:</span>
                      <p className="font-bold text-zinc-900">
                        {visibleReport.resolution?.resolvedBy || (visibleReport.escalation?.recommendedOffice || session.staffName)}
                      </p>
                    </div>
                    <div>
                      <span className="text-[10px] text-zinc-500 font-semibold">Completed Date:</span>
                      <p className="font-mono font-bold text-zinc-900">
                        {visibleReport.resolution?.resolvedAt || visibleReport.submittedAt}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-start gap-2.5 rounded-xl bg-gray-50 p-3">
                  <MapPin size={16} className="mt-0.5 shrink-0 text-red-700" />
                  <div>
                    <p className="font-bold text-gray-900">{visibleReport.location}</p>
                    <p className="text-[11px] text-gray-500">{visibleReport.barangay}</p>
                  </div>
                </div>

                {/* Timeline */}
                <div className="border-t border-gray-100 pt-3">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2">
                    Case Lifecycle History
                  </p>
                  <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                    {visibleReport.timeline?.map((step, idx) => (
                      <div key={idx} className="rounded-xl bg-gray-50 p-2 text-xs">
                        <div className="flex justify-between items-center font-bold text-gray-900">
                          <span>{step.step}</span>
                          <span className="font-mono text-[10px] text-gray-400">{step.time}</span>
                        </div>
                        {step.note && (
                          <p className="text-[11px] text-gray-600 mt-0.5">{step.note}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-16 text-center text-gray-400">
                <p className="text-xs font-bold">Select a resolved complaint to view dossier</p>
              </div>
            )}
          </aside>
        </section>
      </div>
    </BarangayLayout>
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
        size={14}
        className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400"
      />
    </div>
  );
}
