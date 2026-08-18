// src/Admin/Barangays.jsx
import { useState } from "react";
import {
  Search,
  Plus,
  ChevronDown,
  MoreHorizontal,
  MapPin,
  AlertTriangle,
} from "lucide-react";
import AdminLayout from "../Layouts/AdminLayouts";

const barangays = [
  {
    id: "BRGY-001",
    name: "Casisang",
    captain: "Hon. Juan Dela Cruz",
    population: "18,450",
    reports: 156,
    pending: 34,
    inProgress: 48,
    resolved: 74,
    critical: 12,
    avgResponse: "2.1 hrs",
    rating: "4.7",
    performance: 86,
    status: "High Activity",
  },
  {
    id: "BRGY-002",
    name: "Sumpong",
    captain: "Hon. Maria Santos",
    population: "14,230",
    reports: 98,
    pending: 19,
    inProgress: 32,
    resolved: 47,
    critical: 6,
    avgResponse: "2.8 hrs",
    rating: "4.5",
    performance: 78,
    status: "Active",
  },
  {
    id: "BRGY-003",
    name: "Kalasungay",
    captain: "Hon. Pedro Reyes",
    population: "10,875",
    reports: 132,
    pending: 25,
    inProgress: 39,
    resolved: 68,
    critical: 8,
    avgResponse: "2.5 hrs",
    rating: "4.6",
    performance: 82,
    status: "Active",
  },
  {
    id: "BRGY-004",
    name: "Aglayan",
    captain: "Hon. Ana Garcia",
    population: "9,640",
    reports: 76,
    pending: 12,
    inProgress: 21,
    resolved: 43,
    critical: 4,
    avgResponse: "3.2 hrs",
    rating: "4.3",
    performance: 71,
    status: "Moderate",
  },
  {
    id: "BRGY-005",
    name: "Bangcud",
    captain: "Hon. Carlo Mendoza",
    population: "7,520",
    reports: 54,
    pending: 8,
    inProgress: 16,
    resolved: 30,
    critical: 3,
    avgResponse: "3.5 hrs",
    rating: "4.2",
    performance: 68,
    status: "Moderate",
  },
  {
    id: "BRGY-006",
    name: "Managok",
    captain: "Hon. Mark Villanueva",
    population: "8,910",
    reports: 43,
    pending: 7,
    inProgress: 13,
    resolved: 23,
    critical: 2,
    avgResponse: "3.9 hrs",
    rating: "4.1",
    performance: 64,
    status: "Low Activity",
  },
];

function performanceTone(score) {
  if (score >= 80) return "bg-red-700";
  if (score >= 70) return "bg-red-500";
  return "bg-amber-500";
}

