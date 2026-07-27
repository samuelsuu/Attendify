import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { ScrollView, Text, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

import { QrCodeCard } from "@/components/qr-code-card";
import { Avatar } from "@/components/ui/avatar";
import { RoleBadge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useAuth } from "@/hooks/use-auth";

export default function MemberHomeScreen() {
  const { profile } = useAuth();
  const router = useRouter();

  if (!profile) {
    return <LoadingSpinner />;
  }

  return (
    <SafeAreaView className="flex-1 bg-[#FFF] dark:bg-slate-950" edges={["top"]}>
      <ScrollView contentContainerStyle={{ padding: 20, gap: 20 }}>
        <Animated.View entering={FadeInDown.duration(400)} className="flex-row items-center gap-3.5">
          <Avatar uri={profile.avatar_url} name={profile.full_name} size={52} />
          <View className="flex-1 gap-2">
            <View className="flex-row items-center gap-1.5">
              <Ionicons name="sparkles-outline" size={16} color="#1C7FC4" />
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
          </View>
        </Animated.View>

        {/* Quick Info Card */}
        <Animated.View entering={FadeInDown.delay(50).duration(400)}>
          <Card className="flex-row items-center gap-3.5 bg-[#B8BCC2]/20 border border-[#B8BCC2]/40 dark:bg-blue-950/30 dark:border-blue-900/50">
            <View className="h-10 w-10 items-center justify-center rounded-xl bg-[#1C7FC4]">
              <Ionicons name="scan-outline" size={22} color="#ffffff" />
            </View>
            <View className="flex-1">
              <Text className="text-sm font-bold text-[#0B3D63] dark:text-blue-200">
                Attendance Ready
              </Text>
              <Text className="text-xs text-[#0B3D63]/80 dark:text-blue-300/80">
                Show your personal QR pass to record presence
              </Text>
            </View>
          </Card>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(100).duration(400)}>
          <QrCodeCard value={profile.id} />
        </Animated.View>

        {/* <Animated.View entering={FadeInDown.delay(150).duration(400)} className="items-center">
          <Pressable
            onPress={() => router.push("/onboarding")}
            className="flex-row items-center gap-1.5 py-2 px-4 rounded-full bg-slate-200/60 dark:bg-slate-800"
          >
            <Ionicons name="help-circle-outline" size={16} color="#64748b" />
            <Text className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              How attendance works
            </Text>
          </Pressable>
        </Animated.View> */}
      </ScrollView>
    </SafeAreaView>
  );
}
