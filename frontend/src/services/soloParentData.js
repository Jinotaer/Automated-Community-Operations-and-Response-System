// src/services/soloParentData.js
// Solo Parent Office / City Social Welfare and Development Office (CSWDO) — Mock Data & Service

const STORAGE_KEY = "acors_soloparent_requests";

// ─── Mock Registries ──────────────────────────────────────────────────────────

export const MOCK_SOLO_PARENT_REGISTRY = [
  {
    registryId: "SP-2026-00001",
    name: "Maria Santos",
    dob: "1989-05-12",
    address: "Purok 3, Casisang, Malaybalay City",
    barangay: "Casisang",
    numberOfChildren: 2,
    children: [
      { fullName: "Gabriel Santos", dob: "2015-08-20", relationship: "Son", school: "Casisang Central School" },
      { fullName: "Hannah Santos", dob: "2018-03-14", relationship: "Daughter", school: "Casisang Day Care" },
    ],
    reason: "Death of Spouse",
    yearStarted: "2020",
    status: "ACTIVE",
    registrationDate: "January 15, 2026",
    idNumber: "SPID-2026-00124",
  },
  {
    registryId: "SP-REG-2026-001",
    name: "Juan Dela Cruz",
    dob: "1986-11-04",
    address: "Purok 5, Sumpong, Malaybalay City",
    barangay: "Sumpong",
    numberOfChildren: 1,
    children: [
      { fullName: "Mateo Dela Cruz", dob: "2017-09-10", relationship: "Son", school: "Sumpong Elementary" },
    ],
    reason: "Abandonment",
    yearStarted: "2021",
    status: "ACTIVE",
    registrationDate: "February 10, 2026",
    registrationNumber: "SP-REG-2026-001",
  },
  {
    registryId: "SP-2026-00003",
    name: "Ana Patricia Reyes",
    dob: "1994-02-18",
    address: "Purok 1, Poblacion, Malaybalay City",
    barangay: "Poblacion",
    numberOfChildren: 1,
    children: [
      { fullName: "Lucas Reyes", dob: "2020-06-25", relationship: "Son", school: "Preschool" },
    ],
    reason: "Unmarried Parent",
    yearStarted: "2020",
    status: "ACTIVE",
    registrationDate: "March 02, 2026",
    idNumber: "SPID-2026-00899",
  },
];

export function findMockSoloParentRecord({ name, soloParentId }) {
  const normName = (name || "").toLowerCase().trim();
  const normId = (soloParentId || "").toLowerCase().trim();

  return MOCK_SOLO_PARENT_REGISTRY.find((r) => {
    const matchName = r.name.toLowerCase() === normName;
    const matchId = normId ? r.idNumber?.toLowerCase() === normId || r.registryId?.toLowerCase() === normId : true;
    return matchName || matchId;
  }) || null;
}

export function findMockSoloParentRegistration({ name, registrationNumber }) {
  const normName = (name || "").toLowerCase().trim();
  const normReg = (registrationNumber || "").toLowerCase().trim();

  return MOCK_SOLO_PARENT_REGISTRY.find((r) => {
    const matchName = r.name.toLowerCase() === normName;
    const matchReg = normReg ? r.registrationNumber?.toLowerCase() === normReg || r.registryId?.toLowerCase() === normReg : true;
    return matchName || matchReg;
  }) || null;
}

// ─── Seed Data ───────────────────────────────────────────────────────────────

