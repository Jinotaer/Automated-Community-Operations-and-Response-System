// src/Admin/Overview.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ChevronDown,
  Eye,
  Plus,
  Minus,
  Share2,
  Building,
  Layers,
} from "lucide-react";
import AdminLayout from "../Layouts/AdminLayouts";
import {
  officeSummaries,
  combinedCategories,
  combinedProblemAreas,
  allIncidents,
} from "./adminData";
import { getStoredComplaints } from "../services/complaintsStore";

const mapParks = [
  "left-[8%] top-[14%] h-16 w-16",
  "left-[70%] top-[12%] h-14 w-14",
  "left-[55%] top-[52%] h-12 w-12",
  "left-[18%] top-[72%] h-14 w-16",
];

const majorRoads = [
  "left-[-6%] top-[20%] h-4 w-[112%] rotate-[-9deg]",
  "left-[2%] top-[45%] h-4 w-[104%] rotate-[6deg]",
  "left-[-2%] top-[68%] h-4 w-[110%] rotate-[-10deg]",
  "left-[22%] top-[-8%] h-[126%] w-4 rotate-[12deg]",
  "left-[64%] top-[-6%] h-[118%] w-4 rotate-[-8deg]",
];

const minorRoads = [
  "left-[4%] top-[12%] h-2 w-[104%] rotate-[2deg]",
  "left-[8%] top-[32%] h-2 w-[94%] rotate-[-5deg]",
  "left-[14%] top-[56%] h-2 w-[88%] rotate-[4deg]",
  "left-[14%] top-[80%] h-2 w-[82%] rotate-[-4deg]",
  "left-[40%] top-[-4%] h-[114%] w-2 rotate-[8deg]",
  "left-[82%] top-[-2%] h-[104%] w-2 rotate-[-10deg]",
];

function markerTone(count) {
  if (count >= 12) return "bg-red-700";
  if (count >= 6) return "bg-red-500";
  return "bg-amber-500";
}

