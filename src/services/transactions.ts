import { supabase } from '@/integrations/supabase/client';
import { Transaction, TransactionFilters } from '@/types';

export const transactionService = {
  async createTransaction(transactionData: {
    gbpAmount: number;
    usdtAmount: number;
    exchangeRate: number;
    walletAddress: string;
    paymentReference: string;
    paymentDeadline: string;
    fees: {
      bridgePayFee: number;
      networkFee: number;
      totalFees: number;
    };
  }): Promise<{ transaction: Transaction | null; error: string | null }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return { transaction: null, error: 'User not authenticated' };
      }

      const { data, error } = await supabase
        .from('transactions')
        .insert({
          user_id: user.id,
          gbp_amount: transactionData.gbpAmount,
          usdt_amount: transactionData.usdtAmount,
          exchange_rate: transactionData.exchangeRate,
          wallet_address: transactionData.walletAddress,
          payment_reference: transactionData.paymentReference,
          payment_deadline: transactionData.paymentDeadline,
          bridge_pay_fee: transactionData.fees.bridgePayFee,
          network_fee: transactionData.fees.networkFee,
          total_fees: transactionData.fees.totalFees,
        })
        .select()
        .single();

      if (error) {
        return { transaction: null, error: error.message };
      }

      const transaction: Transaction = {
        id: data.id,
        userId: data.user_id,
        gbpAmount: Number(data.gbp_amount),
        usdtAmount: Number(data.usdt_amount),
        exchangeRate: Number(data.exchange_rate),
        walletAddress: data.wallet_address,
        status: data.status as Transaction['status'],
        paymentReference: data.payment_reference,
        transactionHash: data.transaction_hash,
        adminNotes: data.admin_notes,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
        completedAt: data.completed_at,
        paymentDeadline: data.payment_deadline,
        fees: {
          bridgePayFee: Number(data.bridge_pay_fee),
          networkFee: Number(data.network_fee),
          totalFees: Number(data.total_fees),
        },
      };

      return { transaction, error: null };
    } catch (error) {
      return { transaction: null, error: (error as Error).message };
    }
  },

  async getTransactions(filters?: TransactionFilters): Promise<{ transactions: Transaction[]; error: string | null }> {
    try {
      let query = supabase.from('transactions').select('*');

      if (filters?.status && filters.status !== 'all') {
        query = query.eq('status', filters.status);
      }

      if (filters?.dateFrom) {
        query = query.gte('created_at', filters.dateFrom);
      }

      if (filters?.dateTo) {
        query = query.lte('created_at', filters.dateTo);
      }

      if (filters?.minAmount) {
        query = query.gte('gbp_amount', filters.minAmount);
      }

      if (filters?.maxAmount) {
        query = query.lte('gbp_amount', filters.maxAmount);
      }

      if (filters?.search) {
        query = query.or(`payment_reference.ilike.%${filters.search}%,wallet_address.ilike.%${filters.search}%`);
      }

      query = query.order('created_at', { ascending: false });

      const { data, error } = await query;

      if (error) {
        return { transactions: [], error: error.message };
      }

      const transactions: Transaction[] = data.map(item => ({
        id: item.id,
        userId: item.user_id,
        gbpAmount: Number(item.gbp_amount),
        usdtAmount: Number(item.usdt_amount),
        exchangeRate: Number(item.exchange_rate),
        walletAddress: item.wallet_address,
        status: item.status as Transaction['status'],
        paymentReference: item.payment_reference,
        transactionHash: item.transaction_hash,
        adminNotes: item.admin_notes,
        createdAt: item.created_at,
        updatedAt: item.updated_at,
        completedAt: item.completed_at,
        paymentDeadline: item.payment_deadline,
        fees: {
          bridgePayFee: Number(item.bridge_pay_fee),
          networkFee: Number(item.network_fee),
          totalFees: Number(item.total_fees),
        },
      }));

      return { transactions, error: null };
    } catch (error) {
      return { transactions: [], error: (error as Error).message };
    }
  },

  async updateTransactionStatus(
    transactionId: string, 
    status: Transaction['status'], 
    adminNotes?: string,
    transactionHash?: string
  ): Promise<{ error: string | null }> {
    try {
      const updateData: any = { 
        status,
        updated_at: new Date().toISOString(),
      };

      if (adminNotes) updateData.admin_notes = adminNotes;
      if (transactionHash) updateData.transaction_hash = transactionHash;
      if (status === 'completed') updateData.completed_at = new Date().toISOString();

      const { error } = await supabase
        .from('transactions')
        .update(updateData)
        .eq('id', transactionId);

      return { error: error?.message || null };
    } catch (error) {
      return { error: (error as Error).message };
    }
  },
};