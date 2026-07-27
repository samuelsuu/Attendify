import { FlatList, RefreshControl, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { AttendanceListItem } from "@/components/attendance-list-item";
import { EmptyState } from "@/components/ui/empty-state";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { COLORS, FONT_SIZE, SPACING } from "@/constants/theme";
import { useAllAttendance } from "@/hooks/use-attendance";
import type { AttendanceWithProfile } from "@/types/database";

export default function AdminAttendanceScreen() {
  const { data, isLoading, isRefetching, refetch } = useAllAttendance();

  return (
    <SafeAreaView style={styles.screen} edges={["top"]}>
      <View style={styles.header}>
        <Text style={styles.title}>Attendance</Text>
      </View>

      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <FlatList<AttendanceWithProfile>
          data={data ?? []}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor={COLORS.primary} />
          }
          ListEmptyComponent={
            <EmptyState
              icon="list-outline"
              title="No attendance recorded"
              message="Scan a QR code to record the first attendance entry."
            />
          }
          renderItem={({ item }) => <AttendanceListItem record={item} />}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.mutedLight },
  header: { paddingHorizontal: SPACING.xl, paddingTop: SPACING.lg, paddingBottom: SPACING.sm },
  title: { fontSize: FONT_SIZE.xxxl, fontWeight: "700", color: COLORS.textPrimary },
  listContent: { padding: SPACING.xl, paddingTop: SPACING.sm, flexGrow: 1 },
});
