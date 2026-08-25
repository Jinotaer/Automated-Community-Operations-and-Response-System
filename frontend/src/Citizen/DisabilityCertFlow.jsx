// src/Citizen/DisabilityCertFlow.jsx
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
} from "lucide-react";
import { savePDAORequest } from "../services/pdaoData";

const STEPS = [
  "Start Application",
  "Applicant Info",
  "Disability Info",
  "Upload Documents",
  "AI Validation",
  "Request Summary",
  "Tracking",
  "Certificate Ready",
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

const PURPOSE_OPTIONS = [
  "PWD ID Application",
  "Government Assistance",
  "Educational Requirement",
  "Employment Requirement",
  "Medical/Administrative Requirement",
  "Other",
];

export default function DisabilityCertFlow({ office, cert }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [testMode, setTestMode] = useState("normal"); // "normal" | "flagged"

  const [applicant, setApplicant] = useState({
    fullName: "Elena Corpuz",
    dob: "1988-04-19",
    address: "Purok 6, Bangcud, Malaybalay City, Bukidnon",
    barangay: "Bangcud",
    contactNumber: "0919-445-1212",
    email: "elena.corpuz@yahoo.com",
  });

  const [disabilityInfo, setDisabilityInfo] = useState({
    type: "Hearing Disability",
    description: "Bilateral sensorineural hearing loss.",
    cause: "Illness / Infection",
    yearStarted: "2015",
    purpose: "Employment Requirement",
  });

  const [idFile, setIdFile] = useState({ name: "umid_corpuz.jpg", type: "image/jpeg", size: "1.2 MB", uploaded: true });
  const [medicalFile, setMedicalFile] = useState({ name: "audiogram_report.pdf", type: "application/pdf", size: "1.7 MB", uploaded: true });
  const [residenceFile, setResidenceFile] = useState({ name: "brgy_residency_corpuz.jpg", type: "image/jpeg", size: "0.8 MB", uploaded: true });
  const [otherDocFile, setOtherDocFile] = useState({ name: "", uploaded: false });

  const [aiScanning, setAiScanning] = useState(false);
  const [aiProgress, setAiProgress] = useState(0);
  const [aiChecks, setAiChecks] = useState([]);

  const [generatedReqId, setGeneratedReqId] = useState("");
  const [issuedCertNo, setIssuedCertNo] = useState("");
  const [submittedTime, setSubmittedTime] = useState("");

  const [showQRModal, setShowQRModal] = useState(false);
  const [notificationToast, setNotificationToast] = useState(null);

  const aiChecksDef = [
    { label: "Required information complete", passed: true },
    { label: "Required documents uploaded", passed: true },
    { label: "ID readability", passed: testMode === "normal" },
    { label: "Name consistency", passed: true },
    { label: "Date consistency", passed: true },
    { label: "Document completeness", passed: true },
  ];

  const aiStatus = testMode === "normal" ? "DOCUMENTS READY FOR AUTHORIZED REVIEW" : "REQUIRES LGU VERIFICATION";

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
    const certNo = `PDAO-CD-2026-${Math.floor(100000 + Math.random() * 900000)}`;
    const now = new Date().toLocaleString("en-US", {
      month: "long", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit",
    });
    setGeneratedReqId(reqId);
    setIssuedCertNo(certNo);
    setSubmittedTime(now);

    savePDAORequest({
      id: reqId,
      certificateType: "Certificate of Disability",
      submittedAt: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      status: "Ready for PDAO Verification",
      applicant: { ...applicant },
      disabilityInfo: { ...disabilityInfo },
      aiValidation: {
        status: aiStatus,
        confidence: "93%",
        checks: aiChecksDef,
        recommendation: "AI completed document validation. Final verification must be performed by authorized personnel.",
      },
      verificationStatus: "Pending Authorized Verification",
      certificateNumber: certNo,
      issueDate: new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
      documents: [
        { name: "Valid Government ID", fileName: idFile.name, verified: idFile.uploaded },
        { name: "Medical / Clinical Assessment", fileName: medicalFile.name, verified: medicalFile.uploaded },
        { name: "Proof of Residence", fileName: residenceFile.name, verified: residenceFile.uploaded },
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
            Certificate of Disability Guidelines
          </h2>
          <p className="mt-1.5 text-xs leading-relaxed text-gray-500 sm:text-sm">
            Request an official certification of disability issued by the Persons with Disability Affairs Office (PDAO) of Malaybalay City.
          </p>

          <div className="mt-5 grid grid-cols-2 gap-3 text-xs">
            <div className="rounded-2xl border border-zinc-100 bg-zinc-50/80 p-3.5">
              <span className="font-bold text-gray-800">Processing Fee</span>
              <p className="mt-1 font-mono text-base font-extrabold text-emerald-600">FREE</p>
              <p className="text-[11px] text-gray-400">Official certification</p>
            </div>
            <div className="rounded-2xl border border-zinc-100 bg-zinc-50/80 p-3.5">
              <span className="font-bold text-gray-800">Verification</span>
              <p className="mt-1 font-mono text-base font-extrabold text-gray-900">Authorized Officer</p>
              <p className="text-[11px] text-gray-400">Clinical record check</p>
            </div>
          </div>

          <div className="mt-5 rounded-2xl bg-zinc-50 p-4">
            <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-gray-500 mb-3">Required Documents</p>
            {[
              "Valid Government ID",
              "Medical Certificate / Clinical Assessment specifying diagnosis",
              "Proof of Residence in Malaybalay City",
              "Other supporting documents when applicable",
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
              IMPORTANT: The AI does not diagnose or determine disability. AI only verifies that required documents are present and consistent. Final certification is signed by authorized PDAO personnel.
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
                {m === "normal" ? "Normal (Ready)" : "Flagged (Review)"}
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
              <p className="text-xs text-gray-400">Personal details for certification</p>
            </div>
          </div>
          <div className="space-y-4">
            {[
              { key: "fullName", label: "Full Name", type: "text" },
              { key: "dob", label: "Date of Birth", type: "date" },
              { key: "barangay", label: "Barangay", type: "select", options: ["Bangcud", "Casisang", "Sumpong", "Kalasungay", "Aglayan", "Poblacion", "Other"] },
              { key: "contactNumber", label: "Contact Number", type: "tel" },
              { key: "email", label: "Email Address", type: "email" },
              { key: "address", label: "Complete Address", type: "text" },
            ].map((f) => (
              <div key={f.key}>
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

  function StepDisabilityInfo() {
    return (
      <div className="space-y-5 animate-fade-up">
        <div className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex items-center gap-2.5 mb-5">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-red-50 text-red-600 font-bold text-xs">2</span>
            <div>
              <h2 className="text-sm font-extrabold text-gray-900 sm:text-base">Disability Information & Purpose</h2>
              <p className="text-xs text-gray-400">Specify details for the certificate</p>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-bold text-gray-700">Type of Disability</label>
              <select
                value={disabilityInfo.type}
                onChange={(e) => setDisabilityInfo((p) => ({ ...p, type: e.target.value }))}
                className="w-full rounded-xl border border-zinc-200 bg-zinc-50/50 px-3.5 py-2.5 text-xs text-gray-900 focus:border-red-600 focus:bg-white focus:outline-none focus:ring-1 focus:ring-red-600"
              >
                {DISABILITY_TYPES.map((t) => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-bold text-gray-700">Disability Description</label>
              <input
                type="text"
                value={disabilityInfo.description}
                onChange={(e) => setDisabilityInfo((p) => ({ ...p, description: e.target.value }))}
                placeholder="e.g. Bilateral sensorineural hearing loss"
                className="w-full rounded-xl border border-zinc-200 bg-zinc-50/50 px-3.5 py-2.5 text-xs text-gray-900 focus:border-red-600 focus:bg-white focus:outline-none focus:ring-1 focus:ring-red-600"
              />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-bold text-gray-700">Cause of Disability</label>
                <input
                  type="text"
                  value={disabilityInfo.cause}
                  onChange={(e) => setDisabilityInfo((p) => ({ ...p, cause: e.target.value }))}
                  placeholder="e.g. Illness / Infection"
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50/50 px-3.5 py-2.5 text-xs text-gray-900 focus:border-red-600 focus:bg-white focus:outline-none focus:ring-1 focus:ring-red-600"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-bold text-gray-700">Date / Year Disability Started</label>
                <input
                  type="text"
                  value={disabilityInfo.yearStarted}
                  onChange={(e) => setDisabilityInfo((p) => ({ ...p, yearStarted: e.target.value }))}
                  placeholder="e.g. 2015"
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50/50 px-3.5 py-2.5 text-xs text-gray-900 focus:border-red-600 focus:bg-white focus:outline-none focus:ring-1 focus:ring-red-600"
                />
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-bold text-gray-700">Purpose of Certificate</label>
              <select
                value={disabilityInfo.purpose}
                onChange={(e) => setDisabilityInfo((p) => ({ ...p, purpose: e.target.value }))}
                className="w-full rounded-xl border border-zinc-200 bg-zinc-50/50 px-3.5 py-2.5 text-xs text-gray-900 focus:border-red-600 focus:bg-white focus:outline-none focus:ring-1 focus:ring-red-600"
              >
                {PURPOSE_OPTIONS.map((p) => <option key={p}>{p}</option>)}
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
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-red-50 text-red-600 font-bold text-xs">3</span>
            <div>
              <h2 className="text-sm font-extrabold text-gray-900 sm:text-base">Upload Documents</h2>
              <p className="text-xs text-gray-400">Attachments for authorized review</p>
            </div>
          </div>
          <div className="space-y-3">
            <UploadBox label="Valid Government ID" file={idFile} onUpload={() => setIdFile({ name: "umid_corpuz.jpg", type: "image/jpeg", size: "1.2 MB", uploaded: true })} onRemove={() => setIdFile({ name: "", uploaded: false })} required />
            <UploadBox label="Medical Certificate / Clinical Assessment" file={medicalFile} onUpload={() => setMedicalFile({ name: "audiogram_report.pdf", type: "application/pdf", size: "1.7 MB", uploaded: true })} onRemove={() => setMedicalFile({ name: "", uploaded: false })} required />
            <UploadBox label="Proof of Residence (Barangay Certificate / Utility Bill)" file={residenceFile} onUpload={() => setResidenceFile({ name: "brgy_residency_corpuz.jpg", type: "image/jpeg", size: "0.8 MB", uploaded: true })} onRemove={() => setResidenceFile({ name: "", uploaded: false })} required />
            <UploadBox label="Other Supporting Document (Optional)" file={otherDocFile} onUpload={() => setOtherDocFile({ name: "supporting_letter.pdf", type: "application/pdf", size: "0.5 MB", uploaded: true })} onRemove={() => setOtherDocFile({ name: "", uploaded: false })} />
          </div>
        </div>
        <NavButtons onBack={back} onNext={next} disabled={!idFile.uploaded || !medicalFile.uploaded || !residenceFile.uploaded} />
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
              <p className="text-xs text-gray-400">Formatting and completeness verification</p>
            </div>
          </div>

          {aiChecks.length === 0 && !aiScanning ? (
            <div className="flex flex-col items-center gap-3 py-8 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-600">
                <Sparkles size={28} />
              </div>
              <p className="text-sm font-bold text-gray-800">Ready to validate submitted files</p>
              <p className="max-w-xs text-xs text-gray-500">AI will verify ID authenticity, medical document presence, and residency consistency.</p>
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
                      DOCUMENTS READY FOR AUTHORIZED REVIEW
                    </span>
                  </div>
                  <p className="mt-1.5 text-xs text-gray-600">AI Confidence: <span className="font-bold">93%</span></p>
                  <p className="mt-2 text-[11px] text-gray-600 italic border-t border-zinc-200/60 pt-2">
                    AI completed document validation. Final verification must be performed by authorized personnel.
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
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-red-50 text-red-600 font-bold text-xs">5</span>
            <h2 className="text-sm font-extrabold text-gray-900 sm:text-base">Request Summary</h2>
          </div>

          <SummaryRow label="Certificate" value="Certificate of Disability" />
          <SummaryRow label="Applicant" value={applicant.fullName} />
          <SummaryRow label="Date of Birth" value={applicant.dob} />
          <SummaryRow label="Address" value={applicant.address} />
          <SummaryRow label="Disability Type" value={disabilityInfo.type} />
          <SummaryRow label="Description" value={disabilityInfo.description} />
          <SummaryRow label="Purpose" value={disabilityInfo.purpose} />
          <div className="border-t border-zinc-100 pt-2">
            <SummaryRow label="Certification Fee" value="FREE" />
          </div>
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-3.5 py-2.5 text-xs font-bold text-emerald-800">
            AI Document Validation: Passed (Ready for Officer Review)
          </div>
        </div>
        <NavButtons onBack={back} onNext={handleSubmit} nextLabel="Submit for PDAO Verification" />
      </div>
    );
  }

  function StepTracking() {
    const trackSteps = [
      { label: "Application Submitted", done: true },
      { label: "AI Document Validation", done: true },
      { label: "Authorized Verification", done: false, active: true },
      { label: "Approved", done: false },
      { label: "Certificate Ready", done: false },
    ];

    return (
      <div className="space-y-5 animate-fade-up">
        <div className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm sm:p-6">
          <h2 className="text-sm font-extrabold text-gray-900 mb-1">Certificate Tracking</h2>
          <p className="font-mono text-xs text-red-600 mb-4">{generatedReqId}</p>

          <div className="mb-5 rounded-2xl border border-blue-200 bg-blue-50/60 p-4 text-xs">
            <p className="font-extrabold text-gray-900 text-xs sm:text-sm">Status: Pending Authorized Verification</p>
            <p className="mt-1 text-gray-600">Your documents have been submitted and are under review by the authorized PDAO certifying officer.</p>
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
          View Sample Certificate <ArrowRight size={16} />
        </button>
      </div>
    );
  }

  function StepCertReady() {
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
          <p className="text-base sm:text-lg font-extrabold text-gray-900">Certificate of Disability Ready</p>
          <p className="text-xs text-gray-500 mt-1">Issued by the Persons with Disability Affairs Office of Malaybalay City.</p>
          <p className="font-mono text-xs sm:text-sm font-bold text-emerald-700 mt-2">{issuedCertNo}</p>
        </div>

        {/* Sample Certificate */}
        <div className="relative overflow-hidden rounded-3xl border-2 border-zinc-200 bg-white p-5 sm:p-6 shadow-sm">
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
            <span className="text-4xl sm:text-5xl font-extrabold text-zinc-100 rotate-[-30deg] tracking-widest uppercase">SAMPLE</span>
          </div>
          <div className="relative z-10">
            <div className="text-center border-b border-zinc-200 pb-4 mb-4">
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Republic of the Philippines · City of Malaybalay, Bukidnon</p>
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Persons with Disability Affairs Office (PDAO)</p>
              <p className="mt-2 text-xs font-extrabold uppercase tracking-[0.2em] text-red-700">Certificate of Disability</p>
              <p className="font-mono text-xs font-bold text-gray-700 mt-1">{issuedCertNo}</p>
            </div>

            <div className="space-y-2 text-xs">
              <SummaryRow label="Name" value={applicant.fullName} />
              <SummaryRow label="Date of Birth" value={applicant.dob} />
              <SummaryRow label="Address" value={applicant.address} />
              <SummaryRow label="Disability Type" value={disabilityInfo.type} />
              <SummaryRow label="Purpose" value={disabilityInfo.purpose} />
              <SummaryRow label="Issuing Office" value="PDAO - City of Malaybalay" />
              <SummaryRow label="Date Issued" value={new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })} />
              <SummaryRow label="Request ID" value={generatedReqId} />
            </div>

            <div className="mt-5 flex flex-col sm:flex-row items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setShowQRModal(true)}
                className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-zinc-50 px-3.5 py-2.5 text-xs font-bold text-gray-700 hover:bg-zinc-100 active:scale-95"
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
            onClick={() => setNotificationToast("Certificate viewed.")}
            className="flex h-11 items-center justify-center gap-1.5 rounded-2xl border border-zinc-200 bg-white py-2.5 text-xs font-bold text-gray-700 hover:bg-zinc-50 active:scale-95"
          >
            <Eye size={14} /> View Document
          </button>
          <button
            type="button"
            onClick={() => setNotificationToast("Sample certificate downloaded.")}
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
            <h3 className="text-sm font-extrabold text-gray-900">QR Document Verification</h3>
            <button onClick={() => setShowQRModal(false)} className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-100"><X size={16} /></button>
          </div>
          <div className="flex h-36 w-36 mx-auto items-center justify-center rounded-2xl bg-zinc-100 mb-4">
            <QrCode size={64} className="text-zinc-400" />
          </div>
          <div className="space-y-2 text-xs border-t border-zinc-100 pt-4">
            <SummaryRow label="Certificate No." value={issuedCertNo} />
            <SummaryRow label="Document" value="Certificate of Disability" />
            <SummaryRow label="Recipient" value={applicant.fullName} />
            <SummaryRow label="Disability" value={disabilityInfo.type} />
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
    <StepStart />, <StepApplicantInfo />, <StepDisabilityInfo />, <StepUploadDocs />,
    <StepAIValidation />, <StepSummary />, <StepTracking />, <StepCertReady />,
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
            Certificate of Disability
          </h1>
          <p className="mt-0.5 text-xs text-gray-500">
            Free official certification · Authorized officer assessment
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
