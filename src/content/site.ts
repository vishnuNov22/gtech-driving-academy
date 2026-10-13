/* =========================================================================
   EDIT HERE — all business details & content for the G-TECH website.
   Only supplied claims are used. Do not add pass rates, guarantees,
   government affiliation, offers or invented contact details.
   ========================================================================= */

export const SITE = {
  name: "G-TECH Motor Driving School",
  short: "G-TECH",
  tagline: "Driven by Quality, Defined by Trust",
  taglineParts: ["Driven by Quality", "Defined by Trust"] as const,
  hashtag: "#DriveWithGtech",
  joinLine: "Join #DriveWithGtech and start your journey today!",
  phone: "8075732441", // calling number
  whatsapp: "8590392667", // WhatsApp enquiries
  countryCode: "91",
  email: "sathi7474@gmail.com",
  addressLines: ["Choondickal, Vellarada", "Trivandrum, Kerala — 695505"],
  mapQuery: "Choondickal, Vellarada, Thiruvananthapuram, Kerala 695505",
};

export const CLAIMS = [
  "Family Owned & Operated",
  "More Than 5000 Students Trained",
  "5 Star Safety Rated Dual Control Vehicles",
  "Door to Door Service 7 Days A Week",
  "Trained & Experienced Instructors",
];

export const TEAM = [
  { name: "Meethi Shaji", role: "Managing Director", photo: "" }, // e.g. "/images/meethi-shaji.jpg"
  { name: "Athul Dev", role: "Instructor", photo: "" }, // e.g. "/images/athul-dev.jpg"
];

export type Training = {
  title: string;
  short: string;
  icon: "bike" | "car" | "sprout" | "doc";
  desc: string;
  points: string[];
  type?: "Two-wheeler" | "Four-wheeler";
  level?: "Beginner";
  rto?: boolean;
};

export const TRAINING: Training[] = [
  { title: "Two-Wheeler Training", short: "Control, balance & road sense", icon: "bike", type: "Two-wheeler",
    desc: "Beginner-friendly learning focused on control, balance, road awareness and safe riding habits.",
    points: ["Control and balance", "Road awareness", "Safe riding habits"] },
  { title: "Four-Wheeler Training", short: "Dual control vehicle practice", icon: "car", type: "Four-wheeler",
    desc: "Structured practice with an instructor in a 5 star safety rated dual control vehicle.",
    points: ["Structured practice", "Instructor beside you", "Dual control safety"] },
  { title: "Beginner Training", short: "Starting from zero", icon: "sprout", level: "Beginner",
    desc: "Calm, friendly guidance for learners who are starting from zero.",
    points: ["Friendly, patient instructors", "Learn at your pace", "Build confidence first"] },
  { title: "RTO Procedures Support", short: "Help with the process", icon: "doc", rto: true,
    desc: "Support with RTO-related procedures, explained simply so you know what to expect.",
    points: ["Clear explanations", "Support through the process", "Ask us anytime"] },
];

/** The 3D scroll story. `at` = where along the road (0–1) the chapter is centred. */
export const STORY = [
  { kicker: "Chapter 01", title: "Your first seat", at: 0.2,
    body: "Every journey starts with a calm first lesson. Trained & experienced instructors guide you from day one, and beginners are always welcome." },
  { kicker: "Chapter 02", title: "Dual control. Total calm.", at: 0.4,
    body: "Practise in 5 star safety rated dual control vehicles. Your instructor has their own brake, ready whenever you need it." },
  { kicker: "Chapter 03", title: "Read the road", at: 0.6,
    body: "Stop, give way, speed limits, pedestrian crossings. Learn the signs and safe habits until they become second nature." },
  { kicker: "Chapter 04", title: "Practice that fits your life", at: 0.78,
    body: "Door to door service, 7 days a week, so your lessons fit around work, college and family." },
  { kicker: "Chapter 05", title: "The RTO step, made simple", at: 0.95,
    body: "Support with RTO procedures, explained in plain language, so you can focus on driving. More than 5000 students have started here." },
];

export const WHY = [
  { title: "More Than 5000 Students Trained", body: "Thousands of learners have started their driving journey with G-TECH.", big: true },
  { title: "Family Owned & Operated", body: "A family-run academy that cares about every learner." },
  { title: "5 Star Safety Rated Dual Control Vehicles", body: "Your instructor can step in with their own brake whenever needed." },
  { title: "Door to Door Service 7 Days A Week", body: "Training that fits around your routine, every day of the week." },
  { title: "Trained & Experienced Instructors", body: "Patient, practical guidance from your very first lesson." },
];

export const SIGNS = [
  { name: "Stop", tip: "Come to a complete stop, look both ways, then proceed when safe.", kind: "stop" },
  { name: "No Entry", tip: "Vehicles must not enter this road from this side.", kind: "noentry" },
  { name: "Speed Limit", tip: "Do not drive faster than the speed shown on the sign.", kind: "speed" },
  { name: "Pedestrian Crossing", tip: "Slow down and be ready to stop for people crossing.", kind: "ped" },
  { name: "Give Way", tip: "Let traffic on the main road go first before you move on.", kind: "giveway" },
  { name: "No Parking", tip: "Do not park your vehicle here.", kind: "nopark" },
] as const;

export const RTO_STEPS = [
  { title: "Talk to us", body: "Tell us whether you need two-wheeler or four-wheeler training." },
  { title: "Understand the procedure", body: "We explain the RTO-related steps in simple language." },
  { title: "Get support with the process", body: "Our team helps you through the procedures as you train." },
  { title: "Prepare with confidence", body: "Practise with your instructor so you feel ready on the road." },
];

export const FAQ: [string, string][] = [
  ["Do I need any driving experience to join?", "No. G-TECH offers friendly training for beginners, so you can start from zero. We also help experienced learners who want refresher training."],
  ["What training do you offer?", "Two-wheeler training and four-wheeler training, along with support for RTO procedures."],
  ["Are your training vehicles safe for beginners?", "Yes. Four-wheeler training uses 5 star safety rated dual control vehicles, so your instructor can step in whenever needed."],
  ["Do you offer pickup from home?", "Yes. G-TECH offers door to door service, 7 days a week. Call or WhatsApp us to check availability for your area."],
  ["Can you help with RTO procedures?", "Yes. We provide support related to RTO procedures and explain the steps simply. Ask us for the current requirements when you enquire."],
  ["How do I enquire or join?", "Use the enquiry form on this page, call us, or message us on WhatsApp. We'll guide you from there."],
];

/** Gallery stays hidden until real photos are added, e.g. { src: "/images/gallery-1.jpg", caption: "Four-wheeler training" } */
export const GALLERY: { src: string; caption: string }[] = [];

/* ---------- helpers (no need to edit) ---------- */
export const fmtPhone = (n: string) => n.replace(/(\d{5})(\d{5})/, "$1 $2");
export const telLink = `tel:+${SITE.countryCode}${SITE.phone}`;
export const waLink = (text?: string) =>
  `https://wa.me/${SITE.countryCode}${SITE.whatsapp}` + (text ? `?text=${encodeURIComponent(text)}` : "");
export const DEFAULT_WA = "Hello G-TECH Motor Driving School, I'd like to know more about driving training.";
