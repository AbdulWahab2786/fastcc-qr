-- FastCC QR Phase 3 Schema Extensions
-- Adds AI SOP & Paper-to-Form metadata columns to qr_codes and sop_steps

alter table public.qr_codes
  add column if not exists type text not null default 'standard',
  add column if not exists config_json jsonb not null default '{}'::jsonb;

alter table public.sop_steps
  add column if not exists timestamp_sec integer,
  add column if not exists translations_json jsonb not null default '{}'::jsonb;
