// src/Offices/CDRRMO/Overview.jsx
import OfficeOverview from "../shared/OfficeOverview";
import { cdrrmoOffice } from "../officeData";

export default function Overview() {
  return <OfficeOverview office={cdrrmoOffice} />;
}