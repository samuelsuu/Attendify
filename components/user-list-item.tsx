import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { Avatar } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { COLORS, FONT_SIZE, SPACING } from "@/constants/theme";
import type { Profile } from "@/types/database";

export function UserListItem({
  profile,
  onPress,
}: {
  profile: Profile;
  onPress?: () => void;
}) {
  const roleIcon =
    profile.role === "student"
      ? "school-outline"
      : profile.role === "lecturer"
        ? "briefcase-outline"
        : "shield-checkmark-outline";

  return (
    <Pressable onPress={onPress} disabled={!onPress}>
      <Card style={styles.card}>
        <Avatar uri={profile.avatar_url} name={profile.full_name} size={44} />
        <View style={styles.info}>
          <View style={styles.nameRow}>
            <Text style={styles.name}>{profile.full_name}</Text>
            <Ionicons name={roleIcon} size={14} color={COLORS.primary} />
          </View>
          <View style={styles.emailRow}>
            <Ionicons name="mail-outline" size={12} color={COLORS.textMuted} />
            <Text style={styles.email}>{profile.email}</Text>
          </View>
        </View>
        {onPress ? <Ionicons name="chevron-forward" size={18} color={COLORS.textMuted} /> : null}
      </Card>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { marginBottom: SPACING.md, flexDirection: "row", alignItems: "center", gap: SPACING.md },
  info: { flex: 1, gap: 4 },
  nameRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  name: { fontWeight: "700", color: COLORS.textPrimary, fontSize: FONT_SIZE.md },
  emailRow: { flexDirection: "row", alignItems: "center", gap: 4 },
  email: { fontSize: FONT_SIZE.xs, color: COLORS.textSecondary },
});
