import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Alert, Pressable, RefreshControl, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Card } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { useTodayCount } from "@/hooks/use-attendance";
import { useLecturers, useStudents } from "@/hooks/use-profile";

function StatCard({
  icon,
  label,
  value,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: number | undefined;
}) {
  return (
    <Card className="flex-1 gap-2">
      <View className="h-9 w-9 items-center justify-center rounded-full bg-blue-50 dark:bg-blue-900/40">
        <Ionicons name={icon} size={18} color="#2563eb" />
      </View>
      <Text className="text-2xl font-bold text-slate-900 dark:text-white">
        {value ?? "–"}
      </Text>
      <Text className="text-xs text-slate-500 dark:text-slate-400">{label}</Text>
    </Card>
  );
}

function QuickLink({
  icon,
  label,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      className="flex-1 items-center gap-2 rounded-2xl bg-blue-600 px-4 py-5 active:bg-blue-700"
    >
      <Ionicons name={icon} size={22} color="#ffffff" />
      <Text className="text-sm font-semibold text-white">{label}</Text>
    </Pressable>
  );
}

export default function AdminDashboardScreen() {
  const { profile, signOut } = useAuth();
  const router = useRouter();
  const todayCount = useTodayCount();
  const students = useStudents();
  const lecturers = useLecturers();

  const isRefetching =
    todayCount.isRefetching || students.isRefetching || lecturers.isRefetching;

  function refetchAll() {
    todayCount.refetch();
    students.refetch();
    lecturers.refetch();
  }

  function confirmSignOut() {
    Alert.alert("Sign out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      { text: "Sign out", style: "destructive", onPress: signOut },
    ]);
  }

  return (
    <SafeAreaView className="flex-1 bg-slate-50 dark:bg-slate-950" edges={["top"]}>
      <ScrollView
        contentContainerStyle={{ padding: 20, gap: 20 }}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={refetchAll} tintColor="#2563eb" />
        }
      >
        <View className="flex-row items-start justify-between">
          <View className="gap-1">
            <Text className="text-sm text-slate-500 dark:text-slate-400">Welcome,</Text>
            <Text className="text-2xl font-bold text-slate-900 dark:text-white">
              {profile?.full_name}
            </Text>
          </View>
          <Pressable
            onPress={confirmSignOut}
            hitSlop={12}
            className="h-10 w-10 items-center justify-center rounded-full bg-white dark:bg-slate-800"
          >
            <Ionicons name="log-out-outline" size={20} color="#dc2626" />
          </Pressable>
        </View>

        <View className="flex-row gap-3">
          <StatCard icon="checkmark-done" label="Present today" value={todayCount.data} />
          <StatCard icon="school" label="Students" value={students.data?.length} />
          <StatCard icon="briefcase" label="Lecturers" value={lecturers.data?.length} />
        </View>

        <View className="gap-3">
          <Text className="text-base font-semibold text-slate-900 dark:text-white">
            Quick actions
          </Text>
          <View className="flex-row gap-3">
            <QuickLink
              icon="qr-code-outline"
              label="Scan QR"
              onPress={() => router.push("/(admin)/scanner")}
            />
            <QuickLink
              icon="list-outline"
              label="Attendance"
              onPress={() => router.push("/(admin)/attendance")}
            />
            <QuickLink
              icon="person-add-outline"
              label="Add account"
              onPress={() => router.push("/(admin)/create-user")}
            />
          </View>
        </View>

        <View className="gap-3">
          <Text className="text-base font-semibold text-slate-900 dark:text-white">
            System & Help
          </Text>
          <Card className="flex-row items-center justify-between py-4 px-4">
            <View className="flex-row items-center gap-3">
              <View className="h-10 w-10 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-900/40">
                <Ionicons name="sparkles-outline" size={20} color="#2563eb" />
              </View>
              <View>
                <Text className="text-sm font-semibold text-slate-900 dark:text-white">
                  App Overview Tour
                </Text>
                <Text className="text-xs text-slate-500 dark:text-slate-400">
                  Replay onboarding slides and guide
                </Text>
              </View>
            </View>
            <Pressable
              onPress={() => router.push("/onboarding")}
              className="rounded-xl bg-blue-600 px-3.5 py-2 active:bg-blue-700"
            >
              <Text className="text-xs font-bold text-white">Replay</Text>
            </Pressable>
          </Card>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
