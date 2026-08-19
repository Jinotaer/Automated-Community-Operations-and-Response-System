import { useEffect, useState } from "react";
import { MapPin, Clock3, ArrowUpRight, X, Check } from "lucide-react";
import CitizenLayout from "../Layouts/CitizenLayouts";
import potholeImg from "../assets/pothole.jpg";
import streetlightImg from "../assets/light.jpg";
import outageImg from "../assets/outage.jpg";
import highwayImg from "../assets/national-highway.jpg";
import garbageAccImg from "../assets/garbage-acc.jpg";

const communityUpdates = [
  {
    id: "COMM-005",
    title: "Water leakage along the national road",
    location: "Sayre Highway, Bangcud",
    status: "Resolved",
    badge: "Resolved",
    badgeColor: "bg-red-100 text-red-600",
    dotColor: "bg-red-600",
    category: "Water Service",
    reportedAt: "June 7, 2026",
    description:
      "A water leak along the national road in Bangcud was wasting water and softening the road surface. The line has been repaired and the road fully restored.",
    timeline: [
      { label: "Report submitted", time: "June 7, 2026" },
      { label: "Received by City Hall", time: "June 7, 2026" },
      { label: "Assigned to City Water Services", time: "June 8, 2026" },
      { label: "Repairs completed", time: "June 12, 2026" },
      { label: "Marked resolved", time: "June 13, 2026" },
    ],
    image:
      "https://images.unsplash.com/photo-1541919329513-35f7af297129?q=80&w=400&auto=format&fit=crop",
  },
  {
    id: "COMM-006",
    title: "Pothole repaired along Dalwangan road",
    location: "Dalwangan, along the barangay road",
    status: "Resolved",
    badge: "Resolved",
    badgeColor: "bg-red-100 text-red-600",
    dotColor: "bg-red-600",
    category: "Road Damage",
    reportedAt: "June 5, 2026",
    description:
      "The pothole along the Dalwangan barangay road has been patched and compacted by the City Engineering Office. The area is safe again for vehicles and motorcycles.",
    timeline: [
      { label: "Report submitted", time: "June 5, 2026" },
      { label: "Received by City Hall", time: "June 5, 2026" },
      { label: "Assigned to City Engineering", time: "June 6, 2026" },
      { label: "Repairs completed", time: "June 9, 2026" },
      { label: "Marked resolved", time: "June 10, 2026" },
    ],
    image: potholeImg,
  },
  {
    id: "COMM-007",
    title: "Streetlight restored on Fortich Street",
    location: "Fortich St, Zone 3",
    status: "Resolved",
    badge: "Resolved",
    badgeColor: "bg-red-100 text-red-600",
    dotColor: "bg-red-600",
    category: "Streetlights",
    reportedAt: "June 4, 2026",
    description:
      "The faulty streetlight on Fortich Street was replaced and the stretch is fully lit again. Residents report no further issues along the walkway.",
    timeline: [
      { label: "Report submitted", time: "June 4, 2026" },
      { label: "Received by City Hall", time: "June 4, 2026" },
      { label: "Technician dispatched", time: "June 5, 2026" },
      { label: "Repairs completed", time: "June 8, 2026" },
      { label: "Marked resolved", time: "June 8, 2026" },
    ],
    image: streetlightImg,
  },
  {
    id: "COMM-008",
    title: "Streetlight outage fixed in Zone 2",
    location: "Zone 2, corner of the market road",
    status: "Resolved",
    badge: "Resolved",
    badgeColor: "bg-red-100 text-red-600",
    dotColor: "bg-red-600",
    category: "Streetlights",
    reportedAt: "June 2, 2026",
    description:
      "The darkened corner in Zone 2 near the market road has been restored. The wiring fault was traced and corrected by the maintenance crew.",
    timeline: [
      { label: "Report submitted", time: "June 2, 2026" },
      { label: "Received by City Hall", time: "June 2, 2026" },
      { label: "Technician dispatched", time: "June 3, 2026" },
      { label: "Repairs completed", time: "June 5, 2026" },
      { label: "Marked resolved", time: "June 6, 2026" },
    ],
    image: outageImg,
  },
  {
    id: "COMM-009",
    title: "Re-blocking completed along Sayre Highway",
    location: "Sayre Highway, Sumpong",
    status: "Resolved",
    badge: "Resolved",
    badgeColor: "bg-red-100 text-red-600",
    dotColor: "bg-red-600",
    category: "Road Damage",
    reportedAt: "May 28, 2026",
    description:
      "The damaged stretch along Sayre Highway in Sumpong was re-blocked and re-asphalted. The road is now level and safe for all vehicles.",
    timeline: [
      { label: "Report submitted", time: "May 28, 2026" },
      { label: "Received by City Hall", time: "May 28, 2026" },
      { label: "Assigned to City Engineering", time: "May 29, 2026" },
      { label: "Repairs completed", time: "June 2, 2026" },
      { label: "Marked resolved", time: "June 3, 2026" },
    ],
    image: highwayImg,
  },
  {
    id: "COMM-010",
    title: "Garbage cleared at the riverbank",
    location: "Sawaga River, Sumpong",
    status: "Resolved",
    badge: "Resolved",
    badgeColor: "bg-red-100 text-red-600",
    dotColor: "bg-red-600",
    category: "Garbage",
    reportedAt: "May 25, 2026",
    description:
      "The accumulated garbage along the Sawaga River was collected and hauled by the City Environment Office. The riverbank has been cleared and the area sanitized.",
    timeline: [
      { label: "Report submitted", time: "May 25, 2026" },
      { label: "Received by City Hall", time: "May 25, 2026" },
      { label: "Assigned to City Environment Office", time: "May 26, 2026" },
      { label: "Cleanup completed", time: "May 29, 2026" },
      { label: "Marked resolved", time: "May 30, 2026" },
    ],
    image: garbageAccImg,
  },
];

