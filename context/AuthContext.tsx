import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../db/supabase';

interface User {
  id: string;
  full_name: string;
  email: string;
  role: 'user' | 'admin';
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (name: string, email: string, password: string, phone?: string) => Promise<{ success: boolean; error?: string }>;
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        loadProfile(session.user.id, session.user.email ?? '');
      } else {
        setIsLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        loadProfile(session.user.id, session.user.email ?? '');
      } else {
        setUser(null);
        setIsLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  async function loadProfile(userId: string, email: string) {
    const { data } = await supabase
      .from('profiles')
      .select('full_name, role')
      .eq('id', userId)
      .single();
    setUser({
      id: userId,
      email,
      full_name: data?.full_name ?? '',
      role: (data?.role ?? 'user') as 'user' | 'admin',
    });
    setIsLoading(false);
  }

  async function login(email: string, password: string) {
    const { error } = await supabase.auth.signInWithPassword({
      email: email.toLowerCase().trim(),
      password,
    });
    if (error) return { success: false, error: 'Email o contraseña incorrectos' };
    return { success: true };
  }

  async function register(name: string, email: string, password: string, phone?: string) {
    const { error } = await supabase.auth.signUp({
      email: email.toLowerCase().trim(),
      password,
      options: { data: { full_name: name.trim(), phone: phone?.trim() ?? '' } },
    });
    if (error) return { success: false, error: error.message };
    return { success: true };
  }

  async function resetPassword(email: string) {
    const { error } = await supabase.auth.resetPasswordForEmail(
      email.toLowerCase().trim(),
      { redirectTo: 'agendaapp://auth/reset-password' },
    );
    if (error) return { success: false, error: 'No se pudo enviar el email de recuperación.' };
    return { success: true };
  }

  async function logout() {
    await supabase.auth.signOut();
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, resetPassword, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
