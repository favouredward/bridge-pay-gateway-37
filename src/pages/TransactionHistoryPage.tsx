
import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { BottomNavigation } from '@/components/layout/BottomNavigation';
import { TransactionCard } from '@/components/transactions/TransactionCard';
import { EmptyState } from '@/components/ui/empty-state';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuthStore } from '@/store/authStore';
import { mockTransactions } from '@/data/mockData';
import { Transaction, TransactionFilters } from '@/types';
import { History, Search, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function TransactionHistoryPage() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [filters, setFilters] = useState<TransactionFilters>({
    status: 'all',
    search: '',
  });
  const [showFilters, setShowFilters] = useState(false);

  // Get user's transactions
  const userTransactions = mockTransactions.filter(tx => tx.userId === user?.id);

  // Apply filters
  const filteredTransactions = userTransactions.filter(transaction => {
    // Status filter
    if (filters.status && filters.status !== 'all' && transaction.status !== filters.status) {
      return false;
    }

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      return (
        transaction.paymentReference.toLowerCase().includes(searchLower) ||
        transaction.walletAddress.toLowerCase().includes(searchLower) ||
        transaction.transactionHash?.toLowerCase().includes(searchLower)
      );
    }

    return true;
  });

  const handleFilterChange = (key: keyof TransactionFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({ status: 'all', search: '' });
  };

  return (
    <div className="page-container mobile-safe-area">
      <Header title="Transaction History" />
      
      <main className="container-padding py-6 space-y-6">
        {/* Search and Filters */}
        <div className="space-y-4">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by reference, wallet, or hash..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="pl-10"
              />
            </div>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2"
            >
              <Filter className="h-4 w-4" />
              Filters
            </Button>
          </div>

          {showFilters && (
            <div className="card-primary p-4 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Status</label>
                  <Select
                    value={filters.status || 'all'}
                    onValueChange={(value) => handleFilterChange('status', value)}
                  >
                    <SelectTrigger>
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
              </div>

              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={clearFilters}>
                  Clear Filters
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Transaction List */}
        {filteredTransactions.length > 0 ? (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <p className="text-sm text-muted-foreground">
                {filteredTransactions.length} transaction{filteredTransactions.length !== 1 ? 's' : ''} found
              </p>
            </div>

            <div className="space-y-3">
              {filteredTransactions.map((transaction) => (
                <TransactionCard
                  key={transaction.id}
                  transaction={transaction}
                  onClick={() => navigate(`/transaction/${transaction.id}`)}
                />
              ))}
            </div>
          </div>
        ) : (
          <EmptyState
            icon={History}
            title={filters.search || filters.status !== 'all' 
              ? "No transactions found" 
              : "No transactions yet"
            }
            description={filters.search || filters.status !== 'all'
              ? "Try adjusting your search or filters"
              : "Start by sending your first GBP to USDT transfer"
            }
            actionLabel={filters.search || filters.status !== 'all' 
              ? "Clear Filters" 
              : "Send Money"
            }
            onAction={filters.search || filters.status !== 'all' 
              ? clearFilters 
              : () => navigate('/send')
            }
          />
        )}

        {/* Summary Stats */}
        {userTransactions.length > 0 && (
          <div className="grid grid-cols-2 gap-4">
            <div className="card-primary p-4 text-center">
              <p className="text-lg font-bold text-foreground">
                {userTransactions.length}
              </p>
              <p className="text-sm text-muted-foreground">Total Transactions</p>
            </div>
            <div className="card-primary p-4 text-center">
              <p className="text-lg font-bold text-brand-primary">
                £{userTransactions.reduce((sum, tx) => sum + tx.gbpAmount, 0).toLocaleString()}
              </p>
              <p className="text-sm text-muted-foreground">Total Sent</p>
            </div>
          </div>
        )}
      </main>

      <BottomNavigation />
    </div>
  );
}
