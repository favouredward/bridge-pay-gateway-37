import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuthStore } from '@/store/authStore';

export interface UserTransaction {
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
}

export interface UserStats {
  totalSent: number;
  totalTransactions: number;
  completedTransactions: number;
  pendingTransactions: number;
  thisMonthTransactions: number;
  successRate: number;
  averageTransfer: number;
}

export function useUserData() {
  const { user } = useAuthStore();
  const [transactions, setTransactions] = useState<UserTransaction[]>([]);
  const [stats, setStats] = useState<UserStats>({
    totalSent: 0,
    totalTransactions: 0,
    completedTransactions: 0,
    pendingTransactions: 0,
    thisMonthTransactions: 0,
    successRate: 0,
    averageTransfer: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUserTransactions = async () => {
    if (!user?.id) return;

    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const userTransactions: UserTransaction[] = data || [];
      setTransactions(userTransactions);

      // Calculate stats
      const completedTx = userTransactions.filter(tx => 
        ['completed', 'usdt_sent'].includes(tx.status)
      );
      const pendingTx = userTransactions.filter(tx => tx.status === 'pending');
      
      const totalSent = completedTx.reduce((sum, tx) => sum + tx.gbp_amount, 0);
      const averageTransfer = completedTx.length > 0 ? totalSent / completedTx.length : 0;
      const successRate = userTransactions.length > 0 
        ? (completedTx.length / userTransactions.length) * 100 
        : 0;

      // This month transactions
      const thisMonth = new Date();
      thisMonth.setDate(1);
      const thisMonthTx = userTransactions.filter(tx => 
        new Date(tx.created_at) >= thisMonth
      );

      setStats({
        totalSent,
        totalTransactions: userTransactions.length,
        completedTransactions: completedTx.length,
        pendingTransactions: pendingTx.length,
        thisMonthTransactions: thisMonthTx.length,
        successRate,
        averageTransfer,
      });

    } catch (err) {
      console.error('Error fetching user transactions:', err);
      setError('Failed to fetch transactions');
    }
  };

  const fetchAllData = async () => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await fetchUserTransactions();
    } catch (err) {
      console.error('Error fetching user data:', err);
      setError('Failed to fetch user data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, [user?.id]);

  return {
    transactions,
    stats,
    loading,
    error,
    refetch: fetchAllData,
  };
}