export default function Overview() {
  const [complaints, setComplaints] = useState(getStoredComplaints());

  useEffect(() => {
    function load() {
      setComplaints(getStoredComplaints());
    }
    window.addEventListener("acors_complaints_updated", load);
    return () => window.removeEventListener("acors_complaints_updated", load);
  }, []);

  const totalComplaints = 128;
  const barangayComplaints = 114;
  const escalatedComplaints = complaints.filter(
    (c) =>
      c.status === "ESCALATED TO LGU" ||
      c.status === "LGU REVIEW" ||
      c.status === "LGU ACCEPTED" ||
      c.status === "LGU IN PROGRESS" ||
      Boolean(c.escalation)
  ).length || 14;
  const pendingLguReview = complaints.filter(
    (c) => c.status === "ESCALATED TO LGU" || c.status === "LGU REVIEW"
  ).length || 8;
  const inProgress = 32;
  const resolved = 88;

  const lguStats = [
    { title: "Total Complaints", value: `${totalComplaints}`, note: "+18% this month" },
    { title: "Barangay (Tier 1)", value: `${barangayComplaints}`, note: "First-level receiver" },
    { title: "Escalated to LGU", value: `${escalatedComplaints}`, note: "Requires heavy equipment" },
    { title: "Pending LGU Review", value: `${pendingLguReview}`, note: "Awaiting acceptance" },
    { title: "In Progress", value: `${inProgress}`, note: "Active dispatch" },
    { title: "Resolved", value: `${resolved}`, note: "78.4% resolution" },
  ];

  const recentReports = complaints.slice(0, 6);

  return (
    <AdminLayout>
      <div className="space-y-5 sm:space-y-6">
        {/* Header */}
        <header className="flex animate-fade-up flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.22em] text-gray-500">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-600 opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-red-600" />
              </span>
              Malaybalay · Tier 2 Operations Console
            </p>
            <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">
              LGU Dashboard &amp; Escalations
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/admin/reports"
              className="inline-flex items-center gap-1.5 rounded-2xl bg-red-700 px-4 py-2.5 text-xs font-extrabold text-white shadow-xs hover:bg-red-800 transition"
            >
              <Share2 size={13} />
              Review Barangay Escalations ({escalatedComplaints})
            </Link>
          </div>
        </header>

        {/* 6-Stat Band */}
        <section
          className="grid animate-fade-up grid-cols-2 divide-y divide-gray-100 rounded-3xl border border-gray-200/70 bg-white shadow-sm sm:grid-cols-3 xl:grid-cols-6 xl:divide-x xl:divide-y-0"
          style={{ animationDelay: "40ms" }}
        >
          {lguStats.map((stat, index) => (
            <StatCell key={stat.title} stat={stat} index={index} />
          ))}
        </section>

        {/* Offices at a Glance */}
        <section
          className="grid animate-fade-up grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5"
          style={{ animationDelay: "60ms" }}
        >
          {officeSummaries.map((office) => {
            const Icon = office.icon;
            const max = Math.max(...officeSummaries.map((item) => item.assigned));
            const workload = Math.round((office.assigned / max) * 100);

            return (
              <div
                key={office.slug}
                className="rounded-3xl border border-gray-200/70 bg-white p-4 shadow-sm sm:p-5"
              >
                <div className="flex items-center justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-red-700">
                    <Icon size={22} />
                  </div>
                  <span className="rounded-full bg-red-50 px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-wide text-red-700">
                    {office.shortName}
                  </span>
                </div>

                <p className="mt-4 truncate text-sm font-bold text-gray-900">
                  {office.name}
                </p>

                <div className="mt-3 flex items-center justify-between text-xs font-semibold text-gray-500">
                  <span>{office.inProgress} in progress</span>
                  <span className="font-mono font-bold text-gray-700">
                    {office.resolved} resolved
                  </span>
                </div>

                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-gray-100">
                  <div
                    className="h-full rounded-full bg-red-700"
                    style={{ width: `${workload}%` }}
                  />
                </div>

                <p className="mt-3 font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-gray-400">
                  {office.shortName} Office
                </p>
              </div>
            );
          })}
        </section>

        {/* Map and Right Panels */}
        <section className="grid gap-6 xl:grid-cols-12">
          <div
            className="animate-fade-up rounded-3xl border border-gray-200/70 bg-white p-4 shadow-sm sm:p-5 xl:col-span-8"
            style={{ animationDelay: "80ms" }}
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-extrabold text-gray-900">
                  Incident Map Overview
                </h2>
                <p className="text-xs text-gray-500">
                  Real-time geographic distribution across Malaybalay Barangays.
                </p>
              </div>
              <p className="flex items-center gap-2 font-mono text-[11px] font-medium text-gray-500">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-red-600" />
                SYNCED 09:41 AM
              </p>
            </div>

            <div className="mt-4 flex flex-wrap gap-3">
              <FilterButton label="All Barangays" />
              <FilterButton label="All Categories" />
              <FilterButton label="All Statuses" />

              <button className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-xs font-bold text-red-700 transition hover:bg-red-100 active:translate-y-px sm:ml-auto sm:w-auto">
                <Eye size={15} />
                Heatmap View
              </button>
            </div>

            <div className="mt-4">
              <MapOverview />
            </div>
          </div>

          <aside
            className="animate-fade-up rounded-3xl border border-gray-200/70 bg-white shadow-sm xl:col-span-4"
            style={{ animationDelay: "140ms" }}
          >
            <div className="p-4 sm:p-5">
              <ReportsByCategory />
            </div>
            <div className="border-t border-gray-100 p-4 sm:p-5">
              <TopProblemAreas />
            </div>
          </aside>
        </section>

        {/* Recent Complaints Table */}
        <section className="grid gap-6 xl:grid-cols-12">
          <div
            className="animate-fade-up rounded-3xl border border-gray-200/70 bg-white p-4 shadow-sm sm:p-5 xl:col-span-8"
            style={{ animationDelay: "220ms" }}
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-extrabold text-gray-900">
                  Recent Citizen &amp; Barangay Reports
                </h2>
                <p className="text-xs text-gray-500">
                  Live feed of community issues and Barangay escalations.
                </p>
              </div>
              <Link
                to="/admin/reports"
                className="text-sm font-bold text-red-600 transition hover:text-red-700"
              >
                View All Complaints →
              </Link>
            </div>

            <div className="mt-5 overflow-x-auto">
              <table className="w-full min-w-180 text-left text-xs">
                <thead>
                  <tr className="border-b border-gray-200 text-[10px] uppercase tracking-wider text-gray-400">
                    <th className="px-3 py-3 font-semibold">Complaint ID</th>
                    <th className="px-3 py-3 font-semibold">Issue</th>
                    <th className="px-3 py-3 font-semibold">Barangay (Tier 1)</th>
                    <th className="px-3 py-3 font-semibold">Category</th>
                    <th className="px-3 py-3 font-semibold">Status</th>
                    <th className="px-3 py-3 font-semibold">Submitted</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {recentReports.map((report) => (
                    <ReportRow key={report.id} report={report} />
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <OfficeWorkload />
        </section>
      </div>
    </AdminLayout>
  );
}

function useCountUp(target, duration = 1200, delay = 0) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    let frame;
    let start = null;

    const timeout = window.setTimeout(() => {
      frame = window.requestAnimationFrame(function tick(now) {
        if (start === null) start = now;
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setValue(target * eased);
        if (progress < 1) frame = window.requestAnimationFrame(tick);
      });
    }, delay);

    return () => {
      window.clearTimeout(timeout);
      window.cancelAnimationFrame(frame);
    };
  }, [target, duration, delay]);

  return value;
}

