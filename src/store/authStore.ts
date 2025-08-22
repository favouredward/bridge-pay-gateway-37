
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AuthState, User } from '@/types';
import { authService } from '@/services/auth';
import { supabase } from '@/integrations/supabase/client';

interface AuthActions {
  signUp: (data: { email: string; password: string; firstName: string; lastName: string; phone?: string }) => Promise<{ error: string | null }>;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  initialize: () => Promise<void>;
  updateUser: (user: Partial<User>) => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoading: false,
      isAuthenticated: false,

      initialize: async () => {
        set({ isLoading: true });
        try {
          const user = await authService.getCurrentUser();
          if (user) {
            const { data: { session } } = await supabase.auth.getSession();
            set({
              user,
              token: session?.access_token || null,
              isAuthenticated: true,
              isLoading: false,
            });
          } else {
            set({
              user: null,
              token: null,
              isAuthenticated: false,
              isLoading: false,
            });
          }
        } catch (error) {
          console.error('Auth initialization error:', error);
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
          });
        }
      },

      signUp: async (data) => {
        set({ isLoading: true });
        const { user, error } = await authService.signUp(data);
        
        if (user) {
          const { data: { session } } = await supabase.auth.getSession();
          set({
            user,
            token: session?.access_token || null,
            isAuthenticated: true,
            isLoading: false,
          });
        } else {
          set({ isLoading: false });
        }
        
        return { error };
      },

      signIn: async (email: string, password: string) => {
        set({ isLoading: true });
        const { user, error } = await authService.signIn(email, password);
        
        if (user) {
          const { data: { session } } = await supabase.auth.getSession();
          set({
            user,
            token: session?.access_token || null,
            isAuthenticated: true,
            isLoading: false,
          });
        } else {
          set({ isLoading: false });
        }
        
        return { error };
      },

      signOut: async () => {
        set({ isLoading: true });
        await authService.signOut();
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
        });
      },

      updateUser: (userData: Partial<User>) => {
        const currentUser = get().user;
        if (currentUser) {
          set({
            user: { ...currentUser, ...userData },
          });
        }
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
