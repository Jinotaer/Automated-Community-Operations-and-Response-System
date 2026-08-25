// src/Citizen/SeniorCitizenIDFlow.jsx
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
  Users,
  Heart,
  Phone,
  Calendar,
} from "lucide-react";
import { saveOSCARequest, findMockSeniorRecord } from "../services/oscaData";

const STEPS = [
  "Start Application",
  "Applicant Info",
  "Residency & Contact",
  "Upload Requirements",
  "AI Validation & OCR",
  "Registry Check",
  "Request Summary",
  "Tracking",
  "Senior ID Ready",
];

const CIVIL_STATUSES = ["Single", "Married", "Widowed", "Separated", "Other"];

export default function SeniorCitizenIDFlow({ office, cert }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [testMode, setTestMode] = useState("normal"); // "normal" | "missing_residence"

  const [applicant, setApplicant] = useState({
    fullName: "Maria Santos",
    dob: "1955-01-15",
    sex: "Female",
    civilStatus: "Widowed",
    address: "Purok 3, Rizal Street, Poblacion, Malaybalay City",
    barangay: "Poblacion",
    contactNumber: "0917-223-8899",
    email: "maria.santos@gmail.com",
  });

  const [residency, setResidency] = useState({
    barangay: "Poblacion",
    city: "Malaybalay City",
    province: "Bukidnon",
    yearsOfResidence: "45",
  });

  const [emergencyContact, setEmergencyContact] = useState({
    name: "Roberto Santos",
    relationship: "Son",
    contactNumber: "0917-555-1234",
  });

  const [idFile, setIdFile] = useState({ name: "voters_id_santos.jpg", type: "image/jpeg", size: "1.1 MB", uploaded: true });
  const [birthCertFile, setBirthCertFile] = useState({ name: "psa_birth_cert_maria.pdf", type: "application/pdf", size: "1.9 MB", uploaded: true });
  const [residenceFile, setResidenceFile] = useState({
    name: testMode === "missing_residence" ? "" : "brgy_residence_santos.pdf",
    type: "application/pdf",
    size: "0.8 MB",
    uploaded: testMode !== "missing_residence",
  });
  const [photoFile, setPhotoFile] = useState({ name: "id_photo_maria.jpg", type: "image/jpeg", size: "0.6 MB", uploaded: true });
  const [supportFile, setSupportFile] = useState({ name: "", uploaded: false });

  const [aiScanning, setAiScanning] = useState(false);
  const [aiProgress, setAiProgress] = useState(0);
  const [aiChecks, setAiChecks] = useState([]);
  const [ocrData, setOcrData] = useState(null);

  const [matchedRecord, setMatchedRecord] = useState(null);
  const [isCheckingRegistry, setIsCheckingRegistry] = useState(false);

  const [generatedReqId, setGeneratedReqId] = useState("");
  const [issuedCardNo, setIssuedCardNo] = useState("");
  const [submittedTime, setSubmittedTime] = useState("");

  const [showQRModal, setShowQRModal] = useState(false);
  const [notificationToast, setNotificationToast] = useState(null);

  const aiChecksDef = [
    { label: "Required fields completed", passed: true },
    { label: "Valid Government ID uploaded", passed: true },
    { label: "Birth certificate / proof of DOB uploaded", passed: true },
    { label: "Proof of residence uploaded", passed: testMode !== "missing_residence" },
    { label: "Document readability", passed: true },
    { label: "Name consistency across documents", passed: true },
    { label: "Date of birth (60+ years qualifying age)", passed: true },
    { label: "Possible duplicate application", passed: true },
    { label: "1x1 / 2x2 Photo uploaded", passed: true },
  ];

  const aiStatus = testMode === "normal" ? "READY FOR OSCA REVIEW" : "REQUIRES CORRECTION";

  function runAIValidation() {
    setAiScanning(true);
    setAiProgress(0);
    setAiChecks([]);
    setOcrData(null);

    let i = 0;
    const interval = setInterval(() => {
      i += 1;
      setAiProgress(Math.round((i / aiChecksDef.length) * 100));
      setAiChecks((prev) => [...prev, aiChecksDef[i - 1]]);
      if (i >= aiChecksDef.length) {
        clearInterval(interval);
        setAiScanning(false);
        setOcrData({
          fullName: applicant.fullName,
          dob: "January 15, 1955",
          address: "Poblacion, Malaybalay City",
          idNumber: "PSA-BC-1955-009122",
        });
      }
    }, 280);
  }

  function runRegistryCheck() {
    setIsCheckingRegistry(true);
    setTimeout(() => {
      const found = findMockSeniorRecord({ fullName: applicant.fullName, dob: applicant.dob });
      setMatchedRecord(found || false);
      setIsCheckingRegistry(false);
    }, 1800);
  }

  function handleSubmit() {
    const reqId = `ACORS-OSCA-2026-${String(Math.floor(10000 + Math.random() * 90000)).padStart(6, "0")}`;
    const cardNo = `OSCA-ID-2026-${Math.floor(10000 + Math.random() * 90000)}`;
    const now = new Date().toLocaleString("en-US", {
      month: "long", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit",
    });
    setGeneratedReqId(reqId);
    setIssuedCardNo(cardNo);
    setSubmittedTime(now);

    saveOSCARequest({
      id: reqId,
      certificateType: "Senior Citizen ID",
      submittedAt: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      status: testMode === "normal" ? "Ready for OSCA Verification" : "Requires Correction",
      applicant: { ...applicant },
      residency: { ...residency },
      emergencyContact: { ...emergencyContact },
      aiValidation: {
        status: aiStatus,
        confidence: "96%",
        checks: aiChecksDef,
        ocrExtracted: {
          fullName: applicant.fullName,
          dob: "January 15, 1955",
          address: `${applicant.barangay}, Malaybalay City`,
          idNumber: "PSA-BC-1955-009122",
        },
        recommendation: testMode === "normal"
          ? "Application complete. Senior citizen qualifying age (71 years) verified through PSA Birth Certificate."
          : "Proof of residence document is missing. Applicant must upload barangay certification of residency.",
      },
      registryVerification: matchedRecord && typeof matchedRecord === "object"
        ? { status: "MATCHED", registryNumber: matchedRecord.registryNumber, message: "Senior Citizen Record Found & Active in Masterlist." }
        : { status: "NEW_APPLICANT", message: "New applicant record. Prepared for initial OSCA registration." },
      payment: {
        status: "FREE",
        amount: "FREE (RA 7432 / RA 9994)",
      },
      verificationStatus: testMode === "normal" ? "Pending OSCA Staff Verification" : "Awaiting Document Correction",
      correctionNote: testMode === "missing_residence" ? "Barangay Certificate of Residency is missing. Please upload your proof of residency." : undefined,
      certificateNumber: cardNo,
      issueDate: new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
      documents: [
        { name: "Valid Government ID", fileName: idFile.name, verified: idFile.uploaded },
        { name: "PSA Birth Certificate", fileName: birthCertFile.name, verified: birthCertFile.uploaded },
        { name: "Proof of Residence", fileName: residenceFile.name, verified: residenceFile.uploaded, missing: !residenceFile.uploaded },
        { name: "2x2 ID Photo", fileName: photoFile.name, verified: photoFile.uploaded },
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
            Senior Citizen ID Application Guidelines
          </h2>
          <p className="mt-1.5 text-xs leading-relaxed text-gray-500 sm:text-sm">
            Apply for your official Senior Citizen Identification Card in accordance with Republic Act No. 7432 and Republic Act No. 9994 (Expanded Senior Citizens Act).
          </p>

          <div className="mt-5 grid grid-cols-2 gap-3 text-xs">
            <div className="rounded-2xl border border-zinc-100 bg-zinc-50/80 p-3.5">
              <span className="font-bold text-gray-800">Processing Fee</span>
              <p className="mt-1 font-mono text-base font-extrabold text-emerald-600">FREE</p>
              <p className="text-[11px] text-gray-400">100% Free under RA 9994</p>
            </div>
            <div className="rounded-2xl border border-zinc-100 bg-zinc-50/80 p-3.5">
              <span className="font-bold text-gray-800">Qualifying Age</span>
              <p className="mt-1 font-mono text-base font-extrabold text-gray-900">60+ Years</p>
              <p className="text-[11px] text-gray-400">Filipino citizen resident</p>
            </div>
          </div>

          <div className="mt-5 rounded-2xl bg-zinc-50 p-4">
            <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-gray-500 mb-3">Required Documents</p>
            {[
              "Valid Government ID (if available)",
              "PSA Birth Certificate or Proof of Date of Birth",
              "Barangay Certificate of Residency",
              "1x1 or 2x2 ID Photo (clear white background)",
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
              IMPORTANT: The AI does not decide eligibility. AI assists by validating document completeness. Final approval is conducted by authorized OSCA personnel.
            </span>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-2.5">
            <span className="text-xs font-bold text-gray-500">Test Simulation:</span>
            {[
              { key: "normal", label: "Complete Pass (96%)" },
              { key: "missing_residence", label: "Missing Residence Proof (Correction)" },
            ].map((m) => (
              <button
                key={m.key}
                type="button"
                onClick={() => {
                  setTestMode(m.key);
                  if (m.key === "missing_residence") {
                    setResidenceFile({ name: "", uploaded: false });
                  } else {
                    setResidenceFile({ name: "brgy_residence_santos.pdf", type: "application/pdf", size: "0.8 MB", uploaded: true });
                  }
                }}
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

  function StepApplicantInfo() {
    return (
      <div className="space-y-5 animate-fade-up">
        <div className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex items-center gap-2.5 mb-5">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-red-50 text-red-600 font-bold text-xs">1</span>
            <div>
              <h2 className="text-sm font-extrabold text-gray-900 sm:text-base">Applicant Information</h2>
              <p className="text-xs text-gray-400">Personal identity details of the senior citizen</p>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-xs font-bold text-gray-700">Full Name</label>
              <input
                type="text"
                value={applicant.fullName}
                onChange={(e) => setApplicant((p) => ({ ...p, fullName: e.target.value }))}
                className="w-full rounded-xl border border-zinc-200 bg-zinc-50/50 px-3.5 py-2.5 text-xs text-gray-900 focus:border-red-600 focus:bg-white focus:outline-none focus:ring-1 focus:ring-red-600"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-bold text-gray-700">Date of Birth</label>
              <input
                type="date"
                value={applicant.dob}
                onChange={(e) => setApplicant((p) => ({ ...p, dob: e.target.value }))}
                className="w-full rounded-xl border border-zinc-200 bg-zinc-50/50 px-3.5 py-2.5 text-xs text-gray-900 focus:border-red-600 focus:bg-white focus:outline-none focus:ring-1 focus:ring-red-600"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-bold text-gray-700">Sex</label>
              <select
                value={applicant.sex}
                onChange={(e) => setApplicant((p) => ({ ...p, sex: e.target.value }))}
                className="w-full rounded-xl border border-zinc-200 bg-zinc-50/50 px-3.5 py-2.5 text-xs text-gray-900 focus:border-red-600 focus:bg-white focus:outline-none focus:ring-1 focus:ring-red-600"
              >
                <option>Female</option>
                <option>Male</option>
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-bold text-gray-700">Civil Status</label>
              <select
                value={applicant.civilStatus}
                onChange={(e) => setApplicant((p) => ({ ...p, civilStatus: e.target.value }))}
                className="w-full rounded-xl border border-zinc-200 bg-zinc-50/50 px-3.5 py-2.5 text-xs text-gray-900 focus:border-red-600 focus:bg-white focus:outline-none focus:ring-1 focus:ring-red-600"
              >
                {CIVIL_STATUSES.map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-bold text-gray-700">Barangay</label>
              <select
                value={applicant.barangay}
                onChange={(e) => setApplicant((p) => ({ ...p, barangay: e.target.value }))}
                className="w-full rounded-xl border border-zinc-200 bg-zinc-50/50 px-3.5 py-2.5 text-xs text-gray-900 focus:border-red-600 focus:bg-white focus:outline-none focus:ring-1 focus:ring-red-600"
              >
                {["Poblacion", "Casisang", "Sumpong", "Kalasungay", "Bangcud", "Aglayan", "Other"].map((b) => <option key={b}>{b}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-bold text-gray-700">Contact Number</label>
              <input
                type="tel"
                value={applicant.contactNumber}
                onChange={(e) => setApplicant((p) => ({ ...p, contactNumber: e.target.value }))}
                className="w-full rounded-xl border border-zinc-200 bg-zinc-50/50 px-3.5 py-2.5 text-xs text-gray-900 focus:border-red-600 focus:bg-white focus:outline-none focus:ring-1 focus:ring-red-600"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-bold text-gray-700">Email Address (Optional)</label>
              <input
                type="email"
                value={applicant.email}
                onChange={(e) => setApplicant((p) => ({ ...p, email: e.target.value }))}
                className="w-full rounded-xl border border-zinc-200 bg-zinc-50/50 px-3.5 py-2.5 text-xs text-gray-900 focus:border-red-600 focus:bg-white focus:outline-none focus:ring-1 focus:ring-red-600"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-xs font-bold text-gray-700">Complete Address</label>
              <input
                type="text"
                value={applicant.address}
                onChange={(e) => setApplicant((p) => ({ ...p, address: e.target.value }))}
                className="w-full rounded-xl border border-zinc-200 bg-zinc-50/50 px-3.5 py-2.5 text-xs text-gray-900 focus:border-red-600 focus:bg-white focus:outline-none focus:ring-1 focus:ring-red-600"
              />
            </div>
          </div>
        </div>
        <NavButtons onBack={back} onNext={next} />
      </div>
    );
  }

  function StepResidencyContact() {
    return (
      <div className="space-y-5 animate-fade-up">
        <div className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex items-center gap-2.5 mb-5">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-red-50 text-red-600 font-bold text-xs">2</span>
            <div>
              <h2 className="text-sm font-extrabold text-gray-900 sm:text-base">Residency &amp; Emergency Contact</h2>
              <p className="text-xs text-gray-400">Local residence details and guardian/kin contact</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-wider text-red-600 mb-3">Residency Information</p>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-xs font-bold text-gray-700">City / Municipality</label>
                  <input
                    type="text"
                    value={residency.city}
                    onChange={(e) => setResidency((p) => ({ ...p, city: e.target.value }))}
                    className="w-full rounded-xl border border-zinc-200 bg-zinc-50/50 px-3.5 py-2.5 text-xs text-gray-900 focus:border-red-600 focus:bg-white focus:outline-none focus:ring-1 focus:ring-red-600"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-bold text-gray-700">Province</label>
                  <input
                    type="text"
                    value={residency.province}
                    onChange={(e) => setResidency((p) => ({ ...p, province: e.target.value }))}
                    className="w-full rounded-xl border border-zinc-200 bg-zinc-50/50 px-3.5 py-2.5 text-xs text-gray-900 focus:border-red-600 focus:bg-white focus:outline-none focus:ring-1 focus:ring-red-600"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="mb-1.5 block text-xs font-bold text-gray-700">Years of Residence in Malaybalay City</label>
                  <input
                    type="number"
                    value={residency.yearsOfResidence}
                    onChange={(e) => setResidency((p) => ({ ...p, yearsOfResidence: e.target.value }))}
                    className="w-full rounded-xl border border-zinc-200 bg-zinc-50/50 px-3.5 py-2.5 text-xs text-gray-900 focus:border-red-600 focus:bg-white focus:outline-none focus:ring-1 focus:ring-red-600"
                  />
                </div>
              </div>
            </div>

            <div className="border-t border-zinc-100 pt-4">
              <p className="text-xs font-extrabold uppercase tracking-wider text-red-600 mb-3">Emergency Contact / Relative</p>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-xs font-bold text-gray-700">Contact Person Name</label>
                  <input
                    type="text"
                    value={emergencyContact.name}
                    onChange={(e) => setEmergencyContact((p) => ({ ...p, name: e.target.value }))}
                    className="w-full rounded-xl border border-zinc-200 bg-zinc-50/50 px-3.5 py-2.5 text-xs text-gray-900 focus:border-red-600 focus:bg-white focus:outline-none focus:ring-1 focus:ring-red-600"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-bold text-gray-700">Relationship</label>
                  <input
                    type="text"
                    value={emergencyContact.relationship}
                    onChange={(e) => setEmergencyContact((p) => ({ ...p, relationship: e.target.value }))}
                    className="w-full rounded-xl border border-zinc-200 bg-zinc-50/50 px-3.5 py-2.5 text-xs text-gray-900 focus:border-red-600 focus:bg-white focus:outline-none focus:ring-1 focus:ring-red-600"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="mb-1.5 block text-xs font-bold text-gray-700">Emergency Phone Number</label>
                  <input
                    type="tel"
                    value={emergencyContact.contactNumber}
                    onChange={(e) => setEmergencyContact((p) => ({ ...p, contactNumber: e.target.value }))}
                    className="w-full rounded-xl border border-zinc-200 bg-zinc-50/50 px-3.5 py-2.5 text-xs text-gray-900 focus:border-red-600 focus:bg-white focus:outline-none focus:ring-1 focus:ring-red-600"
                  />
                </div>
              </div>
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
              <p className="text-xs text-gray-400">Proof of identity, age (60+), and local residence</p>
            </div>
          </div>
          <div className="space-y-3">
            <UploadBox label="Valid Government ID (e.g. Voter's ID / UMID / Postal)" file={idFile} onUpload={() => setIdFile({ name: "voters_id_santos.jpg", type: "image/jpeg", size: "1.1 MB", uploaded: true })} onRemove={() => setIdFile({ name: "", uploaded: false })} required />
            <UploadBox label="Birth Certificate (PSA) or Proof of Date of Birth" file={birthCertFile} onUpload={() => setBirthCertFile({ name: "psa_birth_cert_maria.pdf", type: "application/pdf", size: "1.9 MB", uploaded: true })} onRemove={() => setBirthCertFile({ name: "", uploaded: false })} required />
            <UploadBox label="Barangay Certificate of Residency" file={residenceFile} onUpload={() => setResidenceFile({ name: "brgy_residence_santos.pdf", type: "application/pdf", size: "0.8 MB", uploaded: true })} onRemove={() => setResidenceFile({ name: "", uploaded: false })} required />
            <UploadBox label="1x1 or 2x2 ID Photo" file={photoFile} onUpload={() => setPhotoFile({ name: "id_photo_maria.jpg", type: "image/jpeg", size: "0.6 MB", uploaded: true })} onRemove={() => setPhotoFile({ name: "", uploaded: false })} required />
            <UploadBox label="Other Supporting Document (Optional)" file={supportFile} onUpload={() => setSupportFile({ name: "medical_cert.pdf", type: "application/pdf", size: "0.5 MB", uploaded: true })} onRemove={() => setSupportFile({ name: "", uploaded: false })} />
          </div>
        </div>
        <NavButtons onBack={back} onNext={next} disabled={!idFile.uploaded || !birthCertFile.uploaded || !photoFile.uploaded} />
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
              <h2 className="text-sm font-extrabold text-gray-900 sm:text-base">AI Document Validation &amp; OCR</h2>
              <p className="text-xs text-gray-400">Automated pre-screening &amp; data extraction</p>
            </div>
          </div>

          {aiChecks.length === 0 && !aiScanning ? (
            <div className="flex flex-col items-center gap-3 py-8 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-600">
                <Sparkles size={28} />
              </div>
              <p className="text-sm font-bold text-gray-800">Ready to validate senior citizen documents</p>
              <p className="max-w-xs text-xs text-gray-500">AI will perform simulated OCR to extract name and date of birth, verify 60+ qualifying age, and check residence proof.</p>
              <button
                type="button"
                onClick={runAIValidation}
                className="mt-2 flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-red-600 px-6 py-3 text-xs font-bold text-white shadow-sm hover:bg-red-700 active:scale-95"
              >
                <Sparkles size={14} /> Run Document Validation &amp; OCR
              </button>
            </div>
          ) : (
            <>
              {aiScanning && (
                <div className="mb-4">
                  <div className="flex justify-between text-xs font-bold mb-1.5"><span>Scanning Documents &amp; Running OCR…</span><span>{aiProgress}%</span></div>
                  <div className="h-2 rounded-full bg-zinc-100 overflow-hidden"><div className="h-full rounded-full bg-red-600 transition-all duration-300" style={{ width: `${aiProgress}%` }} /></div>
                </div>
              )}
              <div className="space-y-2">
                {aiChecks.map((c, i) => (
                  <div key={i} className="flex items-center justify-between rounded-xl border border-zinc-100 bg-zinc-50/60 px-3.5 py-2 text-xs">
                    <span className="text-gray-700">{c.label}</span>
                    <span className={`flex items-center gap-1 font-bold ${c.passed ? "text-emerald-700" : "text-amber-700"}`}>
                      {c.passed ? <Check size={13} /> : <AlertCircle size={13} />}
                      {c.passed ? "Passed" : "Missing / Check"}
                    </span>
                  </div>
                ))}
              </div>

              {ready && ocrData && (
                <div className="mt-4 rounded-2xl border border-zinc-200 bg-zinc-50 p-4 text-xs space-y-2">
                  <p className="font-extrabold uppercase tracking-wider text-red-600 text-[10px]">🤖 OCR Extracted Information</p>
                  <SummaryRow label="Extracted Name" value={ocrData.fullName} />
                  <SummaryRow label="Extracted DOB" value={ocrData.dob} />
                  <SummaryRow label="Extracted Address" value={ocrData.address} />
                  <SummaryRow label="Birth Certificate No." value={ocrData.idNumber} />
                </div>
              )}

              {ready && (
                <div className={`mt-4 rounded-2xl border p-4 ${testMode === "normal" ? "border-emerald-200 bg-emerald-50" : "border-amber-200 bg-amber-50"}`}>
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-xs sm:text-sm text-gray-900">AI Recommendation</span>
                    <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-extrabold text-white ${testMode === "normal" ? "bg-emerald-600" : "bg-amber-600"}`}>
                      {aiStatus}
                    </span>
                  </div>
                  <p className="mt-1.5 text-xs text-gray-600">AI Confidence: <span className="font-bold">{testMode === "normal" ? "96%" : "82%"}</span></p>
                  <p className="mt-2 text-[11px] text-gray-500 italic border-t border-zinc-200/60 pt-2">
                    IMPORTANT: The AI does not make the final decision. Final approval is conducted by authorized OSCA personnel.
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

  function StepRegistryCheck() {
    return (
      <div className="space-y-5 animate-fade-up">
        <div className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex items-center gap-2.5 mb-5">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-red-50 text-red-600 font-bold text-xs">5</span>
            <div>
              <h2 className="text-sm font-extrabold text-gray-900 sm:text-base">Mock Senior Citizen Registry Check</h2>
              <p className="text-xs text-gray-400">Match against OSCA active masterlist</p>
            </div>
          </div>

          <div className="rounded-2xl border border-zinc-100 bg-zinc-50 p-4 text-xs mb-5 space-y-2">
            <p className="font-extrabold text-gray-700 uppercase tracking-wider text-[10px] mb-2">Applicant Submitted Information</p>
            <SummaryRow label="Full Name" value={applicant.fullName} />
            <SummaryRow label="Date of Birth" value={applicant.dob} />
            <SummaryRow label="Barangay" value={applicant.barangay} />
            <SummaryRow label="Civil Status" value={applicant.civilStatus} />
          </div>

          {matchedRecord === null && !isCheckingRegistry && (
            <button
              type="button"
              onClick={runRegistryCheck}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-red-600 py-3.5 text-xs sm:text-sm font-bold text-white shadow-sm hover:bg-red-700 active:scale-[0.98]"
            >
              <ShieldCheck size={16} /> Check OSCA Masterlist Registry
            </button>
          )}

          {isCheckingRegistry && (
            <div className="flex flex-col items-center gap-3 py-6 text-center">
              <RefreshCw size={24} className="animate-spin text-red-600" />
              <p className="text-xs sm:text-sm font-bold text-gray-700">Querying OSCA registry masterlist…</p>
            </div>
          )}

          {!isCheckingRegistry && matchedRecord && typeof matchedRecord === "object" && (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 space-y-2 text-xs">
              <div className="flex items-center gap-2 font-extrabold text-emerald-800 mb-3">
                <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
                <span>Senior Citizen Record Found &amp; Matched</span>
              </div>
              <SummaryRow label="Registry No." value={matchedRecord.registryNumber} />
              <SummaryRow label="Name" value={matchedRecord.fullName} />
              <SummaryRow label="DOB" value={matchedRecord.dob} />
              <SummaryRow label="Status" value={matchedRecord.status} />
            </div>
          )}

          {!isCheckingRegistry && matchedRecord === false && (
            <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4 text-xs">
              <div className="flex items-center gap-2 font-extrabold text-blue-800 mb-2">
                <Info size={18} className="text-blue-600 shrink-0" />
                <span>New Senior Citizen Applicant</span>
              </div>
              <p className="text-blue-700">No previous registration on file. Prepared as a new senior citizen ID filing for OSCA staff enrollment.</p>
            </div>
          )}
        </div>
        <NavButtons onBack={back} onNext={next} disabled={isCheckingRegistry || matchedRecord === null} />
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

          <SummaryRow label="Service" value="Senior Citizen ID Application" />
          <SummaryRow label="Full Name" value={applicant.fullName} />
          <SummaryRow label="Date of Birth" value={applicant.dob} />
          <SummaryRow label="Sex / Status" value={`${applicant.sex} · ${applicant.civilStatus}`} />
          <SummaryRow label="Address" value={applicant.address} />
          <SummaryRow label="Years of Residence" value={`${residency.yearsOfResidence} years`} />
          <SummaryRow label="Emergency Contact" value={`${emergencyContact.name} (${emergencyContact.relationship}) - ${emergencyContact.contactNumber}`} />
          <div className="border-t border-zinc-100 pt-2">
            <SummaryRow label="Application Fee" value="FREE (RA 9994)" />
          </div>
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-3.5 py-2.5 text-xs font-bold text-emerald-800">
            AI Validation: {aiStatus} · {testMode === "normal" ? "Registry Verified" : "Correction Flagged"}
          </div>
        </div>
        <NavButtons onBack={back} onNext={handleSubmit} nextLabel="Submit Senior Citizen ID Application" />
      </div>
    );
  }

  function StepTracking() {
    const isCorrection = testMode === "missing_residence";
    const trackSteps = [
      { label: "Application Submitted", done: true },
      { label: "AI Document Validation", done: true },
      { label: "Registry Check", done: true },
      { label: "OSCA Verification", done: !isCorrection, active: !isCorrection },
      { label: isCorrection ? "Requires Correction" : "Application Approved", done: false, active: isCorrection },
      { label: "Senior Citizen ID Ready", done: false },
    ];

    return (
      <div className="space-y-5 animate-fade-up">
        <div className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm sm:p-6">
          <h2 className="text-sm font-extrabold text-gray-900 mb-1">Senior ID Application Tracking</h2>
          <p className="font-mono text-xs text-red-600 mb-4">{generatedReqId}</p>

          <div className={`mb-5 rounded-2xl border p-4 text-xs ${isCorrection ? "border-amber-200 bg-amber-50" : "border-blue-200 bg-blue-50/60"}`}>
            <p className="font-extrabold text-gray-900 text-xs sm:text-sm">
              Status: {isCorrection ? "Requires Correction" : "OSCA Verification in Progress"}
            </p>
            <p className="mt-1 text-gray-600">
              {isCorrection
                ? "Barangay Certificate of Residency is missing. Please upload the required proof of residency below to proceed."
                : "Your application documents and age eligibility have been verified. OSCA staff are preparing your physical & digital Senior ID."}
            </p>

            {isCorrection && (
              <div className="mt-4 pt-3 border-t border-amber-200/60">
                <button
                  type="button"
                  onClick={() => {
                    setResidenceFile({ name: "brgy_residence_santos.pdf", type: "application/pdf", size: "0.8 MB", uploaded: true });
                    setTestMode("normal");
                    setNotificationToast("Residency document uploaded. Revalidation completed.");
                  }}
                  className="flex items-center gap-1.5 rounded-xl bg-amber-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-amber-700"
                >
                  <Upload size={14} /> Upload Missing Residence Document
                </button>
              </div>
            )}
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
          View Sample Senior Citizen ID <ArrowRight size={16} />
        </button>
      </div>
    );
  }

  function StepIDReady() {
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
          <p className="text-base sm:text-lg font-extrabold text-gray-900">Senior Citizen ID Approved &amp; Issued</p>
          <p className="text-xs text-gray-500 mt-1">Official Senior Citizen ID Card under RA 7432 / RA 9994.</p>
          <p className="font-mono text-xs sm:text-sm font-bold text-emerald-700 mt-2">{issuedCardNo}</p>
        </div>

        {/* Sample Senior Citizen ID Card */}
        <div className="relative overflow-hidden rounded-3xl border-2 border-red-800 bg-gradient-to-br from-red-950 via-red-900 to-amber-950 p-5 sm:p-6 text-white shadow-xl">
          <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-amber-500/10 blur-2xl pointer-events-none" />
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
            <span className="text-4xl sm:text-5xl font-extrabold text-white/5 rotate-[-25deg] tracking-widest uppercase">SAMPLE ID</span>
          </div>

          <div className="relative z-10">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-red-800/80 pb-3 mb-4">
              <div>
                <p className="text-[9px] font-bold uppercase tracking-widest text-amber-300">Republic of the Philippines · City of Malaybalay</p>
                <p className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-white">Office for Senior Citizens Affairs (OSCA)</p>
                <p className="text-[10px] text-zinc-300 font-medium">Senior Citizen Identification Card (RA 9994)</p>
              </div>
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-400 text-red-950 font-bold text-xs shadow-sm">
                OSCA
              </span>
            </div>

            {/* Content */}
            <div className="flex flex-col sm:flex-row gap-4 items-center sm:items-start">
              {/* Photo Box */}
              <div className="flex flex-col items-center">
                <div className="flex h-28 w-24 shrink-0 items-center justify-center rounded-2xl border-2 border-amber-400/60 bg-red-950/80 text-amber-200">
                  <User size={48} />
                </div>
                <span className="mt-1 font-mono text-[9px] text-amber-300">PHOTO</span>
              </div>

              {/* Details */}
              <div className="flex-1 min-w-0 space-y-1.5 text-xs text-zinc-200 w-full">
                <div className="flex justify-between border-b border-white/10 pb-1">
                  <span className="text-zinc-400 text-[10px]">OSCA ID No.</span>
                  <span className="font-mono font-bold text-amber-300">{issuedCardNo}</span>
                </div>
                <div className="flex justify-between border-b border-white/10 pb-1">
                  <span className="text-zinc-400 text-[10px]">Full Name</span>
                  <span className="font-bold text-white">{applicant.fullName}</span>
                </div>
                <div className="flex justify-between border-b border-white/10 pb-1">
                  <span className="text-zinc-400 text-[10px]">Date of Birth</span>
                  <span className="font-bold text-white">{applicant.dob}</span>
                </div>
                <div className="flex justify-between border-b border-white/10 pb-1">
                  <span className="text-zinc-400 text-[10px]">Sex / Civil Status</span>
                  <span className="font-medium text-white">{applicant.sex} · {applicant.civilStatus}</span>
                </div>
                <div className="flex justify-between border-b border-white/10 pb-1">
                  <span className="text-zinc-400 text-[10px]">Address</span>
                  <span className="font-medium text-white truncate max-w-[180px]">{applicant.address}</span>
                </div>
                <div className="flex justify-between pt-0.5">
                  <span className="text-zinc-400 text-[10px]">Emergency Contact</span>
                  <span className="font-medium text-amber-200">{emergencyContact.name} ({emergencyContact.contactNumber})</span>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-red-800/80 pt-3">
              <button
                type="button"
                onClick={() => setShowQRModal(true)}
                className="flex w-full sm:w-auto items-center justify-center gap-1.5 rounded-xl border border-amber-400/40 bg-white/10 px-3 py-1.5 text-xs font-bold text-amber-200 hover:bg-white/20 active:scale-95"
              >
                <QrCode size={14} /> Scan Verification QR
              </button>
              <p className="text-[8px] font-bold text-amber-300/80 uppercase tracking-widest text-center sm:text-right">
                SAMPLE – NOT AN OFFICIAL GOVERNMENT ID
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          <button
            type="button"
            onClick={() => setNotificationToast("Senior Citizen ID viewed.")}
            className="flex h-11 items-center justify-center gap-1.5 rounded-2xl border border-zinc-200 bg-white py-2.5 text-xs font-bold text-gray-700 hover:bg-zinc-50 active:scale-95"
          >
            <Eye size={14} /> View Document
          </button>
          <button
            type="button"
            onClick={() => setNotificationToast("Sample Senior Citizen ID downloaded.")}
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
            <h3 className="text-sm font-extrabold text-gray-900">QR Senior Citizen Verification</h3>
            <button onClick={() => setShowQRModal(false)} className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-100"><X size={16} /></button>
          </div>
          <div className="flex h-36 w-36 mx-auto items-center justify-center rounded-2xl bg-zinc-100 mb-4">
            <QrCode size={64} className="text-zinc-400" />
          </div>
          <div className="space-y-2 text-xs border-t border-zinc-100 pt-4">
            <SummaryRow label="Document Type" value="Senior Citizen ID Card" />
            <SummaryRow label="Document No." value={issuedCardNo} />
            <SummaryRow label="Name" value={applicant.fullName} />
            <SummaryRow label="Date of Birth" value={applicant.dob} />
            <SummaryRow label="Date Issued" value={new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })} />
            <SummaryRow label="Request ID" value={generatedReqId} />
          </div>
          <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 py-2 text-center">
            <span className="text-xs font-extrabold text-emerald-700">VALID — OSCA Registry Verified</span>
          </div>
          <p className="mt-3 text-center text-[10px] text-zinc-400 uppercase tracking-wider">SAMPLE – NOT AN OFFICIAL GOVERNMENT DOCUMENT</p>
        </div>
      </div>
    );
  }

  const stepComponents = [
    <StepStart />, <StepApplicantInfo />, <StepResidencyContact />, <StepUploadRequirements />,
    <StepAIValidation />, <StepRegistryCheck />, <StepSummary />, <StepTracking />, <StepIDReady />,
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
          OSCA Portal
        </span>
      </div>

      {/* Header Banner matching LCRO */}
      <div className="mt-4 flex items-center gap-3.5 rounded-3xl border border-zinc-200 bg-white p-4 shadow-sm sm:p-5 animate-fade-up">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-red-600 text-white shadow-md">
          <Users size={22} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-red-600">
            Office for Senior Citizens Affairs (OSCA)
          </p>
          <h1 className="text-lg font-extrabold leading-tight text-gray-900 sm:text-xl">
            Senior Citizen ID Application
          </h1>
          <p className="mt-0.5 text-xs text-gray-500">
            Republic Act No. 9994 · Free online issuance &amp; enrollment
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
