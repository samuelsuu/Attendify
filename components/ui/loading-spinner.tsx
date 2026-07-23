import { ActivityIndicator, Text, View } from "react-native";

export function LoadingSpinner({ label }: { label?: string }) {
  return (
    <View className="flex-1 items-center justify-center gap-3">
      <ActivityIndicator size="large" color="#2563eb" />
      {label ? (
        <Text className="text-sm text-slate-500 dark:text-slate-400">{label}</Text>
      ) : null}
    </View>
  );
}
