export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type InspectionStatus = "pass" | "fail" | "issue";

export interface Database {
  public: {
    Tables: {
      qr_codes: {
        Row: {
          id: string;
          short_code: string;
          user_id: string | null;
          title: string;
          description: string | null;
          category: string;
          type: string;
          config_json: Json;
          show_watermark: boolean;
          scan_count: number;
          last_scanned_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          short_code: string;
          user_id?: string | null;
          title: string;
          description?: string | null;
          category?: string;
          type?: string;
          config_json?: Json;
          show_watermark?: boolean;
          scan_count?: number;
          last_scanned_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          short_code?: string;
          user_id?: string | null;
          title?: string;
          description?: string | null;
          category?: string;
          type?: string;
          config_json?: Json;
          show_watermark?: boolean;
          scan_count?: number;
          last_scanned_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      sop_steps: {
        Row: {
          id: string;
          qr_code_id: string;
          step_order: number;
          title: string;
          instruction: string;
          is_critical: boolean;
          timestamp_sec: number | null;
          translations_json: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          qr_code_id: string;
          step_order: number;
          title: string;
          instruction?: string;
          is_critical?: boolean;
          timestamp_sec?: number | null;
          translations_json?: Json;
          created_at?: string;
        };
        Update: {
          id?: string;
          qr_code_id?: string;
          step_order?: number;
          title?: string;
          instruction?: string;
          is_critical?: boolean;
          timestamp_sec?: number | null;
          translations_json?: Json;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "sop_steps_qr_code_id_fkey";
            columns: ["qr_code_id"];
            isOneToOne: false;
            referencedRelation: "qr_codes";
            referencedColumns: ["id"];
          },
        ];
      };
      inspection_logs: {
        Row: {
          id: string;
          qr_code_id: string;
          inspector_name: string;
          status: InspectionStatus;
          notes: string | null;
          photo_url: string | null;
          step_results: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          qr_code_id: string;
          inspector_name: string;
          status: InspectionStatus;
          notes?: string | null;
          photo_url?: string | null;
          step_results?: Json;
          created_at?: string;
        };
        Update: {
          id?: string;
          qr_code_id?: string;
          inspector_name?: string;
          status?: InspectionStatus;
          notes?: string | null;
          photo_url?: string | null;
          step_results?: Json;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "inspection_logs_qr_code_id_fkey";
            columns: ["qr_code_id"];
            isOneToOne: false;
            referencedRelation: "qr_codes";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: Record<string, never>;
    Functions: {
      increment_qr_scan: {
        Args: {
          p_short_code: string;
        };
        Returns: undefined;
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
