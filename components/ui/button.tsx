import { Ionicons } from "@expo/vector-icons";
import {
  ActivityIndicator,
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import { COLORS, FONT_SIZE, RADIUS, SPACING } from "@/constants/theme";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type ButtonVariant = "primary" | "secondary" | "danger" | "outline";

type ButtonProps = {
  label: string;
  onPress?: () => void;
  variant?: ButtonVariant;
  loading?: boolean;
  disabled?: boolean;
  icon?: keyof typeof Ionicons.glyphMap;
  iconPosition?: "left" | "right";
  iconSize?: number;
  iconColor?: string;
  style?: StyleProp<ViewStyle>;
};

const VARIANT_ICON_COLORS: Record<ButtonVariant, string> = {
  primary: COLORS.white,
  secondary: COLORS.primaryDark,
  danger: COLORS.white,
  outline: COLORS.primary,
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
  style,
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
      style={[
        animatedStyle,
        styles.base,
        styles[variant],
        isDisabled && styles.disabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={resolvedIconColor} />
      ) : (
        <View style={styles.content}>
          {icon && iconPosition === "left" ? (
            <Ionicons name={icon} size={iconSize} color={resolvedIconColor} />
          ) : null}
          <Text style={[styles.label, labelStyles[variant]]}>{label}</Text>
          {icon && iconPosition === "right" ? (
            <Ionicons name={icon} size={iconSize} color={resolvedIconColor} />
          ) : null}
        </View>
      )}
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.xl,
    paddingVertical: 14,
  },
  primary: { backgroundColor: COLORS.primary },
  secondary: { backgroundColor: COLORS.mutedLight },
  danger: { backgroundColor: COLORS.danger },
  outline: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  disabled: { opacity: 0.5 },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: SPACING.sm,
  },
  label: { fontSize: FONT_SIZE.lg, fontWeight: "600" },
});

const labelStyles = StyleSheet.create({
  primary: { color: COLORS.white },
  secondary: { color: COLORS.primaryDark },
  danger: { color: COLORS.white },
  outline: { color: COLORS.textSecondary },
});
