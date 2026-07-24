import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";

import { RoleBadge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { formatDate, formatTime } from "@/lib/date";
import type { AttendanceWithProfile } from "@/types/database";

export function AttendanceListItem({ record }: { record: AttendanceWithProfile }) {
  return (
    <Card className="mb-3 flex-row items-center gap-3">
      <View>
        <Avatar
          uri={record.profile?.avatar_url}
          name={record.profile?.full_name ?? "?"}
          size={40}
        />
        <View className="absolute -bottom-1 -right-1 h-4 w-4 items-center justify-center rounded-full bg-emerald-500 border-2 border-white dark:border-slate-800">
          <Ionicons name="checkmark" size={9} color="#ffffff" />
        </View>
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
