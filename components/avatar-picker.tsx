import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { ActivityIndicator, Alert, Pressable, View } from "react-native";

import { Avatar } from "@/components/ui/avatar";

type AvatarPickerProps = {
  uri?: string | null;
  name: string;
  size?: number;
  loading?: boolean;
  onPick: (localUri: string) => void;
};

export function AvatarPicker({ uri, name, size = 96, loading, onPick }: AvatarPickerProps) {
  async function handlePress() {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert(
        "Photo access needed",
        "Allow photo library access to set a profile picture."
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled && result.assets[0]) {
      onPick(result.assets[0].uri);
    }
  }

  return (
    <Pressable onPress={handlePress} disabled={loading} className="self-center">
      <Avatar uri={uri} name={name} size={size} />
      <View
        className="absolute inset-0 items-center justify-center rounded-full bg-black/40"
        style={{ opacity: loading ? 1 : 0 }}
      >
        <ActivityIndicator color="#ffffff" />
      </View>
      <View
        className="absolute bottom-0 right-0 h-8 w-8 items-center justify-center rounded-full bg-[#1C7FC4] border-2 border-[#FFF] dark:border-slate-900"
        pointerEvents="none"
      >
        <Ionicons name="camera" size={16} color="#ffffff" />
      </View>
    </Pressable>
  );
}
