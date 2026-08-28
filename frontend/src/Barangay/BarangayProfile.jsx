// src/Barangay/BarangayProfile.jsx
import { useState } from "react";
import { User, Building, Phone, Mail, MapPin, Shield, Check, Save } from "lucide-react";
import BarangayLayout from "./BarangayLayout";
import { getActiveBarangaySession } from "./barangayData";

export default function BarangayProfile() {
  const [session, setSession] = useState(getActiveBarangaySession());
  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <BarangayLayout header="Barangay Hall Profile &amp; Settings">
      <div className="max-w-4xl space-y-6">
        <div className="rounded-3xl border border-zinc-200/80 bg-white p-6 shadow-xs">
          <div className="flex items-center gap-4 pb-6 border-b border-zinc-100">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-700 text-white font-extrabold text-2xl">
              {session.slug.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-zinc-900">{session.barangayName}</h2>
              <p className="text-xs text-zinc-500">Tier 1 Primary Operations Office · City of Malaybalay</p>
            </div>
          </div>

          <form onSubmit={handleSave} className="mt-6 space-y-4 text-xs">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1">
                  Barangay Captain
                </label>
                <input
                  type="text"
                  value={session.captain}
                  onChange={(e) => setSession({ ...session, captain: e.target.value })}
                  className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 p-3 text-xs font-bold text-zinc-800 outline-none focus:border-red-600 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1">
                  Assigned Staff Officer
                </label>
                <input
                  type="text"
                  value={session.staffName}
                  onChange={(e) => setSession({ ...session, staffName: e.target.value })}
                  className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 p-3 text-xs font-bold text-zinc-800 outline-none focus:border-red-600 focus:bg-white"
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1">
                  Official Email Address
                </label>
                <input
                  type="email"
                  value={session.email}
                  onChange={(e) => setSession({ ...session, email: e.target.value })}
                  className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 p-3 text-xs font-bold text-zinc-800 outline-none focus:border-red-600 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1">
                  Hotline / Contact Number
                </label>
                <input
                  type="text"
                  value={session.phone}
                  onChange={(e) => setSession({ ...session, phone: e.target.value })}
                  className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 p-3 text-xs font-bold text-zinc-800 outline-none focus:border-red-600 focus:bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1">
                Barangay Hall Physical Address
              </label>
              <input
                type="text"
                value={session.address}
                onChange={(e) => setSession({ ...session, address: e.target.value })}
                className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 p-3 text-xs font-bold text-zinc-800 outline-none focus:border-red-600 focus:bg-white"
              />
            </div>

            <div className="pt-4 flex items-center justify-between border-t border-zinc-100">
              {saved && (
                <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                  <Check size={14} /> Profile updated successfully!
                </span>
              )}
              <button
                type="submit"
                className="ml-auto flex items-center gap-2 rounded-2xl bg-red-700 px-5 py-3 text-xs font-extrabold text-white shadow-xs hover:bg-red-800 active:scale-95 transition"
              >
                <Save size={14} />
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </BarangayLayout>
  );
}
