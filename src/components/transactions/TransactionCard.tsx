import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowRight, Copy, ExternalLink } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Transaction } from '@/types';
import { UserTransaction } from '@/hooks/useUserData';
import { cn } from '@/lib/utils';

interface TransactionCardProps {
  transaction: Transaction | UserTransaction;
  onClick?: () => void;
}

export function TransactionCard({ transaction, onClick }: TransactionCardProps) {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
    }).format(amount);
  };

  const formatCrypto = (amount: number) => {
    return `${amount.toFixed(2)} USDT`;
  };

  // Helper functions to safely access transaction properties
  const getGbpAmount = () => 'gbpAmount' in transaction ? transaction.gbpAmount : transaction.gbp_amount;
  const getUsdtAmount = () => 'usdtAmount' in transaction ? transaction.usdtAmount : transaction.usdt_amount;
  const getPaymentReference = () => 'paymentReference' in transaction ? transaction.paymentReference : transaction.payment_reference;
  const getWalletAddress = () => 'walletAddress' in transaction ? transaction.walletAddress : transaction.wallet_address;
  const getTransactionHash = () => 'transactionHash' in transaction ? transaction.transactionHash : (transaction as any).transaction_hash;
  const getCreatedAt = () => 'createdAt' in transaction ? transaction.createdAt : transaction.created_at;
  const getFees = () => 'fees' in transaction ? transaction.fees.totalFees : transaction.total_fees;

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'completed':
      case 'usdt_sent':
        return {
          color: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
          label: 'Completed',
        };
      case 'pending':
        return {
          color: 'bg-orange-500/10 text-orange-600 border-orange-500/20',
          label: 'Pending',
        };
      case 'failed':
        return {
          color: 'bg-red-500/10 text-red-600 border-red-500/20',
          label: 'Failed',
        };
      default:
        return {
          color: 'bg-gray-500/10 text-gray-600 border-gray-500/20',
          label: status,
        };
    }
  };

  const statusConfig = getStatusConfig(transaction.status);

  return (
    <div
      onClick={onClick}
      className={cn(
        "card-premium p-4 md:p-6 space-y-4 cursor-pointer transition-all duration-200",
        onClick && "hover:shadow-lg hover:scale-[1.02]"
      )}
    >
      {/* Main Transaction Info */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-bold text-foreground text-base md:text-lg">
              {formatAmount(getGbpAmount())}
            </span>
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
            <span className="font-bold text-foreground text-base md:text-lg">
              {formatCrypto(getUsdtAmount())}
            </span>
          </div>
          <div className="text-xs md:text-sm text-muted-foreground space-y-1">
            <p>Ref: {getPaymentReference()}</p>
            <p>{new Date(getCreatedAt()).toLocaleDateString()}</p>
          </div>
        </div>

        <Badge className={cn("border text-xs font-semibold", statusConfig.color)}>
          {statusConfig.label}
        </Badge>
      </div>

      {/* Transaction Details */}
      <div className="space-y-3 text-sm">
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground font-medium">Payment Reference:</span>
          <div className="flex items-center gap-2">
            <code className="text-sm font-mono bg-muted px-2 py-1 rounded-lg">
              {getPaymentReference()}
            </code>
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                copyToClipboard(getPaymentReference(), 'Reference');
              }}
              className="p-1 h-auto hover:bg-brand-primary/10 hover:text-brand-primary"
            >
              <Copy className="h-3 w-3" />
            </Button>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-muted-foreground font-medium">Wallet Address:</span>
          <div className="flex items-center gap-2">
            <code className="text-sm font-mono bg-muted px-2 py-1 rounded-lg">
              {`${getWalletAddress().slice(0, 6)}...${getWalletAddress().slice(-4)}`}
            </code>
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                copyToClipboard(getWalletAddress(), 'Wallet address');
              }}
              className="p-1 h-auto hover:bg-brand-primary/10 hover:text-brand-primary"
            >
              <Copy className="h-3 w-3" />
            </Button>
          </div>
        </div>

        {getTransactionHash() && (
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground font-medium">Tx Hash:</span>
            <div className="flex items-center gap-2">
              <code className="text-sm font-mono bg-muted px-2 py-1 rounded-lg">
                {`${getTransactionHash()!.slice(0, 6)}...${getTransactionHash()!.slice(-4)}`}
              </code>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  window.open(`https://etherscan.io/tx/${getTransactionHash()}`, '_blank');
                }}
                className="p-1 h-auto hover:bg-brand-primary/10 hover:text-brand-primary"
              >
                <ExternalLink className="h-3 w-3" />
              </Button>
            </div>
          </div>
        )}

        <div className="flex justify-between items-center">
          <span className="text-muted-foreground font-medium">Fees:</span>
          <span className="text-sm font-semibold text-foreground">
            £{getFees().toFixed(2)}
          </span>
        </div>
      </div>

      {/* Timestamp */}
      <div className="text-xs text-muted-foreground text-right border-t pt-2">
        {formatDistanceToNow(new Date(getCreatedAt()), { addSuffix: true })}
      </div>
    </div>
  );
}