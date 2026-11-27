import type { SeoTemplate } from "./types";

export const PHARMA_LABS_TEMPLATES: SeoTemplate[] = [
  {
    slug: "cleanroom-differential-pressure-temp-log",
    title: "Cleanroom Differential Pressure & Temp Log",
    industry: "Pharma & Labs",
    complianceStandards: ["ISO 14644", "EU GMP", "FDA 21 CFR", "WHO GMP"],
    frequency: "daily",
    shortDescription:
      "Monitor ISO-classified cleanroom positive/negative differential pressures (Magnehelic gauges), temperature, and relative humidity per shift to prevent cross-contamination.",
    seoTitle: "Cleanroom Differential Pressure & Temp Log | QR GMP SOP",
    seoDescription:
      "GMP cleanroom differential pressure, temperature, and RH monitoring checklist. Verify ≥15 Pa airlock cascades and ISO 14644/EU GMP Annex 1 compliance.",
    sopSteps: [
      {
        stepOrder: 1,
        title: "Verify HVAC / AHU Status Before Gowning Entry",
        instruction:
          "Check the BMS or hallway display to confirm supply and exhaust AHUs are running normally with no active HEPA filter differential pressure alarms.",
        isCritical: true,
      },
      {
        stepOrder: 2,
        title: "Record Magnehelic Differential Pressure Readings",
        instruction:
          "Read each airlock and suite Magnehelic gauge at eye level; confirm Grade B/C/D cascades maintain ≥10–15 Pa positive pressure (or negative for potent APIs).",
        isCritical: true,
      },
      {
        stepOrder: 3,
        title: "Log Room Temperature & Relative Humidity (RH)",
        instruction:
          "Record calibrated digital thermo-hygrometer values against suite limits (typically 18–25°C and 30–60% RH) before starting aseptic or dispensing work.",
        isCritical: true,
      },
      {
        stepOrder: 4,
        title: "Check Airlock Door Interlocks & Escalate Deviations",
        instruction:
          "Verify both airlock doors cannot open simultaneously; if pressure drops below alert limit, halt operations and notify QA and Engineering immediately.",
        isCritical: true,
      },
    ],
    checklistItems: [
      { label: "Airlock differential pressure within ≥ 10–15 Pa cascade spec", required: true },
      { label: "Cleanroom temperature within validated 18°C–25°C range", required: true },
      { label: "Relative humidity within validated 30%–60% RH range", required: true },
      { label: "Magnehelic / digital pressure gauges zeroed and calibration valid", required: true },
      { label: "Airlock door interlocking system functioning properly", required: true },
      { label: "HEPA terminal filter housings free of visible damage or leaks", required: false },
      { label: "Return air grilles unobstructed by carts or drums", required: false },
      { label: "No unapproved personnel or non-cleanroom materials inside", required: false },
    ],
    faqs: [
      {
        question: "What is the minimum differential pressure required between different GMP cleanroom grades?",
        answer:
          "EU GMP Annex 1 and ISO 14644-4 recommend a minimum differential pressure of 10 to 15 Pascals (Pa) between adjacent rooms of different cleanliness grades.",
      },
      {
        question: "What happens if cleanroom differential pressure drops to zero during production?",
        answer:
          "Operations must be paused immediately, affected open product quarantined, and QA must investigate potential microbial or particulate ingress before resuming.",
      },
    ],
  },
  {
    slug: "chemical-fume-hood-airflow-sash-check",
    title: "Chemical Fume Hood Airflow & Sash Check",
    industry: "Pharma & Labs",
    complianceStandards: ["OSHA 1910.1450", "ANSI/AIHA Z9.5", "ASHRAE 110"],
    frequency: "daily",
    shortDescription:
      "Verify chemical fume hood face velocity (80–120 fpm), sash working height stop, and baffle airflow before handling volatile or toxic reagents.",
    seoTitle: "Chemical Fume Hood Airflow & Sash Checklist | QR Lab SOP",
    seoDescription:
      "Daily lab fume hood safety checklist. Verify 80–120 fpm face velocity, sash height stop, airflow alarm, and OSHA 1910.1450 chemical hygiene compliance.",
    sopSteps: [
      {
        stepOrder: 1,
        title: "Check Digital Airflow Monitor & Face Velocity",
        instruction:
          "Verify the hood airflow monitor reads green (typically 80–120 fpm or 0.4–0.6 m/s) and press the alarm test button to confirm audible/visual alerts work.",
        isCritical: true,
      },
      {
        stepOrder: 2,
        title: "Position Sash At or Below Certified Working Height",
        instruction:
          "Lower the vertical sash to the certified 18-inch (45 cm) arrow mark; never work with the sash raised above the certification sticker.",
        isCritical: true,
      },
      {
        stepOrder: 3,
        title: "Clear Front Airfoil & Rear Exhaust Baffles",
        instruction:
          "Ensure reagent bottles, wipes, and equipment are placed at least 15 cm (6 inches) behind the sash plane and do not block rear baffle slots.",
        isCritical: false,
      },
      {
        stepOrder: 4,
        title: "Inspect Sash Glass, Utilities & Chemical Storage",
        instruction:
          "Confirm tempered sash glass is crack-free, vacuum/gas valves are off when idle, and no incompatible bulk chemicals are stored permanently inside.",
        isCritical: false,
      },
    ],
    checklistItems: [
      { label: "Airflow monitor displays normal face velocity (80–120 fpm / 0.4–0.6 m/s)", required: true },
      { label: "Low-airflow audible/visual alarm functional on test", required: true },
      { label: "Sash positioned at or below certified working height arrow", required: true },
      { label: "Annual ASHRAE 110 certification sticker current", required: true },
      { label: "Apparatus positioned ≥ 15 cm behind front sash plane", required: true },
      { label: "Rear exhaust baffle slots unobstructed", required: false },
      { label: "Front airfoil sill clean and free of paper/clutter", required: false },
      { label: "Sash tracks smooth and tempered glass free of cracks", required: false },
    ],
    faqs: [
      {
        question: "What is the safe face velocity range for a standard chemical fume hood?",
        answer:
          "OSHA and ANSI/AIHA Z9.5 recommend a face velocity between 80 and 120 feet per minute (0.4 to 0.6 m/s) at the certified sash height.",
      },
      {
        question: "Why should equipment be kept 6 inches inside the fume hood?",
        answer:
          "Working too close to the front opening creates eddy currents that can pull hazardous chemical vapors out into the operator's breathing zone.",
      },
    ],
  },
  {
    slug: "analytical-balance-daily-calibration-verification",
    title: "Analytical Balance Daily Calibration Verification",
    industry: "Pharma & Labs",
    complianceStandards: ["USP <41>", "FDA 21 CFR Part 11", "ISO 17025", "EU GMP"],
    frequency: "daily",
    shortDescription:
      "Perform daily level-bubble check, internal/external weight verification with Class E2/F1 NIST weights, and sensitivity check on analytical balances.",
    seoTitle: "Analytical Balance Daily Calibration Check | QR GMP Log",
    seoDescription:
      "Daily analytical balance verification log per USP <41> and ISO 17025. Record bubble level, certified test weight accuracy, and repeatability checks.",
    sopSteps: [
      {
        stepOrder: 1,
        title: "Clean Weighing Pan & Center Spirit Level Bubble",
        instruction:
          "Brush any powder residue from the weighing pan and draft shield using a camel-hair brush, then verify the spirit level bubble sits centered inside the ring.",
        isCritical: true,
      },
      {
        stepOrder: 2,
        title: "Verify Zero & Run Internal Adjustment",
        instruction:
          "Close all draft shield doors, press Tare/Zero until the display stabilizes at 0.0000 g, and trigger internal calibration if required by SOP.",
        isCritical: false,
      },
      {
        stepOrder: 3,
        title: "Verify Accuracy with Certified Reference Weights",
        instruction:
          "Using non-magnetic forceps, place at least two calibrated Class E2/F1 weights (low and high range) on the pan center and verify readings are within USP <41> tolerance.",
        isCritical: true,
      },
      {
        stepOrder: 4,
        title: "Log Result & Tag Out-of-Tolerance Units",
        instruction:
          "Record weight values, balance ID, and pass/fail status; if out of tolerance, affix an 'Out of Service' tag immediately and notify Metrology/QA.",
        isCritical: true,
      },
    ],
    checklistItems: [
      { label: "Weighing pan and chamber clean and free of sample residue", required: true },
      { label: "Spirit level bubble centered on anti-vibration marble table", required: true },
      { label: "Zero reading stable within ±0.1 mg with draft shields closed", required: true },
      { label: "Low-range certified test weight within acceptance limit", required: true },
      { label: "High-range certified test weight within acceptance limit", required: true },
      { label: "Certified weight box calibration date valid", required: true },
      { label: "Forceps/tweezers used (no bare-hand contact with weights)", required: false },
      { label: "Annual preventive maintenance & linearity sticker current", required: false },
    ],
    faqs: [
      {
        question: "Why must reference weights never be touched with bare hands?",
        answer:
          "Skin oils and moisture add measurable microgram-to-milligram mass and corrode precision stainless steel weights, invalidating calibration.",
      },
      {
        question: "What does USP <41> require for analytical balance repeatability?",
        answer:
          "USP <41> requires that twice the standard deviation of at least 10 replicate weighings divided by the desired smallest net weight does not exceed 0.10%.",
      },
    ],
  },
  {
    slug: "emergency-eyewash-safety-shower-weekly-test",
    title: "Emergency Eye-Wash & Safety Shower Weekly Test",
    industry: "Pharma & Labs",
    complianceStandards: ["ANSI/ISEA Z358.1", "OSHA 1910.151", "ISO 45001"],
    frequency: "weekly",
    shortDescription:
      "Flush plumbed emergency eyewash stations and drench showers weekly to clear stagnant sediment, verify tepid water flow, and keep access paths clear.",
    seoTitle: "Emergency Eye-Wash & Safety Shower Weekly Test | QR Log",
    seoDescription:
      "Weekly ANSI Z358.1 emergency eyewash and safety shower inspection log. Verify 3-minute flush, tepid water, dust caps, and unobstructed 10-second access.",
    sopSteps: [
      {
        stepOrder: 1,
        title: "Verify Unobstructed 10-Second Access Path",
        instruction:
          "Confirm the eyewash and shower are within 10 seconds (approx. 55 feet) of chemical hazards with zero carts, drums, or closed doors blocking the path.",
        isCritical: true,
      },
      {
        stepOrder: 2,
        title: "Activate Eyewash & Flush Until Water Runs Clear",
        instruction:
          "Push the paddle/valve to verify hands-free operation, confirm dust caps pop off cleanly, and flush for 1–3 minutes until water is clear and tepid (16–38°C).",
        isCritical: true,
      },
      {
        stepOrder: 3,
        title: "Test Safety Shower Pull Rod & Flow Pattern",
        instruction:
          "Place a test sock/bucket under the shower head, pull the triangular rod to confirm full-flow drench pattern, and verify the valve stays open hands-free.",
        isCritical: true,
      },
      {
        stepOrder: 4,
        title: "Inspect Nozzles, Drain & Update Inspection Tag",
        instruction:
          "Replace eyewash dust caps after flushing, check for leaks or corrosion, and sign the inspection log or scan the QR tag.",
        isCritical: false,
      },
    ],
    checklistItems: [
      { label: "Path to eyewash/shower completely unobstructed (≤ 10 sec reach)", required: true },
      { label: "High-visibility green/white emergency sign clearly visible", required: false },
      { label: "Eyewash valve activates in ≤ 1 second and stays open hands-free", required: true },
      { label: "Dual eyewash streams equal height and clear of rust/sediment", required: true },
      { label: "Eyewash dust caps intact and pop off automatically on flow", required: true },
      { label: "Water temperature tepid (16°C–38°C / 60°F–100°F)", required: true },
      { label: "Safety shower pull rod operates smoothly with full spray", required: true },
      { label: "Floor drain clear or test water safely contained", required: false },
    ],
    faqs: [
      {
        question: "Why does ANSI/ISEA Z358.1 require weekly activation of plumbed eyewash stations?",
        answer:
          "Weekly flushing clears stagnant water, rust scale, and opportunistic microorganisms like Acanthamoeba or Legionella from the supply pipes.",
      },
      {
        question: "What is the required water temperature range for emergency eyewash and showers?",
        answer:
          "ANSI/ISEA Z358.1 defines tepid flushing fluid as 16°C to 38°C (60°F to 100°F) to prevent thermal shock or scalding during a full 15-minute flush.",
      },
    ],
  },
  {
    slug: "chemical-storage-compatibility-containment-audit",
    title: "Chemical Storage Compatibility & Containment Audit",
    industry: "Pharma & Labs",
    complianceStandards: ["OSHA", "NFPA 45", "GHS", "EPA"],
    frequency: "weekly",
    shortDescription:
      "Audit laboratory and warehouse chemical storage for incompatible class segregation, secondary containment trays, flammable cabinet grounding, and GHS labels.",
    seoTitle: "Chemical Storage & Containment Audit Checklist | QR SOP",
    seoDescription:
      "Weekly lab chemical storage compatibility and secondary containment checklist. Verify acid/base segregation, flammable cabinets, and GHS/SDS compliance.",
    sopSteps: [
      {
        stepOrder: 1,
        title: "Verify Incompatible Chemical Class Segregation",
        instruction:
          "Confirm acids are separated from bases, oxidizers are isolated from flammables/organics, and water-reactive chemicals are stored in dry, sealed areas.",
        isCritical: true,
      },
      {
        stepOrder: 2,
        title: "Inspect Secondary Containment Trays & Cabinets",
        instruction:
          "Verify all liquid corrosive and solvent bottles sit inside chemical-resistant secondary containment trays capable of holding 110% of the largest container.",
        isCritical: true,
      },
      {
        stepOrder: 3,
        title: "Check Flammable Storage Cabinet & Grounding",
        instruction:
          "Confirm yellow flammable cabinets are self-closing, grounded if dispensing, vented/capped per code, and not exceeding maximum allowable volume.",
        isCritical: true,
      },
      {
        stepOrder: 4,
        title: "Audit GHS Labels, Caps & Peroxide Formers",
        instruction:
          "Ensure every bottle (including secondary aliquots) has a legible GHS hazard label, tight cap, and date-opened marking on peroxide-forming ethers.",
        isCritical: false,
      },
    ],
    checklistItems: [
      { label: "Acids and bases stored in separate cabinets or containment trays", required: true },
      { label: "Oxidizers segregated from flammable solvents and organics", required: true },
      { label: "Liquid reagents placed in 110%-capacity secondary containment", required: true },
      { label: "Flammable cabinet doors self-closing and vents/bungs compliant", required: true },
      { label: "All primary and secondary containers have intact GHS labels", required: true },
      { label: "Peroxide-forming chemicals (THF, diethyl ether) dated & within expiry", required: true },
      { label: "No chemical bottles stored directly on the floor or above eye level", required: false },
      { label: "Chemical spill kit and current SDS binder accessible nearby", required: false },
    ],
    faqs: [
      {
        question: "Why must nitric acid be stored separately from acetic acid?",
        answer:
          "Although both are acids, nitric acid is a strong oxidizer while acetic acid is an organic acid; mixing them can cause violent exothermic reactions or fire.",
      },
      {
        question: "How often should peroxide-forming chemicals be tested or disposed of?",
        answer:
          "Opened peroxide formers like diethyl ether or THF should be dated upon receipt and opening, and tested or disposed of every 3 to 6 months per institutional EHS policy.",
      },
    ],
  },
  {
    slug: "pharma-stability-chamber-monitoring-log",
    title: "Pharma Stability Chamber Monitoring Log",
    industry: "Pharma & Labs",
    complianceStandards: ["ICH Q1A(R2)", "FDA 21 CFR Part 11", "WHO", "EU GMP"],
    frequency: "daily",
    shortDescription:
      "Verify ICH stability chamber temperature and humidity setpoints (25°C/60% RH, 40°C/75% RH), water reservoir levels, and alarm status daily.",
    seoTitle: "Pharma Stability Chamber Monitoring Log | QR ICH Q1A SOP",
    seoDescription:
      "Daily ICH Q1A pharma stability chamber monitoring checklist. Verify 25°C/60% RH and 40°C/75% RH tolerances, RO water feed, and excursion alarms.",
    sopSteps: [
      {
        stepOrder: 1,
        title: "Compare Controller Setpoint vs Independent Probe",
        instruction:
          "Read both the chamber PLC controller and the independent calibrated data-logger display; verify temperature (±2°C) and humidity (±5% RH) are within ICH Q1A limits.",
        isCritical: true,
      },
      {
        stepOrder: 2,
        title: "Check Purified Water Reservoir & Steam Generator",
        instruction:
          "Inspect the RO/DI water supply tank for the humidity generator to ensure adequate level and zero algal or biofilm growth.",
        isCritical: false,
      },
      {
        stepOrder: 3,
        title: "Verify Door Gasket, Chart Recorder & Backup Power",
        instruction:
          "Confirm the chamber door seals tightly, audit-trail/recorder logging is active, and UPS/DG backup status shows normal.",
        isCritical: true,
      },
      {
        stepOrder: 4,
        title: "Document & Investigate Any Mean Kinetic Temp Excursion",
        instruction:
          "If any alarm triggered over the past 24 hours, log the exact duration and magnitude and initiate a QA Deviation for ICH stability impact assessment.",
        isCritical: true,
      },
    ],
    checklistItems: [
      { label: "Chamber temperature within ±2.0°C of ICH setpoint", required: true },
      { label: "Chamber relative humidity within ±5% RH of ICH setpoint", required: true },
      { label: "Independent calibrated sensor matches controller within tolerance", required: true },
      { label: "No unacknowledged high/low temperature or humidity alarms", required: true },
      { label: "RO/DI humidifier water feed tank filled and clean", required: false },
      { label: "Chamber door gasket intact with no condensation leaks", required: false },
      { label: "21 CFR Part 11 data logger / chart recorder actively recording", required: true },
      { label: "Sample shelves organized with airflow clearance from walls", required: false },
    ],
    faqs: [
      {
        question: "What are the standard ICH Q1A(R2) accelerated and long-term stability conditions?",
        answer:
          "Long-term stability for Zone II is typically 25°C ± 2°C / 60% RH ± 5% RH (or 30°C / 65% RH for Zone IVa), while accelerated testing is 40°C ± 2°C / 75% RH ± 5% RH.",
      },
      {
        question: "Why is RO or distilled water required for stability chamber humidifiers?",
        answer:
          "Tap water contains dissolved minerals that cause scale buildup on steam heaters and ultrasonic transducers, leading to humidity control failures.",
      },
    ],
  },
  {
    slug: "gmp-packaging-line-clearance-checklist",
    title: "GMP Packaging Line Clearance Checklist",
    industry: "Pharma & Labs",
    complianceStandards: ["EU GMP", "FDA 21 CFR 211", "WHO GMP", "PIC/S"],
    frequency: "daily",
    shortDescription:
      "Execute rigorous pre-batch GMP packaging line clearance to eliminate mix-ups, leftover labels, cartons, or tablets from the previous batch.",
    seoTitle: "GMP Packaging Line Clearance Checklist | QR Batch SOP",
    seoDescription:
      "Pre-batch GMP packaging line clearance SOP & checklist. Prevent label mix-ups and cross-contamination per FDA 21 CFR 211 and EU GMP Annex 15.",
    sopSteps: [
      {
        stepOrder: 1,
        title: "Remove All Previous Batch Materials & Rejects",
        instruction:
          "Clear all bulk product, blister foils, leaflets, printed cartons, and reject-bin contents from the line, conveyors, and floor.",
        isCritical: true,
      },
      {
        stepOrder: 2,
        title: "Inspect Hoppers, Feeders & Vision Camera Guides",
        instruction:
          "Check under conveyor belts, inside tablet hoppers, and around blister sealing rollers with a flashlight to confirm zero residual units remain.",
        isCritical: true,
      },
      {
        stepOrder: 3,
        title: "Verify Cleaning Status & Line Documentation",
        instruction:
          "Confirm equipment 'Cleaned' status tags are signed and valid, and verify the new Batch Packaging Record (BPR) matches the room status board.",
        isCritical: true,
      },
      {
        stepOrder: 4,
        title: "Test Batch Coding, Barcode Scanner & Reject Mechanism",
        instruction:
          "Verify overprinter batch/expiry settings against BPR and challenge the vision camera / checkweigher reject chute with a known bad test sample.",
        isCritical: true,
      },
    ],
    checklistItems: [
      { label: "Previous batch bulk product, foils, and cartons 100% removed", required: true },
      { label: "Conveyors, hoppers, and under-machine areas inspected with flashlight", required: true },
      { label: "All previous batch labels and coding ribbons destroyed/reconciled", required: true },
      { label: "Equipment 'Cleaned' status labels signed and within hold time", required: true },
      { label: "New Batch Packaging Record (BPR) and specimen label verified", required: true },
      { label: "Overprinter batch number, mfg date, and expiry verified by QA", required: true },
      { label: "Camera / barcode / checkweigher reject challenge test passed", required: true },
      { label: "Line temperature and relative humidity within packaging spec", required: false },
      { label: "Production supervisor and QA officer dual sign-off completed", required: true },
    ],
    faqs: [
      {
        question: "Why does GMP require dual sign-off (Production + QA) for line clearance?",
        answer:
          "Independent verification by QA prevents confirmation bias and catches hidden residual labels or tablets that could cause a critical product mix-up or recall.",
      },
      {
        question: "What must be done with unused pre-printed labels from the previous batch?",
        answer:
          "All unused pre-printed or coded labels must be reconciled against issued quantities and either destroyed under supervision or returned to a locked label store.",
      },
    ],
  },
  {
    slug: "purified-water-wfi-ro-system-daily-check",
    title: "Purified Water (WFI/RO) System Daily Check",
    industry: "Pharma & Labs",
    complianceStandards: ["USP <1231>", "EP", "EU GMP", "WHO"],
    frequency: "daily",
    shortDescription:
      "Monitor pharmaceutical Purified Water (PW) and Water for Injection (WFI) loop conductivity, TOC, loop temperature, and UV/sanitization status daily.",
    seoTitle: "Purified Water (WFI/RO) Daily Check | QR GMP Log",
    seoDescription:
      "Daily pharma Purified Water & WFI loop inspection log. Monitor <1.3 µS/cm conductivity, <500 ppb TOC, >70°C loop temp, and USP <1231> compliance.",
    sopSteps: [
      {
        stepOrder: 1,
        title: "Verify Loop Circulation Pump & Return Velocity",
        instruction:
          "Confirm the distribution loop circulation pump is running continuously and return flow rate maintains turbulent flow (≥1.5 m/s) to prevent biofilm.",
        isCritical: true,
      },
      {
        stepOrder: 2,
        title: "Record Online Conductivity & TOC Readings",
        instruction:
          "Log inline temperature-compensated conductivity (USP Stage 1 limit ≤1.3 µS/cm at 25°C) and Total Organic Carbon (TOC ≤500 ppb).",
        isCritical: true,
      },
      {
        stepOrder: 3,
        title: "Check Loop Temperature & UV Lamp Intensity",
        instruction:
          "For hot-loop WFI systems, verify return temperature ≥70°C (or ≥80°C per site spec); for ambient PW loops, check UV lamp intensity and hours.",
        isCritical: true,
      },
      {
        stepOrder: 4,
        title: "Inspect Point-of-Use Valves & Sample Port Integrity",
        instruction:
          "Walk down critical user points to check for weeping diaphragms, verify vent filter integrity heating, and confirm daily microbial sample collection.",
        isCritical: false,
      },
    ],
    checklistItems: [
      { label: "Inline conductivity ≤ 1.3 µS/cm at 25°C (USP Stage 1)", required: true },
      { label: "Total Organic Carbon (TOC) ≤ 500 ppb", required: true },
      { label: "WFI hot loop return temperature ≥ 70°C (or PW UV lamp active)", required: true },
      { label: "Distribution loop return flow / pressure maintains turbulent flow", required: true },
      { label: "RO membrane differential pressure and rejection % within spec", required: false },
      { label: "Storage tank hydrophobic 0.2 µm vent filter heater operational", required: true },
      { label: "No leaks at point-of-use diaphragm valves or gaskets", required: false },
      { label: "Daily microbial & endotoxin sampling completed per schedule", required: true },
    ],
    faqs: [
      {
        question: "Why must pharmaceutical water loops maintain continuous turbulent flow?",
        answer:
          "Stagnant water or laminar flow allows microorganisms to attach to pipe walls and form biofilms, which shed endotoxins and cause microbial excursions.",
      },
      {
        question: "What are the USP limits for Purified Water conductivity and TOC?",
        answer:
          "USP specifies a Stage 1 conductivity limit of ≤1.3 µS/cm at 25°C and a Total Organic Carbon (TOC) limit of ≤500 ppb (0.5 mg/L).",
      },
    ],
  },
  {
    slug: "biosafety-cabinet-bsc-pre-use-decontamination",
    title: "Biosafety Cabinet (BSC) Pre-Use Decontamination",
    industry: "Pharma & Labs",
    complianceStandards: ["NSF/ANSI 49", "CDC/NIH BMBL", "WHO", "ISO 14644"],
    frequency: "daily",
    shortDescription:
      "Verify Class II Biosafety Cabinet laminar inflow/downflow pressure, sash alarm, UV-off safety, and 70% ethanol surface decontamination before work.",
    seoTitle: "Biosafety Cabinet (BSC) Pre-Use Check | QR Lab SOP",
    seoDescription:
      "Daily Class II Biosafety Cabinet pre-use checklist. Verify blower purge, Magnehelic pressure, sash height, and 70% alcohol decontamination per NSF/ANSI 49.",
    sopSteps: [
      {
        stepOrder: 1,
        title: "Switch Off UV Lamp & Purge Cabinet for 5–10 Minutes",
        instruction:
          "Turn off the UV germicidal lamp before opening the sash, switch on the blower and fluorescent light, and let the cabinet purge for at least 5–10 minutes.",
        isCritical: true,
      },
      {
        stepOrder: 2,
        title: "Verify Sash Height & Airflow Magnehelic Gauge",
        instruction:
          "Set the sash to the certified 8- or 10-inch working mark, confirm zero airflow alarms, and verify the HEPA pressure gauge sits within its green range.",
        isCritical: true,
      },
      {
        stepOrder: 3,
        title: "Decontaminate Work Surface & Materials",
        instruction:
          "Wipe the stainless steel work deck, side walls, and every item entering the BSC (pipettes, tip boxes, media bottles) with 70% ethanol or IPA.",
        isCritical: true,
      },
      {
        stepOrder: 4,
        title: "Keep Front & Rear Air Grilles Unobstructed",
        instruction:
          "Arrange supplies from clean-to-dirty zones at least 10 cm behind the front grille; never block front or rear intake grilles with wipes or arms.",
        isCritical: false,
      },
    ],
    checklistItems: [
      { label: "UV germicidal lamp turned OFF prior to sash opening", required: true },
      { label: "Blower run for 5–10 minute purge before starting work", required: true },
      { label: "Sash positioned at certified working height with no alarm", required: true },
      { label: "Magnehelic / digital airflow gauge within certified green zone", required: true },
      { label: "Annual NSF/ANSI 49 certification sticker current", required: true },
      { label: "Work deck, walls, and all incoming items wiped with 70% ethanol", required: true },
      { label: "Front and rear perforated air grilles completely unobstructed", required: true },
      { label: "Bunsen burners / open flames absent inside BSC", required: true },
    ],
    faqs: [
      {
        question: "Why should Bunsen burners never be used inside a Biosafety Cabinet?",
        answer:
          "Open flames disrupt the laminar airflow curtain, can damage the HEPA filter adhesive, and pose an explosion risk when combined with 70% ethanol vapors.",
      },
      {
        question: "Why should you wait 5–10 minutes after turning on a BSC before working?",
        answer:
          "Purging allows the HEPA-filtered downflow air to sweep away settled particulates and establish a stable air barrier at the front sash opening.",
      },
    ],
  },
  {
    slug: "pharma-cold-room-quarantine-area-log",
    title: "Pharma Cold Room & Quarantine Area Log",
    industry: "Pharma & Labs",
    complianceStandards: ["GDP", "EU GMP", "FDA 21 CFR", "WHO"],
    frequency: "daily",
    shortDescription:
      "Monitor walk-in pharmaceutical cold rooms (2°C–8°C) and locked quarantine cages for temperature uniformity, door alarms, and physical stock segregation.",
    seoTitle: "Pharma Cold Room & Quarantine Area Log | QR GDP SOP",
    seoDescription:
      "Daily GDP pharma cold room (2°C–8°C) and quarantine cage audit log. Verify temp mapping sensors, door-ajar alarms, and locked stock segregation.",
    sopSteps: [
      {
        stepOrder: 1,
        title: "Log Mapped Temperature Sensors (2°C–8°C)",
        instruction:
          "Read the external digital controller and mapped high/low corner sensors to confirm uniform 2°C–8°C storage without cold spots near evaporator fans.",
        isCritical: true,
      },
      {
        stepOrder: 2,
        title: "Test Door-Ajar & Man-Trap Safety Alarms",
        instruction:
          "Verify the internal emergency push-button / man-trap bell works, strip curtains are intact, and the door-ajar alarm triggers within the configured delay.",
        isCritical: true,
      },
      {
        stepOrder: 3,
        title: "Audit Quarantine & Rejected Stock Lockup",
        instruction:
          "Confirm all 'Quarantine', 'Under Test', and 'Rejected' materials are physically segregated in locked cages/racks with clear status labels (if not purely ERP-controlled).",
        isCritical: true,
      },
      {
        stepOrder: 4,
        title: "Check Evaporator Defrost & Floor Safety",
        instruction:
          "Inspect evaporator drip pans and floor surfaces for ice buildup or condensation slip hazards and ensure pallets sit off the floor on clean racks.",
        isCritical: false,
      },
    ],
    checklistItems: [
      { label: "Cold room temperature within 2.0°C–8.0°C across all sensors", required: true },
      { label: "24-hour min/max data logger shows zero excursions", required: true },
      { label: "Strip curtains intact and main door gasket sealing tightly", required: false },
      { label: "Internal man-trap emergency release and alarm functional", required: true },
      { label: "Quarantine & Rejected cages locked with authorized key control", required: true },
      { label: "All pallets/cartons clearly labeled (Approved / Quarantine / Rejected)", required: true },
      { label: "No stock stored directly in front of evaporator blower fans", required: false },
      { label: "Floor dry and free of ice buildup or slip hazards", required: false },
    ],
    faqs: [
      {
        question: "Why is thermal mapping required for pharmaceutical walk-in cold rooms?",
        answer:
          "GDP and WHO guidelines require seasonal thermal mapping to identify hot spots near doors and freezing zones directly beneath evaporator fans.",
      },
      {
        question: "How must quarantined or rejected pharma stock be controlled?",
        answer:
          "Quarantined or rejected batches must be either physically locked in dedicated, clearly labeled cages or controlled by a validated ERP system that blocks picking.",
      },
    ],
  },
];
