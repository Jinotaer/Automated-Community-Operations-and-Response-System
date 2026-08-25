// src/layouts/AdminLayout.jsx
import { useState } from "react";
import { NavLink, Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  ClipboardList,
  Map,
  Building2,
  Settings,
  MapPin,
  LogOut,
  Menu,
  ChevronDown,
  Calendar,
  Bell,
  User,
  Info,
  Users,
  FileText,
} from "lucide-react";
import ApplicationLogo from "../Components/ApplicationLogo";
import ValorLogo from "@/assets/acors.png";

const navigation = [
  {
    name: "Overview",
    href: "/admin/overview",
    icon: LayoutDashboard,
  },
  {
    name: "Resident Complaints",
    href: "/admin/reports",
    icon: ClipboardList,
  },
  {
    name: "Heat Map",
    href: "/admin/map",
    icon: Map,
  },
  {
    name: "Barangays",
    href: "/admin/barangays",
    icon: MapPin,
  },
  {
    name: "Departments",
    href: "/admin/departments",
    icon: Building2,
  },
  {
    name: "LGU Users",
    href: "/admin/users",
    icon: Users,
  },

  // {
  //   name: "Settings",
  //   href: "/admin/settings",
  //   icon: Settings,
  // },
];

const auth = {
  user: {
    name: "Juan Dela Cruz",
    email: "admin@malaybalay.gov.ph",
  },
  role: "LGU Admin",
};

export default function AdminLayout({ children, header }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const pathname = location.pathname;

  const handleLogout = () => {
    localStorage.removeItem("acors_admin_session");
    sessionStorage.clear();
    navigate("/admin/login");
  };

  const notifications = [
    {
      id: 1,
      message: "New road damage report submitted",
      time: "5 min ago",
      unread: true,
    },
    {
      id: 2,
      message: "Flooding incident updated to In Progress",
      time: "1 hour ago",
      unread: true,
    },
    {
      id: 3,
      message: "Streetlight report assigned to City Engineer",
      time: "2 hours ago",
      unread: false,
    },
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
              {/* <h1 className="text-2xl font-extrabold text-green-800">
                VAL<span className="text-red-600">O</span>R
              </h1> */}
              <img src={ValorLogo} alt="ACORS Logo" className="h-6 w-auto" />
              <p className="text-xs text-gray-500 mt-1">LGU Dashboard</p>
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
              <Link
                to="/admin/profile"
                onClick={() => setSidebarOpen(false)}
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100"
              >
                <User className="h-4 w-4" />
                Profile
              </Link>

              <Link
                to="/admin/settings"
                onClick={() => setSidebarOpen(false)}
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100"
              >
                <Settings className="h-4 w-4" />
                Settings
              </Link>

              <button
                type="button"
                onClick={handleLogout}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 active:scale-[0.98]"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </div>

            <div className="flex items-center gap-3 rounded-xl border border-zinc-200 bg-zinc-50 px-3.5 py-3 text-zinc-800">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white ring-1 ring-zinc-200">
                <ApplicationLogo
                  alt="ACORS logo"
                  className="h-8.5 w-8.5 rounded-full object-cover"
                  size={34}
                />
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-medium leading-tight text-zinc-500">
                  City of Malaybalay
                </p>
                <p className="mt-0.5 text-sm font-semibold leading-tight text-zinc-800">
                  Administrator
                </p>
              </div>

              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white ring-1 ring-zinc-200">
                <Info className="h-4 w-4 text-zinc-500" />
              </div>
            </div>
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
                <h1 className="text-lg font-semibold text-zinc-900">{header}</h1>
              </div>
            )}

            {/* Search bar */}
            <div className="ml-auto hidden w-full max-w-md md:block">
                {/* <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                  <input
                    type="text"
                    placeholder="Search reports, incidents, barangays..."
                    className="h-10 w-full rounded-xl border border-zinc-200 bg-zinc-50 pl-10 pr-4 text-sm focus:border-green-700 focus:outline-none focus:ring-1 focus:ring-green-700"
                  />
                </div> */}
            </div>

            {/* Right section */}
            <div className="ml-auto flex items-center gap-1 sm:gap-2.5">
              {/* Date range picker (moved from Overview) */}
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
                  {auth.user.avatar ? (
                    <img
                      src={auth.user.avatar}
                      alt={auth.user.name}
                      className="h-8 w-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-700 text-white">
                      <span className="text-sm font-medium">
                        {auth.user.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}

                  <div className="hidden text-left lg:block">
                    <div className="text-sm font-medium text-zinc-900">
                      {auth.user.name}
                    </div>
                    <div className="text-xs text-zinc-500">{auth.role}</div>
                  </div>

                  <ChevronDown className="hidden h-4 w-4 text-zinc-500 lg:block" />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-[min(13rem,calc(100vw-2rem))] overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-md">
                    <div className="border-b border-zinc-200 px-4 py-3">
                      <div className="text-sm font-medium text-zinc-900">
                        {auth.user.name}
                      </div>
                      <div className="truncate text-xs text-zinc-500">
                        {auth.user.email}
                      </div>
                    </div>

                    <div className="py-2">
                      <Link
                        to="/admin/profile"
                        className="flex items-center gap-3 px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-100"
                      >
                        <User className="h-4 w-4" />
                        Profile
                      </Link>

                      <Link
                        to="/admin/settings"
                        className="flex items-center gap-3 px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-100"
                      >
                        <Settings className="h-4 w-4" />
                        Settings
                      </Link>
                    </div>

                    <div className="border-t border-zinc-200 py-2">
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="flex w-full items-center gap-3 px-4 py-2 text-sm text-red-600 transition hover:bg-red-50 active:scale-[0.98]"
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
