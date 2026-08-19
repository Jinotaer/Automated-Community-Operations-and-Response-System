// src/pages/Home.jsx
import { useEffect, useState } from "react";
import {
  Search,
  Bell,
  Map,
  MapPin,
  Navigation,
  Megaphone,
} from "lucide-react";
import { Link } from "react-router-dom";
import CitizenLayout from "../Layouts/CitizenLayouts";
import { getAnnouncements } from "../services/announcements";
import cityOverview from "../assets/bg.jpg";
import digitalReport from "../assets/image.png";
import lguResponse from "../assets/national-highway.jpg";
import pothole from "../assets/pothole.jpg";
import outage from "../assets/outage.jpg";

const heroSlides = [
  {
    image: cityOverview,
    alt: "Aerial view of Malaybalay City",
    eyebrow: "Live city overview",
    title: "See what is happening across Malaybalay.",
    description:
      "Monitor reports, barangays, and response activity from a single dashboard.",
  },
  {
    image: digitalReport,
    alt: "Citizen using a mobile phone to report a community issue",
    eyebrow: "Digital reporting",
    title: "One place to submit and track concerns.",
    description:
      "Citizens can send reports with location details and follow progress in real time.",
  },
  {
    image: lguResponse,
    alt: "Local government response team working on a city concern",
    eyebrow: "Built for the LGU",
    title: "Connected to local government response.",
    description:
      "Designed to support faster coordination between residents and the city.",
  },
];

const loopedHeroSlides = [
  heroSlides[heroSlides.length - 1],
  ...heroSlides,
  heroSlides[0],
];

export default function Home() {
  return (
    <CitizenLayout>
      {/* Mobile Home Page */}
      <div className="lg:hidden">
        <section className="px-5 pt-6">
          <MobileHeroCarousel />
        </section>

        <section className="px-5 pt-6">
          <NearbyIncidentsCard />
        </section>

        <section className="px-5 pt-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-extrabold text-gray-900">
              Announcements
            </h3>

            <Link
              to="/announcements"
              className="text-sm font-bold text-red-600"
            >
              View all
            </Link>
          </div>

          <div className="mt-4 space-y-4">
            {getAnnouncements()
              .slice(0, 2)
              .map((post) => (
                <HomeAnnouncementCard key={post.id} post={post} />
              ))}
          </div>
        </section>

        <section className="px-5 pt-6 pb-24">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-extrabold text-gray-900">
              Community Updates
            </h3>

            <Link
              to="/community-reports"
              className="text-sm font-bold text-red-600"
            >
              View all
            </Link>
          </div>

          <div className="mt-4 space-y-4">
            <CommunityReportCard
              image={pothole}
              title="Pothole reported"
              location="Barangay 5, near the main road"
              status="Pending Review"
              badge="New"
              badgeColor="bg-red-100 text-red-600"
              dotColor="bg-orange-500"
            />

            <CommunityReportCard
              image={outage}
              title="Streetlight Outage"
              location="Fortich St, Zone 3"
              status="Technician Dispatched"
              badge="2h ago"
              badgeColor="bg-gray-100 text-gray-600"
              dotColor="bg-red-600"
            />
          </div>
        </section>
      </div>

      {/* Desktop Home Page */}
      <div className="hidden lg:block">
        <header className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-extrabold text-gray-900">
              Home Dashboard
            </h2>
            <p className="mt-1 text-gray-500">
              Welcome back, Malaybalaynon. Here's your quick overview.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                type="text"
                placeholder="Search reports..."
                className="w-72 rounded-2xl border border-gray-200 bg-white py-3 pl-11 pr-4 text-sm outline-none focus:border-red-600"
              />
            </div>

            <button className="rounded-2xl bg-white p-3 shadow-sm">
              <Bell size={20} />
            </button>
          </div>
        </header>

        <section className="mt-8 grid grid-cols-3 gap-6">
          <div className="col-span-2">
            <HeroCarousel />
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <h4 className="font-bold text-gray-900">Today's Priority</h4>
            <p className="mt-2 text-sm text-gray-500">
              Critical reports that need quick LGU attention.
            </p>

            <div className="mt-5 space-y-3">
              <PriorityItem title="Flooding reported" area="Casisang" />
              <PriorityItem title="Broken streetlight" area="Sumpong" />
              <PriorityItem title="Road damage" area="Aglayan" />
            </div>
          </div>
        </section>

        <section className="mt-6 grid grid-cols-4 gap-6">
          <StatCard
            title="Total Reports"
            value="1,248"
            color="text-red-600"
          />
          <StatCard
            title="Active Incidents"
            value="86"
            color="text-yellow-600"
          />
          <StatCard title="Resolved" value="972" color="text-red-600" />
          <StatCard title="Critical" value="12" color="text-red-600" />
        </section>

        <section className="mt-6 grid grid-cols-12 gap-6">
          <div className="col-span-5">
            <NearbyIncidentsCard desktop />
          </div>

          <div className="col-span-7 rounded-3xl bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold">Community Reports</h3>
                <p className="text-sm text-gray-500">
                  Anonymous public reports submitted by citizens.
                </p>
              </div>

              <Link
                to="/community-reports"
                className="text-sm font-semibold text-red-600"
              >
                View all
              </Link>
            </div>

            <div className="mt-5 grid gap-4">
              <CommunityReportCard
                image={pothole}
                title="Pothole reported"
                location="Barangay 5, near the main road"
                status="Pending Review"
                badge="New"
                badgeColor="bg-red-100 text-red-600"
                dotColor="bg-orange-500"
              />

              <CommunityReportCard
                image={outage}
                title="Streetlight Outage"
                location="Fortich St, Zone 3"
                status="Technician Dispatched"
                badge="2h ago"
                badgeColor="bg-gray-100 text-gray-600"
                dotColor="bg-red-600"
              />
            </div>
          </div>
        </section>

        <section className="mt-6 rounded-3xl bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold">Announcements</h3>
              <p className="text-sm text-gray-500">
                Official posts from city offices.
              </p>
            </div>

            <Link
              to="/announcements"
              className="text-sm font-semibold text-red-600"
            >
              View all
            </Link>
          </div>

          <div className="mt-5 grid gap-4">
            {getAnnouncements()
              .slice(0, 2)
              .map((post) => (
                <HomeAnnouncementCard key={post.id} post={post} />
              ))}
          </div>
        </section>
      </div>
    </CitizenLayout>
  );
}

