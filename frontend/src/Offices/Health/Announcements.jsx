// src/Offices/Health/Announcements.jsx
import OfficeAnnouncements from "../shared/OfficeAnnouncements";
import { healthOffice } from "../officeData";

export default function Announcements() {
  return <OfficeAnnouncements office={healthOffice} />;
}