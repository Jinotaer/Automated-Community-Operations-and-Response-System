// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./Citizen/Home";
import CommunityUpdates from "./Citizen/CommunityUpdates";
import MyReports from "./Citizen/Reports";
import CityMap from "./Citizen/CityMap";
import Profile from "./Citizen/Profile";
import ReportIssue from "./Citizen/ReportIssue";
import Login from "./Citizen/Login";
import AdminLogin from "./Admin/Login";
import Overview from "./Admin/Overview";
import AdminProfile from "./Admin/Profile";
import ReportDetails from "./Admin/Reports";
import Map from "./Admin/Map";
import AdminSettings from "./Admin/Settings";
import Departments from "./Admin/Departments";
import Barangays from "./Admin/Barangays";
import Users from "./Admin/Users";
import EngineeringOverview from "./Offices/Engineering/Overview";
import EngineeringReports from "./Offices/Engineering/Reports";
import EngineeringMap from "./Offices/Engineering/Map";
import CenroOverview from "./Offices/CENRO/Overview";
import CenroReports from "./Offices/CENRO/Reports";
import CenroMap from "./Offices/CENRO/Map";
import CdrrmoOverview from "./Offices/CDRRMO/Overview";
import CdrrmoReports from "./Offices/CDRRMO/Reports";
import CdrrmoMap from "./Offices/CDRRMO/Map";
import TrafficOverview from "./Offices/Traffic/Overview";
import TrafficReports from "./Offices/Traffic/Reports";
import TrafficMap from "./Offices/Traffic/Map";
import HealthOverview from "./Offices/Health/Overview";
import HealthReports from "./Offices/Health/Reports";
import HealthMap from "./Offices/Health/Map";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/home" element={<Home />} />
        <Route path="/community-reports" element={<CommunityUpdates />} />
        <Route path="/reports" element={<MyReports />} />
        <Route path="/map" element={<CityMap />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/report-issue" element={<ReportIssue />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/overview" element={<Overview />} />
        <Route path="/admin/profile" element={<AdminProfile />} />
        <Route path="/admin/reports" element={<ReportDetails />} />
        <Route path="/admin/map" element={<Map />} />
        <Route path="/admin/barangays" element={<Barangays />} />
        <Route path="/admin/departments" element={<Departments />} />
        <Route path="/admin/users" element={<Users />} />
        <Route path="/office/engineering/overview" element={<EngineeringOverview />} />
        <Route path="/office/engineering/reports" element={<EngineeringReports />} />
        <Route path="/office/engineering/map" element={<EngineeringMap />} />
        <Route path="/office/cenro/overview" element={<CenroOverview />} />
        <Route path="/office/cenro/reports" element={<CenroReports />} />
        <Route path="/office/cenro/map" element={<CenroMap />} />
        <Route path="/office/cdrrmo/overview" element={<CdrrmoOverview />} />
        <Route path="/office/cdrrmo/reports" element={<CdrrmoReports />} />
        <Route path="/office/cdrrmo/map" element={<CdrrmoMap />} />
        <Route path="/office/traffic/overview" element={<TrafficOverview />} />
        <Route path="/office/traffic/reports" element={<TrafficReports />} />
        <Route path="/office/traffic/map" element={<TrafficMap />} />
        <Route path="/office/health/overview" element={<HealthOverview />} />
        <Route path="/office/health/reports" element={<HealthReports />} />
        <Route path="/office/health/map" element={<HealthMap />} />
        <Route path="/admin/settings" element={<AdminSettings />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
