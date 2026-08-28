// src/Offices/OfficeLogin.jsx
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Loader2,
  Building2,
  ShieldAlert,
  KeyRound,
  X,
} from "lucide-react";
import ApplicationLogo from "../Components/ApplicationLogo";
import lguResponse from "../assets/bg.jpg";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const MOCK_ACCOUNTS = [
  {
    office: "City Engineering Office",
    email: "engineering@malaybalay.gov.ph",
    password: "acors2025",
    officeSlug: "engineering",
  },
  {
    office: "CENRO",
    email: "cenro@malaybalay.gov.ph",
    password: "acors2025",
    officeSlug: "cenro",
  },
  {
    office: "CDRRMO",
    email: "cdrrmo@malaybalay.gov.ph",
    password: "acors2025",
    officeSlug: "cdrrmo",
  },
  {
    office: "Traffic Management Center",
    email: "traffic@malaybalay.gov.ph",
    password: "acors2025",
    officeSlug: "traffic",
  },
  {
    office: "City Health Office",
    email: "health@malaybalay.gov.ph",
    password: "acors2025",
    officeSlug: "health",
  },
  {
    office: "City Tourism Office",
    email: "tourism@malaybalay.gov.ph",
    password: "acors2025",
    officeSlug: "tourism",
  },
  {
    office: "City Civil Registrar's Office (LCRO)",
    email: "lcro@malaybalay.gov.ph",
    password: "acors2025",
    officeSlug: "lcro",
  },
  {
    office: "City Treasurer's Office",
    email: "treasurer@malaybalay.gov.ph",
    password: "acors2025",
    officeSlug: "treasurer",
  },
  {
    office: "Persons with Disability Affairs Office (PDAO)",
    email: "pdao@malaybalay.gov.ph",
    password: "acors2025",
    officeSlug: "pdao",
  },
  {
    office: "City Social Welfare and Development Office (CSWDO)",
    email: "cswdo@malaybalay.gov.ph",
    password: "acors2025",
    officeSlug: "soloparent",
  },
  {
    office: "Business Permits and Licensing Office (BPLO)",
    email: "bplo@malaybalay.gov.ph",
    password: "acors2025",
    officeSlug: "bplo",
  },
  {
    office: "Office for Senior Citizens Affairs (OSCA)",
    email: "osca@malaybalay.gov.ph",
    password: "acors2025",
    officeSlug: "osca",
  },
  {
    office: "City Assessor's Office",
    email: "assessor@malaybalay.gov.ph",
    password: "acors2025",
    officeSlug: "assessor",
  },
];

