// src/Citizen/Login.jsx
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, ArrowRight, Loader2 } from "lucide-react";
import ApplicationLogo from "../Components/ApplicationLogo";
import cityAerial from "../assets/bg.jpg";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Sign in — ACORS Citizen Portal";
  }, []);

  function validate() {
    const next = {};
    if (!email.trim()) {
      next.email = "Email address is required.";
    } else if (!EMAIL_PATTERN.test(email.trim())) {
      next.email = "Enter a valid email address.";
    }
    if (!password) {
      next.password = "Password is required.";
    } else if (password.length < 8) {
      next.password = "Password must be at least 8 characters.";
    }
    return next;
  }

  function handleSubmit(event) {
    event.preventDefault();
    const next = validate();
    setErrors(next);
    if (Object.keys(next).length > 0) return;
    setIsLoading(true);
    window.setTimeout(() => navigate("/home"), 900);
  }

  return (
    <div className="grid min-h-[100dvh] bg-[#F4F7F5] text-zinc-900 lg:grid-cols-2">
      {/* Atmospheric Panel — Desktop */}
      <section className="relative hidden min-h-[100dvh] overflow-hidden lg:flex lg:flex-col lg:justify-between">
        <img
          src={cityAerial}
          alt="Aerial view of Malaybalay City"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-red-950/95 via-red-950/75 to-red-900/35" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.18),transparent_40%)]" />

        <div className="relative z-10 flex items-center justify-between p-10">
          <Brand light />
        </div>

        <div className="relative z-10 p-10 pb-12 lg:max-w-2xl">
          <div className="animate-fade-up">
            <h1 className="text-5xl font-extrabold leading-[1.08] tracking-tight text-white xl:text-6xl">
              Report it. Track it. Watch your city
              respond.
            </h1>

            <p className="mt-6 max-w-md text-base leading-7 text-red-50/90">
              Sign in to submit concerns, follow their progress, and see what
              your barangay is doing about them.
            </p>
          </div>

          <div
            className="mt-10 flex items-center gap-4 animate-fade-up"
            style={{ animationDelay: "120ms" }}
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 backdrop-blur-sm">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-red-400" />
              </span>
              <span className="text-xs font-semibold text-red-50">
                1,248 reports · 972 resolved
              </span>
            </div>
          </div>

          <figure
            className="mt-6 max-w-md rounded-3xl border border-white/15 bg-white/10 p-6 backdrop-blur-sm animate-fade-up"
            style={{ animationDelay: "240ms" }}
          >
            <blockquote className="text-sm leading-6 text-red-50">
              &ldquo;I reported a broken streetlight after dark. It was back on
              the following week.&rdquo;
            </blockquote>
            <figcaption className="mt-3 text-xs font-semibold text-red-200">
              Resident · Barangay 5
            </figcaption>
          </figure>
        </div>
      </section>

      {/* Form Panel */}
      <section className="flex min-h-[100dvh] flex-col">
        {/* Mobile Top Band */}
        <div className="relative overflow-hidden lg:hidden">
          <img
            src={cityAerial}
            alt="Aerial view of Malaybalay City"
            className="h-44 w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-red-950/70 via-red-950/45 to-red-950/90" />

          <div className="absolute left-5 top-5">
            <Brand light />
          </div>
        </div>

        <div className="flex flex-1 flex-col justify-center px-6 py-10 sm:px-12 lg:px-16 xl:px-24">
          <div className="mx-auto w-full max-w-md animate-fade-up">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-red-700">
              Citizen portal
            </p>

            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-zinc-900 sm:text-4xl">
              Welcome back.
            </h2>
            <p className="mt-2 text-sm leading-6 text-zinc-500">
              Sign in to track your reports and stay updated on city response.
            </p>

            <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-5">
              <Field
                id="email"
                label="Email address"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
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
                  Remember me
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

            <div className="my-6 flex items-center gap-4">
              <span className="h-px flex-1 bg-zinc-200" />
              <span className="text-xs font-medium uppercase tracking-wider text-zinc-400">
                or
              </span>
              <span className="h-px flex-1 bg-zinc-200" />
            </div>

            <button
              type="button"
              onClick={() => navigate("/home")}
              className="flex w-full items-center justify-center gap-3 rounded-2xl border border-zinc-200 bg-white py-3.5 text-sm font-semibold text-zinc-700 transition duration-300 hover:border-zinc-300 hover:bg-zinc-50 active:translate-y-px"
            >
              <GoogleMark />
              Sign in with Google
            </button>

            <p className="mt-8 text-center text-sm text-zinc-500">
              New to ACORS?{" "}
              <Link
                to="/home"
                className="font-semibold text-red-600 hover:text-red-700"
              >
                Create an account
              </Link>
            </p>

            <p className="mt-3 text-center text-sm text-zinc-500">
              <Link to="/home" className="font-semibold text-zinc-400 hover:text-zinc-600">
                Continue as guest
              </Link>
            </p>
          </div>

          <p className="mx-auto mt-12 w-full max-w-md text-center text-xs leading-5 text-zinc-400">
            ACORS — Automated Community Operations &amp; Response System.
          </p>
        </div>
      </section>
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

function Brand({ light = false }) {
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
            light ? "text-red-100" : "text-zinc-500"
          }`}
        >
          Automated Community
          <br />
          Operations &amp; Response System
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
          continue as a guest for now.
        </div>
      )}
    </div>
  );
}

function GoogleMark() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47a5.57 5.57 0 0 1-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.29v3.09A11.99 11.99 0 0 0 12 24z"
      />
      <path
        fill="#FBBC05"
        d="M5.27 14.29A7.2 7.2 0 0 1 4.89 12c0-.8.14-1.57.38-2.29V6.62H1.29a11.98 11.98 0 0 0 0 10.76l3.98-3.09z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.69 1.29 6.62l3.98 3.09C6.22 6.86 8.87 4.75 12 4.75z"
      />
    </svg>
  );
}