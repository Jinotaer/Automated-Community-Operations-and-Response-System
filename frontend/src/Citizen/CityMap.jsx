// src/Citizen/CityMap.jsx
import { useState } from "react";
import {
  Layers,
  Navigation,
  MapPin,
  AlertTriangle,
  Droplets,
  Trash2,
  Lightbulb,
  TreePine,
  MoreHorizontal,
} from "lucide-react";
import CitizenLayout from "../Layouts/CitizenLayouts";

const filters = ["All", "Pothole", "Flooding", "Garbage", "Streetlight"];

const incidents = [
  { id: 1, count: 12, top: "20%", left: "18%", color: "text-red-600", title: "Road Damage" },
  { id: 2, count: 5, top: "32%", left: "34%", color: "text-blue-600", title: "Flooding" },
  { id: 3, count: 3, top: "17%", left: "62%", color: "text-purple-500", title: "Fallen Tree" },
  { id: 4, count: 6, top: "26%", left: "80%", color: "text-red-600", title: "Garbage" },
  { id: 5, count: 8, top: "47%", left: "24%", color: "text-blue-600", title: "Drainage" },
  { id: 6, count: 8, top: "41%", left: "43%", color: "text-orange-500", title: "Streetlight" },
  { id: 7, count: 6, top: "47%", left: "72%", color: "text-red-600", title: "Illegal Dumping" },
  { id: 8, count: 3, top: "61%", left: "61%", color: "text-red-600", title: "Pothole" },
  { id: 9, count: 4, top: "71%", left: "77%", color: "text-yellow-500", title: "Broken Streetlight" },
  { id: 10, count: 5, top: "76%", left: "23%", color: "text-blue-600", title: "Flooding" },
  { id: 11, count: 8, top: "39%", left: "8%", color: "text-red-600", title: "Garbage" },
];

const legends = [
  {
    label: "Pothole / Road Damage",
    description: "Street surface hazards",
    icon: <AlertTriangle size={14} />,
    iconClass: "bg-red-600 text-white",
    panelClass: "border-red-100 bg-red-50/70",
    titleClass: "text-red-900",
  },
  {
    label: "Drainage / Flooding",
    description: "Water and drainage issues",
    icon: <Droplets size={14} />,
    iconClass: "bg-blue-600 text-white",
    panelClass: "border-blue-100 bg-blue-50/70",
    titleClass: "text-blue-900",
  },
  {
    label: "Illegal Dumping / Garbage",
    description: "Waste and cleanup concerns",
    icon: <Trash2 size={14} />,
    iconClass: "bg-red-600 text-white",
    panelClass: "border-red-100 bg-red-50/70",
    titleClass: "text-red-900",
  },
  {
    label: "Broken Streetlight",
    description: "Lighting and visibility",
    icon: <Lightbulb size={14} />,
    iconClass: "bg-yellow-500 text-white",
    panelClass: "border-yellow-100 bg-yellow-50/70",
    titleClass: "text-yellow-900",
  },
  {
    label: "Fallen Tree / Obstruction",
    description: "Blocked or unsafe paths",
    icon: <TreePine size={14} />,
    iconClass: "bg-purple-500 text-white",
    panelClass: "border-purple-100 bg-purple-50/70",
    titleClass: "text-purple-900",
  },
  {
    label: "Others",
    description: "Other community reports",
    icon: <MoreHorizontal size={14} />,
    iconClass: "bg-gray-500 text-white",
    panelClass: "border-gray-200 bg-gray-50/80",
    titleClass: "text-gray-900",
  },
];

