// All business facts for JAK Industries live here so every page reads the same numbers.

export const NAV = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/ladco", label: "LADCO" },
  { to: "/products", label: "Products" },
  { to: "/customers", label: "Customers" },
  { to: "/certifications", label: "Certifications" },
  { to: "/csr", label: "CSR" },
  { to: "/contact", label: "Contact" },
] as const;

export const CONTACT = {
  phoneMobile: "+91 72999 87393",
  phoneMobileHref: "tel:+917299987393",
  phoneOffice: "044 2637 0283",
  phoneOfficeHref: "tel:+914426370283",
  email: "jakindustries2007@yahoo.com",
  office: ["28/A, New Street, Arjuna Nagar,", "Near Kannan Theatre, Thirumullaivayal,", "Chennai – 600 062"],
};

export const FOUNDED = 2004;

export const STATS = [
  { value: 2004, label: "Founded in Chennai", suffix: "", plain: true },
  { value: 4, label: "Manufacturing units", suffix: "" },
  { value: 360, label: "Components engineered", suffix: "+" },
  { value: 44, label: "Years of leadership expertise", suffix: "+" },
] as const;

export const PROMISES = [
  { label: "Quality", value: 100 },
  { label: "Delivery", value: 100 },
  { label: "Transparency", value: 100 },
  { label: "Production capability", value: 100 },
];

export const HERO_SLIDES = [
  { kicker: "Green energy, two decades strong", title: ["Forging the", "wind economy"] },
  { kicker: "Sustainable energy solutions", title: ["Cleaner air,", "built in steel"] },
  { kicker: "Clean · Abundant · Environment friendly", title: ["Wind power", "empowers life"] },
];

export const CAPABILITIES = [
  { n: "01", title: "Heavy fabrication", body: "Carbon steel, stainless steel and aluminium structures built to drawing, at scale." },
  { n: "02", title: "Precision machining", body: "Machined wind-farm components held to the tolerances global OEMs demand." },
  { n: "03", title: "Assembly", body: "Heavy structural and sheet-metal assemblies, ready to bolt in on site." },
  { n: "04", title: "Pollution control", body: "Clarifiers, thickeners, aerators and filtration systems up to 40 m diameter." },
  { n: "05", title: "Piping & tanks", body: "Condensate tanks, receiver tanks and furnace-oil tanks with full piping." },
  { n: "06", title: "Erection & commissioning", body: "On-site erection, commissioning and testing of the equipment we build." },
];

export const WIND_PRODUCTS = [
  "Gear Stay Assembly",
  "Sealing Ring",
  "Nose Cone Ring",
  "Nacelle Cover Metal Parts",
  "Nacelle Sky Light",
  "Tower Accessories / Crane Structure",
  "Nacelle & Blade Transport Frame",
  "Tower Saddle",
  "Shear Connector with Ferrule",
  "Tarp & Tarp Plugs – Composites",
];

export const POLLUTION_PRODUCTS = [
  "Reactivated Clarifier (up to 40 m dia.)",
  "Clarifier",
  "Thickener",
  "Clariflocculator",
  "Thermic Fluid Evaporator System",
  "Agitator",
  "Aerator",
  "Sand Filters & Carbon Filter",
  "Mechanical Screens / Drum Screens",
];

export const CLIENTS = [
  { name: "Vestas Wind Technology", logo: "/jak/clients/jaa.jpg" },
  { name: "Siemens Gamesa Renewable Energy", logo: "/jak/clients/5.jpg" },
  { name: "Nordex India", logo: "/jak/clients/nordex.jpg" },
  { name: "Enercon", logo: "/jak/clients/enercon.jpg" },
  { name: "TPI Composites India", logo: "/jak/clients/6.jpg" },
  { name: "Wheels India", logo: "/jak/clients/4.jpg" },
  { name: "Carborundum Universal", logo: "/jak/clients/cli02.jpg" },
  { name: "Hine Hydraulics India", logo: "/jak/clients/2.jpg" },
  { name: "Ymer Technology", logo: "/jak/clients/3.jpg" },
  { name: "JS Auto Cast Foundry", logo: "/jak/clients/7.jpg" },
  { name: "BAETTR India", logo: "/jak/clients/baeter.jpg" },
  { name: "Indo Cool Engineering", logo: "/jak/clients/cli11.jpg" },
  { name: "G.K. Technologies", logo: "/jak/clients/cli19.jpg" },
  { name: "Pioneer Wincon", logo: "/jak/clients/cli6.jpg" },
  { name: "EIMCO – KCP", logo: "/jak/clients/cli7.jpg" },
];

export const TEAM = [
  { name: "M. Lazer", role: "Founder", photo: "/jak/about/ytt.jpg" },
  { name: "L. John Christo Dinesh", role: "Managing Partner", photo: "/jak/about/yt.jpg" },
  { name: "J. Ashok Kumar", role: "Managing Partner", photo: "/jak/about/pic3.jpg" },
  { name: "T. Abraham", role: "Managing Partner", photo: "/jak/about/pic4.jpg" },
];