function StatCell({ stat, index }) {
  const numeric = parseFloat(stat.value.replace(/[^\d.]/g, ""));
  const suffix = stat.value.replace(/[0-9.,]/g, "").trim();
  const raw = useCountUp(numeric, 1000, index * 50);
  const formatted =
    numeric % 1 === 0 ? Math.round(raw).toLocaleString() : raw.toFixed(1);

  return (
    <div className="flex flex-col justify-between gap-1.5 p-4 transition hover:bg-gray-50/40">
      <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-gray-500">
        {stat.title}
      </p>
      <p className="font-mono text-2xl font-extrabold tracking-tight text-gray-900">
        {formatted}
        {suffix && (
          <span className="ml-1 text-base font-semibold text-gray-500">
            {suffix}
          </span>
        )}
      </p>
      <p className="font-mono text-[10px] font-medium text-gray-400 truncate">
        {stat.note}
      </p>
    </div>
  );
}

function FilterButton({ label }) {
  return (
    <button className="flex w-full min-w-0 items-center justify-between gap-3 rounded-xl border border-gray-200 bg-white px-4 py-2 text-xs font-medium text-gray-700 transition hover:bg-gray-50 active:translate-y-px sm:min-w-40">
      {label}
      <ChevronDown size={15} />
    </button>
  );
}

function MapOverview() {
  const grouped = allIncidents.reduce((acc, incident) => {
    const key = `${incident.top}|${incident.left}`;
    if (!acc[key]) acc[key] = { ...incident, count: 0 };
    acc[key].count += incident.count;
    return acc;
  }, {});
  const markers = Object.values(grouped);

  return (
    <div className="relative h-80 overflow-hidden rounded-2xl border border-gray-200/70 bg-[#edf2f5] sm:h-88">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.75),transparent_38%)]" />

      {mapParks.map((park) => (
        <div key={park} className={`absolute rounded-md bg-[#d8efcc] ${park}`} />
      ))}

      {majorRoads.map((road) => (
        <div
          key={road}
          className={`absolute rounded-full bg-white/95 shadow-[0_0_0_1px_rgba(203,213,225,0.32)] ${road}`}
        />
      ))}

      {minorRoads.map((road) => (
        <div
          key={road}
          className={`absolute rounded-full bg-white/88 shadow-[0_0_0_1px_rgba(226,232,240,0.4)] ${road}`}
        />
      ))}

      <span className="absolute left-[25%] top-[12%] text-xs font-bold text-gray-700 sm:text-sm">
        Kalasungay
      </span>
      <span className="absolute left-[46%] top-[35%] text-xs font-bold text-gray-700 sm:text-sm">
        Casisang
      </span>
      <span className="absolute right-[16%] top-[20%] text-xs font-bold text-gray-700 sm:text-sm">
        Sumpong
      </span>
      <span className="absolute right-[16%] bottom-[12%] text-xs font-bold text-gray-700 sm:text-sm">
        Aglayan
      </span>

      {markers.map((marker, index) => (
        <button
          key={`${marker.id}-${index}`}
          className={`absolute flex h-9 w-9 items-center justify-center rounded-full font-mono text-sm font-bold text-white shadow-md ring-2 ring-white/60 transition hover:scale-110 sm:h-10 sm:w-10 sm:text-base ${markerTone(
            marker.count
          )}`}
          style={{ top: marker.top, left: marker.left }}
        >
          {marker.count}
        </button>
      ))}

      <div className="absolute bottom-4 left-4 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
        <button className="flex h-8 w-8 items-center justify-center border-b border-gray-100 text-gray-500 transition hover:bg-gray-50 sm:h-9 sm:w-9">
          <Plus size={18} />
        </button>
        <button className="flex h-8 w-8 items-center justify-center text-gray-500 transition hover:bg-gray-50 sm:h-9 sm:w-9">
          <Minus size={18} />
        </button>
      </div>
    </div>
  );
}

