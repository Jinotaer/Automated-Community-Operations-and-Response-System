// src/services/complaintsStore.js
import potholeImg from "../assets/pothole.jpg";
import garbageImg from "../assets/garbage-sample.jpg";
import lightImg from "../assets/light.jpg";
import highwayImg from "../assets/national-highway.jpg";
import floodImg from "../assets/health-flood.jpg";

const STORAGE_KEY = "acors_complaints_v3";

export const LGU_OFFICE_ROUTING = {
  "Road Damage": "City Engineering Office",
  "Potholes": "City Engineering Office",
  "Infrastructure": "City Engineering Office",
  "Broken Streetlights": "City Engineering Office",
  "Illegal Dumping": "City Environment and Natural Resources Office",
  "Garbage and Waste": "City Environment and Natural Resources Office",
  "Garbage Accumulation": "City Environment and Natural Resources Office",
  "Flooding": "City Disaster Risk Reduction and Management Office",
  "Disaster Concern": "City Disaster Risk Reduction and Management Office",
  "Fallen Trees": "City Disaster Risk Reduction and Management Office",
  "Traffic": "Traffic Management Center",
  "Traffic Obstruction": "Traffic Management Center",
  "Public Health": "City Health Office",
  "Sanitation": "City Health Office",
  "Water Service Issues": "City Engineering Office",
};

export function getRecommendedLguOffice(category = "") {
  return LGU_OFFICE_ROUTING[category] || "City Engineering Office";
}

export const ESCALATION_REASONS = [
  "Beyond Barangay Authority",
  "Requires Specialized Equipment",
  "Requires Specialized Personnel",
  "Requires LGU Funding",
  "Major Infrastructure Work",
  "Requires LGU Intervention",
  "Other",
];

