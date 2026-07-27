import { Ionicons } from "@expo/vector-icons";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type ButtonProps = {
  label: string;
  onPress?: () => void;
  variant?: "primary" | "secondary" | "danger" | "outline";
  loading?: boolean;
  disabled?: boolean;
  icon?: keyof typeof Ionicons.glyphMap;
  iconPosition?: "left" | "right";
  iconSize?: number;
  iconColor?: string;
  className?: string;
};

const VARIANT_CLASSES: Record<NonNullable<ButtonProps["variant"]>, string> = {
  primary: "bg-[#1C7FC4] active:bg-[#0B3D63]",
  secondary: "bg-[#B8BCC2]/30 active:bg-[#B8BCC2]/50 dark:bg-slate-700 dark:active:bg-slate-600",
  danger: "bg-red-600 active:bg-red-700",
  outline: "border border-slate-300 dark:border-slate-700 bg-transparent active:bg-slate-100 dark:active:bg-slate-800",
};

const VARIANT_TEXT_CLASSES: Record<NonNullable<ButtonProps["variant"]>, string> = {
  primary: "text-[#FFF]",
  secondary: "text-[#0B3D63] dark:text-white",
  danger: "text-white",
  outline: "text-slate-700 dark:text-slate-200",
};

const VARIANT_ICON_COLORS: Record<NonNullable<ButtonProps["variant"]>, string> = {
  primary: "#FFF",
  secondary: "#0B3D63",
  danger: "#ffffff",
  outline: "#1C7FC4",
};

export function Button({
  label,
  onPress,
  variant = "primary",
  loading = false,
  disabled = false,
  icon,
  iconPosition = "left",
  iconSize = 20,
  iconColor,
  className = "",
}: ButtonProps) {
  const scale = useSharedValue(1);
  const isDisabled = disabled || loading;

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const resolvedIconColor = iconColor ?? VARIANT_ICON_COLORS[variant];

  return (
    <AnimatedPressable
      onPress={onPress}
      disabled={isDisabled}
      onPressIn={() => (scale.value = withTiming(0.97, { duration: 100 }))}
      onPressOut={() => (scale.value = withTiming(1, { duration: 100 }))}
      style={animatedStyle}
      className={`items-center justify-center rounded-xl px-5 py-3.5 ${VARIANT_CLASSES[variant]} ${isDisabled ? "opacity-50" : ""} ${className}`}
    >
      {loading ? (
        <ActivityIndicator color={resolvedIconColor} />
      ) : (
        <View className="flex-row items-center justify-center gap-2">
          {icon && iconPosition === "left" ? (
            <Ionicons name={icon} size={iconSize} color={resolvedIconColor} />
          ) : null}
          <Text className={`text-base font-semibold ${VARIANT_TEXT_CLASSES[variant]}`}>
            {label}
          </Text>
          {icon && iconPosition === "right" ? (
            <Ionicons name={icon} size={iconSize} color={resolvedIconColor} />
          ) : null}
        </View>
      )}
    </AnimatedPressable>
  );
}
