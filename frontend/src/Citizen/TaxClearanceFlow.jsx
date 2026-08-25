// src/Citizen/TaxClearanceFlow.jsx
import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft, ArrowRight, CheckCircle2, AlertCircle, FileText,
  Upload, ShieldCheck, CreditCard, QrCode, Download, Eye,
  RefreshCw, Sparkles, Check, User, X, Info, Wallet,
} from "lucide-react";
import { saveCTORequest, findMockTaxClearanceRecord } from "../services/ctoData";

const STEPS = [
  "Start Application", "Requester Info", "Tax Information",
  "Upload Documents", "AI Validation", "Tax Status Verification",
  "Request Summary", "Prototype Payment", "Submit Request",
  "Tracking", "Certificate Ready",
];

const TAX_TYPES = ["Real Property Tax", "Business Tax", "Other Local Tax"];
const PURPOSES = ["Business Permit Renewal", "Loan Application", "Property Sale / Transfer", "Government Transaction", "Legal Requirement", "Other"];

export default function TaxClearanceFlow({ office, cert }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [testMode, setTestMode] = useState("normal");

  const [applicant, setApplicant] = useState({
    fullName: "Maria Santos",
    address: "Purok 2, Sumpong, Malaybalay City, Bukidnon",
    barangay: "Sumpong",
    contactNumber: "0921-334-5566",
    email: "maria.santos@gmail.com",
    taxpayerRef: "RPT-2026-MS-001",
  });

  const [taxInfo, setTaxInfo] = useState({
    taxType: "Real Property Tax",
    propertyRef: "RPT-2026-MS-001",
    taxYear: "2026",
    purpose: "Loan Application",
  });

  const [idFile, setIdFile] = useState({ name: "philid_santos.jpg", type: "image/jpeg", size: "1.4 MB", uploaded: true });
  const [receiptFile, setReceiptFile] = useState({ name: "prev_receipt_rpt.jpg", type: "image/jpeg", size: "0.6 MB", uploaded: true });

  const [aiScanning, setAiScanning] = useState(false);
  const [aiProgress, setAiProgress] = useState(0);
  const [aiChecks, setAiChecks] = useState([]);

  const [taxStatus, setTaxStatus] = useState(null); // null | "CLEAR" | "OUTSTANDING" | "UNVERIFIED"
  const [statusRecord, setStatusRecord] = useState(null);
  const [isVerifying, setIsVerifying] = useState(false);

  const [paymentMethod, setPaymentMethod] = useState("GCash");
  const [paymentRef, setPaymentRef] = useState("");
  const [paymentProcessing, setPaymentProcessing] = useState(false);

  const [generatedReqId, setGeneratedReqId] = useState("");
  const [issuedCertNo, setIssuedCertNo] = useState("");
  const [submittedTime, setSubmittedTime] = useState("");
  const [showQRModal, setShowQRModal] = useState(false);
  const [notificationToast, setNotificationToast] = useState(null);

  // Test mode presets
  const presets = {
    normal: { fullName: "Maria Santos", propertyRef: "RPT-2026-MS-001", taxType: "Real Property Tax" },
    outstanding: { fullName: "Roberto Lim", propertyRef: "BT-2026-RL-003", taxType: "Business Tax" },
  };

  function applyPreset(mode) {
    setTestMode(mode);
    const p = presets[mode] || presets.normal;
    setApplicant((a) => ({ ...a, fullName: p.fullName, taxpayerRef: p.propertyRef }));
    setTaxInfo((t) => ({ ...t, taxType: p.taxType, propertyRef: p.propertyRef }));
    setTaxStatus(null);
    setStatusRecord(null);
    setAiChecks([]);
  }

  const aiChecksDef = [
    { label: "Application completeness", passed: true },
    { label: "Required fields", passed: true },
    { label: "Valid ID uploaded", passed: true },
    { label: "ID readability", passed: testMode === "normal" },
    { label: "Taxpayer information consistency", passed: testMode === "normal" },
    { label: "Duplicate request check", passed: true },
  ];
  const aiStatus = testMode === "normal" ? "PASSED" : "REQUIRES VERIFICATION";

  function runAIValidation() {
    setAiScanning(true); setAiProgress(0); setAiChecks([]);
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setAiProgress(Math.round((i / aiChecksDef.length) * 100));
      setAiChecks((p) => [...p, aiChecksDef[i - 1]]);
      if (i >= aiChecksDef.length) { clearInterval(interval); setAiScanning(false); }
    }, 350);
  }

  function runStatusVerification() {
    setIsVerifying(true);
    setTimeout(() => {
      const record = findMockTaxClearanceRecord({
        taxpayerName: applicant.fullName,
        taxType: taxInfo.taxType,
        taxYear: taxInfo.taxYear,
      });
      if (!record) {
        setTaxStatus("UNVERIFIED");
        setStatusRecord(null);
      } else if (record.taxStatus === "NO_OUTSTANDING_BALANCE") {
        setTaxStatus("CLEAR");
        setStatusRecord(record);
      } else {
        setTaxStatus("OUTSTANDING");
        setStatusRecord(record);
      }
      setIsVerifying(false);
    }, 2200);
  }

  function handlePayment() {
    setPaymentProcessing(true);
    setTimeout(() => {
      setPaymentRef(`ACORS-PAY-${Date.now().toString().slice(-8)}`);
      setPaymentProcessing(false);
      next();
    }, 2200);
  }

  function handleSubmit() {
    const reqId = `ACORS-CTO-2026-${String(Math.floor(10000 + Math.random() * 90000)).padStart(6, "0")}`;
    const certNo = `CTO-TC-2026-${Math.floor(100000 + Math.random() * 900000)}`;
    const now = new Date().toLocaleString("en-US", { month: "long", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" });
    setGeneratedReqId(reqId); setIssuedCertNo(certNo); setSubmittedTime(now);

    const finalStatus = taxStatus === "CLEAR" && aiStatus === "PASSED" ? "Processing" : "Requires LGU Review";

    saveCTORequest({
      id: reqId,
      certificateType: "Certificate of Tax Clearance",
      submittedAt: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      status: finalStatus,
      applicant: { ...applicant },
      taxInfo: { ...taxInfo },
      aiValidation: { status: aiStatus, confidence: "91%", checks: aiChecksDef, recommendation: aiStatus === "PASSED" ? "Application verified." : "Outstanding balance found. Requires LGU review." },
      recordVerification: {
        status: taxStatus,
        outstandingAmount: statusRecord?.outstandingAmount || null,
        message: taxStatus === "CLEAR"
          ? "No outstanding tax balance. Eligible for clearance."
          : taxStatus === "OUTSTANDING"
          ? `Outstanding balance of ${statusRecord?.outstandingAmount}. Cannot auto-issue clearance.`
          : "Tax status could not be verified. Requires manual LGU review.",
      },
      payment: { method: paymentMethod, amount: 100, reference: paymentRef },
      idUpload: { idType: "Government ID", fileName: idFile.name, uploaded: true, hasPrevReceipt: receiptFile.uploaded },
    });
    next();
  }

  const next = () => setCurrentStep((s) => Math.min(s + 1, STEPS.length));
  const back = () => setCurrentStep((s) => Math.max(s - 1, 1));

  function StepStart() {
    return (
      <div className="space-y-5 animate-fade-up">
        <div className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm sm:p-6">
          <h2 className="text-base font-extrabold text-gray-900 sm:text-lg">
            Service Information & Guidelines
          </h2>
          <p className="mt-1.5 text-xs leading-relaxed text-gray-500 sm:text-sm">
            Request an official certificate showing your local tax clearance and liability status in Malaybalay City.
          </p>

          <div className="mt-5 grid grid-cols-2 gap-3 text-xs">
            <div className="rounded-2xl border border-zinc-100 bg-zinc-50/80 p-3.5">
              <span className="font-bold text-gray-800">Processing Fee</span>
              <p className="mt-1 font-mono text-base font-extrabold text-red-600">₱100.00</p>
              <p className="text-[11px] text-gray-400">per certificate</p>
            </div>
            <div className="rounded-2xl border border-zinc-100 bg-zinc-50/80 p-3.5">
              <span className="font-bold text-gray-800">Verification</span>
              <p className="mt-1 font-mono text-base font-extrabold text-gray-900">Instant AI</p>
              <p className="text-[11px] text-gray-400">Arrears & balance audit</p>
            </div>
          </div>

          <div className="mt-5 rounded-2xl bg-zinc-50 p-4">
            <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-gray-500 mb-3">Requirements</p>
            {["Valid Government ID", "Previous Tax Receipt / Reference", "Tax account information"].map((r) => (
              <div key={r} className="flex items-center gap-2 text-xs text-gray-700 mb-2">
                <Check size={14} className="text-emerald-600 shrink-0" />
                <span>{r}</span>
              </div>
            ))}
          </div>

          <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-3.5 text-xs text-amber-800 flex items-start gap-2">
            <Info size={16} className="mt-0.5 shrink-0" />
            <span>PROTOTYPE ONLY. If an outstanding balance is found, the request will be flagged for LGU review — not auto-approved.</span>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-2.5">
            <span className="text-xs font-bold text-gray-500">Test Mode:</span>
            {[{ key: "normal", label: "Clear Status" }, { key: "outstanding", label: "Outstanding Balance" }].map((m) => (
              <button
                key={m.key}
                type="button"
                onClick={() => applyPreset(m.key)}
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

  function StepRequesterInfo() {
    return (
      <div className="space-y-5 animate-fade-up">
        <div className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex items-center gap-2.5 mb-5">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-red-50 text-red-600 font-bold text-xs">
              1
            </span>
            <div>
              <h2 className="text-sm font-extrabold text-gray-900 sm:text-base">Requester Information</h2>
              <p className="text-xs text-gray-400">Applicant identity details</p>
            </div>
          </div>
          <div className="space-y-4">
            {[
              { key: "fullName", label: "Full Name", type: "text" },
              { key: "address", label: "Address", type: "text" },
              { key: "barangay", label: "Barangay", type: "select", options: ["Casisang", "Kalasungay", "Sumpong", "Bangcud", "Aglayan", "Poblacion", "Other"] },
              { key: "contactNumber", label: "Contact Number", type: "tel" },
              { key: "email", label: "Email Address", type: "email" },
              { key: "taxpayerRef", label: "Taxpayer Reference No. (if applicable)", type: "text", placeholder: "Optional" },
            ].map((f) => (
              <div key={f.key}>
                <label className="mb-1.5 block text-xs font-bold text-gray-700">{f.label}</label>
                {f.type === "select" ? (
                  <select
                    value={applicant[f.key]}
                    onChange={(e) => setApplicant((p) => ({ ...p, [f.key]: e.target.value }))}
                    className="w-full rounded-xl border border-zinc-200 bg-zinc-50/50 px-3.5 py-2.5 text-xs text-gray-900 focus:border-red-600 focus:bg-white focus:outline-none"
                  >
                    {f.options.map((o) => <option key={o}>{o}</option>)}
                  </select>
                ) : (
                  <input
                    type={f.type}
                    value={applicant[f.key]}
                    onChange={(e) => setApplicant((p) => ({ ...p, [f.key]: e.target.value }))}
                    placeholder={f.placeholder}
                    className="w-full rounded-xl border border-zinc-200 bg-zinc-50/50 px-3.5 py-2.5 text-xs text-gray-900 placeholder-gray-400 focus:border-red-600 focus:bg-white focus:outline-none focus:ring-1 focus:ring-red-600"
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

  function StepTaxInfo() {
    return (
      <div className="space-y-5 animate-fade-up">
        <div className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex items-center gap-2.5 mb-5">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-red-50 text-red-600 font-bold text-xs">
              2
            </span>
            <div>
              <h2 className="text-sm font-extrabold text-gray-900 sm:text-base">Tax Information</h2>
              <p className="text-xs text-gray-400">Specify tax liability category</p>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-bold text-gray-700">Tax Type</label>
              <select
                value={taxInfo.taxType}
                onChange={(e) => setTaxInfo((p) => ({ ...p, taxType: e.target.value }))}
                className="w-full rounded-xl border border-zinc-200 bg-zinc-50/50 px-3.5 py-2.5 text-xs text-gray-900 focus:border-red-600 focus:bg-white focus:outline-none"
              >
                {TAX_TYPES.map((t) => <option key={t}>{t}</option>)}
              </select>
            </div>
            {[
              { key: "propertyRef", label: "Tax Account / Property Reference No.", type: "text", placeholder: "e.g. RPT-2026-MS-001" },
              { key: "taxYear", label: "Tax Year", type: "text", placeholder: "e.g. 2026" },
            ].map((f) => (
              <div key={f.key}>
                <label className="mb-1.5 block text-xs font-bold text-gray-700">{f.label}</label>
                <input
                  type={f.type}
                  value={taxInfo[f.key]}
                  onChange={(e) => setTaxInfo((p) => ({ ...p, [f.key]: e.target.value }))}
                  placeholder={f.placeholder}
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50/50 px-3.5 py-2.5 text-xs text-gray-900 placeholder-gray-400 focus:border-red-600 focus:bg-white focus:outline-none focus:ring-1 focus:ring-red-600"
                />
              </div>
            ))}
            <div>
              <label className="mb-1.5 block text-xs font-bold text-gray-700">Purpose of Clearance</label>
              <select
                value={taxInfo.purpose}
                onChange={(e) => setTaxInfo((p) => ({ ...p, purpose: e.target.value }))}
                className="w-full rounded-xl border border-zinc-200 bg-zinc-50/50 px-3.5 py-2.5 text-xs text-gray-900 focus:border-red-600 focus:bg-white focus:outline-none"
              >
                {PURPOSES.map((p) => <option key={p}>{p}</option>)}
              </select>
            </div>
          </div>
        </div>
        <NavButtons onBack={back} onNext={next} />
      </div>
    );
  }

  function StepUploadDocs() {
    return (
      <div className="space-y-5 animate-fade-up">
        <div className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex items-center gap-2.5 mb-5">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-red-50 text-red-600 font-bold text-xs">
              3
            </span>
            <div>
              <h2 className="text-sm font-extrabold text-gray-900 sm:text-base">Upload Requirements</h2>
              <p className="text-xs text-gray-400">ID and prior tax documentation</p>
            </div>
          </div>
          <div className="space-y-3">
            <UploadBox label="Valid Government ID" file={idFile} onUpload={() => setIdFile({ name: "uploaded_id.jpg", type: "image/jpeg", size: "1.2 MB", uploaded: true })} onRemove={() => setIdFile({ name: "", uploaded: false })} required />
            <UploadBox label="Previous Tax Receipt / Reference" file={receiptFile} onUpload={() => setReceiptFile({ name: "prev_receipt.jpg", type: "image/jpeg", size: "0.5 MB", uploaded: true })} onRemove={() => setReceiptFile({ name: "", uploaded: false })} />
          </div>
        </div>
        <NavButtons onBack={back} onNext={next} disabled={!idFile.uploaded} />
      </div>
    );
  }

  function StepAIValidation() {
    const ready = aiChecks.length === aiChecksDef.length && !aiScanning;
    return (
      <div className="space-y-5 animate-fade-up">
        <div className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex items-center gap-2.5 mb-5">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-red-50 text-red-600 font-bold text-xs">
              4
            </span>
            <div>
              <h2 className="text-sm font-extrabold text-gray-900 sm:text-base">AI Automated Validation</h2>
              <p className="text-xs text-gray-400">Completeness & identity audit</p>
            </div>
          </div>
          {aiChecks.length === 0 && !aiScanning ? (
            <div className="flex flex-col items-center gap-3 py-8 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-600">
                <Sparkles size={28} />
              </div>
              <p className="text-sm font-bold text-gray-800">Ready to validate application</p>
              <button
                type="button"
                onClick={runAIValidation}
                className="mt-2 flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-red-600 px-6 py-3 text-xs font-bold text-white shadow-sm hover:bg-red-700 active:scale-95"
              >
                <Sparkles size={14} /> Run AI Validation
              </button>
            </div>
          ) : (
            <>
              {aiScanning && (
                <div className="mb-4">
                  <div className="flex justify-between text-xs font-bold mb-1.5"><span>Scanning Information…</span><span>{aiProgress}%</span></div>
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
                <div className={`mt-4 rounded-2xl border p-4 ${aiStatus === "PASSED" ? "border-emerald-200 bg-emerald-50" : "border-amber-200 bg-amber-50"}`}>
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-xs sm:text-sm text-gray-900">AI Recommendation</span>
                    <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-extrabold text-white ${aiStatus === "PASSED" ? "bg-emerald-600" : "bg-amber-600"}`}>{aiStatus}</span>
                  </div>
                  <p className="mt-1.5 text-xs text-gray-600">AI Confidence: <span className="font-bold">91%</span></p>
                </div>
              )}
            </>
          )}
        </div>
        <NavButtons onBack={back} onNext={next} disabled={!ready} />
      </div>
    );
  }

  function StepStatusVerification() {
    return (
      <div className="space-y-5 animate-fade-up">
        <div className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex items-center gap-2.5 mb-5">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-red-50 text-red-600 font-bold text-xs">
              5
            </span>
            <div>
              <h2 className="text-sm font-extrabold text-gray-900 sm:text-base">Mock Tax Status Verification</h2>
              <p className="text-xs text-gray-400">Automated check for unpaid balances and liabilities</p>
            </div>
          </div>

          <div className="rounded-2xl border border-zinc-100 bg-zinc-50 p-4 text-xs mb-5 space-y-2">
            <p className="font-extrabold text-gray-700 uppercase tracking-wider text-[10px] mb-2">Submitted Information</p>
            <SummaryRow label="Taxpayer" value={applicant.fullName} />
            <SummaryRow label="Tax Type" value={taxInfo.taxType} />
            <SummaryRow label="Tax Year" value={taxInfo.taxYear} />
            <SummaryRow label="Reference No." value={taxInfo.propertyRef} />
          </div>

          {!isVerifying && taxStatus === null && (
            <button
              type="button"
              onClick={runStatusVerification}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-red-600 py-3.5 text-xs sm:text-sm font-bold text-white shadow-sm hover:bg-red-700 active:scale-[0.98]"
            >
              <ShieldCheck size={16} /> Check Tax Status
            </button>
          )}

          {isVerifying && (
            <div className="flex flex-col items-center gap-3 py-6 text-center">
              <RefreshCw size={24} className="animate-spin text-red-600" />
              <p className="text-xs sm:text-sm font-bold text-gray-700">Checking city tax ledger…</p>
            </div>
          )}

          {!isVerifying && taxStatus === "CLEAR" && (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-xs">
              <div className="flex items-center gap-2 font-extrabold text-emerald-800 mb-3">
                <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
                <span>TAX STATUS CLEAR</span>
              </div>
              <SummaryRow label="Taxpayer" value={statusRecord?.taxpayerName} />
              <SummaryRow label="Tax Type" value={statusRecord?.taxType} />
              <SummaryRow label="Tax Year" value={statusRecord?.taxYear} />
              <p className="mt-3 font-bold text-emerald-700">No outstanding balance. Eligible for clearance.</p>
            </div>
          )}

          {!isVerifying && taxStatus === "OUTSTANDING" && (
            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-xs">
              <div className="flex items-center gap-2 font-extrabold text-amber-800 mb-3">
                <AlertCircle size={18} className="text-amber-600 shrink-0" />
                <span>OUTSTANDING BALANCE FOUND</span>
              </div>
              <SummaryRow label="Taxpayer" value={statusRecord?.taxpayerName} />
              <SummaryRow label="Outstanding Amount" value={statusRecord?.outstandingAmount} />
              <div className="mt-3 rounded-xl border border-amber-300 bg-amber-100 p-3">
                <p className="font-bold text-amber-900">Your tax account requires verification.</p>
                <p className="mt-1 text-amber-800">This request will be forwarded to the LGU Treasurer's Office for review. Clearance cannot be auto-issued.</p>
              </div>
            </div>
          )}

          {!isVerifying && taxStatus === "UNVERIFIED" && (
            <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4 text-xs">
              <div className="flex items-center gap-2 font-extrabold text-gray-700 mb-2">
                <AlertCircle size={18} className="text-zinc-500 shrink-0" />
                <span>REQUIRES LGU REVIEW</span>
              </div>
              <p className="text-gray-600">Tax status could not be verified against records. This request will be sent to LGU staff for manual review.</p>
            </div>
          )}
        </div>
        <NavButtons onBack={back} onNext={next} disabled={isVerifying || taxStatus === null} />
      </div>
    );
  }

  function StepSummary() {
    return (
      <div className="space-y-5 animate-fade-up">
        <div className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm sm:p-6 space-y-3">
          <div className="flex items-center gap-2.5 mb-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-red-50 text-red-600 font-bold text-xs">
              6
            </span>
            <h2 className="text-sm font-extrabold text-gray-900 sm:text-base">Request Summary</h2>
          </div>
          <SummaryRow label="Certificate" value="Certificate of Tax Clearance" />
          <SummaryRow label="Applicant" value={applicant.fullName} />
          <SummaryRow label="Tax Type" value={taxInfo.taxType} />
          <SummaryRow label="Tax Year" value={taxInfo.taxYear} />
          <SummaryRow label="Reference No." value={taxInfo.propertyRef} />
          <SummaryRow label="Purpose" value={taxInfo.purpose} />
          <div className={`rounded-xl border px-3 py-2 text-xs font-bold ${aiStatus === "PASSED" ? "border-emerald-200 bg-emerald-50 text-emerald-800" : "border-amber-200 bg-amber-50 text-amber-800"}`}>AI Validation: {aiStatus}</div>
          <div className={`rounded-xl border px-3 py-2 text-xs font-bold ${taxStatus === "CLEAR" ? "border-emerald-200 bg-emerald-50 text-emerald-800" : "border-amber-200 bg-amber-50 text-amber-800"}`}>
            Tax Status: {taxStatus === "CLEAR" ? "CLEAR — No Outstanding Balance" : taxStatus === "OUTSTANDING" ? "OUTSTANDING BALANCE — LGU Review Required" : "UNVERIFIED — LGU Review Required"}
          </div>
          {taxStatus === "OUTSTANDING" && (
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800">
              <p className="font-bold">Note:</p>
              <p>Due to an outstanding balance, this request will be sent to the Treasurer's Office for review. You may still proceed to pay the processing fee.</p>
            </div>
          )}
          <div className="flex items-center justify-between rounded-2xl border border-red-100 bg-red-50 px-4 py-3">
            <span className="text-xs sm:text-sm font-extrabold text-gray-900">Processing Fee</span>
            <span className="font-mono text-base sm:text-lg font-extrabold text-red-700">₱100.00</span>
          </div>
        </div>
        <NavButtons onBack={back} onNext={next} nextLabel="Proceed to Payment" />
      </div>
    );
  }

  function StepPayment() {
    const methods = ["GCash", "Maya", "Online Banking", "Over-the-Counter"];
    return (
      <div className="space-y-5 animate-fade-up">
        <div className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex items-center gap-2.5 mb-5">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-red-50 text-red-600 font-bold text-xs">
              7
            </span>
            <div>
              <h2 className="text-sm font-extrabold text-gray-900 sm:text-base">Prototype Payment</h2>
              <p className="text-xs text-gray-400">Processing fee payment</p>
            </div>
          </div>
          {taxStatus === "OUTSTANDING" && (
            <div className="mb-4 rounded-2xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800 flex items-start gap-2">
              <AlertCircle size={15} className="mt-0.5 shrink-0" />
              <span>Outstanding balance detected. This request will be forwarded to LGU staff for review after payment of the processing fee.</span>
            </div>
          )}
          <div className="mb-5 flex items-center justify-between rounded-2xl border border-red-100 bg-red-50 px-4 py-3">
            <span className="text-xs font-bold text-gray-700">Processing Fee</span>
            <span className="font-mono text-lg sm:text-xl font-extrabold text-red-700">₱100.00</span>
          </div>
          <div className="grid grid-cols-2 gap-2.5 mb-5">
            {methods.map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setPaymentMethod(m)}
                className={`rounded-xl border py-3 text-xs font-bold transition active:scale-95 ${paymentMethod === m ? "border-red-600 bg-red-600 text-white shadow-sm" : "border-zinc-200 bg-white text-gray-700 hover:bg-zinc-50"}`}
              >
                {m}
              </button>
            ))}
          </div>
          {paymentProcessing ? (
            <div className="flex flex-col items-center gap-3 py-6 text-center"><RefreshCw size={24} className="animate-spin text-red-600" /><p className="text-xs sm:text-sm font-bold text-gray-700">Processing…</p></div>
          ) : paymentRef ? (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-center"><CheckCircle2 size={28} className="mx-auto text-emerald-600 mb-2" /><p className="font-bold text-emerald-800 text-xs sm:text-sm">Payment Successful</p><p className="font-mono text-[11px] sm:text-xs text-emerald-700 mt-1">Ref: {paymentRef}</p></div>
          ) : (
            <button
              type="button"
              onClick={handlePayment}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-red-600 py-3.5 text-xs sm:text-sm font-bold text-white shadow-sm hover:bg-red-700 active:scale-[0.98]"
            >
              Pay ₱100.00 via {paymentMethod}
            </button>
          )}
        </div>
        {paymentRef && <NavButtons onBack={back} onNext={next} nextLabel="Continue" />}
      </div>
    );
  }

  function StepSubmit() {
    const [submitted, setSubmitted] = useState(false);
    function doSubmit() { handleSubmit(); setSubmitted(true); }
    const isLguReview = taxStatus !== "CLEAR" || aiStatus !== "PASSED";
    return (
      <div className="space-y-5 animate-fade-up">
        <div className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex items-center gap-2.5 mb-5">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-red-50 text-red-600 font-bold text-xs">
              8
            </span>
            <h2 className="text-sm font-extrabold text-gray-900 sm:text-base">Submit Request</h2>
          </div>
          <div className="space-y-2 mb-5">
            <SummaryRow label="Certificate" value="Certificate of Tax Clearance" />
            <SummaryRow label="Applicant" value={applicant.fullName} />
            <SummaryRow label="Payment" value={`₱100.00 via ${paymentMethod}`} />
            <SummaryRow label="Routing" value={isLguReview ? "Forwarded to LGU Treasurer's Office" : "Automated Processing"} />
          </div>
          {submitted ? (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-center">
              <CheckCircle2 size={32} className="mx-auto text-emerald-600 mb-3" />
              <p className="font-extrabold text-emerald-900 text-xs sm:text-sm">Certificate of Tax Clearance Request Successfully Submitted</p>
              <p className="font-mono text-xs sm:text-sm text-emerald-700 mt-1">{generatedReqId}</p>
              <p className="text-[11px] text-gray-500 mt-2">{submittedTime}</p>
              {isLguReview && <p className="mt-3 text-xs font-bold text-amber-700">Forwarded to LGU Treasurer's Office for review.</p>}
            </div>
          ) : (
            <button
              type="button"
              onClick={doSubmit}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-red-600 py-3.5 text-xs sm:text-sm font-bold text-white shadow-sm hover:bg-red-700 active:scale-[0.98]"
            >
              <ShieldCheck size={16} /> Submit Request
            </button>
          )}
        </div>
        {submitted && <NavButtons onBack={back} onNext={next} nextLabel="View Tracking" />}
      </div>
    );
  }

  function StepTracking() {
    const trackSteps = [
      { label: "Request Submitted", done: true },
      { label: "AI Validation", done: true },
      { label: "Tax Record Verification", done: true },
      { label: "Payment Confirmed", done: true },
      { label: "Processing", done: false, active: true },
      { label: "Certificate Ready", done: false },
    ];
    return (
      <div className="space-y-5 animate-fade-up">
        <div className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm sm:p-6">
          <h2 className="text-sm font-extrabold text-gray-900 mb-1">Request Tracking</h2>
          <p className="font-mono text-xs text-red-600 mb-5">{generatedReqId}</p>
          <div className="space-y-0">{trackSteps.map((s, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="flex flex-col items-center">
                <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${s.done ? "bg-emerald-600 text-white" : s.active ? "border-2 border-red-600 bg-white text-red-600 animate-pulse" : "border-2 border-zinc-200 bg-white text-zinc-400"}`}>{s.done ? <Check size={14} /> : i + 1}</div>
                {i < trackSteps.length - 1 && <div className={`mt-1 h-8 w-0.5 ${s.done ? "bg-emerald-600" : "bg-zinc-200"}`} />}
              </div>
              <p className={`mt-1 text-xs font-bold ${s.done ? "text-emerald-700" : s.active ? "text-red-600" : "text-gray-400"}`}>{s.label}</p>
            </div>
          ))}</div>
        </div>
        <button
          type="button"
          onClick={next}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-red-600 py-3.5 text-xs sm:text-sm font-bold text-white shadow-sm hover:bg-red-700 active:scale-[0.98]"
        >
          View Certificate <ArrowRight size={16} />
        </button>
      </div>
    );
  }

  function StepCertReady() {
    const isClear = taxStatus === "CLEAR";
    return (
      <div className="space-y-5 animate-fade-up">
        {notificationToast && <div className="flex items-center justify-between rounded-2xl border border-emerald-200 bg-emerald-50 p-3.5 text-xs font-bold text-emerald-800"><span>{notificationToast}</span><button onClick={() => setNotificationToast(null)}><X size={14} /></button></div>}
        <div className={`rounded-3xl border p-5 text-center ${isClear ? "border-emerald-200 bg-emerald-50/40" : "border-amber-200 bg-amber-50/40"}`}>
          {isClear ? <CheckCircle2 size={40} className="mx-auto text-emerald-600 mb-3" /> : <AlertCircle size={40} className="mx-auto text-amber-600 mb-3" />}
          <p className="text-base sm:text-lg font-extrabold text-gray-900">{isClear ? "Certificate Ready" : "Pending LGU Review"}</p>
          <p className="text-xs text-gray-500 mt-1">{isClear ? "Tax clearance approved and ready." : "Your request has been forwarded to the Treasurer's Office."}</p>
          <p className="font-mono text-xs sm:text-sm font-bold text-red-700 mt-2">{generatedReqId}</p>
        </div>
        {isClear && (
          <>
            <div className="relative overflow-hidden rounded-3xl border-2 border-zinc-200 bg-white p-5 sm:p-6 shadow-sm">
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"><span className="text-4xl sm:text-5xl font-extrabold text-zinc-100 rotate-[-30deg] tracking-widest uppercase">SAMPLE</span></div>
              <div className="relative z-10">
                <div className="text-center border-b border-zinc-200 pb-4 mb-4">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Republic of the Philippines · City of Malaybalay, Bukidnon</p>
                  <p className="mt-2 text-xs font-extrabold uppercase tracking-[0.2em] text-red-700">Certificate of Tax Clearance</p>
                  <p className="font-mono text-xs font-bold text-gray-700 mt-1">{issuedCertNo}</p>
                </div>
                <div className="space-y-2 text-xs">
                  <SummaryRow label="Taxpayer Name" value={applicant.fullName} />
                  <SummaryRow label="Address" value={applicant.address} />
                  <SummaryRow label="Tax Type" value={taxInfo.taxType} />
                  <SummaryRow label="Tax Year" value={taxInfo.taxYear} />
                  <SummaryRow label="Tax Status" value="NO OUTSTANDING BALANCE" />
                  <SummaryRow label="Date Issued" value={new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })} />
                  <SummaryRow label="Request ID" value={generatedReqId} />
                </div>
                <div className="mt-5 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => setShowQRModal(true)}
                    className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-zinc-50 px-3.5 py-2.5 text-xs font-bold text-gray-700 hover:bg-zinc-100 active:scale-95"
                  >
                    <QrCode size={16} /> View QR Code
                  </button>
                  <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest text-center sm:text-right max-w-xs">SAMPLE – NOT AN OFFICIAL GOVERNMENT DOCUMENT</p>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <button
                type="button"
                onClick={() => setNotificationToast("Certificate viewed.")}
                className="flex h-11 items-center justify-center gap-1.5 rounded-2xl border border-zinc-200 bg-white py-2.5 text-xs font-bold text-gray-700 hover:bg-zinc-50 active:scale-95"
              >
                <Eye size={14} /> View
              </button>
              <button
                type="button"
                onClick={() => setNotificationToast("Downloaded (prototype).")}
                className="flex h-11 items-center justify-center gap-1.5 rounded-2xl border border-zinc-200 bg-white py-2.5 text-xs font-bold text-gray-700 hover:bg-zinc-50 active:scale-95"
              >
                <Download size={14} /> Download
              </button>
              <button
                type="button"
                onClick={() => setShowQRModal(true)}
                className="flex h-11 items-center justify-center gap-1.5 rounded-2xl bg-red-600 py-2.5 text-xs font-bold text-white hover:bg-red-700 active:scale-95"
              >
                <QrCode size={14} /> Verify
              </button>
            </div>
          </>
        )}
        <Link to="/request-certificate" className="flex w-full items-center justify-center gap-2 rounded-2xl border border-zinc-200 py-3 text-xs font-bold text-gray-600 hover:bg-zinc-50">
          <ArrowLeft size={14} /> Back to Certificates
        </Link>
      </div>
    );
  }

  const stepComponents = [
    <StepStart />, <StepRequesterInfo />, <StepTaxInfo />, <StepUploadDocs />,
    <StepAIValidation />, <StepStatusVerification />, <StepSummary />, <StepPayment />,
    <StepSubmit />, <StepTracking />, <StepCertReady />,
  ];

  return (
    <div className="mx-auto max-w-2xl px-4 pb-28 pt-6 sm:px-6 lg:px-0">
      {showQRModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-zinc-900/60" onClick={() => setShowQRModal(false)} />
          <div className="relative w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-5"><h3 className="text-sm font-extrabold text-gray-900">QR Verification</h3><button onClick={() => setShowQRModal(false)} className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-100"><X size={16} /></button></div>
            <div className="flex h-36 w-36 mx-auto items-center justify-center rounded-2xl bg-zinc-100 mb-4"><QrCode size={64} className="text-zinc-400" /></div>
            <div className="space-y-2 text-xs border-t border-zinc-100 pt-4">
              <SummaryRow label="Certificate No." value={issuedCertNo} />
              <SummaryRow label="Type" value="Certificate of Tax Clearance" />
              <SummaryRow label="Taxpayer" value={applicant.fullName} />
              <SummaryRow label="Tax Status" value="NO OUTSTANDING BALANCE" />
              <SummaryRow label="Request ID" value={generatedReqId} />
            </div>
            <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 py-2 text-center"><span className="text-xs font-extrabold text-emerald-700">VALID — Digital Seal Verified</span></div>
            <p className="mt-3 text-center text-[10px] text-zinc-400 uppercase tracking-wider">SAMPLE – NOT AN OFFICIAL GOVERNMENT DOCUMENT</p>
          </div>
        </div>
      )}

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
          Treasurer Portal
        </span>
      </div>

      {/* Header Banner matching LCRO */}
      <div className="mt-4 flex items-center gap-3.5 rounded-3xl border border-zinc-200 bg-white p-4 shadow-sm sm:p-5 animate-fade-up">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-red-600 text-white shadow-md">
          <ShieldCheck size={22} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-red-600">
            City Treasurer&apos;s Office
          </p>
          <h1 className="text-lg font-extrabold leading-tight text-gray-900 sm:text-xl">
            Certificate of Tax Clearance
          </h1>
          <p className="mt-0.5 text-xs text-gray-500">
            Standard fee: ₱100.00 · Real-time liability status check
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
      {file.uploaded ? (
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
