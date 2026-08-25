// src/services/bploData.js
// Business Permits and Licensing Office (BPLO) — Mock Data & Service

const STORAGE_KEY = "acors_bplo_requests";

// ─── Mock Business Database ──────────────────────────────────────────────────

export const MOCK_BUSINESS_DATABASE = [
  {
    businessName: "Juan's Coffee Shop",
    owner: "Juan Dela Cruz",
    permitNumber: "BP-2025-00123",
    businessType: "Sole Proprietorship",
    nature: "Food and Restaurant",
    address: "Purok 2, Fortich Street, Poblacion, Malaybalay City",
    barangay: "Poblacion",
    registrationNumber: "DTI-2023-098812",
    employees: 6,
    status: "ACTIVE",
    previousYear: "2025",
  },
  {
    businessName: "Juan's Hardware Store",
    owner: "Juan Dela Cruz",
    permitNumber: "BP-2025-00456",
    businessType: "Sole Proprietorship",
    nature: "Retail",
    address: "Purok 4, Sayre Highway, Casisang, Malaybalay City",
    barangay: "Casisang",
    registrationNumber: "DTI-2022-044192",
    employees: 4,
    status: "ACTIVE",
    previousYear: "2025",
  },
  {
    businessName: "Bukidnon Agro-Tech Ventures Inc.",
    owner: "Elena Corpuz",
    permitNumber: "BP-2025-00789",
    businessType: "Corporation",
    nature: "Agriculture",
    address: "Purok 6, Sumpong, Malaybalay City",
    barangay: "Sumpong",
    registrationNumber: "SEC-CS2020-09883",
    employees: 18,
    status: "ACTIVE",
    previousYear: "2025",
  },
];

export function findMockBusinessRecord({ businessName, permitNumber, owner }) {
  const normName = (businessName || "").toLowerCase().trim();
  const normPermit = (permitNumber || "").toLowerCase().trim();
  const normOwner = (owner || "").toLowerCase().trim();

  return MOCK_BUSINESS_DATABASE.find((b) => {
    const matchPermit = normPermit && b.permitNumber.toLowerCase() === normPermit;
    const matchName = normName && b.businessName.toLowerCase() === normName;
    const matchOwner = normOwner && b.owner.toLowerCase() === normOwner;
    return matchPermit || (matchName && matchOwner) || matchName;
  }) || null;
}

// ─── Seed Data ───────────────────────────────────────────────────────────────

