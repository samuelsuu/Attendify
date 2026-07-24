import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  getAllAttendance,
  getHistory,
  getRecordedByMe,
  getTodayCount,
  recordAttendance,
} from "@/services/attendance";
import type { Role } from "@/types/database";

export function useAttendanceHistory(userId: string | undefined) {
  return useQuery({
    queryKey: ["attendance", "history", userId],
    queryFn: () => getHistory(userId as string),
    enabled: !!userId,
  });
}

export function useAllAttendance() {
  return useQuery({
    queryKey: ["attendance", "all"],
    queryFn: getAllAttendance,
  });
}

export function useMyScans(recordedBy: string | undefined) {
  return useQuery({
    queryKey: ["attendance", "recorded-by-me", recordedBy],
    queryFn: () => getRecordedByMe(recordedBy as string),
    enabled: !!recordedBy,
  });
}

export function useTodayCount() {
  return useQuery({
    queryKey: ["attendance", "today-count"],
    queryFn: getTodayCount,
  });
}

export function useRecordAttendance() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      userId,
      recordedBy,
      recordedByRole,
    }: {
      userId: string;
      recordedBy: string;
      recordedByRole: Extract<Role, "admin" | "lecturer">;
    }) => recordAttendance(userId, recordedBy, recordedByRole),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["attendance"] });
    },
  });
}
