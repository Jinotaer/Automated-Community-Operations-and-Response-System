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
} from "lucide-react";
import AdminLayout from "../Layouts/AdminLayouts";

const initialReports = [
  {
    id: "#MBY-2025-1245",
    title: "Large pothole along National Highway",
    description: "Large pothole causing vehicles to slow down and creating safety risk.",
    location: "Sayre Highway, Casisang",
    barangay: "Casisang",
    category: "Road / Infrastructure",
    priority: "High",
    status: "In Progress",
    department: "City Engineering Office",
    reporter: "Juan Dela Cruz",
    date: "June 8, 2025",
    time: "9:41 AM",
    image:
      "https://images.unsplash.com/photo-1605000797499-95a51c5269ae?q=80&w=300&auto=format&fit=crop",
  },
  {
    id: "#MBY-2025-1244",
    title: "Garbage accumulation near the river",
    description: "Garbage pile reported near the riverbank area.",
    location: "Sawaga River, Sumpong",
    barangay: "Sumpong",
    category: "Garbage / Waste",
    priority: "Medium",
    status: "Under Review",
    department: "City Environment Office",
    reporter: "Maria Santos",
    date: "June 8, 2025",
    time: "8:15 AM",
    image:
      "https://images.unsplash.com/photo-1604187351574-c75ca79f5807?q=80&w=300&auto=format&fit=crop",
  },
  {
    id: "#MBY-2025-1243",
    title: "Broken streetlight in front of school",
    description: "Streetlight is not working near Kalasungay Central School.",
    location: "Kalasungay Central School",
    barangay: "Kalasungay",
    category: "Streetlights / Electrical",
    priority: "Low",
    status: "Assigned",
    department: "City Engineer",
    reporter: "Pedro Reyes",
    date: "June 8, 2025",
    time: "7:02 AM",
    image:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=300&auto=format&fit=crop",
  },
  {
    id: "#MBY-2025-1242",
    title: "Flooding during heavy rain",
    description: "Flooding happens in Purok 3 during heavy rainfall.",
    location: "Purok 3, Aglayan",
    barangay: "Aglayan",
    category: "Flooding / Drainage",
    priority: "Critical",
    status: "In Progress",
    department: "City Disaster Risk Reduction",
    reporter: "Ana Garcia",
    date: "June 7, 2025",
    time: "6:40 PM",
    image:
      "https://images.unsplash.com/photo-1527482797697-8795b05a13fe?q=80&w=300&auto=format&fit=crop",
  },
  {
    id: "#MBY-2025-1241",
    title: "Water leakage on main road",
    description: "Water leakage affecting road safety and traffic flow.",
    location: "Sayre Highway, Bangcud",
    barangay: "Bangcud",
    category: "Water Service",
    priority: "Medium",
    status: "Pending",
    department: "Water Service Office",
    reporter: "Mark Villanueva",
    date: "June 7, 2025",
    time: "4:30 PM",
    image:
      "https://images.unsplash.com/photo-1541919329513-35f7af297129?q=80&w=300&auto=format&fit=crop",
  },
];

const statuses = ["All", "Pending", "Under Review", "Assigned", "In Progress", "Resolved"];
const categories = [
  "All Categories",
  "Road / Infrastructure",
  "Flooding / Drainage",
  "Garbage / Waste",
  "Streetlights / Electrical",
  "Water Service",
];

const barangays = ["Casisang", "Kalasungay", "Sumpong", "Aglayan", "Bangcud"];
const departments = [
  "City Engineering Office",
  "City Environment Office",
  "City Disaster Risk Reduction",
  "City Health Office",
  "City Public Works",
];
const priorities = ["Critical", "High", "Medium", "Low"];
const reportCategories = categories.slice(1);

