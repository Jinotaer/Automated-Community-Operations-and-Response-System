// src/services/certificateData.js
import {
  Landmark,
  Wallet,
  Accessibility,
  Users,
  HeartHandshake,
  Briefcase,
  FileText,
} from "lucide-react";

export const certificateOffices = [
  {
    id: "lcr",
    name: "City/Municipal Civil Registrar's Office (LCRO)",
    icon: Landmark,
    certificates: [
      { id: "birth-cert", name: "Birth Certificate – Certified Copy" },
      { id: "marriage-cert", name: "Marriage Certificate – Certified Copy" },
      { id: "death-cert", name: "Death Certificate – Certified Copy" },
    ],
  },
  {
    id: "treasurer",
    name: "City Treasurer's Office",
    icon: Wallet,
    certificates: [
      { id: "cedula", name: "Community Tax Certificate (Cedula)" },
      { id: "tax-payment", name: "Certificate of Tax Payment" },
      { id: "tax-clearance", name: "Certificate of Tax Clearance" },
    ],
  },
  {
    id: "pdao",
    name: "Persons with Disability Affairs Office (PDAO)",
    icon: Accessibility,
    certificates: [
      { id: "pwd-registration", name: "PWD Registration Certificate" },
      { id: "pwd-id", name: "PWD ID" },
      { id: "disability-cert", name: "Certificate of Disability" },
    ],
  },
  {
    id: "osca",
    name: "Office for Senior Citizens Affairs (OSCA)",
    icon: Users,
    certificates: [
      { id: "senior-id", name: "Senior Citizen ID" },
      { id: "senior-registration", name: "Senior Citizen Registration Certificate" },
      { id: "senior-certification", name: "Senior Citizen Certification" },
    ],
  },
  {
    id: "soloparent",
    name: "Solo Parent Office / CSWDO",
    icon: HeartHandshake,
    certificates: [
      { id: "solo-parent-id", name: "Solo Parent ID" },
      { id: "solo-parenthood", name: "Certificate of Solo Parenthood" },
      { id: "solo-registration", name: "Certificate of Registration as Solo Parent" },
    ],
  },
  {
    id: "bplo",
    name: "Business Permits and Licensing Office (BPLO)",
    icon: Briefcase,
    certificates: [
      { id: "business-renewal", name: "Business Permit Renewal" },
      { id: "business-closure", name: "Certificate of Business Closure" },
      { id: "business-retirement", name: "Certificate of Business Retirement" },
    ],
  },
  {
    id: "assessor",
    name: "City Assessor's Office",
    icon: FileText,
    certificates: [
      { id: "tax-declaration", name: "Certified Copy of Tax Declaration" },
      { id: "property-assessment", name: "Property Assessment Certification" },
      { id: "assessed-value", name: "Certification of Assessed Value" },
    ],
  },
];

export function findCertificate(officeId, certId) {
  const office = certificateOffices.find((item) => item.id === officeId);
  if (!office) return null;
  const cert = office.certificates.find((item) => item.id === certId);
  return cert ? { office, cert } : null;
}