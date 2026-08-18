// src/Citizen/Profile.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  MapPin,
  ShieldCheck,
  FileText,
  CheckCircle,
  Clock,
  AlertTriangle,
  Settings,
  Bell,
  LogOut,
  ChevronRight,
  Check,
  Lock,
  Download,
  Trash2,
  Eye,
} from "lucide-react";
import CitizenLayout from "../Layouts/CitizenLayouts";

export default function Profile() {
  const [activePanel, setActivePanel] = useState(null);
  const navigate = useNavigate();

  const handleLogout = () => navigate("/login");

  const panelProps = {
    onBack: () => setActivePanel(null),
  };

  return (
    <CitizenLayout hideNavigation={Boolean(activePanel)}>
      {activePanel === "notifications" ? (
        <NotificationsPanel {...panelProps} />
      ) : activePanel === "settings" ? (
        <AccountSettingsPanel {...panelProps} />
      ) : activePanel === "privacy" ? (
        <PrivacyPanel {...panelProps} />
      ) : (
        <>
          {/* Mobile View */}
          <div className="lg:hidden">
            <main className="px-5 pt-6">
              {/* Profile Card */}
              <section className="rounded-3xl bg-red-600 p-5 text-white shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white text-red-600">
                    <User size={36} />
                  </div>

                  <div>
                    <h2 className="text-xl font-extrabold">Juan Dela Cruz</h2>
                    <p className="text-sm text-red-100">Resident Account</p>

                    <div className="mt-2 inline-flex items-center gap-1 rounded-full bg-white/20 px-3 py-1 text-xs font-bold">
                      <ShieldCheck size={14} />
                      Verified Resident
                    </div>
                  </div>
                </div>
              </section>

              {/* Contact Info */}
              <section className="mt-5 rounded-3xl bg-white p-5 shadow-sm">
                <h3 className="text-sm font-extrabold text-gray-900">
                  Personal Information
                </h3>

                <div className="mt-4 space-y-4">
                  <InfoItem icon={<Mail size={18} />} label="Email" value="juan@example.com" />
                  <InfoItem icon={<Phone size={18} />} label="Phone" value="0912 345 6789" />
                  <InfoItem icon={<MapPin size={18} />} label="Address" value="Casisang, Malaybalay City" />
                </div>
              </section>

              {/* Report Summary */}
              <section className="mt-5 grid grid-cols-2 gap-4">
                <ProfileStat
                  icon={<FileText size={22} />}
                  title="Total Reports"
                  value="12"
                  color="bg-red-50 text-red-600"
                />
                <ProfileStat
                  icon={<Clock size={22} />}
                  title="In Progress"
                  value="4"
                  color="bg-yellow-50 text-yellow-700"
                />
                <ProfileStat
                  icon={<CheckCircle size={22} />}
                  title="Resolved"
                  value="7"
                  color="bg-blue-50 text-blue-700"
                />
                <ProfileStat
                  icon={<AlertTriangle size={22} />}
                  title="Critical"
                  value="1"
                  color="bg-red-50 text-red-700"
                />
              </section>

              {/* Settings */}
              <section className="mt-5 rounded-3xl bg-white p-3 shadow-sm">
                <ProfileMenuItem icon={<Bell size={20} />} label="Notifications" onClick={() => setActivePanel("notifications")} />
                <ProfileMenuItem icon={<Settings size={20} />} label="Account Settings" onClick={() => setActivePanel("settings")} />
                <ProfileMenuItem icon={<ShieldCheck size={20} />} label="Privacy & Verification" onClick={() => setActivePanel("privacy")} />
                <ProfileMenuItem icon={<LogOut size={20} />} label="Logout" danger onClick={handleLogout} />
              </section>
            </main>
          </div>

          {/* Desktop View */}
          <div className="hidden lg:block">
            <header className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-extrabold text-gray-900">
                  Resident Profile
                </h1>
                <p className="mt-1 text-gray-500">
                  View and manage your citizen profile and report activity.
                </p>
              </div>

              <button
                onClick={() => setActivePanel("settings")}
                className="rounded-2xl bg-red-600 px-5 py-3 text-sm font-semibold text-white hover:bg-red-700"
              >
                Edit Profile
              </button>
            </header>

            <section className="mt-8 grid grid-cols-12 gap-6">
              {/* Left Profile Panel */}
              <aside className="col-span-4 rounded-3xl bg-white p-6 shadow-sm">
                <div className="flex flex-col items-center text-center">
                  <div className="flex h-28 w-28 items-center justify-center rounded-full bg-red-100 text-red-600">
                    <User size={52} />
                  </div>

                  <h2 className="mt-4 text-2xl font-extrabold text-gray-900">
                    Juan Dela Cruz
                  </h2>
                  <p className="text-sm text-gray-500">Resident Account</p>

                  <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-red-50 px-4 py-2 text-sm font-bold text-red-600">
                    <ShieldCheck size={16} />
                    Verified Resident
                  </div>
                </div>

                <div className="mt-8 space-y-4">
                  <InfoItem icon={<Mail size={18} />} label="Email" value="juan@example.com" />
                  <InfoItem icon={<Phone size={18} />} label="Phone" value="0912 345 6789" />
                  <InfoItem icon={<MapPin size={18} />} label="Barangay" value="Casisang" />
                  <InfoItem icon={<MapPin size={18} />} label="City" value="Malaybalay City, Bukidnon" />
                </div>
              </aside>

              {/* Right Content */}
              <main className="col-span-8 space-y-6">
                <section className="grid grid-cols-4 gap-6">
                  <DesktopStat title="Total Reports" value="12" color="text-red-600" />
                  <DesktopStat title="Pending" value="2" color="text-gray-600" />
                  <DesktopStat title="In Progress" value="4" color="text-yellow-600" />
                  <DesktopStat title="Resolved" value="7" color="text-red-600" />
                </section>

                <section className="rounded-3xl bg-white p-6 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-extrabold text-gray-900">
                        Recent Report Activity
                      </h3>
                      <p className="text-sm text-gray-500">
                        Latest updates from your submitted reports.
                      </p>
                    </div>

                    <button className="text-sm font-bold text-red-600">
                      View all
                    </button>
                  </div>

                  <div className="mt-5 space-y-4">
                    <ActivityItem
                      title="Road damage near public market"
                      status="In Progress"
                      date="Updated today"
                    />
                    <ActivityItem
                      title="Garbage accumulation near river"
                      status="Under Review"
                      date="Updated yesterday"
                    />
                    <ActivityItem
                      title="Broken streetlight in front of school"
                      status="Resolved"
                      date="Updated June 6, 2025"
                    />
                  </div>
                </section>

                <section className="rounded-3xl bg-white p-6 shadow-sm">
                  <h3 className="text-xl font-extrabold text-gray-900">
                    Account Options
                  </h3>

                  <div className="mt-5 grid grid-cols-2 gap-4">
                    <DesktopOption icon={<Bell size={22} />} title="Notifications" onClick={() => setActivePanel("notifications")} />
                    <DesktopOption icon={<Settings size={22} />} title="Account Settings" onClick={() => setActivePanel("settings")} />
                    <DesktopOption icon={<ShieldCheck size={22} />} title="Privacy & Verification" onClick={() => setActivePanel("privacy")} />
                    <DesktopOption icon={<LogOut size={22} />} title="Logout" danger onClick={handleLogout} />
                  </div>
                </section>
              </main>
            </section>
          </div>
        </>
      )}
    </CitizenLayout>
  );
}

