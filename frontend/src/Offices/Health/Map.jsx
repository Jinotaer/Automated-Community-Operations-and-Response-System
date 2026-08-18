// src/Offices/Health/Map.jsx
import OfficeMap from "../shared/OfficeMap";
import { healthOffice } from "../officeData";

export default function Map() {
  return <OfficeMap office={healthOffice} />;
}