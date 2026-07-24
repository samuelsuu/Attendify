import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { AvatarPicker } from "@/components/avatar-picker";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useCreateAccount, useUpdateAvatar } from "@/hooks/use-admin";
import { generateTempPassword } from "@/lib/password";
import type { Role } from "@/types/database";

type MemberRole = Extract<Role, "student" | "lecturer">;

export default function CreateUserScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ role?: string }>();
  const initialRole: MemberRole = params.role === "lecturer" ? "lecturer" : "student";

  const [role, setRole] = useState<MemberRole>(initialRole);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState(generateTempPassword());
  const [avatarUri, setAvatarUri] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const createAccount = useCreateAccount();
  const updateAvatar = useUpdateAvatar();

  async function handleCreate() {
    setError(null);
    try {
      const account = await createAccount.mutateAsync({
        email: email.trim(),
        password,
        fullName: fullName.trim(),
        role,
      });

      if (avatarUri) {
        try {
          await updateAvatar.mutateAsync({ userId: account.id, localUri: avatarUri });
        } catch {
          // Account already exists at this point — don't block on a photo failure.
        }
      }

      Alert.alert(
        "Account created",
        `${account.fullName} can now sign in with:\n\nEmail: ${account.email}\nPassword: ${password}\n\nShare these credentials with them securely.`,
        [{ text: "Done", onPress: () => router.back() }]
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to create account.");
    }
  }

  const isSubmitting = createAccount.isPending || updateAvatar.isPending;
  const isValid = fullName.trim().length > 0 && email.trim().length > 0 && password.length >= 8;

  return (
    <SafeAreaView className="flex-1 bg-slate-50 dark:bg-slate-950" edges={["top"]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        className="flex-1"
      >
        <ScrollView contentContainerStyle={{ padding: 20, gap: 20 }} keyboardShouldPersistTaps="handled">
          <View className="flex-row items-center gap-3">
            <Pressable onPress={() => router.back()} hitSlop={12}>
              <Ionicons name="arrow-back" size={24} color="#2563eb" />
            </Pressable>
            <Text className="text-2xl font-bold text-slate-900 dark:text-white">
              Create account
            </Text>
          </View>

          <Card className="gap-4">
            <AvatarPicker
              uri={avatarUri}
              name={fullName || "?"}
              onPick={setAvatarUri}
            />

            <View className="gap-1.5">
              <Text className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                Account Role
              </Text>
              <View className="flex-row gap-2">
                {(["student", "lecturer"] as MemberRole[]).map((option) => {
                  const isSelected = role === option;
                  const roleIcon = option === "student" ? "school-outline" : "briefcase-outline";
                  return (
                    <Pressable
                      key={option}
                      onPress={() => setRole(option)}
                      className={`flex-1 flex-row items-center justify-center gap-2 rounded-xl border py-3 px-3 ${
                        isSelected
                          ? "border-blue-600 bg-blue-50 dark:bg-blue-900/40"
                          : "border-slate-200 dark:border-slate-700"
                      }`}
                    >
                      <Ionicons
                        name={roleIcon}
                        size={18}
                        color={isSelected ? "#2563eb" : "#64748b"}
                      />
                      <Text
                        className={`text-sm font-semibold capitalize ${
                          isSelected
                            ? "text-blue-700 dark:text-blue-300"
                            : "text-slate-600 dark:text-slate-300"
                        }`}
                      >
                        {option}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            <View className="gap-1.5">
              <Text className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                Full name
              </Text>
              <View className="flex-row items-center rounded-xl border border-slate-200 px-3.5 bg-slate-50/50 dark:border-slate-700 dark:bg-slate-800/50">
                <Ionicons name="person-outline" size={18} color="#64748b" />
                <TextInput
                  value={fullName}
                  onChangeText={setFullName}
                  placeholder="Jane Doe"
                  placeholderTextColor="#94a3b8"
                  className="flex-1 py-3 px-2.5 text-base text-slate-900 dark:text-white"
                />
              </View>
            </View>

            <View className="gap-1.5">
              <Text className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                Email address
              </Text>
              <View className="flex-row items-center rounded-xl border border-slate-200 px-3.5 bg-slate-50/50 dark:border-slate-700 dark:bg-slate-800/50">
                <Ionicons name="mail-outline" size={18} color="#64748b" />
                <TextInput
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  autoComplete="email"
                  keyboardType="email-address"
                  placeholder="jane@university.edu"
                  placeholderTextColor="#94a3b8"
                  className="flex-1 py-3 px-2.5 text-base text-slate-900 dark:text-white"
                />
              </View>
            </View>

            <View className="gap-1.5">
              <View className="flex-row items-center justify-between">
                <Text className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                  Temporary password
                </Text>
                <Pressable
                  onPress={() => setPassword(generateTempPassword())}
                  className="flex-row items-center gap-1"
                >
                  <Ionicons name="refresh-outline" size={14} color="#2563eb" />
                  <Text className="text-xs font-semibold text-blue-600">Regenerate</Text>
                </Pressable>
              </View>
              <View className="flex-row items-center rounded-xl border border-slate-200 px-3.5 bg-slate-50/50 dark:border-slate-700 dark:bg-slate-800/50">
                <Ionicons name="key-outline" size={18} color="#64748b" />
                <TextInput
                  value={password}
                  onChangeText={setPassword}
                  autoCapitalize="none"
                  placeholder="Password"
                  placeholderTextColor="#94a3b8"
                  className="flex-1 py-3 px-2.5 text-base text-slate-900 dark:text-white"
                />
              </View>
              <Text className="text-xs text-slate-400 dark:text-slate-500">
                At least 8 characters. Share credentials securely with {role === "student" ? "the student" : "the lecturer"}.
              </Text>
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
              label="Create account"
              icon="person-add-outline"
              onPress={handleCreate}
              loading={isSubmitting}
              disabled={!isValid}
            />
          </Card>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
