
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
        // Wait a moment for the trigger to create the profile
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Fetch the created profile
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', authData.user.id)
          .single();

        if (profileError) {
          console.error('Profile fetch error:', profileError);
          // If profile doesn't exist, create it manually as fallback
          const { error: insertError } = await supabase
            .from('profiles')
            .insert({
              user_id: authData.user.id,
              first_name: data.firstName,
              last_name: data.lastName,
              phone: data.phone,
              kyc_status: 'pending',
              role: 'user',
            });

          if (insertError) {
            return { user: null, error: 'Failed to create user profile' };
          }

          // Fetch the manually created profile
          const { data: newProfile, error: newProfileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('user_id', authData.user.id)
            .single();

          if (newProfileError || !newProfile) {
            return { user: null, error: 'Failed to fetch user profile' };
          }

          const user: User = {
            id: authData.user.id,
            email: authData.user.email!,
            firstName: newProfile.first_name,
            lastName: newProfile.last_name,
            phone: newProfile.phone,
            kycStatus: newProfile.kyc_status as User['kycStatus'],
            role: newProfile.role as User['role'],
            createdAt: newProfile.created_at,
            updatedAt: newProfile.updated_at,
          };

          return { user, error: null };
        }

        const user: User = {
          id: authData.user.id,
          email: authData.user.email!,
          firstName: profile.first_name,
          lastName: profile.last_name,
          phone: profile.phone,
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
          .single();

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
        .single();

      if (!profile) return null;

      return {
        id: user.id,
        email: user.email!,
        firstName: profile.first_name,
        lastName: profile.last_name,
        phone: profile.phone,
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
