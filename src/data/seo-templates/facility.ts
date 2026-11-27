import type { SeoTemplate } from "./types";

export const FACILITY_TEMPLATES: SeoTemplate[] = [
  {
    slug: "fire-extinguisher-monthly-statutory-inspection",
    title: "Fire Extinguisher Monthly Statutory Inspection",
    industry: "Facility Management",
    complianceStandards: ["NFPA 10", "OSHA 1910.157", "ISO 41001"],
    frequency: "monthly",
    shortDescription:
      "Monthly statutory inspection SOP and QR checklist for portable ABC, CO2, and foam fire extinguishers across commercial buildings.",
    seoTitle: "Fire Extinguisher Monthly Inspection Checklist & SOP",
    seoDescription:
      "Standardize monthly NFPA 10 fire extinguisher inspections with a QR checklist covering pressure gauges, tamper seals, hoses, and mounting.",
    sopSteps: [
      {
        stepOrder: 1,
        title: "Verify Access & Visibility",
        instruction:
          "Confirm the extinguisher is mounted in its designated location, unobstructed by storage, and has clear signage visible from the corridor.",
        isCritical: true,
      },
      {
        stepOrder: 2,
        title: "Inspect Pressure Gauge & Cylinder",
        instruction:
          "Check that the pressure gauge needle sits squarely in the green operable zone (for stored-pressure units) and inspect the shell for dents, rust, or leakage.",
        isCritical: true,
      },
      {
        stepOrder: 3,
        title: "Check Tamper Seal & Pull Pin",
        instruction:
          "Verify the plastic tamper seal is intact and the safety pull pin is properly seated without bending or corrosion.",
        isCritical: true,
      },
      {
        stepOrder: 4,
        title: "Examine Hose, Nozzle & Weight",
        instruction:
          "Inspect the discharge hose and horn for cracks or blockages; for CO2 units, verify gross weight against the stamped tare weight.",
        isCritical: false,
      },
      {
        stepOrder: 5,
        title: "Update Inspection Tag & Log",
        instruction:
          "Record the inspection date and technician initials on the physical tag or scan the asset QR code to submit the digital statutory log.",
        isCritical: false,
      },
    ],
    checklistItems: [
      { label: "Extinguisher in designated bracket with unobstructed 1m clearance", required: true },
      { label: "Location signage and operating instructions legible and facing outward", required: true },
      { label: "Pressure gauge needle within green operable range", required: true },
      { label: "Tamper seal intact and safety pull pin secured", required: true },
      { label: "Cylinder body free from dents, corrosion, or chemical residue", required: true },
      { label: "Discharge hose and nozzle clear of cracks, splits, or insect nests", required: true },
      { label: "CO2 horn and swivel connection tight and undamaged", required: false },
      { label: "Annual service and hydro-test due dates within valid window", required: true },
      { label: "Digital QR log or physical inspection tag signed with date", required: true },
    ],
    faqs: [
      {
        question: "How often must commercial fire extinguishers be inspected under NFPA 10?",
        answer:
          "NFPA 10 requires a visual quick-check at least once every 30 days (monthly), alongside an annual maintenance examination by a certified technician.",
      },
      {
        question: "What should we do if a fire extinguisher gauge is in the red zone?",
        answer:
          "Tag the unit out of service immediately, replace it with a charged spare of equal or higher rating, and send the unit for professional recharging.",
      },
      {
        question: "Can QR scan logs replace paper inspection tags?",
        answer:
          "Digital QR logs provide timestamped audit trails for ISO 41001 and insurers, though many local fire marshals still require a physical tag attached to the neck.",
      },
    ],
  },
  {
    slug: "diesel-generator-dg-set-daily-pre-run-check",
    title: "Diesel Generator (DG Set) Daily Pre-Run Check",
    industry: "Facility Management",
    complianceStandards: ["NFPA 110", "ISO 8528", "OSHA 1910"],
    frequency: "daily",
    shortDescription:
      "Daily pre-start mechanical, fluid, and battery readiness checklist for standby commercial diesel generators (DG sets).",
    seoTitle: "Diesel Generator (DG Set) Daily Pre-Run Checklist",
    seoDescription:
      "Prevent standby power failures with a daily DG set pre-run SOP checking lube oil, coolant, fuel day-tank, starting batteries, and AMF panel.",
    sopSteps: [
      {
        stepOrder: 1,
        title: "Verify Auto Mode & Safety Lockout",
        instruction:
          "Confirm the AMF/controller is in AUTO (unless testing manually), E-stop is unlatched, and the canopy area is clear of flammable debris.",
        isCritical: true,
      },
      {
        stepOrder: 2,
        title: "Check Lube Oil & Coolant Levels",
        instruction:
          "Pull the dipstick to verify lube oil is between Min and Max marks and inspect the radiator sight glass or overflow tank for adequate coolant.",
        isCritical: true,
      },
      {
        stepOrder: 3,
        title: "Inspect Fuel Day-Tank & Leaks",
        instruction:
          "Check diesel level in the day tank, drain any water from the fuel-water separator, and inspect hoses and under-skid drip trays for leaks.",
        isCritical: true,
      },
      {
        stepOrder: 4,
        title: "Test Battery Voltage & Block Heater",
        instruction:
          "Verify cranking battery float voltage (typically 13.2–13.8V for 12V or 26.4–27.6V for 24V), clean terminals, and confirm jacket water heater warmth.",
        isCritical: true,
      },
      {
        stepOrder: 5,
        title: "Check Air Filter & Exhaust Path",
        instruction:
          "Inspect the air restriction indicator, fan belts for tension/fraying, and confirm the exhaust rain flap and ventilation louvers are unobstructed.",
        isCritical: false,
      },
    ],
    checklistItems: [
      { label: "AMF controller in AUTO mode with zero active fault alarms", required: true },
      { label: "Engine lube oil level within dipstick operating range", required: true },
      { label: "Radiator coolant level full and block heater warm to touch", required: true },
      { label: "Diesel day-tank fuel level above 75% minimum reserve", required: true },
      { label: "Fuel-water separator drained and no oil/fuel leaks on drip tray", required: true },
      { label: "Cranking battery float voltage normal and terminals corrosion-free", required: true },
      { label: "Alternator & fan drive belts free from cracks or excessive slack", required: false },
      { label: "Air intake restriction indicator in green zone", required: false },
      { label: "Emergency stop button intact and acoustic canopy doors latched", required: true },
    ],
    faqs: [
      {
        question: "Why check the DG set daily if it runs on an automated AMF panel?",
        answer:
          "Over 80% of standby generator start failures stem from dead cranking batteries, low coolant, or tripped breakers—issues caught only by daily physical checks.",
      },
      {
        question: "What is the ideal diesel reserve for a commercial facility DG set?",
        answer:
          "NFPA 110 and facility best practices typically require maintaining at least 75% capacity in the day tank or enough fuel for 8–24 hours of continuous rated load.",
      },
    ],
  },
  {
    slug: "commercial-hvac-chiller-ahu-preventive-check",
    title: "Commercial HVAC Chiller & AHU Preventive Check",
    industry: "Facility Management",
    complianceStandards: ["ASHRAE 180", "ISO 41001", "EPA 608"],
    frequency: "weekly",
    shortDescription:
      "Weekly preventive maintenance SOP for water-cooled/air-cooled chillers, chilled water pumps, and air handling units (AHUs).",
    seoTitle: "Commercial HVAC Chiller & AHU Preventive Checklist",
    seoDescription:
      "Monitor chiller approach temperatures, differential pressures, AHU filter delta-P, and condensate drains with this ASHRAE 180 HVAC checklist.",
    sopSteps: [
      {
        stepOrder: 1,
        title: "Log Chiller Pressures & Temperatures",
        instruction:
          "Record evaporator entering/leaving water temperatures, condenser approach temperature, and refrigerant suction/discharge pressures from the BMS or unit HMI.",
        isCritical: true,
      },
      {
        stepOrder: 2,
        title: "Inspect Chilled & Condenser Water Pumps",
        instruction:
          "Listen for abnormal bearing noise or cavitation, check mechanical seals for dripping, and log suction/discharge pressure gauges.",
        isCritical: true,
      },
      {
        stepOrder: 3,
        title: "Check AHU Filters & Belt Drives",
        instruction:
          "Read the differential pressure (magnehelic) gauge across pre-filters and bag filters; inspect blower V-belts for glazing, tension, and alignment.",
        isCritical: false,
      },
      {
        stepOrder: 4,
        title: "Clear Condensate Drain Pan & Trap",
        instruction:
          "Inspect the AHU drain pan for standing water, algae, or slime, and flush the P-trap to prevent indoor air quality odors or overflow.",
        isCritical: true,
      },
      {
        stepOrder: 5,
        title: "Verify Damper Actuators & VFD Alarms",
        instruction:
          "Confirm fresh-air and return-air damper linkages move smoothly and check AHU/chiller VFDs for over-current or thermal warnings.",
        isCritical: false,
      },
    ],
    checklistItems: [
      { label: "Chilled water supply/return delta-T within design range (4–6°C)", required: true },
      { label: "Compressor oil level visible in sight glass and free of foaming", required: true },
      { label: "No refrigerant leak alarms or frost buildup on suction lines", required: true },
      { label: "Primary/secondary pump mechanical seals dry with normal vibration", required: true },
      { label: "AHU filter differential pressure below replacement threshold", required: true },
      { label: "Condensate drain pan clean, dry, and P-trap flowing freely", required: true },
      { label: "AHU blower V-belts properly tensioned without cracking", required: false },
      { label: "VFD panels free of fault codes and cabinet cooling fans running", required: false },
      { label: "Plant room floor dry and chemical dosing tank levels adequate", required: false },
    ],
    faqs: [
      {
        question: "What does a rising condenser approach temperature indicate on a chiller?",
        answer:
          "An approach temperature climbing above 2–3°C typically signals fouled condenser tubes, scale buildup, or non-condensable gases requiring tube brushing.",
      },
      {
        question: "How often should AHU condensate pans be inspected?",
        answer:
          "Weekly inspection is recommended during cooling season to prevent biological growth (Legionella/mold) and water damage to ceiling tiles.",
      },
    ],
  },
  {
    slug: "passenger-elevator-lift-safety-daily-check",
    title: "Passenger Elevator & Lift Safety Daily Check",
    industry: "Facility Management",
    complianceStandards: ["ASME A17.1", "EN 81-20", "ISO 41001"],
    frequency: "daily",
    shortDescription:
      "Daily operational safety walkthrough for passenger elevators covering door interlocks, leveling accuracy, emergency intercoms, and lighting.",
    seoTitle: "Passenger Elevator & Lift Daily Safety Checklist",
    seoDescription:
      "Ensure daily lift safety with an ASME A17.1 / EN 81-20 inspection covering door sensors, floor leveling, emergency phone, and alarm bell.",
    sopSteps: [
      {
        stepOrder: 1,
        title: "Test Call Buttons & Door Re-Opening Sensors",
        instruction:
          "Press hall call buttons on ground and upper floors, then interrupt the infrared light curtain during door closure to verify immediate re-opening.",
        isCritical: true,
      },
      {
        stepOrder: 2,
        title: "Verify Floor Leveling & Ride Quality",
        instruction:
          "Ride the cab through multiple stops and confirm the cab sill aligns flush with the landing sill (within ±6 mm) without jerking or scraping noises.",
        isCritical: true,
      },
      {
        stepOrder: 3,
        title: "Test Emergency Intercom & Alarm Bell",
        instruction:
          "Press the emergency alarm bell and test the two-way hands-free intercom to confirm clear voice connection to the 24/7 security desk.",
        isCritical: true,
      },
      {
        stepOrder: 4,
        title: "Inspect Cab Lighting, Ventilation & Signage",
        instruction:
          "Confirm normal cab lighting, exhaust fan operation, rated load capacity plate visibility, and valid annual safety certificate display.",
        isCritical: false,
      },
    ],
    checklistItems: [
      { label: "Hall and car call buttons illuminate and register accurately", required: true },
      { label: "Infrared door safety edge/light curtain reverses closing doors immediately", required: true },
      { label: "Cab floor levels flush with landing sill at all tested floors", required: true },
      { label: "Emergency alarm bell sounds clearly when pressed", required: true },
      { label: "Two-way emergency intercom connects to security/control room", required: true },
      { label: "Door tracks free of pebbles, debris, or excessive play", required: true },
      { label: "Cab interior lighting, fan, and floor indicator display operational", required: false },
      { label: "Valid statutory lift inspection certificate & capacity plate posted", required: true },
    ],
    faqs: [
      {
        question: "What should facility staff do if an elevator stops slightly off-level?",
        answer:
          "Immediately place the lift out of service using the key switch, post an 'Out of Order' sign to prevent trip hazards, and dispatch the OEM maintenance vendor.",
      },
      {
        question: "Why test the lift emergency intercom every day?",
        answer:
          "Phone line disconnects or dead backup batteries often go unnoticed until an entrapment occurs; daily testing ensures instant rescue communication.",
      },
    ],
  },
  {
    slug: "overhead-water-tank-stp-etp-treatment-log",
    title: "Overhead Water Tank & STP/ETP Treatment Log",
    industry: "Facility Management",
    complianceStandards: ["ISO 41001", "WHO Drinking Water", "EPA Effluent"],
    frequency: "daily",
    shortDescription:
      "Daily water quality, level, and sewage/effluent treatment plant (STP/ETP) operational log for commercial buildings.",
    seoTitle: "Overhead Water Tank & STP/ETP Daily Treatment Log",
    seoDescription:
      "Track overhead water tank chlorine, pH, float valves, and STP/ETP aeration, MLSS, and discharge clarity with a daily QR utility log.",
    sopSteps: [
      {
        stepOrder: 1,
        title: "Inspect Overhead Tank Security & Float Valves",
        instruction:
          "Verify manhole covers are padlocked with intact insect mesh on vent pipes, and confirm automatic level sensors/float valves prevent overflow.",
        isCritical: true,
      },
      {
        stepOrder: 2,
        title: "Test Potable Water Residual Chlorine & pH",
        instruction:
          "Draw a sample from the tank outlet or riser and log free residual chlorine (0.2–0.5 ppm) and pH (6.5–8.5).",
        isCritical: true,
      },
      {
        stepOrder: 3,
        title: "Check STP/ETP Blowers, Diffusers & Screens",
        instruction:
          "Clean bar screens of solid debris, verify air blowers are running at normal pressure/amperage, and confirm uniform aeration bubbling in the MBBR/aeration tank.",
        isCritical: true,
      },
      {
        stepOrder: 4,
        title: "Inspect Clarifier, Sand/Carbon Filters & Dosing",
        instruction:
          "Check treated effluent clarity, verify alum/hypo dosing tank levels, and perform backwash on pressure sand and activated carbon filters if differential pressure is high.",
        isCritical: false,
      },
    ],
    checklistItems: [
      { label: "Overhead tank manhole cover sealed/locked and vent mesh intact", required: true },
      { label: "Potable water free residual chlorine within 0.2–0.5 ppm", required: true },
      { label: "Potable water pH within 6.5–8.5 range", required: true },
      { label: "Transfer pump auto-cutoff and float switches functioning properly", required: true },
      { label: "STP/ETP bar screen cleared and screenings bagged for disposal", required: true },
      { label: "Aeration blowers operating within normal current and temperature", required: true },
      { label: "Chlorine/alum chemical dosing tanks filled above 25% level", required: false },
      { label: "Treated outlet water clear, odor-free, and flow meter logged", required: true },
    ],
    faqs: [
      {
        question: "How often should commercial overhead water tanks be cleaned and disinfected?",
        answer:
          "Best practice and municipal health codes typically mandate draining, scrubbing, and super-chlorinating potable tanks every 6 months.",
      },
      {
        question: "What causes foul odors in an STP aeration tank?",
        answer:
          "Septic odors usually indicate insufficient dissolved oxygen from a tripped air blower, clogged diffusers, or shock organic loading.",
      },
    ],
  },
  {
    slug: "emergency-exit-lighting-signage-monthly-test",
    title: "Emergency Exit Lighting & Signage Monthly Test",
    industry: "Facility Management",
    complianceStandards: ["NFPA 101", "OSHA 1910.37", "BS 5266"],
    frequency: "monthly",
    shortDescription:
      "Monthly 30-second functional test SOP for battery-backed emergency exit signs, stairwell bulkheads, and egress path lighting.",
    seoTitle: "Emergency Exit Lighting & Signage Monthly Test SOP",
    seoDescription:
      "Comply with NFPA 101 and OSHA 1910.37 using a monthly 30-second test checklist for illuminated exit signs and emergency egress lights.",
    sopSteps: [
      {
        stepOrder: 1,
        title: "Inspect Charge Indicator & Housing",
        instruction:
          "Walk each floor egress path and verify every exit sign and twin-spot bulkhead shows a steady green/red AC charge LED with undamaged diffuser lenses.",
        isCritical: true,
      },
      {
        stepOrder: 2,
        title: "Perform 30-Second Battery Push-Test",
        instruction:
          "Press and hold the test button (or trip the dedicated lighting test circuit) for at least 30 seconds to confirm lamps illuminate brightly on battery power.",
        isCritical: true,
      },
      {
        stepOrder: 3,
        title: "Verify Egress Path Coverage & Aiming",
        instruction:
          "Confirm twin-spot heads are aimed at stairwell treads, exit doors, and corridor turns without burnt-out LEDs or dimming.",
        isCritical: true,
      },
      {
        stepOrder: 4,
        title: "Restore AC Power & Log Deficiencies",
        instruction:
          "Confirm units return to normal charging mode after release and tag any failed battery pack or ballast for immediate replacement.",
        isCritical: false,
      },
    ],
    checklistItems: [
      { label: "All exit signs continuously illuminated and clearly visible from 30m", required: true },
      { label: "AC charge indicator LED lit on every emergency luminaire", required: true },
      { label: "Unit illuminates at full brightness for 30+ seconds during test", required: true },
      { label: "Directional arrows on exit signs match actual escape route", required: true },
      { label: "Stairwell landings and exit door thresholds adequately lit", required: true },
      { label: "Fixture housings clean, securely mounted, and free of insects/dust", required: false },
      { label: "Unit returns to normal charging state after test switch release", required: true },
      { label: "Failed units logged with floor/zone ID for battery replacement", required: true },
    ],
    faqs: [
      {
        question: "What is the difference between the monthly and annual emergency light test?",
        answer:
          "NFPA 101 requires a 30-second functional test every 30 days and a full 90-minute battery discharge test once a year.",
      },
      {
        question: "How long do emergency exit light batteries typically last?",
        answer:
          "Sealed NiCd or LiFePO4 backup batteries generally last 3–5 years before failing the 90-minute runtime requirement.",
      },
    ],
  },
  {
    slug: "cctv-camera-access-control-system-audit",
    title: "CCTV Camera & Access Control System Audit",
    industry: "Facility Management",
    complianceStandards: ["ISO 27001", "ISO 41001", "UL 294"],
    frequency: "weekly",
    shortDescription:
      "Weekly physical and NVR health audit for commercial CCTV cameras, RFID/biometric door controllers, and mag-lock fail-safe release.",
    seoTitle: "CCTV Camera & Access Control System Audit Checklist",
    seoDescription:
      "Verify NVR recording retention, camera focus, UPS backup, and fire-alarm fail-safe door release with this weekly security audit checklist.",
    sopSteps: [
      {
        stepOrder: 1,
        title: "Verify NVR Recording & Storage Retention",
        instruction:
          "Check the NVR/VMS dashboard for offline cameras, RAID disk health warnings, accurate NTP time sync, and minimum 30-day playback retention.",
        isCritical: true,
      },
      {
        stepOrder: 2,
        title: "Inspect Camera Feeds & Physical Lenses",
        instruction:
          "Review live views for blind spots, IR night-vision glare, spiderwebs, or shifted angles, and clean dirty domes at entry gates and loading docks.",
        isCritical: false,
      },
      {
        stepOrder: 3,
        title: "Test Access Control Readers & Mag-Locks",
        instruction:
          "Swipe a test badge at critical perimeter and server room doors to verify prompt latch release, door-forced-open (DFO) alarms, and automatic relocking.",
        isCritical: true,
      },
      {
        stepOrder: 4,
        title: "Verify Break-Glass & Fire Release",
        instruction:
          "Confirm green emergency break-glass overrides are intact and access-controlled egress doors remain tied to the fire alarm fail-safe relay.",
        isCritical: true,
      },
    ],
    checklistItems: [
      { label: "100% of perimeter and lobby cameras online and recording", required: true },
      { label: "NVR/VMS system clock synced within ±2 seconds via NTP", required: true },
      { label: "Storage array healthy with required retention days available", required: true },
      { label: "Camera domes/lenses clean and free of IR glare or obstructions", required: false },
      { label: "Card/biometric readers respond within 1 second and log events", required: true },
      { label: "Mag-locks and electric strikes engage cleanly when door closes", required: true },
      { label: "Emergency break-glass door release units intact and unobstructed", required: true },
      { label: "Security rack UPS online with zero battery fault alerts", required: true },
    ],
    faqs: [
      {
        question: "Why is NTP time synchronization critical for CCTV systems?",
        answer:
          "If camera timestamps drift from access control logs, video footage may be rejected as unreliable evidence during incident investigations or insurance claims.",
      },
      {
        question: "Must mag-lock doors unlock automatically during a fire alarm?",
        answer:
          "Yes. Life safety codes (NFPA 101) require fail-safe mag-locks on egress doors to release power immediately upon fire alarm activation or power loss.",
      },
    ],
  },
  {
    slug: "building-roof-gutter-stormwater-drain-check",
    title: "Building Roof, Gutter & Stormwater Drain Check",
    industry: "Facility Management",
    complianceStandards: ["ISO 41001", "OSHA 1910.28", "NFPA 780"],
    frequency: "monthly",
    shortDescription:
      "Monthly roof membrane, scupper, gutter, and stormwater drain inspection to prevent commercial water ingress and structural leaks.",
    seoTitle: "Building Roof, Gutter & Stormwater Drain Checklist",
    seoDescription:
      "Prevent roof leaks and ponding water with a monthly SOP inspecting roof membranes, parapet flashings, gutters, scuppers, and drain strainers.",
    sopSteps: [
      {
        stepOrder: 1,
        title: "Verify Safe Roof Access & Edge Protection",
        instruction:
          "Ensure roof hatch latches securely, safety signage is posted, and parapet walls or guardrails are intact before walking the roof surface.",
        isCritical: true,
      },
      {
        stepOrder: 2,
        title: "Clear Roof Drains, Scuppers & Gutters",
        instruction:
          "Remove leaves, windblown trash, and silt from drain strainers, box gutters, and parapet scuppers so rainwater drains freely without ponding.",
        isCritical: true,
      },
      {
        stepOrder: 3,
        title: "Inspect Waterproof Membrane & Flashings",
        instruction:
          "Walk the membrane looking for blisters, open seams, punctures near HVAC pedestals, and cracked sealant along parapet wall flashings.",
        isCritical: true,
      },
      {
        stepOrder: 4,
        title: "Check Lightning Protection & Pipe Supports",
        instruction:
          "Verify lightning arrestor air terminals and copper down-conductors are tight, and confirm rooftop conduit/piping sleepers sit properly on protection pads.",
        isCritical: false,
      },
    ],
    checklistItems: [
      { label: "Roof access hatch/door locks securely and weather seal intact", required: true },
      { label: "All roof drain domes/strainers installed and free of debris", required: true },
      { label: "Parapet scuppers and box gutters cleared with no standing water", required: true },
      { label: "Roof membrane free of blisters, tears, or open lap seams", required: true },
      { label: "Parapet coping, counter-flashing, and pitch pockets sealed", required: true },
      { label: "HVAC pipe/duct supports resting on protective rubber pads", required: false },
      { label: "Lightning arrestor rods and bonding straps securely fastened", required: false },
      { label: "No unauthorized contractor tools or loose materials left on roof", required: true },
    ],
    faqs: [
      {
        question: "How long is ponding water acceptable on a flat commercial roof?",
        answer:
          "Most roofing manufacturers define ponding as standing water remaining more than 48 hours after rainfall, which accelerates membrane degradation and voids warranties.",
      },
      {
        question: "When should extra roof drain checks be scheduled?",
        answer:
          "In addition to monthly checks, always inspect and clear roof drains immediately before forecasted tropical storms or heavy monsoon events.",
      },
    ],
  },
  {
    slug: "fire-alarm-control-panel-facp-daily-check",
    title: "Fire Alarm Control Panel (FACP) Daily Check",
    industry: "Facility Management",
    complianceStandards: ["NFPA 72", "EN 54", "ISO 41001"],
    frequency: "daily",
    shortDescription:
      "Daily visual and status verification of the main Fire Alarm Control Panel (FACP) and repeater panels for trouble, supervisory, or disabled zones.",
    seoTitle: "Fire Alarm Control Panel (FACP) Daily Check SOP",
    seoDescription:
      "Keep building life-safety systems compliant with a daily NFPA 72 FACP inspection checking AC power, trouble LEDs, disabled zones, and printers.",
    sopSteps: [
      {
        stepOrder: 1,
        title: "Confirm Normal System Status",
        instruction:
          "Inspect the main FACP LCD display and LEDs to verify the green 'System Normal / AC Power On' indicator is steady with zero active Fire, Trouble, or Supervisory alerts.",
        isCritical: true,
      },
      {
        stepOrder: 2,
        title: "Verify No Unauthorized Disabled Zones",
        instruction:
          "Check the panel's disablement/isolation menu to ensure no smoke detectors, NAC circuits, or sprinkler flow switches remain bypassed after daytime hot-work.",
        isCritical: true,
      },
      {
        stepOrder: 3,
        title: "Check Battery Charger & Panel Cabinet",
        instruction:
          "Confirm zero battery trouble flags, verify the cabinet door is locked, and ensure 1m clear working space in front of the FACP.",
        isCritical: true,
      },
      {
        stepOrder: 4,
        title: "Inspect Printer Paper & Logbook",
        instruction:
          "Ensure the thermal event printer (if fitted) has adequate paper and record the daily panel status check via QR scan.",
        isCritical: false,
      },
    ],
    checklistItems: [
      { label: "Green AC Power / System Normal LED steadily illuminated", required: true },
      { label: "Zero active Fire, Fault, or Trouble indicators on LCD", required: true },
      { label: "Zero Supervisory or valve-tamper signals present", required: true },
      { label: "No detector zones or sounder circuits left isolated/disabled", required: true },
      { label: "Backup battery voltage normal with no charger fault", required: true },
      { label: "Repeater panels in security/lobby synced with main FACP", required: false },
      { label: "FACP cabinet locked and 1m front clearance unobstructed", required: true },
      { label: "Daily status logged with operator name and timestamp", required: true },
    ],
    faqs: [
      {
        question: "Why check for disabled zones at the end of every shift?",
        answer:
          "Contractors often request temporary zone isolation during dusty work or welding; forgetting to re-enable a zone leaves floors unprotected overnight.",
      },
      {
        question: "Does a daily FACP check require sounding the building evacuation horns?",
        answer:
          "No. Daily checks are non-intrusive status verifications; audible/visual NAC testing is performed during scheduled weekly/monthly/annual drills.",
      },
    ],
  },
  {
    slug: "commercial-washroom-cleaning-supply-log",
    title: "Commercial Washroom Cleaning & Supply Log",
    industry: "Facility Management",
    complianceStandards: ["ISO 41001", "ISSA CIMS", "OSHA 1910.141"],
    frequency: "daily",
    shortDescription:
      "Hourly/daily commercial restroom sanitation, consumable restocking, and plumbing check log with QR sign-off for high-traffic facilities.",
    seoTitle: "Commercial Washroom Cleaning & Supply QR Log",
    seoDescription:
      "Digitize restroom housekeeping with a commercial washroom cleaning and supply checklist covering sanitization, soap/paper refills, and odors.",
    sopSteps: [
      {
        stepOrder: 1,
        title: "Place Wet Floor Sign & Restock Supplies",
        instruction:
          "Position safety signage at the entrance, empty all trash and sanitary bins, and refill toilet tissue, paper towels, and foaming hand soap dispensers.",
        isCritical: false,
      },
      {
        stepOrder: 2,
        title: "Clean & Disinfect Fixtures",
        instruction:
          "Apply EPA-approved disinfectant to toilet bowls, urinals, flush valves, faucets, door handles, and partitions, observing required contact dwell time.",
        isCritical: true,
      },
      {
        stepOrder: 3,
        title: "Polish Mirrors & Mop Floors",
        instruction:
          "Wipe mirrors and countertops streak-free, then mop the floor from the farthest corner toward the exit using a clean, color-coded mop head.",
        isCritical: false,
      },
      {
        stepOrder: 4,
        title: "Verify Plumbing & Log Completion",
        instruction:
          "Check sensor faucets, flushometers, and hand dryers for leaks or faults, verify fresh air circulation, and scan the door QR sticker to timestamp the log.",
        isCritical: true,
      },
    ],
    checklistItems: [
      { label: "Wet floor safety sign placed during cleaning and removed when dry", required: true },
      { label: "Toilets, urinals, and seats scrubbed and disinfected", required: true },
      { label: "High-touch handles, flush buttons, and latches sanitized", required: true },
      { label: "Toilet paper, paper towels, and hand soap dispensers refilled", required: true },
      { label: "Trash and sanitary disposal bins emptied with fresh liners", required: true },
      { label: "Mirrors, sinks, and vanity counters clean and dry", required: false },
      { label: "Floor mopped clean with no standing water or urine odor", required: true },
      { label: "Sensor taps, flushes, and hand dryers working with no leaks", required: true },
    ],
    faqs: [
      {
        question: "Why use QR codes instead of paper clipboards behind washroom doors?",
        answer:
          "QR logs eliminate damp, smudged paper sheets, capture exact timestamps to prevent batch-signing, and let occupants report empty soap or leaks instantly.",
      },
      {
        question: "What color-coding standard prevents cross-contamination in restrooms?",
        answer:
          "ISSA and commercial janitorial standards typically assign red microfiber cloths and mops exclusively to toilets/urinals and yellow to sinks and surfaces.",
      },
    ],
  },
];
