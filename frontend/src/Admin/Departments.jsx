// src/Admin/Departments.jsx
import {
  Search,
  Plus,
  Filter,
  ChevronDown,
  MoreHorizontal,
  Wrench,
  Leaf,
  ShieldCheck,
  HeartPulse,
  HardHat,
  Droplets,
  AlertTriangle,
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
    color: "bg-red-100 text-red-700",
    bar: "bg-red-500",
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
    color: "bg-green-100 text-green-700",
    bar: "bg-green-500",
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
    color: "bg-orange-100 text-orange-700",
    bar: "bg-orange-500",
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
    color: "bg-blue-100 text-blue-700",
    bar: "bg-blue-500",
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
    color: "bg-purple-100 text-purple-700",
    bar: "bg-purple-500",
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
    color: "bg-cyan-100 text-cyan-700",
    bar: "bg-cyan-500",
    workload: 52,
    assigned: 28,
    inProgress: 16,
    resolved: 74,
    critical: 4,
    avgResponse: "3.5 hrs",
  },
];

export default function Departments() {
  return (
    <AdminLayout>
      <div className="space-y-4 sm:space-y-6">
        {/* Header */}
        <header className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900">
              Departments
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage LGU departments, workloads, assigned reports, and response performance.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <button className="flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-bold text-gray-700 shadow-sm hover:bg-gray-50 sm:w-auto">
              <Filter size={17} />
              Filter
            </button>

            <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-green-700 px-4 py-3 text-sm font-bold text-white shadow-sm hover:bg-green-800 sm:w-auto">
              <Plus size={17} />
              Add Department
            </button>
          </div>
        </header>

        {/* Filters */}
        <section className="rounded-2xl bg-white p-4 shadow-sm sm:p-5">
          <div className="grid gap-4 lg:grid-cols-[1fr_auto_auto]">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search department name, head, email, or location..."
                className="h-12 w-full rounded-xl border border-gray-200 bg-gray-50 pl-11 pr-4 text-sm outline-none focus:border-green-700 focus:ring-1 focus:ring-green-700"
              />
            </div>

            <SelectButton label="All Departments" />
            <SelectButton label="Sort by Workload" />
          </div>
        </section>

        {/* Department Table */}
        <section className="rounded-2xl bg-white p-4 shadow-sm sm:p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-extrabold text-gray-900">
                Department Performance Overview
              </h2>
              <p className="text-sm text-gray-500">
                Monitor workload and response progress per department.
              </p>
            </div>

          </div>

          <div className="mt-5 overflow-x-auto">
            <table className="w-full min-w-[900px] text-left text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-xs text-gray-400">
                  <th className="px-3 py-3 font-bold">Department</th>
                  <th className="px-3 py-3 font-bold">Head</th>
                  <th className="px-3 py-3 font-bold">Assigned</th>
                  <th className="px-3 py-3 font-bold">In Progress</th>
                  <th className="px-3 py-3 font-bold">Resolved</th>
                  <th className="px-3 py-3 font-bold">Critical</th>
                  <th className="px-3 py-3 font-bold">Avg. Response</th>
                  <th className="px-3 py-3 font-bold">Workload</th>
                  <th className="px-3 py-3 font-bold">Action</th>
                </tr>
              </thead>

              <tbody>
                {departments.map((department) => (
                  <DepartmentRow key={department.id} department={department} />
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </AdminLayout>
  );
}

function SelectButton({ label }) {
  return (
    <button className="flex h-12 w-full min-w-0 items-center justify-between gap-3 rounded-xl border border-gray-200 bg-white px-4 text-sm font-bold text-gray-700 hover:bg-gray-50 sm:min-w-48">
      {label}
      <ChevronDown size={16} />
    </button>
  );
}

function DepartmentRow({ department }) {
  const Icon = department.icon;

  return (
    <tr className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50">
      <td className="px-3 py-4">
        <div className="flex items-center gap-3">
          <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${department.color}`}>
            <Icon size={20} />
          </div>

          <div>
            <p className="font-extrabold text-gray-900">{department.name}</p>
            <p className="text-xs font-semibold text-gray-400">
              {department.id}
            </p>
          </div>
        </div>
      </td>

      <td className="px-3 py-4">
        <p className="font-bold text-gray-700">{department.head}</p>
        <p className="text-xs text-gray-500">{department.email}</p>
      </td>

      <td className="px-3 py-4 font-extrabold text-gray-800">
        {department.assigned}
      </td>

      <td className="px-3 py-4 font-extrabold text-yellow-600">
        {department.inProgress}
      </td>

      <td className="px-3 py-4 font-extrabold text-green-700">
        {department.resolved}
      </td>

      <td className="px-3 py-4">
        <span className="inline-flex items-center gap-1 rounded-lg bg-red-100 px-3 py-1 text-xs font-extrabold text-red-700">
          <AlertTriangle size={13} />
          {department.critical}
        </span>
      </td>

      <td className="px-3 py-4 font-bold text-gray-700">
        {department.avgResponse}
      </td>

      <td className="px-3 py-4">
        <div className="flex items-center gap-3">
          <div className="h-2 w-24 overflow-hidden rounded-full bg-gray-100">
            <div
              className={`h-full rounded-full ${department.bar}`}
              style={{ width: `${department.workload}%` }}
            />
          </div>

          <span className="text-xs font-extrabold text-gray-700">
            {department.workload}%
          </span>
        </div>
      </td>

      <td className="px-3 py-4">
        <button className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-700">
          <MoreHorizontal size={18} />
        </button>
      </td>
    </tr>
  );
}
