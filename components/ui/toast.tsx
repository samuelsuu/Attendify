import { Ionicons } from "@expo/vector-icons";
import { Text } from "react-native";
import Animated, { FadeInDown, FadeOutUp } from "react-native-reanimated";

type ToastVariant = "success" | "error" | "info";

const VARIANT_STYLES: Record<
  ToastVariant,
  { bg: string; icon: keyof typeof Ionicons.glyphMap }
> = {
  success: { bg: "bg-emerald-600", icon: "checkmark-circle" },
  error: { bg: "bg-red-600", icon: "close-circle" },
  info: { bg: "bg-slate-800", icon: "information-circle" },
};

export function Toast({
  message,
  variant = "success",
}: {
  message: string;
  variant?: ToastVariant;
}) {
  const { bg, icon } = VARIANT_STYLES[variant];

  return (
    <Animated.View
      entering={FadeInDown.duration(250)}
      exiting={FadeOutUp.duration(200)}
      className={`flex-row items-center gap-2 rounded-2xl px-4 py-3 shadow-lg ${bg}`}
    >
      <Ionicons name={icon} size={20} color="#ffffff" />
      <Text className="flex-1 text-sm font-semibold text-white">{message}</Text>
    </Animated.View>
  );
}
