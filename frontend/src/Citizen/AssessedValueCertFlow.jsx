// src/Citizen/AssessedValueCertFlow.jsx
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
  Building,
} from "lucide-react";
import { saveAssessorRequest, findMockPropertyRecord } from "../services/assessorData";

const STEPS = [
  "Start Application",
  "Requester Info",
  "Property Details",
  "Upload Documents",
  "AI Validation & OCR",
  "Property Check",
  "Request Summary",
  "Tracking",
  "Certificate Ready",
];

const PURPOSE_OPTIONS = [
  "Bank Loan",
  "Property Transaction",
  "Government Requirement",
  "Legal Requirement",
  "Financial Requirement",
  "Personal Record",
  "Other",
];

const PROPERTY_TYPES = ["Residential", "Commercial", "Agricultural", "Industrial", "Special"];

export default function AssessedValueCertFlow({ office, cert }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [testMode, setTestMode] = useState("normal"); // "normal" | "unmatched"

  const [requester, setRequester] = useState({
    fullName: "Pedro Santos",
    address: "Sayre Highway, Sumpong, Malaybalay City",
    contactNumber: "0920-441-9988",
    email: "pedro.santos@gmail.com",
  });

  const [property, setProperty] = useState({
    ownerName: "Pedro Santos",
    propertyAddress: "Sayre Highway, Sumpong, Malaybalay City",
    barangay: "Sumpong",
    propertyId: "PROP-2026-00003",
    taxDeclarationNumber: "TD-2026-00345",
    propertyType: "Commercial",
    purpose: "Bank Loan",
  });

  const [idFile, setIdFile] = useState({ name: "passport_pedro.jpg", type: "image/jpeg", size: "1.2 MB", uploaded: true });
  const [tdFile, setTdFile] = useState({ name: "td_pedro_commercial.pdf", type: "application/pdf", size: "1.7 MB", uploaded: true });
  const [ownershipFile, setOwnershipFile] = useState({ name: "tct_commercial_pedro.pdf", type: "application/pdf", size: "2.3 MB", uploaded: true });
  const [authFile, setAuthFile] = useState({ name: "", uploaded: false });
  const [supportFile, setSupportFile] = useState({ name: "", uploaded: false });

  const [aiScanning, setAiScanning] = useState(false);
  const [aiProgress, setAiProgress] = useState(0);
  const [aiChecks, setAiChecks] = useState([]);
  const [ocrData, setOcrData] = useState(null);

  const [matchedRecord, setMatchedRecord] = useState(null);
  const [isCheckingProperty, setIsCheckingProperty] = useState(false);

  const [generatedReqId, setGeneratedReqId] = useState("");
  const [issuedCertNo, setIssuedCertNo] = useState("");
  const [submittedTime, setSubmittedTime] = useState("");

  const [showQRModal, setShowQRModal] = useState(false);
  const [notificationToast, setNotificationToast] = useState(null);

  const aiChecksDef = [
    { label: "Required information completed", passed: true },
    { label: "Document completeness", passed: true },
    { label: "Document readability", passed: true },
    { label: "Owner name consistency", passed: testMode === "normal" },
    { label: "Property address consistency", passed: testMode === "normal" },
    { label: "Property ID consistency", passed: testMode === "normal" },
    { label: "Tax Declaration consistency", passed: testMode === "normal" },
    { label: "Possible duplicate request", passed: true },
  ];

  const aiStatus = testMode === "normal" ? "READY FOR ASSESSOR REVIEW" : "REQUIRES ASSESSOR REVIEW";

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
          owner: property.ownerName,
          propertyId: property.propertyId,
          taxDeclarationNumber: property.taxDeclarationNumber,
          propertyAddress: property.propertyAddress,
          classification: "Commercial (Class A)",
          assessedValue: "₱1,250,000.00",
        });
      }
    }, 280);
  }

  function runPropertyCheck() {
    setIsCheckingProperty(true);
    setTimeout(() => {
      const found = testMode === "normal"
        ? findMockPropertyRecord({
            propertyId: property.propertyId,
            taxDeclarationNumber: property.taxDeclarationNumber,
            owner: property.ownerName,
          })
        : null;
      setMatchedRecord(found || false);
      setIsCheckingProperty(false);
    }, 1800);
  }

  function handleSubmit() {
    const reqId = `ACORS-ASSESSOR-2026-${String(Math.floor(10000 + Math.random() * 90000)).padStart(6, "0")}`;
    const certNo = `CAV-2026-${Math.floor(100000 + Math.random() * 900000)}`;
    const now = new Date().toLocaleString("en-US", {
      month: "long", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit",
    });
    setGeneratedReqId(reqId);
    setIssuedCertNo(certNo);
    setSubmittedTime(now);

    saveAssessorRequest({
      id: reqId,
      certificateType: "Certification of Assessed Value",
      submittedAt: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      status: "Ready for Assessor Verification",
      requester: { ...requester },
      property: {
        ...property,
        classification: matchedRecord?.classification || "Commercial (Class A)",
        assessedValue: matchedRecord?.assessedValue || "₱1,250,000.00",
      },
      aiValidation: {
        status: aiStatus,
        confidence: "96%",
        checks: aiChecksDef,
        ocrExtracted: {
          owner: property.ownerName,
          propertyId: property.propertyId,
          taxDeclarationNumber: property.taxDeclarationNumber,
          propertyAddress: property.propertyAddress,
          classification: "Commercial",
          assessedValue: "₱1,250,000.00",
        },
        recommendation: "Commercial property appraisal records validated with current Schedule of Fair Market Values.",
      },
      propertyRecordCheck: matchedRecord
        ? { status: "MATCHED", propertyId: property.propertyId, taxDeclarationNumber: property.taxDeclarationNumber, message: "Property Record Found & Assessment Value Verified." }
        : { status: "UNMATCHED", message: "Record not automatically matched. Forwarded to assessor appraiser." },
      payment: {
        status: "Paid",
        amount: "₱150.00",
        referenceNumber: "ACORS-PAY-20260825-012",
        method: "Online Banking",
      },
      verificationStatus: "Pending Assessor Staff Verification",
      certificateNumber: certNo,
      issueDate: new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
      documents: [
        { name: "Valid Government ID", fileName: idFile.name, verified: idFile.uploaded },
        { name: "Existing Tax Declaration", fileName: tdFile.name, verified: tdFile.uploaded },
        { name: "Proof of Ownership", fileName: ownershipFile.name, verified: ownershipFile.uploaded },
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
            Certification of Assessed Value Guidelines
          </h2>
          <p className="mt-1.5 text-xs leading-relaxed text-gray-500 sm:text-sm">
            Request an official certification displaying the exact assessed and market valuation of a registered real property for bank loans, collateral, or government transactions.
          </p>

          <div className="mt-5 grid grid-cols-2 gap-3 text-xs">
            <div className="rounded-2xl border border-zinc-100 bg-zinc-50/80 p-3.5">
              <span className="font-bold text-gray-800">Processing Fee</span>
              <p className="mt-1 font-mono text-base font-extrabold text-emerald-600">₱150.00</p>
              <p className="text-[11px] text-gray-400">Prototype Certification Fee</p>
            </div>
            <div className="rounded-2xl border border-zinc-100 bg-zinc-50/80 p-3.5">
              <span className="font-bold text-gray-800">Turnaround</span>
              <p className="mt-1 font-mono text-base font-extrabold text-gray-900">Same Day</p>
              <p className="text-[11px] text-gray-400">Digital verification</p>
            </div>
          </div>

          <div className="mt-5 rounded-2xl bg-zinc-50 p-4">
            <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-gray-500 mb-3">Required Documents</p>
            {[
              "Valid Government ID of Requester",
              "Existing Tax Declaration (if available)",
              "Proof of Ownership / Title (TCT / OCT / Deed of Sale)",
              "Authorization Letter (if representing the registered owner)",
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
              IMPORTANT: AI assists with document validation only. Official assessed values are certified under the seal of the City Assessor.
            </span>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-2.5">
            <span className="text-xs font-bold text-gray-500">Test Mode:</span>
            {[
              { key: "normal", label: "Property Record Found (Pass)" },
              { key: "unmatched", label: "Record Not Found (Review)" },
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

  function StepRequesterInfo() {
    return (
      <div className="space-y-5 animate-fade-up">
        <div className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex items-center gap-2.5 mb-5">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-red-50 text-red-600 font-bold text-xs">1</span>
            <div>
              <h2 className="text-sm font-extrabold text-gray-900 sm:text-base">Requester Information</h2>
              <p className="text-xs text-gray-400">Applicant details</p>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-bold text-gray-700">Full Name</label>
              <input
                type="text"
                value={requester.fullName}
                onChange={(e) => setRequester((p) => ({ ...p, fullName: e.target.value }))}
                className="w-full rounded-xl border border-zinc-200 bg-zinc-50/50 px-3.5 py-2.5 text-xs text-gray-900 focus:border-red-600 focus:bg-white focus:outline-none focus:ring-1 focus:ring-red-600"
              />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-bold text-gray-700">Contact Number</label>
                <input
                  type="tel"
                  value={requester.contactNumber}
                  onChange={(e) => setRequester((p) => ({ ...p, contactNumber: e.target.value }))}
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50/50 px-3.5 py-2.5 text-xs text-gray-900 focus:border-red-600 focus:bg-white focus:outline-none focus:ring-1 focus:ring-red-600"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-bold text-gray-700">Email Address</label>
                <input
                  type="email"
                  value={requester.email}
                  onChange={(e) => setRequester((p) => ({ ...p, email: e.target.value }))}
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50/50 px-3.5 py-2.5 text-xs text-gray-900 focus:border-red-600 focus:bg-white focus:outline-none focus:ring-1 focus:ring-red-600"
                />
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-bold text-gray-700">Address</label>
              <input
                type="text"
                value={requester.address}
                onChange={(e) => setRequester((p) => ({ ...p, address: e.target.value }))}
                className="w-full rounded-xl border border-zinc-200 bg-zinc-50/50 px-3.5 py-2.5 text-xs text-gray-900 focus:border-red-600 focus:bg-white focus:outline-none focus:ring-1 focus:ring-red-600"
              />
            </div>
          </div>
        </div>
        <NavButtons onBack={back} onNext={next} />
      </div>
    );
  }

  function StepPropertyDetails() {
    return (
      <div className="space-y-5 animate-fade-up">
        <div className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex items-center gap-2.5 mb-5">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-red-50 text-red-600 font-bold text-xs">2</span>
            <div>
              <h2 className="text-sm font-extrabold text-gray-900 sm:text-base">Property Information &amp; Purpose</h2>
              <p className="text-xs text-gray-400">Target property details for valuation certificate</p>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-xs font-bold text-gray-700">Property Owner Name</label>
              <input
                type="text"
                value={property.ownerName}
                onChange={(e) => setProperty((p) => ({ ...p, ownerName: e.target.value }))}
                className="w-full rounded-xl border border-zinc-200 bg-zinc-50/50 px-3.5 py-2.5 text-xs text-gray-900 focus:border-red-600 focus:bg-white focus:outline-none focus:ring-1 focus:ring-red-600"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-bold text-gray-700">Property ID (PIN)</label>
              <input
                type="text"
                value={property.propertyId}
                onChange={(e) => setProperty((p) => ({ ...p, propertyId: e.target.value }))}
                placeholder="e.g. PROP-2026-00003"
                className="w-full rounded-xl border border-zinc-200 bg-zinc-50/50 px-3.5 py-2.5 text-xs text-gray-900 focus:border-red-600 focus:bg-white focus:outline-none focus:ring-1 focus:ring-red-600"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-bold text-gray-700">Tax Declaration Number</label>
              <input
                type="text"
                value={property.taxDeclarationNumber}
                onChange={(e) => setProperty((p) => ({ ...p, taxDeclarationNumber: e.target.value }))}
                placeholder="e.g. TD-2026-00345"
                className="w-full rounded-xl border border-zinc-200 bg-zinc-50/50 px-3.5 py-2.5 text-xs text-gray-900 focus:border-red-600 focus:bg-white focus:outline-none focus:ring-1 focus:ring-red-600"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-bold text-gray-700">Property Type</label>
              <select
                value={property.propertyType}
                onChange={(e) => setProperty((p) => ({ ...p, propertyType: e.target.value }))}
                className="w-full rounded-xl border border-zinc-200 bg-zinc-50/50 px-3.5 py-2.5 text-xs text-gray-900 focus:border-red-600 focus:bg-white focus:outline-none focus:ring-1 focus:ring-red-600"
              >
                {PROPERTY_TYPES.map((t) => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-bold text-gray-700">Property Barangay</label>
              <select
                value={property.barangay}
                onChange={(e) => setProperty((p) => ({ ...p, barangay: e.target.value }))}
                className="w-full rounded-xl border border-zinc-200 bg-zinc-50/50 px-3.5 py-2.5 text-xs text-gray-900 focus:border-red-600 focus:bg-white focus:outline-none focus:ring-1 focus:ring-red-600"
              >
                {["Poblacion", "Casisang", "Sumpong", "Kalasungay", "Bangcud", "Aglayan", "Other"].map((b) => <option key={b}>{b}</option>)}
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-xs font-bold text-gray-700">Purpose of Certification</label>
              <select
                value={property.purpose}
                onChange={(e) => setProperty((p) => ({ ...p, purpose: e.target.value }))}
                className="w-full rounded-xl border border-zinc-200 bg-zinc-50/50 px-3.5 py-2.5 text-xs text-gray-900 focus:border-red-600 focus:bg-white focus:outline-none focus:ring-1 focus:ring-red-600"
              >
                {PURPOSE_OPTIONS.map((p) => <option key={p}>{p}</option>)}
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-xs font-bold text-gray-700">Property Address</label>
              <input
                type="text"
                value={property.propertyAddress}
                onChange={(e) => setProperty((p) => ({ ...p, propertyAddress: e.target.value }))}
                className="w-full rounded-xl border border-zinc-200 bg-zinc-50/50 px-3.5 py-2.5 text-xs text-gray-900 focus:border-red-600 focus:bg-white focus:outline-none focus:ring-1 focus:ring-red-600"
              />
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
              <p className="text-xs text-gray-400">Attachments for assessed value certification</p>
            </div>
          </div>
          <div className="space-y-3">
            <UploadBox label="Valid Government ID of Requester" file={idFile} onUpload={() => setIdFile({ name: "passport_pedro.jpg", type: "image/jpeg", size: "1.2 MB", uploaded: true })} onRemove={() => setIdFile({ name: "", uploaded: false })} required />
            <UploadBox label="Existing Tax Declaration (if available)" file={tdFile} onUpload={() => setTdFile({ name: "td_pedro_commercial.pdf", type: "application/pdf", size: "1.7 MB", uploaded: true })} onRemove={() => setTdFile({ name: "", uploaded: false })} />
            <UploadBox label="Proof of Ownership (TCT / Deed of Sale)" file={ownershipFile} onUpload={() => setOwnershipFile({ name: "tct_commercial_pedro.pdf", type: "application/pdf", size: "2.3 MB", uploaded: true })} onRemove={() => setOwnershipFile({ name: "", uploaded: false })} required />
            <UploadBox label="Authorization Letter (if applicable)" file={authFile} onUpload={() => setAuthFile({ name: "auth_letter.pdf", type: "application/pdf", size: "0.5 MB", uploaded: true })} onRemove={() => setAuthFile({ name: "", uploaded: false })} />
          </div>
        </div>
        <NavButtons onBack={back} onNext={next} disabled={!idFile.uploaded || !ownershipFile.uploaded} />
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
              <p className="text-xs text-gray-400">Consistency scan &amp; assessed value extraction</p>
            </div>
          </div>

          {aiChecks.length === 0 && !aiScanning ? (
            <div className="flex flex-col items-center gap-3 py-8 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-600">
                <Sparkles size={28} />
              </div>
              <p className="text-sm font-bold text-gray-800">Ready to validate assessed value request</p>
              <p className="max-w-xs text-xs text-gray-500">AI will perform OCR to extract property valuation, cross-verify owner and PIN, and confirm document integrity.</p>
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
                  <div className="flex justify-between text-xs font-bold mb-1.5"><span>Scanning Documents &amp; Valuation Records…</span><span>{aiProgress}%</span></div>
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

              {ready && ocrData && (
                <div className="mt-4 rounded-2xl border border-zinc-200 bg-zinc-50 p-4 text-xs space-y-2">
                  <p className="font-extrabold uppercase tracking-wider text-red-600 text-[10px]">🤖 OCR Extracted Valuation Details</p>
                  <SummaryRow label="Owner Name" value={ocrData.owner} />
                  <SummaryRow label="Property ID" value={ocrData.propertyId} />
                  <SummaryRow label="Tax Dec. Number" value={ocrData.taxDeclarationNumber} />
                  <SummaryRow label="Location" value={ocrData.propertyAddress} />
                  <SummaryRow label="Classification" value={ocrData.classification} />
                  <SummaryRow label="Assessed Valuation" value={ocrData.assessedValue} />
                </div>
              )}

              {ready && (
                <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-xs sm:text-sm text-gray-900">AI Recommendation</span>
                    <span className="rounded-full bg-emerald-600 px-2.5 py-0.5 text-[10px] font-extrabold text-white">
                      READY FOR ASSESSOR REVIEW
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

  function StepPropertyCheck() {
    return (
      <div className="space-y-5 animate-fade-up">
        <div className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex items-center gap-2.5 mb-5">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-red-50 text-red-600 font-bold text-xs">5</span>
            <div>
              <h2 className="text-sm font-extrabold text-gray-900 sm:text-base">Mock Property Record Verification</h2>
              <p className="text-xs text-gray-400">Match against City Assessor cadastral database</p>
            </div>
          </div>

          <div className="rounded-2xl border border-zinc-100 bg-zinc-50 p-4 text-xs mb-5 space-y-2">
            <p className="font-extrabold text-gray-700 uppercase tracking-wider text-[10px] mb-2">Submitted Request Details</p>
            <SummaryRow label="Property Owner" value={property.ownerName} />
            <SummaryRow label="Property PIN" value={property.propertyId} />
            <SummaryRow label="Tax Dec. Number" value={property.taxDeclarationNumber} />
            <SummaryRow label="Purpose" value={property.purpose} />
          </div>

          {matchedRecord === null && !isCheckingProperty && (
            <button
              type="button"
              onClick={runPropertyCheck}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-red-600 py-3.5 text-xs sm:text-sm font-bold text-white shadow-sm hover:bg-red-700 active:scale-[0.98]"
            >
              <ShieldCheck size={16} /> Verify Against Assessor Records
            </button>
          )}

          {isCheckingProperty && (
            <div className="flex flex-col items-center gap-3 py-6 text-center">
              <RefreshCw size={24} className="animate-spin text-red-600" />
              <p className="text-xs sm:text-sm font-bold text-gray-700">Checking valuation records in cadastral database…</p>
            </div>
          )}

          {!isCheckingProperty && matchedRecord && typeof matchedRecord === "object" && (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 space-y-2 text-xs">
              <div className="flex items-center gap-2 font-extrabold text-emerald-800 mb-3">
                <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
                <span>Property Record Found &amp; Assessed Value Verified</span>
              </div>
              <SummaryRow label="Registered Owner" value={matchedRecord.owner} />
              <SummaryRow label="Tax Dec. No." value={matchedRecord.taxDeclarationNumber} />
              <SummaryRow label="Classification" value={matchedRecord.classification} />
              <SummaryRow label="Assessed Value" value={matchedRecord.assessedValue} />
              <SummaryRow label="Market Value" value={matchedRecord.marketValue} />
              <SummaryRow label="Status" value={matchedRecord.status} />
            </div>
          )}

          {!isCheckingProperty && matchedRecord === false && (
            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-xs">
              <div className="flex items-center gap-2 font-extrabold text-amber-800 mb-2">
                <AlertCircle size={18} className="text-amber-600 shrink-0" />
                <span>Property Record Not Found</span>
              </div>
              <p className="text-amber-700">Property could not be matched automatically. Forwarded to Assessor appraiser for manual archive validation.</p>
            </div>
          )}
        </div>
        <NavButtons onBack={back} onNext={next} disabled={isCheckingProperty || matchedRecord === null} />
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

          <SummaryRow label="Service" value="Certification of Assessed Value" />
          <SummaryRow label="Requester Name" value={requester.fullName} />
          <SummaryRow label="Property Owner" value={property.ownerName} />
          <SummaryRow label="Property Address" value={property.propertyAddress} />
          <SummaryRow label="Property PIN" value={property.propertyId} />
          <SummaryRow label="Tax Dec. Number" value={property.taxDeclarationNumber} />
          <SummaryRow label="Purpose" value={property.purpose} />
          <div className="border-t border-zinc-100 pt-2">
            <SummaryRow label="Certification Fee" value="₱150.00 (Prototype)" />
          </div>
          <div className={`rounded-xl border px-3.5 py-2.5 text-xs font-bold ${matchedRecord && typeof matchedRecord === "object" ? "border-emerald-200 bg-emerald-50 text-emerald-800" : "border-amber-200 bg-amber-50 text-amber-800"}`}>
            Property Record: {matchedRecord && typeof matchedRecord === "object" ? "VERIFIED (ACTIVE VALUATION)" : "REQUIRES ASSESSOR REVIEW"}
          </div>
        </div>
        <NavButtons onBack={back} onNext={handleSubmit} nextLabel="Submit Assessed Value Request" />
      </div>
    );
  }

  function StepTracking() {
    const trackSteps = [
      { label: "Request Submitted", done: true },
      { label: "AI Validation", done: true },
      { label: "Property Record Verification", done: true },
      { label: "Assessor Verification", done: false, active: true },
      { label: "Certification Approved", done: false },
      { label: "Certificate Ready", done: false },
    ];

    return (
      <div className="space-y-5 animate-fade-up">
        <div className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm sm:p-6">
          <h2 className="text-sm font-extrabold text-gray-900 mb-1">Assessed Value Certification Tracking</h2>
          <p className="font-mono text-xs text-red-600 mb-4">{generatedReqId}</p>

          <div className="mb-5 rounded-2xl border border-blue-200 bg-blue-50/60 p-4 text-xs">
            <p className="font-extrabold text-gray-900 text-xs sm:text-sm">Status: Assessor Verification</p>
            <p className="mt-1 text-gray-600">Your valuation request has been queued for official certification and appraisal verification by the City Assessor.</p>
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
          View Sample Certification <ArrowRight size={16} />
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
          <p className="text-base sm:text-lg font-extrabold text-gray-900">Certification of Assessed Value Ready</p>
          <p className="text-xs text-gray-500 mt-1">Official valuation certificate issued by the City Assessor's Office.</p>
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
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Office of the City Assessor</p>
              <p className="mt-2 text-xs font-extrabold uppercase tracking-[0.2em] text-red-700">Certification of Assessed Value</p>
              <p className="font-mono text-xs font-bold text-gray-700 mt-1">{issuedCertNo}</p>
            </div>

            <div className="space-y-2 text-xs">
              <SummaryRow label="Property Identification No. (PIN)" value={property.propertyId} />
              <SummaryRow label="Tax Declaration Number" value={property.taxDeclarationNumber} />
              <SummaryRow label="Property Owner" value={property.ownerName} />
              <SummaryRow label="Property Address" value={property.propertyAddress} />
              <SummaryRow label="Property Classification" value={matchedRecord?.classification || "Commercial (Class A)"} />
              <SummaryRow label="Official Assessed Value" value={matchedRecord?.assessedValue || "₱1,250,000.00"} />
              <SummaryRow label="Fair Market Value" value={matchedRecord?.marketValue || "₱6,250,000.00"} />
              <SummaryRow label="Purpose" value={property.purpose} />
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
            onClick={() => setNotificationToast("Certification viewed.")}
            className="flex h-11 items-center justify-center gap-1.5 rounded-2xl border border-zinc-200 bg-white py-2.5 text-xs font-bold text-gray-700 hover:bg-zinc-50 active:scale-95"
          >
            <Eye size={14} /> View Document
          </button>
          <button
            type="button"
            onClick={() => setNotificationToast("Sample certification downloaded.")}
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
            <h3 className="text-sm font-extrabold text-gray-900">QR Valuation Verification</h3>
            <button onClick={() => setShowQRModal(false)} className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-100"><X size={16} /></button>
          </div>
          <div className="flex h-36 w-36 mx-auto items-center justify-center rounded-2xl bg-zinc-100 mb-4">
            <QrCode size={64} className="text-zinc-400" />
          </div>
          <div className="space-y-2 text-xs border-t border-zinc-100 pt-4">
            <SummaryRow label="Document" value="Certification of Assessed Value" />
            <SummaryRow label="Certificate No." value={issuedCertNo} />
            <SummaryRow label="Property PIN" value={property.propertyId} />
            <SummaryRow label="Tax Dec. No." value={property.taxDeclarationNumber} />
            <SummaryRow label="Owner" value={property.ownerName} />
            <SummaryRow label="Assessed Value" value={matchedRecord?.assessedValue || "₱1,250,000.00"} />
            <SummaryRow label="Request ID" value={generatedReqId} />
          </div>
          <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 py-2 text-center">
            <span className="text-xs font-extrabold text-emerald-700">VALID — Assessor Certified</span>
          </div>
          <p className="mt-3 text-center text-[10px] text-zinc-400 uppercase tracking-wider">SAMPLE – NOT AN OFFICIAL GOVERNMENT DOCUMENT</p>
        </div>
      </div>
    );
  }

  const stepComponents = [
    <StepStart />, <StepRequesterInfo />, <StepPropertyDetails />, <StepUploadDocs />,
    <StepAIValidation />, <StepPropertyCheck />, <StepSummary />, <StepTracking />, <StepCertReady />,
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
          Assessor's Portal
        </span>
      </div>

      {/* Header Banner matching LCRO */}
      <div className="mt-4 flex items-center gap-3.5 rounded-3xl border border-zinc-200 bg-white p-4 shadow-sm sm:p-5 animate-fade-up">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-red-600 text-white shadow-md">
          <Building size={22} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-red-600">
            City Assessor's Office
          </p>
          <h1 className="text-lg font-extrabold leading-tight text-gray-900 sm:text-xl">
            Certification of Assessed Value
          </h1>
          <p className="mt-0.5 text-xs text-gray-500">
            Official valuation certificate for loans &amp; property transactions
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
