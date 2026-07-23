import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, { FadeInDown } from "react-native-reanimated";

import { RoleBadge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { QrCodeCard } from "@/components/qr-code-card";
import { useAuth } from "@/hooks/use-auth";

export default function MemberHomeScreen() {
  const { profile } = useAuth();
  const router = useRouter();

  if (!profile) {
    return <LoadingSpinner />;
  }

  return (
    <SafeAreaView className="flex-1 bg-slate-50 dark:bg-slate-950" edges={["top"]}>
      <ScrollView contentContainerStyle={{ padding: 20, gap: 20 }}>
        <Animated.View entering={FadeInDown.duration(400)} className="gap-2">
          <View className="flex-row items-center gap-1.5">
            <Ionicons name="sparkles-outline" size={16} color="#2563eb" />
            <Text className="text-sm font-medium text-slate-500 dark:text-slate-400">
              Welcome back,
            </Text>
          </View>
          <View className="flex-row items-center justify-between">
            <Text className="text-2xl font-bold text-slate-900 dark:text-white">
              {profile.full_name}
            </Text>
            <RoleBadge role={profile.role} />
          </View>
        </Animated.View>

        {/* Quick Info Card */}
        <Animated.View entering={FadeInDown.delay(50).duration(400)}>
          <Card className="flex-row items-center gap-3.5 bg-blue-50/70 border border-blue-200/60 dark:bg-blue-950/30 dark:border-blue-900/50">
            <View className="h-10 w-10 items-center justify-center rounded-xl bg-blue-600">
              <Ionicons name="scan-outline" size={22} color="#ffffff" />
            </View>
            <View className="flex-1">
              <Text className="text-sm font-bold text-blue-950 dark:text-blue-200">
                Attendance Ready
              </Text>
              <Text className="text-xs text-blue-800/80 dark:text-blue-300/80">
                Show your personal QR pass to record presence
              </Text>
            </View>
          </Card>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(100).duration(400)}>
          <QrCodeCard value={profile.id} />
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(150).duration(400)} className="items-center">
          <Pressable
            onPress={() => router.push("/onboarding")}
            className="flex-row items-center gap-1.5 py-2 px-4 rounded-full bg-slate-200/60 dark:bg-slate-800"
          >
            <Ionicons name="help-circle-outline" size={16} color="#64748b" />
            <Text className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              How attendance works
            </Text>
          </Pressable>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}