export default function CommunityUpdates() {
  const [selectedUpdate, setSelectedUpdate] = useState(null);

  return (
    <CitizenLayout hideNavigation={Boolean(selectedUpdate)}>
      <div className="lg:hidden">
        <section className="px-5 pt-5">
          <h1 className="text-2xl font-extrabold text-gray-900">
            Community Updates
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            See resolved complaints and the completed city response activity.
          </p>
        </section>

        <section className="space-y-4 px-5 pb-24 pt-4">
          {communityUpdates.length > 0 ? (
            communityUpdates.map((update) => (
              <MobileCommunityUpdateCard
                key={update.id}
                update={update}
                onSelect={() => setSelectedUpdate(update)}
              />
            ))
          ) : (
            <p className="py-10 text-center text-sm text-gray-400">
              No resolved complaints yet.
            </p>
          )}
        </section>
      </div>

      <div className="hidden lg:block">
        <header>
          <h1 className="text-3xl font-extrabold text-gray-900">
            Community Updates
          </h1>
          <p className="mt-1 text-gray-500">
            Resolved citizen complaints and completed response updates across
            Malaybalay City.
          </p>
        </header>

        <section className="mt-8 grid grid-cols-4 gap-6">
          <SummaryCard title="Public Reports" value="128" color="text-red-600" />
          <SummaryCard title="Resolved" value="85" color="text-red-600" />
          <SummaryCard title="Resolved This Month" value="31" color="text-blue-600" />
          <SummaryCard title="Resolved This Week" value="6" color="text-green-600" />
        </section>

        <section className="mt-8 rounded-3xl bg-white p-6 shadow-sm">
          <div className="grid gap-4">
            {communityUpdates.length > 0 ? (
              communityUpdates.map((update) => (
                <DesktopCommunityUpdateCard
                  key={update.id}
                  update={update}
                  onSelect={() => setSelectedUpdate(update)}
                />
              ))
            ) : (
              <p className="py-10 text-center text-sm text-gray-400">
                No resolved complaints yet.
              </p>
            )}
          </div>
        </section>
      </div>

      {selectedUpdate && (
        <UpdateDetailModal
          update={selectedUpdate}
          onClose={() => setSelectedUpdate(null)}
        />
      )}
    </CitizenLayout>
  );
}

function MobileCommunityUpdateCard({ update, onSelect }) {
  return (
    <button
      onClick={onSelect}
      className="w-full rounded-2xl bg-white p-3 text-left shadow-sm transition hover:scale-[1.01]"
    >
      <div className="flex items-center gap-3">
        <img
          src={update.image}
          alt={update.title}
          className="h-20 w-20 shrink-0 rounded-xl object-cover"
        />

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <h2 className="line-clamp-2 text-base font-extrabold leading-snug text-gray-900">
              {update.title}
            </h2>

            <span
              className={`shrink-0 rounded-full px-3 py-1 text-[10px] font-bold ${update.badgeColor}`}
            >
              {update.badge}
            </span>
          </div>

          <p className="mt-1 line-clamp-1 text-sm font-medium text-gray-600">
            {update.location}
          </p>

          <div className="mt-2 flex items-center gap-2">
            <span className={`h-2 w-2 rounded-full ${update.dotColor}`} />
            <p className="text-[11px] font-medium text-gray-600">
              {update.status}
            </p>
          </div>
        </div>
      </div>
    </button>
  );
}

function DesktopCommunityUpdateCard({ update, onSelect }) {
  return (
    <div
      onClick={onSelect}
      className="flex cursor-pointer items-center gap-5 rounded-2xl border border-gray-100 bg-white p-4 transition hover:border-red-200 hover:bg-red-50/30"
    >
      <img
        src={update.image}
        alt={update.title}
        className="h-24 w-32 rounded-2xl object-cover"
      />

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="flex items-center gap-3">
              <h2 className="line-clamp-1 text-lg font-extrabold text-gray-900">
                {update.title}
              </h2>
              <span
                className={`shrink-0 rounded-full px-3 py-1 text-[10px] font-bold ${update.badgeColor}`}
              >
                {update.badge}
              </span>
            </div>

            <div className="mt-2 flex items-center gap-2 text-sm text-gray-500">
              <MapPin size={15} />
              <span>{update.location}</span>
            </div>

            <div className="mt-2 flex items-center gap-2 text-sm text-gray-500">
              <Clock3 size={15} />
              <span>{update.reportedAt}</span>
            </div>
          </div>

          <div className="text-right">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
              Category
            </p>
            <p className="mt-1 font-bold text-gray-800">{update.category}</p>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className={`h-2.5 w-2.5 rounded-full ${update.dotColor}`} />
            <p className="text-sm font-semibold text-gray-700">{update.status}</p>
          </div>

          <span
            onClick={onSelect}
            className="flex cursor-pointer items-center gap-2 rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
          >
            View Update
            <ArrowUpRight size={16} />
          </span>
        </div>
      </div>
    </div>
  );
}

