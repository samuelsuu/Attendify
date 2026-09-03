import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { FlatList, Pressable, RefreshControl, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { EmptyState } from "@/components/ui/empty-state";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { UserListItem } from "@/components/user-list-item";
import { FONT_SIZE, SPACING, useTheme } from "@/constants/theme";
import { useStudents } from "@/hooks/use-profile";
import { getErrorMessage } from "@/lib/error-message";
import type { Profile } from "@/types/database";

export default function StudentsScreen() {
  const router = useRouter();
  const { data, error, isLoading, isRefetching, refetch } = useStudents();
  const COLORS = useTheme();
  const styles = getStyles(COLORS);

  return (
    <SafeAreaView style={styles.screen} edges={["top"]}>
      <View style={styles.header}>
        <Text style={styles.title}>Students</Text>
        <Pressable
          onPress={() => router.push({ pathname: "/(admin)/create-user", params: { role: "student" } })}
          hitSlop={12}
        >
          <Ionicons name="add-circle" size={30} color={COLORS.primary} />
        </Pressable>
      </View>

      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <FlatList<Profile>
          data={data ?? []}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor={COLORS.primary} />
          }
          ListEmptyComponent={
            error ? (
              <EmptyState
                icon="alert-circle-outline"
                title="Couldn't load students"
                message={getErrorMessage(error)}
              />
            ) : (
              <EmptyState
                icon="school-outline"
                title="No students yet"
                message="Students you create in Supabase will appear here."
              />
            )
          }
          renderItem={({ item }) => (
            <UserListItem
              profile={item}
              onPress={() =>
                router.push({ pathname: "/(admin)/Students/id", params: { id: item.id } })
              }
            />
          )}
        />
      )}
    </SafeAreaView>
  );
}

function getStyles(COLORS: ReturnType<typeof useTheme>) {
  return StyleSheet.create({
    screen: { flex: 1, backgroundColor: COLORS.mutedLight },
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: SPACING.xl,
      paddingTop: SPACING.lg,
      paddingBottom: SPACING.sm,
    },
    title: { fontSize: FONT_SIZE.xxxl, fontWeight: "700", color: COLORS.textPrimary },
    listContent: { padding: SPACING.xl, paddingTop: SPACING.sm, flexGrow: 1 },
  });
}
