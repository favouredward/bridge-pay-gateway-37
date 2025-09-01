import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface AdminStats {
  totalUsers: number;
  totalTransactions: number;
  pendingTransactions: number;
  pendingKYC: number;
  completedTransactions: number;
  totalRevenue: number;
  todayRevenue: number;
  revenue: {
    today: number;
    week: number;
    month: number;
  };
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
  // Join with profile data
  user_profile?: {
    first_name: string;
    last_name: string;
    email?: string;
  };
}

export interface AdminUser {
  id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  role: string;
  kyc_status: string;
  phone?: string;
  created_at: string;
  updated_at: string;
  last_login?: string;
}

export interface AdminKYCDocument {
  id: string;
  user_id: string;
  document_type: string;
  document_url: string;
  status: string;
  submitted_at: string;
  reviewed_at?: string;
  admin_notes?: string;
  // Join with profile data
  user_profile?: {
    first_name: string;
    last_name: string;
  };
}

export function useAdminData() {
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    totalTransactions: 0,
    pendingTransactions: 0,
    pendingKYC: 0,
    completedTransactions: 0,
    totalRevenue: 0,
    todayRevenue: 0,
    revenue: {
      today: 0,
      week: 0,
      month: 0,
    },
  });
  
  const [transactions, setTransactions] = useState<AdminTransaction[]>([]);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [kycDocuments, setKycDocuments] = useState<AdminKYCDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    try {
      // Get total users
      const { count: totalUsers } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'user');

      // Get total transactions
      const { count: totalTransactions } = await supabase
        .from('transactions')
        .select('*', { count: 'exact', head: true });

      // Get pending transactions
      const { count: pendingTransactions } = await supabase
        .from('transactions')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending');

      // Get completed transactions
      const { count: completedTransactions } = await supabase
        .from('transactions')
        .select('*', { count: 'exact', head: true })
        .in('status', ['completed', 'usdt_sent']);

      // Get pending KYC
      const { count: pendingKYC } = await supabase
        .from('kyc_documents')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending');

      // Get total revenue (sum of all completed transaction fees)
      const { data: revenueData } = await supabase
        .from('transactions')
        .select('total_fees')
        .in('status', ['completed', 'usdt_sent']);

      const totalRevenue = revenueData?.reduce((sum, tx) => sum + Number(tx.total_fees || 0), 0) || 0;

      // Get today's revenue
      const today = new Date().toISOString().split('T')[0];
      const { data: todayRevenueData } = await supabase
        .from('transactions')
        .select('total_fees')
        .in('status', ['completed', 'usdt_sent'])
        .gte('created_at', today);

      const todayRevenue = todayRevenueData?.reduce((sum, tx) => sum + Number(tx.total_fees || 0), 0) || 0;

      setStats({
        totalUsers: totalUsers || 0,
        totalTransactions: totalTransactions || 0,
        pendingTransactions: pendingTransactions || 0,
        pendingKYC: pendingKYC || 0,
        completedTransactions: completedTransactions || 0,
        totalRevenue,
        todayRevenue,
        revenue: {
          today: todayRevenue,
          week: totalRevenue * 0.7, // Approximate
          month: totalRevenue,
        },
      });
    } catch (err) {
      console.error('Error fetching admin stats:', err);
      setError('Failed to fetch statistics');
    }
  };

  const fetchTransactions = async () => {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select(`
          *
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedTransactions: AdminTransaction[] = data?.map(tx => ({
        ...tx,
        user_profile: undefined, // Will be fetched separately if needed
      })) || [];

      setTransactions(formattedTransactions);
    } catch (err) {
      console.error('Error fetching transactions:', err);
      setError('Failed to fetch transactions');
    }
  };

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Failed to fetch users');
    }
  };

  const fetchKYCDocuments = async () => {
    try {
      const { data, error } = await supabase
        .from('kyc_documents')
        .select(`
          *
        `)
        .order('submitted_at', { ascending: false });

      if (error) throw error;

      const formattedKYC: AdminKYCDocument[] = data?.map(kyc => ({
        ...kyc,
        user_profile: undefined, // Will be fetched separately if needed
      })) || [];

      setKycDocuments(formattedKYC);
    } catch (err) {
      console.error('Error fetching KYC documents:', err);
      setError('Failed to fetch KYC documents');
    }
  };

  const fetchAllData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Batch all queries for better performance
      const [statsResult, transactionsResult, usersResult, kycResult] = await Promise.allSettled([
        fetchStats(),
        fetchTransactions(), 
        fetchUsers(),
        fetchKYCDocuments(),
      ]);

      // Log any failed requests but don't stop execution
      const results = [statsResult, transactionsResult, usersResult, kycResult];
      results.forEach((result, index) => {
        if (result.status === 'rejected') {
          console.warn(`Admin data fetch ${index} failed:`, result.reason);
        }
      });

    } catch (err) {
      console.error('Error fetching admin data:', err);
      setError('Failed to fetch admin data');
    } finally {
      setLoading(false);
    }
  };

  const approveTransaction = async (transactionId: string) => {
    try {
      const { error } = await supabase
        .from('transactions')
        .update({ 
          status: 'completed',
          completed_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq('id', transactionId);

      if (error) throw error;

      toast.success('Transaction approved successfully');
      await fetchTransactions();
      await fetchStats();
    } catch (err) {
      console.error('Error approving transaction:', err);
      toast.error('Failed to approve transaction');
      throw err;
    }
  };

  const rejectTransaction = async (transactionId: string, reason?: string) => {
    try {
      const { error } = await supabase
        .from('transactions')
        .update({ 
          status: 'rejected',
          admin_notes: reason,
          updated_at: new Date().toISOString(),
        })
        .eq('id', transactionId);

      if (error) throw error;

      toast.success('Transaction rejected');
      await fetchTransactions();
      await fetchStats();
    } catch (err) {
      console.error('Error rejecting transaction:', err);
      toast.error('Failed to reject transaction');
      throw err;
    }
  };

  const approveKYC = async (userId: string) => {
    try {
      // Update KYC document status
      const { error: kycError } = await supabase
        .from('kyc_documents')
        .update({ 
          status: 'approved',
          reviewed_at: new Date().toISOString(),
        })
        .eq('user_id', userId);

      if (kycError) throw kycError;

      // Update user profile KYC status
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ 
          kyc_status: 'verified',
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', userId);

      if (profileError) throw profileError;

      toast.success('KYC approved successfully');
      await fetchKYCDocuments();
      await fetchUsers();
      await fetchStats();
    } catch (err) {
      console.error('Error approving KYC:', err);
      toast.error('Failed to approve KYC');
      throw err;
    }
  };

  const rejectKYC = async (userId: string, reason?: string) => {
    try {
      // Update KYC document status
      const { error: kycError } = await supabase
        .from('kyc_documents')
        .update({ 
          status: 'rejected',
          reviewed_at: new Date().toISOString(),
          admin_notes: reason,
        })
        .eq('user_id', userId);

      if (kycError) throw kycError;

      // Update user profile KYC status
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ 
          kyc_status: 'rejected',
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', userId);

      if (profileError) throw profileError;

      toast.success('KYC rejected');
      await fetchKYCDocuments();
      await fetchUsers();
      await fetchStats();
    } catch (err) {
      console.error('Error rejecting KYC:', err);
      toast.error('Failed to reject KYC');
      throw err;
    }
  };

  const updateUserRole = async (userId: string, role: 'user' | 'admin') => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ 
          role,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', userId);

      if (error) throw error;

      toast.success(`User ${role === 'admin' ? 'promoted to' : 'demoted from'} admin`);
      await fetchUsers();
    } catch (err) {
      console.error('Error updating user role:', err);
      toast.error(`Failed to ${role === 'admin' ? 'promote' : 'demote'} user`);
      throw err;
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  return {
    stats,
    transactions,
    users,
    kycDocuments,
    loading,
    error,
    refetch: fetchAllData,
    approveTransaction,
    rejectTransaction,
    approveKYC,
    rejectKYC,
    updateUserRole,
  };
}