function useLoopingHeroCarousel() {
  const [activeSlide, setActiveSlide] = useState(1);
  const [isTransitionEnabled, setIsTransitionEnabled] = useState(true);

  useEffect(() => {
    const slideInterval = window.setInterval(() => {
      setIsTransitionEnabled(true);
      setActiveSlide((currentSlide) => currentSlide + 1);
    }, 4500);

    return () => window.clearInterval(slideInterval);
  }, []);

  useEffect(() => {
    if (isTransitionEnabled) {
      return undefined;
    }

    let firstFrame = 0;
    let secondFrame = 0;

    firstFrame = window.requestAnimationFrame(() => {
      secondFrame = window.requestAnimationFrame(() => {
        setIsTransitionEnabled(true);
      });
    });

    return () => {
      window.cancelAnimationFrame(firstFrame);
      window.cancelAnimationFrame(secondFrame);
    };
  }, [isTransitionEnabled]);

  const handleTransitionEnd = () => {
    if (activeSlide === loopedHeroSlides.length - 1) {
      setIsTransitionEnabled(false);
      setActiveSlide(1);
      return;
    }

    if (activeSlide === 0) {
      setIsTransitionEnabled(false);
      setActiveSlide(loopedHeroSlides.length - 2);
    }
  };

  const currentSlide =
    activeSlide === loopedHeroSlides.length - 1
      ? 0
      : activeSlide === 0
        ? heroSlides.length - 1
        : activeSlide - 1;

  const goToSlide = (index) => {
    setIsTransitionEnabled(true);
    setActiveSlide(index + 1);
  };

  return {
    activeSlide,
    currentSlide,
    goToSlide,
    handleTransitionEnd,
    isTransitionEnabled,
  };
}

