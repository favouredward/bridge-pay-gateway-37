
import { useAuthStore } from '@/store/authStore';
import { TopNavigation } from '@/components/layout/TopNavigation';
import { BottomNavigation } from '@/components/layout/BottomNavigation';
import { ExchangeRateCard } from '@/components/exchange/ExchangeRateCard';
import { TransactionCard } from '@/components/transactions/TransactionCard';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { LoadingSkeleton } from '@/components/ui/loading-skeleton';
import { useUserData } from '@/hooks/useUserData';
import { AlertTriangle, RefreshCw, ArrowRight, TrendingUp, DollarSign, Activity, Clock, Send, History, CreditCard, ArrowUpRight, CheckCircle2, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

const quickActions = [
  {
    icon: Send,
    label: 'Send Money',
    description: 'GBP → USDT Transfer',
    href: '/send',
    gradient: 'from-blue-500 to-blue-600',
    hoverGradient: 'hover:from-blue-600 hover:to-blue-700',
  },
  {
    icon: History,
    label: 'Transaction History',
    description: 'View all transactions',
    href: '/history',
    gradient: 'from-emerald-500 to-emerald-600',
    hoverGradient: 'hover:from-emerald-600 hover:to-emerald-700',
  },
  {
    icon: CreditCard,
    label: 'KYC Verification',
    description: 'Complete verification',
    href: '/kyc',
    gradient: 'from-purple-500 to-purple-600',
    hoverGradient: 'hover:from-purple-600 hover:to-purple-700',
  },
];

const getKYCStatusConfig = (status: string) => {
  switch (status) {
    case 'verified':
      return {
        icon: CheckCircle2,
        title: 'Account Verified',
        description: 'Your account is fully verified and ready to use',
        bgColor: 'from-emerald-500/10 to-emerald-600/5',
        borderColor: 'border-emerald-500/20',
        textColor: 'text-emerald-600',
        buttonVariant: 'ghost' as const,
        buttonText: 'View Profile',
        href: '/profile',
      };
    case 'under_review':
      return {
        icon: Clock,
        title: 'Verification Under Review',
        description: 'We\'re reviewing your documents. This usually takes 24-48 hours.',
        bgColor: 'from-blue-500/10 to-blue-600/5',
        borderColor: 'border-blue-500/20',
        textColor: 'text-blue-600',
        buttonVariant: 'ghost' as const,
        buttonText: 'Check Status',
        href: '/kyc',
      };
    case 'rejected':
      return {
        icon: AlertCircle,
        title: 'Verification Required',
        description: 'Please resubmit your documents for verification',
        bgColor: 'from-red-500/10 to-red-600/5',
        borderColor: 'border-red-500/20',
        textColor: 'text-red-600',
        buttonVariant: 'default' as const,
        buttonText: 'Resubmit Documents',
        href: '/kyc',
      };
    default:
      return {
        icon: AlertCircle,
        title: 'Complete Your Verification',
        description: 'Verify your identity to start sending money securely',
        bgColor: 'from-orange-500/10 to-orange-600/5',
        borderColor: 'border-orange-500/20',
        textColor: 'text-orange-600',
        buttonVariant: 'default' as const,
        buttonText: 'Start Verification',
        href: '/kyc',
      };
  }
};

export default function DashboardPage() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const {
    transactions,
    stats,
    loading,
    error,
    refetch,
  } = useUserData();

  const kycConfig = getKYCStatusConfig(user?.kycStatus || 'pending');
  const StatusIcon = kycConfig.icon;

  // Get recent transactions for display
  const userTransactions = transactions.slice(0, 3);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <TopNavigation />
        <main className="container mx-auto px-4 py-8 space-y-8 max-w-7xl">
          <LoadingSkeleton />
        </main>
        {isMobile && <BottomNavigation />}
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <TopNavigation />
        <main className="container mx-auto px-4 py-8 space-y-8 max-w-7xl">
          <div className="card-premium p-8 text-center space-y-4">
            <AlertTriangle className="h-12 w-12 text-destructive mx-auto" />
            <div>
              <h3 className="text-lg font-semibold text-foreground">Error Loading Dashboard</h3>
              <p className="text-muted-foreground">{error}</p>
            </div>
            <Button onClick={refetch} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </div>
        </main>
        {isMobile && <BottomNavigation />}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <TopNavigation />
      
      <main className="container mx-auto px-4 py-8 space-y-8 max-w-7xl">
        {/* Welcome Section - More compact on mobile */}
        <div className="animate-fade-in">
          <h1 className={cn(
            "font-bold text-foreground mb-2",
            isMobile ? "text-2xl" : "text-3xl"
          )}>
            {isMobile ? `Hi, ${user?.firstName}! 👋` : `Welcome back, ${user?.firstName}! 👋`}
          </h1>
          <p className="text-muted-foreground text-base md:text-lg">
            Ready to send money around the world?
          </p>
        </div>

        {/* KYC Status Alert */}
        {user?.kycStatus !== 'verified' && (
          <div className={`card-premium p-4 md:p-6 border-l-4 ${kycConfig.borderColor} bg-gradient-to-r ${kycConfig.bgColor} animate-slide-up`}>
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3 md:gap-4 flex-1">
                <div className={`p-2 rounded-xl bg-gradient-to-r ${kycConfig.bgColor} flex-shrink-0`}>
                  <StatusIcon className={`h-5 w-5 md:h-6 md:w-6 ${kycConfig.textColor}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-foreground text-base md:text-lg mb-1">{kycConfig.title}</h3>
                  <p className="text-muted-foreground text-sm md:text-base">{kycConfig.description}</p>
                </div>
              </div>
              <Button 
                variant={kycConfig.buttonVariant}
                size="sm"
                onClick={() => navigate(kycConfig.href)}
                className="font-semibold flex-shrink-0"
              >
                {kycConfig.buttonText}
              </Button>
            </div>
          </div>
        )}

        {/* Stats Overview - Responsive grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 animate-slide-up">
          <div className="stat-card">
            <div className="flex items-center gap-2 md:gap-3 mb-2 md:mb-3">
              <div className="p-1.5 md:p-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg md:rounded-xl">
                <DollarSign className="h-4 w-4 md:h-5 md:w-5 text-white" />
              </div>
              <span className="text-xs md:text-sm text-muted-foreground font-medium">Total Sent</span>
            </div>
            <p className="text-lg md:text-2xl font-bold text-foreground">
              £{stats.totalSent.toLocaleString()}
            </p>
          </div>

          <div className="stat-card">
            <div className="flex items-center gap-2 md:gap-3 mb-2 md:mb-3">
              <div className="p-1.5 md:p-2 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-lg md:rounded-xl">
                <CheckCircle2 className="h-4 w-4 md:h-5 md:w-5 text-white" />
              </div>
              <span className="text-xs md:text-sm text-muted-foreground font-medium">Completed</span>
            </div>
            <p className="text-lg md:text-2xl font-bold text-foreground">{stats.completedTransactions}</p>
          </div>

          <div className="stat-card">
            <div className="flex items-center gap-2 md:gap-3 mb-2 md:mb-3">
              <div className="p-1.5 md:p-2 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg md:rounded-xl">
                <Clock className="h-4 w-4 md:h-5 md:w-5 text-white" />
              </div>
              <span className="text-xs md:text-sm text-muted-foreground font-medium">Pending</span>
            </div>
            <p className="text-lg md:text-2xl font-bold text-foreground">{stats.pendingTransactions}</p>
          </div>

          <div className="stat-card">
            <div className="flex items-center gap-2 md:gap-3 mb-2 md:mb-3">
              <div className="p-1.5 md:p-2 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg md:rounded-xl">
                <TrendingUp className="h-4 w-4 md:h-5 md:w-5 text-white" />
              </div>
              <span className="text-xs md:text-sm text-muted-foreground font-medium">This Month</span>
            </div>
            <p className="text-lg md:text-2xl font-bold text-foreground">{stats.thisMonthTransactions}</p>
          </div>
        </div>

        {/* Exchange Rate */}
        <div className="animate-slide-up">
          <ExchangeRateCard />
        </div>

        {/* Quick Actions */}
        <div className="animate-slide-up">
          <div className="flex items-center justify-between mb-4 md:mb-6">
            <h2 className="text-xl md:text-2xl font-bold text-foreground">Quick Actions</h2>
            <div className="h-1 flex-1 mx-4 bg-gradient-to-r from-brand-primary to-brand-secondary rounded-full opacity-20"></div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <button
                  key={index}
                  onClick={() => navigate(action.href)}
                  className={`group card-interactive p-4 md:p-6 text-left space-y-3 md:space-y-4 bg-gradient-to-br ${action.gradient}/5 hover:${action.gradient}/10 border-2 border-transparent hover:border-current transition-all duration-300`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className={`inline-flex p-3 md:p-4 bg-gradient-to-r ${action.gradient} ${action.hoverGradient} rounded-xl md:rounded-2xl shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300`}>
                    <Icon className="h-6 w-6 md:h-7 md:w-7 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground text-base md:text-lg group-hover:text-brand-primary transition-colors">{action.label}</h3>
                    <p className="text-muted-foreground text-sm md:text-base">{action.description}</p>
                  </div>
                  <ArrowUpRight className="h-4 w-4 md:h-5 md:w-5 text-muted-foreground group-hover:text-brand-primary group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300" />
                </button>
              );
            })}
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="animate-slide-up">
          <div className="flex items-center justify-between mb-4 md:mb-6">
            <h2 className="text-xl md:text-2xl font-bold text-foreground">Recent Transactions</h2>
            <Button 
              variant="ghost" 
              onClick={() => navigate('/history')}
              className="font-semibold hover:bg-brand-primary/10 hover:text-brand-primary text-sm"
            >
              View All
              <ArrowUpRight className="ml-1 h-4 w-4" />
            </Button>
          </div>

          {userTransactions.length > 0 ? (
            <div className="space-y-3 md:space-y-4">
              {userTransactions.map((transaction, index) => (
                <div 
                  key={transaction.id} 
                  className="animate-slide-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <TransactionCard
                    transaction={transaction}
                    onClick={() => navigate(`/transaction/${transaction.id}`)}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="card-premium p-8 md:p-12">
              <EmptyState
                icon={History}
                title="No transactions yet"
                description="Start by sending your first GBP to USDT transfer and build your transaction history"
                actionLabel="Send Money Now"
                onAction={() => navigate('/send')}
              />
            </div>
          )}
        </div>

        {/* Performance Insights */}
        {userTransactions.length > 0 && (
          <div className="card-gradient p-6 md:p-8 animate-slide-up">
            <h3 className="text-lg md:text-xl font-bold text-foreground mb-4 md:mb-6 flex items-center gap-3">
              <TrendingUp className="h-5 w-5 md:h-6 md:w-6 text-brand-secondary" />
              Your Performance
            </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-bold gradient-text mb-2">
                    {stats.successRate.toFixed(0)}%
                  </div>
                  <div className="text-muted-foreground font-medium text-sm md:text-base">Success Rate</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-bold gradient-text mb-2">
                    £{stats.averageTransfer.toLocaleString()}
                  </div>
                  <div className="text-muted-foreground font-medium text-sm md:text-base">Average Transfer</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-bold gradient-text mb-2">
                    {stats.thisMonthTransactions}
                  </div>
                  <div className="text-muted-foreground font-medium text-sm md:text-base">This Month</div>
                </div>
              </div>
          </div>
        )}
      </main>

      {/* Only show bottom navigation on mobile */}
      {isMobile && <BottomNavigation />}
    </div>
  );
}
