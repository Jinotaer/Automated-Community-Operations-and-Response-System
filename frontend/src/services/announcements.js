// src/services/announcements.js
import healthDengue from "../assets/health-dengue.jpg";
import healthBlood from "../assets/health-blood.jpg";
import healthVaccine from "../assets/health-vaccine.jpg";
import healthFlood from "../assets/health-flood.jpg";
import tourismHighlands from "../assets/tourism-highlands.jpg";
import tourismFestival from "../assets/tourism-festival.jpg";
import tourismMountain from "../assets/tourism-mountain.jpg";

const seedAnnouncements = [
  {
    id: "ANN-001",
    officeSlug: "health",
    officeName: "City Health Office",
    caption:
      "Free dengue awareness caravan at the Public Market this Saturday, 7 AM to 12 PM. Free check-ups and vector control kits for the first 200 residents.",
    image: healthDengue,
    postedAt: "June 11, 2026 · 2:10 PM",
    timestamp: 1781251800000,
  },
  {
    id: "ANN-002",
    officeSlug: "health",
    officeName: "City Health Office",
    caption:
      "Bloodletting drive this Friday at the City Health Office. Walk-ins welcome, bring a valid ID and eat a light meal beforehand.",
    image: healthBlood,
    postedAt: "June 10, 2026 · 9:45 AM",
    timestamp: 1781153100000,
  },
  {
    id: "ANN-003",
    officeSlug: "health",
    officeName: "City Health Office",
    caption:
      "Vaccination schedule for babies and toddlers this week: Monday to Friday, 8 AM to 11 AM at barangay health stations. Bring the child's immunization card.",
    image: healthVaccine,
    postedAt: "June 9, 2026 · 4:20 PM",
    timestamp: 1781079600000,
  },
  {
    id: "ANN-004",
    officeSlug: "health",
    officeName: "City Health Office",
    caption:
      "Weather advisory reminder: scattered rains expected this week. Boil drinking water and keep your surroundings clean to prevent leptospirosis.",
    image: healthFlood,
    postedAt: "June 8, 2026 · 7:00 AM",
    timestamp: 1780963200000,
  },
  {
    id: "ANN-005",
    officeSlug: "tourism",
    officeName: "City Tourism Office",
    caption:
      "Kaamulan Festival is almost here! Cultural street dance and thanksgiving rituals return this month. Catch the schedule of events on the official festival page.",
    image: tourismFestival,
    postedAt: "June 7, 2026 · 10:30 AM",
    timestamp: 1780893000000,
  },
  {
    id: "ANN-006",
    officeSlug: "tourism",
    officeName: "City Tourism Office",
    caption:
      "Escape the city heat. Malaybalay's highland view decks are open every weekend, with sunrise viewing points along Sayre Highway. Entry is free.",
    image: tourismHighlands,
    postedAt: "June 6, 2026 · 8:00 AM",
    timestamp: 1780790400000,
  },
  {
    id: "ANN-007",
    officeSlug: "tourism",
    officeName: "City Tourism Office",
    caption:
      "Weekend trekking reminder: keep the trails clean and hire a local guide. Check with the tourism office for the updated trail advisories before climbing.",
    image: tourismMountain,
    postedAt: "June 5, 2026 · 3:15 PM",
    timestamp: 1780726500000,
  },
];

let announcements = [...seedAnnouncements];

export function getAnnouncements() {
  return [...announcements].sort((a, b) => b.timestamp - a.timestamp);
}

export function addAnnouncement({ officeSlug, officeName, caption, image }) {
  const post = {
    id: `ANN-${Date.now()}`,
    officeSlug,
    officeName,
    caption,
    image,
    postedAt: "Just now",
    timestamp: Date.now(),
  };
  announcements = [post, ...announcements];
  return post;
}