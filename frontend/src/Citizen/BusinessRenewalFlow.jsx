// src/Citizen/BusinessRenewalFlow.jsx
import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  FileText,
  Upload,
  ShieldCheck,
  QrCode,
  Download,
  Eye,
  RefreshCw,
  Sparkles,
  Check,
  User,
  X,
  Info,
  Briefcase,
  Building2,
  CreditCard,
  Wallet,
} from "lucide-react";
import { saveBPLORequest, findMockBusinessRecord } from "../services/bploData";

const STEPS = [
  "Start Application",
  "Owner Info",
  "Business Info",
  "Upload Requirements",
  "AI Validation",
  "Record Verification",
  "Request Summary",
  "Payment",
  "Tracking",
  "Permit Ready",
];

const BUSINESS_TYPES = [
  "Sole Proprietorship",
  "Partnership",
  "Corporation",
  "Cooperative",
  "Other",
];

const NATURE_CATEGORIES = [
  "Retail",
  "Food and Restaurant",
  "Services",
  "Manufacturing",
  "Construction",
  "Transportation",
  "Technology",
  "Agriculture",
  "Other",
];

export default function BusinessRenewalFlow({ office, cert }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [testMode, setTestMode] = useState("normal"); // "normal" | "unmatched"

  const [owner, setOwner] = useState({
    fullName: "Juan Dela Cruz",
    ownerType: "Individual / Sole Owner",
    address: "Purok 2, Fortich Street, Poblacion, Malaybalay City",
    barangay: "Poblacion",
    contactNumber: "0917-889-2233",
    email: "juan.delacruz@gmail.com",
  });

  const [business, setBusiness] = useState({
    businessName: "Juan's Coffee Shop",
    businessAddress: "Purok 2, Fortich Street, Poblacion, Malaybalay City",
    barangay: "Poblacion",
    businessType: "Sole Proprietorship",
    nature: "Food and Restaurant",
    registrationNumber: "DTI-2023-098812",
    existingPermitNumber: "BP-2025-00123",
    previousPermitYear: "2025",
    numberOfEmployees: "6",
    contactNumber: "0917-889-2233",
  });

  const [idFile, setIdFile] = useState({ name: "driver_license_delacruz.jpg", type: "image/jpeg", size: "1.2 MB", uploaded: true });
  const [prevPermitFile, setPrevPermitFile] = useState({ name: "business_permit_2025.pdf", type: "application/pdf", size: "1.8 MB", uploaded: true });
  const [regDocFile, setRegDocFile] = useState({ name: "dti_registration_juancoffee.pdf", type: "application/pdf", size: "2.1 MB", uploaded: true });
  const [brgyClearanceFile, setBrgyClearanceFile] = useState({ name: "brgy_clearance_poblacion.jpg", type: "image/jpeg", size: "0.9 MB", uploaded: true });
  const [otherDocFile, setOtherDocFile] = useState({ name: "", uploaded: false });

  const [aiScanning, setAiScanning] = useState(false);
  const [aiProgress, setAiProgress] = useState(0);
  const [aiChecks, setAiChecks] = useState([]);

  const [matchedRecord, setMatchedRecord] = useState(null);
  const [isVerifying, setIsVerifying] = useState(false);

  const [paymentMethod, setPaymentMethod] = useState("GCash");
  const [isPaying, setIsPaying] = useState(false);
  const [paymentDone, setPaymentDone] = useState(false);
  const [payRef, setPayRef] = useState("");

  const [generatedReqId, setGeneratedReqId] = useState("");
  const [issuedPermitNo, setIssuedPermitNo] = useState("");
  const [submittedTime, setSubmittedTime] = useState("");

  const [showQRModal, setShowQRModal] = useState(false);
  const [notificationToast, setNotificationToast] = useState(null);

  const aiChecksDef = [
    { label: "Required fields completed", passed: true },
    { label: "Valid ID uploaded", passed: true },
    { label: "Previous permit uploaded", passed: true },
    { label: "Business registration document uploaded", passed: true },
    { label: "Document readability", passed: true },
    { label: "Business name consistency", passed: testMode === "normal" },
    { label: "Business owner consistency", passed: testMode === "normal" },
    { label: "Business permit number consistency", passed: testMode === "normal" },
    { label: "Possible duplicate application", passed: true },
  ];

  const aiStatus = testMode === "normal" ? "READY FOR VERIFICATION" : "REQUIRES BPLO REVIEW";

  function runAIValidation() {
    setAiScanning(true);
    setAiProgress(0);
    setAiChecks([]);

    let i = 0;
    const interval = setInterval(() => {
      i += 1;
      setAiProgress(Math.round((i / aiChecksDef.length) * 100));
      setAiChecks((prev) => [...prev, aiChecksDef[i - 1]]);
      if (i >= aiChecksDef.length) {
        clearInterval(interval);
        setAiScanning(false);
      }
    }, 300);
  }

  function runRecordVerification() {
    setIsVerifying(true);
    setTimeout(() => {
      const found = testMode === "normal"
        ? findMockBusinessRecord({ businessName: business.businessName, permitNumber: business.existingPermitNumber, owner: owner.fullName })
        : null;
      setMatchedRecord(found || false);
      setIsVerifying(false);
    }, 1800);
  }

  function handleProcessPayment() {
    setIsPaying(true);
    setTimeout(() => {
      const ref = "ACORS-PAY-20260825-004";
      setPayRef(ref);
      setPaymentDone(true);
      setIsPaying(false);
    }, 1500);
  }

  function handleSubmit() {
    const reqId = `ACORS-BPLO-2026-${String(Math.floor(10000 + Math.random() * 90000)).padStart(6, "0")}`;
    const permitNo = `BP-2026-${Math.floor(10000 + Math.random() * 90000)}-R`;
    const now = new Date().toLocaleString("en-US", {
      month: "long", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit",
    });
    setGeneratedReqId(reqId);
    setIssuedPermitNo(permitNo);
    setSubmittedTime(now);

    saveBPLORequest({
      id: reqId,
      certificateType: "Business Permit Renewal",
      submittedAt: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      status: "Ready for BPLO Verification",
      owner: { ...owner },
      business: { ...business },
      aiValidation: {
        status: aiStatus,
        confidence: "96%",
        checks: aiChecksDef,
        recommendation: "Application complete and consistent. Matched with active BPLO business permit records.",
      },
      businessRecordCheck: matchedRecord
        ? { status: "MATCHED", permitNumber: matchedRecord.permitNumber, message: "Business Record Found & Matched (Active Status)." }
        : { status: "UNMATCHED", message: "Record not automatically matched. Forwarded to licensing officer." },
      payment: {
        status: "Paid",
        referenceNumber: payRef || "ACORS-PAY-20260825-004",
        amount: "₱2,450.00",
        method: paymentMethod,
        date: new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
      },
      verificationStatus: "Pending Licensing Officer Review",
      certificateNumber: permitNo,
      issueDate: new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
      validUntil: "December 31, 2026",
      documents: [
        { name: "Valid Government ID", fileName: idFile.name, verified: idFile.uploaded },
        { name: "Previous Business Permit", fileName: prevPermitFile.name, verified: prevPermitFile.uploaded },
        { name: "Business Registration Document", fileName: regDocFile.name, verified: regDocFile.uploaded },
        { name: "Barangay Business Clearance", fileName: brgyClearanceFile.name, verified: brgyClearanceFile.uploaded },
      ],
    });

    next();
  }

  const next = () => setCurrentStep((s) => Math.min(s + 1, STEPS.length));
  const back = () => setCurrentStep((s) => Math.max(s - 1, 1));

  // ─── Step Renders ──────────────────────────────────────────────────────────

  function StepStart() {
    return (
      <div className="space-y-5 animate-fade-up">
        <div className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm sm:p-6">
          <h2 className="text-base font-extrabold text-gray-900 sm:text-lg">
            Business Permit Renewal Guidelines
          </h2>
          <p className="mt-1.5 text-xs leading-relaxed text-gray-500 sm:text-sm">
            Renew your Mayor's Business Permit online through the Business Permits and Licensing Office (BPLO) of Malaybalay City.
          </p>

          <div className="mt-5 grid grid-cols-2 gap-3 text-xs">
            <div className="rounded-2xl border border-zinc-100 bg-zinc-50/80 p-3.5">
              <span className="font-bold text-gray-800">Processing Time</span>
              <p className="mt-1 font-mono text-base font-extrabold text-gray-900">1–2 Days</p>
              <p className="text-[11px] text-gray-400">Expedited digital verification</p>
            </div>
            <div className="rounded-2xl border border-zinc-100 bg-zinc-50/80 p-3.5">
              <span className="font-bold text-gray-800">Validity</span>
              <p className="mt-1 font-mono text-base font-extrabold text-emerald-600">1 Year</p>
              <p className="text-[11px] text-gray-400">Valid until Dec 31, 2026</p>
            </div>
          </div>

          <div className="mt-5 rounded-2xl bg-zinc-50 p-4">
            <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-gray-500 mb-3">Required Documents</p>
            {[
              "Valid Government ID of Owner / Representative",
              "Previous Business Permit (2025)",
              "DTI / SEC / CDA Registration Document",
              "Barangay Business Clearance (Current Year)",
            ].map((r) => (
              <div key={r} className="flex items-center gap-2 text-xs text-gray-700 mb-2">
                <Check size={14} className="text-emerald-600 shrink-0" />
                <span>{r}</span>
              </div>
            ))}
          </div>

          <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-3.5 text-xs text-amber-800 flex items-start gap-2">
            <Info size={16} className="mt-0.5 shrink-0" />
            <span>
              IMPORTANT: The AI does not automatically approve the permit. AI verifies document completeness and consistency. Final approval remains with BPLO personnel.
            </span>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-2.5">
            <span className="text-xs font-bold text-gray-500">Test Mode:</span>
            {[
              { key: "normal", label: "Record Matched (Pass)" },
              { key: "unmatched", label: "Record Not Found (Review)" },
            ].map((m) => (
              <button
                key={m.key}
                type="button"
                onClick={() => setTestMode(m.key)}
                className={`rounded-xl px-3.5 py-2 text-xs font-bold transition active:scale-95 ${testMode === m.key ? "bg-red-600 text-white shadow-sm" : "border border-zinc-200 bg-white text-gray-600 hover:bg-zinc-50"}`}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={next}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-red-600 py-3.5 text-sm font-bold text-white shadow-sm transition hover:bg-red-700 active:scale-[0.98]"
        >
          Start Application <ArrowRight size={16} />
        </button>
      </div>
    );
  }

  function StepOwnerInfo() {
    return (
      <div className="space-y-5 animate-fade-up">
        <div className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex items-center gap-2.5 mb-5">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-red-50 text-red-600 font-bold text-xs">1</span>
            <div>
              <h2 className="text-sm font-extrabold text-gray-900 sm:text-base">Business Owner Information</h2>
              <p className="text-xs text-gray-400">Applicant identity and contact details</p>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {[
              { key: "fullName", label: "Full Name", type: "text" },
              { key: "ownerType", label: "Owner Type", type: "select", options: ["Individual / Sole Owner", "Managing Partner", "Corporate Representative", "Cooperative Manager"] },
              { key: "contactNumber", label: "Contact Number", type: "tel" },
              { key: "email", label: "Email Address", type: "email" },
              { key: "barangay", label: "Barangay", type: "select", options: ["Poblacion", "Casisang", "Sumpong", "Kalasungay", "Bangcud", "Aglayan", "Other"] },
              { key: "address", label: "Complete Address", type: "text", span: true },
            ].map((f) => (
              <div key={f.key} className={f.span ? "sm:col-span-2" : ""}>
                <label className="mb-1.5 block text-xs font-bold text-gray-700">{f.label}</label>
                {f.type === "select" ? (
                  <select
                    value={owner[f.key]}
                    onChange={(e) => setOwner((p) => ({ ...p, [f.key]: e.target.value }))}
                    className="w-full rounded-xl border border-zinc-200 bg-zinc-50/50 px-3.5 py-2.5 text-xs text-gray-900 focus:border-red-600 focus:bg-white focus:outline-none focus:ring-1 focus:ring-red-600"
                  >
                    {f.options.map((o) => <option key={o}>{o}</option>)}
                  </select>
                ) : (
                  <input
                    type={f.type}
                    value={owner[f.key]}
                    onChange={(e) => setOwner((p) => ({ ...p, [f.key]: e.target.value }))}
                    className="w-full rounded-xl border border-zinc-200 bg-zinc-50/50 px-3.5 py-2.5 text-xs text-gray-900 focus:border-red-600 focus:bg-white focus:outline-none focus:ring-1 focus:ring-red-600"
                  />
                )}
              </div>
            ))}
          </div>
        </div>
        <NavButtons onBack={back} onNext={next} />
      </div>
    );
  }

  function StepBusinessInfo() {
    return (
      <div className="space-y-5 animate-fade-up">
        <div className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex items-center gap-2.5 mb-5">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-red-50 text-red-600 font-bold text-xs">2</span>
            <div>
              <h2 className="text-sm font-extrabold text-gray-900 sm:text-base">Business Details</h2>
              <p className="text-xs text-gray-400">Permit renewal specifications</p>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-xs font-bold text-gray-700">Business Name / Trade Name</label>
              <input
                type="text"
                value={business.businessName}
                onChange={(e) => setBusiness((p) => ({ ...p, businessName: e.target.value }))}
                className="w-full rounded-xl border border-zinc-200 bg-zinc-50/50 px-3.5 py-2.5 text-xs text-gray-900 focus:border-red-600 focus:bg-white focus:outline-none focus:ring-1 focus:ring-red-600"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-bold text-gray-700">Business Type</label>
              <select
                value={business.businessType}
                onChange={(e) => setBusiness((p) => ({ ...p, businessType: e.target.value }))}
                className="w-full rounded-xl border border-zinc-200 bg-zinc-50/50 px-3.5 py-2.5 text-xs text-gray-900 focus:border-red-600 focus:bg-white focus:outline-none focus:ring-1 focus:ring-red-600"
              >
                {BUSINESS_TYPES.map((t) => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-bold text-gray-700">Nature of Business</label>
              <select
                value={business.nature}
                onChange={(e) => setBusiness((p) => ({ ...p, nature: e.target.value }))}
                className="w-full rounded-xl border border-zinc-200 bg-zinc-50/50 px-3.5 py-2.5 text-xs text-gray-900 focus:border-red-600 focus:bg-white focus:outline-none focus:ring-1 focus:ring-red-600"
              >
                {NATURE_CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-bold text-gray-700">Business Registration No. (DTI/SEC/CDA)</label>
              <input
                type="text"
                value={business.registrationNumber}
                onChange={(e) => setBusiness((p) => ({ ...p, registrationNumber: e.target.value }))}
                placeholder="e.g. DTI-2023-098812"
                className="w-full rounded-xl border border-zinc-200 bg-zinc-50/50 px-3.5 py-2.5 text-xs text-gray-900 focus:border-red-600 focus:bg-white focus:outline-none focus:ring-1 focus:ring-red-600"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-bold text-gray-700">Existing Business Permit No.</label>
              <input
                type="text"
                value={business.existingPermitNumber}
                onChange={(e) => setBusiness((p) => ({ ...p, existingPermitNumber: e.target.value }))}
                placeholder="e.g. BP-2025-00123"
                className="w-full rounded-xl border border-zinc-200 bg-zinc-50/50 px-3.5 py-2.5 text-xs text-gray-900 focus:border-red-600 focus:bg-white focus:outline-none focus:ring-1 focus:ring-red-600"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-bold text-gray-700">Previous Permit Year</label>
              <input
                type="text"
                value={business.previousPermitYear}
                onChange={(e) => setBusiness((p) => ({ ...p, previousPermitYear: e.target.value }))}
                className="w-full rounded-xl border border-zinc-200 bg-zinc-50/50 px-3.5 py-2.5 text-xs text-gray-900 focus:border-red-600 focus:bg-white focus:outline-none focus:ring-1 focus:ring-red-600"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-bold text-gray-700">Number of Employees</label>
              <input
                type="number"
                value={business.numberOfEmployees}
                onChange={(e) => setBusiness((p) => ({ ...p, numberOfEmployees: e.target.value }))}
                className="w-full rounded-xl border border-zinc-200 bg-zinc-50/50 px-3.5 py-2.5 text-xs text-gray-900 focus:border-red-600 focus:bg-white focus:outline-none focus:ring-1 focus:ring-red-600"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-xs font-bold text-gray-700">Business Address</label>
              <input
                type="text"
                value={business.businessAddress}
                onChange={(e) => setBusiness((p) => ({ ...p, businessAddress: e.target.value }))}
                className="w-full rounded-xl border border-zinc-200 bg-zinc-50/50 px-3.5 py-2.5 text-xs text-gray-900 focus:border-red-600 focus:bg-white focus:outline-none focus:ring-1 focus:ring-red-600"
              />
            </div>
          </div>
        </div>
        <NavButtons onBack={back} onNext={next} />
      </div>
    );
  }

  function StepUploadRequirements() {
    return (
      <div className="space-y-5 animate-fade-up">
        <div className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex items-center gap-2.5 mb-5">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-red-50 text-red-600 font-bold text-xs">3</span>
            <div>
              <h2 className="text-sm font-extrabold text-gray-900 sm:text-base">Upload Document Requirements</h2>
              <p className="text-xs text-gray-400">Attachments for renewal clearance</p>
            </div>
          </div>
          <div className="space-y-3">
            <UploadBox label="Valid Government ID of Owner / Signatory" file={idFile} onUpload={() => setIdFile({ name: "driver_license_delacruz.jpg", type: "image/jpeg", size: "1.2 MB", uploaded: true })} onRemove={() => setIdFile({ name: "", uploaded: false })} required />
            <UploadBox label="Previous Business Permit (2025)" file={prevPermitFile} onUpload={() => setPrevPermitFile({ name: "business_permit_2025.pdf", type: "application/pdf", size: "1.8 MB", uploaded: true })} onRemove={() => setPrevPermitFile({ name: "", uploaded: false })} required />
            <UploadBox label="Business Registration Document (DTI / SEC / CDA)" file={regDocFile} onUpload={() => setRegDocFile({ name: "dti_registration_juancoffee.pdf", type: "application/pdf", size: "2.1 MB", uploaded: true })} onRemove={() => setRegDocFile({ name: "", uploaded: false })} required />
            <UploadBox label="Barangay Business Clearance (Current Year)" file={brgyClearanceFile} onUpload={() => setBrgyClearanceFile({ name: "brgy_clearance_poblacion.jpg", type: "image/jpeg", size: "0.9 MB", uploaded: true })} onRemove={() => setBrgyClearanceFile({ name: "", uploaded: false })} required />
            <UploadBox label="Other Supporting Documents (Optional)" file={otherDocFile} onUpload={() => setOtherDocFile({ name: "sanitary_clearance.pdf", type: "application/pdf", size: "0.8 MB", uploaded: true })} onRemove={() => setOtherDocFile({ name: "", uploaded: false })} />
          </div>
        </div>
        <NavButtons onBack={back} onNext={next} disabled={!idFile.uploaded || !prevPermitFile.uploaded || !regDocFile.uploaded || !brgyClearanceFile.uploaded} />
      </div>
    );
  }

  function StepAIValidation() {
    const ready = aiChecks.length === aiChecksDef.length && !aiScanning;
    return (
      <div className="space-y-5 animate-fade-up">
        <div className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex items-center gap-2.5 mb-5">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-red-50 text-red-600 font-bold text-xs">4</span>
            <div>
              <h2 className="text-sm font-extrabold text-gray-900 sm:text-base">AI Document Validation</h2>
              <p className="text-xs text-gray-400">Completeness & business registry consistency</p>
            </div>
          </div>

          {aiChecks.length === 0 && !aiScanning ? (
            <div className="flex flex-col items-center gap-3 py-8 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-600">
                <Sparkles size={28} />
              </div>
              <p className="text-sm font-bold text-gray-800">Ready to validate renewal documents</p>
              <p className="max-w-xs text-xs text-gray-500">AI will scan for required clearances, cross-check business permit numbers, and verify document legibility.</p>
              <button
                type="button"
                onClick={runAIValidation}
                className="mt-2 flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-red-600 px-6 py-3 text-xs font-bold text-white shadow-sm hover:bg-red-700 active:scale-95"
              >
                <Sparkles size={14} /> Run Document Validation
              </button>
            </div>
          ) : (
            <>
              {aiScanning && (
                <div className="mb-4">
                  <div className="flex justify-between text-xs font-bold mb-1.5"><span>Scanning Documents…</span><span>{aiProgress}%</span></div>
                  <div className="h-2 rounded-full bg-zinc-100 overflow-hidden"><div className="h-full rounded-full bg-red-600 transition-all duration-300" style={{ width: `${aiProgress}%` }} /></div>
                </div>
              )}
              <div className="space-y-2">
                {aiChecks.map((c, i) => (
                  <div key={i} className="flex items-center justify-between rounded-xl border border-zinc-100 bg-zinc-50/60 px-3.5 py-2 text-xs">
                    <span className="text-gray-700">{c.label}</span>
                    <span className={`flex items-center gap-1 font-bold ${c.passed ? "text-emerald-700" : "text-amber-700"}`}>
                      {c.passed ? <Check size={13} /> : <AlertCircle size={13} />}
                      {c.passed ? "Passed" : "Variance"}
                    </span>
                  </div>
                ))}
              </div>
              {ready && (
                <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-xs sm:text-sm text-gray-900">AI Recommendation</span>
                    <span className="rounded-full bg-emerald-600 px-2.5 py-0.5 text-[10px] font-extrabold text-white">
                      READY FOR VERIFICATION
                    </span>
                  </div>
                  <p className="mt-1.5 text-xs text-gray-600">AI Confidence: <span className="font-bold">96%</span></p>
                  <p className="mt-2 text-[11px] text-gray-500 italic border-t border-zinc-200/60 pt-2">
                    IMPORTANT: The AI does not approve the business permit. Final verification remains with BPLO personnel.
                  </p>
                </div>
              )}
            </>
          )}
        </div>
        <NavButtons onBack={back} onNext={next} disabled={!ready} />
      </div>
    );
  }

  function StepRecordVerification() {
    return (
      <div className="space-y-5 animate-fade-up">
        <div className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex items-center gap-2.5 mb-5">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-red-50 text-red-600 font-bold text-xs">5</span>
            <div>
              <h2 className="text-sm font-extrabold text-gray-900 sm:text-base">Mock Business Record Verification</h2>
              <p className="text-xs text-gray-400">Match against BPLO active business registry</p>
            </div>
          </div>

          <div className="rounded-2xl border border-zinc-100 bg-zinc-50 p-4 text-xs mb-5 space-y-2">
            <p className="font-extrabold text-gray-700 uppercase tracking-wider text-[10px] mb-2">Submitted Information</p>
            <SummaryRow label="Business Name" value={business.businessName} />
            <SummaryRow label="Permit Number" value={business.existingPermitNumber} />
            <SummaryRow label="Owner Name" value={owner.fullName} />
            <SummaryRow label="Nature" value={business.nature} />
          </div>

          {matchedRecord === null && !isVerifying && (
            <button
              type="button"
              onClick={runRecordVerification}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-red-600 py-3.5 text-xs sm:text-sm font-bold text-white shadow-sm hover:bg-red-700 active:scale-[0.98]"
            >
              <ShieldCheck size={16} /> Verify Against BPLO Records
            </button>
          )}

          {isVerifying && (
            <div className="flex flex-col items-center gap-3 py-6 text-center">
              <RefreshCw size={24} className="animate-spin text-red-600" />
              <p className="text-xs sm:text-sm font-bold text-gray-700">Searching BPLO business records…</p>
            </div>
          )}

          {!isVerifying && matchedRecord && typeof matchedRecord === "object" && (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 space-y-2 text-xs">
              <div className="flex items-center gap-2 font-extrabold text-emerald-800 mb-3">
                <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
                <span>Business Record Found &amp; Permit Matched</span>
              </div>
              <SummaryRow label="Registered Name" value={matchedRecord.businessName} />
              <SummaryRow label="Owner" value={matchedRecord.owner} />
              <SummaryRow label="Permit No." value={matchedRecord.permitNumber} />
              <SummaryRow label="Nature" value={matchedRecord.nature} />
              <SummaryRow label="Status" value={matchedRecord.status} />
            </div>
          )}

          {!isVerifying && matchedRecord === false && (
            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-xs">
              <div className="flex items-center gap-2 font-extrabold text-amber-800 mb-2">
                <AlertCircle size={18} className="text-amber-600 shrink-0" />
                <span>Business Record Not Found</span>
              </div>
              <p className="text-amber-700">Record not found in the active automated registry. Forwarding application to BPLO licensing officer for manual archive lookup.</p>
            </div>
          )}
        </div>
        <NavButtons onBack={back} onNext={next} disabled={isVerifying || matchedRecord === null} />
      </div>
    );
  }

  function StepSummary() {
    return (
      <div className="space-y-5 animate-fade-up">
        <div className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm sm:p-6 space-y-3">
          <div className="flex items-center gap-2.5 mb-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-red-50 text-red-600 font-bold text-xs">6</span>
            <h2 className="text-sm font-extrabold text-gray-900 sm:text-base">Request Summary</h2>
          </div>

          <SummaryRow label="Service" value="Business Permit Renewal (2026)" />
          <SummaryRow label="Owner Name" value={owner.fullName} />
          <SummaryRow label="Business Name" value={business.businessName} />
          <SummaryRow label="Business Address" value={business.businessAddress} />
          <SummaryRow label="Business Type" value={business.businessType} />
          <SummaryRow label="Nature of Business" value={business.nature} />
          <SummaryRow label="Existing Permit No." value={business.existingPermitNumber} />
          <div className="border-t border-zinc-100 pt-2">
            <SummaryRow label="Mayor's Permit Fee" value="₱1,800.00" />
            <SummaryRow label="Sanitary Inspection Fee" value="₱350.00" />
            <SummaryRow label="Garbage & Environmental Fee" value="₱300.00" />
            <div className="flex justify-between items-center py-2 border-t border-zinc-100 font-bold text-sm">
              <span className="text-gray-900">Total Renewal Fee (Prototype)</span>
              <span className="font-mono text-emerald-700">₱2,450.00</span>
            </div>
          </div>
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-3.5 py-2.5 text-xs font-bold text-emerald-800">
            Record Verification: Matched (Active Status)
          </div>
        </div>
        <NavButtons onBack={back} onNext={next} nextLabel="Proceed to Prototype Payment" />
      </div>
    );
  }

  function StepPayment() {
    return (
      <div className="space-y-5 animate-fade-up">
        <div className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex items-center gap-2.5 mb-5">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-red-50 text-red-600 font-bold text-xs">7</span>
            <div>
              <h2 className="text-sm font-extrabold text-gray-900 sm:text-base">Prototype Payment</h2>
              <p className="text-xs text-gray-400">Simulated payment gateway (fictional)</p>
            </div>
          </div>

          <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-4 text-center mb-5">
            <span className="text-xs text-gray-500 uppercase tracking-wider font-bold">Total Assessment Amount</span>
            <p className="font-mono text-2xl sm:text-3xl font-extrabold text-emerald-700 mt-1">₱2,450.00</p>
            <p className="text-[11px] text-gray-400 mt-0.5">Prototype Fee — No real payment charged</p>
          </div>

          <div className="space-y-2 mb-5">
            <label className="block text-xs font-bold text-gray-700 mb-2">Select Payment Method</label>
            {["GCash", "Maya", "Online Banking", "Over-the-Counter"].map((m) => (
              <label
                key={m}
                onClick={() => setPaymentMethod(m)}
                className={`flex cursor-pointer items-center justify-between rounded-2xl border p-3.5 text-xs font-bold transition ${paymentMethod === m ? "border-red-600 bg-red-50/40 text-red-700" : "border-zinc-200 bg-white text-gray-700 hover:bg-zinc-50"}`}
              >
                <span>{m}</span>
                <span className={`h-4 w-4 rounded-full border flex items-center justify-center ${paymentMethod === m ? "border-red-600 bg-red-600" : "border-zinc-300"}`}>
                  {paymentMethod === m && <Check size={10} className="text-white" />}
                </span>
              </label>
            ))}
          </div>

          {!paymentDone ? (
            <button
              type="button"
              onClick={handleProcessPayment}
              disabled={isPaying}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-red-600 py-3.5 text-xs sm:text-sm font-bold text-white shadow-sm hover:bg-red-700 active:scale-[0.98] disabled:opacity-50"
            >
              {isPaying ? <RefreshCw size={16} className="animate-spin" /> : <Wallet size={16} />}
              {isPaying ? "Processing Simulated Payment…" : "Pay ₱2,450.00 (Simulated)"}
            </button>
          ) : (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-xs space-y-1.5">
              <div className="flex items-center gap-2 font-extrabold text-emerald-800 text-sm">
                <CheckCircle2 size={18} className="text-emerald-600" />
                <span>Payment Successful</span>
              </div>
              <SummaryRow label="Payment Reference" value={payRef} />
              <SummaryRow label="Payment Method" value={paymentMethod} />
              <SummaryRow label="Amount Paid" value="₱2,450.00" />
            </div>
          )}
        </div>
        <NavButtons onBack={back} onNext={handleSubmit} disabled={!paymentDone} nextLabel="Submit Renewal Application" />
      </div>
    );
  }

  function StepTracking() {
    const trackSteps = [
      { label: "Application Submitted", done: true },
      { label: "AI Document Validation", done: true },
      { label: "Business Record Verification", done: true },
      { label: "Payment Confirmed", done: true },
      { label: "BPLO Processing", done: false, active: true },
      { label: "Permit Ready", done: false },
    ];

    return (
      <div className="space-y-5 animate-fade-up">
        <div className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm sm:p-6">
          <h2 className="text-sm font-extrabold text-gray-900 mb-1">Permit Renewal Tracking</h2>
          <p className="font-mono text-xs text-red-600 mb-4">{generatedReqId}</p>

          <div className="mb-5 rounded-2xl border border-blue-200 bg-blue-50/60 p-4 text-xs">
            <p className="font-extrabold text-gray-900 text-xs sm:text-sm">Status: BPLO Processing</p>
            <p className="mt-1 text-gray-600">Payment confirmed and documents verified. Your Mayor's Permit is being signed and printed by BPLO.</p>
          </div>

          <div className="space-y-0">
            {trackSteps.map((s, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="flex flex-col items-center">
                  <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${s.done ? "bg-emerald-600 text-white" : s.active ? "border-2 border-red-600 bg-white text-red-600 animate-pulse" : "border-2 border-zinc-200 bg-white text-zinc-400"}`}>
                    {s.done ? <Check size={14} /> : i + 1}
                  </div>
                  {i < trackSteps.length - 1 && <div className={`mt-1 h-8 w-0.5 ${s.done ? "bg-emerald-600" : "bg-zinc-200"}`} />}
                </div>
                <p className={`mt-1 text-xs font-bold ${s.done ? "text-emerald-700" : s.active ? "text-red-600" : "text-gray-400"}`}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={next}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-red-600 py-3.5 text-xs sm:text-sm font-bold text-white shadow-sm hover:bg-red-700 active:scale-[0.98]"
        >
          View Sample Business Permit <ArrowRight size={16} />
        </button>
      </div>
    );
  }

  function StepPermitReady() {
    return (
      <div className="space-y-5 animate-fade-up">
        {notificationToast && (
          <div className="flex items-center justify-between rounded-2xl border border-emerald-200 bg-emerald-50 p-3.5 text-xs font-bold text-emerald-800 animate-fade-in">
            <span>{notificationToast}</span>
            <button onClick={() => setNotificationToast(null)}><X size={14} /></button>
          </div>
        )}

        <div className="rounded-3xl border border-emerald-200 bg-emerald-50/40 p-5 text-center">
          <CheckCircle2 size={40} className="mx-auto text-emerald-600 mb-3" />
          <p className="text-base sm:text-lg font-extrabold text-gray-900">Business Permit Renewal Approved</p>
          <p className="text-xs text-gray-500 mt-1">Mayor's Permit for 2026 is officially issued.</p>
          <p className="font-mono text-xs sm:text-sm font-bold text-emerald-700 mt-2">{issuedPermitNo}</p>
        </div>

        {/* Sample Business Permit */}
        <div className="relative overflow-hidden rounded-3xl border-2 border-amber-600 bg-gradient-to-br from-amber-50/30 via-white to-amber-50/20 p-5 sm:p-6 shadow-md">
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
            <span className="text-4xl sm:text-5xl font-extrabold text-zinc-100 rotate-[-30deg] tracking-widest uppercase">SAMPLE</span>
          </div>

          <div className="relative z-10">
            {/* Header */}
            <div className="text-center border-b-2 border-amber-600 pb-4 mb-4">
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Republic of the Philippines · City of Malaybalay, Bukidnon</p>
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-700">Office of the City Mayor · Business Permits &amp; Licensing Office</p>
              <p className="mt-2 text-sm sm:text-base font-extrabold uppercase text-amber-800 tracking-wider">Mayor's Business Permit (2026)</p>
              <p className="font-mono text-xs font-bold text-gray-700 mt-1">{issuedPermitNo}</p>
            </div>

            <div className="space-y-2 text-xs">
              <SummaryRow label="Business Name" value={business.businessName} />
              <SummaryRow label="Taxpayer / Owner" value={owner.fullName} />
              <SummaryRow label="Business Address" value={business.businessAddress} />
              <SummaryRow label="Nature of Business" value={business.nature} />
              <SummaryRow label="Business Type" value={business.businessType} />
              <SummaryRow label="Date Issued" value={new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })} />
              <SummaryRow label="Validity Period" value="January 01, 2026 – December 31, 2026" />
              <SummaryRow label="Payment Reference" value={payRef || "ACORS-PAY-20260825-004"} />
            </div>

            <div className="mt-5 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-zinc-200 pt-3">
              <button
                type="button"
                onClick={() => setShowQRModal(true)}
                className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-zinc-50 px-3.5 py-2 text-xs font-bold text-gray-700 hover:bg-zinc-100 active:scale-95"
              >
                <QrCode size={16} /> View Digital QR
              </button>
              <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest text-center sm:text-right max-w-xs">SAMPLE – NOT AN OFFICIAL GOVERNMENT DOCUMENT</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          <button
            type="button"
            onClick={() => setNotificationToast("Business permit viewed.")}
            className="flex h-11 items-center justify-center gap-1.5 rounded-2xl border border-zinc-200 bg-white py-2.5 text-xs font-bold text-gray-700 hover:bg-zinc-50 active:scale-95"
          >
            <Eye size={14} /> View Document
          </button>
          <button
            type="button"
            onClick={() => setNotificationToast("Sample business permit downloaded.")}
            className="flex h-11 items-center justify-center gap-1.5 rounded-2xl border border-zinc-200 bg-white py-2.5 text-xs font-bold text-gray-700 hover:bg-zinc-50 active:scale-95"
          >
            <Download size={14} /> Download Sample
          </button>
          <button
            type="button"
            onClick={() => setShowQRModal(true)}
            className="flex h-11 items-center justify-center gap-1.5 rounded-2xl bg-red-600 py-2.5 text-xs font-bold text-white hover:bg-red-700 active:scale-95"
          >
            <QrCode size={14} /> Verify QR
          </button>
        </div>

        <Link to="/request-certificate" className="flex w-full items-center justify-center gap-2 rounded-2xl border border-zinc-200 py-3 text-xs font-bold text-gray-600 hover:bg-zinc-50">
          <ArrowLeft size={14} /> Back to Certificates
        </Link>
      </div>
    );
  }

  // ─── QR Modal ─────────────────────────────────────────────────────────────
  function QRModal() {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="fixed inset-0 bg-zinc-900/60" onClick={() => setShowQRModal(false)} />
        <div className="relative w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-sm font-extrabold text-gray-900">QR Permit Verification</h3>
            <button onClick={() => setShowQRModal(false)} className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-100"><X size={16} /></button>
          </div>
          <div className="flex h-36 w-36 mx-auto items-center justify-center rounded-2xl bg-zinc-100 mb-4">
            <QrCode size={64} className="text-zinc-400" />
          </div>
          <div className="space-y-2 text-xs border-t border-zinc-100 pt-4">
            <SummaryRow label="Permit No." value={issuedPermitNo} />
            <SummaryRow label="Business" value={business.businessName} />
            <SummaryRow label="Owner" value={owner.fullName} />
            <SummaryRow label="Document" value="Mayor's Business Permit" />
            <SummaryRow label="Request ID" value={generatedReqId} />
          </div>
          <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 py-2 text-center">
            <span className="text-xs font-extrabold text-emerald-700">VALID — BPLO Registry Verified</span>
          </div>
          <p className="mt-3 text-center text-[10px] text-zinc-400 uppercase tracking-wider">SAMPLE – NOT AN OFFICIAL GOVERNMENT DOCUMENT</p>
        </div>
      </div>
    );
  }

  const stepComponents = [
    <StepStart />, <StepOwnerInfo />, <StepBusinessInfo />, <StepUploadRequirements />,
    <StepAIValidation />, <StepRecordVerification />, <StepSummary />, <StepPayment />,
    <StepTracking />, <StepPermitReady />,
  ];

  return (
    <div className="mx-auto max-w-2xl px-4 pb-28 pt-6 sm:px-6 lg:px-0">
      {showQRModal && <QRModal />}

      {/* Top Breadcrumb Navigation matching LCRO */}
      <div className="flex items-center justify-between gap-2">
        <Link
          to="/request-certificate"
          className="inline-flex items-center gap-2 rounded-xl px-2.5 py-1.5 text-xs font-bold text-gray-500 transition hover:bg-zinc-100 hover:text-gray-900"
        >
          <ArrowLeft size={16} />
          Back to Certificates
        </Link>

        <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-3 py-1 font-mono text-[11px] font-bold text-red-700">
          <span className="h-1.5 w-1.5 rounded-full bg-red-600 animate-pulse" />
          BPLO Portal
        </span>
      </div>

      {/* Header Banner matching LCRO */}
      <div className="mt-4 flex items-center gap-3.5 rounded-3xl border border-zinc-200 bg-white p-4 shadow-sm sm:p-5 animate-fade-up">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-red-600 text-white shadow-md">
          <Briefcase size={22} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-red-600">
            Business Permits &amp; Licensing Office (BPLO)
          </p>
          <h1 className="text-lg font-extrabold leading-tight text-gray-900 sm:text-xl">
            Business Permit Renewal
          </h1>
          <p className="mt-0.5 text-xs text-gray-500">
            Mayor's Permit 2026 renewal · Automated record matching
          </p>
        </div>
      </div>

      {/* Multi-Step Mini Progress Tracker matching LCRO */}
      {currentStep > 1 && currentStep < STEPS.length && (
        <div className="mt-5 rounded-2xl border border-zinc-200 bg-white p-3.5 shadow-sm animate-fade-up">
          <div className="flex items-center justify-between text-xs font-bold text-gray-700">
            <span>
              Step {currentStep - 1} of {STEPS.length - 2}:{" "}
              <span className="text-red-600">{STEPS[currentStep - 1]}</span>
            </span>
            <span className="font-mono text-[11px] text-gray-400">
              {Math.round(((currentStep - 1) / (STEPS.length - 2)) * 100)}%
            </span>
          </div>
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-zinc-100">
            <div
              className="h-full rounded-full bg-red-600 transition-all duration-500 ease-out"
              style={{ width: `${((currentStep - 1) / (STEPS.length - 2)) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Step content */}
      <div className="mt-5">
        {stepComponents[currentStep - 1]}
      </div>
    </div>
  );
}

function NavButtons({ onBack, onNext, disabled = false, nextLabel = "Continue" }) {
  return (
    <div className="flex flex-col-reverse sm:flex-row gap-2.5 sm:gap-3 pt-2">
      <button
        type="button"
        onClick={onBack}
        className="flex h-11 sm:h-auto sm:w-1/3 items-center justify-center gap-1.5 rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-xs font-bold text-gray-600 transition hover:bg-zinc-100 active:scale-[0.98]"
      >
        <ArrowLeft size={14} /> Back
      </button>
      <button
        type="button"
        onClick={onNext}
        disabled={disabled}
        className="flex h-11 sm:h-auto sm:w-2/3 items-center justify-center gap-1.5 rounded-2xl bg-red-600 px-4 py-3 text-xs font-bold text-white shadow-sm transition hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
      >
        {nextLabel} <ArrowRight size={14} />
      </button>
    </div>
  );
}

function UploadBox({ label, file, onUpload, onRemove, required }) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-bold text-gray-700">{label}{required && <span className="text-red-500 ml-1">*</span>}</label>
      {file?.uploaded ? (
        <div className="flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50/50 p-3.5">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700 font-extrabold text-xs">OK</div>
          <div className="flex-1 min-w-0"><p className="font-bold text-gray-900 text-xs truncate">{file.name}</p><p className="text-[10px] text-gray-400">{file.size}</p></div>
          <button type="button" onClick={onRemove} className="text-xs font-bold text-red-500 hover:text-red-700 flex items-center gap-1"><X size={14} /></button>
        </div>
      ) : (
        <label className="flex cursor-pointer flex-col items-center gap-2 rounded-2xl border-2 border-dashed border-zinc-300 p-6 text-center hover:border-red-400 transition">
          <Upload size={22} className="text-zinc-400" />
          <span className="text-xs font-bold text-gray-600">Click to upload file</span>
          <input type="file" className="hidden" onChange={onUpload} />
        </label>
      )}
    </div>
  );
}

function SummaryRow({ label, value }) {
  return (
    <div className="flex items-start justify-between gap-4 py-1.5 border-b border-zinc-50 last:border-0">
      <span className="text-gray-400 text-xs shrink-0">{label}</span>
      <span className="text-xs font-bold text-gray-900 text-right">{value}</span>
    </div>
  );
}