const INITIAL_COMPLAINTS = [
  // ==========================================
  // 10 BARANGAY-LEVEL COMPLAINTS (TIER 1)
  // ==========================================
  {
    id: "ACORS-CMP-2026-00101",
    trackingNumber: "ACORS-CMP-2026-00101",
    residentName: "Maria Santos",
    residentContact: "0917-234-5678",
    residentEmail: "maria.santos@example.com",
    title: "Clogged community side-gutter along Purok 2",
    description: "Silt and fallen leaves accumulated in the roadside canal causing minor puddles during rain showers.",
    category: "Flooding",
    severity: "Low",
    priority: "Low",
    barangay: "Barangay Casisang",
    location: "Purok 2, Casisang, Malaybalay City",
    coordinates: "8.1565, 125.1260",
    image: floodImg,
    status: "BARANGAY REVIEW",
    currentStage: "BARANGAY",
    submittedAt: "Aug 28, 2026 · 8:10 AM",
    aiAnalysis: {
      category: "Flooding",
      severity: "Low",
      initialReceiver: "Barangay Casisang",
      suggestedLguOffice: "City Disaster Risk Reduction and Management Office",
      aiRecommendation: "Send to Barangay for initial assessment.",
      confidence: 0.93,
      aiStatus: "Ready for Barangay Review",
    },
    escalation: null,
    resolution: null,
    infoRequest: null,
    timeline: [
      { step: "Complaint Submitted", time: "Aug 28, 2026 · 8:10 AM", actor: "Maria Santos (Resident)", note: "Submitted via ACORS Mobile" },
      { step: "Barangay Receipt", time: "Aug 28, 2026 · 8:11 AM", actor: "Barangay Casisang Desk", note: "Queued for staff review" },
    ],
    history: [],
  },
  {
    id: "ACORS-CMP-2026-00102",
    trackingNumber: "ACORS-CMP-2026-00102",
    residentName: "Carlos Alcantara",
    residentContact: "0928-334-1199",
    residentEmail: "carlos.a@example.com",
    title: "Illegal trash disposal behind Casisang public market",
    description: "Small pile of domestic waste bags dumped near the market perimeter fence. Needs local eco-tanod warning.",
    category: "Garbage Accumulation",
    severity: "Low",
    priority: "Low",
    barangay: "Barangay Casisang",
    location: "Behind Public Market, Purok 3, Casisang, Malaybalay City",
    coordinates: "8.1570, 125.1275",
    image: garbageImg,
    status: "BARANGAY REVIEW",
    currentStage: "BARANGAY",
    submittedAt: "Aug 28, 2026 · 9:00 AM",
    aiAnalysis: {
      category: "Garbage Accumulation",
      severity: "Low",
      initialReceiver: "Barangay Casisang",
      suggestedLguOffice: "City Environment and Natural Resources Office",
      aiRecommendation: "Send to Barangay for initial assessment.",
      confidence: 0.95,
      aiStatus: "Ready for Barangay Review",
    },
    escalation: null,
    resolution: null,
    infoRequest: null,
    timeline: [
      { step: "Complaint Submitted", time: "Aug 28, 2026 · 9:00 AM", actor: "Carlos Alcantara (Resident)", note: "Submitted via ACORS Mobile" },
    ],
    history: [],
  },
  {
    id: "ACORS-CMP-2026-00103",
    trackingNumber: "ACORS-CMP-2026-00103",
    residentName: "Pedro Gonzales",
    residentContact: "0939-556-7812",
    residentEmail: "pedro.g@example.com",
    title: "Minor pothole on Purok 3 residential alleyway",
    description: "Small shallow pothole on concrete interior road. Barangay maintenance can patch with cement mix.",
    category: "Road Damage",
    severity: "Low",
    priority: "Medium",
    barangay: "Barangay Casisang",
    location: "Purok 3 Interior Alley, Casisang, Malaybalay City",
    coordinates: "8.1580, 125.1285",
    image: potholeImg,
    status: "IN PROGRESS",
    currentStage: "BARANGAY",
    submittedAt: "Aug 28, 2026 · 9:30 AM",
    aiAnalysis: {
      category: "Road Damage",
      severity: "Low",
      initialReceiver: "Barangay Casisang",
      suggestedLguOffice: "City Engineering Office",
      aiRecommendation: "Send to Barangay for initial assessment.",
      confidence: 0.91,
      aiStatus: "In Progress",
    },
    inProgressDetails: {
      assignedStaff: "Brgy Maintenance (G. Perez)",
      actionPlan: "Manual cold-patch cement repair scheduled for this afternoon.",
      expectedResolutionDate: "Aug 29, 2026",
      notes: "Barangay utility cart dispatched with cement materials.",
    },
    escalation: null,
    resolution: null,
    infoRequest: null,
    timeline: [
      { step: "Complaint Submitted", time: "Aug 28, 2026 · 9:30 AM", actor: "Pedro Gonzales (Resident)", note: "Submitted via ACORS Mobile" },
      { step: "Barangay Accepted", time: "Aug 28, 2026 · 10:15 AM", actor: "Staff Maria Santos (Barangay Casisang)", note: "Accepted for local barangay repair" },
      { step: "Marked In Progress", time: "Aug 28, 2026 · 11:00 AM", actor: "Staff Maria Santos (Barangay Casisang)", note: "Assigned to G. Perez" },
    ],
    history: [],
  },
  {
    id: "ACORS-CMP-2026-00104",
    trackingNumber: "ACORS-CMP-2026-00104",
    residentName: "Lourdes Rivera",
    residentContact: "0915-887-2233",
    residentEmail: "lourdes.r@example.com",
    title: "Loose street barrier near basketball court",
    description: "Metal safety railing joint is loose near the kids playground area.",
    category: "Infrastructure",
    severity: "Low",
    priority: "Medium",
    barangay: "Barangay Casisang",
    location: "Covered Court, Purok 4, Casisang, Malaybalay City",
    coordinates: "8.1578, 125.1270",
    image: highwayImg,
    status: "IN PROGRESS",
    currentStage: "BARANGAY",
    submittedAt: "Aug 28, 2026 · 10:00 AM",
    aiAnalysis: {
      category: "Infrastructure",
      severity: "Low",
      initialReceiver: "Barangay Casisang",
      suggestedLguOffice: "City Engineering Office",
      aiRecommendation: "Send to Barangay for initial assessment.",
      confidence: 0.88,
      aiStatus: "In Progress",
    },
    inProgressDetails: {
      assignedStaff: "Barangay Welder (J. Ramos)",
      actionPlan: "Re-weld metal bracket and secure base anchors.",
      expectedResolutionDate: "Aug 29, 2026",
      notes: "Barangay welding kit scheduled for 3:00 PM.",
    },
    escalation: null,
    resolution: null,
    infoRequest: null,
    timeline: [
      { step: "Complaint Submitted", time: "Aug 28, 2026 · 10:00 AM", actor: "Lourdes Rivera (Resident)", note: "Submitted via ACORS Mobile" },
      { step: "In Progress", time: "Aug 28, 2026 · 11:30 AM", actor: "Staff Maria Santos (Barangay Casisang)", note: "Work order dispatched" },
    ],
    history: [],
  },
  {
    id: "ACORS-CMP-2026-00105",
    trackingNumber: "ACORS-CMP-2026-00105",
    residentName: "Ramon Valderama",
    residentContact: "0920-881-4477",
    residentEmail: "ramon.v@example.com",
    title: "Broken streetlight bulb at Purok 5 corner",
    description: "LED fixture was dark for two nights. Replaced by Barangay maintenance electrician.",
    category: "Broken Streetlights",
    severity: "Low",
    priority: "Low",
    barangay: "Barangay Casisang",
    location: "Corner Purok 5 & Chapel St., Casisang, Malaybalay City",
    coordinates: "8.1592, 125.1280",
    image: lightImg,
    status: "RESOLVED",
    currentStage: "RESOLVED",
    submittedAt: "Aug 27, 2026 · 6:40 PM",
    aiAnalysis: {
      category: "Broken Streetlights",
      severity: "Low",
      initialReceiver: "Barangay Casisang",
      suggestedLguOffice: "City Engineering Office",
      aiRecommendation: "Send to Barangay for initial assessment.",
      confidence: 0.94,
      aiStatus: "Completed",
    },
    resolution: {
      resolvedBy: "Barangay Electrician (D. Tan)",
      resolvedAt: "Aug 28, 2026 · 11:30 AM",
      description: "Replaced 50W LED bulb and checked ballast. Light is fully operational.",
      evidenceBefore: lightImg,
      evidenceAfter: lightImg,
      notes: "Completed using barangay maintenance inventory.",
    },
    escalation: null,
    infoRequest: null,
    timeline: [
      { step: "Complaint Submitted", time: "Aug 27, 2026 · 6:40 PM", actor: "Ramon Valderama (Resident)", note: "Submitted via ACORS Mobile" },
      { step: "Resolved by Barangay", time: "Aug 28, 2026 · 11:30 AM", actor: "Barangay Electrician (D. Tan)", note: "Tested functional." },
    ],
    history: [],
  },
  {
    id: "ACORS-CMP-2026-00106",
    trackingNumber: "ACORS-CMP-2026-00106",
    residentName: "Grace Batistil",
    residentContact: "0945-123-9088",
    residentEmail: "grace.b@example.com",
    title: "Overgrown grass and bushes obstructing sidewalk",
    description: "Tall weeds along Purok 1 walkway forcing pedestrians to walk on the road lane.",
    category: "Road Damage",
    severity: "Low",
    priority: "Low",
    barangay: "Barangay Casisang",
    location: "Purok 1 Main Walkway, Casisang, Malaybalay City",
    coordinates: "8.1550, 125.1250",
    image: highwayImg,
    status: "RESOLVED",
    currentStage: "RESOLVED",
    submittedAt: "Aug 27, 2026 · 2:15 PM",
    aiAnalysis: {
      category: "Road Damage",
      severity: "Low",
      initialReceiver: "Barangay Casisang",
      suggestedLguOffice: "City Engineering Office",
      aiRecommendation: "Send to Barangay for initial assessment.",
      confidence: 0.90,
      aiStatus: "Completed",
    },
    resolution: {
      resolvedBy: "Barangay Eco-Brigade",
      resolvedAt: "Aug 28, 2026 · 9:00 AM",
      description: "Barangay grass-cutting crew trimmed the sidewalk and hauled green waste.",
      evidenceBefore: highwayImg,
      evidenceAfter: highwayImg,
      notes: "Sidewalk cleared for 150 meters.",
    },
    escalation: null,
    infoRequest: null,
    timeline: [
      { step: "Complaint Submitted", time: "Aug 27, 2026 · 2:15 PM", actor: "Grace Batistil (Resident)", note: "Submitted via ACORS Mobile" },
      { step: "Resolved by Barangay", time: "Aug 28, 2026 · 9:00 AM", actor: "Barangay Eco-Brigade", note: "Clean-up completed." },
    ],
    history: [],
  },
  {
    id: "ACORS-CMP-2026-00107",
    trackingNumber: "ACORS-CMP-2026-00107",
    residentName: "Maritess Gonzaga",
    residentContact: "0935-772-1088",
    residentEmail: "maritess.g@example.com",
    title: "Clogged drainage causing street water overflow",
    description: "Water backing up onto sidewalk after moderate rain. Need inspection of the culvert inlet.",
    category: "Flooding",
    severity: "High",
    priority: "High",
    barangay: "Barangay Casisang",
    location: "Corner 8th St. & Sayre Highway, Casisang, Malaybalay City",
    coordinates: "8.1590, 125.1295",
    image: floodImg,
    status: "INFORMATION REQUIRED",
    currentStage: "BARANGAY",
    submittedAt: "Aug 28, 2026 · 11:05 AM",
    aiAnalysis: {
      category: "Flooding",
      severity: "High",
      initialReceiver: "Barangay Casisang",
      suggestedLguOffice: "City Disaster Risk Reduction and Management Office",
      aiRecommendation: "Send to Barangay for initial assessment.",
      confidence: 0.89,
      aiStatus: "Awaiting Resident Info",
    },
    infoRequest: {
      requestedBy: "Barangay Staff (Maria Santos)",
      requestedAt: "Aug 28, 2026 · 11:45 AM",
      reason: "Unclear exact culvert location",
      messageToResident: "Please provide a clearer photo showing the specific inlet drain and let us know if private property fences block the drainage easement.",
      residentResponse: null,
      responseSubmittedAt: null,
    },
    escalation: null,
    resolution: null,
    timeline: [
      { step: "Complaint Submitted", time: "Aug 28, 2026 · 11:05 AM", actor: "Maritess Gonzaga (Resident)", note: "Submitted via ACORS Mobile" },
      { step: "Information Requested", time: "Aug 28, 2026 · 11:45 AM", actor: "Staff Maria Santos (Barangay Casisang)", note: "Requested culvert inlet photo" },
    ],
    history: [],
  },
  {
    id: "ACORS-CMP-2026-00108",
    trackingNumber: "ACORS-CMP-2026-00108",
    residentName: "Felipe Tan",
    residentContact: "0927-440-1923",
    residentEmail: "felipe.tan@example.com",
    title: "Stagnant puddle near Casisang Daycare Center",
    description: "Water pooling on the unpaved playground area after rains. Potential mosquito breeding hazard.",
    category: "Public Health",
    severity: "Medium",
    priority: "Medium",
    barangay: "Barangay Casisang",
    location: "Daycare Center Compound, Purok 2, Casisang, Malaybalay City",
    coordinates: "8.1568, 125.1262",
    image: floodImg,
    status: "BARANGAY REVIEW",
    currentStage: "BARANGAY",
    submittedAt: "Aug 28, 2026 · 1:20 PM",
    aiAnalysis: {
      category: "Public Health",
      severity: "Medium",
      initialReceiver: "Barangay Casisang",
      suggestedLguOffice: "City Health Office",
      aiRecommendation: "Send to Barangay for initial assessment.",
      confidence: 0.92,
      aiStatus: "Ready for Barangay Review",
    },
    escalation: null,
    resolution: null,
    infoRequest: null,
    timeline: [
      { step: "Complaint Submitted", time: "Aug 28, 2026 · 1:20 PM", actor: "Felipe Tan (Resident)", note: "Submitted via ACORS Mobile" },
    ],
    history: [],
  },
  {
    id: "ACORS-CMP-2026-00109",
    trackingNumber: "ACORS-CMP-2026-00109",
    residentName: "Danilo Cuaresma",
    residentContact: "0949-112-8822",
    residentEmail: "danilo.c@example.com",
    title: "Cracked concrete sidewalk slab replacement",
    description: "Concrete slab cracked in half over shallow canal. Barangay maintenance team is fabricating safety cover.",
    category: "Infrastructure",
    severity: "Medium",
    priority: "Medium",
    barangay: "Barangay Casisang",
    location: "Purok 6, Casisang Public Market Road, Malaybalay City",
    coordinates: "8.1582, 125.1288",
    image: potholeImg,
    status: "IN PROGRESS",
    currentStage: "BARANGAY",
    submittedAt: "Aug 28, 2026 · 9:15 AM",
    aiAnalysis: {
      category: "Infrastructure",
      severity: "Medium",
      initialReceiver: "Barangay Casisang",
      suggestedLguOffice: "City Engineering Office",
      aiRecommendation: "Send to Barangay for initial assessment.",
      confidence: 0.90,
      aiStatus: "In Progress",
    },
    inProgressDetails: {
      assignedStaff: "Brgy Maintenance Crew (K. Flores)",
      actionPlan: "Fabricating pre-cast concrete slab replacement.",
      expectedResolutionDate: "Aug 30, 2026",
      notes: "Safety barricade installed.",
    },
    escalation: null,
    resolution: null,
    infoRequest: null,
    timeline: [
      { step: "Complaint Submitted", time: "Aug 28, 2026 · 9:15 AM", actor: "Danilo Cuaresma (Resident)", note: "Submitted via ACORS Mobile" },
      { step: "In Progress", time: "Aug 28, 2026 · 1:30 PM", actor: "Brgy Maintenance Crew (K. Flores)", note: "Barricade set up" },
    ],
    history: [],
  },
  {
    id: "ACORS-CMP-2026-00110",
    trackingNumber: "ACORS-CMP-2026-00110",
    residentName: "Rowena Alcantara",
    residentContact: "0919-482-3901",
    residentEmail: "rowena.a@example.com",
    title: "Uncollected garden trimmings on Purok 6 corner",
    description: "Tree branches and dried leaves left on the curb. Cleared by Barangay eco-utility truck.",
    category: "Garbage Accumulation",
    severity: "Low",
    priority: "Low",
    barangay: "Barangay Casisang",
    location: "Purok 6 Corner, Casisang, Malaybalay City",
    coordinates: "8.1585, 125.1290",
    image: garbageImg,
    status: "RESOLVED",
    currentStage: "RESOLVED",
    submittedAt: "Aug 27, 2026 · 11:30 AM",
    aiAnalysis: {
      category: "Garbage Accumulation",
      severity: "Low",
      initialReceiver: "Barangay Casisang",
      suggestedLguOffice: "City Environment and Natural Resources Office",
      aiRecommendation: "Send to Barangay for initial assessment.",
      confidence: 0.95,
      aiStatus: "Completed",
    },
    resolution: {
      resolvedBy: "Barangay Solid Waste Crew",
      resolvedAt: "Aug 27, 2026 · 3:45 PM",
      description: "Hauled 2 truckloads of green waste to the composting facility.",
      evidenceBefore: garbageImg,
      evidenceAfter: garbageImg,
      notes: "Area swept and clear.",
    },
    escalation: null,
    infoRequest: null,
    timeline: [
      { step: "Complaint Submitted", time: "Aug 27, 2026 · 11:30 AM", actor: "Rowena Alcantara (Resident)", note: "Submitted via ACORS Mobile" },
      { step: "Resolved by Barangay", time: "Aug 27, 2026 · 3:45 PM", actor: "Barangay Solid Waste Crew", note: "Green waste collected" },
    ],
    history: [],
  },

  // ==========================================
  // 10 ESCALATED TO LGU COMPLAINTS (TIER 2)
  // ==========================================
  {
    id: "ACORS-CMP-2026-00125",
    trackingNumber: "ACORS-CMP-2026-00125",
    residentName: "Juan Dela Cruz",
    residentContact: "0917-555-0192",
    residentEmail: "juan.delacruz@example.com",
    title: "Large highway pothole requiring asphalt rollers",
    description: "A deep 2-meter wide pothole is causing hazardous traffic along Sayre Highway near Purok 4. Multiple motorcycles have already lost balance.",
    category: "Road Damage",
    severity: "Medium",
    priority: "High",
    barangay: "Barangay Casisang",
    location: "Purok 4, Sayre Highway, Casisang, Malaybalay City",
    coordinates: "8.1575, 125.1278",
    image: potholeImg,
    status: "ESCALATED TO LGU",
    currentStage: "LGU",
    submittedAt: "Aug 28, 2026 · 8:32 AM",
    aiAnalysis: {
      category: "Road Damage",
      severity: "Medium",
      initialReceiver: "Barangay Casisang",
      suggestedLguOffice: "City Engineering Office",
      aiRecommendation: "Send to Barangay for initial assessment.",
      confidence: 0.94,
      aiStatus: "Ready for Barangay Review",
    },
    escalation: {
      escalatedBy: "Barangay Staff (Maria Santos)",
      escalatedAt: "Aug 28, 2026 · 10:21 AM",
      reason: "Requires Specialized Equipment",
      barangayAssessment: "The pothole requires heavy asphalt roller equipment and hot-mix patching materials unavailable at the Barangay level.",
      staffNotes: "Inspected with Brgy Tanod. Pothole depth is ~15cm, exposing sub-base gravel on a heavy national highway lane.",
      recommendedOffice: "City Engineering Office",
      supportingEvidence: ["Asphalt_Measurement.pdf"],
    },
    resolution: null,
    infoRequest: null,
    timeline: [
      { step: "Complaint Submitted", time: "Aug 28, 2026 · 8:32 AM", actor: "Juan Dela Cruz (Resident)", note: "Submitted via ACORS Mobile" },
      { step: "Escalated to LGU", time: "Aug 28, 2026 · 10:21 AM", actor: "Staff Maria Santos (Barangay Casisang)", note: "Reason: Requires Specialized Equipment → Routed to City Engineering Office" },
      { step: "LGU Review Pending", time: "Aug 28, 2026 · 10:22 AM", actor: "City Engineering Office", note: "Assigned to Infrastructure Maintenance Division" },
    ],
    history: [],
  },
  {
    id: "ACORS-CMP-2026-00132",
    trackingNumber: "ACORS-CMP-2026-00132",
    residentName: "Bernadette Lim",
    residentContact: "0917-889-1002",
    residentEmail: "bernadette.lim@example.com",
    title: "Major drainage culvert collapse across 4-lane highway",
    description: "Underground culvert caved in under the weight of container trucks, creating a sinkhole hazard on the main highway.",
    category: "Infrastructure",
    severity: "High",
    priority: "Critical",
    barangay: "Barangay Casisang",
    location: "Sayre National Highway km 1420, Casisang, Malaybalay City",
    coordinates: "8.1568, 125.1270",
    image: potholeImg,
    status: "LGU ACCEPTED",
    currentStage: "LGU",
    submittedAt: "Aug 28, 2026 · 6:45 AM",
    aiAnalysis: {
      category: "Infrastructure",
      severity: "High",
      initialReceiver: "Barangay Casisang",
      suggestedLguOffice: "City Engineering Office",
      aiRecommendation: "Send to Barangay for initial assessment.",
      confidence: 0.98,
      aiStatus: "Transferred to LGU",
    },
    escalation: {
      escalatedBy: "Barangay Staff (Maria Santos)",
      escalatedAt: "Aug 28, 2026 · 8:15 AM",
      reason: "Requires Specialized Equipment",
      barangayAssessment: "Culvert structural failure requires hydraulic excavator, reinforced concrete box culvert installation, and heavy asphalt repaving beyond barangay capacity.",
      staffNotes: "Coordinated with traffic police for partial single-lane closure. Transferred to City Engineering.",
      recommendedOffice: "City Engineering Office",
      supportingEvidence: ["Sinkhole_Measurement.pdf", "Highway_Notice.pdf"],
    },
    resolution: null,
    infoRequest: null,
    timeline: [
      { step: "Complaint Submitted", time: "Aug 28, 2026 · 6:45 AM", actor: "Bernadette Lim (Resident)", note: "Submitted via ACORS Mobile" },
      { step: "Escalated to LGU", time: "Aug 28, 2026 · 8:15 AM", actor: "Staff Maria Santos (Barangay Casisang)", note: "Routed to City Engineering Office" },
      { step: "LGU Accepted", time: "Aug 28, 2026 · 9:00 AM", actor: "City Engineering Lead (Engr. R. Torres)", note: "Heavy equipment crew mobilized for excavation" },
    ],
    history: [],
  },
  {
    id: "ACORS-CMP-2026-00133",
    trackingNumber: "ACORS-CMP-2026-00133",
    residentName: "Carlos Villanueva",
    residentContact: "0921-998-3321",
    residentEmail: "carlos.v@example.com",
    title: "Hazardous chemical dumping in agricultural irrigation",
    description: "Unidentified industrial grease and chemicals dumped into irrigation canal affecting downstream agricultural fields.",
    category: "Illegal Dumping",
    severity: "High",
    priority: "Critical",
    barangay: "Barangay Casisang",
    location: "Canal Lateral B, Purok 5, Casisang, Malaybalay City",
    coordinates: "8.1635, 125.1345",
    image: floodImg,
    status: "LGU IN PROGRESS",
    currentStage: "LGU",
    submittedAt: "Aug 27, 2026 · 4:20 PM",
    aiAnalysis: {
      category: "Illegal Dumping",
      severity: "High",
      initialReceiver: "Barangay Casisang",
      suggestedLguOffice: "City Environment and Natural Resources Office",
      aiRecommendation: "Send to Barangay for initial assessment.",
      confidence: 0.97,
      aiStatus: "Transferred to LGU",
    },
    escalation: {
      escalatedBy: "Barangay Staff (Maria Santos)",
      escalatedAt: "Aug 27, 2026 · 5:00 PM",
      reason: "Beyond Barangay Authority",
      barangayAssessment: "Chemical contamination requires environmental hazardous waste containment, water quality testing, and pollution control officer inspection.",
      staffNotes: "Farmers association alerted. Immediate CENRO inspection required.",
      recommendedOffice: "City Environment and Natural Resources Office",
      supportingEvidence: ["Water_Color_Sample.jpg"],
    },
    resolution: null,
    infoRequest: null,
    timeline: [
      { step: "Complaint Submitted", time: "Aug 27, 2026 · 4:20 PM", actor: "Carlos Villanueva (Resident)", note: "Submitted via ACORS Mobile" },
      { step: "Escalated to LGU", time: "Aug 27, 2026 · 5:00 PM", actor: "Staff Maria Santos (Barangay Casisang)", note: "Routed to CENRO" },
      { step: "LGU Accepted", time: "Aug 27, 2026 · 5:45 PM", actor: "CENRO Inspector (M. Diaz)", note: "Containment booms placed" },
      { step: "LGU In Progress", time: "Aug 28, 2026 · 8:30 AM", actor: "CENRO Pollution Control Unit", note: "Water laboratory testing underway" },
    ],
    history: [],
  },
  {
    id: "ACORS-CMP-2026-00134",
    trackingNumber: "ACORS-CMP-2026-00134",
    residentName: "Teresa Morales",
    residentContact: "0936-331-7700",
    residentEmail: "teresa.m@example.com",
    title: "Centennial acacia tree leaning over high-voltage substation",
    description: "Tree root system gave way after storm; massive trunk leaning on high-voltage power distribution cables.",
    category: "Fallen Trees",
    severity: "High",
    priority: "Critical",
    barangay: "Barangay Casisang",
    location: "Beside BUSECO Substation, Casisang, Malaybalay City",
    coordinates: "8.1725, 125.1170",
    image: highwayImg,
    status: "ESCALATED TO LGU",
    currentStage: "LGU",
    submittedAt: "Aug 28, 2026 · 10:10 AM",
    aiAnalysis: {
      category: "Fallen Trees",
      severity: "High",
      initialReceiver: "Barangay Casisang",
      suggestedLguOffice: "City Disaster Risk Reduction and Management Office",
      aiRecommendation: "Send to Barangay for initial assessment.",
      confidence: 0.95,
      aiStatus: "Awaiting LGU Review",
    },
    escalation: {
      escalatedBy: "Barangay Staff (Maria Santos)",
      escalatedAt: "Aug 28, 2026 · 10:40 AM",
      reason: "Requires Specialized Equipment",
      barangayAssessment: "Requires CDRRMO crane and cherry-picker truck plus coordinated power outage with BUSECO before tree cutting.",
      staffNotes: "Barangay tanods placed warning tape around 50-meter perimeter.",
      recommendedOffice: "City Disaster Risk Reduction and Management Office",
      supportingEvidence: ["Tree_Powerline_Clearance.jpg"],
    },
    resolution: null,
    infoRequest: null,
    timeline: [
      { step: "Complaint Submitted", time: "Aug 28, 2026 · 10:10 AM", actor: "Teresa Morales (Resident)", note: "Submitted via ACORS Mobile" },
      { step: "Escalated to LGU", time: "Aug 28, 2026 · 10:40 AM", actor: "Staff Maria Santos (Barangay Casisang)", note: "Routed to CDRRMO" },
      { step: "LGU Review Pending", time: "Aug 28, 2026 · 10:41 AM", actor: "CDRRMO Quick Response Team", note: "Awaiting coordinator assignment" },
    ],
    history: [],
  },
  {
    id: "ACORS-CMP-2026-00135",
    trackingNumber: "ACORS-CMP-2026-00135",
    residentName: "Anthony Galarpe",
    residentContact: "0915-224-8119",
    residentEmail: "anthony.g@example.com",
    title: "Electronic traffic controller motherboard short circuit",
    description: "Traffic light stuck on flashing red in all directions, causing heavy gridlock during peak school hours.",
    category: "Traffic",
    severity: "High",
    priority: "High",
    barangay: "Barangay Casisang",
    location: "Intersection Casisang Elementary & Diversion Road, Malaybalay City",
    coordinates: "8.1588, 125.1280",
    image: lightImg,
    status: "RESOLVED",
    currentStage: "RESOLVED",
    submittedAt: "Aug 27, 2026 · 1:15 PM",
    aiAnalysis: {
      category: "Traffic",
      severity: "High",
      initialReceiver: "Barangay Casisang",
      suggestedLguOffice: "Traffic Management Center",
      aiRecommendation: "Send to Barangay for initial assessment.",
      confidence: 0.94,
      aiStatus: "Resolved by LGU",
    },
    escalation: {
      escalatedBy: "Barangay Staff (Maria Santos)",
      escalatedAt: "Aug 27, 2026 · 1:40 PM",
      reason: "Requires Specialized Personnel",
      barangayAssessment: "Electronic traffic controller motherboard diagnostics and synchronization requires City Traffic Management technicians.",
      staffNotes: "Brgy tanods directed traffic manually until TMC technician team arrived.",
      recommendedOffice: "Traffic Management Center",
      supportingEvidence: ["Traffic_Box_Error_Code.jpg"],
    },
    resolution: {
      resolvedBy: "Traffic Management Center (Engr. S. Lopez)",
      resolvedAt: "Aug 27, 2026 · 4:30 PM",
      description: "TMC technician team replaced the faulty sensor relay and reprogrammed the timing cycle. All signal phases fully operational.",
      evidenceBefore: lightImg,
      evidenceAfter: lightImg,
      notes: "Resolved and tested during peak rush hour traffic.",
    },
    infoRequest: null,
    timeline: [
      { step: "Complaint Submitted", time: "Aug 27, 2026 · 1:15 PM", actor: "Anthony Galarpe (Resident)", note: "Submitted via ACORS Mobile" },
      { step: "Escalated to LGU", time: "Aug 27, 2026 · 1:40 PM", actor: "Staff Maria Santos (Barangay Casisang)", note: "Routed to TMC" },
      { step: "Resolved by LGU", time: "Aug 27, 2026 · 4:30 PM", actor: "Traffic Management Center", note: "Controller repaired" },
    ],
    history: [],
  },
  {
    id: "ACORS-CMP-2026-00136",
    trackingNumber: "ACORS-CMP-2026-00136",
    residentName: "Eduardo Nacaytuna",
    residentContact: "0917-701-4455",
    residentEmail: "eduardo.n@example.com",
    title: "Riverbank retaining wall erosion near Casisang Bridge",
    description: "Riprap stone masonry collapsed after flash flood, scouring soil within 5 meters of residential houses.",
    category: "Infrastructure",
    severity: "High",
    priority: "Critical",
    barangay: "Barangay Casisang",
    location: "Riverbank Sector 4, Casisang Bridge, Malaybalay City",
    coordinates: "8.1540, 125.1245",
    image: floodImg,
    status: "LGU ACCEPTED",
    currentStage: "LGU",
    submittedAt: "Aug 28, 2026 · 7:00 AM",
    aiAnalysis: {
      category: "Infrastructure",
      severity: "High",
      initialReceiver: "Barangay Casisang",
      suggestedLguOffice: "City Engineering Office",
      aiRecommendation: "Send to Barangay for initial assessment.",
      confidence: 0.96,
      aiStatus: "Transferred to LGU",
    },
    escalation: {
      escalatedBy: "Barangay Staff (Maria Santos)",
      escalatedAt: "Aug 28, 2026 · 7:45 AM",
      reason: "Requires LGU Funding",
      barangayAssessment: "Riverbank structural restoration requires heavy gabion wire installations and city engineering flood control budget.",
      staffNotes: "Assessed with Barangay Council. Structural engineering intervention necessary.",
      recommendedOffice: "City Engineering Office",
      supportingEvidence: ["Riverbank_Erosion_Survey.pdf"],
    },
    resolution: null,
    infoRequest: null,
    timeline: [
      { step: "Complaint Submitted", time: "Aug 28, 2026 · 7:00 AM", actor: "Eduardo Nacaytuna (Resident)", note: "Submitted via ACORS Mobile" },
      { step: "Escalated to LGU", time: "Aug 28, 2026 · 7:45 AM", actor: "Staff Maria Santos (Barangay Casisang)", note: "Routed to City Engineering Office" },
      { step: "LGU Accepted", time: "Aug 28, 2026 · 8:30 AM", actor: "City Engineering Office", note: "Survey team dispatched" },
    ],
    history: [],
  },
  {
    id: "ACORS-CMP-2026-00137",
    trackingNumber: "ACORS-CMP-2026-00137",
    residentName: "Dr. Evelyn Chavez",
    residentContact: "0922-441-9988",
    residentEmail: "dr.chavez@example.com",
    title: "Illegal commercial medical waste disposal near clinic",
    description: "Unlabeled biohazard bags with syringes and expired reagents dumped behind commercial strip.",
    category: "Public Health",
    severity: "High",
    priority: "Critical",
    barangay: "Barangay Casisang",
    location: "Commercial Strip Alley, Purok 2, Casisang, Malaybalay City",
    coordinates: "8.1562, 125.1268",
    image: garbageImg,
    status: "LGU IN PROGRESS",
    currentStage: "LGU",
    submittedAt: "Aug 28, 2026 · 8:45 AM",
    aiAnalysis: {
      category: "Public Health",
      severity: "High",
      initialReceiver: "Barangay Casisang",
      suggestedLguOffice: "City Health Office",
      aiRecommendation: "Send to Barangay for initial assessment.",
      confidence: 0.97,
      aiStatus: "Transferred to LGU",
    },
    escalation: {
      escalatedBy: "Barangay Staff (Maria Santos)",
      escalatedAt: "Aug 28, 2026 · 9:15 AM",
      reason: "Beyond Barangay Authority",
      barangayAssessment: "Medical biohazard waste handling requires licensed DENR-certified hazardous waste collectors and City Health sanitary inspectors.",
      staffNotes: "Area cordoned off. Immediate City Health Office sanitation team required.",
      recommendedOffice: "City Health Office",
      supportingEvidence: ["Biohazard_Photo.jpg"],
    },
    resolution: null,
    infoRequest: null,
    timeline: [
      { step: "Complaint Submitted", time: "Aug 28, 2026 · 8:45 AM", actor: "Dr. Evelyn Chavez (Resident)", note: "Submitted via ACORS Mobile" },
      { step: "Escalated to LGU", time: "Aug 28, 2026 · 9:15 AM", actor: "Staff Maria Santos (Barangay Casisang)", note: "Routed to City Health Office" },
      { step: "LGU In Progress", time: "Aug 28, 2026 · 10:30 AM", actor: "City Health Sanitation Team", note: "Hazardous waste containment team on site" },
    ],
    history: [],
  },
  {
    id: "ACORS-CMP-2026-00138",
    trackingNumber: "ACORS-CMP-2026-00138",
    residentName: "Nestor Balane",
    residentContact: "0930-112-9900",
    residentEmail: "nestor.b@example.com",
    title: "Major landslide blocking mountain feeder road",
    description: "Approximately 40 tons of soil and boulders blocked the agricultural farm-to-market road access.",
    category: "Disaster Concern",
    severity: "High",
    priority: "Critical",
    barangay: "Barangay Casisang",
    location: "Upper Casisang Farm-to-Market Road km 4, Malaybalay City",
    coordinates: "8.1510, 125.1210",
    image: highwayImg,
    status: "ESCALATED TO LGU",
    currentStage: "LGU",
    submittedAt: "Aug 28, 2026 · 6:15 AM",
    aiAnalysis: {
      category: "Disaster Concern",
      severity: "High",
      initialReceiver: "Barangay Casisang",
      suggestedLguOffice: "City Disaster Risk Reduction and Management Office",
      aiRecommendation: "Send to Barangay for initial assessment.",
      confidence: 0.98,
      aiStatus: "Awaiting LGU Review",
    },
    escalation: {
      escalatedBy: "Barangay Staff (Maria Santos)",
      escalatedAt: "Aug 28, 2026 · 7:10 AM",
      reason: "Requires Specialized Equipment",
      barangayAssessment: "Clearing requires heavy front-loader bulldozers and 10-wheeler dump trucks from CDRRMO emergency heavy equipment fleet.",
      staffNotes: "Farm produce vehicles currently stranded. Urgent clearing needed.",
      recommendedOffice: "City Disaster Risk Reduction and Management Office",
      supportingEvidence: ["Landslide_Boulder_Blockage.jpg"],
    },
    resolution: null,
    infoRequest: null,
    timeline: [
      { step: "Complaint Submitted", time: "Aug 28, 2026 · 6:15 AM", actor: "Nestor Balane (Resident)", note: "Submitted via ACORS Mobile" },
      { step: "Escalated to LGU", time: "Aug 28, 2026 · 7:10 AM", actor: "Staff Maria Santos (Barangay Casisang)", note: "Routed to CDRRMO" },
    ],
    history: [],
  },
  {
    id: "ACORS-CMP-2026-00139",
    trackingNumber: "ACORS-CMP-2026-00139",
    residentName: "Engr. Joel Pimentel",
    residentContact: "0918-990-2211",
    residentEmail: "joel.p@example.com",
    title: "Damaged steel expansion joint on national bridge",
    description: "Protruding steel plate on bridge deck puncturing vehicle tires and damaging suspension.",
    category: "Infrastructure",
    severity: "High",
    priority: "High",
    barangay: "Barangay Casisang",
    location: "Casisang Highway Viaduct Bridge, Malaybalay City",
    coordinates: "8.1535, 125.1230",
    image: potholeImg,
    status: "LGU IN PROGRESS",
    currentStage: "LGU",
    submittedAt: "Aug 27, 2026 · 3:30 PM",
    aiAnalysis: {
      category: "Infrastructure",
      severity: "High",
      initialReceiver: "Barangay Casisang",
      suggestedLguOffice: "City Engineering Office",
      aiRecommendation: "Send to Barangay for initial assessment.",
      confidence: 0.95,
      aiStatus: "Transferred to LGU",
    },
    escalation: {
      escalatedBy: "Barangay Staff (Maria Santos)",
      escalatedAt: "Aug 27, 2026 · 4:10 PM",
      reason: "Requires Specialized Personnel",
      barangayAssessment: "Structural bridge welding and elastomeric expansion joint replacement requires certified DPWH / City Engineering structural welders.",
      staffNotes: "Warning traffic cones installed.",
      recommendedOffice: "City Engineering Office",
      supportingEvidence: ["Bridge_Joint_Photo.jpg"],
    },
    resolution: null,
    infoRequest: null,
    timeline: [
      { step: "Complaint Submitted", time: "Aug 27, 2026 · 3:30 PM", actor: "Engr. Joel Pimentel (Resident)", note: "Submitted via ACORS Mobile" },
      { step: "Escalated to LGU", time: "Aug 27, 2026 · 4:10 PM", actor: "Staff Maria Santos (Barangay Casisang)", note: "Routed to City Engineering Office" },
      { step: "LGU In Progress", time: "Aug 28, 2026 · 9:00 AM", actor: "City Engineering Bridge Crew", note: "Bridge deck welding underway" },
    ],
    history: [],
  },
  {
    id: "ACORS-CMP-2026-00140",
    trackingNumber: "ACORS-CMP-2026-00140",
    residentName: "Rosalinda Yap",
    residentContact: "0929-778-1122",
    residentEmail: "rosalinda.y@example.com",
    title: "Massive sewage pipe fracture leaking onto main highway",
    description: "Main underground sewage pipe ruptured, flooding foul sewage across highway sidewalk. Repaired by City Water & Health crews.",
    category: "Sanitation",
    severity: "High",
    priority: "Critical",
    barangay: "Barangay Casisang",
    location: "Sayre Highway Fronting Commercial Strip, Casisang, Malaybalay City",
    coordinates: "8.1572, 125.1274",
    image: floodImg,
    status: "RESOLVED",
    currentStage: "RESOLVED",
    submittedAt: "Aug 26, 2026 · 10:00 AM",
    aiAnalysis: {
      category: "Sanitation",
      severity: "High",
      initialReceiver: "Barangay Casisang",
      suggestedLguOffice: "City Health Office",
      aiRecommendation: "Send to Barangay for initial assessment.",
      confidence: 0.97,
      aiStatus: "Resolved by LGU",
    },
    escalation: {
      escalatedBy: "Barangay Staff (Maria Santos)",
      escalatedAt: "Aug 26, 2026 · 10:30 AM",
      reason: "Requires Specialized Equipment",
      barangayAssessment: "Excavation and pressure pipe replacement with disinfection requires City Health and Engineering specialized suction trucks.",
      staffNotes: "Coordinated with City Health Office emergency sanitation unit.",
      recommendedOffice: "City Health Office",
      supportingEvidence: ["Sewage_Leakage_Report.pdf"],
    },
    resolution: {
      resolvedBy: "City Health Sanitation & Engineering Crew",
      resolvedAt: "Aug 26, 2026 · 5:30 PM",
      description: "Excavated ruptured 12-inch sewer line, installed heavy-duty PVC junction coupling, and completed chemical chlorine wash disinfection of the street.",
      evidenceBefore: floodImg,
      evidenceAfter: floodImg,
      notes: "Fully restored and odor sanitized.",
    },
    infoRequest: null,
    timeline: [
      { step: "Complaint Submitted", time: "Aug 26, 2026 · 10:00 AM", actor: "Rosalinda Yap (Resident)", note: "Submitted via ACORS Mobile" },
      { step: "Escalated to LGU", time: "Aug 26, 2026 · 10:30 AM", actor: "Staff Maria Santos (Barangay Casisang)", note: "Routed to City Health Office" },
      { step: "Resolved by LGU", time: "Aug 26, 2026 · 5:30 PM", actor: "City Health Sanitation & Engineering Crew", note: "Pipe replaced and street sanitized" },
    ],
    history: [],
  },
];

