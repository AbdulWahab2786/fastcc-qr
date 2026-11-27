-- FastCC QR Phase 8A: Live Equipment Status & Auto-Sync Trigger

-- 1. Add equipment status tracking columns to public.qr_codes
alter table public.qr_codes
  add column if not exists current_status text not null default 'ok'
    check (current_status in ('ok', 'maintenance', 'faulty')),
  add column if not exists last_inspected_at timestamptz;

create index if not exists idx_qr_codes_current_status
  on public.qr_codes (current_status);

-- 2. Add equipment_status column to public.inspection_logs
alter table public.inspection_logs
  add column if not exists equipment_status text not null default 'ok'
    check (equipment_status in ('ok', 'maintenance', 'faulty'));

-- 3. SECURITY DEFINER trigger to sync qr_codes.current_status & last_inspected_at
-- Runs on every inspection_logs insert so zero-login anonymous worker submissions
-- safely update the parent QR status under RLS.
create or replace function public.sync_qr_equipment_status()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.qr_codes
  set
    current_status = coalesce(new.equipment_status, 'ok'),
    last_inspected_at = now()
  where id = new.qr_code_id;

  return new;
end;
$$;

drop trigger if exists trg_inspection_logs_sync_equipment_status on public.inspection_logs;
create trigger trg_inspection_logs_sync_equipment_status
  after insert on public.inspection_logs
  for each row
  execute function public.sync_qr_equipment_status();
