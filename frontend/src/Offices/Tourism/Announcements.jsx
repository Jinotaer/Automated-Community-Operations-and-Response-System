// src/Offices/Tourism/Announcements.jsx
import OfficeAnnouncements from "../shared/OfficeAnnouncements";
import { tourismOffice } from "../officeData";

export default function Announcements() {
  return <OfficeAnnouncements office={tourismOffice} />;
}