export function getStoredComplaints() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.error("Error loading complaints from storage:", err);
  }
  // Initialize with seed data
  saveStoredComplaints(INITIAL_COMPLAINTS);
  return INITIAL_COMPLAINTS;
}

export function saveStoredComplaints(complaints) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(complaints));
    window.dispatchEvent(new Event("acors_complaints_updated"));
  } catch (err) {
    console.error("Error saving complaints to storage:", err);
  }
}

export function createNewComplaint(formData) {
  const all = getStoredComplaints();
  const nextNum = all.length + 101;
  const newId = `ACORS-CMP-2026-${String(nextNum).padStart(5, "0")}`;

  const recommendedOffice = getRecommendedLguOffice(formData.category);

  const newComplaint = {
    id: newId,
    trackingNumber: newId,
    residentName: formData.residentName || "Resident User",
    residentContact: formData.residentContact || "0917-000-0000",
    residentEmail: formData.residentEmail || "resident@example.com",
    title: formData.title || formData.category || "Community Report",
    description: formData.description || "",
    category: formData.category || "Infrastructure",
    severity: formData.severity || "Medium",
    priority: formData.priority || "Medium",
    barangay: formData.barangay || "Barangay Casisang",
    location: formData.location || "Malaybalay City",
    coordinates: formData.coordinates || "8.1575, 125.1278",
    image: formData.image || potholeImg,
    status: "BARANGAY REVIEW",
    currentStage: "BARANGAY",
    submittedAt: new Date().toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }),
    aiAnalysis: {
      category: formData.category || "Infrastructure",
      severity: formData.severity || "Medium",
      initialReceiver: formData.barangay || "Barangay Casisang",
      suggestedLguOffice: recommendedOffice,
      aiRecommendation: "Send to Barangay for initial assessment.",
      confidence: 0.95,
      aiStatus: "Ready for Barangay Review",
    },
    escalation: null,
    resolution: null,
    infoRequest: null,
    timeline: [
      {
        step: "Complaint Submitted",
        time: new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true }),
        actor: `${formData.residentName || "Resident"} (Resident)`,
        note: "Submitted via ACORS Mobile",
      },
      {
        step: "AI Classification & Routing",
        time: new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true }),
        actor: "ACORS AI Engine",
        note: `Auto-routed to ${formData.barangay || "Barangay Casisang"} as Tier 1 receiver. Suggested LGU Office if escalated: ${recommendedOffice}.`,
      },
      {
        step: "Received by Barangay",
        time: new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true }),
        actor: `${formData.barangay || "Barangay Casisang"} Operations Desk`,
        note: "Queued for Barangay Staff review",
      },
    ],
    history: [
      {
        user: formData.residentName || "Resident",
        role: "Resident",
        action: "Submitted Complaint",
        date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
        time: new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true }),
        statusBefore: "NEW",
        statusAfter: "SUBMITTED",
        notes: "Initial submission",
      },
    ],
  };

  const updated = [newComplaint, ...all];
  saveStoredComplaints(updated);
  return newComplaint;
}

