/* ==========================================================================
   WASHINGTON POLICE DEPARTMENT: CIVIC DATASET & DIRECTORY
   Districts, Street Mapping, 24/7 Patrol Operations & Resident Services
   Strict Direct-Linking to Official City Portals + 5 In-App Smart Drawers
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
      id: "shift-day",
      name: "Day Shift",
      hours: "07:00 – 15:00",
      startHour: 7,
      endHour: 15,
      supervisor: "On-Duty Patrol Sergeant",
      focus: "School zones, business district patrols, traffic safety, municipal court details"
    },
    {
      id: "shift-afternoon",
      name: "Afternoon Shift",
      hours: "15:00 – 23:00",
      startHour: 15,
      endHour: 23,
      supervisor: "On-Duty Patrol Sergeant",
      focus: "School dismissal, rush hour traffic flow, commercial retail corridors, park checks"
    },
    {
      id: "shift-night",
      name: "Night Shift",
      hours: "23:00 – 07:00",
      startHour: 23,
      endHour: 7,
      supervisor: "On-Duty Patrol Sergeant",
      focus: "Commercial business security checks, residential neighborhood patrols, traffic safety, and vacation house checks"
    }
  ],

  districts: {
    1: {
      id: 1,
      name: "District 1 (Historic Core & East Sector)",
      color: "#2563EB",
      coverage: "Historic Downtown Square, Devonshire, WCHS & Washington Middle School (North Main)",
      acres: "433.6 Acres",
      boundaries: "Territory east of North Wilmor Road to eastern municipal limits, bounded by Devonshire Road and North Main Street corridors to the north, encompassing Historic Downtown Square, WPD Police Headquarters, City Hall, Washington Middle School (District 52 on North Main), Lincoln Grade School, and Washington Community High School.",
      landmarks: [
        "Historic Downtown Washington Square & Fountain",
        "WPD Police Headquarters (115 W. Jefferson St)",
        "Washington City Hall (301 Walnut St)",
        "Washington Middle School (District 52 / 1100 N. Main St)",
        "Washington Community High School (District 308 / 115 Bondurant St)",
        "Lincoln Grade School (375 W. Peoria St / Rec Trail)",
        "Devonshire Estates & Devonshire Road",
        "Fire Station 2 (105 S. Spruce St)"
      ],
      sectorCar: "Sector Car 101",
      supervisor: "East & Core Sector Sergeant",
      priority: "Downtown commercial district, school zone transit safety, Devonshire neighborhood coverage, East Route 24 coordination"
    },
    2: {
      id: 2,
      name: "District 2 (West Sector)",
      color: "#059669",
      coverage: "West Washington, Freedom Parkway Hub, ALDI Commercial Corridor & Western Subdivisions",
      acres: "1,681.4 Acres",
      boundaries: "Territory south of Washington Road (Business 24) from Wilmor Road west to Cummings Lane, and extending across the entire western municipal boundaries west of Cummings Lane, including Freedom Parkway retail corridor, ALDI, Centennial Drive, and Meadow Valley Park.",
      landmarks: [
        "Freedom Parkway Retail Center & Walmart Supercenter",
        "ALDI (1110 Peoria St / Washington Plaza)",
        "Meadow Valley Park (525 Ernest St)",
        "Peoria Street Western Commercial Corridor",
        "South Cummings Lane Corridor",
        "Washington Estates & Western Subdivisions"
      ],
      sectorCar: "Sector Car 102",
      supervisor: "West Sector Sergeant",
      priority: "Retail loss deterrence, commercial speed enforcement, ALDI corridor safety, western residential neighborhood patrols"
    },
    3: {
      id: 3,
      name: "District 3 (North Sector / Bypass)",
      color: "#7C3AED",
      coverage: "Five Points Washington, Central School Campus, North Wilmor & Route 24 Bypass",
      acres: "1,476.7 Acres",
      boundaries: "Territory north of Washington Road (Business 24) between Cummings Lane and Wilmor Road, extending north to the US Route 24 Bypass, West Cruger Road, and northern municipal limits, including Five Points Washington, Central Primary School, Central Intermediate School, and Fire Station 1.",
      landmarks: [
        "Five Points Washington Community Center (360 N. Wilmor Rd)",
        "Central Primary School (District 51 / 1400 Newcastle Rd)",
        "Central Intermediate School (District 51 / 1301 Eagle Ave)",
        "Washington Fire Station 1 (200 N. Wilmor Rd)",
        "Cherry Tree Shopping Center & Kroger (North side Peoria St)",
        "US Route 24 Bypass Commercial & Cruger Corridors",
        "Rolling Meadows & Oak Creek Subdivisions"
      ],
      sectorCar: "Sector Car 103",
      supervisor: "North Sector Sergeant",
      priority: "School zone arrival safety, Five Points community facility security, Bypass corridor traffic management, northern neighborhood patrols"
    }
  },

  /* Washington Street Directory for Instant Address-to-Patrol Beat GIS Resolver */
  streets: [
    /* District 1: Historic Core & East Sector */
    { name: "Washington Square", district: 1, area: "Historic Downtown Square" },
    { name: "West Jefferson St", district: 1, area: "WPD Headquarters / Core Corridor" },
    { name: "East Jefferson St", district: 1, area: "East Residential Corridor" },
    { name: "Walnut St", district: 1, area: "City Hall / Downtown Commercial" },
    { name: "Market St", district: 1, area: "Downtown Square Core" },
    { name: "South Main St", district: 1, area: "Downtown Core Corridor" },
    { name: "North Main St", district: 1, area: "Washington Middle School Corridor" },
    { name: "Devonshire Rd", district: 1, area: "Devonshire Estates" },
    { name: "Wood St", district: 1, area: "East Sector Corridor" },
    { name: "Bondurant St", district: 1, area: "WCHS Campus Corridor" },
    { name: "Lincoln St", district: 1, area: "Lincoln Grade School / East" },
    { name: "Catherine St", district: 1, area: "East Central" },
    { name: "Birkett Ln", district: 1, area: "East Sector Corridor" },
    { name: "Holland St", district: 1, area: "East Residential" },
    { name: "Zinser Pl", district: 1, area: "Dement-Zinser Historic Core" },
    { name: "Harvey St", district: 1, area: "St. Patrick School / East" },
    { name: "South Spruce St", district: 1, area: "Fire Station 2 Corridor" },
    { name: "Elm St", district: 1, area: "East Downtown Residential" },
    { name: "Pine St", district: 1, area: "East Core Residential" },
    { name: "Cedar St", district: 1, area: "East Core Residential" },
    { name: "Kingsbury Rd", district: 1, area: "Devonshire East" },
    { name: "Georgetown Dr", district: 1, area: "Devonshire East Subdivisions" },
    { name: "Wellington Dr", district: 1, area: "Devonshire East Subdivisions" },
    { name: "Bristol Ct", district: 1, area: "Devonshire East Subdivisions" },
    { name: "Chester Ct", district: 1, area: "Devonshire East Subdivisions" },

    /* District 2: West Sector */
    { name: "Centennial Dr", district: 2, area: "West Residential / Connector Artery" },
    { name: "School St", district: 2, area: "West Residential / School Corridor" },
    { name: "Freedom Pkwy", district: 2, area: "Freedom Pkwy Commercial / Walmart Hub" },
    { name: "Peoria St", district: 2, area: "ALDI / West Commercial Corridor (Bus 24)" },
    { name: "West Peoria St", district: 2, area: "West Commercial Corridor" },
    { name: "Cummings Ln", district: 2, area: "West Sector Patrol Artery" },
    { name: "South Cummings Ln", district: 2, area: "West Residential / Commercial Artery" },
    { name: "Ernest St", district: 2, area: "Meadow Valley Park Access" },
    { name: "Pine Dr", district: 2, area: "West Residential" },
    { name: "Hillcrest Dr", district: 2, area: "West Residential Subdivisions" },
    { name: "Summit Dr", district: 2, area: "West Ridge Residential" },
    { name: "Lawndale Ave", district: 2, area: "West Sector Residential" },
    { name: "Hilldale Ave", district: 2, area: "West Residential Corridor" },
    { name: "Ransom Rd", district: 2, area: "West Sector Commercial" },
    { name: "Washington Rd", district: 2, area: "Business Route 24 Commercial Corridor" },
    { name: "Westgate Rd", district: 2, area: "West Residential Subdivisions" },
    { name: "Northgate Rd", district: 2, area: "West Residential Subdivisions" },
    { name: "Southgate Rd", district: 2, area: "West Residential Subdivisions" },
    { name: "Woodridge Dr", district: 2, area: "West Subdivisions" },
    { name: "Meadow Ave", district: 2, area: "Meadow Valley Corridor" },

    /* District 3: North Sector / Bypass */
    { name: "North Wilmor Rd", district: 3, area: "Five Points / North Wilmor Corridor" },
    { name: "Wilmor Rd", district: 3, area: "Five Points / Fire Station 1 Corridor" },
    { name: "Eagle Ave", district: 3, area: "Central Intermediate School Corridor" },
    { name: "Newcastle Rd", district: 3, area: "Central Primary School Corridor" },
    { name: "Nofsinger Rd", district: 3, area: "Cruger Bypass / North Corridor" },
    { name: "Cruger Rd", district: 3, area: "North Cruger Bypass Corridor" },
    { name: "West Cruger Rd", district: 3, area: "North Cruger Bypass Corridor" },
    { name: "Dallas Rd", district: 3, area: "North Residential Corridor" },
    { name: "Freedom Ln", district: 3, area: "North Growth Area" },
    { name: "Constitution Ave", district: 3, area: "North Bypass Corridor" },
    { name: "Cherry Tree Shopping Ctr", district: 3, area: "Kroger Commercial Center" },
    { name: "Oak Creek Dr", district: 3, area: "Oak Creek Subdivisions" },
    { name: "Rolling Meadows Dr", district: 3, area: "Rolling Meadows Subdivisions" },
    { name: "Charter Oak Dr", district: 3, area: "North Subdivisions" },
    { name: "Canterbury Dr", district: 3, area: "North Residential Subdivisions" },
    { name: "Stratford Dr", district: 3, area: "North Residential Subdivisions" },
    { name: "Cambridge Dr", district: 3, area: "North Residential Subdivisions" },
    { name: "Oxford Ave", district: 3, area: "North Residential Subdivisions" }
  ],

  /* Services Catalog - Strict Direct Link vs 5 Gap Smart Form Drawers */
  services1Click: [
    {
      id: "vacation-check",
      title: "Vacation House Watch",
      badge: "Official City Portal ↗",
      desc: "Enroll directly in periodic patrol exterior security checks while traveling away from Washington.",
      actionText: "Enroll on City Portal ↗",
      isExternal: true,
      url: "https://www.ci.washington.il.us/egov/apps/action/center.egov?view=form;page=1;id=15"
    },
    {
      id: "parking-permits",
      title: "Overnight Street Parking Permits",
      badge: "Direct WPD Workflow →",
      desc: "Request temporary exemption from 2:00 AM – 6:00 AM street parking restriction (§ 72.02).",
      actionText: "Request Parking Permit →",
      drawerId: "drawer-parking-permits"
    },
    {
      id: "payments-parking",
      title: "Pay Parking Ticket Online",
      badge: "Official City Portal ↗",
      desc: "Direct online settlement for City of Washington parking tickets and violation citations.",
      actionText: "Pay Ticket Online ↗",
      isExternal: true,
      url: "https://www.ci.washington.il.us/egov/apps/payment/center.egov?view=form;page=1;id=21"
    },
    {
      id: "police-records",
      title: "Police Records & FOIA",
      badge: "Official City Portal ↗",
      desc: "Submit statutory Illinois FOIA filings or request official incident reports directly to City Hall.",
      actionText: "Submit City FOIA ↗",
      isExternal: true,
      url: "https://www.ci.washington.il.us/egov/apps/action/center.egov?view=form;page=1;id=179"
    },
    {
      id: "bicycle-registration",
      title: "Bicycle Identification Registry",
      badge: "Direct WPD Workflow →",
      desc: "Register bicycle serial number and frame details for rapid recovery if lost or stolen.",
      actionText: "Register Bicycle →",
      drawerId: "drawer-bicycle-registration"
    },
    {
      id: "crash-reports",
      title: "Accident & Crash Reports",
      badge: "State Partner Portal ↗",
      desc: "Obtain official State of Illinois traffic crash reports online through BuyCrash.",
      actionText: "Search Crash Portal ↗",
      isExternal: true,
      url: "https://buycrash.lexisnexisrisk.com/"
    },
    {
      id: "anonymous-tip",
      title: "Submit an Anonymous Tip",
      badge: "Direct WPD Workflow →",
      desc: "Share 100% confidential intelligence regarding narcotics or investigations without revealing your identity.",
      actionText: "Send Confidential Tip →",
      drawerId: "drawer-anonymous-tip"
    },
    {
      id: "child-safety-seat",
      title: "Child Safety Seat Inspection",
      badge: "Direct WPD Workflow →",
      desc: "Book a free installation inspection with state-certified Child Passenger Safety officers.",
      actionText: "Book Inspection →",
      drawerId: "drawer-child-seat"
    },
    {
      id: "commend-officer",
      title: "Commend an Officer / Feedback",
      badge: "Direct WPD Workflow →",
      desc: "Recognize an officer for exceptional field service or share constructive feedback.",
      actionText: "Submit Commendation →",
      drawerId: "drawer-commendation"
    },
    {
      id: "drug-disposal",
      title: "Safe Medication Disposal",
      badge: "HQ Walk-In Kiosk",
      desc: "Dispose of expired or unused medications safely in our permanent 24/7 lobby drop box.",
      actionText: "Drop Box Guidelines",
      isInternalLink: true,
      url: "services.html#drug-disposal"
    },
    {
      id: "codered-alerts",
      title: "CodeRED Emergency Alerts",
      badge: "County System ↗",
      desc: "Receive urgent emergency notifications, weather warnings, and critical safety updates.",
      actionText: "Enroll in CodeRED ↗",
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
      desc: "10 state-certified sworn officers who augment full-time personnel, providing event security, Washington Square festival patrols, park safety, and emergency surge staffing.",
      officersAssigned: "10 Sworn Officers"
    },
    {
      name: "Canine Unit (K-9)",
      code: "SPECIALIZED PATROL",
      desc: "Dual-purpose police service dog team trained in narcotics detection, tracking, area searches, and handler protection.",
      officersAssigned: "K-9 Team"
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

/* ==========================================================================
   WPD CIVIC COMMAND SEARCH INDEX (⌘K / Ctrl+K Palette)
   Tags: city-portal (External ↗), wpd-drawer (Instant ⚡), partner (↗), nav, phone
   ========================================================================== */
const WPD_COMMAND_SEARCH_INDEX = [
  /* Official City of Washington Forms (Direct Link Out) */
  {
    title: "Vacation House Watch Enrollment",
    category: "Official City Portals",
    type: "city-portal",
    action: "https://www.ci.washington.il.us/egov/apps/action/center.egov?view=form;page=1;id=15",
    badge: "Official City Form ↗",
    keywords: "vacation house watch property check travel away out of town patrol exterior security home residential premises check",
    desc: "Direct deep-link to City of Washington eGov Action Center Form #15"
  },
  {
    title: "Pay Parking Ticket Online",
    category: "Official City Portals",
    type: "city-portal",
    action: "https://www.ci.washington.il.us/egov/apps/payment/center.egov?view=form;page=1;id=21",
    badge: "Official City Payment ↗",
    keywords: "pay parking ticket citation violation fine settle online credit card egov tyler technologies municipal",
    desc: "City of Washington eGov Payment Center Form #21"
  },
  {
    title: "Pay Ordinance Violation Notice",
    category: "Official City Portals",
    type: "city-portal",
    action: "https://www.ci.washington.il.us/egov/apps/payment/center.egov?view=form;page=1;id=22",
    badge: "Official City Payment ↗",
    keywords: "notice of violation ordinance code compliance fine payment administrative citation",
    desc: "City of Washington eGov Payment Center Form #22"
  },
  {
    title: "Vehicle Impound Tow Bond Release",
    category: "Official City Portals",
    type: "city-portal",
    action: "https://www.ci.washington.il.us/egov/apps/payment/center.egov?view=form;page=1;id=23",
    badge: "Official City Payment ↗",
    keywords: "impound tow bond vehicle release towing fee administrative fee car retrieval",
    desc: "City of Washington eGov Payment Center Form #23"
  },
  {
    title: "Police Records & FOIA Submission",
    category: "Official City Portals",
    type: "city-portal",
    action: "https://www.ci.washington.il.us/egov/apps/action/center.egov?view=form;page=1;id=179",
    badge: "Official City Form ↗",
    keywords: "police records foia statutory freedom of information act 5 ilcs 140 incident report accident case public records request",
    desc: "City of Washington eGov Action Center Form #179"
  },
  {
    title: "Full-Time Police Officer Application (PDF)",
    category: "Official City Portals",
    type: "city-portal",
    action: "https://www.ci.washington.il.us/egov/apps/document/center.egov?view=item&id=2040",
    badge: "Official City Document ↗",
    keywords: "apply full time officer sworn police recruit careers job hiring application packet document",
    desc: "Official City of Washington Police Application Packet (Item #2040)"
  },
  {
    title: "Part-Time Police Officer Application (PDF)",
    category: "Official City Portals",
    type: "city-portal",
    action: "https://www.ci.washington.il.us/egov/apps/document/center.egov?view=item&id=2074",
    badge: "Official City Document ↗",
    keywords: "part time police officer application careers hiring sworn unit pdf document",
    desc: "Official City Part-Time Application (Item #2074)"
  },
  {
    title: "Citizen Police Academy Application (PDF)",
    category: "Official City Portals",
    type: "city-portal",
    action: "https://www.ci.washington.il.us/egov/apps/document/center.egov?view=item&id=2764",
    badge: "Official City Document ↗",
    keywords: "citizen police academy cpa community class education enrollment application pdf document",
    desc: "Official CPA Application Form (Item #2764)"
  },

  /* State & County Partner Portals */
  {
    title: "Traffic Crash & Accident Reports (BuyCrash)",
    category: "Partner Portals",
    type: "partner-portal",
    action: "https://buycrash.lexisnexisrisk.com/",
    badge: "State Partner Portal ↗",
    keywords: "accident crash reports buycrash collision traffic crash records lexisnexis state illinois insurance claim",
    desc: "Official State of Illinois collision records repository via BuyCrash"
  },
  {
    title: "CodeRED Community Emergency Alerts",
    category: "Partner Portals",
    type: "partner-portal",
    action: "https://public.coderedweb.com/CNE/en-US/BF8738F9B6E9",
    badge: "County Alert System ↗",
    keywords: "codered emergency alerts weather tornado severe storm boil order road closure telephone notification",
    desc: "Tazewell County high-speed emergency citizen notification network"
  },

  /* Strictly 5 Gap In-App Smart Form Drawers */
  {
    title: "Overnight & Street Parking Permit (§ 72.02)",
    category: "WPD Smart Forms",
    type: "wpd-drawer",
    action: "drawer-parking-permits",
    badge: "Direct WPD Workflow →",
    keywords: "parking permit overnight street 2am 6am exemption waiver camper rv trailer moving van guest breakdown section 72.02",
    desc: "Instant electronic registration for 2:00 AM – 6:00 AM street parking exemption"
  },
  {
    title: "Bicycle Identification & Registration",
    category: "WPD Smart Forms",
    type: "wpd-drawer",
    action: "drawer-bicycle-registration",
    badge: "Direct WPD Workflow →",
    keywords: "bicycle bike registration serial number crime prevention theft recovery frame color make model",
    desc: "Free crime prevention registry for personal bicycle recovery"
  },
  {
    title: "Submit Confidential Anonymous Crime Tip",
    category: "WPD Smart Forms",
    type: "wpd-drawer",
    action: "drawer-anonymous-tip",
    badge: "Direct WPD Workflow →",
    keywords: "anonymous crime tip confidential intelligence report narcotics drugs tip411 suspicious activity investigation",
    desc: "100% confidential encrypted intelligence transmission to WPD detectives"
  },
  {
    title: "Child Safety Seat Inspection Booking",
    category: "WPD Smart Forms",
    type: "wpd-drawer",
    action: "drawer-child-seat",
    badge: "Direct WPD Workflow →",
    keywords: "child safety seat car seat inspection certified technician installation appointment infant booster cps",
    desc: "Schedule a free installation inspection with state-certified CPS technicians"
  },
  {
    title: "Commend an Officer / Citizen Feedback",
    category: "WPD Smart Forms",
    type: "wpd-drawer",
    action: "drawer-commendation",
    badge: "Direct WPD Workflow →",
    keywords: "commend officer recognition compliment feedback praise exceptional service review command staff",
    desc: "Recognize an officer for exemplary service or submit formal citizen feedback"
  },

  /* Civic Walk-In & GIS Resolver */
  {
    title: "Safe Medication & Prescription Drop Box",
    category: "Civic Services",
    type: "nav-link",
    action: "services.html#drug-disposal",
    badge: "HQ Walk-In Kiosk",
    keywords: "medication disposal prescription drug pills drop box headquarters lobby safe disposal narcotics 24/7",
    desc: "Permanent 24/7 lobby collection kiosk at 115 W. Jefferson St"
  },
  {
    title: "Find Your Patrol Beat & Assigned Cruiser",
    category: "Civic Services",
    type: "nav-link",
    action: "districts.html#address-resolver",
    badge: "GIS Beat Resolver",
    keywords: "district sector patrol beat map address street lookup find my officer car 101 car 102 car 103",
    desc: "Interactive street-to-patrol sector GIS resolver and assigned unit display"
  },
  {
    title: "Call 24/7 Police Dispatch Line",
    category: "Direct Dispatch",
    type: "phone",
    action: "tel:3094442313",
    badge: "(309) 444-2313",
    keywords: "dispatch non emergency telephone call phone officer speak report 444-2313 communications",
    desc: "Connect directly to on-duty Tazewell County dispatchers for Washington"
  },
  {
    title: "Emergency Life Safety Dispatch (911)",
    category: "Direct Dispatch",
    type: "phone",
    action: "tel:911",
    badge: "DIAL 911",
    keywords: "911 emergency immediate danger life threat active crime weapon violence fire medical ambulance",
    desc: "Immediate priority dispatch for life-safety emergencies and crimes in progress"
  },

  /* Department Portals Navigation */
  {
    title: "Executive Home & Command Overview",
    category: "Department Navigation",
    type: "nav-link",
    action: "index.html",
    badge: "Page",
    keywords: "home executive command headquarters chief jeff stevens mission values overview",
    desc: "Department landing page, emergency triage, and executive leadership summary"
  },
  {
    title: "Resident Services Directory",
    category: "Department Navigation",
    type: "nav-link",
    action: "services.html",
    badge: "Page",
    keywords: "services resident directory permits payments records forms faq knowledge base",
    desc: "Full catalog of 14 municipal resident services and FAQ knowledge base"
  },
  {
    title: "Patrol Districts & Tactical GIS Map",
    category: "Department Navigation",
    type: "nav-link",
    action: "districts.html",
    badge: "Page",
    keywords: "districts map sectors gis geography boundaries sector 1 sector 2 sector 3",
    desc: "Interactive sector map, street boundaries, and assigned sector cruisers"
  },
  {
    title: "Patrol Operations & Shift Schedules",
    category: "Department Navigation",
    type: "nav-link",
    action: "operations.html",
    badge: "Page",
    keywords: "operations patrol shifts day afternoon night watch fleet cruisers equipment 24/7",
    desc: "24/7 watch schedule, operational capabilities, and patrol fleet telemetry"
  },
  {
    title: "Specialized Divisions (CIERT, K-9, SRO)",
    category: "Department Navigation",
    type: "nav-link",
    action: "teams.html",
    badge: "Page",
    keywords: "teams divisions swat ciert k9 canine sro school resource cybercrime detectives investigators",
    desc: "Tactical response, canine unit, youth school safety, and investigative task forces"
  },
  {
    title: "Careers, Recruitment & Benefits",
    category: "Department Navigation",
    type: "nav-link",
    action: "recruitment.html",
    badge: "Page",
    keywords: "careers recruitment jobs hiring police officer salary benefits pension lateral sworn test",
    desc: "Officer compensation, lateral entry incentives, CBA scale, and application steps"
  },
  {
    title: "Community Outreach & Programs",
    category: "Department Navigation",
    type: "nav-link",
    action: "community.html",
    badge: "Page",
    keywords: "community outreach citizens police academy cpa watch programs youth safety stuffed animals",
    desc: "Citizen Academy, youth programs, neighborhood partnerships, and comfort initiatives"
  },
  {
    title: "Leadership & Governance Matrix",
    category: "Department Navigation",
    type: "nav-link",
    action: "leadership.html",
    badge: "Page",
    keywords: "leadership governance chief jeff stevens deputy chiefs steve smith brian simpson sergeants command",
    desc: "Command hierarchy, deputy chiefs, field sergeants, and board oversight"
  }
];

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { WPD_DATA, WPD_COMMAND_SEARCH_INDEX };
}
