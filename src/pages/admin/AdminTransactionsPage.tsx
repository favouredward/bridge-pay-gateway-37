
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { StatusBadge } from '@/components/ui/status-badge';
import { LoadingSkeleton } from '@/components/ui/loading-skeleton';
import { EmptyState } from '@/components/ui/empty-state';
import { Search, AlertTriangle, RefreshCw } from 'lucide-react';
import AdminNavigation from '@/components/admin/AdminNavigation';
import { useAdminData } from '@/hooks/useAdminData';

export default function AdminTransactionsPage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const { transactions, loading, error, refetch, stats, approveTransaction, rejectTransaction } = useAdminData();

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.payment_reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.wallet_address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || transaction.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const pendingCount = {
    transactions: stats.pendingTransactions,
    kyc: stats.pendingKYC,
    notifications: 0
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <AdminNavigation pendingCount={pendingCount} />
        <div className="px-4 lg:px-6 py-6">
          <LoadingSkeleton />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <AdminNavigation pendingCount={pendingCount} />
        <div className="px-4 lg:px-6 py-6">
          <div className="card-premium p-8 text-center space-y-4">
            <AlertTriangle className="h-12 w-12 text-destructive mx-auto" />
            <div>
              <h3 className="text-lg font-semibold text-foreground">Error Loading Transactions</h3>
              <p className="text-muted-foreground">{error}</p>
            </div>
            <Button onClick={refetch} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <AdminNavigation pendingCount={pendingCount} />
      
      <div className="px-4 lg:px-6 py-6">
        {/* Page Header */}
        <div className="mb-6">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-brand-primary">Transaction Management</h1>
            <p className="text-sm text-muted-foreground">
              Review and manage all transactions
            </p>
          </div>
        </div>

        <main className="space-y-6">
        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by reference or wallet address..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="payment_received">Payment Received</SelectItem>
                  <SelectItem value="usdt_sent">USDT Sent</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Transactions Table */}
        <Card>
          <CardHeader>
            <CardTitle>
              Transactions ({filteredTransactions.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredTransactions.map((transaction) => (
                <div key={transaction.id} className="border border-border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="font-semibold text-foreground">
                        £{transaction.gbp_amount} → {transaction.usdt_amount} USDT
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {transaction.payment_reference}
                      </p>
                    </div>
                    <StatusBadge status={transaction.status as any} />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Wallet:</span>{' '}
                      <span className="font-mono">
                        {transaction.wallet_address.slice(0, 8)}...{transaction.wallet_address.slice(-6)}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Created:</span>{' '}
                      {new Date(transaction.created_at).toLocaleDateString()}
                    </div>
                  </div>

                  <div className="flex gap-2 mt-4">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => navigate(`/admin/transactions/${transaction.id}`)}
                    >
                      View Details
                    </Button>
                    {transaction.status === 'pending' && (
                      <Button 
                        size="sm" 
                        className="btn-primary"
                        onClick={() => approveTransaction(transaction.id)}
                      >
                        Approve Transaction
                      </Button>
                    )}
                    {transaction.status === 'payment_received' && (
                      <Button 
                        size="sm" 
                        className="btn-secondary"
                        onClick={() => approveTransaction(transaction.id)}
                      >
                        Send USDT
                      </Button>
                    )}
                    {(transaction.status === 'pending' || transaction.status === 'payment_received') && (
                      <Button 
                        size="sm" 
                        variant="destructive"
                        onClick={() => rejectTransaction(transaction.id, 'Rejected by admin')}
                      >
                        Reject
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        </main>
      </div>
    </div>
  );
}