export function barangayAcceptComplaint(complaintId, staffName = "Barangay Staff") {
  const all = getStoredComplaints();
  const timeNow = new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
  const dateNow = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  let updatedTarget = null;
  const updated = all.map((c) => {
    if (c.id === complaintId) {
      updatedTarget = {
        ...c,
        status: "ACCEPTED",
        currentStage: "BARANGAY",
        timeline: [
          ...c.timeline,
          {
            step: "Barangay Accepted Complaint",
            time: `${dateNow} · ${timeNow}`,
            actor: staffName,
            note: "Barangay confirmed complaint is within local operational capacity",
          },
        ],
        history: [
          ...c.history,
          {
            user: staffName,
            role: "Barangay Staff",
            action: "Accepted Complaint",
            date: dateNow,
            time: timeNow,
            statusBefore: c.status,
            statusAfter: "ACCEPTED",
            notes: "Barangay accepted for local handling",
          },
        ],
      };
      return updatedTarget;
    }
    return c;
  });

  saveStoredComplaints(updated);
  return updatedTarget;
}

export function barangayRequestInfo(complaintId, { reason, messageToResident, staffName = "Barangay Staff" }) {
  const all = getStoredComplaints();
  const timeNow = new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
  const dateNow = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  let updatedTarget = null;
  const updated = all.map((c) => {
    if (c.id === complaintId) {
      updatedTarget = {
        ...c,
        status: "INFORMATION REQUIRED",
        infoRequest: {
          requestedBy: staffName,
          requestedAt: `${dateNow} · ${timeNow}`,
          reason,
          messageToResident,
          residentResponse: null,
          responseSubmittedAt: null,
        },
        timeline: [
          ...c.timeline,
          {
            step: "Barangay Requested More Information",
            time: `${dateNow} · ${timeNow}`,
            actor: staffName,
            note: `Reason: ${reason}. Message: "${messageToResident}"`,
          },
        ],
        history: [
          ...c.history,
          {
            user: staffName,
            role: "Barangay Staff",
            action: "Requested More Information",
            date: dateNow,
            time: timeNow,
            statusBefore: c.status,
            statusAfter: "INFORMATION REQUIRED",
            notes: messageToResident,
          },
        ],
      };
      return updatedTarget;
    }
    return c;
  });

  saveStoredComplaints(updated);
  return updatedTarget;
}

