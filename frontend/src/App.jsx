// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./Citizen/Home";
import CommunityUpdates from "./Citizen/CommunityUpdates";
import MyReports from "./Citizen/Reports";
import CityMap from "./Citizen/CityMap";
import RequestCertificate from "./Citizen/RequestCertificate";
import CertificateForm from "./Citizen/CertificateForm";
import Announcements from "./Citizen/Announcements";
import Profile from "./Citizen/Profile";
import ReportIssue from "./Citizen/ReportIssue";
import Login from "./Citizen/Login";
import Register from "./Citizen/Register";
import AdminLogin from "./Admin/Login";
import OfficeLogin from "./Offices/OfficeLogin";
import Overview from "./Admin/Overview";
import AdminProfile from "./Admin/Profile";
import ReportDetails from "./Admin/Reports";
import Map from "./Admin/Map";
import AdminSettings from "./Admin/Settings";
import Departments from "./Admin/Departments";
import Barangays from "./Admin/Barangays";
import Users from "./Admin/Users";

// Barangay Level Modules
import BarangayLogin from "./Barangay/BarangayLogin";
import BarangayDashboard from "./Barangay/BarangayDashboard";
import BarangayComplaints from "./Barangay/BarangayComplaints";
import BarangayResolve from "./Barangay/BarangayResolve";
import BarangayEscalated from "./Barangay/BarangayEscalated";
import BarangayNotifications from "./Barangay/BarangayNotifications";
import BarangayReportsSummary from "./Barangay/BarangayReportsSummary";
import BarangayProfile from "./Barangay/BarangayProfile";

