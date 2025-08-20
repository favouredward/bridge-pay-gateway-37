
import { useAuthStore } from '@/store/authStore';
import { Header } from '@/components/layout/Header';
import { BottomNavigation } from '@/components/layout/BottomNavigation';
import { ExchangeRateCard } from '@/components/exchange/ExchangeRateCard';
import { TransactionCard } from '@/components/transactions/TransactionCard';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { mockTransactions } from '@/data/mockData';
import { Send, History, CreditCard, ArrowUpRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const quickActions = [
  {
    icon: Send,
    label: 'Send Money',
    description: 'Send GBP, receive USDT',
    href: '/send',
    color: 'bg-brand-primary',
  },
  {
    icon: History,
    label: 'Transaction History',
    description: 'View all transactions',
    href: '/history',
    color: 'bg-brand-secondary',
  },
  {
    icon: CreditCard,
    label: 'KYC Verification',
    description: 'Verify your identity',
    href: '/kyc',
    color: 'bg-brand-success',
  },
];

export default function DashboardPage() {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  // Get user's recent transactions
  const userTransactions = mockTransactions
    .filter(tx => tx.userId === user?.id)
    .slice(0, 3);

  return (
    <div className="page-container mobile-safe-area">
      <Header />
      
      <main className="container-padding py-6 space-y-6">
        {/* KYC Status Alert */}
        {user?.kycStatus !== 'verified' && (
          <div className="card-primary p-4 border-l-4 border-l-brand-warning bg-brand-warning/5">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-semibold text-foreground">KYC Verification Required</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Complete your KYC verification to start sending money
                </p>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigate('/kyc')}
              >
                Verify Now
              </Button>
            </div>
          </div>
        )}

        {/* Exchange Rate */}
        <ExchangeRateCard />

        {/* Quick Actions */}
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <button
                  key={index}
                  onClick={() => navigate(action.href)}
                  className="card-interactive p-4 text-left space-y-3"
                >
                  <div className={`inline-flex p-3 ${action.color} rounded-lg`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{action.label}</h3>
                    <p className="text-sm text-muted-foreground">{action.description}</p>
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
                </button>
              );
            })}
          </div>
        </div>

        {/* Recent Transactions */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-foreground">Recent Transactions</h2>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate('/history')}
            >
              View All
            </Button>
          </div>

          {userTransactions.length > 0 ? (
            <div className="space-y-3">
              {userTransactions.map((transaction) => (
                <TransactionCard
                  key={transaction.id}
                  transaction={transaction}
                  onClick={() => navigate(`/transaction/${transaction.id}`)}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={History}
              title="No transactions yet"
              description="Start by sending your first GBP to USDT transfer"
              actionLabel="Send Money"
              onAction={() => navigate('/send')}
            />
          )}
        </div>

        {/* Statistics */}
        {userTransactions.length > 0 && (
          <div className="grid grid-cols-2 gap-4">
            <div className="card-primary p-4 text-center">
              <p className="text-2xl font-bold text-brand-primary">
                {userTransactions.length}
              </p>
              <p className="text-sm text-muted-foreground">Total Transactions</p>
            </div>
            <div className="card-primary p-4 text-center">
              <p className="text-2xl font-bold text-brand-success">
                £{userTransactions.reduce((sum, tx) => sum + tx.gbpAmount, 0).toLocaleString()}
              </p>
              <p className="text-sm text-muted-foreground">Amount Sent</p>
            </div>
          </div>
        )}
      </main>

      <BottomNavigation />
    </div>
  );
}
