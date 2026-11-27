import type { SeoTemplate } from "./types";

export const CONSTRUCTION_TEMPLATES: SeoTemplate[] = [
  {
    slug: "scaffolding-erection-tagging-inspection",
    title: "Scaffolding Erection & Tagging Inspection",
    industry: "Construction",
    complianceStandards: ["OSHA 1926.451", "OSHA 1926.454", "ANSI/ASSE A10.8"],
    frequency: "daily",
    shortDescription:
      "Competent-person daily inspection for supported and tubular frame scaffolding covering mudsills, plumbness, full decking, guardrails, and scaffold tag status.",
    seoTitle: "Scaffolding Erection & Tagging Inspection Checklist (OSHA)",
    seoDescription:
      "OSHA 1926.451 scaffolding erection and tagging inspection checklist. Verify base plates, mudsills, cross-bracing, guardrails, and green/yellow/red tags.",
    sopSteps: [
      {
        stepOrder: 1,
        title: "Inspect Foundation, Mudsills & Base Plates",
        instruction:
          "Verify scaffold legs rest on level, compacted ground or concrete with proper timber mudsills and steel base plates (never on loose bricks, buckets, or hollow blocks).",
        isCritical: true,
      },
      {
        stepOrder: 2,
        title: "Check Plumbness, Bracing & Building Ties",
        instruction:
          "Confirm standards are plumb, all cross-braces and locking pins are engaged, and tie-ins to the structure meet the 4:1 height-to-base-width ratio requirement.",
        isCritical: true,
      },
      {
        stepOrder: 3,
        title: "Verify Working Platforms, Guardrails & Toe-Boards",
        instruction:
          "Ensure platforms are fully planked with scaffold-grade lumber (no gaps >1 inch), top rails sit at 38–45 inches, mid-rails are installed, and toe-boards are secured.",
        isCritical: true,
      },
      {
        stepOrder: 4,
        title: "Check Safe Access Ladder & Overhead Clearance",
        instruction:
          "Confirm dedicated access ladders or stair towers are securely attached (no climbing cross-braces) and maintain at least 10 feet clearance from energized power lines.",
        isCritical: true,
      },
      {
        stepOrder: 5,
        title: "Update & Sign Scaffold Inspection Tag",
        instruction:
          "Affix or update the Green (Safe), Yellow (Modified/Harness Required), or Red (Do Not Use) tag at all access points with inspector signature, date, and time.",
        isCritical: true,
      },
    ],
    checklistItems: [
      { label: "Mudsills and base plates level on firm, stable ground (no blocks/bricks)", required: true },
      { label: "Scaffold plumb and all cross-braces, pins, and couplers locked", required: true },
      { label: "Wall ties/outriggers installed per height-to-base ratio (4:1)", required: true },
      { label: "Working decks fully planked with cleated/secured scaffold planks", required: true },
      { label: "Top guardrails (38–45 in.), mid-rails, and toe-boards installed on all open sides", required: true },
      { label: "Dedicated access ladder/stairway secured with 3-ft extension above landing", required: true },
      { label: "Minimum 10-ft clearance maintained from overhead electrical lines", required: true },
      { label: "No overloaded materials or debris accumulated on platforms", required: false },
      { label: "Scaffold tag signed, dated, and color-coded at every entry point", required: true },
    ],
    faqs: [
      {
        question: "When must a scaffold be inspected on a construction site?",
        answer:
          "OSHA 1926.451(f)(3) requires a competent person to inspect scaffolds for visible defects before each work shift and after any occurrence (such as high winds, impact, or modification) that could affect structural integrity.",
      },
      {
        question: "What do Green, Yellow, and Red scaffold tags mean?",
        answer:
          "Green means the scaffold is complete and safe for use; Yellow means it has been modified or lacks full guardrails so specific precautions (like 100% fall arrest tie-off) apply; Red means incomplete or unsafe—do not climb.",
      },
    ],
  },
  {
    slug: "excavator-daily-pre-start-walkaround",
    title: "Excavator Daily Pre-Start & Walkaround",
    industry: "Construction",
    complianceStandards: ["OSHA 1926.602", "ISO 20474", "ANSI/ASSE A10.11"],
    frequency: "daily",
    shortDescription:
      "Pre-shift 360-degree walkaround and cab function check for hydraulic excavators covering undercarriage, boom/bucket pins, hydraulic leaks, and swing alarms.",
    seoTitle: "Excavator Daily Pre-Start & Walkaround Checklist",
    seoDescription:
      "Free excavator daily pre-start and walkaround inspection checklist. Check tracks, hydraulic hoses, bucket pins, ROPS cab, backup alarm, and fluid levels.",
    sopSteps: [
      {
        stepOrder: 1,
        title: "Perform 360° Undercarriage & Structural Walkaround",
        instruction:
          "Inspect track pads, idlers, sprockets, and track tension. Look for cracked welds on the boom, stick, and quick-coupler, and check bucket teeth and retaining pins.",
        isCritical: true,
      },
      {
        stepOrder: 2,
        title: "Check Engine Oil, Coolant, DEF & Hydraulic Fluid",
        instruction:
          "With the machine on level ground and arm positioned per OEM chart, verify engine oil, coolant, fuel/water separator, and hydraulic sight-glass levels.",
        isCritical: false,
      },
      {
        stepOrder: 3,
        title: "Inspect Hydraulic Cylinders, Hoses & Quick-Coupler Lock",
        instruction:
          "Check all boom, arm, and bucket cylinders for rod scoring or seal leaks. If equipped with a hydraulic quick-coupler, verify the secondary safety pin/lock engages fully.",
        isCritical: true,
      },
      {
        stepOrder: 4,
        title: "Verify Cab Safety, Controls & Alarms",
        instruction:
          "Clean cab glass and mirrors, fasten seatbelt, test hydraulic lockout lever, sound the horn, and verify travel/backup alarm and rotating beacon operate.",
        isCritical: true,
      },
    ],
    checklistItems: [
      { label: "Tracks, rollers, idlers, and final drives free of damage or loose bolts", required: true },
      { label: "Boom, stick, and bucket welds free of cracks; teeth and pins secure", required: true },
      { label: "Quick-coupler locking mechanism tested and secondary safety pin engaged", required: true },
      { label: "Hydraulic hoses and cylinder seals free of leaks or abrasion", required: true },
      { label: "Engine oil, hydraulic fluid, and coolant levels within normal range", required: false },
      { label: "ROPS cab glass clean, mirrors adjusted, and seatbelt functional", required: true },
      { label: "Hydraulic safety lockout lever disables all joysticks when raised", required: true },
      { label: "Horn, travel/backup alarm, and strobe beacon working properly", required: true },
      { label: "Fire extinguisher mounted in cab and inspection tag current", required: false },
    ],
    faqs: [
      {
        question: "Why is testing the excavator quick-coupler lock critical every shift?",
        answer:
          "Improperly latched quick-couplers are a leading cause of fatal struck-by accidents when buckets detach mid-swing. Operators must visually confirm the locking pin and perform a ground curl-test before working near personnel.",
      },
      {
        question: "What should you do if a hydraulic hose shows steel braid or weeping?",
        answer:
          "Tag the excavator out of service immediately. High-pressure hydraulic oil pinholes can inject fluid through skin, and a burst hose during a lift can drop the boom uncontrollably.",
      },
    ],
  },
  {
    slug: "tower-crane-daily-safety-load-check",
    title: "Tower Crane Daily Safety & Load Check",
    industry: "Construction",
    complianceStandards: ["OSHA 1926.1412", "ASME B30.3", "ISO 12480"],
    frequency: "daily",
    shortDescription:
      "Mandatory daily pre-operation inspection for tower cranes covering anemometer wind speed, load moment indicator (LMI), anti-two-block, hoist ropes, and slewing brakes.",
    seoTitle: "Tower Crane Daily Safety & Load Check SOP (OSHA 1926)",
    seoDescription:
      "OSHA 1926.1412 tower crane daily safety and load check checklist. Verify anemometer wind limits, LMI calibration, anti-two-block, hoist ropes, and rigging.",
    sopSteps: [
      {
        stepOrder: 1,
        title: "Check Wind Speed & Weather Conditions",
        instruction:
          "Read the masthead anemometer and verify current and forecasted wind speeds are below the crane manufacturer's out-of-service limit (typically 20–35 mph depending on sail area).",
        isCritical: true,
      },
      {
        stepOrder: 2,
        title: "Inspect Mast Bolts, Base Anchor & Slewing Ring",
        instruction:
          "Visually check base foundation/anchor bolts for water pooling or movement, verify mast climbing-collar/tie-in pins, and listen for abnormal noise on slewing ring rotation.",
        isCritical: true,
      },
      {
        stepOrder: 3,
        title: "Test Load Moment Indicator (LMI) & Anti-Two-Block",
        instruction:
          "Power on the LMI/rated capacity limiter, confirm radius and load readouts respond accurately, and test the anti-two-block weight/switch at the jib tip.",
        isCritical: true,
      },
      {
        stepOrder: 4,
        title: "Inspect Wire Ropes, Trolley, Hook & Radio Comms",
        instruction:
          "Run the trolley along the jib while inspecting hoist and trolley ropes for kinks or broken strands; verify hook latch and clear two-way radio communication with the signalperson.",
        isCritical: true,
      },
    ],
    checklistItems: [
      { label: "Wind speed within safe operating limits on masthead anemometer", required: true },
      { label: "Load Moment Indicator (LMI) / capacity limiter active with no fault codes", required: true },
      { label: "Anti-two-block (A2B) device tested and cuts hoist-up motion", required: true },
      { label: "Hoist, trolley, and pendant wire ropes free of kinks or broken wires", required: true },
      { label: "Hook block, sheave guards, and safety latch intact and rotating freely", required: true },
      { label: "Hoist, trolley, and slewing brakes hold smoothly without drift", required: true },
      { label: "Load chart legible in cab and matched to current jib/counterweight setup", required: true },
      { label: "Two-way radio communication tested with certified rigger/signalperson", required: true },
      { label: "Aviation obstruction lights and perimeter swing-zone alarms operational", required: false },
    ],
    faqs: [
      {
        question: "At what wind speed must a tower crane cease operations?",
        answer:
          "Always follow the specific crane manufacturer's manual, as limits vary by jib length and load sail area. Most tower cranes restrict high-sail lifts around 20 mph and require weathervaning (slewing brake released) around 35–45 mph.",
      },
      {
        question: "Who is authorized to perform the daily shift inspection on a tower crane?",
        answer:
          "Under OSHA 1926.1412(d), a competent person (typically the certified crane operator or qualified technician) must inspect the crane before each shift.",
      },
    ],
  },
  {
    slug: "construction-site-ppe-compliance-audit",
    title: "Construction Site PPE Compliance Audit",
    industry: "Construction",
    complianceStandards: ["OSHA 1926.95", "ANSI/ISEA Z89.1", "ANSI/ISEA Z87.1"],
    frequency: "daily",
    shortDescription:
      "Daily site-wide personal protective equipment (PPE) audit verifying hard hats, high-visibility vests, eye/hearing protection, and task-specific respirators or gloves.",
    seoTitle: "Construction Site PPE Compliance Audit Checklist",
    seoDescription:
      "Free construction site PPE compliance audit checklist. Verify ANSI hard hats, safety glasses, hi-vis vests, steel-toe boots, and silica/welding PPE.",
    sopSteps: [
      {
        stepOrder: 1,
        title: "Verify Mandatory Baseline PPE at Site Entry",
        instruction:
          "Confirm all workers, subcontractors, and visitors wear ANSI Z89.1 hard hats, ANSI Z87.1 side-shield safety glasses, Class 2/3 hi-vis vests, and ASTM-rated safety footwear.",
        isCritical: true,
      },
      {
        stepOrder: 2,
        title: "Audit Task-Specific Hand, Hearing & Respiratory PPE",
        instruction:
          "Check that concrete/masonry crews wear N95/P100 respirators during dry cutting, grinders wear full face shields over safety glasses, and high-decibel zones use ear protection.",
        isCritical: true,
      },
      {
        stepOrder: 3,
        title: "Inspect PPE Condition & Expiration",
        instruction:
          "Spot-check hard hat suspension straps and shell dates, ensure safety glasses are not scratched/opaque, and verify cut-resistant gloves are free of tears.",
        isCritical: false,
      },
      {
        stepOrder: 4,
        title: "Correct Non-Compliance & Restock PPE Station",
        instruction:
          "Coach or pause workers missing required PPE immediately, log any repeat contractor violations, and restock disposable earplugs, dust masks, and visitor gear at the site gate.",
        isCritical: true,
      },
    ],
    checklistItems: [
      { label: "All personnel wearing undamaged ANSI Z89.1 hard hats (no reverse-wear unless rated)", required: true },
      { label: "ANSI Z87.1 safety glasses with side shields worn by 100% of field crew", required: true },
      { label: "High-visibility Class 2 or Class 3 vests/shirts worn near equipment/traffic", required: true },
      { label: "ASTM F2413 protective-toe boots worn on site (no sneakers or open shoes)", required: true },
      { label: "Full face shields worn over safety glasses during grinding/cutting", required: true },
      { label: "Hearing protection worn in >85 dBA zones (jackhammers, saws, pile drivers)", required: false },
      { label: "Fit-tested respirators worn for silica dust, painting, or confined spaces", required: true },
      { label: "Cut-resistant or task-appropriate gloves worn during material handling", required: false },
    ],
    faqs: [
      {
        question: "Can workers wear a hard hat backwards on a construction site?",
        answer:
          "Only if the hard hat is explicitly marked by the manufacturer with the reverse-donning symbol (two curved arrows) and the suspension is rotated properly. Otherwise, reverse wear compromises impact protection.",
      },
      {
        question: "Are sunglasses allowed instead of safety glasses outdoors?",
        answer:
          "Only if the tinted eyewear is explicitly stamped ANSI Z87.1+ with side shields. Standard consumer sunglasses shatter on impact and are prohibited on construction sites.",
      },
    ],
  },
  {
    slug: "trenching-excavation-shoring-inspection",
    title: "Trenching & Excavation Shoring Inspection",
    industry: "Construction",
    complianceStandards: ["OSHA 1926.651", "OSHA 1926.652", "ANSI/ASSE A10.12"],
    frequency: "daily",
    shortDescription:
      "Competent-person daily inspection for trenches and excavations over 4–5 feet deep covering soil classification, trench boxes/shoring, spoil-pile setbacks, and egress ladders.",
    seoTitle: "Trenching & Excavation Shoring Inspection Checklist (OSHA)",
    seoDescription:
      "OSHA 1926.651 trenching and excavation shoring checklist. Verify soil type, trench box seating, 2-ft spoil setback, water accumulation, and egress ladders.",
    sopSteps: [
      {
        stepOrder: 1,
        title: "Verify Utility Locates & Atmospheric Testing",
        instruction:
          "Confirm 811/utility locate marks are visible and respected. For trenches ≥4 ft deep near sewers, landfills, or fuel lines, test oxygen, LEL, H2S, and CO with a calibrated 4-gas meter.",
        isCritical: true,
      },
      {
        stepOrder: 2,
        title: "Inspect Soil Walls & Protective Systems (Slope/Shore/Shield)",
        instruction:
          "Check trench walls for tension cracks, sloughing, or bulging. For excavations ≥5 ft deep, verify sloping, benching, hydraulic shoring, or trench boxes match the soil classification.",
        isCritical: true,
      },
      {
        stepOrder: 3,
        title: "Check Spoil Pile Setback & Surface Loads",
        instruction:
          "Confirm excavated dirt, tools, and heavy equipment are kept at least 2 feet back from the trench edge, and verify no vibration from nearby traffic undermines the wall.",
        isCritical: true,
      },
      {
        stepOrder: 4,
        title: "Verify Water Control & Safe Egress Ladders",
        instruction:
          "Ensure dewatering pumps are operating if water is present, and confirm an egress ladder or ramp is positioned within 25 feet of lateral travel for every worker in trenches ≥4 ft.",
        isCritical: true,
      },
    ],
    checklistItems: [
      { label: "Underground utility locates current and hand-dug potholing completed", required: true },
      { label: "Protective system (sloping, shoring, or trench box) installed for depth ≥5 ft", required: true },
      { label: "Trench walls free of fissures, undercutting, bulging, or water seepage", required: true },
      { label: "Spoil piles, materials, and tools placed at least 2 ft back from trench edge", required: true },
      { label: "Egress ladder/ramp within 25 ft of all workers and extending 3 ft above lip", required: true },
      { label: "4-gas atmospheric testing completed and logged (where hazards may exist)", required: true },
      { label: "Dewatering pumps active with no standing water undermining shoring", required: false },
      { label: "Perimeter barricades or warning tape installed to prevent fall-in hazards", required: true },
    ],
    faqs: [
      {
        question: "At what trench depth does OSHA require cave-in protection?",
        answer:
          "OSHA 1926.652 requires protective systems (sloping, benching, shoring, or shielding) for all excavations 5 feet (1.5 m) deep or greater, or shallower if a competent person sees signs of potential cave-in.",
      },
      {
        question: "How far can a worker be from a trench ladder?",
        answer:
          "Under OSHA 1926.651(c)(2), a stairway, ladder, or ramp must be located in trenches 4 feet or deeper so that no worker has to travel more than 25 feet laterally to reach safe egress.",
      },
    ],
  },
  {
    slug: "concrete-mixer-pump-safety-check",
    title: "Concrete Mixer & Pump Safety Check",
    industry: "Construction",
    complianceStandards: ["OSHA 1926.702", "ASME B30.27", "ACPA Safety"],
    frequency: "daily",
    shortDescription:
      "Pre-pour safety inspection for boom/line concrete pumps and ready-mix trucks covering outrigger cribbing, boom pipe thickness, hopper grates, and power-line clearance.",
    seoTitle: "Concrete Mixer & Pump Safety Check SOP (ASME B30.27)",
    seoDescription:
      "Concrete mixer and boom pump pre-pour safety checklist. Verify outrigger cribbing, hopper grate interlocks, delivery pipe clamps, and power-line clearance.",
    sopSteps: [
      {
        stepOrder: 1,
        title: "Inspect Ground Bearing & Outrigger Cribbing",
        instruction:
          "Verify the concrete pump is parked on firm, level ground away from trenches/vaults. Extend outriggers fully onto engineered cribbing pads sized for maximum leg load.",
        isCritical: true,
      },
      {
        stepOrder: 2,
        title: "Verify Overhead Power Line Clearance",
        instruction:
          "Confirm boom swing envelope maintains at least 20 feet (or OSHA Table A distance) from all overhead power lines and assign a dedicated spotter if working near energized lines.",
        isCritical: true,
      },
      {
        stepOrder: 3,
        title: "Inspect Hopper Grate, Pipe Clamps & Safety Chains",
        instruction:
          "Verify the concrete hopper grate is closed and its interlock stops the agitator when lifted. Check all Victaulic/pipeline couplings for safety pins and whip-check cables at rubber hose connections.",
        isCritical: true,
      },
      {
        stepOrder: 4,
        title: "Check Hose Handler PPE & Communication",
        instruction:
          "Ensure the hose crew wears eye protection, long sleeves, and rubber boots (alkali burn prevention), and verify clear hand/radio signals with the pump operator before priming.",
        isCritical: false,
      },
    ],
    checklistItems: [
      { label: "Outriggers fully extended on properly sized cribbing pads away from excavations", required: true },
      { label: "Minimum 20-ft clearance verified between pump boom and overhead power lines", required: true },
      { label: "Hopper grate closed, undamaged, and safety interlock switch functional", required: true },
      { label: "All delivery pipe clamps pinned and rubber end-hose secured with whip-check", required: true },
      { label: "Boom pipe wall thickness and elbows free of dents, cracks, or leaks", required: true },
      { label: "Remote control E-stop tested and operator wearing harness if required", required: true },
      { label: "Hose crew wearing alkali-resistant boots, gloves, and ANSI safety glasses", required: false },
      { label: "Washout pit/containment lined and positioned away from storm drains", required: false },
    ],
    faqs: [
      {
        question: "Why must a concrete pump hose never be kinked or stood astride?",
        answer:
          "Blockages create extreme hydraulic pressure in the delivery line; a sudden release or kinked rubber end-hose can whip violently and cause severe blunt-force trauma.",
      },
      {
        question: "What PPE is required when pouring wet concrete?",
        answer:
          "Wet Portland cement is highly alkaline (pH 12–13) and causes severe chemical burns. Workers need waterproof rubber boots, alkali-resistant gloves, long pants/sleeves, and eye protection.",
      },
    ],
  },
  {
    slug: "fall-protection-harness-anchor-inspection",
    title: "Fall Protection Harness & Anchor Inspection",
    industry: "Construction",
    complianceStandards: ["OSHA 1926.502", "ANSI/ASSP Z359.11", "ISO 45001"],
    frequency: "daily",
    shortDescription:
      "Pre-use inspection of full-body harnesses, energy-absorbing lanyards, self-retracting lifelines (SRLs), and 5,000-lb anchor points prior to working at heights ≥6 feet.",
    seoTitle: "Fall Protection Harness & Anchor Inspection Checklist",
    seoDescription:
      "ANSI Z359 & OSHA 1926.502 fall protection harness and anchor inspection checklist. Check webbing, D-rings, SRL lockup, shock packs, and 5,000-lb anchors.",
    sopSteps: [
      {
        stepOrder: 1,
        title: "Inspect Harness Webbing & Stitching",
        instruction:
          "Hold webbing 6 inches apart and bend it into an inverted 'U' to spot cut fibers, fraying, burns, chemical stiffness, or broken stitching along the chest, waist, and leg straps.",
        isCritical: true,
      },
      {
        stepOrder: 2,
        title: "Check Dorsal D-Ring, Buckles & Impact Indicators",
        instruction:
          "Verify the dorsal D-ring and grommets have no cracks or distortion, buckles tongue/click cleanly, and the fall-impact indicator stitch has not deployed.",
        isCritical: true,
      },
      {
        stepOrder: 3,
        title: "Inspect Lanyard Shock Pack or SRL Lockup",
        instruction:
          "Check lanyard snap hooks for smooth self-closing/locking action. For SRLs, pull the lifeline sharply to confirm the braking pawl locks immediately and retracts smoothly.",
        isCritical: true,
      },
      {
        stepOrder: 4,
        title: "Verify Anchor Point Rating & Fall Clearance",
        instruction:
          "Confirm the anchor point is rated for 5,000 lbs per attached worker (or 2x engineered safety factor) and calculate total fall distance so the worker cannot strike a lower level.",
        isCritical: true,
      },
    ],
    checklistItems: [
      { label: "Harness label legible and within manufacturer service life", required: true },
      { label: "Webbing free of cuts, burns, paint/chemical stiffness, or broken stitching", required: true },
      { label: "Dorsal D-ring and buckles free of rust, cracks, or bending", required: true },
      { label: "Fall-impact indicator intact (not deployed or torn)", required: true },
      { label: "Snap hooks self-close and double-lock cleanly without sticking", required: true },
      { label: "SRL lifeline free of kinks/fraying and locks immediately on sharp tug", required: true },
      { label: "Anchor point rated for 5,000 lbs per worker and free of sharp edges", required: true },
      { label: "Total fall clearance calculated (no swing-fall or lower-level strike hazard)", required: true },
      { label: "Written rescue plan and trauma straps available for suspended worker", required: true },
    ],
    faqs: [
      {
        question: "What happens if a fall protection harness experiences a fall?",
        answer:
          "Any harness, lanyard, or SRL subjected to fall-arrest forces must be immediately removed from service, tagged 'Do Not Use', and destroyed or returned to the manufacturer—never reused.",
      },
      {
        question: "Why is a rescue plan required whenever fall arrest is used?",
        answer:
          "A worker suspended upright in a harness can develop orthostatic intolerance (suspension trauma) within 10–15 minutes, making rapid rescue and relief trauma straps essential.",
      },
    ],
  },
  {
    slug: "temporary-site-electrical-panel-check",
    title: "Temporary Site Electrical Panel Check",
    industry: "Construction",
    complianceStandards: ["OSHA 1926.404", "NFPA 70 (NEC 590)", "NFPA 70E"],
    frequency: "weekly",
    shortDescription:
      "Weekly safety inspection of construction spider boxes, temporary distribution panels, GFCI breakers, and extension cords to prevent shock and arc-flash incidents.",
    seoTitle: "Temporary Site Electrical Panel & GFCI Checklist (OSHA)",
    seoDescription:
      "OSHA 1926.404 temporary site electrical panel and spider box checklist. Verify GFCI trip tests, dead-front covers, grounding, and extension cord integrity.",
    sopSteps: [
      {
        stepOrder: 1,
        title: "Verify Panel Enclosure, Dead-Front & Clearance",
        instruction:
          "Ensure temporary panels and spider boxes are weatherproof (NEMA 3R outdoors), dead-front covers have no open knockouts, and 36 inches of clear working space is maintained.",
        isCritical: true,
      },
      {
        stepOrder: 2,
        title: "Test Every GFCI Receptacle & Breaker",
        instruction:
          "Press the 'TEST' button on all 120V/240V GFCI outlets and spider-box breakers (or use a calibrated GFCI tester) to confirm power trips immediately and resets properly.",
        isCritical: true,
      },
      {
        stepOrder: 3,
        title: "Inspect Grounding Electrode & Strain Relief",
        instruction:
          "Confirm the grounding rod/conductor is intact and bonded, and check that feeder cables enter the panel through proper strain-relief connectors without sharp metal edges.",
        isCritical: true,
      },
      {
        stepOrder: 4,
        title: "Audit Jobsite Extension Cords",
        instruction:
          "Spot-check heavy-duty cords for intact ground prongs, unbroken outer jackets, and elevated routing (hung with non-conductive S-hooks out of standing water).",
        isCritical: false,
      },
    ],
    checklistItems: [
      { label: "Panel door latches closed and NEMA 3R weatherproofing intact outdoors", required: true },
      { label: "Dead-front cover complete with zero open breaker slots or missing knockouts", required: true },
      { label: "All 120V/240V GFCI outlets and breakers tested and tripping properly", required: true },
      { label: "36-inch clear working space maintained in front of electrical panels", required: true },
      { label: "System grounding conductor and ground rod connection secure", required: true },
      { label: "Feeder cables protected by strain-relief bushings and elevated off wet ground", required: true },
      { label: "Extension cords free of spliced tape repairs, exposed wire, or missing ground pins", required: true },
      { label: "Panel circuits labeled and lockable for LOTO", required: false },
    ],
    faqs: [
      {
        question: "Are GFCIs required on all 120V temporary construction receptacles?",
        answer:
          "Yes. Under OSHA 1926.404(b)(1), all 120-volt, single-phase, 15-, 20-, and 30-ampere receptacle outlets on construction sites that are not part of permanent building wiring must have GFCI protection.",
      },
      {
        question: "Can electrical tape be used to repair a nicked extension cord jacket?",
        answer:
          "No. If the outer jacket is cut or inner insulation is exposed, the cord must be tagged out and removed from service—or shortened/re-terminated only by a qualified electrician.",
      },
    ],
  },
  {
    slug: "portable-extension-ladder-safety-check",
    title: "Portable & Extension Ladder Safety Check",
    industry: "Construction",
    complianceStandards: ["OSHA 1926.1053", "ANSI-ASC A14.2", "ISO 45001"],
    frequency: "daily",
    shortDescription:
      "Pre-use inspection and setup check for fiberglass A-frame stepladders and extension ladders covering side rails, rungs, spreader bars, 4:1 angle, and 3-ft tie-off.",
    seoTitle: "Portable & Extension Ladder Safety Checklist (OSHA 1926)",
    seoDescription:
      "OSHA 1926.1053 portable and extension ladder safety checklist. Inspect side rails, slip-resistant feet, 4:1 setup angle, and 3-ft landing extension.",
    sopSteps: [
      {
        stepOrder: 1,
        title: "Inspect Side Rails, Rungs & Duty Rating",
        instruction:
          "Check fiberglass or aluminum rails for cracks, dents, or UV fiber bloom. Confirm all rungs are tight, grease-free, and the ANSI Type I/IA/IAA duty label is legible.",
        isCritical: true,
      },
      {
        stepOrder: 2,
        title: "Check Feet, Spreader Bars & Rung Locks",
        instruction:
          "Verify rubber slip-resistant feet are intact, A-frame spreader bars lock flat without bending, and extension-ladder rung locks and halyard ropes function smoothly.",
        isCritical: true,
      },
      {
        stepOrder: 3,
        title: "Verify 4:1 Setup Angle & 3-Foot Top Extension",
        instruction:
          "Set extension ladders at a 4:1 ratio (1 ft out for every 4 ft of height), extend side rails at least 3 feet above the upper landing, and tie off the top rail.",
        isCritical: true,
      },
      {
        stepOrder: 4,
        title: "Confirm Safe Climbing & Top-Step Restrictions",
        instruction:
          "Ensure the base sits on level ground (never on boxes or scaffold planks), maintain 3 points of contact, and never stand on the top cap or top step of a stepladder.",
        isCritical: false,
      },
    ],
    checklistItems: [
      { label: "Side rails free of cracks, bends, splinters, or conductive damage near power", required: true },
      { label: "Rungs clean, dry, and tightly secured to side rails", required: true },
      { label: "Slip-resistant rubber feet intact and resting on level, firm surface", required: true },
      { label: "Stepladder spreader bars fully extended and locked (never leaned folded)", required: true },
      { label: "Extension ladder rung locks fully engaged and rope/pulley intact", required: true },
      { label: "Extension ladder set at 4:1 angle and extending 3 ft above upper landing", required: true },
      { label: "Top of extension ladder tied off or secured at base by helper", required: true },
      { label: "Worker maintains 3 points of contact (no carrying heavy loads up rungs)", required: false },
    ],
    faqs: [
      {
        question: "What is the 4-to-1 rule for extension ladders?",
        answer:
          "The base of an extension ladder should be placed 1 foot away from the wall or upper support for every 4 feet of vertical height to the point of support (roughly a 75-degree angle).",
      },
      {
        question: "Why are aluminum ladders banned near electrical work?",
        answer:
          "Aluminum conducts electricity. OSHA requires non-conductive fiberglass ladders whenever workers could contact energized electrical equipment or overhead lines.",
      },
    ],
  },
  {
    slug: "daily-construction-site-safety-walkthrough",
    title: "Daily Construction Site Safety Walkthrough",
    industry: "Construction",
    complianceStandards: ["OSHA 1926", "ISO 45001", "EM 385-1-1"],
    frequency: "daily",
    shortDescription:
      "Comprehensive superintendent/safety-officer daily site walkthrough covering perimeter fencing, housekeeping, fire extinguishers, fall edges, heavy equipment, and first-aid readiness.",
    seoTitle: "Daily Construction Site Safety Walkthrough Checklist",
    seoDescription:
      "Complete daily construction site safety walkthrough checklist for superintendents. Audit fall protection, housekeeping, fire safety, trenches, and PPE.",
    sopSteps: [
      {
        stepOrder: 1,
        title: "Inspect Site Perimeter, Signage & Public Protection",
        instruction:
          "Walk the perimeter fence and gates to ensure public access is blocked, warning signage is posted, and flaggers/traffic cones are properly staged for deliveries.",
        isCritical: true,
      },
      {
        stepOrder: 2,
        title: "Audit Leading Edges, Floor Holes & Guardrails",
        instruction:
          "Verify all floor openings >2 inches have secured, labeled covers ('HOLE') and all open-sided floors ≥6 feet high have intact guardrails or active fall-arrest zones.",
        isCritical: true,
      },
      {
        stepOrder: 3,
        title: "Check Housekeeping, Material Staging & Fire Safety",
        instruction:
          "Ensure walkways and stairs are clear of rebar caps, scrap lumber with protruding nails, and cords. Verify inspected fire extinguishers are mounted on every floor.",
        isCritical: false,
      },
      {
        stepOrder: 4,
        title: "Review Active High-Risk Permits & Emergency Readiness",
        instruction:
          "Spot-check active Hot Work, Excavation, and Confined Space permits, verify first-aid/eyewash stations are stocked, and resolve any imminent hazards immediately.",
        isCritical: true,
      },
    ],
    checklistItems: [
      { label: "Site perimeter fencing, gates, and public pedestrian walkways secure", required: true },
      { label: "All floor holes covered, secured against displacement, and marked 'HOLE'", required: true },
      { label: "Open-sided floors and stairways ≥6 ft protected with standard guardrails", required: true },
      { label: "Protruding rebar capped and scrap lumber nails bent/removed", required: true },
      { label: "Stairwells, corridors, and exits clear of debris and well illuminated", required: true },
      { label: "Charged ABC fire extinguishers mounted at every level and hot-work zone", required: true },
      { label: "Heavy equipment spotters active in congested backing/swing zones", required: true },
      { label: "First-aid kit, emergency eyewash, and SDS binder accessible on site", required: false },
      { label: "Daily JSA/toolbox talk signed by all active trade crews", required: false },
    ],
    faqs: [
      {
        question: "Who should conduct the daily construction site safety walkthrough?",
        answer:
          "The site superintendent, foreman, or designated safety officer should conduct a documented walkthrough at the start of the shift and again mid-day as trade activities shift.",
      },
      {
        question: "What are the OSHA Focus Four hazards to prioritize during a walkthrough?",
        answer:
          "OSHA's Focus Four hazards—Falls, Struck-By, Caught-In/Between, and Electrocution—account for the majority of construction fatalities and should be checked first on every walkthrough.",
      },
    ],
  },
];
