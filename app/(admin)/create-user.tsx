import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { AvatarPicker } from "@/components/avatar-picker";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { COLORS, FONT_SIZE, RADIUS, SPACING } from "@/constants/theme";
import { useCreateAccount, useUpdateAvatar } from "@/hooks/use-admin";
import { getErrorMessage } from "@/lib/error-message";
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
      setError(getErrorMessage(err));
    }
  }

  const isSubmitting = createAccount.isPending || updateAvatar.isPending;
  const isValid = fullName.trim().length > 0 && email.trim().length > 0 && password.length >= 8;

  return (
    <SafeAreaView style={styles.screen} edges={["top"]}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.flex}>
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          <View style={styles.header}>
            <Pressable onPress={() => router.back()} hitSlop={12}>
              <Ionicons name="arrow-back" size={24} color={COLORS.primary} />
            </Pressable>
            <Text style={styles.title}>Create account</Text>
          </View>

          <Card style={styles.card}>
            <AvatarPicker uri={avatarUri} name={fullName || "?"} onPick={setAvatarUri} />

            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Account Role</Text>
              <View style={styles.roleRow}>
                {(["student", "lecturer"] as MemberRole[]).map((option) => {
                  const isSelected = role === option;
                  const roleIcon = option === "student" ? "school-outline" : "briefcase-outline";
                  return (
                    <Pressable
                      key={option}
                      onPress={() => setRole(option)}
                      style={[styles.roleOption, isSelected && styles.roleOptionSelected]}
                    >
                      <Ionicons
                        name={roleIcon}
                        size={18}
                        color={isSelected ? COLORS.primary : COLORS.textSecondary}
                      />
                      <Text style={[styles.roleLabel, isSelected && styles.roleLabelSelected]}>
                        {option}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Full name</Text>
              <View style={styles.inputRow}>
                <Ionicons name="person-outline" size={18} color={COLORS.textSecondary} />
                <TextInput
                  value={fullName}
                  onChangeText={setFullName}
                  placeholder="Jane Doe"
                  placeholderTextColor={COLORS.textMuted}
                  style={styles.input}
                />
              </View>
            </View>

            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Email address</Text>
              <View style={styles.inputRow}>
                <Ionicons name="mail-outline" size={18} color={COLORS.textSecondary} />
                <TextInput
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  autoComplete="email"
                  keyboardType="email-address"
                  placeholder="jane@university.edu"
                  placeholderTextColor={COLORS.textMuted}
                  style={styles.input}
                />
              </View>
            </View>

            <View style={styles.field}>
              <View style={styles.passwordHeader}>
                <Text style={styles.fieldLabel}>Temporary password</Text>
                <Pressable onPress={() => setPassword(generateTempPassword())} style={styles.regenerate}>
                  <Ionicons name="refresh-outline" size={14} color={COLORS.primary} />
                  <Text style={styles.regenerateLabel}>Regenerate</Text>
                </Pressable>
              </View>
              <View style={styles.inputRow}>
                <Ionicons name="key-outline" size={18} color={COLORS.textSecondary} />
                <TextInput
                  value={password}
                  onChangeText={setPassword}
                  autoCapitalize="none"
                  placeholder="Password"
                  placeholderTextColor={COLORS.textMuted}
                  style={styles.input}
                />
              </View>
              <Text style={styles.hint}>
                At least 8 characters. Share credentials securely with{" "}
                {role === "student" ? "the student" : "the lecturer"}.
              </Text>
            </View>

            {error ? (
              <View style={styles.errorBox}>
                <Ionicons name="alert-circle-outline" size={18} color={COLORS.danger} />
                <Text style={styles.errorText}>{error}</Text>
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

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.mutedLight },
  flex: { flex: 1 },
  scrollContent: { padding: SPACING.xl, gap: SPACING.xl },
  header: { flexDirection: "row", alignItems: "center", gap: SPACING.md },
  title: { fontSize: FONT_SIZE.xxxl, fontWeight: "700", color: COLORS.textPrimary },
  card: { gap: SPACING.lg },
  field: { gap: 6 },
  fieldLabel: { fontSize: FONT_SIZE.md, fontWeight: "600", color: COLORS.textPrimary },
  roleRow: { flexDirection: "row", gap: SPACING.sm },
  roleOption: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: SPACING.sm,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.md,
  },
  roleOptionSelected: { borderColor: COLORS.primary, backgroundColor: COLORS.primaryLight },
  roleLabel: { fontSize: FONT_SIZE.md, fontWeight: "600", color: COLORS.textSecondary, textTransform: "capitalize" },
  roleLabelSelected: { color: COLORS.primary },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: SPACING.md,
    backgroundColor: COLORS.mutedLight,
  },
  input: { flex: 1, paddingVertical: SPACING.md, fontSize: FONT_SIZE.lg, color: COLORS.textPrimary },
  passwordHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  regenerate: { flexDirection: "row", alignItems: "center", gap: 4 },
  regenerateLabel: { fontSize: FONT_SIZE.xs, fontWeight: "600", color: COLORS.primary },
  hint: { fontSize: FONT_SIZE.xs, color: COLORS.textMuted },
  errorBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    backgroundColor: COLORS.dangerLight,
    borderWidth: 1,
    borderColor: COLORS.dangerBorder,
  },
  errorText: { flex: 1, fontSize: FONT_SIZE.xs, fontWeight: "500", color: COLORS.danger },
});
