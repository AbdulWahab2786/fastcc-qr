import type { SeoTemplate } from "./types";

export const MANUFACTURING_TEMPLATES: SeoTemplate[] = [
  {
    slug: "cnc-machine-daily-pre-start-inspection",
    title: "CNC Machine Daily Pre-Start Inspection",
    industry: "Manufacturing",
    complianceStandards: ["OSHA 1910.212", "ANSI B11.23", "ISO 9001"],
    frequency: "daily",
    shortDescription:
      "Standardized pre-shift inspection for CNC machining centers covering coolant levels, way lube, spindle warm-up, and interlock guarding before cutting metal.",
    seoTitle: "CNC Machine Daily Pre-Start Inspection Checklist & SOP",
    seoDescription:
      "Free CNC machine daily pre-start inspection checklist and SOP. Verify spindle warm-up, coolant concentration, way lube, and safety interlocks before shift.",
    sopSteps: [
      {
        stepOrder: 1,
        title: "Verify Power-Off Mechanical & Guarding State",
        instruction:
          "Before energizing the main breaker, inspect enclosure doors, polycarbonate viewing windows, chip conveyor guards, and E-stop mushrooms for cracks, bypassed interlocks, or loose fasteners.",
        isCritical: true,
      },
      {
        stepOrder: 2,
        title: "Check Way Lube, Hydraulic, and Coolant Reservoirs",
        instruction:
          "Confirm automatic way-lube oil and hydraulic tank levels are within the green sight-glass band. Measure coolant sump concentration with a refractometer and top off with premixed emulsion if below target Brix.",
        isCritical: false,
      },
      {
        stepOrder: 3,
        title: "Inspect Pneumatic Supply & Air Dryer Drain",
        instruction:
          "Open the main shop-air ball valve, verify FRL regulator pressure matches machine nameplate (typically 85–90 PSI), and purge any moisture from the filter bowl.",
        isCritical: false,
      },
      {
        stepOrder: 4,
        title: "Run Spindle Warm-Up & Axis Home Sequence",
        instruction:
          "Power on the controller, release E-stop, home all axes (X/Y/Z/A/B), and execute the 10-minute stepped spindle warm-up program while listening for abnormal bearing whine.",
        isCritical: true,
      },
      {
        stepOrder: 5,
        title: "Verify Tool Magazine & Workholding Clamping",
        instruction:
          "Inspect active tool holders for taper fretting or chipped inserts, confirm chuck/vise clamping pressure, and dry-run the first block in single-block mode at 25% rapid override.",
        isCritical: true,
      },
    ],
    checklistItems: [
      { label: "Main enclosure doors and safety interlock switches functional (no bypass)", required: true },
      { label: "All E-stop buttons tested and resetting cleanly", required: true },
      { label: "Way-lube reservoir filled and pump pressure pulsing normally", required: true },
      { label: "Coolant sump level adequate and refractometer Brix within spec", required: false },
      { label: "Shop air supply pressure at 85–90 PSI with moisture trap drained", required: true },
      { label: "Hydraulic chuck/tailstock pressure gauge within target range", required: true },
      { label: "Spindle taper clean and free of metal chips or fretting", required: true },
      { label: "Chip auger/conveyor clear of jams and discharge bin emptied", required: false },
      { label: "Spindle warm-up cycle completed without abnormal vibration or noise", required: true },
    ],
    faqs: [
      {
        question: "Why is a stepped spindle warm-up mandatory before machining?",
        answer:
          "Cold spindle bearings have tighter internal clearances and uneven thermal expansion. Running a stepped warm-up (e.g., 25%, 50%, 75% max RPM) distributes grease evenly and prevents premature bearing seizure or Z-axis thermal drift.",
      },
      {
        question: "How often should CNC coolant concentration be checked?",
        answer:
          "Check coolant Brix concentration daily at shift start using a handheld refractometer. Low concentration accelerates rust and bacterial growth, while overly rich coolant causes skin irritation and foaming.",
      },
      {
        question: "What should an operator do if a door interlock switch fails?",
        answer:
          "Stop immediately, apply a lockout/tagout (LOTO) device if maintenance is required, and report the fault. Never tape, jumper, or bypass a safety interlock to run production.",
      },
    ],
  },
  {
    slug: "industrial-boiler-safety-pressure-check",
    title: "Industrial Boiler Safety & Pressure Check",
    industry: "Manufacturing",
    complianceStandards: ["ASME BPVC", "OSHA 1910.106", "NFPA 85"],
    frequency: "daily",
    shortDescription:
      "Daily safety and water-chemistry verification for industrial steam and hot-water boilers covering low-water cutoffs, relief valves, and burner flame stability.",
    seoTitle: "Industrial Boiler Safety & Pressure Check SOP Template",
    seoDescription:
      "Downloadable industrial boiler safety & pressure check SOP. Verify low-water cutoffs, gauge glass blowdown, relief valves, and steam pressure every shift.",
    sopSteps: [
      {
        stepOrder: 1,
        title: "Verify Operating Steam Pressure & Temperature",
        instruction:
          "Compare the primary analog pressure gauge against the BMS/PLC digital transmitter; investigate any discrepancy greater than 3% and confirm pressure is safely below MAWP.",
        isCritical: true,
      },
      {
        stepOrder: 2,
        title: "Blow Down Water Column & Sight Glass",
        instruction:
          "Open the water column drain valve for 3–5 seconds, close it, and observe water returning briskly to the normal operating level (NWOL) in the gauge glass to confirm no sludge blockage.",
        isCritical: true,
      },
      {
        stepOrder: 3,
        title: "Test Primary & Auxiliary Low-Water Fuel Cutoffs (LWCO)",
        instruction:
          "Perform a slow-drain evaporation or float-chamber test on the primary LWCO and verify the burner trips immediately at the low-water setpoint and requires manual reset if applicable.",
        isCritical: true,
      },
      {
        stepOrder: 4,
        title: "Inspect Burner Flame, Fuel Train & Flue Gas",
        instruction:
          "Observe flame color and stability through the sight port (clean blue/orange depending on fuel), verify gas/oil supply pressures, and check stack temperature for soot fouling.",
        isCritical: false,
      },
      {
        stepOrder: 5,
        title: "Perform Surface & Bottom Blowdown & Log Water Chemistry",
        instruction:
          "Execute scheduled bottom blowdown to purge dissolved solids, test feedwater hardness/pH/sulfite levels, and record all readings in the boiler logbook.",
        isCritical: false,
      },
    ],
    checklistItems: [
      { label: "Boiler operating pressure below MAWP and gauge readings match BMS", required: true },
      { label: "Gauge glass clean, illuminated, and water level verified via blowdown", required: true },
      { label: "Primary Low-Water Fuel Cutoff (LWCO) tested and trips burner", required: true },
      { label: "Auxiliary LWCO float chamber blown down and free of scale", required: true },
      { label: "Safety relief valves free of weeping, corrosion, or plugged discharge", required: true },
      { label: "Fuel train pressure gauges and shutoff valves leak-free", required: true },
      { label: "Feedwater pump cycling smoothly with no seal leaks or cavitation", required: false },
      { label: "Burner flame pattern stable without pulsation or soot buildup", required: false },
      { label: "Boiler room combustion air louvers unobstructed and CO monitor active", required: true },
    ],
    faqs: [
      {
        question: "How often must an industrial boiler low-water cutoff (LWCO) be tested?",
        answer:
          "ASME and most jurisdictional boiler codes require daily blowdown testing of float-type LWCOs while the boiler is under pressure, plus a slow-drain evaporation test at least monthly or per manufacturer schedule.",
      },
      {
        question: "What causes a sluggish water level return in the boiler sight glass?",
        answer:
          "A slow-returning water level indicates scale, mud, or sediment partially blocking the lower water-column piping or try-cock connections, which creates a false high-water reading and dry-fire risk.",
      },
    ],
  },
  {
    slug: "lockout-tagout-loto-energy-isolation-checklist",
    title: "Lockout/Tagout (LOTO) Energy Isolation Checklist",
    industry: "Manufacturing",
    complianceStandards: ["OSHA 1910.147", "ANSI/ASSE Z244.1", "ISO 45001"],
    frequency: "daily",
    shortDescription:
      "Step-by-step hazardous energy control checklist ensuring electrical, pneumatic, hydraulic, gravitational, and thermal energy sources are isolated and zero-verified before servicing.",
    seoTitle: "Lockout/Tagout (LOTO) Energy Isolation Checklist & SOP",
    seoDescription:
      "OSHA 1910.147 Lockout/Tagout (LOTO) energy isolation checklist. Verify zero energy state across electrical, pneumatic, hydraulic, and stored energy sources.",
    sopSteps: [
      {
        stepOrder: 1,
        title: "Notify Affected Employees & Identify All Energy Sources",
        instruction:
          "Alert all operators in the work zone, review the machine-specific LOTO placard, and identify every primary and secondary energy source (electrical, air, hydraulic, spring, gravity).",
        isCritical: true,
      },
      {
        stepOrder: 2,
        title: "Perform Normal Shutdown & Isolate Energy Devices",
        instruction:
          "Stop the equipment using standard HMI/stop controls, then open main disconnect switches, close isolation ball valves, and engage mechanical blocking pins for raised loads.",
        isCritical: true,
      },
      {
        stepOrder: 3,
        title: "Apply Personal Locks & Completed LOTO Tags",
        instruction:
          "Each authorized worker must attach their own uniquely keyed padlock and signed/dated danger tag to every energy-isolating device (using a group lockbox or hasp for multi-person work).",
        isCritical: true,
      },
      {
        stepOrder: 4,
        title: "Dissipate Stored & Residual Energy",
        instruction:
          "Bleed trapped pneumatic and hydraulic pressure to 0 PSI, discharge capacitors, block suspended rams/platens, and allow hot surfaces or steam lines to cool.",
        isCritical: true,
      },
      {
        stepOrder: 5,
        title: "Verify Zero Energy State (Try-Out Test)",
        instruction:
          "Attempt to start the machine via normal controls and test electrical conductors with a calibrated CAT-III/IV voltmeter (Live-Dead-Live test) before touching any component.",
        isCritical: true,
      },
      {
        stepOrder: 6,
        title: "Clear Tools, Restore Guards & Remove Locks",
        instruction:
          "Upon completion, account for all tools, reinstall all safety guards, verify personnel are clear, remove personal locks/tags, and notify affected operators before re-energizing.",
        isCritical: true,
      },
    ],
    checklistItems: [
      { label: "Affected operators notified of impending equipment shutdown", required: true },
      { label: "Machine-specific LOTO procedure placard reviewed at point of work", required: true },
      { label: "Normal operational stop executed prior to opening disconnects", required: true },
      { label: "All electrical, pneumatic, and hydraulic isolators placed in OFF/closed position", required: true },
      { label: "Personal padlock and signed danger tag applied by every exposed worker", required: true },
      { label: "Stored pneumatic/hydraulic pressure bled to 0 PSI and verified on gauges", required: true },
      { label: "Suspended parts mechanically blocked or lowered to resting position", required: true },
      { label: "Zero-energy state verified via try-out start attempt and Live-Dead-Live voltage test", required: true },
      { label: "All guards reinstalled and tools removed prior to lock removal", required: true },
    ],
    faqs: [
      {
        question: "Can one maintenance technician place a lock for the entire crew?",
        answer:
          "No. Under OSHA 1910.147, each authorized employee performing servicing must affix their own personal lockout device (using a multi-lock hasp or group LOTO lockbox) so no one can re-energize the equipment while another worker is exposed.",
      },
      {
        question: "What is the Live-Dead-Live test in electrical LOTO?",
        answer:
          "Test your voltmeter on a known live source first, test the isolated circuit to confirm 0 volts (dead), and test the known live source again to confirm the meter did not fail during testing.",
      },
    ],
  },
  {
    slug: "air-compressor-receiver-tank-inspection",
    title: "Air Compressor & Receiver Tank Inspection",
    industry: "Manufacturing",
    complianceStandards: ["OSHA 1910.169", "ASME Section VIII", "ISO 8573"],
    frequency: "daily",
    shortDescription:
      "Daily preventive inspection for rotary screw or reciprocating air compressors and ASME receiver tanks to prevent moisture contamination, overheating, and overpressure hazards.",
    seoTitle: "Air Compressor & Receiver Tank Inspection Checklist",
    seoDescription:
      "Free air compressor and receiver tank inspection checklist. Check condensate drains, oil levels, belt tension, pressure relief valves, and discharge temps.",
    sopSteps: [
      {
        stepOrder: 1,
        title: "Drain Receiver Tank & Moisture Separators",
        instruction:
          "Verify automatic condensate drain valves cycle properly, or manually crack the bottom receiver drain valve until clear air flows without water or emulsified oil.",
        isCritical: true,
      },
      {
        stepOrder: 2,
        title: "Check Compressor Oil Level & Intake Filter",
        instruction:
          "With unit stopped or stabilized per OEM instructions, verify compressor oil is within the sight glass range and check the differential pressure indicator on the intake air filter.",
        isCritical: false,
      },
      {
        stepOrder: 3,
        title: "Inspect Belts, Guards & Discharge Temperature",
        instruction:
          "Confirm belt guards are securely bolted, check for abnormal bearing noise or vibration, and record airend/discharge temperature against OEM alarm thresholds.",
        isCritical: false,
      },
      {
        stepOrder: 4,
        title: "Verify Pressure Switch Cut-In/Cut-Out & Relief Valve",
        instruction:
          "Confirm load/unload pressures match plant setpoint, verify the ASME safety relief valve tag is legible and unobstructed, and check refrigerated/desiccant air dryer dew point.",
        isCritical: true,
      },
    ],
    checklistItems: [
      { label: "Receiver tank condensate drain clear and discharging water properly", required: true },
      { label: "Compressor oil level within normal operating sight-glass band", required: true },
      { label: "ASME pressure relief valve unobstructed and within calibration date", required: true },
      { label: "Discharge air temperature within OEM normal operating range", required: true },
      { label: "Load/unload pressure gauges functioning and within target PSI band", required: true },
      { label: "Intake air filter differential indicator in green zone", required: false },
      { label: "Drive belt guard secure with no frayed belts or abnormal vibration", required: true },
      { label: "Air dryer running with dew point temperature within spec", required: false },
    ],
    faqs: [
      {
        question: "Why must compressed air receiver tanks be drained daily?",
        answer:
          "Water condenses inside the tank as hot compressed air cools. Accumulated water causes internal tank corrosion (weakening the pressure vessel wall), washes out pneumatic tool lubrication, and damages downstream valves.",
      },
      {
        question: "What causes a rotary screw air compressor to trip on high temperature?",
        answer:
          "Common causes include clogged oil/air cooler fins, low compressor oil level, failed thermostatic mixing valve, or blocked compressor room ventilation.",
      },
    ],
  },
  {
    slug: "injection-molding-machine-safety-setup-check",
    title: "Injection Molding Machine Safety & Setup Check",
    industry: "Manufacturing",
    complianceStandards: ["ANSI/PLASTICS B151.1", "OSHA 1910.212", "ISO 9001"],
    frequency: "daily",
    shortDescription:
      "Pre-production safety and process setup audit for hydraulic and all-electric injection molding presses covering platen drop-bars, operator gates, purge shields, and barrel zones.",
    seoTitle: "Injection Molding Machine Safety & Setup Checklist",
    seoDescription:
      "Injection molding machine safety & setup SOP. Verify mechanical drop-bars, operator gate interlocks, nozzle purge shields, and barrel heater zones.",
    sopSteps: [
      {
        stepOrder: 1,
        title: "Test Operator & Rear Safety Gate Interlocks",
        instruction:
          "Open the front and rear sliding safety gates while in dry-cycle or setup mode and confirm hydraulic/electrical interlocks and the mechanical drop-bar (ratchet bar) immediately prevent mold close.",
        isCritical: true,
      },
      {
        stepOrder: 2,
        title: "Inspect Nozzle Purge Shield & Barrel Heater Bands",
        instruction:
          "Verify the interlocked nozzle purge shield is intact and closed, inspect thermocouple wiring for fray, and confirm all barrel/hot-runner zones have reached stabilized setpoint.",
        isCritical: true,
      },
      {
        stepOrder: 3,
        title: "Verify Mold Clamping, Ejector Pins & Cooling Lines",
        instruction:
          "Check mold strap clamps or magnetic platen status, verify water manifold hoses are leak-free and flowing, and confirm mold protection (low-pressure close) sensitivity.",
        isCritical: true,
      },
      {
        stepOrder: 4,
        title: "Check Hopper Material, Dryer & First-Article Quality",
        instruction:
          "Confirm correct resin grade and dryer dew point/temp, run three initial shots, and inspect parts for flash, short shots, or splay before releasing to full-auto production.",
        isCritical: false,
      },
    ],
    checklistItems: [
      { label: "Front operator gate electrical & hydraulic interlocks stop mold close immediately", required: true },
      { label: "Mechanical drop-bar / safety ratchet engages smoothly when gate opens", required: true },
      { label: "Rear safety gate interlock and E-stop buttons tested and functional", required: true },
      { label: "Nozzle purge guard closed, intact, and interlock switch active", required: true },
      { label: "Mold clamps/bolts torqued and mold protection low-pressure close verified", required: true },
      { label: "Cooling water hoses, quick-disconnects, and manifolds free of leaks", required: false },
      { label: "Barrel and hot-runner temperature zones stabilized within ±3°C of recipe", required: true },
      { label: "Resin hopper, loader, and desiccant dryer matched to work order", required: false },
      { label: "Floor around press clean and free of spilled pellets or hydraulic oil", required: true },
    ],
    faqs: [
      {
        question: "What is the purpose of the mechanical drop-bar on an injection molding machine?",
        answer:
          "Under ANSI B151.1, the mechanical safety drop-bar provides a physical barrier between the platens whenever the operator gate is opened, preventing mold closure even if both hydraulic and electrical interlocks fail simultaneously.",
      },
      {
        question: "Why should mold protection (low-pressure close) be tested at setup?",
        answer:
          "Properly calibrated low-pressure mold protection stops the clamp before high-tonnage lockup if a stuck part or misaligned insert remains in the cavity, preventing expensive mold steel damage.",
      },
    ],
  },
  {
    slug: "welding-bay-hot-work-safety-audit",
    title: "Welding Bay & Hot Work Safety Audit",
    industry: "Manufacturing",
    complianceStandards: ["OSHA 1910.252", "NFPA 51B", "AWS Z49.1"],
    frequency: "daily",
    shortDescription:
      "Daily inspection of MIG/TIG/stick welding bays and hot-work zones covering fume extraction, cylinder chaining, flashback arrestors, fire extinguishers, and arc curtains.",
    seoTitle: "Welding Bay & Hot Work Safety Audit Checklist & SOP",
    seoDescription:
      "OSHA 1910.252 welding bay and hot work safety audit. Inspect fume extraction, gas cylinder chaining, flashback arrestors, welding leads, and fire watch.",
    sopSteps: [
      {
        stepOrder: 1,
        title: "Clear Combustibles & Verify Fire Protection",
        instruction:
          "Ensure a 35-foot radius (or fire-blanket barrier) is clear of flammables, cardboard, and solvents. Confirm an inspected ABC fire extinguisher is mounted within immediate reach.",
        isCritical: true,
      },
      {
        stepOrder: 2,
        title: "Inspect Compressed Gas Cylinders & Regulators",
        instruction:
          "Verify argon/CO2/oxygen/acetylene cylinders are chained upright at two-thirds height, regulators are leak-free without oil/grease, and oxy-fuel torches have flashback arrestors installed.",
        isCritical: true,
      },
      {
        stepOrder: 3,
        title: "Check Welding Machine Cables, Ground Clamp & Curtains",
        instruction:
          "Inspect electrode leads and work-return ground cables for exposed copper or cracked insulation, verify tight ground clamp connection, and close UV-filtering welding curtains.",
        isCritical: true,
      },
      {
        stepOrder: 4,
        title: "Verify Local Exhaust Ventilation (LEV) & PPE",
        instruction:
          "Turn on the fume extraction arm/hood and position it 6–12 inches from the weld zone. Confirm welders wear auto-darkening helmets, FR jackets, leather gloves, and safety glasses.",
        isCritical: false,
      },
    ],
    checklistItems: [
      { label: "35-ft hot work zone free of flammables, aerosols, and combustible trash", required: true },
      { label: "Inspected ABC fire extinguisher accessible and gauge in green zone", required: true },
      { label: "Shielding and fuel gas cylinders upright and double-chained to rack/wall", required: true },
      { label: "Flashback arrestors and check valves installed on oxy-fuel torches", required: true },
      { label: "Welding stinger, MIG whip, and ground cables free of exposed conductors", required: true },
      { label: "Local fume extraction hood running and positioned near weld arc", required: true },
      { label: "UV welding curtains/screens closed to protect adjacent aisle traffic", required: false },
      { label: "Operator PPE complete (helmet, FR jacket, welding gloves, steel-toe boots)", required: true },
    ],
    faqs: [
      {
        question: "How far must combustibles be kept from a welding or hot-work area?",
        answer:
          "NFPA 51B and OSHA 1910.252 require a 35-foot (11-meter) radius free of combustible materials. If combustibles cannot be moved, they must be covered with fire-rated welding blankets and a dedicated fire watch must remain for at least 30–60 minutes after work ends.",
      },
      {
        question: "Why should oxygen cylinders never be stored near oil or grease?",
        answer:
          "Pure oxygen under pressure reacts violently with petroleum-based oils or greases, which can cause spontaneous ignition or explosion at the regulator valve.",
      },
    ],
  },
  {
    slug: "conveyor-belt-guarding-inspection",
    title: "Conveyor Belt & Guarding Inspection",
    industry: "Manufacturing",
    complianceStandards: ["ASME B20.1", "OSHA 1910.212", "ISO 45001"],
    frequency: "weekly",
    shortDescription:
      "Weekly mechanical and safety inspection of powered belt, roller, and chain conveyors focusing on nip-point guarding, pull-cord E-stops, belt tracking, and bearing heat.",
    seoTitle: "Conveyor Belt & Guarding Inspection Checklist (ASME B20.1)",
    seoDescription:
      "ASME B20.1 conveyor belt and guarding inspection checklist. Verify nip-point guards, emergency pull cords, belt tracking, and motor/gearbox condition.",
    sopSteps: [
      {
        stepOrder: 1,
        title: "Test Emergency Pull-Cord & E-Stop Switches",
        instruction:
          "Walk the full length of the conveyor, pull each emergency cable switch and press local E-stop buttons, and verify the drive trips immediately and cannot auto-restart without manual reset.",
        isCritical: true,
      },
      {
        stepOrder: 2,
        title: "Inspect Nip-Point, Drive & Tail Pulley Guards",
        instruction:
          "Verify all head/tail pulley nip guards, chain/sprocket covers, and return-idler guards are securely fastened with no missing bolts or openings larger than 1/4 inch near pinch points.",
        isCritical: true,
      },
      {
        stepOrder: 3,
        title: "Check Belt Tracking, Splice Integrity & Rollers",
        instruction:
          "Observe belt tracking at both head and tail pulleys for edge rubbing, inspect mechanical lacing or vulcanized splices for lifted clips, and listen for seized idler rollers.",
        isCritical: false,
      },
      {
        stepOrder: 4,
        title: "Inspect Drive Motor, Gearbox & Crossover Stairs",
        instruction:
          "Check gearbox oil sight glass and motor temperature with an IR gun, verify audible start-up warning horns function, and ensure crossover bridges have intact handrails.",
        isCritical: false,
      },
    ],
    checklistItems: [
      { label: "Emergency pull-cord cables taut and trip conveyor drive when pulled", required: true },
      { label: "All head, tail, and snub-pulley nip-point guards securely bolted in place", required: true },
      { label: "Chain, sprocket, and V-belt drive enclosures intact with no gaps", required: true },
      { label: "Pre-start audible warning horn sounds before conveyor motion begins", required: true },
      { label: "Conveyor belt tracking centrally without rubbing frame rails", required: false },
      { label: "Belt splices/lacings intact with no torn edges or missing fasteners", required: false },
      { label: "Idler and return rollers rotating freely without squealing", required: false },
      { label: "Gearbox oil level normal and no oil leaks onto floor or belt", required: false },
      { label: "Crossover walkways and stairs clean, dry, and handrails secure", required: true },
    ],
    faqs: [
      {
        question: "What are the most dangerous pinch points on an industrial conveyor?",
        answer:
          "The highest-risk in-running nip points occur where the belt meets the head drive pulley, tail pulley, snub rollers, and take-up pulleys, as well as unguarded chain-and-sprocket drives.",
      },
      {
        question: "How often should conveyor pull-cord E-stops be tested?",
        answer:
          "Pull-cord switches should be functionally tested at least weekly (or before start-up on high-risk bulk conveyors) to ensure cables have not stretched, corroded, or been blocked by product buildup.",
      },
    ],
  },
  {
    slug: "hydraulic-press-pre-operation-checklist",
    title: "Hydraulic Press Pre-Operation Checklist",
    industry: "Manufacturing",
    complianceStandards: ["OSHA 1910.217", "ANSI B11.2", "ISO 13849"],
    frequency: "daily",
    shortDescription:
      "Daily pre-shift safety check for hydraulic stamping, forming, and arbor presses verifying light curtains, two-hand anti-tie-down controls, hoses, and die clamping.",
    seoTitle: "Hydraulic Press Pre-Operation Safety Checklist & SOP",
    seoDescription:
      "ANSI B11.2 hydraulic press pre-operation checklist. Test light curtains, two-hand controls, hydraulic hoses, die clamps, and pressure relief settings daily.",
    sopSteps: [
      {
        stepOrder: 1,
        title: "Test Light Curtains & Two-Hand Anti-Tie-Down Controls",
        instruction:
          "Break the light curtain beam with the calibrated test rod at top, middle, and bottom zones to verify immediate ram stop. Confirm both palm buttons must be pressed within 0.5 seconds to cycle.",
        isCritical: true,
      },
      {
        stepOrder: 2,
        title: "Inspect Hydraulic Hoses, Cylinders & Oil Level",
        instruction:
          "Check high-pressure hoses for abrasion, blistering, or weeping fittings, verify cylinder rod wipers are clean, and confirm hydraulic reservoir level and temperature are within spec.",
        isCritical: true,
      },
      {
        stepOrder: 3,
        title: "Verify Die Set Clamping & Ram Alignment",
        instruction:
          "Inspect upper and lower die T-bolts/clamps for tightness, check guide-post lubrication, and verify no tools, shims, or scrap slugs remain in the die area.",
        isCritical: true,
      },
      {
        stepOrder: 4,
        title: "Confirm System Pressure & Ram Drift Check",
        instruction:
          "Cycle the press unloaded, verify system pressure matches the job setup sheet, and confirm the ram holds position at top-dead-center without downward drift.",
        isCritical: false,
      },
    ],
    checklistItems: [
      { label: "Safety light curtain tested with calibration rod across all beam zones", required: true },
      { label: "Two-hand palm buttons require simultaneous actuation (anti-tie-down verified)", required: true },
      { label: "Emergency stop button halts ram motion immediately when pressed", required: true },
      { label: "High-pressure hydraulic hoses free of leaks, bulges, or chafing", required: true },
      { label: "Die set clamps and bolster bolts tight and properly seated", required: true },
      { label: "Safety block/prop available and stored in interlocked rack when not in use", required: true },
      { label: "Hydraulic reservoir fluid level and oil temperature within green zone", required: false },
      { label: "Work area floor dry and free of hydraulic oil slicks or scrap metal", required: true },
    ],
    faqs: [
      {
        question: "How do you test a safety light curtain on a hydraulic press?",
        answer:
          "Use the manufacturer-supplied opaque test rod (sized to the curtain's resolution) and pass it through the top, center, and bottom of the sensing field while the ram is moving or armed; the press must fault/stop immediately.",
      },
      {
        question: "Why is anti-tie-down logic required on two-hand press controls?",
        answer:
          "Anti-tie-down circuitry prevents an operator from taping or wedging one palm button down and cycling the press with one hand, which would leave the other hand exposed to the closing die.",
      },
    ],
  },
  {
    slug: "overhead-crane-hoist-daily-inspection",
    title: "Overhead Crane & Hoist Daily Inspection",
    industry: "Manufacturing",
    complianceStandards: ["OSHA 1910.179", "ASME B30.2", "ASME B30.16"],
    frequency: "daily",
    shortDescription:
      "Pre-shift functional and visual inspection for bridge cranes, jib cranes, and electric chain/wire-rope hoists before lifting any suspended load.",
    seoTitle: "Overhead Crane & Hoist Daily Inspection Checklist (OSHA)",
    seoDescription:
      "OSHA 1910.179 overhead crane and hoist daily inspection checklist. Verify upper limit switches, wire rope/chain, hook latches, brakes, and pendant controls.",
    sopSteps: [
      {
        stepOrder: 1,
        title: "Inspect Pendant/Radio Controller & Labeling",
        instruction:
          "Check the pendant cable strain relief and rubber buttons for cracks; verify directional labels (Up/Down/North/South/East/West) match actual bridge and trolley motion.",
        isCritical: true,
      },
      {
        stepOrder: 2,
        title: "Check Hook, Throat Latch & Load Block",
        instruction:
          "Inspect the forged hook for throat opening distortion (>5% or manufacturer limit), cracks, or twisting, and verify the spring-loaded safety latch snaps shut cleanly.",
        isCritical: true,
      },
      {
        stepOrder: 3,
        title: "Inspect Wire Rope or Load Chain",
        instruction:
          "Lower the hook to eye level and visually check wire rope for bird-caging, kinks, or broken wires, or inspect load chain for stretched, gouged, or twisted links.",
        isCritical: true,
      },
      {
        stepOrder: 4,
        title: "Test Upper Limit Switch & Hoist Brakes",
        instruction:
          "Slowly raise the empty hook block to trip the upper limit switch and confirm hoisting stops automatically. Perform a brief lift-and-hold check to verify brake holding.",
        isCritical: true,
      },
      {
        stepOrder: 5,
        title: "Verify Bridge Travel, Horn & Clear Lift Path",
        instruction:
          "Run bridge and trolley through a short test travel listening for wheel/rail grinding, confirm warning bell/horn works, and inspect below-the-hook slings before first lift.",
        isCritical: false,
      },
    ],
    checklistItems: [
      { label: "Rated load capacity clearly marked on bridge and hoist block", required: true },
      { label: "Upper limit switch trips and stops hoist block cleanly (empty hook test)", required: true },
      { label: "Hook free of cracks, twist, or throat spread; safety latch closes fully", required: true },
      { label: "Wire rope/load chain free of kinks, bird-caging, rust, or broken strands", required: true },
      { label: "Hoist brake holds load without slipping or drifting", required: true },
      { label: "Pendant/remote buttons undamaged and directional markings accurate", required: true },
      { label: "No hydraulic or gear oil leaks dripping from trolley or hoist", required: false },
      { label: "Bridge/trolley travel smooth with warning horn/beacon operational", required: false },
      { label: "Rigging slings and shackles inspected with legible capacity tags", required: true },
    ],
    faqs: [
      {
        question: "What is the difference between a frequent and periodic crane inspection?",
        answer:
          "Under OSHA 1910.179, frequent inspections (daily to monthly) are visual and operational checks done by operators before use, while periodic inspections (1 to 12 months) are documented tear-down/measurement audits by a qualified technician.",
      },
      {
        question: "Should a crane ever be used to pull a load sideways?",
        answer:
          "No. Overhead cranes and hoists are designed strictly for vertical lifts. Side-pulling damages drum grooves, snaps wire ropes, and can derail the trolley.",
      },
    ],
  },
  {
    slug: "factory-shift-handover-5s-audit",
    title: "Factory Shift Handover & 5S Audit",
    industry: "Manufacturing",
    complianceStandards: ["ISO 9001", "ISO 45001", "Lean 5S"],
    frequency: "daily",
    shortDescription:
      "Structured end-of-shift handover and 5S workplace organization audit ensuring tooling, WIP counts, quality holds, and safety hazards are cleanly communicated to the incoming crew.",
    seoTitle: "Factory Shift Handover & 5S Audit Checklist Template",
    seoDescription:
      "Standardize manufacturing shift transitions with this Factory Shift Handover & 5S Audit checklist. Track WIP, quality holds, tooling, and aisle safety.",
    sopSteps: [
      {
        stepOrder: 1,
        title: "Sort & Clear Workstations (Seiri)",
        instruction:
          "Remove obsolete fixtures, empty scrap bins, and clear unnecessary packaging or personal items from machine tops and workbenches.",
        isCritical: false,
      },
      {
        stepOrder: 2,
        title: "Set in Order & Return Shared Tooling (Seiton)",
        instruction:
          "Return micrometers, torque wrenches, and hand tools to their shadow boards; verify pallet jacks and carts are parked inside taped floor zones.",
        isCritical: false,
      },
      {
        stepOrder: 3,
        title: "Shine & Inspect Equipment Condition (Seiso)",
        instruction:
          "Sweep chips/dust, wipe down control panels, and clean any coolant or oil drips so leaks are immediately visible to the incoming operator.",
        isCritical: true,
      },
      {
        stepOrder: 4,
        title: "Log WIP Counts, Quality Holds & Maintenance Issues",
        instruction:
          "Record good parts produced, quarantine any suspect/NCR parts in red-tagged bins, and log open machine faults or abnormal noises on the handover board.",
        isCritical: true,
      },
    ],
    checklistItems: [
      { label: "Emergency exits, fire extinguishers, and electrical panels unobstructed (36 in.)", required: true },
      { label: "Pedestrian walkways and forklift aisles clear of pallets and hoses", required: true },
      { label: "Shadow boards complete with all calibrated gauges and hand tools returned", required: false },
      { label: "Suspect or non-conforming parts tagged and placed in red quarantine bin", required: true },
      { label: "WIP counts, scrap totals, and active work order status logged", required: true },
      { label: "Machine surfaces wiped down and chip/scrap hoppers emptied", required: false },
      { label: "Chemical spray bottles and secondary containers properly labeled (GHS)", required: true },
      { label: "Any equipment faults, leaks, or near-misses briefed to incoming lead", required: true },
    ],
    faqs: [
      {
        question: "How long should a manufacturing shift handover & 5S check take?",
        answer:
          "A well-designed end-of-shift 5S and handover routine takes 10–15 minutes per cell when operators maintain organization throughout the shift rather than waiting until the final bell.",
      },
      {
        question: "Why is cleaning (Shine) considered an inspection step in 5S?",
        answer:
          "Wiping down machines and floors reveals early signs of failure—such as hairline cracks, loose bolts, or small hydraulic leaks—before they cause unplanned downtime.",
      },
    ],
  },
];
