import type { SeoTemplate } from "./types";

export const HOSPITALITY_TEMPLATES: SeoTemplate[] = [
  {
    slug: "commercial-kitchen-haccp-fssai-daily-hygiene",
    title: "Commercial Kitchen HACCP & FSSAI Daily Hygiene",
    industry: "Hospitality & Food",
    complianceStandards: ["HACCP", "FSSAI", "ISO 22000", "FDA Food Code"],
    frequency: "daily",
    shortDescription:
      "Daily pre-shift and mid-shift food safety hygiene inspection for commercial kitchens. Covers personal hygiene, cross-contamination controls, sanitizer strength, and allergen segregation.",
    seoTitle: "Commercial Kitchen HACCP & FSSAI Daily Hygiene SOP",
    seoDescription:
      "Free HACCP and FSSAI daily hygiene checklist for commercial kitchens. Track staff sanitation, sanitizer ppm, allergen controls, and food prep safety via QR.",
    sopSteps: [
      {
        stepOrder: 1,
        title: "Verify Staff Personal Hygiene & Health Screening",
        instruction:
          "Inspect all kitchen staff before shift start for clean uniforms, hairnets, trimmed nails, absence of jewelry, and no symptoms of vomiting, diarrhea, or fever.",
        isCritical: true,
      },
      {
        stepOrder: 2,
        title: "Test Sanitizer Concentrations at Prep Stations",
        instruction:
          "Use quaternary ammonium or chlorine test strips at all three-compartment sinks and wiping buckets to verify 200 ppm quat or 50–100 ppm chlorine.",
        isCritical: true,
      },
      {
        stepOrder: 3,
        title: "Check Color-Coded Cutting Board & Knife Segregation",
        instruction:
          "Confirm raw poultry, raw meat, seafood, produce, and ready-to-eat prep zones use dedicated color-coded boards and sanitized utensils.",
        isCritical: true,
      },
      {
        stepOrder: 4,
        title: "Inspect Handwashing Stations & Dry-Storage Integrity",
        instruction:
          "Verify hot water (min 38°C/100°F), antibacterial soap, and single-use paper towels at every hand sink, and confirm dry goods are stored 15 cm off the floor.",
        isCritical: false,
      },
      {
        stepOrder: 5,
        title: "Log Corrective Actions & Manager Sign-Off",
        instruction:
          "Document any failed hygiene item, discard potentially contaminated food immediately, retrain staff if needed, and record digital sign-off.",
        isCritical: true,
      },
    ],
    checklistItems: [
      { label: "All food handlers wearing clean aprons, hair restraints, and closed-toe non-slip shoes", required: true },
      { label: "Zero open wounds uncovered; blue detectable bandages and gloves worn where needed", required: true },
      { label: "Handwashing sinks stocked with warm water, soap, and paper towels (no blocked access)", required: true },
      { label: "Sanitizer buckets test at 200 ppm quat or 50-100 ppm chlorine", required: true },
      { label: "Color-coded cutting boards clean, intact, and free of deep knife grooves", required: true },
      { label: "Raw meats stored below ready-to-eat foods on separate shelves", required: true },
      { label: "Allergen-free prep utensils and purple-coded tools stored in sealed containers", required: true },
      { label: "Food-contact surfaces cleaned and sanitized every 4 hours during continuous use", required: false },
      { label: "Dry food containers labeled with item name and received/use-by dates", required: true },
    ],
    faqs: [
      {
        question: "How often should sanitizer solution in wiping cloth buckets be changed?",
        answer:
          "Under FDA Food Code and HACCP guidelines, sanitizer buckets should be tested with test strips at the start of each shift and replaced every 2 to 4 hours, or immediately if the water becomes cloudy or drops below minimum ppm.",
      },
      {
        question: "What does FSSAI Schedule 4 require for daily kitchen hygiene records?",
        answer:
          "FSSAI Schedule 4 requires Food Business Operators to maintain verifiable daily records of personal hygiene, equipment sanitation, pest-free premises, and water potability for inspection by food safety officers.",
      },
    ],
  },
  {
    slug: "walk-in-cooler-deep-freezer-temperature-log",
    title: "Walk-In Cooler & Deep Freezer Temperature Log",
    industry: "Hospitality & Food",
    complianceStandards: ["HACCP", "FDA Food Code", "FSSAI", "ISO 22000"],
    frequency: "daily",
    shortDescription:
      "Twice-daily cold-chain temperature monitoring SOP for walk-in chillers and deep freezers. Prevents time-temperature abuse and bacterial growth in TCS foods.",
    seoTitle: "Walk-In Cooler & Freezer Temperature Log Checklist",
    seoDescription:
      "Track walk-in cooler (0-4°C) and deep freezer (-18°C) temperatures with this HACCP-compliant daily QR checklist. Catch compressor failures before spoilage.",
    sopSteps: [
      {
        stepOrder: 1,
        title: "Read Calibrated Internal Thermometer",
        instruction:
          "Check the hanging internal probe thermometer inside the warmest zone (near the door) rather than relying solely on the external digital controller.",
        isCritical: true,
      },
      {
        stepOrder: 2,
        title: "Verify Safe Cold-Chain Thresholds",
        instruction:
          "Confirm walk-in coolers read between 0°C and 4°C (32°F–40°F) and deep freezers read at or below -18°C (0°F).",
        isCritical: true,
      },
      {
        stepOrder: 3,
        title: "Inspect Door Gaskets, Air Curtains & Evaporator Coils",
        instruction:
          "Check magnetic door seals for tears, verify strip curtains are intact, and ensure evaporator fans are unobstructed and free of heavy ice buildup.",
        isCritical: false,
      },
      {
        stepOrder: 4,
        title: "Execute Deviation & Food Disposition Protocol",
        instruction:
          "If a cooler exceeds 5°C (41°F) for more than 2 hours, probe internal food temperatures, relocate TCS items to backup refrigeration, and call HVAC maintenance.",
        isCritical: true,
      },
    ],
    checklistItems: [
      { label: "Walk-in cooler internal temperature is between 0°C and 4°C (32°F - 40°F)", required: true },
      { label: "Deep freezer internal temperature is at or below -18°C (0°F)", required: true },
      { label: "Probe thermometer calibrated in ice-water bath (0°C / 32°F) within last 7 days", required: true },
      { label: "Door gaskets seal tightly with no cold air leaks or condensation puddles", required: true },
      { label: "PVC strip curtains clean, intact, and hanging properly across doorway", required: false },
      { label: "Food crates stacked at least 15 cm off floor and 5 cm away from walls for airflow", required: true },
      { label: "Evaporator fans running smoothly with no excessive frost or ice blockage", required: true },
      { label: "Floor drains inside walk-in clear and free of standing water or food debris", required: false },
    ],
    faqs: [
      {
        question: "Why should I check an internal thermometer instead of just the external display?",
        answer:
          "External digital displays often measure return air near the evaporator coil, which can read several degrees colder than the actual food storage area near the door.",
      },
      {
        question: "What is the critical limit for TCS foods in a walk-in cooler?",
        answer:
          "Time/Temperature Control for Safety (TCS) foods must be held at 5°C (41°F) or below under the FDA Food Code, and 4°C or below under most HACCP plans to prevent pathogen proliferation.",
      },
    ],
  },
  {
    slug: "kitchen-exhaust-hood-grease-trap-cleaning",
    title: "Kitchen Exhaust Hood & Grease Trap Cleaning",
    industry: "Hospitality & Food",
    complianceStandards: ["NFPA 96", "OSHA", "FSSAI", "Local Fire Code"],
    frequency: "weekly",
    shortDescription:
      "Weekly fire-prevention and sanitation SOP for commercial kitchen Type I exhaust hoods, baffle filters, and grease interceptors. Reduces grease fire risk and drain backups.",
    seoTitle: "Kitchen Exhaust Hood & Grease Trap Cleaning SOP",
    seoDescription:
      "NFPA 96 compliant kitchen exhaust hood, baffle filter, and grease trap cleaning checklist. Prevent commercial kitchen grease fires and plumbing blockages.",
    sopSteps: [
      {
        stepOrder: 1,
        title: "Shut Down Cooking Appliances & Exhaust Fan",
        instruction:
          "Turn off all fryers, ranges, and charbroilers, allow surfaces to cool, and switch off the hood exhaust fan before removing filters.",
        isCritical: true,
      },
      {
        stepOrder: 2,
        title: "Degrease & Dishwash Baffle Filters",
        instruction:
          "Remove stainless steel baffle filters, soak in heavy-duty alkaline degreaser, run through high-temp warewasher, and air dry completely.",
        isCritical: false,
      },
      {
        stepOrder: 3,
        title: "Clean Hood Plenum, Drip Trays & Ansul Nozzles",
        instruction:
          "Empty and wash grease drip cups, wipe down accessible hood plenum surfaces, and visually confirm fire suppression nozzles and fusible links are grease-free.",
        isCritical: true,
      },
      {
        stepOrder: 4,
        title: "Inspect & Skim Under-Sink Grease Trap",
        instruction:
          "Open the grease interceptor lid, measure FOG (fats, oils, grease) thickness, skim floating grease into a sealed waste drum, and verify outlet baffle flow.",
        isCritical: true,
      },
      {
        stepOrder: 5,
        title: "Reinstall Filters & Test Make-Up Air Balance",
        instruction:
          "Reinstall dry baffle filters with zero gaps (so flames cannot enter the plenum), restart exhaust and make-up air fans, and verify proper draw.",
        isCritical: true,
      },
    ],
    checklistItems: [
      { label: "All cooking equipment turned off and cooled before hood maintenance", required: true },
      { label: "Baffle filters degreased, washed, and reinstalled with zero gaps between panels", required: true },
      { label: "Grease collection cups and drip channels emptied and sanitized", required: true },
      { label: "Fire suppression (Ansul) nozzles capped cleanly and unobstructed by grease", required: true },
      { label: "Manual pull station for kitchen fire suppression system accessible and unblocked", required: true },
      { label: "Under-sink grease trap FOG layer below 25% of total liquid depth", required: true },
      { label: "Waste cooking oil disposed in sealed rendering bin (never poured down floor drains)", required: true },
      { label: "Professional NFPA 96 ductwork cleaning tag current and within valid date", required: false },
    ],
    faqs: [
      {
        question: "How often must commercial kitchen baffle filters be cleaned?",
        answer:
          "In high-volume kitchens using fryers, woks, or charbroilers, baffle filters should be cleaned daily or at least weekly. NFPA 96 also requires periodic professional hood and ductwork cleaning based on cooking volume.",
      },
      {
        question: "When does a grease trap need to be pumped out?",
        answer:
          "Follow the 25% rule: once combined floating grease and settled solids reach 25% of the trap's liquid depth, it must be pumped to prevent sewer backups and municipal fines.",
      },
    ],
  },
  {
    slug: "hotel-guest-room-housekeeping-inspection",
    title: "Hotel Guest Room Housekeeping Inspection",
    industry: "Hospitality & Food",
    complianceStandards: ["ISO 9001", "OSHA", "AHLA Safe Stay", "CDC Guidelines"],
    frequency: "daily",
    shortDescription:
      "Supervisor room-readiness and sanitation audit for hotel guest rooms after turnover. Ensures spotless high-touch disinfection, linen quality, and functioning room amenities.",
    seoTitle: "Hotel Guest Room Housekeeping Inspection Checklist",
    seoDescription:
      "Standardize hotel room turnovers with this daily housekeeping inspection checklist. Verify high-touch sanitization, linen quality, and guest amenity readiness.",
    sopSteps: [
      {
        stepOrder: 1,
        title: "Inspect Entryway, Odor & HVAC Comfort",
        instruction:
          "Enter the room to verify neutral fresh air (no smoke or musty odors), working keycard lock and deadbolt, and thermostat set to standard welcome temperature (22°C/72°F).",
        isCritical: false,
      },
      {
        stepOrder: 2,
        title: "Audit Bedding, Linens & Mattress Protection",
        instruction:
          "Check crisp hospital corners, stain-free sheets and pillowcases, intact mattress encasement, and absence of stray hairs on beds and upholstery.",
        isCritical: true,
      },
      {
        stepOrder: 3,
        title: "Verify Bathroom Sanitization & Drain Flow",
        instruction:
          "Inspect toilet bowl, under-rim, shower glass, chrome fixtures, and vanity for zero water spots or hair; test hot/cold water pressure and drain speed.",
        isCritical: true,
      },
      {
        stepOrder: 4,
        title: "Confirm High-Touch Disinfection & Amenity Stock",
        instruction:
          "Verify TV remote, light switches, door handles, kettle, and safe keypad are disinfected, and confirm full par levels of towels, toiletries, and coffee/tea.",
        isCritical: true,
      },
    ],
    checklistItems: [
      { label: "Entry door latch, deadbolt, peephole, and electronic lock functioning properly", required: true },
      { label: "Room smells fresh and neutral; HVAC vents clean and thermostat set to 22°C", required: false },
      { label: "Bed linens, duvet, and pillowcases crisp, stain-free, and free of hair", required: true },
      { label: "High-touch points (remote, switches, phone, door handles) disinfected", required: true },
      { label: "Bathroom toilet, sink, mirror, and shower stall spotless and sanitized", required: true },
      { label: "Fresh towel set (bath, hand, face, bathmat) folded to brand standard", required: true },
      { label: "Toiletries, tissues, coffee/tea tray, and minibar items fully restocked", required: false },
      { label: "All lamps, outlets, USB ports, Wi-Fi, and TV channels tested and working", required: false },
      { label: "Under bed, inside drawers, and closet checked for left-behind guest items", required: true },
    ],
    faqs: [
      {
        question: "What are the most commonly missed items in hotel room inspections?",
        answer:
          "Inspectors most frequently catch stray hairs in bathroom corners or on bedsheets, smudged TV remotes, dusty headboard tops, and unemptied coffee pod drawers.",
      },
      {
        question: "Should housekeeping supervisors inspect 100% of turned-over rooms?",
        answer:
          "Full-service hotels typically inspect 100% of VIP and departure rooms or a minimum 20–30% random sample per attendant, logging scores digitally to spot training gaps.",
      },
    ],
  },
  {
    slug: "swimming-pool-water-ph-chlorine-test-log",
    title: "Swimming Pool Water pH & Chlorine Test Log",
    industry: "Hospitality & Food",
    complianceStandards: ["CDC MAHC", "WHO Pool Guidelines", "OSHA", "Local Health Dept"],
    frequency: "daily",
    shortDescription:
      "Daily water chemistry and bather-safety log for hotel and resort swimming pools and spas. Ensures proper disinfection, balanced pH, and compliant lifeguard/safety gear.",
    seoTitle: "Swimming Pool Water pH & Chlorine Test Log SOP",
    seoDescription:
      "Log daily hotel swimming pool free chlorine (1-3 ppm), pH (7.2-7.8), and water clarity with this CDC MAHC compliant QR inspection checklist.",
    sopSteps: [
      {
        stepOrder: 1,
        title: "Collect Water Sample at Elbow Depth",
        instruction:
          "Collect pool water from 45 cm (18 inches) below the surface away from return inlets using a clean DPD test kit vial.",
        isCritical: false,
      },
      {
        stepOrder: 2,
        title: "Test Free Chlorine, Combined Chlorine & pH",
        instruction:
          "Measure free chlorine (target 1.0–3.0 ppm for pools, 3.0–5.0 ppm for spas), combined chlorine (<0.4 ppm), and pH (7.2–7.8).",
        isCritical: true,
      },
      {
        stepOrder: 3,
        title: "Verify Water Clarity & Main Drain Visibility",
        instruction:
          "Stand at the deep-end deck and confirm the main drain cover at the bottom of the pool is clearly visible and intact.",
        isCritical: true,
      },
      {
        stepOrder: 4,
        title: "Inspect Deck Safety Equipment & Pump Room",
        instruction:
          "Check life rings, shepherd's hook, emergency phone, anti-entrapment drain covers, and pump room pressure gauges.",
        isCritical: true,
      },
      {
        stepOrder: 5,
        title: "Close Pool & Dose Chemicals if Out of Range",
        instruction:
          "Immediately close the pool to bathers if free chlorine drops below 1.0 ppm, pH is outside 7.0–8.0, or the main drain is not visible; balance chemicals and retest.",
        isCritical: true,
      },
    ],
    checklistItems: [
      { label: "Free available chlorine within 1.0 - 3.0 ppm (3.0 - 5.0 ppm for heated spa)", required: true },
      { label: "Pool water pH balanced between 7.2 and 7.8", required: true },
      { label: "Combined chlorine (chloramines) below 0.4 ppm", required: true },
      { label: "Deep-end main drain cover clearly visible from pool deck and securely fastened", required: true },
      { label: "Skimmer baskets and hair/lint strainers cleared of leaves and debris", required: false },
      { label: "Life ring with throw line and 12-ft shepherd's hook accessible on deck", required: true },
      { label: "Pool deck gates self-closing and self-latching; depth markers legible", required: true },
      { label: "Chemical dosing room locked, ventilated, and acid/chlorine stored separately", required: true },
    ],
    faqs: [
      {
        question: "Why is keeping pH between 7.2 and 7.8 critical for chlorine effectiveness?",
        answer:
          "If pH rises above 7.8, chlorine converts mostly to hypochlorite ion, which is far less effective at killing pathogens. Below 7.2, water becomes corrosive and irritates bathers' eyes and skin.",
      },
      {
        question: "When must a commercial pool be closed immediately?",
        answer:
          "Under CDC Model Aquatic Health Code (MAHC) rules, close the pool immediately if the main drain is not visible, free chlorine is below 1.0 ppm, a fecal/vomit incident occurs, or the drain cover is loose or missing.",
      },
    ],
  },
  {
    slug: "bar-opening-inventory-closing-checklist",
    title: "Bar Opening, Inventory & Closing Checklist",
    industry: "Hospitality & Food",
    complianceStandards: ["FDA Food Code", "ABC / Liquor Licensing", "OSHA", "HACCP"],
    frequency: "daily",
    shortDescription:
      "End-to-end daily operational SOP for restaurant and hotel bars. Covers ice-well sanitation, speed-rail par checks, POS cash verification, and liquor security at close.",
    seoTitle: "Bar Opening, Inventory & Closing Checklist SOP",
    seoDescription:
      "Streamline bar shifts with this daily opening, inventory, and closing checklist. Cover ice-bin hygiene, garnish dating, draft lines, and liquor lockup.",
    sopSteps: [
      {
        stepOrder: 1,
        title: "Sanitize Ice Wells & Verify Ice Scoop Storage",
        instruction:
          "Inspect ice bins for foreign objects or glass, confirm ice scoops are stored in dedicated exterior holders (never inside ice), and sanitize soda gun nozzles.",
        isCritical: true,
      },
      {
        stepOrder: 2,
        title: "Prep Garnishes, Batch Mixers & Check Dates",
        instruction:
          "Wash citrus before slicing, label all house syrups, juices, and opened wines with prep/use-by dates, and discard expired perishables.",
        isCritical: true,
      },
      {
        stepOrder: 3,
        title: "Verify Backbar Par Stock & Glassware Sanitizer",
        instruction:
          "Restock speed-rail spirits, beer coolers, and clean glassware; test three-compartment bar sink sanitizer concentration (200 ppm quat).",
        isCritical: false,
      },
      {
        stepOrder: 4,
        title: "Close Out POS, Pour-Cap Bottles & Lock Liquor Cage",
        instruction:
          "Reconcile POS batch and cash drawer, cap all pour spouts (or wrap with fruit-fly caps), burn remaining ice in wells, and lock liquor storage.",
        isCritical: true,
      },
    ],
    checklistItems: [
      { label: "Ice wells clean and free of glass; ice scoop stored in sanitized external holder", required: true },
      { label: "Soda gun nozzles and holsters soaked in sanitizer and rinsed clean", required: true },
      { label: "Fresh garnishes prepped, covered, and labeled with prep date/time", required: true },
      { label: "Bar glass-washer or 3-bay sink sanitizer verified at proper ppm/temperature", required: true },
      { label: "Draft beer glycol cooler temperature at 1°C - 3°C (34°F - 38°F)", required: false },
      { label: "All open liquor pour spouts capped at close to prevent fruit flies", required: true },
      { label: "POS terminal settled, tips logged, and cash drawer secured in drop safe", required: true },
      { label: "Liquor storeroom, beer walk-in, and wine fridge locked at end of shift", required: true },
    ],
    faqs: [
      {
        question: "Why must bar ice scoops never be left buried inside the ice bin?",
        answer:
          "Health codes treat ice as food. Leaving a scoop inside the bin allows bare hands or contaminated scoop handles to touch ice that goes directly into guest drinks.",
      },
      {
        question: "How often should soda gun nozzles and draft beer lines be cleaned?",
        answer:
          "Soda gun nozzles and drip trays must be cleaned and sanitized nightly to prevent mold and fruit flies, while draft beer lines should be professionally flushed every 2 weeks.",
      },
    ],
  },
  {
    slug: "food-facility-pest-control-bait-station-audit",
    title: "Food Facility Pest Control & Bait Station Audit",
    industry: "Hospitality & Food",
    complianceStandards: ["HACCP", "FSSAI", "ISO 22000", "AIB International"],
    frequency: "weekly",
    shortDescription:
      "Weekly Integrated Pest Management (IPM) self-inspection for restaurants, bakeries, and food warehouses. Audits exterior exclusion, bait stations, and insect light traps.",
    seoTitle: "Food Facility Pest Control & Bait Station Audit",
    seoDescription:
      "Maintain a pest-free kitchen with this weekly HACCP and FSSAI pest control audit. Check door sweeps, bait stations, UV fly traps, and rodent activity.",
    sopSteps: [
      {
        stepOrder: 1,
        title: "Inspect Exterior Perimeter & Door Sweeps",
        instruction:
          "Walk the building exterior checking for daylight under delivery doors, damaged window screens, unsealed pipe penetrations, and overgrown vegetation touching walls.",
        isCritical: true,
      },
      {
        stepOrder: 2,
        title: "Audit Bait Stations & Mechanical Snap Traps",
        instruction:
          "Verify all numbered exterior tamper-resistant bait boxes and interior mechanical traps are present, anchored, undamaged, and match the facility IPM map.",
        isCritical: true,
      },
      {
        stepOrder: 3,
        title: "Check Insect Light Traps (ILTs) & Glue Boards",
        instruction:
          "Inspect UV fly traps to ensure bulbs are working, glue boards are not saturated, and traps are mounted away from open food prep surfaces.",
        isCritical: false,
      },
      {
        stepOrder: 4,
        title: "Inspect Dry Storage & Behind Equipment for Evidence",
        instruction:
          "Use a flashlight to check behind dishwashers, under shelving, and inside pallet corners for droppings, gnaw marks, or webbing; escalate immediately to licensed PCO.",
        isCritical: true,
      },
    ],
    checklistItems: [
      { label: "Zero daylight visible beneath exterior kitchen, receiving, and trash doors", required: true },
      { label: "All exterior rodent bait stations locked, anchored, and numbered per site map", required: true },
      { label: "Interior mechanical traps (non-toxic/no-bait) intact and free of rodent activity", required: true },
      { label: "UV insect light traps operational and positioned away from open food prep", required: false },
      { label: "Dumpster lids closed tightly and trash area free of spilled food/grease", required: true },
      { label: "No rodent droppings, rub marks, or insect activity behind stoves and dry racks", required: true },
      { label: "Incoming cardboard boxes inspected and broken down promptly (no roach harborages)", required: false },
      { label: "Licensed pest control service report and SDS binder up to date", required: true },
    ],
    faqs: [
      {
        question: "Can toxic rodent bait be placed inside a commercial kitchen?",
        answer:
          "No. Under HACCP, FDA Food Code, and AIB standards, toxic rodenticide bait is prohibited inside food prep and storage areas; only non-toxic mechanical traps or glue boards may be used indoors.",
      },
      {
        question: "How large a gap can a mouse squeeze through?",
        answer:
          "A mouse can fit through a gap as small as 6 mm (1/4 inch)—roughly the diameter of a pencil—making intact door sweeps and sealed utility penetrations essential.",
      },
    ],
  },
  {
    slug: "commercial-deep-fryer-oil-quality-filter-log",
    title: "Commercial Deep Fryer Oil Quality & Filter Log",
    industry: "Hospitality & Food",
    complianceStandards: ["FSSAI", "HACCP", "OSHA", "EU/FDA Oil Guidelines"],
    frequency: "daily",
    shortDescription:
      "Daily frying oil quality testing, filtration, and burn-safety SOP for commercial kitchens. Controls Total Polar Materials (TPM), prevents off-flavors, and reduces oil waste.",
    seoTitle: "Commercial Deep Fryer Oil Quality & Filter Log",
    seoDescription:
      "Monitor deep fryer oil quality, TPM levels (<24%), filtration, and burn-safety PPE with this daily restaurant QR checklist. Extend oil life safely.",
    sopSteps: [
      {
        stepOrder: 1,
        title: "Test Oil Quality (TPM / Color / Smoke Point)",
        instruction:
          "Before service, test each fryer vat with a digital TPM meter or oil color test strip; discard oil immediately if TPM exceeds 24–25% or oil smokes at set temp.",
        isCritical: true,
      },
      {
        stepOrder: 2,
        title: "Verify Fryer Thermostat & High-Limit Safety",
        instruction:
          "Confirm oil temperature with a calibrated probe matches the thermostat (typically 175°C–180°C / 350°F) and never exceeds 190°C (375°F).",
        isCritical: true,
      },
      {
        stepOrder: 3,
        title: "Wear Heat-Resistant PPE & Filter Oil",
        instruction:
          "Put on heat-resistant apron, neoprene gloves, and face shield before draining hot oil through the filter machine and scrubbing vat walls.",
        isCritical: true,
      },
      {
        stepOrder: 4,
        title: "Skim Crumbs Mid-Shift & Cover Vats Overnight",
        instruction:
          "Skim floating batter crumbs every 2 hours during service and cover cooled vats with stainless steel lids overnight to prevent oxidation.",
        isCritical: false,
      },
    ],
    checklistItems: [
      { label: "Total Polar Materials (TPM) reading below 24% (or within color/strip pass range)", required: true },
      { label: "Oil free of excessive foaming, dark burnt odor, or smoking at operating temp", required: true },
      { label: "Fryer oil temperature calibrated within ±3°C of 175°C - 180°C (350°F)", required: true },
      { label: "Oil filtered through clean filter paper/pad to remove carbonized crumbs", required: true },
      { label: "Staff wearing heat-resistant gloves, apron, and eye protection during filtering", required: true },
      { label: "Class K wet-chemical fire extinguisher mounted within 9 m (30 ft) of fryers", required: true },
      { label: "Dedicated gluten-free or allergen fryer vat kept strictly segregated", required: false },
      { label: "Fryer baskets free of broken wires and heavy carbon buildup", required: false },
    ],
    faqs: [
      {
        question: "What is the maximum safe TPM limit for commercial frying oil?",
        answer:
          "FSSAI and European food safety regulations set the maximum Total Polar Materials (TPM) limit at 25% (most chains discard at 24%). Above this level, degraded oil forms harmful compounds and ruins food taste.",
      },
      {
        question: "Can water be used to extinguish a deep fryer oil fire?",
        answer:
          "Never use water on a grease fire—it causes a violent steam explosion that spreads burning oil. Use the hood fire suppression pull station or a Class K wet-chemical extinguisher.",
      },
    ],
  },
  {
    slug: "banquet-hall-pre-event-safety-av-setup",
    title: "Banquet Hall Pre-Event Safety & AV Setup",
    industry: "Hospitality & Food",
    complianceStandards: ["NFPA 101", "OSHA", "ADA", "Local Fire Marshal"],
    frequency: "daily",
    shortDescription:
      "Pre-event safety, egress, and AV readiness checklist for hotel ballrooms and convention halls. Ensures clear fire exits, taped cables, and tested microphones before doors open.",
    seoTitle: "Banquet Hall Pre-Event Safety & AV Setup Checklist",
    seoDescription:
      "Verify banquet hall fire exits, occupancy limits, taped AV cables, staging stability, and sound checks before guests arrive with this pre-event QR SOP.",
    sopSteps: [
      {
        stepOrder: 1,
        title: "Verify Fire Exits, Aisles & Occupancy Limits",
        instruction:
          "Confirm all emergency exit doors are unlocked, panic bars work freely, exit signs are illuminated, and table layouts preserve minimum 1.1 m (44 in) egress aisles.",
        isCritical: true,
      },
      {
        stepOrder: 2,
        title: "Secure AV Cables, Staging & Pipe-and-Drape",
        instruction:
          "Tape down all floor power and XLR cables with high-visibility gaffer tape or cable ramps, and verify stage skirting, stairs, and handrails are locked.",
        isCritical: true,
      },
      {
        stepOrder: 3,
        title: "Run Full Audio, Projector & Lighting Test",
        instruction:
          "Test wireless microphones (fresh batteries), podium mic, projector/LED wall input switching, house lighting dimmer presets, and HVAC temperature.",
        isCritical: false,
      },
      {
        stepOrder: 4,
        title: "Confirm Chafing Dish Fuel & Banquet BEO Match",
        instruction:
          "Verify sterno/chafing fuel is placed safely with a Class ABC extinguisher nearby, and cross-check room setup against the signed Banquet Event Order (BEO).",
        isCritical: true,
      },
    ],
    checklistItems: [
      { label: "All emergency exit doors unlocked, unobstructed, and illuminated exit signs lit", required: true },
      { label: "Aisle widths clear for egress and wheelchair/ADA accessibility", required: true },
      { label: "All floor AV and power cables taped flat or covered with cable ramps", required: true },
      { label: "Portable stage risers locked, level, and equipped with secure steps/handrails", required: true },
      { label: "Wireless microphones, podium mic, and backup batteries tested", required: false },
      { label: "Projector/LED screen, HDMI adapters, and clicker tested with client deck", required: false },
      { label: "Room temperature comfortable and house lighting zones labeled/tested", required: false },
      { label: "Fire extinguisher and first-aid kit accessible near catering/service doors", required: true },
    ],
    faqs: [
      {
        question: "Why are blocked banquet exits a top fire marshal violation?",
        answer:
          "Placing pipe-and-drape, catering carts, or extra banquet chairs in front of exit doors delays evacuation during emergencies and triggers immediate fines or event shutdowns.",
      },
      {
        question: "How early should the pre-event AV and safety check be completed?",
        answer:
          "Complete the full walkthrough at least 60 to 90 minutes before guest doors open so technicians have time to swap faulty mics, cables, or table layouts.",
      },
    ],
  },
  {
    slug: "restaurant-restroom-hourly-sanitization-log",
    title: "Restaurant Restroom Hourly Sanitization Log",
    industry: "Hospitality & Food",
    complianceStandards: ["FDA Food Code", "FSSAI", "OSHA", "ADA"],
    frequency: "daily",
    shortDescription:
      "Hourly guest and staff restroom cleanliness, disinfection, and supply-restock log. Protects brand reputation and prevents foodborne illness transmission via contaminated hands.",
    seoTitle: "Restaurant Restroom Hourly Sanitization Log SOP",
    seoDescription:
      "Keep restaurant restrooms spotless and health-code compliant with an hourly QR sanitization log. Track toilet disinfection, soap stock, and dry floors.",
    sopSteps: [
      {
        stepOrder: 1,
        title: "Place Wet-Floor Sign & Inspect Fixtures",
        instruction:
          "Set a yellow wet-floor cone at the entrance, flush all toilets/urinals, check for clogs or leaks, and empty trash bins before they exceed 75% full.",
        isCritical: false,
      },
      {
        stepOrder: 2,
        title: "Disinfect High-Touch Surfaces & Toilets",
        instruction:
          "Spray EPA/FSSAI-approved disinfectant on flush handles, stall latches, faucet handles, baby changing station, and door push-plates; allow proper contact time.",
        isCritical: true,
      },
      {
        stepOrder: 3,
        title: "Restock Soap, Paper Towels & Toilet Tissue",
        instruction:
          "Refill handwashing soap dispensers, paper towels, toilet paper, and seat covers; verify warm water is flowing at all sinks.",
        isCritical: true,
      },
      {
        stepOrder: 4,
        title: "Spot-Mop Floor & Log Timestamped Scan",
        instruction:
          "Mop any water splashes using a restroom-dedicated mop (never kitchen mops), verify odor control, and scan the restroom QR sticker to log the hourly check.",
        isCritical: true,
      },
    ],
    checklistItems: [
      { label: "Toilets, urinals, and seats cleaned, disinfected, and flushing properly", required: true },
      { label: "Faucet handles, stall locks, and door handles disinfected", required: true },
      { label: "Hand soap dispensers full and operational at every sink", required: true },
      { label: "Paper towels (or hand dryers) and toilet paper stocked above 50%", required: true },
      { label: "Hot and cold water running; 'Employees Must Wash Hands' sign posted", required: true },
      { label: "Floor dry, slip-free, and free of litter or standing water", required: true },
      { label: "Trash receptacles emptied and relined; sanitary disposal bins clean", required: false },
      { label: "Baby changing station sanitized and safety strap intact", required: false },
    ],
    faqs: [
      {
        question: "Why must restroom mops and buckets never be used in the kitchen?",
        answer:
          "Using restroom cleaning tools in food prep areas transfers enteric pathogens like Norovirus and E. coli onto kitchen floors and drains. Color-code restroom tools (e.g., red) separately.",
      },
      {
        question: "What do health inspectors check first in a restaurant restroom?",
        answer:
          "Inspectors immediately check for working hot water, stocked soap, single-use paper towels (or working air dryer), a self-closing door, and a visible handwashing reminder sign.",
      },
    ],
  },
];
