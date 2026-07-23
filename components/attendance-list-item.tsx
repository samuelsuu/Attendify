import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";

import { RoleBadge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { formatDate, formatTime } from "@/lib/date";
import type { AttendanceWithProfile } from "@/types/database";

export function AttendanceListItem({ record }: { record: AttendanceWithProfile }) {
  return (
    <Card className="mb-3 flex-row items-center gap-3">
      <View className="h-10 w-10 items-center justify-center rounded-full bg-blue-50 dark:bg-blue-900/40">
        <Ionicons name="checkmark-circle" size={22} color="#2563eb" />
      </View>
      <View className="flex-1 gap-1">
        <Text className="font-semibold text-slate-900 dark:text-white">
          {record.profile?.full_name ?? "Unknown user"}
        </Text>
        <Text className="text-xs text-slate-500 dark:text-slate-400">
          {formatDate(record.date)} · {formatTime(record.recorded_at)}
        </Text>
      </View>
      {record.profile ? <RoleBadge role={record.profile.role} /> : null}
    </Card>
  );
}
