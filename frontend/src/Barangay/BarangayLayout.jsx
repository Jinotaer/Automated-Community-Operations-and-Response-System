// src/Barangay/BarangayLayout.jsx
import { useState, useEffect } from "react";
import { NavLink, Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  ClipboardList,
  Share2,
  Bell,
  BarChart3,
  User,
  LogOut,
  Menu,
  ChevronDown,
  Calendar,
  Info,
  Building,
  CheckCircle2,
} from "lucide-react";
import ApplicationLogo from "../Components/ApplicationLogo";
import ValorLogo from "@/assets/acors.png";
import {
  BARANGAY_ACCOUNTS,
  getActiveBarangaySession,
  setActiveBarangaySession,
  getBarangayStats,
} from "./barangayData";

const defaultNotifications = [
  {
    id: 1,
    message: "New road damage complaint received from resident",
    time: "3 min ago",
    unread: true,
  },
  {
    id: 2,
    message: "Resident submitted additional location info",
    time: "25 min ago",
    unread: true,
  },
  {
    id: 3,
    message: "LGU Engineering accepted escalated complaint",
    time: "2 hours ago",
    unread: false,
  },
];

export default function BarangayLayout({ children, header }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [barangayPickerOpen, setBarangayPickerOpen] = useState(false);
  const [session, setSession] = useState(getActiveBarangaySession());
  const [stats, setStats] = useState(getBarangayStats(session.barangayName));

  const location = useLocation();
  const navigate = useNavigate();
  const pathname = location.pathname;

  useEffect(() => {
    function refreshData() {
      const active = getActiveBarangaySession();
      setSession(active);
      setStats(getBarangayStats(active.barangayName));
    }
    window.addEventListener("acors_complaints_updated", refreshData);
    return () => {
      window.removeEventListener("acors_complaints_updated", refreshData);
    };
  }, []);

  const handleSwitchBarangay = (account) => {
    setActiveBarangaySession(account);
    setSession(account);
    setStats(getBarangayStats(account.barangayName));
    setBarangayPickerOpen(false);
    setUserMenuOpen(false);
    window.dispatchEvent(new Event("acors_complaints_updated"));
  };

  const handleLogout = () => {
    localStorage.removeItem("acors_barangay_session");
    sessionStorage.clear();
    navigate("/barangay/login");
  };

  const navigation = [
    {
      name: "Dashboard",
      href: "/barangay/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Complaints",
      href: "/barangay/complaints",
      icon: ClipboardList,
      badge: stats.pendingReview > 0 ? stats.pendingReview : null,
    },

    {
      name: "Escalated to LGU",
      href: "/barangay/escalated",
      icon: Share2,
      badge: stats.escalated > 0 ? stats.escalated : null,
    },
    {
      name: "Notifications",
      href: "/barangay/notifications",
      icon: Bell,
    },
    {
      name: "Reports & Summary",
      href: "/barangay/reports-summary",
      icon: BarChart3,
    },
    {
      name: "Resolve",
      href: "/barangay/resolved",
      icon: CheckCircle2,
      badge: stats.resolved > 0 ? stats.resolved : null,
    },
    {
      name: "Profile",
      href: "/barangay/profile",
      icon: User,
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
              <img src={ValorLogo} alt="ACORS Logo" className="h-6 w-auto" />
              <p className="mt-1 text-xs text-gray-500">Barangay Operations</p>
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
                  className={`flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-medium transition ${
                    isActive
                      ? "bg-red-700 text-white shadow-sm"
                      : "text-zinc-600 hover:bg-zinc-100 hover:text-red-700"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="h-5 w-5" />
                    <span>{item.name}</span>
                  </div>

                  {item.badge && (
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-mono font-bold ${
                        isActive
                          ? "bg-white text-red-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
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
              to="/barangay/profile"
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
                  {session.barangayName}
                </p>
                <p className="mt-0.5 text-sm font-semibold leading-tight text-zinc-800 truncate">
                  {session.captain}
                </p>
              </div>

              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white ring-1 ring-zinc-200 text-zinc-400 hover:text-red-600">
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
              <div className="hidden sm:block shrink-0">
                <h1 className="text-lg font-bold text-zinc-900 whitespace-nowrap">
                  {header}
                </h1>
              </div>
            )}

            {/* Right section */}
            <div className="ml-auto flex items-center gap-2 sm:gap-3">
              {/* Date range picker */}
              <div className="hidden sm:block shrink-0">
                <button className="flex items-center gap-2 rounded-xl border border-zinc-200 bg-zinc-50 px-3.5 py-2 text-xs font-semibold text-zinc-700 hover:bg-zinc-100 transition whitespace-nowrap">
                  <Calendar size={15} className="text-zinc-500 shrink-0" />
                  <span>June 1 - June 8, 2025</span>
                  <ChevronDown size={14} className="text-zinc-400 shrink-0" />
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
                    {defaultNotifications.length}
                  </span>
                </button>

                {notificationOpen && (
                  <div className="absolute right-0 mt-2 w-[min(20rem,calc(100vw-2rem))] overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-md z-50">
                    <div className="border-b border-zinc-200 px-4 py-3">
                      <h3 className="font-semibold text-zinc-900">
                        Barangay Notifications
                      </h3>
                    </div>

                    <div className="max-h-96 overflow-y-auto">
                      {defaultNotifications.map((n) => (
                        <div
                          key={n.id}
                          className={`border-b border-zinc-100 px-4 py-3 hover:bg-zinc-50 ${
                            n.unread ? "bg-red-50/50" : ""
                          }`}
                        >
                          <p className="text-sm font-medium text-zinc-900">
                            {n.message}
                          </p>
                          <p className="mt-1 text-xs text-zinc-500">{n.time}</p>
                        </div>
                      ))}
                    </div>

                    <div className="border-t border-zinc-200 px-4 py-3 text-center">
                      <Link
                        to="/barangay/notifications"
                        onClick={() => setNotificationOpen(false)}
                        className="text-sm font-semibold text-red-700 hover:text-red-800"
                      >
                        View all notifications
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {/* Profile dropdown & Barangay Switcher */}
              <div className="relative hidden sm:block shrink-0">
                <button
                  type="button"
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 rounded-xl px-2 py-1.5 sm:gap-2.5 sm:px-3 sm:py-2 hover:bg-zinc-100 transition"
                  aria-label="Open user menu"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-700 text-white font-bold text-xs shrink-0">
                    {session.slug.slice(0, 2).toUpperCase()}
                  </div>

                  <div className="hidden text-left lg:block whitespace-nowrap">
                    <div className="text-xs font-bold text-zinc-900 leading-tight">
                      {session.barangayName}
                    </div>
                    <div className="text-[11px] text-zinc-500 leading-tight">
                      {session.staffName}
                    </div>
                  </div>

                  <ChevronDown className="hidden h-3.5 w-3.5 text-zinc-400 lg:block shrink-0" />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-64 overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-xl animate-modal-in z-50">
                    <Link
                      to="/barangay/profile"
                      onClick={() => setUserMenuOpen(false)}
                      className="block border-b border-zinc-100 px-4 py-3 text-left transition hover:bg-red-50/50 group"
                    >
                      <div className="text-sm font-bold text-zinc-900 group-hover:text-red-600 transition truncate">
                        {session.barangayName}
                      </div>
                      <div className="truncate text-xs font-mono text-zinc-500">
                        {session.email}
                      </div>
                    </Link>

                    {/* Switch Barangay Option */}
                    <div className="border-b border-zinc-100 p-2">
                      <p className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                        Switch Barangay Hall
                      </p>
                      {BARANGAY_ACCOUNTS.map((acc) => (
                        <button
                          key={acc.slug}
                          onClick={() => handleSwitchBarangay(acc)}
                          className={`flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-xs font-semibold transition ${
                            session.slug === acc.slug
                              ? "bg-red-50 text-red-700 font-bold"
                              : "text-zinc-700 hover:bg-zinc-50"
                          }`}
                        >
                          <span>{acc.barangayName}</span>
                          {session.slug === acc.slug && (
                            <span className="h-1.5 w-1.5 rounded-full bg-red-600" />
                          )}
                        </button>
                      ))}
                    </div>

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
