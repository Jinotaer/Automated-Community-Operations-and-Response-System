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
        <Route path="/admin/settings" element={<AdminSettings />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
