// src/Barangay/BarangayComplaints.jsx
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Search,
  ChevronDown,
  MapPin,
  Sparkles,
  CheckCircle2,
  HelpCircle,
  Wrench,
  Check,
  Share2,
  X,
  AlertTriangle,
  FileText,
  Clock,
  User,
  Phone,
  Mail,
  Send,
  Building2,
  Layers,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import BarangayLayout from "./BarangayLayout";
import {
  getStoredComplaints,
  barangayAcceptComplaint,
  barangayRequestInfo,
  barangayMarkInProgress,
  barangayResolveComplaint,
  barangayEscalateToLgu,
  getRecommendedLguOffice,
  ESCALATION_REASONS,
} from "../services/complaintsStore";
import { getActiveBarangaySession } from "./barangayData";

export default function BarangayComplaints({ initialStatusFilter = "All" }) {
  const [complaints, setComplaints] = useState(getStoredComplaints());
  const [session, setSession] = useState(getActiveBarangaySession());
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState(initialStatusFilter);
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [selectedComplaint, setSelectedComplaint] = useState(null);

  // Modals state
  const [activeModal, setActiveModal] = useState(null); // 'requestInfo' | 'inProgress' | 'resolve' | 'escalate' | null
  const [infoReason, setInfoReason] = useState("Incomplete details or unclear photo");
  const [infoMessage, setInfoMessage] = useState("");
  const [assignedStaff, setAssignedStaff] = useState("");
  const [actionPlan, setActionPlan] = useState("");
  const [targetDate, setTargetDate] = useState("");
  const [progressNotes, setProgressNotes] = useState("");
  const [resolveDescription, setResolveDescription] = useState("");
  const [escalateReason, setEscalateReason] = useState(ESCALATION_REASONS[0]);
  const [escalateAssessment, setEscalateAssessment] = useState("");
  const [escalateStaffNotes, setEscalateStaffNotes] = useState("");

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    function loadData() {
      const active = getActiveBarangaySession();
      setSession(active);
      const data = getStoredComplaints();
      setComplaints(data);
    }
    loadData();
    window.addEventListener("acors_complaints_updated", loadData);
    return () => {
      window.removeEventListener("acors_complaints_updated", loadData);
    };
  }, []);

  useEffect(() => {
    setStatusFilter(initialStatusFilter);
  }, [initialStatusFilter, location.pathname]);

  // Filter complaints by Barangay session and only include active Barangay-level complaints (exclude escalated & resolved)
  const barangayComplaints = complaints.filter((c) => {
    const isThisBarangay =
      c.barangay.toLowerCase().includes(session.slug.toLowerCase()) ||
      session.barangayName.toLowerCase().includes(c.barangay.toLowerCase());
    
    const isEscalated =
      c.status === "ESCALATED TO LGU" ||
      c.status === "LGU REVIEW" ||
      c.status === "LGU ACCEPTED" ||
      c.status === "LGU IN PROGRESS" ||
      Boolean(c.escalation);

    const isResolved = c.status === "RESOLVED";

    return isThisBarangay && !isEscalated && !isResolved;
  });

  const filtered = barangayComplaints.filter((c) => {
    const q = query.toLowerCase().trim();
    const matchesSearch =
      q === "" ||
      c.id.toLowerCase().includes(q) ||
      c.residentName.toLowerCase().includes(q) ||
      c.title.toLowerCase().includes(q) ||
      c.description.toLowerCase().includes(q) ||
      c.category.toLowerCase().includes(q) ||
      c.location.toLowerCase().includes(q);

    let matchesStatus = true;
    if (statusFilter === "Pending Review" || statusFilter === "PENDING") {
      matchesStatus =
        c.status === "BARANGAY REVIEW" ||
        c.status === "SUBMITTED" ||
        c.status === "INFORMATION SUBMITTED";
    } else if (statusFilter === "In Progress" || statusFilter === "IN PROGRESS") {
      matchesStatus =
        c.status === "IN PROGRESS" ||
        c.status === "ACCEPTED" ||
        c.status === "INFORMATION REQUIRED";
    } else if (statusFilter === "Resolved" || statusFilter === "RESOLVED") {
      matchesStatus = c.status === "RESOLVED";
    } else if (statusFilter === "Escalated to LGU" || statusFilter === "ESCALATED") {
      matchesStatus =
        c.status === "ESCALATED TO LGU" ||
        c.status === "LGU REVIEW" ||
        c.status === "LGU ACCEPTED" ||
        c.status === "LGU IN PROGRESS";
    } else if (statusFilter !== "All") {
      matchesStatus = c.status === statusFilter;
    }

    const matchesCategory =
      categoryFilter === "All" || c.category === categoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  const activeComplaint =
    selectedComplaint && filtered.some((c) => c.id === selectedComplaint.id)
      ? filtered.find((c) => c.id === selectedComplaint.id)
      : filtered[0] || null;

  // Actions
  const handleAccept = () => {
    if (!activeComplaint) return;
    const updated = barangayAcceptComplaint(
      activeComplaint.id,
      `${session.staffName} (${session.barangayName})`
    );
    setSelectedComplaint(updated);
  };

  const handleRequestInfoSubmit = (e) => {
    e.preventDefault();
    if (!activeComplaint || !infoMessage.trim()) return;
    const updated = barangayRequestInfo(activeComplaint.id, {
      reason: infoReason,
      messageToResident: infoMessage.trim(),
      staffName: `${session.staffName} (${session.barangayName})`,
    });
    setSelectedComplaint(updated);
    setActiveModal(null);
    setInfoMessage("");
  };

  const handleInProgressSubmit = (e) => {
    e.preventDefault();
    if (!activeComplaint) return;
    const updated = barangayMarkInProgress(activeComplaint.id, {
      assignedStaff: assignedStaff || session.staffName,
      actionBeingTaken: actionPlan || "Dispatching Barangay response team",
      expectedResolutionDate: targetDate || "Within 48 hours",
      notes: progressNotes || "Work scheduled by Barangay.",
      staffName: `${session.staffName} (${session.barangayName})`,
    });
    setSelectedComplaint(updated);
    setActiveModal(null);
  };

  const handleResolveSubmit = (e) => {
    e.preventDefault();
    if (!activeComplaint || !resolveDescription.trim()) return;
    const updated = barangayResolveComplaint(activeComplaint.id, {
      resolutionDescription: resolveDescription.trim(),
      staffName: `${session.staffName} (${session.barangayName})`,
    });
    setSelectedComplaint(updated);
    setActiveModal(null);
    setResolveDescription("");
    navigate("/barangay/resolved");
  };

  const handleEscalateSubmit = (e) => {
    e.preventDefault();
    if (!activeComplaint || !escalateAssessment.trim()) return;
    const recommendedOffice = getRecommendedLguOffice(activeComplaint.category);
    const updated = barangayEscalateToLgu(activeComplaint.id, {
      reason: escalateReason,
      barangayAssessment: escalateAssessment.trim(),
      staffNotes: escalateStaffNotes.trim() || "Forwarded to LGU for technical intervention.",
      recommendedOffice,
      staffName: `${session.staffName} (${session.barangayName})`,
    });
    setSelectedComplaint(updated);
    setActiveModal(null);
    setEscalateAssessment("");
    setEscalateStaffNotes("");
    navigate("/barangay/escalated");
  };

  const categoriesList = [
    "All",
    "Road Damage",
    "Potholes",
    "Garbage Accumulation",
    "Broken Streetlights",
    "Flooding",
    "Fallen Trees",
    "Public Health",
  ];

  return (
    <BarangayLayout header="Barangay Complaint Management">
      <div className="space-y-6">
        {/* Filters Bar */}
        <div className="flex flex-col gap-4 rounded-3xl border border-zinc-200/80 bg-white p-4 sm:p-5 shadow-xs">
          <div className="grid gap-3 sm:grid-cols-1 md:grid-cols-[1fr_auto_auto]">
            {/* Search */}
            <div className="relative">
              <Search
                size={18}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400"
              />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search complaint ID, resident, category, keywords..."
                className="h-11 w-full rounded-2xl border border-zinc-200 bg-zinc-50 pl-10 pr-4 text-xs font-semibold text-zinc-900 outline-none transition focus:border-red-600 focus:bg-white focus:ring-2 focus:ring-red-600/10"
              />
            </div>

            {/* Status Filter */}
            <div className="relative min-w-44">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="h-11 w-full appearance-none rounded-2xl border border-zinc-200 bg-white pl-4 pr-9 text-xs font-bold text-zinc-700 outline-none hover:bg-zinc-50 focus:border-red-600"
              >
                <option value="All">All Active Complaints</option>
                <option value="Pending Review">Pending Review</option>
                <option value="In Progress">In Progress / Accepted</option>
              </select>
              <ChevronDown
                size={15}
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400"
              />
            </div>

            {/* Category Filter */}
            <div className="relative min-w-44">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="h-11 w-full appearance-none rounded-2xl border border-zinc-200 bg-white pl-4 pr-9 text-xs font-bold text-zinc-700 outline-none hover:bg-zinc-50 focus:border-red-600"
              >
                {categoriesList.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat === "All" ? "All Categories" : cat}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={15}
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400"
              />
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-zinc-100 pt-3 text-xs text-zinc-500">
            <p>
              Showing <span className="font-bold text-zinc-900">{filtered.length}</span> complaints for{" "}
              <span className="font-bold text-red-700">{session.barangayName}</span>
            </p>
            <span className="inline-flex items-center gap-1 font-mono text-[11px] text-zinc-400">
              <Layers size={13} />
              TIER 1 QUEUE
            </span>
          </div>
        </div>

        {/* Main Grid: Table on Left + Details on Right */}
        <div className="grid gap-6 xl:grid-cols-12">
          {/* Table Container */}
          <div className="rounded-3xl border border-zinc-200/80 bg-white p-5 shadow-xs xl:col-span-7">
            <div className="overflow-x-auto">
              <table className="w-full min-w-160 text-left text-xs">
                <thead>
                  <tr className="border-b border-zinc-200 text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                    <th className="pb-3 pl-2">Complaint ID</th>
                    <th className="pb-3">Resident</th>
                    <th className="pb-3">Complaint</th>
                    <th className="pb-3">Category</th>
                    <th className="pb-3">AI Severity</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3 text-right pr-2">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {filtered.map((item) => {
                    const isSelected = activeComplaint?.id === item.id;
                    return (
                      <tr
                        key={item.id}
                        onClick={() => setSelectedComplaint(item)}
                        className={`cursor-pointer transition hover:bg-red-50/40 ${
                          isSelected ? "bg-red-50/70 font-semibold" : ""
                        }`}
                      >
                        <td className="py-3.5 pl-2 font-mono text-[11px] font-bold text-zinc-800">
                          {item.id}
                        </td>
                        <td className="py-3.5">
                          <p className="font-bold text-zinc-900">{item.residentName}</p>
                          <p className="text-[10px] text-zinc-400">{item.submittedAt.split("·")[0]}</p>
                        </td>
                        <td className="py-3.5 max-w-44 truncate">
                          <p className="truncate text-zinc-800 font-medium">{item.title}</p>
                          <p className="truncate text-[10px] text-zinc-400">{item.location}</p>
                        </td>
                        <td className="py-3.5">
                          <span className="rounded-md bg-zinc-100 px-2 py-0.5 text-[10px] font-bold text-zinc-700">
                            {item.category}
                          </span>
                        </td>
                        <td className="py-3.5">
                          <SeverityBadge severity={item.severity || item.aiAnalysis?.severity} />
                        </td>
                        <td className="py-3.5">
                          <StatusBadge status={item.status} />
                        </td>
                        <td className="py-3.5 text-right pr-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedComplaint(item);
                            }}
                            className={`rounded-xl px-3 py-1.5 text-xs font-bold transition ${
                              isSelected
                                ? "bg-red-700 text-white shadow-xs"
                                : "border border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-100"
                            }`}
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    );
                  })}

                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan={7} className="py-16 text-center text-zinc-400">
                        <FileText size={32} className="mx-auto text-zinc-300 mb-2" />
                        <p className="font-bold text-sm text-zinc-600">No complaints found</p>
                        <p className="text-xs text-zinc-400 mt-1">
                          Try changing your search term or status filter.
                        </p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Details & Action Panel */}
          <div className="rounded-3xl border border-zinc-200/80 bg-white p-5 shadow-xs xl:col-span-5">
            {activeComplaint ? (
              <div className="space-y-5">
                {/* Header info */}
                <div className="flex items-start justify-between gap-3 border-b border-zinc-100 pb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-red-700 bg-red-50 border border-red-200 px-2 py-0.5 rounded-md">
                        {activeComplaint.id}
                      </span>
                      <StatusBadge status={activeComplaint.status} />
                    </div>
                    <h2 className="mt-2 text-base font-extrabold text-zinc-900 leading-snug">
                      {activeComplaint.title}
                    </h2>
                    <p className="text-xs text-zinc-500 mt-0.5 flex items-center gap-1">
                      <Clock size={12} />
                      Submitted: {activeComplaint.submittedAt}
                    </p>
                  </div>
                </div>

                {/* Resident & Location Card */}
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="rounded-2xl border border-zinc-100 bg-zinc-50/80 p-3">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                      Resident
                    </p>
                    <p className="mt-1 font-bold text-zinc-900 flex items-center gap-1.5">
                      <User size={13} className="text-red-700" />
                      {activeComplaint.residentName}
                    </p>
                    <p className="mt-0.5 text-[11px] text-zinc-500">
                      {activeComplaint.residentContact}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-zinc-100 bg-zinc-50/80 p-3">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                      Barangay & Location
                    </p>
                    <p className="mt-1 font-bold text-zinc-900 truncate">
                      {activeComplaint.barangay}
                    </p>
                    <p className="mt-0.5 text-[11px] text-zinc-500 truncate flex items-center gap-1">
                      <MapPin size={11} className="text-red-600 shrink-0" />
                      {activeComplaint.location}
                    </p>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1">
                    Complaint Description
                  </p>
                  <div className="rounded-2xl bg-zinc-50 border border-zinc-100 p-3.5 text-xs leading-relaxed text-zinc-700">
                    {activeComplaint.description}
                  </div>
                </div>

                {/* Photo Evidence */}
                {activeComplaint.image && (
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
                      Photo Evidence
                    </p>
                    <div className="overflow-hidden rounded-2xl border border-zinc-200">
                      <img
                        src={activeComplaint.image}
                        alt="Evidence"
                        className="h-44 w-full object-cover"
                      />
                    </div>
                  </div>
                )}

                {/* 🤖 ACORS AI ANALYSIS CARD */}
                <div className="rounded-2xl border border-red-200 bg-gradient-to-br from-red-50/80 via-white to-red-50/30 p-4 shadow-2xs">
                  <div className="flex items-center justify-between pb-2 border-b border-red-100">
                    <div className="flex items-center gap-2 text-red-700 font-extrabold text-xs">
                      <Sparkles size={16} />
                      <span>🤖 ACORS AI ANALYSIS</span>
                    </div>
                    <span className="rounded-md bg-red-600/10 px-2 py-0.5 text-[10px] font-bold text-red-700">
                      {activeComplaint.aiAnalysis?.confidence
                        ? `${Math.round(activeComplaint.aiAnalysis.confidence * 100)}% Confidence`
                        : "Verified"}
                    </span>
                  </div>

                  <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-[10px] text-zinc-400 uppercase font-semibold">
                        Category:
                      </span>
                      <p className="font-bold text-zinc-800">{activeComplaint.category}</p>
                    </div>
                    <div>
                      <span className="text-[10px] text-zinc-400 uppercase font-semibold">
                        Severity:
                      </span>
                      <p className="font-bold text-zinc-800">{activeComplaint.severity || "Medium"}</p>
                    </div>
                    <div>
                      <span className="text-[10px] text-zinc-400 uppercase font-semibold">
                        Initial Receiver:
                      </span>
                      <p className="font-bold text-red-700">{activeComplaint.barangay}</p>
                    </div>
                    <div>
                      <span className="text-[10px] text-zinc-400 uppercase font-semibold">
                        Suggested LGU Office:
                      </span>
                      <p className="font-bold text-zinc-800">
                        {activeComplaint.aiAnalysis?.suggestedLguOffice ||
                          getRecommendedLguOffice(activeComplaint.category)}
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 rounded-xl bg-white p-2.5 border border-red-100 text-[11px] text-zinc-700">
                    <span className="font-bold text-red-700 mr-1">AI Recommendation:</span>
                    {activeComplaint.aiAnalysis?.aiRecommendation ||
                      "Send to Barangay for initial Tier 1 assessment."}
                  </div>
                </div>

                {/* Escalation details banner if escalated */}
                {activeComplaint.escalation && (
                  <div className="rounded-2xl border border-red-300 bg-red-50 p-4 text-xs">
                    <div className="flex items-center gap-2 text-red-800 font-extrabold text-xs mb-2">
                      <Share2 size={15} />
                      <span>ESCALATED TO LGU</span>
                    </div>
                    <div className="space-y-1.5 text-zinc-700">
                      <p>
                        <span className="font-bold">Reason:</span> {activeComplaint.escalation.reason}
                      </p>
                      <p>
                        <span className="font-bold">Recommended Office:</span>{" "}
                        <span className="font-bold text-red-700">
                          {activeComplaint.escalation.recommendedOffice}
                        </span>
                      </p>
                      <p>
                        <span className="font-bold">Barangay Assessment:</span>{" "}
                        {activeComplaint.escalation.barangayAssessment}
                      </p>
                      <p className="text-[11px] text-zinc-500 font-mono mt-1">
                        Escalated on: {activeComplaint.escalation.escalatedAt} by{" "}
                        {activeComplaint.escalation.escalatedBy}
                      </p>
                    </div>
                  </div>
                )}

                {/* Resolution details if resolved */}
                {activeComplaint.resolution && (
                  <div className="rounded-2xl border border-emerald-300 bg-emerald-50 p-4 text-xs">
                    <div className="flex items-center gap-2 text-emerald-800 font-extrabold text-xs mb-2">
                      <CheckCircle2 size={16} />
                      <span>RESOLVED BY {activeComplaint.resolution.resolvedLevel?.toUpperCase() || "BARANGAY"}</span>
                    </div>
                    <p className="text-zinc-700 leading-relaxed">
                      {activeComplaint.resolution.description}
                    </p>
                    <p className="text-[11px] text-emerald-700 font-mono mt-1.5">
                      Resolved on: {activeComplaint.resolution.resolvedAt} by{" "}
                      {activeComplaint.resolution.resolvedBy}
                    </p>
                  </div>
                )}

                {/* Info Request Details if awaiting info */}
                {activeComplaint.infoRequest && (
                  <div className="rounded-2xl border border-amber-300 bg-amber-50 p-4 text-xs">
                    <div className="flex items-center gap-2 text-amber-800 font-extrabold text-xs mb-1">
                      <HelpCircle size={15} />
                      <span>ADDITIONAL INFORMATION REQUEST</span>
                    </div>
                    <p className="text-zinc-700 mt-1">
                      <span className="font-bold">Reason:</span> {activeComplaint.infoRequest.reason}
                    </p>
                    <p className="text-zinc-700 mt-1">
                      <span className="font-bold">Message sent:</span> &ldquo;{activeComplaint.infoRequest.messageToResident}&rdquo;
                    </p>
                    {activeComplaint.infoRequest.residentResponse ? (
                      <div className="mt-2.5 rounded-xl bg-white p-2.5 border border-amber-200 text-xs">
                        <span className="font-bold text-emerald-700">Resident Response:</span>
                        <p className="mt-0.5 text-zinc-800">
                          {activeComplaint.infoRequest.residentResponse}
                        </p>
                        <p className="mt-1 text-[10px] text-zinc-400 font-mono">
                          Received: {activeComplaint.infoRequest.responseSubmittedAt}
                        </p>
                      </div>
                    ) : (
                      <p className="text-[11px] text-amber-700 font-semibold mt-2">
                        Waiting for resident to submit requested information.
                      </p>
                    )}
                  </div>
                )}

                {/* ACTION BUTTONS (BARANGAY STAFF) */}
                <div className="border-t border-zinc-200 pt-4">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 mb-3">
                    Barangay Operational Actions
                  </p>

                  <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
                    {/* 1. Accept Complaint */}
                    <button
                      onClick={handleAccept}
                      disabled={
                        activeComplaint.status === "ACCEPTED" ||
                        activeComplaint.status === "RESOLVED" ||
                        activeComplaint.status === "ESCALATED TO LGU"
                      }
                      className="flex items-center justify-center gap-1.5 rounded-xl border border-zinc-200 bg-white py-2.5 px-3 text-xs font-bold text-zinc-700 hover:bg-zinc-50 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      <Check size={14} className="text-emerald-600" />
                      1. Accept
                    </button>

                    {/* 2. Request More Info */}
                    <button
                      onClick={() => setActiveModal("requestInfo")}
                      disabled={
                        activeComplaint.status === "RESOLVED" ||
                        activeComplaint.status === "ESCALATED TO LGU"
                      }
                      className="flex items-center justify-center gap-1.5 rounded-xl border border-zinc-200 bg-white py-2.5 px-3 text-xs font-bold text-zinc-700 hover:bg-zinc-50 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      <HelpCircle size={14} className="text-amber-600" />
                      2. Request Info
                    </button>

                    {/* 3. Mark as In Progress */}
                    <button
                      onClick={() => {
                        setAssignedStaff(session.staffName);
                        setActionPlan(`Barangay response team dispatch for ${activeComplaint.category}`);
                        setTargetDate("Within 48 hours");
                        setActiveModal("inProgress");
                      }}
                      disabled={
                        activeComplaint.status === "IN PROGRESS" ||
                        activeComplaint.status === "RESOLVED" ||
                        activeComplaint.status === "ESCALATED TO LGU"
                      }
                      className="flex items-center justify-center gap-1.5 rounded-xl border border-zinc-200 bg-white py-2.5 px-3 text-xs font-bold text-zinc-700 hover:bg-zinc-50 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      <Wrench size={14} className="text-sky-600" />
                      3. In Progress
                    </button>

                    {/* 4. Resolve Complaint */}
                    <button
                      onClick={() => setActiveModal("resolve")}
                      disabled={
                        activeComplaint.status === "RESOLVED" ||
                        activeComplaint.status === "ESCALATED TO LGU"
                      }
                      className="flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 py-2.5 px-3 text-xs font-bold text-white shadow-xs hover:bg-emerald-700 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      <CheckCircle2 size={14} />
                      4. Resolve
                    </button>

                    {/* 5. Escalate to LGU */}
                    <button
                      onClick={() => {
                        setEscalateReason(ESCALATION_REASONS[1]);
                        setEscalateAssessment(
                          `The issue with ${activeComplaint.title.toLowerCase()} requires equipment and technical resources beyond Barangay capacity.`
                        );
                        setActiveModal("escalate");
                      }}
                      disabled={
                        activeComplaint.status === "RESOLVED" ||
                        activeComplaint.status === "ESCALATED TO LGU"
                      }
                      className="col-span-2 sm:col-span-2 flex items-center justify-center gap-1.5 rounded-xl bg-red-700 py-2.5 px-3 text-xs font-bold text-white shadow-xs hover:bg-red-800 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      <Share2 size={14} />
                      5. Escalate to LGU
                    </button>
                  </div>
                </div>

                {/* Audit Trail / History */}
                <div className="border-t border-zinc-100 pt-4">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-2">
                    Complaint Timeline &amp; History
                  </p>
                  <div className="space-y-3">
                    {activeComplaint.timeline?.map((step, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 text-xs">
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-100 text-[10px] font-bold text-red-700 mt-0.5">
                          {idx + 1}
                        </span>
                        <div>
                          <p className="font-bold text-zinc-900">{step.step}</p>
                          <p className="text-[11px] text-zinc-500">{step.note}</p>
                          <span className="font-mono text-[10px] text-zinc-400">
                            {step.time} · {step.actor}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-20 text-center text-zinc-400">
                <p className="text-sm font-bold">No complaint selected</p>
                <p className="text-xs mt-1">Select a complaint from the table to view details.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* MODAL 1: REQUEST MORE INFORMATION */}
      {/* ------------------------------------------------------------- */}
      {activeModal === "requestInfo" && activeComplaint && (
        <ModalWrapper title="Request More Information" onClose={() => setActiveModal(null)}>
          <form onSubmit={handleRequestInfoSubmit} className="space-y-4">
            <div className="rounded-2xl bg-amber-50 p-3 text-xs text-amber-800">
              Notify <span className="font-bold">{activeComplaint.residentName}</span> that additional details are needed before the Barangay can proceed.
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wide text-zinc-600 mb-1">
                Reason for Request
              </label>
              <select
                value={infoReason}
                onChange={(e) => setInfoReason(e.target.value)}
                className="w-full rounded-xl border border-zinc-300 p-2.5 text-xs font-semibold focus:border-red-600 outline-none"
              >
                <option value="Incomplete details or unclear photo">Incomplete details or unclear photo</option>
                <option value="Exact landmark or street number needed">Exact landmark or street number needed</option>
                <option value="Need clarification on private property boundary">Need clarification on private property boundary</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wide text-zinc-600 mb-1">
                Message to Resident
              </label>
              <textarea
                rows={3}
                required
                value={infoMessage}
                onChange={(e) => setInfoMessage(e.target.value)}
                placeholder="e.g. Please provide a clearer photo and exact location of the pothole."
                className="w-full rounded-xl border border-zinc-300 p-3 text-xs font-semibold focus:border-red-600 outline-none resize-none"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="rounded-xl border border-zinc-200 px-4 py-2 text-xs font-bold text-zinc-600 hover:bg-zinc-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex items-center gap-1.5 rounded-xl bg-amber-600 px-4 py-2 text-xs font-bold text-white hover:bg-amber-700"
              >
                <Send size={13} />
                Send Request
              </button>
            </div>
          </form>
        </ModalWrapper>
      )}

      {/* ------------------------------------------------------------- */}
      {/* MODAL 2: MARK AS IN PROGRESS */}
      {/* ------------------------------------------------------------- */}
      {activeModal === "inProgress" && activeComplaint && (
        <ModalWrapper title="Mark Complaint as In Progress" onClose={() => setActiveModal(null)}>
          <form onSubmit={handleInProgressSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wide text-zinc-600 mb-1">
                Assigned Staff / Team
              </label>
              <input
                type="text"
                required
                value={assignedStaff}
                onChange={(e) => setAssignedStaff(e.target.value)}
                placeholder="e.g. Barangay Maintenance Crew (R. Gomez)"
                className="w-full rounded-xl border border-zinc-300 p-2.5 text-xs font-semibold focus:border-red-600 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wide text-zinc-600 mb-1">
                Action Being Taken
              </label>
              <input
                type="text"
                required
                value={actionPlan}
                onChange={(e) => setActionPlan(e.target.value)}
                placeholder="e.g. Dispatched Barangay clean-up brigade and hauling truck."
                className="w-full rounded-xl border border-zinc-300 p-2.5 text-xs font-semibold focus:border-red-600 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wide text-zinc-600 mb-1">
                Expected Resolution Date
              </label>
              <input
                type="text"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                placeholder="e.g. Aug 30, 2026 (Within 48 hours)"
                className="w-full rounded-xl border border-zinc-300 p-2.5 text-xs font-semibold focus:border-red-600 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wide text-zinc-600 mb-1">
                Internal Staff Notes
              </label>
              <textarea
                rows={2}
                value={progressNotes}
                onChange={(e) => setProgressNotes(e.target.value)}
                placeholder="Add any internal coordination notes..."
                className="w-full rounded-xl border border-zinc-300 p-3 text-xs font-semibold focus:border-red-600 outline-none resize-none"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="rounded-xl border border-zinc-200 px-4 py-2 text-xs font-bold text-zinc-600 hover:bg-zinc-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-xl bg-sky-600 px-4 py-2 text-xs font-bold text-white hover:bg-sky-700"
              >
                Confirm In Progress
              </button>
            </div>
          </form>
        </ModalWrapper>
      )}

      {/* ------------------------------------------------------------- */}
      {/* MODAL 3: RESOLVE COMPLAINT */}
      {/* ------------------------------------------------------------- */}
      {activeModal === "resolve" && activeComplaint && (
        <ModalWrapper title="Resolve Complaint" onClose={() => setActiveModal(null)}>
          <form onSubmit={handleResolveSubmit} className="space-y-4">
            <div className="rounded-2xl bg-emerald-50 p-3 text-xs text-emerald-800">
              Confirm that the Barangay has completely addressed this issue. The resident will be notified.
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wide text-zinc-600 mb-1">
                Resolution Description
              </label>
              <textarea
                rows={3}
                required
                value={resolveDescription}
                onChange={(e) => setResolveDescription(e.target.value)}
                placeholder="e.g. Barangay personnel successfully removed accumulated garbage and sanitized the roadside area."
                className="w-full rounded-xl border border-zinc-300 p-3 text-xs font-semibold focus:border-red-600 outline-none resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-dashed border-zinc-300 p-3 text-center">
                <p className="text-[10px] font-bold uppercase text-zinc-400 mb-1">Before Photo</p>
                <img
                  src={activeComplaint.image}
                  alt="Before"
                  className="h-20 w-full object-cover rounded-lg"
                />
              </div>
              <div className="rounded-xl border border-dashed border-emerald-300 bg-emerald-50/50 p-3 text-center flex flex-col items-center justify-center">
                <p className="text-[10px] font-bold uppercase text-emerald-700 mb-1">After Photo Attached</p>
                <ShieldCheck size={28} className="text-emerald-600" />
                <span className="text-[10px] text-zinc-500 mt-1">Verified on site</span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="rounded-xl border border-zinc-200 px-4 py-2 text-xs font-bold text-zinc-600 hover:bg-zinc-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-700"
              >
                Mark as Resolved
              </button>
            </div>
          </form>
        </ModalWrapper>
      )}

      {/* ------------------------------------------------------------- */}
      {/* MODAL 4: ESCALATE TO LGU */}
      {/* ------------------------------------------------------------- */}
      {activeModal === "escalate" && activeComplaint && (
        <ModalWrapper title="Escalate Complaint to LGU" onClose={() => setActiveModal(null)}>
          <form onSubmit={handleEscalateSubmit} className="space-y-4">
            <div className="rounded-2xl border border-red-200 bg-red-50 p-3 text-xs text-red-900">
              <p className="font-bold flex items-center gap-1.5 text-red-700">
                <AlertTriangle size={15} />
                Barangay Escalation Protocol
              </p>
              <p className="mt-1 text-[11px] leading-relaxed text-zinc-700">
                Use this when the complaint cannot be resolved with Barangay resources. ACORS will automatically route this complaint to the appropriate LGU department.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wide text-zinc-600 mb-1">
                Reason for Escalation
              </label>
              <select
                value={escalateReason}
                onChange={(e) => setEscalateReason(e.target.value)}
                className="w-full rounded-xl border border-zinc-300 p-2.5 text-xs font-semibold focus:border-red-600 outline-none"
              >
                {ESCALATION_REASONS.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>

            {/* Auto LGU Routing Preview */}
            <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-3 text-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                Recommended LGU Office (Auto-Routed by ACORS)
              </span>
              <p className="mt-1 text-sm font-extrabold text-red-700 flex items-center gap-2">
                <Building2 size={16} />
                {getRecommendedLguOffice(activeComplaint.category)}
              </p>
              <p className="text-[10px] text-zinc-500 mt-0.5">
                Matched based on category: {activeComplaint.category}
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wide text-zinc-600 mb-1">
                Barangay Assessment
              </label>
              <textarea
                rows={3}
                required
                value={escalateAssessment}
                onChange={(e) => setEscalateAssessment(e.target.value)}
                placeholder="e.g. The pothole requires heavy equipment and road repair materials unavailable at the Barangay."
                className="w-full rounded-xl border border-zinc-300 p-3 text-xs font-semibold focus:border-red-600 outline-none resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wide text-zinc-600 mb-1">
                Staff Notes &amp; Supporting Context
              </label>
              <textarea
                rows={2}
                value={escalateStaffNotes}
                onChange={(e) => setEscalateStaffNotes(e.target.value)}
                placeholder="Add on-site inspection observations or urgent safety warnings..."
                className="w-full rounded-xl border border-zinc-300 p-3 text-xs font-semibold focus:border-red-600 outline-none resize-none"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-zinc-100">
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="rounded-xl border border-zinc-200 px-4 py-2 text-xs font-bold text-zinc-600 hover:bg-zinc-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex items-center gap-1.5 rounded-xl bg-red-700 px-5 py-2 text-xs font-bold text-white shadow-xs hover:bg-red-800"
              >
                <Share2 size={13} />
                Confirm Escalation to LGU
              </button>
            </div>
          </form>
        </ModalWrapper>
      )}
    </BarangayLayout>
  );
}

function ModalWrapper({ title, onClose, children }) {
  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/60 p-4 backdrop-blur-xs animate-in fade-in"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl animate-in zoom-in-95"
      >
        <div className="flex items-center justify-between pb-3 border-b border-zinc-100 mb-4">
          <h3 className="text-base font-extrabold text-zinc-900">{title}</h3>
          <button
            onClick={onClose}
            className="rounded-full p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700"
          >
            <X size={18} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const styles = {
    "BARANGAY REVIEW": "bg-amber-100 text-amber-800 border-amber-200",
    SUBMITTED: "bg-zinc-100 text-zinc-700 border-zinc-200",
    ACCEPTED: "bg-blue-100 text-blue-800 border-blue-200",
    "IN PROGRESS": "bg-sky-100 text-sky-800 border-sky-200",
    "INFORMATION REQUIRED": "bg-orange-100 text-orange-800 border-orange-200",
    "INFORMATION SUBMITTED": "bg-purple-100 text-purple-800 border-purple-200",
    RESOLVED: "bg-emerald-100 text-emerald-800 border-emerald-200",
    "ESCALATED TO LGU": "bg-red-100 text-red-800 border-red-200",
    "LGU REVIEW": "bg-red-100 text-red-800 border-red-200",
    "LGU ACCEPTED": "bg-indigo-100 text-indigo-800 border-indigo-200",
    "LGU IN PROGRESS": "bg-cyan-100 text-cyan-800 border-cyan-200",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-extrabold ${
        styles[status] || "bg-zinc-100 text-zinc-700 border-zinc-200"
      }`}
    >
      {status}
    </span>
  );
}

function SeverityBadge({ severity = "Medium" }) {
  const styles = {
    High: "text-red-700 bg-red-50 border-red-200",
    Critical: "text-red-800 bg-red-100 border-red-300",
    Medium: "text-amber-700 bg-amber-50 border-amber-200",
    Low: "text-zinc-600 bg-zinc-50 border-zinc-200",
  };

  return (
    <span
      className={`inline-flex items-center rounded-md border px-2 py-0.5 text-[10px] font-extrabold ${
        styles[severity] || styles.Medium
      }`}
    >
      {severity}
    </span>
  );
}
