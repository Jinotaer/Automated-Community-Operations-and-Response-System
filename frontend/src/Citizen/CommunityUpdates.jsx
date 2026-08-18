import { useEffect, useState } from "react";
import { MapPin, Clock3, ArrowUpRight, X, Check } from "lucide-react";
import CitizenLayout from "../Layouts/CitizenLayouts";

const filters = ["All", "New", "Pending", "In Progress", "Resolved"];

const communityUpdates = [
  {
    id: "COMM-001",
    title: "Pothole reported near the main road",
    location: "Barangay 5, near the main road",
    status: "Pending Review",
    badge: "New",
    badgeColor: "bg-red-100 text-red-600",
    dotColor: "bg-orange-500",
    category: "Road Damage",
    reportedAt: "Today, 9:20 AM",
    description:
      "A pothole has formed along the main road in Barangay 5, forcing vehicles to swerve around it. Residents are concerned it will deepen further once the rains come.",
    timeline: [
      { label: "Report submitted", time: "Today, 9:20 AM" },
      { label: "Received by City Hall", time: "Today, 9:35 AM" },
      { label: "Under LGU review", time: "" },
    ],
    image:
      "https://images.unsplash.com/photo-1594230614807-2f2791c1bb7b?q=80&w=400&auto=format&fit=crop",
  },
  {
    id: "COMM-002",
    title: "Streetlight outage near Fortich Street",
    location: "Fortich St, Zone 3",
    status: "Technician Dispatched",
    badge: "2h ago",
    badgeColor: "bg-gray-100 text-gray-600",
    dotColor: "bg-red-600",
    category: "Streetlights",
    reportedAt: "Today, 7:05 AM",
    description:
      "The streetlight along Fortich Street has been out since last night, leaving the stretch of road dark for pedestrians and passing vehicles.",
    timeline: [
      { label: "Report submitted", time: "Today, 7:05 AM" },
      { label: "Received by City Hall", time: "Today, 7:12 AM" },
      { label: "Assigned to City Engineering", time: "Today, 8:40 AM" },
      { label: "Technician dispatched", time: "" },
    ],
    image:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=400&auto=format&fit=crop",
  },
  {
    id: "COMM-003",
    title: "Drainage blockage beside the public market",
    location: "Poblacion Public Market",
    status: "Under Review",
    badge: "4h ago",
    badgeColor: "bg-blue-100 text-blue-700",
    dotColor: "bg-blue-500",
    category: "Drainage",
    reportedAt: "Today, 5:40 AM",
    description:
      "Blocked drainage beside the public market is pooling water along the walkway, especially after the early morning rain. Vendors report standing water at stall entrances.",
    timeline: [
      { label: "Report submitted", time: "Today, 5:40 AM" },
      { label: "Received by City Hall", time: "Today, 5:55 AM" },
      { label: "Under LGU review", time: "" },
    ],
    image:
      "https://images.unsplash.com/photo-1527482797697-8795b05a13fe?q=80&w=400&auto=format&fit=crop",
  },
  {
    id: "COMM-004",
    title: "Garbage accumulation near the riverbank",
    location: "Sawaga River, Sumpong",
    status: "Cleanup Scheduled",
    badge: "Yesterday",
    badgeColor: "bg-yellow-100 text-yellow-700",
    dotColor: "bg-yellow-500",
    category: "Garbage",
    reportedAt: "June 8, 2026",
    description:
      "Garbage has been accumulating along the riverbank in Sumpong, with nearby households reporting a strong odor. The City Environment Office has scheduled a cleanup.",
    timeline: [
      { label: "Report submitted", time: "June 8, 2026" },
      { label: "Received by City Hall", time: "June 8, 2026" },
      { label: "Assigned to City Environment Office", time: "June 9, 2026" },
      { label: "Cleanup scheduled", time: "" },
    ],
    image:
      "https://images.unsplash.com/photo-1604187351574-c75ca79f5807?q=80&w=400&auto=format&fit=crop",
  },
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
];

export default function CommunityUpdates() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [selectedUpdate, setSelectedUpdate] = useState(null);

  const filteredUpdates =
    activeFilter === "All"
      ? communityUpdates
      : communityUpdates.filter((u) => u.badge === activeFilter);

  return (
    <CitizenLayout hideNavigation={Boolean(selectedUpdate)}>
      <div className="lg:hidden">
        <section className="px-5 pt-5">
          <h1 className="text-2xl font-extrabold text-gray-900">
            Community Updates
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            See public reports and the latest city response activity.
          </p>
        </section>

        <section className="px-5 pt-4">
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

        <section className="space-y-4 px-5 pb-24 pt-2">
          {filteredUpdates.length > 0 ? (
            filteredUpdates.map((update) => (
              <MobileCommunityUpdateCard
                key={update.id}
                update={update}
                onSelect={() => setSelectedUpdate(update)}
              />
            ))
          ) : (
            <p className="py-10 text-center text-sm text-gray-400">
              No updates found for &ldquo;{activeFilter}&rdquo;.
            </p>
          )}
        </section>
      </div>

      <div className="hidden lg:block">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">
              Community Updates
            </h1>
            <p className="mt-1 text-gray-500">
              Public citizen reports and visible response updates across
              Malaybalay City.
            </p>
          </div>

          <div className="flex gap-2">
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
        </header>

        <section className="mt-8 grid grid-cols-4 gap-6">
          <SummaryCard title="Public Reports" value="128" color="text-red-600" />
          <SummaryCard title="New Today" value="14" color="text-blue-600" />
          <SummaryCard title="In Review" value="29" color="text-yellow-600" />
          <SummaryCard title="Resolved" value="85" color="text-red-600" />
        </section>

        <section className="mt-8 rounded-3xl bg-white p-6 shadow-sm">
          <div className="grid gap-4">
            {filteredUpdates.length > 0 ? (
              filteredUpdates.map((update) => (
                <DesktopCommunityUpdateCard
                  key={update.id}
                  update={update}
                  onSelect={() => setSelectedUpdate(update)}
                />
              ))
            ) : (
              <p className="py-10 text-center text-sm text-gray-400">
                No updates found for &ldquo;{activeFilter}&rdquo;.
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
