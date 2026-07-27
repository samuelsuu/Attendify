import { Text, View } from "react-native";

import type { Role } from "@/types/database";

const ROLE_CLASSES: Record<Role, string> = {
  admin: "bg-[#0B3D63]/10 dark:bg-purple-900/40",
  student: "bg-[#1C7FC4]/10 dark:bg-blue-900/40",
  lecturer: "bg-[#B8BCC2]/40 dark:bg-emerald-900/40",
};

const ROLE_TEXT_CLASSES: Record<Role, string> = {
  admin: "text-[#0B3D63] dark:text-purple-300",
  student: "text-[#1C7FC4] dark:text-blue-300",
  lecturer: "text-[#0B3D63] dark:text-emerald-300",
};

export function RoleBadge({ role }: { role: Role }) {
  return (
    <View className={`rounded-full px-3 py-1 ${ROLE_CLASSES[role]}`}>
      <Text className={`text-xs font-semibold capitalize ${ROLE_TEXT_CLASSES[role]}`}>
        {role}
      </Text>
    </View>
  );
}
