import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import  {KeyboardAvoidingView} from "react-native-keyboard-controller";
import Animated, { FadeInDown } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

import { Button } from "@/components/ui/button";
import { COLORS, FONT_SIZE, RADIUS, SPACING } from "@/constants/theme";
import { useAuth } from "@/hooks/use-auth";
import { getErrorMessage } from "@/lib/error-message";

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
      await signIn(email.trim(), password.trim());
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.screen}>
      <KeyboardAvoidingView behavior="padding" style={styles.flex}>
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          <View style={styles.centerColumn}>
            <View style={styles.header}>
              <View style={styles.logo}>
                <Ionicons name="school" size={34} color={COLORS.white} />
              </View>
              <Text style={styles.appName}>Webcapz</Text>
              <Text style={styles.tagline}>Sign in to your account</Text>
            </View>

            <Animated.View entering={FadeInDown.delay(200).duration(600)} style={styles.card}>
              <View style={styles.field}>
                <Text style={styles.fieldLabel}>Email address</Text>
                <View style={styles.inputRow}>
                  <Ionicons name="mail-outline" size={20} color={COLORS.textSecondary} />
                  <TextInput
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                    autoComplete="email"
                    keyboardType="email-address"
                    placeholder="you@university.edu"
                    placeholderTextColor={COLORS.textMuted}
                    style={styles.input}
                  />
                </View>
              </View>

              <View style={styles.field}>
                <Text style={styles.fieldLabel}>Password</Text>
                <View style={styles.inputRow}>
                  <Ionicons name="lock-closed-outline" size={20} color={COLORS.textSecondary} />
                  <TextInput
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                    placeholder="••••••••"
                    placeholderTextColor={COLORS.textMuted}
                    style={styles.input}
                  />
                  <TouchableOpacity onPress={() => setShowPassword((prev) => !prev)} hitSlop={8}>
                    <Ionicons
                      name={showPassword ? "eye-off-outline" : "eye-outline"}
                      size={20}
                      color={COLORS.textSecondary}
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {error ? (
                <View style={styles.errorBox}>
                  <Ionicons name="alert-circle-outline" size={18} color={COLORS.danger} />
                  <Text style={styles.errorText}>{error}</Text>
                </View>
              ) : null}

              <Button
                label="Sign in"
                icon="log-in-outline"
                onPress={handleSignIn}
                loading={loading}
                disabled={!email || !password}
                style={styles.signInButton}
              />

              <TouchableOpacity onPress={() => router.push("/onboarding")} style={styles.tourLink}>
                <Text style={styles.tourLinkText}>View App Tour &amp; Onboarding</Text>
              </TouchableOpacity>
            </Animated.View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.primaryDark },
  flex: { flex: 1 },
  scrollContent: { flexGrow: 1 },
  centerColumn: { flex: 1, justifyContent: "center", paddingHorizontal: SPACING.xl, paddingVertical: 40 },
  header: { marginBottom: SPACING.xxl, alignItems: "center", gap: SPACING.md },
  logo: {
    height: 64,
    width: 64,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: RADIUS.xl,
    backgroundColor: "rgba(255,255,255,0.15)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  appName: { fontSize: FONT_SIZE.hero, fontWeight: "800", color: COLORS.white, letterSpacing: -0.5 },
  tagline: { fontSize: FONT_SIZE.md, fontWeight: "500", color: COLORS.muted },
  card: {
    gap: SPACING.lg,
    borderRadius: RADIUS.xxl,
    backgroundColor: COLORS.white,
    padding: SPACING.xxl,
    shadowColor: COLORS.black,
    shadowOpacity: 0.2,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
  },
  field: { gap: 6 },
  fieldLabel: { fontSize: FONT_SIZE.md, fontWeight: "600", color: COLORS.textPrimary },
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
  signInButton: { marginTop: SPACING.xs },
  tourLink: {
    marginTop: SPACING.xs,
    // flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 4,
  },
  tourLinkText: { fontSize: FONT_SIZE.xs, fontWeight: "600", color: COLORS.primary },
});
