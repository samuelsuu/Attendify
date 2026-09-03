import { StyleSheet, Text, View } from "react-native";

import { FONT_SIZE, RADIUS, SPACING, useTheme, getRoleColors } from "@/constants/theme";
import type { Role } from "@/types/database";

export function RoleBadge({ role }: { role: Role }) {
  const colors = useTheme();
  const roleColors = getRoleColors(colors);
  const { bg, text } = roleColors[role];

  return (
    <View style={[styles.badge, { backgroundColor: bg }]}>
      <Text style={[styles.label, { color: text }]}>{role}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    borderRadius: RADIUS.full,
    paddingHorizontal: SPACING.md,
    paddingVertical: 4,
  },
  label: {
    fontSize: FONT_SIZE.xs,
    fontWeight: "600",
    textTransform: "capitalize",
  },
});
