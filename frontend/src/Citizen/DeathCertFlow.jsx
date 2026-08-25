// src/Citizen/DeathCertFlow.jsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  FileText,
  Upload,
  ShieldCheck,
  Building,
  CreditCard,
  QrCode,
  Download,
  Eye,
  RefreshCw,
  Sparkles,
  Check,
  ChevronRight,
  User,
  MapPin,
  Clock3,
  Calendar,
  Layers,
  X,
  FileCheck,
  Info,
  Activity,
  Heart,
  Skull,
} from "lucide-react";
import {
  findMockDeathRecord,
  saveLCRORequest,
} from "../services/lcroData";

const STEPS = [
  "Start Application",
  "Requester Info",
  "Death Record Info",
  "Upload Requirements",
  "AI Validation",
  "Record Verification",
  "Request Summary",
  "Prototype Payment",
  "Submit Request",
  "Tracking",
  "Certificate Ready",
];

export default function DeathCertFlow({ office, cert }) {
  // Step tracker: 1-11
  const [currentStep, setCurrentStep] = useState(1);

  // Prototype Test Mode: normal match vs flagged mismatch
  const [testMode, setTestMode] = useState("normal"); // "normal" | "flagged"

  // 1. Requester Form
  const [requester, setRequester] = useState({
    fullName: "Juan Dela Cruz",
    address: "Purok 3, Casisang, Malaybalay City, Bukidnon",
    contactNumber: "0918-992-1134",
    email: "juan.delacruz@gmail.com",
    relationship: "Child", // Spouse, Parent, Child, Sibling, Nearest Kin, Authorized Representative, Other
    relationshipOther: "",
  });

  // 2. Death Record Form
  const [deathRecord, setDeathRecord] = useState({
    deceasedName: "Pedro Dela Cruz",
    dob: "1950-01-10",
    dateOfDeath: "2025-08-15",
    placeOfDeath: "Malaybalay City, Bukidnon",
    sex: "Male",
    copies: 1,
    purpose: "Estate/Inheritance",
    purposeOther: "",
  });

  // 3. Uploaded Files
  const [idFile, setIdFile] = useState({
    name: "philid_juan_delacruz.jpg",
    type: "image/jpeg",
    size: "1.8 MB",
    uploaded: true,
  });

  const [authFile, setAuthFile] = useState({
    name: "proof_of_authority_authorization.pdf",
    type: "application/pdf",
    size: "1.2 MB",
    uploaded: false,
  });

  // 4. AI Validation State
  const [aiScanning, setAiScanning] = useState(false);
  const [aiProgress, setAiProgress] = useState(0);
  const [aiChecks, setAiChecks] = useState([]);

  // 5. Registry Match State
  const [matchedRecord, setMatchedRecord] = useState(null);
  const [isVerifying, setIsVerifying] = useState(false);

  // 6. Payment State
  const [paymentMethod, setPaymentMethod] = useState("GCash");
  const [paymentRef, setPaymentRef] = useState("");
  const [paymentProcessing, setPaymentProcessing] = useState(false);

  // 7. Submitted Request State
  const [generatedReqId, setGeneratedReqId] = useState("");
  const [issuedCertNo, setIssuedCertNo] = useState("");
  const [submittedTime, setSubmittedTime] = useState("");

  // 8. Modals
  const [showQRModal, setShowQRModal] = useState(false);
  const [showCertModal, setShowCertModal] = useState(false);
  const [notificationToast, setNotificationToast] = useState(null);

  // Switch test data presets when testMode changes
  const applyPreset = (mode) => {
    setTestMode(mode);
    if (mode === "normal") {
      setRequester({
        fullName: "Juan Dela Cruz",
        address: "Purok 3, Casisang, Malaybalay City, Bukidnon",
        contactNumber: "0918-992-1134",
        email: "juan.delacruz@gmail.com",
        relationship: "Child",
        relationshipOther: "",
      });
      setDeathRecord({
        deceasedName: "Pedro Dela Cruz",
        dob: "1950-01-10",
        dateOfDeath: "2025-08-15",
        placeOfDeath: "Malaybalay City, Bukidnon",
        sex: "Male",
        copies: 1,
        purpose: "Estate/Inheritance",
        purposeOther: "",
      });
      setIdFile({
        name: "philid_juan_delacruz.jpg",
        type: "image/jpeg",
        size: "1.8 MB",
        uploaded: true,
      });
    } else {
      // Flagged Mismatch preset
      setRequester({
        fullName: "Carlos Ramos",
        address: "Purok 1, Poblacion, Malaybalay City",
        contactNumber: "0917-440-2211",
        email: "carlos.ramos@gmail.com",
        relationship: "Authorized Representative",
        relationshipOther: "",
      });
      setDeathRecord({
        deceasedName: "Teresa Garcia Ramos",
        dob: "1962-03-22",
        dateOfDeath: "2024-11-10",
        placeOfDeath: "Malaybalay City, Bukidnon",
        sex: "Female",
        copies: 2,
        purpose: "Insurance Claim",
        purposeOther: "",
      });
      setIdFile({
        name: "drivers_license_carlos.jpg",
        type: "image/jpeg",
        size: "2.1 MB",
        uploaded: true,
      });
      setAuthFile({
        name: "notarized_authorization_letter.pdf",
        type: "application/pdf",
        size: "890 KB",
        uploaded: true,
      });
    }
  };

  const handleStartApplication = () => {
    setCurrentStep(2);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleRequesterNext = (e) => {
    e.preventDefault();
    setCurrentStep(3);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDeathRecordNext = (e) => {
    e.preventDefault();
    setCurrentStep(4);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleUploadsNext = () => {
    setCurrentStep(5);
    window.scrollTo({ top: 0, behavior: "smooth" });
    runAIValidation();
  };

  // Step 5: Simulate AI Validation
  const runAIValidation = () => {
    setAiScanning(true);
    setAiProgress(0);
    setAiChecks([]);

    const checklist = [
      { label: "Application Completeness", passed: true },
      { label: "Required Fields Complete", passed: true },
      { label: "Valid ID Detected", passed: true },
      { label: "ID Readable & Clear", passed: true },
      {
        label: "Information Consistency",
        passed: testMode === "normal",
        note:
          testMode === "normal"
            ? "Identity details match application data"
            : "Hospital death registry date has 1-day variance",
      },
      { label: "Requirements Complete", passed: true },
    ];

    let current = 0;
    const interval = setInterval(() => {
      current += 20;
      setAiProgress(current);
      if (current >= 100) {
        clearInterval(interval);
        setAiChecks(checklist);
        setAiScanning(false);
      }
    }, 280);
  };

  const handleAIValidationNext = () => {
    setCurrentStep(6);
    window.scrollTo({ top: 0, behavior: "smooth" });
    runRecordVerification();
  };

  // Step 6: Mock Death Record Verification
  const runRecordVerification = () => {
    setIsVerifying(true);
    setTimeout(() => {
      const rec = findMockDeathRecord(deathRecord.deceasedName, deathRecord.dateOfDeath);
      setMatchedRecord(rec || null);
      setIsVerifying(false);
    }, 1000);
  };

  const handleRecordVerificationNext = () => {
    setCurrentStep(7);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Step 7 -> 8: Proceed to Payment
  const handleProceedToPayment = () => {
    setCurrentStep(8);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Step 8: Execute Prototype Payment
  const handleExecutePayment = () => {
    setPaymentProcessing(true);
    setTimeout(() => {
      const fakeRef = `ACORS-PAY-20260825-${Math.floor(100 + Math.random() * 900)}`;
      setPaymentRef(fakeRef);
      setPaymentProcessing(false);
      setCurrentStep(9);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 1200);
  };

  // Step 9: Final Submit Request
  const handleSubmitRequest = () => {
    const randomSeq = Math.floor(100000 + Math.random() * 900000);
    const reqId = `ACORS-LCRO-2026-${randomSeq}`;
    const certNo = `LCRO-DC-2026-000${Math.floor(100 + Math.random() * 900)}`;
    const now = new Date().toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    setGeneratedReqId(reqId);
    setIssuedCertNo(certNo);
    setSubmittedTime(now);

    const isAutoApproved = testMode === "normal";

    const newRequest = {
      id: reqId,
      certificateType: "Death Certificate – Certified Copy",
      submittedAt: now,
      status: isAutoApproved ? "Approved" : "Requires LGU Review",
      applicant: { ...requester },
      deathRecord: { ...deathRecord },
      idUpload: {
        idType: "Philippine Government ID",
        fileName: idFile.name,
        fileType: idFile.type,
        readable: true,
        hasAuthorization: Boolean(authFile.uploaded),
      },
      aiValidation: {
        status: isAutoApproved ? "PASSED" : "FLAGGED",
        confidence: isAutoApproved ? "96%" : "81%",
        checks: aiChecks,
        recommendation: isAutoApproved ? "PASSED" : "REQUIRES LGU REVIEW",
      },
      recordVerification: {
        status: isAutoApproved ? "MATCHED" : "UNRESOLVED",
        recordId: matchedRecord?.recordId || "DEATH-0001",
        registryBook: matchedRecord?.registryBook || "Book No. 24, Page 88, Registry No. 25-0312",
        message: isAutoApproved
          ? "✓ Death Record Found — Exact Civil Registry Match in Book 24"
          : "⚠️ Hospital registry record date variance — pending LCRO clerk review",
      },
      payment: {
        amount: deathRecord.copies * 100,
        method: paymentMethod,
        reference: paymentRef,
        paidAt: now,
        status: "Confirmed",
      },
      certificateNumber: isAutoApproved ? certNo : null,
      issueDate: isAutoApproved ? "August 25, 2026" : null,
    };

    saveLCRORequest(newRequest);
    setCurrentStep(10);
    window.scrollTo({ top: 0, behavior: "smooth" });

    // If auto-approved, trigger the notification after a brief delay
    if (isAutoApproved) {
      setTimeout(() => {
        setNotificationToast({
          title: "Your Death Certificate – Certified Copy is ready.",
          certNo: certNo,
          reqId: reqId,
        });
      }, 2500);
    }
  };

  const isRepresentative =
    requester.relationship === "Authorized Representative" || requester.relationship === "Other";

  return (
    <div className="mx-auto max-w-xl px-4 pb-24 pt-4 sm:px-6 sm:pt-6 font-sans">
      {/* Top Breadcrumb Navigation */}
      <div className="mb-4 flex items-center justify-between">
        <Link
          to="/request-certificate"
          className="inline-flex items-center gap-1.5 rounded-xl px-2.5 py-1 text-xs font-bold text-gray-500 transition hover:bg-zinc-100 hover:text-gray-800"
        >
          <ArrowLeft size={14} />
          Back to Certificates
        </Link>

        {/* Step Indicator Badge */}
        <span className="rounded-full bg-zinc-100 px-3 py-1 font-mono text-[11px] font-bold text-gray-700">
          Step {currentStep} of 11
        </span>
      </div>

      {/* Progress Bar */}
      <div className="mb-6 h-1.5 w-full overflow-hidden rounded-full bg-zinc-200">
        <div
          className="h-full rounded-full bg-red-600 transition-all duration-300 ease-out"
          style={{ width: `${(currentStep / 11) * 100}%` }}
        />
      </div>

      {/* Ready Notification Toast */}
      {notificationToast && (
        <div className="mb-5 animate-fade-down rounded-3xl border border-emerald-200 bg-emerald-50/95 p-4 shadow-lg">
          <div className="flex items-start gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-sm">
              <CheckCircle2 size={18} />
            </span>
            <div className="min-w-0 flex-1">
              <span className="font-mono text-[10px] font-extrabold uppercase tracking-wider text-emerald-800">
                Official Document Ready
              </span>
              <p className="font-extrabold text-sm text-emerald-950">
                {notificationToast.title}
              </p>
              <p className="text-xs text-emerald-800 font-mono mt-0.5">
                Cert No: {notificationToast.certNo}
              </p>

              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setShowCertModal(true)}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-700 px-3 py-1.5 text-xs font-bold text-white shadow-sm hover:bg-emerald-800 active:scale-95 transition"
                >
                  <Eye size={13} />
                  View Certificate
                </button>
                <button
                  type="button"
                  onClick={() => {
                    alert("Sample Certificate downloaded successfully.");
                  }}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-300 bg-white px-3 py-1.5 text-xs font-bold text-emerald-800 shadow-sm hover:bg-emerald-100/60 transition"
                >
                  <Download size={13} />
                  Download
                </button>
                <button
                  type="button"
                  onClick={() => setShowQRModal(true)}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-300 bg-white px-3 py-1.5 text-xs font-bold text-emerald-800 shadow-sm hover:bg-emerald-100/60 transition"
                >
                  <QrCode size={13} />
                  Verify Certificate
                </button>
              </div>
            </div>
            <button
              onClick={() => setNotificationToast(null)}
              className="text-emerald-500 hover:text-emerald-700"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      {/* =========================================================================
          STEP 1: CERTIFICATE INFORMATION
         ========================================================================= */}
      {currentStep === 1 && (
        <div className="space-y-6 animate-fade-up">
          {/* Header Banner */}
          <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-red-600 text-white shadow-sm">
                <FileText size={22} />
              </span>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-red-600">
                  Civil Registrar Services
                </p>
                <h1 className="text-xl font-extrabold text-gray-900 sm:text-2xl">
                  Death Certificate – Certified Copy
                </h1>
              </div>
            </div>

            <p className="mt-4 text-xs leading-relaxed text-gray-600 sm:text-sm">
              Request a certified copy of an existing death record through ACORS.
            </p>

            <div className="mt-5 rounded-2xl bg-zinc-50 p-4 border border-zinc-200">
              <h2 className="text-xs font-extrabold uppercase tracking-wider text-gray-700">
                Application Requirements:
              </h2>
              <ul className="mt-2 space-y-2 text-xs text-gray-600">
                <li className="flex items-center gap-2">
                  <Check size={14} className="text-emerald-600" />
                  <span>Valid Government ID</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check size={14} className="text-emerald-600" />
                  <span>Complete information about the deceased</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check size={14} className="text-emerald-600" />
                  <span>Contact information</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check size={14} className="text-emerald-600" />
                  <span>Proof of relationship / authority when applicable</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check size={14} className="text-emerald-600" />
                  <span>Authorization Letter / Proof of Authority when applicable</span>
                </li>
              </ul>
            </div>

            {/* Simulation Preset Selector */}
            <div className="mt-5 rounded-2xl border border-dashed border-red-200 bg-red-50/40 p-3.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-red-900 flex items-center gap-1.5">
                  <Sparkles size={14} />
                  Prototype Testing Simulation Mode
                </span>
                <span className="font-mono text-[10px] text-red-600 font-bold">LCRO Demo</span>
              </div>
              <div className="mt-2.5 flex gap-2">
                <button
                  type="button"
                  onClick={() => applyPreset("normal")}
                  className={`flex-1 rounded-xl py-2 font-bold text-xs transition ${
                    testMode === "normal"
                      ? "bg-red-600 text-white shadow-sm"
                      : "bg-white border border-red-200 text-red-800 hover:bg-red-50"
                  }`}
                >
                  ✓ Normal Match (Pedro Dela Cruz)
                </button>
                <button
                  type="button"
                  onClick={() => applyPreset("flagged")}
                  className={`flex-1 rounded-xl py-2 font-bold text-xs transition ${
                    testMode === "flagged"
                      ? "bg-amber-600 text-white shadow-sm"
                      : "bg-white border border-amber-200 text-amber-800 hover:bg-amber-50"
                  }`}
                >
                  ⚠️ Flagged Mismatch (Teresa Ramos)
                </button>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between border-t border-zinc-100 pt-4 text-xs">
              <div>
                <span className="text-gray-400 block text-[10px] uppercase font-bold">Statutory Fee</span>
                <span className="font-mono font-extrabold text-gray-900 text-base">₱100.00 / copy</span>
              </div>

              <button
                type="button"
                onClick={handleStartApplication}
                className="flex items-center gap-2 rounded-2xl bg-red-600 px-6 py-3 text-xs font-bold text-white shadow-sm transition hover:bg-red-700 active:scale-95"
              >
                <span>Start Application</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          STEP 2: REQUESTER INFORMATION
         ========================================================================= */}
      {currentStep === 2 && (
        <form onSubmit={handleRequesterNext} className="space-y-6 animate-fade-up">
          <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2.5 pb-4 border-b border-zinc-100">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-red-50 text-red-600 font-bold text-xs">
                1
              </span>
              <div>
                <h2 className="text-base font-extrabold text-gray-900">
                  Requester Information
                </h2>
                <p className="text-xs text-gray-500">
                  Provide your identity and contact details as the applicant.
                </p>
              </div>
            </div>

            <div className="mt-5 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={requester.fullName}
                  onChange={(e) => setRequester({ ...requester, fullName: e.target.value })}
                  placeholder="e.g. Juan Dela Cruz"
                  className="w-full rounded-xl border border-zinc-200 px-3.5 py-2.5 text-xs text-gray-900 focus:border-red-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">
                  Residential Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={requester.address}
                  onChange={(e) => setRequester({ ...requester, address: e.target.value })}
                  placeholder="e.g. Purok 3, Casisang, Malaybalay City"
                  className="w-full rounded-xl border border-zinc-200 px-3.5 py-2.5 text-xs text-gray-900 focus:border-red-600 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">
                    Contact Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={requester.contactNumber}
                    onChange={(e) => setRequester({ ...requester, contactNumber: e.target.value })}
                    placeholder="0918-000-0000"
                    className="w-full rounded-xl border border-zinc-200 px-3.5 py-2.5 text-xs text-gray-900 focus:border-red-600 focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={requester.email}
                    onChange={(e) => setRequester({ ...requester, email: e.target.value })}
                    placeholder="name@example.com"
                    className="w-full rounded-xl border border-zinc-200 px-3.5 py-2.5 text-xs text-gray-900 focus:border-red-600 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">
                  Relationship to the Deceased <span className="text-red-500">*</span>
                </label>
                <select
                  value={requester.relationship}
                  onChange={(e) => setRequester({ ...requester, relationship: e.target.value })}
                  className="w-full rounded-xl border border-zinc-200 bg-white px-3.5 py-2.5 text-xs font-medium text-gray-900 focus:border-red-600 focus:outline-none"
                >
                  <option value="Spouse">Spouse</option>
                  <option value="Parent">Parent</option>
                  <option value="Child">Child</option>
                  <option value="Sibling">Sibling</option>
                  <option value="Nearest Kin">Nearest Kin</option>
                  <option value="Authorized Representative">Authorized Representative</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {isRepresentative && (
                <div className="rounded-2xl border border-amber-200 bg-amber-50/60 p-4 animate-fade-in">
                  <div className="flex items-center gap-2 font-bold text-amber-900">
                    <Info size={16} />
                    <span>Proof of Authority Required</span>
                  </div>
                  <p className="mt-1 text-[11px] text-amber-800">
                    Since you are requesting on behalf of the deceased as an {requester.relationship}, you will be asked to upload a signed Authorization Letter or Special Power of Attorney in Step 4.
                  </p>
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-end gap-3 border-t border-zinc-100 pt-4">
              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                className="rounded-xl border border-zinc-200 px-4 py-2.5 text-xs font-bold text-gray-600 hover:bg-zinc-50"
              >
                Back
              </button>
              <button
                type="submit"
                className="rounded-xl bg-red-600 px-6 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-red-700"
              >
                Next: Death Record Details
              </button>
            </div>
          </div>
        </form>
      )}

      {/* =========================================================================
          STEP 3: DEATH RECORD INFORMATION
         ========================================================================= */}
      {currentStep === 3 && (
        <form onSubmit={handleDeathRecordNext} className="space-y-6 animate-fade-up">
          <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2.5 pb-4 border-b border-zinc-100">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-red-50 text-red-600 font-bold text-xs">
                2
              </span>
              <div>
                <h2 className="text-base font-extrabold text-gray-900">
                  Death Record Information
                </h2>
                <p className="text-xs text-gray-500">
                  Enter the official registered details of the deceased.
                </p>
              </div>
            </div>

            <div className="mt-5 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">
                  Complete Name of Deceased <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={deathRecord.deceasedName}
                  onChange={(e) => setDeathRecord({ ...deathRecord, deceasedName: e.target.value })}
                  placeholder="e.g. Pedro Dela Cruz"
                  className="w-full rounded-xl border border-zinc-200 px-3.5 py-2.5 text-xs text-gray-900 focus:border-red-600 focus:outline-none font-semibold"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">
                    Date of Death <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={deathRecord.dateOfDeath}
                    onChange={(e) => setDeathRecord({ ...deathRecord, dateOfDeath: e.target.value })}
                    className="w-full rounded-xl border border-zinc-200 px-3.5 py-2.5 text-xs text-gray-900 focus:border-red-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">
                    Date of Birth (if available)
                  </label>
                  <input
                    type="date"
                    value={deathRecord.dob}
                    onChange={(e) => setDeathRecord({ ...deathRecord, dob: e.target.value })}
                    className="w-full rounded-xl border border-zinc-200 px-3.5 py-2.5 text-xs text-gray-900 focus:border-red-600 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">
                    Place of Death <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={deathRecord.placeOfDeath}
                    onChange={(e) => setDeathRecord({ ...deathRecord, placeOfDeath: e.target.value })}
                    placeholder="e.g. Malaybalay City, Bukidnon"
                    className="w-full rounded-xl border border-zinc-200 px-3.5 py-2.5 text-xs text-gray-900 focus:border-red-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">
                    Sex <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={deathRecord.sex}
                    onChange={(e) => setDeathRecord({ ...deathRecord, sex: e.target.value })}
                    className="w-full rounded-xl border border-zinc-200 bg-white px-3.5 py-2.5 text-xs font-medium text-gray-900 focus:border-red-600 focus:outline-none"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">
                    Number of Copies <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={deathRecord.copies}
                    onChange={(e) =>
                      setDeathRecord({ ...deathRecord, copies: parseInt(e.target.value) })
                    }
                    className="w-full rounded-xl border border-zinc-200 bg-white px-3.5 py-2.5 text-xs font-medium text-gray-900 focus:border-red-600 focus:outline-none"
                  >
                    <option value={1}>1 copy (₱100.00)</option>
                    <option value={2}>2 copies (₱200.00)</option>
                    <option value={3}>3 copies (₱300.00)</option>
                    <option value={5}>5 copies (₱500.00)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">
                    Purpose of Request <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={deathRecord.purpose}
                    onChange={(e) => setDeathRecord({ ...deathRecord, purpose: e.target.value })}
                    className="w-full rounded-xl border border-zinc-200 bg-white px-3.5 py-2.5 text-xs font-medium text-gray-900 focus:border-red-600 focus:outline-none"
                  >
                    <option value="Personal Use">Personal Use</option>
                    <option value="Legal Requirement">Legal Requirement</option>
                    <option value="Insurance Claim">Insurance Claim</option>
                    <option value="Estate/Inheritance">Estate/Inheritance</option>
                    <option value="Government Transaction">Government Transaction</option>
                    <option value="School Requirement">School Requirement</option>
                    <option value="Employment">Employment</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3 border-t border-zinc-100 pt-4">
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="rounded-xl border border-zinc-200 px-4 py-2.5 text-xs font-bold text-gray-600 hover:bg-zinc-50"
              >
                Back
              </button>
              <button
                type="submit"
                className="rounded-xl bg-red-600 px-6 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-red-700"
              >
                Next: Upload Requirements
              </button>
            </div>
          </div>
        </form>
      )}

      {/* =========================================================================
          STEP 4: UPLOAD REQUIREMENTS
         ========================================================================= */}
      {currentStep === 4 && (
        <div className="space-y-6 animate-fade-up">
          <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2.5 pb-4 border-b border-zinc-100">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-red-50 text-red-600 font-bold text-xs">
                3
              </span>
              <div>
                <h2 className="text-base font-extrabold text-gray-900">
                  Upload Requirements
                </h2>
                <p className="text-xs text-gray-500">
                  Upload clear scanned copies or photos of required documents.
                </p>
              </div>
            </div>

            <div className="mt-5 space-y-4 text-xs">
              {/* Document 1: Valid Government ID */}
              <div className="rounded-2xl border border-zinc-200 bg-zinc-50/50 p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="font-bold text-gray-900 block text-xs">
                      1. Valid Government ID <span className="text-red-500">*</span>
                    </span>
                    <p className="text-[11px] text-gray-500 mt-0.5">
                      PhilID, Passport, Driver&apos;s License, UMID, PRC ID, Voter&apos;s ID.
                    </p>
                  </div>
                  <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700">
                    Uploaded & Verified
                  </span>
                </div>

                <div className="mt-3 flex items-center justify-between rounded-xl border border-zinc-200 bg-white p-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-50 text-red-600 font-bold text-[10px]">
                      IMG
                    </span>
                    <div className="min-w-0">
                      <p className="truncate font-mono text-xs font-bold text-gray-800">
                        {idFile.name}
                      </p>
                      <p className="text-[10px] text-gray-400">
                        {idFile.type} · {idFile.size}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => alert("Replace ID image dialog opened.")}
                      className="rounded-lg border border-zinc-200 bg-zinc-50 px-2.5 py-1 text-[11px] font-bold text-gray-700 hover:bg-zinc-100"
                    >
                      Replace
                    </button>
                    <button
                      type="button"
                      onClick={() => alert("Document removed. Please re-upload.")}
                      className="rounded-lg p-1 text-gray-400 hover:bg-red-50 hover:text-red-600"
                    >
                      <X size={14} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Document 2: Proof of Relationship / Authorization Letter */}
              {isRepresentative ? (
                <div className="rounded-2xl border border-zinc-200 bg-zinc-50/50 p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="font-bold text-gray-900 block text-xs">
                        2. Proof of Authority / Authorization Letter <span className="text-red-500">*</span>
                      </span>
                      <p className="text-[11px] text-gray-500 mt-0.5">
                        Signed authorization letter, SPA, or proof of kinship.
                      </p>
                    </div>
                    <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700">
                      Uploaded
                    </span>
                  </div>

                  <div className="mt-3 flex items-center justify-between rounded-xl border border-zinc-200 bg-white p-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600 font-bold text-[10px]">
                        PDF
                      </span>
                      <div className="min-w-0">
                        <p className="truncate font-mono text-xs font-bold text-gray-800">
                          {authFile.name}
                        </p>
                        <p className="text-[10px] text-gray-400">
                          {authFile.type} · {authFile.size}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => alert("Replace dialog.")}
                        className="rounded-lg border border-zinc-200 bg-zinc-50 px-2.5 py-1 text-[11px] font-bold text-gray-700 hover:bg-zinc-100"
                      >
                        Replace
                      </button>
                      <button
                        type="button"
                        onClick={() => alert("Document removed.")}
                        className="rounded-lg p-1 text-gray-400 hover:bg-red-50 hover:text-red-600"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-zinc-200 p-3.5 text-center text-gray-400 text-xs">
                  <span>Additional documents (Optional for direct immediate kin)</span>
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-end gap-3 border-t border-zinc-100 pt-4">
              <button
                type="button"
                onClick={() => setCurrentStep(3)}
                className="rounded-xl border border-zinc-200 px-4 py-2.5 text-xs font-bold text-gray-600 hover:bg-zinc-50"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleUploadsNext}
                className="flex items-center gap-2 rounded-xl bg-red-600 px-6 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-red-700"
              >
                <Sparkles size={14} />
                Run AI Validation Check
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          STEP 5: AI VALIDATION
         ========================================================================= */}
      {currentStep === 5 && (
        <div className="space-y-6 animate-fade-up">
          <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between pb-4 border-b border-zinc-100">
              <div className="flex items-center gap-2">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-600 text-white shadow-sm">
                  <Sparkles size={18} />
                </span>
                <div>
                  <h2 className="text-base font-extrabold text-gray-900">
                    🤖 AI Automated Validation
                  </h2>
                  <p className="text-xs text-gray-500">
                    Scanning application data and document clarity in real-time.
                  </p>
                </div>
              </div>

              {!aiScanning && (
                <span
                  className={`rounded-full px-3 py-1 font-mono text-[11px] font-extrabold ${
                    testMode === "normal"
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      : "bg-amber-50 text-amber-700 border border-amber-200"
                  }`}
                >
                  {testMode === "normal" ? "PASSED (96% Confidence)" : "REQUIRES LGU REVIEW (81%)"}
                </span>
              )}
            </div>

            {aiScanning ? (
              <div className="py-12 text-center">
                <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-red-200 border-t-red-600" />
                <p className="mt-4 text-xs font-bold text-gray-800">
                  AI Validation in Progress ({aiProgress}%)...
                </p>
                <p className="mt-1 text-[11px] text-gray-400">
                  Inspecting document OCR text and field cross-consistency.
                </p>
              </div>
            ) : (
              <div className="mt-5 space-y-4">
                <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4 space-y-2.5 text-xs">
                  {aiChecks.map((chk, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {chk.passed ? (
                          <CheckCircle2 size={15} className="text-emerald-600" />
                        ) : (
                          <AlertCircle size={15} className="text-amber-600" />
                        )}
                        <span className="font-medium text-gray-800">{chk.label}</span>
                      </div>
                      <span
                        className={`font-mono text-[11px] font-bold ${
                          chk.passed ? "text-emerald-700" : "text-amber-700"
                        }`}
                      >
                        {chk.passed ? "✓ Passed" : "⚠️ Variance Detected"}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="rounded-2xl bg-zinc-100/70 p-3.5 text-[11px] text-gray-600">
                  <p className="font-semibold text-gray-800">
                    AI Disclaimer:
                  </p>
                  <p className="mt-0.5 text-gray-500">
                    The AI validation module only screens submitted details for formatting and clarity. It does not access real government databases.
                  </p>
                </div>
              </div>
            )}

            {!aiScanning && (
              <div className="mt-6 flex justify-end gap-3 border-t border-zinc-100 pt-4">
                <button
                  type="button"
                  onClick={() => setCurrentStep(4)}
                  className="rounded-xl border border-zinc-200 px-4 py-2.5 text-xs font-bold text-gray-600 hover:bg-zinc-50"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleAIValidationNext}
                  className="rounded-xl bg-red-600 px-6 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-red-700"
                >
                  Next: Civil Registry Verification
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* =========================================================================
          STEP 6: MOCK DEATH RECORD VERIFICATION
         ========================================================================= */}
      {currentStep === 6 && (
        <div className="space-y-6 animate-fade-up">
          <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2.5 pb-4 border-b border-zinc-100">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-red-50 text-red-600 font-bold text-xs">
                5
              </span>
              <div>
                <h2 className="text-base font-extrabold text-gray-900">
                  Civil Registry Record Verification
                </h2>
                <p className="text-xs text-gray-500">
                  Cross-referencing against the local civil registry death archives.
                </p>
              </div>
            </div>

            {isVerifying ? (
              <div className="py-12 text-center">
                <RefreshCw size={24} className="mx-auto animate-spin text-red-600" />
                <p className="mt-4 text-xs font-bold text-gray-800">
                  Searching Local Civil Registry Death Archives...
                </p>
              </div>
            ) : matchedRecord ? (
              <div className="mt-5 space-y-4 text-xs">
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-4">
                  <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
                    <CheckCircle2 size={18} className="text-emerald-600" />
                    <span>✓ Death Record Found & Verified</span>
                  </div>
                  <p className="mt-1 text-emerald-700 text-xs">
                    Information matched with official Civil Registry archives.
                  </p>

                  <div className="mt-4 rounded-xl bg-white p-3.5 border border-emerald-100 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Record ID:</span>
                      <span className="font-mono font-bold text-gray-900">{matchedRecord.recordId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Deceased:</span>
                      <span className="font-bold text-gray-900">{matchedRecord.deceasedName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Date of Death:</span>
                      <span className="font-medium text-gray-900">{matchedRecord.dateOfDeath}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Place of Death:</span>
                      <span className="font-medium text-gray-900">{matchedRecord.placeOfDeath}</span>
                    </div>
                    <div className="flex justify-between border-t border-zinc-100 pt-1.5">
                      <span className="text-gray-400">Registry Reference:</span>
                      <span className="font-mono text-emerald-800 font-bold">{matchedRecord.registryBook}</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50/50 p-4 text-xs">
                <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
                  <AlertCircle size={18} className="text-amber-600" />
                  <span>⚠️ Requires LGU Review</span>
                </div>
                <p className="mt-1 text-amber-800">
                  Exact record not automatically located in instant cache. This application will be routed to the LCRO physical archive clerk for manual verification.
                </p>
              </div>
            )}

            <div className="mt-6 flex justify-end gap-3 border-t border-zinc-100 pt-4">
              <button
                type="button"
                onClick={() => setCurrentStep(5)}
                className="rounded-xl border border-zinc-200 px-4 py-2.5 text-xs font-bold text-gray-600 hover:bg-zinc-50"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleRecordVerificationNext}
                className="rounded-xl bg-red-600 px-6 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-red-700"
              >
                Next: Request Summary
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          STEP 7: REQUEST SUMMARY
         ========================================================================= */}
      {currentStep === 7 && (
        <div className="space-y-6 animate-fade-up">
          <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2.5 pb-4 border-b border-zinc-100">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-red-50 text-red-600 font-bold text-xs">
                6
              </span>
              <div>
                <h2 className="text-base font-extrabold text-gray-900">
                  Request Summary
                </h2>
                <p className="text-xs text-gray-500">
                  Review your application breakdown before payment.
                </p>
              </div>
            </div>

            <div className="mt-5 space-y-4 text-xs">
              {/* Requester Box */}
              <div className="rounded-2xl bg-zinc-50 p-4 border border-zinc-200 space-y-1.5">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400">
                  Requester Information
                </span>
                <div className="grid grid-cols-2 gap-2 text-gray-800">
                  <div>
                    <span className="text-gray-400 block text-[11px]">Name</span>
                    <span className="font-bold">{requester.fullName}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-[11px]">Relationship</span>
                    <span className="font-bold">{requester.relationship}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-[11px]">Contact</span>
                    <span className="font-medium">{requester.contactNumber}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-[11px]">Email</span>
                    <span className="font-medium">{requester.email}</span>
                  </div>
                </div>
              </div>

              {/* Record Box */}
              <div className="rounded-2xl bg-zinc-50 p-4 border border-zinc-200 space-y-1.5">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400">
                  Deceased Information
                </span>
                <div className="grid grid-cols-2 gap-2 text-gray-800">
                  <div>
                    <span className="text-gray-400 block text-[11px]">Name of Deceased</span>
                    <span className="font-bold text-gray-900">{deathRecord.deceasedName}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-[11px]">Date of Death</span>
                    <span className="font-bold text-gray-900">{deathRecord.dateOfDeath}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-[11px]">Place of Death</span>
                    <span className="font-medium">{deathRecord.placeOfDeath}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-[11px]">Purpose</span>
                    <span className="font-medium">{deathRecord.purpose}</span>
                  </div>
                </div>
              </div>

              {/* Verification & Fee Box */}
              <div className="rounded-2xl border border-zinc-200 bg-white p-4 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-600">AI Validation:</span>
                  <span className="font-bold text-emerald-700">
                    {testMode === "normal" ? "✓ PASSED (96%)" : "⚠️ REQUIRES LGU REVIEW"}
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-600">Civil Registry Verification:</span>
                  <span className="font-bold text-emerald-700">
                    {matchedRecord ? "✓ MATCHED (Book 24, P.88)" : "⚠️ PENDING CLERK CHECK"}
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs border-t border-zinc-100 pt-2">
                  <span className="text-gray-600">Number of Copies:</span>
                  <span className="font-bold">{deathRecord.copies}</span>
                </div>
                <div className="flex justify-between items-center text-sm font-extrabold text-gray-900 border-t border-zinc-100 pt-2">
                  <span>Certificate Fee:</span>
                  <span className="text-red-700 font-mono">₱{deathRecord.copies * 100}.00</span>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3 border-t border-zinc-100 pt-4">
              <button
                type="button"
                onClick={() => setCurrentStep(6)}
                className="rounded-xl border border-zinc-200 px-4 py-2.5 text-xs font-bold text-gray-600 hover:bg-zinc-50"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleProceedToPayment}
                className="flex items-center gap-2 rounded-xl bg-red-600 px-6 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-red-700"
              >
                <CreditCard size={15} />
                Proceed to Payment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          STEP 8: PROTOTYPE PAYMENT
         ========================================================================= */}
      {currentStep === 8 && (
        <div className="space-y-6 animate-fade-up">
          <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2.5 pb-4 border-b border-zinc-100">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-red-50 text-red-600 font-bold text-xs">
                7
              </span>
              <div>
                <h2 className="text-base font-extrabold text-gray-900">
                  Prototype Payment Portal
                </h2>
                <p className="text-xs text-gray-500">
                  Simulated local government electronic billing gateway.
                </p>
              </div>
            </div>

            <div className="mt-5 space-y-4 text-xs">
              <div className="rounded-2xl bg-zinc-50 p-4 border border-zinc-200 flex justify-between items-center">
                <div>
                  <span className="text-[10px] font-extrabold uppercase text-gray-400">Total Amount Due</span>
                  <p className="text-xl font-extrabold font-mono text-gray-900">
                    ₱{deathRecord.copies * 100}.00
                  </p>
                </div>
                <span className="rounded-full bg-red-100 px-2.5 py-1 text-[10px] font-bold text-red-700">
                  Death Certificate Fee
                </span>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-2">
                  Select Payment Option:
                </label>
                <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
                  {["GCash", "Maya", "Online Banking", "Over-the-Counter"].map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setPaymentMethod(opt)}
                      className={`rounded-2xl border p-3 text-center transition font-bold ${
                        paymentMethod === opt
                          ? "border-red-600 bg-red-50/50 text-red-700 shadow-xs"
                          : "border-zinc-200 bg-white text-gray-700 hover:bg-zinc-50"
                      }`}
                    >
                      <span className="block text-xs">{opt}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-zinc-200 bg-white p-4 text-xs text-gray-600">
                <span className="font-bold text-gray-900 block mb-1">
                  Simulation Notice:
                </span>
                <p className="text-[11px] text-gray-500">
                  This is a prototype demonstration. No real charges or financial transactions will occur.
                </p>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3 border-t border-zinc-100 pt-4">
              <button
                type="button"
                onClick={() => setCurrentStep(7)}
                className="rounded-xl border border-zinc-200 px-4 py-2.5 text-xs font-bold text-gray-600 hover:bg-zinc-50"
              >
                Back
              </button>
              <button
                type="button"
                disabled={paymentProcessing}
                onClick={handleExecutePayment}
                className="flex items-center gap-2 rounded-xl bg-red-600 px-6 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-red-700 disabled:opacity-50"
              >
                {paymentProcessing ? (
                  <>
                    <RefreshCw size={14} className="animate-spin" />
                    <span>Processing Payment...</span>
                  </>
                ) : (
                  <>
                    <Check size={14} />
                    <span>Pay ₱{deathRecord.copies * 100}.00</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          STEP 9: SUBMIT REQUEST (FINAL CONFIRMATION)
         ========================================================================= */}
      {currentStep === 9 && (
        <div className="space-y-6 animate-fade-up">
          <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2.5 pb-4 border-b border-zinc-100">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-red-50 text-red-600 font-bold text-xs">
                8
              </span>
              <div>
                <h2 className="text-base font-extrabold text-gray-900">
                  Confirm & Submit Application
                </h2>
                <p className="text-xs text-gray-500">
                  Payment verified. Ready for transmission to Civil Registrar.
                </p>
              </div>
            </div>

            <div className="mt-5 space-y-4 text-xs">
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-4 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase text-emerald-800">
                    Payment Verified
                  </span>
                  <p className="font-mono text-xs font-bold text-emerald-950">
                    {paymentRef}
                  </p>
                  <p className="text-[10px] text-emerald-700">
                    ₱{deathRecord.copies * 100}.00 via {paymentMethod}
                  </p>
                </div>
                <span className="rounded-full bg-emerald-600 px-2.5 py-1 text-[10px] font-extrabold text-white">
                  PAID
                </span>
              </div>

              <div className="rounded-2xl bg-zinc-50 p-4 border border-zinc-200 space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-500">Certificate:</span>
                  <span className="font-bold text-gray-900">Death Certificate – Certified Copy</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Requester:</span>
                  <span className="font-bold text-gray-900">{requester.fullName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Deceased:</span>
                  <span className="font-bold text-gray-900">{deathRecord.deceasedName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Date of Death:</span>
                  <span className="font-medium text-gray-900">{deathRecord.dateOfDeath}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Place of Death:</span>
                  <span className="font-medium text-gray-900">{deathRecord.placeOfDeath}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">AI Validation:</span>
                  <span className="font-bold text-emerald-700">✓ Passed</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Record Verification:</span>
                  <span className="font-bold text-emerald-700">✓ Matched</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Payment:</span>
                  <span className="font-bold text-emerald-700">✓ Confirmed</span>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3 border-t border-zinc-100 pt-4">
              <button
                type="button"
                onClick={handleSubmitRequest}
                className="w-full rounded-2xl bg-red-600 py-3 text-xs font-bold text-white shadow-sm hover:bg-red-700 active:scale-95 transition flex items-center justify-center gap-2"
              >
                <CheckCircle2 size={16} />
                Submit Request & Generate Tracking
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          STEP 10 & 11: REQUEST TRACKING & CERTIFICATE READY
         ========================================================================= */}
      {currentStep >= 10 && (
        <div className="space-y-6 animate-fade-up">
          {/* Submission Banner */}
          <div className="rounded-3xl border border-emerald-200 bg-emerald-50/80 p-6 text-center shadow-sm">
            <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-sm">
              <CheckCircle2 size={24} />
            </span>
            <span className="mt-3 font-mono text-[10px] font-bold uppercase tracking-wider text-emerald-700 block">
              Official Civil Registrar Transmission
            </span>
            <h2 className="text-base font-extrabold text-emerald-950 sm:text-lg">
              Death Certificate Request Successfully Submitted
            </h2>
            <p className="mt-1 font-mono text-sm font-extrabold text-emerald-900">
              {generatedReqId}
            </p>
          </div>

          {/* Tracking Timeline */}
          <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between pb-4 border-b border-zinc-100">
              <div>
                <h3 className="text-sm font-extrabold text-gray-900">
                  Application Tracking
                </h3>
                <p className="text-xs text-gray-500 font-mono">
                  {generatedReqId}
                </p>
              </div>
              <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 font-mono text-[10px] font-bold text-emerald-800">
                Live Status
              </span>
            </div>

            <div className="mt-5 space-y-4 text-xs">
              <div className="space-y-3.5 pl-2">
                <div className="flex items-center gap-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-600 text-white font-bold text-xs">
                    ✓
                  </span>
                  <div>
                    <p className="font-bold text-gray-900">Request Submitted</p>
                    <p className="text-[11px] text-gray-500">{submittedTime}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-600 text-white font-bold text-xs">
                    ✓
                  </span>
                  <div>
                    <p className="font-bold text-gray-900">AI Validation</p>
                    <p className="text-[11px] text-gray-500">Passed (96% Confidence)</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-600 text-white font-bold text-xs">
                    ✓
                  </span>
                  <div>
                    <p className="font-bold text-gray-900">Record Verification</p>
                    <p className="text-[11px] text-gray-500">
                      Book No. 24, Page 88, Registry No. 25-0312
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-600 text-white font-bold text-xs">
                    ✓
                  </span>
                  <div>
                    <p className="font-bold text-gray-900">Payment Confirmed</p>
                    <p className="text-[11px] text-gray-500">
                      ₱{deathRecord.copies * 100}.00 via {paymentMethod} (Ref: {paymentRef})
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-600 text-white font-bold text-xs">
                    ✓
                  </span>
                  <div>
                    <p className="font-bold text-gray-900">Certificate Processing</p>
                    <p className="text-[11px] text-gray-500">Completed & Digitally Sealed</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-600 text-white font-bold text-xs">
                    ✓
                  </span>
                  <div>
                    <p className="font-bold text-gray-900">Certificate Ready</p>
                    <p className="text-[11px] text-gray-500">Cert No: {issuedCertNo}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Ready Actions */}
            <div className="mt-6 border-t border-zinc-100 pt-4 space-y-2.5">
              <button
                type="button"
                onClick={() => setShowCertModal(true)}
                className="w-full flex items-center justify-center gap-2 rounded-2xl bg-red-600 py-3 text-xs font-bold text-white shadow-sm hover:bg-red-700"
              >
                <Eye size={15} />
                View Official Sample Certificate
              </button>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setShowQRModal(true)}
                  className="flex items-center justify-center gap-1.5 rounded-xl border border-zinc-200 bg-white py-2.5 text-xs font-bold text-gray-700 hover:bg-zinc-50"
                >
                  <QrCode size={14} />
                  Verify QR Code
                </button>
                <button
                  type="button"
                  onClick={() => alert("Downloading Certificate PDF...")}
                  className="flex items-center justify-center gap-1.5 rounded-xl border border-zinc-200 bg-white py-2.5 text-xs font-bold text-gray-700 hover:bg-zinc-50"
                >
                  <Download size={14} />
                  Download PDF
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          SAMPLE DEATH CERTIFICATE MODAL
         ========================================================================= */}
      {showCertModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/70 backdrop-blur-xs animate-fade-in">
          <div className="relative w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl animate-modal-in max-h-[90vh] overflow-y-auto text-xs">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-zinc-200 pb-3">
              <span className="font-mono text-[10px] font-bold uppercase text-red-600">
                Official Certified Copy Document Preview
              </span>
              <button
                onClick={() => setShowCertModal(false)}
                className="rounded-lg p-1 text-gray-400 hover:bg-zinc-100 hover:text-gray-700"
              >
                <X size={18} />
              </button>
            </div>

            {/* Official Document Container with Watermark */}
            <div className="relative mt-4 border-4 border-double border-zinc-300 p-6 rounded-2xl bg-amber-50/20 shadow-inner overflow-hidden">
              {/* Sample Watermark */}
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center rotate-[-30deg] select-none">
                <span className="text-3xl font-black text-red-600/15 uppercase tracking-widest text-center">
                  SAMPLE – NOT AN OFFICIAL GOVERNMENT DOCUMENT
                </span>
              </div>

              {/* Document Header */}
              <div className="text-center pb-4 border-b border-zinc-300">
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-600">
                  Republic of the Philippines
                </p>
                <p className="text-xs font-bold uppercase text-gray-800">
                  Province of Bukidnon · City of Malaybalay
                </p>
                <p className="text-[11px] font-bold text-gray-600">
                  Office of the City Civil Registrar
                </p>
                <h3 className="mt-2 text-base font-extrabold text-gray-900 uppercase tracking-tight">
                  Certificate of Death
                </h3>
                <span className="inline-block font-mono text-[10px] font-bold bg-zinc-100 px-2 py-0.5 rounded text-gray-700 mt-1">
                  (Certified True Copy)
                </span>
              </div>

              {/* Certificate Details */}
              <div className="mt-4 space-y-3 text-xs">
                <div className="flex justify-between border-b border-zinc-200 pb-1.5">
                  <span className="font-bold text-gray-500">Certificate Number:</span>
                  <span className="font-mono font-extrabold text-red-700">{issuedCertNo || "LCRO-DC-2026-000312"}</span>
                </div>
                <div className="flex justify-between border-b border-zinc-200 pb-1.5">
                  <span className="font-bold text-gray-500">Name of Deceased:</span>
                  <span className="font-extrabold text-gray-900">{deathRecord.deceasedName}</span>
                </div>
                <div className="flex justify-between border-b border-zinc-200 pb-1.5">
                  <span className="font-bold text-gray-500">Date of Death:</span>
                  <span className="font-medium text-gray-900">{deathRecord.dateOfDeath}</span>
                </div>
                <div className="flex justify-between border-b border-zinc-200 pb-1.5">
                  <span className="font-bold text-gray-500">Date of Birth:</span>
                  <span className="font-medium text-gray-900">{deathRecord.dob || "January 10, 1950"}</span>
                </div>
                <div className="flex justify-between border-b border-zinc-200 pb-1.5">
                  <span className="font-bold text-gray-500">Place of Death:</span>
                  <span className="font-medium text-gray-900">{deathRecord.placeOfDeath}</span>
                </div>
                <div className="flex justify-between border-b border-zinc-200 pb-1.5">
                  <span className="font-bold text-gray-500">Sex:</span>
                  <span className="font-medium text-gray-900">{deathRecord.sex}</span>
                </div>
                <div className="flex justify-between border-b border-zinc-200 pb-1.5">
                  <span className="font-bold text-gray-500">Request ID:</span>
                  <span className="font-mono text-gray-900">{generatedReqId || "ACORS-LCRO-2026-000003"}</span>
                </div>
                <div className="flex justify-between border-b border-zinc-200 pb-1.5">
                  <span className="font-bold text-gray-500">Date Issued:</span>
                  <span className="font-mono text-gray-900">August 25, 2026</span>
                </div>
              </div>

              {/* Bottom Stamp & QR Code */}
              <div className="mt-5 pt-3 border-t border-zinc-300 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold text-gray-700 uppercase">
                    Atty. Fernando M. Gutierrez
                  </p>
                  <p className="text-[9px] text-gray-500">City Civil Registrar</p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowQRModal(true)}
                  className="flex items-center gap-1 rounded-lg bg-zinc-100 p-1.5 hover:bg-zinc-200"
                >
                  <QrCode size={36} className="text-gray-800" />
                </button>
              </div>
            </div>

            <div className="mt-4 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowCertModal(false)}
                className="rounded-xl border border-zinc-200 px-4 py-2 font-bold text-gray-600 hover:bg-zinc-50"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          QR DIGITAL VERIFICATION MODAL
         ========================================================================= */}
      {showQRModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-zinc-950/70 backdrop-blur-xs animate-fade-in">
          <div className="relative w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl text-xs animate-modal-in">
            <div className="text-center">
              <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-sm">
                <ShieldCheck size={26} />
              </span>
              <span className="mt-3 block font-mono text-[10px] font-bold uppercase tracking-wider text-emerald-700">
                Official Digital Seal Verifier
              </span>
              <h3 className="text-base font-extrabold text-gray-900">
                Civil Registry Document Verified
              </h3>
            </div>

            <div className="mt-4 rounded-2xl bg-zinc-50 p-4 border border-zinc-200 space-y-2 font-medium text-gray-700">
              <div className="flex justify-between">
                <span className="text-gray-400">Certificate Number:</span>
                <span className="font-mono font-bold text-gray-900">{issuedCertNo || "LCRO-DC-2026-000312"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Certificate Type:</span>
                <span className="font-bold text-gray-900">Death Certificate</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Deceased:</span>
                <span className="font-bold text-gray-900">{deathRecord.deceasedName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Date of Death:</span>
                <span className="font-bold text-gray-900">{deathRecord.dateOfDeath}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Place of Death:</span>
                <span className="font-bold text-gray-900">{deathRecord.placeOfDeath}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Issue Date:</span>
                <span className="font-bold text-gray-900">August 25, 2026</span>
              </div>
              <div className="flex justify-between border-t border-zinc-200 pt-1.5 font-bold">
                <span className="text-gray-400">Verification Status:</span>
                <span className="text-emerald-600 font-extrabold">✓ VALID</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowQRModal(false)}
              className="mt-5 w-full rounded-2xl bg-zinc-900 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-zinc-800"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
