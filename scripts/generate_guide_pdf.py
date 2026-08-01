from pathlib import Path
from reportlab.lib import colors
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import inch
from reportlab.platypus import ListFlowable, ListItem, PageBreak, Paragraph, SimpleDocTemplate, Spacer, Table, TableStyle

ROOT = Path(__file__).resolve().parent.parent
OUTPUT = ROOT / "Attendify-Codebase-Guide.pdf"

styles = getSampleStyleSheet()
styles.add(ParagraphStyle(name="TitleStyle", parent=styles["Title"], fontName="Helvetica-Bold", fontSize=20, leading=24, spaceAfter=12, textColor=colors.HexColor("#0f172a")))
styles.add(ParagraphStyle(name="SubtitleStyle", parent=styles["Heading2"], fontName="Helvetica", fontSize=11, leading=14, textColor=colors.HexColor("#475569"), spaceAfter=10))
styles.add(ParagraphStyle(name="BodyStyle", parent=styles["BodyText"], fontName="Helvetica", fontSize=10, leading=13, textColor=colors.HexColor("#111827"), spaceAfter=6))
styles.add(ParagraphStyle(name="BulletStyle", parent=styles["BodyText"], fontName="Helvetica", fontSize=10, leading=13, leftIndent=12, bulletIndent=0, spaceAfter=4, textColor=colors.HexColor("#111827")))
styles.add(ParagraphStyle(name="SectionStyle", parent=styles["Heading1"], fontName="Helvetica-Bold", fontSize=13, leading=16, textColor=colors.HexColor("#1d4ed8"), spaceBefore=12, spaceAfter=8))
styles.add(ParagraphStyle(name="CodeStyle", parent=styles["Code"], fontName="Courier", fontSize=9, leading=11, textColor=colors.HexColor("#0f172a"), backColor=colors.HexColor("#f8fafc"), borderPadding=6, spaceAfter=8))


def p(text, style="BodyStyle"):
    return Paragraph(text, styles[style])


def bullets(items):
    return ListFlowable([ListItem(Paragraph(item, styles["BulletStyle"]), value="•") for item in items], bulletType="bullet", start=None)

story = []
story.append(p("Attendify Codebase Guide", "TitleStyle"))
story.append(p("Updated for the current Expo + Supabase project structure and workflow.", "SubtitleStyle"))
story.append(Spacer(1, 0.1 * inch))

story.append(p("Project overview", "SectionStyle"))
story.append(p("Webcapz is a role-based attendance management app built with Expo Router, Supabase, and React Query. The current implementation supports three roles: Admin, Student, and Lecturer, with role-gated navigation and attendance recording flows.", "BodyStyle"))

story.append(p("Current app metadata", "SectionStyle"))
info_rows = [
    ["Name", "Webcapz"],
    ["Package", "expo-router/entry"],
    ["Version", "1.0.0"],
    ["Platform", "iOS + Android + web"],
    ["Orientation", "Portrait"],
    ["Architecture", "React Native with Expo SDK 54 and New Architecture enabled"],
]
info_table = Table(info_rows, colWidths=[1.6 * inch, 4.8 * inch])
info_table.setStyle(TableStyle([
    ("BACKGROUND", (0, 0), (-1, -1), colors.HexColor("#f8fafc")),
    ("GRID", (0, 0), (-1, -1), 0.25, colors.HexColor("#dbeafe")),
    ("FONTNAME", (0, 0), (-1, -1), "Helvetica"),
    ("FONTSIZE", (0, 0), (-1, -1), 9),
    ("TEXTCOLOR", (0, 0), (-1, -1), colors.HexColor("#111827")),
    ("BACKGROUND", (0, 0), (0, -1), colors.HexColor("#e0f2fe")),
    ("FONTNAME", (0, 0), (0, -1), "Helvetica-Bold"),
]))
story.append(info_table)
story.append(Spacer(1, 0.15 * inch))

story.append(p("Core stack", "SectionStyle"))
story.append(bullets([
    "Expo SDK 54, Expo Router, React Native 0.81.5, TypeScript",
    "Supabase Auth + Postgres + Row Level Security",
    "TanStack React Query for client state and cached data",
    "expo-camera for QR scanning and react-native-qrcode-svg for QR generation",
    "expo-image-picker, expo-file-system, and Supabase Storage for profile photos",
]))

