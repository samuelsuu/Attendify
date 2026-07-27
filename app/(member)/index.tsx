import { Ionicons } from "@expo/vector-icons";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

import { QrCodeCard } from "@/components/qr-code-card";
import { Avatar } from "@/components/ui/avatar";
import { RoleBadge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { COLORS, FONT_SIZE, RADIUS, SPACING } from "@/constants/theme";
import { useAuth } from "@/hooks/use-auth";

export default function MemberHomeScreen() {
  const { profile } = useAuth();

  if (!profile) {
    return <LoadingSpinner />;
  }

  return (
    <SafeAreaView style={styles.screen} edges={["top"]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Animated.View entering={FadeInDown.duration(400)} style={styles.header}>
          <Avatar uri={profile.avatar_url} name={profile.full_name} size={52} />
          <View style={styles.headerText}>
            <View style={styles.welcomeRow}>
              <Ionicons name="sparkles-outline" size={16} color={COLORS.primary} />
              <Text style={styles.welcomeLabel}>Welcome back,</Text>
            </View>
            <View style={styles.nameRow}>
              <Text style={styles.name}>{profile.full_name}</Text>
              <RoleBadge role={profile.role} />
            </View>
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(50).duration(400)}>
          <Card style={styles.infoCard}>
            <View style={styles.infoIcon}>
              <Ionicons name="scan-outline" size={22} color={COLORS.white} />
            </View>
            <View style={styles.infoText}>
              <Text style={styles.infoTitle}>Attendance Ready</Text>
              <Text style={styles.infoBody}>Show your personal QR pass to record presence</Text>
            </View>
          </Card>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(100).duration(400)}>
          <QrCodeCard value={profile.id} />
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.background },
  scrollContent: { padding: SPACING.xl, gap: SPACING.xl },
  header: { flexDirection: "row", alignItems: "center", gap: SPACING.md },
  headerText: { flex: 1, gap: SPACING.sm },
  welcomeRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  welcomeLabel: { fontSize: FONT_SIZE.md, fontWeight: "500", color: COLORS.textSecondary },
  nameRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  name: { fontSize: FONT_SIZE.xxxl, fontWeight: "700", color: COLORS.textPrimary },
  infoCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    backgroundColor: COLORS.primaryLight,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  infoIcon: {
    height: 40,
    width: 40,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.primary,
  },
  infoText: { flex: 1 },
  infoTitle: { fontSize: FONT_SIZE.md, fontWeight: "700", color: COLORS.primaryDark },
  infoBody: { fontSize: FONT_SIZE.xs, color: COLORS.primaryDark },
});
