"use client";

import { useCallback, useEffect, useState } from "react";
import { API_BASE_URL, SESSION_STORAGE_KEY } from "../lib/api";
import type { AuthSession, User } from "../types/auth";

export function useAuthSession() {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [isCheckingSession, setIsCheckingSession] = useState(true);

  const clearSession = useCallback(() => {
    localStorage.removeItem(SESSION_STORAGE_KEY);
    setSession(null);
  }, []);

  const saveSession = useCallback((nextSession: AuthSession) => {
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(nextSession));
    setSession(nextSession);
  }, []);

  useEffect(() => {
    const validateStoredSession = async () => {
      const storedSession = localStorage.getItem(SESSION_STORAGE_KEY);
      if (!storedSession) {
        setIsCheckingSession(false);
        return;
      }

      try {
        const parsedSession = JSON.parse(storedSession) as AuthSession;
        const hasExpired = parsedSession.expires_at * 1000 <= Date.now();
        if (!parsedSession.access_token || hasExpired) {
          clearSession();
          return;
        }

        const response = await fetch(`${API_BASE_URL}/auth/me`, {
          headers: { Authorization: `Bearer ${parsedSession.access_token}` },
        });
        if (!response.ok) {
          clearSession();
          return;
        }

        const user = (await response.json()) as User;
        saveSession({ ...parsedSession, user });
      } catch (error) {
        console.error(error);
        clearSession();
      } finally {
        setIsCheckingSession(false);
      }
    };

    validateStoredSession();
  }, [clearSession, saveSession]);

  return { session, saveSession, clearSession, isCheckingSession };
}
