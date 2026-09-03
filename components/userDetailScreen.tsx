import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { AvatarPicker } from "@/components/avatar-picker";
import { RoleBadge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { FONT_SIZE, RADIUS, SPACING, useTheme } from "@/constants/theme";
import { useUpdateAvatar } from "@/hooks/use-admin";
import { useProfileById } from "@/hooks/use-profile";

export default function UserDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: profile, isLoading } = useProfileById(id);
  const updateAvatar = useUpdateAvatar();
  const COLORS = useTheme();
  const styles = getStyles(COLORS);

  function handlePickAvatar(localUri: string) {
    if (!profile) return;
    updateAvatar.mutate({ userId: profile.id, localUri });
  }

  return (
    <SafeAreaView style={styles.screen} edges={["top"]}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <Ionicons name="arrow-back" size={24} color={COLORS.primary} />
        </Pressable>
        <Text style={styles.title}>Account Details</Text>
      </View>

      {isLoading ? (
        <LoadingSpinner />
      ) : !profile ? (
        <EmptyState icon="person-outline" title="User not found" />
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Card style={styles.avatarCard}>
            <AvatarPicker
              uri={profile.avatar_url}
              name={profile.full_name}
              size={96}
              loading={updateAvatar.isPending}
              onPick={handlePickAvatar}
            />
            <Text style={styles.changePhotoHint}>Tap photo to change</Text>
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
          </Card>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

function getStyles(COLORS: ReturnType<typeof useTheme>) {
  return StyleSheet.create({
    screen: { flex: 1, backgroundColor: COLORS.mutedLight },
    header: {
      flexDirection: "row",
      alignItems: "center",
      gap: SPACING.md,
      paddingHorizontal: SPACING.xl,
      paddingTop: SPACING.lg,
      paddingBottom: SPACING.sm,
    },
    title: { fontSize: FONT_SIZE.xxxl, fontWeight: "700", color: COLORS.textPrimary },
    scrollContent: { padding: SPACING.xl, gap: SPACING.xl },
    avatarCard: { alignItems: "center", gap: SPACING.md, paddingVertical: SPACING.xxl },
    changePhotoHint: { fontSize: FONT_SIZE.xs, fontWeight: "500", color: COLORS.primary },
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
  });
}
