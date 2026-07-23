import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";

import { Card } from "@/components/ui/card";
import type { Profile } from "@/types/database";

export function UserListItem({ profile }: { profile: Profile }) {
  const roleIcon = profile.role === "student" ? "school-outline" : profile.role === "lecturer" ? "briefcase-outline" : "shield-checkmark-outline";

  return (
    <Card className="mb-3 flex-row items-center gap-3">
      <View className="h-11 w-11 items-center justify-center rounded-2xl bg-blue-600 shadow-sm">
        <Text className="text-base font-extrabold text-white">
          {profile.full_name.charAt(0).toUpperCase()}
        </Text>
      </View>
      <View className="flex-1 gap-1">
        <View className="flex-row items-center gap-1.5">
          <Text className="font-bold text-slate-900 dark:text-white">
            {profile.full_name}
          </Text>
          <Ionicons name={roleIcon} size={14} color="#2563eb" />
        </View>
        <View className="flex-row items-center gap-1">
          <Ionicons name="mail-outline" size={12} color="#94a3b8" />
          <Text className="text-xs text-slate-500 dark:text-slate-400">{profile.email}</Text>
        </View>
      </View>
      <Ionicons name="chevron-forward" size={18} color="#94a3b8" />
    </Card>
  );
}
