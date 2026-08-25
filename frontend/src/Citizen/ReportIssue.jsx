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
} from "lucide-react";
import CitizenLayout from "../Layouts/CitizenLayouts";
import { offices } from "../Offices/officeData";
import { uploadToCloudinary } from "../services/cloudinaryApi";
import { callDraftReport } from "../services/reportApi";
import { getMockGPSLocation } from "../services/gps";
import garbageSampleImg from "../assets/garbage-sample.jpg";

const departmentOptions = Object.values(offices)
  .filter((office) => office.slug !== "tourism")
  .map((office) => office.name);

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
  category: "Illegal Dumping",
  priority: "high",
  department: "CENRO",
  confidence: 0.93,
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

        const formattedAiResult = {
          photoUrl: garbageSampleImg,
          title: mockSampleResult.title,
          description: mockSampleResult.description,
          category: mockSampleResult.category,
          priority: mockSampleResult.priority,
          department: normalizeDepartment(mockSampleResult.department),
          confidence: mockSampleResult.confidence,
          location: `${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}`,
        };

        setAiResult(formattedAiResult);
        setFormData({
          title: formattedAiResult.title,
          description: formattedAiResult.description,
          category: formattedAiResult.category,
          priority: formattedAiResult.priority,
          department: formattedAiResult.department,
        });
        setStep(2);
        return;
      }

      const uploadResult = await uploadToCloudinary(photoFile);
      if (!uploadResult.success) {
        alert("Failed to upload image: " + uploadResult.error);
        setIsLoading(false);
        return;
      }

      const photoUrl = uploadResult.url;
      const aiResponse = await callDraftReport(
        photoUrl,
        location.latitude,
        location.longitude,
      );

      if (!aiResponse.success) {
        alert("Failed to analyze photo: " + aiResponse.error);
        setIsLoading(false);
        return;
      }

      const formattedAiResult = {
        photoUrl,
        title: aiResponse.data.suggested_title,
        description: aiResponse.data.description,
        category: aiResponse.data.category,
        priority: aiResponse.data.priority,
        department: normalizeDepartment(aiResponse.data.department),
        confidence: aiResponse.data.confidence,
        location: `${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}`,
      };

      setAiResult(formattedAiResult);
      setFormData({
        title: formattedAiResult.title,
        description: formattedAiResult.description,
        category: formattedAiResult.category,
        priority: formattedAiResult.priority,
        department: formattedAiResult.department,
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
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const mockId = `MBY-2026-${Math.floor(10000 + Math.random() * 90000)}`;
      setReportId(mockId);
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
          <aside className="col-span-4 rounded-3xl bg-white p-6 shadow-sm">
            <h2 className="text-xl font-extrabold text-gray-900">
              Report Flow
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Upload a photo and ACORS AI will generate the report details.
            </p>

            <div className="mt-6 space-y-4">
              <FlowItem
                number="1"
                title="Upload Photo"
                desc="Take or upload a picture of the issue."
                active={step === 1}
              />
              <FlowItem
                number="2"
                title="Edit Details"
                desc="Review and edit the AI suggested fields if needed."
                active={step === 2}
              />
              <FlowItem
                number="3"
                title="Submit Report"
                desc="Send your report to the LGU."
                active={step === 3}
              />
            </div>
          </aside>

          <main className="col-span-8 rounded-3xl bg-white p-6 shadow-sm">
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
        <div className="flex items-center gap-2 mb-4">
        </div>
         <h2 className="text-xl font-extrabold text-gray-900">
            Take or upload a picture
          </h2>
        <p className="mt-2 text-sm text-gray-500">
          ACORS AI will analyze the photo and automatically fill the report
          details.
        </p>

        <div className="mt-6 rounded-3xl border-2 border-dashed border-red-200 bg-red-50 p-5 text-center">
          {photoPreview ? (
            <div className="overflow-hidden rounded-2xl">
              <img
                src={photoPreview}
                alt="Selected issue"
                className="h-64 w-full object-cover"
              />
            </div>
          ) : (
            <div className="flex min-h-64 flex-col items-center justify-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white text-red-600 shadow-sm">
                <ImagePlus size={38} />
              </div>
              <h3 className="mt-5 text-lg font-extrabold text-gray-900">
                No photo selected
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                Take a photo or upload from your device.
              </p>
            </div>
          )}

          <div className="mt-5 grid grid-cols-1 gap-3">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isLoading}
              className="flex items-center justify-center gap-2 rounded-2xl bg-red-600 py-4 text-sm font-extrabold text-white hover:bg-red-700 disabled:bg-gray-400"
            >
              <Camera size={18} />
              Take a Photo
            </button>

            <button
              type="button"
              onClick={onUseMockSample}
              disabled={isLoading}
              className="flex items-center justify-center gap-2 rounded-2xl bg-white py-4 text-sm font-extrabold text-red-600 shadow-sm hover:bg-red-50"
            >
              <Sparkles size={18} />
              Use Sample
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
          className={`mt-6 flex w-full items-center justify-center gap-2 rounded-2xl py-4 text-sm font-extrabold text-white transition ${
            photoFile && !isLoading
              ? "bg-red-600 hover:bg-red-700"
              : "bg-gray-300 cursor-not-allowed"
          }`}
        >
          {isLoading ? (
            <>
              <Loader size={18} className="animate-spin" />
              Processing...
            </>
          ) : (
            <>
              Analyze Photo with AI
              <Sparkles size={18} />
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
      <div className={desktop ? "" : "px-5 pt-5"}>Loading AI analysis...</div>
    );
  }

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div>
      <main className={desktop ? "" : "px-5 pt-5"}>
        <div className="flex items-center gap-2 mb-4">
          <button
            onClick={onBack}
            className="text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft size={20} />
          </button>
          <h2 className="text-xl font-extrabold text-gray-900">
            Review Report Details
          </h2>
        </div>

        {aiResult.photoUrl && (
          <div className="mb-4 overflow-hidden rounded-2xl">
            <img
              src={aiResult.photoUrl}
              alt="Report issue"
              className="h-48 w-full object-cover"
            />
          </div>
        )}

        <section className="rounded-2xl bg-red-50 p-3 mb-5 border-l-4 border-red-600">
          <div className="flex items-center gap-2 text-red-600">
            <Sparkles size={14} />
            <p className="text-xs font-semibold">
              AI suggested these details. Edit any field before submitting.
            </p>
          </div>
        </section>

        <form className="space-y-3">
          <EditableField
            icon={<FileText size={18} />}
            label="Title"
            value={formData.title || aiResult.title}
            onChange={(val) => handleChange("title", val)}
          />

          <EditableField
            icon={<AlertTriangle size={18} />}
            label="Description"
            value={formData.description || aiResult.description}
            onChange={(val) => handleChange("description", val)}
            textarea
          />

          <div className="flex flex-col gap-3 md:grid md:grid-cols-2">
            <EditableField
              icon={<FileText size={18} />}
              label="Category"
              value={formData.category || aiResult.category}
              onChange={(val) => handleChange("category", val)}
              isSelect
              options={[
                "Potholes",
                "Road Damage",
                "Flooding",
                "Illegal Dumping",
                "Garbage Accumulation",
                "Broken Streetlights",
                "Fallen Trees",
                "Water Service Issues",
                "Public Safety Concerns",
              ]}
            />

            <EditableField
              icon={<Zap size={18} />}
              label="Priority"
              value={formData.priority || aiResult.priority}
              onChange={(val) => handleChange("priority", val)}
              isSelect
              options={["critical", "high", "medium", "low"]}
            />
          </div>

          <EditableField
            icon={<Building2 size={18} />}
            label="Department"
            value={formData.department || aiResult.department}
            onChange={(val) => handleChange("department", val)}
            isSelect
            options={departmentOptions}
          />
        </form>

        <section className="mt-5">
          <label className="text-xs font-bold text-gray-600">
            Location (GPS)
          </label>
          <MockLocationCard coordinates={aiResult.location} />
        </section>

        <button
          type="button"
          onClick={onSubmit}
          disabled={isLoading}
          className={`mt-6 flex w-full items-center justify-center gap-2 rounded-2xl py-4 text-sm font-extrabold text-white transition ${
            !isLoading
              ? "bg-red-600 hover:bg-red-700"
              : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          {isLoading ? (
            <>
              <Loader size={18} className="animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              <Send size={17} />
              Submit Report
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
  const getPriorityColors = (val) => {
    if (label === "Priority") {
      if (val === "critical" || val === "high") {
        return {
          border: "border-red-300",
          text: "text-red-700",
          bg: "bg-red-50",
        };
      }
      if (val === "medium") {
        return {
          border: "border-yellow-300",
          text: "text-yellow-700",
          bg: "bg-yellow-50",
        };
      }
      if (val === "low") {
        return {
          border: "border-red-300",
          text: "text-red-600",
          bg: "bg-red-50",
        };
      }
    }
    return { border: "border-gray-300", text: "text-gray-900", bg: "bg-white" };
  };

  const priorityColors = getPriorityColors(value);

  return (
    <div className="rounded-lg bg-white border border-gray-200 p-3">
      <div className="flex items-center gap-2 text-gray-700 mb-2">
        {icon}
        <label className="text-xs font-bold uppercase tracking-wide text-gray-700">
          {label}
        </label>
      </div>
      {isSelect ? (
        <div className="relative">
          <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className={`w-full text-sm font-semibold rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none pr-10 ${
              label === "Priority"
                ? `${priorityColors.bg} ${priorityColors.border} ${priorityColors.text}`
                : "bg-white border-gray-300 text-gray-900"
            }`}
          >
            {options.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-600">
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </div>
        </div>
      ) : textarea ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={3}
          className="w-full text-sm font-semibold text-gray-900 rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full text-sm font-semibold text-gray-900 rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      )}
    </div>
  );
}

function FlowItem({ number, title, desc, active }) {
  return (
    <div
      className={`rounded-2xl p-4 ${
        active ? "bg-red-600 text-white" : "bg-gray-100 text-gray-700"
      }`}
    >
      <div className="flex items-start gap-3">
        <div
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-extrabold ${
            active ? "bg-white text-red-600" : "bg-gray-300 text-gray-700"
          }`}
        >
          {number}
        </div>
        <div>
          <p className="font-extrabold">{title}</p>
          <p className="mt-1 text-xs opacity-80">{desc}</p>
        </div>
      </div>
    </div>
  );
}

