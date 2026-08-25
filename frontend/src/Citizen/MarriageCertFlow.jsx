// src/Citizen/MarriageCertFlow.jsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Clock3,
  Upload,
  FileText,
  ShieldCheck,
  CreditCard,
  QrCode,
  Download,
  Printer,
  ChevronRight,
  Sparkles,
  Search,
  Check,
  User,
  Building,
  Calendar,
  MapPin,
  RefreshCw,
  Eye,
  Info,
  Trash2,
  RotateCw,
  Heart,
  ExternalLink,
  X,
  Bell,
} from "lucide-react";
import { saveLCRORequest, findMockMarriageRecord } from "../services/lcroData";

const STEPS = [
  { id: "start", label: "Overview" },
  { id: "requester", label: "Requester" },
  { id: "record", label: "Marriage Record" },
  { id: "upload", label: "Uploads" },
  { id: "ai_validation", label: "AI Scan" },
  { id: "verification", label: "Registry" },
  { id: "summary", label: "Summary" },
  { id: "payment", label: "Payment" },
  { id: "submit_confirm", label: "Submit" },
  { id: "tracking", label: "Tracking" },
  { id: "ready", label: "Certificate" },
];

export default function MarriageCertFlow({ office, cert }) {
  const [currentStep, setCurrentStep] = useState(0);

  // 2. Requester Information State
  const [requester, setRequester] = useState({
    fullName: "Juan Dela Cruz",
    address: "Purok 3, Casisang, Malaybalay City, Bukidnon",
    contactNumber: "0918-992-1134",
    email: "juan.delacruz@gmail.com",
    relationship: "Self",
  });

  // 3. Marriage Record Information State
  const [marriageRecord, setMarriageRecord] = useState({
    husbandName: "Juan Dela Cruz",
    wifeName: "Maria Santos",
    dateOfMarriage: "2020-06-15",
    placeOfMarriage: "Malaybalay City, Bukidnon",
    copies: 1,
    purpose: "Government Transaction",
  });

  // 4. Requirements Upload State
  const [idFile, setIdFile] = useState({
    name: "philippine_national_id_juandelacruz.jpg",
    type: "image/jpeg",
    size: "2.4 MB",
    status: "Uploaded & Verified",
  });

  const [authFile, setAuthFile] = useState({
    name: "authorization_letter_signed.pdf",
    type: "application/pdf",
    size: "1.1 MB",
    status: "Uploaded & Ready",
  });

  const [hasCustomAuth, setHasCustomAuth] = useState(false);

  // 5. AI Validation State
  const [isAiProcessing, setIsAiProcessing] = useState(false);
  const [aiProgress, setAiProgress] = useState(0);
  const [aiResult, setAiResult] = useState({
    status: "PASSED",
    confidence: "96%",
    checks: [
      { label: "Application completeness", passed: true },
      { label: "Required fields", passed: true },
      { label: "ID detected", passed: true },
      { label: "ID readable", passed: true },
      { label: "Information consistency", passed: true },
      { label: "Duplicate request check", passed: true },
    ],
  });

  // Testing Flag Toggle
  const [simulateFlagged, setSimulateFlagged] = useState(false);

  // 6. Mock Registry Verification State
  const [isVerifyingRegistry, setIsVerifyingRegistry] = useState(false);
  const [registryMatchData, setRegistryMatchData] = useState(null);
  const [registryLookupStatus, setRegistryLookupStatus] = useState("MATCHED"); // "MATCHED" | "NOT_FOUND" | "MISMATCH"

  // 8. Payment State
  const [paymentMethod, setPaymentMethod] = useState("gcash");
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [transactionRef, setTransactionRef] = useState("ACORS-PAY-20260825-002");

  // 9. Tracking & Submitted Request Data
  const [requestId, setRequestId] = useState("ACORS-LCRO-2026-000002");
  const [certificateNo, setCertificateNo] = useState("LCRO-MC-2026-000194");
  const [trackingStage, setTrackingStage] = useState("processing"); // "submitted" | "processing" | "ready"

  // 14. QR Verification Modal State
  const [showQrVerificationModal, setShowQrVerificationModal] = useState(false);

  // 15. Ready Notification Banner
  const [showReadyNotification, setShowReadyNotification] = useState(false);

  // Trigger AI Validation
  const triggerAiValidation = () => {
    setCurrentStep(4);
    setIsAiProcessing(true);
    setAiProgress(15);

    const interval = setInterval(() => {
      setAiProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsAiProcessing(false);
          if (simulateFlagged) {
            setAiResult({
              status: "REQUIRES LGU REVIEW",
              confidence: "74%",
              checks: [
                { label: "Application completeness", passed: true },
                { label: "Required fields", passed: true },
                { label: "ID detected", passed: true },
                { label: "ID readable", passed: true },
                { label: "Information consistency", passed: false, note: "Date variance between ID and submitted marriage record." },
                { label: "Duplicate request check", passed: true },
              ],
            });
          } else {
            setAiResult({
              status: "PASSED",
              confidence: "96%",
              checks: [
                { label: "Application completeness", passed: true },
                { label: "Required fields", passed: true },
                { label: "ID detected", passed: true },
                { label: "ID readable", passed: true },
                { label: "Information consistency", passed: true },
                { label: "Duplicate request check", passed: true },
              ],
            });
          }
          return 100;
        }
        return prev + 25;
      });
    }, 400);
  };

  // Trigger Mock Registry Search
  const triggerRegistryVerification = () => {
    setCurrentStep(5);
    setIsVerifyingRegistry(true);
    setTimeout(() => {
      setIsVerifyingRegistry(false);
      if (simulateFlagged) {
        setRegistryLookupStatus("MISMATCH");
        setRegistryMatchData(null);
      } else {
        const found = findMockMarriageRecord(marriageRecord.husbandName, marriageRecord.wifeName, marriageRecord.dateOfMarriage);
        if (found) {
          setRegistryLookupStatus("MATCHED");
          setRegistryMatchData(found);
        } else {
          setRegistryLookupStatus("MATCHED");
          setRegistryMatchData({
            recordId: "MARR-0001",
            husbandName: marriageRecord.husbandName,
            wifeName: marriageRecord.wifeName,
            dateOfMarriage: marriageRecord.dateOfMarriage,
            placeOfMarriage: marriageRecord.placeOfMarriage,
            registryBook: "Book No. 18, Page 72, Registry No. 20-0194",
            solemnizingOfficer: "Hon. Judge Roberto C. Alcantara",
          });
        }
      }
    }, 1300);
  };

  // Trigger Payment
  const handleProcessPayment = () => {
    setPaymentProcessing(true);
    setTimeout(() => {
      setPaymentProcessing(false);
      setPaymentSuccess(true);
      const generatedPayRef = `ACORS-PAY-20260825-${Math.floor(100 + Math.random() * 900)}`;
      setTransactionRef(generatedPayRef);
      setCurrentStep(8); // Proceed to Submit Screen
    }, 1200);
  };

  // Final Submission
  const handleFinalSubmit = () => {
    const generatedReqId = `ACORS-LCRO-2026-000002`;
    const generatedCertNo = `LCRO-MC-2026-000194`;
    setRequestId(generatedReqId);
    setCertificateNo(generatedCertNo);

    // Save to shared service for LCRO Office portal
    const newReq = {
      id: generatedReqId,
      certificateType: "Marriage Certificate – Certified Copy",
      submittedAt: new Date().toISOString().replace("T", " ").substring(0, 16),
      status: simulateFlagged ? "Requires LGU Review" : "Processing",
      applicant: { ...requester },
      marriageRecord: { ...marriageRecord },
      idUpload: {
        idType: "Philippine National ID",
        fileName: idFile ? idFile.name : "id_upload.jpg",
        fileType: idFile ? idFile.type : "image/jpeg",
        readable: true,
        hasAuthorization: requester.relationship === "Authorized Representative" || requester.relationship === "Other",
      },
      aiValidation: {
        status: simulateFlagged ? "FLAGGED" : "PASSED",
        confidence: simulateFlagged ? "74%" : "96%",
        checks: aiResult.checks,
        recommendation: simulateFlagged ? "REQUIRES LGU REVIEW" : "PASSED",
      },
      recordVerification: {
        status: simulateFlagged ? "UNRESOLVED" : "MATCHED",
        recordId: registryMatchData?.recordId || "MARR-0001",
        registryBook: registryMatchData?.registryBook || "Book No. 18, Page 72, Registry No. 20-0194",
        message: simulateFlagged
          ? "⚠️ Information mismatch detected — requires manual archive check by Civil Registrar."
          : "✓ Marriage Record Found — Exact Civil Registry Match in Book 18",
      },
      payment: {
        amount: 100 * (parseInt(marriageRecord.copies) || 1),
        method: paymentMethod.toUpperCase(),
        reference: transactionRef,
        paidAt: new Date().toISOString().replace("T", " ").substring(0, 16),
        status: "Confirmed",
      },
      certificateNumber: simulateFlagged ? null : generatedCertNo,
      issueDate: new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
    };

    saveLCRORequest(newReq);
    setCurrentStep(9); // Tracking
  };

  // Auto-progress tracking for normal low-risk requests
  useEffect(() => {
    if (currentStep === 9 && !simulateFlagged) {
      const timer = setTimeout(() => {
        setTrackingStage("ready");
        setShowReadyNotification(true);
      }, 3800);
      return () => clearTimeout(timer);
    }
  }, [currentStep, simulateFlagged]);

  const isRepOrOther = requester.relationship === "Authorized Representative" || requester.relationship === "Other";

  return (
    <div className="mx-auto max-w-2xl px-4 pb-28 pt-6 sm:px-6 lg:px-0">
      {/* Top Breadcrumb Navigation */}
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
          LCRO Civil Registry
        </span>
      </div>

      {/* Header Banner */}
      <div className="mt-4 flex items-center gap-3.5 rounded-3xl border border-zinc-200 bg-white p-4 shadow-sm sm:p-5">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-red-600 text-white shadow-md">
          <Heart size={22} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-red-600">
            Civil Registrar&apos;s Office (LCRO)
          </p>
          <h1 className="text-lg font-extrabold leading-tight text-gray-900 sm:text-xl">
            Marriage Certificate – Certified Copy
          </h1>
          <p className="mt-0.5 text-xs text-gray-500">
            Request a certified copy of an existing marriage record through ACORS.
          </p>
        </div>
      </div>

      {/* Mini Step Progress Tracker */}
      {currentStep > 0 && currentStep < 10 && (
        <div className="mt-5 rounded-2xl border border-zinc-200 bg-white p-3.5 shadow-sm">
          <div className="flex items-center justify-between text-xs font-bold text-gray-700">
            <span>
              Step {currentStep} of {STEPS.length - 2}:{" "}
              <span className="text-red-600">{STEPS[currentStep]?.label}</span>
            </span>
            <span className="font-mono text-[11px] text-gray-400">
              {Math.round((currentStep / (STEPS.length - 2)) * 100)}%
            </span>
          </div>
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-zinc-100">
            <div
              className="h-full rounded-full bg-red-600 transition-all duration-500 ease-out"
              style={{ width: `${(currentStep / (STEPS.length - 2)) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* STEP 0: Certificate Information & Start Application */}
      {currentStep === 0 && (
        <section className="mt-5 space-y-4 animate-fade-up">
          <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
            <h2 className="text-base font-extrabold text-gray-900 sm:text-lg">
              Marriage Certificate – Certified Copy
            </h2>
            <p className="mt-1.5 text-xs leading-relaxed text-gray-600">
              Request a certified copy of an existing marriage record through ACORS.
            </p>

            {/* Service Highlights */}
            <div className="mt-5 grid grid-cols-2 gap-3 text-xs">
              <div className="rounded-2xl border border-zinc-100 bg-zinc-50/80 p-3.5">
                <span className="font-bold text-gray-800">Processing Fee</span>
                <p className="mt-1 font-mono text-base font-extrabold text-red-600">₱100.00</p>
                <p className="text-[11px] text-gray-400">per certified copy</p>
              </div>
              <div className="rounded-2xl border border-zinc-100 bg-zinc-50/80 p-3.5">
                <span className="font-bold text-gray-800">AI Confidence</span>
                <p className="mt-1 font-mono text-base font-extrabold text-gray-900">96% Match</p>
                <p className="text-[11px] text-gray-400">Automated verification</p>
              </div>
            </div>

            {/* Requirements Checklist */}
            <div className="mt-6">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-gray-500">
                Requirements Checklist
              </h3>
              <ul className="mt-3 space-y-2 text-xs text-gray-700">
                <li className="flex items-start gap-2.5 rounded-xl bg-zinc-50 p-2.5">
                  <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-emerald-600" />
                  <div>
                    <span className="font-bold text-gray-900">Valid Government ID</span>
                    <p className="text-gray-500">PhilID, Driver&apos;s License, Passport, UMID, Postal ID, or PRC ID</p>
                  </div>
                </li>
                <li className="flex items-start gap-2.5 rounded-xl bg-zinc-50 p-2.5">
                  <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-emerald-600" />
                  <div>
                    <span className="font-bold text-gray-900">Complete marriage record information</span>
                    <p className="text-gray-500">Husband & Wife complete names, date & place of marriage</p>
                  </div>
                </li>
                <li className="flex items-start gap-2.5 rounded-xl bg-zinc-50 p-2.5">
                  <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-emerald-600" />
                  <div>
                    <span className="font-bold text-gray-900">Contact information</span>
                    <p className="text-gray-500">Valid email and mobile number for status alerts</p>
                  </div>
                </li>
                <li className="flex items-start gap-2.5 rounded-xl bg-zinc-50 p-2.5">
                  <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-emerald-600" />
                  <div>
                    <span className="font-bold text-gray-900">Authorization Letter / Proof of Authority</span>
                    <p className="text-gray-500">Required when requesting on behalf of the spouses as an authorized representative</p>
                  </div>
                </li>
              </ul>
            </div>

            {/* Prototype Testing Preset Box */}
            <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50/70 p-3.5 text-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Info size={16} className="text-amber-700" />
                  <span className="font-bold text-amber-900">Prototype Testing Simulation</span>
                </div>
                <label className="flex cursor-pointer items-center gap-2 text-xs font-semibold text-amber-900">
                  <input
                    type="checkbox"
                    checked={simulateFlagged}
                    onChange={(e) => setSimulateFlagged(e.target.checked)}
                    className="h-4 w-4 rounded border-amber-300 text-red-600 focus:ring-red-500"
                  />
                  <span>Simulate Flagged Mismatch</span>
                </label>
              </div>
              <p className="mt-1 text-[11px] text-amber-800">
                {simulateFlagged
                  ? "Test mode: Will trigger AI & Record verification mismatch → routes request to LCRO staff review queue."
                  : "Standard mode: Exact match with sample record MARR-0001 (Juan Dela Cruz & Maria Santos) → instant auto issuance."}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setCurrentStep(1)}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-red-600 py-3.5 text-sm font-bold text-white shadow-sm transition hover:bg-red-700 active:translate-y-px"
            >
              Start Application
              <ChevronRight size={18} />
            </button>
          </div>
        </section>
      )}

      {/* STEP 1: Requester Information */}
      {currentStep === 1 && (
        <section className="mt-5 animate-fade-up rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-600 font-bold">
              1
            </span>
            <div>
              <h2 className="text-base font-extrabold text-gray-900">
                Requester Information
              </h2>
              <p className="text-xs text-gray-500">
                Provide the details of the person submitting this application.
              </p>
            </div>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              setCurrentStep(2);
            }}
            className="mt-6 space-y-4 text-xs"
          >
            <div>
              <label className="block font-bold text-gray-700">Full Name</label>
              <input
                type="text"
                required
                value={requester.fullName}
                onChange={(e) => setRequester({ ...requester, fullName: e.target.value })}
                className="mt-1.5 w-full rounded-xl border border-zinc-200 bg-zinc-50/50 px-3.5 py-2.5 text-sm font-medium text-gray-900 focus:border-red-600 focus:bg-white focus:outline-none focus:ring-1 focus:ring-red-600"
                placeholder="e.g. Juan Dela Cruz"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700">Address</label>
              <input
                type="text"
                required
                value={requester.address}
                onChange={(e) => setRequester({ ...requester, address: e.target.value })}
                className="mt-1.5 w-full rounded-xl border border-zinc-200 bg-zinc-50/50 px-3.5 py-2.5 text-sm font-medium text-gray-900 focus:border-red-600 focus:bg-white focus:outline-none focus:ring-1 focus:ring-red-600"
                placeholder="e.g. Purok 3, Casisang, Malaybalay City"
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block font-bold text-gray-700">Contact Number</label>
                <input
                  type="tel"
                  required
                  value={requester.contactNumber}
                  onChange={(e) => setRequester({ ...requester, contactNumber: e.target.value })}
                  className="mt-1.5 w-full rounded-xl border border-zinc-200 bg-zinc-50/50 px-3.5 py-2.5 text-sm font-medium text-gray-900 focus:border-red-600 focus:bg-white focus:outline-none focus:ring-1 focus:ring-red-600"
                  placeholder="0918-xxx-xxxx"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700">Email Address</label>
                <input
                  type="email"
                  required
                  value={requester.email}
                  onChange={(e) => setRequester({ ...requester, email: e.target.value })}
                  className="mt-1.5 w-full rounded-xl border border-zinc-200 bg-zinc-50/50 px-3.5 py-2.5 text-sm font-medium text-gray-900 focus:border-red-600 focus:bg-white focus:outline-none focus:ring-1 focus:ring-red-600"
                  placeholder="juan@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-gray-700">Relationship to Record</label>
              <select
                value={requester.relationship}
                onChange={(e) => setRequester({ ...requester, relationship: e.target.value })}
                className="mt-1.5 w-full rounded-xl border border-zinc-200 bg-zinc-50/50 px-3.5 py-2.5 text-sm font-medium text-gray-900 focus:border-red-600 focus:bg-white focus:outline-none focus:ring-1 focus:ring-red-600"
              >
                <option value="Self">Self</option>
                <option value="Spouse">Spouse</option>
                <option value="Authorized Representative">Authorized Representative</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Conditional upload prompt for Authorized Representative or Other */}
            {isRepOrOther && (
              <div className="rounded-2xl border border-amber-200 bg-amber-50/80 p-4 animate-fade-in">
                <span className="block font-bold text-amber-950">
                  Proof of Authority Required
                </span>
                <p className="mt-1 text-[11px] text-amber-900 leading-relaxed">
                  As an {requester.relationship}, you must upload an Authorization Letter signed by the record owner along with a copy of their valid government ID in Step 3.
                </p>
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={() => setCurrentStep(0)}
                className="w-1/3 rounded-2xl border border-zinc-200 py-3 text-xs font-bold text-gray-600 transition hover:bg-zinc-100"
              >
                Back
              </button>
              <button
                type="submit"
                className="w-2/3 rounded-2xl bg-red-600 py-3 text-xs font-bold text-white shadow-sm transition hover:bg-red-700"
              >
                Continue to Marriage Record
              </button>
            </div>
          </form>
        </section>
      )}

      {/* STEP 2: Marriage Record Information */}
      {currentStep === 2 && (
        <section className="mt-5 animate-fade-up rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-600 font-bold">
              2
            </span>
            <div>
              <h2 className="text-base font-extrabold text-gray-900">
                Marriage Record Information
              </h2>
              <p className="text-xs text-gray-500">
                Enter details matching the registered Certificate of Marriage.
              </p>
            </div>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              setCurrentStep(3);
            }}
            className="mt-6 space-y-4 text-xs"
          >
            <div>
              <label className="block font-bold text-gray-700">Husband&apos;s Complete Name</label>
              <input
                type="text"
                required
                value={marriageRecord.husbandName}
                onChange={(e) => setMarriageRecord({ ...marriageRecord, husbandName: e.target.value })}
                className="mt-1.5 w-full rounded-xl border border-zinc-200 bg-zinc-50/50 px-3.5 py-2.5 text-sm font-medium text-gray-900 focus:border-red-600 focus:bg-white focus:outline-none focus:ring-1 focus:ring-red-600"
                placeholder="Husband's First, Middle, Last Name"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700">Wife&apos;s Complete Name (Maiden Name)</label>
              <input
                type="text"
                required
                value={marriageRecord.wifeName}
                onChange={(e) => setMarriageRecord({ ...marriageRecord, wifeName: e.target.value })}
                className="mt-1.5 w-full rounded-xl border border-zinc-200 bg-zinc-50/50 px-3.5 py-2.5 text-sm font-medium text-gray-900 focus:border-red-600 focus:bg-white focus:outline-none focus:ring-1 focus:ring-red-600"
                placeholder="Wife's Maiden Full Name"
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block font-bold text-gray-700">Date of Marriage</label>
                <input
                  type="date"
                  required
                  value={marriageRecord.dateOfMarriage}
                  onChange={(e) => setMarriageRecord({ ...marriageRecord, dateOfMarriage: e.target.value })}
                  className="mt-1.5 w-full rounded-xl border border-zinc-200 bg-zinc-50/50 px-3.5 py-2.5 text-sm font-medium text-gray-900 focus:border-red-600 focus:bg-white focus:outline-none focus:ring-1 focus:ring-red-600"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700">Place of Marriage</label>
                <input
                  type="text"
                  required
                  value={marriageRecord.placeOfMarriage}
                  onChange={(e) => setMarriageRecord({ ...marriageRecord, placeOfMarriage: e.target.value })}
                  className="mt-1.5 w-full rounded-xl border border-zinc-200 bg-zinc-50/50 px-3.5 py-2.5 text-sm font-medium text-gray-900 focus:border-red-600 focus:bg-white focus:outline-none focus:ring-1 focus:ring-red-600"
                  placeholder="e.g. Malaybalay City, Bukidnon"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block font-bold text-gray-700">Number of Copies</label>
                <select
                  value={marriageRecord.copies}
                  onChange={(e) => setMarriageRecord({ ...marriageRecord, copies: parseInt(e.target.value) || 1 })}
                  className="mt-1.5 w-full rounded-xl border border-zinc-200 bg-zinc-50/50 px-3.5 py-2.5 text-sm font-medium text-gray-900 focus:border-red-600 focus:bg-white focus:outline-none focus:ring-1 focus:ring-red-600"
                >
                  <option value={1}>1 copy (₱100.00)</option>
                  <option value={2}>2 copies (₱200.00)</option>
                  <option value={3}>3 copies (₱300.00)</option>
                  <option value={5}>5 copies (₱500.00)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-gray-700">Purpose of Request</label>
                <select
                  value={marriageRecord.purpose}
                  onChange={(e) => setMarriageRecord({ ...marriageRecord, purpose: e.target.value })}
                  className="mt-1.5 w-full rounded-xl border border-zinc-200 bg-zinc-50/50 px-3.5 py-2.5 text-sm font-medium text-gray-900 focus:border-red-600 focus:bg-white focus:outline-none focus:ring-1 focus:ring-red-600"
                >
                  <option value="Personal Use">Personal Use</option>
                  <option value="School Requirement">School Requirement</option>
                  <option value="Employment">Employment</option>
                  <option value="Government Transaction">Government Transaction</option>
                  <option value="Passport/Travel">Passport/Travel</option>
                  <option value="Legal Requirement">Legal Requirement</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                className="w-1/3 rounded-2xl border border-zinc-200 py-3 text-xs font-bold text-gray-600 transition hover:bg-zinc-100"
              >
                Back
              </button>
              <button
                type="submit"
                className="w-2/3 rounded-2xl bg-red-600 py-3 text-xs font-bold text-white shadow-sm transition hover:bg-red-700"
              >
                Continue to Requirements Upload
              </button>
            </div>
          </form>
        </section>
      )}

      {/* STEP 3: Upload Requirements */}
      {currentStep === 3 && (
        <section className="mt-5 animate-fade-up rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-600 font-bold">
              3
            </span>
            <div>
              <h2 className="text-base font-extrabold text-gray-900">
                Upload Requirements
              </h2>
              <p className="text-xs text-gray-500">
                Upload your valid government ID and supporting authority documents.
              </p>
            </div>
          </div>

          <div className="mt-6 space-y-4 text-xs">
            {/* Primary Government ID File Box */}
            <div className="rounded-2xl border border-zinc-200 bg-zinc-50/50 p-4">
              <div className="flex items-center justify-between">
                <span className="font-bold text-gray-900 text-sm">
                  1. Valid Government ID
                </span>
                <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 font-mono text-[10px] font-extrabold text-emerald-700">
                  {idFile ? idFile.status : "Required"}
                </span>
              </div>

              {idFile ? (
                <div className="mt-3 flex items-center justify-between rounded-xl border border-zinc-200 bg-white p-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-red-50 text-red-600 font-bold text-xs">
                      ID
                    </div>
                    <div className="min-w-0">
                      <p className="truncate font-bold text-gray-900">{idFile.name}</p>
                      <p className="font-mono text-[11px] text-gray-400">
                        {idFile.type} · {idFile.size}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => alert("Mock: File replacement simulated.")}
                      className="flex items-center gap-1 rounded-lg border border-zinc-200 px-2.5 py-1 text-[11px] font-bold text-gray-600 hover:bg-zinc-50"
                    >
                      <RotateCw size={12} /> Replace
                    </button>
                    <button
                      type="button"
                      onClick={() => setIdFile(null)}
                      className="flex items-center gap-1 rounded-lg border border-red-200 bg-red-50 px-2.5 py-1 text-[11px] font-bold text-red-600 hover:bg-red-100"
                    >
                      <Trash2 size={12} /> Remove
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() =>
                    setIdFile({
                      name: "philippine_national_id_juandelacruz.jpg",
                      type: "image/jpeg",
                      size: "2.4 MB",
                      status: "Uploaded & Verified",
                    })
                  }
                  className="mt-3 flex w-full flex-col items-center justify-center rounded-xl border-2 border-dashed border-zinc-300 py-6 text-center hover:border-red-400"
                >
                  <Upload size={20} className="text-zinc-400" />
                  <span className="mt-2 font-bold text-gray-700">Click to Upload Government ID</span>
                  <span className="text-[10px] text-gray-400">PNG, JPG or PDF up to 10MB</span>
                </button>
              )}
            </div>

            {/* Authorization Letter (When applicable) */}
            {isRepOrOther && (
              <div className="rounded-2xl border border-zinc-200 bg-zinc-50/50 p-4 animate-fade-in">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-gray-900 text-sm">
                    2. Authorization Letter / Proof of Authority
                  </span>
                  <span className="rounded-full bg-blue-50 px-2.5 py-0.5 font-mono text-[10px] font-extrabold text-blue-700">
                    {authFile ? authFile.status : "Required"}
                  </span>
                </div>

                {authFile ? (
                  <div className="mt-3 flex items-center justify-between rounded-xl border border-zinc-200 bg-white p-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600 font-bold text-xs">
                        PDF
                      </div>
                      <div className="min-w-0">
                        <p className="truncate font-bold text-gray-900">{authFile.name}</p>
                        <p className="font-mono text-[11px] text-gray-400">
                          {authFile.type} · {authFile.size}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => alert("Mock: Authorization letter replaced.")}
                        className="flex items-center gap-1 rounded-lg border border-zinc-200 px-2.5 py-1 text-[11px] font-bold text-gray-600 hover:bg-zinc-50"
                      >
                        <RotateCw size={12} /> Replace
                      </button>
                      <button
                        type="button"
                        onClick={() => setAuthFile(null)}
                        className="flex items-center gap-1 rounded-lg border border-red-200 bg-red-50 px-2.5 py-1 text-[11px] font-bold text-red-600 hover:bg-red-100"
                      >
                        <Trash2 size={12} /> Remove
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() =>
                      setAuthFile({
                        name: "authorization_letter_signed.pdf",
                        type: "application/pdf",
                        size: "1.1 MB",
                        status: "Uploaded & Ready",
                      })
                    }
                    className="mt-3 flex w-full flex-col items-center justify-center rounded-xl border-2 border-dashed border-zinc-300 py-6 text-center hover:border-blue-400"
                  >
                    <Upload size={20} className="text-zinc-400" />
                    <span className="mt-2 font-bold text-gray-700">Click to Upload Authorization Letter</span>
                    <span className="text-[10px] text-gray-400">Signed PDF document</span>
                  </button>
                )}
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="w-1/3 rounded-2xl border border-zinc-200 py-3 text-xs font-bold text-gray-600 transition hover:bg-zinc-100"
              >
                Back
              </button>
              <button
                type="button"
                disabled={!idFile || (isRepOrOther && !authFile)}
                onClick={triggerAiValidation}
                className="w-2/3 flex items-center justify-center gap-2 rounded-2xl bg-red-600 py-3 text-xs font-bold text-white shadow-sm transition hover:bg-red-700 disabled:opacity-50"
              >
                <Sparkles size={16} />
                Run AI Validation
              </button>
            </div>
          </div>
        </section>
      )}

      {/* STEP 4: AI Validation Step */}
      {currentStep === 4 && (
        <section className="mt-5 animate-fade-up rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-600 font-bold">
              🤖
            </span>
            <div>
              <h2 className="text-base font-extrabold text-gray-900">
                AI VALIDATION
              </h2>
              <p className="text-xs text-gray-500">
                Automated document & data verification check.
              </p>
            </div>
          </div>

          {isAiProcessing ? (
            <div className="my-8 flex flex-col items-center justify-center space-y-4 py-8 text-center">
              <div className="relative flex h-16 w-16 items-center justify-center">
                <div className="absolute inset-0 animate-ping rounded-full bg-red-100" />
                <div className="relative flex h-14 w-14 items-center justify-center rounded-full bg-red-600 text-white shadow-lg">
                  <RefreshCw size={24} className="animate-spin" />
                </div>
              </div>
              <div>
                <p className="text-sm font-extrabold text-gray-900">Validating Application & ID Consistency...</p>
                <p className="mt-1 font-mono text-xs text-gray-500">{aiProgress}% Completed</p>
              </div>
              <div className="h-2 w-48 overflow-hidden rounded-full bg-zinc-100">
                <div
                  className="h-full rounded-full bg-red-600 transition-all duration-300"
                  style={{ width: `${aiProgress}%` }}
                />
              </div>
            </div>
          ) : (
            <div className="mt-6 space-y-4 animate-fade-in text-xs">
              {/* Checklist breakdown */}
              <div className="space-y-2 rounded-2xl border border-zinc-100 bg-zinc-50 p-4">
                {aiResult.checks.map((check, idx) => (
                  <div
                    key={idx}
                    className={`flex items-center justify-between py-1.5 ${
                      idx > 0 ? "border-t border-zinc-200/60" : ""
                    }`}
                  >
                    <span className="font-medium text-gray-700">✓ {check.label}</span>
                    <span
                      className={`font-bold flex items-center gap-1 ${
                        check.passed ? "text-emerald-700" : "text-amber-700"
                      }`}
                    >
                      {check.passed ? <Check size={14} /> : <AlertCircle size={14} />}
                      {check.passed ? "Passed" : "Variance"}
                    </span>
                  </div>
                ))}
              </div>

              {/* AI Result Box */}
              <div
                className={`rounded-2xl p-4.5 ${
                  aiResult.status === "PASSED"
                    ? "border border-emerald-200 bg-emerald-50/80 text-emerald-950"
                    : "border border-amber-200 bg-amber-50/80 text-amber-950"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-gray-500">
                      AI Result
                    </span>
                    <p className="font-mono text-base font-black tracking-wide">
                      {aiResult.status}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-gray-500">
                      AI Confidence
                    </span>
                    <p className="font-mono text-base font-black">
                      {aiResult.confidence}
                    </p>
                  </div>
                </div>

                <p className="mt-3 border-t border-zinc-200/50 pt-2 text-[11px] leading-relaxed text-gray-600">
                  <span className="font-bold text-gray-800">Notice:</span> The AI is only validating and recommending based on submitted digital copies. It does not access real government databases.
                </p>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setCurrentStep(3)}
                  className="w-1/3 rounded-2xl border border-zinc-200 py-3 text-xs font-bold text-gray-600 transition hover:bg-zinc-100"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={triggerRegistryVerification}
                  className="w-2/3 flex items-center justify-center gap-2 rounded-2xl bg-red-600 py-3 text-xs font-bold text-white shadow-sm transition hover:bg-red-700"
                >
                  Proceed to Record Verification
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </section>
      )}

      {/* STEP 5: Mock Marriage Record Verification */}
      {currentStep === 5 && (
        <section className="mt-5 animate-fade-up rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-600 font-bold">
              <Search size={20} />
            </span>
            <div>
              <h2 className="text-base font-extrabold text-gray-900">
                Marriage Record Verification
              </h2>
              <p className="text-xs text-gray-500">
                Comparing submitted details against LCRO Local Civil Registry Book.
              </p>
            </div>
          </div>

          {isVerifyingRegistry ? (
            <div className="my-8 flex flex-col items-center justify-center space-y-4 py-8 text-center">
              <div className="relative flex h-16 w-16 items-center justify-center">
                <div className="absolute inset-0 animate-ping rounded-full bg-red-100" />
                <div className="relative flex h-14 w-14 items-center justify-center rounded-full bg-red-600 text-white shadow-lg">
                  <Search size={24} className="animate-pulse" />
                </div>
              </div>
              <div>
                <p className="text-sm font-extrabold text-gray-900">Matching Civil Registry Books...</p>
                <p className="mt-1 font-mono text-xs text-gray-500">Querying Marriage Index MARR-0001</p>
              </div>
            </div>
          ) : (
            <div className="mt-6 space-y-4 animate-fade-in text-xs">
              {registryLookupStatus === "MATCHED" ? (
                <div className="space-y-4">
                  <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-4 text-emerald-950">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 size={18} className="text-emerald-600" />
                      <span className="text-sm font-extrabold">✓ Marriage Record Found</span>
                    </div>
                    <p className="mt-1 font-bold text-emerald-800 text-[11px]">
                      ✓ Information Matched
                    </p>

                    <div className="mt-3 space-y-1.5 text-xs">
                      <p>
                        <span className="font-semibold text-emerald-900">Record ID:</span>{" "}
                        <span className="font-mono font-bold">{registryMatchData?.recordId || "MARR-0001"}</span>
                      </p>
                      <p>
                        <span className="font-semibold text-emerald-900">Husband:</span>{" "}
                        {marriageRecord.husbandName}
                      </p>
                      <p>
                        <span className="font-semibold text-emerald-900">Wife:</span>{" "}
                        {marriageRecord.wifeName}
                      </p>
                      <p>
                        <span className="font-semibold text-emerald-900">Date of Marriage:</span>{" "}
                        {marriageRecord.dateOfMarriage}
                      </p>
                      <p>
                        <span className="font-semibold text-emerald-900">Place of Marriage:</span>{" "}
                        {marriageRecord.placeOfMarriage}
                      </p>
                      <p>
                        <span className="font-semibold text-emerald-900">Registry Reference:</span>{" "}
                        {registryMatchData?.registryBook || "Book No. 18, Page 72, Registry No. 20-0194"}
                      </p>
                    </div>
                  </div>

                  <p className="text-xs text-gray-500">
                    The civil registry record has been successfully matched. You can now review the request summary and proceed to prototype payment.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="rounded-2xl border border-amber-200 bg-amber-50/80 p-4 text-amber-950">
                    <div className="flex items-center gap-2">
                      <AlertCircle size={18} className="text-amber-700" />
                      <span className="text-sm font-extrabold">⚠️ Requires LGU Review</span>
                    </div>
                    <p className="mt-2 text-xs leading-relaxed">
                      Submitted information has slight variances from indexed books. This request will be routed for manual archival search by LCRO staff.
                    </p>
                  </div>
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setCurrentStep(4)}
                  className="w-1/3 rounded-2xl border border-zinc-200 py-3 text-xs font-bold text-gray-600 transition hover:bg-zinc-100"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentStep(6)}
                  className="w-2/3 flex items-center justify-center gap-2 rounded-2xl bg-red-600 py-3 text-xs font-bold text-white shadow-sm transition hover:bg-red-700"
                >
                  Continue to Request Summary
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </section>
      )}

      {/* STEP 6: Request Summary */}
      {currentStep === 6 && (
        <section className="mt-5 animate-fade-up rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-extrabold text-gray-900">
                Request Summary
              </h2>
              <p className="text-xs text-gray-500">
                Review all details before proceeding to payment.
              </p>
            </div>
            <span className="rounded-full bg-red-50 px-3 py-1 font-mono text-xs font-bold text-red-600">
              LCRO-MC
            </span>
          </div>

          <div className="mt-6 space-y-4 text-xs">
            {/* Requester Information */}
            <div className="rounded-2xl border border-zinc-100 bg-zinc-50 p-4">
              <span className="font-extrabold uppercase tracking-wider text-gray-400 text-[10px]">
                Requester Information
              </span>
              <div className="mt-2 grid grid-cols-2 gap-2 text-gray-700">
                <div>
                  <span className="text-gray-400 block">Name</span>
                  <span className="font-bold text-gray-900">{requester.fullName}</span>
                </div>
                <div>
                  <span className="text-gray-400 block">Relationship</span>
                  <span className="font-bold text-gray-900">{requester.relationship}</span>
                </div>
                <div>
                  <span className="text-gray-400 block">Contact</span>
                  <span className="font-medium text-gray-900">{requester.contactNumber}</span>
                </div>
                <div>
                  <span className="text-gray-400 block">Email</span>
                  <span className="font-medium text-gray-900">{requester.email}</span>
                </div>
              </div>
            </div>

            {/* Marriage Record Details */}
            <div className="rounded-2xl border border-zinc-100 bg-zinc-50 p-4">
              <span className="font-extrabold uppercase tracking-wider text-gray-400 text-[10px]">
                Marriage Record Details
              </span>
              <div className="mt-2 space-y-2 text-gray-700">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-gray-400 block">Husband&apos;s Name</span>
                    <span className="font-bold text-gray-900">{marriageRecord.husbandName}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block">Wife&apos;s Name</span>
                    <span className="font-bold text-gray-900">{marriageRecord.wifeName}</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-gray-400 block">Date of Marriage</span>
                    <span className="font-bold text-gray-900">{marriageRecord.dateOfMarriage}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block">Place of Marriage</span>
                    <span className="font-medium text-gray-900">{marriageRecord.placeOfMarriage}</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 pt-1 border-t border-zinc-200/50">
                  <div>
                    <span className="text-gray-400 block">Number of Copies</span>
                    <span className="font-bold text-gray-900">{marriageRecord.copies}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block">Purpose</span>
                    <span className="font-medium text-gray-900">{marriageRecord.purpose}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Validation & Verification Badges */}
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-emerald-100 bg-emerald-50/50 p-3">
                <span className="text-[10px] font-bold text-emerald-800 uppercase block">
                  AI Validation Result
                </span>
                <span className="mt-1 font-bold text-emerald-700 flex items-center gap-1">
                  <CheckCircle2 size={13} /> {aiResult.status} ({aiResult.confidence})
                </span>
              </div>
              <div className="rounded-2xl border border-emerald-100 bg-emerald-50/50 p-3">
                <span className="text-[10px] font-bold text-emerald-800 uppercase block">
                  Record Verification
                </span>
                <span className="mt-1 font-bold text-emerald-700 flex items-center gap-1">
                  <CheckCircle2 size={13} /> Record Found (Book 18)
                </span>
              </div>
            </div>

            {/* Certificate Fee Breakdown */}
            <div className="rounded-2xl border border-red-100 bg-red-50/50 p-4">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-gray-700">
                  Certificate Fee (₱100.00 × {marriageRecord.copies})
                </span>
                <span className="font-mono font-bold text-gray-900">
                  ₱{(100 * marriageRecord.copies).toFixed(2)}
                </span>
              </div>
              <div className="mt-3 flex items-center justify-between border-t border-red-100 pt-2 text-sm">
                <span className="font-extrabold text-gray-900">Total Amount Due</span>
                <span className="font-mono text-base font-extrabold text-red-600">
                  ₱{(100 * marriageRecord.copies).toFixed(2)}
                </span>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={() => setCurrentStep(5)}
                className="w-1/3 rounded-2xl border border-zinc-200 py-3 text-xs font-bold text-gray-600 transition hover:bg-zinc-100"
              >
                Back
              </button>
              <button
                type="button"
                onClick={() => setCurrentStep(7)}
                className="w-2/3 flex items-center justify-center gap-2 rounded-2xl bg-red-600 py-3 text-xs font-bold text-white shadow-sm transition hover:bg-red-700"
              >
                Proceed to Payment
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </section>
      )}

      {/* STEP 7: Prototype Payment */}
      {currentStep === 7 && (
        <section className="mt-5 animate-fade-up rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-600 font-bold">
              <CreditCard size={20} />
            </span>
            <div>
              <h2 className="text-base font-extrabold text-gray-900">
                Prototype Payment Gateway
              </h2>
              <p className="text-xs text-gray-500">
                Simulated ₱{(100 * marriageRecord.copies).toFixed(2)} transaction.
              </p>
            </div>
          </div>

          <div className="mt-6 space-y-4 text-xs">
            <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4 text-center">
              <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                Total Payment Amount
              </span>
              <p className="mt-1 font-mono text-3xl font-extrabold text-gray-900">
                ₱{(100 * marriageRecord.copies).toFixed(2)}
              </p>
              <p className="mt-1 text-[11px] text-gray-500">
                Service: Marriage Certificate – Certified Copy
              </p>
            </div>

            <div>
              <label className="block font-bold text-gray-700">Select Payment Method</label>
              <div className="mt-2 grid grid-cols-2 gap-3">
                {[
                  { id: "gcash", name: "GCash", desc: "E-Wallet", color: "bg-blue-600" },
                  { id: "maya", name: "Maya", desc: "Wallet & Cards", color: "bg-emerald-600" },
                  { id: "online-banking", name: "Online Banking", desc: "InstaPay / PESONet", color: "bg-indigo-600" },
                  { id: "otc", name: "Over-the-Counter", desc: "LGU Cashier", color: "bg-amber-600" },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setPaymentMethod(item.id)}
                    className={`flex items-center gap-3 rounded-2xl border p-3 text-left transition ${
                      paymentMethod === item.id
                        ? "border-red-600 bg-red-50/50 ring-1 ring-red-600"
                        : "border-zinc-200 bg-white hover:border-zinc-300"
                    }`}
                  >
                    <div className={`flex h-8 w-8 items-center justify-center rounded-xl text-xs font-extrabold text-white ${item.color}`}>
                      {item.name.charAt(0)}
                    </div>
                    <div>
                      <span className="block font-bold text-gray-900">{item.name}</span>
                      <span className="text-[10px] text-gray-400">{item.desc}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-zinc-100 bg-zinc-50 p-4 text-[11px] text-gray-500 leading-relaxed">
              <span className="font-bold text-gray-800">Prototype Disclaimer:</span> This is a sandbox demonstration. No real funds will be charged.
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={() => setCurrentStep(6)}
                className="w-1/3 rounded-2xl border border-zinc-200 py-3 text-xs font-bold text-gray-600 transition hover:bg-zinc-100"
              >
                Back
              </button>
              <button
                type="button"
                disabled={paymentProcessing}
                onClick={handleProcessPayment}
                className="w-2/3 flex items-center justify-center gap-2 rounded-2xl bg-red-600 py-3 text-xs font-bold text-white shadow-sm transition hover:bg-red-700 active:translate-y-px disabled:opacity-50"
              >
                {paymentProcessing ? (
                  <>
                    <RefreshCw size={16} className="animate-spin" />
                    Processing Payment...
                  </>
                ) : (
                  <>
                    <CheckCircle2 size={16} />
                    Confirm & Pay ₱{(100 * marriageRecord.copies).toFixed(2)}
                  </>
                )}
              </button>
            </div>
          </div>
        </section>
      )}

      {/* STEP 8: Final Submission Confirmation */}
      {currentStep === 8 && (
        <section className="mt-5 animate-fade-up rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
          <div className="text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
              <CheckCircle2 size={32} />
            </div>
            <h2 className="mt-3 text-lg font-extrabold text-gray-900">
              Payment Successful!
            </h2>
            <p className="font-mono text-xs font-bold text-gray-500 mt-1">
              Ref: {transactionRef}
            </p>
          </div>

          <div className="mt-6 rounded-2xl border border-zinc-100 bg-zinc-50/80 p-4 space-y-2 text-xs">
            <div className="border-b border-zinc-200 pb-2">
              <span className="font-mono text-[10px] uppercase font-bold text-red-600">
                Service
              </span>
              <p className="font-extrabold text-gray-900 text-sm">
                Marriage Certificate – Certified Copy
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <div>
                <span className="text-gray-400 block text-[11px]">Requester:</span>
                <span className="font-bold text-gray-900">{requester.fullName}</span>
              </div>
              <div>
                <span className="text-gray-400 block text-[11px]">Husband:</span>
                <span className="font-bold text-gray-900">{marriageRecord.husbandName}</span>
              </div>
              <div>
                <span className="text-gray-400 block text-[11px]">Wife:</span>
                <span className="font-bold text-gray-900">{marriageRecord.wifeName}</span>
              </div>
              <div>
                <span className="text-gray-400 block text-[11px]">Date of Marriage:</span>
                <span className="font-bold text-gray-900">{marriageRecord.dateOfMarriage}</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-3 border-t border-zinc-200 text-center">
              <div className="rounded-xl bg-white p-2 border border-zinc-200">
                <span className="text-[10px] text-gray-400 block">Record:</span>
                <span className="font-bold text-emerald-600">✓ Found</span>
              </div>
              <div className="rounded-xl bg-white p-2 border border-zinc-200">
                <span className="text-[10px] text-gray-400 block">AI Validation:</span>
                <span className="font-bold text-emerald-600">✓ Passed</span>
              </div>
              <div className="rounded-xl bg-white p-2 border border-zinc-200">
                <span className="text-[10px] text-gray-400 block">Payment:</span>
                <span className="font-bold text-emerald-600">✓ Confirmed</span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleFinalSubmit}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-red-600 py-3.5 text-xs font-bold text-white shadow-sm transition hover:bg-red-700"
          >
            Submit Request
            <ChevronRight size={16} />
          </button>
        </section>
      )}

      {/* STEP 9: Request Tracking */}
      {currentStep === 9 && (
        <section className="mt-5 space-y-4 animate-fade-up">
          {/* Tracking Card */}
          <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-red-600">
                  Marriage Certificate Request Successfully Submitted
                </span>
                <h2 className="mt-1 font-mono text-xl font-extrabold text-gray-900 sm:text-2xl">
                  {requestId}
                </h2>
                <p className="mt-1 text-xs text-gray-500">
                  Marriage Certificate · {marriageRecord.husbandName} & {marriageRecord.wifeName}
                </p>
              </div>
              <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-600" />
                ₱{(100 * marriageRecord.copies).toFixed(2)} Paid
              </span>
            </div>

            {/* Tracking Status Timeline */}
            <div className="mt-8 space-y-4">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-gray-400">
                Status Timeline
              </h3>

              <div className="space-y-4">
                {/* 1. Request Submitted */}
                <div className="flex items-start gap-3.5">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white shadow-sm">
                    <Check size={14} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-900">✓ Request Submitted</p>
                    <p className="text-[11px] text-gray-500">Application successfully registered in LCRO</p>
                  </div>
                </div>

                {/* 2. AI Validation */}
                <div className="flex items-start gap-3.5">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white shadow-sm">
                    <Check size={14} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-900">✓ AI Validation</p>
                    <p className="text-[11px] text-gray-500">Automated check complete (96% Confidence Score)</p>
                  </div>
                </div>

                {/* 3. Record Verification */}
                <div className="flex items-start gap-3.5">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white shadow-sm">
                    <Check size={14} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-900">✓ Record Verification</p>
                    <p className="text-[11px] text-gray-500">Civil Registry Record Found (Book 18, Page 72)</p>
                  </div>
                </div>

                {/* 4. Payment Confirmed */}
                <div className="flex items-start gap-3.5">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white shadow-sm">
                    <Check size={14} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-900">✓ Payment Confirmed</p>
                    <p className="text-[11px] text-gray-500">₱{(100 * marriageRecord.copies).toFixed(2)} received ({transactionRef})</p>
                  </div>
                </div>

                {/* 5. Certificate Processing */}
                <div className="flex items-start gap-3.5">
                  <div
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${
                      trackingStage === "ready"
                        ? "bg-emerald-600 text-white"
                        : "bg-amber-500 text-white animate-pulse"
                    }`}
                  >
                    {trackingStage === "ready" ? <Check size={14} /> : <Clock3 size={14} />}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-900">
                      {trackingStage === "ready" ? "✓ Certificate Processed" : "⏳ Certificate Processing"}
                    </p>
                    <p className="text-[11px] text-gray-500">
                      {trackingStage === "ready"
                        ? "Official certified copy generated and cryptographically signed"
                        : simulateFlagged
                        ? "Awaiting Civil Registrar review"
                        : "Generating official security certificate copy..."}
                    </p>
                  </div>
                </div>

                {/* 6. Certificate Ready */}
                <div className="flex items-start gap-3.5">
                  <div
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${
                      trackingStage === "ready"
                        ? "bg-emerald-600 text-white"
                        : "border-2 border-zinc-300 bg-white text-zinc-300"
                    }`}
                  >
                    {trackingStage === "ready" ? <Check size={14} /> : <span className="h-2 w-2 rounded-full bg-zinc-300" />}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-900">
                      {trackingStage === "ready" ? "✓ Certificate Ready" : "○ Certificate Ready"}
                    </p>
                    <p className="text-[11px] text-gray-500">
                      {trackingStage === "ready"
                        ? "Sample certificate is ready for download, viewing, and QR verification"
                        : "Pending issuance"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Notification Callout */}
            {trackingStage === "ready" ? (
              <div className="mt-8 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 animate-fade-in">
                <div className="flex items-center gap-2">
                  <Bell size={18} className="text-emerald-700 animate-bounce" />
                  <p className="text-xs font-bold text-emerald-950">
                    Your Marriage Certificate – Certified Copy is ready.
                  </p>
                </div>
                <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(10)}
                    className="flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-emerald-700"
                  >
                    <Eye size={14} /> View Certificate
                  </button>
                  <button
                    type="button"
                    onClick={() => alert(`Certificate ${certificateNo} downloaded (Mock sample PDF).`)}
                    className="flex items-center justify-center gap-1.5 rounded-xl border border-emerald-300 bg-white py-2.5 text-xs font-bold text-emerald-800 hover:bg-emerald-50"
                  >
                    <Download size={14} /> Download Certificate
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowQrVerificationModal(true)}
                    className="flex items-center justify-center gap-1.5 rounded-xl border border-emerald-300 bg-white py-2.5 text-xs font-bold text-emerald-800 hover:bg-emerald-50"
                  >
                    <QrCode size={14} /> Verify Certificate
                  </button>
                </div>
              </div>
            ) : simulateFlagged ? (
              <div className="mt-8 rounded-2xl bg-amber-50 p-4 text-xs text-amber-900">
                <p className="font-bold">⚠️ Requires LGU Review</p>
                <p className="mt-1 text-[11px]">
                  Your request has been routed to the LCRO Civil Registrar staff for manual archival index matching.
                </p>
              </div>
            ) : (
              <div className="mt-6 flex items-center justify-center gap-2 text-xs font-semibold text-gray-500">
                <RefreshCw size={14} className="animate-spin text-red-600" />
                <span>Simulating automated certificate issuance (4s)...</span>
              </div>
            )}
          </div>
        </section>
      )}

      {/* STEP 10: Certificate Ready (Sample Marriage Certificate View) */}
      {currentStep === 10 && (
        <section className="mt-5 space-y-5 animate-fade-up">
          {/* Certificate Action Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={20} className="text-emerald-600" />
              <div>
                <span className="block text-xs font-bold text-gray-900">Certified Marriage Copy Ready</span>
                <span className="font-mono text-[11px] text-gray-500">No: {certificateNo}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowQrVerificationModal(true)}
                className="flex items-center gap-1.5 rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-xs font-bold text-gray-700 transition hover:bg-zinc-100"
              >
                <QrCode size={15} />
                Verify Certificate
              </button>
              <button
                type="button"
                onClick={() => window.print()}
                className="flex items-center gap-1.5 rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-xs font-bold text-gray-700 transition hover:bg-zinc-100"
              >
                <Printer size={15} />
                Print
              </button>
              <button
                type="button"
                onClick={() => alert(`Certificate ${certificateNo} downloaded (Mock sample file).`)}
                className="flex items-center gap-1.5 rounded-xl bg-red-600 px-3.5 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-red-700"
              >
                <Download size={15} />
                Download PDF
              </button>
            </div>
          </div>

          {/* OFFICIAL SAMPLE MARRIAGE CERTIFICATE CARD */}
          <div className="relative overflow-hidden rounded-3xl border-2 border-zinc-300 bg-[#FAF9F5] p-6 shadow-md text-gray-900 sm:p-8">
            {/* Prominent Diagonal Watermark */}
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden select-none">
              <div className="rotate-[-28deg] text-center text-4xl sm:text-5xl font-black tracking-widest text-red-500/15 uppercase">
                SAMPLE – NOT AN OFFICIAL GOVERNMENT DOCUMENT
              </div>
            </div>

            {/* Watermark Banner Top */}
            <div className="mb-4 rounded-xl border border-red-200 bg-red-50/90 py-1.5 text-center font-mono text-[10px] font-extrabold uppercase tracking-widest text-red-700">
              SAMPLE – NOT AN OFFICIAL GOVERNMENT DOCUMENT
            </div>

            {/* Certificate Header */}
            <div className="border-b-2 border-zinc-800 pb-4 text-center">
              <p className="text-[11px] font-semibold tracking-wider text-gray-600 uppercase">
                Republic of the Philippines
              </p>
              <p className="text-xs font-bold uppercase text-gray-800">
                City of Malaybalay · Province of Bukidnon
              </p>
              <p className="text-[11px] font-semibold text-gray-600 uppercase">
                Office of the City Civil Registrar
              </p>
              <h2 className="mt-2 text-lg sm:text-xl font-black uppercase tracking-wide text-gray-900">
                Certificate of Marriage
              </h2>
              <p className="font-mono text-[10px] font-bold text-gray-500">
                (CERTIFIED TRUE COPY OF CIVIL REGISTRY RECORD)
              </p>
            </div>

            {/* Meta Grid */}
            <div className="mt-4 grid grid-cols-2 gap-2 border-b border-zinc-200 pb-3 font-mono text-[11px]">
              <div>
                <span className="text-gray-500">Certificate No:</span>{" "}
                <span className="font-bold text-gray-900">{certificateNo}</span>
              </div>
              <div className="text-right">
                <span className="text-gray-500">Request ID:</span>{" "}
                <span className="font-bold text-red-700">{requestId}</span>
              </div>
              <div>
                <span className="text-gray-500">Registry Book:</span>{" "}
                <span className="font-bold text-gray-800">Book 18, Page 72</span>
              </div>
              <div className="text-right">
                <span className="text-gray-500">Issue Date:</span>{" "}
                <span className="font-bold text-gray-800">
                  {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                </span>
              </div>
            </div>

            {/* Body Record Details */}
            <div className="mt-5 space-y-3.5 text-xs">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-zinc-200/80 bg-white/80 p-3">
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-gray-400">
                    1. Husband&apos;s Name
                  </span>
                  <p className="mt-0.5 text-sm font-extrabold text-gray-900">{marriageRecord.husbandName}</p>
                </div>

                <div className="rounded-xl border border-zinc-200/80 bg-white/80 p-3">
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-gray-400">
                    2. Wife&apos;s Name
                  </span>
                  <p className="mt-0.5 text-sm font-extrabold text-gray-900">{marriageRecord.wifeName}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-zinc-200/80 bg-white/80 p-3">
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-gray-400">
                    3. Date of Marriage
                  </span>
                  <p className="mt-0.5 font-bold text-gray-900">{marriageRecord.dateOfMarriage}</p>
                </div>

                <div className="rounded-xl border border-zinc-200/80 bg-white/80 p-3">
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-gray-400">
                    4. Place of Marriage
                  </span>
                  <p className="mt-0.5 font-bold text-gray-900">{marriageRecord.placeOfMarriage}</p>
                </div>
              </div>
            </div>

            {/* Footer with QR Code and Seal */}
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 border-t-2 border-zinc-800 pt-5">
              {/* QR Verification Clickable */}
              <button
                type="button"
                onClick={() => setShowQrVerificationModal(true)}
                className="flex items-center gap-3 text-left transition hover:opacity-80"
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-xl border border-zinc-300 bg-white p-1 shadow-sm">
                  <svg viewBox="0 0 100 100" className="h-full w-full text-zinc-900" fill="currentColor">
                    <path d="M10 10h30v30h-30zM15 15v20h20v-20zM60 10h30v30h-30zM65 15v20h20v-20zM10 60h30v30h-30zM15 65v20h20v-20zM22 22h6v6h-6zM72 22h6v6h-6zM22 72h6v6h-6zM50 10h6v6h-6zM50 25h6v15h-6zM60 50h15v6h-15zM80 50h10v10h-10zM50 70h10v20h-10zM70 70h20v20h-20z" />
                  </svg>
                </div>
                <div>
                  <p className="font-mono text-[10px] font-bold uppercase text-gray-500">
                    Digital QR Seal
                  </p>
                  <p className="font-mono text-[11px] font-bold text-gray-800">
                    Click to Verify Online
                  </p>
                  <p className="text-[10px] text-emerald-700 font-semibold">
                    ✓ Status: VALID
                  </p>
                </div>
              </button>

              {/* Signature Placeholder */}
              <div className="text-center sm:text-right">
                <p className="font-serif italic text-xs text-gray-700 underline">
                  Atty. Fernando M. Gutierrez, Civil Registrar
                </p>
                <p className="text-[10px] font-bold uppercase text-gray-500">
                  City Civil Registrar of Malaybalay
                </p>
                <p className="font-mono text-[9px] text-gray-400">
                  Electronic Seal ID: LCRO-MC-AUTH-000194
                </p>
              </div>
            </div>

            {/* Watermark Banner Bottom */}
            <div className="mt-6 rounded-xl border border-red-200 bg-red-50/90 py-1.5 text-center font-mono text-[10px] font-extrabold uppercase tracking-widest text-red-700">
              SAMPLE – NOT AN OFFICIAL GOVERNMENT DOCUMENT
            </div>
          </div>

          <div className="pt-2">
            <Link
              to="/request-certificate"
              className="flex w-full items-center justify-center gap-2 rounded-2xl border border-zinc-200 bg-white py-3.5 text-xs font-bold text-gray-700 shadow-sm transition hover:bg-zinc-50"
            >
              Done & Return to Certificate Services
            </Link>
          </div>
        </section>
      )}

      {/* 14. QR Verification Modal */}
      {showQrVerificationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-zinc-900/60 backdrop-blur-xs"
            onClick={() => setShowQrVerificationModal(false)}
          />
          <div className="relative w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl animate-modal-in text-xs">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck size={20} className="text-emerald-600" />
                <span className="font-bold text-gray-900 text-sm">
                  Civil Registry QR Verification
                </span>
              </div>
              <button
                onClick={() => setShowQrVerificationModal(false)}
                className="rounded-lg p-1.5 text-gray-400 hover:bg-zinc-100 hover:text-gray-600"
              >
                <X size={16} />
              </button>
            </div>

            <div className="mt-4 space-y-3 rounded-2xl bg-zinc-50 p-4 text-gray-800">
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Certificate Number:</span>
                <span className="font-mono font-bold text-gray-900">{certificateNo}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Certificate Type:</span>
                <span className="font-bold text-gray-900">Marriage Certificate – Certified Copy</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Husband:</span>
                <span className="font-bold text-gray-900">{marriageRecord.husbandName}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Wife:</span>
                <span className="font-bold text-gray-900">{marriageRecord.wifeName}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Date of Marriage:</span>
                <span className="font-bold text-gray-900">{marriageRecord.dateOfMarriage}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Issue Date:</span>
                <span className="font-bold text-gray-900">
                  {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                </span>
              </div>
              <div className="flex items-center justify-between border-t border-zinc-200 pt-2">
                <span className="text-gray-500">Verification Status:</span>
                <span className="rounded-full bg-emerald-100 px-3 py-1 font-mono font-bold text-emerald-800 flex items-center gap-1">
                  <Check size={13} /> VALID
                </span>
              </div>
            </div>

            <p className="mt-3 text-center text-[10px] text-gray-400">
              Sample simulation data generated by ACORS Prototype.
            </p>

            <button
              type="button"
              onClick={() => setShowQrVerificationModal(false)}
              className="mt-4 w-full rounded-2xl bg-zinc-900 py-3 font-bold text-white shadow-sm hover:bg-zinc-800"
            >
              Close Verification
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
