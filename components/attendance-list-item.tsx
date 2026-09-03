import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

import { Avatar } from "@/components/ui/avatar";
import { RoleBadge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { FONT_SIZE, SPACING, useTheme } from "@/constants/theme";
import { formatDate, formatTime } from "@/lib/date";
import type { AttendanceWithProfile } from "@/types/database";

export function AttendanceListItem({ record }: { record: AttendanceWithProfile }) {
  const COLORS = useTheme();
  const styles = getStyles(COLORS);

  return (
    <Card style={styles.card}>
      <View>
        <Avatar
          uri={record.profile?.avatar_url}
          name={record.profile?.full_name ?? "?"}
          size={40}
        />
        <View style={styles.badge}>
          <Ionicons name="checkmark" size={9} color={COLORS.white} />
        </View>
      </View>
      <View style={styles.info}>
        <Text style={styles.name}>{record.profile?.full_name ?? "Unknown user"}</Text>
        <Text style={styles.meta}>
          {formatDate(record.date)} · {formatTime(record.recorded_at)}
        </Text>
      </View>
      {record.profile ? <RoleBadge role={record.profile.role} /> : null}
    </Card>
  );
}

function getStyles(COLORS: ReturnType<typeof useTheme>) {
  return StyleSheet.create({
    card: { marginBottom: SPACING.md, flexDirection: "row", alignItems: "center", gap: SPACING.md },
    badge: {
      position: "absolute",
      bottom: -2,
      right: -2,
      height: 16,
      width: 16,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 8,
      backgroundColor: COLORS.accentGreen,
      borderWidth: 2,
      borderColor: COLORS.white,
    },
    info: { flex: 1, gap: 4 },
    name: { fontWeight: "600", color: COLORS.textPrimary, fontSize: FONT_SIZE.md },
    meta: { fontSize: FONT_SIZE.xs, color: COLORS.textSecondary },
  });
}
