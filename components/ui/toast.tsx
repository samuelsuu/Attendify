import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text } from "react-native";
import Animated, { FadeInDown, FadeOutUp } from "react-native-reanimated";

import { FONT_SIZE, RADIUS, SPACING, useTheme } from "@/constants/theme";

type ToastVariant = "success" | "error" | "info";

export function Toast({
  message,
  variant = "success",
}: {
  message: string;
  variant?: ToastVariant;
}) {
  const COLORS = useTheme();
  const styles = getStyles(COLORS);

  const VARIANT_STYLES: Record<
    ToastVariant,
    { bg: string; icon: keyof typeof Ionicons.glyphMap }
  > = {
    success: { bg: COLORS.accentGreen, icon: "checkmark-circle" },
    error: { bg: COLORS.danger, icon: "close-circle" },
    info: { bg: COLORS.primaryDark, icon: "information-circle" },
  };

  const { bg, icon } = VARIANT_STYLES[variant];

  return (
    <Animated.View
      entering={FadeInDown.duration(250)}
      exiting={FadeOutUp.duration(200)}
      style={[styles.toast, { backgroundColor: bg }]}
    >
      <Ionicons name={icon} size={20} color={COLORS.white} />
      <Text style={styles.message}>{message}</Text>
    </Animated.View>
  );
}

function getStyles(COLORS: ReturnType<typeof useTheme>) {
  return StyleSheet.create({
    toast: {
      flexDirection: "row",
      alignItems: "center",
      gap: SPACING.sm,
      borderRadius: RADIUS.xl,
      paddingHorizontal: SPACING.lg,
      paddingVertical: SPACING.md,
      shadowColor: COLORS.black,
      shadowOpacity: 0.2,
      shadowRadius: 8,
      shadowOffset: { width: 0, height: 4 },
      elevation: 4,
    },
    message: { flex: 1, fontSize: FONT_SIZE.md, fontWeight: "600", color: COLORS.white },
  });
}
