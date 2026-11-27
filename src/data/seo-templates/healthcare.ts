import type { SeoTemplate } from "./types";

export const HEALTHCARE_TEMPLATES: SeoTemplate[] = [
  {
    slug: "autoclave-steam-sterilization-cycle-log",
    title: "Autoclave & Steam Sterilization Cycle Log",
    industry: "Healthcare",
    complianceStandards: ["NABH", "CDC", "AAMI ST79", "WHO"],
    frequency: "daily",
    shortDescription:
      "Standardize daily steam sterilizer Bowie-Dick air-removal tests, biological indicator spore monitoring, and cycle parameter verification in CSSD and clinics.",
    seoTitle: "Autoclave & Steam Sterilization Log Template | QR SOP",
    seoDescription:
      "Free digital autoclave sterilization cycle log & Bowie-Dick checklist for CSSD teams. Track 134°C pressure, biological indicators, and NABH/CDC compliance.",
    sopSteps: [
      {
        stepOrder: 1,
        title: "Inspect Chamber, Door Gasket & Drain Strainer",
        instruction:
          "Before the first cycle, clean the chamber drain strainer of lint or debris, wipe the silicone door gasket, and verify the steam generator water level.",
        isCritical: true,
      },
      {
        stepOrder: 2,
        title: "Run Daily Bowie-Dick Air Removal Test",
        instruction:
          "Place a Bowie-Dick test pack horizontally on the bottom rack over the drain in an empty pre-vacuum sterilizer and run the 134°C / 3.5-minute test cycle.",
        isCritical: true,
      },
      {
        stepOrder: 3,
        title: "Load Packs with Proper Steam Penetration Spacing",
        instruction:
          "Place wrapped surgical trays on edge without touching chamber walls or stacking flat, ensuring chemical indicator strips are visible inside and outside each pack.",
        isCritical: false,
      },
      {
        stepOrder: 4,
        title: "Verify Cycle Printout & Biological Indicator",
        instruction:
          "Review the physical printout for minimum 134°C (or 121°C gravity) hold time and pressure, then incubate the Geobacillus stearothermophilus biological indicator.",
        isCritical: true,
      },
      {
        stepOrder: 5,
        title: "Cool, Inspect Pack Dryness & Release Load",
        instruction:
          "Allow packs to cool to room temperature on wire racks; reject any wet or torn packs for immediate re-sterilization before signing the load release log.",
        isCritical: false,
      },
    ],
    checklistItems: [
      { label: "Chamber drain strainer cleared of debris", required: true },
      { label: "Door gasket inspected for cracks or steam leaks", required: true },
      { label: "Daily Bowie-Dick test passed with uniform color change", required: true },
      { label: "Biological indicator (spore vial) placed in challenged load", required: true },
      { label: "Packs loaded on edge with 2.5 cm clearance from walls", required: false },
      { label: "Cycle printout confirms target temp (134°C / 121°C) and hold time", required: true },
      { label: "External Class 1 chemical indicator tape changed color", required: true },
      { label: "Sterilized packs completely dry with intact barrier wrap", required: true },
      { label: "Load number, operator ID, and expiry date stamped on packs", required: false },
    ],
    faqs: [
      {
        question: "How often must a Bowie-Dick test be performed on a pre-vacuum autoclave?",
        answer:
          "Per AAMI ST79 and NABH guidelines, a Bowie-Dick test must be run every day the pre-vacuum steam sterilizer is used, prior to processing the first patient load.",
      },
      {
        question: "What should we do if a sterilized surgical pack comes out wet?",
        answer:
          "A wet pack compromises the sterile barrier through wicking and must be treated as contaminated. Do not release it; re-wrap and re-sterilize the entire pack.",
      },
      {
        question: "Which biological indicator organism is used for steam sterilization?",
        answer:
          "Geobacillus stearothermophilus spores are the standard biological indicator for steam autoclaves because of their high resistance to moist heat.",
      },
    ],
  },
  {
    slug: "vaccine-cold-chain-fridge-temperature-log",
    title: "Vaccine & Cold-Chain Fridge Temperature Log",
    industry: "Healthcare",
    complianceStandards: ["CDC", "WHO", "NABH", "VFC"],
    frequency: "daily",
    shortDescription:
      "Monitor twice-daily minimum/maximum vaccine refrigerator temperatures between 2°C and 8°C and document immediate cold-chain excursion actions.",
    seoTitle: "Vaccine Cold-Chain Fridge Temp Log Template | QR Checklist",
    seoDescription:
      "Track twice-daily 2°C–8°C vaccine refrigerator min/max readings with a QR-based cold-chain log. Meets CDC, WHO, and NABH immunization storage standards.",
    sopSteps: [
      {
        stepOrder: 1,
        title: "Read Digital Data Logger Before Opening Door",
        instruction:
          "Check the external calibrated digital data logger (DDL) display for current, minimum, and maximum temperatures without opening the refrigerator door.",
        isCritical: true,
      },
      {
        stepOrder: 2,
        title: "Verify 2°C to 8°C Range & Reset Min/Max",
        instruction:
          "Confirm both current and min/max values remained strictly within 2°C–8°C (36°F–46°F), record the exact figures, and reset the min/max memory.",
        isCritical: true,
      },
      {
        stepOrder: 3,
        title: "Inspect Door Seal, Power Plug & Vaccine Placement",
        instruction:
          "Verify the door gasket seals tightly, the 'Do Not Unplug' warning label is intact on the outlet, and no vials are touching the evaporator plate.",
        isCritical: false,
      },
      {
        stepOrder: 4,
        title: "Quarantine & Escalate Any Temperature Excursion",
        instruction:
          "If temperature reads below 2°C or above 8°C, label affected vaccines 'DO NOT USE', move them to a backup qualified unit, and contact the manufacturer.",
        isCritical: true,
      },
    ],
    checklistItems: [
      { label: "Current refrigerator temperature between 2.0°C and 8.0°C", required: true },
      { label: "24-hour minimum temperature ≥ 2.0°C (no freeze exposure)", required: true },
      { label: "24-hour maximum temperature ≤ 8.0°C", required: true },
      { label: "Min/Max memory reset after recording morning/evening reading", required: true },
      { label: "Digital Data Logger (DDL) NIST calibration certificate valid", required: true },
      { label: "Vaccines stored in central baskets away from door and back wall", required: false },
      { label: "Water bottles / ice packs positioned to stabilize thermal mass", required: false },
      { label: "Door gasket clean and closing flush without gaps", required: true },
      { label: "Power outlet secured with 'Do Not Unplug' lock/tag", required: true },
    ],
    faqs: [
      {
        question: "Why must min/max temperatures be recorded twice daily?",
        answer:
          "CDC and WHO guidelines require twice-daily checks (start and end of clinic hours) so any overnight power failure or compressor drift is caught before compromised vaccines are administered.",
      },
      {
        question: "What is the biggest risk of storing vaccines on the refrigerator door shelves?",
        answer:
          "Door shelves experience frequent warm air exposure when opened and can exceed 8°C. Vaccines must always be kept in labeled baskets on central shelves.",
      },
    ],
  },
  {
    slug: "ambulance-readiness-emergency-kit-check",
    title: "Ambulance Readiness & Emergency Kit Check",
    industry: "Healthcare",
    complianceStandards: ["NABH", "OSHA", "AIS-125", "AHA"],
    frequency: "daily",
    shortDescription:
      "Verify ALS/BLS ambulance medical equipment, emergency drugs, oxygen pressure, and vehicle safety systems at every shift handover.",
    seoTitle: "Ambulance Readiness & Emergency Kit Checklist | QR Log",
    seoDescription:
      "Shift-handover ambulance readiness checklist covering oxygen cylinders, suction, AED, emergency drug expiry, and stretcher locks for EMS teams.",
    sopSteps: [
      {
        stepOrder: 1,
        title: "Check Vehicle Power, Sirens & Stretcher Locks",
        instruction:
          "Start the ambulance engine, test emergency beacons, siren, and cabin inverter power, and verify the main wheeled stretcher locks securely into the floor antler.",
        isCritical: true,
      },
      {
        stepOrder: 2,
        title: "Verify Main & Portable Oxygen Cylinder Pressure",
        instruction:
          "Open main D/M-type oxygen valves briefly to confirm pressure is ≥1000 psi (or >50% capacity), check regulators for leaks, and verify adult/pediatric masks.",
        isCritical: true,
      },
      {
        stepOrder: 3,
        title: "Test Suction Unit, Monitor/AED & Glucometer",
        instruction:
          "Power on the portable suction unit to confirm ≥300 mmHg vacuum, verify defibrillator battery charge and pad expiry, and run a glucometer strip check.",
        isCritical: true,
      },
      {
        stepOrder: 4,
        title: "Audit Emergency Drug Box & Trauma Bag Seals",
        instruction:
          "Confirm tamper-evident seals on the ALS drug box and airway kit; if broken, restock against the par list and check all medications for 30-day expiry.",
        isCritical: true,
      },
    ],
    checklistItems: [
      { label: "Fuel tank ≥ 3/4 full and emergency lights/siren operational", required: true },
      { label: "Main and portable oxygen cylinders ≥ 1000 psi with regulators", required: true },
      { label: "Portable suction unit achieves ≥ 300 mmHg with sterile tubing", required: true },
      { label: "Defibrillator/AED battery charged and adult/pediatric pads unexpired", required: true },
      { label: "Bag-Valve-Mask (Ambu bag) adult & pediatric sizes present", required: true },
      { label: "ALS emergency drug box seal intact or restocked with valid expiry", required: true },
      { label: "Stretcher straps, side rails, and floor locking mechanism secure", required: true },
      { label: "Cervical collars, splints, and spine board straps complete", required: false },
      { label: "Sharps container < 3/4 full and biohazard bags stocked", required: false },
      { label: "Cabin interior wiped down with hospital-grade disinfectant", required: false },
    ],
    faqs: [
      {
        question: "How often should ambulance emergency kits be inspected?",
        answer:
          "Ambulances should undergo a full readiness check at the start of every shift (daily or every 12 hours) and immediately after every patient transport.",
      },
      {
        question: "What minimum oxygen reserve is recommended before dispatch?",
        answer:
          "Both the onboard main cylinder and portable cylinder should be at least 50% full (typically ≥1000 psi on a 2000 psi tank) to ensure uninterrupted supply during long transfers.",
      },
    ],
  },
  {
    slug: "aed-defibrillator-daily-readiness-check",
    title: "AED / Defibrillator Daily Readiness Check",
    industry: "Healthcare",
    complianceStandards: ["AHA", "NABH", "FDA 21 CFR", "Joint Commission"],
    frequency: "daily",
    shortDescription:
      "Confirm hospital crash-cart defibrillators and public-access AEDs pass self-tests, hold full battery charge, and have unexpired electrode pads.",
    seoTitle: "AED & Defibrillator Daily Readiness Checklist | QR Log",
    seoDescription:
      "Daily AED and crash-cart defibrillator readiness log. Verify green status indicator, 30J test discharge, pad expiration, and AHA/NABH compliance.",
    sopSteps: [
      {
        stepOrder: 1,
        title: "Verify Visual Status Indicator & Alarm",
        instruction:
          "Inspect the AED or crash-cart monitor status window for a flashing green 'OK' or checkmark indicator and ensure no low-battery chirp is sounding.",
        isCritical: true,
      },
      {
        stepOrder: 2,
        title: "Perform Manual Defibrillator 30-Joule User Test",
        instruction:
          "For manual hospital defibrillators, select 30 Joules, charge with paddles seated in the test well, discharge, and verify the 'Test OK' printout.",
        isCritical: true,
      },
      {
        stepOrder: 3,
        title: "Check Electrode Pad Packaging & Expiry Dates",
        instruction:
          "Verify two sets of adult multifunction pads and one pediatric set/key are sealed, undamaged, and within their printed expiration date.",
        isCritical: true,
      },
      {
        stepOrder: 4,
        title: "Confirm Ready-Kit Accessories & AC Mains",
        instruction:
          "Ensure the razor, trauma shears, nitrile gloves, pocket mask, and conductive gel are in the pouch, and AC power is plugged into a red emergency outlet.",
        isCritical: false,
      },
    ],
    checklistItems: [
      { label: "Status indicator shows green / 'Ready' with no fault icon", required: true },
      { label: "AC mains power cord plugged in and battery charge ≥ 80%", required: true },
      { label: "Manual 30J discharge self-test passed (if applicable)", required: true },
      { label: "Primary adult defibrillation pads sealed and unexpired", required: true },
      { label: "Spare adult pads and pediatric pads/attenuator key present", required: true },
      { label: "ECG cable leads (3/5-lead) intact with no frayed insulation", required: false },
      { label: "Thermal printer paper roll sufficient for rhythm strip", required: false },
      { label: "Prep kit (razor, shears, gloves, wipe) sealed in case", required: false },
    ],
    faqs: [
      {
        question: "Why do hospital crash-cart defibrillators require daily checks while public AEDs are often checked weekly or monthly?",
        answer:
          "Hospital crash carts are high-acuity life-support devices used in acute cardiac arrests; NABH and Joint Commission standards mandate daily verification of charge and pad readiness.",
      },
      {
        question: "Can expired AED pads still be used in an emergency?",
        answer:
          "Expired pads may have dried adhesive gel that causes skin burns or poor impedance reading. Always replace pads before their expiration date.",
      },
    ],
  },
  {
    slug: "icu-bed-isolation-room-sanitization",
    title: "ICU Bed & Isolation Room Sanitization",
    industry: "Healthcare",
    complianceStandards: ["CDC", "NABH", "WHO", "OSHA"],
    frequency: "daily",
    shortDescription:
      "Execute terminal and daily high-touch disinfection protocols for ICU beds, ventilators, infusion pumps, and negative-pressure isolation rooms.",
    seoTitle: "ICU Bed & Isolation Room Sanitization Checklist | QR SOP",
    seoDescription:
      "Digital ICU terminal cleaning & isolation room sanitization SOP. Track EPA-approved disinfectant contact time, high-touch surfaces, and negative pressure.",
    sopSteps: [
      {
        stepOrder: 1,
        title: "Don Appropriate PPE & Verify Isolation Signage",
        instruction:
          "Put on gown, gloves, eye protection, and N95 respirator (for airborne isolation) before entering; confirm negative-pressure gauge reads at least -2.5 Pa.",
        isCritical: true,
      },
      {
        stepOrder: 2,
        title: "Strip Linen & Clear Biohazard Waste",
        instruction:
          "Roll soiled linens inward without shaking into leak-proof hampers and seal infectious waste bags at the 3/4 mark before surface cleaning.",
        isCritical: false,
      },
      {
        stepOrder: 3,
        title: "Disinfect High-Touch Medical Equipment Top-to-Bottom",
        instruction:
          "Wipe ventilator screens, infusion pump keypads, bed rails, call buttons, and IV poles using hospital-grade sporicidal/virucidal wipes, respecting wet contact time.",
        isCritical: true,
      },
      {
        stepOrder: 4,
        title: "Sanitize Bed Mattress, Privacy Curtains & Floors",
        instruction:
          "Inspect mattress seams for fluid tears, change soiled privacy curtains, and mop floors from cleanest zone toward the doorway using a fresh two-bucket solution.",
        isCritical: true,
      },
    ],
    checklistItems: [
      { label: "Correct PPE worn by environmental services staff", required: true },
      { label: "Isolation room negative pressure gauge verified (≤ -2.5 Pa)", required: true },
      { label: "Bed rails, head/footboards, and call bell disinfected", required: true },
      { label: "Ventilator, patient monitor, and infusion pumps wiped with approved wipes", required: true },
      { label: "Disinfectant wet contact time (3–5 min) maintained on all surfaces", required: true },
      { label: "Mattress cover inspected for cracks, punctures, or staining", required: true },
      { label: "Doorknobs, light switches, and sink faucets sanitized", required: false },
      { label: "Fresh microfiber cloths and two-bucket mop used per room", required: false },
      { label: "Room tagged 'Sanitized & Ready' with timestamp", required: true },
    ],
    faqs: [
      {
        question: "What disinfectant should be used for C. difficile isolation rooms?",
        answer:
          "Standard quaternary ammonium wipes do not kill C. difficile spores. Use an EPA-registered sporicidal disinfectant such as sodium hypochlorite (bleach) or hydrogen peroxide-peracetic acid.",
      },
      {
        question: "Why is wet contact time critical during ICU cleaning?",
        answer:
          "Disinfectants require 1 to 10 minutes of visible wetness (depending on the product) to achieve log-reduction of pathogens like MRSA, VRE, and Acinetobacter.",
      },
    ],
  },
  {
    slug: "biohazard-biomedical-waste-segregation-audit",
    title: "Biohazard & Biomedical Waste Segregation Audit",
    industry: "Healthcare",
    complianceStandards: ["BMW Rules 2016", "OSHA", "WHO", "NABH"],
    frequency: "daily",
    shortDescription:
      "Audit point-of-generation color-coded biomedical waste segregation, sharps container fill limits, and barcoded handover to authorized treatment facilities.",
    seoTitle: "Biomedical Waste Segregation Audit Checklist | QR Log",
    seoDescription:
      "Daily biohazard & biomedical waste segregation checklist. Audit yellow/red/white/blue bins, 3/4 sharps fill limits, and barcoded manifest handover.",
    sopSteps: [
      {
        stepOrder: 1,
        title: "Inspect Color-Coded Bins & Liner Integrity",
        instruction:
          "Verify Yellow (infectious/anatomical), Red (contaminated recyclable plastics), White (puncture-proof sharps), and Blue (glassware) bins have matching non-chlorinated liners.",
        isCritical: true,
      },
      {
        stepOrder: 2,
        title: "Check 3/4 Fill Limit & Sharps Safety",
        instruction:
          "Ensure no waste bin or sharps container exceeds the 3/4 (75%) fill line, and verify needles are never recapped or bent before disposal.",
        isCritical: true,
      },
      {
        stepOrder: 3,
        title: "Seal, Label & Barcode Waste Bags at Point of Origin",
        instruction:
          "Tie bags securely using gooseneck knots, affix the ward barcode/QR label with date and weight, and transport in covered leak-proof trolleys.",
        isCritical: true,
      },
      {
        stepOrder: 4,
        title: "Log Central Storage Handover & Spill Kit Readiness",
        instruction:
          "Record total bag count and weight in the CBMWTF handover manifest and confirm the biohazard spill kit is complete in the storage area.",
        isCritical: false,
      },
    ],
    checklistItems: [
      { label: "Color-coded posters clearly displayed above all waste stations", required: false },
      { label: "Yellow bags contain only infectious/soiled/anatomical waste", required: true },
      { label: "Red bags contain only contaminated recyclable plastics (IV sets, syringes)", required: true },
      { label: "White puncture-proof sharps containers < 3/4 full and locked", required: true },
      { label: "Blue puncture-proof boxes used exclusively for broken/unbroken glassware", required: true },
      { label: "No general municipal waste mixed into biomedical bins", required: true },
      { label: "All filled bags barcoded/labeled with ward, date, and weight", required: true },
      { label: "Central waste room locked, ventilated, and spill kit stocked", required: false },
    ],
    faqs: [
      {
        question: "Why should biomedical waste bags be sealed at 3/4 capacity?",
        answer:
          "Overfilled bags can burst during transport or expose staff to protruding sharps and splashes. Stopping at 3/4 capacity allows safe gooseneck sealing.",
      },
      {
        question: "How long can biomedical waste be stored on-site before pickup?",
        answer:
          "Under BMW Rules and WHO guidance, untreated biomedical waste should not be stored on-site for more than 48 hours.",
      },
    ],
  },
  {
    slug: "medical-oxygen-cylinder-manifold-check",
    title: "Medical Oxygen Cylinder & Manifold Check",
    industry: "Healthcare",
    complianceStandards: ["NFPA 99", "NABH", "HTM 02-01", "OSHA"],
    frequency: "daily",
    shortDescription:
      "Inspect medical gas manifold line pressures, automatic bank changeover, reserve cylinder levels, and leak-free connections across hospital wards.",
    seoTitle: "Medical Oxygen Cylinder & Manifold Checklist | QR Log",
    seoDescription:
      "Daily medical oxygen manifold and cylinder safety log. Monitor 50–55 psi line pressure, auto-changeover alarms, and reserve bank readiness per NFPA 99.",
    sopSteps: [
      {
        stepOrder: 1,
        title: "Read Primary & Secondary Manifold Bank Pressures",
        instruction:
          "Record the high-pressure gauge readings for both Duty (In-Use) and Standby cylinder banks, plus the regulated pipeline delivery pressure (target 50–55 psi / 3.5–4.0 bar).",
        isCritical: true,
      },
      {
        stepOrder: 2,
        title: "Verify Automatic Changeover & Master Alarm Panel",
        instruction:
          "Confirm the manifold changeover indicator matches the active bank and check the master alarm panel for any low-pressure, reserve-in-use, or line fault alerts.",
        isCritical: true,
      },
      {
        stepOrder: 3,
        title: "Inspect Cylinders, Chains & Oil-Free Fittings",
        instruction:
          "Ensure all D, B, and Jumbo-D cylinders are chained upright in 'Full' or 'Empty' segregated racks, with valve caps on and zero oil or grease near fittings.",
        isCritical: true,
      },
      {
        stepOrder: 4,
        title: "Check Bedside Flowmeters & Humidifier Bottles",
        instruction:
          "Spot-check ICU/ward oxygen wall outlets for audible leaks and verify sterile distilled water levels in reusable or pre-filled humidifiers.",
        isCritical: false,
      },
    ],
    checklistItems: [
      { label: "Pipeline delivery pressure within 50–55 psi (3.5–4.0 bar)", required: true },
      { label: "Duty bank cylinder pressure adequate for shift demand", required: true },
      { label: "Standby bank cylinders full (≥ 1800 psi) and valves open", required: true },
      { label: "Master medical gas alarm panel shows normal green status", required: true },
      { label: "No hissing leaks detected at pigtails, regulators, or headers", required: true },
      { label: "All spare cylinders chained upright with 'Full' / 'Empty' tags", required: true },
      { label: "Manifold room free of oil, grease, and combustible materials", required: true },
      { label: "Emergency 'No Smoking / Oxygen in Use' signage visible", required: false },
    ],
    faqs: [
      {
        question: "Why is oil or grease strictly prohibited near medical oxygen cylinders?",
        answer:
          "Pure oxygen under high pressure reacts violently with hydrocarbons like oil or grease, which can cause spontaneous combustion or explosion.",
      },
      {
        question: "What is the standard hospital pipeline pressure for medical oxygen?",
        answer:
          "Per NFPA 99 and HTM 02-01, medical oxygen wall outlets are regulated between 50 and 55 psi (approximately 3.5 to 4.0 bar).",
      },
    ],
  },
  {
    slug: "dental-chair-suction-line-hygiene-sop",
    title: "Dental Chair & Suction Line Hygiene SOP",
    industry: "Healthcare",
    complianceStandards: ["CDC", "ADA", "OSHA", "NABH"],
    frequency: "daily",
    shortDescription:
      "Maintain dental unit waterline (DUWL) flushing, high-volume evacuator suction disinfection, and handpiece sterilization between patients and end-of-day.",
    seoTitle: "Dental Chair & Suction Line Hygiene SOP Checklist | QR",
    seoDescription:
      "Daily dental operatory hygiene SOP covering 20-second waterline flushing, enzymatic suction line cleaning, barrier wraps, and handpiece autoclaving.",
    sopSteps: [
      {
        stepOrder: 1,
        title: "Flush Dental Unit Waterlines (DUWL)",
        instruction:
          "Flush all air/water syringes, ultrasonic scalers, and handpiece waterlines for 2 minutes at the start of the day and 20–30 seconds after every patient.",
        isCritical: true,
      },
      {
        stepOrder: 2,
        title: "Remove & Autoclave All Detachable Handpieces",
        instruction:
          "Detach high-speed, low-speed, and scaler handpieces after each patient, lubricate per manufacturer IFU, pouch, and autoclave—never surface-wipe only.",
        isCritical: true,
      },
      {
        stepOrder: 3,
        title: "Flush High-Volume Evacuator (HVE) & Saliva Ejector",
        instruction:
          "Aspirate an approved non-foaming enzymatic cleaner through HVE and saliva ejector lines at the end of the clinical day and clean the solids trap.",
        isCritical: true,
      },
      {
        stepOrder: 4,
        title: "Replace Surface Barriers & Disinfect Chair",
        instruction:
          "Discard single-use plastic barriers on light handles, X-ray cones, and headrest; wipe chair upholstery and bracket table with intermediate-level disinfectant.",
        isCritical: false,
      },
    ],
    checklistItems: [
      { label: "Waterlines flushed 2 minutes prior to first patient", required: true },
      { label: "Independent water reservoir filled with treated/distilled water", required: true },
      { label: "All handpieces heat-sterilized in autoclave between patients", required: true },
      { label: "HVE and saliva ejector lines flushed with enzymatic cleaner", required: true },
      { label: "Vacuum solids trap inspected and emptied using PPE", required: false },
      { label: "Dental chair, light handle, and curing light barrier-protected", required: true },
      { label: "Operatory surfaces wiped with tuberculocidal disinfectant", required: true },
      { label: "Sharps container on bracket/wall below 3/4 fill line", required: false },
    ],
    faqs: [
      {
        question: "What is the CDC limit for heterotrophic bacteria in dental unit waterlines?",
        answer:
          "CDC guidelines specify that dental unit water used for non-surgical procedures must meet EPA drinking water standards of ≤500 CFU/mL.",
      },
      {
        question: "Why should bleach not be used daily in dental suction lines?",
        answer:
          "Sodium hypochlorite corrodes metal valves and amalgam separators in dental vacuum systems; always use a manufacturer-approved non-foaming enzymatic cleaner.",
      },
    ],
  },
  {
    slug: "clinical-lab-centrifuge-safety-calibration",
    title: "Clinical Lab Centrifuge Safety & Calibration",
    industry: "Healthcare",
    complianceStandards: ["CAP", "CLIA", "ISO 15189", "OSHA"],
    frequency: "weekly",
    shortDescription:
      "Inspect clinical laboratory centrifuges for rotor balance, lid-interlock integrity, aerosol-containment seals, and RPM tachometer verification.",
    seoTitle: "Clinical Lab Centrifuge Safety & Calibration Log | QR",
    seoDescription:
      "Weekly clinical lab centrifuge safety and calibration checklist. Verify rotor cracks, lid interlocks, biosafety cups, and RPM accuracy for ISO 15189/CAP.",
    sopSteps: [
      {
        stepOrder: 1,
        title: "Inspect Rotor, Buckets & Aerosol Seals",
        instruction:
          "Remove the rotor and buckets; check for hairline cracks, corrosion, or dried specimen spills, and verify O-rings on aerosol-tight safety cups.",
        isCritical: true,
      },
      {
        stepOrder: 2,
        title: "Verify Lid Interlock & Imbalance Sensor",
        instruction:
          "Confirm the centrifuge cannot start with the lid unlatched and remains locked until the rotor comes to a complete standstill.",
        isCritical: true,
      },
      {
        stepOrder: 3,
        title: "Verify RPM / RCF Speed & Timer Accuracy",
        instruction:
          "Check RPM using an optical tachometer (or annual calibration sticker) against set speed (tolerance ±5%) and verify timer accuracy with a stopwatch.",
        isCritical: true,
      },
      {
        stepOrder: 4,
        title: "Decontaminate Chamber & Log Balance Rules",
        instruction:
          "Wipe the bowl with 70% isopropyl alcohol or non-corrosive disinfectant, dry thoroughly, and verify balance tube sets are available beside the unit.",
        isCritical: false,
      },
    ],
    checklistItems: [
      { label: "Rotor and swinging buckets free of cracks, pitting, or corrosion", required: true },
      { label: "Aerosol-containment O-rings lubricated and intact", required: true },
      { label: "Lid safety interlock prevents opening while rotor spins", required: true },
      { label: "Tachometer / RPM calibration sticker valid and within ±5%", required: true },
      { label: "Chamber bowl clean and free of broken glass or spills", required: true },
      { label: "Matched balance tubes (water-filled) placed next to centrifuge", required: false },
      { label: "Centrifuge seated level on vibration-damping bench", required: false },
      { label: "Biohazard spill protocol posted near centrifuge station", required: false },
    ],
    faqs: [
      {
        question: "How long should you wait before opening a centrifuge after a tube breaks inside?",
        answer:
          "Keep the lid closed for at least 30 minutes to allow infectious aerosols to settle before wearing PPE and using forceps to remove broken glass.",
      },
      {
        question: "Why is RCF (g-force) preferred over RPM in lab SOPs?",
        answer:
          "Relative Centrifugal Force (RCF or ×g) accounts for rotor radius, ensuring consistent sample separation across different centrifuge models.",
      },
    ],
  },
  {
    slug: "outpatient-clinic-opening-infection-control",
    title: "Outpatient Clinic Opening & Infection Control",
    industry: "Healthcare",
    complianceStandards: ["NABH", "CDC", "OSHA", "WHO"],
    frequency: "daily",
    shortDescription:
      "Standardize morning clinic opening checks across reception, exam rooms, hand hygiene stations, PPE stock, and emergency readiness before patient arrival.",
    seoTitle: "Outpatient Clinic Opening & Infection Control Checklist",
    seoDescription:
      "Daily outpatient clinic opening and infection control checklist. Verify hand hygiene dispensers, exam room sanitization, PPE stock, and emergency readiness.",
    sopSteps: [
      {
        stepOrder: 1,
        title: "Verify Hand Hygiene & PPE Stations",
        instruction:
          "Confirm wall-mounted alcohol-based hand rub (ABHR) dispensers, liquid soap, paper towels, and glove boxes (S/M/L) are stocked in every exam room.",
        isCritical: true,
      },
      {
        stepOrder: 2,
        title: "Inspect Exam Tables, Instruments & Waste Bins",
        instruction:
          "Ensure exam tables have fresh paper/linen, sterile instrument packs are intact, and biomedical waste liners are fitted in foot-operated bins.",
        isCritical: true,
      },
      {
        stepOrder: 3,
        title: "Check Diagnostic Equipment & Emergency Kit",
        instruction:
          "Power on vital-signs monitors, otoscopes, and ECG machines; confirm the clinic emergency anaphylaxis/crash kit seal is intact.",
        isCritical: true,
      },
      {
        stepOrder: 4,
        title: "Sanitize Waiting Area & Cough-Etiquette Station",
        instruction:
          "Wipe reception counters, triage kiosks, and armrests; confirm surgical masks and tissues are stocked at the patient entrance.",
        isCritical: false,
      },
    ],
    checklistItems: [
      { label: "Alcohol hand rub dispensers ≥ 25% full in all exam rooms", required: true },
      { label: "Exam tables disinfected and covered with fresh disposable paper", required: true },
      { label: "Nitrile gloves (S/M/L) and surgical masks stocked at point of care", required: true },
      { label: "Foot-operated biohazard and general waste bins lined properly", required: true },
      { label: "Emergency anaphylaxis / crash kit seal intact and unexpired", required: true },
      { label: "Vital signs monitor, BP cuffs, and thermometer probes sanitized", required: false },
      { label: "Waiting room respiratory-hygiene station (masks & tissues) stocked", required: false },
      { label: "Spill kit and eyewash bottle accessible in procedure room", required: false },
    ],
    faqs: [
      {
        question: "What are the WHO '5 Moments for Hand Hygiene' in an outpatient clinic?",
        answer:
          "Before touching a patient, before clean/aseptic procedures, after body fluid exposure risk, after touching a patient, and after touching patient surroundings.",
      },
      {
        question: "How should reusable blood pressure cuffs be cleaned between patients?",
        answer:
          "Wipe cuffs with an EPA-registered disinfectant wipe between patients, especially when used on broken skin or isolated patients, and allow full air-drying.",
      },
    ],
  },
];
