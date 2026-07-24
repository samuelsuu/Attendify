import { useQuery } from "@tanstack/react-query";

import { getProfileById, listByRole } from "@/services/profiles";

export function useStudents() {
  return useQuery({
    queryKey: ["profiles", "student"],
    queryFn: () => listByRole("student"),
  });
}

export function useLecturers() {
  return useQuery({
    queryKey: ["profiles", "lecturer"],
    queryFn: () => listByRole("lecturer"),
  });
}

export function useProfileById(id: string | undefined) {
  return useQuery({
    queryKey: ["profiles", "by-id", id],
    queryFn: () => getProfileById(id as string),
    enabled: !!id,
  });
}
