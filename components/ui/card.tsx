import { StyleProp, StyleSheet, View, ViewProps, ViewStyle } from "react-native";

import { COLORS, RADIUS, SPACING } from "@/constants/theme";

type CardProps = ViewProps & { style?: StyleProp<ViewStyle> };

export function Card({ style, ...props }: CardProps) {
  return <View style={[styles.card, style]} {...props} />;
}

const styles = StyleSheet.create({
  card: {
    borderRadius: RADIUS.xl,
    backgroundColor: COLORS.surface,
    padding: SPACING.lg,
    shadowColor: COLORS.shadow,
    shadowOpacity: 0.5,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },
});
