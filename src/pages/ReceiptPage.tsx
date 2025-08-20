
import { useParams, useNavigate } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { mockTransactions } from '@/data/mockData';
import { Download, ArrowLeft, Share } from 'lucide-react';
import { toast } from 'sonner';

export default function ReceiptPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const transaction = mockTransactions.find(tx => tx.id === id);

  if (!transaction) {
    return (
      <div className="page-container">
        <Header title="Receipt" />
        <main className="container-padding py-6">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-foreground mb-2">
              Receipt Not Found
            </h2>
            <p className="text-muted-foreground mb-6">
              The receipt you're looking for doesn't exist.
            </p>
            <Button onClick={() => navigate('/history')}>
              Back to History
            </Button>
          </div>
        </main>
      </div>
    );
  }

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
    }).format(amount);
  };

  const handleDownload = () => {
    toast.success('Receipt downloaded successfully!');
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `BridgePay Receipt - ${transaction.paymentReference}`,
          text: `Transaction receipt for ${formatAmount(transaction.gbpAmount)} to ${transaction.usdtAmount} USDT`,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Receipt link copied to clipboard!');
    }
  };

  return (
    <div className="page-container">
      <Header title="Receipt" />
      
      <main className="container-padding py-6 space-y-6">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate(`/transaction/${transaction.id}`)}
          className="flex items-center gap-2 -ml-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Transaction
        </Button>

        {/* Receipt */}
        <div className="max-w-md mx-auto">
          <Card className="print:shadow-none">
            <CardContent className="p-8 space-y-6">
              {/* Header */}
              <div className="text-center space-y-2">
                <h1 className="text-2xl font-bold text-brand-primary">BridgePay</h1>
                <h2 className="text-lg font-semibold text-foreground">Transaction Receipt</h2>
                <div className="text-xs text-muted-foreground">
                  {new Date(transaction.createdAt).toLocaleString()}
                </div>
              </div>

              {/* Transaction Details */}
              <div className="space-y-4">
                <div className="border-b border-border pb-4">
                  <h3 className="font-semibold text-foreground mb-3">Transaction Details</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Reference:</span>
                      <span className="font-mono">{transaction.paymentReference}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Status:</span>
                      <span className="font-medium capitalize">
                        {transaction.status.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="border-b border-border pb-4">
                  <h3 className="font-semibold text-foreground mb-3">Amount Details</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Amount sent:</span>
                      <span className="font-medium">{formatAmount(transaction.gbpAmount)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Exchange rate:</span>
                      <span className="font-medium">1 GBP = {transaction.exchangeRate} USDT</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">USDT received:</span>
                      <span className="font-medium">{transaction.usdtAmount} USDT</span>
                    </div>
                  </div>
                </div>

                <div className="border-b border-border pb-4">
                  <h3 className="font-semibold text-foreground mb-3">Recipient Details</h3>
                  <div className="text-sm">
                    <div className="mb-1">
                      <span className="text-muted-foreground">Wallet address:</span>
                    </div>
                    <div className="font-mono text-xs break-all bg-muted p-2 rounded">
                      {transaction.walletAddress}
                    </div>
                  </div>
                </div>

                <div className="border-b border-border pb-4">
                  <h3 className="font-semibold text-foreground mb-3">Fee Breakdown</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">BridgePay fee:</span>
                      <span>£{transaction.fees.bridgePayFee}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Network fee:</span>
                      <span>£{transaction.fees.networkFee}</span>
                    </div>
                    <div className="flex justify-between font-medium">
                      <span>Total fees:</span>
                      <span>£{transaction.fees.totalFees}</span>
                    </div>
                  </div>
                </div>

                {transaction.transactionHash && (
                  <div className="border-b border-border pb-4">
                    <h3 className="font-semibold text-foreground mb-3">Blockchain Details</h3>
                    <div className="text-sm">
                      <div className="mb-1">
                        <span className="text-muted-foreground">Transaction hash:</span>
                      </div>
                      <div className="font-mono text-xs break-all bg-muted p-2 rounded">
                        {transaction.transactionHash}
                      </div>
                    </div>
                  </div>
                )}

                {/* Total */}
                <div className="bg-muted/30 rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-foreground">Total Paid:</span>
                    <span className="text-xl font-bold text-brand-primary">
                      {formatAmount(transaction.gbpAmount + transaction.fees.totalFees)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="text-center text-xs text-muted-foreground space-y-1">
                <p>Thank you for using BridgePay</p>
                <p>For support, contact us at support@bridgepay.com</p>
                <p>© 2025 BridgePay. All rights reserved.</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Actions */}
        <div className="flex gap-3 max-w-md mx-auto">
          <Button
            variant="outline"
            onClick={handleDownload}
            className="flex-1 flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Download
          </Button>
          <Button
            variant="outline"
            onClick={handleShare}
            className="flex-1 flex items-center gap-2"
          >
            <Share className="h-4 w-4" />
            Share
          </Button>
        </div>
      </main>
    </div>
  );
}
