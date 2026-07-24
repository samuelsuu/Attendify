import { Ionicons } from "@expo/vector-icons";
import { FlatList, RefreshControl, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { RoleBadge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useAuth } from "@/hooks/use-auth";
import { useAttendanceHistory } from "@/hooks/use-attendance";
import { formatDate, formatTime } from "@/lib/date";
import type { AttendanceRecord } from "@/types/database";

export default function HistoryScreen() {
  const { profile } = useAuth();
  const { data, isLoading, isRefetching, refetch } = useAttendanceHistory(profile?.id);

  return (
    <SafeAreaView className="flex-1 bg-slate-50 dark:bg-slate-950" edges={["top"]}>
      <View className="px-5 pb-2 pt-4">
        <Text className="text-2xl font-bold text-slate-900 dark:text-white">
          Attendance History
        </Text>
      </View>

      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <FlatList<AttendanceRecord>
          data={data ?? []}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 20, paddingTop: 8, flexGrow: 1 }}
          refreshControl={
            <RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor="#2563eb" />
          }
          ListEmptyComponent={
            <EmptyState
              icon="calendar-outline"
              title="No attendance yet"
              message="Your recorded attendance will show up here."
            />
          }
          renderItem={({ item }) => (
            <Card className="mb-3 flex-row items-center gap-3">
              <View className="h-10 w-10 items-center justify-center rounded-full bg-blue-50 dark:bg-blue-900/40">
                <Ionicons name="checkmark-circle" size={22} color="#2563eb" />
              </View>
              <View className="flex-1 gap-1">
                <Text className="font-semibold text-slate-900 dark:text-white">
                  {formatDate(item.date)}
                </Text>
                <Text className="text-xs text-slate-500 dark:text-slate-400">
                  Recorded at {formatTime(item.recorded_at)}
                </Text>
              </View>
              {item.recorded_by_role ? (
                <View className="items-end gap-1">
                  <Text className="text-[10px] uppercase tracking-wide text-slate-400 dark:text-slate-500">
                    Marked by
                  </Text>
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
