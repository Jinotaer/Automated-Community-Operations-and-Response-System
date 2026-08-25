// src/Citizen/SoloParentIDFlow.jsx
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
  HeartHandshake,
  Plus,
  Trash2,
} from "lucide-react";
import { saveSoloParentRequest } from "../services/soloParentData";

const STEPS = [
  "Start Application",
  "Applicant Info",
  "Solo Parent Info",
  "Children Info",
  "Upload Requirements",
  "AI Validation",
  "Request Summary",
  "Tracking",
  "Solo Parent ID Ready",
];

const REASONS = [
  "Death of Spouse",
  "Separation from Spouse",
  "Abandonment",
  "Unmarried Parent",
  "Legal Separation",
  "Spouse is Incapacitated",
  "Spouse is Detained",
  "Other",
];

export default function SoloParentIDFlow({ office, cert }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [testMode, setTestMode] = useState("normal"); // "normal" | "missing_doc"

  const [applicant, setApplicant] = useState({
    fullName: "Maria Santos",
    dob: "1989-05-12",
    sex: "Female",
    civilStatus: "Widowed",
    address: "Purok 3, Casisang, Malaybalay City, Bukidnon",
    barangay: "Casisang",
    contactNumber: "0917-223-8899",
    email: "maria.santos@gmail.com",
    occupation: "Self-Employed / Online Vendor",
  });

  const [soloParentInfo, setSoloParentInfo] = useState({
    reason: "Death of Spouse",
    reasonOther: "",
    yearStarted: "2020",
    employmentStatus: "Self-Employed",
  });

  const [children, setChildren] = useState([
    { fullName: "Gabriel Santos", dob: "2015-08-20", relationship: "Son", school: "Casisang Central School" },
    { fullName: "Hannah Santos", dob: "2018-03-14", relationship: "Daughter", school: "Casisang Day Care" },
  ]);

  const [idFile, setIdFile] = useState({ name: "philsys_santos.jpg", type: "image/jpeg", size: "1.4 MB", uploaded: true });
  const [birthFile, setBirthFile] = useState({ name: "psa_birth_certs_children.pdf", type: "application/pdf", size: "2.2 MB", uploaded: true });
  const [residenceFile, setResidenceFile] = useState({ name: "brgy_cert_santos.jpg", type: "image/jpeg", size: "0.9 MB", uploaded: true });
  const [statusProofFile, setStatusProofFile] = useState({ name: "death_cert_spouse.pdf", type: "application/pdf", size: "1.1 MB", uploaded: true });
  const [otherDocFile, setOtherDocFile] = useState({ name: "", uploaded: false });

  const [aiScanning, setAiScanning] = useState(false);
  const [aiProgress, setAiProgress] = useState(0);
  const [aiChecks, setAiChecks] = useState([]);

  const [generatedReqId, setGeneratedReqId] = useState("");
  const [issuedIdNo, setIssuedIdNo] = useState("");
  const [submittedTime, setSubmittedTime] = useState("");

  const [showQRModal, setShowQRModal] = useState(false);
  const [notificationToast, setNotificationToast] = useState(null);

  const hasMissingDoc = testMode === "missing_doc";

  const aiChecksDef = [
    { label: "Required fields completed", passed: true },
    { label: "Valid ID uploaded", passed: true },
    { label: "ID readable", passed: true },
    { label: "Applicant name consistency", passed: true },
    { label: "Child information consistency", passed: true },
    { label: "Required documents uploaded", passed: !hasMissingDoc },
    { label: "Possible duplicate application", passed: true },
    { label: "Missing information", passed: !hasMissingDoc },
  ];

  const aiStatus = hasMissingDoc ? "REQUIRES CORRECTION" : "READY FOR REVIEW";

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

  function handleAddChild() {
    setChildren((prev) => [
      ...prev,
      { fullName: "", dob: "", relationship: "Child", school: "" },
    ]);
  }

  function handleRemoveChild(index) {
    if (children.length <= 1) return;
    setChildren((prev) => prev.filter((_, i) => i !== index));
  }

  function handleChildChange(index, field, value) {
    setChildren((prev) =>
      prev.map((c, i) => (i === index ? { ...c, [field]: value } : c))
    );
  }

  function handleSubmit() {
    const reqId = `ACORS-SP-2026-${String(Math.floor(10000 + Math.random() * 90000)).padStart(6, "0")}`;
    const idNo = `SPID-2026-${Math.floor(100000 + Math.random() * 900000)}`;
    const now = new Date().toLocaleString("en-US", {
      month: "long", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit",
    });
    setGeneratedReqId(reqId);
    setIssuedIdNo(idNo);
    setSubmittedTime(now);

    saveSoloParentRequest({
      id: reqId,
      certificateType: "Solo Parent ID",
      submittedAt: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      status: hasMissingDoc ? "Requires Correction" : "Ready for CSWDO Verification",
      applicant: { ...applicant },
      soloParentInfo: { ...soloParentInfo, numberOfChildren: children.length },
      children: [...children],
      aiValidation: {
        status: aiStatus,
        confidence: hasMissingDoc ? "80%" : "95%",
        checks: aiChecksDef,
        recommendation: hasMissingDoc
          ? "Supporting document is missing. Requires applicant correction."
          : "Application complete and consistent. Ready for authorized CSWDO assessment.",
      },
      verificationStatus: hasMissingDoc ? "Awaiting Document Correction" : "Pending CSWDO Officer Assessment",
      certificateNumber: idNo,
      issueDate: new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
      documents: [
        { name: "Valid Government ID", fileName: idFile.name, verified: idFile.uploaded },
        { name: "Birth Certificate of Children", fileName: birthFile.name, verified: birthFile.uploaded },
        { name: "Proof of Residence", fileName: residenceFile.name, verified: residenceFile.uploaded },
        { name: "Supporting Solo Parent Proof", fileName: hasMissingDoc ? "" : statusProofFile.name, verified: !hasMissingDoc, missing: hasMissingDoc },
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
            Solo Parent ID Application Guidelines
          </h2>
          <p className="mt-1.5 text-xs leading-relaxed text-gray-500 sm:text-sm">
            Apply for an official Solo Parent Identification Card under RA 8972 (Solo Parents' Welfare Act) and RA 11861 through ACORS. Entitles you to discounts, educational assistance, and welfare benefits.
          </p>

          <div className="mt-5 grid grid-cols-2 gap-3 text-xs">
            <div className="rounded-2xl border border-zinc-100 bg-zinc-50/80 p-3.5">
              <span className="font-bold text-gray-800">Processing Fee</span>
              <p className="mt-1 font-mono text-base font-extrabold text-emerald-600">FREE</p>
              <p className="text-[11px] text-gray-400">Social welfare assistance</p>
            </div>
            <div className="rounded-2xl border border-zinc-100 bg-zinc-50/80 p-3.5">
              <span className="font-bold text-gray-800">Validity</span>
              <p className="mt-1 font-mono text-base font-extrabold text-gray-900">1 Year</p>
              <p className="text-[11px] text-gray-400">Annual renewal by CSWDO</p>
            </div>
          </div>

          <div className="mt-5 rounded-2xl bg-zinc-50 p-4">
            <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-gray-500 mb-3">Required Documents</p>
            {[
              "Valid Government ID of Parent",
              "PSA Birth Certificate of Child / Children",
              "Barangay Certificate of Residency in Malaybalay City",
              "Proof supporting solo-parent status (Death cert of spouse, affidavit of abandonment, certificate of detention, etc.)",
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
              IMPORTANT: The AI validates document completeness only. Legal qualification and social assessment are determined exclusively by authorized CSWDO personnel.
            </span>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-2.5">
            <span className="text-xs font-bold text-gray-500">Test Mode:</span>
            {[
              { key: "normal", label: "Complete (Pass)" },
              { key: "missing_doc", label: "Missing Status Proof (Correction)" },
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
              <p className="text-xs text-gray-400">Parent personal details</p>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {[
              { key: "fullName", label: "Full Name", type: "text" },
              { key: "dob", label: "Date of Birth", type: "date" },
              { key: "sex", label: "Sex", type: "select", options: ["Female", "Male"] },
              { key: "civilStatus", label: "Civil Status", type: "select", options: ["Widowed", "Single / Unmarried", "Separated", "Divorced / Annulled"] },
              { key: "contactNumber", label: "Contact Number", type: "tel" },
              { key: "email", label: "Email Address", type: "email" },
              { key: "barangay", label: "Barangay", type: "select", options: ["Casisang", "Sumpong", "Kalasungay", "Bangcud", "Aglayan", "Poblacion", "Other"] },
              { key: "occupation", label: "Occupation / Source of Income", type: "text" },
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

  function StepSoloParentInfo() {
    return (
      <div className="space-y-5 animate-fade-up">
        <div className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex items-center gap-2.5 mb-5">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-red-50 text-red-600 font-bold text-xs">2</span>
            <div>
              <h2 className="text-sm font-extrabold text-gray-900 sm:text-base">Solo Parent Declaration</h2>
              <p className="text-xs text-gray-400">Category of solo parenthood</p>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-bold text-gray-700">Reason for Solo Parenthood</label>
              <select
                value={soloParentInfo.reason}
                onChange={(e) => setSoloParentInfo((p) => ({ ...p, reason: e.target.value }))}
                className="w-full rounded-xl border border-zinc-200 bg-zinc-50/50 px-3.5 py-2.5 text-xs text-gray-900 focus:border-red-600 focus:bg-white focus:outline-none focus:ring-1 focus:ring-red-600"
              >
                {REASONS.map((r) => <option key={r}>{r}</option>)}
              </select>
            </div>

            {soloParentInfo.reason === "Other" && (
              <div>
                <label className="mb-1.5 block text-xs font-bold text-gray-700">Please specify reason</label>
                <input
                  type="text"
                  value={soloParentInfo.reasonOther}
                  onChange={(e) => setSoloParentInfo((p) => ({ ...p, reasonOther: e.target.value }))}
                  placeholder="Explain your solo parent circumstances..."
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50/50 px-3.5 py-2.5 text-xs text-gray-900 focus:border-red-600 focus:bg-white focus:outline-none focus:ring-1 focus:ring-red-600"
                />
              </div>
            )}

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-bold text-gray-700">Date / Year Solo Parenthood Started</label>
                <input
                  type="text"
                  value={soloParentInfo.yearStarted}
                  onChange={(e) => setSoloParentInfo((p) => ({ ...p, yearStarted: e.target.value }))}
                  placeholder="e.g. 2020"
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50/50 px-3.5 py-2.5 text-xs text-gray-900 focus:border-red-600 focus:bg-white focus:outline-none focus:ring-1 focus:ring-red-600"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-bold text-gray-700">Current Employment Status</label>
                <input
                  type="text"
                  value={soloParentInfo.employmentStatus}
                  onChange={(e) => setSoloParentInfo((p) => ({ ...p, employmentStatus: e.target.value }))}
                  placeholder="e.g. Employed, Self-Employed, Unemployed"
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

  function StepChildrenInfo() {
    return (
      <div className="space-y-5 animate-fade-up">
        <div className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-red-50 text-red-600 font-bold text-xs">3</span>
              <div>
                <h2 className="text-sm font-extrabold text-gray-900 sm:text-base">Child / Children Information</h2>
                <p className="text-xs text-gray-400">Add all dependent children</p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleAddChild}
              className="flex items-center gap-1.5 rounded-xl bg-red-50 px-3 py-1.5 text-xs font-bold text-red-700 hover:bg-red-100 active:scale-95"
            >
              <Plus size={14} /> Add Child
            </button>
          </div>

          <div className="space-y-4">
            {children.map((child, index) => (
              <div key={index} className="rounded-2xl border border-zinc-200 bg-zinc-50/60 p-4 space-y-3 relative">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-800">Child #{index + 1}</span>
                  {children.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveChild(index)}
                      className="text-gray-400 hover:text-red-600 text-xs font-bold flex items-center gap-1"
                    >
                      <Trash2 size={13} /> Remove
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-[11px] font-bold text-gray-600">Full Name of Child</label>
                    <input
                      type="text"
                      value={child.fullName}
                      onChange={(e) => handleChildChange(index, "fullName", e.target.value)}
                      placeholder="Child full name"
                      className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-xs text-gray-900 focus:border-red-600 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-[11px] font-bold text-gray-600">Date of Birth</label>
                    <input
                      type="date"
                      value={child.dob}
                      onChange={(e) => handleChildChange(index, "dob", e.target.value)}
                      className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-xs text-gray-900 focus:border-red-600 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-[11px] font-bold text-gray-600">Relationship</label>
                    <input
                      type="text"
                      value={child.relationship}
                      onChange={(e) => handleChildChange(index, "relationship", e.target.value)}
                      placeholder="e.g. Son, Daughter, Adopted"
                      className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-xs text-gray-900 focus:border-red-600 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-[11px] font-bold text-gray-600">School / Occupation (if applicable)</label>
                    <input
                      type="text"
                      value={child.school}
                      onChange={(e) => handleChildChange(index, "school", e.target.value)}
                      placeholder="School name or occupation"
                      className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-xs text-gray-900 focus:border-red-600 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            ))}
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
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-red-50 text-red-600 font-bold text-xs">4</span>
            <div>
              <h2 className="text-sm font-extrabold text-gray-900 sm:text-base">Upload Document Requirements</h2>
              <p className="text-xs text-gray-400">All required documents for CSWDO assessment</p>
            </div>
          </div>
          <div className="space-y-3">
            <UploadBox label="Valid Government ID of Parent" file={idFile} onUpload={() => setIdFile({ name: "philsys_santos.jpg", type: "image/jpeg", size: "1.4 MB", uploaded: true })} onRemove={() => setIdFile({ name: "", uploaded: false })} required />
            <UploadBox label="Birth Certificate of Child / Children (PSA)" file={birthFile} onUpload={() => setBirthFile({ name: "psa_birth_certs_children.pdf", type: "application/pdf", size: "2.2 MB", uploaded: true })} onRemove={() => setBirthFile({ name: "", uploaded: false })} required />
            <UploadBox label="Proof of Residence (Barangay Certificate / Bill)" file={residenceFile} onUpload={() => setResidenceFile({ name: "brgy_cert_santos.jpg", type: "image/jpeg", size: "0.9 MB", uploaded: true })} onRemove={() => setResidenceFile({ name: "", uploaded: false })} required />
            <UploadBox label="Proof Supporting Solo-Parent Status (Death Cert / Affidavit / Custody doc)" file={hasMissingDoc ? { uploaded: false } : statusProofFile} onUpload={() => setStatusProofFile({ name: "death_cert_spouse.pdf", type: "application/pdf", size: "1.1 MB", uploaded: true })} onRemove={() => setStatusProofFile({ name: "", uploaded: false })} required />
            <UploadBox label="Other Supporting Documents (Optional)" file={otherDocFile} onUpload={() => setOtherDocFile({ name: "extra_affidavit.pdf", type: "application/pdf", size: "0.6 MB", uploaded: true })} onRemove={() => setOtherDocFile({ name: "", uploaded: false })} />
          </div>
        </div>
        <NavButtons onBack={back} onNext={next} disabled={!idFile.uploaded || !birthFile.uploaded || !residenceFile.uploaded} />
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
              <h2 className="text-sm font-extrabold text-gray-900 sm:text-base">AI Document Validation</h2>
              <p className="text-xs text-gray-400">Completeness and data consistency verification</p>
            </div>
          </div>

          {aiChecks.length === 0 && !aiScanning ? (
            <div className="flex flex-col items-center gap-3 py-8 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-600">
                <Sparkles size={28} />
              </div>
              <p className="text-sm font-bold text-gray-800">Ready to validate application requirements</p>
              <p className="max-w-xs text-xs text-gray-500">AI will scan for required attachments, children information consistency, and duplicate checks.</p>
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
                  <div className="flex justify-between text-xs font-bold mb-1.5"><span>Scanning Requirements…</span><span>{aiProgress}%</span></div>
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
                <div className={`mt-4 rounded-2xl border p-4 ${aiStatus === "READY FOR REVIEW" ? "border-emerald-200 bg-emerald-50" : "border-amber-200 bg-amber-50"}`}>
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-xs sm:text-sm text-gray-900">AI Recommendation</span>
                    <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-extrabold text-white ${aiStatus === "READY FOR REVIEW" ? "bg-emerald-600" : "bg-amber-600"}`}>{aiStatus}</span>
                  </div>
                  <p className="mt-1.5 text-xs text-gray-600">AI Confidence: <span className="font-bold">{hasMissingDoc ? "80%" : "95%"}</span></p>
                  <p className="mt-2 text-[11px] text-gray-500 italic border-t border-zinc-200/60 pt-2">
                    IMPORTANT: The AI does not make solo parent eligibility decisions. Official qualification is determined by authorized CSWDO social welfare staff.
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

          <SummaryRow label="Service" value="Solo Parent ID" />
          <SummaryRow label="Applicant" value={applicant.fullName} />
          <SummaryRow label="Date of Birth" value={applicant.dob} />
          <SummaryRow label="Civil Status" value={applicant.civilStatus} />
          <SummaryRow label="Address" value={applicant.address} />
          <SummaryRow label="Barangay" value={applicant.barangay} />
          <div className="border-t border-zinc-100 pt-2">
            <SummaryRow label="Reason for Solo Parenthood" value={soloParentInfo.reason} />
            <SummaryRow label="Number of Children" value={`${children.length} Child/Children`} />
            <SummaryRow label="Year Started" value={soloParentInfo.yearStarted} />
          </div>
          <div className="border-t border-zinc-100 pt-2">
            <p className="text-xs font-bold text-gray-700 mb-1">Declared Children:</p>
            {children.map((c, i) => (
              <p key={i} className="text-[11px] text-gray-600">
                • {c.fullName || `Child #${i + 1}`} ({c.relationship}) — Born {c.dob || "—"}
              </p>
            ))}
          </div>
          <div className="border-t border-zinc-100 pt-2">
            <SummaryRow label="Application Fee" value="FREE" />
          </div>
          <div className={`rounded-xl border px-3.5 py-2.5 text-xs font-bold ${aiStatus === "READY FOR REVIEW" ? "border-emerald-200 bg-emerald-50 text-emerald-800" : "border-amber-200 bg-amber-50 text-amber-800"}`}>
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
      { label: isComplete ? "CSWDO Verification" : "Requires Document Correction", done: false, active: true },
      { label: "Application Approved", done: false },
      { label: "Solo Parent ID Ready", done: false },
    ];

    return (
      <div className="space-y-5 animate-fade-up">
        <div className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm sm:p-6">
          <h2 className="text-sm font-extrabold text-gray-900 mb-1">Application Tracking</h2>
          <p className="font-mono text-xs text-red-600 mb-4">{generatedReqId}</p>

          <div className={`mb-5 rounded-2xl border p-4 text-xs ${isComplete ? "border-blue-200 bg-blue-50/60" : "border-amber-200 bg-amber-50/70"}`}>
            <p className="font-extrabold text-gray-900 text-xs sm:text-sm">
              Status: {isComplete ? "Ready for CSWDO Verification" : "Requires Correction"}
            </p>
            <p className="mt-1 text-gray-600">
              {isComplete
                ? "Your application is complete and queued for verification by the CSWDO social welfare officer."
                : "Supporting document for solo-parent status is missing. Please upload the required proof."}
            </p>
            {!isComplete && (
              <button
                type="button"
                onClick={() => {
                  setTestMode("normal");
                  setCurrentStep(5);
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
            View Sample Solo Parent ID <ArrowRight size={16} />
          </button>
        )}
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
          <p className="text-base sm:text-lg font-extrabold text-gray-900">Solo Parent Application Approved</p>
          <p className="text-xs text-gray-500 mt-1">Your Solo Parent ID has been approved by CSWDO.</p>
          <p className="font-mono text-xs sm:text-sm font-bold text-emerald-700 mt-2">{issuedIdNo}</p>
        </div>

        {/* Sample Solo Parent ID Card */}
        <div className="relative overflow-hidden rounded-3xl border-2 border-red-700 bg-gradient-to-br from-white via-zinc-50 to-red-50/30 p-5 sm:p-6 shadow-md">
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
            <span className="text-4xl sm:text-5xl font-extrabold text-zinc-100 rotate-[-30deg] tracking-widest uppercase">SAMPLE</span>
          </div>

          <div className="relative z-10">
            {/* Header */}
            <div className="flex items-center justify-between border-b-2 border-red-600 pb-3 mb-4">
              <div>
                <p className="text-[9px] font-bold uppercase tracking-widest text-gray-500">Republic of the Philippines</p>
                <p className="text-[10px] font-bold uppercase tracking-wider text-gray-700">City Social Welfare and Development Office (CSWDO)</p>
                <p className="text-xs font-extrabold uppercase text-red-700 tracking-wider">Solo Parent Identification Card</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-600 text-white">
                <HeartHandshake size={20} />
              </div>
            </div>

            {/* Content */}
            <div className="flex flex-col sm:flex-row gap-4 items-center sm:items-start text-xs">
              <div className="flex flex-col items-center">
                <div className="flex h-24 w-20 items-center justify-center rounded-xl border-2 border-dashed border-zinc-300 bg-zinc-100 text-zinc-400 font-bold text-xs">
                  PHOTO
                </div>
                <span className="mt-1 font-mono text-[9px] font-bold text-gray-400">1x1 Photo</span>
              </div>

              <div className="flex-1 w-full space-y-1.5">
                <SummaryRow label="Solo Parent ID No." value={issuedIdNo} />
                <SummaryRow label="Cardholder Name" value={applicant.fullName} />
                <SummaryRow label="Date of Birth" value={applicant.dob} />
                <SummaryRow label="Address" value={applicant.barangay + ", Malaybalay City"} />
                <SummaryRow label="Number of Dependents" value={`${children.length} Child/Children`} />
                <SummaryRow label="Date Issued" value={new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })} />
                <SummaryRow label="Valid Until" value={new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })} />
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
            onClick={() => setNotificationToast("Solo Parent ID viewed.")}
            className="flex h-11 items-center justify-center gap-1.5 rounded-2xl border border-zinc-200 bg-white py-2.5 text-xs font-bold text-gray-700 hover:bg-zinc-50 active:scale-95"
          >
            <Eye size={14} /> View Document
          </button>
          <button
            type="button"
            onClick={() => setNotificationToast("Sample Solo Parent ID downloaded.")}
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
            <SummaryRow label="Solo Parent ID No." value={issuedIdNo} />
            <SummaryRow label="Document" value="Solo Parent Identification Card" />
            <SummaryRow label="Cardholder" value={applicant.fullName} />
            <SummaryRow label="Dependents" value={`${children.length} Child/Children`} />
            <SummaryRow label="Request ID" value={generatedReqId} />
          </div>
          <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 py-2 text-center">
            <span className="text-xs font-extrabold text-emerald-700">VALID — CSWDO Registry Verified</span>
          </div>
          <p className="mt-3 text-center text-[10px] text-zinc-400 uppercase tracking-wider">SAMPLE – NOT AN OFFICIAL GOVERNMENT DOCUMENT</p>
        </div>
      </div>
    );
  }

  const stepComponents = [
    <StepStart />, <StepApplicantInfo />, <StepSoloParentInfo />, <StepChildrenInfo />,
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
          CSWDO Portal
        </span>
      </div>

      {/* Header Banner matching LCRO */}
      <div className="mt-4 flex items-center gap-3.5 rounded-3xl border border-zinc-200 bg-white p-4 shadow-sm sm:p-5 animate-fade-up">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-red-600 text-white shadow-md">
          <HeartHandshake size={22} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-red-600">
            Solo Parent Office / CSWDO
          </p>
          <h1 className="text-lg font-extrabold leading-tight text-gray-900 sm:text-xl">
            Solo Parent ID
          </h1>
          <p className="mt-0.5 text-xs text-gray-500">
            Free welfare assistance · RA 8972 &amp; RA 11861 benefits
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