function HeroCarousel() {
  const {
    activeSlide,
    currentSlide,
    goToSlide,
    handleTransitionEnd,
    isTransitionEnabled,
  } = useLoopingHeroCarousel();

  return (
    <div className="relative min-h-[360px] overflow-hidden rounded-[2rem] shadow-[0_24px_60px_rgba(185,28,28,0.18)]">
      <div
        className={`flex h-full min-h-[360px] ${
          isTransitionEnabled
            ? "transition-transform duration-700 ease-out"
            : "transition-none"
        }`}
        style={{ transform: `translateX(-${activeSlide * 100}%)` }}
        onTransitionEnd={handleTransitionEnd}
      >
        {loopedHeroSlides.map((slide, index) => (
          <article
            key={`${slide.title}-${index}`}
            className="relative min-w-full overflow-hidden bg-cover bg-center"
            style={{ backgroundImage: `url(${slide.image})` }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-red-950/90 via-red-900/55 to-red-900/20" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.28),transparent_35%)]" />

            <div className="relative z-10 flex h-full min-h-[360px] flex-col justify-end p-8 text-white">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-red-100">
                {slide.eyebrow}
              </p>

              <h4 className="mt-3 max-w-md text-3xl font-extrabold leading-tight">
                {slide.title}
              </h4>

              <p className="mt-3 max-w-md text-sm leading-6 text-red-50/90">
                {slide.description}
              </p>

              <div className="mt-6 flex gap-3">
                <Link
                  to="/report-issue"
                  className="rounded-xl bg-white px-5 py-3 text-sm font-bold text-red-600 hover:bg-red-50"
                >
                  Report an Issue
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>

      <CarouselDots
        activeSlide={currentSlide}
        setActiveSlide={goToSlide}
        desktop
      />
    </div>
  );
}

function MobileHeroCarousel() {
  const {
    activeSlide,
    currentSlide,
    goToSlide,
    handleTransitionEnd,
    isTransitionEnabled,
  } = useLoopingHeroCarousel();

  return (
    <div className="relative min-h-[230px] overflow-hidden rounded-3xl shadow-[0_18px_45px_rgba(185,28,28,0.18)]">
      <div
        className={`flex h-full min-h-[230px] ${
          isTransitionEnabled
            ? "transition-transform duration-700 ease-out"
            : "transition-none"
        }`}
        style={{ transform: `translateX(-${activeSlide * 100}%)` }}
        onTransitionEnd={handleTransitionEnd}
      >
        {loopedHeroSlides.map((slide, index) => (
          <article
            key={`${slide.title}-${index}`}
            className="relative min-w-full overflow-hidden bg-cover bg-center"
            style={{ backgroundImage: `url(${slide.image})` }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-red-950/90 via-red-900/60 to-red-900/20" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.25),transparent_35%)]" />

            <div className="relative z-10 flex min-h-[230px] flex-col justify-end p-5 text-white">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-red-100">
                {slide.eyebrow}
              </p>

              <h2 className="mt-2 text-xl font-extrabold leading-tight">
                {slide.title}
              </h2>

              <p className="mt-2 line-clamp-2 text-xs font-medium leading-5 text-red-50/90">
                {slide.description}
              </p>

              <Link
                to="/report-issue"
                className="mt-4 w-fit rounded-xl bg-white px-4 py-2.5 text-xs font-extrabold text-red-600"
              >
                Report Issue
              </Link>
            </div>
          </article>
        ))}
      </div>

      <CarouselDots activeSlide={currentSlide} setActiveSlide={goToSlide} />
    </div>
  );
}

function CarouselDots({ activeSlide, setActiveSlide, desktop = false }) {
  return (
    <div
      className={`absolute z-20 flex gap-2 ${
        desktop ? "bottom-6 right-6" : "bottom-4 right-4"
      }`}
    >
      {heroSlides.map((slide, index) => (
        <button
          key={slide.title}
          type="button"
          aria-label={`Show slide ${index + 1}`}
          onClick={() => setActiveSlide(index)}
          className={`rounded-full transition ${desktop ? "h-2.5" : "h-2"} ${
            index === activeSlide
              ? desktop
                ? "w-8 bg-white"
                : "w-6 bg-white"
              : desktop
                ? "w-2.5 bg-white/50 hover:bg-white/80"
                : "w-2 bg-white/50 hover:bg-white/80"
          }`}
        />
      ))}
    </div>
  );
}

function NearbyIncidentsCard({ desktop = false }) {
  const majorRoads = [
    "left-[-6%] top-[18%] h-4 w-[118%] rotate-[-9deg]",
    "left-[4%] top-[42%] h-4 w-[102%] rotate-[7deg]",
    "left-[-2%] top-[66%] h-4 w-[110%] rotate-[-10deg]",
    "left-[20%] top-[-8%] h-[126%] w-4 rotate-[12deg]",
    "left-[62%] top-[-6%] h-[118%] w-4 rotate-[-8deg]",
  ];

  const minorRoads = [
    "left-[4%] top-[12%] h-2 w-[104%] rotate-[2deg]",
    "left-[8%] top-[30%] h-2 w-[94%] rotate-[-5deg]",
    "left-[12%] top-[54%] h-2 w-[90%] rotate-[4deg]",
    "left-[12%] top-[78%] h-2 w-[84%] rotate-[-4deg]",
    "left-[38%] top-[-4%] h-[114%] w-2 rotate-[8deg]",
    "left-[80%] top-[-2%] h-[104%] w-2 rotate-[-10deg]",
  ];

  const parks = [
    "left-[3%] top-[12%] h-14 w-14",
    "left-[68%] top-[8%] h-12 w-12",
    "left-[52%] top-[46%] h-10 w-10",
    "left-[16%] top-[68%] h-12 w-14",
  ];

  const contextPins = [
    { top: "24%", left: "22%", color: "text-red-500", size: desktop ? 30 : 24 },
    { top: "34%", left: "42%", color: "text-amber-400", size: desktop ? 28 : 22 },
    { top: "26%", left: "78%", color: "text-red-600", size: desktop ? 30 : 24 },
  ];

  return (
    <div>
      <h3
        className={`font-extrabold text-gray-900 ${
          desktop ? "text-xl" : "text-lg"
        }`}
      >
        Nearby Incidents
      </h3>

      <div
        className={`relative mt-4 overflow-hidden rounded-[1.75rem] border border-white/80 bg-[#edf2f5] shadow-[0_18px_40px_rgba(148,163,184,0.18)] ${
          desktop ? "h-[236px]" : "h-40"
        }`}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.75),transparent_38%)]" />

        {parks.map((park) => (
          <div key={park} className={`absolute rounded-md bg-[#d8efcc] ${park}`} />
        ))}

        {majorRoads.map((street) => (
          <div
            key={street}
            className={`absolute rounded-full bg-white/95 shadow-[0_0_0_1px_rgba(203,213,225,0.32)] ${street}`}
          />
        ))}

        {minorRoads.map((street) => (
          <div
            key={street}
            className={`absolute rounded-full bg-white/88 shadow-[0_0_0_1px_rgba(226,232,240,0.4)] ${street}`}
          />
        ))}

        {contextPins.map((pin) => (
          <div
            key={`${pin.top}-${pin.left}`}
            className="absolute -translate-x-1/2 -translate-y-full"
            style={{ top: pin.top, left: pin.left }}
          >
            <MapPin
              size={pin.size}
              className={`${pin.color} fill-current drop-shadow-[0_8px_14px_rgba(15,23,42,0.16)]`}
            />
          </div>
        ))}

        <div className="absolute left-[52%] top-[66%] -translate-x-1/2 -translate-y-1/2">
          <div className="absolute left-1/2 top-1/2 h-12 w-12 -translate-x-1/2 -translate-y-1/2 rounded-full bg-sky-400/18 blur-md" />
          <Navigation
            size={desktop ? 36 : 30}
            fill="currentColor"
            strokeWidth={1.8}
            className="relative rotate-[18deg] text-sky-500 drop-shadow-[0_10px_18px_rgba(59,130,246,0.28)]"
          />
        </div>

        <div
          className={`absolute left-4 top-4 rounded-2xl bg-white/95 shadow-[0_12px_24px_rgba(15,23,42,0.08)] ${
            desktop ? "max-w-[220px] px-4 py-4" : "max-w-[150px] px-4 py-3"
          }`}
        >
          <p
            className={`font-extrabold text-gray-800 ${
              desktop ? "text-lg" : "text-sm"
            }`}
          >
            3 Active Reports
          </p>
          <p
            className={`mt-1 font-medium text-gray-500 ${
              desktop ? "text-xs leading-5" : "text-[11px] leading-4"
            }`}
          >
            Within 2km radius of your current location.
          </p>
        </div>

        <Link
          to="/map"
          className={`absolute flex items-center gap-2 rounded-2xl bg-red-700 font-extrabold text-white shadow-[0_14px_24px_rgba(185,28,28,0.28)] transition hover:bg-red-800 ${
            desktop
              ? "bottom-5 right-4 px-5 py-3 text-sm"
              : "bottom-4 right-4 px-4 py-2.5 text-xs"
          }`}
        >
          <Map size={16} />
          View Map
        </Link>
      </div>
    </div>
  );
}

function HomeAnnouncementCard({ post }) {
  return (
    <Link
      to="/announcements"
      className="flex items-center gap-4 rounded-2xl bg-white p-4 shadow-sm transition hover:scale-[1.01]"
    >
      <img
        src={post.image}
        alt={post.officeName}
        className="h-20 w-20 shrink-0 rounded-xl object-cover"
      />

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <h4 className="line-clamp-1 text-base font-extrabold text-gray-900">
            {post.officeName}
          </h4>

          <span className="shrink-0 rounded-full bg-red-50 px-3 py-1 text-[10px] font-bold text-red-600">
            OFFICIAL
          </span>
        </div>

        <p className="mt-1 line-clamp-2 text-sm font-medium leading-5 text-gray-700">
          {post.caption}
        </p>

        <div className="mt-2 flex items-center gap-2">
          <Megaphone size={12} className="text-red-600" />
          <p className="text-[11px] font-medium text-gray-500">
            {post.postedAt}
          </p>
        </div>
      </div>
    </Link>
  );
}

function CommunityReportCard({
  image,
  title,
  location,
  status,
  badge,
  badgeColor,
  dotColor,
}) {
  return (
    <Link
      to="/community-reports"
      className="flex items-center gap-4 rounded-2xl bg-white p-4 shadow-sm transition hover:scale-[1.01]"
    >
      <img
        src={image}
        alt={title}
        className="h-20 w-20 shrink-0 rounded-xl object-cover"
      />

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <h4 className="line-clamp-1 text-base font-extrabold text-gray-900">
            {title}
          </h4>

          <span
            className={`shrink-0 rounded-full px-3 py-1 text-[10px] font-bold ${badgeColor}`}
          >
            {badge}
          </span>
        </div>

        <p className="mt-1 line-clamp-1 text-sm font-medium text-gray-700">
          {location}
        </p>

        <div className="mt-2 flex items-center gap-2">
          <span className={`h-2 w-2 rounded-full ${dotColor}`} />
          <p className="text-[11px] font-medium text-gray-600">{status}</p>
        </div>
      </div>
    </Link>
  );
}

function StatCard({ title, value, color }) {
  return (
    <div className="rounded-3xl bg-white p-6 shadow-sm">
      <p className="text-sm font-medium text-gray-500">{title}</p>
      <h3 className={`mt-3 text-3xl font-extrabold ${color}`}>{value}</h3>
    </div>
  );
}

function PriorityItem({ title, area }) {
  return (
    <div className="flex items-center justify-between rounded-2xl bg-gray-50 p-3">
      <div>
        <p className="text-sm font-bold">{title}</p>
        <p className="text-xs text-gray-500">{area}</p>
      </div>

      <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-bold text-red-600">
        High
      </span>
    </div>
  );
}
