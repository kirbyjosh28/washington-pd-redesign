# Washington Police Department — Developer & Content-Audit Checklist

> **Purpose:** This maintenance document establishes a permanent verification matrix for developers, city webmasters, and municipal stakeholders. It records all live contact points, digital services, phone-tree extensions, statutory requirements, and physical service parameters on the WPD platform.
> **Standard:** For each item, verify against official municipal sources at the designated frequency. When changes occur, update both this checklist and the corresponding markup in the repository.

---

## 1. Quick Reference: Operational Hotlist

| Item | Current Production Value | Codebase Location | Source / Authority | Frequency |
|---|---|---|---|---|
| **Emergency Line** | `911` | All pages (header, hero, footer) | Tazewell County Consolidated 911 | Monthly |
| **24/7 Non-Emergency** | `(309) 444-2313` | All pages (header, hero, footer) | WPD Communications Center | Monthly |
| **Station Window Hours** | Mon–Fri 8:00 AM – 4:30 PM | `index.html`, `services.html`, `leadership.html` | City of Washington Admin | Quarterly |
| **Headquarters Address** | 115 W. Jefferson St, Washington, IL 61571 | All pages | City of Washington Facilities | Annual |
| **Crash Reports Portal** | BuyCrash.com (`https://www.buycrash.com`) | `services.html`, `index.html`, FAQ | Illinois State Police / LexisNexis | Semi-Annual |
| **Emergency Notification** | CodeRED (`https://public.coderedweb.com/CNE/en-US/BF8738F9B6E9`) | `services.html`, `index.html` | Tazewell County EMA | Quarterly |
| **City Solicitor Portal** | `https://www.ci.washington.il.us` | `services.html`, FAQ | Washington City Clerk | Quarterly |

---

## 2. Comprehensive Content Audit Matrix

### A. Phone Numbers & Automated Phone-Tree Routing
*The automated phone-tree routing is currently marked with a `[PLACEHOLDER PENDING FINAL VERIFICATION]` badge in the UI. Confirm exact IVR prompt recordings with WPD Telecommunications.*

| Extension / Option | Current Label in Codebase | Route Target | Verification Source | Frequency | Audit Procedure |
|---|---|---|---|---|---|
| **Primary Inbound** | `(309) 444-2313` | 24/7 Automated Attendant | WPD Communications Supervisor | Monthly | Dial line during business and after-hours to confirm greeting. |
| **Press 1** | On-Duty Patrol Dispatch | Tazewell County PSAP Dispatcher | Tazewell Consolidated Dispatch | Quarterly | Test transfer to live dispatcher. |
| **Press 2** | Records Bureau & FOIA Inquiries | HQ Records Window Desk | WPD Records Supervisor | Quarterly | Test transfer; verify voicemail prompt if after-hours. |
| **Press 3** | Administration & Office of the Chief | Chief's Administrative Assistant | Office of the Chief | Quarterly | Verify staff assignment and office hours. |
| **Press 4** | Parking Enforcement & Ordinance | Parking Enforcement Division | Community Service Officer (CSO) | Quarterly | Verify parking inquiries handling route. |
| **Press 5** | Criminal Investigations & Detectives | CIU Detective Division | Detective Supervisor | Quarterly | Verify confidential voicemail routing. |
| **Press 0** | Station Desk / Operator | Immediate Operator Console | WPD Duty Officer | Quarterly | Verify operator rollover. |

---

### B. Leadership, Ranks & Personnel
*Illinois Municipal Code and Board of Police Commissioners statutory rosters require periodic synchronization.*

| Rank Tier | Officer / Role in Codebase | Status | Verification Source | Frequency | Audit Procedure |
|---|---|---|---|---|---|
| **Chief of Police** | Chief Jeff Stevens | Appointed June 2025 (Confirmed) | City Council / Mayor Stevens | Quarterly | Confirm active appointment, bio accuracy, and credentials. |
| **Deputy Chief (Patrol)** | Deputy Chief of Patrol Operations | `[VERIFICATION PENDING]` | Office of the Chief | Quarterly | Verify current appointee name and field responsibilities. |
| **Deputy Chief (Support)** | Deputy Chief of Support Services | `[VERIFICATION PENDING]` | Office of the Chief | Quarterly | Verify investigations/records oversight assignment. |
| **Shift A Sergeant** | Day Watch Patrol Sergeant | `[VERIFICATION PENDING]` | Patrol Division Commander | Quarterly | Confirm shift rotation and supervisory roster. |
| **Shift B Sergeant** | Night Watch Patrol Sergeant | `[VERIFICATION PENDING]` | Patrol Division Commander | Quarterly | Confirm shift rotation and supervisory roster. |
| **Detective Sergeant** | CIU Investigations Supervisor | `[VERIFICATION PENDING]` | Criminal Investigations Commander | Quarterly | Confirm detective division supervisor. |
| **Police Commissioners** | Board of Police Commissioners | Statutory Civilian Board | City Clerk / Commission Agendas | Semi-Annual | Check meeting minutes, agenda links, and commissioner seats. |

---