const SEED_REQUESTS = [
  {
    id: "ACORS-BPLO-2026-000001",
    certificateType: "Business Permit Renewal",
    submittedAt: "Aug 24, 2026",
    status: "Approved",
    owner: {
      fullName: "Juan Dela Cruz",
      ownerType: "Individual / Sole Owner",
      address: "Purok 2, Fortich Street, Poblacion, Malaybalay City",
      barangay: "Poblacion",
      contactNumber: "0917-889-2233",
      email: "juan.delacruz@gmail.com",
    },
    business: {
      businessName: "Juan's Coffee Shop",
      businessAddress: "Purok 2, Fortich Street, Poblacion, Malaybalay City",
      barangay: "Poblacion",
      businessType: "Sole Proprietorship",
      nature: "Food and Restaurant",
      registrationNumber: "DTI-2023-098812",
      existingPermitNumber: "BP-2025-00123",
      previousPermitYear: "2025",
      numberOfEmployees: 6,
      contactNumber: "0917-889-2233",
    },
    aiValidation: {
      status: "READY FOR VERIFICATION",
      confidence: "96%",
      checks: [
        { label: "Required fields completed", passed: true },
        { label: "Valid ID uploaded", passed: true },
        { label: "Previous permit uploaded", passed: true },
        { label: "Business registration document uploaded", passed: true },
        { label: "Document readability", passed: true },
        { label: "Business name consistency", passed: true },
        { label: "Business owner consistency", passed: true },
        { label: "Business permit number consistency", passed: true },
        { label: "Possible duplicate application", passed: true },
      ],
      recommendation: "Application complete and consistent. Matched with active BPLO business permit records.",
    },
    businessRecordCheck: {
      status: "MATCHED",
      permitNumber: "BP-2025-00123",
      message: "Business Record Found & Matched (Active Status).",
    },
    payment: {
      status: "Paid",
      referenceNumber: "ACORS-PAY-20260825-004",
      amount: "₱2,450.00",
      method: "GCash",
      date: "August 24, 2026",
    },
    verificationStatus: "Verified & Approved by BPLO Licensing Officer",
    certificateNumber: "BP-2026-00123-R",
    issueDate: "August 24, 2026",
    validUntil: "December 31, 2026",
    documents: [
      { name: "Valid Government ID", fileName: "driver_license_delacruz.jpg", verified: true },
      { name: "Previous Business Permit (2025)", fileName: "business_permit_2025.pdf", verified: true },
      { name: "DTI Certificate of Registration", fileName: "dti_registration_juancoffee.pdf", verified: true },
      { name: "Barangay Business Clearance", fileName: "brgy_clearance_poblacion.jpg", verified: true },
    ],
  },
  {
    id: "ACORS-BPLO-2026-000002",
    certificateType: "Certificate of Business Closure",
    submittedAt: "Aug 25, 2026",
    status: "Ready for BPLO Verification",
    owner: {
      fullName: "Juan Dela Cruz",
      address: "Purok 4, Casisang, Malaybalay City",
      contactNumber: "0917-889-2233",
      email: "juan.delacruz@gmail.com",
    },
    business: {
      businessName: "Juan's Coffee Shop",
      permitNumber: "BP-2025-00123",
      businessAddress: "Purok 2, Fortich Street, Poblacion, Malaybalay City",
      barangay: "Poblacion",
      nature: "Food and Restaurant",
      dateStopped: "2026-06-30",
      reason: "Relocation",
    },
    aiValidation: {
      status: "READY FOR BPLO REVIEW",
      confidence: "94%",
      checks: [
        { label: "Required fields completed", passed: true },
        { label: "Valid ID uploaded", passed: true },
        { label: "Business permit uploaded", passed: true },
        { label: "Business registration document uploaded", passed: true },
        { label: "Document readability", passed: true },
        { label: "Business name consistency", passed: true },
        { label: "Permit number consistency", passed: true },
        { label: "Possible duplicate request", passed: true },
      ],
      recommendation: "Closure request verified with existing business license records. Awaiting BPLO recording.",
    },
    businessRecordCheck: {
      status: "MATCHED",
      permitNumber: "BP-2025-00123",
      message: "Business Found & Permit Found (Active Status).",
    },
    payment: {
      status: "FREE",
      amount: "FREE",
    },
    verificationStatus: "Pending BPLO Officer Review",
    certificateNumber: "BC-2026-00912",
    issueDate: "August 25, 2026",
    documents: [
      { name: "Valid Government ID", fileName: "driver_license_delacruz.jpg", verified: true },
      { name: "Business Permit", fileName: "business_permit_2025.pdf", verified: true },
      { name: "Barangay Clearance for Closure", fileName: "brgy_closure_clearance.pdf", verified: true },
    ],
  },
  {
    id: "ACORS-BPLO-2026-000003",
    certificateType: "Certificate of Business Retirement",
    submittedAt: "Aug 25, 2026",
    status: "Requires Correction",
    owner: {
      fullName: "Juan Dela Cruz",
      address: "Purok 4, Sayre Highway, Casisang, Malaybalay City",
      contactNumber: "0917-889-2233",
      email: "juan.delacruz@gmail.com",
    },
    business: {
      businessName: "Juan's Hardware Store",
      permitNumber: "BP-2025-00456",
      businessAddress: "Purok 4, Sayre Highway, Casisang, Malaybalay City",
      barangay: "Casisang",
      nature: "Retail",
      businessType: "Sole Proprietorship",
      dateRetirement: "2026-07-15",
      reason: "Owner Retirement",
    },
    aiValidation: {
      status: "REQUIRES CORRECTION",
      confidence: "82%",
      checks: [
        { label: "Required fields completed", passed: true },
        { label: "Valid ID uploaded", passed: true },
        { label: "Permit uploaded", passed: true },
        { label: "Registration document uploaded", passed: false },
        { label: "Document readability", passed: true },
        { label: "Business name consistency", passed: true },
        { label: "Permit number consistency", passed: true },
        { label: "Owner consistency", passed: true },
      ],
      recommendation: "Barangay Business Clearance / Retirement Affidavit is missing. Please upload the required clearance.",
    },
    businessRecordCheck: {
      status: "MATCHED",
      permitNumber: "BP-2025-00456",
      message: "Business Record Found (Juan's Hardware Store).",
    },
    payment: {
      status: "FREE",
      amount: "FREE",
    },
    verificationStatus: "Awaiting Document Correction",
    correctionNote: "Barangay Business Retirement Clearance is missing. Please upload your Barangay Certification of Business Retirement.",
    certificateNumber: "BR-2026-00331",
    documents: [
      { name: "Valid Government ID", fileName: "driver_license_delacruz.jpg", verified: true },
      { name: "Existing Business Permit", fileName: "bp_hardware_2025.pdf", verified: true },
      { name: "Barangay Clearance", fileName: "", verified: false, missing: true },
    ],
  },
];

// ─── localStorage CRUD ───────────────────────────────────────────────────────

export function getBPLORequests() {
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

export function saveBPLORequest(requestData) {
  try {
    const existing = getBPLORequests();
    const updated = [requestData, ...existing];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch {
    return [requestData];
  }
}

export function updateBPLORequestStatus(requestId, newStatus, extra = {}) {
  try {
    const existing = getBPLORequests();
    const updated = existing.map((r) =>
      r.id === requestId ? { ...r, status: newStatus, ...extra } : r
    );
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch {
    return getBPLORequests();
  }
}
