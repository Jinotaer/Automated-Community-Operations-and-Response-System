// src/Offices/Traffic/Overview.jsx
import OfficeOverview from "../shared/OfficeOverview";
import { trafficOffice } from "../officeData";

export default function Overview() {
  return <OfficeOverview office={trafficOffice} />;
}