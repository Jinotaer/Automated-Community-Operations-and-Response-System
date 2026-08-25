// src/services/ctoData.js
// City Treasurer's Office — Mock Data & localStorage Service

const STORAGE_KEY = "acors_cto_requests";

// ─── Mock Tax Records ────────────────────────────────────────────────────────

export const mockTaxPaymentRecords = [
  {
    id: "TPR-0001",
    taxpayerName: "Juan Dela Cruz",
    taxType: "Real Property Tax",
    taxYear: "2026",
    amountPaid: "₱2,500.00",
    paymentDate: "August 10, 2026",
    referenceNumber: "RPT-2026-000123",
    propertyRef: "RPT-2026-MC-001",
  },
  {
    id: "TPR-0002",
    taxpayerName: "Maria Santos",
    taxType: "Business Tax",
    taxYear: "2026",
    amountPaid: "₱1,800.00",
    paymentDate: "July 15, 2026",
    referenceNumber: "BT-2026-000456",
    propertyRef: "BT-2026-MS-002",
  },
];

export const mockTaxClearanceRecords = [
  {
    id: "TCR-0001",
    taxpayerName: "Maria Santos",
    taxType: "Real Property Tax",
    taxYear: "2026",
    taxStatus: "NO_OUTSTANDING_BALANCE",
    propertyRef: "RPT-2026-MS-001",
  },
  {
    id: "TCR-0002",
    taxpayerName: "Roberto Lim",
    taxType: "Business Tax",
    taxYear: "2026",
    taxStatus: "OUTSTANDING_BALANCE",
    outstandingAmount: "₱3,200.00",
    propertyRef: "BT-2026-RL-003",
  },
];

// ─── Lookup Helpers ──────────────────────────────────────────────────────────

export function findMockTaxPaymentRecord({ taxpayerName, taxType, taxYear, referenceNumber }) {
  return mockTaxPaymentRecords.find((r) => {
    const nameMatch = r.taxpayerName.toLowerCase().includes(taxpayerName?.toLowerCase() || "");
    const typeMatch = !taxType || r.taxType === taxType;
    const yearMatch = !taxYear || r.taxYear === taxYear;
    const refMatch = !referenceNumber || r.referenceNumber === referenceNumber;
    return nameMatch && typeMatch && yearMatch && refMatch;
  });
}

export function findMockTaxClearanceRecord({ taxpayerName, taxType, taxYear }) {
  return mockTaxClearanceRecords.find((r) => {
    const nameMatch = r.taxpayerName.toLowerCase().includes(taxpayerName?.toLowerCase() || "");
    const typeMatch = !taxType || r.taxType === taxType;
    const yearMatch = !taxYear || r.taxYear === taxYear;
    return nameMatch && typeMatch && yearMatch;
  });
}

// ─── Seed Data ───────────────────────────────────────────────────────────────

