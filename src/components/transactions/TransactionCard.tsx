
import { Transaction } from '@/types';
import { StatusBadge } from '@/components/ui/status-badge';
import { Copy, ExternalLink } from 'lucide-react';
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

  return (
    <div
      className="card-interactive p-4 space-y-3"
      onClick={onClick}
    >
      <div className="flex justify-between items-start">
        <div>
          <p className="font-semibold text-foreground">
            {formatAmount(transaction.gbpAmount)} → {transaction.usdtAmount} USDT
          </p>
          <p className="text-sm text-muted-foreground">
            Rate: 1 GBP = {transaction.exchangeRate} USDT
          </p>
        </div>
        <StatusBadge status={transaction.status} />
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Reference:</span>
          <div className="flex items-center gap-2">
            <span className="text-sm font-mono">{transaction.paymentReference}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                copyToClipboard(transaction.paymentReference, 'Reference');
              }}
            >
              <Copy className="h-3 w-3" />
            </Button>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Wallet:</span>
          <div className="flex items-center gap-2">
            <span className="text-sm font-mono">
              {`${transaction.walletAddress.slice(0, 6)}...${transaction.walletAddress.slice(-4)}`}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                copyToClipboard(transaction.walletAddress, 'Wallet address');
              }}
            >
              <Copy className="h-3 w-3" />
            </Button>
          </div>
        </div>

        {transaction.transactionHash && (
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Tx Hash:</span>
            <div className="flex items-center gap-2">
              <span className="text-sm font-mono">
                {`${transaction.transactionHash.slice(0, 6)}...${transaction.transactionHash.slice(-4)}`}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  window.open(`https://etherscan.io/tx/${transaction.transactionHash}`, '_blank');
                }}
              >
                <ExternalLink className="h-3 w-3" />
              </Button>
            </div>
          </div>
        )}
      </div>

      <div className="pt-2 border-t border-border">
        <p className="text-xs text-muted-foreground">
          {formatDistanceToNow(new Date(transaction.createdAt), { addSuffix: true })}
        </p>
      </div>
    </div>
  );
}
