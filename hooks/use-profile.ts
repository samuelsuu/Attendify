import { useQuery } from "@tanstack/react-query";

import { listByRole } from "@/services/profiles";

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
