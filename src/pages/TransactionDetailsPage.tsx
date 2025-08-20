
import { useParams, useNavigate } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { BottomNavigation } from '@/components/layout/BottomNavigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatusBadge } from '@/components/ui/status-badge';
import { mockTransactions } from '@/data/mockData';
import { Copy, ExternalLink, Download, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';

export default function TransactionDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const transaction = mockTransactions.find(tx => tx.id === id);

  if (!transaction) {
    return (
      <div className="page-container mobile-safe-area">
        <Header title="Transaction Details" />
        <main className="container-padding py-6">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-foreground mb-2">
              Transaction Not Found
            </h2>
            <p className="text-muted-foreground mb-6">
              The transaction you're looking for doesn't exist.
            </p>
            <Button onClick={() => navigate('/history')}>
              Back to History
            </Button>
          </div>
        </main>
        <BottomNavigation />
      </div>
    );
  }

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

  const getStatusSteps = () => {
    const steps = [
      { id: 'pending', label: 'Transaction Created', completed: true },
      { id: 'payment_received', label: 'Payment Received', completed: ['payment_received', 'usdt_sent', 'completed'].includes(transaction.status) },
      { id: 'usdt_sent', label: 'USDT Sent', completed: ['usdt_sent', 'completed'].includes(transaction.status) },
      { id: 'completed', label: 'Completed', completed: transaction.status === 'completed' },
    ];

    return steps;
  };

  const statusSteps = getStatusSteps();

  return (
    <div className="page-container mobile-safe-area">
      <Header title="Transaction Details" />
      
      <main className="container-padding py-6 space-y-6">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate('/history')}
          className="flex items-center gap-2 -ml-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to History
        </Button>

        {/* Transaction Summary */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <CardTitle>Transaction Summary</CardTitle>
              <StatusBadge status={transaction.status} />
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">You sent</p>
                <p className="text-lg font-semibold text-foreground">
                  {formatAmount(transaction.gbpAmount)}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Recipient gets</p>
                <p className="text-lg font-semibold text-foreground">
                  {transaction.usdtAmount} USDT
                </p>
              </div>
            </div>
            
            <div className="pt-2 border-t border-border">
              <p className="text-sm text-muted-foreground">
                Exchange rate: 1 GBP = {transaction.exchangeRate} USDT
              </p>
              <p className="text-xs text-muted-foreground">
                Created {formatDistanceToNow(new Date(transaction.createdAt), { addSuffix: true })}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Status Timeline */}
        <Card>
          <CardHeader>
            <CardTitle>Transaction Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {statusSteps.map((step, index) => (
                <div key={step.id} className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    step.completed 
                      ? 'bg-brand-success text-white' 
                      : 'bg-muted text-muted-foreground'
                  }`}>
                    {step.completed ? '✓' : index + 1}
                  </div>
                  <div className="flex-1">
                    <p className={`font-medium ${
                      step.completed ? 'text-foreground' : 'text-muted-foreground'
                    }`}>
                      {step.label}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Transaction Details */}
        <Card>
          <CardHeader>
            <CardTitle>Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Reference:</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm">{transaction.paymentReference}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(transaction.paymentReference, 'Reference')}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Wallet Address:</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm">
                    {`${transaction.walletAddress.slice(0, 6)}...${transaction.walletAddress.slice(-4)}`}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(transaction.walletAddress, 'Wallet address')}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              </div>

              {transaction.transactionHash && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Transaction Hash:</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm">
                      {`${transaction.transactionHash.slice(0, 6)}...${transaction.transactionHash.slice(-4)}`}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => window.open(`https://etherscan.io/tx/${transaction.transactionHash}`, '_blank')}
                    >
                      <ExternalLink className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Fee Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Fee Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">BridgePay Fee:</span>
              <span className="text-sm font-medium">£{transaction.fees.bridgePayFee}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Network Fee:</span>
              <span className="text-sm font-medium">£{transaction.fees.networkFee}</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-border">
              <span className="font-medium">Total Fees:</span>
              <span className="font-medium">£{transaction.fees.totalFees}</span>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex gap-3">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => navigate(`/receipt/${transaction.id}`)}
          >
            <Download className="mr-2 h-4 w-4" />
            Download Receipt
          </Button>
          {transaction.status === 'pending' && (
            <Button className="btn-primary flex-1">
              I have paid
            </Button>
          )}
        </div>

        {transaction.adminNotes && (
          <Card>
            <CardHeader>
              <CardTitle>Admin Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {transaction.adminNotes}
              </p>
            </CardContent>
          </Card>
        )}
      </main>

      <BottomNavigation />
    </div>
  );
}