function ReportsByCategory() {
  return (
    <div>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-sm font-extrabold text-gray-900">
          Reports by Category
        </h2>
        <button className="text-xs font-bold text-red-600 transition hover:text-red-700">
          View All
        </button>
      </div>

      <div className="mt-4 space-y-3.5">
        {combinedCategories.map((category) => (
          <div key={category.name} className="space-y-1">
            <div className="flex items-start justify-between gap-3 text-xs sm:items-center">
              <div className="flex min-w-0 items-center gap-2">
                <span className={`h-2 w-2 shrink-0 rounded-full ${category.color}`} />
                <span className="font-medium text-gray-700 truncate">{category.name}</span>
              </div>
              <span className="shrink-0 font-mono text-[11px] font-semibold text-gray-500">
                {category.percent}
              </span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-gray-100">
              <div
                className={`h-full rounded-full ${category.color}`}
                style={{ width: category.percent.split("%")[0] + "%" }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function TopProblemAreas() {
  return (
    <div>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-sm font-extrabold text-gray-900">
          Top Problem Areas
        </h2>
        <button className="text-xs font-bold text-red-600 transition hover:text-red-700">
          View All
        </button>
      </div>

      <div className="mt-3.5 space-y-2.5">
        {combinedProblemAreas.map((item, index) => (
          <div
            key={item.area}
            className="grid grid-cols-[2rem_1fr_auto] items-center gap-2 text-xs"
          >
            <span className="font-mono text-xs font-bold text-gray-400">
              {String(index + 1).padStart(2, "0")}
            </span>
            <p className="font-bold text-gray-800 truncate">{item.area}</p>
            <p className="font-mono text-[11px] font-medium text-gray-500">
              {item.reports}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

function ReportRow({ report }) {
  return (
    <tr className="hover:bg-gray-50/60 transition">
      <td className="px-3 py-3 font-mono text-[11px] font-bold text-gray-800">
        {report.id}
      </td>
      <td className="px-3 py-3">
        <p className="font-bold text-gray-900 line-clamp-1">{report.title}</p>
        <p className="text-[10px] text-gray-400 line-clamp-1">{report.location}</p>
      </td>
      <td className="px-3 py-3 text-xs font-bold text-red-700">
        {report.barangay}
      </td>
      <td className="px-3 py-3">
        <span className="rounded-md bg-gray-100 px-2 py-0.5 text-[10px] font-bold text-gray-700">
          {report.category}
        </span>
      </td>
      <td className="px-3 py-3">
        <StatusBadge status={report.status} />
      </td>
      <td className="px-3 py-3 font-mono text-[10px] text-gray-500">
        {report.submittedAt}
      </td>
    </tr>
  );
}

function StatusBadge({ status }) {
  const styles = {
    "In Progress": "bg-sky-100 text-sky-700",
    "LGU IN PROGRESS": "bg-sky-100 text-sky-700",
    "Under Review": "bg-amber-100 text-amber-700",
    "BARANGAY REVIEW": "bg-amber-100 text-amber-700",
    "ESCALATED TO LGU": "bg-red-100 text-red-700",
    "LGU ACCEPTED": "bg-indigo-100 text-indigo-700",
    Pending: "bg-gray-100 text-gray-500",
    Resolved: "bg-emerald-100 text-emerald-700",
    RESOLVED: "bg-emerald-100 text-emerald-700",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-extrabold ${
        styles[status] || "bg-gray-100 text-gray-600"
      }`}
    >
      {status}
    </span>
  );
}

function OfficeWorkload() {
  const max = Math.max(...officeSummaries.map((office) => office.assigned));

  return (
    <aside
      className="animate-fade-up rounded-3xl border border-gray-200/70 bg-white p-4 shadow-sm sm:p-5 xl:col-span-4"
      style={{ animationDelay: "280ms" }}
    >
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-sm font-extrabold text-gray-900">
          LGU Office Workload
        </h2>
        <Link
          to="/admin/users"
          className="text-xs font-bold text-red-600 transition hover:text-red-700"
        >
          View All
        </Link>
      </div>

      <div className="mt-5 space-y-4">
        {officeSummaries.map((office) => {
          const Icon = office.icon;
          const workload = Math.round((office.assigned / max) * 100);

          return (
            <div key={office.slug} className="flex items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gray-50 text-gray-600">
                <Icon size={18} />
              </div>

              <div className="flex-1">
                <div className="flex items-baseline justify-between gap-3">
                  <p className="text-xs font-bold text-gray-800">
                    {office.shortName}
                  </p>
                  <p className="font-mono text-xs font-bold text-gray-900">
                    {workload}%
                  </p>
                </div>

                <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-gray-100">
                  <div
                    className="h-full rounded-full bg-red-700"
                    style={{ width: `${workload}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </aside>
  );
}
