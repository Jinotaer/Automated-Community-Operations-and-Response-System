// src/Admin/adminData.js
import {
  engineeringOffice,
  cenroOffice,
  cdrrmoOffice,
  trafficOffice,
  healthOffice,
} from "../Offices/officeData";

export const allOffices = [
  engineeringOffice,
  cenroOffice,
  cdrrmoOffice,
  trafficOffice,
  healthOffice,
];

export const officeFilterOptions = [
  "All Offices",
  ...allOffices.map((office) => office.shortName),
];

export const officeColors = {
  Engineering: { marker: "bg-red-700", heat: "bg-red-700/45" },
  CENRO: { marker: "bg-emerald-600", heat: "bg-emerald-600/45" },
  CDRRMO: { marker: "bg-amber-500", heat: "bg-amber-500/50" },
  Traffic: { marker: "bg-sky-600", heat: "bg-sky-600/45" },
  Health: { marker: "bg-rose-600", heat: "bg-rose-600/45" },
};

const splitReported = (reported) => {
  const match = String(reported).match(/^(.*)\s(\d{1,2}:\d{2}\s[AP]M)$/);
  return match
    ? { date: match[1], time: match[2] }
    : { date: String(reported), time: "" };
};

const idNumber = (id) => parseInt(String(id).replace(/\D/g, ""), 10) || 0;

export const allReports = allOffices
  .flatMap((office) =>
    office.recentReports.map((report) => ({
      ...report,
      title: report.issue,
      ...splitReported(report.reported),
      department: office.name,
      office: office.shortName,
      reporter: office.holder,
    }))
  )
  .sort((a, b) => idNumber(b.id) - idNumber(a.id));

export const allIncidents = allOffices.flatMap((office) =>
  office.incidents.map((incident) => ({
    ...incident,
    department: office.name,
    office: office.shortName,
  }))
);

const getStat = (office, title) =>
  parseFloat(
    String(
      office.stats.find((stat) => stat.title === title)?.value || "0"
    ).replace(/[^\d.]/g, "")
  ) || 0;

export const aggregateStats = (() => {
  const assigned = allOffices.reduce(
    (sum, office) => sum + getStat(office, "Assigned to Office"),
    0
  );
  const inProgress = allOffices.reduce(
    (sum, office) => sum + getStat(office, "In Progress"),
    0
  );
  const resolved = allOffices.reduce(
    (sum, office) => sum + getStat(office, "Resolved"),
    0
  );
  const critical = allOffices.reduce(
    (sum, office) => sum + getStat(office, "Critical"),
    0
  );
  const avgResponse =
    allOffices.reduce(
      (weighted, office) =>
        weighted +
        getStat(office, "Avg. Response") *
          getStat(office, "Assigned to Office"),
      0
    ) / (assigned || 1);

  return [
    { title: "Total Reports", value: assigned.toLocaleString(), note: "+20% from last week" },
    { title: "In Progress", value: inProgress.toLocaleString(), note: "+27 vs last week" },
    { title: "Resolved", value: resolved.toLocaleString(), note: "+49 vs last week" },
    { title: "Critical", value: critical.toLocaleString(), note: "10 since yesterday" },
    { title: "Avg. Response", value: `${avgResponse.toFixed(1)} hrs`, note: "-0.4 hrs from last week" },
  ];
})();

export const officeSummaries = allOffices.map((office) => ({
  slug: office.slug,
  shortName: office.shortName,
  name: office.name,
  icon: office.icon,
  holder: office.holder,
  assigned: getStat(office, "Assigned to Office"),
  inProgress: getStat(office, "In Progress"),
  resolved: getStat(office, "Resolved"),
  critical: getStat(office, "Critical"),
}));

const categoryPalette = [
  "bg-red-700",
  "bg-red-600",
  "bg-red-500",
  "bg-red-400",
  "bg-red-300",
  "bg-red-200",
  "bg-gray-400",
];

export const combinedCategories = (() => {
  const totals = {};
  let grandTotal = 0;

  for (const office of allOffices) {
    for (const item of office.categoryBreakdown) {
      const count =
        parseInt(String(item.percent).match(/\((\d+)\)/)?.[1] || "0", 10) || 0;
      totals[item.name] = (totals[item.name] || 0) + count;
      grandTotal += count;
    }
  }

  return Object.entries(totals)
    .sort((a, b) => b[1] - a[1])
    .map(([name, count], index) => ({
      name,
      percent: `${Math.round((count / (grandTotal || 1)) * 100)}% (${count})`,
      color: categoryPalette[index % categoryPalette.length],
    }));
})();

export const combinedProblemAreas = (() => {
  const totals = {};

  for (const office of allOffices) {
    for (const item of office.problemAreas) {
      const count =
        parseInt(String(item.reports).match(/(\d+)/)?.[1] || "0", 10) || 0;
      totals[item.area] = (totals[item.area] || 0) + count;
    }
  }

  return Object.entries(totals)
    .sort((a, b) => b[1] - a[1])
    .map(([area, count]) => ({ area, reports: `${count} reports` }));
})();
