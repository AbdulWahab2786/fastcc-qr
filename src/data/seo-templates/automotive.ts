import type { SeoTemplate } from "./types";

export const AUTOMOTIVE_TEMPLATES: SeoTemplate[] = [
  {
    slug: "commercial-vehicle-dot-rto-pre-trip-inspection",
    title: "Commercial Vehicle DOT/RTO Pre-Trip Inspection",
    industry: "Automotive & Fleet",
    complianceStandards: ["FMCSA 49 CFR 396.11", "DOT", "AIS-052"],
    frequency: "daily",
    shortDescription:
      "Comprehensive daily DVIR pre-trip inspection for commercial trucks, buses, and goods carriers covering engine bay, air brakes, suspension, and compliance documents.",
    seoTitle: "Commercial Vehicle DOT/RTO Pre-Trip Checklist",
    seoDescription:
      "Complete DOT 49 CFR 396.11 and RTO commercial vehicle pre-trip inspection template. Log engine fluids, brakes, suspension, and permits via QR.",
    sopSteps: [
      {
        stepOrder: 1,
        title: "Verify Permits, Registration & Previous DVIR",
        instruction:
          "Confirm vehicle registration, insurance, fitness certificate/DOT annual sticker, and sign off that any defects on the prior Driver Vehicle Inspection Report were repaired.",
        isCritical: true,
      },
      {
        stepOrder: 2,
        title: "Inspect Engine Compartment & Belts",
        instruction:
          "Check engine oil, coolant, power steering, and DEF levels with the engine cold, and inspect serpentine belts and radiator hoses for cracks or leaks.",
        isCritical: true,
      },
      {
        stepOrder: 3,
        title: "Perform Cab & Air Brake System Test",
        instruction:
          "Check steering wheel free-play (under 2 inches), test service and parking brakes, verify low-air warning below 60 PSI, and confirm spring brake pop-out at 20–45 PSI.",
        isCritical: true,
      },
      {
        stepOrder: 4,
        title: "Walkaround Suspension, Frame & Coupling",
        instruction:
          "Inspect leaf springs, shock absorbers, air bags, fifth-wheel locking jaws, and electrical/air lines for chafing or sagging.",
        isCritical: true,
      },
      {
        stepOrder: 5,
        title: "Verify Emergency Kit & Exterior Lighting",
        instruction:
          "Confirm charged ABC fire extinguisher, 3 reflective triangles, first-aid kit, and test all headlights, brake lamps, and clearance lights.",
        isCritical: false,
      },
    ],
    checklistItems: [
      { label: "Previous DVIR defects certified repaired before dispatch", required: true },
      { label: "Engine oil, coolant, and brake/DEF fluid within safe marks", required: true },
      { label: "Drive belts and radiator hoses free of fraying or leaks", required: true },
      { label: "Air brake governor cutout (120–135 PSI) and leak test passed", required: true },
      { label: "Steering linkage and wheel free-play within safe tolerance", required: true },
      { label: "Suspension springs, U-bolts, and air bags undamaged", required: true },
      { label: "Tyre tread depth, inflation, and lug nuts compliant", required: true },
      { label: "All exterior lights, reflectors, and horn operational", required: true },
      { label: "Fire extinguisher, reflective triangles, and permits onboard", required: true },
    ],
    faqs: [
      {
        question: "What makes a pre-trip inspection DOT/RTO audit-ready?",
        answer:
          "An audit-ready log records the vehicle ID, date, timestamp, driver signature, itemized pass/fail results, and documented repair sign-off before the vehicle returns to service.",
      },
      {
        question: "When should a commercial vehicle be placed out of service immediately?",
        answer:
          "Any defect in service brakes, steering gear, cracked frame rails, exposed tyre cord, or missing headlamps requires immediate out-of-service tagging until repaired.",
      },
    ],
  },
  {
    slug: "two-post-hydraulic-lift-safety-inspection",
    title: "Two-Post Hydraulic Lift Safety Inspection",
    industry: "Automotive & Fleet",
    complianceStandards: ["ANSI/ALI ALOIM", "OSHA 1910", "CE EN 1493"],
    frequency: "daily",
    shortDescription:
      "Daily pre-use safety inspection for 2-post automotive service lifts covering arm restraints, mechanical safety latches, rubber pads, and hydraulic lines.",
    seoTitle: "Two-Post Hydraulic Lift Safety Inspection SOP",
    seoDescription:
      "Prevent vehicle drop accidents with this daily ANSI/ALI ALOIM two-post hydraulic lift checklist. Inspect arm locks, cables, and safety latches.",
    sopSteps: [
      {
        stepOrder: 1,
        title: "Inspect Swing Arm Restraints & Rubber Pads",
        instruction:
          "Verify gear-tooth arm restraints lock automatically when raised off the floor and inspect rubber lift pads for tears, oil saturation, or missing adapters.",
        isCritical: true,
      },
      {
        stepOrder: 2,
        title: "Check Columns, Anchor Bolts & Overhead Cutout",
        instruction:
          "Inspect baseplate anchor bolts for looseness, check column welds, and test the padded overhead shutoff bar to ensure it stops upward travel.",
        isCritical: true,
      },
      {
        stepOrder: 3,
        title: "Cycle Unloaded Lift & Verify Safety Latches",
        instruction:
          "Raise the lift empty and listen for crisp, synchronized mechanical latch clicks on both columns; lower onto locks and confirm equalized cable tension.",
        isCritical: true,
      },
      {
        stepOrder: 4,
        title: "Inspect Hydraulic Power Unit & Hoses",
        instruction:
          "Check hydraulic reservoir oil level, inspect hose fittings for weeping, and verify the deadman lowering lever returns to neutral when released.",
        isCritical: false,
      },
    ],
    checklistItems: [
      { label: "Swing arm gear restraints engage and hold firmly under load", required: true },
      { label: "Rubber lift pads and height adapters intact and oil-free", required: true },
      { label: "Mechanical safety latches click in sync on both columns", required: true },
      { label: "Equalization cables free of fraying, kinks, or slack", required: true },
      { label: "Overhead limit switch bar stops lift travel immediately", required: true },
      { label: "Baseplate anchor bolts tight with no concrete cracking", required: true },
      { label: "Hydraulic cylinders, hoses, and power pack free of leaks", required: true },
      { label: "Rated capacity decal and manufacturer lift-point chart visible", required: false },
    ],
    faqs: [
      {
        question: "How often does ANSI/ALI ALOIM require lift inspections?",
        answer:
          "ANSI/ALI ALOIM requires a daily pre-use check by the technician before lifting any vehicle, plus a formal annual inspection by a qualified lift inspector.",
      },
      {
        question: "Why must a technician lower the vehicle onto the mechanical locks?",
        answer:
          "Working under a vehicle supported only by hydraulic fluid risks sudden cylinder seal failure; resting on the mechanical safety latches transfers the load to solid steel stops.",
      },
    ],
  },
  {
    slug: "ev-charging-station-daily-safety-cable-check",
    title: "EV Charging Station Daily Safety & Cable Check",
    industry: "Automotive & Fleet",
    complianceStandards: ["NEC Article 625", "SAE J1772", "IEC 61851"],
    frequency: "daily",
    shortDescription:
      "Daily visual and functional inspection for AC Level 2 and DC fast EV chargers in fleet depots, dealerships, and public charging hubs.",
    seoTitle: "EV Charging Station Daily Safety Checklist",
    seoDescription:
      "Daily NEC 625 and IEC 61851 EV charger inspection checklist. Check CCS/J1772 connectors, cable jackets, E-stop buttons, and GFCI status.",
    sopSteps: [
      {
        stepOrder: 1,
        title: "Inspect Charging Cables & Connector Pins",
        instruction:
          "Examine the full cable length for cuts, crush marks, or exposed inner shielding, and inspect CCS/J1772/NACS pins for arc pitting, bent contacts, or moisture.",
        isCritical: true,
      },
      {
        stepOrder: 2,
        title: "Verify Pedestal Enclosure & E-Stop Button",
        instruction:
          "Check cabinet doors and seals for water ingress, confirm cooling fan vents are clear, and ensure the red Emergency Stop button is unobstructed.",
        isCritical: true,
      },
      {
        stepOrder: 3,
        title: "Check Display, GFCI Status & Cable Retractor",
        instruction:
          "Confirm the charger HMI screen shows ready status with no ground-fault trips, and verify cable management retractors keep cords off wet pavement.",
        isCritical: false,
      },
      {
        stepOrder: 4,
        title: "Inspect Bollards & Bay Fire Safety",
        instruction:
          "Verify protective crash bollards are intact and confirm a Class C/ABC fire extinguisher is accessible near the charging row.",
        isCritical: false,
      },
    ],
    checklistItems: [
      { label: "Charging cable jacket free of cuts, kinks, or abrasion", required: true },
      { label: "Connector pins clean, dry, and free of burn or arc marks", required: true },
      { label: "Connector latch/release button clicks smoothly", required: true },
      { label: "Cabinet enclosure intact with no water ingress or error codes", required: true },
      { label: "Emergency Stop (E-stop) button clearly labeled and unobstructed", required: true },
      { label: "Cable holster/retractor keeps connector off the ground", required: false },
      { label: "Protective bollards secure with no vehicle impact damage", required: false },
      { label: "DC charger air intake filters clean and cooling fans running", required: false },
    ],
    faqs: [
      {
        question: "What should I do if an EV charger connector shows scorch marks?",
        answer:
          "Immediately trip the upstream breaker or press the E-stop, lock out the charger, and have a certified EV technician replace the cable assembly—carbonized pins cause thermal runaway.",
      },
      {
        question: "Why is cable retractor inspection important for fleet EV depots?",
        answer:
          "Cables left lying on the ground are frequently run over by heavy fleet vans, crushing internal pilot wires and damaging liquid-cooled DC conductors.",
      },
    ],
  },
  {
    slug: "automotive-paint-booth-ventilation-fire-check",
    title: "Automotive Paint Booth Ventilation & Fire Check",
    industry: "Automotive & Fleet",
    complianceStandards: ["NFPA 33", "OSHA 1910.107", "EPA 6H"],
    frequency: "daily",
    shortDescription:
      "Daily pre-spray inspection of downdraft/crossdraft automotive paint booths covering manometer pressure, exhaust filters, interlocks, and fire suppression.",
    seoTitle: "Automotive Paint Booth Ventilation & Fire Check",
    seoDescription:
      "Stay NFPA 33 and EPA 6H compliant with this daily automotive spray booth checklist. Monitor manometer pressure, filters, and fire suppression.",
    sopSteps: [
      {
        stepOrder: 1,
        title: "Check Manometer & Filter Pressure Differential",
        instruction:
          "Turn on intake/exhaust fans and verify the magnehelic manometer reads within the target static pressure range; replace exhaust fiberglass arrestors if clogged.",
        isCritical: true,
      },
      {
        stepOrder: 2,
        title: "Test Air-Flow & Door Interlock Switches",
        instruction:
          "Confirm compressed air to the spray guns shuts off automatically when booth exhaust fans stop or booth doors open.",
        isCritical: true,
      },
      {
        stepOrder: 3,
        title: "Inspect Fire Suppression Nozzles & Extinguishers",
        instruction:
          "Verify automatic Ansul/dry-chemical suppression system gauge is in the green, fusible links are clean of overspray, and booth nozzles have protective caps.",
        isCritical: true,
      },
      {
        stepOrder: 4,
        title: "Verify Explosion-Proof Lighting & Grounding",
        instruction:
          "Check sealed glass light fixtures for cracks, confirm static grounding clamps are attached to the vehicle body, and remove solvent rags from the booth.",
        isCritical: true,
      },
    ],
    checklistItems: [
      { label: "Magnehelic manometer within green operating pressure range", required: true },
      { label: "Exhaust arrestor pads and ceiling intake filters clean and seated", required: true },
      { label: "Spray-air interlock shuts off air when exhaust fan is off", required: true },
      { label: "Fire suppression control panel armed with no trouble lights", required: true },
      { label: "Suppression nozzles capped and fusible links free of paint buildup", required: true },
      { label: "Explosion-proof light lenses intact and sealed", required: true },
      { label: "Static grounding strap available and conductive", required: false },
      { label: "Booth floor and walls free of open solvent cans or oily rags", required: true },
    ],
    faqs: [
      {
        question: "Why does NFPA 33 require an interlock between exhaust fans and spray guns?",
        answer:
          "Without active airflow, flammable paint vapors rapidly reach explosive LEL concentrations; the interlock guarantees spraying cannot occur without ventilation.",
      },
      {
        question: "How often should paint booth exhaust filters be changed?",
        answer:
          "Change exhaust arrestor pads whenever the manometer reaches the maximum pressure-drop mark (typically 0.5–0.75 in. w.g.) or per EPA 6H capture-efficiency schedules.",
      },
    ],
  },
  {
    slug: "tyre-changer-wheel-balancer-daily-check",
    title: "Tyre Changer & Wheel Balancer Daily Check",
    industry: "Automotive & Fleet",
    complianceStandards: ["OSHA 1910.177", "TIA", "ISO 9001"],
    frequency: "daily",
    shortDescription:
      "Daily safety and accuracy check for pneumatic tyre changers, bead blasters, inflation cages, and computerized wheel balancers in service bays.",
    seoTitle: "Tyre Changer & Wheel Balancer Daily Checklist",
    seoDescription:
      "Daily shop checklist for tyre changers and wheel balancers. Verify pressure regulators, inflation cages, duckhead jaws, and calibration.",
    sopSteps: [
      {
        stepOrder: 1,
        title: "Drain Water Trap & Check Air Line Pressure",
        instruction:
          "Drain moisture from the FRL (filter-regulator-lubricator) bowl, verify lubricator oil level, and confirm incoming shop air is regulated to 110–145 PSI.",
        isCritical: false,
      },
      {
        stepOrder: 2,
        title: "Inspect Mount/Demount Duckhead & Clamping Jaws",
        instruction:
          "Check plastic rim-protector inserts on the duckhead and turntable jaws to prevent scratching alloy wheels, and test foot pedals for smooth return.",
        isCritical: false,
      },
      {
        stepOrder: 3,
        title: "Verify Inflation Gauge & Safety Cage",
        instruction:
          "Check the clip-on air chuck hose for leaks, verify the pressure limiter stops at 40 PSI for bead seating, and inspect truck tyre inflation cage welds.",
        isCritical: true,
      },
      {
        stepOrder: 4,
        title: "Test Wheel Balancer Hood Interlock & Calibration",
        instruction:
          "Verify the wheel balancer hood safety switch stops the spindle when raised, clean the mounting shaft cone, and run a self-calibration check if needed.",
        isCritical: true,
      },
    ],
    checklistItems: [
      { label: "Air line water trap drained and FRL lubricator oil topped up", required: false },
      { label: "Turntable jaw covers and duckhead plastic inserts intact", required: false },
      { label: "Bead-seating pressure limiter and inflation gauge accurate", required: true },
      { label: "Clip-on inflation hose long enough for technician to stand clear", required: true },
      { label: "Safety inflation cage free of bent bars or cracked welds (for truck tyres)", required: true },
      { label: "Wheel balancer safety hood interlock stops rotation immediately", required: true },
      { label: "Balancer shaft threads, wingnut, and centering cones clean", required: false },
      { label: "Safety glasses and ear protection staged at tyre bay", required: true },
    ],
    faqs: [
      {
        question: "Why is a clip-on chuck and long whip hose required for tyre inflation?",
        answer:
          "OSHA 1910.177 requires a clip-on chuck with an inline valve and sufficient hose length so the technician can stand completely outside the trajectory zone during bead seating.",
      },
      {
        question: "How often should a computerized wheel balancer be calibrated?",
        answer:
          "Perform a quick user calibration weekly or whenever the machine is moved, bumped, or gives inconsistent weight readings on a known-good wheel.",
      },
    ],
  },
  {
    slug: "fleet-engine-oil-coolant-fluid-top-up-log",
    title: "Fleet Engine Oil, Coolant & Fluid Top-Up Log",
    industry: "Automotive & Fleet",
    complianceStandards: ["ISO 9001", "EPA SPCC", "OEM Spec"],
    frequency: "weekly",
    shortDescription:
      "Weekly preventive fluid check and top-up log for fleet vehicles covering engine oil, OAT/HOAT coolant, AdBlue/DEF, brake fluid, and windshield washer.",
    seoTitle: "Fleet Engine Oil, Coolant & Fluid Top-Up Log",
    seoDescription:
      "Track fleet engine oil, coolant, DEF, and brake fluid top-ups to catch slow leaks early and prevent costly engine or emission failures.",
    sopSteps: [
      {
        stepOrder: 1,
        title: "Park on Level Ground & Check Engine Oil",
        instruction:
          "Allow engine to sit 5 minutes after shutdown, wipe dipstick clean, re-insert, and verify oil is between MIN and MAX with no milky emulsion.",
        isCritical: true,
      },
      {
        stepOrder: 2,
        title: "Inspect Coolant Expansion Tank (Cold Only)",
        instruction:
          "Never open a hot pressurized cap; verify coolant level on the translucent reservoir markings and confirm correct OEM color/spec before topping up.",
        isCritical: true,
      },
      {
        stepOrder: 3,
        title: "Check Brake, Power Steering & DEF Levels",
        instruction:
          "Inspect translucent brake fluid reservoir (low level may indicate worn pads or leak), top up DEF/AdBlue using dedicated uncontaminated funnels, and fill washer fluid.",
        isCritical: true,
      },
      {
        stepOrder: 4,
        title: "Log Consumption & Flag Chronic Top-Ups",
        instruction:
          "Record exact liters/quarts added; any vehicle requiring repeated oil or coolant top-ups within 2 weeks must be scheduled for pressure/leak diagnostics.",
        isCritical: false,
      },
    ],
    checklistItems: [
      { label: "Engine oil level within safe band and free of milky contamination", required: true },
      { label: "Coolant level between MIN/MAX cold marks on expansion tank", required: true },
      { label: "Brake fluid reservoir within range with no dark moisture contamination", required: true },
      { label: "Power steering / hydraulic fluid level verified", required: false },
      { label: "DEF / AdBlue tank topped up using clean dedicated nozzle", required: false },
      { label: "Windshield washer reservoir filled", required: false },
      { label: "Underbody and skid plate free of fresh oil or coolant drips", required: true },
      { label: "Exact top-up volume logged against vehicle odometer", required: true },
    ],
    faqs: [
      {
        question: "Why should fleet managers log exact top-up quantities instead of just 'OK'?",
        answer:
          "Tracking liters added per 1,000 km reveals gradual head-gasket seepage, turbo oil consumption, or pinhole radiator leaks weeks before an engine seizes on the road.",
      },
      {
        question: "What happens if diesel or coolant accidentally contaminates a DEF tank?",
        answer:
          "Even tiny amounts of oil, coolant, or tap water will crystallize and destroy the SCR catalyst and DEF injector—never start the engine if contamination is suspected.",
      },
    ],
  },
  {
    slug: "employee-shuttle-school-bus-daily-safety",
    title: "Employee Shuttle & School Bus Daily Safety",
    industry: "Automotive & Fleet",
    complianceStandards: ["FMCSA", "AIS-063", "OSHA"],
    frequency: "daily",
    shortDescription:
      "Daily passenger-safety and mechanical inspection for corporate employee shuttles and school buses covering emergency exits, seatbelts, cameras, and first-aid.",
    seoTitle: "Employee Shuttle & School Bus Daily Safety Check",
    seoDescription:
      "Daily safety checklist for employee shuttles and school buses. Verify emergency exit buzzers, passenger seatbelts, CCTV, and first-aid kits.",
    sopSteps: [
      {
        stepOrder: 1,
        title: "Test Passenger Door & Emergency Exit Alarms",
        instruction:
          "Cycle the pneumatic passenger door, test sensitive door edges, and unlatch rear/roof emergency exits to confirm warning buzzers sound at the driver console.",
        isCritical: true,
      },
      {
        stepOrder: 2,
        title: "Inspect Passenger Seats, Seatbelts & Aisles",
        instruction:
          "Walk the center aisle to check seat frame bolts, test 3-point seatbelts for fraying or jammed buckles, and ensure aisles and exits are completely clear.",
        isCritical: true,
      },
      {
        stepOrder: 3,
        title: "Verify Fire Extinguisher, First-Aid & Hammer",
        instruction:
          "Confirm the ABC fire extinguisher gauge is in the green, emergency glass-break hammers are mounted, and the first-aid kit seal is intact.",
        isCritical: true,
      },
      {
        stepOrder: 4,
        title: "Check Exterior Mirrors, Stop Arm & CCTV",
        instruction:
          "Confirm crossover/convex mirrors give full front-bumper visibility, test flashing amber/red passenger lights, and verify dashcam/CCTV recording status.",
        isCritical: true,
      },
    ],
    checklistItems: [
      { label: "Service door opens/closes smoothly with working safety edge", required: true },
      { label: "Rear and roof emergency exits unlatch easily and trigger alarm", required: true },
      { label: "All passenger seatbelts intact, clean, and latching properly", required: true },
      { label: "Center aisle and emergency exit pathways completely unobstructed", required: true },
      { label: "First-aid kit stocked and emergency glass-break hammers present", required: true },
      { label: "Fire extinguisher mounted near driver and charged in green zone", required: true },
      { label: "Crossover mirrors clean and adjusted for blind-spot coverage", required: true },
      { label: "Interior cabin CCTV / GPS tracker showing active recording", required: false },
      { label: "Wheelchair lift / ramp interlock and tie-down straps verified (if equipped)", required: false },
    ],
    faqs: [
      {
        question: "Why must emergency exit buzzers be tested every single day?",
        answer:
          "A silent or disconnected buzzer can leave a rear emergency door unlatched during transit, or fail to alert the driver if a passenger opens an exit unexpectedly.",
      },
      {
        question: "What should be inside a shuttle or school bus emergency kit?",
        answer:
          "A stocked trauma/first-aid kit, bloodborne-pathogen spill kit, charged 5-lb ABC fire extinguisher, 3 reflective warning triangles, and seatbelt cutter.",
      },
    ],
  },
  {
    slug: "workshop-torque-wrench-tool-calibration-log",
    title: "Workshop Torque Wrench & Tool Calibration Log",
    industry: "Automotive & Fleet",
    complianceStandards: ["ISO 6789", "ISO 9001", "IATF 16949"],
    frequency: "monthly",
    shortDescription:
      "Monthly verification and calibration-status log for click-type, digital, and hydraulic torque wrenches, multimeters, and brake-fluid testers.",
    seoTitle: "Workshop Torque Wrench & Tool Calibration Log",
    seoDescription:
      "Maintain ISO 6789 and IATF 16949 compliance with this workshop torque wrench, multimeter, and diagnostic tool calibration verification log.",
    sopSteps: [
      {
        stepOrder: 1,
        title: "Verify Calibration Sticker & Due Date",
        instruction:
          "Check each torque wrench's serial number against the calibration register and confirm the ISO 6789 calibration sticker has not expired.",
        isCritical: true,
      },
      {
        stepOrder: 2,
        title: "Inspect Mechanical Condition & Zero-Reset",
        instruction:
          "Confirm micrometer-style click wrenches were stored wound back to their lowest scale setting (not zeroed below minimum) and inspect ratchet pawls for slip.",
        isCritical: true,
      },
      {
        stepOrder: 3,
        title: "Run Bench Torque Tester Spot-Check",
        instruction:
          "Test each wrench on the shop digital torque analyzer at 20%, 60%, and 100% of full scale; any deviation beyond ±4% requires immediate quarantine.",
        isCritical: true,
      },
      {
        stepOrder: 4,
        title: "Check Digital Multimeters & Diagnostic Leads",
        instruction:
          "Inspect multimeter test leads for cracked insulation, verify internal fuse continuity, and check battery levels on TPMS and battery-conductance testers.",
        isCritical: false,
      },
    ],
    checklistItems: [
      { label: "All active torque wrenches within valid annual calibration window", required: true },
      { label: "Calibration serial numbers and tamper seals intact", required: true },
      { label: "Spot-check on bench analyzer within ±4% tolerance", required: true },
      { label: "Click-type wrenches stored at lowest scale setting when idle", required: false },
      { label: "Ratchet head, anvil, and locking collar operate smoothly", required: false },
      { label: "Out-of-tolerance tools tagged 'DO NOT USE' and removed from box", required: true },
      { label: "Multimeter probes and high-voltage CAT III/IV gloves undamaged", required: true },
      { label: "Calibration log updated with tester ID and next due date", required: true },
    ],
    faqs: [
      {
        question: "Why must click-type torque wrenches be wound back after use?",
        answer:
          "Leaving a spring-loaded micrometer torque wrench compressed at a high torque setting causes spring fatigue, leading to permanent under-torquing of critical wheel lugs and engine bolts.",
      },
      {
        question: "What is the standard accuracy tolerance for automotive torque wrenches?",
        answer:
          "Under ISO 6789-1, hand torque tools must maintain accuracy within ±4% (or ±6% for certain high-capacity wrenches) across 20% to 100% of their rated range.",
      },
    ],
  },
  {
    slug: "service-bay-air-hose-compressor-check",
    title: "Service Bay Air Hose & Compressor Check",
    industry: "Automotive & Fleet",
    complianceStandards: ["OSHA 1910.169", "ASME BPVC", "ISO 45001"],
    frequency: "weekly",
    shortDescription:
      "Weekly preventive safety check for workshop air compressors, pressurized receiver tanks, relief valves, overhead hose reels, and blow-gun nozzles.",
    seoTitle: "Service Bay Air Hose & Compressor Checklist",
    seoDescription:
      "Weekly OSHA 1910.169 air compressor and service bay hose reel checklist. Drain receiver condensate, test safety relief valves, and check nozzles.",
    sopSteps: [
      {
        stepOrder: 1,
        title: "Drain Air Receiver Tank Condensate",
        instruction:
          "Open the bottom drain valve (or verify automatic condensate drain) until clear air flows, preventing internal tank rust and water in air tools.",
        isCritical: true,
      },
      {
        stepOrder: 2,
        title: "Test Pressure Relief Valve & Cutout Switch",
        instruction:
          "Pull the ASME safety relief valve ring briefly to confirm it seats cleanly without sticking, and verify the pressure switch cuts out below tank MAWP.",
        isCritical: true,
      },
      {
        stepOrder: 3,
        title: "Inspect Compressor Belts, Oil & Guards",
        instruction:
          "Check sight-glass compressor oil level, inspect drive belts for glazing, and confirm the belt/flywheel safety cage is bolted securely.",
        isCritical: false,
      },
      {
        stepOrder: 4,
        title: "Audit Bay Hose Reels & OSHA Blow-Gun Nozzles",
        instruction:
          "Inspect overhead retractable hoses for bulges or leaking quick-couplers, and confirm all air blow guns are dead-end regulated to <= 30 PSI.",
        isCritical: true,
      },
    ],
    checklistItems: [
      { label: "Receiver tank condensate drained and oil-water separator clear", required: true },
      { label: "ASME safety relief valve pops freely and reseats without leaking", required: true },
      { label: "Compressor oil level within sight-glass mark", required: false },
      { label: "Belt guard and flywheel enclosure securely fastened", required: true },
      { label: "Pressure gauge legible and auto-cutout switch functioning", required: true },
      { label: "Bay air hoses and quick-disconnect couplers free of leaks or bulges", required: false },
      { label: "Air blow-gun nozzles OSHA-compliant (<= 30 PSI dead-end)", required: true },
      { label: "Compressor room clear of combustible storage", required: false },
    ],
    faqs: [
      {
        question: "Why does OSHA limit air blow-gun dead-end pressure to 30 PSI?",
        answer:
          "Under OSHA 1910.242(b), dead-ending compressed air above 30 PSI against skin can inject air bubbles into the bloodstream (air embolism) or propel metal shavings into eyes.",
      },
      {
        question: "Why is draining the air receiver tank weekly so important?",
        answer:
          "Compressed air condenses moisture inside the steel tank; standing water corrodes the bottom weld seam, risking a catastrophic pressure-vessel rupture.",
      },
    ],
  },
  {
    slug: "automated-car-wash-bay-daily-maintenance",
    title: "Automated Car Wash Bay Daily Maintenance",
    industry: "Automotive & Fleet",
    complianceStandards: ["OSHA 1910", "EPA NPDES", "ISO 14001"],
    frequency: "daily",
    shortDescription:
      "Daily pre-opening inspection for tunnel and rollover automated car wash bays covering conveyor rollers, brush clearances, chemical injectors, and E-stops.",
    seoTitle: "Automated Car Wash Bay Daily Maintenance Log",
    seoDescription:
      "Daily pre-open checklist for automated car wash tunnels and rollover bays. Check E-stops, brush sensors, chemical levels, and oil-water traps.",
    sopSteps: [
      {
        stepOrder: 1,
        title: "Test Emergency Stop Buttons & Photo-Eyes",
        instruction:
          "Walk the bay to test entry/exit E-stop buttons, verify overhead height-limit bars, and clean ultrasonic/photo-eye sensors so gantry clearance tracks accurately.",
        isCritical: true,
      },
      {
        stepOrder: 2,
        title: "Inspect Brushes, Cloths & High-Pressure Nozzles",
        instruction:
          "Check mitter curtains and side brushes for tangled antenna/wiper debris that can scratch paint, and inspect high-pressure arch nozzles for clogs.",
        isCritical: true,
      },
      {
        stepOrder: 3,
        title: "Check Chemical Drums, Dosers & Water Softener",
        instruction:
          "Verify pre-soak, foam detergent, wax, and spot-free RO/softener salt levels, and inspect Dosatron/peristaltic injector tubing for air bubbles.",
        isCritical: false,
      },
      {
        stepOrder: 4,
        title: "Inspect Conveyor Track & Pit Sump Trap",
        instruction:
          "Clear mud and stones from conveyor guide rails, check roller chain tension, and verify the bay grit/oil-water separator pit is not overflowing.",
        isCritical: false,
      },
    ],
    checklistItems: [
      { label: "Entry, exit, and attendant E-stop buttons tested and functional", required: true },
      { label: "Photo-eye sensors and vehicle height-limit bar clean and responsive", required: true },
      { label: "Wash brushes and mitter cloths free of trapped debris or grit", required: true },
      { label: "High-pressure rinse nozzles spraying evenly without blockages", required: false },
      { label: "Conveyor rollers, guide rails, and pushers moving smoothly", required: true },
      { label: "Detergent, wax, and water-softener salt levels adequate for shift", required: false },
      { label: "Blower/dryer fans free of vibration and abnormal bearing noise", required: false },
      { label: "Floor sump/oil-water separator clear with no drain backup", required: true },
    ],
    faqs: [
      {
        question: "What causes most vehicle damage claims in an automated car wash?",
        answer:
          "Debris (like a snapped wiper arm or gravel) caught in rotating brushes, or dirty photo-eye sensors misreading vehicle height/length—both prevented by a 5-minute daily check.",
      },
      {
        question: "Why check the oil-water separator pit daily?",
        answer:
          "Clogged grit pits cause soapy wash water to back up onto public storm drains, violating EPA/municipal wastewater discharge permits.",
      },
    ],
  },
];
