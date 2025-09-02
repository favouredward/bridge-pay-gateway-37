
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
          // Set up auth state listener FIRST
          supabase.auth.onAuthStateChange(async (event, session) => {
            console.log('Auth state changed:', event, session?.user?.id);
            
            if (session?.user) {
              // Set up real-time subscription for user profile changes
              const channel = supabase
                .channel('profile-changes')
                .on(
                  'postgres_changes',
                  {
                    event: 'UPDATE',
                    schema: 'public',
                    table: 'profiles',
                    filter: `user_id=eq.${session.user.id}`
                  },
                  (payload) => {
                    console.log('Profile updated:', payload);
                    // Update the user state with new profile data
                    const updatedProfile = payload.new;
                    if (updatedProfile) {
                      const currentState = get();
                      if (currentState.user) {
                        set({
                          user: {
                            ...currentState.user,
                            kycStatus: updatedProfile.kyc_status,
                            role: updatedProfile.role,
                          }
                        });
                      }
                    }
                  }
                )
                .subscribe();

              // Store channel for cleanup
              (window as any).__supabaseRealtimeChannel = channel;

              // Defer profile fetching to avoid blocking the auth state change
              setTimeout(async () => {
                const user = await authService.getCurrentUser();
                if (user) {
                  set({
                    user,
                    token: session.access_token,
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
              }, 0);
            } else {
              // Cleanup realtime subscription on signout
              const channel = (window as any).__supabaseRealtimeChannel;
              if (channel) {
                supabase.removeChannel(channel);
                delete (window as any).__supabaseRealtimeChannel;
              }
              
              set({
                user: null,
                token: null,
                isAuthenticated: false,
                isLoading: false,
              });
            }
          });

          // Check for existing session
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user) {
            const user = await authService.getCurrentUser();
            if (user) {
              set({
                user,
                token: session.access_token,
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
          } else {
            set({ isLoading: false });
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
        try {
          const { user, error } = await authService.signUp(data);
          
          if (user && !error) {
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
        } catch (error) {
          set({ isLoading: false });
          return { error: (error as Error).message };
        }
      },

      signIn: async (email: string, password: string) => {
        set({ isLoading: true });
        try {
          const { user, error } = await authService.signIn(email, password);
          
          if (user && !error) {
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
        } catch (error) {
          set({ isLoading: false });
          return { error: (error as Error).message };
        }
      },

      signOut: async () => {
        set({ isLoading: true });
        // Cleanup realtime subscription
        const channel = (window as any).__supabaseRealtimeChannel;
        if (channel) {
          supabase.removeChannel(channel);
          delete (window as any).__supabaseRealtimeChannel;
        }
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
