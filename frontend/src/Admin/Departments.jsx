// src/Admin/Departments.jsx
import { useState } from "react";
import {
  Search,
  Plus,
  ChevronDown,
  MoreHorizontal,
  Wrench,
  Leaf,
  ShieldCheck,
  HeartPulse,
  HardHat,
  Droplets,
  AlertTriangle,
  TrafficCone,
} from "lucide-react";
import AdminLayout from "../Layouts/AdminLayouts";

const departments = [
  {
    id: "DEPT-001",
    name: "City Engineering Office",
    shortName: "Engineering",
    description: "Handles road damage, infrastructure concerns, drainage, and public works issues.",
    head: "Engr. Juan Dela Cruz",
    email: "engineering@malaybalay.gov.ph",
    phone: "0912 345 6789",
    location: "City Hall Building, Malaybalay City",
    icon: Wrench,
    workload: 72,
    assigned: 48,
    inProgress: 31,
    resolved: 124,
    critical: 8,
    avgResponse: "2.4 hrs",
  },
  {
    id: "DEPT-002",
    name: "City Environment Office",
    shortName: "Environment",
    description: "Manages garbage, waste disposal, illegal dumping, sanitation, and environmental reports.",
    head: "Maria Santos",
    email: "environment@malaybalay.gov.ph",
    phone: "0923 456 7890",
    location: "Environment Office, Malaybalay City",
    icon: Leaf,
    workload: 58,
    assigned: 36,
    inProgress: 22,
    resolved: 98,
    critical: 3,
    avgResponse: "3.1 hrs",
  },
  {
    id: "DEPT-003",
    name: "City Disaster Risk Reduction",
    shortName: "CDRRMO",
    description: "Responds to flooding, disaster risks, fallen trees, emergencies, and hazard reports.",
    head: "Pedro Reyes",
    email: "cdrrmo@malaybalay.gov.ph",
    phone: "0934 567 8901",
    location: "CDRRMO Office, Malaybalay City",
    icon: ShieldCheck,
    workload: 45,
    assigned: 24,
    inProgress: 14,
    resolved: 87,
    critical: 11,
    avgResponse: "1.8 hrs",
  },
  {
    id: "DEPT-004",
    name: "City Health Office",
    shortName: "Health",
    description: "Handles health, sanitation, public safety health concerns, and community wellness reports.",
    head: "Dr. Ana Garcia",
    email: "health@malaybalay.gov.ph",
    phone: "0945 678 9012",
    location: "City Health Office, Malaybalay City",
    icon: HeartPulse,
    workload: 30,
    assigned: 18,
    inProgress: 9,
    resolved: 65,
    critical: 2,
    avgResponse: "4.2 hrs",
  },
  {
    id: "DEPT-005",
    name: "City Public Works",
    shortName: "Public Works",
    description: "Coordinates maintenance, public facilities, road clearing, and city improvement tasks.",
    head: "Mark Villanueva",
    email: "publicworks@malaybalay.gov.ph",
    phone: "0956 789 0123",
    location: "Public Works Office, Malaybalay City",
    icon: HardHat,
    workload: 68,
    assigned: 42,
    inProgress: 27,
    resolved: 106,
    critical: 5,
    avgResponse: "2.7 hrs",
  },
  {
    id: "DEPT-006",
    name: "Water Service Office",
    shortName: "Water Service",
    description: "Handles water leakage, low water pressure, broken pipes, and related service issues.",
    head: "Carlo Mendoza",
    email: "water@malaybalay.gov.ph",
    phone: "0967 890 1234",
    location: "Water Service Office, Malaybalay City",
    icon: Droplets,
    workload: 52,
    assigned: 28,
    inProgress: 16,
    resolved: 74,
    critical: 4,
    avgResponse: "3.5 hrs",
  },
  {
    id: "DEPT-007",
    name: "Traffic Management Center",
    shortName: "Traffic",
    description: "Manages traffic flow, road obstructions, stalled vehicles, and traffic-related incidents.",
    head: "Mark Villanueva",
    email: "traffic@malaybalay.gov.ph",
    phone: "0978 901 2345",
    location: "Traffic Management Center, Malaybalay City",
    icon: TrafficCone,
    workload: 44,
    assigned: 21,
    inProgress: 12,
    resolved: 61,
    critical: 6,
    avgResponse: "2.6 hrs",
  },
];

function workloadTone(score) {
  if (score >= 65) return "bg-red-700";
  if (score >= 50) return "bg-red-500";
  return "bg-amber-500";
}

