// src/landingpage.jsx — ACORS Staff Portal Landing (Choose Your Portal)
// Design System: See /DESIGN.md — Civic Authority, Density 4, Variance 3, Motion 4
// Single accent #8B0000, Geist + Geist Mono, slate neutrals, premium restrained.
import { useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Building2,
  Landmark,
  Settings2,
  ArrowRight,
  ShieldAlert,
} from "lucide-react";
import ApplicationLogo from "./Components/ApplicationLogo";

const portals = [
  {
    id: "barangay",
    tier: "Tier 1 · Barangay",
    icon: Building2,
    title: "Barangay Portal",
    description:
      "Receive, review, manage, and resolve community complaints within your barangay.",
    cta: "Enter Barangay Portal",
    to: "/barangay/login",
    helper: "5 barangays · Casisang, Sumpong +3",
  },
  {
    id: "lgu",
    tier: "Tier 2 · LGU Offices",
    icon: Landmark,
    title: "LGU Portal",
    description:
      "Manage complaints forwarded by barangays and coordinate appropriate LGU action.",
    cta: "Enter LGU Portal",
    to: "/lgu/login",
    helper: "13 departments · Engineering, CENRO, CDRRMO…",
  },
  {
    id: "admin",
    tier: "System · Administration",
    icon: Settings2,
    title: "Admin Portal",
    description:
      "Manage users, offices, barangays, system settings, and overall ACORS operations.",
    cta: "Enter Admin Portal",
    to: "/admin/login",
    helper: "Restricted · LGU administrators only",
  },
];

