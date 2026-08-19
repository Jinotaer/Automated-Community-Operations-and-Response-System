// src/Citizen/Announcements.jsx
import { useEffect } from "react";
import { Megaphone } from "lucide-react";
import CitizenLayout from "../Layouts/CitizenLayouts";
import { getAnnouncements } from "../services/announcements";
import { offices } from "../Offices/officeData";

export default function Announcements() {
  const announcements = getAnnouncements();

  useEffect(() => {
    document.title = "Announcements — ACORS Citizen Portal";
  }, []);

  return (
    <CitizenLayout>
      {/* Mobile View */}
      <div className="lg:hidden">
        <section className="px-5 pt-5">
          <h1 className="text-2xl font-extrabold text-gray-900">
            Announcements
          </h1>
          <p className="mt-1 text-sm leading-6 text-gray-500">
            Official posts straight from city offices.
          </p>
        </section>

        <section className="mt-5 space-y-5 px-5 pb-10">
          {announcements.map((post, index) => (
            <PostCard key={post.id} post={post} index={index} />
          ))}
        </section>
      </div>

      {/* Desktop View */}
      <div className="hidden lg:block">
        <section className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900">
            Announcements
          </h1>
          <p className="mt-2 text-sm leading-6 text-gray-500">
            Official posts straight from city offices — no noise, just updates
            that matter to your barangay.
          </p>
        </section>

        <section className="mx-auto max-w-xl space-y-8 pb-10">
          {announcements.map((post, index) => (
            <PostCard key={post.id} post={post} index={index} desktop />
          ))}
        </section>
      </div>
    </CitizenLayout>
  );
}

function PostCard({ post, index = 0, desktop = false }) {
  const office = offices[post.officeSlug];
  const OfficeIcon = office?.icon || Megaphone;

  return (
    <article
      className="animate-fade-up overflow-hidden rounded-[1.75rem] bg-white shadow-[0_18px_40px_rgba(148,163,184,0.18)]"
      style={{ animationDelay: `${index * 90}ms` }}
    >
      {/* Post header */}
      <header className="flex items-center gap-3 px-5 py-4">
        <div
          className={`flex shrink-0 items-center justify-center rounded-full bg-red-600 text-white ${
            desktop ? "h-11 w-11" : "h-10 w-10"
          }`}
        >
          <OfficeIcon size={desktop ? 19 : 17} />
        </div>

        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-extrabold text-gray-900">
            {post.officeName}
          </p>
          <p className="text-xs font-medium text-gray-400">{post.postedAt}</p>
        </div>

        <span className="shrink-0 rounded-full bg-red-50 px-3 py-1 text-[10px] font-bold tracking-wide text-red-600">
          OFFICIAL
        </span>
      </header>

      {/* Post photo */}
      {post.image && (
        <div className="aspect-[4/3] w-full overflow-hidden bg-gray-100">
          <img
            src={post.image}
            alt={post.officeName}
            className="h-full w-full object-cover"
          />
        </div>
      )}

      {/* Caption only — no reactions, no comments, no shares */}
      <div className="px-5 py-5">
        <p className="text-sm leading-6 text-gray-700">{post.caption}</p>
      </div>
    </article>
  );
}