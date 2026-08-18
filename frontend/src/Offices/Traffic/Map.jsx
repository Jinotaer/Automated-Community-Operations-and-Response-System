// src/Offices/Traffic/Map.jsx
import OfficeMap from "../shared/OfficeMap";
import { trafficOffice } from "../officeData";

export default function Map() {
  return <OfficeMap office={trafficOffice} />;
}