export default function Departments() {
  const [query, setQuery] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("All Departments");
  const [sortBy, setSortBy] = useState("Sort by Workload");

  const normalizedQuery = query.trim().toLowerCase();

  const filteredDepartments = departments
    .filter((department) => {
      const matchesQuery =
        normalizedQuery === "" ||
        [
          department.name,
          department.shortName,
          department.head,
          department.email,
          department.location,
          department.id,
          department.description,
        ].some((field) => field.toLowerCase().includes(normalizedQuery));
      const matchesName =
        departmentFilter === "All Departments" ||
        department.name === departmentFilter;
      return matchesQuery && matchesName;
    })
    .sort((a, b) =>
      sortBy === "Sort by Name"
        ? a.name.localeCompare(b.name)
        : b.workload - a.workload
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
              Malaybalay · LGU Departments
            </p>
            <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">
              Departments
            </h1>
          </div>

          <div className="flex flex-col gap-3 sm:items-end">
            <p className="font-mono text-[11px] font-medium tracking-wide text-gray-500">
              <span className="font-bold text-gray-900">{departments.length}</span>{" "}
              DEPARTMENTS ACTIVE · SYNCED 09:41 AM
            </p>

            <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-700 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-red-800 active:translate-y-px sm:w-auto">
              <Plus size={17} />
              Add Department
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
                placeholder="Search department name, head, email, or location..."
                className="h-12 w-full rounded-xl border border-gray-200 bg-gray-50 pl-11 pr-4 text-sm outline-none transition placeholder:text-gray-500 focus:border-red-700 focus:ring-1 focus:ring-red-700"
              />
            </div>

            <SelectFilter
              label="Department"
              value={departmentFilter}
              onChange={setDepartmentFilter}
              options={[
                "All Departments",
                ...departments.map((department) => department.name),
              ]}
            />
            <SelectFilter
              label="Sort"
              value={sortBy}
              onChange={setSortBy}
              options={["Sort by Workload", "Sort by Name"]}
            />
          </div>
        </section>

        {/* Department Table */}
        <section
          className="animate-fade-up rounded-3xl border border-gray-200/70 bg-white p-4 shadow-sm sm:p-5"
          style={{ animationDelay: "80ms" }}
        >
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-extrabold text-gray-900">
                Department Performance Overview
              </h2>
              <p className="text-sm text-gray-500">
                Monitor workload and response progress per department.
              </p>
            </div>

            <p className="font-mono text-[11px] font-medium text-gray-500">
              {filteredDepartments.length} OF {departments.length}
            </p>
          </div>

          <div className="mt-5 overflow-x-auto">
            <table className="w-full min-w-[900px] text-left text-sm">
              <thead>
                <tr className="border-b border-gray-200 text-[11px] uppercase tracking-wider text-gray-500">
                  <th className="px-3 py-3 text-left font-semibold">Department</th>
                  <th className="px-3 py-3 text-left font-semibold">Head</th>
                  <th className="px-3 py-3 text-left font-semibold">Assigned</th>
                  <th className="px-3 py-3 text-left font-semibold">In Progress</th>
                  <th className="px-3 py-3 text-left font-semibold">Resolved</th>
                  <th className="px-3 py-3 text-left font-semibold">Critical</th>
                  <th className="px-3 py-3 text-left font-semibold">Avg. Response</th>
                  <th className="px-3 py-3 text-left font-semibold">Workload</th>
                  <th className="px-3 py-3 text-left font-semibold">Action</th>
                </tr>
              </thead>

              <tbody>
                {filteredDepartments.map((department) => (
                  <DepartmentRow key={department.id} department={department} />
                ))}

                {filteredDepartments.length === 0 && (
                  <tr>
                    <td colSpan={9} className="px-3 py-14 text-center">
                      <p className="font-mono text-xs font-medium uppercase tracking-[0.18em] text-gray-500">
                        No departments match your filters
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

function DepartmentRow({ department }) {
  const Icon = department.icon;

  return (
    <tr className="border-b border-gray-100 transition last:border-b-0 hover:bg-gray-50/60">
      <td className="px-3 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-700">
            <Icon size={20} />
          </div>

          <div>
            <p className="font-extrabold text-gray-900">{department.name}</p>
            <p className="mt-0.5 font-mono text-[11px] font-medium text-gray-500">
              {department.id}
            </p>
          </div>
        </div>
      </td>

      <td className="px-3 py-4">
        <p className="text-sm font-bold text-gray-700">{department.head}</p>
        <p className="mt-0.5 font-mono text-[11px] font-medium text-gray-500">
          {department.email}
        </p>
      </td>

      <td className="px-3 py-4 font-mono text-sm font-extrabold text-gray-900">
        {department.assigned}
      </td>

      <td className="px-3 py-4 font-mono text-sm font-extrabold text-sky-600">
        {department.inProgress}
      </td>

      <td className="px-3 py-4 font-mono text-sm font-extrabold text-emerald-700">
        {department.resolved}
      </td>

      <td className="px-3 py-4">
        <span className="inline-flex items-center gap-1 rounded-lg bg-red-100 px-2.5 py-1 font-mono text-xs font-bold text-red-700">
          <AlertTriangle size={13} />
          {department.critical}
        </span>
      </td>

      <td className="px-3 py-4 font-mono text-sm font-bold text-gray-700">
        {department.avgResponse}
      </td>

      <td className="px-3 py-4">
        <div className="flex items-center gap-3">
          <div className="h-1.5 w-24 overflow-hidden rounded-full bg-gray-100">
            <div
              className={`h-full rounded-full ${workloadTone(
                department.workload
              )}`}
              style={{ width: `${department.workload}%` }}
            />
          </div>

          <span className="font-mono text-xs font-bold text-gray-700">
            {department.workload}%
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