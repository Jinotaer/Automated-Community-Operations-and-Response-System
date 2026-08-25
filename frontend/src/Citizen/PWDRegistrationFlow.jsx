// src/Citizen/PWDRegistrationFlow.jsx
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
  HeartHandshake,
} from "lucide-react";
import { savePDAORequest } from "../services/pdaoData";

const STEPS = [
  "Start Application",
  "Applicant Info",
  "Disability Info",
  "Upload Requirements",
  "AI Validation",
  "Request Summary",
  "Submit Application",
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

export default function PWDRegistrationFlow({ office, cert }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [testMode, setTestMode] = useState("normal"); // "normal" | "missing_doc"

  const [applicant, setApplicant] = useState({
    fullName: "Maria Theresa Santos",
    dob: "1992-07-14",
    sex: "Female",
    address: "Purok 4, Sumpong, Malaybalay City, Bukidnon",
    barangay: "Sumpong",
    contactNumber: "0917-889-2234",
    email: "mt.santos@gmail.com",
    civilStatus: "Single",
    occupation: "Graphic Designer",
  });

  const [disabilityInfo, setDisabilityInfo] = useState({
    type: "Physical Disability",
    cause: "Congenital / Inborn",
    yearStarted: "1992",
    assistiveDevice: "Wheelchair / Mobility Aid",
    additionalInfo: "Lower limb mobility impairment.",
  });

  const [idFile, setIdFile] = useState({ name: "philsys_santos.jpg", type: "image/jpeg", size: "1.4 MB", uploaded: true });
  const [photoFile, setPhotoFile] = useState({ name: "id_photo_1x1.jpg", type: "image/jpeg", size: "0.6 MB", uploaded: true });
  const [residenceFile, setResidenceFile] = useState({ name: "brgy_cert_santos.jpg", type: "image/jpeg", size: "0.9 MB", uploaded: true });
  const [medicalFile, setMedicalFile] = useState({ name: "clinical_assessment_doc.pdf", type: "application/pdf", size: "1.8 MB", uploaded: true });

  const [aiScanning, setAiScanning] = useState(false);
  const [aiProgress, setAiProgress] = useState(0);
  const [aiChecks, setAiChecks] = useState([]);

  const [generatedReqId, setGeneratedReqId] = useState("");
  const [issuedCertNo, setIssuedCertNo] = useState("");
  const [submittedTime, setSubmittedTime] = useState("");

  const [showQRModal, setShowQRModal] = useState(false);
  const [notificationToast, setNotificationToast] = useState(null);

  const hasMissingDoc = testMode === "missing_doc";

  const aiChecksDef = [
    { label: "Required fields completed", passed: true },
    { label: "Valid ID uploaded", passed: true },
    { label: "ID is readable", passed: true },
    { label: "Name consistency", passed: true },
    { label: "Date of birth consistency", passed: true },
    { label: "Address consistency", passed: true },
    { label: "Required documents uploaded", passed: !hasMissingDoc },
    { label: "Duplicate application check", passed: true },
  ];

  const aiStatus = hasMissingDoc ? "REQUIRES CORRECTION" : "PASSED";

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
    const certNo = `PDAO-RC-2026-${Math.floor(100000 + Math.random() * 900000)}`;
    const now = new Date().toLocaleString("en-US", {
      month: "long", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit",
    });
    setGeneratedReqId(reqId);
    setIssuedCertNo(certNo);
    setSubmittedTime(now);

    savePDAORequest({
      id: reqId,
      certificateType: "PWD Registration Certificate",
      submittedAt: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      status: hasMissingDoc ? "Requires Correction" : "Ready for PDAO Verification",
      applicant: { ...applicant },
      disabilityInfo: { ...disabilityInfo },
      aiValidation: {
        status: aiStatus,
        confidence: hasMissingDoc ? "82%" : "95%",
        checks: aiChecksDef,
        recommendation: hasMissingDoc
          ? "Proof of residence is missing. Requires applicant correction."
          : "Documents complete and identity verified. Ready for authorized PDAO review.",
      },
      verificationStatus: hasMissingDoc ? "Awaiting Document Correction" : "Pending Officer Review",
      correctionNote: hasMissingDoc ? "Proof of residence is missing. Please upload a valid Barangay Certificate of Residency." : null,
      documents: [
        { name: "Valid Government ID", fileName: idFile.name, verified: idFile.uploaded },
        { name: "1x1 ID Picture", fileName: photoFile.name, verified: photoFile.uploaded },
        { name: "Proof of Residence", fileName: hasMissingDoc ? "" : residenceFile.name, verified: !hasMissingDoc, missing: hasMissingDoc },
        { name: "Supporting Document", fileName: medicalFile.name, verified: medicalFile.uploaded },
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
            Service Information & Guidelines
          </h2>
          <p className="mt-1.5 text-xs leading-relaxed text-gray-500 sm:text-sm">
            Apply for official PWD Registration with the Persons with Disability Affairs Office of Malaybalay City through ACORS.
          </p>

          <div className="mt-5 grid grid-cols-2 gap-3 text-xs">
            <div className="rounded-2xl border border-zinc-100 bg-zinc-50/80 p-3.5">
              <span className="font-bold text-gray-800">Processing Fee</span>
              <p className="mt-1 font-mono text-base font-extrabold text-emerald-600">FREE</p>
              <p className="text-[11px] text-gray-400">Government assistance</p>
            </div>
            <div className="rounded-2xl border border-zinc-100 bg-zinc-50/80 p-3.5">
              <span className="font-bold text-gray-800">Review Officer</span>
              <p className="mt-1 font-mono text-base font-extrabold text-gray-900">PDAO Staff</p>
              <p className="text-[11px] text-gray-400">Authorized personnel</p>
            </div>
          </div>

          <div className="mt-5 rounded-2xl bg-zinc-50 p-4">
            <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-gray-500 mb-3">Requirements</p>
            {[
              "Valid Government ID",
              "1x1 Recent ID Picture",
              "Proof of Residence (Barangay Certificate or Utility Bill)",
              "Supporting disability document / Clinical assessment (when applicable)",
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
              IMPORTANT: AI does not determine medical qualification or eligibility. Final verification is conducted strictly by authorized PDAO and health personnel.
            </span>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-2.5">
            <span className="text-xs font-bold text-gray-500">Test Mode:</span>
            {[
              { key: "normal", label: "Complete (Pass)" },
              { key: "missing_doc", label: "Missing Residence Proof (Correction)" },
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

  function StepApplicantInfo() {
    return (
      <div className="space-y-5 animate-fade-up">
        <div className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex items-center gap-2.5 mb-5">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-red-50 text-red-600 font-bold text-xs">1</span>
            <div>
              <h2 className="text-sm font-extrabold text-gray-900 sm:text-base">Applicant Information</h2>
              <p className="text-xs text-gray-400">Personal information of the registrant</p>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {[
              { key: "fullName", label: "Full Name", type: "text" },
              { key: "dob", label: "Date of Birth", type: "date" },
              { key: "sex", label: "Sex", type: "select", options: ["Female", "Male"] },
              { key: "civilStatus", label: "Civil Status", type: "select", options: ["Single", "Married", "Widowed", "Separated"] },
              { key: "contactNumber", label: "Contact Number", type: "tel" },
              { key: "email", label: "Email Address", type: "email" },
              { key: "barangay", label: "Barangay", type: "select", options: ["Sumpong", "Casisang", "Kalasungay", "Bangcud", "Aglayan", "Poblacion", "Other"] },
              { key: "occupation", label: "Occupation", type: "text" },
              { key: "address", label: "Complete Address", type: "text", span: true },
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

  function StepDisabilityInfo() {
    return (
      <div className="space-y-5 animate-fade-up">
        <div className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex items-center gap-2.5 mb-5">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-red-50 text-red-600 font-bold text-xs">2</span>
            <div>
              <h2 className="text-sm font-extrabold text-gray-900 sm:text-base">Disability Information</h2>
              <p className="text-xs text-gray-400">Declaration for registration records</p>
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
              <label className="mb-1.5 block text-xs font-bold text-gray-700">Cause of Disability</label>
              <input
                type="text"
                value={disabilityInfo.cause}
                onChange={(e) => setDisabilityInfo((p) => ({ ...p, cause: e.target.value }))}
                placeholder="e.g. Congenital, Illness, Accident / Injury"
                className="w-full rounded-xl border border-zinc-200 bg-zinc-50/50 px-3.5 py-2.5 text-xs text-gray-900 focus:border-red-600 focus:bg-white focus:outline-none focus:ring-1 focus:ring-red-600"
              />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-bold text-gray-700">Date / Year Disability Started</label>
                <input
                  type="text"
                  value={disabilityInfo.yearStarted}
                  onChange={(e) => setDisabilityInfo((p) => ({ ...p, yearStarted: e.target.value }))}
                  placeholder="e.g. 1992 or 2018"
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50/50 px-3.5 py-2.5 text-xs text-gray-900 focus:border-red-600 focus:bg-white focus:outline-none focus:ring-1 focus:ring-red-600"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-bold text-gray-700">Assistive Device Used (if any)</label>
                <input
                  type="text"
                  value={disabilityInfo.assistiveDevice}
                  onChange={(e) => setDisabilityInfo((p) => ({ ...p, assistiveDevice: e.target.value }))}
                  placeholder="e.g. Wheelchair, Hearing Aid, None"
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50/50 px-3.5 py-2.5 text-xs text-gray-900 focus:border-red-600 focus:bg-white focus:outline-none focus:ring-1 focus:ring-red-600"
                />
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-bold text-gray-700">Additional Information</label>
              <textarea
                rows={3}
                value={disabilityInfo.additionalInfo}
                onChange={(e) => setDisabilityInfo((p) => ({ ...p, additionalInfo: e.target.value }))}
                placeholder="Describe any specific accommodations or details for PDAO records..."
                className="w-full rounded-xl border border-zinc-200 bg-zinc-50/50 p-3 text-xs text-gray-900 focus:border-red-600 focus:bg-white focus:outline-none focus:ring-1 focus:ring-red-600"
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
              <h2 className="text-sm font-extrabold text-gray-900 sm:text-base">Upload Requirements</h2>
              <p className="text-xs text-gray-400">All 4 verification attachments</p>
            </div>
          </div>
          <div className="space-y-3">
            <UploadBox label="Valid Government ID" file={idFile} onUpload={() => setIdFile({ name: "philsys_santos.jpg", type: "image/jpeg", size: "1.4 MB", uploaded: true })} onRemove={() => setIdFile({ name: "", uploaded: false })} required />
            <UploadBox label="1x1 Recent ID Picture" file={photoFile} onUpload={() => setPhotoFile({ name: "id_photo_1x1.jpg", type: "image/jpeg", size: "0.6 MB", uploaded: true })} onRemove={() => setPhotoFile({ name: "", uploaded: false })} required />
            <UploadBox label="Proof of Residence (Barangay Certificate / Bill)" file={hasMissingDoc ? { uploaded: false } : residenceFile} onUpload={() => setResidenceFile({ name: "brgy_cert_santos.jpg", type: "image/jpeg", size: "0.9 MB", uploaded: true })} onRemove={() => setResidenceFile({ name: "", uploaded: false })} required />
            <UploadBox label="Supporting Disability Document / Clinical Assessment" file={medicalFile} onUpload={() => setMedicalFile({ name: "clinical_assessment_doc.pdf", type: "application/pdf", size: "1.8 MB", uploaded: true })} onRemove={() => setMedicalFile({ name: "", uploaded: false })} />
          </div>
        </div>
        <NavButtons onBack={back} onNext={next} disabled={!idFile.uploaded || !photoFile.uploaded} />
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
              <p className="text-xs text-gray-400">Automated completeness and format audit</p>
            </div>
          </div>

          {aiChecks.length === 0 && !aiScanning ? (
            <div className="flex flex-col items-center gap-3 py-8 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-600">
                <Sparkles size={28} />
              </div>
              <p className="text-sm font-bold text-gray-800">Ready to validate application documents</p>
              <p className="max-w-xs text-xs text-gray-500">AI will check document readability, name consistency, and attachment completeness.</p>
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
                      {c.passed ? "Passed" : "Missing / Incomplete"}
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
                  <p className="mt-1.5 text-xs text-gray-600">AI Confidence: <span className="font-bold">{hasMissingDoc ? "82%" : "95%"}</span></p>
                  <p className="mt-2 text-[11px] text-gray-500 italic border-t border-zinc-200/60 pt-2">
                    Note: AI validates document presence and format only. Medical eligibility is determined exclusively by authorized PDAO staff.
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

          <SummaryRow label="Service" value="PWD Registration Certificate" />
          <SummaryRow label="Applicant" value={applicant.fullName} />
          <SummaryRow label="Date of Birth" value={applicant.dob} />
          <SummaryRow label="Address" value={applicant.address} />
          <SummaryRow label="Barangay" value={applicant.barangay} />
          <div className="border-t border-zinc-100 pt-2">
            <SummaryRow label="Disability Type" value={disabilityInfo.type} />
            <SummaryRow label="Cause" value={disabilityInfo.cause} />
            <SummaryRow label="Assistive Device" value={disabilityInfo.assistiveDevice || "None"} />
          </div>
          <div className="border-t border-zinc-100 pt-2">
            <p className="text-xs font-bold text-gray-700 mb-1">Uploaded Requirements</p>
            <div className="space-y-1 text-[11px] text-gray-600">
              <p>✓ Valid ID: {idFile.name}</p>
              <p>✓ 1x1 ID Picture: {photoFile.name}</p>
              <p className={hasMissingDoc ? "text-amber-700 font-bold" : ""}>
                {hasMissingDoc ? "⚠️ Proof of Residence: MISSING" : `✓ Proof of Residence: ${residenceFile.name}`}
              </p>
              <p>✓ Supporting Document: {medicalFile.name}</p>
            </div>
          </div>
          <div className={`rounded-xl border px-3.5 py-2.5 text-xs font-bold ${aiStatus === "PASSED" ? "border-emerald-200 bg-emerald-50 text-emerald-800" : "border-amber-200 bg-amber-50 text-amber-800"}`}>
            AI Validation: {aiStatus}
          </div>
        </div>
        <NavButtons onBack={back} onNext={handleSubmit} nextLabel="Submit Application" />
      </div>
    );
  }

  function StepTracking() {
    const isComplete = !hasMissingDoc;
    const trackSteps = [
      { label: "Application Submitted", done: true },
      { label: "AI Document Validation", done: true },
      { label: isComplete ? "PDAO Verification" : "Requires Document Correction", done: false, active: true },
      { label: "Registration Approved", done: false },
      { label: "Certificate Ready", done: false },
    ];

    return (
      <div className="space-y-5 animate-fade-up">
        <div className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm sm:p-6">
          <h2 className="text-sm font-extrabold text-gray-900 mb-1">Application Tracking</h2>
          <p className="font-mono text-xs text-red-600 mb-4">{generatedReqId}</p>

          <div className={`mb-5 rounded-2xl border p-4 text-xs ${isComplete ? "border-blue-200 bg-blue-50/60" : "border-amber-200 bg-amber-50/70"}`}>
            <p className="font-extrabold text-gray-900 text-xs sm:text-sm">
              Status: {isComplete ? "Ready for PDAO Verification" : "Requires Correction"}
            </p>
            <p className="mt-1 text-gray-600">
              {isComplete
                ? "Your documents are complete and queued for review by the authorized PDAO officer."
                : "Proof of residence is missing. Please upload the required document to continue verification."}
            </p>
            {!isComplete && (
              <button
                type="button"
                onClick={() => {
                  setTestMode("normal");
                  setCurrentStep(4);
                }}
                className="mt-3 inline-flex items-center gap-2 rounded-xl bg-amber-600 px-4 py-2 text-xs font-bold text-white hover:bg-amber-700 active:scale-95"
              >
                <Upload size={14} /> Upload Missing Document
              </button>
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

        {isComplete && (
          <button
            type="button"
            onClick={next}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-red-600 py-3.5 text-xs sm:text-sm font-bold text-white shadow-sm hover:bg-red-700 active:scale-[0.98]"
          >
            View Sample Certificate <ArrowRight size={16} />
          </button>
        )}
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
          <p className="text-base sm:text-lg font-extrabold text-gray-900">Registration Approved</p>
          <p className="text-xs text-gray-500 mt-1">Your PWD Registration Certificate has been issued by PDAO.</p>
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
              <p className="mt-2 text-xs font-extrabold uppercase tracking-[0.2em] text-red-700">PWD Registration Certificate</p>
              <p className="font-mono text-xs font-bold text-gray-700 mt-1">{issuedCertNo}</p>
            </div>

            <div className="space-y-2 text-xs">
              <SummaryRow label="Full Name" value={applicant.fullName} />
              <SummaryRow label="Date of Birth" value={applicant.dob} />
              <SummaryRow label="Address" value={applicant.address} />
              <SummaryRow label="Disability Type" value={disabilityInfo.type} />
              <SummaryRow label="Registration Date" value={new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })} />
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
            onClick={() => setNotificationToast("Sample certificate downloaded.")}
            className="flex h-11 items-center justify-center gap-1.5 rounded-2xl border border-zinc-200 bg-white py-2.5 text-xs font-bold text-gray-700 hover:bg-zinc-50 active:scale-95"
          >
            <Download size={14} /> Download
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
            <SummaryRow label="Document" value="PWD Registration Certificate" />
            <SummaryRow label="Registrant" value={applicant.fullName} />
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
    <StepStart />, <StepApplicantInfo />, <StepDisabilityInfo />, <StepUploadRequirements />,
    <StepAIValidation />, <StepSummary />, <StepTracking />, <StepCertificateReady />,
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
            PWD Registration Certificate
          </h1>
          <p className="mt-0.5 text-xs text-gray-500">
            Free public service · Authorized officer verification
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
