import type { SeoTemplate } from "./types";

export const ENERGY_TEMPLATES: SeoTemplate[] = [
  {
    slug: "solar-pv-inverter-string-combiner-check",
    title: "Solar PV Inverter & String Combiner Check",
    industry: "Energy & Utilities",
    complianceStandards: ["IEC 62446-1", "NFPA 70", "IEEE 1547"],
    frequency: "weekly",
    shortDescription:
      "Weekly performance, thermal, and DC string health inspection for commercial/utility-scale solar PV inverters and combiner boxes.",
    seoTitle: "Solar PV Inverter & String Combiner Checklist",
    seoDescription:
      "Maximize solar yield and prevent DC arc faults with an IEC 62446-1 checklist for string inverters, combiner fuses, SPDs, and cooling fans.",
    sopSteps: [
      {
        stepOrder: 1,
        title: "Review Inverter HMI & String Currents",
        instruction:
          "Check the inverter display or SCADA portal for grid-tie status, isolation resistance (Riso) faults, and compare DC string currents for >10% imbalance.",
        isCritical: true,
      },
      {
        stepOrder: 2,
        title: "Inspect Combiner Box Fuses & SPDs",
        instruction:
          "Check DC surge protection device (SPD) status windows (green = OK, red = replace) and scan string fuse holders with an IR thermometer for hot spots.",
        isCritical: true,
      },
      {
        stepOrder: 3,
        title: "Clean Inverter Air Filters & Fans",
        instruction:
          "Verify cooling fans spin freely without bearing rattle and clear dust or insect debris from intake louvers and heatsink fins to prevent thermal derating.",
        isCritical: false,
      },
      {
        stepOrder: 4,
        title: "Check Enclosures, Glands & Grounding",
        instruction:
          "Inspect combiner door gaskets for moisture ingress, confirm MC4/cable glands are tight, and verify equipment grounding jumpers are intact.",
        isCritical: true,
      },
    ],
    checklistItems: [
      { label: "Inverter online in MPPT/grid-tie mode with zero active faults", required: true },
      { label: "DC string voltages and currents balanced within ±10% tolerance", required: true },
      { label: "DC and AC Surge Protection Device (SPD) indicators green", required: true },
      { label: "No thermal hot spots (>15°C above ambient) on combiner terminals", required: true },
      { label: "Inverter cooling fans operational and air intake filters clean", required: false },
      { label: "Combiner box NEMA/IP door seals dry with zero condensation", required: true },
      { label: "DC isolator switch and AC breaker handles intact and labeled", required: true },
      { label: "Equipment earthing conductors tightly bonded to busbar", required: true },
    ],
    faqs: [
      {
        question: "What causes a sudden drop in a single solar PV string current?",
        answer:
          "Common causes include a blown string fuse, a corroded or loose MC4 connector, localized module shading, or a bypassed diode inside a panel.",
      },
      {
        question: "Why check SPD status indicators every week?",
        answer:
          "A sacrificial SPD module that tripped during a lightning surge leaves the inverter unprotected against the next transient unless replaced promptly.",
      },
    ],
  },
  {
    slug: "power-transformer-oil-level-temp-check",
    title: "Power Transformer Oil Level & Temp Check",
    industry: "Energy & Utilities",
    complianceStandards: ["IEEE C57.106", "IEC 60076", "NFPA 70B"],
    frequency: "daily",
    shortDescription:
      "Daily external inspection SOP for oil-immersed distribution and power transformers covering MOG oil level, OTI/WTI temperatures, and silica gel breather.",
    seoTitle: "Power Transformer Oil Level & Temp Check SOP",
    seoDescription:
      "Prevent transformer failures with a daily IEEE C57.106 checklist for conservator oil levels, OTI/WTI gauges, Buchholz relay, and silica gel breather.",
    sopSteps: [
      {
        stepOrder: 1,
        title: "Record Oil & Winding Temperatures",
        instruction:
          "Log the Oil Temperature Indicator (OTI) and Winding Temperature Indicator (WTI) readings along with max-drag needle positions and ambient temperature.",
        isCritical: true,
      },
      {
        stepOrder: 2,
        title: "Verify Conservator Oil Level (MOG)",
        instruction:
          "Check the Magnetic Oil Gauge (MOG) on the conservator tank against the ambient temperature reference mark to ensure no slow oil leak.",
        isCritical: true,
      },
      {
        stepOrder: 3,
        title: "Inspect Silica Gel Breather & Buchholz Relay",
        instruction:
          "Confirm breather silica gel is vibrant blue/orange (not pink/clear) and oil is visible in the bottom cup; inspect Buchholz sight glass for trapped gas.",
        isCritical: true,
      },
      {
        stepOrder: 4,
        title: "Check Cooling Fans, Bushings & Leaks",
        instruction:
          "Verify radiator cooling fans activate at setpoints, inspect HV/LV porcelain bushings for cracks or tracking, and check radiator valves and gaskets for oil weeping.",
        isCritical: false,
      },
    ],
    checklistItems: [
      { label: "Oil Temperature Indicator (OTI) within normal load-ambient curve", required: true },
      { label: "Winding Temperature Indicator (WTI) below alarm setpoint", required: true },
      { label: "Conservator MOG oil level matches current ambient temperature mark", required: true },
      { label: "Silica gel breather crystals dry (blue/orange) with oil in cup", required: true },
      { label: "Buchholz relay sight glass full of oil with zero gas accumulation", required: true },
      { label: "No oil weeping at radiator fins, drain valves, or tank gaskets", required: true },
      { label: "HV/LV bushings clean and free of cracks or corona tracking", required: false },
      { label: "Cooling fans/pumps operational and marshalling box heater dry", required: false },
    ],
    faqs: [
      {
        question: "What does pink or colorless silica gel in a transformer breather mean?",
        answer:
          "It indicates the desiccant is saturated with moisture and can no longer dry incoming air, risking moisture ingress into the insulating oil.",
      },
      {
        question: "What should operators do if gas bubbles appear in the Buchholz relay?",
        answer:
          "Gas accumulation signals an internal incipient fault (arcing or overheating); schedule an immediate Dissolved Gas Analysis (DGA) oil sample.",
      },
    ],
  },
  {
    slug: "electrical-substation-daily-safety-walkthrough",
    title: "Electrical Substation Daily Safety Walkthrough",
    industry: "Energy & Utilities",
    complianceStandards: ["OSHA 1910.269", "IEEE C2 (NESC)", "NFPA 70E"],
    frequency: "daily",
    shortDescription:
      "Daily perimeter, switchyard, and control-room safety walkthrough for industrial and utility electrical substations.",
    seoTitle: "Electrical Substation Daily Safety Walkthrough SOP",
    seoDescription:
      "Maintain NESC and OSHA 1910.269 compliance with a daily substation walkthrough covering perimeter fencing, SF6 pressures, DC batteries, and relays.",
    sopSteps: [
      {
        stepOrder: 1,
        title: "Inspect Perimeter Fence, Gates & Signage",
        instruction:
          "Walk the yard perimeter to verify gates are locked, ground-grid fence bonding is intact, crushed stone is weed-free, and High-Voltage warning signs are legible.",
        isCritical: true,
      },
      {
        stepOrder: 2,
        title: "Check Switchyard Breakers & SF6 Gauges",
        instruction:
          "Visually inspect circuit breaker SF6 gas pressure gauges in the green zone, spring-charge indicators, and listen for abnormal corona hissing.",
        isCritical: true,
      },
      {
        stepOrder: 3,
        title: "Verify Control Room Relays & DC Supply",
        instruction:
          "Check protection relay panels for trip flags or communication loss, and verify 110V/48V DC station battery charger voltage and zero ground-fault alarms.",
        isCritical: true,
      },
      {
        stepOrder: 4,
        title: "Confirm Rescue Gear & Fire Protection",
        instruction:
          "Verify insulated rescue hook, Class C/CO2 fire extinguishers, and arc-flash PPE cabinet are stocked and unobstructed.",
        isCritical: false,
      },
    ],
    checklistItems: [
      { label: "Substation perimeter fence, locks, and warning signs intact", required: true },
      { label: "Switchyard crushed gravel clean with no animal/rodent intrusion", required: false },
      { label: "Circuit breaker SF6 gas pressure gauges in green operating band", required: true },
      { label: "No audible corona discharge or unusual buzzing on busbars", required: true },
      { label: "Protection relays normal with zero unacknowledged trip flags", required: true },
      { label: "Station DC battery charger float voltage normal (no earth fault)", required: true },
      { label: "Insulated rescue hook and dielectric gloves accessible at entry", required: true },
      { label: "Control room HVAC/dehumidifier running and lighting operational", required: false },
    ],
    faqs: [
      {
        question: "Why is a DC earth-fault alarm in a substation control room urgent?",
        answer:
          "A single DC ground fault won't trip a breaker, but a second ground fault on the opposite polarity can cause unintended breaker tripping or failure to trip during a fault.",
      },
      {
        question: "Why must substation yards use clean crushed stone?",
        answer:
          "High-resistivity crushed rock increases surface contact resistance, protecting personnel against dangerous step and touch potentials during a ground fault.",
      },
    ],
  },
  {
    slug: "industrial-battery-bank-ups-health-check",
    title: "Industrial Battery Bank & UPS Health Check",
    industry: "Energy & Utilities",
    complianceStandards: ["IEEE 1188", "NFPA 111", "OSHA 1910.305"],
    frequency: "weekly",
    shortDescription:
      "Weekly health and thermal inspection for VRLA/flooded industrial battery banks and online double-conversion UPS systems.",
    seoTitle: "Industrial Battery Bank & UPS Health Check SOP",
    seoDescription:
      "Prevent critical power drops with an IEEE 1188 checklist for UPS load balance, float voltage, battery terminal corrosion, and room temperature.",
    sopSteps: [
      {
        stepOrder: 1,
        title: "Log UPS Panel Metrics & Alarms",
        instruction:
          "Record input/output voltage, load percentage per phase, DC bus float voltage, and verify the UPS is in Online Normal mode (not Static Bypass).",
        isCritical: true,
      },
      {
        stepOrder: 2,
        title: "Inspect Battery Jars & Terminals",
        instruction:
          "Visually inspect VRLA/flooded cells for case bulging, cracks, electrolyte weeping, or white/green sulfation on inter-cell busbars.",
        isCritical: true,
      },
      {
        stepOrder: 3,
        title: "Check Ambient Temp & IR Scan",
        instruction:
          "Verify battery room cooling maintains 20–25°C (68–77°F) and use an IR thermometer to spot warm terminals indicating loose torque.",
        isCritical: true,
      },
      {
        stepOrder: 4,
        title: "Verify Ventilation & Spill/Eyewash Kit",
        instruction:
          "Confirm hydrogen exhaust fans are running (especially for flooded/NiCd banks) and acid-neutralizing spill kits and eyewash stations are ready.",
        isCritical: false,
      },
    ],
    checklistItems: [
      { label: "UPS operating in Online Double-Conversion mode with zero alarms", required: true },
      { label: "Phase load balanced and below 80% rated UPS capacity", required: true },
      { label: "DC float voltage and ripple current within OEM specification", required: true },
      { label: "Zero battery jar bulging, cracking, or electrolyte leakage", required: true },
      { label: "Inter-cell connectors clean and free of sulfation/corrosion", required: true },
      { label: "Battery room ambient temperature maintained between 20–25°C", required: true },
      { label: "UPS air intake filters clean and cooling fans running smoothly", required: false },
      { label: "Battery room exhaust fan and eyewash station operational", required: false },
    ],
    faqs: [
      {
        question: "How does ambient temperature affect VRLA battery lifespan?",
        answer:
          "Every 10°C (18°F) rise above the 25°C design baseline cuts VRLA battery service life roughly in half due to accelerated grid corrosion.",
      },
      {
        question: "What does a bulged VRLA battery case indicate?",
        answer:
          "Bulging indicates internal overpressure from thermal runaway or excessive overcharging; isolate and replace the affected block immediately.",
      },
    ],
  },
  {
    slug: "wind-turbine-nacelle-tower-safety-check",
    title: "Wind Turbine Nacelle & Tower Safety Check",
    industry: "Energy & Utilities",
    complianceStandards: ["IEC 61400", "GWO BST", "OSHA 1910.140"],
    frequency: "monthly",
    shortDescription:
      "Monthly tower climb, nacelle fire/rescue, gearbox oil, and yaw brake safety inspection for utility-scale wind turbines.",
    seoTitle: "Wind Turbine Nacelle & Tower Safety Checklist",
    seoDescription:
      "Standardize wind turbine safety checks with an IEC 61400 / GWO checklist covering climb arrestors, yaw brakes, gearbox oil, and rescue kits.",
    sopSteps: [
      {
        stepOrder: 1,
        title: "Verify Climb Arrestor & LOTO Isolation",
        instruction:
          "Inspect the tower ladder fall-arrest rail/cable before ascending, verify wind speed is within safe work limits, and apply rotor lock/LOTO before entering the hub.",
        isCritical: true,
      },
      {
        stepOrder: 2,
        title: "Inspect Nacelle Rescue & Fire Gear",
        instruction:
          "Confirm the descent rescue kit seals are intact, first-aid kit is stocked, and nacelle automatic/portable fire suppression gauges are in the green.",
        isCritical: true,
      },
      {
        stepOrder: 3,
        title: "Check Gearbox, Hydraulic & Yaw Systems",
        instruction:
          "Verify gearbox oil sight-glass level, hydraulic power unit (HPU) accumulator pressure, and inspect yaw brake pads and ring gear lubrication.",
        isCritical: true,
      },
      {
        stepOrder: 4,
        title: "Inspect Tower Lighting & Hatch Latches",
        instruction:
          "Test aviation obstruction beacon status, emergency tower lighting, and confirm nacelle roof skylight and tower deck hatches latch securely.",
        isCritical: false,
      },
    ],
    checklistItems: [
      { label: "Tower ladder fall-arrest rail/cable and anchor points certified", required: true },
      { label: "Service lift (if fitted) overload and emergency brake tested", required: true },
      { label: "Nacelle descent rescue kit seal intact and within inspection date", required: true },
      { label: "Gearbox and hydraulic power unit oil levels within sight-glass range", required: true },
      { label: "No oil leaks beneath gearbox, yaw motors, or pitch cylinders", required: true },
      { label: "Nacelle fire suppression panel normal and extinguisher charged", required: true },
      { label: "Aviation obstruction light and tower emergency lights functional", required: false },
      { label: "All tools tethered/accounted for and roof hatch locked before descent", required: true },
    ],
    faqs: [
      {
        question: "Why must the nacelle descent rescue kit be checked on every visit?",
        answer:
          "In a nacelle fire or medical emergency, technicians have only one rapid egress path; a compromised rope seal or expired inspection puts the crew at fatal risk.",
      },
      {
        question: "What is the most common source of wind turbine nacelle fires?",
        answer:
          "Hydraulic fluid misting onto hot brake discs or high-voltage converter cabinet arcing are the leading causes, making leak checks critical.",
      },
    ],
  },
  {
    slug: "medium-voltage-switchgear-panel-inspection",
    title: "Medium-Voltage Switchgear Panel Inspection",
    industry: "Energy & Utilities",
    complianceStandards: ["NETA MTS", "NFPA 70B", "IEC 62271"],
    frequency: "monthly",
    shortDescription:
      "Monthly non-invasive inspection of 11kV/33kV medium-voltage switchgear rooms covering partial discharge, heaters, VCBs, and interlocks.",
    seoTitle: "Medium-Voltage Switchgear Inspection Checklist",
    seoDescription:
      "Detect MV insulation degradation early with an IEC 62271 / NETA checklist for VCBs, space heaters, ultrasonic partial discharge, and mimic panels.",
    sopSteps: [
      {
        stepOrder: 1,
        title: "Check Room Dehumidification & Heaters",
        instruction:
          "Verify switchgear room relative humidity is below 60% and check panel anti-condensation space heaters are drawing normal current.",
        isCritical: true,
      },
      {
        stepOrder: 2,
        title: "Perform Ultrasonic / TEV Partial Discharge Scan",
        instruction:
          "Scan cable termination compartments and busbar chambers externally with an ultrasonic/TEV detector for early corona or tracking noise.",
        isCritical: true,
      },
      {
        stepOrder: 3,
        title: "Inspect VCB Indicators & Protection Relays",
        instruction:
          "Verify vacuum circuit breaker (VCB) spring-charged indicators, operation counters, trip-coil healthy LEDs, and protection relay status.",
        isCritical: true,
      },
      {
        stepOrder: 4,
        title: "Verify Earthing Switch & PPE Readiness",
        instruction:
          "Confirm mechanical interlocks and padlocks on earthing switches, and verify insulated rubber mat (IEC 61111) integrity in front of the lineup.",
        isCritical: false,
      },
    ],
    checklistItems: [
      { label: "Switchgear room temperature and relative humidity (<60% RH) normal", required: true },
      { label: "Panel anti-condensation space heaters active and functional", required: true },
      { label: "No abnormal ultrasonic/TEV partial discharge or ozone odor", required: true },
      { label: "Trip-circuit supervision healthy LED lit on all feeder panels", required: true },
      { label: "VCB spring-charge status and operation counter logged", required: true },
      { label: "IR inspection windows clear with no thermal anomalies on joints", required: false },
      { label: "Insulating rubber floor mat clean, dry, and rated for system kV", required: true },
      { label: "Earthing switch padlocks and key-interlocks secured", required: true },
    ],
    faqs: [
      {
        question: "Why are anti-condensation heaters vital in MV switchgear?",
        answer:
          "Moisture condensing on 11kV/33kV epoxy insulators creates conductive tracking paths that can trigger catastrophic phase-to-ground flashovers.",
      },
      {
        question: "What does a failed Trip-Circuit Supervision (TCS) alarm mean?",
        answer:
          "It means the breaker's trip coil, DC fuse, or auxiliary contact path is open—so the breaker will fail to trip automatically during a short-circuit.",
      },
    ],
  },
  {
    slug: "earthing-grounding-pit-resistance-check",
    title: "Earthing & Grounding Pit Resistance Check",
    industry: "Energy & Utilities",
    complianceStandards: ["IEEE 81", "IEC 62305", "IS 3043"],
    frequency: "monthly",
    shortDescription:
      "Monthly physical and earth-resistance verification SOP for plant earthing pits, lightning down-conductors, and equipotential bonding.",
    seoTitle: "Earthing & Grounding Pit Resistance Checklist",
    seoDescription:
      "Keep plant earth resistance within IEEE 81 and IEC 62305 limits with a monthly pit inspection covering clamp corrosion, watering, and ohm readings.",
    sopSteps: [
      {
        stepOrder: 1,
        title: "Inspect Pit Cover & Electrode Clamp",
        instruction:
          "Open the earthing pit cover, remove debris, and inspect the copper/GI earth strip and bimetallic clamp bolts for looseness or green/white corrosion.",
        isCritical: true,
      },
      {
        stepOrder: 2,
        title: "Measure Earth Pit Resistance",
        instruction:
          "Use a calibrated clamp-on earth tester or 3-pole fall-of-potential meter (with test link isolated if required) and log the resistance in ohms.",
        isCritical: true,
      },
      {
        stepOrder: 3,
        title: "Hydrate Soil During Dry Seasons",
        instruction:
          "If resistance climbs above target (typically <1–2 ohms for substations/IT, <5 ohms general), pour clean water into the watering funnel to restore soil conductivity.",
        isCritical: false,
      },
      {
        stepOrder: 4,
        title: "Verify Pit Tagging & Re-Seal Cover",
        instruction:
          "Ensure the pit ID plate is legible, re-tighten test link bolts securely, and seat the pit cover flush with grade.",
        isCritical: false,
      },
    ],
    checklistItems: [
      { label: "Earth pit ID tag legible and chamber free of mud or standing trash", required: true },
      { label: "Electrode-to-strip bolted clamp tight and corrosion-free", required: true },
      { label: "Measured earth resistance within site target (e.g., <2 ohms)", required: true },
      { label: "Test link (if opened for 3-pole test) re-bolted tightly", required: true },
      { label: "Soil moisture adequate (watered if dry-season reading elevated)", required: false },
      { label: "Copper/GI earth riser strip undamaged up to building entry", required: true },
      { label: "Pit cover intact and flush to prevent trip hazards", required: false },
      { label: "Resistance reading logged against previous month trend", required: true },
    ],
    faqs: [
      {
        question: "What is an acceptable earth pit resistance for industrial substations?",
        answer:
          "While general building earthing often targets under 5 ohms, substations, data centers, and lightning protection grids typically require under 1 to 2 ohms.",
      },
      {
        question: "Why should you avoid dumping raw salt into an earth pit?",
        answer:
          "Excessive rock salt corrodes copper and galvanized electrodes rapidly; use bentonite or conductive carbon-based backfill compounds instead.",
      },
    ],
  },
  {
    slug: "bulk-diesel-fuel-storage-tank-bund-audit",
    title: "Bulk Diesel & Fuel Storage Tank Bund Audit",
    industry: "Energy & Utilities",
    complianceStandards: ["EPA SPCC", "NFPA 30", "ISO 14001"],
    frequency: "weekly",
    shortDescription:
      "Weekly environmental and fire-safety audit for above-ground bulk diesel storage tanks, secondary containment bunds, and transfer pumps.",
    seoTitle: "Bulk Diesel Storage Tank & Bund Audit Checklist",
    seoDescription:
      "Comply with EPA SPCC and NFPA 30 using a weekly bulk fuel tank checklist inspecting secondary containment bunds, overfill alarms, and vents.",
    sopSteps: [
      {
        stepOrder: 1,
        title: "Inspect Secondary Containment Bund",
        instruction:
          "Check the concrete/steel bund wall for cracks, ensure the rainwater drain valve is locked closed, and pump out any accumulated stormwater via an oil-water separator.",
        isCritical: true,
      },
      {
        stepOrder: 2,
        title: "Check Tank Level & Overfill Alarm",
        instruction:
          "Verify mechanical/ultrasonic level gauges match inventory logs and test the high-level overfill alarm horn/beacon before scheduled fuel deliveries.",
        isCritical: true,
      },
      {
        stepOrder: 3,
        title: "Inspect Piping, Valves & Vent Arrestors",
        instruction:
          "Walk transfer pumps, flexible hoses, and flanged joints for fuel weeping; verify flame arrestors on tank vents are clear of bird nests.",
        isCritical: true,
      },
      {
        stepOrder: 4,
        title: "Verify Bonding, Spill Kit & Fire Gear",
        instruction:
          "Confirm static grounding reel/clamp for tanker unloading is intact, spill absorbent pads are stocked, and foam/dry-chemical extinguishers are ready.",
        isCritical: false,
      },
    ],
    checklistItems: [
      { label: "Secondary containment bund dry, crack-free, and free of fuel sheen", required: true },
      { label: "Bund rainwater drain valve closed and padlocked", required: true },
      { label: "Tank level gauge readable and high-level overfill alarm functional", required: true },
      { label: "Transfer pump seals, hoses, and isolation valves free of leaks", required: true },
      { label: "Tank vent pipe flame arrestor clean and unobstructed", required: true },
      { label: "Static earthing clamp and cable intact at tanker unloading bay", required: true },
      { label: "Hydrocarbon spill kit stocked with absorbent booms and pads", required: false },
      { label: "No Smoking / Flammable signage and fire extinguishers in place", required: true },
    ],
    faqs: [
      {
        question: "Why must the bund drain valve always remain locked closed?",
        answer:
          "EPA SPCC rules prohibit unattended open drains on fuel bunds because an overnight tank rupture would discharge diesel directly into stormwater sewers.",
      },
      {
        question: "How much capacity must a fuel tank secondary containment bund hold?",
        answer:
          "Standard codes require at least 110% of the largest single tank's volume inside the bund, plus allowance for local rainfall.",
      },
    ],
  },
  {
    slug: "high-voltage-arc-flash-ppe-dielectric-check",
    title: "High-Voltage Arc-Flash PPE & Dielectric Check",
    industry: "Energy & Utilities",
    complianceStandards: ["NFPA 70E", "OSHA 1910.137", "ASTM F1506"],
    frequency: "weekly",
    shortDescription:
      "Weekly readiness and pre-use dielectric inspection for arc-flash suits, face shields, and Class 00–4 insulating rubber gloves.",
    seoTitle: "High-Voltage Arc-Flash PPE & Dielectric Checklist",
    seoDescription:
      "Protect electrical technicians with an NFPA 70E / OSHA 1910.137 checklist for arc-flash hoods, leather protectors, and glove air-inflation tests.",
    sopSteps: [
      {
        stepOrder: 1,
        title: "Perform Rubber Glove Air-Inflation Test",
        instruction:
          "Roll each insulating rubber glove cuff to trap air, listen and feel for pinhole leaks, and inspect for ozone cracking, embedded metal, or swelling.",
        isCritical: true,
      },
      {
        stepOrder: 2,
        title: "Check Dielectric Test Date & Leather Protectors",
        instruction:
          "Verify the stamped lab dielectric test date is within the mandatory 6-month window and inspect leather over-gloves for oil stains or holes.",
        isCritical: true,
      },
      {
        stepOrder: 3,
        title: "Inspect Arc-Flash Suit, Hood & Balaclava",
        instruction:
          "Check the cal/cm² rating label, inspect the tinted arc-shield visor for deep scratches or cracks, and confirm hood seams and Velcro closures are intact.",
        isCritical: true,
      },
      {
        stepOrder: 4,
        title: "Verify Voltage-Rated Tools & Storage",
        instruction:
          "Inspect 1000V insulated tools and hot-sticks for nicked insulation and ensure gloves are stored flat in protective canvas bags away from UV/heat.",
        isCritical: false,
      },
    ],
    checklistItems: [
      { label: "Insulating rubber gloves pass air-inflation test with zero leaks", required: true },
      { label: "Glove dielectric lab test date within 6-month validity window", required: true },
      { label: "Leather protector gloves clean, dry, and free of oil/grease", required: true },
      { label: "Arc-flash suit & hood cal/cm² rating label legible and intact", required: true },
      { label: "Arc-rated face shield clean with no cracks or melting", required: true },
      { label: "1000V insulated hand tools free of cuts exposing inner layer", required: true },
      { label: "Hot-stick fiberglass poles clean, waxed, and free of tracking", required: false },
      { label: "PPE stored in clean, dry, UV-protected cabinet/bags", required: false },
    ],
    faqs: [
      {
        question: "How often must electrical insulating rubber gloves be lab tested?",
        answer:
          "OSHA 1910.137 and ASTM F496 require dielectric re-testing every 6 months once issued for service, plus a field air-inflation check before every use.",
      },
      {
        question: "Can you wear insulating rubber gloves without leather protectors?",
        answer:
          "No, unless specifically exempted for tight dexterity work under strict rules; leather protectors shield the rubber from mechanical punctures and arc-flash heat.",
      },
    ],
  },
  {
    slug: "main-lt-power-distribution-board-pdb-check",
    title: "Main LT Power Distribution Board (PDB) Check",
    industry: "Energy & Utilities",
    complianceStandards: ["NFPA 70", "IEC 61439", "NFPA 70B"],
    frequency: "daily",
    shortDescription:
      "Daily electrical room walkthrough for 415V/480V Main LT Power Distribution Boards (PDB/MCC) checking meters, APFC power factor, and panel temperature.",
    seoTitle: "Main LT Power Distribution Board (PDB) Checklist",
    seoDescription:
      "Monitor 415V/480V switchgear health with a daily LT PDB checklist covering phase currents, power factor, APFC capacitors, and panel door seals.",
    sopSteps: [
      {
        stepOrder: 1,
        title: "Log Voltage, Current & Power Factor",
        instruction:
          "Record L1/L2/L3 phase voltages, ampere load, and power factor (target ≥0.98) from the main incomer multifunction meter, checking for phase imbalance.",
        isCritical: true,
      },
      {
        stepOrder: 2,
        title: "Check ACB Status & APFC Capacitor Bank",
        instruction:
          "Verify Air Circuit Breaker (ACB) spring-charge status and inspect the APFC panel for tripped capacitor stages or swollen capacitor cans.",
        isCritical: true,
      },
      {
        stepOrder: 3,
        title: "Check Panel Temperature & Burning Odor",
        instruction:
          "Scan busbar chamber doors with an IR gun for hot spots, feel enclosure doors cautiously with the back of a gloved hand, and sniff for ozone/burning insulation.",
        isCritical: true,
      },
      {
        stepOrder: 4,
        title: "Verify Panel Doors, Mats & Clearance",
        instruction:
          "Ensure all panel doors are latched, cable gland plates are sealed against rodents, and 1.1m OSHA working clearance is free of storage.",
        isCritical: false,
      },
    ],
    checklistItems: [
      { label: "Three-phase voltages and currents balanced within normal limits", required: true },
      { label: "System power factor ≥0.98 with APFC stages switching normally", required: true },
      { label: "Main ACB spring charged and zero earth-leakage/overcurrent trips", required: true },
      { label: "No abnormal enclosure heat, buzzing, or burning insulation odor", required: true },
      { label: "Panel cooling fans/louvers unobstructed and running", required: false },
      { label: "All feeder compartment doors closed, latched, and labeled", required: true },
      { label: "Dielectric rubber mat in place and 1.1m front clearance clear", required: true },
      { label: "Bottom cable trench/glands sealed against moisture and rodents", required: false },
    ],
    faqs: [
      {
        question: "Why check the APFC capacitor bank every day on a Main LT PDB?",
        answer:
          "Swollen or shorted power-factor capacitors can rupture violently and cause utility power-factor penalties if left offline.",
      },
      {
        question: "What is the minimum required clearance in front of an LT distribution board?",
        answer:
          "NFPA 70 (NEC 110.26) requires at least 3 to 4 feet (0.9–1.2m) of unobstructed working space, and electrical rooms must never be used for storage.",
      },
    ],
  },
];
