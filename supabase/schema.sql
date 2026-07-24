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
  avatar_url text,
  created_at timestamptz not null default now()
);

alter table public.profiles add column if not exists avatar_url text;

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

-- Admins can update any profile (currently used for setting/changing avatar_url).
drop policy if exists "profiles_update" on public.profiles;
create policy "profiles_update" on public.profiles
  for update
  using (public.is_admin(auth.uid()))
  with check (public.is_admin(auth.uid()));

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
  recorded_by_role text check (recorded_by_role in ('admin', 'lecturer'))
);

alter table public.attendance add column if not exists recorded_by_role text;
alter table public.attendance drop constraint if exists attendance_recorded_by_role_check;
alter table public.attendance add constraint attendance_recorded_by_role_check
  check (recorded_by_role in ('admin', 'lecturer'));

-- Backfill existing rows (recorded before this column existed) from the
-- recorder's current role, so old history still shows admin vs lecturer.
update public.attendance a
set recorded_by_role = p.role
from public.profiles p
where a.recorded_by = p.id and a.recorded_by_role is null;

-- An admin's scan and a lecturer's scan are separate attendance records —
-- one student can be marked present once by an admin AND once by a lecturer
-- on the same day. Previously this was `unique (user_id, date)`, which meant
-- an admin scan silently blocked a same-day lecturer scan (and vice versa).
alter table public.attendance drop constraint if exists attendance_user_id_date_key;
alter table public.attendance drop constraint if exists attendance_user_id_date_role_key;
alter table public.attendance add constraint attendance_user_id_date_role_key
  unique (user_id, date, recorded_by_role);

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

-- ─────────────────────────────────────────────
-- avatars (profile pictures) — a public bucket so images render via a plain
-- public URL; only admins may upload/replace/remove them.
-- ─────────────────────────────────────────────
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

drop policy if exists "avatars_public_read" on storage.objects;
create policy "avatars_public_read" on storage.objects
  for select
  using (bucket_id = 'avatars');

drop policy if exists "avatars_admin_write" on storage.objects;
create policy "avatars_admin_write" on storage.objects
  for insert
  with check (bucket_id = 'avatars' and public.is_admin(auth.uid()));

drop policy if exists "avatars_admin_update" on storage.objects;
create policy "avatars_admin_update" on storage.objects
  for update
  using (bucket_id = 'avatars' and public.is_admin(auth.uid()));

drop policy if exists "avatars_admin_delete" on storage.objects;
create policy "avatars_admin_delete" on storage.objects
  for delete
  using (bucket_id = 'avatars' and public.is_admin(auth.uid()));
