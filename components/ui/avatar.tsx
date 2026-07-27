import { Image } from "expo-image";
import { Text, View } from "react-native";

type AvatarProps = {
  uri?: string | null;
  name: string;
  size?: number;
};

export function Avatar({ uri, name, size = 40 }: AvatarProps) {
  const dimension = { width: size, height: size, borderRadius: size / 2 };

  if (uri) {
    return (
      <Image
        source={{ uri }}
        style={dimension}
        contentFit="cover"
        transition={150}
      />
    );
  }

  return (
    <View style={dimension} className="items-center justify-center bg-[#1C7FC4]">
      <Text style={{ fontSize: size * 0.4 }} className="font-bold text-[#FFF]">
        {name.charAt(0).toUpperCase()}
      </Text>
    </View>
  );
}
