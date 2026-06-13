import { supabase } from './supabaseClient';
import { useStore } from './useStore';

export const useAuth = () => {
  const { setUser, clearAuth } = useStore();

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName },
        },
      });

      if (error) {
        // Check if email already exists
        if (error.message.includes('already registered')) {
          throw new Error('Email already has an account');
        }
        throw error;
      }

      return { success: true, user: data.user };
    } catch (err) {
      throw err;
    }
  };

  const signIn = async (email: string, password: string, rememberMe: boolean = false) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw new Error('Invalid credentials');
      }

      if (data.user) {
        setUser({
          id: data.user.id,
          email: data.user.email || '',
          fullName: data.user.user_metadata?.full_name || 'Founder',
          tier: 'free',
        });
      }

      return { success: true, user: data.user };
    } catch (err) {
      throw err;
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-confirm`,
      });

      if (error) throw error;
      return { success: true };
    } catch (err) {
      throw err;
    }
  };

  const updatePassword = async (newPassword: string) => {
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
      return { success: true };
    } catch (err) {
      throw err;
    }
  };

  const logOut = async () => {
    try {
      await supabase.auth.signOut();
      clearAuth();
      return { success: true };
    } catch (err) {
      throw err;
    }
  };

  const checkSession = async () => {
    try {
      const { data } = await supabase.auth.getSession();
      if (data.session?.user) {
        setUser({
          id: data.session.user.id,
          email: data.session.user.email || '',
          fullName: data.session.user.user_metadata?.full_name || 'Founder',
          tier: 'free',
        });
        return { authenticated: true, user: data.session.user };
      }
      return { authenticated: false };
    } catch (err) {
      return { authenticated: false };
    }
  };

  return {
    signUp,
    signIn,
    resetPassword,
    updatePassword,
    logOut,
    checkSession,
  };
};
