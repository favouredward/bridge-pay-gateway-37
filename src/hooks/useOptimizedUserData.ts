import { useQuery } from '@tanstack/react-query';
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

const fetchUserTransactions = async (userId: string): Promise<UserTransaction[]> => {
  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
};

const calculateStats = (transactions: UserTransaction[]): UserStats => {
  const completedTx = transactions.filter(tx => 
    ['completed', 'usdt_sent'].includes(tx.status)
  );
  const pendingTx = transactions.filter(tx => tx.status === 'pending');
  
  const totalSent = completedTx.reduce((sum, tx) => sum + tx.gbp_amount, 0);
  const averageTransfer = completedTx.length > 0 ? totalSent / completedTx.length : 0;
  const successRate = transactions.length > 0 
    ? (completedTx.length / transactions.length) * 100 
    : 0;

  // This month transactions
  const thisMonth = new Date();
  thisMonth.setDate(1);
  const thisMonthTx = transactions.filter(tx => 
    new Date(tx.created_at) >= thisMonth
  );

  return {
    totalSent,
    totalTransactions: transactions.length,
    completedTransactions: completedTx.length,
    pendingTransactions: pendingTx.length,
    thisMonthTransactions: thisMonthTx.length,
    successRate,
    averageTransfer,
  };
};

export function useOptimizedUserData() {
  const { user } = useAuthStore();

  const {
    data: transactions = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['userTransactions', user?.id],
    queryFn: () => fetchUserTransactions(user!.id),
    enabled: !!user?.id,
    staleTime: 2 * 60 * 1000, // 2 minutes for transaction data
  });

  const stats = calculateStats(transactions);

  return {
    transactions,
    stats,
    loading: isLoading,
    error: error ? 'Failed to fetch transactions' : null,
    refetch,
  };
}