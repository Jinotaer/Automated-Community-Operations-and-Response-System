// src/Barangay/BarangayNotifications.jsx
import { useState } from "react";
import { Bell, Clock, CheckCircle2, AlertTriangle, Share2, HelpCircle, ArrowRight } from "lucide-react";
import BarangayLayout from "./BarangayLayout";
import { Link } from "react-router-dom";
import { getActiveBarangaySession } from "./barangayData";

export default function BarangayNotifications() {
  const [session] = useState(getActiveBarangaySession());

  const notifications = [
    {
      id: 1,
      title: "New Community Complaint Received",
      desc: "Juan Dela Cruz submitted a complaint for Road Damage on Sayre Highway.",
      time: "15 minutes ago",
      type: "new",
      unread: true,
    },
    {
      id: 2,
      title: "Resident Submitted Additional Information",
      desc: "Maritess Gonzaga provided clearer photos of the culvert drainage.",
      time: "1 hour ago",
      type: "info",
      unread: true,
    },
    {
      id: 3,
      title: "Complaint Requires Barangay Review",
      desc: "Elena Rostata's report on garbage accumulation is awaiting action.",
      time: "3 hours ago",
      type: "pending",
      unread: false,
    },
    {
      id: 4,
      title: "Escalation Acknowledged by LGU",
      desc: "City Engineering Office has received and assigned the escalated pothole repair.",
      time: "Yesterday · 2:15 PM",
      type: "escalated",
      unread: false,
    },
    {
      id: 5,
      title: "Complaint Resolved Successfully",
      desc: "Streetlight repair in Kalasungay marked resolved by Barangay staff.",
      time: "Aug 27, 2026",
      type: "resolved",
      unread: false,
    },
  ];

  return (
    <BarangayLayout header="Barangay Notifications">
      <div className="max-w-4xl space-y-4">
        <div className="flex items-center justify-between rounded-3xl border border-zinc-200/80 bg-white p-5 shadow-xs">
          <div>
            <h2 className="text-base font-extrabold text-zinc-900">Notification Feed</h2>
            <p className="text-xs text-zinc-500">Live operational alerts for {session.barangayName}</p>
          </div>
          <button className="text-xs font-bold text-red-700 hover:text-red-800">
            Mark all as read
          </button>
        </div>

        <div className="space-y-3">
          {notifications.map((n) => (
            <div
              key={n.id}
              className={`flex items-start justify-between gap-4 rounded-2xl border p-4 transition ${
                n.unread
                  ? "border-red-200 bg-red-50/40 shadow-xs"
                  : "border-zinc-200/80 bg-white"
              }`}
            >
              <div className="flex items-start gap-3.5">
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                    n.type === "new"
                      ? "bg-red-600 text-white"
                      : n.type === "info"
                      ? "bg-purple-600 text-white"
                      : n.type === "escalated"
                      ? "bg-red-700 text-white"
                      : "bg-emerald-600 text-white"
                  }`}
                >
                  {n.type === "new" && <Bell size={18} />}
                  {n.type === "info" && <HelpCircle size={18} />}
                  {n.type === "escalated" && <Share2 size={18} />}
                  {n.type === "resolved" && <CheckCircle2 size={18} />}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-extrabold text-zinc-900">{n.title}</p>
                    {n.unread && (
                      <span className="h-2 w-2 rounded-full bg-red-600" />
                    )}
                  </div>
                  <p className="text-xs text-zinc-600 mt-0.5 leading-relaxed">{n.desc}</p>
                  <p className="font-mono text-[10px] text-zinc-400 mt-1">{n.time}</p>
                </div>
              </div>

              <Link
                to="/barangay/complaints"
                className="shrink-0 rounded-xl border border-zinc-200 bg-white p-2 text-zinc-600 hover:bg-zinc-100 hover:text-red-700 transition"
              >
                <ArrowRight size={16} />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </BarangayLayout>
  );
}
