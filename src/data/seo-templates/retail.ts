import type { SeoTemplate } from "./types";

export const RETAIL_TEMPLATES: SeoTemplate[] = [
  {
    slug: "retail-store-opening-security-checklist",
    title: "Retail Store Opening & Security Checklist",
    industry: "Retail & Commercial",
    complianceStandards: ["OSHA", "NRF Loss Prevention", "PCI-DSS", "Local Fire Code"],
    frequency: "daily",
    shortDescription:
      "Daily pre-open safety, security, and store-readiness SOP for retail managers. Verifies perimeter integrity, alarm disarming, POS readiness, and hazard-free sales floors before unlocking.",
    seoTitle: "Retail Store Opening & Security Checklist SOP",
    seoDescription:
      "Standardize store openings with this daily retail opening and security checklist. Verify alarm disarm, POS readiness, lighting, and clear aisles before doors open.",
    sopSteps: [
      {
        stepOrder: 1,
        title: "Conduct Exterior & Entry Perimeter Scan",
        instruction:
          "Before unlocking, scan the storefront, parking lot, and back alley for loitering, broken glass, tampered locks, or forced-entry signs; never enter alone if compromised.",
        isCritical: true,
      },
      {
        stepOrder: 2,
        title: "Disarm Intrusion Alarm & Verify CCTV Recording",
        instruction:
          "Enter using buddy-system protocol, disarm the alarm panel within the entry delay window, and confirm CCTV NVR cameras are online and recording.",
        isCritical: true,
      },
      {
        stepOrder: 3,
        title: "Power Up Lighting, HVAC, Music & POS Terminals",
        instruction:
          "Turn on sales floor lighting, boot POS registers, test barcode scanners and card terminals for PCI tamper seals, and place counted cash tills into drawers.",
        isCritical: false,
      },
      {
        stepOrder: 4,
        title: "Walk Sales Floor for Trip Hazards & High-Value Locks",
        instruction:
          "Ensure aisles are clear of overnight restock carts, floor mats lie flat, high-value glass cabinets are locked, and unlock customer entrance exactly on schedule.",
        isCritical: true,
      },
    ],
    checklistItems: [
      { label: "Exterior storefront, glass, and rear doors free of tampering or forced entry", required: true },
      { label: "Intrusion alarm disarmed properly and CCTV recording status verified", required: true },
      { label: "All sales floor, fitting room, and signage lights operational", required: false },
      { label: "POS card readers inspected for skimmers and intact tamper-evident seals", required: true },
      { label: "Opening cash floats counted and loaded into POS drawers", required: true },
      { label: "Sales floor aisles clear of pallets, boxes, and trip hazards", required: true },
      { label: "High-theft display cases and EAS security gates powered and locked", required: true },
      { label: "Customer restrooms clean, stocked, and unlocked for opening", required: false },
    ],
    faqs: [
      {
        question: "Why should retail stores use a two-person opening protocol?",
        answer:
          "A buddy-system opening reduces robbery risk by ensuring one employee can observe from a safe distance or call emergency services if the opener encounters forced entry.",
      },
      {
        question: "What should staff check on POS card terminals every morning?",
        answer:
          "Under PCI-DSS guidelines, staff should visually inspect payment terminals daily for loose bezels, overlays, extra cables, or broken tamper-evident stickers that indicate skimming devices.",
      },
    ],
  },
  {
    slug: "retail-store-closing-lockup-checklist",
    title: "Retail Store Closing & Lockup Checklist",
    industry: "Retail & Commercial",
    complianceStandards: ["OSHA", "NRF Loss Prevention", "PCI-DSS", "NFPA 101"],
    frequency: "daily",
    shortDescription:
      "End-of-day retail closing, sweep, and alarm-arming SOP. Prevents overnight hide-ins, secures cash in the safe, and ensures fire doors and backrooms are locked.",
    seoTitle: "Retail Store Closing & Lockup Checklist SOP",
    seoDescription:
      "Secure your retail store every night with this closing and lockup checklist. Verify fitting room sweeps, safe drops, POS settlement, and alarm arming.",
    sopSteps: [
      {
        stepOrder: 1,
        title: "Lock Entrance & Sweep Restrooms and Fitting Rooms",
        instruction:
          "Lock front doors at closing time, escort remaining customers out, and physically check all fitting rooms, restrooms, and stockrooms to ensure no one is hiding inside.",
        isCritical: true,
      },
      {
        stepOrder: 2,
        title: "Settle POS Terminals & Lock Cash in Drop Safe",
        instruction:
          "Close POS batches, count tills in a camera-covered back office with doors locked, leave drawers open/empty if policy requires, and lock cash in the time-delay safe.",
        isCritical: true,
      },
      {
        stepOrder: 3,
        title: "Verify Back Door Deadbolts & Electrical Shutdown",
        instruction:
          "Confirm receiving bay doors, roof hatches, and emergency exit crash-bars are latched; turn off non-essential displays, irons, or breakroom appliances.",
        isCritical: true,
      },
      {
        stepOrder: 4,
        title: "Set Night Lighting, Arm Alarm & Exit Together",
        instruction:
          "Switch to night-security lighting, arm the intrusion alarm (verify 'Armed' chime), lock the exit door behind the team, and walk to vehicles together.",
        isCritical: true,
      },
    ],
    checklistItems: [
      { label: "All fitting rooms, restrooms, and stockrooms swept for remaining persons", required: true },
      { label: "Front entrance doors and roll-down security shutters locked and latched", required: true },
      { label: "POS terminals settled and cash drawers counted and secured in safe", required: true },
      { label: "Rear receiving doors deadbolted and alarm contacts aligned", required: true },
      { label: "Breakroom appliances, steamers, and non-essential electronics powered off", required: false },
      { label: "Trash removed to exterior dumpster before dark (never exit alone at night)", required: true },
      { label: "Night security lighting on and HVAC set to unoccupied schedule", required: false },
      { label: "Intrusion alarm armed cleanly with zero open zone faults", required: true },
    ],
    faqs: [
      {
        question: "Why should empty cash drawers be left open overnight?",
        answer:
          "Leaving empty register drawers visibly pulled open after cash is moved to the safe deters smash-and-grab burglars from prying open and destroying expensive POS hardware.",
      },
      {
        question: "When should retail trash runs be completed?",
        answer:
          "Complete dumpster runs during daylight hours before closing. Opening back doors after dark is one of the highest-risk moments for retail ambush robberies.",
      },
    ],
  },
  {
    slug: "supermarket-chiller-open-display-temp-log",
    title: "Supermarket Chiller & Open Display Temp Log",
    industry: "Retail & Commercial",
    complianceStandards: ["FDA Food Code", "HACCP", "FSSAI", "ISO 22000"],
    frequency: "daily",
    shortDescription:
      "Multi-zone refrigeration temperature audit for supermarket open-air dairy cases, meat bunkers, and frozen food aisles. Prevents product spoilage and cold-chain violations.",
    seoTitle: "Supermarket Chiller & Open Display Temp Log",
    seoDescription:
      "Log supermarket open-air dairy chillers, meat cases, and frozen aisles daily. Prevent cold-chain spoilage and stay FDA Food Code & FSSAI compliant.",
    sopSteps: [
      {
        stepOrder: 1,
        title: "Check Load-Line Clearance on Open Air-Curtain Cases",
        instruction:
          "Verify dairy, deli, and meat packages are stacked strictly below the manufacturer's red/marked load line so the cold air curtain is never blocked.",
        isCritical: true,
      },
      {
        stepOrder: 2,
        title: "Record Case Temperatures Across All Zones",
        instruction:
          "Log temperatures for fresh meat (-1°C to 2°C), dairy/deli (0°C to 4°C), and frozen aisles (-18°C or below) using calibrated infrared/probe thermometers.",
        isCritical: true,
      },
      {
        stepOrder: 3,
        title: "Inspect Glass Doors, Condenser Grilles & Drain Pans",
        instruction:
          "Confirm freezer doors self-close tightly, honeycomb air vents are free of dust/plastic wrap, and no water is leaking into customer aisles.",
        isCritical: false,
      },
      {
        stepOrder: 4,
        title: "Pull & Quarantine Out-of-Temp Perishables",
        instruction:
          "If any case reads above 5°C (41°F) outside a brief defrost cycle, probe product core temp, relocate safe stock, and quarantine compromised food.",
        isCritical: true,
      },
    ],
    checklistItems: [
      { label: "Fresh meat & poultry cases between -1°C and 2°C (30°F - 36°F)", required: true },
      { label: "Dairy, produce, and grab-and-go chillers between 0°C and 4°C (32°F - 40°F)", required: true },
      { label: "Frozen food & ice cream cases at or below -18°C (0°F)", required: true },
      { label: "All merchandise stacked below the case air-curtain load line", required: true },
      { label: "Case honeycomb air vents clean and unobstructed by price tags or cartons", required: true },
      { label: "Freezer glass doors self-closing properly with intact magnetic gaskets", required: false },
      { label: "No condensation puddles or ice leaks on customer floor in front of cases", required: true },
      { label: "Night blinds/curtains pulled down on open cases after store close", required: false },
    ],
    faqs: [
      {
        question: "Why does stacking above the load line ruin open-display chillers?",
        answer:
          "Open-front supermarket cases rely on a downward curtain of cold air. Stacking products above the load line breaks that air curtain, pulling warm aisle air into the case and spiking food temperatures.",
      },
      {
        question: "How do I tell a normal defrost cycle from a refrigeration failure?",
        answer:
          "A defrost cycle lasts 20–30 minutes and air temp briefly rises while core food temp stays safe. If the case stays warm past 45 minutes or core food exceeds 5°C (41°F), treat it as a failure.",
      },
    ],
  },
  {
    slug: "cash-drawer-pos-safe-reconciliation-check",
    title: "Cash Drawer, POS & Safe Reconciliation Check",
    industry: "Retail & Commercial",
    complianceStandards: ["SOX Internal Controls", "PCI-DSS", "NRF Loss Prevention"],
    frequency: "daily",
    shortDescription:
      "Dual-control cash handling and POS Z-report reconciliation SOP for retail supervisors. Eliminates till shrinkage, counterfeit exposure, and safe discrepancies.",
    seoTitle: "Cash Drawer, POS & Safe Reconciliation Checklist",
    seoDescription:
      "Eliminate retail cash shrinkage with this daily POS, till, and safe reconciliation checklist. Verify Z-reports, counterfeit checks, and dual-control drops.",
    sopSteps: [
      {
        stepOrder: 1,
        title: "Verify Safe Float & Change-Fund Balance",
        instruction:
          "Count all rolled coins, petty cash, and till floats in the main safe at shift change and confirm the total matches the store's fixed change-fund ledger.",
        isCritical: true,
      },
      {
        stepOrder: 2,
        title: "Perform Blind Cash Till Count",
        instruction:
          "Remove each cash drawer to the secured counting room, count bills and coins blind before printing the POS Z-report, and deduct the standard opening float.",
        isCritical: true,
      },
      {
        stepOrder: 3,
        title: "Reconcile POS Tender Totals & Voids/Refunds",
        instruction:
          "Compare counted cash, card batch totals, gift cards, and coupons against the POS tender report; audit all manual voids, no-sales, and cash refunds.",
        isCritical: true,
      },
      {
        stepOrder: 4,
        title: "Seal Bank Deposit Bag & Log Discrepancies",
        instruction:
          "Verify high-denomination bills with a UV/pen counterfeit check, seal deposit in a tamper-evident bank bag, and document any over/short variance over $5.",
        isCritical: true,
      },
    ],
    checklistItems: [
      { label: "Cash counting performed in locked back office under active CCTV coverage", required: true },
      { label: "Opening float verified and separated before counting net cash sales", required: true },
      { label: "POS Z-report / end-of-day batch settlement matches card terminal totals", required: true },
      { label: "All voids, discounts, and cash refunds signed off with original receipts", required: true },
      { label: "High-value bills ($50/$100 or local equivalent) verified for counterfeit features", required: true },
      { label: "Cash over/short variance within acceptable threshold (explain if >$5)", required: true },
      { label: "Bank deposit sealed in serialized tamper-evident bag and logged in safe book", required: true },
      { label: "Safe door spun and locked after reconciliation", required: true },
    ],
    faqs: [
      {
        question: "What is a blind cash count and why is it best practice?",
        answer:
          "In a blind count, the cashier or supervisor counts the physical cash before seeing the POS expected total. This prevents math manipulation and surfaces genuine errors or theft.",
      },
      {
        question: "Why should managers audit 'No-Sale' and void logs daily?",
        answer:
          "Excessive 'No-Sale' drawer opens and post-voids are the #1 indicator of register skimming or sweethearting at the point of sale.",
      },
    ],
  },
  {
    slug: "backroom-stockroom-stacking-ladder-safety",
    title: "Backroom Stockroom Stacking & Ladder Safety",
    industry: "Retail & Commercial",
    complianceStandards: ["OSHA 1910", "NFPA 13", "NIOSH Lifting"],
    frequency: "weekly",
    shortDescription:
      "Weekly warehouse and retail stockroom safety audit covering sprinkler clearance, pallet racking stability, rolling ladder locks, and box-cutter safety.",
    seoTitle: "Retail Stockroom Stacking & Ladder Safety SOP",
    seoDescription:
      "Prevent retail backroom injuries and fire-code fines with this weekly stockroom stacking and ladder safety checklist. Check 18-inch sprinkler clearance.",
    sopSteps: [
      {
        stepOrder: 1,
        title: "Verify 18-Inch Sprinkler Head Clearance",
        instruction:
          "Check all top shelves and pallet stacks to ensure cartons sit at least 45 cm (18 inches) below fire sprinkler deflectors and light fixtures.",
        isCritical: true,
      },
      {
        stepOrder: 2,
        title: "Inspect Heavy Box Stacking & Rack Integrity",
        instruction:
          "Confirm heavy items are stored at waist-to-floor level, no leaning towers exist, and steel racking uprights/beams show no forklift or cart impact damage.",
        isCritical: true,
      },
      {
        stepOrder: 3,
        title: "Test Rolling Ladders & Step Stools",
        instruction:
          "Inspect rolling warehouse ladders for working step-lock brakes, intact rubber feet, non-slip treads, and secure handrails.",
        isCritical: true,
      },
      {
        stepOrder: 4,
        title: "Clear Electrical Panels & Baler Safety",
        instruction:
          "Ensure a 91 cm (36 in) clear zone in front of electrical breaker panels and verify cardboard baler safety gates and emergency-stop buttons work.",
        isCritical: true,
      },
    ],
    checklistItems: [
      { label: "Minimum 45 cm (18 in) clearance maintained below all fire sprinkler heads", required: true },
      { label: "Minimum 91 cm (36 in) clear space in front of all electrical breaker panels", required: true },
      { label: "Heavy/bulky cartons stored on lower shelves; light items on top shelves", required: true },
      { label: "Rolling ladders have working wheel-lock brakes, handrails, and non-slip steps", required: true },
      { label: "Stockroom aisles clear of loose shrink wrap, empty pallets, and strapping", required: true },
      { label: "Only approved auto-retracting safety box cutters in use", required: false },
      { label: "Cardboard baler interlock gate, key control, and E-stop functioning", required: true },
      { label: "Chemical cleaning supplies stored on lower shelves away from food/merchandise", required: true },
    ],
    faqs: [
      {
        question: "Why is the 18-inch sprinkler clearance rule strictly enforced?",
        answer:
          "Under NFPA 13 and OSHA 1910.159, stacking boxes closer than 18 inches to sprinkler heads blocks the water spray cone during a fire, allowing flames to spread unchecked.",
      },
      {
        question: "What is the required clearance in front of retail electrical panels?",
        answer:
          "OSHA 1910.303 requires at least 36 inches (91 cm) of unobstructed working space in front of electrical panels—never lean mops, ladders, or stock against them.",
      },
    ],
  },
  {
    slug: "visual-merchandising-endcap-display-audit",
    title: "Visual Merchandising & Endcap Display Audit",
    industry: "Retail & Commercial",
    complianceStandards: ["Brand Merchandising SOP", "OSHA", "ADA Accessibility"],
    frequency: "weekly",
    shortDescription:
      "Weekly store presentation and compliance audit for promotional endcaps, mannequin zones, and pricing signage. Ensures accurate promos, clean fixtures, and ADA aisle width.",
    seoTitle: "Visual Merchandising & Endcap Display Audit SOP",
    seoDescription:
      "Keep promotional endcaps sharp, accurately priced, and ADA-compliant with this weekly visual merchandising audit checklist for retail stores.",
    sopSteps: [
      {
        stepOrder: 1,
        title: "Verify Promotional Signage & Price Accuracy",
        instruction:
          "Cross-check all endcap headers, sale toppers, and shelf talkers against current weekly promo dates and scan sample items to confirm POS prices match.",
        isCritical: true,
      },
      {
        stepOrder: 2,
        title: "Front-Face Stock & Eliminate Out-of-Stocks",
        instruction:
          "Pull merchandise forward (finger-spaced/front-faced), replace empty pegs with backup stock or approved flex-fill, and remove damaged packaging.",
        isCritical: false,
      },
      {
        stepOrder: 3,
        title: "Check Display Stability & ADA Aisle Width",
        instruction:
          "Ensure freestanding dump bins, floor stands, and mannequins are weighted/stable and leave at least 91 cm (36 in) clear aisle width for wheelchairs.",
        isCritical: true,
      },
      {
        stepOrder: 4,
        title: "Inspect Accent Lighting & Fixture Cleanliness",
        instruction:
          "Replace burnt-out track spotlights, dust glass shelves, and verify power cords for illuminated displays are concealed and trip-free.",
        isCritical: false,
      },
    ],
    checklistItems: [
      { label: "Current promotional signage matches active campaign dates with zero expired tags", required: true },
      { label: "Shelf price tags match POS scanner price on spot-checked promo SKUs", required: true },
      { label: "Endcaps fully stocked, front-faced, and free of crushed or dusty cartons", required: false },
      { label: "Freestanding displays stable and not encroaching on 91 cm (36 in) ADA aisles", required: true },
      { label: "Mannequins dressed to planogram with clean garments and secure bases", required: false },
      { label: "Track lighting and illuminated display headers working with no burnt bulbs", required: false },
      { label: "Security tethers/spider wraps attached on high-value endcap electronics", required: true },
      { label: "No exposed extension cords or sharp fixture edges at customer height", required: true },
    ],
    faqs: [
      {
        question: "Why is price-tag accuracy on endcaps a legal compliance issue?",
        answer:
          "Weights and measures regulations in most jurisdictions fine retailers if shelf or endcap promotional signs show a lower price than what rings up at the POS register.",
      },
      {
        question: "How much aisle width must be kept clear around promotional floor stands?",
        answer:
          "ADA accessibility standards require a minimum 36-inch (91 cm) continuous clear path of travel so wheelchair users and strollers can navigate without obstruction.",
      },
    ],
  },
  {
    slug: "retail-fire-exit-emergency-aisle-check",
    title: "Retail Fire Exit & Emergency Aisle Check",
    industry: "Retail & Commercial",
    complianceStandards: ["OSHA 1910.37", "NFPA 101", "NFPA 10", "Local Fire Code"],
    frequency: "daily",
    shortDescription:
      "Daily life-safety walkthrough verifying all retail emergency exits, panic hardware, fire extinguishers, and egress corridors remain unlocked and 100% unobstructed.",
    seoTitle: "Retail Fire Exit & Emergency Aisle Check SOP",
    seoDescription:
      "Stay OSHA and NFPA 101 compliant with this daily retail fire exit and emergency aisle checklist. Verify unlocked panic bars, lit exit signs, and clear paths.",
    sopSteps: [
      {
        stepOrder: 1,
        title: "Verify Exit Doors Unlock With Single Motion",
        instruction:
          "Inspect every rear and side fire exit to confirm zero padlocks, chains, or slide bolts are attached and panic push-bars operate freely.",
        isCritical: true,
      },
      {
        stepOrder: 2,
        title: "Walk Interior & Exterior Egress Paths",
        instruction:
          "Confirm corridors leading to exits are completely free of rolling racks, cardboard bales, or seasonal displays, and exterior exit pads are clear of dumpsters or snow.",
        isCritical: true,
      },
      {
        stepOrder: 3,
        title: "Check Illuminated Exit Signs & Emergency Lights",
        instruction:
          "Confirm every EXIT sign is lit (press battery test button monthly) and emergency twin-head floodlights have green AC power indicators.",
        isCritical: true,
      },
      {
        stepOrder: 4,
        title: "Inspect Fire Extinguisher Access & Pressure Gauges",
        instruction:
          "Verify extinguishers are mounted visibly, unobstructed, have pressure needles in the green zone, and intact tamper seals.",
        isCritical: true,
      },
    ],
    checklistItems: [
      { label: "All fire exit doors unlocked from inside with zero chains, padlocks, or bars", required: true },
      { label: "Panic hardware push-bars intact and functioning smoothly", required: true },
      { label: "Interior egress aisles at least 91 cm - 112 cm wide and 100% unobstructed", required: true },
      { label: "Exterior side of fire exit doors clear of pallets, vehicles, or dumpsters", required: true },
      { label: "Illuminated EXIT signs lit and clearly visible from sales floor and stockroom", required: true },
      { label: "Fire extinguishers accessible, gauge in green zone, and annual tag current", required: true },
      { label: "Fire alarm manual pull stations unobstructed and clearly marked", required: true },
      { label: "Emergency assembly point map posted in staff breakroom", required: false },
    ],
    faqs: [
      {
        question: "Can a retail store lock its rear fire exit with a deadbolt during business hours to stop shoplifting?",
        answer:
          "No. Locking an emergency exit so it requires a key or special knowledge to open during occupied hours is a severe OSHA and NFPA 101 violation. Use alarmed panic bars instead.",
      },
      {
        question: "What is the most common reason stores fail fire marshal inspections?",
        answer:
          "Blocking rear exit corridors with overstock U-boats, seasonal cardboard displays, or stacked pallets during busy delivery days.",
      },
    ],
  },
  {
    slug: "in-store-bakery-deli-counter-hygiene-sop",
    title: "In-Store Bakery & Deli Counter Hygiene SOP",
    industry: "Retail & Commercial",
    complianceStandards: ["FDA Food Code", "HACCP", "FSSAI", "OSHA"],
    frequency: "daily",
    shortDescription:
      "Daily food safety and sanitation SOP for supermarket in-store bakeries, sandwich bars, and deli slicers. Covers slicer sanitization, hot-holding temps, and allergen labeling.",
    seoTitle: "In-Store Bakery & Deli Counter Hygiene Checklist",
    seoDescription:
      "Maintain strict food safety at your supermarket bakery and deli counter. Track slicer 4-hour sanitization, hot-holding (60°C+), and allergen labels.",
    sopSteps: [
      {
        stepOrder: 1,
        title: "Sanitize Deli Slicers & Track 4-Hour Timer",
        instruction:
          "Disassemble, wash, rinse, and sanitize meat/cheese slicers before opening and every 4 hours during continuous operation; wear cut-resistant gloves during blade cleaning.",
        isCritical: true,
      },
      {
        stepOrder: 2,
        title: "Verify Hot-Holding & Cold-Well Temperatures",
        instruction:
          "Probe rotisserie chicken and hot deli items to confirm ≥60°C (140°F) and cold salad wells to confirm ≤4°C (40°F).",
        isCritical: true,
      },
      {
        stepOrder: 3,
        title: "Audit Bakery Display Case & Tongs/Tissue Access",
        instruction:
          "Ensure self-serve bakery doors close cleanly, tongs/wax tissues are stocked, and sneeze guards are wiped spotless.",
        isCritical: false,
      },
      {
        stepOrder: 4,
        title: "Check Allergen & Sell-By Labeling Compliance",
        instruction:
          "Verify all packaged baked goods and deli salads list major allergens (milk, eggs, wheat, nuts, soy, sesame) and accurate sell-by dates.",
        isCritical: true,
      },
    ],
    checklistItems: [
      { label: "Deli slicers washed, rinsed, and sanitized every 4 hours (cut-resistant gloves worn)", required: true },
      { label: "Hot-holding cases (rotisserie, soups) holding food at ≥60°C (135°F/140°F)", required: true },
      { label: "Cold deli & salad bar wells holding food at ≤4°C (40°F)", required: true },
      { label: "Staff wearing hairnets, beard nets (if applicable), clean aprons, and gloves", required: true },
      { label: "Dedicated utensils used for ready-to-eat items; zero bare-hand contact", required: true },
      { label: "All packaged bakery/deli items labeled with ingredients, allergens, and sell-by date", required: true },
      { label: "Bakery display glass, sneeze guards, and self-serve tongs clean and stocked", required: false },
      { label: "Three-compartment sink sanitizer tested at 200 ppm quat or 50-100 ppm chlorine", required: true },
    ],
    faqs: [
      {
        question: "How often must a commercial deli meat slicer be broken down and sanitized?",
        answer:
          "Under FDA Food Code rules, food-contact equipment used with TCS foods (like deli meat and cheese) at room temperature must be disassembled, washed, rinsed, and sanitized at least every 4 hours.",
      },
      {
        question: "What PPE is required when cleaning a deli slicer blade?",
        answer:
          "Employees must unplug the slicer, set the gauge plate to zero, and wear cut-resistant (Kevlar or steel-mesh) gloves underneath disposable food-service gloves.",
      },
    ],
  },
  {
    slug: "fitting-room-safety-cleanliness-audit",
    title: "Fitting Room Safety & Cleanliness Audit",
    industry: "Retail & Commercial",
    complianceStandards: ["NRF Loss Prevention", "OSHA", "ADA Accessibility"],
    frequency: "daily",
    shortDescription:
      "Daily mid-shift and closing audit for apparel fitting rooms. Ensures pin-free floors, intact privacy locks, ADA bench readiness, and zero concealed tag-removal debris.",
    seoTitle: "Retail Fitting Room Safety & Cleanliness Audit SOP",
    seoDescription:
      "Keep apparel fitting rooms safe, clean, and shrink-free with this daily QR audit. Check pin-free floors, door latches, mirrors, and ADA stall readiness.",
    sopSteps: [
      {
        stepOrder: 1,
        title: "Sweep Floors for Pins, Tags & Sharp Hazards",
        instruction:
          "Vacuum or sweep all stalls to remove straight pins, plastic tag barbs, broken hangers, and discarded security tags (EAS pins).",
        isCritical: true,
      },
      {
        stepOrder: 2,
        title: "Test Stall Door Latches, Hooks & Mirrors",
        instruction:
          "Verify privacy locks engage smoothly, coat hooks are tightly screwed in, and full-length mirrors are clean and securely mounted with zero cracks.",
        isCritical: true,
      },
      {
        stepOrder: 3,
        title: "Check ADA Accessible Stall & Lighting",
        instruction:
          "Confirm the wheelchair-accessible fitting stall is unlocked/ready, bench is sturdy, grab bars are tight, and overhead lights are bright.",
        isCritical: false,
      },
      {
        stepOrder: 4,
        title: "Clear Go-Backs & Inspect for Concealment",
        instruction:
          "Remove all abandoned garments to the recovery rack, check behind benches or ceiling tiles for detached EAS tags, and verify item-count signage.",
        isCritical: true,
      },
    ],
    checklistItems: [
      { label: "Floors vacuumed and free of straight pins, tag fasteners, and sharp debris", required: true },
      { label: "All stall door latches and privacy locks working properly", required: true },
      { label: "Mirrors clean, smudge-free, and securely anchored to walls", required: false },
      { label: "Wall hooks and seating benches sturdy with no loose screws", required: false },
      { label: "ADA accessible stall clear of go-back racks and ready for use", required: true },
      { label: "Zero detached EAS security tags, foil-lined bags, or empty packaging hidden", required: true },
      { label: "Abandoned merchandise cleared and returned to sales floor", required: false },
      { label: "Lighting operational and air circulation comfortable in all stalls", required: false },
    ],
    faqs: [
      {
        question: "Why should retail staff inspect fitting rooms frequently for detached security tags?",
        answer:
          "Shoplifters often hide detached EAS tags or empty packaging behind benches or under seats. Frequent sweeps deter theft and help loss prevention spot patterns early.",
      },
      {
        question: "What makes a retail fitting room ADA compliant?",
        answer:
          "An accessible fitting room requires a 60-inch turning circle (or T-turn), a 32-inch clear doorway, a fixed bench at 17–19 inches height, and a full-length mirror visible from a seated position.",
      },
    ],
  },
  {
    slug: "mall-kiosk-daily-opening-power-check",
    title: "Mall Kiosk Daily Opening & Power Check",
    industry: "Retail & Commercial",
    complianceStandards: ["NFPA 70 (NEC)", "Mall Management SOP", "OSHA", "PCI-DSS"],
    frequency: "daily",
    shortDescription:
      "Daily opening, electrical safety, and security check for shopping mall kiosks and pop-up carts. Verifies GFCI power cords, kiosk perimeter clearance, and lockbox security.",
    seoTitle: "Mall Kiosk Daily Opening & Power Check SOP",
    seoDescription:
      "Run a smooth mall kiosk opening with this daily QR checklist. Verify floor cord covers, surge protectors, mall corridor clearance, and POS readiness.",
    sopSteps: [
      {
        stepOrder: 1,
        title: "Unlock Roll-Down Covers & Inspect Glass Cases",
        instruction:
          "Remove overnight security tarps or locking panels, store them neatly inside base cabinets, and inspect glass showcases for cracks or tampering.",
        isCritical: true,
      },
      {
        stepOrder: 2,
        title: "Inspect Power Cords, Surge Strips & GFCI Outlets",
        instruction:
          "Verify all power cords run cleanly through mall floor boxes with heavy-duty cord covers (no daisy-chained power strips or frayed wires).",
        isCritical: true,
      },
      {
        stepOrder: 3,
        title: "Verify Mall Fire-Lane & Lease-Line Clearance",
        instruction:
          "Ensure A-frame signs, display spinners, and stools stay strictly inside the leased footprint so mall emergency egress corridors remain clear.",
        isCritical: true,
      },
      {
        stepOrder: 4,
        title: "Boot Cellular/Wi-Fi POS & Count Cash Till",
        instruction:
          "Power on tablet POS, test cellular/Wi-Fi signal, inspect card reader for tampering, count opening float, and confirm fire extinguisher is stowed inside kiosk.",
        isCritical: false,
      },
    ],
    checklistItems: [
      { label: "Kiosk security covers/shutters unlocked and stowed safely out of sight", required: false },
      { label: "No daisy-chained extension cords; UL-listed surge protector plugged into floor box", required: true },
      { label: "All visible floor cords secured under bevel-edged cable protectors", required: true },
      { label: "Displays and signage kept strictly within mall lease-line boundary", required: true },
      { label: "POS tablet, barcode scanner, and card reader powered and connected", required: true },
      { label: "Opening cash float counted and register drawer locked when unattended", required: true },
      { label: "Compact ABC fire extinguisher accessible inside kiosk cabinet", required: true },
      { label: "Glass showcases wiped clean and high-value drawers locked", required: false },
    ],
    faqs: [
      {
        question: "Why do mall fire marshals strictly ban daisy-chained power strips in kiosks?",
        answer:
          "Plugging one power strip into another overloads circuit amperage and creates heat buildup inside enclosed wooden kiosk cabinets, violating NEC/NFPA 70 fire codes.",
      },
      {
        question: "What happens if a kiosk places A-frame signs outside its lease line?",
        answer:
          "Mall operations and fire inspectors issue immediate lease violations because protruding displays narrow the common-area fire egress corridor.",
      },
    ],
  },
];
