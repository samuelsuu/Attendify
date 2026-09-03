import { Ionicons } from "@expo/vector-icons";
import { FlatList, RefreshControl, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { RoleBadge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { FONT_SIZE, SPACING, useTheme } from "@/constants/theme";
import { useAttendanceHistory } from "@/hooks/use-attendance";
import { useAuth } from "@/hooks/use-auth";
import { formatDate, formatTime } from "@/lib/date";
import { getErrorMessage } from "@/lib/error-message";
import type { AttendanceRecord } from "@/types/database";

export default function HistoryScreen() {
  const { profile } = useAuth();
  const { data, error, isLoading, isRefetching, refetch } = useAttendanceHistory(profile?.id);
  const COLORS = useTheme();
  const styles = getStyles(COLORS);

  return (
    <SafeAreaView style={styles.screen} edges={["top"]}>
      <View style={styles.header}>
        <Text style={styles.title}>Attendance History</Text>
      </View>

      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <FlatList<AttendanceRecord>
          data={data ?? []}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor={COLORS.primary} />
          }
          ListEmptyComponent={
            error ? (
              <EmptyState
                icon="alert-circle-outline"
                title="Couldn't load your history"
                message={getErrorMessage(error)}
              />
            ) : (
              <EmptyState
                icon="calendar-outline"
                title="No attendance yet"
                message="Your recorded attendance will show up here."
              />
            )
          }
          renderItem={({ item }) => (
            <Card style={styles.row}>
              <View style={styles.icon}>
                <Ionicons name="checkmark-circle" size={22} color={COLORS.primary} />
              </View>
              <View style={styles.info}>
                <Text style={styles.date}>{formatDate(item.date)}</Text>
                <Text style={styles.time}>Recorded at {formatTime(item.recorded_at)}</Text>
              </View>
              {item.recorded_by_role ? (
                <View style={styles.markedBy}>
                  <Text style={styles.markedByLabel}>Marked by</Text>
                  <RoleBadge role={item.recorded_by_role} />
                </View>
              ) : null}
            </Card>
          )}
        />
      )}
    </SafeAreaView>
  );
}

function getStyles(COLORS: ReturnType<typeof useTheme>) {
  return StyleSheet.create({
    screen: { flex: 1, backgroundColor: COLORS.mutedLight },
    header: { paddingHorizontal: SPACING.xl, paddingTop: SPACING.lg, paddingBottom: SPACING.sm },
    title: { fontSize: FONT_SIZE.xxxl, fontWeight: "700", color: COLORS.textPrimary },
    listContent: { padding: SPACING.xl, paddingTop: SPACING.sm, flexGrow: 1 },
    row: { marginBottom: SPACING.md, flexDirection: "row", alignItems: "center", gap: SPACING.md },
    icon: {
      height: 40,
      width: 40,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 20,
      backgroundColor: COLORS.primaryLight,
    },
    info: { flex: 1, gap: 4 },
    date: { fontWeight: "600", color: COLORS.textPrimary, fontSize: FONT_SIZE.md },
    time: { fontSize: FONT_SIZE.xs, color: COLORS.textSecondary },
    markedBy: { alignItems: "flex-end", gap: 4 },
    markedByLabel: {
      fontSize: 10,
      textTransform: "uppercase",
      letterSpacing: 0.5,
      color: COLORS.textMuted,
    },
  });
}
