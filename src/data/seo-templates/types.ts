export type SeoTemplateFrequency = "daily" | "weekly" | "monthly";

export interface SeoTemplateStep {
  stepOrder: number;
  title: string;
  instruction: string;
  isCritical: boolean;
}

export interface SeoTemplateChecklistItem {
  label: string;
  required: boolean;
}

export interface SeoTemplateFaq {
  question: string;
  answer: string;
}

export interface SeoTemplate {
  slug: string;
  title: string;
  industry: string;
  complianceStandards: string[];
  frequency: SeoTemplateFrequency;
  shortDescription: string;
  seoTitle: string;
  seoDescription: string;
  sopSteps: SeoTemplateStep[];
  checklistItems: SeoTemplateChecklistItem[];
  faqs: SeoTemplateFaq[];
}