export function residentSubmitAdditionalInfo(complaintId, { responseText, photo = null, residentName = "Resident" }) {
  const all = getStoredComplaints();
  const timeNow = new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
  const dateNow = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  let updatedTarget = null;
  const updated = all.map((c) => {
    if (c.id === complaintId) {
      updatedTarget = {
        ...c,
        status: "INFORMATION SUBMITTED",
        infoRequest: c.infoRequest
          ? {
              ...c.infoRequest,
              residentResponse: responseText,
              responseSubmittedAt: `${dateNow} · ${timeNow}`,
              responsePhoto: photo,
            }
          : null,
        timeline: [
          ...c.timeline,
          {
            step: "Resident Submitted Requested Information",
            time: `${dateNow} · ${timeNow}`,
            actor: residentName,
            note: `Response: "${responseText}"`,
          },
        ],
        history: [
          ...c.history,
          {
            user: residentName,
            role: "Resident",
            action: "Submitted Additional Information",
            date: dateNow,
            time: timeNow,
            statusBefore: c.status,
            statusAfter: "INFORMATION SUBMITTED",
            notes: responseText,
          },
        ],
      };
      return updatedTarget;
    }
    return c;
  });

  saveStoredComplaints(updated);
  return updatedTarget;
}

export function barangayMarkInProgress(complaintId, { assignedStaff, actionPlan, expectedResolutionDate, notes = "", staffName = "Barangay Staff" }) {
  const all = getStoredComplaints();
  const timeNow = new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
  const dateNow = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  let updatedTarget = null;
  const updated = all.map((c) => {
    if (c.id === complaintId) {
      updatedTarget = {
        ...c,
        status: "IN PROGRESS",
        currentStage: "BARANGAY",
        inProgressDetails: {
          assignedStaff,
          actionPlan,
          expectedResolutionDate,
          notes,
        },
        timeline: [
          ...c.timeline,
          {
            step: "Marked In Progress (Barangay)",
            time: `${dateNow} · ${timeNow}`,
            actor: staffName,
            note: `Assigned: ${assignedStaff}. Target Date: ${expectedResolutionDate}. Plan: ${actionPlan}`,
          },
        ],
        history: [
          ...c.history,
          {
            user: staffName,
            role: "Barangay Staff",
            action: "Marked In Progress",
            date: dateNow,
            time: timeNow,
            statusBefore: c.status,
            statusAfter: "IN PROGRESS",
            notes: `Assigned to ${assignedStaff}`,
          },
        ],
      };
      return updatedTarget;
    }
    return c;
  });

  saveStoredComplaints(updated);
  return updatedTarget;
}

