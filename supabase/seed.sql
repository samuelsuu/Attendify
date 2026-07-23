-- Seed script: creates one admin, one student, one lecturer.
-- Run in the Supabase SQL editor AFTER schema.sql.
--
-- CAVEAT: Supabase doesn't officially support inserting into auth.users
-- directly (it's unexposed/internal). This works on current hosted Supabase
-- projects and is a common pattern for local/dev seeding, but it's not
-- guaranteed stable across GoTrue (Auth) upgrades. For production account
-- creation, prefer the Dashboard (Authentication > Add User) or the
-- supabase-js Admin API (supabase.auth.admin.createUser) with your
-- service_role key instead.
--
-- The public.profiles row is created automatically by the
-- on_auth_user_created trigger from schema.sql — no need to insert it here.

create or replace function public.seed_user(
  p_email text,
  p_password text,
  p_full_name text,
  p_role text
) returns uuid
language plpgsql
security definer
set search_path = public, auth, extensions
as $$
declare
  v_user_id uuid := gen_random_uuid();
begin
  insert into auth.users (
    instance_id, id, aud, role, email, encrypted_password,
    email_confirmed_at, raw_app_meta_data, raw_user_meta_data,
    created_at, updated_at,
    confirmation_token, recovery_token, email_change_token_new, email_change
  ) values (
    '00000000-0000-0000-0000-000000000000',
    v_user_id,
    'authenticated',
    'authenticated',
    p_email,
    crypt(p_password, gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"]}',
    jsonb_build_object('full_name', p_full_name, 'role', p_role),
    now(), now(),
    '', '', '', ''
  );

  insert into auth.identities (
    id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at
  ) values (
    gen_random_uuid(),
    v_user_id,
    v_user_id::text,
    jsonb_build_object('sub', v_user_id::text, 'email', p_email),
    'email',
    now(), now(), now()
  );

  return v_user_id;
end;
$$;

-- Change these emails/passwords before running.
select public.seed_user('admin@example.com',    'ChangeMe123!', 'Ada Admin',      'admin');
select public.seed_user('student@example.com',  'ChangeMe123!', 'Sam Student',    'student');
select public.seed_user('lecturer@example.com', 'ChangeMe123!', 'Leo Lecturer',   'lecturer');

-- Clean up the helper function (it created auth users, doesn't need to persist).
drop function public.seed_user(text, text, text, text);
