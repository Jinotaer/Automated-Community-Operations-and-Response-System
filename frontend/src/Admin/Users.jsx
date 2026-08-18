// src/Admin/Users.jsx
import { useEffect, useState } from "react";
import {
  Search,
  Plus,
  ChevronDown,
  MoreHorizontal,
  Wrench,
  Leaf,
  ShieldCheck,
  HeartPulse,
  TrafficCone,
  ShieldAlert,
  X,
} from "lucide-react";
import AdminLayout from "../Layouts/AdminLayouts";
import { allOffices } from "./adminData";

const officeUsers = [
  {
    id: "USR-001",
    office: "City Engineering Office",
    shortOffice: "Engineering",
    holder: "Engr. Juan Dela Cruz",
    email: "engineering@malaybalay.gov.ph",
    phone: "0912 345 6789",
    role: "Office Admin",
    status: "Active",
    lastActive: "2 min ago",
    permissions: ["Assign reports", "Respond", "Resolve", "Export data"],
    icon: Wrench,
  },
  {
    id: "USR-002",
    office: "City Environment and Natural Resources Office",
    shortOffice: "CENRO",
    holder: "Maria Santos",
    email: "cenro@malaybalay.gov.ph",
    phone: "0923 456 7890",
    role: "Office Admin",
    status: "Active",
    lastActive: "18 min ago",
    permissions: ["Assign reports", "Respond", "Resolve", "Export data"],
    icon: Leaf,
  },
  {
    id: "USR-003",
    office: "City Disaster Risk Reduction and Management Office",
    shortOffice: "CDRRMO",
    holder: "Pedro Reyes",
    email: "cdrrmo@malaybalay.gov.ph",
    phone: "0934 567 8901",
    role: "Office Admin",
    status: "Active",
    lastActive: "42 min ago",
    permissions: ["Assign reports", "Respond", "Escalate", "Export data"],
    icon: ShieldCheck,
  },
  {
    id: "USR-004",
    office: "Traffic Management Center",
    shortOffice: "Traffic",
    holder: "Mark Villanueva",
    email: "traffic@malaybalay.gov.ph",
    phone: "0945 678 9012",
    role: "Responder",
    status: "Active",
    lastActive: "1 hr ago",
    permissions: ["Respond", "Resolve"],
    icon: TrafficCone,
  },
  {
    id: "USR-005",
    office: "City Health Office",
    shortOffice: "Health",
    holder: "Dr. Ana Garcia",
    email: "health@malaybalay.gov.ph",
    phone: "0956 789 0123",
    role: "Office Admin",
    status: "Invited",
    lastActive: "Pending invitation",
    permissions: ["Respond", "Resolve"],
    icon: HeartPulse,
  },
  {
    id: "USR-000",
    office: "LGU System Administrator",
    shortOffice: "System",
    holder: "LGU IT Desk",
    email: "admin@malaybalay.gov.ph",
    phone: "0900 000 0000",
    role: "Super Admin",
    status: "Active",
    lastActive: "Just now",
    permissions: ["Full access", "Manage users", "Assign reports"],
    icon: ShieldAlert,
  },
];

const roles = ["All Roles", "Super Admin", "Office Admin", "Responder"];
const statuses = ["All Status", "Active", "Invited", "Suspended"];
const roleOptions = ["Office Admin", "Responder", "Super Admin"];
const statusOptions = ["Active", "Invited"];
const permissionOptions = [
  "Assign reports",
  "Respond",
  "Resolve",
  "Escalate",
  "Export data",
  "Manage users",
];
const officeNames = allOffices.map((office) => office.name);

function roleTone(role) {
  if (role === "Super Admin") return "bg-red-700 text-white";
  if (role === "Office Admin") return "bg-amber-100 text-amber-800";
  return "bg-sky-100 text-sky-700";
}

function statusTone(status) {
  if (status === "Active") return "bg-emerald-600";
  if (status === "Invited") return "bg-amber-500";
  return "bg-gray-400";
}

