import {
  ShieldCheck,
  Mail,
  Phone,
  Building2,
  MapPin,
  ClipboardList,
  CheckCircle,
  Clock3,
  Users,
  Edit3,
} from "lucide-react";
import AdminLayout from "../Layouts/AdminLayouts";

const adminStats = [
  { title: "Reports Managed", value: "1,245", color: "text-green-700" },
  { title: "Resolved Cases", value: "444", color: "text-blue-600" },
  { title: "Avg. Response", value: "2.4 hrs", color: "text-yellow-600" },
  { title: "Departments", value: "6", color: "text-green-700" },
];

const recentActivity = [
  {
    title: "Assigned flooding incident to CDRRMO",
    meta: "Today, 10:15 AM",
    status: "Completed",
  },
  {
    title: "Reviewed community report from Poblacion",
    meta: "Today, 8:40 AM",
    status: "Reviewed",
  },
  {
    title: "Updated road damage status to In Progress",
    meta: "June 8, 2026",
    status: "Updated",
  },
];

const accessList = [
  "Report review and assignment",
  "Barangay and department monitoring",
  "Heat map and incident overview access",
  "Administrative dashboard configuration",
];

export default function AdminProfile() {
  return (
    <AdminLayout>
      <div className="space-y-4 sm:space-y-6">
        <header className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900">
              Admin Profile
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              View administrator identity, access, and response activity.
            </p>
          </div>

          <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-green-700 px-4 py-3 text-sm font-bold text-white shadow-sm hover:bg-green-800 sm:w-auto">
            <Edit3 size={17} />
            Edit Profile
          </button>
        </header>

        <section className="grid gap-6 xl:grid-cols-12">
          <aside className="rounded-2xl bg-white p-5 shadow-sm xl:col-span-4">
            <div className="flex flex-col items-center text-center">
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-green-100 text-3xl font-extrabold text-green-700">
                J
              </div>

              <h2 className="mt-4 text-2xl font-extrabold text-gray-900">
                Juan Dela Cruz
              </h2>
              <p className="text-sm text-gray-500">LGU Administrator</p>

              <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-green-50 px-4 py-2 text-sm font-bold text-green-700">
                <ShieldCheck size={16} />
                Verified Admin
              </div>
            </div>

            <div className="mt-8 space-y-4">
              <InfoItem
                icon={<Mail size={18} />}
                label="Email"
                value="admin@malaybalay.gov.ph"
              />
              <InfoItem
                icon={<Phone size={18} />}
                label="Phone"
                value="0912 345 6789"
              />
              <InfoItem
                icon={<Building2 size={18} />}
                label="Office"
                value="City Mayor's Office"
              />
              <InfoItem
                icon={<MapPin size={18} />}
                label="Location"
                value="Malaybalay City Hall"
              />
            </div>
          </aside>

          <div className="space-y-6 xl:col-span-8">
            <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {adminStats.map((stat) => (
                <StatCard
                  key={stat.title}
                  title={stat.title}
                  value={stat.value}
                  color={stat.color}
                />
              ))}
            </section>

            <section className="rounded-2xl bg-white p-5 shadow-sm">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="text-lg font-extrabold text-gray-900">
                    Recent Admin Activity
                  </h3>
                  <p className="text-sm text-gray-500">
                    Latest actions performed from the admin dashboard.
                  </p>
                </div>
              </div>

              <div className="mt-5 space-y-3">
                {recentActivity.map((item) => (
                  <ActivityItem key={item.title} item={item} />
                ))}
              </div>
            </section>

            <section className="rounded-2xl bg-white p-5 shadow-sm">
              <h3 className="text-lg font-extrabold text-gray-900">
                Access and Responsibilities
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Current permissions and admin coverage areas.
              </p>

              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <InfoPanel
                  icon={<Users size={18} />}
                  title="Coordination Scope"
                  body="Handles resident reports, department assignment, and public issue monitoring."
                />
                <InfoPanel
                  icon={<ClipboardList size={18} />}
                  title="Coverage"
                  body="Oversees city-level incidents across barangays, reports, and status tracking."
                />
              </div>

              <div className="mt-5 space-y-3">
                {accessList.map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-3 rounded-xl bg-gray-50 px-4 py-3"
                  >
                    <CheckCircle size={16} className="text-green-700" />
                    <p className="text-sm font-semibold text-gray-700">{item}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </section>
      </div>
    </AdminLayout>
  );
}

function InfoItem({ icon, label, value }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50 text-green-700">
        {icon}
      </div>

      <div className="min-w-0">
        <p className="text-xs font-semibold text-gray-400">{label}</p>
        <p className="truncate text-sm font-bold text-gray-800">{value}</p>
      </div>
    </div>
  );
}

function StatCard({ title, value, color }) {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm">
      <p className="text-sm font-medium text-gray-500">{title}</p>
      <h2 className={`mt-3 text-3xl font-extrabold ${color}`}>{value}</h2>
    </div>
  );
}

function ActivityItem({ item }) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-gray-100 p-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="font-bold text-gray-900">{item.title}</p>
        <div className="mt-1 flex items-center gap-2 text-sm text-gray-500">
          <Clock3 size={14} />
          <span>{item.meta}</span>
        </div>
      </div>

      <span className="w-fit rounded-full bg-green-50 px-3 py-1 text-xs font-bold text-green-700">
        {item.status}
      </span>
    </div>
  );
}

function InfoPanel({ icon, title, body }) {
  return (
    <div className="rounded-2xl bg-gray-50 p-4">
      <div className="flex items-center gap-2 text-green-700">
        {icon}
        <h4 className="font-bold text-gray-900">{title}</h4>
      </div>
      <p className="mt-2 text-sm leading-6 text-gray-600">{body}</p>
    </div>
  );
}
