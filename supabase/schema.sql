-- Attendance Management App — database schema
-- Run this once in the Supabase SQL editor (Dashboard > SQL Editor > New query).

-- ─────────────────────────────────────────────
-- profiles
-- ─────────────────────────────────────────────
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text not null,
  email text not null,
  role text not null check (role in ('admin', 'student', 'lecturer')),
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- security-definer helpers so policies can check the caller's role
-- without recursively re-triggering RLS on profiles.
create or replace function public.is_admin(uid uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.profiles where id = uid and role = 'admin'
  );
$$;

create or replace function public.is_lecturer(uid uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.profiles where id = uid and role = 'lecturer'
  );
$$;

-- Lecturers can also look up student profiles — needed to scan a student's QR
-- (look up who it belongs to) and to see student names in "My Scans".
drop policy if exists "profiles_select" on public.profiles;
create policy "profiles_select" on public.profiles
  for select
  using (
    id = auth.uid()
    or public.is_admin(auth.uid())
    or (public.is_lecturer(auth.uid()) and role = 'student')
  );

-- ─────────────────────────────────────────────
-- auto-create a profile row whenever an admin creates a new auth user.
-- In the Supabase Dashboard: Authentication > Add User > set "User Metadata" to
-- {"full_name": "Jane Doe", "role": "student"}  (role defaults to "student" if omitted)
-- ─────────────────────────────────────────────
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, email, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.email),
    new.email,
    coalesce(new.raw_user_meta_data ->> 'role', 'student')
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ─────────────────────────────────────────────
-- attendance
-- ─────────────────────────────────────────────
create table if not exists public.attendance (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  date date not null default current_date,
  recorded_at timestamptz not null default now(),
  recorded_by uuid references public.profiles (id),
  unique (user_id, date)
);

alter table public.attendance enable row level security;

-- Own attendance, anything an admin needs, or rows the caller personally
-- recorded (so a lecturer can see the students they've scanned).
drop policy if exists "attendance_select" on public.attendance;
create policy "attendance_select" on public.attendance
  for select
  using (
    user_id = auth.uid()
    or recorded_by = auth.uid()
    or public.is_admin(auth.uid())
  );

-- Admins can record anyone. Lecturers can only record attendance for students
-- (enforced here, not just in the app, so it can't be bypassed client-side).
drop policy if exists "attendance_insert" on public.attendance;
create policy "attendance_insert" on public.attendance
  for insert
  with check (
    public.is_admin(auth.uid())
    or (
      public.is_lecturer(auth.uid())
      and exists (
        select 1 from public.profiles where id = user_id and role = 'student'
      )
    )
  );

create index if not exists attendance_user_id_idx on public.attendance (user_id);
create index if not exists attendance_date_idx on public.attendance (date);
