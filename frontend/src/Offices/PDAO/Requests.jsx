// src/Offices/PDAO/Requests.jsx
import { useState, useEffect } from "react";
import {
  FileText, Search, CheckCircle2, AlertCircle, Clock3, XCircle,
  Eye, X, Sparkles, User, CreditCard, Check, ShieldCheck,
  RefreshCw, Edit3, Accessibility, HeartHandshake, Users,
} from "lucide-react";
import OfficeLayout from "../OfficeLayout";
import { pdaoOffice } from "../officeData";
import { getPDAORequests, updatePDAORequestStatus } from "../../services/pdaoData";

export default function PDAORequests() {
  const [requests, setRequests] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [actionFeedback, setActionFeedback] = useState(null);
  const [correctionNote, setCorrectionNote] = useState("");
  const [showCorrectionModal, setShowCorrectionModal] = useState(false);

  const loadData = () => setRequests(getPDAORequests());

  useEffect(() => {
    document.title = "PDAO Applications & Verification — ACORS";
    loadData();
  }, []);

  function certTypeBadge(type) {
    if (type?.includes("Registration")) return { label: "Registration", cls: "bg-blue-50 text-blue-700" };
    if (type?.includes("ID")) return { label: "PWD ID", cls: "bg-emerald-50 text-emerald-700" };
    if (type?.includes("Disability")) return { label: "Certification", cls: "bg-violet-50 text-violet-700" };
    return { label: type, cls: "bg-zinc-100 text-zinc-700" };
  }

  const filteredRequests = requests.filter((req) => {
    const applicantName = req.applicant?.fullName || "";
    const reqId = req.id || "";
    const disType = req.disabilityInfo?.type || req.pwdInfo?.type || "";

    const matchesSearch =
      reqId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      applicantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      disType.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "All" || req.status?.toLowerCase() === statusFilter.toLowerCase();

    const matchesType =
      typeFilter === "All" ||
      (typeFilter === "Registration" && req.certificateType?.includes("Registration")) ||
      (typeFilter === "ID" && req.certificateType?.includes("ID")) ||
      (typeFilter === "Certificate" && req.certificateType?.includes("Disability"));

    return matchesSearch && matchesStatus && matchesType;
  });

  const stats = {
    total: requests.length,
    pending: requests.filter((r) => r.status?.includes("Verification") || r.status === "Submitted").length,
    requiresCorrection: requests.filter((r) => r.status === "Requires Correction").length,
    approved: requests.filter((r) => r.status === "Approved").length,
  };

  function handleApprove(reqId) {
    const isRegistration = selectedRequest?.certificateType?.includes("Registration");
    const isID = selectedRequest?.certificateType?.includes("ID");
    const docNo = isRegistration
      ? `PDAO-RC-2026-${Math.floor(100000 + Math.random() * 900000)}`
      : isID
      ? `PDAO-ID-2026-${Math.floor(100000 + Math.random() * 900000)}`
      : `PDAO-CD-2026-${Math.floor(100000 + Math.random() * 900000)}`;

    const updated = updatePDAORequestStatus(reqId, "Approved", {
      certificateNumber: docNo,
      verificationStatus: "Verified & Approved by PDAO Officer",
      issueDate: new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
    });
    setRequests(updated);
    if (selectedRequest?.id === reqId) {
      setSelectedRequest({
        ...selectedRequest,
        status: "Approved",
        certificateNumber: docNo,
        verificationStatus: "Verified & Approved by PDAO Officer",
      });
    }
    setActionFeedback({ type: "success", message: `Application ${reqId} approved & certified by PDAO.` });
    setTimeout(() => setActionFeedback(null), 4000);
  }

  function handleReject(reqId) {
    const updated = updatePDAORequestStatus(reqId, "Rejected", {
      verificationStatus: "Rejected by PDAO Officer",
      rejectionReason: "Inconsistent medical assessment or non-qualifying disability parameters.",
    });
    setRequests(updated);
    if (selectedRequest?.id === reqId) setSelectedRequest({ ...selectedRequest, status: "Rejected", verificationStatus: "Rejected by PDAO Officer" });
    setActionFeedback({ type: "danger", message: `Application ${reqId} rejected.` });
    setTimeout(() => setActionFeedback(null), 4000);
  }

  function handleRequestCorrection(reqId) {
    const note = correctionNote || "Please upload a clearer copy of your Barangay Certificate of Residence or clinical evaluation.";
    const updated = updatePDAORequestStatus(reqId, "Requires Correction", {
      verificationStatus: "Awaiting Applicant Document Correction",
      correctionNote: note,
    });
    setRequests(updated);
    if (selectedRequest?.id === reqId) {
      setSelectedRequest({
        ...selectedRequest,
        status: "Requires Correction",
        verificationStatus: "Awaiting Applicant Document Correction",
        correctionNote: note,
      });
    }
    setShowCorrectionModal(false);
    setCorrectionNote("");
    setActionFeedback({ type: "warning", message: `Correction request sent for application ${reqId}.` });
    setTimeout(() => setActionFeedback(null), 4000);
  }

  function handleMarkManual(reqId) {
    const updated = updatePDAORequestStatus(reqId, "Under Manual Investigation", {
      verificationStatus: "Scheduled for Field/Case Worker Verification",
    });
    setRequests(updated);
    if (selectedRequest?.id === reqId) {
      setSelectedRequest({
        ...selectedRequest,
        status: "Under Manual Investigation",
        verificationStatus: "Scheduled for Field/Case Worker Verification",
      });
    }
    setActionFeedback({ type: "warning", message: `Application ${reqId} assigned for manual case review.` });
    setTimeout(() => setActionFeedback(null), 4000);
  }

  return (
    <OfficeLayout office={pdaoOffice} header="PDAO Applications & Records">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between animate-fade-up">
          <div>
            <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.22em] text-gray-500">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-600 opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-red-600" />
              </span>
              City Government of Malaybalay · PDAO Registry Desk
            </p>
            <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">PDAO Applications Console</h1>
          </div>
          <button onClick={loadData} className="flex items-center gap-2 self-start rounded-xl border border-zinc-200 bg-white px-3.5 py-2 text-xs font-bold text-gray-700 shadow-sm transition hover:bg-zinc-50">
            <RefreshCw size={14} /> Refresh Queue
          </button>
        </div>

        {/* Action Banner */}
        {actionFeedback && (
          <div className={`flex items-center justify-between rounded-2xl p-4 text-xs font-bold animate-fade-in ${actionFeedback.type === "success" ? "border border-emerald-200 bg-emerald-50 text-emerald-900" : actionFeedback.type === "warning" ? "border border-amber-200 bg-amber-50 text-amber-900" : "border border-red-200 bg-red-50 text-red-900"}`}>
            <div className="flex items-center gap-2">
              {actionFeedback.type === "success" && <CheckCircle2 size={16} className="text-emerald-600" />}
              {actionFeedback.type === "warning" && <AlertCircle size={16} className="text-amber-600" />}
              {actionFeedback.type === "danger" && <XCircle size={16} className="text-red-600" />}
              <span>{actionFeedback.message}</span>
            </div>
            <button onClick={() => setActionFeedback(null)} className="text-gray-400 hover:text-gray-600"><X size={16} /></button>
          </div>
        )}

        {/* Stat Cards */}
        <section className="grid animate-fade-up grid-cols-2 divide-y divide-gray-100 rounded-3xl border border-gray-200/70 bg-white shadow-sm sm:grid-cols-4 sm:divide-x sm:divide-y-0" style={{ animationDelay: "40ms" }}>
          {[
            { label: "Total Submissions", value: stats.total, note: "Registry applications", cls: "text-gray-900" },
            { label: "Approved / Issued", value: stats.approved, note: "Certified PWDs", cls: "text-emerald-600" },
            { label: "Pending Review", value: stats.pending, note: "Queue for officer", cls: "text-blue-600" },
            { label: "Requires Correction", value: stats.requiresCorrection, note: "Missing documents", cls: "text-amber-600" },
          ].map((s) => (
            <div key={s.label} className="p-4 sm:p-5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-gray-500">{s.label}</p>
              <p className={`mt-1 font-mono text-3xl font-bold tracking-tight ${s.cls}`}>{s.value}</p>
              <p className="mt-1 font-mono text-[11px] text-gray-500">{s.note}</p>
            </div>
          ))}
        </section>

        {/* Filters */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between animate-fade-up" style={{ animationDelay: "60ms" }}>
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by ID, applicant name, disability type…"
              className="w-full rounded-2xl border border-zinc-200 bg-white pl-10 pr-4 py-2.5 text-xs font-medium text-gray-900 focus:border-red-600 focus:outline-none focus:ring-1 focus:ring-red-600 shadow-sm"
            />
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="rounded-xl border border-zinc-200 bg-white px-3 py-2 text-xs font-bold text-zinc-700 focus:border-red-600 focus:outline-none"
            >
              <option value="All">All Services</option>
              <option value="Registration">PWD Registration</option>
              <option value="ID">PWD ID</option>
              <option value="Certificate">Certificate of Disability</option>
            </select>
            {["All", "Ready for PDAO Verification", "Requires Correction", "Approved", "Rejected"].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`rounded-xl px-3 py-2 text-xs font-bold transition whitespace-nowrap ${statusFilter === status ? "bg-red-700 text-white shadow-sm" : "bg-white border border-zinc-200 text-zinc-600 hover:bg-zinc-50"}`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Requests Table */}
        <section className="animate-fade-up rounded-3xl border border-gray-200/70 bg-white p-4 sm:p-5 shadow-sm overflow-hidden" style={{ animationDelay: "80ms" }}>
          <div className="overflow-x-auto">
            <table className="w-full min-w-240 text-left text-xs">
              <thead>
                <tr className="border-b border-gray-200 text-[11px] uppercase tracking-wider text-gray-500">
                  <th className="px-3.5 py-3 font-semibold">Request ID</th>
                  <th className="px-3.5 py-3 font-semibold">Service</th>
                  <th className="px-3.5 py-3 font-semibold">Applicant</th>
                  <th className="px-3.5 py-3 font-semibold">Disability</th>
                  <th className="px-3.5 py-3 font-semibold">AI Scan</th>
                  <th className="px-3.5 py-3 font-semibold">Documents</th>
                  <th className="px-3.5 py-3 font-semibold">Status</th>
                  <th className="px-3.5 py-3 text-right font-semibold">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredRequests.length === 0 ? (
                  <tr><td colSpan={8} className="py-12 text-center text-gray-400">No applications found matching your criteria.</td></tr>
                ) : (
                  filteredRequests.map((req) => {
                    const badge = certTypeBadge(req.certificateType);
                    const disType = req.disabilityInfo?.type || req.pwdInfo?.type || "—";
                    const isMissing = req.status === "Requires Correction";
                    return (
                      <tr key={req.id} className="transition hover:bg-gray-50/70">
                        <td className="px-3.5 py-4 font-mono font-bold text-red-700">{req.id}</td>
                        <td className="px-3.5 py-4">
                          <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-mono text-[10px] font-extrabold ${badge.cls}`}>{badge.label}</span>
                        </td>
                        <td className="px-3.5 py-4">
                          <p className="font-bold text-gray-900">{req.applicant?.fullName}</p>
                          <p className="text-[11px] text-gray-400">{req.applicant?.barangay || req.applicant?.address?.split(",")[0]}</p>
                        </td>
                        <td className="px-3.5 py-4 font-medium text-gray-800">{disType}</td>
                        <td className="px-3.5 py-4">
                          {req.aiValidation?.status === "PASSED" || req.aiValidation?.status?.includes("READY") ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-700"><CheckCircle2 size={12} /> {req.aiValidation.confidence || "95%"}</span>
                          ) : (
                            <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-[10px] font-bold text-amber-700"><AlertCircle size={12} /> Check</span>
                          )}
                        </td>
                        <td className="px-3.5 py-4">
                          {isMissing ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700"><AlertCircle size={13} /> Incomplete</span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700"><Check size={13} /> Complete</span>
                          )}
                        </td>
                        <td className="px-3.5 py-4"><StatusPill status={req.status} /></td>
                        <td className="px-3.5 py-4 text-right">
                          <button onClick={() => setSelectedRequest(req)} className="inline-flex items-center gap-1.5 rounded-xl border border-zinc-200 bg-white px-3 py-1.5 text-xs font-bold text-gray-700 shadow-sm transition hover:bg-zinc-50 hover:text-red-700">
                            <Eye size={14} /> Review
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      {/* Slide-over Review Drawer */}
      {selectedRequest && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="fixed inset-0 bg-zinc-900/50 backdrop-blur-xs" onClick={() => setSelectedRequest(null)} />
          <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
            <div className="w-screen max-w-xl bg-white shadow-2xl">
              <div className="flex h-full flex-col overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 z-20 flex items-center justify-between border-b border-zinc-200 bg-white px-6 py-4">
                  <div>
                    <span className="font-mono text-[11px] font-bold text-red-600">PDAO Officer Review Panel</span>
                    <h2 className="font-mono text-base font-extrabold text-gray-900">{selectedRequest.id}</h2>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusPill status={selectedRequest.status} />
                    <button onClick={() => setSelectedRequest(null)} className="rounded-lg p-2 text-zinc-400 hover:bg-zinc-100"><X size={18} /></button>
                  </div>
                </div>

                {/* Body */}
                <div className="space-y-6 px-6 py-6 text-xs">
                  {/* Service Card */}
                  <div className="flex items-center justify-between rounded-2xl bg-zinc-50 p-4 border border-zinc-200">
                    <div>
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400">PDAO Service</span>
                      <p className="font-extrabold text-gray-900 text-sm">{selectedRequest.certificateType}</p>
                    </div>
                    <span className="rounded-full bg-emerald-100 px-3 py-1 font-mono text-xs font-bold text-emerald-800">FREE SERVICE</span>
                  </div>

                  {/* AI Validation Result */}
                  <div className={`rounded-2xl border p-4 ${selectedRequest.aiValidation?.status === "PASSED" || selectedRequest.aiValidation?.status?.includes("READY") ? "border-emerald-200 bg-emerald-50/50" : "border-amber-200 bg-amber-50/50"}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Sparkles size={18} className={selectedRequest.aiValidation?.status === "PASSED" || selectedRequest.aiValidation?.status?.includes("READY") ? "text-emerald-600" : "text-amber-600"} />
                        <span className="font-bold text-gray-900 text-sm">AI Document Pre-Screening</span>
                      </div>
                      <span className={`rounded-full px-2.5 py-0.5 font-mono text-[10px] font-extrabold ${selectedRequest.aiValidation?.status === "PASSED" || selectedRequest.aiValidation?.status?.includes("READY") ? "bg-emerald-600 text-white" : "bg-amber-600 text-white"}`}>
                        {selectedRequest.aiValidation?.status}
                      </span>
                    </div>
                    <div className="mt-3 space-y-1.5">
                      {selectedRequest.aiValidation?.checks?.map((c, i) => (
                        <div key={i} className="flex items-start justify-between">
                          <span className="text-gray-600">{c.label}</span>
                          <span className={`font-bold flex items-center gap-1 ${c.passed ? "text-emerald-700" : "text-amber-700"}`}>
                            {c.passed ? <Check size={13} /> : <AlertCircle size={13} />}{c.passed ? "Passed" : "Missing"}
                          </span>
                        </div>
                      ))}
                    </div>
                    <p className="mt-3 border-t border-zinc-200/60 pt-2 font-medium text-[11px] text-gray-700">
                      <span className="font-bold">Recommendation:</span> {selectedRequest.aiValidation?.recommendation}
                    </p>
                    <p className="mt-1.5 text-[10px] text-gray-500 italic">
                      Notice: AI validates document presence and format only. Medical eligibility is determined exclusively by authorized PDAO staff.
                    </p>
                  </div>

                  {/* Applicant Details */}
                  <div className="rounded-2xl border border-zinc-200 bg-zinc-50/60 p-4">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400">Applicant Details</span>
                    <div className="mt-3 grid grid-cols-2 gap-3 text-gray-700">
                      <div><span className="text-gray-400 block text-[11px]">Full Name</span><span className="font-bold text-gray-900">{selectedRequest.applicant?.fullName}</span></div>
                      <div><span className="text-gray-400 block text-[11px]">Date of Birth</span><span className="font-medium text-gray-900">{selectedRequest.applicant?.dob}</span></div>
                      <div><span className="text-gray-400 block text-[11px]">Sex</span><span className="font-medium text-gray-900">{selectedRequest.applicant?.sex || "—"}</span></div>
                      <div><span className="text-gray-400 block text-[11px]">Contact</span><span className="font-medium text-gray-900">{selectedRequest.applicant?.contactNumber}</span></div>
                      <div><span className="text-gray-400 block text-[11px]">Email</span><span className="font-medium text-gray-900">{selectedRequest.applicant?.email}</span></div>
                      <div><span className="text-gray-400 block text-[11px]">Barangay</span><span className="font-medium text-gray-900">{selectedRequest.applicant?.barangay}</span></div>
                      <div className="col-span-2"><span className="text-gray-400 block text-[11px]">Complete Address</span><span className="font-medium text-gray-900">{selectedRequest.applicant?.address}</span></div>
                    </div>
                  </div>

                  {/* Disability Information */}
                  <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-xs">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-red-600">Disability Declaration</span>
                    <div className="mt-3 grid grid-cols-2 gap-3 text-gray-700">
                      <div><span className="text-gray-400 block text-[11px]">Type of Disability</span><span className="font-bold text-gray-900">{selectedRequest.disabilityInfo?.type || selectedRequest.pwdInfo?.type}</span></div>
                      <div><span className="text-gray-400 block text-[11px]">Cause</span><span className="font-medium text-gray-900">{selectedRequest.disabilityInfo?.cause || selectedRequest.pwdInfo?.cause || "—"}</span></div>
                      <div><span className="text-gray-400 block text-[11px]">Year Started</span><span className="font-medium text-gray-900">{selectedRequest.disabilityInfo?.yearStarted || selectedRequest.pwdInfo?.yearStarted || "—"}</span></div>
                      <div><span className="text-gray-400 block text-[11px]">Assistive Device</span><span className="font-medium text-gray-900">{selectedRequest.disabilityInfo?.assistiveDevice || selectedRequest.pwdInfo?.assistiveDevice || "None"}</span></div>
                      {selectedRequest.disabilityInfo?.purpose && <div className="col-span-2"><span className="text-gray-400 block text-[11px]">Purpose</span><span className="font-medium text-gray-900">{selectedRequest.disabilityInfo.purpose}</span></div>}
                      {selectedRequest.disabilityInfo?.additionalInfo && <div className="col-span-2"><span className="text-gray-400 block text-[11px]">Additional Information</span><span className="font-medium text-gray-900">{selectedRequest.disabilityInfo.additionalInfo}</span></div>}
                      {selectedRequest.pwdInfo?.description && <div className="col-span-2"><span className="text-gray-400 block text-[11px]">Description</span><span className="font-medium text-gray-900">{selectedRequest.pwdInfo.description}</span></div>}
                    </div>
                  </div>

                  {/* Representative Info if any */}
                  {selectedRequest.isRepresentative && selectedRequest.representative && (
                    <div className="rounded-2xl border border-purple-200 bg-purple-50/40 p-4">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-purple-700">Authorized Representative</span>
                      <div className="mt-2 grid grid-cols-2 gap-3 text-gray-700">
                        <div><span className="text-gray-400 block text-[11px]">Name</span><span className="font-bold text-gray-900">{selectedRequest.representative.fullName}</span></div>
                        <div><span className="text-gray-400 block text-[11px]">Relationship</span><span className="font-medium text-gray-900">{selectedRequest.representative.relationship}</span></div>
                        <div><span className="text-gray-400 block text-[11px]">Contact</span><span className="font-medium text-gray-900">{selectedRequest.representative.contactNumber}</span></div>
                      </div>
                    </div>
                  )}

                  {/* Uploaded Documents */}
                  <div className="rounded-2xl border border-zinc-200 bg-zinc-50/60 p-4">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400">Attached Requirements</span>
                    <div className="mt-3 space-y-2">
                      {selectedRequest.documents?.map((doc, i) => (
                        <div key={i} className={`flex items-center justify-between rounded-xl border p-3 ${doc.missing ? "border-amber-300 bg-amber-50" : "border-zinc-200 bg-white"}`}>
                          <div className="min-w-0 flex-1">
                            <p className="font-bold text-gray-900 text-xs">{doc.name}</p>
                            <p className="font-mono text-[11px] text-gray-400 truncate">{doc.fileName || "File missing"}</p>
                          </div>
                          {doc.missing ? (
                            <span className="rounded-md bg-amber-100 px-2 py-1 text-[10px] font-bold text-amber-800">Missing</span>
                          ) : (
                            <span className="rounded-md bg-zinc-100 px-2 py-1 text-[10px] font-bold text-gray-600 hover:bg-zinc-200 cursor-pointer">Preview</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Verification Status */}
                  <div className="rounded-2xl border border-blue-100 bg-blue-50/50 p-4">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-700">Verification Status</span>
                    <p className="mt-1 font-bold text-gray-900 text-xs">{selectedRequest.verificationStatus || "Pending Officer Review"}</p>
                    {selectedRequest.correctionNote && (
                      <div className="mt-3 rounded-xl border border-amber-300 bg-amber-50 p-3 text-amber-900">
                        <span className="font-bold block text-xs">Correction Note to Resident:</span>
                        <p className="text-xs mt-0.5">{selectedRequest.correctionNote}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="sticky bottom-0 border-t border-zinc-200 bg-white px-6 py-4 space-y-2.5">
                  <div className="grid grid-cols-3 gap-2">
                    <button onClick={() => setShowCorrectionModal(true)} className="flex items-center justify-center gap-1.5 rounded-xl border border-amber-300 bg-amber-50 py-2.5 text-xs font-bold text-amber-800 transition hover:bg-amber-100">
                      <Edit3 size={14} /> Request Correction
                    </button>
                    <button onClick={() => handleReject(selectedRequest.id)} className="flex items-center justify-center gap-1.5 rounded-xl border border-red-200 bg-red-50 py-2.5 text-xs font-bold text-red-700 transition hover:bg-red-100">
                      <XCircle size={14} /> Reject
                    </button>
                    <button onClick={() => handleApprove(selectedRequest.id)} className="flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-emerald-700">
                      <CheckCircle2 size={14} /> Approve & Issue
                    </button>
                  </div>
                  <button onClick={() => handleMarkManual(selectedRequest.id)} className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-zinc-200 py-2 text-[11px] font-bold text-gray-600 hover:bg-zinc-50">
                    <ShieldCheck size={13} /> Mark for Case Worker Manual Verification
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Correction Modal */}
      {showCorrectionModal && selectedRequest && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-zinc-900/60" onClick={() => setShowCorrectionModal(false)} />
          <div className="relative w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl text-xs">
            <h3 className="text-sm font-extrabold text-gray-900">Request Document Correction</h3>
            <p className="mt-1 text-gray-500">Send an official note to <span className="font-bold text-gray-800">{selectedRequest.applicant?.fullName}</span> explaining what needs to be updated.</p>
            <textarea
              rows={4}
              value={correctionNote}
              onChange={(e) => setCorrectionNote(e.target.value)}
              placeholder="e.g. Proof of residence is missing or unreadable. Please upload a clear photo or copy of your Barangay Certificate of Residency."
              className="mt-4 w-full rounded-2xl border border-zinc-200 p-3 text-xs focus:border-red-600 focus:outline-none focus:ring-1 focus:ring-red-600"
            />
            <div className="mt-4 flex justify-end gap-2">
              <button onClick={() => setShowCorrectionModal(false)} className="rounded-xl border border-zinc-200 px-4 py-2 font-bold text-gray-600 hover:bg-zinc-50">Cancel</button>
              <button onClick={() => handleRequestCorrection(selectedRequest.id)} className="rounded-xl bg-amber-600 px-4 py-2 font-bold text-white shadow-sm hover:bg-amber-700">Send Correction Notice</button>
            </div>
          </div>
        </div>
      )}
    </OfficeLayout>
  );
}

function StatusPill({ status }) {
  const styles = {
    Approved: "bg-emerald-50 text-emerald-700 border-emerald-200",
    "Ready for PDAO Verification": "bg-blue-50 text-blue-700 border-blue-200 animate-pulse",
    "Requires Correction": "bg-amber-50 text-amber-700 border-amber-200",
    "Under Manual Investigation": "bg-purple-50 text-purple-700 border-purple-200",
    Submitted: "bg-zinc-100 text-zinc-700 border-zinc-200",
    Rejected: "bg-red-50 text-red-700 border-red-200",
  };
  return (
    <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 font-mono text-[10px] font-bold ${styles[status] || "bg-zinc-100 text-zinc-700 border-zinc-200"}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" />{status}
    </span>
  );
}
