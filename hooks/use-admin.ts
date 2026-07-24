import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createAccount, type CreateAccountInput } from "@/services/admin";
import { updateAvatarUrl } from "@/services/profiles";
import { uploadAvatar } from "@/services/storage";

export function useCreateAccount() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateAccountInput) => createAccount(input),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["profiles", variables.role] });
    },
  });
}

export function useUpdateAvatar() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, localUri }: { userId: string; localUri: string }) => {
      const avatarUrl = await uploadAvatar(userId, localUri);
      await updateAvatarUrl(userId, avatarUrl);
      return avatarUrl;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profiles"] });
    },
  });
}
