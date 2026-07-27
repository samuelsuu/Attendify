import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";
import QRCode from "react-native-qrcode-svg";

import { Card } from "@/components/ui/card";

export function QrCodeCard({ value }: { value: string }) {
  return (
    <Card className="items-center gap-4 py-8">
      <View className="flex-row items-center gap-2">
        <Ionicons name="qr-code-outline" size={20} color="#1C7FC4" />
        <Text className="text-base font-bold text-slate-900 dark:text-white">
          Your Digital Pass
        </Text>
      </View>
      <View className="rounded-3xl bg-[#FFF] p-5 shadow-lg border border-[#B8BCC2]/40">
        <QRCode value={value} size={200} color="#0B3D63" backgroundColor="#FFF" />
      </View>
      <View className="flex-row items-center gap-1.5 px-4">
        <Ionicons name="information-circle-outline" size={16} color="#64748b" />
        <Text className="text-center text-xs font-medium text-slate-500 dark:text-slate-400">
          Show this code to an admin
        </Text>
      </View>
    </Card>
  );
}
