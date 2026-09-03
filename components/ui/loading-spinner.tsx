import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

import { FONT_SIZE, SPACING, useTheme } from "@/constants/theme";

export function LoadingSpinner({ label }: { label?: string }) {
  const COLORS = useTheme();
  const styles = getStyles(COLORS);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={COLORS.primary} />
      {label ? <Text style={styles.label}>{label}</Text> : null}
    </View>
  );
}

function getStyles(COLORS: ReturnType<typeof useTheme>) {
  return StyleSheet.create({
    container: { flex: 1, alignItems: "center", justifyContent: "center", gap: SPACING.md },
    label: { fontSize: FONT_SIZE.md, color: COLORS.textSecondary },
  });
}
