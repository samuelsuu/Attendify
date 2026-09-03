import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

import { FONT_SIZE, SPACING, useTheme } from "@/constants/theme";

type EmptyStateProps = {
  icon?: keyof typeof Ionicons.glyphMap;
  title: string;
  message?: string;
};

export function EmptyState({ icon = "file-tray-outline", title, message }: EmptyStateProps) {
  const COLORS = useTheme();
  const styles = getStyles(COLORS);

  return (
    <View style={styles.container}>
      <Ionicons name={icon} size={40} color={COLORS.muted} />
      <Text style={styles.title}>{title}</Text>
      {message ? <Text style={styles.message}>{message}</Text> : null}
    </View>
  );
}

function getStyles(COLORS: ReturnType<typeof useTheme>) {
  return StyleSheet.create({
    container: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      gap: SPACING.sm,
      paddingHorizontal: SPACING.xxl,
      paddingVertical: 64,
    },
    title: { fontSize: FONT_SIZE.lg, fontWeight: "600", color: COLORS.textPrimary },
    message: {
      textAlign: "center",
      fontSize: FONT_SIZE.md,
      color: COLORS.textSecondary,
    },
  });
}