// LGU Offices Modules
import EngineeringOverview from "./Offices/Engineering/Overview";
import EngineeringReports from "./Offices/Engineering/Reports";
import EngineeringMap from "./Offices/Engineering/Map";
import EngineeringResolve from "./Offices/Engineering/Resolve";
import CenroOverview from "./Offices/CENRO/Overview";
import CenroReports from "./Offices/CENRO/Reports";
import CenroMap from "./Offices/CENRO/Map";
import CenroResolve from "./Offices/CENRO/Resolve";
import CdrrmoOverview from "./Offices/CDRRMO/Overview";
import CdrrmoReports from "./Offices/CDRRMO/Reports";
import CdrrmoMap from "./Offices/CDRRMO/Map";
import CdrrmoResolve from "./Offices/CDRRMO/Resolve";
import TrafficOverview from "./Offices/Traffic/Overview";
import TrafficReports from "./Offices/Traffic/Reports";
import TrafficMap from "./Offices/Traffic/Map";
import TrafficResolve from "./Offices/Traffic/Resolve";
import HealthOverview from "./Offices/Health/Overview";
import HealthReports from "./Offices/Health/Reports";
import HealthMap from "./Offices/Health/Map";
import HealthResolve from "./Offices/Health/Resolve";
import HealthAnnouncements from "./Offices/Health/Announcements";
import TourismOverview from "./Offices/Tourism/Overview";
import TourismAnnouncements from "./Offices/Tourism/Announcements";
import LCROOverview from "./Offices/LCRO/Overview";
import LCRORequests from "./Offices/LCRO/Requests";
import CTOOverview from "./Offices/CTO/Overview";
import CTORequests from "./Offices/CTO/Requests";
import PDAOOverview from "./Offices/PDAO/Overview";
import PDAORequests from "./Offices/PDAO/Requests";
import CSWDOOverview from "./Offices/CSWDO/Overview";
import CSWDORequests from "./Offices/CSWDO/Requests";
import BPLOOverview from "./Offices/BPLO/Overview";
import BPLORequests from "./Offices/BPLO/Requests";
import OSCAOverview from "./Offices/OSCA/Overview";
import OSCARequests from "./Offices/OSCA/Requests";
import AssessorOverview from "./Offices/Assessor/Overview";
import AssessorRequests from "./Offices/Assessor/Requests";
import OfficeProfile from "./Offices/OfficeProfile";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        
        {/* Tier 1: Citizen Mobile / Web Routes */}
        <Route path="/home" element={<Home />} />
        <Route path="/community-reports" element={<CommunityUpdates />} />
        <Route path="/reports" element={<MyReports />} />
        <Route path="/map" element={<CityMap />} />
        <Route path="/request-certificate" element={<RequestCertificate />} />
        <Route
          path="/request-certificate/:officeId/:certId"
          element={<CertificateForm />}
        />
        <Route path="/announcements" element={<Announcements />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/report-issue" element={<ReportIssue />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Tier 1: Barangay Staff Web Dashboard Routes */}
        <Route path="/barangay/login" element={<BarangayLogin />} />
        <Route path="/barangay/dashboard" element={<BarangayDashboard />} />
        <Route path="/barangay/complaints" element={<BarangayComplaints initialStatusFilter="All" />} />
        <Route path="/barangay/pending" element={<BarangayComplaints initialStatusFilter="Pending Review" />} />
        <Route path="/barangay/in-progress" element={<BarangayComplaints initialStatusFilter="In Progress" />} />
        <Route path="/barangay/resolved" element={<BarangayResolve />} />
        <Route path="/barangay/escalated" element={<BarangayEscalated />} />
        <Route path="/barangay/notifications" element={<BarangayNotifications />} />
        <Route path="/barangay/reports-summary" element={<BarangayReportsSummary />} />
        <Route path="/barangay/profile" element={<BarangayProfile />} />
        
        {/* Tier 2: LGU Admin / Central Web Dashboard */}
        <Route path="/office/login" element={<Navigate to="/department/login" replace />} />
        <Route path="/department/login" element={<OfficeLogin />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/overview" element={<Overview />} />
        <Route path="/admin/profile" element={<AdminProfile />} />
        <Route path="/admin/reports" element={<ReportDetails />} />
        <Route path="/admin/map" element={<Map />} />
        <Route path="/admin/barangays" element={<Barangays />} />
        <Route path="/admin/departments" element={<Departments />} />
        <Route path="/admin/users" element={<Users />} />
        <Route path="/admin/settings" element={<AdminSettings />} />

        {/* Tier 2: LGU Specialized Department Offices */}
        <Route path="/department/engineering/overview" element={<EngineeringOverview />} />
        <Route path="/department/engineering/reports" element={<EngineeringReports />} />
        <Route path="/department/engineering/map" element={<EngineeringMap />} />
        <Route path="/department/engineering/resolve" element={<EngineeringResolve />} />
        <Route path="/department/cenro/overview" element={<CenroOverview />} />
        <Route path="/department/cenro/reports" element={<CenroReports />} />
        <Route path="/department/cenro/map" element={<CenroMap />} />
        <Route path="/department/cenro/resolve" element={<CenroResolve />} />
        <Route path="/department/cdrrmo/overview" element={<CdrrmoOverview />} />
        <Route path="/department/cdrrmo/reports" element={<CdrrmoReports />} />
        <Route path="/department/cdrrmo/map" element={<CdrrmoMap />} />
        <Route path="/department/cdrrmo/resolve" element={<CdrrmoResolve />} />
        <Route path="/department/traffic/overview" element={<TrafficOverview />} />
        <Route path="/department/traffic/reports" element={<TrafficReports />} />
        <Route path="/department/traffic/map" element={<TrafficMap />} />
        <Route path="/department/traffic/resolve" element={<TrafficResolve />} />
        <Route path="/department/health/overview" element={<HealthOverview />} />
        <Route path="/department/health/reports" element={<HealthReports />} />
        <Route path="/department/health/map" element={<HealthMap />} />
        <Route path="/department/health/resolve" element={<HealthResolve />} />
        <Route path="/department/health/announcements" element={<HealthAnnouncements />} />
        <Route path="/department/tourism/overview" element={<TourismOverview />} />
        <Route path="/department/tourism/announcements" element={<TourismAnnouncements />} />
        <Route path="/department/lcro/overview" element={<LCROOverview />} />
        <Route path="/department/lcro/requests" element={<LCRORequests />} />
        <Route path="/department/treasurer/overview" element={<CTOOverview />} />
        <Route path="/department/treasurer/requests" element={<CTORequests />} />
        <Route path="/department/pdao/overview" element={<PDAOOverview />} />
        <Route path="/department/pdao/requests" element={<PDAORequests />} />
        <Route path="/department/soloparent/overview" element={<CSWDOOverview />} />
        <Route path="/department/soloparent/requests" element={<CSWDORequests />} />
        <Route path="/department/cswdo/overview" element={<CSWDOOverview />} />
        <Route path="/department/cswdo/requests" element={<CSWDORequests />} />
        <Route path="/department/bplo/overview" element={<BPLOOverview />} />
        <Route path="/department/bplo/requests" element={<BPLORequests />} />
        <Route path="/department/osca/overview" element={<OSCAOverview />} />
        <Route path="/department/osca/requests" element={<OSCARequests />} />
        <Route path="/department/assessor/overview" element={<AssessorOverview />} />
        <Route path="/department/assessor/requests" element={<AssessorRequests />} />
        <Route path="/department/:officeSlug/profile" element={<OfficeProfile />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
