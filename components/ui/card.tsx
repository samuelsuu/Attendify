import { View, type ViewProps } from "react-native";

export function Card({ className = "", ...props }: ViewProps & { className?: string }) {
  return (
    <View
      className={`rounded-2xl bg-white p-4 shadow-sm shadow-slate-300 dark:bg-slate-800 dark:shadow-none ${className}`}
      {...props}
    />
  );
}
