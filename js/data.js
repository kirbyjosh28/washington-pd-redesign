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
      name: "District 1 (Historic Core & East Sector)",
      color: "#2563EB",
      coverage: "Historic Downtown Square, Devonshire Estates & East Washington",
      acres: "433.6 Acres",
      boundaries: "Encompasses Historic Downtown Washington Square, WPD Headquarters, City Hall, Devonshire Estates, and east corridor to city limits including WCHS campus.",
      landmarks: ["Historic Downtown Washington Square & Fountain", "WPD Police Headquarters (115 W. Jefferson)", "Devonshire Estates & Devonshire Road", "Washington Community High School (District 308)", "Washington City Hall"],
      sectorCar: "Sector Car 101",
      supervisor: "East & Core Sector Sergeant",
      priority: "Downtown Square foot patrols, school zone safety, Devonshire community presence, East Route 24 coordination"
    },
    2: {
      id: 2,
      name: "District 2 (West Sector)",
      color: "#059669",
      coverage: "West Washington & Peoria Street Commercial Corridor",
      acres: "1,681.4 Acres",
      boundaries: "Peoria St (Business US-24) corridor West to municipal limits, including South Cummings Lane, Freedom Parkway retail hub, and western neighborhoods.",
      landmarks: ["Peoria Street Commercial Artery (Business 24)", "Freedom Parkway & Retail Center", "Washington Middle School (District 52)", "South Cummings Lane Corridor"],
      sectorCar: "Sector Car 102",
      supervisor: "West Sector Sergeant",
      priority: "Peoria Street commercial traffic safety, school corridors, retail corridor checks, western residential neighborhood patrols"
    },
    3: {
      id: 3,
      name: "District 3 (North Sector / Bypass)",
      color: "#7C3AED",
      coverage: "Five Points & Route 24 Bypass Corridor",
      acres: "1,476.7 Acres",
      boundaries: "Northern residential subdivisions and commercial centers along the US Route 24 Bypass, Cruger Road, Dallas Road, and Five Points Washington.",
      landmarks: ["Central Primary School (District 51 / Eagle Ave)", "Five Points Washington Community Center", "US Route 24 Bypass Commercial Corridor", "West Cruger Road Corridor", "Dallas Road Residential Corridor"],
      sectorCar: "Sector Car 103",
      supervisor: "North Sector Sergeant",
      priority: "Bypass traffic safety, Five Points community presence, northern subdivision patrols, proactive business deterrence"
    }
  },

  streets: [
    { name: "Washington Square", district: 1, area: "Historic Downtown Square" },
    { name: "West Jefferson St", district: 1, area: "WPD Headquarters / Core Corridor" },
    { name: "Devonshire Dr", district: 1, area: "Devonshire Estates" },
    { name: "Devonshire Rd", district: 1, area: "Devonshire Estates" },
    { name: "Walnut St", district: 1, area: "City Hall / Downtown" },
    { name: "Market St", district: 1, area: "Square Commercial Core" },
    { name: "South Main St", district: 1, area: "Downtown Core Corridor" },
    { name: "East Jefferson St", district: 1, area: "East Residential" },
    { name: "Wood St", district: 1, area: "East Sector Corridor" },
    { name: "Bondurant St", district: 1, area: "WCHS Campus Corridor" },
    { name: "Nofsinger Rd", district: 1, area: "Northeast Sector" },
    { name: "Pine Dr", district: 1, area: "East Residential" },
    { name: "Shelbark Ct", district: 1, area: "East Residential" },
    { name: "Catherine St", district: 1, area: "East Central" },
    { name: "Birkett Ln", district: 1, area: "East Sector" },
    { name: "Hillcrest Dr", district: 1, area: "East Residential" },
    { name: "Peoria St", district: 2, area: "West Sector / Business 24" },
    { name: "Cummings Ln", district: 2, area: "West Sector Corridor" },
    { name: "Holland St", district: 2, area: "West Residential" },
    { name: "Zinser Pl", district: 2, area: "West Historic" },
    { name: "Summit Dr", district: 2, area: "West Ridge" },
    { name: "Freedom Pkwy", district: 2, area: "Freedom Pkwy Commercial" },
    { name: "Centennial Dr", district: 2, area: "Middle School / West Artery" },
    { name: "School St", district: 2, area: "West Residential / School" },
    { name: "Eagle Ave", district: 3, area: "Central Primary School Corridor" },
    { name: "North Wilmor Rd", district: 3, area: "Five Points / North Wilmor" },
    { name: "Cruger Rd", district: 3, area: "North Cruger Bypass Corridor" },
    { name: "Dallas Rd", district: 3, area: "North Residential Corridor" },
    { name: "Newcastle Rd", district: 3, area: "North Sector" },
    { name: "Northpoint Dr", district: 3, area: "Route 24 Commercial" },
    { name: "Constitution Ave", district: 3, area: "North Growth Area" },
    { name: "Freedom Ln", district: 3, area: "North Growth Area" }
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

