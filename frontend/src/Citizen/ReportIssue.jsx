// src/Citizen/ReportIssue.jsx
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Camera,
  ImagePlus,
  LocateFixed,
  Navigation,
  Send,
  Check,
  MapPin,
  Sparkles,
  FileText,
  Building2,
  Zap,
  AlertTriangle,
  Loader,
  Building,
  Layers,
  ShieldCheck,
  ChevronDown,
} from "lucide-react";
import CitizenLayout from "../Layouts/CitizenLayouts";
import { offices } from "../Offices/officeData";
import { uploadToCloudinary } from "../services/cloudinaryApi";
import { callDraftReport } from "../services/reportApi";
import { getMockGPSLocation } from "../services/gps";
import garbageSampleImg from "../assets/garbage-sample.jpg";
import {
  createNewComplaint,
  getRecommendedLguOffice,
} from "../services/complaintsStore";

const departmentOptions = Object.values(offices)
  .filter((office) => office.slug !== "tourism")
  .map((office) => office.name);

const barangayOptions = [
  "Barangay Casisang",
  "Barangay Sumpong",
  "Barangay Kalasungay",
  "Barangay Aglayan",
  "Barangay Bangcud",
  "Barangay Managok",
  "Barangay 1",
  "Barangay 2",
  "Barangay 3",
  "Barangay 4",
];

function normalizeDepartment(value) {
  if (!value) return value;
  const match = Object.values(offices)
    .filter((office) => office.slug !== "tourism")
    .find(
      (office) =>
        office.name.toLowerCase() === value.toLowerCase() ||
        office.shortName.toLowerCase() === value.toLowerCase()
    );
  return match ? match.name : value;
}

const mockSampleResult = {
  title: "Illegal garbage dumping along the roadside",
  description:
    "A pile of mixed household waste dumped along the roadside in Sumpong, Malaybalay City. Nearby residents report a strong odor, and stray animals are scattering the trash. The site needs an immediate cleanup and regular monitoring to prevent repeat dumping.",
  category: "Garbage Accumulation",
  priority: "High",
  severity: "Medium",
  barangay: "Barangay Sumpong",
  confidence: 0.94,
};