export default function Reports() {
  const [reports, setReports] = useState(initialReports);
  const [selectedReport, setSelectedReport] = useState(reports[0]);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All Categories");
  const [addOpen, setAddOpen] = useState(false);

  const normalizedQuery = query.trim().toLowerCase();

  const filteredReports = reports.filter((report) => {
    const matchesQuery =
      normalizedQuery === "" ||
      [
        report.id,
        report.title,
        report.description,
        report.location,
        report.barangay,
        report.category,
        report.reporter,
      ].some((field) => field.toLowerCase().includes(normalizedQuery));

    const matchesStatus =
      statusFilter === "All" || report.status === statusFilter;
    const matchesCategory =
      categoryFilter === "All Categories" ||
      report.category === categoryFilter;

    return matchesQuery && matchesStatus && matchesCategory;
  });

  const selectedIsVisible = filteredReports.some(
    (report) => report.id === visibleReport?.id
  );
  const visibleReport = selectedIsVisible
    ? selectedReport
    : filteredReports[0] || null;

  const handleAddReport = (report) => {
    setReports((prev) => [report, ...prev]);
    setSelectedReport(report);
    setAddOpen(false);
  };

  const clearFilters = () => {
    setQuery("");
    setStatusFilter("All");
    setCategoryFilter("All Categories");
  };

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
              Malaybalay · Citizen Reports
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

            <div className="flex flex-col gap-3 sm:flex-row">
              <button className="flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-bold text-gray-700 transition hover:bg-gray-50 active:translate-y-px sm:w-auto">
                <Download size={17} />
                Export
              </button>

              <button
                onClick={() => setAddOpen(true)}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-700 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-red-800 active:translate-y-px sm:w-auto"
              >
                <Plus size={17} />
                Add Report
              </button>
            </div>
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
              options={categories}
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
                  All Citizen Reports
                </h2>
                <p className="text-sm text-gray-500">
                  Showing latest reports submitted by residents.
                </p>
              </div>

              <p className="font-mono text-[11px] font-medium text-gray-500">
                {filteredReports.length} OF 1,245
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
                    alt={visibleReport.title}
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
                      {visibleReport.title}
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

                    <InfoBox label="Reporter">
                      <p className="text-sm font-bold text-gray-800">
                        {visibleReport.reporter}
                      </p>
                    </InfoBox>
                  </div>

                  <InfoBox label="Assigned Department">
                    <p className="text-sm font-bold text-gray-800">
                      {visibleReport.department}
                    </p>
                  </InfoBox>

                  <InfoBox label="Reported On">
                    <p className="font-mono text-sm font-bold text-gray-800">
                      {visibleReport.date} · {visibleReport.time}
                    </p>
                  </InfoBox>

                  <div className="grid grid-cols-1 gap-3 pt-2 sm:grid-cols-2">
                    <button className="flex items-center justify-center gap-2 rounded-xl bg-red-700 px-4 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-red-800 active:translate-y-px">
                      <CheckCircle size={17} />
                      Resolve
                    </button>

                    <button className="flex items-center justify-center gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm font-bold text-red-700 transition hover:bg-red-100 active:translate-y-px">
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

      {addOpen && (
        <AddReportModal
          onClose={() => setAddOpen(false)}
          onAdd={handleAddReport}
        />
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

function AddReportModal({ onClose, onAdd }) {
  const nextId = useRef(1);
  const [form, setForm] = useState({
    title: "",
    description: "",
    location: "",
    barangay: "",
    category: "",
    priority: "Medium",
    department: "",
    reporter: "",
    image: "",
  });
  const [errors, setErrors] = useState({});

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

  const requiredFields = [
    "title",
    "description",
    "location",
    "barangay",
    "category",
    "department",
    "reporter",
  ];

  const updateField = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const nextErrors = {};
    for (const field of requiredFields) {
      if (!form[field].trim()) nextErrors[field] = "This field is required.";
    }
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    const now = new Date();
    const id = `#MBY-2025-${1245 + nextId.current++}`;

    onAdd({
      id,
      title: form.title.trim(),
      description: form.description.trim(),
      location: form.location.trim(),
      barangay: form.barangay,
      category: form.category,
      priority: form.priority,
      status: "Pending",
      department: form.department,
      reporter: form.reporter.trim(),
      date: now.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      }),
      time: now.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
      }),
      image:
        form.image.trim() ||
        `https://picsum.photos/seed/acors-${id.replace(/[^0-9]/g, "")}/300/200`,
    });
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex animate-fade-in items-end justify-center bg-zinc-950/60 backdrop-blur-sm sm:items-center sm:p-6"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Add report"
        onClick={(event) => event.stopPropagation()}
        className="max-h-[92dvh] w-full max-w-xl overflow-y-auto rounded-t-[2rem] bg-white shadow-2xl animate-modal-in sm:rounded-[2rem]"
      >
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gray-500">
              New Citizen Report
            </p>
            <h2 className="mt-1 text-xl font-extrabold text-gray-900">
              Add Report
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close add report"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-50 text-gray-500 transition hover:bg-gray-100 hover:text-gray-900"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate className="p-6">
          <div className="space-y-4">
            <Field label="Issue Title" error={errors.title}>
              <input
                type="text"
                value={form.title}
                onChange={updateField("title")}
                placeholder="e.g. Large pothole along Sayre Highway"
                className={inputClass(!!errors.title)}
              />
            </Field>

            <Field label="Description" error={errors.description}>
              <textarea
                rows={3}
                value={form.description}
                onChange={updateField("description")}
                placeholder="Describe the issue, severity, and any helpful details..."
                className={`${inputClass(!!errors.description)} h-auto resize-none py-3`}
              />
            </Field>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Location" error={errors.location}>
                <input
                  type="text"
                  value={form.location}
                  onChange={updateField("location")}
                  placeholder="Street, purok, landmark..."
                  className={inputClass(!!errors.location)}
                />
              </Field>

              <Field label="Barangay" error={errors.barangay}>
                <SelectField
                  value={form.barangay}
                  onChange={updateField("barangay")}
                  options={barangays}
                  placeholder="Select barangay"
                  invalid={!!errors.barangay}
                />
              </Field>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Category" error={errors.category}>
                <SelectField
                  value={form.category}
                  onChange={updateField("category")}
                  options={reportCategories}
                  placeholder="Select category"
                  invalid={!!errors.category}
                />
              </Field>

              <Field label="Priority">
                <SelectField
                  value={form.priority}
                  onChange={updateField("priority")}
                  options={priorities}
                  invalid={false}
                />
              </Field>
            </div>

            <Field label="Assigned Department" error={errors.department}>
              <SelectField
                value={form.department}
                onChange={updateField("department")}
                options={departments}
                placeholder="Select department"
                invalid={!!errors.department}
              />
            </Field>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Reporter" error={errors.reporter}>
                <input
                  type="text"
                  value={form.reporter}
                  onChange={updateField("reporter")}
                  placeholder="Full name"
                  className={inputClass(!!errors.reporter)}
                />
              </Field>

              <Field label="Image URL (optional)">
                <input
                  type="text"
                  value={form.image}
                  onChange={updateField("image")}
                  placeholder="Paste image link or leave blank"
                  className={inputClass(false)}
                />
              </Field>
            </div>
          </div>

          <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-bold text-gray-700 transition hover:bg-gray-50 active:translate-y-px"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="rounded-xl bg-red-700 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-red-800 active:translate-y-px"
            >
              Submit Report
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function inputClass(invalid) {
  return `h-12 w-full rounded-xl border bg-white px-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-500 focus:border-red-700 focus:ring-1 focus:ring-red-700 ${
    invalid ? "border-red-600" : "border-gray-200"
  }`;
}

function SelectField({ value, onChange, options, placeholder, invalid }) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={onChange}
        className={`h-12 w-full appearance-none rounded-xl border bg-white pl-4 pr-10 text-sm font-medium text-gray-900 outline-none transition focus:border-red-700 focus:ring-1 focus:ring-red-700 ${
          invalid ? "border-red-600" : "border-gray-200"
        }`}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
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

function Field({ label, error, children }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-[11px] font-semibold uppercase tracking-[0.16em] text-gray-500">
        {label}
      </label>
      {children}
      {error && (
        <p role="alert" className="text-xs font-medium text-red-600">
          {error}
        </p>
      )}
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
            alt={report.title}
            className="h-12 w-12 rounded-lg object-cover"
          />
          <div className="min-w-0 max-w-72">
            <p className="truncate text-sm font-bold text-gray-900">{report.title}</p>
            <p className="mt-0.5 font-mono text-[11px] font-medium text-gray-500">
              {report.date} · {report.time}
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