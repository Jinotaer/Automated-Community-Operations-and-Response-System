// src/Offices/Engineering/Overview.jsx
import OfficeOverview from "../shared/OfficeOverview";
import { engineeringOffice } from "../officeData";

export default function Overview() {
  return <OfficeOverview office={engineeringOffice} />;
}