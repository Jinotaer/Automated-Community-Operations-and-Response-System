// src/services/assessorData.js
// City Assessor's Office — Mock Data & Service

const STORAGE_KEY = "acors_assessor_requests";

// ─── Mock Property Database ──────────────────────────────────────────────────

export const MOCK_PROPERTY_DATABASE = [
  {
    propertyId: "PROP-2026-00001",
    owner: "Juan Dela Cruz",
    taxDeclarationNumber: "TD-2026-00125",
    propertyAddress: "Purok 2, Fortich Street, Poblacion, Malaybalay City",
    barangay: "Poblacion",
    propertyType: "Residential",
    classification: "Residential (Class A)",
    lotNumber: "Lot 104-B",
    surveyNumber: "Cad-342",
    areaSqm: "280 sq.m.",
    assessedValue: "₱500,000.00",
    marketValue: "₱2,500,000.00",
    status: "ACTIVE",
  },
  {
    propertyId: "PROP-2026-00002",
    owner: "Maria Santos",
    taxDeclarationNumber: "TD-2026-00235",
    propertyAddress: "Purok 4, Casisang, Malaybalay City",
    barangay: "Casisang",
    propertyType: "Residential",
    classification: "Residential (Class B)",
    lotNumber: "Lot 208-A",
    surveyNumber: "Cad-342",
    areaSqm: "350 sq.m.",
    assessedValue: "₱750,000.00",
    marketValue: "₱3,750,000.00",
    status: "ACTIVE",
  },
  {
    propertyId: "PROP-2026-00003",
    owner: "Pedro Santos",
    taxDeclarationNumber: "TD-2026-00345",
    propertyAddress: "Sayre Highway, Sumpong, Malaybalay City",
    barangay: "Sumpong",
    propertyType: "Commercial",
    classification: "Commercial (Class A)",
    lotNumber: "Lot 512",
    surveyNumber: "Cad-342",
    areaSqm: "520 sq.m.",
    assessedValue: "₱1,250,000.00",
    marketValue: "₱6,250,000.00",
    status: "ACTIVE",
  },
  {
    propertyId: "PROP-2026-00004",
    owner: "Elena Corpuz",
    taxDeclarationNumber: "TD-2026-00488",
    propertyAddress: "Purok 6, Kalasungay, Malaybalay City",
    barangay: "Kalasungay",
    propertyType: "Agricultural",
    classification: "Agricultural (Crop Land)",
    lotNumber: "Lot 89-C",
    surveyNumber: "Cad-102",
    areaSqm: "12,000 sq.m.",
    assessedValue: "₱320,000.00",
    marketValue: "₱1,600,000.00",
    status: "ACTIVE",
  },
];

export function findMockPropertyRecord({ propertyId, taxDeclarationNumber, owner, propertyAddress }) {
  const normPropId = (propertyId || "").toLowerCase().trim();
  const normTd = (taxDeclarationNumber || "").toLowerCase().trim();
  const normOwner = (owner || "").toLowerCase().trim();

  return MOCK_PROPERTY_DATABASE.find((p) => {
    const matchId = normPropId && p.propertyId.toLowerCase() === normPropId;
    const matchTd = normTd && p.taxDeclarationNumber.toLowerCase() === normTd;
    const matchOwner = normOwner && p.owner.toLowerCase() === normOwner;
    return matchId || matchTd || matchOwner;
  }) || null;
}

// ─── Seed Data ───────────────────────────────────────────────────────────────