### C. Digital Services & Online Interactive Workflows
*Verify that every digital service workflow responds correctly, generates confirmation receipts, and routes data to designated internal queues.*

| Digital Service | Form / Drawer ID | Backend / Target Action | Verification Source | Frequency | Audit Procedure |
|---|---|---|---|---|---|
| **Parking Permits** | `drawer-parking-permits` | Online application for overnight street parking waiver | WPD Records / Parking Enforcement | Monthly | Submit test permit; check validation, date limits, receipt code. |
| **Online Payments** | `drawer-online-payments` | Municipal citation & violation payment gateway | City Collector / Illinois E-Pay | Monthly | Verify third-party payment gateway URL, merchant ID, accepted cards. |
| **Bicycle Registration** | `drawer-bicycle-registration` | Property recovery registry database | Crime Prevention / CSO | Quarterly | Submit test serial number; confirm recovery lookup functionality. |
| **Vacation House Watch** | `drawer-vacation-check` | Residential exterior perimeter checks | Patrol Division Supervisors | Monthly | Submit test entry; verify date range validation and emergency contacts. |
| **Police FOIA Records** | `drawer-police-records` | 5 ILCS 140 compliance requests | Freedom of Information Officer | Monthly | Verify statutory 5-business-day response disclosure text. |
| **Anonymous Crime Tip** | `drawer-anonymous-tip` | 100% confidential investigative tip | Detective Division / CIU | Monthly | Test encryption, confirm no IP/PII logging on tip submission. |
| **Child Seat Check** | `drawer-child-seat` | Free certified technician appointment | Certified Child Passenger Safety Tech | Semi-Annual | Confirm certified technician availability at headquarters. |
| **Commend an Officer** | `drawer-commendation` | Citizen feedback directly to Command Staff | Chief of Police Assistant | Quarterly | Verify email dispatch to Chief Stevens and supervisory review. |

---

### D. In-Person & Walk-In Public Safety Services
*Services requiring physical attendance at municipal or partner facilities.*

| In-Person Service | Physical Facility & Location | Operating Hours | Source / Authority | Frequency | Audit Procedure |
|---|---|---|---|---|---|
| **Medication Drop Box** | Headquarters Lobby (115 W. Jefferson St) | 24/7/365 Permanent Kiosk | WPD Evidence / DEA Collection | Semi-Annual | Inspect physical lobby kiosk, signage, and accepted pill list. |
| **WFD Sharps Disposal** | Washington Fire Station 1 (200 N. Wilmor Rd) | Mon–Fri Business Hours | Washington Fire Department (WFD) | Semi-Annual | Contact WFD administration to verify container requirements & hours. |
| **Solicitor Licensing** | City Hall City Clerk (301 Walnut St) | Mon–Fri 8:00 AM – 4:30 PM | City of Washington Clerk | Semi-Annual | Verify municipal solicitor ordinance chapter and active badge list. |
| **Civilian Fingerprinting** | HQ Records Window (115 W. Jefferson St) | Tue & Thu 9:00 AM – 12:00 PM | Records Bureau Supervisor | Semi-Annual | Confirm fee schedule, LiveScan machine status, photo ID criteria. |
| **Property & Evidence Return**| HQ Evidence Bureau (115 W. Jefferson St) | Mon–Fri By Appointment | Evidence Officer / Custodian | Semi-Annual | Confirm case disposition checklist and property release hours. |

---

### E. Interactive FAQ System Accuracy

| FAQ Category | Key Questions | Verification Source | Frequency | Audit Procedure |
|---|---|---|---|---|
| **Parking & Traffic** | Overnight parking (2 AM – 6 AM), snow emergencies, payment grace periods | City Ordinance Chapter 72 | Semi-Annual | Review municipal code amendments on parking and snow emergencies. |
| **Records & Reports** | FOIA deadlines, crash report pricing, report copy fees | Illinois Attorney General PAC | Annual | Ensure statutory FOIA fee schedules ($0 for first 50 black/white pages) match. |
| **Community Safety** | Vacation check duration limits, bicycle property rights, sharps rules | WPD Patrol & Fire Dept | Semi-Annual | Verify policies on consecutive vacation check limits (max 30 days). |
| **Dispatch & Emergency**| 911 dispatch boundaries, Tazewell County PSAP, text-to-911 | Tazewell County 911 Board | Annual | Confirm Text-to-911 availability across all wireless carriers. |

---

## 3. Recommended Audit Schedule & Calendar

- **1st Monday of Every Month**: Verify 911, dispatch line, test all 8 interactive drawers (`drawer-vacation-check`, `drawer-parking-permits`, `drawer-online-payments`, etc.), and verify automated test suite passes.
- **Quarterly (Jan, Apr, Jul, Oct)**: Check leadership appointments with City Council records, inspect external links (`BuyCrash.com`, `CodeRED`, City Clerk), and verify phone-tree routing with communications supervisor.
- **Semi-Annually (June & December)**: Audit in-person facilities (medication kiosk, WFD sharps program, fingerprinting hours, solicitor licensing procedures).
- **Annually (May — Municipal Fiscal Year)**: Review full municipal ordinance changes, fee structures, FOIA officer designations, and Illinois statutory references.
