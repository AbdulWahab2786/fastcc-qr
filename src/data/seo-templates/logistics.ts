import type { SeoTemplate } from "./types";

export const LOGISTICS_TEMPLATES: SeoTemplate[] = [
  {
    slug: "forklift-pre-shift-safety-mechanical-check",
    title: "Forklift Pre-Shift Safety & Mechanical Check",
    industry: "Logistics & Warehousing",
    complianceStandards: ["OSHA 1910.178", "ANSI/ITSDF B56.1", "ISO 45001"],
    frequency: "daily",
    shortDescription:
      "Mandatory pre-shift visual and operational inspection for counterbalance and electric forklifts before entering warehouse aisles.",
    seoTitle: "Forklift Pre-Shift Safety Checklist & SOP Template",
    seoDescription:
      "Free OSHA 1910.178 forklift pre-shift safety checklist. Inspect forks, hydraulics, brakes, horn, and load backrest with QR scan logs.",
    sopSteps: [
      {
        stepOrder: 1,
        title: "Verify Operator Certification & Data Plate",
        instruction:
          "Confirm the operator holds a valid forklift license for the truck class and verify the capacity data plate is legible and matches any fitted attachment.",
        isCritical: true,
      },
      {
        stepOrder: 2,
        title: "Walkaround Structural & Tyre Inspection",
        instruction:
          "Inspect forks for cracks, bent tips, or heel wear exceeding 10%, check mast chains for equal tension, and examine tyres for chunking, flats, or embedded debris.",
        isCritical: true,
      },
      {
        stepOrder: 3,
        title: "Check Fluid Levels & Battery Connections",
        instruction:
          "For IC trucks, inspect engine oil, coolant, hydraulic fluid, and LPG tank straps. For electric units, verify battery hood latch, cable insulation, and charge level.",
        isCritical: false,
      },
      {
        stepOrder: 4,
        title: "Test Hydraulic Controls & Mast Functions",
        instruction:
          "Start the unit in a clear area and cycle lift, lower, tilt, and side-shift controls to full stroke, watching for jerky motion or cylinder oil leaks.",
        isCritical: true,
      },
      {
        stepOrder: 5,
        title: "Test Service Brakes, Horn & Warning Lights",
        instruction:
          "Test forward/reverse travel, service and parking brakes, steering play, audible horn, backup alarm, and blue safety spotlight before entering racking aisles.",
        isCritical: true,
      },
    ],
    checklistItems: [
      { label: "Capacity data plate legible and matched to current attachment", required: true },
      { label: "Forks free of cracks, bends, and uneven tip height", required: true },
      { label: "Load backrest extension secure with no bent or missing welds", required: true },
      { label: "Mast chains, rollers, and hydraulic hoses free of leaks or fraying", required: true },
      { label: "Tyres free of chunking, flat spots, or missing lug nuts", required: true },
      { label: "Overhead guard intact without structural dents or cracks", required: true },
      { label: "Seatbelt retracts and latches securely", required: true },
      { label: "Service brake and parking brake hold on grade", required: true },
      { label: "Horn, reverse alarm, strobe, and blue pedestrian spotlight working", required: true },
      { label: "Fire extinguisher mounted on truck and gauge in green zone", required: false },
    ],
    faqs: [
      {
        question: "How often does OSHA require a forklift pre-shift inspection?",
        answer:
          "Under OSHA 29 CFR 1910.178(q)(7), powered industrial trucks must be examined at least daily before being placed in service, and after each shift if used around the clock.",
      },
      {
        question: "What should an operator do if a forklift fails the daily check?",
        answer:
          "Immediately tag the forklift out of service, remove the key, notify the warehouse supervisor or maintenance team, and never operate a truck with brake, steering, or hydraulic defects.",
      },
    ],
  },
  {
    slug: "loading-dock-dock-leveler-safety-check",
    title: "Loading Dock & Dock Leveler Safety Check",
    industry: "Logistics & Warehousing",
    complianceStandards: ["OSHA 1910.26", "ANSI MH30.1", "ISO 45001"],
    frequency: "daily",
    shortDescription:
      "Daily safety and mechanical check for loading dock bays, hydraulic dock levelers, trailer restraints, and dock plates before freight transfer.",
    seoTitle: "Loading Dock & Dock Leveler Safety Checklist",
    seoDescription:
      "Standardize loading dock safety with this daily dock leveler, wheel chock, and trailer lock inspection checklist. Prevent trailer creep.",
    sopSteps: [
      {
        stepOrder: 1,
        title: "Confirm Trailer Restraint & Wheel Chocks",
        instruction:
          "Verify the trailer is backed squarely against dock bumpers, wheel chocks are wedged tightly against rear tyres, and the mechanical dock lock engages the ICC bar.",
        isCritical: true,
      },
      {
        stepOrder: 2,
        title: "Check Dock Communication Light Status",
        instruction:
          "Confirm exterior red/green dock lights and interior status panel match—red outside for the driver and green inside for forklift operators.",
        isCritical: true,
      },
      {
        stepOrder: 3,
        title: "Inspect Dock Leveler Lip & Hinges",
        instruction:
          "Cycle the dock leveler to ensure the lip extends smoothly, rests at least 4 inches onto the trailer bed, and shows no cracked welds or bent hinge pins.",
        isCritical: true,
      },
      {
        stepOrder: 4,
        title: "Clear Dock Apron & Inspect Weather Seals",
        instruction:
          "Sweep debris, shrink-wrap, and oil spills off the dock plate, inspect rubber dock bumpers and foam shelter seals, and verify dock door tracks are unobstructed.",
        isCritical: false,
      },
    ],
    checklistItems: [
      { label: "Trailer wheels chocked on both sides or dock lock engaged", required: true },
      { label: "Exterior/interior dock signal lights synchronized correctly", required: true },
      { label: "Dock leveler lip extends fully and rests securely on trailer floor", required: true },
      { label: "Hydraulic hoses, cylinders, and pit free of fluid leaks", required: true },
      { label: "Dock plate surface clean, dry, and free of oil or ice", required: true },
      { label: "Rubber dock bumpers intact with no exposed mounting bolts", required: false },
      { label: "Overhead dock door cables, springs, and tracks undamaged", required: true },
      { label: "Dock lighting illuminates trailer interior adequately", required: false },
    ],
    faqs: [
      {
        question: "How much of the dock leveler lip must rest on the trailer bed?",
        answer:
          "ANSI MH30.1 and industry best practices require at least 4 inches (100 mm) of full-width lip contact on the trailer floor to prevent the leveler from slipping during forklift entry.",
      },
      {
        question: "Are wheel chocks still required if an automatic dock lock is installed?",
        answer:
          "Many facilities require wheel chocks as a secondary backup when trailers have damaged ICC bars or air-ride suspension systems that can shift during heavy pallet loading.",
      },
    ],
  },
  {
    slug: "cold-chain-reefer-warehouse-temp-log",
    title: "Cold Chain Reefer & Warehouse Temp Log",
    industry: "Logistics & Warehousing",
    complianceStandards: ["GDP", "FSMA", "HACCP", "ISO 22000"],
    frequency: "daily",
    shortDescription:
      "Daily temperature, humidity, and door-seal verification log for refrigerated warehouses, blast chillers, and outbound reefer trailers.",
    seoTitle: "Cold Chain Reefer & Warehouse Temp Log Template",
    seoDescription:
      "Track cold storage and reefer trailer temperatures with this GDP and FSMA compliant cold chain inspection checklist and excursion SOP.",
    sopSteps: [
      {
        stepOrder: 1,
        title: "Record Calibrated Probe & Controller Readings",
        instruction:
          "Log both the digital controller setpoint and independent calibrated data-logger reading for chilled (2–8°C) and frozen (-18°C or below) zones.",
        isCritical: true,
      },
      {
        stepOrder: 2,
        title: "Verify Reefer Pre-Cooling Before Loading",
        instruction:
          "Confirm outbound reefer trailers are pre-cooled to the required cargo temperature for at least 30 minutes prior to breaking dock seals.",
        isCritical: true,
      },
      {
        stepOrder: 3,
        title: "Inspect Evaporator Coils, Fans & Drains",
        instruction:
          "Check evaporator fans for airflow obstruction, excessive frost buildup, or ice-blocked condensate drain lines inside cold rooms.",
        isCritical: false,
      },
      {
        stepOrder: 4,
        title: "Check Strip Curtains, Door Seals & Alarms",
        instruction:
          "Verify PVC strip curtains overlap cleanly, magnetic door gaskets seal without gaps, and high-temperature audible/SMS alarms are armed.",
        isCritical: true,
      },
      {
        stepOrder: 5,
        title: "Log Excursion Actions if Out of Range",
        instruction:
          "If temperature deviates beyond ±2°C for over 15 minutes, quarantine affected pallets, notify QA immediately, and record corrective action.",
        isCritical: true,
      },
    ],
    checklistItems: [
      { label: "Chiller zone temperature within 2°C to 8°C target range", required: true },
      { label: "Freezer zone temperature at or below -18°C", required: true },
      { label: "Calibrated backup thermometer matches digital controller (±1°C)", required: true },
      { label: "Reefer trailer pre-cooled to target setpoint before loading", required: true },
      { label: "Evaporator fans running with no heavy ice buildup on coils", required: false },
      { label: "Door gaskets and PVC strip curtains intact and sealing properly", required: true },
      { label: "High/low temperature alarm system active and tested", required: true },
      { label: "Cold room floor dry and free of ice slip hazards", required: true },
      { label: "Emergency inside-release door push-button functional", required: true },
    ],
    faqs: [
      {
        question: "Why check an independent thermometer alongside the reefer controller?",
        answer:
          "Return-air sensors on refrigeration units can drift or ice over; GDP and FSMA guidelines recommend verifying against a calibrated secondary probe to detect hidden thermal excursions.",
      },
      {
        question: "What triggers a cold chain quarantine?",
        answer:
          "Any unapproved temperature excursion exceeding product-specific stability limits—typically more than 15–30 minutes above 8°C for chilled goods—requires QA hold and disposition review.",
      },
    ],
  },
  {
    slug: "pallet-racking-structural-integrity-audit",
    title: "Pallet Racking Structural Integrity Audit",
    industry: "Logistics & Warehousing",
    complianceStandards: ["ANSI MH16.1", "EN 15635", "OSHA 1910.176"],
    frequency: "monthly",
    shortDescription:
      "Monthly structural inspection of selective, drive-in, and push-back pallet racking to catch forklift impact damage, missing beam locks, and overloading.",
    seoTitle: "Pallet Racking Structural Inspection Checklist",
    seoDescription:
      "Free ANSI MH16.1 and EN 15635 pallet racking inspection checklist. Spot bent uprights, missing safety clips, and anchor bolt failures early.",
    sopSteps: [
      {
        stepOrder: 1,
        title: "Check Load Capacity Plaques & Pallet Weights",
        instruction:
          "Verify load capacity plaques are posted at every aisle end and spot-check pallet weights against maximum beam-level ratings.",
        isCritical: true,
      },
      {
        stepOrder: 2,
        title: "Inspect Uprights & Baseplates for Impact",
        instruction:
          "Walk each aisle at floor level to check vertical uprights for twists, dents, or out-of-plumb deflection exceeding 3 mm per meter, and confirm floor anchors are tight.",
        isCritical: true,
      },
      {
        stepOrder: 3,
        title: "Verify Horizontal Beams & Safety Locking Pins",
        instruction:
          "Inspect beams for excessive sag (greater than L/180 under load) and confirm every beam connector has its safety locking pin or clip engaged.",
        isCritical: true,
      },
      {
        stepOrder: 4,
        title: "Inspect Column Guards & Wire Decking",
        instruction:
          "Check end-of-aisle rack protectors, row spacers, and wire mesh decking panels for broken welds or displaced supports.",
        isCritical: false,
      },
      {
        stepOrder: 5,
        title: "Classify Damage (Green, Amber, Red) & Quarantine",
        instruction:
          "Tag bent uprights using EN 15635 traffic-light severity: immediately offload and barricade Red-level bays until repaired by a qualified rack technician.",
        isCritical: true,
      },
    ],
    checklistItems: [
      { label: "Max load capacity plaques visible at all aisle ends", required: true },
      { label: "Upright columns plumb and free of dents, twists, or splits", required: true },
      { label: "Baseplates flush with floor and all anchor bolts tight", required: true },
      { label: "Beam safety locking pins/clips installed on every connector", required: true },
      { label: "Horizontal beams free of permanent deflection or weld cracks", required: true },
      { label: "Diagonal and horizontal bracing intact without buckled struts", required: true },
      { label: "End-of-aisle column guards anchored and undamaged", required: false },
      { label: "Wire decking and pallet support bars seated properly", required: false },
      { label: "Damaged bays tagged and offloaded per Red/Amber protocol", required: true },
    ],
    faqs: [
      {
        question: "What is the EN 15635 Green, Amber, Red rack damage system?",
        answer:
          "Green indicates minor damage safe for monitoring; Amber requires offloading once empty and repair within 4 weeks; Red indicates severe structural damage requiring immediate bay offloading and isolation.",
      },
      {
        question: "How often should warehouse pallet racking be inspected?",
        answer:
          "Supervisors should conduct weekly visual walkdowns, a formal documented audit monthly, and an annual expert structural inspection per EN 15635 and ANSI MH16.1.",
      },
    ],
  },
  {
    slug: "reach-truck-narrow-aisle-mhe-check",
    title: "Reach Truck & Narrow Aisle MHE Check",
    industry: "Logistics & Warehousing",
    complianceStandards: ["OSHA 1910.178", "ANSI/ITSDF B56.1", "ISO 45001"],
    frequency: "daily",
    shortDescription:
      "Daily pre-shift inspection for stand-up reach trucks, VNA turret trucks, and order pickers operating in high-bay narrow aisles.",
    seoTitle: "Reach Truck & Narrow Aisle MHE Check Template",
    seoDescription:
      "Daily pre-shift checklist for reach trucks and VNA material handling equipment. Verify pantograph reach, deadman pedal, and mast cameras.",
    sopSteps: [
      {
        stepOrder: 1,
        title: "Inspect Outriggers, Load Wheels & Drive Tyre",
        instruction:
          "Check polyurethane load wheels and caster wheels for flat spots, delamination, or wrapped shrink-wrap that can destabilize high-reach lifts.",
        isCritical: true,
      },
      {
        stepOrder: 2,
        title: "Test Deadman Pedal & Presence Sensor",
        instruction:
          "Step into the operator compartment and verify the deadman brake pedal or floor presence switch immediately cuts travel when foot pressure is released.",
        isCritical: true,
      },
      {
        stepOrder: 3,
        title: "Cycle Pantograph Reach & Side-Shift",
        instruction:
          "Extend and retract the pantograph scissor mechanism smoothly, checking hydraulic hoses, reach cylinders, and fork-carriage tilt.",
        isCritical: true,
      },
      {
        stepOrder: 4,
        title: "Verify Height Selector, Camera & Wire Guidance",
        instruction:
          "Test the mast-mounted fork camera, laser height indicator, and VNA wire/rail guidance sensors before entering high-bay racking.",
        isCritical: false,
      },
    ],
    checklistItems: [
      { label: "Deadman foot pedal / operator presence switch cuts drive immediately", required: true },
      { label: "Polyurethane load wheels free of flat spots and wrapped plastic", required: true },
      { label: "Pantograph reach mechanism extends/retracts without binding", required: true },
      { label: "Mast lift chains and hydraulic hoses leak-free and tensioned", required: true },
      { label: "Emergency power disconnect (red mushroom button) accessible and working", required: true },
      { label: "Fork-level camera and height pre-selector display clear", required: false },
      { label: "Steering tiller/wheel responsive with zero-play directional control", required: true },
      { label: "Horn, travel alarm, and overhead blue light operational", required: true },
    ],
    faqs: [
      {
        question: "Why are shrink-wrap tangles on reach truck load wheels so dangerous?",
        answer:
          "Reach trucks have small-diameter polyurethane load wheels; wrapped plastic film causes uneven rolling, overheating, and sudden wheel lockups that can tip high-elevation loads.",
      },
      {
        question: "What is the most critical safety feature on a stand-up reach truck?",
        answer:
          "The deadman pedal and emergency power disconnect—if an operator steps off or loses balance, the truck must brake automatically to prevent pinning against racking.",
      },
    ],
  },
  {
    slug: "outbound-delivery-dispatch-seal-verification",
    title: "Outbound Delivery Dispatch & Seal Verification",
    industry: "Logistics & Warehousing",
    complianceStandards: ["ISO 28000", "C-TPAT", "ISO 9001"],
    frequency: "daily",
    shortDescription:
      "Pre-dispatch verification of outbound freight count, pallet stability, hazardous placards, bill of lading accuracy, and tamper-evident container seals.",
    seoTitle: "Outbound Dispatch & Container Seal Checklist",
    seoDescription:
      "Prevent cargo theft and shipping errors with this outbound delivery dispatch and ISO 17712 seal verification checklist. Track BOLs via QR.",
    sopSteps: [
      {
        stepOrder: 1,
        title: "Reconcile Staging Manifest & Bill of Lading",
        instruction:
          "Verify pallet count, SKU batch numbers, and total weight against theWMS dispatch order and signed Bill of Lading (BOL).",
        isCritical: true,
      },
      {
        stepOrder: 2,
        title: "Inspect Load Securement & Weight Distribution",
        instruction:
          "Confirm pallets are shrink-wrapped to the pallet base, heavy freight is loaded low and forward, and load bars or straps prevent shifting.",
        isCritical: true,
      },
      {
        stepOrder: 3,
        title: "Verify Hazmat Placards & Special Handling Labels",
        instruction:
          "Ensure dangerous goods declarations match interior cargo and required DOT/ADR placards are affixed on all four sides of the vehicle.",
        isCritical: true,
      },
      {
        stepOrder: 4,
        title: "Apply & Photograph ISO 17712 High-Security Seal",
        instruction:
          "Lock the trailer doors, thread a numbered bolt or cable seal through the primary hasp, tug to confirm engagement, and record the seal number on the BOL.",
        isCritical: true,
      },
    ],
    checklistItems: [
      { label: "Pallet count and SKU labels match dispatch manifest 100%", required: true },
      { label: "Pallets stretch-wrapped tightly with corner boards where required", required: true },
      { label: "Load bars, dunnage airbags, or ratchet straps secured", required: true },
      { label: "Trailer floor clean, dry, and free of holes or pest evidence", required: false },
      { label: "Driver ID and vehicle registration verified against dispatch booking", required: true },
      { label: "ISO 17712 tamper-evident seal applied and tug-tested", required: true },
      { label: "Seal serial number recorded on BOL and photographed", required: true },
      { label: "Hazmat placards and SDS pouch included if carrying regulated goods", required: false },
    ],
    faqs: [
      {
        question: "Why should the outbound seal number be photographed after the tug test?",
        answer:
          "A timestamped photo of the locked, tug-tested seal provides indisputable chain-of-custody proof for C-TPAT and ISO 28000 audits in case of transit tampering claims.",
      },
      {
        question: "What does a tug test on a container bolt seal verify?",
        answer:
          "Pulling firmly on the bolt seal after snapping it into the barrel confirms the internal locking ring engaged properly and the seal was not pre-compromised.",
      },
    ],
  },
  {
    slug: "warehouse-fire-exit-aisle-clearance-audit",
    title: "Warehouse Fire Exit & Aisle Clearance Audit",
    industry: "Logistics & Warehousing",
    complianceStandards: ["OSHA 1910.37", "NFPA 101", "NFPA 13"],
    frequency: "weekly",
    shortDescription:
      "Weekly life-safety walkthrough verifying unobstructed emergency exits, sprinkler head clearance, fire extinguisher access, and pedestrian walkways.",
    seoTitle: "Warehouse Fire Exit & Aisle Clearance Audit",
    seoDescription:
      "Keep warehouses OSHA 1910.37 and NFPA 101 compliant. Audit emergency exit doors, 18-inch sprinkler clearance, and pedestrian aisles weekly.",
    sopSteps: [
      {
        stepOrder: 1,
        title: "Test All Emergency Exit Doors & Panic Bars",
        instruction:
          "Walk every perimeter exit to confirm push-bars open effortlessly without keys or padlocks, and verify exterior landing paths are clear of snow or pallets.",
        isCritical: true,
      },
      {
        stepOrder: 2,
        title: "Check Exit Signs & Emergency Lighting",
        instruction:
          "Verify illuminated EXIT signs are lit on normal power and press test buttons on emergency floodlights to confirm battery backup operation.",
        isCritical: true,
      },
      {
        stepOrder: 3,
        title: "Verify 18-Inch Sprinkler Deflector Clearance",
        instruction:
          "Inspect top-tier pallet storage across all racking bays to ensure stock never encroaches within 18 inches (45 cm) of ceiling fire sprinkler heads.",
        isCritical: true,
      },
      {
        stepOrder: 4,
        title: "Audit Aisle Widths & Extinguisher Access",
        instruction:
          "Confirm staging pallets do not block yellow pedestrian walkways, fire hose reels, electrical panels (36-inch clearance), or wall-mounted extinguishers.",
        isCritical: true,
      },
    ],
    checklistItems: [
      { label: "All fire exit doors unlocked from inside and panic hardware functional", required: true },
      { label: "Exterior exit discharge paths clear of pallets, dumpsters, or vehicles", required: true },
      { label: "Illuminated EXIT signs and emergency backup lights operational", required: true },
      { label: "Minimum 18-inch clearance maintained below all fire sprinkler heads", required: true },
      { label: "Fire extinguishers and hose reels unobstructed and clearly signed", required: true },
      { label: "Electrical switchgear panels maintain 36-inch front clearance", required: true },
      { label: "Pedestrian walkways and forklift crossing markings clearly visible", required: false },
      { label: "Fire doors self-close completely and are never wedged open", required: true },
    ],
    faqs: [
      {
        question: "Why is the 18-inch sprinkler clearance rule strictly enforced?",
        answer:
          "NFPA 13 requires at least 18 inches below sprinkler deflectors so water spray patterns can develop fully; stacked pallets above that line block water from reaching the fire.",
      },
      {
        question: "Can warehouse fire exits be locked after hours to prevent theft?",
        answer:
          "Never with key-locks or chains while anyone is inside. Only listed panic hardware or delayed-egress locks tied to the fire alarm system are permitted under NFPA 101.",
      },
    ],
  },
  {
    slug: "forklift-battery-charging-bay-safety-check",
    title: "Forklift Battery Charging Bay Safety Check",
    industry: "Logistics & Warehousing",
    complianceStandards: ["OSHA 1910.178(g)", "NFPA 505", "OSHA 1910.151"],
    frequency: "daily",
    shortDescription:
      "Daily safety inspection for lead-acid and lithium-ion MHE charging stations, eyewash stations, ventilation fans, and charger cables.",
    seoTitle: "Forklift Battery Charging Bay Safety Checklist",
    seoDescription:
      "Daily OSHA 1910.178(g) forklift battery charging station checklist. Inspect eyewash stations, hydrogen ventilation, and charger leads.",
    sopSteps: [
      {
        stepOrder: 1,
        title: "Verify Ventilation & No-Smoking Controls",
        instruction:
          "Confirm exhaust fans are running to disperse hydrogen gas during lead-acid charging and verify no-smoking/no-open-flame signs are posted.",
        isCritical: true,
      },
      {
        stepOrder: 2,
        title: "Test Emergency Eyewash & Deluge Shower",
        instruction:
          "Check that the eyewash station is unobstructed within 10 seconds' walk, flush briefly to verify clean tepid water flow, and confirm acid spill kit is stocked.",
        isCritical: true,
      },
      {
        stepOrder: 3,
        title: "Inspect Charger Cables, Plugs & Hoists",
        instruction:
          "Examine Anderson connectors and DC cables for melted insulation, exposed copper, or cracked housings, and inspect battery-lifting hoists and hooks.",
        isCritical: true,
      },
      {
        stepOrder: 4,
        title: "Check PPE Availability & Spill Containment",
        instruction:
          "Confirm acid-resistant aprons, face shields, and insulated gloves are stocked at the bay, and check drip trays under charging racks.",
        isCritical: false,
      },
    ],
    checklistItems: [
      { label: "Exhaust ventilation fan running and airflow unobstructed", required: true },
      { label: "Emergency eyewash/shower unobstructed and flushed cleanly", required: true },
      { label: "Acid neutralization spill kit stocked and sealed", required: true },
      { label: "Charger cables and Anderson plugs free of burns or exposed wires", required: true },
      { label: "PPE (face shield, acid apron, rubber gloves) available at station", required: true },
      { label: "Battery watering system and insulated tools in good condition", required: false },
      { label: "Class ABC / CO2 fire extinguisher mounted within 25 feet", required: true },
      { label: "No-smoking and arc-flash warning signage clearly posted", required: false },
    ],
    faqs: [
      {
        question: "Why must eyewash stations be within 10 seconds of a battery charging bay?",
        answer:
          "OSHA 1910.151(c) and 1910.178(g) require immediate flushing facilities where sulfuric acid electrolyte splashes can cause permanent eye damage within seconds.",
      },
      {
        question: "Should forklift battery hoods remain open while charging?",
        answer:
          "Yes, for flooded lead-acid batteries, opening the hood dissipates heat and prevents explosive hydrogen gas from accumulating inside the battery compartment.",
      },
    ],
  },
  {
    slug: "fleet-tyre-brake-lights-pre-trip-check",
    title: "Fleet Tyre, Brake & Lights Pre-Trip Check",
    industry: "Logistics & Warehousing",
    complianceStandards: ["FMCSA 49 CFR 396.13", "DOT", "ISO 39001"],
    frequency: "daily",
    shortDescription:
      "Fast daily pre-trip safety inspection for delivery vans, box trucks, and tractor-trailers focusing on tyres, air brakes, lighting, and cargo doors.",
    seoTitle: "Fleet Tyre, Brake & Lights Pre-Trip Checklist",
    seoDescription:
      "Daily commercial fleet pre-trip checklist for tyres, air brakes, lights, and mirrors. Stay DOT compliant and reduce roadside breakdowns.",
    sopSteps: [
      {
        stepOrder: 1,
        title: "Check Steer & Drive Tyre Tread and Pressure",
        instruction:
          "Inspect steer tyres (min 4/32 in tread) and drive/trailer tyres (min 2/32 in), check for sidewall bulges, and verify lug nuts show no rust trails.",
        isCritical: true,
      },
      {
        stepOrder: 2,
        title: "Test Air Brake Pressure & Glad-Hand Seals",
        instruction:
          "Build air pressure to governor cutout (120–135 PSI), perform a 1-minute static leak test (max 2–3 PSI drop), and test low-air warning buzzer.",
        isCritical: true,
      },
      {
        stepOrder: 3,
        title: "Verify Exterior Lights, Signals & Reflectors",
        instruction:
          "Walk around the vehicle with hazards and headlights on to confirm brake lights, turn signals, clearance markers, and DOT reflective tape are intact.",
        isCritical: true,
      },
      {
        stepOrder: 4,
        title: "Inspect Mirrors, Wipers & Cargo Door Latches",
        instruction:
          "Clean side and convex mirrors, test windshield wipers/washer fluid, and verify rear roll-up or swing door latches and mudflaps are secure.",
        isCritical: false,
      },
    ],
    checklistItems: [
      { label: "Steer tyre tread >= 4/32 in and drive/trailer >= 2/32 in", required: true },
      { label: "All tyres properly inflated with no sidewall cuts or bulges", required: true },
      { label: "Wheel lug nuts tight with no rust streaks or cracked rims", required: true },
      { label: "Air brake system holds pressure with no audible air leaks", required: true },
      { label: "Headlights, brake lights, turn signals, and clearance lights working", required: true },
      { label: "Mirrors clean, intact, and properly adjusted", required: true },
      { label: "Windshield wipers, defroster, and horn operational", required: true },
      { label: "Emergency triangles, spare fuses, and fire extinguisher onboard", required: false },
    ],
    faqs: [
      {
        question: "What is the minimum legal tread depth for commercial steer tyres?",
        answer:
          "Under US DOT / FMCSA 49 CFR 393.75, front steer tyres require at least 4/32 inch of tread depth, while all other tyres require at least 2/32 inch.",
      },
      {
        question: "How much air pressure loss is allowed during a static brake test?",
        answer:
          "For a single vehicle, air loss should not exceed 2 PSI in one minute (3 PSI for combination tractor-trailers) with the engine off and service brakes released.",
      },
    ],
  },
  {
    slug: "yard-truck-marshalling-safety-audit",
    title: "Yard & Truck Marshalling Safety Audit",
    industry: "Logistics & Warehousing",
    complianceStandards: ["OSHA 1910.176", "HSE HSG136", "ISO 45001"],
    frequency: "weekly",
    shortDescription:
      "Weekly safety audit of truck yards, spotter traffic lanes, high-visibility PPE compliance, and trailer kingpin/landing gear parking areas.",
    seoTitle: "Warehouse Yard & Truck Marshalling Safety Audit",
    seoDescription:
      "Reduce yard struck-by accidents with this weekly truck marshalling and yard safety audit checklist. Check spotter PPE, lighting, and signage.",
    sopSteps: [
      {
        stepOrder: 1,
        title: "Audit High-Visibility PPE & Pedestrian Segregation",
        instruction:
          "Verify all yard spotters, drivers, and contractors wear Class 2/3 hi-vis vests and stay within marked pedestrian walkways separated by barriers.",
        isCritical: true,
      },
      {
        stepOrder: 2,
        title: "Inspect Yard Lighting, Mirrors & Speed Signage",
        instruction:
          "Check floodlights at dock aprons and blind corners, inspect convex traffic mirrors, and confirm 10 mph / 15 km/h yard speed signs are visible.",
        isCritical: false,
      },
      {
        stepOrder: 3,
        title: "Verify Trailer Landing Gear & Dolly Pads",
        instruction:
          "Inspect dropped trailers to confirm landing gear rests squarely on reinforced concrete dolly pads with glad-hand locks or wheel chocks fitted.",
        isCritical: true,
      },
      {
        stepOrder: 4,
        title: "Check Yard Surface, Drainage & Gate Security",
        instruction:
          "Note potholes, standing water, or oil slicks in turning aprons, and test entry gate intercoms, barrier arms, and driver check-in signage.",
        isCritical: false,
      },
    ],
    checklistItems: [
      { label: "All yard personnel and visiting drivers wearing Class 2/3 hi-vis PPE", required: true },
      { label: "Pedestrian walkways clearly striped and physically protected", required: true },
      { label: "Dropped trailers resting on concrete dolly pads with wheels chocked", required: true },
      { label: "Yard spotter trucks equipped with working beacons and backup alarms", required: true },
      { label: "Blind-corner convex mirrors clean and angled properly", required: false },
      { label: "Yard floodlights and dock apron lighting fully operational", required: true },
      { label: "Yard speed limit (10 mph / 15 km/h) and one-way signage legible", required: false },
      { label: "Yard pavement free of deep potholes, debris, or fuel spills", required: false },
    ],
    faqs: [
      {
        question: "Why are concrete dolly pads necessary in a trailer yard?",
        answer:
          "Loaded trailer landing gear exerts extreme point loads; on hot asphalt, legs can sink and cause a dropped trailer to tip sideways, creating a severe crush hazard.",
      },
      {
        question: "What is the safest rule for truck reversing in a busy yard?",
        answer:
          "Drivers should use a trained banksman/spotter positioned in clear view of the driver's side mirror (never directly behind the trailer) and maintain continuous visual or radio contact.",
      },
    ],
  },
];
