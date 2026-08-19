// src/Offices/shared/OfficeAnnouncements.jsx
import { useEffect, useRef, useState } from "react";
import {
  ImagePlus,
  X,
  Send,
  Megaphone,
  Plus,
  Radio,
} from "lucide-react";
import OfficeLayout from "../OfficeLayout";
import {
  getAnnouncements,
  addAnnouncement,
} from "../../services/announcements";

const MAX_CAPTION_LENGTH = 500;

export default function OfficeAnnouncements({ office }) {
  const [composeOpen, setComposeOpen] = useState(false);
  const [posts, setPosts] = useState(() =>
    getAnnouncements().filter((post) => post.officeSlug === office.slug)
  );

  useEffect(() => {
    document.title = `Announcements — ${office.name}`;
  }, [office.name]);

  function refreshPosts() {
    setPosts(getAnnouncements().filter((post) => post.officeSlug === office.slug));
  }

  function handlePosted() {
    setComposeOpen(false);
    refreshPosts();
  }

  return (
    <OfficeLayout office={office} header="Announcements">
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-red-600 text-white shadow-sm">
              <office.icon size={20} />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-zinc-900">
                Announcements
              </h2>
              <p className="text-xs text-zinc-500">
                Posts appear instantly on the citizen portal feed.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setComposeOpen(true)}
            className="flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition duration-300 hover:bg-red-700 active:translate-y-px"
          >
            <Plus size={16} />
            New post
          </button>
        </div>

        {posts.length === 0 ? (
          <div className="mt-8 flex flex-col items-center rounded-3xl border border-dashed border-zinc-300 bg-white/60 px-6 py-16 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-600">
              <Megaphone size={24} />
            </div>
            <p className="mt-4 text-sm font-bold text-zinc-800">
              No announcements yet
            </p>
            <p className="mt-1 max-w-xs text-xs leading-5 text-zinc-500">
              Your posts will show up here and on the citizen portal feed.
            </p>
            <button
              type="button"
              onClick={() => setComposeOpen(true)}
              className="mt-5 flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-bold text-white transition duration-300 hover:bg-red-700 active:translate-y-px"
            >
              <Plus size={16} />
              Write the first post
            </button>
          </div>
        ) : (
          <section className="mt-8">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-extrabold uppercase tracking-[0.16em] text-zinc-500">
                {office.shortName} posts
              </h3>
              <span className="rounded-full bg-red-50 px-3 py-1 text-[10px] font-bold tracking-wide text-red-600">
                {posts.length} POST{posts.length !== 1 ? "S" : ""}
              </span>
            </div>

            <div className="mt-4 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 [scrollbar-color:rgb(228_228_231)_transparent] [scrollbar-width:thin] [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-zinc-200 [&::-webkit-scrollbar-thumb]:hover:bg-zinc-300">
              {posts.map((post, index) => (
                <article
                  key={post.id}
                  className="w-72 shrink-0 snap-start animate-fade-up overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm transition duration-300 hover:-translate-y-0.5 hover:border-red-200 hover:shadow-md sm:w-80"
                  style={{ animationDelay: `${index * 90}ms` }}
                >
                  {post.image ? (
                    <div className="aspect-[16/9] w-full overflow-hidden bg-zinc-100">
                      <img
                        src={post.image}
                        alt="Announcement photo"
                        className="h-full w-full object-cover transition duration-500 hover:scale-[1.03]"
                      />
                    </div>
                  ) : (
                    <div className="flex aspect-[16/9] w-full items-center justify-center bg-zinc-50 text-zinc-300">
                      <Megaphone size={28} />
                    </div>
                  )}

                  <div className="flex flex-col px-5 py-4">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-xs font-medium text-zinc-400">
                        {post.postedAt}
                      </p>
                      <span className="flex shrink-0 items-center gap-1 rounded-full bg-red-50 px-2.5 py-1 text-[10px] font-bold tracking-wide text-red-600">
                        <Radio size={10} />
                        LIVE
                      </span>
                    </div>

                    <p className="mt-2 line-clamp-4 text-sm leading-6 text-zinc-700">
                      {post.caption}
                    </p>

                    <div className="mt-4 flex items-center gap-2 border-t border-zinc-100 pt-3">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-red-600 text-white">
                        <office.icon size={12} />
                      </span>
                      <p className="text-[11px] font-semibold text-zinc-500">
                        Visible on the citizen portal
                      </p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}
      </div>

      {composeOpen && (
        <ComposeModal
          office={office}
          onClose={() => setComposeOpen(false)}
          onPosted={handlePosted}
        />
      )}
    </OfficeLayout>
  );
}

function ComposeModal({ office, onClose, onPosted }) {
  const [caption, setCaption] = useState("");
  const [image, setImage] = useState(null);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);

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

  function handleFileChange(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please choose an image file.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setImage(reader.result);
      setError("");
    };
    reader.readAsDataURL(file);
    event.target.value = "";
  }

  function handlePost() {
    if (!caption.trim()) {
      setError("Write a caption before posting.");
      return;
    }

    addAnnouncement({
      officeSlug: office.slug,
      officeName: office.name,
      caption: caption.trim(),
      image: image || null,
    });

    onPosted();
  }

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-end justify-center bg-zinc-950/60 backdrop-blur-sm animate-fade-in sm:items-center sm:p-6"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Post an announcement"
        onClick={(event) => event.stopPropagation()}
        className="max-h-[92dvh] w-full max-w-lg overflow-y-auto rounded-t-[2rem] bg-white shadow-2xl animate-modal-in sm:rounded-[2rem]"
      >
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-zinc-100 bg-white/95 px-5 py-4 backdrop-blur sm:px-6">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-red-600 text-white">
              <office.icon size={16} />
            </div>
            <h2 className="text-base font-extrabold text-zinc-900">
              Post an announcement
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-zinc-100 text-zinc-500 transition hover:bg-zinc-200 hover:text-zinc-700"
          >
            <X size={16} />
          </button>
        </div>

        <div className="px-5 py-5 sm:px-6">
          <p className="text-xs leading-5 text-zinc-500">
            Posts appear on the citizen portal. No reactions or comments — just
            a caption and a photo.
          </p>

          <textarea
            value={caption}
            onChange={(event) => setCaption(event.target.value)}
            placeholder="Write an announcement for your barangays..."
            maxLength={MAX_CAPTION_LENGTH}
            rows={4}
            autoFocus
            className="mt-4 w-full resize-none rounded-2xl border border-zinc-200 bg-zinc-50/50 px-4 py-3 text-sm leading-6 text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-red-500 focus:bg-white focus:ring-4 focus:ring-red-600/10"
          />

          <div className="mt-1 flex items-center justify-between">
            <p className="text-[11px] font-medium text-zinc-400">
              {caption.length}/{MAX_CAPTION_LENGTH}
            </p>
            {error && (
              <p
                role="alert"
                className="text-[11px] font-semibold text-red-600"
              >
                {error}
              </p>
            )}
          </div>

          {image ? (
            <div className="relative mt-4 overflow-hidden rounded-2xl border border-zinc-200">
              <img
                src={image}
                alt="Announcement photo preview"
                className="max-h-64 w-full object-cover"
              />
              <button
                type="button"
                onClick={() => setImage(null)}
                aria-label="Remove photo"
                className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-zinc-950/60 text-white backdrop-blur transition hover:bg-zinc-950/80"
              >
                <X size={16} />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-zinc-300 py-4 text-sm font-semibold text-zinc-500 transition hover:border-red-300 hover:bg-red-50/50 hover:text-red-600"
            >
              <ImagePlus size={18} />
              Add a photo
            </button>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />

          <button
            type="button"
            onClick={handlePost}
            disabled={!caption.trim() && !image}
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-red-600 py-3.5 text-sm font-bold text-white transition duration-300 hover:bg-red-700 active:translate-y-px disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Send size={15} />
            Post announcement
          </button>
        </div>
      </div>
    </div>
  );
}