const SEED_REQUESTS = [
  {
    id: "ACORS-SP-2026-000001",
    certificateType: "Solo Parent ID",
    submittedAt: "Aug 24, 2026",
    status: "Approved",
    applicant: {
      fullName: "Maria Santos",
      dob: "1989-05-12",
      sex: "Female",
      civilStatus: "Widowed",
      address: "Purok 3, Casisang, Malaybalay City",
      barangay: "Casisang",
      contactNumber: "0917-223-8899",
      email: "maria.santos@gmail.com",
      occupation: "Self-Employed / Online Vendor",
    },
    soloParentInfo: {
      reason: "Death of Spouse",
      reasonOther: "",
      numberOfChildren: 2,
      yearStarted: "2020",
      employmentStatus: "Self-Employed",
    },
    children: [
      { fullName: "Gabriel Santos", dob: "2015-08-20", relationship: "Son", school: "Casisang Central School" },
      { fullName: "Hannah Santos", dob: "2018-03-14", relationship: "Daughter", school: "Casisang Day Care" },
    ],
    aiValidation: {
      status: "READY FOR REVIEW",
      confidence: "95%",
      checks: [
        { label: "Required fields completed", passed: true },
        { label: "Valid ID uploaded", passed: true },
        { label: "ID readable", passed: true },
        { label: "Applicant name consistency", passed: true },
        { label: "Child information consistency", passed: true },
        { label: "Required documents uploaded", passed: true },
        { label: "Possible duplicate application", passed: true },
        { label: "Missing information", passed: true },
      ],
      recommendation: "Application complete and consistent. Ready for authorized CSWDO assessment.",
    },
    verificationStatus: "Verified & Approved by CSWDO Social Worker",
    certificateNumber: "SPID-2026-00124",
    issueDate: "August 24, 2026",
    documents: [
      { name: "Valid Government ID (PhilSys)", fileName: "philsys_santos.jpg", verified: true },
      { name: "Birth Certificate of Children (PSA)", fileName: "psa_birth_certs_children.pdf", verified: true },
      { name: "Proof of Residence (Barangay Cert)", fileName: "brgy_cert_santos.jpg", verified: true },
      { name: "Death Certificate of Spouse", fileName: "death_cert_spouse.pdf", verified: true },
    ],
  },
  {
    id: "ACORS-SP-2026-000002",
    certificateType: "Certificate of Solo Parenthood",
    submittedAt: "Aug 25, 2026",
    status: "Ready for CSWDO Verification",
    applicant: {
      fullName: "Ana Patricia Reyes",
      dob: "1994-02-18",
      address: "Purok 1, Poblacion, Malaybalay City",
      barangay: "Poblacion",
      contactNumber: "0921-778-3344",
      email: "ana.reyes@gmail.com",
      soloParentId: "SPID-2026-00899",
    },
    soloParentInfo: {
      reason: "Unmarried Parent",
      numberOfChildren: 1,
      childrenNames: "Lucas Reyes",
      yearStarted: "2020",
      purpose: "Government Assistance",
    },
    registryVerification: {
      status: "MATCHED",
      registryId: "SP-2026-00003",
      message: "Solo Parent Record Found & Information Matched. Status Active.",
    },
    aiValidation: {
      status: "DOCUMENTS READY FOR VERIFICATION",
      confidence: "94%",
      checks: [
        { label: "Required fields completed", passed: true },
        { label: "ID uploaded", passed: true },
        { label: "Documents uploaded", passed: true },
        { label: "Name consistency", passed: true },
        { label: "Solo Parent ID consistency", passed: true },
        { label: "Duplicate request check", passed: true },
      ],
      recommendation: "Documents verified. Matched with active CSWDO Solo Parent registry record.",
    },
    verificationStatus: "Pending CSWDO Officer Signature",
    certificateNumber: "SP-CSP-2026-00891",
    issueDate: "August 25, 2026",
    documents: [
      { name: "Valid Government ID", fileName: "driver_license_reyes.jpg", verified: true },
      { name: "Solo Parent ID", fileName: "spid_reyes_card.jpg", verified: true },
      { name: "Proof of Residence", fileName: "brgy_residency_reyes.jpg", verified: true },
    ],
  },
  {
    id: "ACORS-SP-2026-000003",
    certificateType: "Certificate of Registration as Solo Parent",
    submittedAt: "Aug 25, 2026",
    status: "Requires Correction",
    applicant: {
      fullName: "Juan Dela Cruz",
      dob: "1986-11-04",
      address: "Purok 5, Sumpong, Malaybalay City",
      barangay: "Sumpong",
      contactNumber: "0918-662-1100",
      email: "juan.dc@yahoo.com",
      registrationNumber: "SP-REG-2026-001",
    },
    registrationInfo: {
      registrationNumber: "SP-REG-2026-001",
      registrationDate: "February 10, 2026",
      numberOfChildren: 1,
      reason: "Abandonment",
      purpose: "Social Welfare Benefits",
    },
    registryVerification: {
      status: "MATCHED",
      registryId: "SP-REG-2026-001",
      message: "Registration Found. Active Registration.",
    },
    aiValidation: {
      status: "REQUIRES CORRECTION",
      confidence: "80%",
      checks: [
        { label: "Required fields completed", passed: true },
        { label: "ID uploaded", passed: true },
        { label: "Supporting document uploaded", passed: false },
        { label: "Name consistency", passed: true },
        { label: "Registration information consistency", passed: true },
        { label: "Duplicate request check", passed: true },
      ],
      recommendation: "Supporting document / proof of solo parenthood is missing. Please upload the required affidavit or barangay case certification.",
    },
    verificationStatus: "Awaiting Document Correction",
    correctionNote: "Supporting document for solo parent status is missing. Please upload your Barangay Certification / Affidavit of Abandonment.",
    certificateNumber: "SP-CRSP-2026-00412",
    documents: [
      { name: "Valid Government ID", fileName: "umid_delacruz.jpg", verified: true },
      { name: "Solo Parent ID / Proof", fileName: "", verified: false, missing: true },
    ],
  },
];

// ─── localStorage CRUD ───────────────────────────────────────────────────────

export function getSoloParentRequests() {
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

export function saveSoloParentRequest(requestData) {
  try {
    const existing = getSoloParentRequests();
    const updated = [requestData, ...existing];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch {
    return [requestData];
  }
}

export function updateSoloParentRequestStatus(requestId, newStatus, extra = {}) {
  try {
    const existing = getSoloParentRequests();
    const updated = existing.map((r) =>
      r.id === requestId ? { ...r, status: newStatus, ...extra } : r
    );
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch {
    return getSoloParentRequests();
  }
}
