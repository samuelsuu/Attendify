import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

import { COLORS, FONT_SIZE, SPACING } from "@/constants/theme";

export function LoadingSpinner({ label }: { label?: string }) {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={COLORS.primary} />
      {label ? <Text style={styles.label}>{label}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center", gap: SPACING.md },
  label: { fontSize: FONT_SIZE.md, color: COLORS.textSecondary },
});
