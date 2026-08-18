// src/Offices/Health/Overview.jsx
import OfficeOverview from "../shared/OfficeOverview";
import { healthOffice } from "../officeData";

export default function Overview() {
  return <OfficeOverview office={healthOffice} />;
}