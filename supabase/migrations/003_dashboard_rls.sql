-- FastCC QR Phase 5: Manager Dashboard & Ownership RLS
-- Ensures authenticated managers can SELECT/UPDATE/DELETE their own qr_codes
-- and SELECT inspection_logs belonging to their qr_codes, while preserving
-- public read for /q/[id] and public insert for frontline worker inspection_logs.

alter table public.qr_codes enable row level security;
alter table public.inspection_logs enable row level security;

create index if not exists idx_qr_codes_user_id on public.qr_codes (user_id);
create index if not exists idx_inspection_logs_qr_code_id on public.inspection_logs (qr_code_id, created_at desc);

-- qr_codes policies
drop policy if exists "Public read access on qr_codes" on public.qr_codes;
create policy "Public read access on qr_codes"
  on public.qr_codes
  for select
  to anon, authenticated
  using (true);

drop policy if exists "Authenticated insert own qr_codes" on public.qr_codes;
create policy "Authenticated insert own qr_codes"
  on public.qr_codes
  for insert
  to authenticated
  with check (auth.uid() = user_id);

drop policy if exists "Owner update qr_codes" on public.qr_codes;
create policy "Owner update qr_codes"
  on public.qr_codes
  for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "Owner delete qr_codes" on public.qr_codes;
create policy "Owner delete qr_codes"
  on public.qr_codes
  for delete
  to authenticated
  using (auth.uid() = user_id);

-- inspection_logs policies
drop policy if exists "Public insert inspection_logs for frontline workers" on public.inspection_logs;
create policy "Public insert inspection_logs for frontline workers"
  on public.inspection_logs
  for insert
  to anon, authenticated
  with check (true);

drop policy if exists "Owner-only select inspection_logs" on public.inspection_logs;
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

drop policy if exists "Owner delete inspection_logs" on public.inspection_logs;
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