export function barangayResolveComplaint(complaintId, { description, evidenceBefore = null, evidenceAfter = null, notes = "", staffName = "Barangay Staff" }) {
  const all = getStoredComplaints();
  const timeNow = new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
  const dateNow = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  let updatedTarget = null;
  const updated = all.map((c) => {
    if (c.id === complaintId) {
      updatedTarget = {
        ...c,
        status: "RESOLVED",
        currentStage: "RESOLVED",
        resolution: {
          resolvedBy: staffName,
          resolvedAt: `${dateNow} · ${timeNow}`,
          description,
          evidenceBefore: evidenceBefore || c.image,
          evidenceAfter: evidenceAfter || c.image,
          notes,
        },
        timeline: [
          ...c.timeline,
          {
            step: "Resolved by Barangay",
            time: `${dateNow} · ${timeNow}`,
            actor: staffName,
            note: `Resolution: ${description}`,
          },
        ],
        history: [
          ...c.history,
          {
            user: staffName,
            role: "Barangay Staff",
            action: "Resolved Complaint",
            date: dateNow,
            time: timeNow,
            statusBefore: c.status,
            statusAfter: "RESOLVED",
            notes: description,
          },
        ],
      };
      return updatedTarget;
    }
    return c;
  });

  saveStoredComplaints(updated);
  return updatedTarget;
}

