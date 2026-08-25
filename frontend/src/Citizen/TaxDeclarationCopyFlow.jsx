// src/Citizen/TaxDeclarationCopyFlow.jsx
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
  Home,
  MapPin,
} from "lucide-react";
import { saveAssessorRequest, findMockPropertyRecord } from "../services/assessorData";

const STEPS = [
  "Start Application",
  "Requester Info",
  "Property Details",
  "Upload Requirements",
  "AI Validation & OCR",
  "Property Check",
  "Request Summary",
  "Tracking",
  "Certified Copy Ready",
];

const PROPERTY_TYPES = ["Residential", "Commercial", "Agricultural", "Industrial", "Special"];

export default function TaxDeclarationCopyFlow({ office, cert }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [testMode, setTestMode] = useState("normal"); // "normal" | "missing_ownership"

  const [requester, setRequester] = useState({
    fullName: "Juan Dela Cruz",
    dob: "1980-05-12",
    address: "Purok 2, Fortich Street, Poblacion, Malaybalay City",
    barangay: "Poblacion",
    contactNumber: "0917-889-2233",
    email: "juan.delacruz@gmail.com",
  });

  const [property, setProperty] = useState({
    ownerName: "Juan Dela Cruz",
    propertyAddress: "Purok 2, Fortich Street, Poblacion, Malaybalay City",
    barangay: "Poblacion",
    propertyId: "PROP-2026-00001",
    taxDeclarationNumber: "TD-2026-00125",
    lotNumber: "Lot 104-B",
    surveyNumber: "Cad-342",
    propertyType: "Residential",
  });

  const [idFile, setIdFile] = useState({ name: "driver_license_delacruz.jpg", type: "image/jpeg", size: "1.2 MB", uploaded: true });
  const [prevTdFile, setPrevTdFile] = useState({ name: "tax_dec_2024_delacruz.pdf", type: "application/pdf", size: "1.8 MB", uploaded: true });
  const [ownershipFile, setOwnershipFile] = useState({
    name: testMode === "missing_ownership" ? "" : "tct_t10928_delacruz.pdf",
    type: "application/pdf",
    size: "2.1 MB",
    uploaded: testMode !== "missing_ownership",
  });
  const [authLetterFile, setAuthLetterFile] = useState({ name: "", uploaded: false });
  const [supportDocFile, setSupportDocFile] = useState({ name: "", uploaded: false });

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
    { label: "Required fields completed", passed: true },
    { label: "Valid Government ID uploaded", passed: true },
    { label: "Document readability & integrity", passed: true },
    { label: "Tax Declaration Number format (TD-2026-XXXXX)", passed: true },
    { label: "Property Identification Number (PROP-2026-XXXXX)", passed: true },
    { label: "Property owner name consistency", passed: true },
    { label: "Property address consistency", passed: true },
    { label: "Possible duplicate request", passed: true },
    { label: "Proof of ownership / supporting doc", passed: testMode !== "missing_ownership" },
  ];

  const aiStatus = testMode === "normal" ? "READY FOR ASSESSOR REVIEW" : "REQUIRES CORRECTION";

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
          taxDeclarationNumber: property.taxDeclarationNumber,
          propertyId: property.propertyId,
          propertyAddress: property.propertyAddress,
          lotNumber: property.lotNumber,
          classification: "Residential (Class A)",
          assessedValue: "₱500,000.00",
        });
      }
    }, 280);
  }

  function runPropertyCheck() {
    setIsCheckingProperty(true);
    setTimeout(() => {
      const found = findMockPropertyRecord({
        propertyId: property.propertyId,
        taxDeclarationNumber: property.taxDeclarationNumber,
        owner: property.ownerName,
      });
      setMatchedRecord(found || false);
      setIsCheckingProperty(false);
    }, 1800);
  }

  function handleSubmit() {
    const reqId = `ACORS-ASSESSOR-2026-${String(Math.floor(10000 + Math.random() * 90000)).padStart(6, "0")}`;
    const certNo = `TD-CERT-2026-${property.taxDeclarationNumber.replace("TD-", "")}`;
    const now = new Date().toLocaleString("en-US", {
      month: "long", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit",
    });
    setGeneratedReqId(reqId);
    setIssuedCertNo(certNo);
    setSubmittedTime(now);

    saveAssessorRequest({
      id: reqId,
      certificateType: "Certified Copy of Tax Declaration",
      submittedAt: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      status: testMode === "normal" ? "Ready for Assessor Verification" : "Requires Correction",
      requester: { ...requester },
      property: {
        ...property,
        classification: matchedRecord?.classification || "Residential (Class A)",
        assessedValue: matchedRecord?.assessedValue || "₱500,000.00",
      },
      aiValidation: {
        status: aiStatus,
        confidence: "96%",
        checks: aiChecksDef,
        ocrExtracted: {
          owner: property.ownerName,
          taxDeclarationNumber: property.taxDeclarationNumber,
          propertyId: property.propertyId,
          propertyAddress: property.propertyAddress,
          lotNumber: property.lotNumber,
          classification: "Residential",
          assessedValue: "₱500,000.00",
        },
        recommendation: testMode === "normal"
          ? "Tax declaration record validated with cadastral database. Complete ownership documentation attached."
          : "Proof of ownership document is missing. Requester must upload Transfer Certificate of Title or Deed of Sale.",
      },
      propertyRecordCheck: matchedRecord && typeof matchedRecord === "object"
        ? { status: "MATCHED", propertyId: matchedRecord.propertyId, taxDeclarationNumber: matchedRecord.taxDeclarationNumber, message: "Property Record Found & Tax Declaration Matched (Active Assessment)." }
        : { status: "UNMATCHED", message: "Property record not automatically matched. Forwarded to assessor officer for ledger lookup." },
      payment: {
        status: "Paid",
        referenceNumber: "ACORS-PAY-20260825-010",
        amount: "₱150.00",
        method: "GCash",
      },
      verificationStatus: testMode === "normal" ? "Pending Assessor Staff Verification" : "Awaiting Document Correction",
      correctionNote: testMode === "missing_ownership" ? "Proof of Ownership (Transfer Certificate of Title or Deed of Absolute Sale) is missing. Please upload a clear copy." : undefined,
      certificateNumber: certNo,
      issueDate: new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
      documents: [
        { name: "Valid Government ID", fileName: idFile.name, verified: idFile.uploaded },
        { name: "Previous Tax Declaration", fileName: prevTdFile.name, verified: prevTdFile.uploaded },
        { name: "Proof of Ownership", fileName: ownershipFile.name, verified: ownershipFile.uploaded, missing: !ownershipFile.uploaded },
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
            Certified Copy of Tax Declaration Guidelines
          </h2>
          <p className="mt-1.5 text-xs leading-relaxed text-gray-500 sm:text-sm">
            Request an official certified true copy of a real property's tax declaration from the City Assessor's Office of Malaybalay City.
          </p>

          <div className="mt-5 grid grid-cols-2 gap-3 text-xs">
            <div className="rounded-2xl border border-zinc-100 bg-zinc-50/80 p-3.5">
              <span className="font-bold text-gray-800">Processing Fee</span>
              <p className="mt-1 font-mono text-base font-extrabold text-emerald-600">₱150.00</p>
              <p className="text-[11px] text-gray-400">Prototype Assessment Fee</p>
            </div>
            <div className="rounded-2xl border border-zinc-100 bg-zinc-50/80 p-3.5">
              <span className="font-bold text-gray-800">Turnaround</span>
              <p className="mt-1 font-mono text-base font-extrabold text-gray-900">1 Working Day</p>
              <p className="text-[11px] text-gray-400">Cadastral verification</p>
            </div>
          </div>

          <div className="mt-5 rounded-2xl bg-zinc-50 p-4">
            <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-gray-500 mb-3">Required Documents</p>
            {[
              "Valid Government ID of Requester",
              "Copy of Previous Tax Declaration (if available)",
              "Proof of Ownership (Transfer Certificate of Title / Deed of Sale)",
              "Authorization Letter / Special Power of Attorney (if representative)",
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
              IMPORTANT: The AI does NOT verify legal ownership or make final appraisal decisions. AI checks application completeness only. Final verification is performed by authorized Assessor personnel.
            </span>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-2.5">
            <span className="text-xs font-bold text-gray-500">Test Simulation:</span>
            {[
              { key: "normal", label: "Record Matched (Pass)" },
              { key: "missing_ownership", label: "Missing Title / Proof (Correction)" },
            ].map((m) => (
              <button
                key={m.key}
                type="button"
                onClick={() => {
                  setTestMode(m.key);
                  if (m.key === "missing_ownership") {
                    setOwnershipFile({ name: "", uploaded: false });
                  } else {
                    setOwnershipFile({ name: "tct_t10928_delacruz.pdf", type: "application/pdf", size: "2.1 MB", uploaded: true });
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

  function StepRequesterInfo() {
    return (
      <div className="space-y-5 animate-fade-up">
        <div className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex items-center gap-2.5 mb-5">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-red-50 text-red-600 font-bold text-xs">1</span>
            <div>
              <h2 className="text-sm font-extrabold text-gray-900 sm:text-base">Requester Information</h2>
              <p className="text-xs text-gray-400">Applicant identity and contact details</p>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-xs font-bold text-gray-700">Full Name</label>
              <input
                type="text"
                value={requester.fullName}
                onChange={(e) => setRequester((p) => ({ ...p, fullName: e.target.value }))}
                className="w-full rounded-xl border border-zinc-200 bg-zinc-50/50 px-3.5 py-2.5 text-xs text-gray-900 focus:border-red-600 focus:bg-white focus:outline-none focus:ring-1 focus:ring-red-600"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-bold text-gray-700">Date of Birth</label>
              <input
                type="date"
                value={requester.dob}
                onChange={(e) => setRequester((p) => ({ ...p, dob: e.target.value }))}
                className="w-full rounded-xl border border-zinc-200 bg-zinc-50/50 px-3.5 py-2.5 text-xs text-gray-900 focus:border-red-600 focus:bg-white focus:outline-none focus:ring-1 focus:ring-red-600"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-bold text-gray-700">Barangay</label>
              <select
                value={requester.barangay}
                onChange={(e) => setRequester((p) => ({ ...p, barangay: e.target.value }))}
                className="w-full rounded-xl border border-zinc-200 bg-zinc-50/50 px-3.5 py-2.5 text-xs text-gray-900 focus:border-red-600 focus:bg-white focus:outline-none focus:ring-1 focus:ring-red-600"
              >
                {["Poblacion", "Casisang", "Sumpong", "Kalasungay", "Bangcud", "Aglayan", "Other"].map((b) => <option key={b}>{b}</option>)}
              </select>
            </div>
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
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-xs font-bold text-gray-700">Complete Address</label>
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
              <h2 className="text-sm font-extrabold text-gray-900 sm:text-base">Property Information</h2>
              <p className="text-xs text-gray-400">Specify property location and tax declaration details</p>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-xs font-bold text-gray-700">Property Owner Name (Declared Owner)</label>
              <input
                type="text"
                value={property.ownerName}
                onChange={(e) => setProperty((p) => ({ ...p, ownerName: e.target.value }))}
                className="w-full rounded-xl border border-zinc-200 bg-zinc-50/50 px-3.5 py-2.5 text-xs text-gray-900 focus:border-red-600 focus:bg-white focus:outline-none focus:ring-1 focus:ring-red-600"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-bold text-gray-700">Tax Declaration Number</label>
              <input
                type="text"
                value={property.taxDeclarationNumber}
                onChange={(e) => setProperty((p) => ({ ...p, taxDeclarationNumber: e.target.value }))}
                placeholder="e.g. TD-2026-00125"
                className="w-full rounded-xl border border-zinc-200 bg-zinc-50/50 px-3.5 py-2.5 text-xs text-gray-900 focus:border-red-600 focus:bg-white focus:outline-none focus:ring-1 focus:ring-red-600"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-bold text-gray-700">Property Identification Number (PIN)</label>
              <input
                type="text"
                value={property.propertyId}
                onChange={(e) => setProperty((p) => ({ ...p, propertyId: e.target.value }))}
                placeholder="e.g. PROP-2026-00001"
                className="w-full rounded-xl border border-zinc-200 bg-zinc-50/50 px-3.5 py-2.5 text-xs text-gray-900 focus:border-red-600 focus:bg-white focus:outline-none focus:ring-1 focus:ring-red-600"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-bold text-gray-700">Lot Number</label>
              <input
                type="text"
                value={property.lotNumber}
                onChange={(e) => setProperty((p) => ({ ...p, lotNumber: e.target.value }))}
                placeholder="e.g. Lot 104-B"
                className="w-full rounded-xl border border-zinc-200 bg-zinc-50/50 px-3.5 py-2.5 text-xs text-gray-900 focus:border-red-600 focus:bg-white focus:outline-none focus:ring-1 focus:ring-red-600"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-bold text-gray-700">Survey Number (Optional)</label>
              <input
                type="text"
                value={property.surveyNumber}
                onChange={(e) => setProperty((p) => ({ ...p, surveyNumber: e.target.value }))}
                placeholder="e.g. Cad-342"
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
              <label className="mb-1.5 block text-xs font-bold text-gray-700">Property Address / Location</label>
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

  function StepUploadRequirements() {
    return (
      <div className="space-y-5 animate-fade-up">
        <div className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex items-center gap-2.5 mb-5">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-red-50 text-red-600 font-bold text-xs">3</span>
            <div>
              <h2 className="text-sm font-extrabold text-gray-900 sm:text-base">Upload Document Requirements</h2>
              <p className="text-xs text-gray-400">Attachments for cadastral and tax mapping verification</p>
            </div>
          </div>
          <div className="space-y-3">
            <UploadBox label="Valid Government ID of Requester" file={idFile} onUpload={() => setIdFile({ name: "driver_license_delacruz.jpg", type: "image/jpeg", size: "1.2 MB", uploaded: true })} onRemove={() => setIdFile({ name: "", uploaded: false })} required />
            <UploadBox label="Previous Tax Declaration (if available)" file={prevTdFile} onUpload={() => setPrevTdFile({ name: "tax_dec_2024_delacruz.pdf", type: "application/pdf", size: "1.8 MB", uploaded: true })} onRemove={() => setPrevTdFile({ name: "", uploaded: false })} />
            <UploadBox label="Proof of Ownership (Transfer Certificate of Title / Deed of Sale)" file={ownershipFile} onUpload={() => setOwnershipFile({ name: "tct_t10928_delacruz.pdf", type: "application/pdf", size: "2.1 MB", uploaded: true })} onRemove={() => setOwnershipFile({ name: "", uploaded: false })} required />
            <UploadBox label="Authorization Letter / SPA (if requesting on behalf of owner)" file={authLetterFile} onUpload={() => setAuthLetterFile({ name: "authorization_spa.pdf", type: "application/pdf", size: "0.8 MB", uploaded: true })} onRemove={() => setAuthLetterFile({ name: "", uploaded: false })} />
            <UploadBox label="Other Supporting Document (Optional)" file={supportDocFile} onUpload={() => setSupportDocFile({ name: "realty_tax_receipt.pdf", type: "application/pdf", size: "0.6 MB", uploaded: true })} onRemove={() => setSupportDocFile({ name: "", uploaded: false })} />
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
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-red-50 text-red-600 font-bold text-xs">4</span>
            <div>
              <h2 className="text-sm font-extrabold text-gray-900 sm:text-base">AI Document Validation &amp; OCR</h2>
              <p className="text-xs text-gray-400">Automated pre-screening &amp; property data extraction</p>
            </div>
          </div>

          {aiChecks.length === 0 && !aiScanning ? (
            <div className="flex flex-col items-center gap-3 py-8 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-600">
                <Sparkles size={28} />
              </div>
              <p className="text-sm font-bold text-gray-800">Ready to validate tax declaration request</p>
              <p className="max-w-xs text-xs text-gray-500">AI will perform simulated OCR to extract property details, cross-check Tax Declaration and PIN numbers, and verify ownership documents.</p>
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
                  <div className="flex justify-between text-xs font-bold mb-1.5"><span>Scanning Property Records &amp; Running OCR…</span><span>{aiProgress}%</span></div>
                  <div className="h-2 rounded-full bg-zinc-100 overflow-hidden"><div className="h-full rounded-full bg-red-600 transition-all duration-300" style={{ width: `${aiProgress}%` }} /></div>
                </div>
              )}
              <div className="space-y-2">
                {aiChecks.map((c, i) => (
                  <div key={i} className="flex items-center justify-between rounded-xl border border-zinc-100 bg-zinc-50/60 px-3.5 py-2 text-xs">
                    <span className="text-gray-700">{c.label}</span>
                    <span className={`flex items-center gap-1 font-bold ${c.passed ? "text-emerald-700" : "text-amber-700"}`}>
                      {c.passed ? <Check size={13} /> : <AlertCircle size={13} />}
                      {c.passed ? "Passed" : "Missing / Variance"}
                    </span>
                  </div>
                ))}
              </div>

              {ready && ocrData && (
                <div className="mt-4 rounded-2xl border border-zinc-200 bg-zinc-50 p-4 text-xs space-y-2">
                  <p className="font-extrabold uppercase tracking-wider text-red-600 text-[10px]">🤖 OCR Extracted Property Information</p>
                  <SummaryRow label="Declared Owner" value={ocrData.owner} />
                  <SummaryRow label="Tax Dec. Number" value={ocrData.taxDeclarationNumber} />
                  <SummaryRow label="Property ID (PIN)" value={ocrData.propertyId} />
                  <SummaryRow label="Location" value={ocrData.propertyAddress} />
                  <SummaryRow label="Lot Number" value={ocrData.lotNumber} />
                  <SummaryRow label="Classification" value={ocrData.classification} />
                  <SummaryRow label="Assessed Value" value={ocrData.assessedValue} />
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
                  <p className="mt-1.5 text-xs text-gray-600">AI Confidence: <span className="font-bold">{testMode === "normal" ? "96%" : "80%"}</span></p>
                  <p className="mt-2 text-[11px] text-gray-500 italic border-t border-zinc-200/60 pt-2">
                    IMPORTANT: The AI does not verify legal ownership or make appraisal decisions. Official certification is issued by Assessor's Office personnel.
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
            <SummaryRow label="Tax Declaration No." value={property.taxDeclarationNumber} />
            <SummaryRow label="Property PIN" value={property.propertyId} />
            <SummaryRow label="Lot Number" value={property.lotNumber} />
            <SummaryRow label="Property Type" value={property.propertyType} />
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
              <p className="text-xs sm:text-sm font-bold text-gray-700">Checking cadastral &amp; assessment database…</p>
            </div>
          )}

          {!isCheckingProperty && matchedRecord && typeof matchedRecord === "object" && (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 space-y-2 text-xs">
              <div className="flex items-center gap-2 font-extrabold text-emerald-800 mb-3">
                <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
                <span>Property Record Found &amp; Tax Declaration Matched</span>
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
              <p className="text-amber-700">Property could not be matched automatically in the digital cadastral index. Application forwarded to Assessor staff for manual archive search.</p>
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

          <SummaryRow label="Service" value="Certified Copy of Tax Declaration" />
          <SummaryRow label="Requester Name" value={requester.fullName} />
          <SummaryRow label="Property Owner" value={property.ownerName} />
          <SummaryRow label="Property Address" value={property.propertyAddress} />
          <SummaryRow label="Tax Dec. Number" value={property.taxDeclarationNumber} />
          <SummaryRow label="Property PIN" value={property.propertyId} />
          <SummaryRow label="Lot Number" value={property.lotNumber} />
          <SummaryRow label="Property Type" value={property.propertyType} />
          <div className="border-t border-zinc-100 pt-2">
            <SummaryRow label="Certification Fee" value="₱150.00 (Prototype)" />
          </div>
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-3.5 py-2.5 text-xs font-bold text-emerald-800">
            Property Check: {matchedRecord && typeof matchedRecord === "object" ? "MATCHED (ACTIVE RECORD)" : "REQUIRES ASSESSOR REVIEW"}
          </div>
        </div>
        <NavButtons onBack={back} onNext={handleSubmit} nextLabel="Submit Tax Declaration Request" />
      </div>
    );
  }

  function StepTracking() {
    const isCorrection = testMode === "missing_ownership";
    const trackSteps = [
      { label: "Application Submitted", done: true },
      { label: "AI Document Validation", done: true },
      { label: "Property Record Check", done: true },
      { label: "Assessor Verification", done: !isCorrection, active: !isCorrection },
      { label: isCorrection ? "Requires Correction" : "Request Approved", done: false, active: isCorrection },
      { label: "Certified Copy Ready", done: false },
    ];

    return (
      <div className="space-y-5 animate-fade-up">
        <div className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm sm:p-6">
          <h2 className="text-sm font-extrabold text-gray-900 mb-1">Tax Declaration Request Tracking</h2>
          <p className="font-mono text-xs text-red-600 mb-4">{generatedReqId}</p>

          <div className={`mb-5 rounded-2xl border p-4 text-xs ${isCorrection ? "border-amber-200 bg-amber-50" : "border-blue-200 bg-blue-50/60"}`}>
            <p className="font-extrabold text-gray-900 text-xs sm:text-sm">
              Status: {isCorrection ? "Requires Correction" : "Assessor Verification in Progress"}
            </p>
            <p className="mt-1 text-gray-600">
              {isCorrection
                ? "Proof of Ownership (Transfer Certificate of Title or Deed of Sale) is missing. Please upload the required title document below to proceed."
                : "Your tax declaration record and cadastral coordinates have been verified. Assessor staff are sealing your certified true copy."}
            </p>

            {isCorrection && (
              <div className="mt-4 pt-3 border-t border-amber-200/60">
                <button
                  type="button"
                  onClick={() => {
                    setOwnershipFile({ name: "tct_t10928_delacruz.pdf", type: "application/pdf", size: "2.1 MB", uploaded: true });
                    setTestMode("normal");
                    setNotificationToast("Ownership title uploaded. Revalidation completed.");
                  }}
                  className="flex items-center gap-1.5 rounded-xl bg-amber-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-amber-700"
                >
                  <Upload size={14} /> Upload Missing Ownership Proof
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
          View Sample Certified Copy <ArrowRight size={16} />
        </button>
      </div>
    );
  }

  function StepDocumentReady() {
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
          <p className="text-base sm:text-lg font-extrabold text-gray-900">Certified Copy of Tax Declaration Approved</p>
          <p className="text-xs text-gray-500 mt-1">Official certified true copy issued by the City Assessor's Office.</p>
          <p className="font-mono text-xs sm:text-sm font-bold text-emerald-700 mt-2">{issuedCertNo}</p>
        </div>

        {/* Sample Certified Tax Declaration Document */}
        <div className="relative overflow-hidden rounded-3xl border-2 border-zinc-200 bg-white p-5 sm:p-6 shadow-sm">
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
            <span className="text-4xl sm:text-5xl font-extrabold text-zinc-100 rotate-[-30deg] tracking-widest uppercase">SAMPLE COPY</span>
          </div>

          <div className="relative z-10">
            {/* Header */}
            <div className="text-center border-b border-zinc-200 pb-4 mb-4">
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Republic of the Philippines · City of Malaybalay, Bukidnon</p>
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Office of the City Assessor</p>
              <p className="mt-2 text-xs font-extrabold uppercase tracking-[0.2em] text-red-700">Certified Copy of Tax Declaration of Real Property</p>
              <p className="font-mono text-xs font-bold text-gray-700 mt-1">{issuedCertNo}</p>
            </div>

            <div className="space-y-2 text-xs">
              <SummaryRow label="Tax Declaration No." value={property.taxDeclarationNumber} />
              <SummaryRow label="Property Identification No. (PIN)" value={property.propertyId} />
              <SummaryRow label="Declared Owner" value={property.ownerName} />
              <SummaryRow label="Property Location" value={property.propertyAddress} />
              <SummaryRow label="Property Classification" value={matchedRecord?.classification || "Residential (Class A)"} />
              <SummaryRow label="Lot Number / Survey" value={`${property.lotNumber} · ${property.surveyNumber || "Cad-342"}`} />
              <SummaryRow label="Assessed Value" value={matchedRecord?.assessedValue || "₱500,000.00"} />
              <SummaryRow label="Date Certified" value={new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })} />
              <SummaryRow label="Request ID" value={generatedReqId} />
            </div>

            <div className="mt-5 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-zinc-200 pt-3">
              <button
                type="button"
                onClick={() => setShowQRModal(true)}
                className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-zinc-50 px-3.5 py-2.5 text-xs font-bold text-gray-700 hover:bg-zinc-100 active:scale-95"
              >
                <QrCode size={16} /> View Digital QR
              </button>
              <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest text-center sm:text-right max-w-xs">
                SAMPLE – NOT AN OFFICIAL GOVERNMENT DOCUMENT
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          <button
            type="button"
            onClick={() => setNotificationToast("Tax declaration certified copy viewed.")}
            className="flex h-11 items-center justify-center gap-1.5 rounded-2xl border border-zinc-200 bg-white py-2.5 text-xs font-bold text-gray-700 hover:bg-zinc-50 active:scale-95"
          >
            <Eye size={14} /> View Document
          </button>
          <button
            type="button"
            onClick={() => setNotificationToast("Sample certified copy downloaded.")}
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
            <h3 className="text-sm font-extrabold text-gray-900">QR Tax Declaration Verification</h3>
            <button onClick={() => setShowQRModal(false)} className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-100"><X size={16} /></button>
          </div>
          <div className="flex h-36 w-36 mx-auto items-center justify-center rounded-2xl bg-zinc-100 mb-4">
            <QrCode size={64} className="text-zinc-400" />
          </div>
          <div className="space-y-2 text-xs border-t border-zinc-100 pt-4">
            <SummaryRow label="Document Type" value="Certified Copy of Tax Declaration" />
            <SummaryRow label="Certificate No." value={issuedCertNo} />
            <SummaryRow label="Property PIN" value={property.propertyId} />
            <SummaryRow label="Tax Dec. No." value={property.taxDeclarationNumber} />
            <SummaryRow label="Owner" value={property.ownerName} />
            <SummaryRow label="Assessed Value" value={matchedRecord?.assessedValue || "₱500,000.00"} />
            <SummaryRow label="Date Issued" value={new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })} />
            <SummaryRow label="Request ID" value={generatedReqId} />
          </div>
          <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 py-2 text-center">
            <span className="text-xs font-extrabold text-emerald-700">VALID — Assessor Cadastral Certified</span>
          </div>
          <p className="mt-3 text-center text-[10px] text-zinc-400 uppercase tracking-wider">SAMPLE – NOT AN OFFICIAL GOVERNMENT DOCUMENT</p>
        </div>
      </div>
    );
  }

  const stepComponents = [
    <StepStart />, <StepRequesterInfo />, <StepPropertyDetails />, <StepUploadRequirements />,
    <StepAIValidation />, <StepPropertyCheck />, <StepSummary />, <StepTracking />, <StepDocumentReady />,
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
          <FileText size={22} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-red-600">
            City Assessor's Office
          </p>
          <h1 className="text-lg font-extrabold leading-tight text-gray-900 sm:text-xl">
            Certified Copy of Tax Declaration
          </h1>
          <p className="mt-0.5 text-xs text-gray-500">
            Real property tax declaration certification · Cadastral indexing
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
