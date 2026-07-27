import { Ionicons } from "@expo/vector-icons";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Avatar } from "@/components/ui/avatar";
import { RoleBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { COLORS, FONT_SIZE, RADIUS, SPACING } from "@/constants/theme";
import { useAuth } from "@/hooks/use-auth";

export default function ProfileScreen() {
  const { profile, signOut } = useAuth();

  if (!profile) {
    return <LoadingSpinner />;
  }

  return (
    <SafeAreaView style={styles.screen} edges={["top"]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Ionicons name="person-circle-outline" size={28} color={COLORS.primary} />
          <Text style={styles.title}>Profile</Text>
        </View>

        <Card style={styles.avatarCard}>
          <Avatar uri={profile.avatar_url} name={profile.full_name} size={80} />
          <Text style={styles.name}>{profile.full_name}</Text>
          <RoleBadge role={profile.role} />
        </Card>

        <Card style={styles.infoCard}>
          <Text style={styles.sectionLabel}>Account Info</Text>
          <View style={styles.infoRow}>
            <View style={styles.infoIcon}>
              <Ionicons name="mail-outline" size={18} color={COLORS.primary} />
            </View>
            <View style={styles.infoText}>
              <Text style={styles.infoLabel}>Email</Text>
              <Text style={styles.infoValue}>{profile.email}</Text>
            </View>
          </View>
          <View style={styles.infoRow}>
            <View style={styles.infoIcon}>
              <Ionicons name="finger-print-outline" size={18} color={COLORS.primary} />
            </View>
            <View style={styles.infoText}>
              <Text style={styles.infoLabel}>User ID</Text>
              <Text style={styles.infoValue}>{profile.id}</Text>
            </View>
          </View>
          <View style={styles.infoRow}>
            <View style={styles.infoIcon}>
              <Ionicons name="shield-outline" size={18} color={COLORS.primary} />
            </View>
            <View style={styles.infoText}>
              <Text style={styles.infoLabel}>Role</Text>
              <Text style={[styles.infoValue, styles.capitalize]}>{profile.role}</Text>
            </View>
          </View>
        </Card>

        <Button label="Sign out" icon="log-out-outline" variant="danger" onPress={signOut} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.mutedLight },
  scrollContent: { padding: SPACING.xl, gap: SPACING.xl },
  header: { flexDirection: "row", alignItems: "center", gap: SPACING.sm },
  title: { fontSize: FONT_SIZE.xxxl, fontWeight: "700", color: COLORS.textPrimary },
  avatarCard: { alignItems: "center", gap: SPACING.md, paddingVertical: SPACING.xxl },
  name: { fontSize: FONT_SIZE.xl, fontWeight: "700", color: COLORS.textPrimary },
  infoCard: { gap: SPACING.lg },
  sectionLabel: {
    fontSize: FONT_SIZE.xs,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    color: COLORS.textMuted,
  },
  infoRow: { flexDirection: "row", alignItems: "center", gap: SPACING.md },
  infoIcon: {
    height: 36,
    width: 36,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.primaryLight,
  },
  infoText: { flex: 1 },
  infoLabel: { fontSize: FONT_SIZE.xs, color: COLORS.textSecondary },
  infoValue: { fontSize: FONT_SIZE.md, fontWeight: "500", color: COLORS.textPrimary },
  capitalize: { textTransform: "capitalize" },
});
