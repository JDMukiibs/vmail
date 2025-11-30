"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useMemo,
  useCallback,
} from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  getFriendSession,
  clearFriendSession,
  setFriendSession,
} from "../auth/auth-utils";

// --- Types ---
interface FriendSession {
  id: string;
  name: string;
}

interface AuthContextType {
  session: FriendSession | null;
  isLoading: boolean;
  logout: () => void;
  // Added for potential use in the login page later, though setFriendSession is used directly for now
  login: (id: string, name: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<FriendSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const friendSession = getFriendSession();
    if (friendSession) {
      setSession(friendSession as FriendSession);
    }
    setIsLoading(false);
  }, []);

  const logout = useCallback(() => {
    clearFriendSession();
    setSession(null);
    router.replace("/");
  }, [router]);

  const login = (id: string, name: string) => {
    setFriendSession(id, name);
    setSession({ id, name });
  };

  useEffect(() => {
    if (isLoading) return;

    const isProtectedRoute = pathname.startsWith("/dashboard");

    if (isProtectedRoute && !session) {
      router.replace("/");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, session, pathname]);

  const contextValue = useMemo(
    () => ({
      session,
      isLoading,
      logout,
      login,
    }),
    [session, isLoading, logout]
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
