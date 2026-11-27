import type { InspectionSchedule } from "@/lib/inspection-schedule";
import type {
  QrDotStyle,
  QrLabelThemeId,
  QrThemeColorId,
} from "@/lib/qr-label-themes";
import type { VideoSopChecklistItem } from "@/types/ai";
import type { Json } from "@/types/database";

export interface IndustryTemplateStep {
  stepOrder: number;
  title: string;
  instruction: string;
  isCritical: boolean;
}

export interface IndustryTemplate {
  id: string;
  title: string;
  category: string;
  description: string;
  steps: IndustryTemplateStep[];
  checklist: VideoSopChecklistItem[];
}

export const INDUSTRY_TEMPLATES: readonly IndustryTemplate[] = [
  {
    id: "fssai-kitchen-cleaning",
    title: "FSSAI Commercial Kitchen Cleaning",
    category: "Food & Hospitality",
    description:
      "Daily commercial kitchen sanitation SOP & FSSAI hygiene verification checklist.",
    steps: [
      {
        stepOrder: 1,
        title: "Sanitize all food prep surfaces",
        instruction:
          "Clear stainless steel tables, wash with food-safe detergent, rinse with potable water, and apply food-grade sanitizer.",
        isCritical: true,
      },
      {
        stepOrder: 2,
        title: "Verify chiller & fridge temperatures (0–5°C)",
        instruction:
          "Inspect digital displays or probe thermometers in all dairy, meat, and veg chillers; log any unit reading above 5°C immediately.",
        isCritical: true,
      },
      {
        stepOrder: 3,
        title: "Check floors, drains & pest barriers",
        instruction:
          "Scrub floor tiles with disinfectant, ensure floor drain strainers are seated, and check corners for any signs of pests.",
        isCritical: false,
      },
      {
        stepOrder: 4,
        title: "Inspect exhaust hood & grease traps",
        instruction:
          "Check baffle filters and drip trays above cooking ranges; wipe excess grease buildup to prevent smoke or fire hazards.",
        isCritical: false,
      },
      {
        stepOrder: 5,
        title: "Seal & line food-grade waste bins",
        instruction:
          "Empty wet and dry waste bins, sanitize inner rims, fit fresh liners, and verify pedal lids close tightly.",
        isCritical: false,
      },
    ],
    checklist: [
      { label: "Prep surfaces sanitized", required: true },
      { label: "Fridge temp 0–5°C verified", required: true },
      { label: "Pest-free floor & covered drains", required: true },
      { label: "Exhaust hood grease check completed", required: true },
      { label: "Food-grade bins closed & lined", required: true },
    ],
  },
  {
    id: "dg-set-daily-check",
    title: "DG Set (Diesel Generator) Daily Check",
    category: "Facility & Power",
    description:
      "Pre-run daily inspection for commercial & industrial diesel generators before load transfer.",
    steps: [
      {
        stepOrder: 1,
        title: "Check diesel tank level (%)",
        instruction:
          "Inspect fuel level gauge and sight glass on the day tank; top up if below 50% so backup runtime is never compromised.",
        isCritical: true,
      },
      {
        stepOrder: 2,
        title: "Inspect engine oil & coolant levels",
        instruction:
          "Pull the engine dipstick to verify oil sits between MIN and MAX marks, and check radiator expansion tank coolant level.",
        isCritical: true,
      },
      {
        stepOrder: 3,
        title: "Check battery voltage & terminals",
        instruction:
          "Verify 12V/24V starter battery voltage on the AMF controller and confirm terminals are tight and free of sulfation.",
        isCritical: false,
      },
      {
        stepOrder: 4,
        title: "Perform leak & belt walkaround",
        instruction:
          "Inspect under the skid base, fuel hoses, and oil filter housing for active diesel, engine oil, or coolant leaks.",
        isCritical: true,
      },
    ],
    checklist: [
      { label: "Diesel level % checked & adequate", required: true },
      { label: "Engine oil level within range", required: true },
      { label: "Coolant level adequate", required: true },
      { label: "Battery voltage & terminals OK", required: true },
      { label: "No fuel or oil leaks observed", required: true },
    ],
  },
  {
    id: "fire-extinguisher-audit",
    title: "Fire Extinguisher Monthly Audit",
    category: "Safety & Compliance",
    description:
      "Monthly statutory fire safety inspection for ABC, CO2, and foam extinguishers.",
    steps: [
      {
        stepOrder: 1,
        title: "Verify pressure gauge is in green zone",
        instruction:
          "Check that the pressure indicator needle sits squarely within the green operating arc (not overcharged or discharged).",
        isCritical: true,
      },
      {
        stepOrder: 2,
        title: "Confirm safety pin & tamper seal intact",
        instruction:
          "Ensure the metallic pull pin is seated through the handle and the plastic tamper-evident seal is unbroken.",
        isCritical: true,
      },
      {
        stepOrder: 3,
        title: "Inspect hose, horn & nozzle",
        instruction:
          "Check the discharge hose for dry rot or cracks and ensure the nozzle opening is unobstructed by dust or insects.",
        isCritical: false,
      },
      {
        stepOrder: 4,
        title: "Verify wall mount & refill validity",
        instruction:
          "Confirm wall bracket is rigid, 1-meter access path is clear of cartons, and the next refill / hydro-test date is valid.",
        isCritical: true,
      },
    ],
    checklist: [
      { label: "Pressure gauge in green zone", required: true },
      { label: "Safety pin & tamper seal intact", required: true },
      { label: "Hose & nozzle clear of blockage", required: true },
      { label: "Wall mount secure & unobstructed", required: true },
      { label: "Next refill date valid", required: true },
    ],
  },
  {
    id: "warehouse-forklift-check",
    title: "Warehouse Forklift Pre-Shift Check",
    category: "Logistics & Manufacturing",
    description:
      "Mandatory pre-shift safety & mechanical check before operating warehouse MHE.",
    steps: [
      {
        stepOrder: 1,
        title: "Inspect tyres & wheel lug nuts",
        instruction:
          "Walk around the forklift to check solid or pneumatic tyres for chunking, deep cuts, flat spots, and missing lug nuts.",
        isCritical: false,
      },
      {
        stepOrder: 2,
        title: "Check hydraulic fluid & lift cylinders",
        instruction:
          "Verify hydraulic reservoir level and inspect mast lift/tilt cylinders and hoses for oil seepage or drips.",
        isCritical: true,
      },
      {
        stepOrder: 3,
        title: "Test horn, beacon & reverse alarm",
        instruction:
          "Turn ignition ON and test the steering horn, warning strobe light, and audible reverse buzzer before moving.",
        isCritical: true,
      },
      {
        stepOrder: 4,
        title: "Test brakes, steering & mast/forks",
        instruction:
          "Test foot brake and parking brake hold, verify smooth steering, and inspect forks, backrest, and mast chains for cracks or bends.",
        isCritical: true,
      },
    ],
    checklist: [
      { label: "Tyre condition & lug nuts OK", required: true },
      { label: "Hydraulic fluid OK & no leaks", required: true },
      { label: "Horn & reverse alarm working", required: true },
      { label: "Brakes & steering responsive", required: true },
      { label: "Forks & mast integrity verified", required: true },
    ],
  },
];

