// src/Admin/Map.jsx
import { useState } from "react";
import {
  Search,
  ChevronDown,
  Layers,
  Navigation,
  Plus,
  Minus,
  MapPin,
  Eye,
} from "lucide-react";
import AdminLayout from "../Layouts/AdminLayouts";

const filters = ["All", "Road", "Flooding", "Garbage", "Streetlight", "Public Safety"];

const barangays = [
  "All Barangays",
  "Casisang",
  "Kalasungay",
  "Sumpong",
  "Aglayan",
  "Bangcud",
];

const statuses = [
  "All Statuses",
  "Pending",
  "Under Review",
  "Assigned",
  "In Progress",
  "Resolved",
];

const incidents = [
  {
    id: "#MBY-2025-1245",
    title: "Large pothole along National Highway",
    category: "Road / Infrastructure",
    barangay: "Casisang",
    status: "In Progress",
    priority: "High",
    count: 15,
    top: "46%",
    left: "56%",
  },
  {
    id: "#MBY-2025-1244",
    title: "Garbage accumulation near the river",
    category: "Garbage / Waste",
    barangay: "Sumpong",
    status: "Under Review",
    priority: "Medium",
    count: 6,
    top: "34%",
    left: "78%",
  },
  {
    id: "#MBY-2025-1243",
    title: "Broken streetlight in front of school",
    category: "Streetlights / Electrical",
    barangay: "Kalasungay",
    status: "Assigned",
    priority: "Low",
    count: 8,
    top: "23%",
    left: "51%",
  },
  {
    id: "#MBY-2025-1242",
    title: "Flooding during heavy rain",
    category: "Flooding / Drainage",
    barangay: "Aglayan",
    status: "In Progress",
    priority: "Critical",
    count: 12,
    top: "24%",
    left: "25%",
  },
  {
    id: "#MBY-2025-1241",
    title: "Illegal dumping near vacant lot",
    category: "Garbage / Waste",
    barangay: "Bangcud",
    status: "Pending",
    priority: "Medium",
    count: 5,
    top: "70%",
    left: "34%",
  },
  {
    id: "#MBY-2025-1240",
    title: "Road obstruction caused by fallen tree",
    category: "Obstruction",
    barangay: "Kalasungay",
    status: "Under Review",
    priority: "High",
    count: 3,
    top: "18%",
    left: "66%",
  },
];

const legends = [
  { label: "Road / Infrastructure", tone: "bg-red-700" },
  { label: "Flooding / Drainage", tone: "bg-red-600" },
  { label: "Garbage / Waste", tone: "bg-red-500" },
  { label: "Streetlights / Electrical", tone: "bg-red-400" },
  { label: "Fallen Tree / Obstruction", tone: "bg-red-300" },
  { label: "Others", tone: "bg-gray-400" },
];

function markerTone(count) {
  if (count >= 12) return "bg-red-700";
  if (count >= 6) return "bg-red-500";
  return "bg-amber-500";
}