const SEED_REQUESTS = [
  {
    id: "ACORS-ASSESSOR-2026-000001",
    certificateType: "Certified Copy of Tax Declaration",
    submittedAt: "Aug 24, 2026",
    status: "Approved",
    requester: {
      fullName: "Juan Dela Cruz",
      dob: "1980-05-12",
      address: "Purok 2, Fortich Street, Poblacion, Malaybalay City",
      barangay: "Poblacion",
      contactNumber: "0917-889-2233",
      email: "juan.delacruz@gmail.com",
    },
    property: {
      ownerName: "Juan Dela Cruz",
      propertyAddress: "Purok 2, Fortich Street, Poblacion, Malaybalay City",
      barangay: "Poblacion",
      propertyId: "PROP-2026-00001",
      taxDeclarationNumber: "TD-2026-00125",
      lotNumber: "Lot 104-B",
      surveyNumber: "Cad-342",
      propertyType: "Residential",
      classification: "Residential (Class A)",
      assessedValue: "₱500,000.00",
    },
    aiValidation: {
      status: "READY FOR ASSESSOR REVIEW",
      confidence: "96%",
      checks: [
        { label: "Required fields completed", passed: true },
        { label: "Valid ID uploaded", passed: true },
        { label: "Document readability", passed: true },
        { label: "Tax Declaration Number format", passed: true },
        { label: "Property Identification Number", passed: true },
        { label: "Property owner name consistency", passed: true },
        { label: "Property address consistency", passed: true },
        { label: "Possible duplicate request", passed: true },
        { label: "Required documents uploaded", passed: true },
      ],
      ocrExtracted: {
        owner: "Juan Dela Cruz",
        taxDeclarationNumber: "TD-2026-00125",
        propertyId: "PROP-2026-00001",
        propertyAddress: "Poblacion, Malaybalay City",
        lotNumber: "Lot 104-B",
        classification: "Residential",
        assessedValue: "₱500,000.00",
      },
      recommendation: "Tax declaration record validated with cadastral database. Complete ownership documentation attached.",
    },
    propertyRecordCheck: {
      status: "MATCHED",
      propertyId: "PROP-2026-00001",
      taxDeclarationNumber: "TD-2026-00125",
      message: "Property Record Found & Tax Declaration Matched (Active Assessment).",
    },
    payment: {
      status: "Paid",
      referenceNumber: "ACORS-PAY-20260825-010",
      amount: "₱150.00",
      method: "GCash",
    },
    verificationStatus: "Verified & Certified by City Assessor",
    certificateNumber: "TD-CERT-2026-00125",
    issueDate: "August 24, 2026",
    documents: [
      { name: "Valid Government ID", fileName: "driver_license_delacruz.jpg", verified: true },
      { name: "Previous Tax Declaration", fileName: "tax_dec_2024_delacruz.pdf", verified: true },
      { name: "Proof of Ownership (Transfer Certificate)", fileName: "tct_t10928_delacruz.pdf", verified: true },
    ],
  },
  {
    id: "ACORS-ASSESSOR-2026-000002",
    certificateType: "Property Assessment Certification",
    submittedAt: "Aug 25, 2026",
    status: "Ready for Assessor Verification",
    requester: {
      fullName: "Maria Santos",
      address: "Purok 4, Casisang, Malaybalay City",
      contactNumber: "0917-223-8899",
      email: "maria.santos@gmail.com",
    },
    property: {
      ownerName: "Maria Santos",
      propertyAddress: "Purok 4, Casisang, Malaybalay City",
      barangay: "Casisang",
      propertyId: "PROP-2026-00002",
      taxDeclarationNumber: "TD-2026-00235",
      lotNumber: "Lot 208-A",
      propertyType: "Residential",
      classification: "Residential (Class B)",
      assessedValue: "₱750,000.00",
      purpose: "Bank Requirement",
    },
    aiValidation: {
      status: "READY FOR ASSESSOR VERIFICATION",
      confidence: "95%",
      checks: [
        { label: "Required fields", passed: true },
        { label: "Documents uploaded", passed: true },
        { label: "Document readability", passed: true },
        { label: "Owner name consistency", passed: true },
        { label: "Property address consistency", passed: true },
        { label: "Tax Declaration Number consistency", passed: true },
        { label: "Property ID consistency", passed: true },
        { label: "Possible duplicate request", passed: true },
      ],
      ocrExtracted: {
        owner: "Maria Santos",
        propertyId: "PROP-2026-00002",
        taxDeclarationNumber: "TD-2026-00235",
        propertyAddress: "Casisang, Malaybalay City",
        lotNumber: "Lot 208-A",
        classification: "Residential",
        assessedValue: "₱750,000.00",
      },
      recommendation: "Property assessment verified against local tax mapping records.",
    },
    propertyRecordCheck: {
      status: "MATCHED",
      propertyId: "PROP-2026-00002",
      taxDeclarationNumber: "TD-2026-00235",
      message: "Property Record Found & Assessment Record Verified.",
    },
    payment: {
      status: "Paid",
      amount: "₱150.00",
      referenceNumber: "ACORS-PAY-20260825-011",
      method: "Maya",
    },
    verificationStatus: "Pending Assessor Staff Review",
    certificateNumber: "PAC-2026-00912",
    issueDate: "August 25, 2026",
    documents: [
      { name: "Valid Government ID", fileName: "voters_id_santos.jpg", verified: true },
      { name: "Tax Declaration Copy", fileName: "tax_dec_santos.pdf", verified: true },
      { name: "Proof of Ownership", fileName: "deed_of_sale_santos.pdf", verified: true },
    ],
  },
  {
    id: "ACORS-ASSESSOR-2026-000003",
    certificateType: "Certification of Assessed Value",
    submittedAt: "Aug 25, 2026",
    status: "Requires Correction",
    requester: {
      fullName: "Pedro Santos",
      address: "Sayre Highway, Sumpong, Malaybalay City",
      contactNumber: "0920-441-9988",
      email: "pedro.santos@gmail.com",
    },
    property: {
      ownerName: "Pedro Santos",
      propertyAddress: "Sayre Highway, Sumpong, Malaybalay City",
      barangay: "Sumpong",
      propertyId: "PROP-2026-00003",
      taxDeclarationNumber: "TD-2026-00345",
      propertyType: "Commercial",
      classification: "Commercial (Class A)",
      assessedValue: "₱1,250,000.00",
      purpose: "Bank Loan",
    },
    aiValidation: {
      status: "REQUIRES CORRECTION",
      confidence: "82%",
      checks: [
        { label: "Required information", passed: true },
        { label: "Document completeness", passed: false },
        { label: "Document readability", passed: true },
        { label: "Owner name consistency", passed: true },
        { label: "Property address consistency", passed: true },
        { label: "Property ID consistency", passed: true },
        { label: "Tax Declaration consistency", passed: true },
        { label: "Possible duplicate request", passed: true },
      ],
      ocrExtracted: {
        owner: "Pedro Santos",
        propertyId: "PROP-2026-00003",
        taxDeclarationNumber: "TD-2026-00345",
        propertyAddress: "Sumpong, Malaybalay City",
        classification: "Commercial",
        assessedValue: "₱1,250,000.00",
      },
      recommendation: "Proof of Ownership / Title copy is missing. Please upload your title or deed of sale.",
    },
    propertyRecordCheck: {
      status: "MATCHED",
      propertyId: "PROP-2026-00003",
      message: "Property Record Found (Commercial Property).",
    },
    payment: {
      status: "Paid",
      amount: "₱150.00",
      referenceNumber: "ACORS-PAY-20260825-012",
      method: "Online Banking",
    },
    verificationStatus: "Awaiting Document Correction",
    correctionNote: "Proof of Ownership (Transfer Certificate of Title or Deed of Absolute Sale) is missing. Please upload a clear copy to verify ownership for loan certification.",
    certificateNumber: "CAV-2026-00331",
    documents: [
      { name: "Valid Government ID", fileName: "passport_pedro.jpg", verified: true },
      { name: "Existing Tax Declaration", fileName: "td_pedro_commercial.pdf", verified: true },
      { name: "Proof of Ownership", fileName: "", verified: false, missing: true },
    ],
  },
];

// ─── localStorage CRUD ───────────────────────────────────────────────────────

export function getAssessorRequests() {
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

export function saveAssessorRequest(requestData) {
  try {
    const existing = getAssessorRequests();
    const updated = [requestData, ...existing];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch {
    return [requestData];
  }
}

export function updateAssessorRequestStatus(requestId, newStatus, extra = {}) {
  try {
    const existing = getAssessorRequests();
    const updated = existing.map((r) =>
      r.id === requestId ? { ...r, status: newStatus, ...extra } : r
    );
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch {
    return getAssessorRequests();
  }
}
