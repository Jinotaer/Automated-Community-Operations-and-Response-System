// src/services/oscaData.js
// Office for Senior Citizens Affairs (OSCA) — Mock Data & Service

const STORAGE_KEY = "acors_osca_requests";

// ─── Mock Senior Citizen Registry ──────────────────────────────────────────

export const MOCK_SENIOR_REGISTRY = [
  {
    registryNumber: "OSCA-2026-00001",
    oscaIdNumber: "OSCA-2026-00025",
    fullName: "Maria Santos",
    dob: "1955-01-15",
    sex: "Female",
    civilStatus: "Widowed",
    address: "Purok 3, Rizal Street, Poblacion, Malaybalay City",
    barangay: "Poblacion",
    contactNumber: "0917-223-8899",
    status: "ACTIVE",
    registrationStatus: "REGISTERED",
    registrationDate: "2020-02-10",
  },
  {
    registryNumber: "OSCA-REG-2026-001",
    oscaIdNumber: "OSCA-2026-00042",
    fullName: "Juan Dela Cruz",
    dob: "1954-03-10",
    sex: "Male",
    civilStatus: "Married",
    address: "Purok 4, Sayre Highway, Casisang, Malaybalay City",
    barangay: "Casisang",
    contactNumber: "0918-334-1122",
    status: "ACTIVE",
    registrationStatus: "REGISTERED",
    registrationDate: "2019-05-18",
  },
  {
    registryNumber: "OSCA-REG-2026-009",
    oscaIdNumber: "OSCA-2026-00088",
    fullName: "Teresa Ramos",
    dob: "1958-08-22",
    sex: "Female",
    civilStatus: "Married",
    address: "Purok 1, Sumpong, Malaybalay City",
    barangay: "Sumpong",
    contactNumber: "0920-556-7788",
    status: "ACTIVE",
    registrationStatus: "REGISTERED",
    registrationDate: "2023-09-04",
  },
];

export function findMockSeniorRecord({ fullName, dob, oscaIdNumber, registryNumber }) {
  const normName = (fullName || "").toLowerCase().trim();
  const normId = (oscaIdNumber || "").toLowerCase().trim();
  const normReg = (registryNumber || "").toLowerCase().trim();

  return MOCK_SENIOR_REGISTRY.find((s) => {
    const matchId = normId && s.oscaIdNumber.toLowerCase() === normId;
    const matchReg = normReg && s.registryNumber.toLowerCase() === normReg;
    const matchName = normName && s.fullName.toLowerCase() === normName;
    const matchDob = dob && s.dob === dob;

    return matchId || matchReg || (matchName && matchDob) || matchName;
  }) || null;
}

// ─── Seed Data ───────────────────────────────────────────────────────────────