export function barangayEscalateToLgu(complaintId, { reason, barangayAssessment, staffNotes = "", recommendedOffice, staffName = "Barangay Staff" }) {
  const all = getStoredComplaints();
  const timeNow = new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
  const dateNow = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  let updatedTarget = null;
  const updated = all.map((c) => {
    if (c.id === complaintId) {
      const targetOffice = recommendedOffice || getRecommendedLguOffice(c.category);
      updatedTarget = {
        ...c,
        status: "ESCALATED TO LGU",
        currentStage: "LGU",
        escalation: {
          escalatedBy: staffName,
          escalatedAt: `${dateNow} · ${timeNow}`,
          reason,
          barangayAssessment,
          staffNotes,
          recommendedOffice: targetOffice,
          supportingEvidence: [`Assessment_${complaintId}.pdf`],
        },
        timeline: [
          ...c.timeline,
          {
            step: "Escalated to LGU",
            time: `${dateNow} · ${timeNow}`,
            actor: staffName,
            note: `Reason: ${reason}. Target: ${targetOffice}. Assessment: "${barangayAssessment}"`,
          },
          {
            step: "LGU Review Pending",
            time: `${dateNow} · ${timeNow}`,
            actor: targetOffice,
            note: "Transferred to Tier 2 City Hall Operations Queue",
          },
        ],
        history: [
          ...c.history,
          {
            user: staffName,
            role: "Barangay Staff",
            action: "Escalated Complaint to LGU",
            date: dateNow,
            time: timeNow,
            statusBefore: c.status,
            statusAfter: "ESCALATED TO LGU",
            notes: `Escalated to ${targetOffice} due to ${reason}`,
          },
        ],
      };
      return updatedTarget;
    }
    return c;
  });

  saveStoredComplaints(updated);
  return updatedTarget;
}

