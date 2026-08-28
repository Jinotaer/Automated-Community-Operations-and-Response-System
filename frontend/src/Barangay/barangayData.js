// src/Barangay/barangayData.js
import { getStoredComplaints } from "../services/complaintsStore";

export const BARANGAY_ACCOUNTS = [
  {
    barangayName: "Barangay Casisang",
    slug: "casisang",
    captain: "Hon. Juan Dela Cruz",
    staffName: "Maria Santos",
    email: "casisang@malaybalay.gov.ph",
    password: "acors2025",
    phone: "(088) 813-2001",
    address: "Barangay Hall, Casisang, Malaybalay City",
    population: "18,450",
  },
  {
    barangayName: "Barangay Sumpong",
    slug: "sumpong",
    captain: "Hon. Maria Santos",
    staffName: "Arnold Reyes",
    email: "sumpong@malaybalay.gov.ph",
    password: "acors2025",
    phone: "(088) 813-2002",
    address: "Barangay Hall, Sumpong, Malaybalay City",
    population: "14,230",
  },
  {
    barangayName: "Barangay Kalasungay",
    slug: "kalasungay",
    captain: "Hon. Pedro Reyes",
    staffName: "Carlo Mendez",
    email: "kalasungay@malaybalay.gov.ph",
    password: "acors2025",
    phone: "(088) 813-2003",
    address: "Barangay Hall, Kalasungay, Malaybalay City",
    population: "10,875",
  },
  {
    barangayName: "Barangay Aglayan",
    slug: "aglayan",
    captain: "Hon. Ana Garcia",
    staffName: "Elena Bautista",
    email: "aglayan@malaybalay.gov.ph",
    password: "acors2025",
    phone: "(088) 813-2004",
    address: "Barangay Hall, Aglayan, Malaybalay City",
    population: "9,640",
  },
  {
    barangayName: "Barangay Bangcud",
    slug: "bangcud",
    captain: "Hon. Carlo Mendoza",
    staffName: "Reynaldo Diaz",
    email: "bangcud@malaybalay.gov.ph",
    password: "acors2025",
    phone: "(088) 813-2005",
    address: "Barangay Hall, Bangcud, Malaybalay City",
    population: "7,520",
  },
];

export function getActiveBarangaySession() {
  try {
    const raw = localStorage.getItem("acors_barangay_session");
    if (raw) return JSON.parse(raw);
  } catch (err) {
    console.error("Error reading barangay session:", err);
  }
  return BARANGAY_ACCOUNTS[0]; // Default to Casisang
}

export function setActiveBarangaySession(account) {
  localStorage.setItem("acors_barangay_session", JSON.stringify(account));
}

export function getBarangayStats(barangayName = null) {
  const complaints = getStoredComplaints();
  const filtered = barangayName
    ? complaints.filter((c) =>
        c.barangay.toLowerCase().includes(barangayName.toLowerCase()) ||
        barangayName.toLowerCase().includes(c.barangay.toLowerCase())
      )
    : complaints;

  const localComplaints = filtered.filter(
    (c) =>
      c.status !== "ESCALATED TO LGU" &&
      c.status !== "LGU REVIEW" &&
      c.status !== "LGU ACCEPTED" &&
      c.status !== "LGU IN PROGRESS" &&
      !c.escalation &&
      c.status !== "RESOLVED"
  );

  const activeEscalatedComplaints = filtered.filter(
    (c) =>
      (c.status === "ESCALATED TO LGU" ||
      c.status === "LGU REVIEW" ||
      c.status === "LGU ACCEPTED" ||
      c.status === "LGU IN PROGRESS" ||
      Boolean(c.escalation)) &&
      c.status !== "RESOLVED"
  );

  const allResolvedComplaints = filtered.filter((c) => c.status === "RESOLVED");

  const total = localComplaints.length;
  const pendingReview = localComplaints.filter(
    (c) =>
      c.status === "BARANGAY REVIEW" ||
      c.status === "SUBMITTED" ||
      c.status === "INFORMATION SUBMITTED"
  ).length;
  const inProgress = localComplaints.filter(
    (c) =>
      c.status === "IN PROGRESS" ||
      c.status === "ACCEPTED" ||
      c.status === "INFORMATION REQUIRED"
  ).length;
  const resolved = allResolvedComplaints.length;
  const escalated = activeEscalatedComplaints.length;

  return {
    total,
    pendingReview,
    inProgress,
    resolved,
    escalated,
  };
}
