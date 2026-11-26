export interface StepTranslation {
  title: string;
  description: string;
}

export interface VideoSopStep {
  step_number: number;
  timestamp_sec: number;
  title: string;
  description: string;
  translations_json: Record<string, StepTranslation>;
}

export interface VideoSopChecklistItem {
  label: string;
  required: boolean;
}

export interface VideoSopApiResponse {
  short_code: string;
  id: string;
  title: string;
  summary: string;
  steps: VideoSopStep[];
  checklist: VideoSopChecklistItem[];
  isLocalFallback?: boolean;
  notice?: string;
}

export type PaperFormFieldType = "pass_fail" | "text" | "number" | "photo";

export interface PaperFormField {
  id: string;
  label: string;
  type: PaperFormFieldType;
  required: boolean;
  translations: Record<string, string>;
}

export interface PaperFormApiResponse {
  short_code: string;
  id: string;
  title: string;
  fields: PaperFormField[];
  isLocalFallback?: boolean;
  notice?: string;
}
