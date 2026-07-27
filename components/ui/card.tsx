import { View, type ViewProps } from "react-native";

export function Card({ className = "", ...props }: ViewProps & { className?: string }) {
  return (
    <View
      className={`rounded-2xl bg-[#FFF] p-4 shadow-sm shadow-[#B8BCC2]/50 dark:bg-slate-800 dark:shadow-none ${className}`}
      {...props}
    />
  );
}
