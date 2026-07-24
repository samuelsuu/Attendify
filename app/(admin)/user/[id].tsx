import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { AvatarPicker } from "@/components/avatar-picker";
import { RoleBadge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useUpdateAvatar } from "@/hooks/use-admin";
import { useProfileById } from "@/hooks/use-profile";

export default function UserDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: profile, isLoading } = useProfileById(id);
  const updateAvatar = useUpdateAvatar();

  function handlePickAvatar(localUri: string) {
    if (!profile) return;
    updateAvatar.mutate({ userId: profile.id, localUri });
  }

  return (
    <SafeAreaView className="flex-1 bg-slate-50 dark:bg-slate-950" edges={["top"]}>
      <View className="flex-row items-center gap-3 px-5 pb-2 pt-4">
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <Ionicons name="arrow-back" size={24} color="#2563eb" />
        </Pressable>
        <Text className="text-2xl font-bold text-slate-900 dark:text-white">Profile</Text>
      </View>

      {isLoading ? (
        <LoadingSpinner />
      ) : !profile ? (
        <EmptyState icon="person-outline" title="User not found" />
      ) : (
        <ScrollView contentContainerStyle={{ padding: 20, gap: 20 }}>
          <Card className="items-center gap-3 py-8">
            <AvatarPicker
              uri={profile.avatar_url}
              name={profile.full_name}
              size={96}
              loading={updateAvatar.isPending}
              onPick={handlePickAvatar}
            />
            <Text className="text-xs font-medium text-blue-600">Tap photo to change</Text>
            <Text className="text-lg font-bold text-slate-900 dark:text-white">
              {profile.full_name}
            </Text>
            <RoleBadge role={profile.role} />
          </Card>

          <Card className="gap-4">
            <Text className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Account Info
            </Text>
            <View className="flex-row items-center gap-3">
              <View className="h-9 w-9 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-900/30">
                <Ionicons name="mail-outline" size={18} color="#2563eb" />
              </View>
              <View className="flex-1">
                <Text className="text-xs text-slate-500 dark:text-slate-400">Email</Text>
                <Text className="text-sm font-medium text-slate-900 dark:text-white">
                  {profile.email}
                </Text>
              </View>
            </View>
            <View className="flex-row items-center gap-3">
              <View className="h-9 w-9 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-900/30">
                <Ionicons name="finger-print-outline" size={18} color="#2563eb" />
              </View>
              <View className="flex-1">
                <Text className="text-xs text-slate-500 dark:text-slate-400">User ID</Text>
                <Text className="text-sm font-medium text-slate-900 dark:text-white">
                  {profile.id}
                </Text>
              </View>
            </View>
          </Card>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
