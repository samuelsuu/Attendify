import { FunctionsHttpError } from "@supabase/supabase-js";

import { supabase } from "@/lib/supabase";
import type { Role } from "@/types/database";

export type CreateAccountInput = {
  email: string;
  password: string;
  fullName: string;
  role: Extract<Role, "student" | "lecturer">;
};

export type CreatedAccount = {
  id: string;
  email: string;
  fullName: string;
  role: Role;
};

export async function createAccount(input: CreateAccountInput): Promise<CreatedAccount> {
  const { data, error } = await supabase.functions.invoke("create-user", {
    body: input,
  });

  if (error) {
    if (error instanceof FunctionsHttpError) {
      const response = error.context as Response;
      const raw = await response.text().catch(() => "");
      let message: string | undefined;
      try {
        const parsed = JSON.parse(raw);
        message = parsed?.error ?? parsed?.message;
      } catch {
        message = raw || undefined;
      }
      throw new Error(message ? `(${response.status}) ${message}` : error.message);
    }
    throw error;
  }

  return data.user as CreatedAccount;
}
