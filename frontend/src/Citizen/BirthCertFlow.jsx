// src/Citizen/BirthCertFlow.jsx
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
} from "lucide-react";
import { saveLCRORequest } from "../services/lcroData";

const STEPS = [
  { id: "start", label: "Overview" },
  { id: "requester", label: "Requester" },
  { id: "record", label: "Record" },
  { id: "upload", label: "Upload ID" },
  { id: "ai_validation", label: "AI Scan" },
  { id: "verification", label: "Registry" },
  { id: "summary", label: "Summary" },
  { id: "payment", label: "Payment" },
  { id: "tracking", label: "Tracking" },
  { id: "ready", label: "Certificate" },
];

export default function BirthCertFlow({ office, cert }) {
  const [currentStep, setCurrentStep] = useState(0); // 0: start, 1: requester, 2: record, 3: upload, 4: ai, 5: registry, 6: summary, 7: payment, 8: tracking, 9: ready

  // Form states
  const [requester, setRequester] = useState({
    fullName: "Maria Clara Santos",
    address: "Purok 4, Poblacion, Malaybalay City, Bukidnon",
    contactNumber: "0917-882-9912",
    email: "maria.santos@gmail.com",
    relationship: "Self",
  });

  const [birthRecord, setBirthRecord] = useState({
    fullName: "Maria Clara Santos",
    fatherName: "Antonio Rivera Santos",
    motherMaidenName: "Clara Luna Reyes",
    dob: "1998-05-14",
    pob: "Malaybalay City, Bukidnon",
    copies: 1,
    purpose: "Passport Application / DFA",
  });

  const [idDetails, setIdDetails] = useState({
    idType: "Philippine National ID (PhilID)",
    fileName: "philid_front_maria_santos.jpg",
    previewUrl: "https://images.unsplash.com/photo-1544717305-2782549b5136?w=400&auto=format&fit=crop&q=80",
    isReadable: true,
    hasAuthLetter: false,
    authFileName: "",
    isConfirmed: true,
  });

  // Flow & AI State
  const [isAiProcessing, setIsAiProcessing] = useState(false);
  const [aiProgress, setAiProgress] = useState(0);
  const [aiResult, setAiResult] = useState({
    status: "PASSED",
    appComplete: true,
    reqComplete: true,
    infoMatched: true,
    noDuplicate: true,
    recommendation: "PASSED",
  });

  // Mock flag simulation toggle
  const [simulateFlagged, setSimulateFlagged] = useState(false);

  // Registry Verification State
  const [isVerifyingRegistry, setIsVerifyingRegistry] = useState(false);
  const [registryMatch, setRegistryMatch] = useState(true);

  // Payment state
  const [paymentMethod, setPaymentMethod] = useState("gcash");
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);

  // Generated Request Info
  const [requestId, setRequestId] = useState("ACORS-LCRO-2026-000001");
  const [certificateNo, setCertificateNo] = useState("LCRO-BC-2026-981244");
  const [trackingStatus, setTrackingStatus] = useState("processing"); // "submitted" | "processing" | "ready"

  // Step 4: AI Validation Simulator
  const triggerAiValidation = () => {
    setCurrentStep(4);
    setIsAiProcessing(true);
    setAiProgress(10);

    const interval = setInterval(() => {
      setAiProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsAiProcessing(false);
          if (simulateFlagged) {
            setAiResult({
              status: "FLAGGED",
              appComplete: true,
              reqComplete: true,
              infoMatched: false,
              noDuplicate: true,
              recommendation: "REQUIRES LGU REVIEW",
            });
          } else {
            setAiResult({
              status: "PASSED",
              appComplete: true,
              reqComplete: true,
              infoMatched: true,
              noDuplicate: true,
              recommendation: "PASSED",
            });
          }
          return 100;
        }
        return prev + 25;
      });
    }, 450);
  };

  // Step 5: Registry Verification Simulator
  const triggerRegistryVerification = () => {
    setCurrentStep(5);
    setIsVerifyingRegistry(true);
    setTimeout(() => {
      setIsVerifyingRegistry(false);
      setRegistryMatch(!simulateFlagged);
    }, 1500);
  };

  // Step 7 -> 8: Payment & Submission
  const handlePaymentSubmit = () => {
    setPaymentProcessing(true);
    setTimeout(() => {
      setPaymentProcessing(false);
      setPaymentConfirmed(true);

      const generatedReqId = `ACORS-LCRO-2026-${Math.floor(100000 + Math.random() * 900000).toString().slice(0, 6)}`;
      const generatedCertNo = `LCRO-BC-2026-${Math.floor(100000 + Math.random() * 900000)}`;
      setRequestId(generatedReqId);
      setCertificateNo(generatedCertNo);

      // Save to shared service for LGU Admin
      const newReq = {
        id: generatedReqId,
        certificateType: "Birth Certificate – Certified Copy",
        submittedAt: new Date().toISOString().replace("T", " ").substring(0, 16),
        status: simulateFlagged ? "Requires LGU Review" : "Processing",
        applicant: { ...requester },
        record: { ...birthRecord },
        idUpload: {
          idType: idDetails.idType,
          fileName: idDetails.fileName,
          readable: true,
          hasAuthorization: idDetails.hasAuthLetter,
        },
        aiValidation: {
          status: simulateFlagged ? "FLAGGED" : "PASSED",
          checks: [
            { label: "Required fields are complete", passed: true },
            { label: "Government ID uploaded & valid format", passed: true },
            { label: "ID is readable & authenticated", passed: true },
            { label: "Information from ID matches submitted data", passed: !simulateFlagged },
            { label: "No duplicate active request found", passed: true },
          ],
          recommendation: simulateFlagged ? "FLAGGED - Requires Manual LGU Verification" : "PASSED - Automated Approval",
        },
        recordVerification: {
          status: simulateFlagged ? "UNRESOLVED" : "MATCHED",
          registryBook: "Book No. 42, Page 119, Registry No. 98-0412",
          message: simulateFlagged
            ? "Record requires manual verification by City Civil Registrar staff."
            : "Civil Registry record exact match found.",
        },
        payment: {
          amount: 100 * (parseInt(birthRecord.copies) || 1),
          method: paymentMethod.toUpperCase(),
          reference: `TXN-${Math.floor(10000000 + Math.random() * 90000000)}`,
          paidAt: new Date().toISOString().replace("T", " ").substring(0, 16),
        },
        certificateNumber: simulateFlagged ? null : generatedCertNo,
        issueDate: new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
      };

      saveLCRORequest(newReq);

      setCurrentStep(8); // Tracking
    }, 1400);
  };

  // Auto-progress tracking for normal requests
  useEffect(() => {
    if (currentStep === 8 && !simulateFlagged) {
      const timer = setTimeout(() => {
        setTrackingStatus("ready");
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [currentStep, simulateFlagged]);

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
          LCRO Portal
        </span>
      </div>

      {/* Header Banner */}
      <div className="mt-4 flex items-center gap-3.5 rounded-3xl border border-zinc-200 bg-white p-4 shadow-sm sm:p-5">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-red-600 text-white shadow-md">
          <Building size={22} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-red-600">
            Civil Registrar&apos;s Office (LCRO)
          </p>
          <h1 className="text-lg font-extrabold leading-tight text-gray-900 sm:text-xl">
            Birth Certificate – Certified Copy
          </h1>
          <p className="mt-0.5 text-xs text-gray-500">
            Standard processing: ₱100.00 / copy · Instant AI verification
          </p>
        </div>
      </div>

      {/* Multi-Step Mini Progress Tracker */}
      {currentStep > 0 && currentStep < 9 && (
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

      {/* STEP 0: Start Application Screen */}
      {currentStep === 0 && (
        <section className="mt-5 space-y-4 animate-fade-up">
          <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
            <h2 className="text-base font-extrabold text-gray-900 sm:text-lg">
              Official Civil Registry Service Guide
            </h2>
            <p className="mt-1.5 text-xs leading-relaxed text-gray-500">
              Request a certified true copy of a Certificate of Live Birth registered with the Local Civil Registrar of Malaybalay City.
            </p>

            {/* Service Highlights */}
            <div className="mt-5 grid grid-cols-2 gap-3 text-xs">
              <div className="rounded-2xl border border-zinc-100 bg-zinc-50/80 p-3.5">
                <span className="font-bold text-gray-800">Processing Fee</span>
                <p className="mt-1 font-mono text-base font-extrabold text-red-600">₱100.00</p>
                <p className="text-[11px] text-gray-400">per certified copy</p>
              </div>
              <div className="rounded-2xl border border-zinc-100 bg-zinc-50/80 p-3.5">
                <span className="font-bold text-gray-800">Verification</span>
                <p className="mt-1 font-mono text-base font-extrabold text-gray-900">Instant AI</p>
                <p className="text-[11px] text-gray-400">Automated match check</p>
              </div>
            </div>

            {/* Checklist of Requirements */}
            <div className="mt-6">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-gray-500">
                Documentary Requirements
              </h3>
              <ul className="mt-3 space-y-2.5 text-xs text-gray-700">
                <li className="flex items-start gap-2.5 rounded-xl bg-zinc-50 p-2.5">
                  <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-emerald-600" />
                  <div>
                    <span className="font-bold text-gray-900">Valid Government-Issued ID</span>
                    <p className="text-gray-500">PhilID / National ID, Driver&apos;s License, Passport, UMID, Postal ID, or PRC ID</p>
                  </div>
                </li>
                <li className="flex items-start gap-2.5 rounded-xl bg-zinc-50 p-2.5">
                  <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-emerald-600" />
                  <div>
                    <span className="font-bold text-gray-900">Proof of Authority (if representative)</span>
                    <p className="text-gray-500">Signed Authorization Letter + ID of the record owner if requester is not the owner, parent, child, or spouse</p>
                  </div>
                </li>
              </ul>
            </div>

            {/* Quick simulation tester helper */}
            <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50/70 p-3.5 text-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Info size={16} className="text-amber-700" />
                  <span className="font-bold text-amber-900">Prototype Testing Preset</span>
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
                  ? "Test mode: Will trigger AI mismatch & send request to LGU Staff review queue."
                  : "Standard mode: Will auto-match civil registry records and generate ready certificate."}
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
                placeholder="e.g. Maria Clara Santos"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700">Residential Address</label>
              <input
                type="text"
                required
                value={requester.address}
                onChange={(e) => setRequester({ ...requester, address: e.target.value })}
                className="mt-1.5 w-full rounded-xl border border-zinc-200 bg-zinc-50/50 px-3.5 py-2.5 text-sm font-medium text-gray-900 focus:border-red-600 focus:bg-white focus:outline-none focus:ring-1 focus:ring-red-600"
                placeholder="e.g. Purok 4, Poblacion, Malaybalay City"
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
                  placeholder="0917-xxx-xxxx"
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
                  placeholder="maria@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-gray-700">Relationship to Record Owner</label>
              <select
                value={requester.relationship}
                onChange={(e) => setRequester({ ...requester, relationship: e.target.value })}
                className="mt-1.5 w-full rounded-xl border border-zinc-200 bg-zinc-50/50 px-3.5 py-2.5 text-sm font-medium text-gray-900 focus:border-red-600 focus:bg-white focus:outline-none focus:ring-1 focus:ring-red-600"
              >
                <option value="Self">Self (Record Owner)</option>
                <option value="Parent / Mother">Parent / Mother</option>
                <option value="Parent / Father">Parent / Father</option>
                <option value="Child">Child</option>
                <option value="Spouse">Spouse</option>
                <option value="Legal Guardian">Legal Guardian</option>
                <option value="Authorized Representative">Authorized Representative</option>
              </select>
            </div>

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
                Continue to Record Details
              </button>
            </div>
          </form>
        </section>
      )}

      {/* STEP 2: Birth Record Information */}
      {currentStep === 2 && (
        <section className="mt-5 animate-fade-up rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-600 font-bold">
              2
            </span>
            <div>
              <h2 className="text-base font-extrabold text-gray-900">
                Birth Record Information
              </h2>
              <p className="text-xs text-gray-500">
                Enter details exactly as they appear in the birth certificate.
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
              <label className="block font-bold text-gray-700">Complete Name of Child / Person on Record</label>
              <input
                type="text"
                required
                value={birthRecord.fullName}
                onChange={(e) => setBirthRecord({ ...birthRecord, fullName: e.target.value })}
                className="mt-1.5 w-full rounded-xl border border-zinc-200 bg-zinc-50/50 px-3.5 py-2.5 text-sm font-medium text-gray-900 focus:border-red-600 focus:bg-white focus:outline-none focus:ring-1 focus:ring-red-600"
                placeholder="First Name, Middle Name, Last Name"
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block font-bold text-gray-700">Father&apos;s Full Name</label>
                <input
                  type="text"
                  required
                  value={birthRecord.fatherName}
                  onChange={(e) => setBirthRecord({ ...birthRecord, fatherName: e.target.value })}
                  className="mt-1.5 w-full rounded-xl border border-zinc-200 bg-zinc-50/50 px-3.5 py-2.5 text-sm font-medium text-gray-900 focus:border-red-600 focus:bg-white focus:outline-none focus:ring-1 focus:ring-red-600"
                  placeholder="Father's Complete Name"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700">Mother&apos;s Maiden Name</label>
                <input
                  type="text"
                  required
                  value={birthRecord.motherMaidenName}
                  onChange={(e) => setBirthRecord({ ...birthRecord, motherMaidenName: e.target.value })}
                  className="mt-1.5 w-full rounded-xl border border-zinc-200 bg-zinc-50/50 px-3.5 py-2.5 text-sm font-medium text-gray-900 focus:border-red-600 focus:bg-white focus:outline-none focus:ring-1 focus:ring-red-600"
                  placeholder="Mother's Full Maiden Name"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block font-bold text-gray-700">Date of Birth</label>
                <input
                  type="date"
                  required
                  value={birthRecord.dob}
                  onChange={(e) => setBirthRecord({ ...birthRecord, dob: e.target.value })}
                  className="mt-1.5 w-full rounded-xl border border-zinc-200 bg-zinc-50/50 px-3.5 py-2.5 text-sm font-medium text-gray-900 focus:border-red-600 focus:bg-white focus:outline-none focus:ring-1 focus:ring-red-600"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700">Place of Birth</label>
                <input
                  type="text"
                  required
                  value={birthRecord.pob}
                  onChange={(e) => setBirthRecord({ ...birthRecord, pob: e.target.value })}
                  className="mt-1.5 w-full rounded-xl border border-zinc-200 bg-zinc-50/50 px-3.5 py-2.5 text-sm font-medium text-gray-900 focus:border-red-600 focus:bg-white focus:outline-none focus:ring-1 focus:ring-red-600"
                  placeholder="City/Municipality, Province"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block font-bold text-gray-700">Number of Copies</label>
                <select
                  value={birthRecord.copies}
                  onChange={(e) => setBirthRecord({ ...birthRecord, copies: parseInt(e.target.value) || 1 })}
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
                  value={birthRecord.purpose}
                  onChange={(e) => setBirthRecord({ ...birthRecord, purpose: e.target.value })}
                  className="mt-1.5 w-full rounded-xl border border-zinc-200 bg-zinc-50/50 px-3.5 py-2.5 text-sm font-medium text-gray-900 focus:border-red-600 focus:bg-white focus:outline-none focus:ring-1 focus:ring-red-600"
                >
                  <option value="Passport Application / DFA">Passport Application / DFA</option>
                  <option value="School Enrollment / DepEd / CHED">School Enrollment / DepEd / CHED</option>
                  <option value="Local Employment">Local Employment</option>
                  <option value="Overseas Employment / POEA">Overseas Employment / POEA</option>
                  <option value="Identification Card Application">Identification Card Application</option>
                  <option value="Legal Claims / SSS / GSIS">Legal Claims / SSS / GSIS</option>
                  <option value="Other Official Purposes">Other Official Purposes</option>
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
                Continue to ID Upload
              </button>
            </div>
          </form>
        </section>
      )}

      {/* STEP 3: Upload Valid ID */}
      {currentStep === 3 && (
        <section className="mt-5 animate-fade-up rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-600 font-bold">
              3
            </span>
            <div>
              <h2 className="text-base font-extrabold text-gray-900">
                Upload Valid Government ID
              </h2>
              <p className="text-xs text-gray-500">
                Upload a clear photo or scan of your primary identification card.
              </p>
            </div>
          </div>

          <div className="mt-6 space-y-4 text-xs">
            <div>
              <label className="block font-bold text-gray-700">Primary ID Type</label>
              <select
                value={idDetails.idType}
                onChange={(e) => setIdDetails({ ...idDetails, idType: e.target.value })}
                className="mt-1.5 w-full rounded-xl border border-zinc-200 bg-zinc-50/50 px-3.5 py-2.5 text-sm font-medium text-gray-900 focus:border-red-600 focus:bg-white focus:outline-none focus:ring-1 focus:ring-red-600"
              >
                <option value="Philippine National ID (PhilID)">Philippine National ID (PhilID)</option>
                <option value="Driver's License">Driver&apos;s License (LTO)</option>
                <option value="Philippine Passport">Philippine Passport (DFA)</option>
                <option value="UMID Card">Unified Multi-Purpose ID (UMID)</option>
                <option value="Postal ID">Postal ID (Digitized)</option>
                <option value="PRC License">Professional Regulation Commission (PRC) ID</option>
                <option value="Voter's Certification">COMELEC Voter&apos;s Certification</option>
              </select>
            </div>

            {/* Dropzone with preview */}
            <div className="rounded-2xl border-2 border-dashed border-zinc-200 bg-zinc-50/60 p-5 text-center transition hover:border-red-300">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-600">
                <Upload size={22} />
              </div>
              <p className="mt-3 text-xs font-bold text-gray-800">
                Uploaded: <span className="font-mono text-red-600">{idDetails.fileName}</span>
              </p>
              <p className="mt-1 text-[11px] text-gray-400">
                JPEG, PNG or PDF (Max 10MB) · High resolution scan verified
              </p>

              {idDetails.previewUrl && (
                <div className="mt-4 inline-flex items-center gap-2 rounded-xl bg-white px-3 py-1.5 shadow-sm border border-zinc-200">
                  <Check size={14} className="text-emerald-600" />
                  <span className="text-[11px] font-semibold text-gray-700">Valid ID Image Attached & Ready</span>
                </div>
              )}
            </div>

            {/* Representative Authorization Upload if needed */}
            {requester.relationship === "Authorized Representative" && (
              <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
                <label className="flex items-center gap-2 font-bold text-gray-900">
                  <input
                    type="checkbox"
                    checked={idDetails.hasAuthLetter}
                    onChange={(e) => setIdDetails({ ...idDetails, hasAuthLetter: e.target.checked })}
                    className="h-4 w-4 rounded border-zinc-300 text-red-600 focus:ring-red-500"
                  />
                  <span>Authorization Letter Attached</span>
                </label>
                <p className="mt-1 text-[11px] text-gray-500">
                  Include signed authorization letter and photocopy of record owner&apos;s ID.
                </p>
              </div>
            )}

            {/* Verification confirmation */}
            <div className="rounded-2xl border border-zinc-200 bg-white p-4">
              <label className="flex items-start gap-2.5 font-medium text-gray-700">
                <input
                  type="checkbox"
                  checked={idDetails.isConfirmed}
                  onChange={(e) => setIdDetails({ ...idDetails, isConfirmed: e.target.checked })}
                  className="mt-0.5 h-4 w-4 rounded border-zinc-300 text-red-600 focus:ring-red-500"
                />
                <span className="text-xs leading-relaxed">
                  I certify that the uploaded government ID is authentic, unexpired, clearly readable, and belongs to the authorized applicant.
                </span>
              </label>
            </div>

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
                disabled={!idDetails.isConfirmed}
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
              <Sparkles size={20} />
            </span>
            <div>
              <h2 className="text-base font-extrabold text-gray-900">
                AI Automated Validation
              </h2>
              <p className="text-xs text-gray-500">
                Verifying application completeness, ID readability, and OCR name matching.
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
                <p className="text-sm font-extrabold text-gray-900">Analyzing Document & Application...</p>
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
              {/* Validation Result Badges */}
              <div className="space-y-2 rounded-2xl border border-zinc-100 bg-zinc-50 p-4">
                <div className="flex items-center justify-between py-1">
                  <span className="font-medium text-gray-700">Required fields complete</span>
                  <span className="flex items-center gap-1 font-bold text-emerald-600">
                    <CheckCircle2 size={15} /> Application Complete
                  </span>
                </div>
                <div className="flex items-center justify-between border-t border-zinc-200/60 py-1 pt-2">
                  <span className="font-medium text-gray-700">ID uploaded & readable</span>
                  <span className="flex items-center gap-1 font-bold text-emerald-600">
                    <CheckCircle2 size={15} /> Requirements Complete
                  </span>
                </div>
                <div className="flex items-center justify-between border-t border-zinc-200/60 py-1 pt-2">
                  <span className="font-medium text-gray-700">ID matches submitted info</span>
                  {aiResult.infoMatched ? (
                    <span className="flex items-center gap-1 font-bold text-emerald-600">
                      <CheckCircle2 size={15} /> Information Matched
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 font-bold text-amber-600">
                      <AlertCircle size={15} /> Name Variance Detected
                    </span>
                  )}
                </div>
                <div className="flex items-center justify-between border-t border-zinc-200/60 py-1 pt-2">
                  <span className="font-medium text-gray-700">Duplicate check</span>
                  <span className="flex items-center gap-1 font-bold text-emerald-600">
                    <CheckCircle2 size={15} /> No Active Duplicates
                  </span>
                </div>
              </div>

              {/* Recommendation Box */}
              <div
                className={`rounded-2xl p-4 ${
                  aiResult.status === "PASSED"
                    ? "border border-emerald-200 bg-emerald-50/80 text-emerald-950"
                    : "border border-amber-200 bg-amber-50/80 text-amber-950"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider">
                    AI Recommendation
                  </span>
                  <span
                    className={`rounded-full px-3 py-1 font-mono text-xs font-extrabold ${
                      aiResult.status === "PASSED"
                        ? "bg-emerald-600 text-white"
                        : "bg-amber-600 text-white"
                    }`}
                  >
                    {aiResult.recommendation}
                  </span>
                </div>
                <p className="mt-2 text-[11px] leading-relaxed">
                  {aiResult.status === "PASSED"
                    ? "All checks passed with 99.4% confidence score. Ready for instant Civil Registry database match."
                    : "Slight record variance flagged. Request will be forwarded for human LGU Civil Registrar review."}
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

      {/* STEP 5: Record Verification Step */}
      {currentStep === 5 && (
        <section className="mt-5 animate-fade-up rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-600 font-bold">
              <Search size={20} />
            </span>
            <div>
              <h2 className="text-base font-extrabold text-gray-900">
                Civil Registry Database Lookup
              </h2>
              <p className="text-xs text-gray-500">
                Matching against LCRO Malaybalay Local Civil Registry records.
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
                <p className="text-sm font-extrabold text-gray-900">Querying Local Civil Registry...</p>
                <p className="mt-1 font-mono text-xs text-gray-500">Indexing Book & Page Registry Records</p>
              </div>
            </div>
          ) : (
            <div className="mt-6 space-y-4 animate-fade-in text-xs">
              {registryMatch ? (
                <div className="space-y-4">
                  <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-4 text-emerald-950">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 size={18} className="text-emerald-600" />
                      <span className="text-sm font-extrabold">Civil Registry Record Found</span>
                    </div>
                    <div className="mt-3 space-y-1.5 text-xs">
                      <p>
                        <span className="font-semibold text-emerald-900">Registry Book:</span> Book No. 42, Page 119
                      </p>
                      <p>
                        <span className="font-semibold text-emerald-900">Registry No:</span> 98-0412
                      </p>
                      <p>
                        <span className="font-semibold text-emerald-900">Registered Name:</span> {birthRecord.fullName}
                      </p>
                      <p>
                        <span className="font-semibold text-emerald-900">Registration Date:</span> May 20, 1998
                      </p>
                    </div>
                  </div>

                  <p className="text-xs text-gray-500">
                    Your record has been verified. Continue to the summary and payment step to finalize your request.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="rounded-2xl border border-amber-200 bg-amber-50/70 p-4 text-amber-950">
                    <div className="flex items-center gap-2">
                      <AlertCircle size={18} className="text-amber-700" />
                      <span className="text-sm font-extrabold">Requires LGU Review</span>
                    </div>
                    <p className="mt-2 text-xs leading-relaxed">
                      Exact electronic match could not be automatically established. Your request will be queued for manual archival search by LCRO staff.
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
                Please review all information prior to processing payment.
              </p>
            </div>
            <span className="rounded-full bg-red-50 px-3 py-1 font-mono text-xs font-bold text-red-600">
              LCRO-BC
            </span>
          </div>

          <div className="mt-6 space-y-4 text-xs">
            {/* Requester Box */}
            <div className="rounded-2xl border border-zinc-100 bg-zinc-50 p-4">
              <span className="font-extrabold uppercase tracking-wider text-gray-400 text-[10px]">
                Requester Details
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

            {/* Birth Record Box */}
            <div className="rounded-2xl border border-zinc-100 bg-zinc-50 p-4">
              <span className="font-extrabold uppercase tracking-wider text-gray-400 text-[10px]">
                Birth Record Details
              </span>
              <div className="mt-2 space-y-2 text-gray-700">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-gray-400 block">Record Name</span>
                    <span className="font-bold text-gray-900">{birthRecord.fullName}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block">Date of Birth</span>
                    <span className="font-bold text-gray-900">{birthRecord.dob}</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-gray-400 block">Father&apos;s Name</span>
                    <span className="font-medium text-gray-900">{birthRecord.fatherName}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block">Mother&apos;s Maiden Name</span>
                    <span className="font-medium text-gray-900">{birthRecord.motherMaidenName}</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 pt-1 border-t border-zinc-200/50">
                  <div>
                    <span className="text-gray-400 block">Place of Birth</span>
                    <span className="font-medium text-gray-900">{birthRecord.pob}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block">Purpose</span>
                    <span className="font-medium text-gray-900">{birthRecord.purpose}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Computation */}
            <div className="rounded-2xl border border-red-100 bg-red-50/50 p-4">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-gray-700">Certified Copy Fee (₱100.00 × {birthRecord.copies})</span>
                <span className="font-mono font-bold text-gray-900">₱{(100 * birthRecord.copies).toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between text-xs mt-1">
                <span className="font-medium text-gray-700">Convenience & System Fee</span>
                <span className="font-mono font-bold text-emerald-600">FREE (Waived)</span>
              </div>
              <div className="mt-3 flex items-center justify-between border-t border-red-100 pt-2 text-sm">
                <span className="font-extrabold text-gray-900">Total Amount Due</span>
                <span className="font-mono text-base font-extrabold text-red-600">
                  ₱{(100 * birthRecord.copies).toFixed(2)}
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
                Secure Online Payment
              </h2>
              <p className="text-xs text-gray-500">
                Simulated ₱{(100 * birthRecord.copies).toFixed(2)} payment gateway.
              </p>
            </div>
          </div>

          <div className="mt-6 space-y-4 text-xs">
            <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4 text-center">
              <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                Total Payment Amount
              </span>
              <p className="mt-1 font-mono text-3xl font-extrabold text-gray-900">
                ₱{(100 * birthRecord.copies).toFixed(2)}
              </p>
              <p className="mt-1 text-[11px] text-gray-500">
                Service: Birth Certificate Certified Copy ({birthRecord.copies} {birthRecord.copies > 1 ? "copies" : "copy"})
              </p>
            </div>

            <div>
              <label className="block font-bold text-gray-700">Select Payment Method</label>
              <div className="mt-2 grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setPaymentMethod("gcash")}
                  className={`flex items-center gap-3 rounded-2xl border p-3 text-left transition ${
                    paymentMethod === "gcash"
                      ? "border-red-600 bg-red-50/50 ring-1 ring-red-600"
                      : "border-zinc-200 bg-white hover:border-zinc-300"
                  }`}
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-600 text-xs font-extrabold text-white">
                    G
                  </div>
                  <div>
                    <span className="block font-bold text-gray-900">GCash</span>
                    <span className="text-[10px] text-gray-400">E-Wallet (Instant)</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod("maya")}
                  className={`flex items-center gap-3 rounded-2xl border p-3 text-left transition ${
                    paymentMethod === "maya"
                      ? "border-red-600 bg-red-50/50 ring-1 ring-red-600"
                      : "border-zinc-200 bg-white hover:border-zinc-300"
                  }`}
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-600 text-xs font-extrabold text-white">
                    M
                  </div>
                  <div>
                    <span className="block font-bold text-gray-900">Maya</span>
                    <span className="text-[10px] text-gray-400">Wallet & Cards</span>
                  </div>
                </button>
              </div>
            </div>

            <div className="rounded-2xl border border-zinc-100 bg-zinc-50 p-4 text-[11px] text-gray-500 leading-relaxed">
              <span className="font-bold text-gray-800">Mock Prototype Simulation:</span> No real card or wallet deduction will take place. Clicking &ldquo;Confirm & Pay&rdquo; will generate an official ACORS request tracking record.
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
                onClick={handlePaymentSubmit}
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
                    Confirm & Pay ₱{(100 * birthRecord.copies).toFixed(2)}
                  </>
                )}
              </button>
            </div>
          </div>
        </section>
      )}

      {/* STEP 8: Request Tracking */}
      {currentStep === 8 && (
        <section className="mt-5 space-y-4 animate-fade-up">
          {/* Tracking Header Card */}
          <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-red-600">
                  Request Confirmed
                </span>
                <h2 className="mt-1 font-mono text-xl font-extrabold text-gray-900 sm:text-2xl">
                  {requestId}
                </h2>
                <p className="mt-1 text-xs text-gray-500">
                  Birth Certificate – Certified Copy · {birthRecord.fullName}
                </p>
              </div>
              <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-600" />
                ₱{(100 * birthRecord.copies).toFixed(2)} Paid
              </span>
            </div>

            {/* Tracking Status Timeline */}
            <div className="mt-8 space-y-4">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-gray-400">
                Application Status Timeline
              </h3>

              <div className="space-y-4">
                {/* 1. Submitted */}
                <div className="flex items-start gap-3.5">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white shadow-sm">
                    <Check size={14} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-900">Submitted</p>
                    <p className="text-[11px] text-gray-500">Request received into ACORS system</p>
                  </div>
                </div>

                {/* 2. AI Validation */}
                <div className="flex items-start gap-3.5">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white shadow-sm">
                    <Check size={14} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-900">AI Validation</p>
                    <p className="text-[11px] text-gray-500">
                      {simulateFlagged ? "Flagged for Human Review" : "Automated OCR & Integrity Check Passed"}
                    </p>
                  </div>
                </div>

                {/* 3. Record Verification */}
                <div className="flex items-start gap-3.5">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white shadow-sm">
                    <Check size={14} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-900">Record Verification</p>
                    <p className="text-[11px] text-gray-500">
                      {simulateFlagged ? "Pending manual archive index lookup" : "Verified in LCRO Book No. 42"}
                    </p>
                  </div>
                </div>

                {/* 4. Payment Confirmed */}
                <div className="flex items-start gap-3.5">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white shadow-sm">
                    <Check size={14} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-900">Payment Confirmed</p>
                    <p className="text-[11px] text-gray-500">₱{(100 * birthRecord.copies).toFixed(2)} received via {paymentMethod.toUpperCase()}</p>
                  </div>
                </div>

                {/* 5. Processing */}
                <div className="flex items-start gap-3.5">
                  <div
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${
                      trackingStatus === "ready"
                        ? "bg-emerald-600 text-white"
                        : "bg-amber-500 text-white animate-pulse"
                    }`}
                  >
                    {trackingStatus === "ready" ? <Check size={14} /> : <Clock3 size={14} />}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-900">
                      {trackingStatus === "ready" ? "Processing Completed" : "⏳ Processing"}
                    </p>
                    <p className="text-[11px] text-gray-500">
                      {trackingStatus === "ready"
                        ? "Certificate generated and cryptographically sealed"
                        : simulateFlagged
                        ? "In queue for LCRO staff manual endorsement"
                        : "Generating official security certificate copy..."}
                    </p>
                  </div>
                </div>

                {/* 6. Certificate Ready */}
                <div className="flex items-start gap-3.5">
                  <div
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${
                      trackingStatus === "ready"
                        ? "bg-emerald-600 text-white"
                        : "border-2 border-zinc-300 bg-white text-zinc-300"
                    }`}
                  >
                    {trackingStatus === "ready" ? <Check size={14} /> : <span className="h-2 w-2 rounded-full bg-zinc-300" />}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-900">
                      {trackingStatus === "ready" ? "✓ Certificate Ready" : "○ Certificate Ready"}
                    </p>
                    <p className="text-[11px] text-gray-500">
                      {trackingStatus === "ready"
                        ? "Sample certificate is ready for download and view"
                        : "Awaiting final approval"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            {trackingStatus === "ready" ? (
              <div className="mt-8 rounded-2xl bg-emerald-50 p-4 text-center animate-fade-in">
                <p className="text-xs font-bold text-emerald-900">
                  🎉 Your Certified Copy is Ready!
                </p>
                <button
                  type="button"
                  onClick={() => setCurrentStep(9)}
                  className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3 text-xs font-bold text-white shadow-sm transition hover:bg-emerald-700"
                >
                  <Eye size={16} />
                  View & Download Certificate
                </button>
              </div>
            ) : simulateFlagged ? (
              <div className="mt-8 rounded-2xl bg-amber-50 p-4 text-xs text-amber-900">
                <p className="font-bold">Sent to LGU Civil Registrar Queue</p>
                <p className="mt-1 text-[11px]">
                  Staff will review your ID and birth record match. You can track this request in your Resident Dashboard.
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

      {/* STEP 9: Certificate Ready (Sample Certificate View) */}
      {currentStep === 9 && (
        <section className="mt-5 space-y-5 animate-fade-up">
          {/* Certificate Action Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={20} className="text-emerald-600" />
              <div>
                <span className="block text-xs font-bold text-gray-900">Certified Copy Ready</span>
                <span className="font-mono text-[11px] text-gray-500">No: {certificateNo}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
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

          {/* OFFICIAL SAMPLE BIRTH CERTIFICATE CARD */}
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
                Certificate of Live Birth
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
                <span className="font-bold text-gray-800">Book 42, Page 119</span>
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
              <div className="rounded-xl border border-zinc-200/80 bg-white/80 p-3">
                <span className="block text-[10px] font-bold uppercase tracking-wider text-gray-400">
                  1. Full Name of Child / Person on Record
                </span>
                <p className="mt-0.5 text-sm font-extrabold text-gray-900">{birthRecord.fullName}</p>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-zinc-200/80 bg-white/80 p-3">
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-gray-400">
                    2. Date of Birth
                  </span>
                  <p className="mt-0.5 font-bold text-gray-900">{birthRecord.dob}</p>
                </div>

                <div className="rounded-xl border border-zinc-200/80 bg-white/80 p-3">
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-gray-400">
                    3. Place of Birth
                  </span>
                  <p className="mt-0.5 font-bold text-gray-900">{birthRecord.pob}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-zinc-200/80 bg-white/80 p-3">
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-gray-400">
                    4. Father&apos;s Full Name
                  </span>
                  <p className="mt-0.5 font-bold text-gray-900">{birthRecord.fatherName}</p>
                </div>

                <div className="rounded-xl border border-zinc-200/80 bg-white/80 p-3">
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-gray-400">
                    5. Mother&apos;s Maiden Name
                  </span>
                  <p className="mt-0.5 font-bold text-gray-900">{birthRecord.motherMaidenName}</p>
                </div>
              </div>
            </div>

            {/* Footer with QR Code and Seal */}
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 border-t-2 border-zinc-800 pt-5">
              {/* QR Verification */}
              <div className="flex items-center gap-3">
                <div className="flex h-16 w-16 items-center justify-center rounded-xl border border-zinc-300 bg-white p-1 shadow-sm">
                  <svg viewBox="0 0 100 100" className="h-full w-full text-zinc-900" fill="currentColor">
                    <path d="M10 10h30v30h-30zM15 15v20h20v-20zM60 10h30v30h-30zM65 15v20h20v-20zM10 60h30v30h-30zM15 65v20h20v-20zM22 22h6v6h-6zM72 22h6v6h-6zM22 72h6v6h-6zM50 10h6v6h-6zM50 25h6v15h-6zM60 50h15v6h-15zM80 50h10v10h-10zM50 70h10v20h-10zM70 70h20v20h-20z" />
                  </svg>
                </div>
                <div>
                  <p className="font-mono text-[10px] font-bold uppercase text-gray-500">
                    Digital Seal Verification
                  </p>
                  <p className="font-mono text-[11px] font-bold text-gray-800">
                    ACORS-LCRO-SECURE-2026
                  </p>
                  <p className="text-[10px] text-emerald-700 font-semibold">
                    ✓ Verified Civil Registry Copy
                  </p>
                </div>
              </div>

              {/* Signature Placeholder */}
              <div className="text-center sm:text-right">
                <p className="font-serif italic text-xs text-gray-700 underline">
                  Atty. Fernando M. Gutierrez, Civil Registrar
                </p>
                <p className="text-[10px] font-bold uppercase text-gray-500">
                  City Civil Registrar of Malaybalay
                </p>
                <p className="font-mono text-[9px] text-gray-400">
                  Electronic Seal ID: 8849-0129-BC
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
    </div>
  );
}
