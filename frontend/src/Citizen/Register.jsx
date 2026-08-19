// src/Citizen/Register.jsx
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Loader2,
  User,
  Phone,
  MapPin,
} from "lucide-react";
import ApplicationLogo from "../Components/ApplicationLogo";
import cityAerial from "../assets/bg.jpg";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_PATTERN = /^09\d{9}$/;

const BARANGAYS = [
  "Casisang",
  "Sumpong",
  "Kalasungay",
  "Aglayan",
  "Bangcud",
  "Managok",
];

export default function Register() {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    barangay: "",
    password: "",
    confirmPassword: "",
    agree: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Create account — ACORS Citizen Portal";
  }, []);

  function setField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function validate() {
    const next = {};
    if (!form.fullName.trim()) {
      next.fullName = "Full name is required.";
    } else if (form.fullName.trim().length < 3) {
      next.fullName = "Enter your full name.";
    }
    if (!form.email.trim()) {
      next.email = "Email address is required.";
    } else if (!EMAIL_PATTERN.test(form.email.trim())) {
      next.email = "Enter a valid email address.";
    }
    if (!form.phone.trim()) {
      next.phone = "Mobile number is required.";
    } else if (!PHONE_PATTERN.test(form.phone.trim())) {
      next.phone = "Use a valid PH mobile number, e.g. 0917 123 4567.";
    }
    if (!form.barangay) {
      next.barangay = "Select your barangay.";
    }
    if (!form.password) {
      next.password = "Password is required.";
    } else if (form.password.length < 8) {
      next.password = "Password must be at least 8 characters.";
    }
    if (!form.confirmPassword) {
      next.confirmPassword = "Confirm your password.";
    } else if (form.confirmPassword !== form.password) {
      next.confirmPassword = "Passwords do not match.";
    }
    if (!form.agree) {
      next.agree = "You must agree to the terms to continue.";
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
              One account for every
              report your city
              hears.
            </h1>

            <p className="mt-6 max-w-md text-base leading-7 text-red-50/90">
              Join the citizen portal to submit concerns, follow their
              progress, and stay in the loop with your barangay and city hall.
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
                Registered residents · 6 barangays
              </span>
            </div>
          </div>

          <figure
            className="mt-6 max-w-md rounded-3xl border border-white/15 bg-white/10 p-6 backdrop-blur-sm animate-fade-up"
            style={{ animationDelay: "240ms" }}
          >
            <blockquote className="text-sm leading-6 text-red-50">
              &ldquo;Signing up took less than two minutes. Now I get
              notified the moment my barangay acts on a report.&rdquo;
            </blockquote>
            <figcaption className="mt-3 text-xs font-semibold text-red-200">
              Resident · Barangay Sumpong
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
              Create your account.
            </h2>
            <p className="mt-2 text-sm leading-6 text-zinc-500">
              A few details and you can start reporting what your city should
              know.
            </p>

            <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-5">
              <Field
                id="fullName"
                label="Full name"
                type="text"
                autoComplete="name"
                placeholder="e.g. Maria Santos"
                icon={<User size={18} />}
                value={form.fullName}
                onChange={(value) => setField("fullName", value)}
                error={errors.fullName}
              />

              <Field
                id="email"
                label="Email address"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                icon={<Mail size={18} />}
                value={form.email}
                onChange={(value) => setField("email", value)}
                error={errors.email}
              />

              <div className="grid gap-5 sm:grid-cols-2">
                <Field
                  id="phone"
                  label="Mobile number"
                  type="tel"
                  autoComplete="tel"
                  placeholder="0917 123 4567"
                  icon={<Phone size={18} />}
                  value={form.phone}
                  onChange={(value) => setField("phone", value)}
                  error={errors.phone}
                />

                <div>
                  <label
                    htmlFor="barangay"
                    className="block text-sm font-semibold text-zinc-800"
                  >
                    Barangay
                  </label>

                  <div className="group relative mt-2">
                    <MapPin
                      size={18}
                      className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 transition group-focus-within:text-red-600"
                    />
                    <select
                      id="barangay"
                      value={form.barangay}
                      onChange={(event) =>
                        setField("barangay", event.target.value)
                      }
                      aria-invalid={Boolean(errors.barangay)}
                      className={`w-full appearance-none rounded-2xl border bg-white py-3.5 pl-12 pr-4 text-sm text-zinc-900 outline-none transition focus:ring-4 ${
                        form.barangay ? "" : "text-zinc-400"
                      } ${
                        errors.barangay
                          ? "border-red-400 focus:border-red-500 focus:ring-red-500/10"
                          : "border-zinc-200 focus:border-red-600 focus:ring-red-600/10"
                      }`}
                    >
                      <option value="" disabled>
                        Select barangay
                      </option>
                      {BARANGAYS.map((barangay) => (
                        <option
                          key={barangay}
                          value={barangay}
                          className="text-zinc-900"
                        >
                          {barangay}
                        </option>
                      ))}
                    </select>
                  </div>

                  {errors.barangay && (
                    <p role="alert" className="mt-2 text-xs font-medium text-red-600">
                      {errors.barangay}
                    </p>
                  )}
                </div>
              </div>

              <PasswordField
                id="password"
                label="Password"
                autoComplete="new-password"
                placeholder="At least 8 characters"
                value={form.password}
                onChange={(value) => setField("password", value)}
                error={errors.password}
                visible={showPassword}
                onToggleVisibility={() => setShowPassword((visible) => !visible)}
              />

              <PasswordField
                id="confirmPassword"
                label="Confirm password"
                autoComplete="new-password"
                placeholder="Re-enter your password"
                value={form.confirmPassword}
                onChange={(value) => setField("confirmPassword", value)}
                error={errors.confirmPassword}
                visible={showConfirm}
                onToggleVisibility={() => setShowConfirm((visible) => !visible)}
              />

              <div>
                <label className="flex cursor-pointer items-start gap-2.5 text-sm font-medium leading-5 text-zinc-600">
                  <input
                    type="checkbox"
                    checked={form.agree}
                    onChange={(event) => setField("agree", event.target.checked)}
                    className="mt-0.5 h-4 w-4 rounded border-zinc-300 accent-red-600"
                  />
                  <span>
                    I agree to the{" "}
                    <a
                      href="#"
                      onClick={(event) => event.preventDefault()}
                      className="font-semibold text-red-600 transition hover:text-red-700"
                    >
                      terms of service
                    </a>{" "}
                    and privacy notice of the ACORS citizen portal.
                  </span>
                </label>
                {errors.agree && (
                  <p role="alert" className="mt-2 text-xs font-medium text-red-600">
                    {errors.agree}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-red-600 py-3.5 text-sm font-bold text-white shadow-[0_14px_28px_rgba(185,28,28,0.22)] transition duration-300 hover:bg-red-700 hover:shadow-[0_18px_32px_rgba(185,28,28,0.28)] active:translate-y-px disabled:opacity-70"
              >
                {isLoading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Creating account…
                  </>
                ) : (
                  <>
                    Create account
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>

            <p className="mt-8 text-center text-sm text-zinc-500">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-semibold text-red-600 hover:text-red-700"
              >
                Sign in
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

function PasswordField({
  id,
  label,
  autoComplete,
  placeholder,
  value,
  onChange,
  error,
  visible,
  onToggleVisibility,
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-semibold text-zinc-800">
        {label}
      </label>

      <div className="group relative mt-2">
        <Lock
          size={18}
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 transition group-focus-within:text-red-600"
        />
        <input
          id={id}
          type={visible ? "text" : "password"}
          autoComplete={autoComplete}
          placeholder={placeholder}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          aria-invalid={Boolean(error)}
          className={`w-full rounded-2xl border bg-white py-3.5 pl-12 pr-12 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:ring-4 ${
            error
              ? "border-red-400 focus:border-red-500 focus:ring-red-500/10"
              : "border-zinc-200 focus:border-red-600 focus:ring-red-600/10"
          }`}
        />
        <button
          type="button"
          onClick={onToggleVisibility}
          aria-label={visible ? "Hide password" : "Show password"}
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-zinc-400 transition hover:text-zinc-700"
        >
          {visible ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
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