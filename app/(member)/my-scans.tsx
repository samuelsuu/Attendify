import { FlatList, RefreshControl, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { AttendanceListItem } from "@/components/attendance-list-item";
import { EmptyState } from "@/components/ui/empty-state";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useAuth } from "@/hooks/use-auth";
import { useMyScans } from "@/hooks/use-attendance";
import type { AttendanceWithProfile } from "@/types/database";

export default function MyScansScreen() {
  const { profile } = useAuth();
  const { data, isLoading, isRefetching, refetch } = useMyScans(profile?.id);

  return (
    <SafeAreaView className="flex-1 bg-slate-50 dark:bg-slate-950" edges={["top"]}>
      <View className="px-5 pb-2 pt-4">
        <Text className="text-2xl font-bold text-slate-900 dark:text-white">My Scans</Text>
        <Text className="text-sm text-slate-500 dark:text-slate-400">
          Students you&apos;ve marked present
        </Text>
      </View>

      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <FlatList<AttendanceWithProfile>
          data={data ?? []}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 20, paddingTop: 8, flexGrow: 1 }}
          refreshControl={
            <RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor="#2563eb" />
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