export default function ReportIssue() {
  const [step, setStep] = useState(1);
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [aiResult, setAiResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [reportId, setReportId] = useState(null);
  const [gpsLocation, setGpsLocation] = useState(null);
  const [formData, setFormData] = useState({});
  const [isMockSample, setIsMockSample] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const handlePhotoSelect = (file) => {
    setPhotoFile(file);
    const reader = new FileReader();
    reader.onload = (e) => setPhotoPreview(e.target.result);
    reader.readAsDataURL(file);
  };

  const handleUseMockSample = () => {
    setIsMockSample(true);
    fetch(garbageSampleImg)
      .then((res) => res.blob())
      .then((blob) => {
        const file = new File([blob], "garbage-sample.jpg", {
          type: "image/jpeg",
        });
        handlePhotoSelect(file);
      });
  };

  const handlePhotoNext = async () => {
    if (!photoFile) return;

    setIsLoading(true);
    try {
      const location = getMockGPSLocation();
      setGpsLocation(location);

      if (isMockSample) {
        await new Promise((resolve) => setTimeout(resolve, 1200));

        const suggestedLgu = getRecommendedLguOffice(mockSampleResult.category);

        const formattedAiResult = {
          photoUrl: garbageSampleImg,
          title: mockSampleResult.title,
          description: mockSampleResult.description,
          category: mockSampleResult.category,
          priority: mockSampleResult.priority,
          severity: mockSampleResult.severity || "Medium",
          barangay: mockSampleResult.barangay || "Barangay Sumpong",
          suggestedLguOffice: suggestedLgu,
          aiRecommendation: "Send to Barangay for initial assessment.",
          confidence: mockSampleResult.confidence,
          location: `${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}`,
        };

        setAiResult(formattedAiResult);
        setFormData({
          title: formattedAiResult.title,
          description: formattedAiResult.description,
          category: formattedAiResult.category,
          priority: formattedAiResult.priority,
          severity: formattedAiResult.severity,
          barangay: formattedAiResult.barangay,
          department: suggestedLgu,
        });
        setStep(2);
        return;
      }

      const uploadResult = await uploadToCloudinary(photoFile);
      if (!uploadResult.success) {
        // Fallback to local preview if cloudinary fails
        console.warn("Cloudinary upload failed, using local preview:", uploadResult.error);
      }

      const photoUrl = uploadResult.success ? uploadResult.url : photoPreview;
      let detectedCategory = "Road Damage";
      let suggestedTitle = "Community Concern Reported";
      let description = "Resident submitted an issue requiring municipal response.";
      let detectedBarangay = "Barangay Casisang";

      try {
        const aiResponse = await callDraftReport(
          photoUrl,
          location.latitude,
          location.longitude
        );
        if (aiResponse.success) {
          detectedCategory = aiResponse.data.category || "Road Damage";
          suggestedTitle = aiResponse.data.suggested_title || suggestedTitle;
          description = aiResponse.data.description || description;
        }
      } catch (e) {
        console.warn("AI draft API fallback:", e);
      }

      const suggestedLgu = getRecommendedLguOffice(detectedCategory);

      const formattedAiResult = {
        photoUrl,
        title: suggestedTitle,
        description,
        category: detectedCategory,
        priority: "Medium",
        severity: "Medium",
        barangay: detectedBarangay,
        suggestedLguOffice: suggestedLgu,
        aiRecommendation: "Send to Barangay for initial assessment.",
        confidence: 0.93,
        location: `${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}`,
      };

      setAiResult(formattedAiResult);
      setFormData({
        title: formattedAiResult.title,
        description: formattedAiResult.description,
        category: formattedAiResult.category,
        priority: formattedAiResult.priority,
        severity: formattedAiResult.severity,
        barangay: formattedAiResult.barangay,
        department: suggestedLgu,
      });
      setStep(2);
    } catch (error) {
      console.error("Error processing photo:", error);
      alert("An error occurred: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!aiResult || !gpsLocation) return;

    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1200));

      const newComplaint = createNewComplaint({
        title: formData.title || aiResult.title,
        description: formData.description || aiResult.description,
        category: formData.category || aiResult.category,
        priority: formData.priority || "Medium",
        severity: formData.severity || "Medium",
        barangay: formData.barangay || aiResult.barangay || "Barangay Casisang",
        location: `${formData.barangay || "Barangay Casisang"}, Malaybalay City (${gpsLocation.latitude.toFixed(4)}, ${gpsLocation.longitude.toFixed(4)})`,
        coordinates: `${gpsLocation.latitude.toFixed(4)}, ${gpsLocation.longitude.toFixed(4)}`,
        image: aiResult.photoUrl || photoPreview,
        residentName: "Juan Dela Cruz",
        residentContact: "0917-555-0192",
      });

      setReportId(newComplaint.id);
      setStep(3);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <CitizenLayout>
      {isLoading && <LoadingScreen />}

      {/* Mobile View */}
      <div className="lg:hidden">
        {step === 1 && (
          <UploadPhotoStep
            photoFile={photoFile}
            photoPreview={photoPreview}
            onPhotoSelect={handlePhotoSelect}
            onPhotoNext={handlePhotoNext}
            onUseMockSample={handleUseMockSample}
            fileInputRef={fileInputRef}
            onBack={() => navigate("/home")}
            isLoading={isLoading}
          />
        )}

        {step === 2 && (
          <AIReviewStep
            aiResult={aiResult}
            formData={formData}
            setFormData={setFormData}
            onSubmit={handleSubmit}
            onBack={() => setStep(1)}
            isLoading={isLoading}
          />
        )}

        {step === 3 && <ReportSubmitted reportId={reportId} />}
      </div>

      {/* Desktop View */}
      <div className="hidden lg:block">
        <section className="mt-8 grid grid-cols-12 gap-6">
          <aside className="col-span-4 rounded-3xl bg-white p-6 shadow-xs border border-zinc-100">
            <h2 className="text-xl font-extrabold text-gray-900">
              Community Report Flow
            </h2>
            <p className="mt-1 text-xs text-gray-500">
              ACORS automatically routes your report to your local Barangay for initial review.
            </p>

            <div className="mt-6 space-y-4">
              <FlowItem
                number="1"
                title="Upload Evidence"
                desc="Take or upload a picture of the issue."
                active={step === 1}
              />
              <FlowItem
                number="2"
                title="Barangay & AI Review"
                desc="AI detects your Barangay as the 1st level responder."
                active={step === 2}
              />
              <FlowItem
                number="3"
                title="Submit to Barangay"
                desc="Dispatches to Barangay operations console."
                active={step === 3}
              />
            </div>

            <div className="mt-8 rounded-2xl border border-red-200 bg-red-50/70 p-4 text-xs text-zinc-700">
              <p className="font-extrabold text-red-800 flex items-center gap-1.5 mb-1">
                <Layers size={14} className="text-red-700" />
                3-Tier Workflow Architecture
              </p>
              <p className="text-[11px] text-zinc-600 leading-relaxed">
                Resident <span className="font-bold text-red-700">→</span> Barangay (Tier 1) <span className="font-bold text-red-700">→</span> LGU (Tier 2 if escalated).
              </p>
            </div>
          </aside>

          <main className="col-span-8 rounded-3xl bg-white p-6 shadow-xs border border-zinc-100">
            {step === 1 && (
              <UploadPhotoStep
                photoFile={photoFile}
                photoPreview={photoPreview}
                onPhotoSelect={handlePhotoSelect}
                onPhotoNext={handlePhotoNext}
                onUseMockSample={handleUseMockSample}
                fileInputRef={fileInputRef}
                onBack={() => navigate("/home")}
                desktop
                isLoading={isLoading}
              />
            )}

            {step === 2 && (
              <AIReviewStep
                aiResult={aiResult}
                formData={formData}
                setFormData={setFormData}
                onSubmit={handleSubmit}
                onBack={() => setStep(1)}
                desktop
                isLoading={isLoading}
              />
            )}

            {step === 3 && <DesktopSubmitted reportId={reportId} />}
          </main>
        </section>
      </div>
    </CitizenLayout>
  );
}

function UploadPhotoStep({
  photoFile,
  photoPreview,
  onPhotoSelect,
  onPhotoNext,
  onUseMockSample,
  fileInputRef,
  onBack,
  desktop = false,
  isLoading = false,
}) {
  const handleFileInput = (e) => {
    const file = e.target.files?.[0];
    if (file) onPhotoSelect(file);
  };

  return (
    <div>
      <main className={desktop ? "" : "px-5 pt-6"}>
        <h2 className="text-xl font-extrabold text-gray-900">
          Take or upload a picture
        </h2>
        <p className="mt-1 text-xs text-gray-500">
          ACORS AI will analyze the photo, detect your Barangay, and prepare your report.
        </p>

        <div className="mt-5 rounded-3xl border-2 border-dashed border-red-200 bg-red-50/50 p-5 text-center">
          {photoPreview ? (
            <div className="overflow-hidden rounded-2xl">
              <img
                src={photoPreview}
                alt="Selected issue"
                className="h-64 w-full object-cover"
              />
            </div>
          ) : (
            <div className="flex min-h-60 flex-col items-center justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white text-red-600 shadow-sm">
                <ImagePlus size={32} />
              </div>
              <h3 className="mt-4 text-base font-extrabold text-gray-900">
                No photo selected
              </h3>
              <p className="mt-1 text-xs text-gray-500">
                Take a photo or upload from your device.
              </p>
            </div>
          )}

          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isLoading}
              className="flex items-center justify-center gap-2 rounded-2xl bg-red-600 py-3.5 text-xs font-extrabold text-white hover:bg-red-700 active:scale-95 transition disabled:bg-gray-400"
            >
              <Camera size={16} />
              Take a Photo
            </button>

            <button
              type="button"
              onClick={onUseMockSample}
              disabled={isLoading}
              className="flex items-center justify-center gap-2 rounded-2xl bg-white py-3.5 text-xs font-extrabold text-red-600 shadow-xs border border-red-200 hover:bg-red-50 active:scale-95 transition"
            >
              <Sparkles size={16} />
              Use Sample Incident
            </button>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileInput}
            className="hidden"
          />
        </div>

        <button
          onClick={onPhotoNext}
          disabled={!photoFile || isLoading}
          className={`mt-6 flex w-full items-center justify-center gap-2 rounded-2xl py-4 text-xs font-extrabold text-white transition ${
            photoFile && !isLoading
              ? "bg-red-600 hover:bg-red-700 active:scale-98 shadow-md"
              : "bg-gray-300 cursor-not-allowed"
          }`}
        >
          {isLoading ? (
            <>
              <Loader size={16} className="animate-spin" />
              Analyzing with ACORS AI...
            </>
          ) : (
            <>
              Analyze &amp; Detect Barangay
              <Sparkles size={16} />
            </>
          )}
        </button>
      </main>
    </div>
  );
}

