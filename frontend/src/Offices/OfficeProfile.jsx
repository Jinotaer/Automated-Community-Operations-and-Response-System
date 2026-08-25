// src/Offices/OfficeProfile.jsx
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ShieldCheck,
  Mail,
  Phone,
  Building2,
  MapPin,
  Clock3,
  Edit3,
  CheckCircle2,
  FileText,
  Lock,
  Sparkles,
  Users,
  X,
  Check,
  ArrowRight,
} from "lucide-react";
import OfficeLayout from "./OfficeLayout";
import { offices, engineeringOffice } from "./officeData";

export default function OfficeProfile() {
  const { officeSlug } = useParams();
  const office = offices[officeSlug] || engineeringOffice;

  const [isEditing, setIsEditing] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [profileData, setProfileData] = useState({
    holder: office.holder,
    role: office.role,
    email: office.email,
    phone: "0917-552-3344",
    location: "Malaybalay City Hall, Sayre Highway, Bukidnon",
    hours: "8:00 AM – 5:00 PM (Monday – Friday)",
    clearanceLevel: "Level 3 — Department Head Clearance",
  });

  useEffect(() => {
    document.title = `${office.name} Profile — ACORS`;
    setProfileData((prev) => ({
      ...prev,
      holder: office.holder,
      role: office.role,
      email: office.email,
    }));
  }, [office]);

  const handleSave = (e) => {
    e.preventDefault();
    setIsEditing(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3500);
  };

  const OfficeIcon = office.icon || Building2;

  return (
    <OfficeLayout office={office} header={`${office.shortName || office.name} Profile`}>
      <div className="space-y-5 sm:space-y-6">
        {/* Save feedback toast */}
        {saveSuccess && (
          <div className="flex items-center justify-between rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-xs font-bold text-emerald-900 animate-fade-in shadow-xs">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-600" />
              <span>Office profile credentials and contact details updated successfully.</span>
            </div>
            <button onClick={() => setSaveSuccess(false)}><X size={16} className="text-emerald-500 hover:text-emerald-700" /></button>
          </div>
        )}

        {/* Header */}
        <header className="flex animate-fade-up flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.22em] text-gray-500">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-600 opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-red-600" />
              </span>
              City Government of Malaybalay · Department Personnel
            </p>
            <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">
              {office.name} Profile
            </h1>
          </div>

          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="flex items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-red-700 active:scale-95 sm:w-auto"
          >
            <Edit3 size={15} /> Edit Profile Info
          </button>
        </header>

        {/* Main Grid */}
        <section className="grid gap-6 xl:grid-cols-12">
          {/* Left Column - Officer Identity Card */}
          <aside className="animate-fade-up rounded-3xl border border-gray-200/70 bg-white p-5 shadow-sm sm:p-6 xl:col-span-4" style={{ animationDelay: "40ms" }}>
            <div className="flex flex-col items-center text-center">
              <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-red-50 text-red-600 shadow-inner">
                <OfficeIcon size={44} />
              </div>

              <h2 className="mt-4 text-xl font-extrabold text-gray-900">
                {profileData.holder}
              </h2>
              <p className="text-xs font-semibold text-gray-500">{profileData.role}</p>
              <span className="mt-1 font-mono text-[11px] font-bold text-red-600">
                {office.code || "DEPT-LGU"}
              </span>

              <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3.5 py-1 text-xs font-bold text-emerald-700">
                <ShieldCheck size={15} /> Verified Department Head
              </div>
            </div>

            <div className="mt-6 border-t border-gray-100 pt-5 space-y-3.5 text-xs">
              <InfoItem icon={<Mail size={16} />} label="Official Email" value={profileData.email} />
              <InfoItem icon={<Phone size={16} />} label="Direct Line" value={profileData.phone} />
              <InfoItem icon={<Building2 size={16} />} label="Department" value={office.name} />
              <InfoItem icon={<MapPin size={16} />} label="Office Address" value={profileData.location} />
              <InfoItem icon={<Clock3 size={16} />} label="Operating Hours" value={profileData.hours} />
            </div>
          </aside>

          {/* Right Column - Stats, Scope & Access Details */}
          <div className="space-y-6 xl:col-span-8 animate-fade-up" style={{ animationDelay: "80ms" }}>
            {/* Operational Stats Band */}
            <div className="rounded-3xl border border-gray-200/70 bg-white p-5 shadow-sm sm:p-6">
              <h3 className="text-sm font-extrabold text-gray-900">Department Operational Metrics</h3>
              <p className="text-xs text-gray-500">Live operational volume and response performance</p>

              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {office.stats?.slice(0, 3).map((stat) => (
                  <div key={stat.title} className="rounded-2xl border border-zinc-100 bg-zinc-50/70 p-4">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500">{stat.title}</p>
                    <p className="mt-1 font-mono text-2xl font-extrabold text-gray-900">{stat.value}</p>
                    <p className="mt-0.5 text-[10px] text-gray-400">{stat.note}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Department Service Categories */}
            <div className="rounded-3xl border border-gray-200/70 bg-white p-5 shadow-sm sm:p-6">
              <h3 className="text-sm font-extrabold text-gray-900">Jurisdiction &amp; Service Mandate</h3>
              <p className="text-xs text-gray-500">Active services and civic operations under this department</p>

              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {office.categories?.map((cat, i) => (
                  <div key={i} className="flex items-center gap-2.5 rounded-2xl border border-zinc-100 bg-zinc-50/60 p-3 text-xs">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-red-100 text-red-700 font-bold text-[11px]">
                      {i + 1}
                    </span>
                    <span className="font-bold text-gray-800">{cat}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Security Clearance & Authorization */}
            <div className="rounded-3xl border border-gray-200/70 bg-white p-5 shadow-sm sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-extrabold text-gray-900">Security Clearance &amp; System Permissions</h3>
                  <p className="text-xs text-gray-500">Access privileges within the ACORS LGU Network</p>
                </div>
                <span className="rounded-full bg-red-50 px-3 py-1 font-mono text-xs font-bold text-red-700">
                  {profileData.clearanceLevel}
                </span>
              </div>

              <div className="mt-4 space-y-2 text-xs text-gray-600">
                {[
                  "Department incident assignment and dispatch authorization",
                  "Certificate request verification, AI pre-screening review, and digital seal issuance",
                  "Field inspection scheduling and correction notice dispatch",
                  "Automated civic notifications and official citizen response publishing",
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <Check size={14} className="text-emerald-600 shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              <div className="mt-5 flex flex-wrap gap-2 pt-3 border-t border-zinc-100">
                <Link
                  to={`/office/${office.slug}/overview`}
                  className="flex items-center gap-1.5 rounded-xl border border-zinc-200 bg-white px-3.5 py-2 text-xs font-bold text-gray-700 shadow-2xs hover:bg-zinc-50"
                >
                  <Building2 size={14} /> Open Overview <ArrowRight size={13} />
                </Link>
                {office.slug === "lcro" || office.slug === "treasurer" || office.slug === "pdao" || office.slug === "soloparent" || office.slug === "cswdo" || office.slug === "bplo" || office.slug === "osca" || office.slug === "assessor" ? (
                  <Link
                    to={`/office/${office.slug}/requests`}
                    className="flex items-center gap-1.5 rounded-xl bg-red-600 px-3.5 py-2 text-xs font-bold text-white shadow-2xs hover:bg-red-700"
                  >
                    <FileText size={14} /> View Applications Console <ArrowRight size={13} />
                  </Link>
                ) : (
                  <Link
                    to={`/office/${office.slug}/reports`}
                    className="flex items-center gap-1.5 rounded-xl bg-red-600 px-3.5 py-2 text-xs font-bold text-white shadow-2xs hover:bg-red-700"
                  >
                    <FileText size={14} /> View Reports Console <ArrowRight size={13} />
                  </Link>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Edit Profile Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-zinc-900/60 backdrop-blur-xs" onClick={() => setIsEditing(false)} />
          <div className="relative w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl animate-modal-in text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
              <h3 className="text-base font-extrabold text-gray-900">Edit Department Profile</h3>
              <button onClick={() => setIsEditing(false)} className="rounded-lg p-1 text-zinc-400 hover:bg-zinc-100"><X size={18} /></button>
            </div>

            <form onSubmit={handleSave} className="mt-4 space-y-3.5">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Department Head / Officer Name</label>
                <input
                  type="text"
                  value={profileData.holder}
                  onChange={(e) => setProfileData({ ...profileData, holder: e.target.value })}
                  className="w-full rounded-xl border border-zinc-200 px-3 py-2 text-xs focus:border-red-600 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Position / Official Role</label>
                <input
                  type="text"
                  value={profileData.role}
                  onChange={(e) => setProfileData({ ...profileData, role: e.target.value })}
                  className="w-full rounded-xl border border-zinc-200 px-3 py-2 text-xs focus:border-red-600 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Direct Phone Line</label>
                <input
                  type="text"
                  value={profileData.phone}
                  onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                  className="w-full rounded-xl border border-zinc-200 px-3 py-2 text-xs focus:border-red-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Office Location</label>
                <input
                  type="text"
                  value={profileData.location}
                  onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                  className="w-full rounded-xl border border-zinc-200 px-3 py-2 text-xs focus:border-red-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Operating Hours</label>
                <input
                  type="text"
                  value={profileData.hours}
                  onChange={(e) => setProfileData({ ...profileData, hours: e.target.value })}
                  className="w-full rounded-xl border border-zinc-200 px-3 py-2 text-xs focus:border-red-600 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-zinc-100">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="rounded-xl border border-zinc-200 px-4 py-2 font-bold text-gray-600 hover:bg-zinc-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-red-600 px-4 py-2 font-bold text-white shadow-sm hover:bg-red-700"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </OfficeLayout>
  );
}

function InfoItem({ icon, label, value }) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-zinc-100 text-zinc-600">
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">{label}</p>
        <p className="font-semibold text-gray-900 truncate">{value}</p>
      </div>
    </div>
  );
}
