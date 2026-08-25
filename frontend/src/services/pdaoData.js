// src/services/pdaoData.js
// Persons with Disability Affairs Office (PDAO) — Mock Data & localStorage Service

const STORAGE_KEY = "acors_pdao_requests";

// ─── Seed Data ───────────────────────────────────────────────────────────────

const SEED_REQUESTS = [
  {
    id: "ACORS-PDAO-2026-000001",
    certificateType: "PWD Registration Certificate",
    submittedAt: "Aug 24, 2026",
    status: "Approved",
    applicant: {
      fullName: "Maria Theresa Santos",
      dob: "1992-07-14",
      sex: "Female",
      address: "Purok 4, Sumpong, Malaybalay City",
      barangay: "Sumpong",
      contactNumber: "0917-889-2234",
      email: "mt.santos@gmail.com",
      civilStatus: "Single",
      occupation: "Graphic Designer",
    },
    disabilityInfo: {
      type: "Physical Disability",
      cause: "Congenital / Inborn",
      yearStarted: "1992",
      assistiveDevice: "Wheelchair / Mobility Aid",
      additionalInfo: "Lower limb mobility impairment.",
    },
    aiValidation: {
      status: "PASSED",
      confidence: "95%",
      checks: [
        { label: "Required fields completed", passed: true },
        { label: "Valid ID uploaded", passed: true },
        { label: "ID is readable", passed: true },
        { label: "Name consistency", passed: true },
        { label: "Date of birth consistency", passed: true },
        { label: "Address consistency", passed: true },
        { label: "Required documents uploaded", passed: true },
        { label: "Duplicate application check", passed: true },
      ],
      recommendation: "Documents complete and identity verified. Ready for authorized PDAO review.",
    },
    verificationStatus: "Verified by PDAO Officer",
    certificateNumber: "PDAO-RC-2026-008124",
    issueDate: "August 24, 2026",
    documents: [
      { name: "Valid Government ID (PhilSys)", fileName: "philsys_santos.jpg", verified: true },
      { name: "1x1 ID Picture", fileName: "photo_santos_1x1.jpg", verified: true },
      { name: "Proof of Residence (Barangay Cert)", fileName: "brgy_cert_santos.jpg", verified: true },
      { name: "Medical / Disability Assessment", fileName: "clinical_assessment_doc.pdf", verified: true },
    ],
  },
  {
    id: "ACORS-PDAO-2026-000002",
    certificateType: "PWD ID",
    submittedAt: "Aug 25, 2026",
    status: "Ready for PDAO Verification",
    applicant: {
      fullName: "Joshua Kyle Lim",
      dob: "2001-11-03",
      sex: "Male",
      address: "Purok 2, Casisang, Malaybalay City",
      barangay: "Casisang",
      contactNumber: "0928-334-9988",
      email: "jk.lim@gmail.com",
    },
    pwdInfo: {
      type: "Visual Disability",
      cause: "Acquired / Injury",
      description: "Severe visual impairment (Low Vision).",
      yearStarted: "2018",
      assistiveDevice: "Corrective optical magnifier & white cane",
    },
    isRepresentative: false,
    aiValidation: {
      status: "PASSED",
      confidence: "94%",
      checks: [
        { label: "Application form completed", passed: true },
        { label: "Required documents uploaded", passed: true },
        { label: "ID readable", passed: true },
        { label: "Name consistency", passed: true },
        { label: "Date of birth consistency", passed: true },
        { label: "Address consistency", passed: true },
        { label: "Photo uploaded", passed: true },
        { label: "Duplicate application check", passed: true },
      ],
      recommendation: "Application complete and consistent. Ready for authorized PDAO officer verification.",
    },
    verificationStatus: "Pending Officer Review",
    documents: [
      { name: "Accomplished PWD Form", fileName: "pwd_app_form_lim.pdf", verified: true },
      { name: "Valid Government ID", fileName: "driver_license_lim.jpg", verified: true },
      { name: "1x1 Recent ID Picture", fileName: "id_photo_lim.jpg", verified: true },
      { name: "Proof of Residence", fileName: "utility_bill_residence.pdf", verified: true },
    ],
  },
  {
    id: "ACORS-PDAO-2026-000003",
    certificateType: "Certificate of Disability",
    submittedAt: "Aug 25, 2026",
    status: "Requires Correction",
    applicant: {
      fullName: "Elena Corpuz",
      dob: "1988-04-19",
      address: "Purok 6, Bangcud, Malaybalay City",
      barangay: "Bangcud",
      contactNumber: "0919-445-1212",
      email: "elena.corpuz@yahoo.com",
    },
    disabilityInfo: {
      type: "Hearing Disability",
      cause: "Illness / Infection",
      description: "Bilateral sensorineural hearing loss.",
      yearStarted: "2015",
      purpose: "Employment Requirement",
    },
    aiValidation: {
      status: "REQUIRES CORRECTION",
      confidence: "82%",
      checks: [
        { label: "Required information", passed: true },
        { label: "Required documents", passed: false },
        { label: "ID readability", passed: true },
        { label: "Name consistency", passed: true },
        { label: "Date consistency", passed: true },
        { label: "Document completeness", passed: false },
      ],
      recommendation: "Proof of residence document is missing. Requires applicant submission before verification.",
    },
    verificationStatus: "Awaiting Document Correction",
    correctionNote: "Proof of residence document is missing. Please upload a clear photo or copy of your Barangay Certificate of Residency or utility bill.",
    documents: [
      { name: "Valid Government ID", fileName: "umid_corpuz.jpg", verified: true },
      { name: "Medical / Audiology Assessment", fileName: "audiogram_report.pdf", verified: true },
      { name: "Proof of Residence", fileName: "", verified: false, missing: true },
    ],
  },
];

// ─── localStorage CRUD ───────────────────────────────────────────────────────

export function getPDAORequests() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    const existing = stored ? JSON.parse(stored) : [];

    const existingIds = new Set(existing.map((r) => r.id));
    const missing = SEED_REQUESTS.filter((s) => !existingIds.has(s.id));

    if (missing.length > 0) {
      const merged = [...missing, ...existing];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
      return merged;
    }

    return existing;
  } catch {
    return SEED_REQUESTS;
  }
}

export function savePDAORequest(requestData) {
  try {
    const existing = getPDAORequests();
    const updated = [requestData, ...existing];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch {
    return [requestData];
  }
}

export function updatePDAORequestStatus(requestId, newStatus, extra = {}) {
  try {
    const existing = getPDAORequests();
    const updated = existing.map((r) =>
      r.id === requestId ? { ...r, status: newStatus, ...extra } : r
    );
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch {
    return getPDAORequests();
  }
}
