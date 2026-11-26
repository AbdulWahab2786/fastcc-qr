-- FastCC QR Phase 7: Monetization (Razorpay), Plan Limits & AI Usage Tracking

-- 1. user_plans table
create table if not exists public.user_plans (
  user_id uuid primary key references auth.users(id) on delete cascade,
  plan text not null default 'free' check (plan in ('free', 'pro', 'business')),
  ai_sops_used integer not null default 0,
  razorpay_order_id text,
  razorpay_payment_id text,
  plan_expires_at timestamptz,
  updated_at timestamptz not null default now()
);

drop trigger if exists trg_user_plans_updated_at on public.user_plans;
create trigger trg_user_plans_updated_at
  before update on public.user_plans
  for each row
  execute function public.set_updated_at();

alter table public.user_plans enable row level security;

drop policy if exists "Users select own user_plans" on public.user_plans;
create policy "Users select own user_plans"
  on public.user_plans
  for select
  to authenticated
  using (auth.uid() = user_id);

-- Backfill existing users with default 'free' plan
insert into public.user_plans (user_id, plan)
select id, 'free'
from auth.users
on conflict (user_id) do nothing;

-- 2. Trigger to provision a default 'free' row for new signups
create or replace function public.handle_new_user_plan()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.user_plans (user_id, plan)
  values (new.id, 'free')
  on conflict (user_id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created_plan on auth.users;
create trigger on_auth_user_created_plan
  after insert on auth.users
  for each row
  execute function public.handle_new_user_plan();

-- 3. SECURITY DEFINER helpers for safe plan lookup & server updates
create or replace function public.ensure_user_plan()
returns public.user_plans
language plpgsql
security definer
set search_path = public
as $$
declare
  v_uid uuid := auth.uid();
  v_row public.user_plans;
begin
  if v_uid is null then
    raise exception 'Authentication required';
  end if;

  insert into public.user_plans (user_id, plan)
  values (v_uid, 'free')
  on conflict (user_id) do nothing;

  select * into v_row
  from public.user_plans
  where user_id = v_uid;

  return v_row;
end;
$$;

grant execute on function public.ensure_user_plan() to authenticated;

create or replace function public.get_effective_user_plan(p_user_id uuid)
returns text
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(
    (
      select case
        when plan in ('pro', 'business')
          and (plan_expires_at is null or plan_expires_at > now())
        then plan
        else 'free'
      end
      from public.user_plans
      where user_id = p_user_id
    ),
    'free'
  );
$$;

grant execute on function public.get_effective_user_plan(uuid) to authenticated;

create or replace function public.increment_ai_sops_used()
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  v_uid uuid := auth.uid();
  v_new_count integer;
begin
  if v_uid is null then
    raise exception 'Authentication required';
  end if;

  insert into public.user_plans (user_id, plan, ai_sops_used)
  values (v_uid, 'free', 1)
  on conflict (user_id) do update
    set ai_sops_used = public.user_plans.ai_sops_used + 1,
        updated_at = now()
  returning ai_sops_used into v_new_count;

  return v_new_count;
end;
$$;

grant execute on function public.increment_ai_sops_used() to authenticated;

create or replace function public.apply_verified_razorpay_plan(
  p_plan text,
  p_order_id text,
  p_payment_id text,
  p_expires_at timestamptz
)
returns public.user_plans
language plpgsql
security definer
set search_path = public
as $$
declare
  v_uid uuid := auth.uid();
  v_row public.user_plans;
begin
  if v_uid is null then
    raise exception 'Authentication required';
  end if;

  if p_plan not in ('pro', 'business') then
    raise exception 'Invalid paid plan: %', p_plan;
  end if;

  insert into public.user_plans (
    user_id,
    plan,
    razorpay_order_id,
    razorpay_payment_id,
    plan_expires_at,
    updated_at
  )
  values (
    v_uid,
    p_plan,
    p_order_id,
    p_payment_id,
    p_expires_at,
    now()
  )
  on conflict (user_id) do update
    set plan = excluded.plan,
        razorpay_order_id = excluded.razorpay_order_id,
        razorpay_payment_id = excluded.razorpay_payment_id,
        plan_expires_at = excluded.plan_expires_at,
        updated_at = now()
  returning * into v_row;

  return v_row;
end;
$$;

grant execute on function public.apply_verified_razorpay_plan(text, text, text, timestamptz) to authenticated;

-- 4. Enforce Free-plan QR limit (10) & watermark lock on qr_codes RLS
drop policy if exists "Authenticated insert own qr_codes" on public.qr_codes;
create policy "Authenticated insert own qr_codes"
  on public.qr_codes
  for insert
  to authenticated
  with check (
    auth.uid() = user_id
    and (
      public.get_effective_user_plan(auth.uid()) in ('pro', 'business')
      or (
        show_watermark = true
        and (
          select count(*)
          from public.qr_codes q
          where q.user_id = auth.uid()
        ) < 10
      )
    )
  );

drop policy if exists "Owner update qr_codes" on public.qr_codes;
create policy "Owner update qr_codes"
  on public.qr_codes
  for update
  to authenticated
  using (auth.uid() = user_id)
  with check (
    auth.uid() = user_id
    and (
      public.get_effective_user_plan(auth.uid()) in ('pro', 'business')
      or show_watermark = true
    )
  );
