import { Ionicons } from "@expo/vector-icons";
import {
  CameraView,
  type BarcodeScanningResult,
  useCameraPermissions,
} from "expo-camera";
import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Alert, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Button } from "@/components/ui/button";
import { Toast } from "@/components/ui/toast";
import { useAuth } from "@/hooks/use-auth";
import { useRecordAttendance } from "@/hooks/use-attendance";
import { getProfileById } from "@/services/profiles";
import type { Role } from "@/types/database";

const TOAST_DURATION_MS = 2000;

type AttendanceScannerProps = {
  /** If set, only these roles can be scanned — checked client-side before
   * hitting the DB (the RLS policy is the real enforcement either way). */
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
      });

      if (result.status === "already_recorded") {
        Alert.alert(
          "Already recorded",
          `Attendance already recorded for ${scannedProfile.full_name} today.`
        );
      } else {
        showSuccessToast(`${scannedProfile.full_name} (${scannedProfile.role}) marked present`);
      }
    } catch (err) {
      Alert.alert(
        "Something went wrong",
        err instanceof Error ? err.message : "Please try again."
      );
    } finally {
      setProcessing(false);
    }
  }

  if (!permission) {
    return <View className="flex-1 bg-slate-950" />;
  }

  if (!permission.granted) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center gap-4 bg-slate-50 px-8 dark:bg-slate-950">
        <View className="h-20 w-20 items-center justify-center rounded-3xl bg-blue-50 dark:bg-blue-900/30">
          <Ionicons name="camera-outline" size={42} color="#2563eb" />
        </View>
        <Text className="text-center text-xl font-bold text-slate-900 dark:text-white">
          Camera Access Needed
        </Text>
        <Text className="text-center text-sm text-slate-500 dark:text-slate-400 max-w-xs">
          Allow camera permissions to scan QR codes for attendance tracking.
        </Text>
        <Button label="Grant camera permission" icon="camera-outline" onPress={requestPermission} />
      </SafeAreaView>
    );
  }

  return (
    <View className="flex-1 bg-black">
      <CameraView
        style={{ flex: 1 }}
        facing="back"
        barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
        onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
      />

      <SafeAreaView className="absolute inset-0" pointerEvents="box-none">
        <View className="gap-3 px-5 pt-4">
          <View className="flex-row items-center justify-center gap-2 rounded-full bg-black/50 py-2 px-4 self-center">
            <Ionicons name="scan-outline" size={18} color="#ffffff" />
            <Text className="text-center text-sm font-semibold text-white">
              Scan Attendance QR Code
            </Text>
          </View>
          {toastMessage ? <Toast message={toastMessage} /> : null}
        </View>

        <View className="flex-1 items-center justify-center">
          <View className="h-64 w-64 rounded-3xl border-4 border-blue-500/80 items-center justify-center bg-blue-500/5">
            <Ionicons name="qr-code-outline" size={48} color="rgba(255,255,255,0.4)" />
          </View>
        </View>

        <View className="items-center pb-10">
          {processing ? (
            <View className="flex-row items-center gap-2 rounded-full bg-black/70 px-5 py-3 border border-white/10">
              <ActivityIndicator color="#ffffff" />
              <Text className="text-sm font-medium text-white">Verifying code...</Text>
            </View>
          ) : toastMessage ? null : scanned ? (
            <Pressable
              onPress={() => setScanned(false)}
              className="flex-row items-center gap-2 rounded-full bg-blue-600 px-6 py-3.5 active:bg-blue-700 shadow-lg shadow-blue-600/50"
            >
              <Ionicons name="refresh-outline" size={18} color="#ffffff" />
              <Text className="text-sm font-bold text-white">Scan Next Code</Text>
            </Pressable>
          ) : (
            <View className="flex-row items-center gap-2 rounded-full bg-black/60 px-4 py-2 border border-white/10">
              <Ionicons name="sparkles-outline" size={16} color="#60a5fa" />
              <Text className="text-xs font-medium text-white/90">
                Align QR code within frame
              </Text>
            </View>
          )}
        </View>
      </SafeAreaView>
    </View>
  );
}
