import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { ActivityIndicator, Alert, Pressable, StyleSheet, View } from "react-native";

import { Avatar } from "@/components/ui/avatar";
import { useTheme } from "@/constants/theme";

type AvatarPickerProps = {
  uri?: string | null;
  name: string;
  size?: number;
  loading?: boolean;
  onPick: (localUri: string) => void;
};

export function AvatarPicker({ uri, name, size = 96, loading, onPick }: AvatarPickerProps) {
  const COLORS = useTheme();
  const styles = getStyles(COLORS);

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
    <Pressable onPress={handlePress} disabled={loading} style={styles.wrap}>
      <Avatar uri={uri} name={name} size={size} />
      <View style={[styles.overlay, { opacity: loading ? 1 : 0 }]}>
        <ActivityIndicator color={COLORS.white} />
      </View>
      <View style={styles.badge} pointerEvents="none">
        <Ionicons name="camera" size={16} color={COLORS.white} />
      </View>
    </Pressable>
  );
}

function getStyles(COLORS: ReturnType<typeof useTheme>) {
  return StyleSheet.create({
    wrap: { alignSelf: "center" },
    overlay: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 999,
      backgroundColor: "rgba(11, 61, 99, 0.5)",
    },
    badge: {
      position: "absolute",
      bottom: 0,
      right: 0,
      height: 32,
      width: 32,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 16,
      backgroundColor: COLORS.primary,
      borderWidth: 2,
      borderColor: COLORS.white,
    },
  });
}
