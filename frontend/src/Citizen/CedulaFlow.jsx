// src/Citizen/CedulaFlow.jsx
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
  CreditCard,
  QrCode,
  Download,
  Eye,
  RefreshCw,
  Sparkles,
  Check,
  User,
  MapPin,
  Clock3,
  X,
  Info,
  Wallet,
  Calculator,
} from "lucide-react";
import { saveCTORequest } from "../services/ctoData";

const STEPS = [
  "Start Application",
  "Personal Info",
  "Upload ID",
  "AI Validation",
  "Tax Calculation",
  "Request Summary",
  "Prototype Payment",
  "Submit Request",
  "Tracking",
  "Certificate Ready",
];

export default function CedulaFlow({ office, cert }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [testMode, setTestMode] = useState("normal");

  const [applicant, setApplicant] = useState({
    fullName: "Ricardo Mendoza",
    dob: "1985-03-22",
    address: "Purok 4, Casisang, Malaybalay City, Bukidnon",
    barangay: "Casisang",
    contactNumber: "0917-234-5678",
    email: "r.mendoza@gmail.com",
    civilStatus: "Married",
    occupation: "Teacher",
    employer: "Casisang National High School",
    annualIncome: "420000",
  });

  const [idFile, setIdFile] = useState({
    name: "philid_mendoza.jpg",
    type: "image/jpeg",
    size: "1.6 MB",
    uploaded: true,
  });

  const [aiScanning, setAiScanning] = useState(false);
  const [aiProgress, setAiProgress] = useState(0);
  const [aiChecks, setAiChecks] = useState([]);

  const [paymentMethod, setPaymentMethod] = useState("GCash");
  const [paymentRef, setPaymentRef] = useState("");
  const [paymentProcessing, setPaymentProcessing] = useState(false);

  const [generatedReqId, setGeneratedReqId] = useState("");
  const [issuedCertNo, setIssuedCertNo] = useState("");
  const [submittedTime, setSubmittedTime] = useState("");

  const [showQRModal, setShowQRModal] = useState(false);
  const [notificationToast, setNotificationToast] = useState(null);

  // Tax calculation
  const income = parseFloat(applicant.annualIncome) || 0;
  const basicTax = 5;
  const additionalTax = Math.min(income * 0.001, 5000);
  const totalTax = basicTax + additionalTax;

  const aiChecksDef = [
    { label: "Required fields complete", passed: true },
    { label: "Valid ID uploaded", passed: true },
    { label: "ID readability", passed: testMode === "normal" },
    { label: "Name consistency", passed: true },
    { label: "Date of birth format", passed: true },
    { label: "Duplicate request check", passed: true },
    { label: "Income information", passed: true },
  ];

  const aiStatus = testMode === "normal" ? "PASSED" : "REQUIRES LGU REVIEW";

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
    }, 350);
  }

  function handlePayment() {
    setPaymentProcessing(true);
    setTimeout(() => {
      const ref = `ACORS-PAY-${Date.now().toString().slice(-8)}`;
      setPaymentRef(ref);
      setPaymentProcessing(false);
      next();
    }, 2200);
  }

  function handleSubmit() {
    const reqId = `ACORS-CTO-2026-${String(Math.floor(10000 + Math.random() * 90000)).padStart(6, "0")}`;
    const certNo = `CTO-CEDULA-2026-${Math.floor(100000 + Math.random() * 900000)}`;
    const now = new Date().toLocaleString("en-US", {
      month: "long", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit",
    });
    setGeneratedReqId(reqId);
    setIssuedCertNo(certNo);
    setSubmittedTime(now);

    saveCTORequest({
      id: reqId,
      certificateType: "Community Tax Certificate (Cedula)",
      submittedAt: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      status: aiStatus === "PASSED" ? "Processing" : "Requires LGU Review",
      applicant: { ...applicant },
      taxCalculation: {
        basicCommunityTax: `₱${basicTax.toFixed(2)}`,
        additionalCommunityTax: `₱${additionalTax.toFixed(2)}`,
        totalAmount: `₱${totalTax.toFixed(2)}`,
      },
      aiValidation: { status: aiStatus, confidence: "96%", checks: aiChecksDef, recommendation: aiStatus === "PASSED" ? "Application meets all requirements." : "Requires manual LGU review." },
      payment: { method: paymentMethod, amount: totalTax, reference: paymentRef },
      idUpload: { idType: "Government ID", fileName: idFile.name, uploaded: idFile.uploaded },
    });

    next();
  }

  const next = () => setCurrentStep((s) => Math.min(s + 1, STEPS.length));
  const back = () => setCurrentStep((s) => Math.max(s - 1, 1));

  // ─── Step renders ──────────────────────────────────────────────────────────

  function StepStart() {
    return (
      <div className="space-y-5 animate-fade-up">
        <div className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm sm:p-6">
          <h2 className="text-base font-extrabold text-gray-900 sm:text-lg">
            Service Information & Guidelines
          </h2>
          <p className="mt-1.5 text-xs leading-relaxed text-gray-500 sm:text-sm">
            Apply for a certified Community Tax Certificate (Cedula) through ACORS. This prototype computes sample local community taxes and simulates verification.
          </p>

          <div className="mt-5 grid grid-cols-2 gap-3 text-xs">
            <div className="rounded-2xl border border-zinc-100 bg-zinc-50/80 p-3.5">
              <span className="font-bold text-gray-800">Basic Tax</span>
              <p className="mt-1 font-mono text-base font-extrabold text-red-600">₱5.00</p>
              <p className="text-[11px] text-gray-400">+ additional based on income</p>
            </div>
            <div className="rounded-2xl border border-zinc-100 bg-zinc-50/80 p-3.5">
              <span className="font-bold text-gray-800">Verification</span>
              <p className="mt-1 font-mono text-base font-extrabold text-gray-900">Instant AI</p>
              <p className="text-[11px] text-gray-400">Automated validation</p>
            </div>
          </div>

          <div className="mt-5 rounded-2xl bg-zinc-50 p-4">
            <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-gray-500">Requirements</p>
            <ul className="mt-3 space-y-2 text-xs text-gray-700">
              {["Valid Government ID", "Complete personal information", "Address details", "Income information (if applicable)"].map((r) => (
                <li key={r} className="flex items-center gap-2">
                  <Check size={14} className="text-emerald-600 shrink-0" /> {r}
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-3.5 text-xs text-amber-800 flex items-start gap-2">
            <Info size={16} className="mt-0.5 shrink-0" />
            <span>This is a PROTOTYPE ONLY. Fictional/sample data is used. No real government databases are accessed.</span>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-2.5">
            <span className="text-xs font-bold text-gray-500">Test Mode:</span>
            {["normal", "flagged"].map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setTestMode(m)}
                className={`rounded-xl px-3.5 py-2 text-xs font-bold transition active:scale-95 ${testMode === m ? "bg-red-600 text-white shadow-sm" : "border border-zinc-200 bg-white text-gray-600 hover:bg-zinc-50"}`}
              >
                {m === "normal" ? "Normal (Pass)" : "Flagged (Review)"}
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

  function StepPersonalInfo() {
    const fields = [
      { key: "fullName", label: "Full Name", type: "text", placeholder: "Enter full name" },
      { key: "dob", label: "Date of Birth", type: "date" },
      { key: "address", label: "Address", type: "text", placeholder: "Street, Purok, Barangay" },
      { key: "barangay", label: "Barangay", type: "select", options: ["Casisang", "Kalasungay", "Sumpong", "Bangcud", "Aglayan", "Poblacion", "Other"] },
      { key: "contactNumber", label: "Contact Number", type: "tel", placeholder: "09XX-XXX-XXXX" },
      { key: "email", label: "Email Address", type: "email", placeholder: "your@email.com" },
      { key: "civilStatus", label: "Civil Status", type: "select", options: ["Single", "Married", "Widowed", "Separated"] },
      { key: "occupation", label: "Occupation", type: "text", placeholder: "Enter occupation" },
      { key: "employer", label: "Employer / Business Name", type: "text", placeholder: "Optional" },
      { key: "annualIncome", label: "Annual Income (₱)", type: "number", placeholder: "0 if not applicable" },
    ];

    return (
      <div className="space-y-5 animate-fade-up">
        <div className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex items-center gap-2.5 mb-5">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-red-50 text-red-600 font-bold text-xs">
              1
            </span>
            <div>
              <h2 className="text-sm font-extrabold text-gray-900 sm:text-base">Personal Information</h2>
              <p className="text-xs text-gray-400">Complete taxpayer identity details</p>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {fields.map((f) => (
              <div key={f.key} className={f.key === "address" || f.key === "employer" ? "sm:col-span-2" : ""}>
                <label className="mb-1.5 block text-xs font-bold text-gray-700">{f.label}</label>
                {f.type === "select" ? (
                  <select
                    value={applicant[f.key]}
                    onChange={(e) => setApplicant((p) => ({ ...p, [f.key]: e.target.value }))}
                    className="w-full rounded-xl border border-zinc-200 bg-zinc-50/50 px-3.5 py-2.5 text-xs text-gray-900 focus:border-red-600 focus:bg-white focus:outline-none focus:ring-1 focus:ring-red-600"
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

  function StepUploadID() {
    return (
      <div className="space-y-5 animate-fade-up">
        <div className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex items-center gap-2.5 mb-5">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-red-50 text-red-600 font-bold text-xs">
              2
            </span>
            <div>
              <h2 className="text-sm font-extrabold text-gray-900 sm:text-base">Upload Valid Government ID</h2>
              <p className="text-xs text-gray-400">Required for identity verification</p>
            </div>
          </div>

          {idFile.uploaded ? (
            <div className="flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50/50 p-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 font-extrabold text-xs">ID</div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-gray-900 text-xs sm:text-sm truncate">{idFile.name}</p>
                <p className="text-[11px] text-gray-500">{idFile.size} · {idFile.type}</p>
              </div>
              <CheckCircle2 size={20} className="text-emerald-600 shrink-0" />
            </div>
          ) : (
            <label className="flex cursor-pointer flex-col items-center gap-3 rounded-2xl border-2 border-dashed border-zinc-300 p-8 text-center hover:border-red-400 hover:bg-red-50/30 transition">
              <Upload size={28} className="text-zinc-400" />
              <span className="text-xs sm:text-sm font-bold text-gray-700">Click to upload government ID</span>
              <span className="text-[11px] text-gray-400">JPG, PNG, or PDF · max 5MB</span>
              <input type="file" className="hidden" onChange={() => setIdFile({ name: "uploaded_id.jpg", type: "image/jpeg", size: "1.4 MB", uploaded: true })} />
            </label>
          )}

          {idFile.uploaded && (
            <button
              type="button"
              onClick={() => setIdFile({ name: "", type: "", size: "", uploaded: false })}
              className="mt-3 flex items-center gap-1.5 text-xs font-bold text-red-600 hover:text-red-700"
            >
              <X size={13} /> Remove and re-upload
            </button>
          )}

          <div className="mt-5 rounded-2xl bg-zinc-50 p-3.5 text-xs text-gray-600">
            <p className="font-bold text-gray-800 mb-1">Accepted IDs</p>
            <p className="text-[11px] leading-relaxed text-gray-500">PhilSys ID, Driver's License, Passport, SSS ID, GSIS ID, Voter's ID, PRC ID, Senior Citizen ID</p>
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
              3
            </span>
            <div>
              <h2 className="text-sm font-extrabold text-gray-900 sm:text-base">AI Automated Validation</h2>
              <p className="text-xs text-gray-400">Real-time consistency & readability audit</p>
            </div>
          </div>

          {aiChecks.length === 0 && !aiScanning && (
            <div className="flex flex-col items-center gap-3 py-8 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-600">
                <Sparkles size={28} />
              </div>
              <p className="text-sm font-bold text-gray-800">Ready to validate application</p>
              <p className="max-w-xs text-xs text-gray-500">AI will verify ID authenticity, data completeness, and check for duplicates.</p>
              <button
                type="button"
                onClick={runAIValidation}
                className="mt-2 flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-red-600 px-6 py-3 text-xs font-bold text-white shadow-sm hover:bg-red-700 active:scale-95"
              >
                <Sparkles size={14} /> Run AI Validation
              </button>
            </div>
          )}

          {(aiScanning || aiChecks.length > 0) && (
            <>
              {aiScanning && (
                <div className="mb-4">
                  <div className="flex justify-between text-xs font-bold text-gray-700 mb-1.5">
                    <span>Scanning Application…</span><span>{aiProgress}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-zinc-100 overflow-hidden">
                    <div className="h-full rounded-full bg-red-600 transition-all duration-300" style={{ width: `${aiProgress}%` }} />
                  </div>
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
                    <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-extrabold text-white ${aiStatus === "PASSED" ? "bg-emerald-600" : "bg-amber-600"}`}>
                      {aiStatus}
                    </span>
                  </div>
                  <p className="mt-1.5 text-xs text-gray-600">AI Confidence: <span className="font-bold">96%</span></p>
                </div>
              )}
            </>
          )}
        </div>
        <NavButtons onBack={back} onNext={next} disabled={!ready} />
      </div>
    );
  }

  function StepTaxCalculation() {
    return (
      <div className="space-y-5 animate-fade-up">
        <div className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex items-center gap-2.5 mb-5">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-red-50 text-red-600 font-bold text-xs">
              4
            </span>
            <div>
              <h2 className="text-sm font-extrabold text-gray-900 sm:text-base">Prototype Tax Calculation</h2>
              <p className="text-xs text-gray-400">Simulated Community Tax computation</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between rounded-2xl border border-zinc-100 bg-zinc-50 px-4 py-3 text-xs">
              <span className="text-gray-600">Basic Community Tax</span>
              <span className="font-mono font-bold text-gray-900">₱{basicTax.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between rounded-2xl border border-zinc-100 bg-zinc-50 px-4 py-3 text-xs">
              <div>
                <span className="text-gray-600">Additional Community Tax</span>
                <p className="text-[10px] text-gray-400 mt-0.5">Based on ₱{parseFloat(applicant.annualIncome || 0).toLocaleString()} annual income × 0.1%</p>
              </div>
              <span className="font-mono font-bold text-gray-900">₱{additionalTax.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between rounded-2xl border border-red-100 bg-red-50 px-4 py-3.5">
              <span className="text-xs sm:text-sm font-extrabold text-gray-900">Total Amount Due</span>
              <span className="font-mono text-base sm:text-lg font-extrabold text-red-700">₱{totalTax.toFixed(2)}</span>
            </div>
          </div>

          <div className="mt-5 rounded-2xl border border-amber-100 bg-amber-50/60 p-3.5 text-xs text-amber-800 flex items-start gap-2">
            <Info size={15} className="mt-0.5 shrink-0" />
            <span>Prototype Tax Calculation — computed values are for demonstration purposes only.</span>
          </div>
        </div>
        <NavButtons onBack={back} onNext={next} />
      </div>
    );
  }

  function StepSummary() {
    return (
      <div className="space-y-5 animate-fade-up">
        <div className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm sm:p-6 space-y-3">
          <div className="flex items-center gap-2.5 mb-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-red-50 text-red-600 font-bold text-xs">
              5
            </span>
            <h2 className="text-sm font-extrabold text-gray-900 sm:text-base">Request Summary</h2>
          </div>

          <SummaryRow label="Certificate" value="Community Tax Certificate (Cedula)" />
          <SummaryRow label="Applicant" value={applicant.fullName} />
          <SummaryRow label="Address" value={applicant.address} />
          <SummaryRow label="Occupation" value={applicant.occupation} />
          <SummaryRow label="Civil Status" value={applicant.civilStatus} />
          <SummaryRow label="Annual Income" value={`₱${parseFloat(applicant.annualIncome || 0).toLocaleString()}`} />
          <div className="border-t border-zinc-100 pt-2">
            <SummaryRow label="Basic Community Tax" value={`₱${basicTax.toFixed(2)}`} />
            <SummaryRow label="Additional Community Tax" value={`₱${additionalTax.toFixed(2)}`} />
          </div>
          <div className="flex items-center justify-between rounded-2xl border border-red-100 bg-red-50 px-4 py-3">
            <span className="text-xs sm:text-sm font-extrabold text-gray-900">Total Amount Due</span>
            <span className="font-mono text-base sm:text-lg font-extrabold text-red-700">₱{totalTax.toFixed(2)}</span>
          </div>
          <div className={`rounded-2xl border px-3.5 py-2.5 text-xs font-bold ${aiStatus === "PASSED" ? "border-emerald-200 bg-emerald-50 text-emerald-800" : "border-amber-200 bg-amber-50 text-amber-800"}`}>
            AI Result: {aiStatus}
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
              6
            </span>
            <div>
              <h2 className="text-sm font-extrabold text-gray-900 sm:text-base">Prototype Payment</h2>
              <p className="text-xs text-gray-400">Simulated payment sandbox</p>
            </div>
          </div>

          <div className="mb-5 flex items-center justify-between rounded-2xl border border-red-100 bg-red-50 px-4 py-3">
            <span className="text-xs font-bold text-gray-700">Amount Due</span>
            <span className="font-mono text-lg sm:text-xl font-extrabold text-red-700">₱{totalTax.toFixed(2)}</span>
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
            <div className="flex flex-col items-center gap-3 py-6 text-center">
              <RefreshCw size={24} className="animate-spin text-red-600" />
              <p className="text-xs sm:text-sm font-bold text-gray-700">Processing {paymentMethod} payment…</p>
            </div>
          ) : paymentRef ? (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-center">
              <CheckCircle2 size={28} className="mx-auto text-emerald-600 mb-2" />
              <p className="font-bold text-emerald-800 text-xs sm:text-sm">Payment Successful</p>
              <p className="font-mono text-[11px] sm:text-xs text-emerald-700 mt-1">Ref: {paymentRef}</p>
            </div>
          ) : (
            <button
              type="button"
              onClick={handlePayment}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-red-600 py-3.5 text-xs sm:text-sm font-bold text-white shadow-sm hover:bg-red-700 active:scale-[0.98]"
            >
              Pay ₱{totalTax.toFixed(2)} via {paymentMethod}
            </button>
          )}
        </div>
        {paymentRef && <NavButtons onBack={back} onNext={next} nextLabel="Continue" />}
      </div>
    );
  }

  function StepSubmit() {
    const [submitted, setSubmitted] = useState(false);

    function doSubmit() {
      handleSubmit();
      setSubmitted(true);
    }

    return (
      <div className="space-y-5 animate-fade-up">
        <div className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex items-center gap-2.5 mb-5">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-red-50 text-red-600 font-bold text-xs">
              7
            </span>
            <h2 className="text-sm font-extrabold text-gray-900 sm:text-base">Submit Request</h2>
          </div>

          <div className="space-y-2 mb-5">
            <SummaryRow label="Certificate" value="Community Tax Certificate (Cedula)" />
            <SummaryRow label="Applicant" value={applicant.fullName} />
            <SummaryRow label="Payment" value={`₱${totalTax.toFixed(2)} via ${paymentMethod}`} />
            <SummaryRow label="Payment Ref" value={paymentRef} />
          </div>

          {submitted ? (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-center">
              <CheckCircle2 size={32} className="mx-auto text-emerald-600 mb-3" />
              <p className="font-extrabold text-emerald-900 text-xs sm:text-sm">Request Successfully Submitted</p>
              <p className="font-mono text-xs sm:text-sm text-emerald-700 mt-1">{generatedReqId}</p>
              <p className="text-[11px] text-gray-500 mt-2">{submittedTime}</p>
            </div>
          ) : (
            <button
              type="button"
              onClick={doSubmit}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-red-600 py-3.5 text-xs sm:text-sm font-bold text-white shadow-sm hover:bg-red-700 active:scale-[0.98]"
            >
              <ShieldCheck size={16} /> Submit Application
            </button>
          )}
        </div>
        {submitted && <NavButtons onBack={back} onNext={next} nextLabel="View Tracking" />}
      </div>
    );
  }

  function StepTracking() {
    const trackSteps = [
      { label: "Application Submitted", done: true },
      { label: "AI Validation", done: true },
      { label: "Information Verified", done: true },
      { label: "Payment Confirmed", done: true },
      { label: "Certificate Processing", done: false, active: true },
      { label: "Certificate Ready", done: false },
    ];

    return (
      <div className="space-y-5 animate-fade-up">
        <div className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm sm:p-6">
          <h2 className="text-sm font-extrabold text-gray-900 mb-1">Request Tracking</h2>
          <p className="font-mono text-xs text-red-600 mb-5">{generatedReqId}</p>

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
          View Certificate <ArrowRight size={16} />
        </button>
      </div>
    );
  }

  function StepCertificateReady() {
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
          <p className="text-base sm:text-lg font-extrabold text-gray-900">Certificate Ready</p>
          <p className="text-xs text-gray-500 mt-1">Your Community Tax Certificate has been processed.</p>
          <p className="font-mono text-xs sm:text-sm font-bold text-emerald-700 mt-2">{issuedCertNo}</p>
        </div>

        {/* Sample Certificate */}
        <div className="relative overflow-hidden rounded-3xl border-2 border-zinc-200 bg-white p-5 sm:p-6 shadow-sm">
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
            <span className="text-4xl sm:text-5xl font-extrabold text-zinc-100 rotate-[-30deg] tracking-widest uppercase">SAMPLE</span>
          </div>
          <div className="relative z-10">
            <div className="text-center border-b border-zinc-200 pb-4 mb-4">
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Republic of the Philippines</p>
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">City of Malaybalay, Bukidnon</p>
              <p className="mt-2 text-xs font-extrabold uppercase tracking-[0.2em] text-red-700">Community Tax Certificate</p>
              <p className="text-[10px] text-gray-500">(Cedula)</p>
              <p className="font-mono text-xs font-bold text-gray-700 mt-1">{issuedCertNo}</p>
            </div>

            <div className="space-y-2 text-xs">
              <SummaryRow label="Full Name" value={applicant.fullName} />
              <SummaryRow label="Address" value={applicant.address} />
              <SummaryRow label="Date of Birth" value={applicant.dob} />
              <SummaryRow label="Occupation" value={applicant.occupation} />
              <SummaryRow label="Civil Status" value={applicant.civilStatus} />
              <SummaryRow label="Total Tax Paid" value={`₱${totalTax.toFixed(2)}`} />
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
            onClick={() => setNotificationToast("Certificate downloaded (prototype).")}
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
            <h3 className="text-sm font-extrabold text-gray-900">QR Certificate Verification</h3>
            <button onClick={() => setShowQRModal(false)} className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-100"><X size={16} /></button>
          </div>
          <div className="flex h-36 w-36 mx-auto items-center justify-center rounded-2xl bg-zinc-100 mb-4">
            <QrCode size={64} className="text-zinc-400" />
          </div>
          <div className="space-y-2 text-xs border-t border-zinc-100 pt-4">
            <SummaryRow label="Certificate No." value={issuedCertNo} />
            <SummaryRow label="Type" value="Community Tax Certificate (Cedula)" />
            <SummaryRow label="Applicant" value={applicant.fullName} />
            <SummaryRow label="Request ID" value={generatedReqId} />
          </div>
          <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 py-2 text-center">
            <span className="text-xs font-extrabold text-emerald-700">VALID — Digital Seal Verified</span>
          </div>
          <p className="mt-3 text-center text-[10px] text-zinc-400 uppercase tracking-wider">SAMPLE – NOT AN OFFICIAL GOVERNMENT DOCUMENT</p>
        </div>
      </div>
    );
  }

  const stepComponents = [
    <StepStart />, <StepPersonalInfo />, <StepUploadID />, <StepAIValidation />,
    <StepTaxCalculation />, <StepSummary />, <StepPayment />, <StepSubmit />,
    <StepTracking />, <StepCertificateReady />,
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
          Treasurer Portal
        </span>
      </div>

      {/* Header Banner matching LCRO */}
      <div className="mt-4 flex items-center gap-3.5 rounded-3xl border border-zinc-200 bg-white p-4 shadow-sm sm:p-5 animate-fade-up">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-red-600 text-white shadow-md">
          <Wallet size={22} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-red-600">
            City Treasurer&apos;s Office
          </p>
          <h1 className="text-lg font-extrabold leading-tight text-gray-900 sm:text-xl">
            Community Tax Certificate (Cedula)
          </h1>
          <p className="mt-0.5 text-xs text-gray-500">
            Computed tax rate · Instant AI validation
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

function SummaryRow({ label, value }) {
  return (
    <div className="flex items-start justify-between gap-4 py-1.5 border-b border-zinc-50 last:border-0">
      <span className="text-gray-400 text-xs shrink-0">{label}</span>
      <span className="text-xs font-bold text-gray-900 text-right">{value}</span>
    </div>
  );
}
