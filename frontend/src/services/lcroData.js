// src/services/lcroData.js

const LCRO_STORAGE_KEY = "acors_lcro_requests";

export const mockMarriageRecords = [
  {
    recordId: "MARR-0001",
    husbandName: "Juan Dela Cruz",
    wifeName: "Maria Santos",
    dateOfMarriage: "2020-06-15",
    placeOfMarriage: "Malaybalay City, Bukidnon",
    registryBook: "Book No. 18, Page 72, Registry No. 20-0194",
    solemnizingOfficer: "Hon. Judge Roberto C. Alcantara",
    status: "VALID",
  },
  {
    recordId: "MARR-0002",
    husbandName: "Gabriel Gomez Ramos",
    wifeName: "Elena Grace Garcia",
    dateOfMarriage: "2019-11-24",
    placeOfMarriage: "Malaybalay City, Bukidnon",
    registryBook: "Book No. 17, Page 104, Registry No. 19-0882",
    solemnizingOfficer: "Rev. Fr. Emmanuel Santos",
    status: "VALID",
  },
  {
    recordId: "MARR-0003",
    husbandName: "Mark Anthony Perez",
    wifeName: "Angelica Joy Mendoza",
    dateOfMarriage: "2022-02-14",
    placeOfMarriage: "Malaybalay City, Bukidnon",
    registryBook: "Book No. 20, Page 33, Registry No. 22-0051",
    solemnizingOfficer: "City Mayor Florencio Flores Jr.",
    status: "VALID",
  },
];

export function findMockMarriageRecord(husband, wife, date) {
  if (!husband && !wife) return null;
  const hNorm = (husband || "").trim().toLowerCase();
  const wNorm = (wife || "").trim().toLowerCase();
  
  return mockMarriageRecords.find((rec) => {
    const recH = rec.husbandName.toLowerCase();
    const recW = rec.wifeName.toLowerCase();
    const namesMatch = (recH.includes(hNorm) || hNorm.includes(recH)) && (recW.includes(wNorm) || wNorm.includes(recW));
    return namesMatch;
  });
}

export const mockDeathRecords = [
  {
    recordId: "DEATH-0001",
    deceasedName: "Pedro Dela Cruz",
    dob: "1950-01-10",
    dateOfDeath: "2025-08-15",
    placeOfDeath: "Malaybalay City, Bukidnon",
    sex: "Male",
    registryBook: "Book No. 24, Page 88, Registry No. 25-0312",
    certifyingOfficer: "Dr. Vicente M. Alonto, MD",
    status: "VALID",
  },
  {
    recordId: "DEATH-0002",
    deceasedName: "Teresa Garcia Ramos",
    dob: "1962-03-22",
    dateOfDeath: "2024-11-10",
    placeOfDeath: "Malaybalay City, Bukidnon",
    sex: "Female",
    registryBook: "Book No. 23, Page 14, Registry No. 24-0891",
    certifyingOfficer: "Dr. Maria Elena Cruz, MD",
    status: "VALID",
  },
  {
    recordId: "DEATH-0003",
    deceasedName: "Manuel Bautista Santos",
    dob: "1945-07-04",
    dateOfDeath: "2025-02-18",
    placeOfDeath: "Malaybalay City, Bukidnon",
    sex: "Male",
    registryBook: "Book No. 24, Page 03, Registry No. 25-0045",
    certifyingOfficer: "Dr. Roberto S. Tan, MD",
    status: "VALID",
  },
];

export function findMockDeathRecord(deceasedName, dod) {
  if (!deceasedName) return null;
  const dNorm = deceasedName.trim().toLowerCase();
  
  return mockDeathRecords.find((rec) => {
    const recD = rec.deceasedName.toLowerCase();
    const nameMatch = recD.includes(dNorm) || dNorm.includes(recD);
    return nameMatch;
  });
}

