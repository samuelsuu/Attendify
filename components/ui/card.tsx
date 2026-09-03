import { StyleProp, StyleSheet, View, ViewProps, ViewStyle } from "react-native";

import { RADIUS, SPACING, useTheme } from "@/constants/theme";

type CardProps = ViewProps & { style?: StyleProp<ViewStyle> };

export function Card({ style, ...props }: CardProps) {
  const COLORS = useTheme();
  const styles = getStyles(COLORS);

  return <View style={[styles.card, style]} {...props} />;
}

function getStyles(COLORS: ReturnType<typeof useTheme>) {
  return StyleSheet.create({
    card: {
      borderRadius: RADIUS.xl,
      backgroundColor: COLORS.surface,
      padding: SPACING.lg,
      shadowColor: COLORS.shadow,
      // ios
      shadowOpacity: 0.5,
      shadowRadius: 4,
      shadowOffset: { width: 0, height: 1 },
      // android
      elevation: 2,
    },
  });
}
