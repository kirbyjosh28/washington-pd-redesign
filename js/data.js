/* ==========================================================================
   CITY OF WASHINGTON, ILLINOIS — CIVIC KNOWLEDGE & DATASET
   Structured Data for Services, Departments, Council, Alerts, Meetings & FAQ
   Zero Emojis • Pure Typographic Metadata
   ========================================================================== */

const CITY_DATA = {
  info: {
    name: "City of Washington",
    state: "Illinois",
    tagline: "Connected Community, Modern Living",
    address: "301 Walnut Street, Washington, IL 61571",
    phone: "(309) 444-3196",
    fax: "(309) 444-9779",
    emergency: "911",
    policeNonEmergency: "(309) 444-2313",
    email: "cityhall@ci.washington.il.us",
    hours: "Monday – Friday: 8:00 AM – 5:00 PM",
    weather: {
      temp: "74°F",
      condition: "Mostly Sunny"
    }
  },

  alerts: [
    {
      id: "alert-1",
      title: "Spray Patching Scheduled for Pine Dr. & Shelbark Ct.",
      category: "Road Work",
      severity: "Notice",
      date: "August 25, 2026",
      status: "Active",
      summary: "Weather permitting, street spray patching operations will take place on Pine Dr. and Shelbark Ct. Expect minor traffic delays.",
      affectedStreets: ["Pine Dr", "Pine Drive", "Shelbark Ct", "Shelbark Court"],
      link: "news.html#alert-1"
    },
    {
      id: "alert-2",
      title: "Boil Order LIFTED: Portions of Catherine St.",
      category: "Water Utility",
      severity: "Resolved",
      date: "August 18, 2026",
      status: "Lifted",
      summary: "The precautionary boil water order for 704, 708, 715, 716, and 720 Catherine St has been officially lifted following clean lab tests.",
      affectedStreets: ["Catherine St", "704 Catherine", "708 Catherine", "715 Catherine", "716 Catherine", "720 Catherine"],
      link: "news.html#alert-2"
    },
    {
      id: "alert-3",
      title: "Road Closure Alert: W. Jefferson St. & Bondurant St. Paving",
      category: "Infrastructure",
      severity: "Notice",
      date: "August 14, 2026",
      status: "Active",
      summary: "Intermittent lane closures on W. Jefferson St & Bondurant St for ongoing asphalt milling and paving improvements.",
      affectedStreets: ["W Jefferson St", "West Jefferson", "Bondurant St", "Bondurant"],
      link: "news.html#alert-3"
    },
    {
      id: "alert-4",
      title: "Economic Development and Planning & Zoning Commission Vacancies",
      category: "Civic Board",
      severity: "Notice",
      date: "August 10, 2026",
      status: "Open",
      summary: "The City is accepting resident applications to fill vacancies on the Economic Development Commission and Planning & Zoning Commission.",
      affectedStreets: [],
      link: "news.html#alert-4"
    }
  ],

  services: [
    {
      id: "srv-water-pay",
      title: "Water & Sewer Utility Bill Pay",
      category: "utilities",
      summary: "Pay monthly municipal water, sewer, and stormwater utility bills online with instant receipt generation or set up autopay.",
      fee: "No municipal fee for ACH / Standard card fee applies",
      turnaround: "Instant processing",
      url: "pay.html?service=water",
      tags: ["water", "sewer", "utility", "bill", "pay", "drainage", "stormwater", "meter"]
    },
    {
      id: "srv-311-report",
      title: "Citizen 311 Request & Issue Reporter",
      category: "residents",
      summary: "Report potholes, broken streetlights, storm debris, missed trash collection, or drainage issues directly to Public Works.",
      fee: "Free Municipal Service",
      turnaround: "1–3 business days",
      url: "requests.html",
      tags: ["pothole", "streetlight", "trash", "311", "repair", "public works", "report", "complaint"]
    },
    {
      id: "srv-building-permit",
      title: "Building & Construction Permits",
      category: "permits",
      summary: "Apply for residential and commercial building permits, including decks, fences, roof replacements, additions, and solar panels.",
      fee: "Calculated by project valuation",
      turnaround: "3–5 business days",
      url: "services.html#permits",
      tags: ["permit", "building", "fence", "deck", "construction", "roof", "zoning", "inspection"]
    },
    {
      id: "srv-business-license",
      title: "Business Licensing & Registration",
      category: "businesses",
      summary: "Register a commercial enterprise, obtain liquor licenses, food truck permits, and commercial sign approvals in Washington.",
      fee: "Starting at $25",
      turnaround: "5–7 business days",
      url: "services.html#business",
      tags: ["business", "license", "liquor", "sign", "food truck", "commercial", "enterprise"]
    },
    {
      id: "srv-meeting-agendas",
      title: "Meeting Center, Agendas & Minutes",
      category: "government",
      summary: "Access upcoming City Council meeting agendas, view live meeting streams, and read approved municipal minutes.",
      fee: "Public Access",
      turnaround: "Published weekly",
      url: "government.html#meetings",
      tags: ["council", "meeting", "agenda", "minutes", "mayor", "alderman", "livestream", "public hearing"]
    },
    {
      id: "srv-gis-maps",
      title: "Interactive GIS & Parcel Maps",
      category: "residents",
      summary: "Explore the City of Washington GIS portal to view zoning classifications, property boundaries, voting wards, and utility lines.",
      fee: "Free Public Access",
      turnaround: "Instant Online Access",
      url: "services.html#gis",
      tags: ["gis", "map", "parcel", "zoning", "ward", "property", "boundaries", "infrastructure"]
    },
    {
      id: "srv-glendale-cemetery",
      title: "Glendale Cemetery Records & Plots",
      category: "residents",
      summary: "Search historical burial records, arrange plot purchases, and view cemetery guidelines for historic Glendale Cemetery.",
      fee: "Plot schedule varies",
      turnaround: "1–2 business days",
      url: "departments.html#dept-cemetery",
      tags: ["cemetery", "glendale", "burial", "records", "genealogy", "plots"]
    },
    {
      id: "srv-parking-tickets",
      title: "Parking Citation Payments",
      category: "utilities",
      summary: "Pay parking citations or submit a review request for parking violations issued by the Washington Police Department.",
      fee: "Standard citation rate",
      turnaround: "Instant processing",
      url: "pay.html?service=parking",
      tags: ["parking", "ticket", "citation", "police", "fine", "vehicle"]
    },
    {
      id: "srv-trash-recycling",
      title: "Curbside Trash & Recycling Schedule",
      category: "residents",
      summary: "View weekly pickup schedules, bulk item disposal rules, yard waste pickup dates, and electronic recycling events.",
      fee: "Included in utility fee",
      turnaround: "Weekly service",
      url: "services.html#waste",
      tags: ["trash", "recycling", "garbage", "yard waste", "bulk waste", "electronic recycling"]
    },
    {
      id: "srv-freedom-of-info",
      title: "FOIA Public Records Requests",
      category: "government",
      summary: "Submit a formal Freedom of Information Act (FOIA) request to access official city records and documents.",
      fee: "Free for standard electronic copies",
      turnaround: "5 business days by law",
      url: "services.html#foia",
      tags: ["foia", "records", "public records", "transparency", "document request", "clerk"]
    }
  ],

  departments: [
    {
      id: "dept-admin",
      name: "City Administration",
      code: "ADMIN",
      head: "Jim Snider, City Administrator",
      phone: "(309) 444-1123",
      email: "jsnider@ci.washington.il.us",
      location: "City Hall, 301 Walnut St",
      hours: "Mon – Fri: 8:00 AM – 5:00 PM",
      description: "Coordinates municipal operations, implements City Council policies, and manages executive city functions."
    },
    {
      id: "dept-police",
      name: "Police Department",
      code: "POLICE",
      head: "Chief Mike McCoy",
      phone: "(309) 444-2313",
      emergency: "911",
      email: "police@ci.washington.il.us",
      location: "115 W. Jefferson St, Washington, IL",
      hours: "24/7 Operations (Front Desk: 8:00 AM – 5:00 PM)",
      description: "Dedicated to protecting public safety, crime prevention, traffic safety, and community policing."
    },
    {
      id: "dept-fire",
      name: "Fire and Rescue Department",
      code: "FIRE",
      head: "Chief Brett Brown",
      phone: "(309) 444-4650",
      emergency: "911",
      email: "fire@ci.washington.il.us",
      location: "200 N. Wilmor Rd, Washington, IL",
      hours: "24/7 Emergency Service",
      description: "Provides fire suppression, emergency medical rescue, disaster preparedness, and fire prevention education."
    },
    {
      id: "dept-public-works",
      name: "Public Works & Engineering",
      code: "PW-ENG",
      head: "Brian R. Fisher, Public Works Director",
      phone: "(309) 745-3503",
      email: "publicworks@ci.washington.il.us",
      location: "301 Walnut St, Washington, IL",
      hours: "Mon – Fri: 7:00 AM – 4:00 PM",
      description: "Maintains streets, traffic signals, stormwater infrastructure, snow removal, and capital improvement projects."
    },
    {
      id: "dept-water",
      name: "Water & Sewer Utilities",
      code: "WATER",
      head: "Jon Oliphant, Utility Superintendent",
      phone: "(309) 444-8292",
      email: "utilities@ci.washington.il.us",
      location: "301 Walnut St, Washington, IL",
      hours: "Mon – Fri: 8:00 AM – 5:00 PM",
      description: "Manages safe drinking water treatment, distribution pipelines, wastewater treatment, and meter services."
    },
    {
      id: "dept-planning",
      name: "Planning & Zoning / Development",
      code: "PLAN",
      head: "Jon Oliphant, Planning Director",
      phone: "(309) 444-1135",
      email: "planning@ci.washington.il.us",
      location: "301 Walnut St, Washington, IL",
      hours: "Mon – Fri: 8:00 AM – 5:00 PM",
      description: "Oversees land use, zoning ordinances, building permits, commercial development, and comprehensive master plans."
    },
    {
      id: "dept-finance",
      name: "Finance & Human Resources",
      code: "FINANCE",
      head: "Joanie Baxter, Finance Director",
      phone: "(309) 444-1124",
      email: "finance@ci.washington.il.us",
      location: "301 Walnut St, Washington, IL",
      hours: "Mon – Fri: 8:00 AM – 5:00 PM",
      description: "Oversees city budgeting, financial auditing, tax collection, municipal payroll, accounts payable, and HR."
    },
    {
      id: "dept-cemetery",
      name: "Glendale Cemetery & Records",
      code: "RECORDS",
      head: "City Clerk's Office",
      phone: "(309) 444-1137",
      email: "records@ci.washington.il.us",
      location: "City Hall, 301 Walnut St",
      hours: "Mon – Fri: 8:00 AM – 4:30 PM",
      description: "Preserves historical municipal records, maps cemetery interments, and assists families with plot arrangements."
    }
  ],

  council: {
    mayor: {
      name: "Gary W. Manier",
      title: "Mayor of Washington",
      phone: "(309) 444-1121",
      email: "gmanier@ci.washington.il.us",
      term: "Elected 2001 – Present",
      bio: "Serving as Mayor since 2001, dedicated to economic growth, civic transparency, and community infrastructure."
    },
    clerk: {
      name: "Valeri Brod",
      title: "City Clerk",
      phone: "(309) 444-1137",
      email: "vbrod@ci.washington.il.us"
    },
    treasurer: {
      name: "Ellen Dingledine",
      title: "City Treasurer",
      phone: "(309) 444-1124",
      email: "treasurer@ci.washington.il.us"
    },
    aldermen: [
      { ward: "01", name: "Mike McIntyre", email: "mmcintyre@ci.washington.il.us", term: "Term expires 2027" },
      { ward: "01", name: "Lilliana Stevens", email: "lstevens@ci.washington.il.us", term: "Term expires 2029" },
      { ward: "02", name: "Brett Adams", email: "badams@ci.washington.il.us", term: "Term expires 2027" },
      { ward: "02", name: "Todd Yoder", email: "tyoder@ci.washington.il.us", term: "Term expires 2029" },
      { ward: "03", name: "Brian Butler", email: "bbutler@ci.washington.il.us", term: "Term expires 2027" },
      { ward: "03", name: "John Blundy", email: "jblundy@ci.washington.il.us", term: "Term expires 2029" },
      { ward: "04", name: "Randall Schultz", email: "rschultz@ci.washington.il.us", term: "Term expires 2027" },
      { ward: "04", name: "Dave Dingledine", email: "ddingledine@ci.washington.il.us", term: "Term expires 2029" }
    ]
  },

  meetings: [
    {
      id: "meet-1",
      title: "Planning & Zoning Commission Meeting",
      date: "September 02, 2026",
      month: "SEP",
      day: "02",
      time: "6:30 PM CST",
      location: "Council Chambers, 301 Walnut St",
      agendaUrl: "government.html#agenda-sept-2",
      type: "Commission",
      status: "Upcoming"
    },
    {
      id: "meet-2",
      title: "City Hall Closed — Labor Day Holiday",
      date: "September 07, 2026",
      month: "SEP",
      day: "07",
      time: "All Day",
      location: "Citywide",
      agendaUrl: "",
      type: "Holiday",
      status: "Observed"
    },
    {
      id: "meet-3",
      title: "City Council Regular Session",
      date: "September 08, 2026",
      month: "SEP",
      day: "08",
      time: "6:30 PM CST",
      location: "Council Chambers & Online Stream",
      agendaUrl: "government.html#agenda-sept-8",
      type: "Council",
      status: "Upcoming"
    },
    {
      id: "meet-4",
      title: "Let's Talk Washington: Community Town Hall",
      date: "September 22, 2026",
      month: "SEP",
      day: "22",
      time: "6:00 PM – 7:30 PM CST",
      location: "Five Points Washington, 360 N Wilmor Rd",
      agendaUrl: "news.html#lets-talk",
      type: "Town Hall",
      status: "Upcoming"
    }
  ],

  faq: [
    {
      q: "How do I pay my monthly water and sewer utility bill?",
      a: "You can pay online through the Instant Bill Pay Portal (no account registration required), set up automatic monthly bank drafts (ACH), drop payments in the 24/7 drop box at City Hall (301 Walnut St), or pay in person Mon–Fri 8:00 AM – 5:00 PM."
    },
    {
      q: "When is my neighborhood trash and recycling pickup day?",
      a: "Curbside collection takes place Monday through Thursday depending on your ward. Waste Management handles citywide pickups. Bulk item collection occurs on your first pickup day of each month."
    },
    {
      q: "Do I need a permit to build a fence, deck, or shed?",
      a: "Yes. All structural additions, fences, decks, swimming pools, and accessory sheds require a building permit and zoning setback review from the Planning & Zoning Department prior to construction."
    },
    {
      q: "How do I check if my address is currently under a boil water order?",
      a: "Use our interactive Street Boil Order lookup tool on the News & Alerts page or enter your street in the Spotlight Search (Cmd+K). Precautionary boil orders are also sent via E-Notify and posted on the official City Facebook page."
    },
    {
      q: "How can I speak or submit comments at a City Council meeting?",
      a: "City Council meets on the 1st and 3rd Mondays of each month at 6:30 PM at City Hall. Residents may register to speak during Audience Comments by submitting a speaker card before the meeting starts or via the online form."
    }
  ],

  municipalCode: {
    authority: "Codified through Ordinance No. 3613 (Supp. No. 1, updated May 12, 2026) by Municipal Code Corporation (Municode / CivicPlus).",
    officialUrl: "https://library.municode.com/il/washington/codes/code_of_ordinances",
    popular: [
      {
        id: "code-fences",
        title: "Residential Fence Heights & Setbacks",
        section: "Chapter 56 § 56.020",
        category: "Zoning (Chapter 56)",
        summary: "Fences in residential rear and side yards may not exceed 6 feet in height. Front yard fences are limited to 4 feet in height with at least 50% open vision design. All fences must be placed entirely on private property with finished side facing outward.",
        tags: ["fence", "fences", "height", "setback", "yard", "backyard", "property line", "barrier", "chapter 56"]
      },
      {
        id: "code-snow",
        title: "Snow Emergency Street Parking Ban",
        section: "Chapter 72 § 72.040",
        category: "Traffic & Parking (Chapter 72)",
        summary: "It is unlawful to park any vehicle on designated snow emergency routes or any city street following an accumulation of 2 or more inches of snow until plowing operations are complete. Violators are subject to immediate towing and citations.",
        tags: ["snow", "parking", "plow", "street parking", "winter", "blizzard", "emergency route", "tow", "chapter 72"]
      },
      {
        id: "code-noise",
        title: "Noise & Quiet Hours Regulations",
        section: "Chapter 92 § 92.15",
        category: "Public Peace (Chapter 92)",
        summary: "Unreasonable or excessive noise that disturbs the peace is prohibited citywide. Construction and heavy equipment operations are restricted to 7:00 AM – 7:00 PM Monday through Saturday and 9:00 AM – 6:00 PM on Sundays.",
        tags: ["noise", "quiet hours", "sound", "loud music", "construction hours", "lawn mower", "peace", "chapter 92"]
      },
      {
        id: "code-pets",
        title: "Animal Control & Leash Requirements",
        section: "Chapter 90 § 90.05",
        category: "Animal Control (Chapter 90)",
        summary: "All dogs and domestic pets must be kept on a physical leash when off private property. Owners must clean up animal waste immediately. A maximum of 3 adult dogs are permitted per residential dwelling without a kennel license.",
        tags: ["dog", "cat", "pet", "leash", "animals", "barking", "waste", "rabies", "vaccination", "chapter 90"]
      },
      {
        id: "code-sheds",
        title: "Accessory Structures & Storage Sheds",
        section: "Chapter 56 § 56.022",
        category: "Zoning & Building (Chapter 56/150)",
        summary: "Storage sheds up to 144 sq ft require an approved zoning certificate and must maintain at least 5-foot setbacks from side and rear lot lines. Sheds over 144 sq ft require a permanent concrete foundation and standard building permit.",
        tags: ["shed", "garage", "outbuilding", "storage", "setback", "building permit", "foundation", "chapter 56"]
      },
      {
        id: "code-garage-sales",
        title: "Garage Sales & Temporary Signs",
        section: "Chapter 56 § 56.045",
        category: "Zoning & Signs (Chapter 56)",
        summary: "Residential garage sales are permitted for up to 3 consecutive days, with a maximum of 3 sales per calendar year per property. Directional signs may only be placed on private property with owner permission and must be removed within 24 hours.",
        tags: ["garage sale", "yard sale", "signs", "temporary sign", "rummage sale", "permit", "chapter 56"]
      }
    ],

    titles: [
      {
        id: "title-1",
        number: "Title I",
        name: "General Provisions",
        range: "Chapter 10 – 11",
        summary: "Rules of construction, general penalty provisions, city seal, and definitions governing the interpretation of the entire municipal code.",
        chapters: [
          { number: "Chapter 10", title: "General Code Provisions & Statutory Construction" },
          { number: "Chapter 11", title: "City Boundaries, Wards & Corporate Seal" }
        ]
      },
      {
        id: "title-3",
        number: "Title III",
        name: "Administration & Governance",
        range: "Chapter 30 – 35",
        summary: "Organization and powers of the Mayor, City Council, City Administrator, Standing Committees, and Municipal Finance.",
        chapters: [
          { number: "Chapter 30", title: "City Council & Rules of Legislative Procedure" },
          { number: "Chapter 31", title: "Standing Committees (Finance, Public Works, Public Safety)" },
          { number: "Chapter 32", title: "Mayor, City Administrator, Clerk & Appointed Officers" },
          { number: "Chapter 33", title: "Planning & Zoning Commission and Advisory Boards" },
          { number: "Chapter 35", title: "Municipal Finance, Fees & Local Tax Administration" }
        ]
      },
      {
        id: "title-5",
        number: "Title V",
        name: "Public Works, Utilities & Comprehensive Zoning",
        range: "Chapter 50 – 56",
        summary: "Municipal water utility regulations, sanitary sewer rates, stormwater management, refuse collection, and the Comprehensive Zoning Code (Chapter 56).",
        chapters: [
          { number: "Chapter 50", title: "Municipal Water Utility Regulations & Meters" },
          { number: "Chapter 51", title: "Sewer Use Regulations & Discharge Standards" },
          { number: "Chapter 52", title: "Stormwater Management & Erosion Control" },
          { number: "Chapter 53", title: "Refuse, Recycling & Yard Waste Collection" },
          { number: "Chapter 56", title: "Comprehensive Zoning Code, Setbacks, Fences & Signage (Adopted 2024)" }
        ]
      },
      {
        id: "title-7",
        number: "Title VII",
        name: "Traffic & Motor Vehicles",
        range: "Chapter 70 – 73",
        summary: "Speed regulations, stop intersections, automated enforcement, on-street parking schedules, snow emergency routes, and commercial vehicle weights.",
        chapters: [
          { number: "Chapter 70", title: "General Traffic Regulations & Enforcement" },
          { number: "Chapter 71", title: "Speed Limits & Restricted Streets" },
          { number: "Chapter 72", title: "Parking Regulations, Snow Routes & Towing" },
          { number: "Chapter 73", title: "Bicycles, Skateboards & Toy Vehicles" }
        ]
      },
      {
        id: "title-9",
        number: "Title IX",
        name: "General Regulations & Public Peace",
        range: "Chapter 90 – 94",
        summary: "Animal control and rabies vaccination, nuisance vegetation and tall grass, noise control, open burning, and public health safeguards.",
        chapters: [
          { number: "Chapter 90", title: "Animal Control, Leash Laws & Pet Licensing" },
          { number: "Chapter 91", title: "Nuisance Abatement & Tall Grass / Weeds" },
          { number: "Chapter 92", title: "Noise Control & Construction Hours" },
          { number: "Chapter 93", title: "Open Burning & Fire Prevention" },
          { number: "Chapter 94", title: "Fireworks Regulations & Display Permits" }
        ]
      },
      {
        id: "title-11",
        number: "Title XI",
        name: "Business Regulations & Licensing",
        range: "Chapter 110 – 113",
        summary: "Alcoholic beverage control and liquor licensing classes, solicitors and peddlers permits, video gaming terminals, and tobacco sales regulations.",
        chapters: [
          { number: "Chapter 110", title: "Alcoholic Liquor Licenses & Regulations" },
          { number: "Chapter 111", title: "Peddlers, Itinerant Merchants & Solicitors" },
          { number: "Chapter 112", title: "Video Gaming Terminals & Licensing" },
          { number: "Chapter 113", title: "Tobacco & Alternative Nicotine Products" }
        ]
      },
      {
        id: "title-13",
        number: "Title XIII",
        name: "General Offenses & Public Welfare",
        range: "Chapter 130 – 133",
        summary: "Offenses against public peace and property, curfew for minors under 17, weapons discharge, and public park rules.",
        chapters: [
          { number: "Chapter 130", title: "Offenses Against Public Peace & Order" },
          { number: "Chapter 131", title: "Offenses Against Property & Vandalism" },
          { number: "Chapter 132", title: "Curfew for Minors & Parental Responsibility" },
          { number: "Chapter 133", title: "Weapons, Firearms & Concealed Carry" }
        ]
      },
      {
        id: "title-15",
        number: "Title XV",
        name: "Building Codes & Subdivisions",
        range: "Chapter 150 – 155",
        summary: "Building construction codes, residential inspections, electrical/plumbing standards, subdivision improvements, and historic preservation.",
        chapters: [
          { number: "Chapter 150", title: "Building Codes, Inspections & Permits" },
          { number: "Chapter 151", title: "Electrical, Plumbing & Mechanical Codes" },
          { number: "Chapter 152", title: "Subdivision Regulations & Infrastructure" },
          { number: "Chapter 153", title: "Floodplain Management & Elevation Standards" },
          { number: "Chapter 155", title: "Historic Preservation District & Standards" }
        ]
      }
    ],

    recentOrdinances: [
      {
        number: "Ordinance No. 3625",
        title: "Commercial Vehicle Street Regulation (Amends Section 52-204)",
        date: "Adopted June 15, 2026",
        summary: "Regulates the operation of commercial vehicles on certain designated city streets and establishes weight threshold restrictions.",
        status: "Enacted (Pending Codification)",
        url: "https://library.municode.com/il/washington/ordinances/code_of_ordinances?nodeId=1439002"
      },
      {
        number: "Ordinance No. 3620",
        title: "Cannabis & Synthetic Drugs Regulations",
        date: "Adopted May 4, 2026",
        summary: "Amends the Washington City Code regarding possession, retail licensing standards, public use, and zoning restrictions for cannabis.",
        status: "Enacted (Pending Codification)",
        url: "https://library.municode.com/il/washington/ordinances/code_of_ordinances?nodeId=1431586"
      },
      {
        number: "Ordinance No. 3615",
        title: "Water & Sewer Rate Modernization (Amends Section 54-134(a))",
        date: "Adopted April 6, 2026",
        summary: "Amends City of Washington water and sewer utility consumption rate tiers and capital reserve allocations under Section 54-134(a).",
        status: "Enacted (Pending Codification)",
        url: "https://library.municode.com/il/washington/ordinances/code_of_ordinances?nodeId=1431588"
      },
      {
        number: "Ordinance No. 3457",
        title: "Home Rule Retailers' & Service Occupation Tax (Chapter 35)",
        date: "Adopted March 21, 2022",
        summary: "Amends Chapter 35 (Taxation) of the Code of Ordinances to adjust the Home Rule Municipal Retailers' Occupation Tax by one-half of one percent.",
        status: "Enacted (Pending Codification)",
        url: "https://library.municode.com/il/washington/ordinances/code_of_ordinances?nodeId=1431587"
      }
    ]
  }
};