export default function LandingPage() {
  useEffect(() => {
    document.title = "ACORS — Staff Portal";
  }, []);

  return (
    <div className="flex min-h-[100dvh] flex-col bg-[#F8FAFC] font-sans text-slate-900 antialiased selection:bg-red-100 selection:text-red-900">
      {/* Header — minimal, institutional */}
      <header className="sticky top-0 z-30 w-full border-b border-slate-200/70 bg-white/80 backdrop-blur-md supports-[backdrop-filter]:bg-white/70">
        <div className="mx-auto flex h-[68px] max-w-[1120px] items-center justify-between gap-4 px-5 sm:px-6 lg:px-8">
          {/* Brand — left */}
          <Link to="/staff" className="flex items-center gap-3.5">
            <ApplicationLogo className="h-10 w-auto shrink-0 rounded-xl object-cover shadow-[0_2px_10px_rgba(0,0,0,0.08)] ring-1 ring-slate-200/60" size={40} />
            <div className="leading-none">
              <p className="text-[18px] font-extrabold tracking-tight text-[#1E293B]">
                AC<span className="text-[#8B0000]">O</span>RS
              </p>
              <p className="hidden text-[10.5px] font-medium leading-tight tracking-wide text-[#64748B] sm:block">
                Automated Community Operations
                <br className="hidden lg:block" />
                <span className="lg:hidden"> </span>&amp; Response System
              </p>
              <p className="text-[10.5px] font-medium leading-tight text-[#64748B] sm:hidden">
                ACORS
              </p>
            </div>
          </Link>

          {/* Right — badge + ghost link */}
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-red-200 bg-[#FEF2F2] px-3 py-1.5 text-[10.5px] font-extrabold tracking-[0.14em] uppercase text-[#8B0000] shadow-sm">
              <ShieldAlert size={13} className="shrink-0 text-[#B91C1C]" />
              Staff Portal
            </span>
            <Link
              to="/login"
              className="hidden items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-800 sm:inline-flex"
            >
              Resident Portal
              <ArrowRight size={12} className="opacity-60" />
            </Link>
          </div>
        </div>
      </header>

      {/* Main — vertically rhythmically centered */}
      <main className="flex flex-1 flex-col">
        {/* Hero — centered, restrained, symmetric (Variance 3 allows centered) */}
        <section className="mx-auto w-full max-w-[1120px] px-5 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-[720px] pt-8 text-center sm:pt-12 lg:pt-14">
            {/* Eyebrow — subtle institutional signal */}
            <div
              className="inline-flex animate-fade-up items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-1.5 shadow-[0_2px_8px_rgba(15,23,42,0.06)]"
              style={{ animationDelay: "0ms" }}
            >
              <span className="relative flex h-1.5 w-1.5 shrink-0">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#8B0000]/40" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#8B0000]" />
              </span>
              <span className="text-[11px] font-bold tracking-[0.16em] uppercase text-slate-500">
                Malaybalay City · Official Staff Access
              </span>
            </div>

            <h1
              className="mt-5 animate-fade-up text-[clamp(1.9rem,5vw,2.75rem)] font-extrabold leading-[1.05] tracking-tight text-[#1E293B]"
              style={{ animationDelay: "80ms" }}
            >
              Welcome to ACORS
            </h1>

            <p
              className="mt-3 animate-fade-up text-[17px] font-semibold leading-7 text-[#1E293B]"
              style={{ animationDelay: "120ms" }}
            >
              Select your portal to continue
            </p>

            <p
              className="mx-auto mt-3 max-w-[560px] animate-fade-up text-sm leading-7 text-[#64748B]"
              style={{ animationDelay: "160ms" }}
            >
              Access the tools and services available for your role in managing
              community concerns and local government services.
            </p>
          </div>

          {/* Portal Cards — the core interaction */}
          <div className="mx-auto mt-9 grid max-w-[1120px] grid-cols-1 gap-6 pb-10 sm:mt-10 md:grid-cols-3 md:gap-6 lg:gap-7 lg:pb-14">
            {portals.map((portal, index) => {
              const Icon = portal.icon;
              return (
                <article
                  key={portal.id}
                  aria-label={`${portal.title} card`}
                  className="group flex animate-fade-up flex-col rounded-[2rem] border border-slate-200/80 bg-white p-6 shadow-[0_8px_24px_rgba(15,23,42,0.06)] transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 hover:border-red-200 hover:shadow-[0_16px_40px_rgba(15,23,42,0.10)] sm:p-7"
                  style={{ animationDelay: `${200 + index * 90}ms` }}
                >
                  {/* Tier label */}
                  <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-slate-400">
                    {portal.tier}
                  </p>

                  {/* Icon badge — light crimson wash, surgical accent */}
                  <div className="mt-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-red-100 bg-[#FEF2F2] text-[#8B0000] transition duration-300 group-hover:scale-[1.04] group-hover:bg-red-100/70">
                    <Icon size={24} strokeWidth={1.9} aria-hidden="true" />
                  </div>

                  {/* Title */}
                  <h2 className="mt-5 text-[17px] font-extrabold tracking-tight text-[#1E293B]">
                    {portal.title}
                  </h2>

                  {/* Description — min-height keeps cards equal */}
                  <p className="mt-2 min-h-[42px] text-[13px] leading-[1.7] text-[#64748B]">
                    {portal.description}
                  </p>

                  {/* CTA — solid Deep Crimson, tactile press, arrow nudge */}
                  <Link
                    to={portal.to}
                    aria-label={portal.cta}
                    className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#8B0000] px-5 py-3.5 text-sm font-bold text-white shadow-[0_10px_20px_rgba(139,0,0,0.18)] transition duration-300 hover:bg-[#6B0000] hover:shadow-[0_14px_28px_rgba(139,0,0,0.24)] active:translate-y-px focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-red-600/15 focus-visible:ring-offset-0"
                  >
                    <span>{portal.cta}</span>
                    <ArrowRight
                      size={16}
                      strokeWidth={2.2}
                      className="shrink-0 transition-transform duration-200 group-hover:translate-x-1"
                      aria-hidden="true"
                    />
                  </Link>

                  {/* Helper microcopy */}
                  <p className="mt-3 text-center text-[11px] font-medium leading-4 text-slate-400">
                    {portal.helper}
                  </p>
                </article>
              );
            })}
          </div>

          {/* Security reassurance — reinforces backend-enforced auth, not decorative */}
          <p
            className="mx-auto max-w-2xl animate-fade-up pb-6 text-center text-xs leading-5 text-slate-400 sm:pb-8"
            style={{ animationDelay: "470ms" }}
          >
            Selecting a portal does not grant automatic access. You will be
            asked to sign in and your role will be verified before entering
            any dashboard.
          </p>
        </section>

        {/* Mobile-only: Resident link fallback (since header hides it on mobile) */}
        <div className="mx-auto w-full max-w-[1120px] px-5 pb-6 sm:hidden">
          <Link
            to="/login"
            className="flex w-full items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Are you a resident? Go to Citizen Portal
            <ArrowRight size={14} />
          </Link>
        </div>
      </main>

      {/* Footer — minimal, legitimate government feel */}
      <footer className="border-t border-slate-200/70 bg-white">
        <div className="mx-auto max-w-[1120px] px-5 py-10 text-center sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center gap-3">
            <div className="flex items-center gap-2.5">
              <ApplicationLogo className="h-7 w-auto opacity-90 grayscale-[0.05]" size={28} />
              <span className="text-sm font-extrabold tracking-tight text-[#1E293B]">
                AC<span className="text-[#8B0000]">O</span>RS
              </span>
              <span className="hidden text-slate-300 sm:inline">·</span>
              <span className="hidden text-xs font-medium text-slate-500 sm:inline">
                Automated Community Operations &amp; Response System
              </span>
            </div>

            <p className="max-w-md text-xs font-medium italic leading-6 text-slate-500 sm:text-[13px]">
              Community concerns. Local action. Better response.
            </p>

            <div className="mt-2 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-[11px] text-slate-400">
              <span className="font-mono font-medium tracking-wide">© 2026 ACORS</span>
              <span className="hidden h-1 w-1 rounded-full bg-slate-300 sm:inline-block" />
              <span className="font-medium">
                City Government of Malaybalay · Bukidnon
              </span>
            </div>

            <p className="max-w-lg text-[11px] leading-5 text-slate-400">
              This is a restricted system. Authorized personnel only. All access
              is logged and subject to audit.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
