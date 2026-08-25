// src/Citizen/RequestCertificate.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FileText,
  ArrowRight,
  Clock3,
  CheckCircle2,
  AlertCircle,
  X,
  Heart,
  QrCode,
  ShieldCheck,
  Download,
  Eye,
  Search,
  Check,
  Building2,
  Sparkles,
} from "lucide-react";
import CitizenLayout from "../Layouts/CitizenLayouts";
import { certificateOffices } from "../services/certificateData";
import { getLCRORequests } from "../services/lcroData";

export default function RequestCertificate() {
  const [activeTab, setActiveTab] = useState("apply"); // "apply" | "my-requests"
  const [requests, setRequests] = useState([]);
  const [selectedCert, setSelectedCert] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  useEffect(() => {
    document.title = "Certificates & Requests — ACORS";
    setRequests(getLCRORequests());
  }, []);

  const filteredRequests = requests.filter((r) => {
    const term = searchTerm.toLowerCase();
    const id = (r.id || "").toLowerCase();
    const type = (r.certificateType || "").toLowerCase();
    const name = (r.applicant?.fullName || "").toLowerCase();
    const subject = (r.record?.fullName || r.marriageRecord?.husbandName || "").toLowerCase();
    const matchesSearch = id.includes(term) || type.includes(term) || name.includes(term) || subject.includes(term);
    const matchesStatus =
      statusFilter === "All" ||
      (statusFilter === "Approved" && r.status === "Approved") ||
      (statusFilter === "Review" && r.status === "Requires LGU Review") ||
      (statusFilter === "Processing" && (r.status === "Processing" || r.status === "Submitted"));

    return matchesSearch && matchesStatus;
  });

  return (
    <CitizenLayout hideNavigation={Boolean(selectedCert)}>
      <div className="mx-auto max-w-3xl px-4 pb-24 pt-4 sm:px-6 sm:pt-6">
        {/* Header */}
        <header className="animate-fade-up">
          <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-red-600">
            <Building2 size={13} />
            City Government of Malaybalay
          </div>
          <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">
            Civil Registry & Certificates
          </h1>
          <p className="mt-1 text-xs text-gray-500 sm:text-sm">
            Request official civil registry documents and track active applications online.
          </p>
        </header>

        {/* Clean Segmented Tab Control */}
        <div className="mt-5 animate-fade-up" style={{ animationDelay: "30ms" }}>
          <div className="flex rounded-2xl border border-zinc-200/90 bg-zinc-100/90 p-1">
            <button
              type="button"
              onClick={() => setActiveTab("apply")}
              className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-2 text-xs font-extrabold transition-all duration-200 whitespace-nowrap ${
                activeTab === "apply"
                  ? "bg-white text-red-700 shadow-sm"
                  : "text-zinc-600 hover:text-zinc-900"
              }`}
            >
              <FileText size={14} className={activeTab === "apply" ? "text-red-600" : "text-zinc-400"} />
              <span>Browse Services</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab("my-requests");
                setRequests(getLCRORequests());
              }}
              className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-2 text-xs font-extrabold transition-all duration-200 whitespace-nowrap ${
                activeTab === "my-requests"
                  ? "bg-white text-red-700 shadow-sm"
                  : "text-zinc-600 hover:text-zinc-900"
              }`}
            >
              <Clock3 size={14} className={activeTab === "my-requests" ? "text-red-600" : "text-zinc-400"} />
              <span>My Requests</span>
              <span
                className={`rounded-full px-2 py-0.5 font-mono text-[10px] font-extrabold transition ${
                  activeTab === "my-requests"
                    ? "bg-red-100 text-red-700"
                    : "bg-zinc-200 text-zinc-700"
                }`}
              >
                {requests.length}
              </span>
            </button>
          </div>
        </div>

        {/* TAB 1: Browse Services */}
        {activeTab === "apply" && (
          <div className="mt-6 space-y-7 animate-fade-up" style={{ animationDelay: "60ms" }}>
            {certificateOffices.map((office, index) => (
              <DepartmentSection key={office.id} office={office} index={index} />
            ))}
          </div>
        )}

        {/* TAB 2: My Requests */}
        {activeTab === "my-requests" && (
          <div className="mt-5 space-y-4 animate-fade-up" style={{ animationDelay: "60ms" }}>
            {/* Search and Filters */}
            <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by ID, name, or certificate..."
                  className="w-full rounded-2xl border border-zinc-200 bg-white pl-9 pr-3 py-2 text-xs font-medium text-gray-900 placeholder:text-gray-400 focus:border-red-600 focus:outline-none focus:ring-1 focus:ring-red-600 shadow-2xs"
                />
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                {["All", "Approved", "Review", "Processing"].map((status) => (
                  <button
                    key={status}
                    type="button"
                    onClick={() => setStatusFilter(status)}
                    className={`rounded-xl px-3 py-1.5 text-xs font-bold transition whitespace-nowrap ${
                      statusFilter === status
                        ? "bg-red-700 text-white shadow-2xs"
                        : "bg-white border border-zinc-200 text-zinc-600 hover:bg-zinc-50"
                    }`}
                  >
                    {status === "Review" ? "Requires Review" : status}
                  </button>
                ))}
              </div>
            </div>

            {filteredRequests.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-zinc-300 bg-white p-8 text-center shadow-2xs">
                <FileText size={32} className="mx-auto text-zinc-300" />
                <p className="mt-3 text-sm font-bold text-gray-800">No requests found</p>
                <p className="mt-1 text-xs text-gray-500">
                  {searchTerm ? "No applications match your filter." : "You haven't submitted any certificate requests yet."}
                </p>
              </div>
            ) : (
              <div className="grid gap-3">
                {filteredRequests.map((req) => {
                  const isMarriage = req.certificateType.includes("Marriage");
                  const subjectTitle = isMarriage
                    ? `${req.marriageRecord?.husbandName} & ${req.marriageRecord?.wifeName}`
                    : req.record?.fullName;

                  return (
                    <div
                      key={req.id}
                      onClick={() => setSelectedCert(req)}
                      className="group cursor-pointer rounded-2xl border border-zinc-200/90 bg-white p-4 shadow-2xs transition hover:border-red-300 hover:shadow-md"
                    >
                      <div className="flex items-center justify-between">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 font-mono text-[10px] font-extrabold ${
                            isMarriage ? "bg-rose-50 text-rose-700" : "bg-blue-50 text-blue-700"
                          }`}
                        >
                          {isMarriage ? <Heart size={10} /> : <FileText size={10} />}
                          {req.certificateType}
                        </span>
                        <StatusPill status={req.status} />
                      </div>

                      <div className="mt-2.5 flex items-baseline justify-between">
                        <div>
                          <h3 className="font-mono text-sm font-extrabold text-gray-900 group-hover:text-red-700">
                            {req.id}
                          </h3>
                          <p className="mt-0.5 text-xs font-semibold text-gray-700">
                            {subjectTitle}
                          </p>
                        </div>
                        <span className="font-mono text-[10px] text-gray-400">
                          {req.submittedAt}
                        </span>
                      </div>

                      <div className="mt-3 flex items-center justify-between border-t border-zinc-100 pt-2.5 text-[11px]">
                        <span className="font-mono text-gray-500">
                          ₱{req.payment?.amount || 100}.00 · {req.payment?.method || "Paid"}
                        </span>
                        <span className="flex items-center gap-1 font-bold text-red-600 group-hover:translate-x-0.5 transition">
                          View Progress →
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Certificate Tracking Modal */}
      {selectedCert && (
        <div
          onClick={() => setSelectedCert(null)}
          className="fixed inset-0 z-50 flex items-end justify-center bg-zinc-950/60 backdrop-blur-xs animate-fade-in sm:items-center sm:p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg rounded-t-3xl bg-white p-5 shadow-2xl sm:rounded-3xl animate-modal-in text-xs max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
              <div>
                <span className="font-mono text-[10px] font-bold uppercase text-red-600">
                  {selectedCert.certificateType}
                </span>
                <h3 className="font-mono text-base font-extrabold text-gray-900">
                  {selectedCert.id}
                </h3>
              </div>
              <button
                onClick={() => setSelectedCert(null)}
                className="rounded-lg p-1.5 text-gray-400 hover:bg-zinc-100"
              >
                <X size={18} />
              </button>
            </div>

            {/* Applicant & Subject Details */}
            <div className="mt-3.5 rounded-2xl bg-zinc-50 p-3.5 border border-zinc-200">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400 block">
                Application Information
              </span>
              <div className="mt-2 grid grid-cols-2 gap-2 text-gray-700">
                <div>
                  <span className="text-gray-400 block text-[10px]">Applicant</span>
                  <span className="font-bold text-gray-900">{selectedCert.applicant?.fullName}</span>
                </div>
                <div>
                  <span className="text-gray-400 block text-[10px]">Relationship</span>
                  <span className="font-bold text-gray-900">{selectedCert.applicant?.relationship}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-gray-400 block text-[10px]">Record Subject</span>
                  <span className="font-bold text-gray-900">
                    {selectedCert.marriageRecord
                      ? `${selectedCert.marriageRecord.husbandName} & ${selectedCert.marriageRecord.wifeName}`
                      : selectedCert.record?.fullName}
                  </span>
                </div>
              </div>
            </div>

            {/* Status timeline */}
            <div className="mt-4 space-y-2.5">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400 block">
                Status Timeline
              </span>

              <div className="space-y-2.5 pl-2">
                <div className="flex items-center gap-3">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-600 text-white font-bold text-[10px]">
                    ✓
                  </span>
                  <div>
                    <p className="font-bold text-gray-900">Request Submitted</p>
                    <p className="text-[10px] text-gray-500">{selectedCert.submittedAt}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-600 text-white font-bold text-[10px]">
                    ✓
                  </span>
                  <div>
                    <p className="font-bold text-gray-900">AI Validation</p>
                    <p className="text-[10px] text-gray-500">
                      {selectedCert.aiValidation?.status || "PASSED"} ({selectedCert.aiValidation?.confidence || "96%"} Confidence)
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-600 text-white font-bold text-[10px]">
                    ✓
                  </span>
                  <div>
                    <p className="font-bold text-gray-900">Record Verification</p>
                    <p className="text-[10px] text-gray-500">
                      {selectedCert.recordVerification?.message || "Record Found in Local Civil Registry"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-600 text-white font-bold text-[10px]">
                    ✓
                  </span>
                  <div>
                    <p className="font-bold text-gray-900">Payment Confirmed</p>
                    <p className="text-[10px] text-gray-500">
                      ₱{selectedCert.payment?.amount || 100}.00 via {selectedCert.payment?.method || "GCash"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-600 text-white font-bold text-[10px]">
                    ✓
                  </span>
                  <div>
                    <p className="font-bold text-gray-900">Certificate Processing</p>
                    <p className="text-[10px] text-gray-500">
                      {selectedCert.status === "Approved" ? "Completed & Digitally Sealed" : "In Progress at LCRO"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold ${
                    selectedCert.status === "Approved" ? "bg-emerald-600 text-white" : "border border-zinc-300 text-zinc-300"
                  }`}>
                    {selectedCert.status === "Approved" ? "✓" : "○"}
                  </span>
                  <div>
                    <p className="font-bold text-gray-900">Certificate Ready</p>
                    <p className="text-[10px] text-gray-500">
                      {selectedCert.certificateNumber ? `Cert No: ${selectedCert.certificateNumber}` : "Pending final approval"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setSelectedCert(null)}
              className="mt-5 w-full rounded-2xl bg-zinc-900 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-zinc-800"
            >
              Close Details
            </button>
          </div>
        </div>
      )}
    </CitizenLayout>
  );
}

function DepartmentSection({ office, index }) {
  const Icon = office.icon;

  return (
    <section className="animate-fade-up" style={{ animationDelay: `${index * 50}ms` }}>
      <div className="flex items-center gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-red-600 text-white shadow-2xs">
          <Icon size={16} />
        </span>
        <div>
          <h2 className="text-sm font-extrabold leading-snug text-gray-900">
            {office.name}
          </h2>
          <p className="text-[11px] font-medium text-gray-400">
            {office.certificates.length} available certificates
          </p>
        </div>
      </div>

      <div className="mt-3 grid gap-2.5 sm:grid-cols-2">
        {office.certificates.map((cert) => (
          <Link
            key={cert.id}
            to={`/request-certificate/${office.id}/${cert.id}`}
            className="group flex items-center gap-3 rounded-2xl border border-zinc-200/90 bg-white p-3.5 text-left shadow-2xs transition duration-200 hover:-translate-y-0.5 hover:border-red-200 hover:shadow-md"
          >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-zinc-100 text-zinc-500 transition group-hover:bg-red-50 group-hover:text-red-600">
              <FileText size={15} />
            </span>

            <span className="min-w-0 flex-1">
              <span className="block text-xs font-bold leading-snug text-gray-800 group-hover:text-red-700">
                {cert.name}
              </span>
              <span className="mt-0.5 block text-[10px] font-medium text-gray-400">
                Apply online
              </span>
            </span>

            <ArrowRight
              size={14}
              className="shrink-0 text-zinc-300 transition group-hover:translate-x-0.5 group-hover:text-red-600"
            />
          </Link>
        ))}
      </div>
    </section>
  );
}

function StatusPill({ status }) {
  const styles = {
    Approved: "bg-emerald-50 text-emerald-700 border-emerald-200",
    "Requires LGU Review": "bg-amber-50 text-amber-700 border-amber-200",
    Processing: "bg-blue-50 text-blue-700 border-blue-200",
    Submitted: "bg-zinc-100 text-zinc-700 border-zinc-200",
    Rejected: "bg-red-50 text-red-700 border-red-200",
  };

  const style = styles[status] || "bg-zinc-100 text-zinc-700 border-zinc-200";

  return (
    <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 font-mono text-[9px] font-bold ${style}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {status}
    </span>
  );
}