export default function AdminMap() {
  const [query, setQuery] = useState("");
  const [barangayFilter, setBarangayFilter] = useState("All Barangays");
  const [statusFilter, setStatusFilter] = useState("All Statuses");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [heatmapView, setHeatmapView] = useState(false);

  const normalizedQuery = query.trim().toLowerCase();

  const filteredIncidents = incidents.filter((incident) => {
    const matchesQuery =
      normalizedQuery === "" ||
      [incident.id, incident.title, incident.barangay, incident.category].some(
        (field) => field.toLowerCase().includes(normalizedQuery)
      );

    const matchesBarangay =
      barangayFilter === "All Barangays" ||
      incident.barangay === barangayFilter;
    const matchesStatus =
      statusFilter === "All Statuses" || incident.status === statusFilter;
    const matchesCategory =
      categoryFilter === "All" ||
      (categoryFilter === "Public Safety"
        ? incident.category === "Obstruction"
        : incident.category.includes(categoryFilter));

    return matchesQuery && matchesBarangay && matchesStatus && matchesCategory;
  });

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
              Malaybalay · Incident Map
            </p>
            <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">
              Report Map
            </h1>
          </div>

          <div className="flex flex-col gap-3 sm:items-end">
            <p className="font-mono text-[11px] font-medium tracking-wide text-gray-500">
              <span className="font-bold text-gray-900">{incidents.length}</span>{" "}
              ACTIVE INCIDENTS · SYNCED 09:41 AM
            </p>

            <div className="flex flex-col gap-3 sm:flex-row">
              <button className="flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-bold text-gray-700 transition hover:bg-gray-50 active:translate-y-px sm:w-auto">
                <Layers size={17} />
                Map Layers
              </button>

              <button
                onClick={() => setHeatmapView((value) => !value)}
                className={`flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold text-white shadow-sm transition active:translate-y-px sm:w-auto ${
                  heatmapView
                    ? "bg-red-800 hover:bg-red-900"
                    : "bg-red-700 hover:bg-red-800"
                }`}
              >
                <Eye size={17} />
                {heatmapView ? "Map View" : "Heatmap View"}
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
                placeholder="Search barangay, location, report ID..."
                className="h-12 w-full rounded-xl border border-gray-200 bg-gray-50 pl-11 pr-4 text-sm outline-none transition placeholder:text-gray-500 focus:border-red-700 focus:ring-1 focus:ring-red-700"
              />
            </div>

            <SelectFilter
              label="Barangay"
              value={barangayFilter}
              onChange={setBarangayFilter}
              options={barangays}
            />
            <SelectFilter
              label="Status"
              value={statusFilter}
              onChange={setStatusFilter}
              options={statuses}
            />
          </div>

          <div className="mt-4 flex gap-2 overflow-x-auto">
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => setCategoryFilter(filter)}
                className={`shrink-0 rounded-full px-4 py-2 text-xs font-bold transition active:translate-y-px ${
                  categoryFilter === filter
                    ? "bg-red-700 text-white shadow-sm"
                    : "bg-gray-100 text-gray-600 hover:bg-red-50 hover:text-red-700"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </section>

        {/* Main Map Layout */}
        <section className="grid gap-6 xl:grid-cols-12">
          {/* Map */}
          <div
            className="animate-fade-up rounded-3xl border border-gray-200/70 bg-white p-4 shadow-sm sm:p-5 xl:col-span-8"
            style={{ animationDelay: "80ms" }}
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-extrabold text-gray-900">
                  Malaybalay City Map Overview
                </h2>
                <p className="text-sm text-gray-500">
                  Click a marker to view related incident details.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <p className="flex items-center gap-2 font-mono text-[11px] font-medium text-gray-500">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-gray-400" />
                  UPDATED 09:41 AM
                </p>
                <button className="flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-xs font-bold text-red-700 transition hover:bg-red-100 active:translate-y-px">
                  <Navigation size={16} />
                  Locate
                </button>
              </div>
            </div>

            <div className="mt-5">
              <MapView heatmap={heatmapView} />
            </div>
          </div>

          {/* Right Panel */}
          <aside
            className="animate-fade-up space-y-6 xl:col-span-4"
            style={{ animationDelay: "140ms" }}
          >
            <MapLegend />

            <div className="rounded-3xl border border-gray-200/70 bg-white p-4 shadow-sm sm:p-5">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <h2 className="text-lg font-extrabold text-gray-900">
                  Active Incidents
                </h2>
                <button className="text-sm font-bold text-red-600 transition hover:text-red-700">
                  View All
                </button>
              </div>

              <div className="mt-5 space-y-3">
                {filteredIncidents.map((incident) => (
                  <IncidentCard key={incident.id} incident={incident} />
                ))}

                {filteredIncidents.length === 0 && (
                  <div className="rounded-2xl border border-dashed border-gray-200 py-10 text-center">
                    <p className="font-mono text-xs font-medium uppercase tracking-[0.18em] text-gray-500">
                      No incidents match your filters
                    </p>
                  </div>
                )}
              </div>
            </div>
          </aside>
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

function MapView({ heatmap }) {
  return (
    <div className="relative h-[420px] overflow-hidden rounded-2xl border border-gray-200/70 bg-[#edf2f5] sm:h-[600px]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.75),transparent_38%)]" />

      {/* Parks */}
      <div className="absolute left-[10%] top-[10%] h-64 w-64 rounded-full bg-[#d8efcc]" />
      <div className="absolute right-[8%] top-[20%] h-72 w-72 rounded-full bg-[#d8efcc]/80" />
      <div className="absolute bottom-[12%] left-[22%] h-60 w-60 rounded-full bg-white/40" />
      <div className="absolute bottom-[8%] right-[15%] h-52 w-52 rounded-full bg-[#d8efcc]/70" />

      {/* Roads */}
      <div className="absolute left-[-10%] top-[16%] h-6 w-[120%] rotate-[-12deg] rounded-full bg-white/95 shadow-[0_0_0_1px_rgba(203,213,225,0.32)]" />
      <div className="absolute left-[-20%] top-[50%] h-4 w-[140%] rotate-[18deg] rounded-full bg-white/95 shadow-[0_0_0_1px_rgba(203,213,225,0.32)]" />
      <div className="absolute left-[30%] top-[-10%] h-[120%] w-5 rotate-[10deg] rounded-full bg-white/95 shadow-[0_0_0_1px_rgba(203,213,225,0.32)]" />
      <div className="absolute left-[70%] top-[-10%] h-[120%] w-4 rotate-[-20deg] rounded-full bg-white/95 shadow-[0_0_0_1px_rgba(203,213,225,0.32)]" />

      {/* City boundary */}
      <div className="absolute inset-x-[14%] top-[9%] bottom-[9%] rounded-[45%] border border-dashed border-gray-300/70 bg-white/40" />

      {/* Barangay labels */}
      <MapLabel text="Kalasungay" className="left-[24%] top-[13%]" />
      <MapLabel text="Casisang" className="left-[43%] top-[36%]" />
      <MapLabel text="Sumpong" className="right-[14%] top-[22%]" />
      <MapLabel text="Aglayan" className="right-[16%] bottom-[18%]" />
      <MapLabel text="Bangcud" className="left-[31%] bottom-[16%]" />

      {/* Small dots */}
      <Dot top="34%" left="41%" />
      <Dot top="61%" left="51%" />
      <Dot top="73%" left="58%" />
      <Dot top="52%" left="70%" />
      <Dot top="57%" left="77%" />
      <Dot top="37%" left="34%" />
      <Dot top="38%" left="62%" />

      {/* Incident markers */}
      {heatmap ? (
        <>
          {incidents.map((incident) => (
            <HeatBlob key={incident.id} incident={incident} />
          ))}
          <span className="absolute left-4 top-4 rounded-lg bg-red-700/90 px-2.5 py-1 font-mono text-[11px] font-bold text-white shadow-sm backdrop-blur">
            HEATMAP MODE
          </span>
        </>
      ) : (
        incidents.map((incident) => (
          <button
            key={incident.id}
            title={incident.title}
            className={`absolute flex h-10 w-10 items-center justify-center rounded-full font-mono text-sm font-bold text-white shadow-md ring-2 ring-white/60 transition hover:scale-110 sm:h-14 sm:w-14 sm:text-lg ${markerTone(
              incident.count
            )}`}
            style={{
              top: incident.top,
              left: incident.left,
            }}
          >
            {incident.count}
          </button>
        ))
      )}

      {/* Zoom controls */}
      <div className="absolute bottom-5 left-5 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
        <button className="flex h-10 w-10 items-center justify-center border-b border-gray-100 text-gray-500 transition hover:bg-gray-50 sm:h-11 sm:w-11">
          <Plus size={18} />
        </button>
        <button className="flex h-10 w-10 items-center justify-center text-gray-500 transition hover:bg-gray-50 sm:h-11 sm:w-11">
          <Minus size={18} />
        </button>
      </div>

      {/* Floating controls */}
      <div className="absolute right-4 top-4 space-y-3 sm:right-5 sm:top-5">
        <button className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-500 shadow-sm transition hover:bg-gray-50 sm:h-11 sm:w-11">
          <Layers size={18} />
        </button>
        <button className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-500 shadow-sm transition hover:bg-gray-50 sm:h-11 sm:w-11">
          <Navigation size={18} />
        </button>
      </div>
    </div>
  );
}

function MapLabel({ text, className }) {
  return (
    <span
      className={`absolute text-xs font-bold text-gray-700 sm:text-sm ${className}`}
    >
      {text}
    </span>
  );
}

function Dot({ top, left }) {
  return (
    <span
      className="absolute h-3 w-3 rounded-full bg-gray-400/80"
      style={{ top, left }}
    />
  );
}

function HeatBlob({ incident }) {
  const intensity = incident.count / 15;
  const size = 56 + intensity * 100;

  return (
    <div
      className="pointer-events-none absolute rounded-full bg-red-500/45 blur-2xl"
      style={{
        top: incident.top,
        left: incident.left,
        width: size,
        height: size,
        opacity: 0.35 + intensity * 0.5,
        transform: "translate(-50%, -50%)",
      }}
    />
  );
}

function MapLegend() {
  return (
    <div className="rounded-3xl border border-gray-200/70 bg-white p-4 shadow-sm sm:p-5">
      <h2 className="text-lg font-extrabold text-gray-900">Map Legend</h2>

      <div className="mt-5 space-y-3">
        {legends.map((legend) => (
          <div key={legend.label} className="flex items-center gap-3">
            <span
              className={`h-2.5 w-2.5 shrink-0 rounded-full ${legend.tone}`}
            />
            <p className="text-sm font-medium text-gray-700">{legend.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function IncidentCard({ incident }) {
  return (
    <button className="w-full rounded-2xl border border-gray-100 bg-white p-4 text-left transition hover:border-red-200 hover:bg-red-50/50">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-mono text-[11px] font-medium text-gray-500">
            {incident.id}
          </p>
          <h3 className="mt-1 line-clamp-2 text-sm font-bold text-gray-900">
            {incident.title}
          </h3>
        </div>

        <span
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full font-mono text-xs font-bold text-white ${markerTone(
            incident.count
          )}`}
        >
          {incident.count}
        </span>
      </div>

      <div className="mt-3 flex items-center gap-2 text-xs font-medium text-gray-500">
        <MapPin size={14} className="shrink-0 text-red-700" />
        {incident.barangay}, Malaybalay City
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-3">
        <PriorityBadge priority={incident.priority} />
        <StatusBadge status={incident.status} />
      </div>
    </button>
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