
import { supabase } from '@/integrations/supabase/client';
import { User } from '@/types';

export interface AuthResponse {
  user: User | null;
  error: string | null;
}

export interface SignUpData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
}

export const authService = {
  async signUp(data: SignUpData): Promise<AuthResponse> {
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            firstName: data.firstName,
            lastName: data.lastName,
            phone: data.phone,
          },
          emailRedirectTo: `${window.location.origin}/dashboard`
        }
      });

      if (authError) {
        return { user: null, error: authError.message };
      }

      if (authData.user) {
        // Wait for trigger to create profile, then fetch it
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Fetch the profile created by the trigger
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', authData.user.id)
          .maybeSingle();

        if (profileError) {
          console.error('Profile fetch error:', profileError);
          return { user: null, error: 'Failed to create user profile. Please try again.' };
        }

        if (!profile) {
          return { user: null, error: 'User profile was not created. Please try again.' };
        }

        const user: User = {
          id: authData.user.id,
          email: authData.user.email!,
          firstName: profile.first_name,
          lastName: profile.last_name,
          phone: profile.phone,
          avatarUrl: profile.avatar_url,
          kycStatus: profile.kyc_status as User['kycStatus'],
          role: profile.role as User['role'],
          createdAt: profile.created_at,
          updatedAt: profile.updated_at,
        };

        return { user, error: null };
      }

      return { user: null, error: 'Failed to create user' };
    } catch (error) {
      console.error('Signup error:', error);
      return { user: null, error: (error as Error).message };
    }
  },

  async signIn(email: string, password: string): Promise<AuthResponse> {
    try {
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        return { user: null, error: authError.message };
      }

      if (authData.user) {
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', authData.user.id)
          .maybeSingle();

        if (profileError || !profile) {
          return { user: null, error: 'Profile not found. Please contact support.' };
        }

        // Update last login
        await supabase
          .from('profiles')
          .update({ last_login: new Date().toISOString() })
          .eq('user_id', authData.user.id);

        const user: User = {
          id: authData.user.id,
          email: authData.user.email!,
          firstName: profile.first_name,
          lastName: profile.last_name,
          phone: profile.phone,
          avatarUrl: profile.avatar_url,
          kycStatus: profile.kyc_status as User['kycStatus'],
          role: profile.role as User['role'],
          createdAt: profile.created_at,
          updatedAt: profile.updated_at,
          lastLogin: new Date().toISOString(),
        };

        return { user, error: null };
      }

      return { user: null, error: 'Login failed' };
    } catch (error) {
      console.error('Signin error:', error);
      return { user: null, error: (error as Error).message };
    }
  },

  async signOut(): Promise<{ error: string | null }> {
    try {
      const { error } = await supabase.auth.signOut();
      return { error: error?.message || null };
    } catch (error) {
      return { error: (error as Error).message };
    }
  },

  async getCurrentUser(): Promise<User | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return null;

      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (!profile) return null;

      return {
        id: user.id,
        email: user.email!,
        firstName: profile.first_name,
        lastName: profile.last_name,
        phone: profile.phone,
        avatarUrl: profile.avatar_url,
        kycStatus: profile.kyc_status as User['kycStatus'],
        role: profile.role as User['role'],
        createdAt: profile.created_at,
        updatedAt: profile.updated_at,
        lastLogin: profile.last_login,
      };
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  },
};