function AIReviewStep({
  aiResult,
  formData,
  setFormData,
  onSubmit,
  onBack,
  desktop = false,
  isLoading = false,
}) {
  if (!aiResult) {
    return (
      <div className={desktop ? "" : "px-5 pt-5 text-sm"}>Loading AI analysis...</div>
    );
  }

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const detectedBarangay = formData.barangay || aiResult.barangay || "Barangay Casisang";
  const suggestedLgu = aiResult.suggestedLguOffice || getRecommendedLguOffice(formData.category || aiResult.category);

  return (
    <div>
      <main className={desktop ? "" : "px-5 pt-5 pb-8"}>
        <div className="flex items-center gap-2 mb-4">
          <button
            onClick={onBack}
            className="text-gray-600 hover:text-gray-900 rounded-full p-1 hover:bg-zinc-100"
          >
            <ArrowLeft size={20} />
          </button>
          <h2 className="text-xl font-extrabold text-gray-900">
            Review Report Details
          </h2>
        </div>

        {/* PRIMARY NOTICE: Barangay 1st Level Review */}
        <section className="rounded-2xl border border-red-300 bg-red-600 p-4 mb-5 text-white shadow-sm">
          <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-red-600 font-bold">
              <Building size={16} />
            </div>
            <div>
              <p className="text-sm font-extrabold">
                Your complaint will first be reviewed by your Barangay.
              </p>
              <p className="mt-0.5 text-xs text-red-100 leading-relaxed">
                Detected jurisdiction: <span className="font-bold underline">{detectedBarangay}</span>. The Barangay will assess and resolve the issue or escalate it to the City LGU if specialized heavy equipment is required.
              </p>
            </div>
          </div>
        </section>

        {/* Photo preview */}
        {aiResult.photoUrl && (
          <div className="mb-4 overflow-hidden rounded-2xl border border-zinc-200">
            <img
              src={aiResult.photoUrl}
              alt="Report issue"
              className="h-44 w-full object-cover"
            />
          </div>
        )}

        {/* 🤖 ACORS AI ANALYSIS CARD */}
        <section className="rounded-2xl bg-gradient-to-br from-red-50 via-white to-red-50/50 p-4 mb-5 border border-red-200">
          <div className="flex items-center justify-between border-b border-red-100 pb-2 mb-3">
            <div className="flex items-center gap-2 text-red-700 font-extrabold text-xs">
              <Sparkles size={16} />
              <span>🤖 ACORS AI COMPLAINT ANALYSIS</span>
            </div>
            <span className="rounded-md bg-red-100 px-2 py-0.5 font-mono text-[10px] font-bold text-red-700">
              94% Match
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <span className="text-[10px] font-bold uppercase text-zinc-400">Category:</span>
              <p className="font-extrabold text-zinc-900">{formData.category || aiResult.category}</p>
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase text-zinc-400">Severity:</span>
              <p className="font-extrabold text-amber-600">{formData.severity || aiResult.severity || "Medium"}</p>
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase text-zinc-400">Initial Receiver:</span>
              <p className="font-extrabold text-red-700">{detectedBarangay}</p>
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase text-zinc-400">Suggested LGU Office:</span>
              <p className="font-extrabold text-zinc-800">{suggestedLgu}</p>
            </div>
          </div>

          <div className="mt-3 rounded-xl bg-white p-2.5 border border-red-100 text-[11px] text-zinc-700">
            <span className="font-bold text-red-700 mr-1">AI Recommendation:</span>
            &ldquo;Send to {detectedBarangay} for initial Tier 1 assessment.&rdquo;
          </div>
        </section>

        {/* Edit Form */}
        <form className="space-y-3">
          <EditableField
            icon={<FileText size={16} />}
            label="Complaint Title"
            value={formData.title || aiResult.title}
            onChange={(val) => handleChange("title", val)}
          />

          <EditableField
            icon={<AlertTriangle size={16} />}
            label="Complaint Description"
            value={formData.description || aiResult.description}
            onChange={(val) => handleChange("description", val)}
            textarea
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <EditableField
              icon={<Building size={16} />}
              label="Detected Barangay"
              value={formData.barangay || aiResult.barangay || "Barangay Casisang"}
              onChange={(val) => handleChange("barangay", val)}
              isSelect
              options={barangayOptions}
            />

            <EditableField
              icon={<FileText size={16} />}
              label="Category"
              value={formData.category || aiResult.category}
              onChange={(val) => handleChange("category", val)}
              isSelect
              options={[
                "Road Damage",
                "Potholes",
                "Garbage Accumulation",
                "Illegal Dumping",
                "Broken Streetlights",
                "Flooding",
                "Fallen Trees",
                "Public Safety Concerns",
                "Water Service Issues",
              ]}
            />
          </div>
        </form>

        <section className="mt-4">
          <label className="text-xs font-bold text-gray-600 block mb-1">
            Detected Complaint Location (GPS)
          </label>
          <MockLocationCard coordinates={aiResult.location} />
        </section>

        <button
          type="button"
          onClick={onSubmit}
          disabled={isLoading}
          className={`mt-6 flex w-full items-center justify-center gap-2 rounded-2xl py-4 text-xs font-extrabold text-white transition ${
            !isLoading
              ? "bg-red-600 hover:bg-red-700 active:scale-98 shadow-md"
              : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          {isLoading ? (
            <>
              <Loader size={16} className="animate-spin" />
              Routing to {detectedBarangay}...
            </>
          ) : (
            <>
              <Send size={15} />
              Submit to {detectedBarangay}
            </>
          )}
        </button>
      </main>
    </div>
  );
}

function EditableField({
  icon,
  label,
  value,
  onChange,
  textarea = false,
  isSelect = false,
  options = [],
}) {
  return (
    <div className="rounded-2xl bg-white border border-gray-200 p-3.5 shadow-2xs">
      <div className="flex items-center gap-2 text-gray-700 mb-1.5">
        <span className="text-red-700">{icon}</span>
        <label className="text-[10px] font-extrabold uppercase tracking-wide text-gray-600">
          {label}
        </label>
      </div>
      {isSelect ? (
        <div className="relative">
          <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full text-xs font-bold rounded-xl border border-gray-200 px-3 py-2.5 focus:outline-none focus:border-red-600 bg-zinc-50 appearance-none pr-8"
          >
            {options.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
            <ChevronDown size={14} />
          </div>
        </div>
      ) : textarea ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={3}
          className="w-full text-xs font-semibold text-gray-900 rounded-xl border border-gray-200 bg-zinc-50 p-2.5 focus:outline-none focus:border-red-600 focus:bg-white resize-none"
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full text-xs font-bold text-gray-900 rounded-xl border border-gray-200 bg-zinc-50 px-3 py-2 focus:outline-none focus:border-red-600 focus:bg-white"
        />
      )}
    </div>
  );
}

function FlowItem({ number, title, desc, active }) {
  return (
    <div
      className={`rounded-2xl p-3.5 transition ${
        active ? "bg-red-600 text-white shadow-xs" : "bg-gray-50 text-gray-700 border border-zinc-100"
      }`}
    >
      <div className="flex items-start gap-3">
        <div
          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-extrabold ${
            active ? "bg-white text-red-600" : "bg-gray-200 text-gray-700"
          }`}
        >
          {number}
        </div>
        <div>
          <p className="font-extrabold text-xs">{title}</p>
          <p className="mt-0.5 text-[11px] opacity-80">{desc}</p>
        </div>
      </div>
    </div>
  );
}

