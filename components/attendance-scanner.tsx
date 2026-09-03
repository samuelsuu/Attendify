import { Ionicons } from "@expo/vector-icons";
import {
  CameraView,
  useCameraPermissions,
  type BarcodeScanningResult,
} from "expo-camera";
import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Alert, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Button } from "@/components/ui/button";
import { Toast } from "@/components/ui/toast";
import { FONT_SIZE, RADIUS, SPACING, useTheme } from "@/constants/theme";
import { useRecordAttendance } from "@/hooks/use-attendance";
import { useAuth } from "@/hooks/use-auth";
import { getErrorMessage } from "@/lib/error-message";
import { getProfileById } from "@/services/profiles";
import type { Role } from "@/types/database";

const TOAST_DURATION_MS = 2000;

type AttendanceScannerProps = {
  // If set, only these roles can be scanned — checked client-side before hitting the DB (the RLS policy is the real enforcement either way)

  allowedRoles?: Role[];
};

export function AttendanceScanner({ allowedRoles }: AttendanceScannerProps) {
  const { profile } = useAuth();
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const recordAttendance = useRecordAttendance();
  const toastTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const COLORS = useTheme();
  const styles = getStyles(COLORS);

  useEffect(() => {
    return () => {
      if (toastTimeout.current) clearTimeout(toastTimeout.current);
    };
  }, []);

  function showSuccessToast(message: string) {
    setToastMessage(message);
    toastTimeout.current = setTimeout(() => {
      setToastMessage(null);
      setScanned(false);
    }, TOAST_DURATION_MS);
  }

  async function handleBarcodeScanned({ data }: BarcodeScanningResult) {
    if (scanned || processing || !profile) return;
    if (profile.role !== "admin" && profile.role !== "lecturer") return;
    setScanned(true);
    setProcessing(true);

    try {
      const scannedProfile = await getProfileById(data.trim());

      if (!scannedProfile) {
        Alert.alert("User not found", "No account matches this QR code.");
        return;
      }

      if (allowedRoles && !allowedRoles.includes(scannedProfile.role)) {
        Alert.alert(
          "Not allowed",
          `You can only record attendance for ${allowedRoles.join(" or ")}s.`
        );
        return;
      }

      const result = await recordAttendance.mutateAsync({
        userId: scannedProfile.id,
        recordedBy: profile.id,
        recordedByRole: profile.role,
      });

      if (result.status === "already_recorded") {
        Alert.alert(
          "Already recorded",
          `You've already marked ${scannedProfile.full_name} present today.`
        );
      } else {
        showSuccessToast(`${scannedProfile.full_name} (${scannedProfile.role}) marked present`);
      }
    } catch (err) {
      Alert.alert("Something went wrong", getErrorMessage(err));
    } finally {
      setProcessing(false);
    }
  }

  if (!permission) {
    return <View style={styles.blank} />;
  }

  if (!permission.granted) {
    return (
      <SafeAreaView style={styles.permissionScreen}>
        <View style={styles.permissionIconWrap}>
          <Ionicons name="camera-outline" size={42} color={COLORS.primary} />
        </View>
        <Text style={styles.permissionTitle}>Camera Access Needed</Text>
        <Text style={styles.permissionBody}>
          Allow camera permissions to scan QR codes for attendance tracking.
        </Text>
        <Button label="Grant camera permission" icon="camera-outline" onPress={requestPermission} />
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        style={StyleSheet.absoluteFillObject}
        facing="back"
        barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
        onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
      />

      <SafeAreaView style={styles.overlay} pointerEvents="box-none">
        <View style={styles.topArea}>
          <View style={styles.pill}>
            <Ionicons name="scan-outline" size={18} color={COLORS.white} />
            <Text style={styles.pillText}>Scan Attendance QR Code</Text>
          </View>
          {toastMessage ? <Toast message={toastMessage} /> : null}
        </View>

        <View style={styles.frameArea}>
          <View style={styles.frame}>
            <Ionicons name="qr-code-outline" size={48} color="rgba(255,255,255,0.4)" />
          </View>
        </View>

        <View style={styles.bottomArea}>
          {processing ? (
            <View style={styles.statusPill}>
              <ActivityIndicator color={COLORS.white} />
              <Text style={styles.statusText}>Verifying code...</Text>
            </View>
          ) : toastMessage ? null : scanned ? (
            <Pressable onPress={() => setScanned(false)} style={styles.scanAgain}>
              <Ionicons name="refresh-outline" size={18} color={COLORS.white} />
              <Text style={styles.scanAgainText}>Scan Next Code</Text>
            </Pressable>
          ) : (
            <View style={styles.hintPill}>
              <Text style={styles.hintText}>Align QR code within frame</Text>
            </View>
          )}
        </View>
      </SafeAreaView>
    </View>
  );
}

function getStyles(COLORS: ReturnType<typeof useTheme>) {
  return StyleSheet.create({
    blank: { flex: 1, backgroundColor: COLORS.primaryDark },
    permissionScreen: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      gap: SPACING.md,
      backgroundColor: COLORS.background,
      paddingHorizontal: SPACING.xxl,
    },
    permissionIconWrap: {
      height: 80,
      width: 80,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: RADIUS.xxl,
      backgroundColor: COLORS.primaryLight,
    },
    permissionTitle: {
      textAlign: "center",
      fontSize: FONT_SIZE.xxl,
      fontWeight: "700",
      color: COLORS.textPrimary,
    },
    permissionBody: {
      textAlign: "center",
      fontSize: FONT_SIZE.md,
      color: COLORS.textSecondary,
      maxWidth: 280,
    },
    container: { flex: 1, backgroundColor: COLORS.black },
    overlay: { flex: 1, justifyContent: "space-between" },
    topArea: { gap: SPACING.md, paddingHorizontal: SPACING.lg, paddingTop: SPACING.md },
    pill: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: SPACING.sm,
      borderRadius: RADIUS.full,
      paddingVertical: SPACING.sm,
      paddingHorizontal: SPACING.lg,
      backgroundColor: "rgba(0,0,0,0.5)",
      alignSelf: "center",
    },
    pillText: { textAlign: "center", fontSize: FONT_SIZE.md, fontWeight: "600", color: COLORS.white },
    frameArea: { alignItems: "center", justifyContent: "center" },
    frame: {
      height: 256,
      width: 256,
      borderRadius: RADIUS.xxl,
      borderWidth: 4,
      borderColor: "rgba(28, 127, 196, 0.8)",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "rgba(28, 127, 196, 0.1)",
    },
    bottomArea: { alignItems: "center", paddingBottom: 40 },
    statusPill: {
      flexDirection: "row",
      alignItems: "center",
      gap: SPACING.sm,
      borderRadius: RADIUS.full,
      paddingHorizontal: SPACING.lg,
      paddingVertical: SPACING.md,
      backgroundColor: "rgba(0,0,0,0.7)",
      borderWidth: 1,
      borderColor: "rgba(255,255,255,0.1)",
    },
    statusText: { fontSize: FONT_SIZE.md, fontWeight: "500", color: COLORS.white },
    scanAgain: {
      flexDirection: "row",
      alignItems: "center",
      gap: SPACING.sm,
      borderRadius: RADIUS.full,
      paddingHorizontal: SPACING.xl,
      paddingVertical: 14,
      backgroundColor: COLORS.primary,
    },
    scanAgainText: { fontSize: FONT_SIZE.md, fontWeight: "700", color: COLORS.white },
    hintPill: {
      alignItems: "center",
      gap: SPACING.sm,
      borderRadius: RADIUS.full,
      paddingHorizontal: SPACING.md,
      paddingVertical: SPACING.sm,
      backgroundColor: "rgba(0,0,0,0.6)",
      borderWidth: 1,
      borderColor: "rgba(255,255,255,0.1)",
    },
    hintText: { fontSize: FONT_SIZE.xs, fontWeight: "500", color: "rgba(255,255,255,0.9)" },
  });
}