/* ==========================================================================
   WASHINGTON POLICE DEPARTMENT — CIVIC DATASET & KNOWLEDGE ENGINE
   Districts, Street Mapping, 24/7 Patrol Watch Architecture & 1-Click Services
   ========================================================================== */

const WPD_DATA = {
  identity: {
    name: "Washington Police Department",
    motto: "Serve with Honor, Protect with Purpose, Lead with Integrity",
    established: 1825,
    chief: "Jeff Stevens",
    chiefTitle: "Chief of Police",
    address: "115 W. Jefferson St., Washington, IL 61571",
    emergency: "911",
    nonEmergency: "(309) 444-2313",
    fax: "(309) 444-7511",
    social: {
      facebook: "https://www.facebook.com/WashingtonPoliceDepartment",
      instagram: "https://www.instagram.com/washington_il_police_dept/"
    },
    lobbyHours: "Monday – Friday: 8:00 AM – 4:30 PM (Records & Administrative Window)",
    patrolHours: "Continuous 24 Hours a Day, 7 Days a Week, 365 Days a Year"
  },

  watches: [
    {
      id: "watch-1",
      name: "Watch 1 (Day Watch)",
      hours: "07:00 – 15:00",
      startHour: 7,
      endHour: 15,
      supervisor: "On-Duty Patrol Sergeant",
      focus: "School zones, business district patrols, traffic safety, municipal court details"
    },
    {
      id: "watch-2",
      name: "Watch 2 (Afternoon Watch)",
      hours: "15:00 – 23:00",
      startHour: 15,
      endHour: 23,
      supervisor: "On-Duty Patrol Sergeant",
      focus: "School dismissal, rush hour traffic flow, commercial retail corridors, park checks"
    },
    {
      id: "watch-3",
      name: "Watch 3 (Midnight Watch)",
      hours: "23:00 – 07:00",
      startHour: 23,
      endHour: 7,
      supervisor: "On-Duty Patrol Sergeant",
      focus: "Commercial business security checks, residential neighborhood patrols, overnight parking enforcement"
    }
  ],

  districts: {
    1: {
      id: 1,
      name: "District 1 (East Sector)",
      color: "#2563EB",
      coverage: "East half of the City of Washington",
      acres: "433.6 Acres",
      boundaries: "Main St & Wood St corridor East to city limits, including Centennial Dr, Five Points, and WCHS campus.",
      landmarks: ["Washington Community High School (District 308)", "Five Points Washington", "Farmdale Park Border"],
      sectorCar: "Sector Car 101",
      supervisor: "East Sector Sergeant",
      priority: "School community safety, East-side neighborhood presence, Route 24 East traffic coordination"
    },
    2: {
      id: 2,
      name: "District 2 (West Sector)",
      color: "#059669",
      coverage: "West half of the City of Washington",
      acres: "1,681.4 Acres",
      boundaries: "Main St corridor West to Peoria limits, including Business Route 24, WPD Headquarters, and historic Downtown Square.",
      landmarks: ["Historic Downtown Washington Square", "Central Primary School", "Washington Middle School", "City Hall", "WPD Headquarters"],
      sectorCar: "Sector Car 102",
      supervisor: "West Sector Sergeant",
      priority: "Historic downtown pedestrian safety, school zones, Peoria St business corridor, community walk-and-talk"
    },
    3: {
      id: 3,
      name: "District 3 (North Sector / Bypass)",
      color: "#7C3AED",
      coverage: "Devonshire & North Route 24 Growth Corridor",
      acres: "1,476.7 Acres",
      boundaries: "All residential subdivisions and commercial centers located North of the US Route 24 Bypass (Devonshire, Cruger Rd, Dallas Rd).",
      landmarks: ["Devonshire Subdivision", "Route 24 Retail Corridor", "Northern Residential Growth"],
      sectorCar: "Sector Car 103",
      supervisor: "North Sector Sergeant",
      priority: "Commercial corridor security, residential traffic calming, proactive retail theft deterrence"
    }
  },

  streets: [
    { name: "Devonshire Dr", district: 3, area: "Devonshire Subdivision" },
    { name: "Newcastle Rd", district: 3, area: "North Sector" },
    { name: "Northpoint Dr", district: 3, area: "Route 24 Commercial" },
    { name: "Cruger Rd", district: 3, area: "North Bypass Corridor" },
    { name: "Constitution Ave", district: 3, area: "North Growth Area" },
    { name: "Freedom Ln", district: 3, area: "North Growth Area" },
    { name: "North Wilmor Rd", district: 3, area: "North of Bypass" },
    { name: "Peoria St", district: 2, area: "West Sector / Business 24" },
    { name: "West Jefferson St", district: 2, area: "Downtown / Station Corridor" },
    { name: "Walnut St", district: 2, area: "City Hall / Downtown" },
    { name: "Washington Square", district: 2, area: "Historic Square" },
    { name: "South Main St", district: 2, area: "Main Corridor" },
    { name: "Holland St", district: 2, area: "West Residential" },
    { name: "Zinser Pl", district: 2, area: "West Historic" },
    { name: "Market St", district: 2, area: "Square Commercial" },
    { name: "Summit Dr", district: 2, area: "West Ridge" },
    { name: "East Jefferson St", district: 1, area: "East Residential" },
    { name: "Wood St", district: 1, area: "East Sector Border" },
    { name: "Centennial Dr", district: 1, area: "East / WCHS Corridor" },
    { name: "Dallas Rd", district: 3, area: "North / Devonshire Corridor" },
    { name: "Cummings Ln", district: 2, area: "West Sector Corridor" },
    { name: "Nofsinger Rd", district: 1, area: "Northeast Sector" },
    { name: "Pine Dr", district: 1, area: "East Residential" },
    { name: "Shelbark Ct", district: 1, area: "East Residential" },
    { name: "Catherine St", district: 1, area: "East Central" },
    { name: "School St", district: 1, area: "Central East" },
    { name: "Birkett Ln", district: 1, area: "East Sector" },
    { name: "Hillcrest Dr", district: 1, area: "East Residential" }
  ],

  services1Click: [
    {
      id: "vacation-check",
      title: "Vacation House Check",
      badge: "Free Service",
      desc: "Going out of town? Request periodic patrol officer safety checks of your residence while you are away.",
      actionText: "Request House Check",
      drawerId: "drawer-vacation-check"
    },
    {
      id: "parking-permission",
      title: "Overnight Parking Permission",
      badge: "Instant Approval",
      desc: "City code restricts parking on city streets 2am–6am. Register your vehicle for overnight street permission.",
      actionText: "Request Parking Exemption",
      drawerId: "drawer-parking-permission"
    },
    {
      id: "police-records",
      title: "Police Records & FOIA",
      badge: "Public Records",
      desc: "Submit statutory Freedom of Information Act requests or request official incident and case report copies.",
      actionText: "Request Police Records",
      drawerId: "drawer-police-records"
    },
    {
      id: "crash-reports",
      title: "Accident & Crash Reports",
      badge: "Direct Lookup",
      desc: "Obtain official State of Illinois traffic crash reports online through our secure records partner portal.",
      actionText: "Search Crash Portal",
      isExternal: true,
      url: "https://www.buycrash.com"
    },
    {
      id: "anonymous-tip",
      title: "Submit an Anonymous Tip",
      badge: "100% Confidential",
      desc: "Share information about suspicious activity or ongoing investigations without revealing your identity.",
      actionText: "Send Confidential Tip",
      drawerId: "drawer-anonymous-tip"
    },
    {
      id: "child-safety-seat",
      title: "Child Safety Seat Inspection",
      badge: "Certified Technicians",
      desc: "Schedule a free inspection and proper car seat installation check with a state-certified child passenger safety officer.",
      actionText: "Schedule Free Inspection",
      drawerId: "drawer-child-seat"
    },
    {
      id: "commend-officer",
      title: "Commend an Officer / Feedback",
      badge: "Community Voice",
      desc: "Recognize an officer for exceptional service or share constructive feedback on your interaction with WPD.",
      actionText: "Submit Commendation",
      drawerId: "drawer-commendation"
    },
    {
      id: "codered-alerts",
      title: "CodeRED Emergency Alerts",
      badge: "Vital Alerts",
      desc: "Receive urgent emergency notifications, weather warnings, and critical safety updates directly to your phone.",
      actionText: "Register for CodeRED",
      isExternal: true,
      url: "https://public.coderedweb.com/CNE/en-US/BF8738F9B6E9"
    }
  ],

  specializedUnits: [
    {
      name: "CIERT Tactical & Crisis Negotiation",
      code: "REGIONAL SWAT",
      desc: "Washington participates in the Central Illinois Emergency Response Team with tactical officers and certified crisis negotiators dedicated to high-risk incident resolution.",
      officersAssigned: "6 Officers & Negotiators"
    },
    {
      name: "School Resource Program (SRO)",
      code: "YOUTH SAFETY",
      desc: "Full-time dedicated officers stationed directly at Washington Community High School (District 308) and Central School District 51 to provide daily safety, mentoring, and student support.",
      officersAssigned: "Dedicated SROs"
    },
    {
      name: "Cybercrime & Crimes Against Children",
      code: "TASK FORCE",
      desc: "Investigators cross-deputized with the Homeland Security Investigations Cybercrime Task Force and the Illinois Attorney General's Crimes Against Children Task Force.",
      officersAssigned: "Specialized Detectives"
    },
    {
      name: "Part-Time Police Unit",
      code: "COMMUNITY SUPPORT",
      desc: "Fully certified sworn officers providing flexible reinforcement for special community events, Washington Square festivals, and high-visibility seasonal park bicycle patrols.",
      officersAssigned: "Auxiliary Unit"
    }
  ],

  recruitment: {
    startingSalary: "$68,500 – $84,200 (CBA Scale)",
    lateralBonus: "Accelerated Pay Step for Experienced Officers",
    benefits: [
      "100% City-paid medical, dental, and life insurance options",
      "Tier 2 Police Pension Fund enrollment",
      "Department-issued individual patrol rifles and modern optics",
      "Quarterly firearms and tactical qualification program",
      "Department gym facility & fitness incentive stipends",
      "Twice-annual seniority shift bidding (May & November)"
    ],
    applicationPdf: "https://www.ci.washington.il.us/egov/apps/document/center.egov?view=item&id=2040",
    partTimePdf: "https://www.ci.washington.il.us/egov/apps/document/center.egov?view=item&id=2074",
    cbaPdf: "https://www.ci.washington.il.us/egov/apps/document/center.egov?view=item&id=2569"
  }
};

