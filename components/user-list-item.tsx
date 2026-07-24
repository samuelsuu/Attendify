import { Ionicons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";

import { Avatar } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import type { Profile } from "@/types/database";

export function UserListItem({
  profile,
  onPress,
}: {
  profile: Profile;
  onPress?: () => void;
}) {
  const roleIcon =
    profile.role === "student"
      ? "school-outline"
      : profile.role === "lecturer"
        ? "briefcase-outline"
        : "shield-checkmark-outline";

  return (
    <Pressable onPress={onPress} disabled={!onPress}>
      <Card className="mb-3 flex-row items-center gap-3">
        <Avatar uri={profile.avatar_url} name={profile.full_name} size={44} />
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
        {onPress ? <Ionicons name="chevron-forward" size={18} color="#94a3b8" /> : null}
      </Card>
    </Pressable>
  );
}