export default function Users() {
  const [users, setUsers] = useState(officeUsers);
  const [query, setQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("All Roles");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [addOpen, setAddOpen] = useState(false);

  const summary = [
    {
      label: "Total Office Accounts",
      value: users.length,
      tone: "text-gray-900",
      accent: "bg-red-700",
    },
    {
      label: "Active Accounts",
      value: users.filter((user) => user.status === "Active").length,
      tone: "text-emerald-700",
      accent: "bg-emerald-600",
    },
    {
      label: "Pending Invites",
      value: users.filter((user) => user.status === "Invited").length,
      tone: "text-amber-700",
      accent: "bg-amber-500",
    },
  ];

  const normalizedQuery = query.trim().toLowerCase();

  const filteredUsers = users.filter((user) => {
    const matchesQuery =
      normalizedQuery === "" ||
      [
        user.office,
        user.shortOffice,
        user.holder,
        user.email,
        user.phone,
        user.role,
        user.id,
      ].some((field) => field.toLowerCase().includes(normalizedQuery));
    const matchesRole =
      roleFilter === "All Roles" || user.role === roleFilter;
    const matchesStatus =
      statusFilter === "All Status" || user.status === statusFilter;
    return matchesQuery && matchesRole && matchesStatus;
  });

  return (
    <AdminLayout>
      <div className="space-y-4 sm:space-y-6">
        {/* Header */}
        <header className="flex animate-fade-up flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.22em] text-gray-500">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-600 opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-red-600" />
              </span>
              Malaybalay · LGU Office Accounts
            </p>
            <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">
              LGU Users
            </h1>
          </div>

          <div className="flex flex-col gap-3 sm:items-end">
            <p className="font-mono text-[11px] font-medium tracking-wide text-gray-500">
              <span className="font-bold text-gray-900">{users.length}</span>{" "}
              OFFICE ACCOUNTS · SYNCED 09:41 AM
            </p>

            <button
              onClick={() => setAddOpen(true)}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-700 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-red-800 active:translate-y-px sm:w-auto"
            >
              <Plus size={17} />
              Add Office User
            </button>
          </div>
        </header>

        {/* Summary strip */}
        <section
          className="grid animate-fade-up grid-cols-1 divide-y divide-gray-100 rounded-3xl border border-gray-200/70 bg-white shadow-sm sm:grid-cols-3 sm:divide-x sm:divide-y-0"
          style={{ animationDelay: "40ms" }}
        >
          {summary.map((item) => (
            <div key={item.label} className="flex items-center gap-4 p-5">
              <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${item.accent}`} />
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-gray-500">
                  {item.label}
                </p>
                <p className={`mt-1 font-mono text-2xl font-extrabold ${item.tone}`}>
                  {item.value}
                </p>
              </div>
            </div>
          ))}
        </section>

        {/* Filters */}
        <section
          className="animate-fade-up rounded-2xl border border-gray-200/70 bg-white p-4 shadow-sm sm:p-5"
          style={{ animationDelay: "80ms" }}
        >
          <div className="grid gap-4 lg:grid-cols-[1fr_auto_auto]">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search office, account holder, email, or role..."
                className="h-12 w-full rounded-xl border border-gray-200 bg-gray-50 pl-11 pr-4 text-sm outline-none transition placeholder:text-gray-500 focus:border-red-700 focus:ring-1 focus:ring-red-700"
              />
            </div>

            <SelectFilter
              label="Role"
              value={roleFilter}
              onChange={setRoleFilter}
              options={roles}
            />
            <SelectFilter
              label="Status"
              value={statusFilter}
              onChange={setStatusFilter}
              options={statuses}
            />
          </div>
        </section>

        {/* Users Table */}
        <section
          className="animate-fade-up rounded-3xl border border-gray-200/70 bg-white p-4 shadow-sm sm:p-5"
          style={{ animationDelay: "120ms" }}
        >
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-extrabold text-gray-900">
                Office User Accounts
              </h2>
              <p className="text-sm text-gray-500">
                LGU offices with access to the operations portal.
              </p>
            </div>

            <p className="font-mono text-[11px] font-medium text-gray-500">
              {filteredUsers.length} OF {users.length}
            </p>
          </div>

          <div className="mt-5 overflow-x-auto">
            <table className="w-full min-w-[940px] text-left text-sm">
              <thead>
                <tr className="border-b border-gray-200 text-[11px] uppercase tracking-wider text-gray-500">
                  <th className="px-3 py-3 text-left font-semibold">Office</th>
                  <th className="px-3 py-3 text-left font-semibold">Account Holder</th>
                  <th className="px-3 py-3 text-left font-semibold">Role</th>
                  <th className="px-3 py-3 text-left font-semibold">Permissions</th>
                  <th className="px-3 py-3 text-left font-semibold">Status</th>
                  <th className="px-3 py-3 text-left font-semibold">Last Active</th>
                  <th className="px-3 py-3 text-left font-semibold">Action</th>
                </tr>
              </thead>

              <tbody>
                {filteredUsers.map((user) => (
                  <UserRow key={user.id} user={user} />
                ))}

                {filteredUsers.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-3 py-14 text-center">
                      <p className="font-mono text-xs font-medium uppercase tracking-[0.18em] text-gray-500">
                        No office users match your filters
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      {addOpen && (
        <AddUserModal
          users={users}
          onClose={() => setAddOpen(false)}
          onAdd={(user) => {
            setUsers((prev) => [user, ...prev]);
            setAddOpen(false);
          }}
        />
      )}
    </AdminLayout>
  );
}

function AddUserModal({ users, onClose, onAdd }) {
  const [form, setForm] = useState({
    holder: "",
    office: "",
    role: "Office Admin",
    email: "",
    phone: "",
    status: "Invited",
    permissions: [],
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const requiredFields = ["holder", "office", "email"];

  const updateField = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const togglePermission = (permission) => {
    setForm((prev) => ({
      ...prev,
      permissions: prev.permissions.includes(permission)
        ? prev.permissions.filter((item) => item !== permission)
        : [...prev.permissions, permission],
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const nextErrors = {};
    for (const field of requiredFields) {
      if (!form[field].trim()) nextErrors[field] = "This field is required.";
    }
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    const maxId = users.reduce((max, user) => {
      const number = parseInt(String(user.id).replace(/\D/g, ""), 10);
      return number > max ? number : max;
    }, 0);

    const office = allOffices.find((item) => item.name === form.office);

    onAdd({
      id: `USR-${String(maxId + 1).padStart(3, "0")}`,
      office: form.office.trim(),
      shortOffice: office?.shortName || "Office",
      holder: form.holder.trim(),
      email: form.email.trim(),
      phone: form.phone.trim() || "—",
      role: form.role,
      status: form.status,
      lastActive: form.status === "Invited" ? "Pending invitation" : "Just now",
      permissions: form.permissions.length ? form.permissions : ["Respond"],
      icon: office?.icon || ShieldAlert,
    });
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex animate-fade-in items-end justify-center bg-zinc-950/60 backdrop-blur-sm sm:items-center sm:p-6"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Add office user"
        onClick={(event) => event.stopPropagation()}
        className="max-h-[92dvh] w-full max-w-xl overflow-y-auto rounded-t-[2rem] bg-white shadow-2xl animate-modal-in sm:rounded-[2rem]"
      >
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gray-500">
              New LGU Office Account
            </p>
            <h2 className="mt-1 text-xl font-extrabold text-gray-900">
              Add Office User
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close add user"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-50 text-gray-500 transition hover:bg-gray-100 hover:text-gray-900"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate className="p-6">
          <div className="space-y-4">
            <Field label="Full Name" error={errors.holder}>
              <input
                type="text"
                value={form.holder}
                onChange={updateField("holder")}
                placeholder="e.g. Engr. Juan Dela Cruz"
                className={inputClass(!!errors.holder)}
              />
            </Field>

            <Field label="Office" error={errors.office}>
              <SelectField
                value={form.office}
                onChange={updateField("office")}
                options={officeNames}
                placeholder="Select office"
                invalid={!!errors.office}
              />
            </Field>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Role">
                <SelectField
                  value={form.role}
                  onChange={updateField("role")}
                  options={roleOptions}
                  invalid={false}
                />
              </Field>

              <Field label="Status">
                <SelectField
                  value={form.status}
                  onChange={updateField("status")}
                  options={statusOptions}
                  invalid={false}
                />
              </Field>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Email" error={errors.email}>
                <input
                  type="email"
                  value={form.email}
                  onChange={updateField("email")}
                  placeholder="name@malaybalay.gov.ph"
                  className={inputClass(!!errors.email)}
                />
              </Field>

              <Field label="Phone">
                <input
                  type="tel"
                  value={form.phone}
                  onChange={updateField("phone")}
                  placeholder="09xx xxx xxxx"
                  className={inputClass(false)}
                />
              </Field>
            </div>

            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-[0.16em] text-gray-500">
                Permissions
              </label>
              <div className="mt-2 flex flex-wrap gap-2">
                {permissionOptions.map((permission) => {
                  const selected = form.permissions.includes(permission);

                  return (
                    <button
                      key={permission}
                      type="button"
                      onClick={() => togglePermission(permission)}
                      className={`rounded-lg border px-3 py-1.5 text-xs font-bold transition active:translate-y-px ${
                        selected
                          ? "border-red-700 bg-red-700 text-white shadow-sm"
                          : "border-gray-200 bg-white text-gray-600 hover:bg-red-50 hover:text-red-700"
                      }`}
                    >
                      {permission}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-bold text-gray-700 transition hover:bg-gray-50 active:translate-y-px"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="rounded-xl bg-red-700 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-red-800 active:translate-y-px"
            >
              Create Office User
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function inputClass(invalid) {
  return `h-12 w-full rounded-xl border bg-white px-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-500 focus:border-red-700 focus:ring-1 focus:ring-red-700 ${
    invalid ? "border-red-600" : "border-gray-200"
  }`;
}

function SelectField({ value, onChange, options, placeholder, invalid }) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={onChange}
        className={`h-12 w-full appearance-none rounded-xl border bg-white pl-4 pr-10 text-sm font-medium text-gray-900 outline-none transition focus:border-red-700 focus:ring-1 focus:ring-red-700 ${
          invalid ? "border-red-600" : "border-gray-200"
        }`}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <ChevronDown
        size={16}
        className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400"
      />
    </div>
  );
}

function Field({ label, error, children }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-[11px] font-semibold uppercase tracking-[0.16em] text-gray-500">
        {label}
      </label>
      {children}
      {error && (
        <p role="alert" className="text-xs font-medium text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}

function SelectFilter({ label, value, onChange, options }) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        aria-label={label}
        className="h-12 w-full min-w-0 appearance-none rounded-xl border border-gray-200 bg-white pl-4 pr-10 text-sm font-bold text-gray-700 outline-none transition hover:bg-gray-50 focus:border-red-700 focus:ring-1 focus:ring-red-700 sm:min-w-44"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <ChevronDown
        size={16}
        className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400"
      />
    </div>
  );
}

function UserRow({ user }) {
  const Icon = user.icon;

  return (
    <tr className="border-b border-gray-100 transition last:border-b-0 hover:bg-gray-50/60">
      <td className="px-3 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-700">
            <Icon size={20} />
          </div>

          <div className="min-w-0 max-w-56">
            <p
              className="truncate font-extrabold text-gray-900"
              title={user.office}
            >
              {user.office}
            </p>
            <p className="mt-0.5 font-mono text-[11px] font-medium text-gray-500">
              {user.id}
            </p>
          </div>
        </div>
      </td>

      <td className="px-3 py-4">
        <p className="text-sm font-bold text-gray-700">{user.holder}</p>
        <p className="mt-0.5 font-mono text-[11px] font-medium text-gray-500">
          {user.email}
        </p>
      </td>

      <td className="px-3 py-4">
        <span
          className={`inline-flex items-center rounded-lg px-2.5 py-1 text-xs font-bold ${roleTone(
            user.role
          )}`}
        >
          {user.role}
        </span>
      </td>

      <td className="px-3 py-4">
        <div className="flex max-w-64 flex-wrap gap-1.5">
          {user.permissions.map((permission) => (
            <span
              key={permission}
              className="rounded-md border border-gray-200 bg-gray-50 px-2 py-0.5 text-[11px] font-semibold text-gray-600"
            >
              {permission}
            </span>
          ))}
        </div>
      </td>

      <td className="px-3 py-4">
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-700">
          <span className={`h-1.5 w-1.5 rounded-full ${statusTone(user.status)}`} />
          {user.status}
        </span>
      </td>

      <td className="px-3 py-4 font-mono text-xs font-medium text-gray-500">
        {user.lastActive}
      </td>

      <td className="px-3 py-4">
        <button className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-700">
          <MoreHorizontal size={18} />
        </button>
      </td>
    </tr>
  );
}
