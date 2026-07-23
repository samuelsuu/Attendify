import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createAccount, type CreateAccountInput } from "@/services/admin";

export function useCreateAccount() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateAccountInput) => createAccount(input),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["profiles", variables.role] });
    },
  });
}
