import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Alert, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Card } from "@/components/ui/card";
import { FONT_SIZE, RADIUS, SPACING, useTheme } from "@/constants/theme";
import { useTodayCount } from "@/hooks/use-attendance";
import { useAuth } from "@/hooks/use-auth";
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
  const COLORS = useTheme();
  const styles = getStyles(COLORS);   

  return (
    <Card style={styles.statCard}>
      <View style={styles.statIcon}>
        <Ionicons name={icon} size={18} color={COLORS.primary} />
      </View>
      <Text style={styles.statValue}>{value ?? "–"}</Text>
      <Text style={styles.statLabel}>{label}</Text>
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
  const COLORS = useTheme();
  const styles = getStyles(COLORS);   

  return (
    <TouchableOpacity onPress={onPress} style={styles.quickLink}>
      <Ionicons name={icon} size={22} color={COLORS.white} />
      <Text style={styles.quickLinkLabel}>{label}</Text>
    </TouchableOpacity>
  );
}

export default function AdminDashboardScreen() {
  const { profile, signOut } = useAuth();
  const router = useRouter();
  const todayCount = useTodayCount();
  const students = useStudents();
  const lecturers = useLecturers();
  const COLORS = useTheme();
  const styles = getStyles(COLORS);

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
    <SafeAreaView style={styles.screen} edges={["top"]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={refetchAll} tintColor={COLORS.primary} />
        }
      >
        <View style={styles.headerRow}>
          <View style={styles.headerText}>
            <Text style={styles.welcomeLabel}>Welcome,</Text>
            <Text style={styles.welcomeName}>{profile?.full_name}</Text>
          </View>
          <TouchableOpacity onPress={confirmSignOut} hitSlop={12} style={styles.signOutButton}>
            <Ionicons name="log-out-outline" size={20} color={COLORS.danger} />
          </TouchableOpacity>
        </View>

        <View style={styles.statsRow}>
          <StatCard icon="checkmark-done" label="Present today" value={todayCount.data} />
          <StatCard icon="school" label="Students" value={students.data?.length} />
          <StatCard icon="briefcase" label="Lecturers" value={lecturers.data?.length} />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick actions</Text>
          <View style={styles.quickLinksRow}>
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
      </ScrollView>
    </SafeAreaView>
  );
}

function getStyles(COLORS: ReturnType<typeof useTheme>) {
  return StyleSheet.create({
    screen: { flex: 1, backgroundColor: COLORS.mutedLight },
    scrollContent: { padding: SPACING.xl, gap: SPACING.xl },
    headerRow: { flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between" },
    headerText: { gap: 4 },
    welcomeLabel: { fontSize: FONT_SIZE.md, color: COLORS.textSecondary },
    welcomeName: { fontSize: FONT_SIZE.xxxl, fontWeight: "700", color: COLORS.textPrimary },
    signOutButton: {
      height: 40,
      width: 40,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 20,
      backgroundColor: COLORS.white,
    },
    statsRow: { flexDirection: "row", gap: SPACING.md },
    statCard: { flex: 1, gap: SPACING.sm },
    statIcon: {
      height: 36,
      width: 36,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 18,
      backgroundColor: COLORS.primaryLight,
    },
    statValue: { fontSize: FONT_SIZE.xxxl, fontWeight: "700", color: COLORS.textPrimary },
    statLabel: { fontSize: FONT_SIZE.xs, color: COLORS.textSecondary },
    section: { gap: SPACING.md },
    sectionTitle: { fontSize: FONT_SIZE.lg, fontWeight: "600", color: COLORS.textPrimary },
    quickLinksRow: { flexDirection: "row", gap: SPACING.md },
    quickLink: {
      flex: 1,
      alignItems: "center",
      gap: SPACING.sm,
      borderRadius: RADIUS.xl,
      backgroundColor: COLORS.primary,
      paddingVertical: SPACING.lg,
      justifyContent: "center",
    },
    quickLinkLabel: { fontSize: FONT_SIZE.md, fontWeight: "600", color: COLORS.white },
  });
}