const SEED_REQUESTS = [
  {
    id: "ACORS-OSCA-2026-000001",
    certificateType: "Senior Citizen ID",
    submittedAt: "Aug 24, 2026",
    status: "Approved",
    applicant: {
      fullName: "Maria Santos",
      dob: "1955-01-15",
      sex: "Female",
      civilStatus: "Widowed",
      address: "Purok 3, Rizal Street, Poblacion, Malaybalay City",
      barangay: "Poblacion",
      contactNumber: "0917-223-8899",
      email: "maria.santos@gmail.com",
    },
    residency: {
      barangay: "Poblacion",
      city: "Malaybalay City",
      province: "Bukidnon",
      yearsOfResidence: "45",
    },
    emergencyContact: {
      name: "Roberto Santos",
      relationship: "Son",
      contactNumber: "0917-555-1234",
    },
    aiValidation: {
      status: "READY FOR OSCA REVIEW",
      confidence: "96%",
      checks: [
        { label: "Required fields completed", passed: true },
        { label: "Document uploaded", passed: true },
        { label: "Document readability", passed: true },
        { label: "Name consistency", passed: true },
        { label: "Date of birth consistency", passed: true },
        { label: "Address consistency", passed: true },
        { label: "Possible duplicate application", passed: true },
        { label: "Photo uploaded", passed: true },
      ],
      ocrExtracted: {
        fullName: "Maria Santos",
        dob: "January 15, 1955",
        address: "Poblacion, Malaybalay City",
        idNumber: "PSA-BC-1955-009122",
      },
      recommendation: "Application complete. Senior citizen qualifying age (71 years) verified through PSA Birth Certificate.",
    },
    registryVerification: {
      status: "MATCHED",
      registryNumber: "OSCA-2026-00001",
      message: "Senior Citizen Record Found & Active in Masterlist.",
    },
    payment: {
      status: "FREE",
      amount: "FREE (RA 7432 / RA 9994)",
    },
    verificationStatus: "Verified & Approved by OSCA Officer",
    certificateNumber: "OSCA-ID-2026-00025",
    issueDate: "August 24, 2026",
    documents: [
      { name: "Valid Government ID", fileName: "voters_id_santos.jpg", verified: true },
      { name: "PSA Birth Certificate", fileName: "psa_birth_cert_maria.pdf", verified: true },
      { name: "Proof of Residence (Barangay Cert)", fileName: "brgy_residence_santos.pdf", verified: true },
      { name: "2x2 ID Photo", fileName: "id_photo_maria.jpg", verified: true },
    ],
  },
  {
    id: "ACORS-OSCA-2026-000002",
    certificateType: "Senior Citizen Registration Certificate",
    submittedAt: "Aug 25, 2026",
    status: "Ready for OSCA Verification",
    applicant: {
      fullName: "Juan Dela Cruz",
      dob: "1954-03-10",
      address: "Purok 4, Sayre Highway, Casisang, Malaybalay City",
      barangay: "Casisang",
      contactNumber: "0918-334-1122",
      email: "juan.delacruz@gmail.com",
      oscaIdNumber: "OSCA-2026-00042",
    },
    registrationInfo: {
      oscaRegistrationNumber: "OSCA-REG-2026-001",
      registrationDate: "2019-05-18",
      purpose: "Social Welfare Program",
    },
    aiValidation: {
      status: "READY FOR OSCA VERIFICATION",
      confidence: "95%",
      checks: [
        { label: "Required information", passed: true },
        { label: "Document completeness", passed: true },
        { label: "Name consistency", passed: true },
        { label: "Date of birth consistency", passed: true },
        { label: "OSCA ID consistency", passed: true },
        { label: "Registration number consistency", passed: true },
        { label: "Possible duplicate request", passed: true },
      ],
      ocrExtracted: {
        fullName: "Juan Dela Cruz",
        dob: "March 10, 1954",
        address: "Casisang, Malaybalay City",
        idNumber: "OSCA-2026-00042",
      },
      recommendation: "Senior citizen registered membership verified against active records.",
    },
    registryVerification: {
      status: "MATCHED",
      registryNumber: "OSCA-REG-2026-001",
      message: "Registration Found (Active Status).",
    },
    payment: {
      status: "FREE",
      amount: "FREE",
    },
    verificationStatus: "Pending OSCA Staff Verification",
    certificateNumber: "SC-CR-2026-00812",
    issueDate: "August 25, 2026",
    documents: [
      { name: "Valid Government ID", fileName: "driver_license_delacruz.jpg", verified: true },
      { name: "Senior Citizen ID", fileName: "osca_card_delacruz.jpg", verified: true },
      { name: "Proof of Residence", fileName: "brgy_cert_delacruz.pdf", verified: true },
    ],
  },
  {
    id: "ACORS-OSCA-2026-000003",
    certificateType: "Senior Citizen Certification",
    submittedAt: "Aug 25, 2026",
    status: "Requires Correction",
    applicant: {
      fullName: "Teresa Ramos",
      dob: "1958-08-22",
      address: "Purok 1, Sumpong, Malaybalay City",
      barangay: "Sumpong",
      contactNumber: "0920-556-7788",
      email: "teresa.ramos@gmail.com",
      oscaIdNumber: "OSCA-2026-00088",
    },
    certificationInfo: {
      oscaRegistrationNumber: "OSCA-REG-2026-009",
      purpose: "Medical Assistance",
    },
    aiValidation: {
      status: "REQUIRES CORRECTION",
      confidence: "84%",
      checks: [
        { label: "Required fields", passed: true },
        { label: "Documents uploaded", passed: false },
        { label: "Document readability", passed: true },
        { label: "Name consistency", passed: true },
        { label: "Date of birth consistency", passed: true },
        { label: "OSCA ID consistency", passed: true },
        { label: "Registration number consistency", passed: true },
        { label: "Duplicate request", passed: true },
      ],
      ocrExtracted: {
        fullName: "Teresa Ramos",
        dob: "August 22, 1958",
        address: "Sumpong, Malaybalay City",
        idNumber: "OSCA-2026-00088",
      },
      recommendation: "Proof of Residence is missing. Please upload your Barangay Certificate of Residency.",
    },
    registryVerification: {
      status: "MATCHED",
      registryNumber: "OSCA-REG-2026-009",
      message: "Senior Citizen Record Found (Teresa Ramos).",
    },
    payment: {
      status: "FREE",
      amount: "FREE",
    },
    verificationStatus: "Awaiting Document Correction",
    correctionNote: "Barangay Certificate of Residency is missing. Please upload a clear photo or copy of your Barangay Clearance/Residency.",
    certificateNumber: "SC-CERT-2026-00441",
    documents: [
      { name: "Valid Government ID", fileName: "umid_ramos.jpg", verified: true },
      { name: "OSCA ID", fileName: "osca_card_ramos.jpg", verified: true },
      { name: "Proof of Residence", fileName: "", verified: false, missing: true },
    ],
  },
];

// ─── localStorage CRUD ───────────────────────────────────────────────────────

export function getOSCARequests() {
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

export function saveOSCARequest(requestData) {
  try {
    const existing = getOSCARequests();
    const updated = [requestData, ...existing];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch {
    return [requestData];
  }
}

export function updateOSCARequestStatus(requestId, newStatus, extra = {}) {
  try {
    const existing = getOSCARequests();
    const updated = existing.map((r) =>
      r.id === requestId ? { ...r, status: newStatus, ...extra } : r
    );
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch {
    return getOSCARequests();
  }
}