function PanelHeader({ title, description, onBack }) {
  return (
    <header className="flex items-center gap-4">
      <button
        type="button"
        onClick={onBack}
        aria-label="Back to profile"
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white text-gray-700 transition hover:bg-red-50 hover:text-red-600"
      >
        <ArrowLeft size={20} />
      </button>

      <div>
        <h1 className="text-2xl font-extrabold text-gray-900">{title}</h1>
        {description && (
          <p className="mt-0.5 text-sm text-gray-500">{description}</p>
        )}
      </div>
    </header>
  );
}

function NotificationsPanel({ onBack }) {
  return (
    <div className="animate-fade-up">
      {/* Mobile */}
      <div className="lg:hidden">
        <main className="px-5 pt-6 pb-24">
          <PanelHeader
            title="Notifications"
            description="Choose which updates you receive."
            onBack={onBack}
          />

          <section className="mt-6 rounded-3xl bg-white p-5 shadow-sm">
            <h3 className="text-sm font-extrabold text-gray-900">
              Push Notifications
            </h3>

            <div className="mt-4 space-y-5">
              <ToggleItem title="Report status updates" description="Updates on your submitted reports" defaultOn />
              <ToggleItem title="Community updates" description="New public reports near you" defaultOn />
              <ToggleItem title="LGU announcements" description="City-wide advisories and notices" />
              <ToggleItem title="Emergency alerts" description="Critical alerts in your barangay" defaultOn />
            </div>
          </section>

          <section className="mt-4 rounded-3xl bg-white p-5 shadow-sm">
            <h3 className="text-sm font-extrabold text-gray-900">
              Email Notifications
            </h3>

            <div className="mt-4 space-y-5">
              <ToggleItem title="Weekly report digest" description="Summary of your report activity" />
              <ToggleItem title="Monthly city summary" description="Highlights from the past month" />
            </div>
          </section>
        </main>
      </div>

      {/* Desktop */}
      <div className="hidden lg:block">
        <PanelHeader
          title="Notifications"
          description="Choose which updates you receive."
          onBack={onBack}
        />

        <div className="mt-8 grid max-w-4xl grid-cols-2 gap-6">
          <section className="rounded-3xl bg-white p-6 shadow-sm">
            <h3 className="text-lg font-extrabold text-gray-900">
              Push Notifications
            </h3>

            <div className="mt-5 space-y-6">
              <ToggleItem title="Report status updates" description="Updates on your submitted reports" defaultOn />
              <ToggleItem title="Community updates" description="New public reports near you" defaultOn />
              <ToggleItem title="LGU announcements" description="City-wide advisories and notices" />
              <ToggleItem title="Emergency alerts" description="Critical alerts in your barangay" defaultOn />
            </div>
          </section>

          <section className="rounded-3xl bg-white p-6 shadow-sm">
            <h3 className="text-lg font-extrabold text-gray-900">
              Email Notifications
            </h3>

            <div className="mt-5 space-y-6">
              <ToggleItem title="Weekly report digest" description="Summary of your report activity" />
              <ToggleItem title="Monthly city summary" description="Highlights from the past month" />
            </div>

            <div className="mt-8 rounded-2xl bg-gray-50 p-4">
              <p className="text-sm font-bold text-gray-800">
                Quiet Hours
              </p>
              <p className="mt-1 text-xs leading-5 text-gray-500">
                Mute push notifications between 10:00 PM and 6:00 AM.
              </p>
              <div className="mt-3">
                <ToggleItem title="Enable quiet hours" />
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

function AccountSettingsPanel({ onBack }) {
  const [infoSaved, setInfoSaved] = useState(false);
  const [passwordSaved, setPasswordSaved] = useState(false);

  const handleSaveInfo = () => {
    setInfoSaved(true);
    setTimeout(() => setInfoSaved(false), 2000);
  };

  const handleSavePassword = () => {
    setPasswordSaved(true);
    setTimeout(() => setPasswordSaved(false), 2000);
  };

  return (
    <div className="animate-fade-up">
      {/* Mobile */}
      <div className="lg:hidden">
        <main className="px-5 pt-6 pb-24">
          <PanelHeader
            title="Account Settings"
            description="Update your personal information."
            onBack={onBack}
          />

          <section className="mt-6 rounded-3xl bg-white p-5 shadow-sm">
            <h3 className="text-sm font-extrabold text-gray-900">
              Personal Information
            </h3>

            <div className="mt-4 space-y-4">
              <FormInput label="Full Name" defaultValue="Juan Dela Cruz" />
              <FormInput label="Email Address" type="email" defaultValue="juan@example.com" />
              <FormInput label="Phone Number" type="tel" defaultValue="0912 345 6789" />
              <FormInput label="Barangay" defaultValue="Casisang" />
            </div>

            <SaveButton saved={infoSaved} onClick={handleSaveInfo} />
          </section>

          <section className="mt-4 rounded-3xl bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-600">
                <Lock size={18} />
              </div>
              <h3 className="text-sm font-extrabold text-gray-900">
                Change Password
              </h3>
            </div>

            <div className="mt-4 space-y-4">
              <FormInput label="Current Password" type="password" />
              <FormInput label="New Password" type="password" />
              <FormInput label="Confirm New Password" type="password" />
            </div>

            <SaveButton saved={passwordSaved} onClick={handleSavePassword} label="Update Password" />
          </section>
        </main>
      </div>

      {/* Desktop */}
      <div className="hidden lg:block">
        <PanelHeader
          title="Account Settings"
          description="Update your personal information."
          onBack={onBack}
        />

        <div className="mt-8 grid max-w-4xl grid-cols-2 gap-6">
          <section className="rounded-3xl bg-white p-6 shadow-sm">
            <h3 className="text-lg font-extrabold text-gray-900">
              Personal Information
            </h3>

            <div className="mt-5 space-y-4">
              <FormInput label="Full Name" defaultValue="Juan Dela Cruz" />
              <FormInput label="Email Address" type="email" defaultValue="juan@example.com" />
              <FormInput label="Phone Number" type="tel" defaultValue="0912 345 6789" />
              <FormInput label="Barangay" defaultValue="Casisang" />
            </div>

            <SaveButton saved={infoSaved} onClick={handleSaveInfo} />
          </section>

          <section className="rounded-3xl bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-red-50 text-red-600">
                <Lock size={20} />
              </div>
              <h3 className="text-lg font-extrabold text-gray-900">
                Change Password
              </h3>
            </div>

            <div className="mt-5 space-y-4">
              <FormInput label="Current Password" type="password" />
              <FormInput label="New Password" type="password" />
              <FormInput label="Confirm New Password" type="password" />
            </div>

            <SaveButton saved={passwordSaved} onClick={handleSavePassword} label="Update Password" />
          </section>
        </div>
      </div>
    </div>
  );
}

function PrivacyPanel({ onBack }) {
  return (
    <div className="animate-fade-up">
      {/* Mobile */}
      <div className="lg:hidden">
        <main className="px-5 pt-6 pb-24">
          <PanelHeader
            title="Privacy & Verification"
            description="Control your data and account security."
            onBack={onBack}
          />

          <section className="mt-6 rounded-3xl bg-red-600 p-5 text-white shadow-sm">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white text-red-600">
                <ShieldCheck size={24} />
              </div>
              <div>
                <h3 className="font-extrabold">Verified Resident</h3>
                <p className="mt-1 text-xs leading-5 text-red-100">
                  Your identity has been verified with the LGU. You can report
                  issues and receive official updates.
                </p>
              </div>
            </div>
          </section>

          <section className="mt-4 rounded-3xl bg-white p-5 shadow-sm">
            <h3 className="text-sm font-extrabold text-gray-900">
              Privacy Settings
            </h3>

            <div className="mt-4 space-y-5">
              <ToggleItem title="Share location for nearby incidents" description="Helps show reports within your barangay" defaultOn />
              <ToggleItem title="Show my reports publicly" description="Visible to other residents on the map" />
              <ToggleItem title="Allow contact via phone" description="The LGU may reach you for updates" defaultOn />
            </div>
          </section>

          <section className="mt-4 rounded-3xl bg-white p-5 shadow-sm">
            <h3 className="text-sm font-extrabold text-gray-900">Your Data</h3>

            <button className="mt-4 flex w-full items-center gap-3 rounded-2xl bg-gray-50 px-4 py-4 text-left transition hover:bg-gray-100">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <Download size={18} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-gray-900">Download my data</p>
                <p className="text-xs text-gray-500">Export your reports and profile</p>
              </div>
              <ChevronRight size={18} className="text-gray-400" />
            </button>

            <button className="mt-3 flex w-full items-center gap-3 rounded-2xl bg-red-50 px-4 py-4 text-left transition hover:bg-red-100">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-100 text-red-600">
                <Trash2 size={18} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-red-700">Delete account</p>
                <p className="text-xs text-red-500">Permanently remove your account</p>
              </div>
              <ChevronRight size={18} className="text-red-300" />
            </button>
          </section>
        </main>
      </div>

      {/* Desktop */}
      <div className="hidden lg:block">
        <PanelHeader
          title="Privacy & Verification"
          description="Control your data and account security."
          onBack={onBack}
        />

        <div className="mt-8 grid max-w-4xl grid-cols-2 gap-6">
          <div className="space-y-6">
            <section className="rounded-3xl bg-red-600 p-6 text-white shadow-sm">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-white text-red-600">
                  <ShieldCheck size={28} />
                </div>
                <div>
                  <h3 className="text-lg font-extrabold">Verified Resident</h3>
                  <p className="mt-1 text-sm leading-6 text-red-100">
                    Your identity has been verified with the LGU. You can
                    report issues and receive official updates.
                  </p>
                </div>
              </div>
            </section>

            <section className="rounded-3xl bg-white p-6 shadow-sm">
              <h3 className="text-lg font-extrabold text-gray-900">Your Data</h3>

              <button className="mt-4 flex w-full items-center gap-3 rounded-2xl bg-gray-50 px-4 py-4 text-left transition hover:bg-gray-100">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <Download size={20} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-gray-900">Download my data</p>
                  <p className="text-xs text-gray-500">Export your reports and profile</p>
                </div>
                <ChevronRight size={18} className="text-gray-400" />
              </button>

              <button className="mt-3 flex w-full items-center gap-3 rounded-2xl bg-red-50 px-4 py-4 text-left transition hover:bg-red-100">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-100 text-red-600">
                  <Trash2 size={20} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-red-700">Delete account</p>
                  <p className="text-xs text-red-500">Permanently remove your account</p>
                </div>
                <ChevronRight size={18} className="text-red-300" />
              </button>
            </section>
          </div>

          <section className="rounded-3xl bg-white p-6 shadow-sm">
            <h3 className="text-lg font-extrabold text-gray-900">
              Privacy Settings
            </h3>

            <div className="mt-5 space-y-6">
              <ToggleItem title="Share location for nearby incidents" description="Helps show reports within your barangay" defaultOn />
              <ToggleItem title="Show my reports publicly" description="Visible to other residents on the map" />
              <ToggleItem title="Allow contact via phone" description="The LGU may reach you for updates" defaultOn />
            </div>

            <div className="mt-8 rounded-2xl bg-gray-50 p-4">
              <div className="flex items-center gap-3">
                <Eye size={18} className="text-gray-500" />
                <p className="text-sm font-bold text-gray-800">
                  Account Activity
                </p>
              </div>
              <p className="mt-1 text-xs leading-5 text-gray-500">
                Review recent logins and sessions for your account.
              </p>
              <button className="mt-3 w-full rounded-xl border border-gray-200 bg-white py-3 text-sm font-bold text-gray-700 transition hover:bg-gray-50">
                View Active Sessions
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

function ToggleItem({ title, description, defaultOn = false }) {
  const [enabled, setEnabled] = useState(defaultOn);

  return (
    <div className="flex items-center justify-between gap-4">
      <div className="min-w-0">
        <p className="text-sm font-bold text-gray-900">{title}</p>
        {description && (
          <p className="mt-0.5 text-xs leading-5 text-gray-500">{description}</p>
        )}
      </div>

      <button
        type="button"
        role="switch"
        aria-checked={enabled}
        aria-label={title}
        onClick={() => setEnabled(!enabled)}
        className={`relative h-7 w-12 shrink-0 rounded-full transition-colors duration-200 ${
          enabled ? "bg-red-600" : "bg-gray-200"
        }`}
      >
        <span
          className={`absolute left-1 top-1 h-5 w-5 rounded-full bg-white shadow transition-transform duration-200 ${
            enabled ? "translate-x-5" : ""
          }`}
        />
      </button>
    </div>
  );
}

function FormInput({ label, type = "text", defaultValue }) {
  return (
    <div>
      <label className="text-xs font-bold uppercase tracking-wide text-gray-500">
        {label}
      </label>
      <input
        type={type}
        defaultValue={defaultValue}
        className="mt-1.5 w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-900 outline-none transition focus:border-red-600 focus:ring-1 focus:ring-red-600"
      />
    </div>
  );
}

function SaveButton({ saved, onClick, label = "Save Changes" }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`mt-5 flex w-full items-center justify-center gap-2 rounded-2xl py-3.5 text-sm font-extrabold text-white transition ${
        saved ? "bg-green-600" : "bg-red-600 hover:bg-red-700"
      }`}
    >
      {saved ? (
        <>
          <Check size={17} strokeWidth={3} />
          Saved
        </>
      ) : (
        label
      )}
    </button>
  );
}

function InfoItem({ icon, label, value }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-600">
        {icon}
      </div>

      <div className="min-w-0">
        <p className="text-xs font-semibold text-gray-400">{label}</p>
        <p className="truncate text-sm font-bold text-gray-800">{value}</p>
      </div>
    </div>
  );
}

function ProfileStat({ icon, title, value, color }) {
  return (
    <div className={`rounded-3xl p-4 shadow-sm ${color}`}>
      <div className="flex items-center justify-between">
        {icon}
        <h3 className="text-2xl font-extrabold">{value}</h3>
      </div>
      <p className="mt-3 text-xs font-bold">{title}</p>
    </div>
  );
}

function ProfileMenuItem({ icon, label, danger = false, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center gap-3 rounded-2xl px-4 py-4 text-left text-sm font-bold transition hover:bg-gray-50 ${
        danger ? "text-red-600" : "text-gray-800"
      }`}
    >
      {icon}
      <span className="flex-1">{label}</span>
      {!danger && <ChevronRight size={18} className="text-gray-300" />}
    </button>
  );
}

function DesktopStat({ title, value, color }) {
  return (
    <div className="rounded-3xl bg-white p-6 shadow-sm">
      <p className="text-sm font-medium text-gray-500">{title}</p>
      <h2 className={`mt-3 text-4xl font-extrabold ${color}`}>{value}</h2>
    </div>
  );
}

function ActivityItem({ title, status, date }) {
  const statusColor =
    status === "Resolved"
      ? "bg-red-100 text-red-600"
      : status === "In Progress"
        ? "bg-yellow-100 text-yellow-700"
        : "bg-blue-100 text-blue-700";

  return (
    <div className="flex items-center justify-between rounded-2xl border border-gray-100 p-4">
      <div>
        <h4 className="font-bold text-gray-900">{title}</h4>
        <p className="mt-1 text-sm text-gray-500">{date}</p>
      </div>

      <span className={`rounded-full px-3 py-1 text-xs font-bold ${statusColor}`}>
        {status}
      </span>
    </div>
  );
}

function DesktopOption({ icon, title, danger = false, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-4 rounded-2xl border border-gray-100 p-5 text-left transition hover:bg-gray-50 ${
        danger ? "text-red-600" : "text-gray-800"
      }`}
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50">
        {icon}
      </div>

      <span className="flex-1 font-bold">{title}</span>
      {!danger && <ChevronRight size={18} className="text-gray-300" />}
    </button>
  );
}