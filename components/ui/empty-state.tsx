import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";

type EmptyStateProps = {
  icon?: keyof typeof Ionicons.glyphMap;
  title: string;
  message?: string;
};

export function EmptyState({ icon = "file-tray-outline", title, message }: EmptyStateProps) {
  return (
    <View className="flex-1 items-center justify-center gap-2 px-8 py-16">
      <Ionicons name={icon} size={40} color="#94a3b8" />
      <Text className="text-base font-semibold text-slate-700 dark:text-slate-200">
        {title}
      </Text>
      {message ? (
        <Text className="text-center text-sm text-slate-500 dark:text-slate-400">
          {message}
        </Text>
      ) : null}
    </View>
  );
}
