import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { api, setToken } from '../api/client';
import type { AuthUser } from '../types/auth';
import { AuthContext } from './authContext';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  async function refreshUser(): Promise<void> {
    try {
      const { data } = await api.get<{ user: AuthUser }>('/api/auth/me');
      setUser(data.user);
    } catch {
      setToken(null);
      setUser(null);
    }
  }

  // Körs en gång när appen laddas: finns en giltig token i localStorage?
  useEffect(() => {
    let cancelled = false;

    async function loadUser(): Promise<void> {
      try {
        const { data } = await api.get<{ user: AuthUser }>('/api/auth/me');
        if (!cancelled) setUser(data.user);
      } catch {
        setToken(null);
        if (!cancelled) setUser(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void loadUser();

    return () => {
      cancelled = true;
    };
  }, []);

  async function login(email: string, password: string): Promise<void> {
    const { data } = await api.post<{ token: string; user: AuthUser }>(
      '/api/auth/login',
      { email, password }
    );
    setToken(data.token);
    setUser(data.user);
  }

  async function register(email: string, password: string, displayName: string): Promise<void> {
    const { data } = await api.post<{ token: string; user: AuthUser }>(
      '/api/auth/register',
      { email, password, displayName }
    );
    setToken(data.token);
    setUser(data.user);
  }

  function logout(): void {
    setToken(null);
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}