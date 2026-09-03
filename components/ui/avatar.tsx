import { Image } from "expo-image";
import { Text, View } from "react-native";

import { useTheme } from "@/constants/theme";

type AvatarProps = {
  uri?: string | null;
  name: string;
  size?: number;
};

export function Avatar({ uri, name, size = 40 }: AvatarProps) {
  const COLORS = useTheme();
  const dimension = { width: size, height: size, borderRadius: size / 2 };

  if (uri) {
    return <Image source={{ uri }} style={dimension} contentFit="cover" transition={150} />;
  }

  return (
    <View
      style={[
        dimension,
        { alignItems: "center", justifyContent: "center", backgroundColor: COLORS.primary },
      ]}
    >
      <Text style={{ fontSize: size * 0.4, fontWeight: "700", color: COLORS.white }}>
        {name.charAt(0).toUpperCase()}
      </Text>
    </View>
  );
}
