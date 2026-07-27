import type { Role } from "@/types/database";

/** The app's single (light-only) theme. Plain values used directly in
 * StyleSheet.create() calls — no NativeWind, no dark mode branching. */
export const COLORS = {
  primary: "#1C7FC4",
  primaryDark: "#0B3D63",
  primaryLight: "#E7F1F8",
  accentGreen: "#1E9E6D",
  accentGreenLight: "#E4F7EF",
  muted: "#B8BCC2",
  mutedLight: "#F1F3F5",
  background: "#FFFFFF",
  surface: "#FFFFFF",
  border: "#E1E5EA",
  textPrimary: "#0B3D63",
  textSecondary: "#5B6B78",
  textMuted: "#94A0AA",
  white: "#FFFFFF",
  black: "#000000",
  danger: "#DC2626",
  dangerLight: "#FDECEC",
  dangerBorder: "#F4C7C7",
  overlay: "rgba(11, 61, 99, 0.55)",
  shadow: "#B8BCC2",
} as const;

export const ROLE_COLORS: Record<Role, { bg: string; text: string }> = {
  admin: { bg: "#E7EEF5", text: COLORS.primaryDark },
  student: { bg: COLORS.primaryLight, text: COLORS.primary },
  lecturer: { bg: COLORS.accentGreenLight, text: COLORS.accentGreen },
};

export const RADIUS = {
  xs: 6,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  full: 999,
} as const;

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
} as const;

export const FONT_SIZE = {
  xs: 11,
  sm: 12,
  base: 13,
  md: 14,
  lg: 16,
  xl: 18,
  xxl: 20,
  xxxl: 24,
  display: 28,
  hero: 32,
} as const;