function MockLocationCard({ coordinates }) {
  return (
    <div className="mt-1 overflow-hidden rounded-2xl border border-gray-200 bg-zinc-100 p-3 shadow-2xs">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MapPin size={16} className="text-red-600" />
          <span className="text-xs font-extrabold text-zinc-800">
            Coordinates: {coordinates}
          </span>
        </div>
        <span className="rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-bold text-red-700">
          GPS Verified
        </span>
      </div>
    </div>
  );
}

function ReportSubmitted({ reportId }) {
  const navigate = useNavigate();
  const now = new Date();
  const formattedDate = now.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  const formattedTime = now.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  return (
    <div className="px-5 pt-6 pb-10">
      <div className="rounded-3xl bg-red-600 px-5 py-8 text-center text-white shadow-lg">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white text-red-600">
          <Check size={36} strokeWidth={3.5} />
        </div>

        <h1 className="mt-5 text-2xl font-extrabold">Report Submitted!</h1>
        <p className="mt-2 text-xs font-semibold leading-relaxed text-red-100">
          Your complaint has been queued for <strong>Barangay Review (Tier 1)</strong>. You can follow live progress in your reports tracker.
        </p>

        <div className="mt-6 rounded-2xl bg-white p-4 text-left text-gray-900">
          <InfoBlock label="Complaint ID" value={reportId || "ACORS-CMP-2026-00125"} large />
          <InfoBlock label="Submitted On" value={`${formattedDate} · ${formattedTime}`} />
          <InfoBlock label="Initial Status" value="BARANGAY REVIEW (Tier 1)" />
        </div>

        <button
          onClick={() => navigate("/reports")}
          className="mt-6 w-full rounded-2xl bg-white py-3.5 text-xs font-extrabold text-red-700 shadow-sm hover:bg-red-50 transition"
        >
          View Live Complaint Timeline
        </button>

        <button
          onClick={() => navigate("/home")}
          className="mt-2.5 w-full rounded-2xl bg-red-700 py-3 text-xs font-extrabold text-white hover:bg-red-800 transition"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
}

function InfoBlock({ label, value, large = false }) {
  return (
    <div className="mb-3 last:mb-0">
      <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">{label}</p>
      <p className={`font-extrabold text-gray-900 ${large ? "text-base font-mono text-red-700" : "text-xs"}`}>
        {value}
      </p>
    </div>
  );
}

function DesktopSubmitted({ reportId }) {
  const navigate = useNavigate();
  const now = new Date();
  const formattedDate = now.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  const formattedTime = now.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  return (
    <div className="flex min-h-120 items-center justify-center p-4">
      <div className="w-full max-w-md rounded-3xl bg-red-600 p-8 text-center text-white shadow-xl">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white text-red-600">
          <Check size={36} strokeWidth={3.5} />
        </div>

        <h1 className="mt-5 text-2xl font-extrabold">Report Submitted!</h1>
        <p className="mt-2 text-xs font-semibold leading-relaxed text-red-100">
          Your complaint is now under <strong>Barangay Review (Tier 1)</strong>. Your Barangay officer will conduct an initial assessment.
        </p>

        <div className="mt-6 rounded-2xl bg-white p-4 text-left text-gray-900">
          <InfoBlock label="Complaint Tracking Number" value={reportId || "ACORS-CMP-2026-00125"} large />
          <InfoBlock label="Date & Time" value={`${formattedDate} · ${formattedTime}`} />
          <InfoBlock label="Current Status" value="BARANGAY REVIEW (Tier 1)" />
        </div>

        <button
          onClick={() => navigate("/reports")}
          className="mt-6 w-full rounded-2xl bg-white py-3.5 text-xs font-extrabold text-red-700 shadow-sm hover:bg-red-50 transition"
        >
          Track in My Reports
        </button>

        <button
          onClick={() => navigate("/home")}
          className="mt-2.5 w-full rounded-2xl bg-red-700 py-3 text-xs font-extrabold text-white hover:bg-red-800 transition"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
}

function LoadingScreen() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs">
      <div className="rounded-3xl bg-white p-8 text-center max-w-xs shadow-2xl">
        <Loader size={40} className="mx-auto mb-3 animate-spin text-red-600" />
        <h2 className="text-base font-extrabold text-gray-900">Analyzing Photo...</h2>
        <p className="mt-1 text-xs text-gray-500">
          ACORS AI is identifying category, severity, and routing to your Barangay.
        </p>
      </div>
    </div>
  );
}
