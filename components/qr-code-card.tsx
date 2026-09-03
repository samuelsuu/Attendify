import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";
import QRCode from "react-native-qrcode-svg";

import { Card } from "@/components/ui/card";
import { FONT_SIZE, RADIUS, SPACING, useTheme } from "@/constants/theme";

export function QrCodeCard({ value }: { value: string }) {
  const COLORS = useTheme();
  const styles = getStyles(COLORS);

  return (
    <Card style={styles.card}>
      <View style={styles.header}>
        <Ionicons name="qr-code-outline" size={20} color={COLORS.primary} />
        <Text style={styles.title}>Your Digital Pass</Text>
      </View>
      <View style={styles.qrWrap}>
        <QRCode value={value} size={200} color={COLORS.primaryDark} backgroundColor={COLORS.white} />
      </View>
      <View style={styles.footer}>
        <Ionicons name="information-circle-outline" size={16} color={COLORS.textMuted} />
        <Text style={styles.footerText}>Show this code to an admin</Text>
      </View>
    </Card>
  );
}

function getStyles(COLORS: ReturnType<typeof useTheme>) {
  return StyleSheet.create({
    card: { alignItems: "center", gap: SPACING.lg, paddingVertical: SPACING.xxl },
    header: { flexDirection: "row", alignItems: "center", gap: SPACING.sm },
    title: { fontSize: FONT_SIZE.lg, fontWeight: "700", color: COLORS.textPrimary },
    qrWrap: {
      borderRadius: RADIUS.xxl,
      backgroundColor: COLORS.white,
      padding: SPACING.xl,
      borderWidth: 1,
      borderColor: COLORS.border,
      shadowColor: COLORS.shadow,
      shadowOpacity: 0.4,
      shadowRadius: 10,
      shadowOffset: { width: 0, height: 4 },
      elevation: 3,
    },
    footer: { flexDirection: "row", alignItems: "center", gap: 6, paddingHorizontal: SPACING.md },
    footerText: { textAlign: "center", fontSize: FONT_SIZE.sm, fontWeight: "500", color: COLORS.textSecondary },
  });
}