function MockLocationCard({ coordinates }) {
  const majorRoads = [
    "left-[-6%] top-[18%] h-4 w-[120%] rotate-[-10deg]",
    "left-[-4%] top-[36%] h-4 w-[116%] rotate-[7deg]",
    "left-[8%] top-[54%] h-4 w-[108%] rotate-[-12deg]",
    "left-[18%] top-[74%] h-4 w-[96%] rotate-[5deg]",
    "left-[14%] top-[-6%] h-[118%] w-4 rotate-[13deg]",
    "left-[36%] top-[-8%] h-[124%] w-4 rotate-[-7deg]",
    "left-[58%] top-[-10%] h-[128%] w-4 rotate-[10deg]",
    "left-[80%] top-[-4%] h-[114%] w-4 rotate-[-11deg]",
  ];

  const minorRoads = [
    "left-[4%] top-[10%] h-2 w-[104%] rotate-[3deg]",
    "left-[0%] top-[28%] h-2 w-[108%] rotate-[-4deg]",
    "left-[14%] top-[46%] h-2 w-[96%] rotate-[2deg]",
    "left-[8%] top-[64%] h-2 w-[102%] rotate-[-5deg]",
    "left-[26%] top-[82%] h-2 w-[72%] rotate-[3deg]",
    "left-[24%] top-[-6%] h-[112%] w-2 rotate-[7deg]",
    "left-[48%] top-[-8%] h-[118%] w-2 rotate-[-9deg]",
    "left-[68%] top-[-6%] h-[114%] w-2 rotate-[6deg]",
  ];

  const parks = [
    "left-[10%] top-[16%] h-10 w-10",
    "left-[72%] top-[12%] h-8 w-8",
    "left-[60%] top-[48%] h-8 w-9",
    "left-[22%] top-[70%] h-10 w-12",
  ];

  const contextPins = [
    { top: "16%", left: "18%", color: "text-red-500", size: 28 },
    { top: "18%", left: "26%", color: "text-amber-400", size: 24 },
    { top: "30%", left: "48%", color: "text-red-500", size: 30 },
    { top: "14%", left: "82%", color: "text-red-500", size: 30 },
    { top: "46%", left: "74%", color: "text-red-500", size: 30 },
    { top: "70%", left: "66%", color: "text-amber-400", size: 28 },
    { top: "74%", left: "12%", color: "text-amber-400", size: 26 },
    { top: "78%", left: "30%", color: "text-red-500", size: 28 },
  ];

  return (
    <div className="mt-2 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div className="relative h-56 bg-[#edf2f5]">
        <div className="absolute left-[6%] top-[8%] h-16 w-14 rounded-md bg-[#d8efcc]" />
        <div className="absolute right-[14%] top-[18%] h-12 w-12 rounded-md bg-[#d8efcc]" />
        <div className="absolute left-[54%] top-[46%] h-10 w-10 rounded-md bg-[#d8efcc]" />
        <div className="absolute left-[18%] bottom-[16%] h-14 w-16 rounded-md bg-[#d8efcc]" />

        {majorRoads.map((street) => (
          <div
            key={street}
            className={`absolute rounded-full bg-white/95 shadow-[0_0_0_1px_rgba(203,213,225,0.35)] ${street}`}
          />
        ))}

        {minorRoads.map((street) => (
          <div
            key={street}
            className={`absolute rounded-full bg-white/90 shadow-[0_0_0_1px_rgba(226,232,240,0.45)] ${street}`}
          />
        ))}

        {parks.map((park) => (
          <div key={park} className={`absolute rounded-sm bg-[#d8efcc] ${park}`} />
        ))}

        {contextPins.map((pin) => (
          <div
            key={`${pin.top}-${pin.left}`}
            className="absolute -translate-x-1/2 -translate-y-full"
            style={{ top: pin.top, left: pin.left }}
          >
            <MapPin
              size={pin.size}
              className={`${pin.color} fill-current drop-shadow-[0_8px_14px_rgba(15,23,42,0.16)]`}
            />
          </div>
        ))}

        <div className="absolute left-[54%] top-[64%] -translate-x-1/2 -translate-y-1/2">
          <div className="absolute left-1/2 top-1/2 h-14 w-14 -translate-x-1/2 -translate-y-1/2 rounded-full bg-sky-400/20 blur-md" />
          <Navigation
            size={38}
            fill="currentColor"
            strokeWidth={1.8}
            className="relative rotate-[16deg] text-sky-500 drop-shadow-[0_10px_16px_rgba(59,130,246,0.28)]"
          />
        </div>

        <div className="absolute left-[72%] top-[58%] -translate-x-1/2 -translate-y-full">
          <MapPin
            size={34}
            className="fill-current text-red-500 drop-shadow-[0_10px_18px_rgba(239,68,68,0.22)]"
          />
        </div>

        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between rounded-2xl bg-white/96 px-4 py-3 shadow-sm">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-gray-400">
              Coordinates
            </p>
            <p className="mt-1 text-sm font-extrabold text-gray-900">
              {coordinates}
            </p>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-full border border-red-100 bg-red-600 text-white">
            <LocateFixed size={16} />
          </div>
        </div>
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
    <div className="px-5 pt-6">
      <div className="rounded-3xl bg-red-600 px-5 py-8 text-center text-white shadow-sm">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-white text-red-600">
          <Check size={44} strokeWidth={4} />
        </div>

        <h1 className="mt-6 text-3xl font-extrabold">Thank you!</h1>
        <p className="mt-4 text-sm font-semibold leading-6 text-red-50">
          Your report has been submitted. <br />
          We'll notify you once there are updates.
        </p>

        <div className="mt-8 rounded-2xl bg-white p-5 text-left text-gray-900">
          <InfoBlock
            label="Report ID"
            value={reportId || "#MBY-2024-00001"}
            large
          />
          <InfoBlock
            label="Submitted"
            value={`${formattedDate} · ${formattedTime}`}
          />
          <InfoBlock label="Status" value="Under Review" />
        </div>

        <button
          onClick={() => navigate("/reports")}
          className="mt-6 w-full rounded-xl bg-white py-3 text-sm font-extrabold text-red-600 hover:bg-red-50"
        >
          View My Reports
        </button>

        <button
          onClick={() => navigate("/home")}
          className="mt-3 w-full rounded-xl bg-red-600 py-3 text-sm font-extrabold text-white hover:bg-red-700"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
}

function InfoBlock({ label, value, large = false }) {
  return (
    <div className="mb-4 last:mb-0">
      <p className="text-xs font-bold text-gray-500">{label}</p>
      <p
        className={`font-extrabold text-gray-900 ${large ? "text-xl" : "text-sm"}`}
      >
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
    <div className="flex min-h-150 items-center justify-center">
      <div className="w-full max-w-md rounded-3xl bg-red-600 p-8 text-center text-white">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-white text-red-600">
          <Check size={44} strokeWidth={4} />
        </div>

        <h1 className="mt-6 text-3xl font-extrabold">Thank you!</h1>
        <p className="mt-4 text-sm font-semibold leading-6 text-red-50">
          Your report has been submitted. We'll notify you once there are
          updates.
        </p>

        <div className="mt-8 rounded-2xl bg-white p-5 text-left text-gray-900">
          <InfoBlock
            label="Report ID"
            value={reportId || "#MBY-2024-00001"}
            large
          />
          <InfoBlock
            label="Submitted"
            value={`${formattedDate} · ${formattedTime}`}
          />
          <InfoBlock label="Status" value="Under Review" />
        </div>

        <button
          onClick={() => navigate("/home")}
          className="mt-6 w-full rounded-xl bg-white py-3 text-sm font-extrabold text-red-600 hover:bg-red-50"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
}

function LoadingScreen() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="rounded-3xl bg-white p-8 text-center">
        <Loader
          size={48}
          className="mx-auto mb-4 animate-spin text-red-600"
        />
        <h2 className="text-xl font-extrabold text-gray-900">Hold on...</h2>
        <p className="mt-2 text-sm text-gray-500">
          We're uploading your photo and analyzing it with AI
        </p>
      </div>
    </div>
  );
}
