// src/Offices/LCRO/Requests.jsx
import { useState, useEffect } from "react";
import {
  FileText,
  Search,
  CheckCircle2,
  AlertCircle,
  Clock3,
  XCircle,
  Eye,
  X,
  Sparkles,
  User,
  Building,
  CreditCard,
  Check,
  ShieldCheck,
  Printer,
  ChevronDown,
  RefreshCw,
  Edit3,
  Heart,
  Skull,
} from "lucide-react";
import OfficeLayout from "../OfficeLayout";
import { lcroOffice } from "../officeData";
import { getLCRORequests, updateLCRORequestStatus } from "../../services/lcroData";

export default function LCRORequests() {
  const [requests, setRequests] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [actionFeedback, setActionFeedback] = useState(null);
  const [correctionNote, setCorrectionNote] = useState("");
  const [showCorrectionModal, setShowCorrectionModal] = useState(false);

  const loadData = () => {
    setRequests(getLCRORequests());
  };

  useEffect(() => {
    document.title = "LCRO Certificate Requests — ACORS";
    loadData();
  }, []);

  const filteredRequests = requests.filter((req) => {
    const applicantName = req.applicant?.fullName || "";
    const subjectName = req.record?.fullName || req.marriageRecord?.husbandName || req.deathRecord?.deceasedName || "";
    const wifeName = req.marriageRecord?.wifeName || "";
    const reqId = req.id || "";

    const matchesSearch =
      reqId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      applicantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      subjectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      wifeName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "All" || req.status.toLowerCase() === statusFilter.toLowerCase();

    const matchesType =
      typeFilter === "All" ||
      (typeFilter === "Birth" && req.certificateType.includes("Birth")) ||
      (typeFilter === "Marriage" && req.certificateType.includes("Marriage")) ||
      (typeFilter === "Death" && req.certificateType.includes("Death"));

    return matchesSearch && matchesStatus && matchesType;
  });

  const stats = {
    total: requests.length,
    approved: requests.filter((r) => r.status === "Approved").length,
    reviewNeeded: requests.filter((r) => r.status === "Requires LGU Review").length,
    processing: requests.filter((r) => r.status === "Processing" || r.status === "Submitted").length,
  };

  const handleApprove = (reqId) => {
    const isMarriage = selectedRequest?.certificateType?.includes("Marriage");
    const isDeath = selectedRequest?.certificateType?.includes("Death");
    const certNo = isMarriage
      ? `LCRO-MC-2026-${Math.floor(100000 + Math.random() * 900000)}`
      : isDeath
      ? `LCRO-DC-2026-${Math.floor(100000 + Math.random() * 900000)}`
      : `LCRO-BC-2026-${Math.floor(100000 + Math.random() * 900000)}`;

    const updated = updateLCRORequestStatus(reqId, "Approved", {
      certificateNumber: certNo,
      issueDate: new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
    });
    setRequests(updated);
    if (selectedRequest && selectedRequest.id === reqId) {
      setSelectedRequest({
        ...selectedRequest,
        status: "Approved",
        certificateNumber: certNo,
        issueDate: new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
      });
    }
    setActionFeedback({ type: "success", message: `Request ${reqId} successfully Approved & Certified.` });
    setTimeout(() => setActionFeedback(null), 4000);
  };

  const handleReject = (reqId) => {
    const updated = updateLCRORequestStatus(reqId, "Rejected", {
      rejectionReason: "Record owner verification mismatch after physical archive review.",
    });
    setRequests(updated);
    if (selectedRequest && selectedRequest.id === reqId) {
      setSelectedRequest({ ...selectedRequest, status: "Rejected" });
    }
    setActionFeedback({ type: "danger", message: `Request ${reqId} has been Rejected.` });
    setTimeout(() => setActionFeedback(null), 4000);
  };

  const handleRequestCorrection = (reqId) => {
    const updated = updateLCRORequestStatus(reqId, "Correction Requested", {
      correctionNote: correctionNote || "Please upload a clearer copy of your government ID.",
    });
    setRequests(updated);
    if (selectedRequest && selectedRequest.id === reqId) {
      setSelectedRequest({
        ...selectedRequest,
        status: "Correction Requested",
        correctionNote: correctionNote || "Please upload a clearer copy of your government ID.",
      });
    }
    setShowCorrectionModal(false);
    setCorrectionNote("");
    setActionFeedback({ type: "warning", message: `Correction request sent to applicant for ${reqId}.` });
    setTimeout(() => setActionFeedback(null), 4000);
  };

  return (
    <OfficeLayout office={lcroOffice} header="Certificate Requests">
      <div className="space-y-6">
        {/* Header Title */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between animate-fade-up">
          <div>
            <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.22em] text-gray-500">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-600 opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-red-600" />
              </span>
              City Civil Registrar · Document Verification & Issuance
            </p>
            <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">
              Civil Registry Certificate Requests
            </h1>
          </div>

          <button
            onClick={loadData}
            className="flex items-center gap-2 self-start rounded-xl border border-zinc-200 bg-white px-3.5 py-2 text-xs font-bold text-gray-700 shadow-sm transition hover:bg-zinc-50"
          >
            <RefreshCw size={14} />
            Refresh Queue
          </button>
        </div>

        {/* Action Alert Banner */}
        {actionFeedback && (
          <div
            className={`flex items-center justify-between rounded-2xl p-4 text-xs font-bold animate-fade-in ${
              actionFeedback.type === "success"
                ? "border border-emerald-200 bg-emerald-50 text-emerald-900"
                : actionFeedback.type === "warning"
                ? "border border-amber-200 bg-amber-50 text-amber-900"
                : "border border-red-200 bg-red-50 text-red-900"
            }`}
          >
            <div className="flex items-center gap-2">
              {actionFeedback.type === "success" && <CheckCircle2 size={16} className="text-emerald-600" />}
              {actionFeedback.type === "warning" && <AlertCircle size={16} className="text-amber-600" />}
              {actionFeedback.type === "danger" && <XCircle size={16} className="text-red-600" />}
              <span>{actionFeedback.message}</span>
            </div>
            <button onClick={() => setActionFeedback(null)} className="text-gray-400 hover:text-gray-600">
              <X size={16} />
            </button>
          </div>
        )}

        {/* Stat Cards */}
        <section
          className="grid animate-fade-up grid-cols-2 divide-y divide-gray-100 rounded-3xl border border-gray-200/70 bg-white shadow-sm sm:grid-cols-4 sm:divide-x sm:divide-y-0"
          style={{ animationDelay: "40ms" }}
        >
          <div className="p-4 sm:p-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-gray-500">
              Total Requests
            </p>
            <p className="mt-1 font-mono text-3xl font-bold tracking-tight text-gray-900">
              {stats.total}
            </p>
            <p className="mt-1 font-mono text-[11px] text-gray-500">All LCRO submissions</p>
          </div>

          <div className="p-4 sm:p-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-emerald-700">
              Approved / Ready
            </p>
            <p className="mt-1 font-mono text-3xl font-bold tracking-tight text-emerald-600">
              {stats.approved}
            </p>
            <p className="mt-1 font-mono text-[11px] text-gray-500">Certified copies issued</p>
          </div>

          <div className="p-4 sm:p-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-amber-700">
              Requires LGU Review
            </p>
            <p className="mt-1 font-mono text-3xl font-bold tracking-tight text-amber-600">
              {stats.reviewNeeded}
            </p>
            <p className="mt-1 font-mono text-[11px] text-amber-700 font-semibold">Flagged for manual check</p>
          </div>

          <div className="p-4 sm:p-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-gray-500">
              In Processing
            </p>
            <p className="mt-1 font-mono text-3xl font-bold tracking-tight text-gray-800">
              {stats.processing}
            </p>
            <p className="mt-1 font-mono text-[11px] text-gray-500">Awaiting clearance</p>
          </div>
        </section>

        {/* Filters & Search */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between animate-fade-up" style={{ animationDelay: "60ms" }}>
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by Request ID, Applicant, Husband, or Wife..."
              className="w-full rounded-2xl border border-zinc-200 bg-white pl-10 pr-4 py-2.5 text-xs font-medium text-gray-900 focus:border-red-600 focus:outline-none focus:ring-1 focus:ring-red-600 shadow-sm"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
            {/* Type selector */}
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="rounded-xl border border-zinc-200 bg-white px-3 py-2 text-xs font-bold text-zinc-700 focus:border-red-600 focus:outline-none"
            >
              <option value="All">All Types</option>
              <option value="Birth">Birth Cert</option>
              <option value="Marriage">Marriage Cert</option>
              <option value="Death">Death Cert</option>
            </select>

            {["All", "Requires LGU Review", "Processing", "Approved", "Rejected"].map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => setStatusFilter(status)}
                className={`rounded-xl px-3 py-2 text-xs font-bold transition whitespace-nowrap ${
                  statusFilter.toLowerCase() === status.toLowerCase()
                    ? "bg-red-700 text-white shadow-sm"
                    : "bg-white border border-zinc-200 text-zinc-600 hover:bg-zinc-50"
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Requests Table */}
        <section
          className="animate-fade-up rounded-3xl border border-gray-200/70 bg-white p-4 sm:p-5 shadow-sm overflow-hidden"
          style={{ animationDelay: "80ms" }}
        >
          <div className="overflow-x-auto">
            <table className="w-full min-w-240 text-left text-xs">
              <thead>
                <tr className="border-b border-gray-200 text-[11px] uppercase tracking-wider text-gray-500">
                  <th className="px-3.5 py-3 font-semibold">Request ID</th>
                  <th className="px-3.5 py-3 font-semibold">Service Type</th>
                  <th className="px-3.5 py-3 font-semibold">Applicant</th>
                  <th className="px-3.5 py-3 font-semibold">Record Subject(s)</th>
                  <th className="px-3.5 py-3 font-semibold">AI Scan</th>
                  <th className="px-3.5 py-3 font-semibold">Registry Match</th>
                  <th className="px-3.5 py-3 font-semibold">Status</th>
                  <th className="px-3.5 py-3 font-semibold">Date Requested</th>
                  <th className="px-3.5 py-3 text-right font-semibold">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredRequests.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-12 text-center text-gray-400">
                      No certificate requests found matching your filter criteria.
                    </td>
                  </tr>
                ) : (
                  filteredRequests.map((req) => {
                    const isMarriage = req.certificateType?.includes("Marriage");
                    const isDeath = req.certificateType?.includes("Death");
                    const subjectTitle = isMarriage
                      ? `${req.marriageRecord?.husbandName} & ${req.marriageRecord?.wifeName}`
                      : isDeath
                      ? req.deathRecord?.deceasedName
                      : req.record?.fullName;
                    const subjectSubtitle = isMarriage
                      ? `Married: ${req.marriageRecord?.dateOfMarriage}`
                      : isDeath
                      ? `Died: ${req.deathRecord?.dateOfDeath}`
                      : `DOB: ${req.record?.dob}`;

                    return (
                      <tr key={req.id} className="transition hover:bg-gray-50/70">
                        <td className="px-3.5 py-4 font-mono font-bold text-red-700">
                          {req.id}
                        </td>
                        <td className="px-3.5 py-4">
                          <span
                            className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-mono text-[10px] font-extrabold ${
                              isMarriage
                                ? "bg-rose-50 text-rose-700"
                                : isDeath
                                ? "bg-zinc-100 text-zinc-700"
                                : "bg-blue-50 text-blue-700"
                            }`}
                          >
                            {isMarriage ? <Heart size={11} /> : isDeath ? <Skull size={11} /> : <FileText size={11} />}
                            {isMarriage ? "Marriage Cert" : isDeath ? "Death Cert" : "Birth Cert"}
                          </span>
                        </td>
                        <td className="px-3.5 py-4">
                          <p className="font-bold text-gray-900">{req.applicant?.fullName}</p>
                          <p className="text-[11px] text-gray-400">{req.applicant?.relationship}</p>
                        </td>
                        <td className="px-3.5 py-4">
                          <p className="font-bold text-gray-800">{subjectTitle}</p>
                          <p className="text-[11px] text-gray-400">{subjectSubtitle}</p>
                        </td>
                        <td className="px-3.5 py-4">
                          {req.aiValidation?.status === "PASSED" ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-700">
                              <CheckCircle2 size={12} /> {req.aiValidation.confidence || "Passed"}
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-[10px] font-bold text-amber-700">
                              <AlertCircle size={12} /> Flagged
                            </span>
                          )}
                        </td>
                        <td className="px-3.5 py-4">
                          {req.recordVerification?.status === "MATCHED" ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700">
                              <Check size={13} /> {req.recordVerification.registryBook?.split(",")[0] || "Found"}
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-600">
                              <AlertCircle size={13} /> Unresolved
                            </span>
                          )}
                        </td>
                        <td className="px-3.5 py-4">
                          <StatusPill status={req.status} />
                        </td>
                        <td className="px-3.5 py-4 font-mono text-[11px] text-gray-500">
                          {req.submittedAt}
                        </td>
                        <td className="px-3.5 py-4 text-right">
                          <button
                            type="button"
                            onClick={() => setSelectedRequest(req)}
                            className="inline-flex items-center gap-1.5 rounded-xl border border-zinc-200 bg-white px-3 py-1.5 text-xs font-bold text-gray-700 shadow-sm transition hover:bg-zinc-50 hover:text-red-700 active:translate-y-px"
                          >
                            <Eye size={14} />
                            Review
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

      {/* Slide-over Review Panel */}
      {selectedRequest && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-zinc-900/50 backdrop-blur-xs transition-opacity"
            onClick={() => setSelectedRequest(null)}
          />

          <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
            <div className="w-screen max-w-xl transform bg-white shadow-2xl transition ease-in-out duration-300">
              <div className="flex h-full flex-col overflow-y-auto">
                {/* Drawer Header */}
                <div className="sticky top-0 z-20 flex items-center justify-between border-b border-zinc-200 bg-white px-6 py-4">
                  <div>
                    <span className="font-mono text-[11px] font-bold text-red-600">
                      Civil Registrar Review Panel
                    </span>
                    <h2 className="font-mono text-base font-extrabold text-gray-900">
                      {selectedRequest.id}
                    </h2>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusPill status={selectedRequest.status} />
                    <button
                      onClick={() => setSelectedRequest(null)}
                      className="rounded-lg p-2 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600"
                    >
                      <X size={18} />
                    </button>
                  </div>
                </div>

                {/* Drawer Body Content */}
                <div className="space-y-6 px-6 py-6 text-xs">
                  {/* Service Type Indicator */}
                  <div className="flex items-center justify-between rounded-2xl bg-zinc-50 p-3.5 border border-zinc-200">
                    <div>
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400">
                        Certificate Requested
                      </span>
                      <p className="font-extrabold text-gray-900 text-sm">
                        {selectedRequest.certificateType}
                      </p>
                    </div>
                    <span className="font-mono text-xs font-bold text-gray-700">
                      ₱{selectedRequest.payment?.amount || 100}.00 (PAID)
                    </span>
                  </div>

                  {/* AI Validation Summary Card */}
                  <div
                    className={`rounded-2xl border p-4 ${
                      selectedRequest.aiValidation?.status === "PASSED"
                        ? "border-emerald-200 bg-emerald-50/50"
                        : "border-amber-200 bg-amber-50/50"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Sparkles
                          size={18}
                          className={
                            selectedRequest.aiValidation?.status === "PASSED"
                              ? "text-emerald-600"
                              : "text-amber-600"
                          }
                        />
                        <span className="font-bold text-gray-900 text-sm">
                          AI Automated Validation Check
                        </span>
                      </div>
                      <span
                        className={`rounded-full px-2.5 py-0.5 font-mono text-[10px] font-extrabold ${
                          selectedRequest.aiValidation?.status === "PASSED"
                            ? "bg-emerald-600 text-white"
                            : "bg-amber-600 text-white"
                        }`}
                      >
                        {selectedRequest.aiValidation?.status} ({selectedRequest.aiValidation?.confidence || "96%"})
                      </span>
                    </div>

                    <div className="mt-3 space-y-1.5 text-xs">
                      {selectedRequest.aiValidation?.checks?.map((check, i) => (
                        <div key={i} className="flex items-start justify-between">
                          <span className="text-gray-600">{check.label}</span>
                          <span
                            className={`font-bold flex items-center gap-1 ${
                              check.passed ? "text-emerald-700" : "text-amber-700"
                            }`}
                          >
                            {check.passed ? <Check size={13} /> : <AlertCircle size={13} />}
                            {check.passed ? "Passed" : "Variance"}
                          </span>
                        </div>
                      ))}
                    </div>

                    <p className="mt-3 border-t border-zinc-200/60 pt-2 font-medium text-[11px] text-gray-700">
                      <span className="font-bold">Recommendation:</span> {selectedRequest.aiValidation?.recommendation}
                    </p>
                  </div>

                  {/* Applicant Details */}
                  <div className="rounded-2xl border border-zinc-200 bg-zinc-50/60 p-4">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400">
                      Applicant / Requester Information
                    </span>
                    <div className="mt-3 grid grid-cols-2 gap-3 text-gray-700">
                      <div>
                        <span className="text-gray-400 block text-[11px]">Full Name</span>
                        <span className="font-bold text-gray-900">{selectedRequest.applicant?.fullName}</span>
                      </div>
                      <div>
                        <span className="text-gray-400 block text-[11px]">Relationship</span>
                        <span className="font-bold text-gray-900">{selectedRequest.applicant?.relationship}</span>
                      </div>
                      <div>
                        <span className="text-gray-400 block text-[11px]">Contact Number</span>
                        <span className="font-medium text-gray-900">{selectedRequest.applicant?.contactNumber}</span>
                      </div>
                      <div>
                        <span className="text-gray-400 block text-[11px]">Email Address</span>
                        <span className="font-medium text-gray-900">{selectedRequest.applicant?.email}</span>
                      </div>
                      <div className="col-span-2">
                        <span className="text-gray-400 block text-[11px]">Address</span>
                        <span className="font-medium text-gray-900">{selectedRequest.applicant?.address}</span>
                      </div>
                    </div>
                  </div>

                  {/* Record Information (Death, Marriage, or Birth) */}
                  {selectedRequest.deathRecord ? (
                    <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-xs">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-zinc-500">
                        Subject Death Record
                      </span>
                      <div className="mt-3 space-y-2 text-gray-700">
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <span className="text-gray-400 block text-[11px]">Deceased Name</span>
                            <span className="font-bold text-gray-900 text-sm">
                              {selectedRequest.deathRecord.deceasedName}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-400 block text-[11px]">Sex</span>
                            <span className="font-bold text-gray-900">
                              {selectedRequest.deathRecord.sex}
                            </span>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3 pt-1 border-t border-zinc-100">
                          <div>
                            <span className="text-gray-400 block text-[11px]">Date of Death</span>
                            <span className="font-bold text-gray-900">
                              {selectedRequest.deathRecord.dateOfDeath}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-400 block text-[11px]">Place of Death</span>
                            <span className="font-medium text-gray-900">
                              {selectedRequest.deathRecord.placeOfDeath}
                            </span>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3 pt-1 border-t border-zinc-100">
                          <div>
                            <span className="text-gray-400 block text-[11px]">Date of Birth</span>
                            <span className="font-medium text-gray-900">
                              {selectedRequest.deathRecord.dateOfBirth}
                            </span>
                          </div>
                          <div className="">
                            <span className="text-gray-400 block text-[11px]">Copies / Purpose</span>
                            <span className="font-medium text-gray-900">
                              {selectedRequest.deathRecord.copies || 1} copy — {selectedRequest.deathRecord.purpose}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : selectedRequest.marriageRecord ? (
                    <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-xs">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-rose-600">
                        Subject Marriage Record
                      </span>
                      <div className="mt-3 space-y-2 text-gray-700">
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <span className="text-gray-400 block text-[11px]">Husband&apos;s Name</span>
                            <span className="font-bold text-gray-900 text-sm">
                              {selectedRequest.marriageRecord.husbandName}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-400 block text-[11px]">Wife&apos;s Name</span>
                            <span className="font-bold text-gray-900 text-sm">
                              {selectedRequest.marriageRecord.wifeName}
                            </span>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3 pt-1 border-t border-zinc-100">
                          <div>
                            <span className="text-gray-400 block text-[11px]">Date of Marriage</span>
                            <span className="font-bold text-gray-900">
                              {selectedRequest.marriageRecord.dateOfMarriage}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-400 block text-[11px]">Place of Marriage</span>
                            <span className="font-medium text-gray-900">
                              {selectedRequest.marriageRecord.placeOfMarriage}
                            </span>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3 pt-1 border-t border-zinc-100">
                          <div>
                            <span className="text-gray-400 block text-[11px]">Copies Requested</span>
                            <span className="font-bold text-gray-900">
                              {selectedRequest.marriageRecord.copies || 1}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-400 block text-[11px]">Purpose</span>
                            <span className="font-medium text-gray-900">
                              {selectedRequest.marriageRecord.purpose}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-xs">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400">
                        Subject Birth Record
                      </span>
                      <div className="mt-3 space-y-2 text-gray-700">
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <span className="text-gray-400 block text-[11px]">Registered Name</span>
                            <span className="font-bold text-gray-900 text-sm">
                              {selectedRequest.record?.fullName}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-400 block text-[11px]">Date of Birth</span>
                            <span className="font-bold text-gray-900">
                              {selectedRequest.record?.dob}
                            </span>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3 pt-1">
                          <div>
                            <span className="text-gray-400 block text-[11px]">Father&apos;s Full Name</span>
                            <span className="font-medium text-gray-900">
                              {selectedRequest.record?.fatherName}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-400 block text-[11px]">Mother&apos;s Maiden Name</span>
                            <span className="font-medium text-gray-900">
                              {selectedRequest.record?.motherMaidenName}
                            </span>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3 pt-1 border-t border-zinc-100">
                          <div>
                            <span className="text-gray-400 block text-[11px]">Place of Birth</span>
                            <span className="font-medium text-gray-900">
                              {selectedRequest.record?.pob}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-400 block text-[11px]">Purpose</span>
                            <span className="font-medium text-gray-900">
                              {selectedRequest.record?.purpose}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Uploaded Government ID Viewer */}
                  <div className="rounded-2xl border border-zinc-200 bg-zinc-50/60 p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400">
                        Uploaded Documents
                      </span>
                      <span className="inline-flex items-center gap-1 font-bold text-emerald-600 text-[11px]">
                        <CheckCircle2 size={13} /> Documents Verified
                      </span>
                    </div>

                    <div className="mt-3 space-y-2">
                      <div className="flex items-center gap-3 rounded-xl border border-zinc-200 bg-white p-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-zinc-100 text-zinc-500 font-bold">
                          ID
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-bold text-gray-900">{selectedRequest.idUpload?.idType || "Government ID"}</p>
                          <p className="font-mono text-[11px] text-gray-400">{selectedRequest.idUpload?.fileName}</p>
                        </div>
                        <span className="rounded-md bg-zinc-100 px-2 py-1 text-[10px] font-bold text-gray-600">
                          Preview
                        </span>
                      </div>

                      {selectedRequest.idUpload?.hasAuthorization && (
                        <div className="flex items-center gap-3 rounded-xl border border-blue-200 bg-blue-50/50 p-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-600 font-bold">
                            AUTH
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="font-bold text-blue-900">Authorization Letter (Signed)</p>
                            <p className="font-mono text-[11px] text-blue-600">authorization_letter.pdf</p>
                          </div>
                          <span className="rounded-md bg-blue-100 px-2 py-1 text-[10px] font-bold text-blue-700">
                            Verified
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Civil Registry Archive Match */}
                  <div className="rounded-2xl border border-zinc-200 bg-white p-4">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400">
                      Civil Registry Record Verification
                    </span>
                    <div className="mt-2 space-y-1 text-gray-700">
                      <p className="font-mono text-[11px] font-bold text-gray-900">
                        {selectedRequest.recordVerification?.registryBook}
                      </p>
                      <p className="text-xs text-gray-600">
                        {selectedRequest.recordVerification?.message}
                      </p>
                    </div>
                  </div>

                  {/* Payment Verification */}
                  <div className="rounded-2xl border border-emerald-100 bg-emerald-50/40 p-4 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase text-emerald-800">
                        Payment Verified
                      </span>
                      <p className="font-mono font-bold text-gray-900">
                        ₱{selectedRequest.payment?.amount || 100}.00 via {selectedRequest.payment?.method}
                      </p>
                      <p className="font-mono text-[10px] text-gray-500">
                        Ref: {selectedRequest.payment?.reference}
                      </p>
                    </div>
                    <span className="rounded-full bg-emerald-600 px-2.5 py-1 text-[10px] font-extrabold text-white">
                      PAID
                    </span>
                  </div>

                  {/* Correction note if any */}
                  {selectedRequest.correctionNote && (
                    <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-amber-900">
                      <span className="font-bold block text-xs">Correction Requested Note:</span>
                      <p className="text-xs mt-1">{selectedRequest.correctionNote}</p>
                    </div>
                  )}
                </div>

                {/* Drawer Footer Actions */}
                <div className="sticky bottom-0 border-t border-zinc-200 bg-white px-6 py-4 space-y-2.5">
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setShowCorrectionModal(true)}
                      className="flex items-center justify-center gap-1.5 rounded-xl border border-amber-300 bg-amber-50 py-2.5 text-xs font-bold text-amber-800 transition hover:bg-amber-100"
                    >
                      <Edit3 size={14} />
                      Correction
                    </button>

                    <button
                      type="button"
                      onClick={() => handleReject(selectedRequest.id)}
                      className="flex items-center justify-center gap-1.5 rounded-xl border border-red-200 bg-red-50 py-2.5 text-xs font-bold text-red-700 transition hover:bg-red-100"
                    >
                      <XCircle size={14} />
                      Reject
                    </button>

                    <button
                      type="button"
                      onClick={() => handleApprove(selectedRequest.id)}
                      className="flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-emerald-700"
                    >
                      <CheckCircle2 size={14} />
                      Approve
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Correction Note Modal */}
      {showCorrectionModal && selectedRequest && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-zinc-900/60" onClick={() => setShowCorrectionModal(false)} />
          <div className="relative w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl text-xs">
            <h3 className="text-sm font-extrabold text-gray-900">
              Request Applicant Correction
            </h3>
            <p className="mt-1 text-gray-500">
              Send a note to <span className="font-bold text-gray-800">{selectedRequest.applicant?.fullName}</span> explaining what needs updating.
            </p>

            <textarea
              rows={4}
              value={correctionNote}
              onChange={(e) => setCorrectionNote(e.target.value)}
              placeholder="e.g. The uploaded government ID image is blurry or expired. Please upload a clear photo or alternative document."
              className="mt-4 w-full rounded-2xl border border-zinc-200 p-3 text-xs focus:border-red-600 focus:outline-none focus:ring-1 focus:ring-red-600"
            />

            <div className="mt-4 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowCorrectionModal(false)}
                className="rounded-xl border border-zinc-200 px-4 py-2 font-bold text-gray-600 hover:bg-zinc-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleRequestCorrection(selectedRequest.id)}
                className="rounded-xl bg-amber-600 px-4 py-2 font-bold text-white shadow-sm hover:bg-amber-700"
              >
                Send Request
              </button>
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
    "Requires LGU Review": "bg-amber-50 text-amber-700 border-amber-200 animate-pulse",
    Processing: "bg-blue-50 text-blue-700 border-blue-200",
    Submitted: "bg-zinc-100 text-zinc-700 border-zinc-200",
    Rejected: "bg-red-50 text-red-700 border-red-200",
    "Correction Requested": "bg-purple-50 text-purple-700 border-purple-200",
  };

  const style = styles[status] || "bg-zinc-100 text-zinc-700 border-zinc-200";

  return (
    <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 font-mono text-[10px] font-bold ${style}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {status}
    </span>
  );
}
