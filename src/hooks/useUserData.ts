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
  admin_notes?: string;
}

export interface UserStats {
  totalTransactions: number;
  totalAmount: number;
  completedTransactions: number;
  pendingTransactions: number;
  successRate: number;
  averageAmount: number;
  thisMonthTransactions: number;
}

export interface ExchangeRate {
  id: string;
  from_currency: string;
  to_currency: string;
  rate: number;
  timestamp: string;
  source: string;
}

export function useUserData() {
  const { user } = useAuthStore();
  const [transactions, setTransactions] = useState<UserTransaction[]>([]);
  const [stats, setStats] = useState<UserStats>({
    totalTransactions: 0,
    totalAmount: 0,
    completedTransactions: 0,
    pendingTransactions: 0,
    successRate: 0,
    averageAmount: 0,
    thisMonthTransactions: 0,
  });
  const [exchangeRate, setExchangeRate] = useState<ExchangeRate | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTransactions = async () => {
    if (!user?.id) return;

    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTransactions(data || []);
      
      // Calculate stats
      const totalTransactions = data?.length || 0;
      const totalAmount = data?.reduce((sum, tx) => sum + Number(tx.gbp_amount || 0), 0) || 0;
      const completedTransactions = data?.filter(tx => 
        tx.status === 'completed' || tx.status === 'usdt_sent'
      ).length || 0;
      const pendingTransactions = data?.filter(tx => tx.status === 'pending').length || 0;
      const successRate = totalTransactions > 0 ? (completedTransactions / totalTransactions) * 100 : 0;
      const averageAmount = totalTransactions > 0 ? totalAmount / totalTransactions : 0;
      
      // This month transactions
      const thisMonth = new Date();
      thisMonth.setDate(1);
      thisMonth.setHours(0, 0, 0, 0);
      const thisMonthTransactions = data?.filter(tx => 
        new Date(tx.created_at) >= thisMonth
      ).length || 0;

      setStats({
        totalTransactions,
        totalAmount,
        completedTransactions,
        pendingTransactions,
        successRate,
        averageAmount,
        thisMonthTransactions,
      });
    } catch (err) {
      console.error('Error fetching user transactions:', err);
      setError('Failed to fetch transactions');
    }
  };

  const fetchExchangeRate = async () => {
    try {
      const { data, error } = await supabase
        .from('exchange_rates')
        .select('*')
        .eq('from_currency', 'GBP')
        .eq('to_currency', 'USDT')
        .order('timestamp', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      setExchangeRate(data);
    } catch (err) {
      console.error('Error fetching exchange rate:', err);
      setError('Failed to fetch exchange rate');
    }
  };

  const fetchUserData = async () => {
    if (!user?.id) return;
    
    setLoading(true);
    setError(null);
    
    try {
      await Promise.all([
        fetchTransactions(),
        fetchExchangeRate(),
      ]);
    } catch (err) {
      console.error('Error fetching user data:', err);
      setError('Failed to fetch user data');
    } finally {
      setLoading(false);
    }
  };

  const createTransaction = async (transactionData: {
    gbp_amount: number;
    usdt_amount: number;
    exchange_rate: number;
    wallet_address: string;
    payment_reference: string;
    payment_deadline: string;
    bridge_pay_fee: number;
    network_fee: number;
    total_fees: number;
  }) => {
    if (!user?.id) throw new Error('User not authenticated');

    try {
      const { data, error } = await supabase
        .from('transactions')
        .insert({
          user_id: user.id,
          ...transactionData,
          status: 'pending',
        })
        .select()
        .single();

      if (error) throw error;
      
      await fetchTransactions(); // Refresh data
      return data;
    } catch (err) {
      console.error('Error creating transaction:', err);
      throw err;
    }
  };

  useEffect(() => {
    if (user?.id) {
      fetchUserData();
    }
  }, [user?.id]);

  return {
    transactions,
    stats,
    exchangeRate,
    loading,
    error,
    refetch: fetchUserData,
    createTransaction,
  };
}