export function getIndustryTemplateById(
  id: string | null | undefined,
): IndustryTemplate | undefined {
  if (!id) return undefined;
  return INDUSTRY_TEMPLATES.find((template) => template.id === id);
}

/** Formats template SOP steps into readable numbered lines for the workbench editor. */
export function formatTemplateStepsText(
  steps: readonly IndustryTemplateStep[],
): string {
  return steps
    .map(
      (step) =>
        `${step.stepOrder}. ${step.title}: ${step.instruction}`,
    )
    .join("\n");
}

/** Parses multiline SOP text back into structured step rows, preserving template critical flags when titles match. */
export function parseSopStepsFromText(
  text: string,
  referenceSteps: readonly IndustryTemplateStep[] = [],
): IndustryTemplateStep[] {
  const lines = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  return lines.map((rawLine, index) => {
    const cleaned = rawLine.replace(/^(?:\d+[.)]\s*|[-*]\s*)/, "").trim();
    const separatorMatch = cleaned.match(/^([^:—–]+?)(?:\s*[:—–]\s+)(.+)$/);
    const title = separatorMatch ? separatorMatch[1].trim() : cleaned;
    const instruction = separatorMatch ? separatorMatch[2].trim() : "";

    const matchedRef = referenceSteps.find(
      (ref) => ref.title.toLowerCase() === title.toLowerCase(),
    );

    return {
      stepOrder: index + 1,
      title: title || `Step ${index + 1}`,
      instruction,
      isCritical: matchedRef?.isCritical ?? false,
    };
  });
}

/** Builds the `config_json` object stored on `qr_codes` for an SOP / template QR. */
export function buildSopConfigJson(params: {
  summary?: string;
  checklist: readonly VideoSopChecklistItem[];
  managerWhatsapp?: string;
  folder?: string;
  inspectionSchedule?: InspectionSchedule;
  labelTheme?: QrLabelThemeId;
  themeColor?: QrThemeColorId;
  dotStyle?: QrDotStyle;
}): Json {
  const payload: Record<string, Json> = {
    checklist: params.checklist.map((item) => ({
      label: item.label,
      required: item.required,
    })),
  };

  const trimmedSummary = params.summary?.trim();
  if (trimmedSummary) {
    payload.summary = trimmedSummary;
  }

  const trimmedWhatsapp = params.managerWhatsapp?.trim();
  if (trimmedWhatsapp) {
    payload.manager_whatsapp = trimmedWhatsapp;
  }

  const trimmedFolder = params.folder?.trim();
  if (trimmedFolder && trimmedFolder.toLowerCase() !== "unassigned") {
    payload.folder = trimmedFolder;
  }

  if (params.inspectionSchedule && params.inspectionSchedule !== "none") {
    payload.inspection_schedule = params.inspectionSchedule;
  }

  if (params.labelTheme) {
    payload.label_theme = params.labelTheme;
  }

  if (params.themeColor) {
    payload.theme_color = params.themeColor;
  }

  if (params.dotStyle && params.dotStyle !== "square") {
    payload.dot_style = params.dotStyle;
  }

  return payload;
}
