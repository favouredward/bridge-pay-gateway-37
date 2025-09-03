import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuthStore } from '@/store/authStore';

export function useRealtimeUpdates() {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();

  useEffect(() => {
    if (!user?.id) return;

    // Listen to profile updates for current user
    const profileChannel = supabase
      .channel(`profile-updates-${user.id}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'profiles',
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          // Invalidate user-related queries
          queryClient.invalidateQueries({ queryKey: ['userTransactions', user.id] });
          queryClient.invalidateQueries({ queryKey: ['adminUsers'] });
          
          // Update auth store with new profile data
          const updatedProfile = payload.new;
          const { updateUser } = useAuthStore.getState();
          updateUser({
            firstName: updatedProfile.first_name,
            lastName: updatedProfile.last_name,
            phone: updatedProfile.phone,
            avatarUrl: updatedProfile.avatar_url,
            kycStatus: updatedProfile.kyc_status,
          });
        }
      )
      .subscribe();

    // Listen to transaction updates for current user
    const transactionChannel = supabase
      .channel(`transaction-updates-${user.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'transactions',
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          // Invalidate transaction queries
          queryClient.invalidateQueries({ queryKey: ['userTransactions', user.id] });
          queryClient.invalidateQueries({ queryKey: ['adminTransactions'] });
        }
      )
      .subscribe();

    // Listen to KYC document updates for current user
    const kycChannel = supabase
      .channel(`kyc-updates-${user.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'kyc_documents',
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          // Invalidate KYC queries
          queryClient.invalidateQueries({ queryKey: ['kycDocuments'] });
          queryClient.invalidateQueries({ queryKey: ['adminUsers'] });
        }
      )
      .subscribe();

    // Cleanup function
    return () => {
      supabase.removeChannel(profileChannel);
      supabase.removeChannel(transactionChannel);
      supabase.removeChannel(kycChannel);
    };
  }, [user?.id, queryClient]);

  // Admin-specific realtime updates
  useEffect(() => {
    if (user?.role !== 'admin') return;

    // Listen to all transactions for admin
    const adminTransactionChannel = supabase
      .channel('admin-transaction-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'transactions',
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['adminTransactions'] });
        }
      )
      .subscribe();

    // Listen to all KYC documents for admin
    const adminKycChannel = supabase
      .channel('admin-kyc-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'kyc_documents',
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['kycDocuments'] });
        }
      )
      .subscribe();

    // Listen to all profile updates for admin
    const adminProfileChannel = supabase
      .channel('admin-profile-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'profiles',
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['adminUsers'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(adminTransactionChannel);
      supabase.removeChannel(adminKycChannel);
      supabase.removeChannel(adminProfileChannel);
    };
  }, [user?.role, queryClient]);
}