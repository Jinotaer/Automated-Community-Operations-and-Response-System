// src/layouts/CitizenLayout.jsx
import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Home, ClipboardList, ScrollText, User, Plus, Bell } from "lucide-react";
import ApplicationLogo from "../Components/ApplicationLogo";
import ValorLogo from "@/assets/acors.png";

export default function CitizenLayout({
  children,
  hideNavigation = false,
  hideHeader = false,
}) {
  const [notificationOpen, setNotificationOpen] = useState(false);

  const notifications = [
    {
      id: 1,
      message: "Your report is now under review",
      time: "5 min ago",
      unread: true,
    },
    {
      id: 2,
      message: "City Engineering accepted your report",
      time: "1 hour ago",
      unread: true,
    },
    {
      id: 3,
      message: "New community update in your barangay",
      time: "2 hours ago",
      unread: false,
    },
  ];

  return (
    <div className="min-h-screen bg-[#F4F7F5] text-gray-900">
      {/* Mobile Layout Wrapper */}
      <div className="mx-auto min-h-screen max-w-md overflow-hidden bg-white shadow-xl lg:hidden">
        {/* Mobile Header */}
        {!hideHeader && (
          <header className="flex items-center justify-between px-5 pt-5">
          {/* <button className="rounded-lg p-2 hover:bg-gray-100">
            <Menu size={22} />
          </button> */}

          <div className="flex items-center gap-1">
            <div>
              <ApplicationLogo />
            </div>

            <div>
              {/* <h1 className="text-xl font-extrabold tracking-wide text-red-700">
                VAL<span className="text-red-600">O</span>R
              </h1> */}
               <img src={ValorLogo} alt="ACORS Logo" className="h-10 w-auto" />
              <p className="text-xs font-medium leading-tight text-gray-500">
                Automated Community <br /> Operations & Response System
              </p>
            </div>
          </div>

          <div className="relative">
            <button
              type="button"
              onClick={() => setNotificationOpen(!notificationOpen)}
              className="relative rounded-lg p-2 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900"
              aria-label="Open notifications"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[10px] font-semibold text-white">
                {notifications.length}
              </span>
            </button>

            {notificationOpen && (
              <div className="absolute right-0 z-30 mt-2 w-[min(20rem,calc(100vw-2rem))] overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-md">
                <div className="border-b border-zinc-200 px-4 py-3">
                  <h3 className="font-semibold text-zinc-900">Notifications</h3>
                </div>

                <div className="max-h-80 overflow-y-auto">
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
                  <button className="text-sm font-semibold text-red-600 hover:text-red-700">
                    View all notifications
                  </button>
                </div>
              </div>
            )}
          </div>
        </header>
        )}

        {/* Page Content */}
        <main className="pb-28">{children}</main>

        {/* Mobile Bottom Navigation */}
        {!hideNavigation && (
          <nav className="fixed bottom-0 left-1/2 z-50 w-full max-w-md -translate-x-1/2 rounded-t-3xl bg-white px-6 py-3 shadow-[0_-8px_30px_rgba(0,0,0,0.08)]">
          <div className="grid grid-cols-5 items-center text-xs">
            <MobileNavItem to="/home" icon={<Home size={20} />} label="Home" />
            <MobileNavItem
              to="/reports"
              icon={<ClipboardList size={20} />}
              label="Reports"
            />

            <div className="flex justify-center">
              <NavLink
                to="/report-issue"
                className={({ isActive }) =>
                  `-mt-8 flex h-14 w-14 items-center justify-center rounded-full shadow-lg ring-4 ring-white transition ${
                    isActive
                      ? "bg-red-600 text-white"
                      : "bg-white text-red-600"
                  }`
                }
              >
                <Plus size={28} />
              </NavLink>
            </div>

            <MobileNavItem
              to="/request-certificate"
              icon={<ScrollText size={20} />}
              label="Certificate"
            />
            <MobileNavItem
              to="/profile"
              icon={<User size={20} />}
              label="Profile"
            />
          </div>
        </nav>
        )}
      </div>

      {/* Desktop Layout Wrapper */}
      <div className="hidden min-h-screen lg:flex">
        {/* Sidebar */}
        <aside className="fixed left-0 top-0 flex h-screen w-68 flex-col bg-white px-6 py-6 shadow-sm">
          <div className="flex items-center gap-1">
            <ApplicationLogo size={56} />

            <div>
              {/* <h1 className="text-2xl font-extrabold text-red-700">
                VAL<span className="text-red-600">O</span>R
              </h1> */}
               <img src={ValorLogo} alt="ACORS Logo" className="h-6 w-auto" />
              <p className="text-xs text-gray-500 mt-1"> Automated Community <br /> Operations & Response System</p>
            </div>
          </div>

          <nav className="mt-10 space-y-2">
            <DesktopNavItem
              to="/home"
              icon={<Home size={20} />}
              label="Home Dashboard"
            />
            <DesktopNavItem
              to="/reports"
              icon={<ClipboardList size={20} />}
              label="My Reports"
            />
            <DesktopNavItem
              to="/request-certificate"
              icon={<ScrollText size={20} />}
              label="Request Certificate"
            />
            <DesktopNavItem
              to="/profile"
              icon={<User size={20} />}
              label="Profile"
            />
          </nav>

          <div className="mt-auto rounded-2xl bg-red-50 p-4">
            <p className="text-sm font-semibold text-red-900">
              See an issue in your area?
            </p>
            <p className="mt-1 text-xs text-red-600">
              Report it directly to the LGU.
            </p>
            <NavLink to="/report-issue" className="mt-3 block rounded-xl bg-red-600 py-3 text-center text-sm font-semibold text-white hover:bg-red-700">
              Submit Report
            </NavLink>
          </div>
        </aside>

        {/* Desktop Content */}
        <main className="ml-68 min-h-screen flex-1 px-8 py-6">{children}</main>
      </div>
    </div>
  );
}

function MobileNavItem({ to, icon, label }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex flex-col items-center gap-1 ${
          isActive ? "text-red-600" : "text-gray-400"
        }`
      }
    >
      {icon}
      <span className="text-[11px] font-semibold">{label}</span>
    </NavLink>
  );
}

function DesktopNavItem({ to, icon, label }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition ${
          isActive
            ? "bg-red-600 text-white"
            : "text-gray-600 hover:bg-red-50 hover:text-red-600"
        }`
      }
    >
      {icon}
      {label}
    </NavLink>
  );
}