export default function CityMap() {
  const [activeFilter, setActiveFilter] = useState("All");

  return (
    <CitizenLayout>
      {/* Mobile View */}
      <div className="lg:hidden">
        <section className="px-5 pt-5">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`shrink-0 rounded-full px-4 py-2 text-xs font-bold transition-colors ${
                  activeFilter === filter
                    ? "bg-red-600 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-red-50 hover:text-red-600"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </section>

        <main className="px-5 pt-3">
          <MapCard activeFilter={activeFilter} />

          <section className="mt-4 rounded-3xl border border-gray-100 bg-white p-5 shadow-lg">
            <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-gray-200" />

            <h2 className="text-sm font-extrabold text-gray-900">
              Map Legend
            </h2>
            <p className="mt-1 text-xs text-gray-500">
              Understand what each map pin represents.
            </p>

            <div className="mt-4 grid grid-cols-2 gap-3">
              {legends.map((legend) => (
                <LegendItem key={legend.label} legend={legend} />
              ))}
            </div>
          </section>
        </main>
      </div>

      {/* Desktop View */}
      <div className="hidden lg:block">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">City Map</h1>
            <p className="mt-1 text-gray-500">
              Monitor active community issues across Malaybalay City.
            </p>
          </div>

          <button className="rounded-2xl bg-red-600 px-5 py-3 text-sm font-semibold text-white hover:bg-red-700">
            Report New Issue
          </button>
        </header>

        <section className="mt-8 grid grid-cols-12 gap-6">
          <div className="col-span-8 rounded-3xl bg-white p-5 shadow-sm">
            <div className="mb-5 flex flex-wrap gap-2">
              {filters.map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`rounded-full px-5 py-2 text-sm font-bold transition-colors ${
                    activeFilter === filter
                      ? "bg-red-600 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-red-50 hover:text-red-600"
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>

            <div className="h-[560px] overflow-hidden rounded-3xl">
              <MapCard desktop activeFilter={activeFilter} />
            </div>
          </div>

          <aside className="col-span-4 space-y-6">
            <div className="rounded-3xl bg-white p-6 shadow-sm">
              <h2 className="text-lg font-extrabold text-gray-900">
                Map Legend
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Issue categories currently visible on the city map.
              </p>

              <div className="mt-5 space-y-3">
                {legends.map((legend) => (
                  <LegendItem key={legend.label} legend={legend} desktop />
                ))}
              </div>
            </div>

            <div className="rounded-3xl bg-white p-6 shadow-sm">
              <h2 className="text-lg font-extrabold text-gray-900">
                Hotspot Areas
              </h2>

              <div className="mt-5 space-y-3">
                <HotspotItem area="Casisang" count="18 reports" />
                <HotspotItem area="Sumpong" count="12 reports" />
                <HotspotItem area="Kalasungay" count="9 reports" />
              </div>
            </div>
          </aside>
        </section>
      </div>
    </CitizenLayout>
  );
}

function MapCard({ desktop = false, activeFilter = "All" }) {
  const visibleIncidents =
    activeFilter === "All"
      ? incidents
      : incidents.filter((i) =>
          i.title.toLowerCase().includes(activeFilter.toLowerCase()),
        );
  const majorRoads = [
    "left-[-6%] top-[12%] h-4 w-[120%] rotate-[-11deg]",
    "left-[-4%] top-[28%] h-4 w-[116%] rotate-[7deg]",
    "left-[6%] top-[44%] h-4 w-[108%] rotate-[-8deg]",
    "left-[14%] top-[61%] h-4 w-[102%] rotate-[10deg]",
    "left-[20%] top-[79%] h-4 w-[92%] rotate-[-6deg]",
    "left-[12%] top-[-4%] h-[114%] w-4 rotate-[12deg]",
    "left-[30%] top-[-6%] h-[118%] w-4 rotate-[-9deg]",
    "left-[48%] top-[-8%] h-[122%] w-4 rotate-[8deg]",
    "left-[66%] top-[-4%] h-[114%] w-4 rotate-[-10deg]",
    "left-[82%] top-[2%] h-[106%] w-4 rotate-[12deg]",
  ];

  const minorRoads = [
    "left-[2%] top-[6%] h-2 w-[108%] rotate-[2deg]",
    "left-[0%] top-[20%] h-2 w-[112%] rotate-[-5deg]",
    "left-[8%] top-[36%] h-2 w-[104%] rotate-[3deg]",
    "left-[6%] top-[52%] h-2 w-[106%] rotate-[-4deg]",
    "left-[12%] top-[68%] h-2 w-[100%] rotate-[4deg]",
    "left-[18%] top-[86%] h-2 w-[88%] rotate-[-3deg]",
    "left-[22%] top-[-4%] h-[108%] w-2 rotate-[8deg]",
    "left-[40%] top-[-6%] h-[112%] w-2 rotate-[-7deg]",
    "left-[58%] top-[-6%] h-[114%] w-2 rotate-[6deg]",
    "left-[74%] top-[-2%] h-[108%] w-2 rotate-[-8deg]",
    "left-[90%] top-[4%] h-[98%] w-2 rotate-[7deg]",
  ];

  const parks = [
    "left-[6%] top-[10%] h-16 w-16",
    "left-[74%] top-[10%] h-14 w-14",
    "left-[53%] top-[41%] h-12 w-12",
    "left-[16%] top-[64%] h-[4.5rem] w-20",
    "left-[76%] top-[70%] h-16 w-16",
  ];

  return (
    <div
      className={`relative overflow-hidden bg-[#edf2f5] ${
        desktop ? "h-full rounded-3xl" : "h-[360px] rounded-3xl shadow-sm"
      }`}
    >
      {parks.map((park) => (
        <div key={park} className={`absolute rounded-md bg-[#d8efcc] ${park}`} />
      ))}

      {majorRoads.map((street) => (
        <div
          key={street}
          className={`absolute rounded-full bg-white/95 shadow-[0_0_0_1px_rgba(203,213,225,0.35)] ${street}`}
        />
      ))}

      {minorRoads.map((street) => (
        <div
          key={street}
          className={`absolute rounded-full bg-white/90 shadow-[0_0_0_1px_rgba(226,232,240,0.45)] ${street}`}
        />
      ))}

      {/* Place labels */}
      <span className="absolute left-[38%] top-[12%] text-xs font-bold text-gray-700">
        Kalasungay
      </span>
      <span className="absolute left-[36%] top-[48%] text-xs font-bold text-gray-700">
        Casisang
      </span>
      <span className="absolute right-[16%] top-[42%] text-xs font-bold text-gray-700">
        Sumpong
      </span>

      {/* Markers */}
      {visibleIncidents.map((incident) => (
        <button
          key={incident.id}
          title={`${incident.title} (${incident.count})`}
          aria-label={`${incident.title} (${incident.count})`}
          className="absolute -translate-x-1/2 -translate-y-full transition-opacity duration-300"
          style={{
            top: incident.top,
            left: incident.left,
          }}
        >
          <MapPin
            size={desktop ? 30 : 26}
            className={`${incident.color} fill-current drop-shadow-[0_10px_18px_rgba(15,23,42,0.18)]`}
          />
        </button>
      ))}

      <div className="absolute left-[52%] top-[62%] -translate-x-1/2 -translate-y-1/2">
        <div className="absolute left-1/2 top-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-full bg-sky-400/20 blur-md" />
        <Navigation
          size={desktop ? 42 : 36}
          fill="currentColor"
          strokeWidth={1.8}
          className="relative rotate-[18deg] text-sky-500 drop-shadow-[0_12px_20px_rgba(59,130,246,0.28)]"
        />
      </div>

      {/* Floating map controls */}
      <div className="absolute right-4 top-[58%] space-y-3">
        <button className="flex h-11 w-11 items-center justify-center rounded-full bg-white shadow-md">
          <Layers size={19} />
        </button>

        <button className="flex h-11 w-11 items-center justify-center rounded-full bg-white shadow-md">
          <Navigation size={19} />
        </button>
      </div>
    </div>
  );
}

function LegendItem({ legend, desktop = false }) {
  return (
    <div
      className={`rounded-2xl border p-3 ${
        legend.panelClass
      } ${desktop ? "flex items-center gap-3" : "min-h-[92px]"}`}
    >
      <div
        className={`flex items-center justify-center rounded-2xl shadow-sm ${
          legend.iconClass
        } ${desktop ? "h-11 w-11" : "h-9 w-9"}`}
      >
        {legend.icon}
      </div>

      <div className={desktop ? "min-w-0" : "mt-3"}>
        <p
          className={`font-extrabold leading-tight ${
            desktop ? "text-sm" : "text-[11px]"
          } ${legend.titleClass}`}
        >
          {legend.label}
        </p>
        <p
          className={`mt-1 text-gray-500 ${
            desktop ? "text-xs" : "text-[10px]"
          }`}
        >
          {legend.description}
        </p>
      </div>
    </div>
  );
}

function HotspotItem({ area, count }) {
  return (
    <div className="flex items-center justify-between rounded-2xl bg-gray-50 p-4">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 text-red-600">
          <MapPin size={18} />
        </div>
        <div>
          <p className="font-bold text-gray-900">{area}</p>
          <p className="text-sm text-gray-500">{count}</p>
        </div>
      </div>

      <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-bold text-red-600">
        Hotspot
      </span>
    </div>
  );
}
