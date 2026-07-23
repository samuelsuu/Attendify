import type { Session } from "@supabase/supabase-js";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type PropsWithChildren,
} from "react";

import { signInWithPassword, signOut as signOutRequest } from "@/services/auth";
import { getProfile } from "@/services/profiles";
import { supabase } from "@/lib/supabase";
import type { Profile } from "@/types/database";

type AuthContextValue = {
  session: Session | null;
  profile: Profile | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: PropsWithChildren) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function resolveProfile(nextSession: Session | null): Promise<Profile | null> {
      if (!nextSession) return null;
      try {
        return await getProfile(nextSession.user.id);
      } catch {
        return null;
      }
    }

    // Applies session + profile together in one update so consumers (e.g. the
    // Stack.Protected guards) never see a session set with a stale/missing
    // profile — that mismatch briefly matches no guard and renders nothing.
    async function applySession(nextSession: Session | null) {
      const nextProfile = await resolveProfile(nextSession);
      if (!isMounted) return;
      setSession(nextSession);
      setProfile(nextProfile);
      setIsLoading(false);
    }

    supabase.auth.getSession().then(({ data }) => applySession(data.session));

    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      applySession(nextSession);
    });

    return () => {
      isMounted = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  const value: AuthContextValue = {
    session,
    profile,
    isLoading,
    signIn: async (email, password) => {
      await signInWithPassword(email, password);
    },
    signOut: async () => {
      await signOutRequest();
    },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
