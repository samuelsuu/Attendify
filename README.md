# Webcapz

A smart attendance management app built with Expo Router, Supabase, and React Query. Three roles — **Admin**, **Student**, **Lecturer** — each with their own experience behind Supabase-authenticated, role-gated routes.

## Stack

- Expo (SDK 54) + Expo Router + TypeScript
- Plain React Native `StyleSheet` for styling — no NativeWind/Tailwind. All colors, spacing, and radii come from [`constants/theme.ts`](constants/theme.ts), a single light theme (no dark mode).
- Supabase (Auth + Postgres + Row Level Security)
- TanStack React Query
- `expo-camera` (QR scanning) + `react-native-qrcode-svg` (QR generation)
- `expo-image-picker` + `expo-file-system` (profile picture upload) + Supabase Storage

## One-time setup

### 1. Run the database schema

Open your Supabase project's **SQL Editor** and run the contents of [`supabase/schema.sql`](supabase/schema.sql). This creates the `profiles` and `attendance` tables, RLS policies, a trigger that auto-creates a `profiles` row whenever a new auth user is created, and a public `avatars` Storage bucket (with admin-only write policies) for profile pictures. It's safe to re-run any time you pull an update to this file — everything is `create or replace` / `drop ... if exists`.

### 2. Configure Supabase credentials

Edit [`lib/config.ts`](lib/config.ts) (already scaffolded with placeholders, gitignored) and fill in your project's values from **Supabase Dashboard → Settings → API**:

```ts
export const SUPABASE_URL = "https://your-project-ref.supabase.co";
export const SUPABASE_ANON_KEY = "your-anon-key";
```

`lib/config.example.ts` is the committed template — copy it to `lib/config.ts` again if you ever need to reset it.

### 3. Create your first admin account

There is no self-signup. Bootstrap your **first** admin account via the Supabase Dashboard:

1. Dashboard → **Authentication → Users → Add user**.
2. Set an email + password.
3. In **User Metadata**, add JSON like:
   ```json
   { "full_name": "Jane Doe", "role": "admin" }
   ```
   `role` must be `admin`, `student`, or `lecturer` (defaults to `student` if omitted).
4. The `handle_new_user` trigger automatically creates the matching `profiles` row — nothing else to do.

From then on, that admin can create **student** and **lecturer** accounts directly in the app (Dashboard → "Add account", or the **+** button on the Students/Lecturers screens) — see step 4 below to enable it.

### 4. Deploy the `create-user` Edge Function

In-app account creation needs a small server-side function so the app never has to hold your Supabase `service_role` key. Using the [Supabase CLI](https://supabase.com/docs/guides/cli):

```bash
npx supabase login
npx supabase link --project-ref <your-project-ref>   # the subdomain in your project URL
npx supabase functions deploy create-user
```

No extra secrets to set — `SUPABASE_URL`, `SUPABASE_ANON_KEY`, and `SUPABASE_SERVICE_ROLE_KEY` are automatically available inside every Edge Function. The function ([`supabase/functions/create-user/index.ts`](supabase/functions/create-user/index.ts)) verifies the caller is an admin (via their JWT + `profiles.role`) before creating anyone, and only allows creating `student`/`lecturer` accounts — not other admins.

### 5. Install dependencies & run

```bash
npm install
npx expo start
```

Scan the QR with Expo Go, or run on a simulator (`npx expo start --ios` / `--android`). The QR **scanner** screen (admin only) needs a real device or a simulator with camera support.

## Project structure

```
app/              Expo Router screens (login, (member)/, (admin)/)
components/       Reusable UI (Card, Button, QrCodeCard, list items, ...)
constants/        theme.ts — the single source of truth for colors/spacing/radii
hooks/            Auth context + React Query hooks
services/         Supabase query functions
lib/              Supabase client, date helpers, query client
types/            Shared TypeScript types
supabase/         schema.sql (run in SQL editor) + functions/create-user (deploy via CLI)
```

## Notes

- Student and Lecturer share the same `(member)` route group. Lecturers additionally get **Scan** and **My Scans** tabs (hidden for students via `href: null`) — they can scan a student's QR to mark attendance, same as admin, and see everyone they've personally recorded. The admin and lecturer scan screens both render the shared [`components/attendance-scanner.tsx`](components/attendance-scanner.tsx).
- Lecturers can only record attendance for `student` accounts — enforced both client-side (immediate feedback) and in the `attendance_insert` RLS policy (the real, unbypassable check). Admins remain unrestricted.
- Attendance is unique per `(user_id, date, recorded_by_role)` at the database level — an admin's scan and a lecturer's scan of the same student on the same day are separate records, but the same role scanning the same person twice in one day is rejected as a duplicate even under concurrent scans.
- One light theme only, no dark mode — every color/spacing/radius value is defined once in [`constants/theme.ts`](constants/theme.ts) and used via `StyleSheet.create()` in each component; there's no `className`/Tailwind anywhere in the app.
- Admin-created accounts get `email_confirm: true` from the Edge Function, so they can sign in immediately with the password the admin sets — no email confirmation step.
- Profile pictures are admin-managed only: pick one while creating an account ([`app/(admin)/create-user.tsx`](app/(admin)/create-user.tsx)), or tap a row in Students/Lecturers to open [`app/(admin)/user/[id].tsx`](<app/(admin)/user/[id].tsx>) and tap the photo to replace it. Students/Lecturers just see their own photo (or initials, if none is set) — they can't change it themselves. Uploads go to the public `avatars` Storage bucket via [`services/storage.ts`](services/storage.ts); each upload gets a unique filename so there's no stale-cache issue when a photo is replaced.
- The onboarding slides ([`app/onboarding.tsx`](app/onboarding.tsx)) use images, not icons, from `assets/images/onboarding/`. The four files there (`welcome.png`, `qr-scanning.png`, `analytics.png`, `roles.png`) are currently **solid-color placeholders** — swap them for real illustrations/photos whenever you have them; same filenames, any reasonable image size (they render at full width, ~280pt tall).