export function lguAcceptComplaint(complaintId, staffName = "LGU Administrator") {
  const all = getStoredComplaints();
  const timeNow = new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
  const dateNow = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  let updatedTarget = null;
  const updated = all.map((c) => {
    if (c.id === complaintId) {
      updatedTarget = {
        ...c,
        status: "LGU ACCEPTED",
        currentStage: "LGU",
        timeline: [
          ...c.timeline,
          {
            step: "LGU Accepted Escalation",
            time: `${dateNow} · ${timeNow}`,
            actor: staffName,
            note: "LGU department accepted responsibility and queued technical dispatch.",
          },
        ],
        history: [
          ...c.history,
          {
            user: staffName,
            role: "LGU Staff",
            action: "Accepted Escalated Complaint",
            date: dateNow,
            time: timeNow,
            statusBefore: c.status,
            statusAfter: "LGU ACCEPTED",
            notes: "LGU accepted technical dispatch",
          },
        ],
      };
      return updatedTarget;
    }
    return c;
  });

  saveStoredComplaints(updated);
  return updatedTarget;
}

export function lguMarkInProgress(complaintId, { assignedTeam = "LGU Response Team", notes = "", staffName = "LGU Administrator" }) {
  const all = getStoredComplaints();
  const timeNow = new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
  const dateNow = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  let updatedTarget = null;
  const updated = all.map((c) => {
    if (c.id === complaintId) {
      updatedTarget = {
        ...c,
        status: "LGU IN PROGRESS",
        currentStage: "LGU",
        timeline: [
          ...c.timeline,
          {
            step: "LGU Field Work In Progress",
            time: `${dateNow} · ${timeNow}`,
            actor: staffName,
            note: `Dispatched: ${assignedTeam}. Notes: ${notes}`,
          },
        ],
        history: [
          ...c.history,
          {
            user: staffName,
            role: "LGU Staff",
            action: "Marked LGU In Progress",
            date: dateNow,
            time: timeNow,
            statusBefore: c.status,
            statusAfter: "LGU IN PROGRESS",
            notes: `Assigned ${assignedTeam}`,
          },
        ],
      };
      return updatedTarget;
    }
    return c;
  });

  saveStoredComplaints(updated);
  return updatedTarget;
}

export function lguResolveComplaint(complaintId, { resolutionDescription, staffName = "LGU Lead" }) {
  const all = getStoredComplaints();
  const timeNow = new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
  const dateNow = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  let updatedTarget = null;
  const updated = all.map((c) => {
    if (c.id === complaintId) {
      updatedTarget = {
        ...c,
        status: "RESOLVED",
        currentStage: "RESOLVED",
        resolution: {
          resolvedBy: staffName,
          resolvedAt: `${dateNow} · ${timeNow}`,
          description: resolutionDescription,
          evidenceBefore: c.image,
          evidenceAfter: c.image,
          notes: "LGU intervention completed and verified.",
        },
        timeline: [
          ...c.timeline,
          {
            step: "Resolved by LGU Department",
            time: `${dateNow} · ${timeNow}`,
            actor: staffName,
            note: resolutionDescription,
          },
        ],
        history: [
          ...c.history,
          {
            user: staffName,
            role: "LGU Staff",
            action: "Resolved Complaint (LGU Level)",
            date: dateNow,
            time: timeNow,
            statusBefore: c.status,
            statusAfter: "RESOLVED",
            notes: resolutionDescription,
          },
        ],
      };
      return updatedTarget;
    }
    return c;
  });

  saveStoredComplaints(updated);
  return updatedTarget;
}

export function lguReturnToBarangay(complaintId, { returnReason, notes = "", staffName = "LGU Reviewer" }) {
  const all = getStoredComplaints();
  const timeNow = new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
  const dateNow = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  let updatedTarget = null;
  const updated = all.map((c) => {
    if (c.id === complaintId) {
      updatedTarget = {
        ...c,
        status: "BARANGAY REVIEW",
        currentStage: "BARANGAY",
        escalation: null,
        timeline: [
          ...c.timeline,
          {
            step: "LGU Returned to Barangay",
            time: `${dateNow} · ${timeNow}`,
            actor: staffName,
            note: `Returned Reason: ${returnReason}. Notes: "${notes}"`,
          },
        ],
        history: [
          ...c.history,
          {
            user: staffName,
            role: "LGU Staff",
            action: "Returned Complaint to Barangay",
            date: dateNow,
            time: timeNow,
            statusBefore: c.status,
            statusAfter: "BARANGAY REVIEW",
            notes: `Returned: ${returnReason}. ${notes}`,
          },
        ],
      };
      return updatedTarget;
    }
    return c;
  });

  saveStoredComplaints(updated);
  return updatedTarget;
}
