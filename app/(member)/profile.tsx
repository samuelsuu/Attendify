import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { RoleBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useAuth } from "@/hooks/use-auth";
import { useOnboarding } from "@/hooks/use-onboarding";

export default function ProfileScreen() {
  const { profile, signOut } = useAuth();
  const router = useRouter();
  const { resetOnboarding } = useOnboarding();

  if (!profile) {
    return <LoadingSpinner />;
  }

  async function handleReplayOnboarding() {
    await resetOnboarding();
    router.push("/onboarding");
  }

  return (
    <SafeAreaView className="flex-1 bg-slate-50 dark:bg-slate-950" edges={["top"]}>
      <ScrollView contentContainerStyle={{ padding: 20, gap: 20 }}>
        <View className="flex-row items-center gap-2">
          <Ionicons name="person-circle-outline" size={28} color="#2563eb" />
          <Text className="text-2xl font-bold text-slate-900 dark:text-white">Profile</Text>
        </View>

        <Card className="items-center gap-3 py-8">
          <View className="h-20 w-20 items-center justify-center rounded-full bg-blue-600 shadow-md">
            <Text className="text-3xl font-bold text-white">
              {profile.full_name.charAt(0).toUpperCase()}
            </Text>
          </View>
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
          <View className="flex-row items-center gap-3">
            <View className="h-9 w-9 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-900/30">
              <Ionicons name="shield-outline" size={18} color="#2563eb" />
            </View>
            <View className="flex-1">
              <Text className="text-xs text-slate-500 dark:text-slate-400">Role</Text>
              <Text className="text-sm font-medium capitalize text-slate-900 dark:text-white">
                {profile.role}
              </Text>
            </View>
          </View>
        </Card>

        {/* <Card className="gap-3">
          <Text className="text-xs font-bold uppercase tracking-wider text-slate-400">
            App Help & Onboarding
          </Text>
          <Button
            label="Replay Onboarding Tour"
            variant="outline"
            icon="sparkles-outline"
            onPress={handleReplayOnboarding}
          />
        </Card> */}

        <Button label="Sign out" icon="log-out-outline" variant="danger" onPress={signOut} />
      </ScrollView>
    </SafeAreaView>
  );
}
