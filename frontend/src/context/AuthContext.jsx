import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { setUserId } from '@/services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }
    supabase.auth.getSession().then(({ data: { session: s } }) => {
      setSession(s);
      setUser(s?.user ?? null);
      if (s?.user) setUserId(s.user.id);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
      setUser(s?.user ?? null);
      if (s?.user) setUserId(s.user.id);
      else setUserId(null);
    });

    return () => subscription?.unsubscribe();
  }, []);

  const signUp = async (email, password, metadata = {}) => {
    if (!supabase) throw new Error('Auth not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to a .env file in the frontend folder.');
    const { data, error } = await supabase.auth.signUp({ email, password, options: { data: metadata } });
    if (error) throw new Error(error.message || error.error_description || 'Sign up failed');
    return data;
  };

  const signIn = async (email, password) => {
    if (!supabase) throw new Error('Auth not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to a .env file in the frontend folder.');
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw new Error(error.message || error.error_description || 'Login failed');
    return data;
  };

  const signOut = async () => {
    if (supabase) await supabase.auth.signOut();
  };

  const value = { user, session, loading, signUp, signIn, signOut };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
