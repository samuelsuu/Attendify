import { FlatList, RefreshControl, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { AttendanceListItem } from "@/components/attendance-list-item";
import { EmptyState } from "@/components/ui/empty-state";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { COLORS, FONT_SIZE, SPACING } from "@/constants/theme";
import { useMyScans } from "@/hooks/use-attendance";
import { useAuth } from "@/hooks/use-auth";
import type { AttendanceWithProfile } from "@/types/database";

export default function MyScansScreen() {
  const { profile } = useAuth();
  const { data, isLoading, isRefetching, refetch } = useMyScans(profile?.id);

  return (
    <SafeAreaView style={styles.screen} edges={["top"]}>
      <View style={styles.header}>
        <Text style={styles.title}>My Scans</Text>
        <Text style={styles.subtitle}>Students you&apos;ve marked present</Text>
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
              icon="qr-code-outline"
              title="No scans yet"
              message="Students you scan for attendance will show up here."
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
  header: { paddingHorizontal: SPACING.xl, paddingTop: SPACING.lg, paddingBottom: SPACING.sm, gap: 2 },
  title: { fontSize: FONT_SIZE.xxxl, fontWeight: "700", color: COLORS.textPrimary },
  subtitle: { fontSize: FONT_SIZE.md, color: COLORS.textSecondary },
  listContent: { padding: SPACING.xl, paddingTop: SPACING.sm, flexGrow: 1 },
});
