import { Bell, Lock, MonitorCog, ShieldCheck, SlidersHorizontal } from "lucide-react";
import AdminLayout from "../Layouts/AdminLayouts";

const notificationSettings = [
  {
    title: "Critical incident alerts",
    description: "Receive immediate alerts for critical city-wide incidents.",
    enabled: true,
  },
  {
    title: "Department assignment updates",
    description: "Notify when reports are assigned or reassigned to a department.",
    enabled: true,
  },
  {
    title: "Daily summary email",
    description: "Get a daily digest of reports, resolutions, and pending items.",
    enabled: false,
  },
];

const preferences = [
  {
    title: "Default dashboard view",
    value: "Overview",
  },
  {
    title: "Map display mode",
    value: "Incident markers",
  },
  {
    title: "Initial report filter",
    value: "All active reports",
  },
];

const securityItems = [
  "Require strong password changes every 90 days",
  "Enable multi-factor authentication for admin accounts",
  "Restrict access to verified city devices only",
];

export default function AdminSettings() {
  return (
    <AdminLayout>
      <div className="space-y-4 sm:space-y-6">
        <header className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900">
              Admin Settings
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Configure dashboard preferences, notifications, and admin security.
            </p>
          </div>

          <button className="w-full rounded-xl bg-green-700 px-5 py-3 text-sm font-bold text-white shadow-sm hover:bg-green-800 sm:w-auto">
            Save Changes
          </button>
        </header>

        <section className="grid gap-6 xl:grid-cols-12">
          <div className="space-y-6 xl:col-span-7">
            <SettingsCard
              icon={<Bell size={18} />}
              title="Notifications"
              description="Control which report and response updates reach the admin team."
            >
              <div className="space-y-4">
                {notificationSettings.map((item) => (
                  <ToggleRow key={item.title} item={item} />
                ))}
              </div>
            </SettingsCard>

            <SettingsCard
              icon={<MonitorCog size={18} />}
              title="Dashboard Preferences"
              description="Set the default admin dashboard behavior and report visibility."
            >
              <div className="space-y-3">
                {preferences.map((item) => (
                  <PreferenceRow key={item.title} item={item} />
                ))}
              </div>
            </SettingsCard>
          </div>

          <div className="space-y-6 xl:col-span-5">
            <SettingsCard
              icon={<Lock size={18} />}
              title="Security"
              description="Protect administrator access and response data."
            >
              <div className="space-y-3">
                {securityItems.map((item) => (
                  <div
                    key={item}
                    className="flex items-start gap-3 rounded-xl bg-gray-50 px-4 py-3"
                  >
                    <ShieldCheck
                      size={16}
                      className="mt-0.5 shrink-0 text-green-700"
                    />
                    <p className="text-sm font-semibold text-gray-700">{item}</p>
                  </div>
                ))}
              </div>
            </SettingsCard>

            <SettingsCard
              icon={<SlidersHorizontal size={18} />}
              title="System Controls"
              description="Manage operational settings used by the LGU dashboard."
            >
              <div className="space-y-3">
                <ActionButton label="Manage user roles" />
                <ActionButton label="Update notification channels" />
                <ActionButton label="Review audit history" />
              </div>
            </SettingsCard>
          </div>
        </section>
      </div>
    </AdminLayout>
  );
}

function SettingsCard({ icon, title, description, children }) {
  return (
    <section className="rounded-2xl bg-white p-5 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-50 text-green-700">
          {icon}
        </div>
        <div>
          <h2 className="text-lg font-extrabold text-gray-900">{title}</h2>
          <p className="mt-1 text-sm text-gray-500">{description}</p>
        </div>
      </div>

      <div className="mt-5">{children}</div>
    </section>
  );
}

function ToggleRow({ item }) {
  return (
    <div className="flex items-start justify-between gap-4 rounded-2xl border border-gray-100 p-4">
      <div>
        <h3 className="font-bold text-gray-900">{item.title}</h3>
        <p className="mt-1 text-sm text-gray-500">{item.description}</p>
      </div>

      <button
        type="button"
        className={`relative mt-1 h-7 w-12 shrink-0 rounded-full transition ${
          item.enabled ? "bg-green-700" : "bg-gray-200"
        }`}
        aria-pressed={item.enabled}
      >
        <span
          className={`absolute top-1 h-5 w-5 rounded-full bg-white transition ${
            item.enabled ? "left-6" : "left-1"
          }`}
        />
      </button>
    </div>
  );
}

function PreferenceRow({ item }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-gray-100 p-4">
      <p className="font-bold text-gray-800">{item.title}</p>
      <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-bold text-green-700">
        {item.value}
      </span>
    </div>
  );
}

function ActionButton({ label }) {
  return (
    <button
      type="button"
      className="w-full rounded-xl border border-gray-200 px-4 py-3 text-left text-sm font-bold text-gray-700 transition hover:bg-gray-50"
    >
      {label}
    </button>
  );
}