export default function OfficeLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [demoOpen, setDemoOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Sign in — ACORS Portal";
  }, []);

  function validate() {
    const next = {};
    if (!email.trim()) {
      next.email = "LGU email is required.";
    } else if (!EMAIL_PATTERN.test(email.trim())) {
      next.email = "Enter a valid LGU email address.";
    }
    if (!password) {
      next.password = "Password is required.";
    } else if (password.length < 8) {
      next.password = "Password must be at least 8 characters.";
    }
    return next;
  }

  function useDemoAccount(account) {
    setEmail(account.email);
    setPassword(account.password);
    setErrors({});
    setFormError("");
    setDemoOpen(false);
  }

  function handleSubmit(event) {
    event.preventDefault();
    const next = validate();
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    const account = MOCK_ACCOUNTS.find(
      (mock) =>
        email.trim().toLowerCase() === mock.email &&
        password === mock.password
    );

    if (!account) {
      setFormError("Invalid credentials. Use one of the demo accounts below.");
      return;
    }

    setFormError("");
    setIsLoading(true);
    window.setTimeout(
      () => navigate(`/department/${account.officeSlug}/overview`),
      900
    );
  }

  return (
    <div className="grid min-h-[100dvh] bg-[#F4F7F5] text-zinc-900 lg:grid-cols-2">
      {/* Operations Panel — Desktop */}
      <section className="relative hidden min-h-[100dvh] overflow-hidden lg:flex lg:flex-col lg:justify-between">
        <img
          src={lguResponse}
          alt="Local government response team reviewing city operations"
          className="absolute inset-0 h-full w-full object-cover"
        />
         <div className="absolute inset-0 bg-gradient-to-br from-red-950/95 via-red-950/75 to-red-900/35" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.18),transparent_40%)]" />

        <div className="relative z-10 flex items-center justify-between p-10">
          <OfficeBrand light />

          <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold tracking-[0.18em] text-zinc-200 backdrop-blur-sm animate-fade-up">
            <ShieldAlert size={13} className="text-red-400" />
            RESTRICTED · LGU PERSONNEL ONLY
          </span>
        </div>

        <div className="relative z-10 p-10 pb-12 lg:max-w-2xl">
          <div className="animate-fade-up">
            <h1 className="text-5xl font-extrabold leading-[1.08] tracking-tight text-white xl:text-6xl">
              Review it. Respond it.{" "}
              <ApplicationLogo
                className="inline-block h-11 w-11 translate-y-[-2px] rounded-xl object-cover align-middle shadow-[0_10px_24px_rgba(0,0,0,0.3)] ring-2 ring-white/25"
                size={44}
              />{" "}
              Resolve it.
            </h1>

            <p className="mt-6 max-w-md text-base leading-7 text-zinc-300">
              Sign in with your LGU account to claim reports assigned to your
              department, update progress, and close them out for your barangays.
            </p>
          </div>

          <div
            className="mt-10 flex items-center gap-4 animate-fade-up"
            style={{ animationDelay: "120ms" }}
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 backdrop-blur-sm">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
              </span>
              <span className="text-xs font-semibold text-zinc-200">
                6 departments · 147 assigned reports
              </span>
            </div>
          </div>

          <div
            className="mt-6 flex max-w-md items-center gap-4 rounded-3xl border border-white/15 bg-white/10 p-6 backdrop-blur-sm animate-fade-up"
            style={{ animationDelay: "240ms" }}
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-red-600 text-white">
              <Building2 size={20} />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-zinc-100">
                City Engineering Office
              </p>
              <p className="mt-1 text-xs leading-5 text-zinc-400">
                48 assigned · 8 critical · 2.4 hrs avg response
              </p>
            </div>
            <span className="ml-auto shrink-0 rounded-full bg-red-500/15 px-3 py-1 text-[10px] font-bold text-red-300">
              ACTIVE
            </span>
          </div>
        </div>
      </section>

      {/* Form Panel */}
      <section className="flex min-h-[100dvh] flex-col">
        {/* Mobile Top Band */}
        <div className="relative overflow-hidden lg:hidden">
          <img
            src={lguResponse}
            alt="Local government response team reviewing city operations"
            className="h-44 w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-zinc-950/70 via-zinc-950/45 to-zinc-950/90" />

          <div className="absolute left-5 top-5">
            <OfficeBrand light />
          </div>
        </div>

        <div className="flex flex-1 flex-col justify-center px-6 py-10 sm:px-12 lg:px-16 xl:px-24">
          <div className="mx-auto w-full max-w-md animate-fade-up">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-red-600">
              LGU portal
            </p>

            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-zinc-900 sm:text-4xl">
              Sign in.
            </h2>
            <p className="mt-2 text-sm leading-6 text-zinc-500">
              Sign in with your LGU account to manage assigned reports.
            </p>

            <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-5">
              {formError && (
                <p
                  role="alert"
                  className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-xs font-medium leading-5 text-red-700"
                >
                  {formError}
                </p>
              )}

              <Field
                id="email"
                label="LGU email address"
                type="email"
                autoComplete="email"
                placeholder="name@malaybalay.gov.ph"
                icon={<Mail size={18} />}
                value={email}
                onChange={(value) => setEmail(value)}
                error={errors.email}
              />

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-semibold text-zinc-800"
                >
                  Password
                </label>

                <div className="group relative mt-2">
                  <Lock
                    size={18}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 transition group-focus-within:text-red-600"
                  />
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder="At least 8 characters"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    aria-invalid={Boolean(errors.password)}
                    className={`w-full rounded-2xl border bg-white py-3.5 pl-12 pr-12 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:ring-4 ${
                      errors.password
                        ? "border-red-400 focus:border-red-500 focus:ring-red-500/10"
                        : "border-zinc-200 focus:border-red-600 focus:ring-red-600/10"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((visible) => !visible)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-zinc-400 transition hover:text-zinc-700"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                {errors.password && (
                  <p role="alert" className="mt-2 text-xs font-medium text-red-600">
                    {errors.password}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between">
                <label className="flex cursor-pointer items-center gap-2.5 text-sm font-medium text-zinc-600">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-zinc-300 accent-red-600"
                  />
                  Keep me signed in
                </label>

                <ForgotPasswordLink />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-red-600 py-3.5 text-sm font-bold text-white shadow-[0_14px_28px_rgba(185,28,28,0.22)] transition duration-300 hover:bg-red-700 hover:shadow-[0_18px_32px_rgba(185,28,28,0.28)] active:translate-y-px disabled:opacity-70"
              >
                {isLoading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Signing in…
                  </>
                ) : (
                  <>
                    Sign in
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>

            <div className="mt-6">
              <button
                type="button"
                onClick={() => setDemoOpen(true)}
                className="flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-zinc-300 bg-transparent py-3 text-sm font-semibold text-zinc-500 transition duration-300 hover:border-red-300 hover:bg-red-50/50 hover:text-red-600 active:translate-y-px"
              >
                <KeyRound size={16} />
                Use a demo account
              </button>
            </div>

            <div className="mt-6 border-t border-zinc-200 pt-4 text-center text-xs text-zinc-500">
              <span>Switch System Tier: </span>
              <Link to="/home" className="font-bold text-red-600 hover:underline">
                Resident App
              </Link>
              <span className="mx-2">•</span>
              <Link to="/barangay/login" className="font-bold text-red-600 hover:underline">
                Barangay Staff
              </Link>
              <span className="mx-2">•</span>
              <Link to="/admin/login" className="font-bold text-red-600 hover:underline">
                LGU Admin
              </Link>
            </div>
          </div>

          <p className="mx-auto mt-8 w-full max-w-md text-center text-xs leading-5 text-zinc-400">
            ACORS — Automated Community Operations &amp; Response System.
            <br />
            Restricted area. Authorized LGU personnel only.
          </p>
        </div>
      </section>

      {/* Demo Accounts Modal */}
      {demoOpen && (
        <div
          onClick={() => setDemoOpen(false)}
          className="fixed inset-0 z-50 flex animate-fade-in items-center justify-center bg-zinc-950/60 p-4 backdrop-blur-sm sm:p-6"
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Demo accounts"
            onClick={(event) => event.stopPropagation()}
            className="flex max-h-[88vh] w-full max-w-lg flex-col overflow-hidden rounded-[2rem] bg-white p-5 shadow-2xl animate-modal-in sm:max-h-[84vh] sm:p-6"
          >
            {/* Modal Header */}
            <div className="shrink-0 border-b border-zinc-100 pb-3.5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-red-600">
                    Quick Access
                  </p>
                  <h3 className="mt-0.5 text-lg font-extrabold text-zinc-900 sm:text-xl">
                    LGU Demo Accounts
                  </h3>
                </div>

                <button
                  type="button"
                  onClick={() => setDemoOpen(false)}
                  aria-label="Close demo accounts"
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-zinc-500 transition hover:bg-zinc-200 hover:text-zinc-900"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="mt-2.5 flex items-center justify-between rounded-xl bg-zinc-50 px-3.5 py-2 text-xs text-zinc-600">
                <span>Default Password:</span>
                <span className="font-mono font-bold text-zinc-900 bg-white border border-zinc-200 rounded-md px-2 py-0.5 shadow-2xs">
                  acors2025
                </span>
              </div>
            </div>

            {/* Scrollable Accounts List */}
            <ul className="mt-3 flex-1 space-y-2 overflow-y-auto pr-1 overscroll-contain">
              {MOCK_ACCOUNTS.map((account) => (
                <li key={account.officeSlug}>
                  <button
                    type="button"
                    onClick={() => useDemoAccount(account)}
                    className="group flex w-full items-center gap-3 rounded-2xl border border-zinc-200 bg-white p-3 text-left transition hover:border-red-300 hover:bg-red-50/40 active:scale-[0.99]"
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-red-600 text-white shadow-xs">
                      <Building2 size={16} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-bold text-zinc-900 sm:text-sm">
                        {account.office}
                      </p>
                      <p className="truncate font-mono text-[11px] text-zinc-500">
                        {account.email}
                      </p>
                    </div>

                    <ArrowRight
                      size={15}
                      className="shrink-0 text-zinc-300 transition group-hover:translate-x-0.5 group-hover:text-red-600"
                    />
                  </button>
                </li>
              ))}
            </ul>

            {/* Modal Footer */}
            <div className="shrink-0 border-t border-zinc-100 pt-3 text-center">
              <p className="text-[11px] text-zinc-400">
                Click any department account to autofill credentials instantly.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Field({
  id,
  label,
  type,
  autoComplete,
  placeholder,
  icon,
  value,
  onChange,
  error,
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-semibold text-zinc-800">
        {label}
      </label>

      <div className="group relative mt-2">
        {icon && (
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 transition group-focus-within:text-red-600">
            {icon}
          </span>
        )}

        <input
          id={id}
          type={type}
          autoComplete={autoComplete}
          placeholder={placeholder}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          aria-invalid={Boolean(error)}
          className={`w-full rounded-2xl border bg-white py-3.5 pl-12 pr-4 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:ring-4 ${
            error
              ? "border-red-400 focus:border-red-500 focus:ring-red-500/10"
              : "border-zinc-200 focus:border-red-600 focus:ring-red-600/10"
          }`}
        />
      </div>

      {error && (
        <p role="alert" className="mt-2 text-xs font-medium text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}

function OfficeBrand({ light = false }) {
  return (
    <div className="flex items-center gap-3">
      <ApplicationLogo className="h-12 w-auto" />

      <div>
        <p
          className={`text-xl font-extrabold tracking-tight ${
            light ? "text-white" : "text-zinc-900"
          }`}
        >
          AC<span className="text-red-600">O</span>RS
        </p>
        <p
          className={`text-[11px] font-medium leading-tight ${
            light ? "text-zinc-300" : "text-zinc-500"
          }`}
        >
          LGU
          <br />
          Portal
        </p>
      </div>
    </div>
  );
}

function ForgotPasswordLink() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        className="text-sm font-semibold text-red-600 transition hover:text-red-700"
      >
        Forgot password?
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full z-10 mt-2 w-64 rounded-2xl border border-zinc-200 bg-white p-4 text-xs leading-5 text-zinc-500 shadow-lg">
          Password reset is not available yet. Contact the city hall IT desk or
          use your LGU Google account for now.
        </div>
      )}
    </div>
  );
}