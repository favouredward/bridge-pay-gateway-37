
import { Transaction } from '@/types';
import { StatusBadge } from '@/components/ui/status-badge';
import { Copy, ExternalLink, ArrowRight, Clock, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';

interface TransactionCardProps {
  transaction: Transaction;
  onClick?: () => void;
}

export function TransactionCard({ transaction, onClick }: TransactionCardProps) {
  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard`);
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
    }).format(amount);
  };

  const getStatusIcon = () => {
    switch (transaction.status) {
      case 'completed':
        return <CheckCircle2 className="h-5 w-5 text-emerald-500" />;
      case 'pending':
        return <Clock className="h-5 w-5 text-orange-500" />;
      default:
        return <Clock className="h-5 w-5 text-blue-500" />;
    }
  };

  const getStatusGradient = () => {
    switch (transaction.status) {
      case 'completed':
        return 'from-emerald-500/10 to-emerald-600/5 border-emerald-500/20';
      case 'pending':
        return 'from-orange-500/10 to-orange-600/5 border-orange-500/20';
      case 'failed':
        return 'from-red-500/10 to-red-600/5 border-red-500/20';
      default:
        return 'from-blue-500/10 to-blue-600/5 border-blue-500/20';
    }
  };

  return (
    <div
      className="card-interactive p-6 space-y-4 group hover:shadow-2xl hover:shadow-black/5 bg-gradient-to-r from-surface-elevated to-surface-primary/50"
      onClick={onClick}
    >
      {/* Header */}
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-4">
          <div className={`p-3 rounded-2xl bg-gradient-to-r ${getStatusGradient()} border`}>
            {getStatusIcon()}
          </div>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <p className="font-bold text-foreground text-lg">
                {formatAmount(transaction.gbpAmount)}
              </p>
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
              <p className="font-bold text-brand-secondary text-lg">
                {transaction.usdtAmount} USDT
              </p>
            </div>
            <p className="text-sm text-muted-foreground">
              Rate: 1 GBP = {transaction.exchangeRate} USDT
            </p>
          </div>
        </div>
        <StatusBadge status={transaction.status} />
      </div>

      {/* Transaction Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pt-4 border-t border-border/50">
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-muted-foreground">Reference:</span>
            <div className="flex items-center gap-2">
              <code className="text-sm font-mono bg-muted px-2 py-1 rounded-lg">
                {transaction.paymentReference}
              </code>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  copyToClipboard(transaction.paymentReference, 'Reference');
                }}
                className="p-1 h-auto hover:bg-brand-primary/10 hover:text-brand-primary"
              >
                <Copy className="h-3 w-3" />
              </Button>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-muted-foreground">Wallet:</span>
            <div className="flex items-center gap-2">
              <code className="text-sm font-mono bg-muted px-2 py-1 rounded-lg">
                {`${transaction.walletAddress.slice(0, 6)}...${transaction.walletAddress.slice(-4)}`}
              </code>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  copyToClipboard(transaction.walletAddress, 'Wallet address');
                }}
                className="p-1 h-auto hover:bg-brand-primary/10 hover:text-brand-primary"
              >
                <Copy className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          {transaction.transactionHash && (
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-muted-foreground">Tx Hash:</span>
              <div className="flex items-center gap-2">
                <code className="text-sm font-mono bg-muted px-2 py-1 rounded-lg">
                  {`${transaction.transactionHash.slice(0, 6)}...${transaction.transactionHash.slice(-4)}`}
                </code>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    window.open(`https://etherscan.io/tx/${transaction.transactionHash}`, '_blank');
                  }}
                  className="p-1 h-auto hover:bg-brand-primary/10 hover:text-brand-primary"
                >
                  <ExternalLink className="h-3 w-3" />
                </Button>
              </div>
            </div>
          )}

          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-muted-foreground">Fees:</span>
            <span className="text-sm font-semibold text-foreground">
              £{transaction.fees.totalFees.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex justify-between items-center pt-4 border-t border-border/50">
        <p className="text-xs text-muted-foreground flex items-center gap-2">
          <Clock className="h-3 w-3" />
          {formatDistanceToNow(new Date(transaction.createdAt), { addSuffix: true })}
        </p>
        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
          <ArrowRight className="h-4 w-4 text-brand-primary" />
        </div>
      </div>
    </div>
  );
}
