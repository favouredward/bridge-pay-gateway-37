import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface AdminUser {
  id: string;
  first_name: string;
  last_name: string;
  phone?: string;
  kyc_status: string;
  role: string;
  created_at: string;
  updated_at: string;
  last_login?: string;
  avatar_url?: string;
  user_id: string;
}

export interface AdminTransaction {
  id: string;
  user_id: string;
  gbp_amount: number;
  usdt_amount: number;
  exchange_rate: number;
  wallet_address: string;
  status: string;
  payment_reference: string;
  transaction_hash?: string;
  created_at: string;
  updated_at: string;
  completed_at?: string;
  payment_deadline: string;
  bridge_pay_fee: number;
  network_fee: number;
  total_fees: number;
  admin_notes?: string;
}

export interface KYCDocument {
  id: string;
  user_id: string;
  document_type: string;
  document_url: string;
  status: string;
  submitted_at: string;
  reviewed_at?: string;
  admin_notes?: string;
}

const fetchAdminUsers = async (): Promise<AdminUser[]> => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
};

const fetchAdminTransactions = async (): Promise<AdminTransaction[]> => {
  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
};

const fetchKYCDocuments = async (): Promise<KYCDocument[]> => {
  const { data, error } = await supabase
    .from('kyc_documents')
    .select('*')
    .order('submitted_at', { ascending: false });

  if (error) throw error;
  return data || [];
};

export function useOptimizedAdminData() {
  const queryClient = useQueryClient();

  const {
    data: users = [],
    isLoading: usersLoading,
    error: usersError,
  } = useQuery({
    queryKey: ['adminUsers'],
    queryFn: fetchAdminUsers,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const {
    data: transactions = [],
    isLoading: transactionsLoading,
    error: transactionsError,
  } = useQuery({
    queryKey: ['adminTransactions'],
    queryFn: fetchAdminTransactions,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });

  const {
    data: kycDocuments = [],
    isLoading: kycLoading,
    error: kycError,
  } = useQuery({
    queryKey: ['kycDocuments'],
    queryFn: fetchKYCDocuments,
    staleTime: 3 * 60 * 1000, // 3 minutes
  });

  // Mutations for KYC actions
  const approveKYCMutation = useMutation({
    mutationFn: async (userId: string) => {
      const { error: kycError } = await supabase
        .from('kyc_documents')
        .update({ 
          status: 'approved', 
          reviewed_at: new Date().toISOString() 
        })
        .eq('user_id', userId);

      if (kycError) throw kycError;

      const { error: profileError } = await supabase
        .from('profiles')
        .update({ 
          kyc_status: 'verified', 
          updated_at: new Date().toISOString() 
        })
        .eq('user_id', userId);

      if (profileError) throw profileError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['kycDocuments'] });
      queryClient.invalidateQueries({ queryKey: ['adminUsers'] });
      toast.success('KYC approved successfully');
    },
    onError: () => {
      toast.error('Failed to approve KYC');
    },
  });

  const rejectKYCMutation = useMutation({
    mutationFn: async ({ userId, notes }: { userId: string; notes: string }) => {
      const { error: kycError } = await supabase
        .from('kyc_documents')
        .update({ 
          status: 'rejected', 
          reviewed_at: new Date().toISOString(),
          admin_notes: notes
        })
        .eq('user_id', userId);

      if (kycError) throw kycError;

      const { error: profileError } = await supabase
        .from('profiles')
        .update({ 
          kyc_status: 'rejected', 
          updated_at: new Date().toISOString() 
        })
        .eq('user_id', userId);

      if (profileError) throw profileError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['kycDocuments'] });
      queryClient.invalidateQueries({ queryKey: ['adminUsers'] });
      toast.success('KYC rejected');
    },
    onError: () => {
      toast.error('Failed to reject KYC');
    },
  });

  const updateTransactionMutation = useMutation({
    mutationFn: async ({ 
      transactionId, 
      status, 
      notes 
    }: { 
      transactionId: string; 
      status: string; 
      notes?: string;
    }) => {
      const { error } = await supabase
        .from('transactions')
        .update({ 
          status, 
          admin_notes: notes,
          updated_at: new Date().toISOString(),
          ...(status === 'completed' ? { completed_at: new Date().toISOString() } : {})
        })
        .eq('id', transactionId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminTransactions'] });
      toast.success('Transaction updated successfully');
    },
    onError: () => {
      toast.error('Failed to update transaction');
    },
  });

  const loading = usersLoading || transactionsLoading || kycLoading;
  const error = usersError || transactionsError || kycError;

  return {
    users,
    transactions,
    kycDocuments,
    loading,
    error: error ? 'Failed to fetch admin data' : null,
    approveKYC: approveKYCMutation.mutate,
    rejectKYC: rejectKYCMutation.mutate,
    updateTransaction: updateTransactionMutation.mutate,
    refetch: () => {
      queryClient.invalidateQueries({ queryKey: ['adminUsers'] });
      queryClient.invalidateQueries({ queryKey: ['adminTransactions'] });
      queryClient.invalidateQueries({ queryKey: ['kycDocuments'] });
    },
  };
}