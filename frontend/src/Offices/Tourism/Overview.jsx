// src/Offices/Tourism/Overview.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Megaphone,
  TrendingUp,
  ArrowUpRight,
  Sparkles,
  Camera,
  Clock3,
  Plus,
} from "lucide-react";
import OfficeLayout from "../OfficeLayout";
import { tourismOffice } from "../officeData";
import { getAnnouncements } from "../../services/announcements";
import tourismHighlands from "../../assets/tourism-highlands.jpg";
import tourismFestival from "../../assets/tourism-festival.jpg";
import tourismMountain from "../../assets/tourism-mountain.jpg";

const stats = [
  { title: "Announcements Published", value: 7, note: "+2 this week" },
  { title: "Active Events", value: 3, note: "Kaamulan month" },
  { title: "Monthly Visitors", value: 12.4, suffix: "k", note: "highland tours" },
  { title: "Social Followers", value: 48.2, suffix: "k", note: "citywide reach" },
  { title: "Avg. Event Reach", value: 6.1, suffix: "k", note: "per post" },
];

const featuredEvents = [
  {
    title: "Kaamulan Cultural Parade",
    date: "Sat, June 20 · 8:00 AM",
    venue: "Central Plaza, Malaybalay City",
    image: tourismFestival,
  },
  {
    title: "Sunrise Trek at Kalatungan",
    date: "Sun, June 21 · 4:00 AM",
    venue: "Sayre Highway trailhead",
    image: tourismMountain,
  },
  {
    title: "Highland Food & Craft Fair",
    date: "June 27-28 · 9:00 AM",
    venue: "City Plaza grounds",
    image: tourismHighlands,
  },
];