export const initialLCRORequests = [
  {
    id: "ACORS-LCRO-2026-000001",
    certificateType: "Birth Certificate – Certified Copy",
    submittedAt: "2026-08-24 14:32",
    status: "Approved",
    applicant: {
      fullName: "Maria Clara Santos",
      address: "Purok 4, Poblacion, Malaybalay City, Bukidnon",
      contactNumber: "0917-882-9912",
      email: "maria.santos@gmail.com",
      relationship: "Self",
    },
    record: {
      fullName: "Maria Clara Santos",
      fatherName: "Antonio Rivera Santos",
      motherMaidenName: "Clara Luna Reyes",
      dob: "1998-05-14",
      pob: "Malaybalay City, Bukidnon",
      copies: 2,
      purpose: "Passport Application / DFA",
    },
    idUpload: {
      idType: "Philippine National ID (PhilID)",
      fileName: "philid_front_maria_santos.jpg",
      readable: true,
      hasAuthorization: false,
    },
    aiValidation: {
      status: "PASSED",
      confidence: "96%",
      checks: [
        { label: "Application completeness", passed: true },
        { label: "Required fields", passed: true },
        { label: "ID detected", passed: true },
        { label: "ID readable", passed: true },
        { label: "Information consistency", passed: true },
        { label: "Duplicate request check", passed: true },
      ],
      recommendation: "PASSED",
    },
    recordVerification: {
      status: "MATCHED",
      registryBook: "Book No. 42, Page 119, Registry No. 98-0412",
      message: "Civil Registry record exact match found in LCRO Registry Database.",
    },
    payment: {
      amount: 100,
      method: "GCash",
      reference: "ACORS-PAY-20260824-001",
      paidAt: "2026-08-24 14:35",
      status: "Confirmed",
    },
    certificateNumber: "LCRO-BC-2026-981244",
    issueDate: "August 24, 2026",
  },
  {
    id: "ACORS-LCRO-2026-000002",
    certificateType: "Marriage Certificate – Certified Copy",
    submittedAt: "2026-08-25 08:30",
    status: "Approved",
    applicant: {
      fullName: "Juan Dela Cruz",
      address: "Purok 3, Casisang, Malaybalay City",
      contactNumber: "0918-992-1134",
      email: "juan.delacruz@gmail.com",
      relationship: "Self",
    },
    marriageRecord: {
      husbandName: "Juan Dela Cruz",
      wifeName: "Maria Santos",
      dateOfMarriage: "2020-06-15",
      placeOfMarriage: "Malaybalay City, Bukidnon",
      copies: 1,
      purpose: "Government Transaction",
    },
    idUpload: {
      idType: "Philippine National ID (PhilID)",
      fileName: "philid_juandelacruz.jpg",
      fileType: "image/jpeg",
      readable: true,
      hasAuthorization: false,
    },
    aiValidation: {
      status: "PASSED",
      confidence: "96%",
      checks: [
        { label: "Application completeness", passed: true },
        { label: "Required fields", passed: true },
        { label: "ID detected", passed: true },
        { label: "ID readable", passed: true },
        { label: "Information consistency", passed: true },
        { label: "Duplicate request check", passed: true },
      ],
      recommendation: "PASSED",
    },
    recordVerification: {
      status: "MATCHED",
      recordId: "MARR-0001",
      registryBook: "Book No. 18, Page 72, Registry No. 20-0194",
      message: "✓ Marriage Record Found — Exact Civil Registry Match in Book 18",
    },
    payment: {
      amount: 100,
      method: "GCash",
      reference: "ACORS-PAY-20260825-002",
      paidAt: "2026-08-25 08:33",
      status: "Confirmed",
    },
    certificateNumber: "LCRO-MC-2026-000194",
    issueDate: "August 25, 2026",
  },
  {
    id: "ACORS-LCRO-2026-000003",
    certificateType: "Birth Certificate – Certified Copy",
    submittedAt: "2026-08-25 08:15",
    status: "Requires LGU Review",
    applicant: {
      fullName: "Joshua De Leon",
      address: "Purok 2, Casisang, Malaybalay City",
      contactNumber: "0928-331-4456",
      email: "jdeleon.dev@gmail.com",
      relationship: "Father",
    },
    record: {
      fullName: "Liam De Leon",
      fatherName: "Joshua Cruz De Leon",
      motherMaidenName: "Elena Grace Garcia",
      dob: "2021-11-03",
      pob: "Malaybalay City, Bukidnon",
      copies: 1,
      purpose: "School Requirement",
    },
    idUpload: {
      idType: "Driver's License",
      fileName: "drivers_license_deleon.jpg",
      readable: true,
      hasAuthorization: true,
    },
    aiValidation: {
      status: "FLAGGED",
      confidence: "78%",
      checks: [
        { label: "Application completeness", passed: true },
        { label: "Required fields", passed: true },
        { label: "ID detected", passed: true },
        { label: "ID readable", passed: true },
        { label: "Information consistency", passed: false, note: "Middle name variance detected on father's registry" },
        { label: "Duplicate request check", passed: true },
      ],
      recommendation: "REQUIRES LGU REVIEW",
    },
    recordVerification: {
      status: "UNRESOLVED",
      registryBook: "Book No. 65, Page 042",
      message: "⚠️ Information mismatch detected — requires manual archive check by Civil Registrar.",
    },
    payment: {
      amount: 100,
      method: "Maya",
      reference: "ACORS-PAY-20260825-003",
      paidAt: "2026-08-25 08:18",
      status: "Confirmed",
    },
    certificateNumber: null,
    issueDate: null,
  },
  {
    id: "ACORS-LCRO-2026-000004",
    certificateType: "Marriage Certificate – Certified Copy",
    submittedAt: "2026-08-25 09:12",
    status: "Requires LGU Review",
    applicant: {
      fullName: "Elena Grace Garcia",
      address: "Purok 5, Sumpong, Malaybalay City",
      contactNumber: "0939-551-8899",
      email: "elena.garcia@gmail.com",
      relationship: "Spouse",
    },
    marriageRecord: {
      husbandName: "Gabriel Gomez Ramos",
      wifeName: "Elena Grace Garcia",
      dateOfMarriage: "2019-11-24",
      placeOfMarriage: "Malaybalay City, Bukidnon",
      copies: 2,
      purpose: "Passport/Travel",
    },
    idUpload: {
      idType: "Philippine Passport",
      fileName: "passport_elena_garcia.jpg",
      fileType: "image/jpeg",
      readable: true,
      hasAuthorization: false,
    },
    aiValidation: {
      status: "FLAGGED",
      confidence: "74%",
      checks: [
        { label: "Application completeness", passed: true },
        { label: "Required fields", passed: true },
        { label: "ID detected", passed: true },
        { label: "ID readable", passed: true },
        { label: "Information consistency", passed: false, note: "Slight middle initial spelling variance in marriage contract." },
        { label: "Duplicate request check", passed: true },
      ],
      recommendation: "REQUIRES LGU REVIEW",
    },
    recordVerification: {
      status: "UNRESOLVED",
      recordId: "MARR-0002",
      registryBook: "Book No. 17, Page 104, Registry No. 19-0882",
      message: "⚠️ Verification flagged for staff endorsement due to name format difference.",
    },
    payment: {
      amount: 200,
      method: "MAYA",
      reference: "ACORS-PAY-20260825-004",
      paidAt: "2026-08-25 09:15",
      status: "Confirmed",
    },
    certificateNumber: null,
    issueDate: null,
  },
  {
    id: "ACORS-LCRO-2026-000005",
    certificateType: "Death Certificate – Certified Copy",
    submittedAt: "2026-08-25 09:40",
    status: "Approved",
    applicant: {
      fullName: "Juan Dela Cruz",
      address: "Purok 3, Casisang, Malaybalay City",
      contactNumber: "0918-992-1134",
      email: "juan.delacruz@gmail.com",
      relationship: "Child",
    },
    deathRecord: {
      deceasedName: "Pedro Dela Cruz",
      dob: "1950-01-10",
      dateOfDeath: "2025-08-15",
      placeOfDeath: "Malaybalay City, Bukidnon",
      sex: "Male",
      copies: 2,
      purpose: "Estate/Inheritance",
    },
    idUpload: {
      idType: "Philippine National ID (PhilID)",
      fileName: "philid_juan_delacruz.jpg",
      fileType: "image/jpeg",
      readable: true,
      hasAuthorization: false,
    },
    aiValidation: {
      status: "PASSED",
      confidence: "96%",
      checks: [
        { label: "Application completeness", passed: true },
        { label: "Required fields", passed: true },
        { label: "Valid ID detected", passed: true },
        { label: "ID readable", passed: true },
        { label: "Information consistent", passed: true },
        { label: "Requirements complete", passed: true },
      ],
      recommendation: "PASSED",
    },
    recordVerification: {
      status: "MATCHED",
      recordId: "DEATH-0001",
      registryBook: "Book No. 24, Page 88, Registry No. 25-0312",
      message: "✓ Death Record Found — Exact Civil Registry Match in Book 24",
    },
    payment: {
      amount: 100,
      method: "GCash",
      reference: "ACORS-PAY-20260825-005",
      paidAt: "2026-08-25 09:43",
      status: "Confirmed",
    },
    certificateNumber: "LCRO-DC-2026-000312",
    issueDate: "August 25, 2026",
  },
  {
    id: "ACORS-LCRO-2026-000006",
    certificateType: "Death Certificate – Certified Copy",
    submittedAt: "2026-08-25 10:05",
    status: "Requires LGU Review",
    applicant: {
      fullName: "Carlos Ramos",
      address: "Purok 1, Poblacion, Malaybalay City",
      contactNumber: "0917-440-2211",
      email: "carlos.ramos@gmail.com",
      relationship: "Spouse",
    },
    deathRecord: {
      deceasedName: "Teresa Garcia Ramos",
      dob: "1962-03-22",
      dateOfDeath: "2024-11-10",
      placeOfDeath: "Malaybalay City, Bukidnon",
      sex: "Female",
      copies: 1,
      purpose: "Insurance Claim",
    },
    idUpload: {
      idType: "Driver's License",
      fileName: "carlos_license.jpg",
      fileType: "image/jpeg",
      readable: true,
      hasAuthorization: false,
    },
    aiValidation: {
      status: "FLAGGED",
      confidence: "81%",
      checks: [
        { label: "Application completeness", passed: true },
        { label: "Required fields", passed: true },
        { label: "Valid ID detected", passed: true },
        { label: "ID readable", passed: true },
        { label: "Information consistent", passed: false, note: "Date of death variance: submitted Nov 10 vs Nov 11 in local hospital log." },
        { label: "Requirements complete", passed: true },
      ],
      recommendation: "REQUIRES LGU REVIEW",
    },
    recordVerification: {
      status: "UNRESOLVED",
      recordId: "DEATH-0002",
      registryBook: "Book No. 23, Page 14, Registry No. 24-0891",
      message: "⚠️ Hospital registry record date variance — pending LCRO clerk check.",
    },
    payment: {
      amount: 100,
      method: "Maya",
      reference: "ACORS-PAY-20260825-006",
      paidAt: "2026-08-25 10:08",
      status: "Confirmed",
    },
    certificateNumber: null,
    issueDate: null,
  },
];

