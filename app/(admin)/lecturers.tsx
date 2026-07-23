import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { FlatList, Pressable, RefreshControl, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { EmptyState } from "@/components/ui/empty-state";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { UserListItem } from "@/components/user-list-item";
import { useLecturers } from "@/hooks/use-profile";
import type { Profile } from "@/types/database";

export default function LecturersScreen() {
  const router = useRouter();
  const { data, isLoading, isRefetching, refetch } = useLecturers();

  return (
    <SafeAreaView className="flex-1 bg-slate-50 dark:bg-slate-950" edges={["top"]}>
      <View className="flex-row items-center justify-between px-5 pb-2 pt-4">
        <Text className="text-2xl font-bold text-slate-900 dark:text-white">Lecturers</Text>
        <Pressable
          onPress={() => router.push({ pathname: "/(admin)/create-user", params: { role: "lecturer" } })}
          hitSlop={12}
        >
          <Ionicons name="add-circle" size={30} color="#2563eb" />
        </Pressable>
      </View>

      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <FlatList<Profile>
          data={data ?? []}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 20, paddingTop: 8, flexGrow: 1 }}
          refreshControl={
            <RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor="#2563eb" />
          }
          ListEmptyComponent={
            <EmptyState
              icon="briefcase-outline"
              title="No lecturers yet"
              message="Lecturers you create in Supabase will appear here."
            />
          }
          renderItem={({ item }) => <UserListItem profile={item} />}
        />
      )}
    </SafeAreaView>
  );
}