story.append(p("Current project structure", "SectionStyle"))
story.append(bullets([
    "app/ — Expo Router screens for login, onboarding, admin routes, and member routes",
    "app/(admin)/ — admin dashboard, scan view, attendance views, students, lecturers, and account creation",
    "app/(member)/ — member home, scan, history, profile, and my-scans screens",
    "components/ — shared UI components, QR card, scanner, avatar picker, and list items",
    "hooks/ — auth and data hooks for profiles, attendance, onboarding, and admin flows",
    "services/ — Supabase request wrappers for auth, profiles, attendance, admin actions, and storage",
    "lib/ — Supabase client, config, date helpers, and query client setup",
    "supabase/ — SQL schema and create-user Edge Function",
    "types/ — shared database and role typing",
]))

story.append(p("Role-based navigation", "SectionStyle"))
story.append(bullets([
    "Admins see Dashboard, Scan, Attendance, Students, and Lecturers tabs.",
    "Members use Home, History, Profile, and, for lecturers, Scan and My Scans tabs.",
    "Lecturers can scan student QR codes and view their own scanning history, while students only see member screens.",
]))

story.append(p("Setup and deployment", "SectionStyle"))
story.append(bullets([
    "Run the SQL from supabase/schema.sql in the Supabase SQL Editor to create profiles, attendance, RLS policies, triggers, and avatar storage settings.",
    "Create lib/config.ts from lib/config.example.ts and add the Supabase URL and anon key.",
    "Create the first admin account from Supabase Dashboard Authentication → Users and include metadata like {\"full_name\": \"Jane Doe\", \"role\": \"admin\"}.",
    "Deploy the create-user Edge Function with the Supabase CLI so admin-created student and lecturer accounts work without exposing service-role credentials.",
    "Install dependencies with npm install and run npx expo start.",
]))

story.append(p("Database model", "SectionStyle"))
story.append(bullets([
    "profiles stores user identity, full name, role, avatar URL, and creation time.",
    "attendance records each scan event with the student user ID, date, recorder ID, and recorder role.",
    "The unique constraint is scoped to (user_id, date, recorded_by_role), so an admin and lecturer can both record the same student on the same day.",
    "RLS allows self-view, admin access, and lecturer access to student records needed for scanning and personal history.",
]))

story.append(p("Current implementation notes", "SectionStyle"))
story.append(bullets([
    "Profile pictures are admin-managed and stored in a public avatars bucket.",
    "The onboarding flow uses local image assets from assets/images/onboarding/.",
    "The app uses a single light theme defined in constants/theme.ts and avoids Tailwind or class-based styling.",
    "Attendance scans are unique per role and date to prevent duplicate entries while preserving separate admin/lecturer records.",
]))

story.append(PageBreak())
story.append(p("Key files to know", "SectionStyle"))
story.append(bullets([
    "app/_layout.tsx — root navigator and role-based route guarding",
    "app/(admin)/_layout.tsx — admin tab layout",
    "app/(member)/_layout.tsx — member tab layout",
    "hooks/use-auth.tsx — shared authentication and profile resolution",
    "services/attendance.ts — attendance history, recording, and deduplication logic",
    "services/admin.ts — admin-side account creation through the Edge Function",
    "supabase/schema.sql — canonical database and RLS setup",
    "app.json — Expo app metadata and permissions",
]))

story.append(p("Quick start commands", "SectionStyle"))
story.append(Paragraph("<br/>".join([
    "npm install",
    "npx expo start",
    "npx supabase functions deploy create-user",
]), styles["CodeStyle"]))

story.append(Spacer(1, 0.2 * inch))
story.append(p("This guide reflects the current repository state as of 2026-07-29.", "SubtitleStyle"))

pdf = SimpleDocTemplate(str(OUTPUT), pagesize=letter, rightMargin=0.7 * inch, leftMargin=0.7 * inch, topMargin=0.7 * inch, bottomMargin=0.7 * inch)
pdf.build(story)
print(f"Generated {OUTPUT}")