const SEED_REQUESTS = [
  {
    id: "ACORS-CTO-2026-000001",
    certificateType: "Community Tax Certificate (Cedula)",
    submittedAt: "Aug 24, 2026",
    status: "Approved",
    applicant: {
      fullName: "Ricardo Mendoza",
      address: "Purok 4, Casisang, Malaybalay City",
      barangay: "Casisang",
      contactNumber: "0917-234-5678",
      email: "r.mendoza@gmail.com",
      civilStatus: "Married",
      occupation: "Teacher",
      employer: "Casisang National High School",
      annualIncome: "₱420,000",
      dob: "1985-03-22",
    },
    aiValidation: {
      status: "PASSED",
      confidence: "96%",
      checks: [
        { label: "Required fields complete", passed: true },
        { label: "Valid ID uploaded", passed: true },
        { label: "ID readability", passed: true },
        { label: "Name consistency", passed: true },
        { label: "Date of birth format", passed: true },
        { label: "Duplicate request check", passed: true },
        { label: "Income information", passed: true },
      ],
      recommendation: "Application meets all requirements. Approved for issuance.",
    },
    taxCalculation: {
      basicCommunityTax: "₱5.00",
      additionalCommunityTax: "₱42.00",
      totalAmount: "₱47.00",
    },
    payment: { method: "GCash", amount: 47, reference: "ACORS-PAY-20260824-001" },
    certificateNumber: "CTO-CEDULA-2026-884201",
    issueDate: "August 24, 2026",
    idUpload: { idType: "PhilSys National ID", fileName: "philid_mendoza.jpg", uploaded: true },
  },
  {
    id: "ACORS-CTO-2026-000002",
    certificateType: "Certificate of Tax Payment",
    submittedAt: "Aug 24, 2026",
    status: "Processing",
    applicant: {
      fullName: "Juan Dela Cruz",
      address: "Purok 3, Casisang, Malaybalay City",
      contactNumber: "0918-992-1134",
      email: "juan.delacruz@gmail.com",
    },
    taxPaymentRecord: {
      taxType: "Real Property Tax",
      taxpayerName: "Juan Dela Cruz",
      propertyRef: "RPT-2026-MC-001",
      paymentDate: "August 10, 2026",
      taxYear: "2026",
      amountPaid: "₱2,500.00",
      receiptNumber: "RPT-2026-000123",
      purpose: "Loan Application",
    },
    aiValidation: {
      status: "PASSED",
      confidence: "94%",
      checks: [
        { label: "Required information complete", passed: true },
        { label: "Valid ID uploaded", passed: true },
        { label: "Receipt/reference uploaded", passed: true },
        { label: "Receipt readability", passed: true },
        { label: "Taxpayer name consistency", passed: true },
        { label: "Payment information consistency", passed: true },
        { label: "Duplicate request check", passed: true },
      ],
      recommendation: "Payment record information verified. Approved for processing.",
    },
    recordVerification: {
      status: "MATCHED",
      registryRef: "RPT-2026-000123, Book No. 12, Page 34",
      message: "Payment record found and information matched with treasury archives.",
    },
    payment: { method: "Maya", amount: 100, reference: "ACORS-PAY-20260824-002" },
    idUpload: { idType: "Driver's License", fileName: "license_delacruz.jpg", uploaded: true, hasReceipt: true },
  },
  {
    id: "ACORS-CTO-2026-000003",
    certificateType: "Certificate of Tax Clearance",
    submittedAt: "Aug 25, 2026",
    status: "Requires LGU Review",
    applicant: {
      fullName: "Roberto Lim",
      address: "Purok 2, Bangcud, Malaybalay City",
      barangay: "Bangcud",
      contactNumber: "0922-445-6789",
      email: "roberto.lim@yahoo.com",
    },
    taxInfo: {
      taxType: "Business Tax",
      propertyRef: "BT-2026-RL-003",
      taxYear: "2026",
      purpose: "Business Permit Renewal",
    },
    aiValidation: {
      status: "REQUIRES VERIFICATION",
      confidence: "81%",
      checks: [
        { label: "Application completeness", passed: true },
        { label: "Required fields", passed: true },
        { label: "Valid ID uploaded", passed: true },
        { label: "ID readability", passed: true },
        { label: "Taxpayer information consistency", passed: false },
        { label: "Duplicate request check", passed: true },
      ],
      recommendation: "Taxpayer has outstanding balance. Requires LGU staff review before issuance.",
    },
    recordVerification: {
      status: "OUTSTANDING_BALANCE",
      outstandingAmount: "₱3,200.00",
      message: "Taxpayer has an outstanding business tax balance. Cannot auto-issue clearance.",
    },
    payment: { method: "Over-the-Counter", amount: 100, reference: "ACORS-PAY-20260825-003" },
    idUpload: { idType: "Voter's ID", fileName: "voterid_lim.jpg", uploaded: true },
  },
];

// ─── localStorage CRUD ───────────────────────────────────────────────────────

export function getCTORequests() {
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

export function saveCTORequest(requestData) {
  try {
    const existing = getCTORequests();
    const updated = [requestData, ...existing];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch {
    return [requestData];
  }
}

export function updateCTORequestStatus(requestId, newStatus, extra = {}) {
  try {
    const existing = getCTORequests();
    const updated = existing.map((r) =>
      r.id === requestId ? { ...r, status: newStatus, ...extra } : r
    );
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch {
    return getCTORequests();
  }
}