export const UNITS = [
  {
    name: "Unit I",
    address: "28/A, Arjuna Nagar, New Street, Thirumullaivoyal, Chennai – 600 062",
    open: "10,000", covered: "7,500", power: "70 KVA welding · 20 HP power", genset: "125 kVA genset",
    map: "JAK Industries Unit I, 28/A Arjuna Nagar, Thirumullaivoyal, Chennai 600062",
  },
  {
    name: "Unit II",
    address: "Plot No. G88 B, SIDCO Industrial Estate, Kakkalur, Thiruvallur – 602 001",
    open: "2,500", covered: "6,500", power: "50 KVA welding · 30 HP power", genset: "82.5 kVA genset",
    map: "SIDCO Industrial Estate Kakkalur Thiruvallur 602001",
  },
  {
    name: "Unit III",
    address: "R-19, SIPCOT Industrial Estate, Gummidipoondi, Thiruvallur – 601 201",
    open: "30,000", covered: "15,000", power: "100 KVA welding · 50 HP power", genset: "125 kVA genset",
    map: "SIPCOT Industrial Estate Gummidipoondi 601201",
  },
  {
    name: "Unit IV",
    address: "No. 130, SIDCO Women's Industrial Estate, Kattur, Thirumullaivoyal, Chennai – 600 062",
    open: "1,200", covered: "13,800", power: "50 KVA welding · 30 HP power", genset: "82.5 kVA genset",
    map: "SIDCO Women's Industrial Estate Kattur Thirumullaivoyal Chennai",
  },
];

export const VALUES = [
  "Integrity & honesty",
  "Transparency",
  "Respectfulness",
  "Courage to take on challenges",
  "Constructive criticism",
  "Self-improvement",
  "Personal excellence",
  "Motivation",
  "Commitment",
  "Passion",
];

export const QUALITY_OBJECTIVES = ["Customer satisfaction", "Quality products", "On-time delivery", "Continual improvement"];

export const ISO_CERTS = [
  { code: "ISO 9001:2015", title: "Quality Management System", image: "/jak/certs/cer2.jpg" },
  { code: "ISO 14001:2015", title: "Environmental Management System", image: "/jak/certs/cer1.jpg" },
  { code: "ISO 45001:2018", title: "Occupational Health & Safety", image: "/jak/certs/cer3.jpg" },
];

export const LADCO_CERTS = [
  { code: "ISO 9001:2008", title: "LADCO · Quality Management", image: "/jak/certs/ladco-9001.jpg" },
  { code: "ISO 14001:2004", title: "LADCO · Environmental Management", image: "/jak/certs/ladco-14001.jpg" },
  { code: "OHSAS 18001:2007", title: "LADCO · Health & Safety", image: "/jak/certs/ladco-18001.jpg" },
];

export const WPS = [
  "Single V butt joint (plate) — GMAW",
  "“T” butt joint — GMAW",
  "Fillet weld joint — GMAW",
  "Single V butt joint (plate) — SMAW",
  "“T” butt joint — SMAW",
  "Fillet weld joint — SMAW",
  "Single V butt joint (pipe) — GMAW",
  "Single V butt joint (pipe) — SMAW",
  "Fillet weld TEE joint — GMAW (a42a7)",
  "Fillet weld TEE joint — GMAW (a32a5)",
];

export const CSR_ACTIVITIES = [
  "Eradicating hunger, poverty and malnutrition",
  "Promoting education, special education and vocational skills for children, women, elders and the differently abled",
  "Promoting gender equality and empowering women",
  "Training in rural sports like Silambam and nationally recognised sports",
  "Contributing to the Prime Minister's National Relief Fund",
  "Funding technology incubators within approved academic institutions",
  "Internships that build students' skills and knowledge",
  "Initiating rural development projects",
  "Slum-area development projects",
];

const CSR_RAW: Array<[string, string]> = [
  ["csractivity1", "Educational support"], ["csractivity2", "Missionaries of Charity"], ["csractivity3", "Missionaries of Charity"],
  ["csractivity4", "Health support"], ["csractivity5", "Educational support"], ["csractivity6", "Hunger eradication project"],
  ["csr7", "Essentials to needy people"], ["csr8", "Essentials to needy people"], ["csr9", "Essentials to needy people"],
  ["csr10", "Distribution of food"], ["csr11", "Distribution of food"], ["csr13", "Educational support"],
  ["csr14", "Educational support"], ["csr15", "Supporting an old age home"], ["csr16", "Educational support"],
  ["csr17", "Educational support"], ["csr18", "Malnutrition-free programme"], ["csr19", "Diwali & Children's Day celebration"],
  ["csr20", "Feed the hungry"], ["csr21", "Educational support"], ["csr22", "Feed the hungry"],
  ["csr23", "Divine Christmas"], ["csr24", "Sweater support"], ["csr25", "Educational support"],
  ["csr26", "Educational support"], ["csr27", "Educational support"], ["csr28", "Food essentials"],
  ["csr29", "Educational support"], ["csr30", "Educational support"], ["csr31", "COVID relief distribution"],
  ["csr32", "COVID relief distribution"], ["csr34", "Educational support"], ["csr35", "Food essentials distribution"],
  ["csr36", "Educational support"], ["csr37", "Educational support"], ["csr38", "Feed the hungry"],
  ["csr39", "Educational support"], ["csr40", "Lunch shared with loved ones"], ["csr41", "Corona relief fund"],
  ["csr42", "Lunch shared with loved ones"], ["csr43", "Supply of food"], ["csr44", "Feed the hungry"],
  ["csr45", "Educational support"], ["csr46", "Educational support"], ["csr47", "Educational support"],
  ["csr48", "Food essentials distribution"], ["csr49", "Educational support"], ["csr50", "Educational support"],
  ["csr51", "Educational support"], ["csr52", "Educational support"],
];

export const CSR_GALLERY = CSR_RAW.map(([file, caption]) => ({ src: `/jak/csr/${file}.jpg`, caption }));