export default function Barangays() {
  const [query, setQuery] = useState("");
  const [barangayFilter, setBarangayFilter] = useState("All Barangays");
  const [sortBy, setSortBy] = useState("Sort by Reports");

  const normalizedQuery = query.trim().toLowerCase();

  const filteredBarangays = barangays
    .filter((barangay) => {
      const matchesQuery =
        normalizedQuery === "" ||
        [barangay.name, barangay.captain, barangay.id, barangay.status].some(
          (field) => field.toLowerCase().includes(normalizedQuery)
        );
      const matchesName =
        barangayFilter === "All Barangays" ||
        barangay.name === barangayFilter;
      return matchesQuery && matchesName;
    })
    .sort((a, b) =>
      sortBy === "Sort by Name"
        ? a.name.localeCompare(b.name)
        : b.reports - a.reports
    );

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
              Malaybalay · Barangay Operations
            </p>
            <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">
              Barangays
            </h1>
          </div>

          <div className="flex flex-col gap-3 sm:items-end">
            <p className="font-mono text-[11px] font-medium tracking-wide text-gray-500">
              <span className="font-bold text-gray-900">{barangays.length}</span>{" "}
              BARANGAYS COVERED · SYNCED 09:41 AM
            </p>

            <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-700 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-red-800 active:translate-y-px sm:w-auto">
              <Plus size={17} />
              Add Barangay
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
                placeholder="Search barangay, captain, report count, or status..."
                className="h-12 w-full rounded-xl border border-gray-200 bg-gray-50 pl-11 pr-4 text-sm outline-none transition placeholder:text-gray-500 focus:border-red-700 focus:ring-1 focus:ring-red-700"
              />
            </div>

            <SelectFilter
              label="Barangay"
              value={barangayFilter}
              onChange={setBarangayFilter}
              options={[
                "All Barangays",
                ...barangays.map((barangay) => barangay.name),
              ]}
            />
            <SelectFilter
              label="Sort"
              value={sortBy}
              onChange={setSortBy}
              options={["Sort by Reports", "Sort by Name"]}
            />
          </div>
        </section>

        {/* Barangay Table */}
        <section
          className="animate-fade-up rounded-3xl border border-gray-200/70 bg-white p-4 shadow-sm sm:p-5"
          style={{ animationDelay: "80ms" }}
        >
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-extrabold text-gray-900">
                Barangay Performance Overview
              </h2>
              <p className="text-sm text-gray-500">
                Compare report volume, response time, and resolution rate by barangay.
              </p>
            </div>

            <p className="font-mono text-[11px] font-medium text-gray-500">
              {filteredBarangays.length} OF {barangays.length}
            </p>
          </div>

          <div className="mt-5 overflow-x-auto">
            <table className="w-full min-w-[950px] text-left text-sm">
              <thead>
                <tr className="border-b border-gray-200 text-[11px] uppercase tracking-wider text-gray-500">
                  <th className="px-3 py-3 text-left font-semibold">Barangay</th>
                  <th className="px-3 py-3 text-left font-semibold">Captain</th>
                  <th className="px-3 py-3 text-left font-semibold">Population</th>
                  <th className="px-3 py-3 text-left font-semibold">Reports</th>
                  <th className="px-3 py-3 text-left font-semibold">Pending</th>
                  <th className="px-3 py-3 text-left font-semibold">In Progress</th>
                  <th className="px-3 py-3 text-left font-semibold">Resolved</th>
                  <th className="px-3 py-3 text-left font-semibold">Critical</th>
                  <th className="px-3 py-3 text-left font-semibold">Performance</th>
                  <th className="px-3 py-3 text-left font-semibold">Action</th>
                </tr>
              </thead>

              <tbody>
                {filteredBarangays.map((barangay) => (
                  <BarangayRow key={barangay.id} barangay={barangay} />
                ))}

                {filteredBarangays.length === 0 && (
                  <tr>
                    <td colSpan={10} className="px-3 py-14 text-center">
                      <p className="font-mono text-xs font-medium uppercase tracking-[0.18em] text-gray-500">
                        No barangays match your filters
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
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

function BarangayRow({ barangay }) {
  return (
    <tr className="border-b border-gray-100 transition last:border-b-0 hover:bg-gray-50/60">
      <td className="px-3 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-700">
            <MapPin size={20} />
          </div>

          <div>
            <p className="font-extrabold text-gray-900">
              Barangay {barangay.name}
            </p>
            <p className="mt-0.5 font-mono text-[11px] font-medium text-gray-500">
              {barangay.id}
            </p>
          </div>
        </div>
      </td>

      <td className="px-3 py-4 text-sm font-bold text-gray-700">
        {barangay.captain}
      </td>

      <td className="px-3 py-4 font-mono text-sm font-bold text-gray-700">
        {barangay.population}
      </td>

      <td className="px-3 py-4 font-mono text-sm font-extrabold text-gray-900">
        {barangay.reports}
      </td>

      <td className="px-3 py-4 font-mono text-sm font-extrabold text-amber-600">
        {barangay.pending}
      </td>

      <td className="px-3 py-4 font-mono text-sm font-extrabold text-sky-600">
        {barangay.inProgress}
      </td>

      <td className="px-3 py-4 font-mono text-sm font-extrabold text-emerald-700">
        {barangay.resolved}
      </td>

      <td className="px-3 py-4">
        <span className="inline-flex items-center gap-1 rounded-lg bg-red-100 px-2.5 py-1 font-mono text-xs font-bold text-red-700">
          <AlertTriangle size={13} />
          {barangay.critical}
        </span>
      </td>

      <td className="px-3 py-4">
        <div className="flex items-center gap-3">
          <div className="h-1.5 w-24 overflow-hidden rounded-full bg-gray-100">
            <div
              className={`h-full rounded-full ${performanceTone(
                barangay.performance
              )}`}
              style={{ width: `${barangay.performance}%` }}
            />
          </div>

          <span className="font-mono text-xs font-bold text-gray-700">
            {barangay.performance}%
          </span>
        </div>
      </td>

      <td className="px-3 py-4">
        <button className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-700">
          <MoreHorizontal size={18} />
        </button>
      </td>
    </tr>
  );
}