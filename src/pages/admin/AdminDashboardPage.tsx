
import { useAuthStore } from '@/store/authStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { mockTransactions, mockUsers, mockAdminStats } from '@/data/mockData';
import { 
  Users, 
  CreditCard, 
  Clock, 
  CheckCircle, 
  TrendingUp,
  AlertTriangle,
  LogOut
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function AdminDashboardPage() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const stats = mockAdminStats;
  
  const pendingTransactions = mockTransactions.filter(tx => tx.status === 'pending').length;
  const pendingKYC = mockUsers.filter(u => u.kycStatus === 'under_review').length;
  const totalUsers = mockUsers.filter(u => u.role === 'user').length;

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const quickActions = [
    {
      title: 'Review Transactions',
      description: `${pendingTransactions} pending transactions`,
      href: '/admin/transactions',
      icon: CreditCard,
      color: 'bg-brand-warning',
    },
    {
      title: 'KYC Applications',
      description: `${pendingKYC} applications to review`,
      href: '/admin/kyc',
      icon: Users,
      color: 'bg-brand-secondary',
    },
    {
      title: 'User Management',
      description: `${totalUsers} total users`,
      href: '/admin/users',
      icon: Users,
      color: 'bg-brand-success',
    },
  ];

  return (
    <div className="page-container">
      {/* Header */}
      <header className="bg-card border-b border-border px-6 py-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-brand-primary">BridgePay Admin</h1>
            <p className="text-sm text-muted-foreground">
              Welcome back, {user?.firstName}
            </p>
          </div>
          <Button
            variant="outline"
            onClick={handleLogout}
            className="flex items-center gap-2"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      </header>

      <main className="container-padding py-6 space-y-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Transactions Today
                  </p>
                  <p className="text-2xl font-bold text-foreground">
                    {stats.totalTransactions.today}
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-brand-success" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Pending Transactions
                  </p>
                  <p className="text-2xl font-bold text-brand-warning">
                    {stats.pendingTransactions}
                  </p>
                </div>
                <Clock className="h-8 w-8 text-brand-warning" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Pending KYC
                  </p>
                  <p className="text-2xl font-bold text-brand-secondary">
                    {stats.pendingKYC}
                  </p>
                </div>
                <AlertTriangle className="h-8 w-8 text-brand-secondary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Revenue Today
                  </p>
                  <p className="text-2xl font-bold text-brand-success">
                    £{stats.revenue.today.toFixed(2)}
                  </p>
                </div>
                <CheckCircle className="h-8 w-8 text-brand-success" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <button
                  key={index}
                  onClick={() => navigate(action.href)}
                  className="card-interactive p-6 text-left space-y-4"
                >
                  <div className={`inline-flex p-3 ${action.color} rounded-lg`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{action.title}</h3>
                    <p className="text-sm text-muted-foreground">{action.description}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockTransactions.slice(0, 5).map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-foreground">
                      £{transaction.gbpAmount} → {transaction.usdtAmount} USDT
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {transaction.paymentReference}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                      transaction.status === 'completed' ? 'status-completed' :
                      transaction.status === 'pending' ? 'status-pending' :
                      'status-processing'
                    }`}>
                      {transaction.status.replace('_', ' ')}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(transaction.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* System Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>This Week</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Transactions:</span>
                <span className="font-medium">{stats.totalTransactions.week}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Revenue:</span>
                <span className="font-medium">£{stats.revenue.week.toFixed(2)}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>This Month</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Transactions:</span>
                <span className="font-medium">{stats.totalTransactions.month}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Revenue:</span>
                <span className="font-medium">£{stats.revenue.month.toFixed(2)}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