export function getLCRORequests() {
  try {
    const saved = localStorage.getItem(LCRO_STORAGE_KEY);
    if (!saved) {
      localStorage.setItem(LCRO_STORAGE_KEY, JSON.stringify(initialLCRORequests));
      return initialLCRORequests;
    }
    const parsed = JSON.parse(saved);
    // Ensure all seeded requests (such as Marriage & Death Certificate requests) exist in the current store
    const existingIds = new Set(parsed.map((r) => r.id));
    const missingSeeds = initialLCRORequests.filter((seed) => !existingIds.has(seed.id));
    if (missingSeeds.length > 0) {
      const merged = [...parsed, ...missingSeeds];
      localStorage.setItem(LCRO_STORAGE_KEY, JSON.stringify(merged));
      return merged;
    }
    return parsed;
  } catch {
    return initialLCRORequests;
  }
}

export function saveLCRORequest(newRequest) {
  try {
    const current = getLCRORequests();
    const existingIndex = current.findIndex((r) => r.id === newRequest.id);
    let updated;
    if (existingIndex >= 0) {
      updated = [...current];
      updated[existingIndex] = { ...updated[existingIndex], ...newRequest };
    } else {
      updated = [newRequest, ...current];
    }
    localStorage.setItem(LCRO_STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.error("Failed to save LCRO request:", err);
    return [];
  }
}

export function updateLCRORequestStatus(id, newStatus, extraData = {}) {
  try {
    const current = getLCRORequests();
    const updated = current.map((item) => {
      if (item.id === id) {
        return {
          ...item,
          status: newStatus,
          ...extraData,
          updatedAt: new Date().toISOString(),
        };
      }
      return item;
    });
    localStorage.setItem(LCRO_STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.error("Failed to update status:", err);
    return [];
  }
}
