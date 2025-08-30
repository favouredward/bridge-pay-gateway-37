
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { mockTransactions } from '@/data/mockData';
import { StatusBadge } from '@/components/ui/status-badge';
import { Search } from 'lucide-react';
import AdminNavigation from '@/components/admin/AdminNavigation';

export default function AdminTransactionsPage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredTransactions = mockTransactions.filter(transaction => {
    const matchesSearch = transaction.paymentReference.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.walletAddress.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || transaction.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const pendingCount = {
    transactions: mockTransactions.filter(tx => tx.status === 'pending').length,
    kyc: 0,
    notifications: 0
  };

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
                        £{transaction.gbpAmount} → {transaction.usdtAmount} USDT
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {transaction.paymentReference}
                      </p>
                    </div>
                    <StatusBadge status={transaction.status} />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Wallet:</span>{' '}
                      <span className="font-mono">
                        {transaction.walletAddress.slice(0, 8)}...{transaction.walletAddress.slice(-6)}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Created:</span>{' '}
                      {new Date(transaction.createdAt).toLocaleDateString()}
                    </div>
                  </div>

                  <div className="flex gap-2 mt-4">
                    <Button size="sm" variant="outline">
                      View Details
                    </Button>
                    {transaction.status === 'pending' && (
                      <Button size="sm" className="btn-primary">
                        Confirm Payment
                      </Button>
                    )}
                    {transaction.status === 'payment_received' && (
                      <Button size="sm" className="btn-secondary">
                        Send USDT
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