export default function Overview() {
  const posts = getAnnouncements().filter(
    (post) => post.officeSlug === "tourism"
  );

  useEffect(() => {
    document.title = "Tourism Overview — ACORS";
  }, []);

  return (
    <OfficeLayout office={tourismOffice} header="Tourism Overview">
      <div className="space-y-5 sm:space-y-6">
        {/* Header */}
        <header className="flex animate-fade-up flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.22em] text-gray-500">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-600 opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-red-600" />
              </span>
              Malaybalay · City Tourism Office
            </p>
            <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">
              Tourism Overview
            </h1>
          </div>

          <Link
            to="/department/tourism/announcements"
            className="flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition duration-300 hover:bg-red-700 active:translate-y-px"
          >
            <Plus size={16} />
            Post announcement
          </Link>
        </header>

        {/* Hero banner */}
        <section
          className="relative animate-fade-up overflow-hidden rounded-3xl border border-gray-200/70 shadow-sm"
          style={{ animationDelay: "40ms" }}
        >
          <img
            src={tourismHighlands}
            alt="Malaybalay highland view"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-zinc-950/85 via-zinc-950/55 to-zinc-950/10" />

          <div className="relative px-6 py-10 sm:px-10 sm:py-14">
            <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.22em] text-red-300">
              <Sparkles size={14} />
              City of Malaybalay
            </p>
            <h2 className="mt-3 max-w-xl text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-4xl">
              Bring every corner of Malaybalay to its visitors.
            </h2>
            <p className="mt-3 max-w-md text-sm leading-6 text-zinc-200">
              Share events, trail advisories, and cultural highlights straight
              to the citizen portal.
            </p>

            <Link
              to="/department/tourism/announcements"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-red-600 px-5 py-3 text-sm font-bold text-white shadow-sm transition duration-300 hover:bg-red-500 active:translate-y-px"
            >
              <Megaphone size={16} />
              Write an announcement
              <ArrowUpRight size={15} />
            </Link>
          </div>
        </section>

        {/* Stat band */}
        <section
          className="grid animate-fade-up grid-cols-1 divide-y divide-gray-100 rounded-3xl border border-gray-200/70 bg-white shadow-sm sm:grid-cols-2 xl:grid-cols-5 xl:divide-x xl:divide-y-0"
          style={{ animationDelay: "80ms" }}
        >
          {stats.map((stat, index) => (
            <StatCell key={stat.title} stat={stat} index={index} />
          ))}
        </section>

        {/* Announcements + Sidebar */}
        <section className="grid gap-6 xl:grid-cols-12">
          <div
            className="animate-fade-up rounded-3xl border border-gray-200/70 bg-white p-4 shadow-sm sm:p-5 xl:col-span-8"
            style={{ animationDelay: "140ms" }}
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="text-lg font-extrabold text-gray-900">
                Latest Announcements
              </h2>
              <Link
                to="/department/tourism/announcements"
                className="flex items-center gap-1.5 text-sm font-bold text-red-600 transition hover:text-red-700"
              >
                Manage posts
                <ArrowUpRight size={15} />
              </Link>
            </div>

            {posts.length === 0 ? (
              <div className="mt-5 flex flex-col items-center rounded-2xl border border-dashed border-gray-200 px-6 py-12 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-600">
                  <Megaphone size={24} />
                </div>
                <p className="mt-4 text-sm font-bold text-gray-800">
                  No announcements yet
                </p>
                <p className="mt-1 max-w-xs text-xs leading-5 text-gray-500">
                  Your posts appear here and on the citizen portal feed.
                </p>
                <Link
                  to="/department/tourism/announcements"
                  className="mt-5 flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-bold text-white transition duration-300 hover:bg-red-700 active:translate-y-px"
                >
                  <Plus size={16} />
                  Write the first post
                </Link>
              </div>
            ) : (
              <div className="mt-5 grid gap-4 md:grid-cols-2">
                {posts.map((post, index) => (
                  <article
                    key={post.id}
                    className="group animate-fade-up overflow-hidden rounded-2xl border border-gray-200/70 bg-white shadow-sm transition duration-300 hover:-translate-y-0.5 hover:border-red-200 hover:shadow-md"
                    style={{ animationDelay: `${index * 90}ms` }}
                  >
                    {post.image && (
                      <div className="aspect-[16/9] w-full overflow-hidden bg-gray-100">
                        <img
                          src={post.image}
                          alt="Announcement photo"
                          className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.05]"
                        />
                      </div>
                    )}
                    <div className="p-4">
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-xs font-medium text-gray-400">
                          {post.postedAt}
                        </p>
                        <span className="shrink-0 rounded-full bg-red-50 px-2.5 py-1 text-[10px] font-bold tracking-wide text-red-600">
                          LIVE
                        </span>
                      </div>
                      <p className="mt-2 line-clamp-3 text-sm leading-6 text-gray-700">
                        {post.caption}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>

          <aside
            className="animate-fade-up space-y-6 xl:col-span-4"
            style={{ animationDelay: "200ms" }}
          >
            <div className="rounded-3xl border border-gray-200/70 bg-white p-4 shadow-sm sm:p-5">
              <h2 className="text-lg font-extrabold text-gray-900">
                Quick Actions
              </h2>
              <div className="mt-4 space-y-2.5">
                <QuickAction
                  icon={<Megaphone size={17} />}
                  label="Post an announcement"
                  note={`${posts.length} live on the portal`}
                  to="/department/tourism/announcements"
                />
                <QuickAction
                  icon={<Camera size={17} />}
                  label="View citizen feed"
                  note="See how posts appear"
                  to="/announcements"
                />
              </div>
            </div>

            <div className="rounded-3xl border border-gray-200/70 bg-white p-4 shadow-sm sm:p-5">
              <h2 className="text-lg font-extrabold text-gray-900">
                Featured Events
              </h2>
              <div className="mt-4 space-y-3">
                {featuredEvents.map((event) => (
                  <div
                    key={event.title}
                    className="flex items-center gap-3 rounded-2xl border border-gray-100 p-2.5"
                  >
                    <img
                      src={event.image}
                      alt={event.title}
                      className="h-14 w-14 shrink-0 rounded-xl object-cover"
                    />
                    <div className="min-w-0">
                      <p className="line-clamp-2 text-sm font-bold leading-snug text-gray-800">
                        {event.title}
                      </p>
                      <p className="mt-1 flex items-center gap-1 text-[11px] font-medium text-gray-500">
                        <Clock3 size={11} />
                        {event.date}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-gray-200/70 bg-white p-4 shadow-sm sm:p-5">
              <h2 className="text-lg font-extrabold text-gray-900">
                Office Profile
              </h2>
              <dl className="mt-4 space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <dt className="text-[11px] font-semibold uppercase tracking-[0.16em] text-gray-500">
                    Account Holder
                  </dt>
                  <dd className="truncate text-sm font-bold text-gray-800">
                    Liza Fernandez
                  </dd>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <dt className="text-[11px] font-semibold uppercase tracking-[0.16em] text-gray-500">
                    Email
                  </dt>
                  <dd className="truncate font-mono text-xs font-medium text-gray-600">
                    tourism@malaybalay.gov.ph
                  </dd>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <dt className="text-[11px] font-semibold uppercase tracking-[0.16em] text-gray-500">
                    Office Code
                  </dt>
                  <dd className="font-mono text-xs font-bold text-gray-700">
                    DEPT-005
                  </dd>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <dt className="text-[11px] font-semibold uppercase tracking-[0.16em] text-gray-500">
                    Role
                  </dt>
                  <dd className="font-mono text-xs font-bold text-gray-700">
                    Office Admin
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

function QuickAction({ icon, label, note, to }) {
  return (
    <Link
      to={to}
      className="group flex items-center gap-3 rounded-2xl border border-gray-200/70 bg-gray-50/50 p-3.5 transition hover:border-red-200 hover:bg-red-50/40"
    >
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-red-600 shadow-sm ring-1 ring-gray-200/70">
        {icon}
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-bold text-gray-800">{label}</p>
        <p className="text-xs text-gray-500">{note}</p>
      </div>
      <ArrowUpRight
        size={16}
        className="text-gray-400 transition group-hover:text-red-600"
      />
    </Link>
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
  const raw = useCountUp(stat.value, 1200, index * 60);
  const formatted =
    stat.value % 1 === 0 ? Math.round(raw).toLocaleString() : raw.toFixed(1);

  return (
    <div className="flex flex-col justify-between gap-2 p-4 transition hover:bg-gray-50/40 sm:p-5">
      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-gray-500">
        {stat.title}
      </p>
      <p className="font-mono text-3xl font-bold tracking-tight text-gray-900">
        {formatted}
        {stat.suffix && (
          <span className="ml-1 text-lg font-semibold text-gray-500">
            {stat.suffix}
          </span>
        )}
      </p>
      <p className="flex items-center gap-1 font-mono text-[11px] font-medium text-gray-500">
        <TrendingUp size={11} className="text-red-600" />
        {stat.note}
      </p>
    </div>
  );
}