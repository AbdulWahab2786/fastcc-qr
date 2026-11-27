import { AUTOMOTIVE_TEMPLATES } from "./automotive";
import { CONSTRUCTION_TEMPLATES } from "./construction";
import { ENERGY_TEMPLATES } from "./energy";
import { FACILITY_TEMPLATES } from "./facility";
import { HEALTHCARE_TEMPLATES } from "./healthcare";
import { HOSPITALITY_TEMPLATES } from "./hospitality";
import { LOGISTICS_TEMPLATES } from "./logistics";
import { MANUFACTURING_TEMPLATES } from "./manufacturing";
import { PHARMA_LABS_TEMPLATES } from "./pharma-labs";
import { RETAIL_TEMPLATES } from "./retail";
import type { SeoTemplate } from "./types";

export type {
  SeoTemplate,
  SeoTemplateChecklistItem,
  SeoTemplateFaq,
  SeoTemplateFrequency,
  SeoTemplateStep,
} from "./types";

export const ALL_SEO_TEMPLATES: readonly SeoTemplate[] = [
  ...MANUFACTURING_TEMPLATES,
  ...CONSTRUCTION_TEMPLATES,
  ...HEALTHCARE_TEMPLATES,
  ...LOGISTICS_TEMPLATES,
  ...HOSPITALITY_TEMPLATES,
  ...FACILITY_TEMPLATES,
  ...RETAIL_TEMPLATES,
  ...AUTOMOTIVE_TEMPLATES,
  ...ENERGY_TEMPLATES,
  ...PHARMA_LABS_TEMPLATES,
];

export const SEO_INDUSTRIES: readonly string[] = Array.from(
  new Set(ALL_SEO_TEMPLATES.map((template) => template.industry)),
);

export function getAllSeoTemplates(): readonly SeoTemplate[] {
  return ALL_SEO_TEMPLATES;
}

export function getSeoTemplateBySlug(
  slug: string | null | undefined,
): SeoTemplate | undefined {
  if (!slug) return undefined;
  const normalized = slug.trim().toLowerCase();
  return ALL_SEO_TEMPLATES.find(
    (template) => template.slug.toLowerCase() === normalized,
  );
}

export function getTemplatesByIndustry(
  industry: string | null | undefined,
): SeoTemplate[] {
  if (!industry) return [];
  const normalized = industry.trim().toLowerCase();
  return ALL_SEO_TEMPLATES.filter(
    (template) => template.industry.toLowerCase() === normalized,
  );
}
