import { Text, View } from "react-native";

import type { Role } from "@/types/database";

const ROLE_CLASSES: Record<Role, string> = {
  admin: "bg-purple-100 dark:bg-purple-900/40",
  student: "bg-blue-100 dark:bg-blue-900/40",
  lecturer: "bg-emerald-100 dark:bg-emerald-900/40",
};

const ROLE_TEXT_CLASSES: Record<Role, string> = {
  admin: "text-purple-700 dark:text-purple-300",
  student: "text-blue-700 dark:text-blue-300",
  lecturer: "text-emerald-700 dark:text-emerald-300",
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
