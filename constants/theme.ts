import {useColorScheme} from "react-native";
import type { Role } from "@/types/database";

type ColorPalette = Record<keyof typeof LIGHT_COLORS, string>;

const LIGHT_COLORS = {
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

const DARK_COLORS: ColorPalette = {
  primary: "#6CB6EB",
  primaryDark: "#BFE0F7",
  primaryLight: "#17324F",
  accentGreen: "#5FCB9B",
  accentGreenLight: "#123528",
  muted: "#4A5872",
  mutedLight: "#1B2740",
  background: "#0B1220",
  surface: "#121B2E",
  border: "#233150",
  textPrimary: "#EAF2FB",
  textSecondary: "#A9BBD0",
  textMuted: "#7C8FA6",
  white: "#FFFFFF",
  black: "#000000",
  danger: "#EF8A82",
  dangerLight: "#3A1A22",
  dangerBorder: "#5C2333",
  overlay: "rgba(0, 8, 20, 0.7)",
  shadow: "#000000",
};

export function useTheme() {
  const scheme = useColorScheme();
  return scheme === "dark" ? DARK_COLORS : LIGHT_COLORS;
}

export function getRoleColors(colors: ColorPalette): Record<Role, { bg: string; text: string }> {
  return {
    admin: { bg: colors.primaryLight, text: colors.primaryDark },
    student: { bg: colors.primaryLight, text: colors.primary },
    lecturer: { bg: colors.accentGreenLight, text: colors.accentGreen },
  };
}

// export const COLORS = {
  // primary: "#1C7FC4",
  // primaryDark: "#0B3D63",
  // primaryLight: "#E7F1F8",
  // accentGreen: "#1E9E6D",
  // accentGreenLight: "#E4F7EF",
  // muted: "#B8BCC2",
  // mutedLight: "#F1F3F5",
  // background: "#FFFFFF",
  // surface: "#FFFFFF",
  // border: "#E1E5EA",
  // textPrimary: "#0B3D63",
  // textSecondary: "#5B6B78",
  // textMuted: "#94A0AA",
  // white: "#FFFFFF",
  // black: "#000000",
  // danger: "#DC2626",
  // dangerLight: "#FDECEC",
  // dangerBorder: "#F4C7C7",
  // overlay: "rgba(11, 61, 99, 0.55)",
  // shadow: "#B8BCC2",
// } as const;



// export const ROLE_COLORS: Record<Role, { bg: string; text: string }> = {
//   admin: { bg: "#E7EEF5", text: COLORS.primaryDark },
//   student: { bg: COLORS.primaryLight, text: COLORS.primary },
//   lecturer: { bg: COLORS.accentGreenLight, text: COLORS.accentGreen },
// };

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
