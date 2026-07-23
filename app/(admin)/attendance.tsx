import { FlatList, RefreshControl, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { AttendanceListItem } from "@/components/attendance-list-item";
import { EmptyState } from "@/components/ui/empty-state";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useAllAttendance } from "@/hooks/use-attendance";
import type { AttendanceWithProfile } from "@/types/database";

export default function AdminAttendanceScreen() {
  const { data, isLoading, isRefetching, refetch } = useAllAttendance();

  return (
    <SafeAreaView className="flex-1 bg-slate-50 dark:bg-slate-950" edges={["top"]}>
      <View className="px-5 pb-2 pt-4">
        <Text className="text-2xl font-bold text-slate-900 dark:text-white">
          Attendance
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
