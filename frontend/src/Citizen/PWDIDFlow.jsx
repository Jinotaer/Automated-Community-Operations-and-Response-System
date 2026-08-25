// src/Citizen/PWDIDFlow.jsx
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
  Accessibility,
  CreditCard,
  Users,
} from "lucide-react";
import { savePDAORequest } from "../services/pdaoData";

const STEPS = [
  "Start Application",
  "Applicant Info",
  "PWD Info",
  "Representative",
  "Upload Requirements",
  "AI Validation",
  "Request Summary",
  "Tracking",
  "PWD ID Ready",
];

const DISABILITY_TYPES = [
  "Physical Disability",
  "Visual Disability",
  "Hearing Disability",
  "Speech and Language Disability",
  "Intellectual Disability",
  "Learning Disability",
  "Psychosocial Disability",
  "Other",
];

export default function PWDIDFlow({ office, cert }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [testMode, setTestMode] = useState("normal"); // "normal" | "flagged"

  const [applicant, setApplicant] = useState({
    fullName: "Joshua Kyle Lim",
    dob: "2001-11-03",
    sex: "Male",
    address: "Purok 2, Casisang, Malaybalay City, Bukidnon",
    barangay: "Casisang",
    contactNumber: "0928-334-9988",
    email: "jk.lim@gmail.com",
  });

  const [pwdInfo, setPwdInfo] = useState({
    type: "Visual Disability",
    cause: "Acquired / Injury",
    description: "Severe visual impairment (Low Vision).",
    yearStarted: "2018",
    assistiveDevice: "Corrective optical magnifier & white cane",
  });

  const [isSelf, setIsSelf] = useState(true);
  const [representative, setRepresentative] = useState({
    fullName: "Rolando Lim",
    relationship: "Parent / Father",
    contactNumber: "0917-555-1122",
  });

  const [formFile, setFormFile] = useState({ name: "pwd_app_form_lim.pdf", type: "application/pdf", size: "1.2 MB", uploaded: true });
  const [idFile, setIdFile] = useState({ name: "driver_license_lim.jpg", type: "image/jpeg", size: "1.5 MB", uploaded: true });
  const [photoFile, setPhotoFile] = useState({ name: "id_photo_lim.jpg", type: "image/jpeg", size: "0.5 MB", uploaded: true });
  const [residenceFile, setResidenceFile] = useState({ name: "utility_bill_residence.pdf", type: "application/pdf", size: "0.8 MB", uploaded: true });
  const [medicalFile, setMedicalFile] = useState({ name: "ophthalmology_evaluation.pdf", type: "application/pdf", size: "2.1 MB", uploaded: true });
  const [repAuthFile, setRepAuthFile] = useState({ name: "guardianship_letter.pdf", type: "application/pdf", size: "0.7 MB", uploaded: true });

  const [aiScanning, setAiScanning] = useState(false);
  const [aiProgress, setAiProgress] = useState(0);
  const [aiChecks, setAiChecks] = useState([]);

  const [generatedReqId, setGeneratedReqId] = useState("");
  const [issuedIdNo, setIssuedIdNo] = useState("");
  const [submittedTime, setSubmittedTime] = useState("");

  const [showQRModal, setShowQRModal] = useState(false);
  const [notificationToast, setNotificationToast] = useState(null);

  const aiChecksDef = [
    { label: "Application form completed", passed: true },
    { label: "Required documents uploaded", passed: true },
    { label: "ID readable", passed: testMode === "normal" },
    { label: "Name consistency", passed: true },
    { label: "Date of birth consistency", passed: true },
    { label: "Address consistency", passed: true },
    { label: "Photo uploaded & framed", passed: true },
    { label: "Duplicate application check", passed: true },
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
    }, 320);
  }

  function handleSubmit() {
    const reqId = `ACORS-PDAO-2026-${String(Math.floor(10000 + Math.random() * 90000)).padStart(6, "0")}`;
    const idNo = `PDAO-ID-2026-${Math.floor(100000 + Math.random() * 900000)}`;
    const now = new Date().toLocaleString("en-US", {
      month: "long", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit",
    });
    setGeneratedReqId(reqId);
    setIssuedIdNo(idNo);
    setSubmittedTime(now);

    savePDAORequest({
      id: reqId,
      certificateType: "PWD ID",
      submittedAt: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      status: "Ready for PDAO Verification",
      applicant: { ...applicant },
      pwdInfo: { ...pwdInfo },
      isRepresentative: !isSelf,
      representative: !isSelf ? representative : null,
      aiValidation: {
        status: aiStatus,
        confidence: "94%",
        checks: aiChecksDef,
        recommendation: "Application complete and consistent. Ready for authorized PDAO officer verification.",
      },
      verificationStatus: "Pending Officer Review",
      certificateNumber: idNo,
      issueDate: new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
      documents: [
        { name: "Accomplished PWD Form", fileName: formFile.name, verified: formFile.uploaded },
        { name: "Valid Government ID", fileName: idFile.name, verified: idFile.uploaded },
        { name: "1x1 Recent ID Picture", fileName: photoFile.name, verified: photoFile.uploaded },
        { name: "Proof of Residence", fileName: residenceFile.name, verified: residenceFile.uploaded },
        { name: "Supporting Disability Document", fileName: medicalFile.name, verified: medicalFile.uploaded },
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
            PWD ID Application Guidelines
          </h2>
          <p className="mt-1.5 text-xs leading-relaxed text-gray-500 sm:text-sm">
            Apply for an official Persons with Disability Identification Card through ACORS. Entitles the cardholder to discounts, priority services, and social assistance benefits.
          </p>

          <div className="mt-5 grid grid-cols-2 gap-3 text-xs">
            <div className="rounded-2xl border border-zinc-100 bg-zinc-50/80 p-3.5">
              <span className="font-bold text-gray-800">Card Issuance</span>
              <p className="mt-1 font-mono text-base font-extrabold text-emerald-600">FREE</p>
              <p className="text-[11px] text-gray-400">Republic Act 10754</p>
            </div>
            <div className="rounded-2xl border border-zinc-100 bg-zinc-50/80 p-3.5">
              <span className="font-bold text-gray-800">Validity</span>
              <p className="mt-1 font-mono text-base font-extrabold text-gray-900">5 Years</p>
              <p className="text-[11px] text-gray-400">Renewable upon expiry</p>
            </div>
          </div>

          <div className="mt-5 rounded-2xl bg-zinc-50 p-4">
            <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-gray-500 mb-3">Required Documents</p>
            {[
              "Accomplished PWD Application Form",
              "Valid Government ID of Applicant (or Guardian for minors)",
              "1x1 Recent ID Picture (White background)",
              "Proof of Residence in Malaybalay City",
              "Medical Certificate / Clinical Assessment specifying disability",
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
              IMPORTANT: AI validates document completeness only. Final approval and card printing are authorized by PDAO personnel.
            </span>
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

  function StepApplicantInfo() {
    return (
      <div className="space-y-5 animate-fade-up">
        <div className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex items-center gap-2.5 mb-5">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-red-50 text-red-600 font-bold text-xs">1</span>
            <div>
              <h2 className="text-sm font-extrabold text-gray-900 sm:text-base">Applicant Information</h2>
              <p className="text-xs text-gray-400">Cardholder personal details</p>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {[
              { key: "fullName", label: "Full Name", type: "text" },
              { key: "dob", label: "Date of Birth", type: "date" },
              { key: "sex", label: "Sex", type: "select", options: ["Male", "Female"] },
              { key: "barangay", label: "Barangay", type: "select", options: ["Casisang", "Sumpong", "Kalasungay", "Bangcud", "Aglayan", "Poblacion", "Other"] },
              { key: "contactNumber", label: "Contact Number", type: "tel" },
              { key: "email", label: "Email Address", type: "email" },
              { key: "address", label: "Address", type: "text", span: true },
            ].map((f) => (
              <div key={f.key} className={f.span ? "sm:col-span-2" : ""}>
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

  function StepPWDInfo() {
    return (
      <div className="space-y-5 animate-fade-up">
        <div className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex items-center gap-2.5 mb-5">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-red-50 text-red-600 font-bold text-xs">2</span>
            <div>
              <h2 className="text-sm font-extrabold text-gray-900 sm:text-base">Disability Details</h2>
              <p className="text-xs text-gray-400">Card information printing details</p>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-bold text-gray-700">Type of Disability</label>
              <select
                value={pwdInfo.type}
                onChange={(e) => setPwdInfo((p) => ({ ...p, type: e.target.value }))}
                className="w-full rounded-xl border border-zinc-200 bg-zinc-50/50 px-3.5 py-2.5 text-xs text-gray-900 focus:border-red-600 focus:bg-white focus:outline-none focus:ring-1 focus:ring-red-600"
              >
                {DISABILITY_TYPES.map((t) => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-bold text-gray-700">Disability Cause</label>
              <input
                type="text"
                value={pwdInfo.cause}
                onChange={(e) => setPwdInfo((p) => ({ ...p, cause: e.target.value }))}
                placeholder="e.g. Congenital / Inborn, Illness, Acquired / Injury"
                className="w-full rounded-xl border border-zinc-200 bg-zinc-50/50 px-3.5 py-2.5 text-xs text-gray-900 focus:border-red-600 focus:bg-white focus:outline-none focus:ring-1 focus:ring-red-600"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-bold text-gray-700">Disability Description</label>
              <input
                type="text"
                value={pwdInfo.description}
                onChange={(e) => setPwdInfo((p) => ({ ...p, description: e.target.value }))}
                placeholder="Specific diagnosis or clinical description..."
                className="w-full rounded-xl border border-zinc-200 bg-zinc-50/50 px-3.5 py-2.5 text-xs text-gray-900 focus:border-red-600 focus:bg-white focus:outline-none focus:ring-1 focus:ring-red-600"
              />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-bold text-gray-700">Date / Year Started</label>
                <input
                  type="text"
                  value={pwdInfo.yearStarted}
                  onChange={(e) => setPwdInfo((p) => ({ ...p, yearStarted: e.target.value }))}
                  placeholder="e.g. 2018"
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50/50 px-3.5 py-2.5 text-xs text-gray-900 focus:border-red-600 focus:bg-white focus:outline-none focus:ring-1 focus:ring-red-600"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-bold text-gray-700">Assistive Device Used</label>
                <input
                  type="text"
                  value={pwdInfo.assistiveDevice}
                  onChange={(e) => setPwdInfo((p) => ({ ...p, assistiveDevice: e.target.value }))}
                  placeholder="e.g. Cane, Wheelchair, None"
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50/50 px-3.5 py-2.5 text-xs text-gray-900 focus:border-red-600 focus:bg-white focus:outline-none focus:ring-1 focus:ring-red-600"
                />
              </div>
            </div>
          </div>
        </div>
        <NavButtons onBack={back} onNext={next} />
      </div>
    );
  }

  function StepRepresentative() {
    return (
      <div className="space-y-5 animate-fade-up">
        <div className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex items-center gap-2.5 mb-5">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-red-50 text-red-600 font-bold text-xs">3</span>
            <div>
              <h2 className="text-sm font-extrabold text-gray-900 sm:text-base">Authorized Representative</h2>
              <p className="text-xs text-gray-400">Declaration of applicant representation</p>
            </div>
          </div>

          <div className="rounded-2xl border border-zinc-100 bg-zinc-50 p-4">
            <p className="text-xs font-bold text-gray-800 mb-3">Are you applying for yourself?</p>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setIsSelf(true)}
                className={`rounded-xl py-2.5 text-xs font-bold transition ${isSelf ? "bg-red-600 text-white shadow-sm" : "border border-zinc-200 bg-white text-gray-600 hover:bg-zinc-50"}`}
              >
                YES (Self)
              </button>
              <button
                type="button"
                onClick={() => setIsSelf(false)}
                className={`rounded-xl py-2.5 text-xs font-bold transition ${!isSelf ? "bg-red-600 text-white shadow-sm" : "border border-zinc-200 bg-white text-gray-600 hover:bg-zinc-50"}`}
              >
                NO (Representative)
              </button>
            </div>
          </div>

          {!isSelf && (
            <div className="mt-5 space-y-4 border-t border-zinc-100 pt-4">
              <div>
                <label className="mb-1.5 block text-xs font-bold text-gray-700">Representative Full Name</label>
                <input
                  type="text"
                  value={representative.fullName}
                  onChange={(e) => setRepresentative((p) => ({ ...p, fullName: e.target.value }))}
                  placeholder="Parent / Guardian / Authorized Rep"
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50/50 px-3.5 py-2.5 text-xs text-gray-900 focus:border-red-600 focus:bg-white focus:outline-none focus:ring-1 focus:ring-red-600"
                />
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-xs font-bold text-gray-700">Relationship to Applicant</label>
                  <select
                    value={representative.relationship}
                    onChange={(e) => setRepresentative((p) => ({ ...p, relationship: e.target.value }))}
                    className="w-full rounded-xl border border-zinc-200 bg-zinc-50/50 px-3.5 py-2.5 text-xs text-gray-900 focus:border-red-600 focus:bg-white focus:outline-none focus:ring-1 focus:ring-red-600"
                  >
                    <option>Parent / Mother</option>
                    <option>Parent / Father</option>
                    <option>Spouse</option>
                    <option>Legal Guardian</option>
                    <option>Sibling</option>
                    <option>Authorized Representative</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-bold text-gray-700">Contact Number</label>
                  <input
                    type="tel"
                    value={representative.contactNumber}
                    onChange={(e) => setRepresentative((p) => ({ ...p, contactNumber: e.target.value }))}
                    className="w-full rounded-xl border border-zinc-200 bg-zinc-50/50 px-3.5 py-2.5 text-xs text-gray-900 focus:border-red-600 focus:bg-white focus:outline-none focus:ring-1 focus:ring-red-600"
                  />
                </div>
              </div>
              <UploadBox label="Authorization Letter / Proof of Guardianship" file={repAuthFile} onUpload={() => setRepAuthFile({ name: "guardianship_letter.pdf", type: "application/pdf", size: "0.7 MB", uploaded: true })} onRemove={() => setRepAuthFile({ name: "", uploaded: false })} required />
            </div>
          )}
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
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-red-50 text-red-600 font-bold text-xs">4</span>
            <div>
              <h2 className="text-sm font-extrabold text-gray-900 sm:text-base">Upload Requirements</h2>
              <p className="text-xs text-gray-400">Card production and verification attachments</p>
            </div>
          </div>
          <div className="space-y-3">
            <UploadBox label="Accomplished PWD Application Form" file={formFile} onUpload={() => setFormFile({ name: "pwd_app_form_lim.pdf", type: "application/pdf", size: "1.2 MB", uploaded: true })} onRemove={() => setFormFile({ name: "", uploaded: false })} required />
            <UploadBox label="Valid Government ID" file={idFile} onUpload={() => setIdFile({ name: "driver_license_lim.jpg", type: "image/jpeg", size: "1.5 MB", uploaded: true })} onRemove={() => setIdFile({ name: "", uploaded: false })} required />
            <UploadBox label="1x1 Recent ID Picture (for ID card printing)" file={photoFile} onUpload={() => setPhotoFile({ name: "id_photo_lim.jpg", type: "image/jpeg", size: "0.5 MB", uploaded: true })} onRemove={() => setPhotoFile({ name: "", uploaded: false })} required />
            <UploadBox label="Proof of Residence (Barangay Certificate / Bill)" file={residenceFile} onUpload={() => setResidenceFile({ name: "utility_bill_residence.pdf", type: "application/pdf", size: "0.8 MB", uploaded: true })} onRemove={() => setResidenceFile({ name: "", uploaded: false })} required />
            <UploadBox label="Supporting Disability Document / Clinical Assessment" file={medicalFile} onUpload={() => setMedicalFile({ name: "ophthalmology_evaluation.pdf", type: "application/pdf", size: "2.1 MB", uploaded: true })} onRemove={() => setMedicalFile({ name: "", uploaded: false })} />
          </div>
        </div>
        <NavButtons onBack={back} onNext={next} disabled={!idFile.uploaded || !photoFile.uploaded || !formFile.uploaded} />
      </div>
    );
  }

  function StepAIValidation() {
    const ready = aiChecks.length === aiChecksDef.length && !aiScanning;
    return (
      <div className="space-y-5 animate-fade-up">
        <div className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex items-center gap-2.5 mb-5">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-red-50 text-red-600 font-bold text-xs">5</span>
            <div>
              <h2 className="text-sm font-extrabold text-gray-900 sm:text-base">AI Validation</h2>
              <p className="text-xs text-gray-400">ID photo analysis & data completeness check</p>
            </div>
          </div>

          {aiChecks.length === 0 && !aiScanning ? (
            <div className="flex flex-col items-center gap-3 py-8 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-600">
                <Sparkles size={28} />
              </div>
              <p className="text-sm font-bold text-gray-800">Ready to validate PWD ID application</p>
              <p className="max-w-xs text-xs text-gray-500">AI will verify ID readability, photo specifications, and ensure application completeness.</p>
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
                  <div className="flex justify-between text-xs font-bold mb-1.5"><span>Scanning Documents & Photo…</span><span>{aiProgress}%</span></div>
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
                  <p className="mt-1.5 text-xs text-gray-600">AI Confidence: <span className="font-bold">94%</span></p>
                  <p className="mt-2 text-[11px] text-gray-500 italic border-t border-zinc-200/60 pt-2">
                    IMPORTANT: AI does not approve the PWD ID. AI only recommends that the application is complete and ready for authorized verification.
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

  function StepSummary() {
    return (
      <div className="space-y-5 animate-fade-up">
        <div className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm sm:p-6 space-y-3">
          <div className="flex items-center gap-2.5 mb-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-red-50 text-red-600 font-bold text-xs">6</span>
            <h2 className="text-sm font-extrabold text-gray-900 sm:text-base">Request Summary</h2>
          </div>

          <SummaryRow label="Service" value="Persons with Disability ID (PWD ID)" />
          <SummaryRow label="Cardholder" value={applicant.fullName} />
          <SummaryRow label="Date of Birth" value={applicant.dob} />
          <SummaryRow label="Address" value={applicant.address} />
          <SummaryRow label="Disability Type" value={pwdInfo.type} />
          <SummaryRow label="Representation" value={isSelf ? "Self-applied" : `Representative: ${representative.fullName} (${representative.relationship})`} />
          <div className="border-t border-zinc-100 pt-2">
            <SummaryRow label="ID Issuance Fee" value="FREE (RA 10754)" />
          </div>
          <div className={`rounded-xl border px-3.5 py-2.5 text-xs font-bold ${aiStatus === "PASSED" ? "border-emerald-200 bg-emerald-50 text-emerald-800" : "border-amber-200 bg-amber-50 text-amber-800"}`}>
            AI Validation: {aiStatus}
          </div>
        </div>
        <NavButtons onBack={back} onNext={handleSubmit} nextLabel="Submit PWD ID Application" />
      </div>
    );
  }

  function StepTracking() {
    const trackSteps = [
      { label: "Application Submitted", done: true },
      { label: "AI Validation", done: true },
      { label: "PDAO Verification", done: false, active: true },
      { label: "Approved", done: false },
      { label: "ID Preparation", done: false },
      { label: "ID Ready", done: false },
    ];

    return (
      <div className="space-y-5 animate-fade-up">
        <div className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm sm:p-6">
          <h2 className="text-sm font-extrabold text-gray-900 mb-1">PWD ID Tracking</h2>
          <p className="font-mono text-xs text-red-600 mb-4">{generatedReqId}</p>

          <div className="mb-5 rounded-2xl border border-blue-200 bg-blue-50/60 p-4 text-xs">
            <p className="font-extrabold text-gray-900 text-xs sm:text-sm">Status: Ready for PDAO Verification</p>
            <p className="mt-1 text-gray-600">Your documents are complete and awaiting card approval from the designated PDAO officer.</p>
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
          View Sample PWD ID <ArrowRight size={16} />
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
          <p className="text-base sm:text-lg font-extrabold text-gray-900">PWD Application Approved</p>
          <p className="text-xs text-gray-500 mt-1">Your PWD Identification Card is ready for release.</p>
          <p className="font-mono text-xs sm:text-sm font-bold text-emerald-700 mt-2">{issuedIdNo}</p>
        </div>

        {/* Sample PWD ID Card */}
        <div className="relative overflow-hidden rounded-3xl border-2 border-red-700 bg-gradient-to-br from-white to-zinc-50 p-5 sm:p-6 shadow-md">
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
            <span className="text-4xl sm:text-5xl font-extrabold text-zinc-100 rotate-[-30deg] tracking-widest uppercase">SAMPLE</span>
          </div>

          <div className="relative z-10">
            {/* ID Header */}
            <div className="flex items-center justify-between border-b-2 border-red-600 pb-3 mb-4">
              <div>
                <p className="text-[9px] font-bold uppercase tracking-widest text-gray-500">Republic of the Philippines</p>
                <p className="text-[10px] font-bold uppercase tracking-wider text-gray-700">City of Malaybalay · PDAO</p>
                <p className="text-xs font-extrabold uppercase text-red-700 tracking-wider">Persons with Disability ID</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-600 text-white">
                <Accessibility size={20} />
              </div>
            </div>

            {/* ID Content */}
            <div className="flex flex-col sm:flex-row gap-4 items-center sm:items-start text-xs">
              <div className="flex flex-col items-center">
                <div className="flex h-24 w-20 items-center justify-center rounded-xl border-2 border-dashed border-zinc-300 bg-zinc-100 text-zinc-400 font-bold text-xs">
                  PHOTO
                </div>
                <span className="mt-1 font-mono text-[9px] font-bold text-gray-400">1x1 Photo</span>
              </div>

              <div className="flex-1 w-full space-y-1.5">
                <SummaryRow label="PWD ID No." value={issuedIdNo} />
                <SummaryRow label="Full Name" value={applicant.fullName} />
                <SummaryRow label="Date of Birth" value={applicant.dob} />
                <SummaryRow label="Disability Type" value={pwdInfo.type} />
                <SummaryRow label="Address" value={applicant.barangay + ", Malaybalay City"} />
                <SummaryRow label="Date Issued" value={new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })} />
                <SummaryRow label="Valid Until" value={new Date(Date.now() + 5 * 365 * 24 * 60 * 60 * 1000).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })} />
              </div>
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
            onClick={() => setNotificationToast("PWD ID viewed.")}
            className="flex h-11 items-center justify-center gap-1.5 rounded-2xl border border-zinc-200 bg-white py-2.5 text-xs font-bold text-gray-700 hover:bg-zinc-50 active:scale-95"
          >
            <Eye size={14} /> View Document
          </button>
          <button
            type="button"
            onClick={() => setNotificationToast("Sample PWD ID downloaded.")}
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
            <h3 className="text-sm font-extrabold text-gray-900">QR ID Verification</h3>
            <button onClick={() => setShowQRModal(false)} className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-100"><X size={16} /></button>
          </div>
          <div className="flex h-36 w-36 mx-auto items-center justify-center rounded-2xl bg-zinc-100 mb-4">
            <QrCode size={64} className="text-zinc-400" />
          </div>
          <div className="space-y-2 text-xs border-t border-zinc-100 pt-4">
            <SummaryRow label="PWD ID No." value={issuedIdNo} />
            <SummaryRow label="Document" value="Persons with Disability ID" />
            <SummaryRow label="Cardholder" value={applicant.fullName} />
            <SummaryRow label="Disability" value={pwdInfo.type} />
            <SummaryRow label="Request ID" value={generatedReqId} />
          </div>
          <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 py-2 text-center">
            <span className="text-xs font-extrabold text-emerald-700">VALID — PDAO Registry Verified</span>
          </div>
          <p className="mt-3 text-center text-[10px] text-zinc-400 uppercase tracking-wider">SAMPLE – NOT AN OFFICIAL GOVERNMENT DOCUMENT</p>
        </div>
      </div>
    );
  }

  const stepComponents = [
    <StepStart />, <StepApplicantInfo />, <StepPWDInfo />, <StepRepresentative />,
    <StepUploadRequirements />, <StepAIValidation />, <StepSummary />, <StepTracking />, <StepIDReady />,
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
          PDAO Portal
        </span>
      </div>

      {/* Header Banner matching LCRO */}
      <div className="mt-4 flex items-center gap-3.5 rounded-3xl border border-zinc-200 bg-white p-4 shadow-sm sm:p-5 animate-fade-up">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-red-600 text-white shadow-md">
          <Accessibility size={22} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-red-600">
            Persons with Disability Affairs Office (PDAO)
          </p>
          <h1 className="text-lg font-extrabold leading-tight text-gray-900 sm:text-xl">
            Persons with Disability ID (PWD ID)
          </h1>
          <p className="mt-0.5 text-xs text-gray-500">
            Free card issuance · 5-year validity
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
