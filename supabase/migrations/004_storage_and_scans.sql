-- FastCC QR Phase 6: Cloud Photo Proof Storage & Live Scan Analytics

-- 1. Add scan analytics columns to qr_codes
alter table public.qr_codes
  add column if not exists scan_count integer not null default 0,
  add column if not exists last_scanned_at timestamptz;

-- 2. Add photo_url column to inspection_logs
alter table public.inspection_logs
  add column if not exists photo_url text;

-- 3. SECURITY DEFINER RPC to atomically increment scan count by short_code
create or replace function public.increment_qr_scan(p_short_code text)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.qr_codes
  set
    scan_count = scan_count + 1,
    last_scanned_at = now()
  where short_code = p_short_code;
end;
$$;

grant execute on function public.increment_qr_scan(text) to anon, authenticated;

-- 4. Public Supabase Storage bucket for frontline worker photo proof
insert into storage.buckets (id, name, public)
values ('inspection-photos', 'inspection-photos', true)
on conflict (id) do update set public = true;

-- 5. Storage RLS policies on storage.objects for inspection-photos
drop policy if exists "Public insert inspection-photos" on storage.objects;
create policy "Public insert inspection-photos"
  on storage.objects
  for insert
  to anon, authenticated
  with check (bucket_id = 'inspection-photos');

drop policy if exists "Public select inspection-photos" on storage.objects;
create policy "Public select inspection-photos"
  on storage.objects
  for select
  to anon, authenticated
  using (bucket_id = 'inspection-photos');
