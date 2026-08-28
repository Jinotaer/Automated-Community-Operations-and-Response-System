// src/Barangay/BarangayLogin.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, ArrowRight, Building, KeyRound, X, ShieldAlert } from "lucide-react";
import ApplicationLogo from "../Components/ApplicationLogo";
import cityAerial from "../assets/bg.jpg";
import { BARANGAY_ACCOUNTS, setActiveBarangaySession } from "./barangayData";

export default function BarangayLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [demoOpen, setDemoOpen] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleUseDemo = (account) => {
    setEmail(account.email);
    setPassword(account.password);
    setActiveBarangaySession(account);
    setDemoOpen(false);
    setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const match = BARANGAY_ACCOUNTS.find(
      (acc) => acc.email.toLowerCase() === email.trim().toLowerCase()
    );

    if (match) {
      setActiveBarangaySession(match);
      navigate("/barangay/dashboard");
    } else {
      // Default to Casisang if unrecognized demo input
      setActiveBarangaySession(BARANGAY_ACCOUNTS[0]);
      navigate("/barangay/dashboard");
    }
  };

  return (
    <div className="grid min-h-[100dvh] bg-[#F4F7F5] text-zinc-900 lg:grid-cols-2">
      {/* Visual Side Panel */}
      <section className="relative hidden min-h-[100dvh] overflow-hidden lg:flex lg:flex-col lg:justify-between p-10">
        <img
          src={cityAerial}
          alt="Malaybalay City"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-red-950/95 via-red-900/80 to-red-950/95" />

        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ApplicationLogo className="h-12 w-auto" />
            <div>
              <p className="text-xl font-extrabold tracking-tight text-white">
                AC<span className="text-red-500">O</span>RS
              </p>
              <p className="text-[11px] font-medium leading-tight text-red-100">
                Barangay Staff Portal
              </p>
            </div>
          </div>

          <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold text-red-100 backdrop-blur-xs">
            <ShieldAlert size={14} className="text-red-400" />
            TIER 1 · PRIMARY RESPONSE
          </span>
        </div>

        <div className="relative z-10 max-w-xl pb-6">
          <h1 className="text-4xl font-extrabold text-white leading-tight">
            The first level of community complaint handling.
          </h1>
          <p className="mt-4 text-sm text-red-100 leading-relaxed">
            Review submitted reports from residents in your jurisdiction, dispatch Barangay maintenance crews, or escalate heavy infrastructure cases to the City LGU.
          </p>

          <div className="mt-6 flex flex-wrap gap-2">
            {BARANGAY_ACCOUNTS.map((acc) => (
              <span
                key={acc.slug}
                className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-bold text-white backdrop-blur-xs"
              >
                {acc.barangayName}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Form Side */}
      <section className="flex min-h-[100dvh] flex-col justify-center px-6 py-12 sm:px-12 lg:px-16 xl:px-24">
        <div className="mx-auto w-full max-w-md">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-red-700">
            Tier 1 Access
          </p>
          <h2 className="mt-2 text-3xl font-extrabold text-zinc-900">
            Barangay Staff Sign In
          </h2>
          <p className="mt-1 text-xs text-zinc-500">
            Enter your Barangay official credentials to manage local reports.
          </p>

          {error && (
            <p className="mt-4 rounded-2xl border border-red-200 bg-red-50 p-3 text-xs font-semibold text-red-700">
              {error}
            </p>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1">
                Barangay Email
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="casisang@malaybalay.gov.ph"
                  className="w-full rounded-2xl border border-zinc-200 bg-white py-3.5 pl-11 pr-4 text-xs font-semibold outline-none focus:border-red-600 focus:ring-2 focus:ring-red-600/10"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-2xl border border-zinc-200 bg-white py-3.5 pl-11 pr-11 text-xs font-semibold outline-none focus:border-red-600 focus:ring-2 focus:ring-red-600/10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-red-700 py-3.5 text-xs font-extrabold text-white shadow-md hover:bg-red-800 active:scale-98 transition"
            >
              Sign In to Barangay Console
              <ArrowRight size={14} />
            </button>
          </form>

          <div className="mt-5">
            <button
              type="button"
              onClick={() => setDemoOpen(true)}
              className="flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-zinc-300 py-3 text-xs font-bold text-zinc-600 hover:border-red-300 hover:bg-red-50/50 hover:text-red-700 transition"
            >
              <KeyRound size={15} />
              Choose Demo Barangay Account
            </button>
          </div>

          <div className="mt-8 border-t border-zinc-200 pt-5 text-center text-xs text-zinc-500 space-y-1">
            <p>Looking for a different portal?</p>
            <div className="flex justify-center gap-4 font-bold text-red-700">
              <Link to="/home" className="hover:underline">Resident App</Link>
              <span>•</span>
              <Link to="/department/login" className="hover:underline">LGU Offices</Link>
              <span>•</span>
              <Link to="/admin/login" className="hover:underline">LGU Admin</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Demo Modal */}
      {demoOpen && (
        <div
          onClick={() => setDemoOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/60 p-4 backdrop-blur-xs"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl animate-in zoom-in-95"
          >
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100 mb-3">
              <div>
                <p className="text-[10px] font-bold uppercase text-red-700 tracking-wider">Quick Access</p>
                <h3 className="text-base font-extrabold text-zinc-900">Select Barangay Account</h3>
              </div>
              <button
                onClick={() => setDemoOpen(false)}
                className="rounded-full p-1.5 text-zinc-400 hover:bg-zinc-100"
              >
                <X size={16} />
              </button>
            </div>

            <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
              {BARANGAY_ACCOUNTS.map((acc) => (
                <button
                  key={acc.slug}
                  onClick={() => handleUseDemo(acc)}
                  className="flex w-full items-center justify-between rounded-2xl border border-zinc-200 bg-white p-3 text-left hover:border-red-300 hover:bg-red-50/50 transition"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-700 text-white font-bold text-xs">
                      <Building size={16} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-zinc-900">{acc.barangayName}</p>
                      <p className="text-[10px] text-zinc-500 font-mono">{acc.email}</p>
                    </div>
                  </div>
                  <ArrowRight size={14} className="text-zinc-400" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
