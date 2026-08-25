import { useState } from "react";
import { NavLink, Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  ClipboardList,
  Map,
  CheckCircle2,
  LogOut,
  Menu,
  ChevronDown,
  Calendar,
  Bell,
  Info,
  ArrowLeft,
  Megaphone,
  FileText,
} from "lucide-react";
import ApplicationLogo from "../Components/ApplicationLogo";
import ValorLogo from "@/assets/acors.png";

const notifications = [
  {
    id: 1,
    message: "New report assigned to your office",
    time: "5 min ago",
    unread: true,
  },
  {
    id: 2,
    message: "Report updated to In Progress",
    time: "1 hour ago",
    unread: true,
  },
  {
    id: 3,
    message: "Resolution accepted by citizen",
    time: "3 hours ago",
    unread: false,
  },
];

export default function OfficeLayout({ office, header, children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const pathname = location.pathname;

  const handleLogout = () => {
    localStorage.removeItem("acors_office_session");
    sessionStorage.clear();
    navigate("/department/login");
  };

  const OfficeIcon = office.icon;

  const navigation = [
    {
      name: "Overview",
      href: `/department/${office.slug}/overview`,
      icon: LayoutDashboard,
    },
    ...(office.slug === "tourism" ||
    office.slug === "lcro" ||
    office.slug === "treasurer" ||
    office.slug === "pdao" ||
    office.slug === "soloparent" ||
    office.slug === "cswdo" ||
    office.slug === "bplo" ||
    office.slug === "osca" ||
    office.slug === "assessor"
      ? []
      : [
          {
            name: "Reports",
            href: `/department/${office.slug}/reports`,
            icon: ClipboardList,
          },
          { name: "Map", href: `/department/${office.slug}/map`, icon: Map },
          {
            name: "Resolve",
            href: `/department/${office.slug}/resolve`,
            icon: CheckCircle2,
          },
        ]),
    ...(office.slug === "lcro" ||
    office.slug === "treasurer" ||
    office.slug === "pdao" ||
    office.slug === "soloparent" ||
    office.slug === "cswdo" ||
    office.slug === "bplo" ||
    office.slug === "osca" ||
    office.slug === "assessor"
      ? [
          {
            name: "Applications & Requests",
            href: `/department/${office.slug}/requests`,
            icon: FileText,
          },
        ]
      : []),
    ...(office.slug === "health" || office.slug === "tourism"
      ? [
          {
            name: "Announcements",
            href: `/department/${office.slug}/announcements`,
            icon: Megaphone,
          },
        ]
      : []),
  ];

  return (
    <div className="min-h-screen bg-[#F4F7F5]">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close sidebar"
          className="fixed inset-0 z-40 bg-zinc-900/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 z-50 flex h-screen w-[min(17.5rem,calc(100vw-1rem))] flex-col border-r border-zinc-200 bg-white px-5 py-5 transform transition-transform duration-300 ease-in-out lg:w-68 lg:px-6 lg:py-6 lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col overflow-y-auto">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <ApplicationLogo size={56} />

            <div>
              <img src={ValorLogo} alt="ACORS Logo" className="h-6 w-auto" />
              <p className="mt-1 text-xs text-gray-500">LGU Office Portal</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="mt-8 space-y-1.5">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = pathname.startsWith(item.href);

              return (
                <NavLink
                  key={item.name}
                  to={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition ${
                    isActive
                      ? "bg-red-700 text-white shadow-sm"
                      : "text-zinc-600 hover:bg-zinc-100 hover:text-red-700"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  {item.name}
                </NavLink>
              );
            })}
          </nav>

          {/* Sidebar Footer */}
          <div className="mt-auto">
            <div className="mb-4 space-y-1 border-t border-zinc-200 pt-4 lg:hidden">
              <button
                type="button"
                onClick={handleLogout}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 active:scale-[0.98]"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </div>

            <Link
              to={`/department/${office.slug}/profile`}
              className="flex items-center gap-3 rounded-xl border border-zinc-200 bg-zinc-50 px-3.5 py-3 text-zinc-800 transition hover:border-red-200 hover:bg-red-50/40 active:scale-[0.99]"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white ring-1 ring-zinc-200">
                <ApplicationLogo
                  alt="ACORS logo"
                  className="h-8.5 w-8.5 rounded-full object-cover"
                  size={34}
                />
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-medium leading-tight text-zinc-500 truncate">
                  {office.name}
                </p>
                <p className="mt-0.5 text-sm font-semibold leading-tight text-zinc-800 truncate">
                  {office.holder}
                </p>
              </div>

              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white ring-1 ring-zinc-200 text-zinc-400 group-hover:text-red-600">
                <Info className="h-4 w-4" />
              </div>
            </Link>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="min-w-0 lg:ml-68">
        {/* Top bar */}
        <header className="sticky top-0 z-30 border-b border-zinc-200 bg-white/95 backdrop-blur">
          <div className="flex h-14 items-center gap-2 px-3 sm:h-16 sm:gap-4 sm:px-6">
            {/* Mobile menu button */}
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="rounded-lg p-2 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 lg:hidden"
              aria-label="Open sidebar"
            >
              <Menu className="h-5 w-5" />
            </button>

            {/* Page title */}
            {header && (
              <div className="hidden sm:block">
                <h1 className="text-lg font-semibold text-zinc-900">
                  {header}
                </h1>
              </div>
            )}

            {/* Search bar */}
            <div className="ml-auto hidden w-full max-w-md md:block" />

            {/* Right section */}
            <div className="ml-auto flex items-center gap-1 sm:gap-2.5">
              {/* Date range picker */}
              <div className="hidden sm:block">
                <button className="flex items-center gap-2 rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-xs font-medium text-zinc-700">
                  <Calendar size={17} />
                  June 1 - June 8, 2025
                  <ChevronDown size={16} />
                </button>
              </div>

              {/* Notifications with count */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setNotificationOpen(!notificationOpen)}
                  className="relative rounded-lg p-2 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 sm:p-2.5"
                  aria-label="Open notifications"
                >
                  <Bell className="h-4.5 w-4.5 sm:h-5 sm:w-5" />
                  <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[10px] font-semibold text-white sm:h-4.5 sm:w-4.5">
                    {notifications.length}
                  </span>
                </button>

                {notificationOpen && (
                  <div className="absolute right-0 mt-2 w-[min(20rem,calc(100vw-2rem))] overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-md">
                    <div className="border-b border-zinc-200 px-4 py-3">
                      <h3 className="font-semibold text-zinc-900">
                        Notifications
                      </h3>
                    </div>

                    <div className="max-h-96 overflow-y-auto">
                      {notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={`border-b border-zinc-100 px-4 py-3 hover:bg-zinc-50 ${
                            notification.unread ? "bg-red-50/50" : ""
                          }`}
                        >
                          <p className="text-sm font-medium text-zinc-900">
                            {notification.message}
                          </p>
                          <p className="mt-1 text-xs text-zinc-500">
                            {notification.time}
                          </p>
                        </div>
                      ))}
                    </div>

                    <div className="border-t border-zinc-200 px-4 py-3 text-center">
                      <button className="text-sm font-semibold text-red-700 hover:text-red-800">
                        View all notifications
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Profile dropdown */}
              <div className="relative hidden sm:block">
                <button
                  type="button"
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 rounded-lg px-1.5 py-1.5 sm:gap-3 sm:px-3 sm:py-2 hover:bg-zinc-100"
                  aria-label="Open user menu"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-700 text-white">
                    <OfficeIcon size={15} />
                  </div>

                  <div className="hidden text-left lg:block">
                    <div className="text-sm font-medium text-zinc-900">
                      {office.shortName}
                    </div>
                    <div className="text-xs text-zinc-500">{office.role}</div>
                  </div>

                  <ChevronDown className="hidden h-4 w-4 text-zinc-500 lg:block" />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-xl animate-modal-in z-50">
                    <Link
                      to={`/department/${office.slug}/profile`}
                      onClick={() => setUserMenuOpen(false)}
                      className="block border-b border-zinc-100 px-4 py-3 text-left transition hover:bg-red-50/50 group"
                    >
                      <div className="text-sm font-bold text-zinc-900 group-hover:text-red-600 transition truncate">
                        {office.holder}
                      </div>
                      <div className="truncate text-xs font-mono text-zinc-500">
                        {office.email}
                      </div>
                    </Link>

                    <div className="p-1.5">
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-bold text-red-600 transition hover:bg-red-50 active:scale-[0.98]"
                      >
                        <LogOut className="h-4 w-4" />
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="min-h-screen px-4 py-4 sm:px-6 sm:py-5 lg:px-8 lg:py-6">
          {children}
        </main>
      </div>
    </div>
  );
}
