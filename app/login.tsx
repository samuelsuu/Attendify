import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";

export default function LoginScreen() {
  const { signIn } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSignIn() {
    setError(null);
    setLoading(true);
    try {
      await signIn(email.trim(), password);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to sign in.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-[#0B3D63] dark:bg-slate-950">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <View className="flex-1 justify-center px-6 py-10">
            <Animated.View
              entering={FadeInDown.duration(400)}
              className="mb-8 items-center gap-3"
            >
              <View className="h-16 w-16 items-center justify-center rounded-2xl bg-white/15 shadow-sm border border-white/20">
                <Ionicons name="school" size={34} color="#ffffff" />
              </View>
              <Text className="text-3xl font-extrabold text-white tracking-tight">
                Webcapz
              </Text>
              <Text className="text-sm font-medium text-[#B8BCC2]">
                Sign in to your account
              </Text>
            </Animated.View>

            <Animated.View
              entering={FadeInDown.delay(100).duration(400)}
              className="gap-4 rounded-3xl bg-[#FFF] p-6 shadow-xl dark:bg-slate-900"
            >
              <View className="gap-1.5">
                <Text className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                  Email address
                </Text>
                <View className="flex-row items-center rounded-xl border border-slate-200 px-3.5 bg-slate-50/50 dark:border-slate-700 dark:bg-slate-800/50">
                  <Ionicons name="mail-outline" size={20} color="#64748b" />
                  <TextInput
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                    autoComplete="email"
                    keyboardType="email-address"
                    placeholder="you@university.edu"
                    placeholderTextColor="#94a3b8"
                    className="flex-1 py-3 px-2.5 text-base text-slate-900 dark:text-white"
                  />
                </View>
              </View>

              <View className="gap-1.5">
                <Text className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                  Password
                </Text>
                <View className="flex-row items-center rounded-xl border border-slate-200 px-3.5 bg-slate-50/50 dark:border-slate-700 dark:bg-slate-800/50">
                  <Ionicons name="lock-closed-outline" size={20} color="#64748b" />
                  <TextInput
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                    placeholder="••••••••"
                    placeholderTextColor="#94a3b8"
                    className="flex-1 py-3 px-2.5 text-base text-slate-900 dark:text-white"
                  />
                  <Pressable
                    onPress={() => setShowPassword((prev) => !prev)}
                    hitSlop={8}
                  >
                    <Ionicons
                      name={showPassword ? "eye-off-outline" : "eye-outline"}
                      size={20}
                      color="#64748b"
                    />
                  </Pressable>
                </View>
              </View>

              {error ? (
                <View className="flex-row items-center gap-2 rounded-xl bg-red-50 p-3 dark:bg-red-950/50 border border-red-200 dark:border-red-800">
                  <Ionicons name="alert-circle-outline" size={18} color="#dc2626" />
                  <Text className="flex-1 text-xs font-medium text-red-600 dark:text-red-400">
                    {error}
                  </Text>
                </View>
              ) : null}

              <Button
                label="Sign in"
                icon="log-in-outline"
                onPress={handleSignIn}
                loading={loading}
                disabled={!email || !password}
                className="mt-2"
              />

              <Pressable
                onPress={() => router.push("/onboarding")}
                className="mt-2 flex-row items-center justify-center gap-1.5 py-1"
              >
                <Ionicons name="sparkles-outline" size={16} color="#1C7FC4" />
                <Text className="text-xs font-semibold text-[#1C7FC4] dark:text-[#B8BCC2]">
                  View App Tour & Onboarding
                </Text>
              </Pressable>
            </Animated.View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
