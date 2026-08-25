// src/Offices/CTO/Requests.jsx
import { useState, useEffect } from "react";
import {
  FileText, Search, CheckCircle2, AlertCircle, Clock3, XCircle,
  Eye, X, Sparkles, User, CreditCard, Check, ShieldCheck,
  Printer, RefreshCw, Edit3, Wallet,
} from "lucide-react";
import OfficeLayout from "../OfficeLayout";
import { ctoOffice } from "../officeData";
import { getCTORequests, updateCTORequestStatus } from "../../services/ctoData";

export default function CTORequests() {
  const [requests, setRequests] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [actionFeedback, setActionFeedback] = useState(null);
  const [correctionNote, setCorrectionNote] = useState("");
  const [showCorrectionModal, setShowCorrectionModal] = useState(false);

  const loadData = () => setRequests(getCTORequests());

  useEffect(() => {
    document.title = "CTO Certificate Requests — ACORS";
    loadData();
  }, []);

  function certTypeBadge(type) {
    if (type?.includes("Cedula")) return { label: "Cedula", cls: "bg-blue-50 text-blue-700" };
    if (type?.includes("Tax Payment")) return { label: "Tax Payment", cls: "bg-violet-50 text-violet-700" };
    if (type?.includes("Tax Clearance")) return { label: "Tax Clearance", cls: "bg-emerald-50 text-emerald-700" };
    return { label: type, cls: "bg-zinc-100 text-zinc-700" };
  }

  const filteredRequests = requests.filter((req) => {
    const applicantName = req.applicant?.fullName || "";
    const reqId = req.id || "";
    const taxName = req.taxPaymentRecord?.taxpayerName || req.taxInfo?.taxType || "";

    const matchesSearch =
      reqId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      applicantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      taxName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "All" || req.status.toLowerCase() === statusFilter.toLowerCase();

    const matchesType =
      typeFilter === "All" ||
      (typeFilter === "Cedula" && req.certificateType?.includes("Cedula")) ||
      (typeFilter === "Tax Payment" && req.certificateType?.includes("Tax Payment")) ||
      (typeFilter === "Tax Clearance" && req.certificateType?.includes("Tax Clearance"));

    return matchesSearch && matchesStatus && matchesType;
  });

  const stats = {
    total: requests.length,
    approved: requests.filter((r) => r.status === "Approved").length,
    reviewNeeded: requests.filter((r) => r.status === "Requires LGU Review").length,
    processing: requests.filter((r) => r.status === "Processing" || r.status === "Submitted").length,
  };

  function handleApprove(reqId) {
    const isCedula = selectedRequest?.certificateType?.includes("Cedula");
    const isClearance = selectedRequest?.certificateType?.includes("Tax Clearance");
    const certNo = isCedula
      ? `CTO-CEDULA-2026-${Math.floor(100000 + Math.random() * 900000)}`
      : isClearance
      ? `CTO-TC-2026-${Math.floor(100000 + Math.random() * 900000)}`
      : `CTO-TP-2026-${Math.floor(100000 + Math.random() * 900000)}`;

    const updated = updateCTORequestStatus(reqId, "Approved", {
      certificateNumber: certNo,
      issueDate: new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
    });
    setRequests(updated);
    if (selectedRequest?.id === reqId) setSelectedRequest({ ...selectedRequest, status: "Approved", certificateNumber: certNo });
    setActionFeedback({ type: "success", message: `Request ${reqId} approved & certified.` });
    setTimeout(() => setActionFeedback(null), 4000);
  }

  function handleReject(reqId) {
    const updated = updateCTORequestStatus(reqId, "Rejected", { rejectionReason: "Information mismatch after manual treasury archive review." });
    setRequests(updated);
    if (selectedRequest?.id === reqId) setSelectedRequest({ ...selectedRequest, status: "Rejected" });
    setActionFeedback({ type: "danger", message: `Request ${reqId} rejected.` });
    setTimeout(() => setActionFeedback(null), 4000);
  }

  function handleRequestCorrection(reqId) {
    const updated = updateCTORequestStatus(reqId, "Correction Requested", {
      correctionNote: correctionNote || "Please upload a clearer copy of your government ID or payment receipt.",
    });
    setRequests(updated);
    if (selectedRequest?.id === reqId) setSelectedRequest({ ...selectedRequest, status: "Correction Requested", correctionNote });
    setShowCorrectionModal(false);
    setCorrectionNote("");
    setActionFeedback({ type: "warning", message: `Correction request sent for ${reqId}.` });
    setTimeout(() => setActionFeedback(null), 4000);
  }

  return (
    <OfficeLayout office={ctoOffice} header="Certificate Requests">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between animate-fade-up">
          <div>
            <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.22em] text-gray-500">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-600 opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-red-600" />
              </span>
              City Treasurer's Office · Tax Certificate Verification
            </p>
            <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">Certificate Requests</h1>
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
            { label: "Total Requests", value: stats.total, note: "All CTO submissions", cls: "text-gray-900" },
            { label: "Approved / Ready", value: stats.approved, note: "Certificates issued", cls: "text-emerald-600" },
            { label: "Requires Review", value: stats.reviewNeeded, note: "Flagged requests", cls: "text-amber-600" },
            { label: "In Processing", value: stats.processing, note: "Active queue", cls: "text-gray-800" },
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
            <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search by ID, applicant, tax type…"
              className="w-full rounded-2xl border border-zinc-200 bg-white pl-10 pr-4 py-2.5 text-xs font-medium text-gray-900 focus:border-red-600 focus:outline-none focus:ring-1 focus:ring-red-600 shadow-sm" />
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
            <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}
              className="rounded-xl border border-zinc-200 bg-white px-3 py-2 text-xs font-bold text-zinc-700 focus:border-red-600 focus:outline-none">
              <option value="All">All Types</option>
              <option value="Cedula">Cedula</option>
              <option value="Tax Payment">Tax Payment</option>
              <option value="Tax Clearance">Tax Clearance</option>
            </select>
            {["All", "Requires LGU Review", "Processing", "Approved", "Rejected"].map((status) => (
              <button key={status} onClick={() => setStatusFilter(status)}
                className={`rounded-xl px-3 py-2 text-xs font-bold transition whitespace-nowrap ${statusFilter === status ? "bg-red-700 text-white shadow-sm" : "bg-white border border-zinc-200 text-zinc-600 hover:bg-zinc-50"}`}>
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
                  <th className="px-3.5 py-3 font-semibold">Certificate Type</th>
                  <th className="px-3.5 py-3 font-semibold">Applicant</th>
                  <th className="px-3.5 py-3 font-semibold">AI Scan</th>
                  <th className="px-3.5 py-3 font-semibold">Tax Record</th>
                  <th className="px-3.5 py-3 font-semibold">Status</th>
                  <th className="px-3.5 py-3 font-semibold">Date</th>
                  <th className="px-3.5 py-3 text-right font-semibold">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredRequests.length === 0 ? (
                  <tr><td colSpan={8} className="py-12 text-center text-gray-400">No certificate requests found matching your filter criteria.</td></tr>
                ) : (
                  filteredRequests.map((req) => {
                    const badge = certTypeBadge(req.certificateType);
                    const recStatus = req.recordVerification?.status || req.taxCalculation ? "N/A" : "—";
                    return (
                      <tr key={req.id} className="transition hover:bg-gray-50/70">
                        <td className="px-3.5 py-4 font-mono font-bold text-red-700">{req.id}</td>
                        <td className="px-3.5 py-4">
                          <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-mono text-[10px] font-extrabold ${badge.cls}`}>{badge.label}</span>
                        </td>
                        <td className="px-3.5 py-4">
                          <p className="font-bold text-gray-900">{req.applicant?.fullName}</p>
                          <p className="text-[11px] text-gray-400">{req.applicant?.address?.split(",")[0]}</p>
                        </td>
                        <td className="px-3.5 py-4">
                          {req.aiValidation?.status === "PASSED" ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-700"><CheckCircle2 size={12} /> {req.aiValidation.confidence || "96%"}</span>
                          ) : (
                            <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-[10px] font-bold text-amber-700"><AlertCircle size={12} /> Flagged</span>
                          )}
                        </td>
                        <td className="px-3.5 py-4">
                          {req.recordVerification?.status === "MATCHED" ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700"><Check size={13} /> Matched</span>
                          ) : req.recordVerification?.status === "OUTSTANDING_BALANCE" ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-600"><AlertCircle size={13} /> Outstanding</span>
                          ) : req.taxCalculation ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600"><Check size={13} /> Cedula</span>
                          ) : (
                            <span className="text-[11px] text-gray-400">—</span>
                          )}
                        </td>
                        <td className="px-3.5 py-4"><StatusPill status={req.status} /></td>
                        <td className="px-3.5 py-4 font-mono text-[11px] text-gray-500">{req.submittedAt}</td>
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

      {/* Slide-over Drawer */}
      {selectedRequest && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="fixed inset-0 bg-zinc-900/50 backdrop-blur-xs" onClick={() => setSelectedRequest(null)} />
          <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
            <div className="w-screen max-w-xl bg-white shadow-2xl">
              <div className="flex h-full flex-col overflow-y-auto">
                {/* Drawer Header */}
                <div className="sticky top-0 z-20 flex items-center justify-between border-b border-zinc-200 bg-white px-6 py-4">
                  <div>
                    <span className="font-mono text-[11px] font-bold text-red-600">City Treasurer's Office Review Panel</span>
                    <h2 className="font-mono text-base font-extrabold text-gray-900">{selectedRequest.id}</h2>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusPill status={selectedRequest.status} />
                    <button onClick={() => setSelectedRequest(null)} className="rounded-lg p-2 text-zinc-400 hover:bg-zinc-100"><X size={18} /></button>
                  </div>
                </div>

                {/* Drawer Body */}
                <div className="space-y-6 px-6 py-6 text-xs">
                  {/* Certificate Type */}
                  <div className="flex items-center justify-between rounded-2xl bg-zinc-50 p-3.5 border border-zinc-200">
                    <div>
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400">Certificate Requested</span>
                      <p className="font-extrabold text-gray-900 text-sm">{selectedRequest.certificateType}</p>
                    </div>
                    <span className="font-mono text-xs font-bold text-gray-700">₱{selectedRequest.payment?.amount || 100}.00 (PAID)</span>
                  </div>

                  {/* AI Validation */}
                  <div className={`rounded-2xl border p-4 ${selectedRequest.aiValidation?.status === "PASSED" ? "border-emerald-200 bg-emerald-50/50" : "border-amber-200 bg-amber-50/50"}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Sparkles size={18} className={selectedRequest.aiValidation?.status === "PASSED" ? "text-emerald-600" : "text-amber-600"} />
                        <span className="font-bold text-gray-900 text-sm">AI Automated Validation</span>
                      </div>
                      <span className={`rounded-full px-2.5 py-0.5 font-mono text-[10px] font-extrabold ${selectedRequest.aiValidation?.status === "PASSED" ? "bg-emerald-600 text-white" : "bg-amber-600 text-white"}`}>
                        {selectedRequest.aiValidation?.status} ({selectedRequest.aiValidation?.confidence || "96%"})
                      </span>
                    </div>
                    <div className="mt-3 space-y-1.5">
                      {selectedRequest.aiValidation?.checks?.map((c, i) => (
                        <div key={i} className="flex items-start justify-between">
                          <span className="text-gray-600">{c.label}</span>
                          <span className={`font-bold flex items-center gap-1 ${c.passed ? "text-emerald-700" : "text-amber-700"}`}>
                            {c.passed ? <Check size={13} /> : <AlertCircle size={13} />}{c.passed ? "Passed" : "Variance"}
                          </span>
                        </div>
                      ))}
                    </div>
                    {selectedRequest.aiValidation?.recommendation && (
                      <p className="mt-3 border-t border-zinc-200/60 pt-2 font-medium text-[11px] text-gray-700">
                        <span className="font-bold">Recommendation:</span> {selectedRequest.aiValidation.recommendation}
                      </p>
                    )}
                  </div>

                  {/* Applicant Details */}
                  <div className="rounded-2xl border border-zinc-200 bg-zinc-50/60 p-4">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400">Applicant / Requester Information</span>
                    <div className="mt-3 grid grid-cols-2 gap-3 text-gray-700">
                      <div><span className="text-gray-400 block text-[11px]">Full Name</span><span className="font-bold text-gray-900">{selectedRequest.applicant?.fullName}</span></div>
                      <div><span className="text-gray-400 block text-[11px]">Contact</span><span className="font-medium text-gray-900">{selectedRequest.applicant?.contactNumber}</span></div>
                      <div><span className="text-gray-400 block text-[11px]">Email</span><span className="font-medium text-gray-900">{selectedRequest.applicant?.email}</span></div>
                      {selectedRequest.applicant?.barangay && <div><span className="text-gray-400 block text-[11px]">Barangay</span><span className="font-medium text-gray-900">{selectedRequest.applicant.barangay}</span></div>}
                      <div className="col-span-2"><span className="text-gray-400 block text-[11px]">Address</span><span className="font-medium text-gray-900">{selectedRequest.applicant?.address}</span></div>
                    </div>
                  </div>

                  {/* Tax-specific info */}
                  {selectedRequest.taxCalculation && (
                    <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-xs">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-600">Cedula Tax Details</span>
                      <div className="mt-3 space-y-2 text-gray-700">
                        <div className="flex justify-between text-xs"><span className="text-gray-400">Occupation</span><span className="font-bold">{selectedRequest.applicant?.occupation}</span></div>
                        <div className="flex justify-between text-xs"><span className="text-gray-400">Civil Status</span><span className="font-bold">{selectedRequest.applicant?.civilStatus}</span></div>
                        <div className="flex justify-between text-xs"><span className="text-gray-400">Annual Income</span><span className="font-bold">{selectedRequest.applicant?.annualIncome}</span></div>
                        <div className="flex justify-between text-xs border-t pt-2"><span className="text-gray-400">Basic Community Tax</span><span className="font-bold">{selectedRequest.taxCalculation?.basicCommunityTax}</span></div>
                        <div className="flex justify-between text-xs"><span className="text-gray-400">Additional Community Tax</span><span className="font-bold">{selectedRequest.taxCalculation?.additionalCommunityTax}</span></div>
                        <div className="flex justify-between text-xs font-extrabold"><span>Total Tax</span><span className="text-red-700">{selectedRequest.taxCalculation?.totalAmount}</span></div>
                      </div>
                    </div>
                  )}

                  {selectedRequest.taxPaymentRecord && (
                    <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-xs">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-violet-600">Tax Payment Record</span>
                      <div className="mt-3 grid grid-cols-2 gap-3 text-gray-700">
                        <div><span className="text-gray-400 block text-[11px]">Tax Type</span><span className="font-bold text-gray-900">{selectedRequest.taxPaymentRecord.taxType}</span></div>
                        <div><span className="text-gray-400 block text-[11px]">Tax Year</span><span className="font-bold text-gray-900">{selectedRequest.taxPaymentRecord.taxYear}</span></div>
                        <div><span className="text-gray-400 block text-[11px]">Amount Paid</span><span className="font-bold text-gray-900">₱{parseFloat(selectedRequest.taxPaymentRecord.amountPaid || 0).toLocaleString()}</span></div>
                        <div><span className="text-gray-400 block text-[11px]">Payment Date</span><span className="font-medium text-gray-900">{selectedRequest.taxPaymentRecord.paymentDate}</span></div>
                        <div className="col-span-2"><span className="text-gray-400 block text-[11px]">Reference No.</span><span className="font-medium text-gray-900">{selectedRequest.taxPaymentRecord.receiptNumber}</span></div>
                        <div className="col-span-2"><span className="text-gray-400 block text-[11px]">Purpose</span><span className="font-medium text-gray-900">{selectedRequest.taxPaymentRecord.purpose}</span></div>
                      </div>
                    </div>
                  )}

                  {selectedRequest.taxInfo && (
                    <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-xs">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-600">Tax Clearance Information</span>
                      <div className="mt-3 grid grid-cols-2 gap-3 text-gray-700">
                        <div><span className="text-gray-400 block text-[11px]">Tax Type</span><span className="font-bold text-gray-900">{selectedRequest.taxInfo.taxType}</span></div>
                        <div><span className="text-gray-400 block text-[11px]">Tax Year</span><span className="font-bold text-gray-900">{selectedRequest.taxInfo.taxYear}</span></div>
                        <div><span className="text-gray-400 block text-[11px]">Property Ref</span><span className="font-medium text-gray-900">{selectedRequest.taxInfo.propertyRef}</span></div>
                        <div><span className="text-gray-400 block text-[11px]">Purpose</span><span className="font-medium text-gray-900">{selectedRequest.taxInfo.purpose}</span></div>
                      </div>
                    </div>
                  )}

                  {/* Record Verification */}
                  {selectedRequest.recordVerification && (
                    <div className="rounded-2xl border border-zinc-200 bg-white p-4">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400">Treasury Record Verification</span>
                      <div className="mt-2 space-y-1">
                        <p className={`font-mono text-[11px] font-bold ${selectedRequest.recordVerification.status === "MATCHED" || selectedRequest.recordVerification.status === "CLEAR" ? "text-emerald-700" : "text-amber-700"}`}>
                          {selectedRequest.recordVerification.registryRef || selectedRequest.recordVerification.status}
                        </p>
                        <p className="text-xs text-gray-600">{selectedRequest.recordVerification.message}</p>
                        {selectedRequest.recordVerification.outstandingAmount && (
                          <p className="font-bold text-amber-700">Outstanding: {selectedRequest.recordVerification.outstandingAmount}</p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Uploaded Documents */}
                  <div className="rounded-2xl border border-zinc-200 bg-zinc-50/60 p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400">Uploaded Documents</span>
                      <span className="inline-flex items-center gap-1 font-bold text-emerald-600 text-[11px]"><CheckCircle2 size={13} /> Verified</span>
                    </div>
                    <div className="mt-3 space-y-2">
                      <div className="flex items-center gap-3 rounded-xl border border-zinc-200 bg-white p-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-zinc-100 text-zinc-500 font-bold">ID</div>
                        <div className="min-w-0 flex-1">
                          <p className="font-bold text-gray-900">{selectedRequest.idUpload?.idType || "Government ID"}</p>
                          <p className="font-mono text-[11px] text-gray-400">{selectedRequest.idUpload?.fileName}</p>
                        </div>
                        <span className="rounded-md bg-zinc-100 px-2 py-1 text-[10px] font-bold text-gray-600">Preview</span>
                      </div>
                      {(selectedRequest.idUpload?.hasReceipt || selectedRequest.idUpload?.hasPrevReceipt) && (
                        <div className="flex items-center gap-3 rounded-xl border border-blue-200 bg-blue-50/50 p-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-600 font-bold text-xs">REC</div>
                          <div className="min-w-0 flex-1">
                            <p className="font-bold text-blue-900">Official Receipt / Reference</p>
                            <p className="font-mono text-[11px] text-blue-600">receipt_document.jpg</p>
                          </div>
                          <span className="rounded-md bg-blue-100 px-2 py-1 text-[10px] font-bold text-blue-700">Verified</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Payment */}
                  <div className="rounded-2xl border border-emerald-100 bg-emerald-50/40 p-4 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase text-emerald-800">Payment Verified</span>
                      <p className="font-mono font-bold text-gray-900">₱{selectedRequest.payment?.amount || 100}.00 via {selectedRequest.payment?.method}</p>
                      <p className="font-mono text-[10px] text-gray-500">Ref: {selectedRequest.payment?.reference}</p>
                    </div>
                    <span className="rounded-full bg-emerald-600 px-2.5 py-1 text-[10px] font-extrabold text-white">PAID</span>
                  </div>

                  {selectedRequest.correctionNote && (
                    <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-amber-900">
                      <span className="font-bold block text-xs">Correction Requested Note:</span>
                      <p className="text-xs mt-1">{selectedRequest.correctionNote}</p>
                    </div>
                  )}
                </div>

                {/* Footer Actions */}
                <div className="sticky bottom-0 border-t border-zinc-200 bg-white px-6 py-4 space-y-2.5">
                  <div className="grid grid-cols-3 gap-2">
                    <button onClick={() => setShowCorrectionModal(true)} className="flex items-center justify-center gap-1.5 rounded-xl border border-amber-300 bg-amber-50 py-2.5 text-xs font-bold text-amber-800 transition hover:bg-amber-100">
                      <Edit3 size={14} /> Correction
                    </button>
                    <button onClick={() => handleReject(selectedRequest.id)} className="flex items-center justify-center gap-1.5 rounded-xl border border-red-200 bg-red-50 py-2.5 text-xs font-bold text-red-700 transition hover:bg-red-100">
                      <XCircle size={14} /> Reject
                    </button>
                    <button onClick={() => handleApprove(selectedRequest.id)} className="flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-emerald-700">
                      <CheckCircle2 size={14} /> Approve
                    </button>
                  </div>
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
            <h3 className="text-sm font-extrabold text-gray-900">Request Applicant Correction</h3>
            <p className="mt-1 text-gray-500">Send a note to <span className="font-bold text-gray-800">{selectedRequest.applicant?.fullName}</span> explaining what needs updating.</p>
            <textarea rows={4} value={correctionNote} onChange={(e) => setCorrectionNote(e.target.value)}
              placeholder="e.g. The uploaded receipt image is unclear. Please upload a clearer photo or provide an alternative reference."
              className="mt-4 w-full rounded-2xl border border-zinc-200 p-3 text-xs focus:border-red-600 focus:outline-none focus:ring-1 focus:ring-red-600" />
            <div className="mt-4 flex justify-end gap-2">
              <button onClick={() => setShowCorrectionModal(false)} className="rounded-xl border border-zinc-200 px-4 py-2 font-bold text-gray-600 hover:bg-zinc-50">Cancel</button>
              <button onClick={() => handleRequestCorrection(selectedRequest.id)} className="rounded-xl bg-amber-600 px-4 py-2 font-bold text-white shadow-sm hover:bg-amber-700">Send Request</button>
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
  return (
    <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 font-mono text-[10px] font-bold ${styles[status] || "bg-zinc-100 text-zinc-700 border-zinc-200"}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" />{status}
    </span>
  );
}