function SummaryCard({ title, value, color }) {
  return (
    <div className="rounded-3xl bg-white p-6 shadow-sm">
      <p className="text-sm font-medium text-gray-500">{title}</p>
      <h2 className={`mt-3 text-4xl font-extrabold ${color}`}>{value}</h2>
    </div>
  );
}

function UpdateDetailModal({ update, onClose }) {
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

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-end justify-center bg-zinc-950/60 backdrop-blur-sm animate-fade-in sm:items-center sm:p-6"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`${update.title} — details`}
        onClick={(event) => event.stopPropagation()}
        className="max-h-[92dvh] w-full max-w-lg overflow-y-auto rounded-t-[2rem] bg-white shadow-2xl animate-modal-in sm:rounded-[2rem]"
      >
        <div className="relative h-56 shrink-0 sm:h-64">
          <img
            src={update.image}
            alt={update.title}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/75 via-zinc-950/10 to-transparent" />

          <button
            type="button"
            onClick={onClose}
            aria-label="Close update details"
            className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-zinc-700 shadow-md transition hover:bg-white hover:text-zinc-900"
          >
            <X size={18} />
          </button>

          <div className="absolute bottom-4 left-5 right-5">
            <span
              className={`rounded-full px-3 py-1 text-[10px] font-bold ${update.badgeColor}`}
            >
              {update.badge}
            </span>
            <h2 className="mt-2 text-2xl font-extrabold leading-tight text-white">
              {update.title}
            </h2>
          </div>
        </div>

        <div className="p-6">
          <div className="flex items-center gap-2">
            <span className={`h-2.5 w-2.5 rounded-full ${update.dotColor}`} />
            <p className="text-sm font-bold text-gray-800">{update.status}</p>
            <span className="ml-auto text-xs font-semibold text-gray-400">
              Ref: {update.id}
            </span>
          </div>

          <div className="mt-5 grid grid-cols-1 gap-3 rounded-2xl bg-gray-50 p-4 sm:grid-cols-2">
            <MetaItem icon={<MapPin size={15} />} label="Location" value={update.location} />
            <MetaItem icon={<Clock3 size={15} />} label="Reported" value={update.reportedAt} />
            <MetaItem label="Category" value={update.category} />
            <MetaItem label="Type" value="Public report" />
          </div>

          <p className="mt-5 text-sm leading-6 text-gray-600">
            {update.description}
          </p>

          <div className="mt-6">
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-gray-400">
              Response Timeline
            </h3>
            <div className="mt-4 space-y-0">
              {update.timeline.map((step, index) => (
                <TimelineStep
                  key={step.label}
                  step={step}
                  isLast={index === update.timeline.length - 1}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MetaItem({ icon, label, value }) {
  return (
    <div className="flex items-center gap-3">
      {icon && (
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-600">
          {icon}
        </span>
      )}
      <div className="min-w-0">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">
          {label}
        </p>
        <p className="truncate text-sm font-bold text-gray-800">{value}</p>
      </div>
    </div>
  );
}

function TimelineStep({ step, isLast }) {
  const isDone = step.time !== "";
  const isCurrent = !isDone;

  return (
    <div className="relative flex gap-4 pb-6">
      {!isLast && (
        <span
          className={`absolute left-[13px] top-7 h-[calc(100%-1.75rem)] w-px ${
            isDone ? "bg-red-200" : "bg-gray-200"
          }`}
        />
      )}

      <span className="relative mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center">
        {isDone ? (
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-red-600 text-white">
            <Check size={14} strokeWidth={3} />
          </span>
        ) : isCurrent ? (
          <span className="relative flex h-7 w-7 items-center justify-center">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-600 opacity-30" />
            <span className="relative flex h-3.5 w-3.5 rounded-full border-[3px] border-red-600 bg-white" />
          </span>
        ) : (
          <span className="h-3.5 w-3.5 rounded-full border-2 border-gray-300 bg-white" />
        )}
      </span>

      <div className="min-w-0 pt-0.5">
        <p
          className={`text-sm font-semibold ${
            isDone ? "text-gray-900" : isCurrent ? "text-red-700" : "text-gray-400"
          }`}
        >
          {step.label}
          {isCurrent && (
            <span className="ml-2 rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-bold text-red-600">
              IN PROGRESS
            </span>
          )}
        </p>
        {isDone && <p className="mt-0.5 text-xs text-gray-400">{step.time}</p>}
      </div>
    </div>
  );
}
