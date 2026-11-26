-- FastCC QR Phase 1 Schema & RLS
-- Tables: qr_codes, sop_steps, inspection_logs

create extension if not exists "pgcrypto";

-- 1. qr_codes
create table if not exists public.qr_codes (
  id uuid primary key default gen_random_uuid(),
  short_code text not null unique,
  user_id uuid references auth.users(id) on delete set null,
  title text not null,
  description text,
  category text not null default 'general',
  show_watermark boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_qr_codes_short_code on public.qr_codes (short_code);
create index if not exists idx_qr_codes_user_id on public.qr_codes (user_id);

-- 2. sop_steps
create table if not exists public.sop_steps (
  id uuid primary key default gen_random_uuid(),
  qr_code_id uuid not null references public.qr_codes(id) on delete cascade,
  step_order integer not null,
  title text not null,
  instruction text not null default '',
  is_critical boolean not null default false,
  created_at timestamptz not null default now(),
  constraint sop_steps_qr_order_unique unique (qr_code_id, step_order)
);

create index if not exists idx_sop_steps_qr_code_id on public.sop_steps (qr_code_id, step_order);

-- 3. inspection_logs
create table if not exists public.inspection_logs (
  id uuid primary key default gen_random_uuid(),
  qr_code_id uuid not null references public.qr_codes(id) on delete cascade,
  inspector_name text not null,
  status text not null check (status in ('pass', 'fail', 'issue')),
  notes text,
  step_results jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_inspection_logs_qr_code_id on public.inspection_logs (qr_code_id, created_at desc);

-- updated_at trigger for qr_codes
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_qr_codes_updated_at on public.qr_codes;
create trigger trg_qr_codes_updated_at
  before update on public.qr_codes
  for each row
  execute function public.set_updated_at();

-- Enable Row Level Security
alter table public.qr_codes enable row level security;
alter table public.sop_steps enable row level security;
alter table public.inspection_logs enable row level security;

-- RLS Policies: qr_codes
create policy "Public read access on qr_codes"
  on public.qr_codes
  for select
  to anon, authenticated
  using (true);

create policy "Anon insert guest qr_codes with watermark"
  on public.qr_codes
  for insert
  to anon
  with check (user_id is null and show_watermark = true);

create policy "Authenticated insert own qr_codes"
  on public.qr_codes
  for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "Owner update qr_codes"
  on public.qr_codes
  for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Owner delete qr_codes"
  on public.qr_codes
  for delete
  to authenticated
  using (auth.uid() = user_id);

-- RLS Policies: sop_steps
create policy "Public read access on sop_steps"
  on public.sop_steps
  for select
  to anon, authenticated
  using (true);

create policy "Insert sop_steps for guest or owned qr_codes"
  on public.sop_steps
  for insert
  to anon, authenticated
  with check (
    exists (
      select 1
      from public.qr_codes
      where id = qr_code_id
        and (
          (user_id is null and auth.role() = 'anon')
          or user_id = auth.uid()
        )
    )
  );

create policy "Owner update sop_steps"
  on public.sop_steps
  for update
  to authenticated
  using (
    exists (
      select 1
      from public.qr_codes
      where id = qr_code_id and user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1
      from public.qr_codes
      where id = qr_code_id and user_id = auth.uid()
    )
  );

create policy "Owner delete sop_steps"
  on public.sop_steps
  for delete
  to authenticated
  using (
    exists (
      select 1
      from public.qr_codes
      where id = qr_code_id and user_id = auth.uid()
    )
  );

-- RLS Policies: inspection_logs
create policy "Public insert inspection_logs for frontline workers"
  on public.inspection_logs
  for insert
  to anon, authenticated
  with check (true);

create policy "Owner-only select inspection_logs"
  on public.inspection_logs
  for select
  to authenticated
  using (
    exists (
      select 1
      from public.qr_codes
      where id = qr_code_id and user_id = auth.uid()
    )
  );

create policy "Owner delete inspection_logs"
  on public.inspection_logs
  for delete
  to authenticated
  using (
    exists (
      select 1
      from public.qr_codes
      where id = qr_code_id and user_id = auth.uid()
    )
  );
