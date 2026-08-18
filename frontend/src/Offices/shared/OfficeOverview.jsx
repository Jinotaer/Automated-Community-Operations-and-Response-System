// src/Offices/shared/OfficeOverview.jsx
import { useEffect, useState } from "react";
import { ChevronDown, Eye, Plus, Minus, MoreHorizontal } from "lucide-react";
import OfficeLayout from "../OfficeLayout";

function markerTone(count) {
  if (count >= 12) return "bg-red-700";
  if (count >= 6) return "bg-red-500";
  return "bg-amber-500";
}

export default function OfficeOverview({ office }) {
  return (
    <OfficeLayout office={office} header={`${office.shortName} Overview`}>
      <div className="space-y-5 sm:space-y-6">
        {/* Header */}
        <header className="flex animate-fade-up flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.22em] text-gray-500">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-600 opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-red-600" />
              </span>
              Malaybalay · {office.name}
            </p>
            <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">
              {office.shortName} Overview
            </h1>
          </div>

          <p className="font-mono text-[11px] font-medium tracking-wide text-gray-500">
            LIVE · <span className="font-bold text-gray-900">{office.stats[0].value}</span>{" "}
            ASSIGNED REPORTS
          </p>
        </header>

        {/* Stat Band */}
        <section
          className="grid animate-fade-up grid-cols-1 divide-y divide-gray-100 rounded-3xl border border-gray-200/70 bg-white shadow-sm sm:grid-cols-2 xl:grid-cols-5 xl:divide-x xl:divide-y-0"
          style={{ animationDelay: "40ms" }}
        >
          {office.stats.map((stat, index) => (
            <StatCell key={stat.title} stat={stat} index={index} />
          ))}
        </section>

        {/* Map and Right Panels */}
        <section className="grid gap-6 xl:grid-cols-12">
          <div
            className="animate-fade-up rounded-3xl border border-gray-200/70 bg-white p-4 shadow-sm sm:p-5 xl:col-span-8"
            style={{ animationDelay: "80ms" }}
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="text-lg font-extrabold text-gray-900">
                Incident Map Overview
              </h2>
              <p className="flex items-center gap-2 font-mono text-[11px] font-medium text-gray-500">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-gray-400" />
                UPDATED 09:41 AM
              </p>
            </div>

            <div className="mt-4 flex flex-wrap gap-3">
              <FilterButton label="All Barangays" />
              <FilterButton label={office.categories[0]} />
              <FilterButton label="All Statuses" />

              <button className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-xs font-bold text-red-700 transition hover:bg-red-100 active:translate-y-px sm:ml-auto sm:w-auto">
                <Eye size={15} />
                Heatmap View
              </button>
            </div>

            <div className="mt-4">
              <MapOverview incidents={office.incidents} />
            </div>
          </div>

          <aside
            className="animate-fade-up rounded-3xl border border-gray-200/70 bg-white shadow-sm xl:col-span-4"
            style={{ animationDelay: "140ms" }}
          >
            <div className="p-4 sm:p-5">
              <ReportsByCategory categories={office.categoryBreakdown} />
            </div>
            <div className="border-t border-gray-100 p-4 sm:p-5">
              <TopProblemAreas areas={office.problemAreas} />
            </div>
          </aside>
        </section>

        {/* Reports and Priority Breakdown */}
        <section className="grid gap-6 xl:grid-cols-12">
          <div
            className="animate-fade-up rounded-3xl border border-gray-200/70 bg-white p-4 shadow-sm sm:p-5 xl:col-span-8"
            style={{ animationDelay: "220ms" }}
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="text-lg font-extrabold text-gray-900">
                Recent Reports
              </h2>
              <button className="text-sm font-bold text-red-600 transition hover:text-red-700">
                View All Reports
              </button>
            </div>

            <div className="mt-5 overflow-x-auto">
              <table className="w-full min-w-208 text-left text-sm">
                <thead>
                  <tr className="border-b border-gray-200 text-[11px] uppercase tracking-wider text-gray-500">
                    <th className="px-3 py-3 text-left font-semibold">ID</th>
                    <th className="px-3 py-3 text-left font-semibold">Issue</th>
                    <th className="px-3 py-3 text-left font-semibold">Location</th>
                    <th className="px-3 py-3 text-left font-semibold">Category</th>
                    <th className="px-3 py-3 text-left font-semibold">Status</th>
                    <th className="px-3 py-3 text-left font-semibold">Reported On</th>
                    <th className="px-3 py-3 text-left font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {office.recentReports.map((report) => (
                    <ReportRow key={report.id} report={report} />
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <aside
            className="animate-fade-up rounded-3xl border border-gray-200/70 bg-white p-4 shadow-sm sm:p-5 xl:col-span-4"
            style={{ animationDelay: "280ms" }}
          >
            <div>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <h2 className="text-lg font-extrabold text-gray-900">
                  Priority Breakdown
                </h2>
                <button className="text-sm font-bold text-red-600 transition hover:text-red-700">
                  View All
                </button>
              </div>

              <div className="mt-5 space-y-4">
                {office.priorityBreakdown.map((item) => (
                  <div key={item.name} className="space-y-1.5">
                    <div className="flex items-start justify-between gap-3 text-sm sm:items-center">
                      <div className="flex min-w-0 items-center gap-2">
                        <span className={`h-2 w-2 shrink-0 rounded-full ${item.color}`} />
                        <span className="font-medium text-gray-700">{item.name}</span>
                      </div>
                      <span className="shrink-0 font-mono text-xs font-semibold text-gray-500">
                        {item.count}
                      </span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-gray-100">
                      <div
                        className={`h-full rounded-full ${item.color}`}
                        style={{ width: `${item.width}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 border-t border-gray-100 pt-5">
              <h2 className="text-lg font-extrabold text-gray-900">Office Profile</h2>
              <dl className="mt-4 space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <dt className="text-[11px] font-semibold uppercase tracking-[0.16em] text-gray-500">
                    Account Holder
                  </dt>
                  <dd className="truncate text-sm font-bold text-gray-800">
                    {office.holder}
                  </dd>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <dt className="text-[11px] font-semibold uppercase tracking-[0.16em] text-gray-500">
                    Email
                  </dt>
                  <dd className="truncate font-mono text-xs font-medium text-gray-600">
                    {office.email}
                  </dd>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <dt className="text-[11px] font-semibold uppercase tracking-[0.16em] text-gray-500">
                    Office Code
                  </dt>
                  <dd className="font-mono text-xs font-bold text-gray-700">
                    {office.code}
                  </dd>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <dt className="text-[11px] font-semibold uppercase tracking-[0.16em] text-gray-500">
                    Avg. Response
                  </dt>
                  <dd className="font-mono text-xs font-bold text-gray-700">
                    {office.stats[4].value}
                  </dd>
                </div>
              </dl>
            </div>
          </aside>
        </section>
      </div>
    </OfficeLayout>
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
  const raw = useCountUp(numeric, 1200, index * 60);
  const formatted =
    numeric % 1 === 0 ? Math.round(raw).toLocaleString() : raw.toFixed(1);
  const isDown = stat.note.startsWith("-");

  return (
    <div className="flex flex-col justify-between gap-2 p-4 transition hover:bg-gray-50/40 sm:p-5">
      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-gray-500">
        {stat.title}
      </p>
      <p className="font-mono text-3xl font-bold tracking-tight text-gray-900">
        {formatted}
        {suffix && (
          <span className="ml-1 text-lg font-semibold text-gray-500">
            {suffix}
          </span>
        )}
      </p>
      <p className="font-mono text-[11px] font-medium text-gray-500">
        {isDown ? "↓" : "↑"} {stat.note}
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

function MapOverview({ incidents }) {
  const parks = [
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

  return (
    <div className="relative h-80 overflow-hidden rounded-2xl border border-gray-200/70 bg-[#edf2f5] sm:h-88">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.75),transparent_38%)]" />

      {parks.map((park) => (
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
      <span className="absolute left-[31%] bottom-[14%] text-xs font-bold text-gray-700 sm:text-sm">
        Bangcud
      </span>

      {incidents.map((incident) => (
        <button
          key={incident.id}
          title={incident.title}
          className={`absolute flex h-9 w-9 items-center justify-center rounded-full font-mono text-sm font-bold text-white shadow-md ring-2 ring-white/60 transition hover:scale-110 sm:h-10 sm:w-10 sm:text-base ${markerTone(
            incident.count
          )}`}
          style={{ top: incident.top, left: incident.left }}
        >
          {incident.count}
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

function ReportsByCategory({ categories }) {
  return (
    <div>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-lg font-extrabold text-gray-900">
          Reports by Category
        </h2>
        <button className="text-sm font-bold text-red-600 transition hover:text-red-700">
          View All
        </button>
      </div>

      <div className="mt-5 space-y-4">
        {categories.map((category) => (
          <div key={category.name} className="space-y-1.5">
            <div className="flex items-start justify-between gap-3 text-sm sm:items-center">
              <div className="flex min-w-0 items-center gap-2">
                <span className={`h-2 w-2 shrink-0 rounded-full ${category.color}`} />
                <span className="font-medium text-gray-700">{category.name}</span>
              </div>
              <span className="shrink-0 font-mono text-xs font-semibold text-gray-500">
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

function TopProblemAreas({ areas }) {
  return (
    <div>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-lg font-extrabold text-gray-900">
          Top Problem Areas
        </h2>
        <button className="text-sm font-bold text-red-600 transition hover:text-red-700">
          View All
        </button>
      </div>

      <div className="mt-4 space-y-3">
        {areas.map((item, index) => (
          <div
            key={item.area}
            className="grid grid-cols-[2.5rem_1fr_auto] items-center gap-3"
          >
            <span className="font-mono text-sm font-bold text-gray-500">
              {String(index + 1).padStart(2, "0")}
            </span>
            <p className="text-sm font-bold text-gray-800">{item.area}</p>
            <p className="font-mono text-xs font-medium text-gray-500">
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
    <tr className="border-b border-gray-100 transition last:border-b-0 hover:bg-gray-50/60">
      <td className="px-3 py-4 font-mono text-xs font-medium text-gray-500">
        {report.id}
      </td>
      <td className="px-3 py-4">
        <div className="flex items-center gap-2.5">
          <img
            src={report.image}
            alt={report.issue}
            className="h-10 w-10 rounded-md object-cover"
          />
          <div>
            <p className="text-sm font-bold text-gray-900">{report.issue}</p>
            <p className="text-xs text-gray-500">{report.barangay}</p>
          </div>
        </div>
      </td>
      <td className="px-3 py-4 text-sm font-medium text-gray-600">
        {report.location}
      </td>
      <td className="px-3 py-4 text-xs font-medium text-gray-500">
        {report.category}
      </td>
      <td className="px-3 py-4">
        <StatusBadge status={report.status} />
      </td>
      <td className="px-3 py-4 font-mono text-xs font-medium text-gray-500">
        {report.reported}
      </td>
      <td className="px-3 py-4">
        <button className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-700">
          <MoreHorizontal size={18} />
        </button>
      </td>
    </tr>
  );
}

function StatusBadge({ status }) {
  const styles = {
    "In Progress": { dot: "bg-red-600", text: "text-red-700" },
    "Under Review": { dot: "bg-amber-500", text: "text-amber-700" },
    Assigned: { dot: "bg-sky-600", text: "text-sky-700" },
    Pending: { dot: "bg-gray-400", text: "text-gray-500" },
    Resolved: { dot: "bg-emerald-600", text: "text-emerald-700" },
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