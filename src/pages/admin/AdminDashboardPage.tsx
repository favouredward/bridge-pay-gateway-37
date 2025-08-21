
import { useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { mockTransactions, mockUsers, mockAdminStats } from '@/data/mockData';
import { 
  Users, 
  CreditCard, 
  Clock, 
  CheckCircle, 
  TrendingUp,
  AlertTriangle,
  LogOut,
  Bell,
  Eye,
  Trash2,
  UserCheck,
  UserX
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export default function AdminDashboardPage() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [notifications] = useState([
    {
      id: 1,
      type: 'payment',
      message: 'New payment received: £200 from John Doe',
      time: '2 minutes ago',
      urgent: true
    },
    {
      id: 2,
      type: 'kyc',
      message: 'KYC document submitted by Jane Smith',
      time: '15 minutes ago',
      urgent: false
    }
  ]);

  const stats = mockAdminStats;
  const pendingTransactions = mockTransactions.filter(tx => tx.status === 'pending');
  const pendingKYC = mockUsers.filter(u => u.kycStatus === 'under_review');
  const totalUsers = mockUsers.filter(u => u.role === 'user').length;

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const handleApproveTransaction = (transactionId: string) => {
    toast.success('Transaction approved successfully');
    console.log('Approving transaction:', transactionId);
  };

  const handleDeleteUser = (userId: string) => {
    toast.success('User deleted successfully');
    console.log('Deleting user:', userId);
  };

  const handleKYCAction = (userId: string, action: 'approve' | 'reject') => {
    toast.success(`KYC ${action}d successfully`);
    console.log(`${action}ing KYC for user:`, userId);
  };

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
          <div className="flex items-center gap-4">
            {/* Notifications */}
            <div className="relative">
              <Button variant="outline" size="sm" className="relative">
                <Bell className="h-4 w-4" />
                {notifications.some(n => n.urgent) && (
                  <Badge className="absolute -top-2 -right-2 bg-brand-error text-white text-xs">
                    {notifications.filter(n => n.urgent).length}
                  </Badge>
                )}
              </Button>
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
        </div>
      </header>

      <main className="container-padding py-6 space-y-6">
        {/* Real-time Notifications */}
        <Card className="border-brand-warning">
          <CardHeader>
            <CardTitle className="text-brand-warning flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Urgent Notifications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {notifications.map((notification) => (
                <div key={notification.id} className="flex justify-between items-start p-3 border border-border rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {notification.message}
                    </p>
                    <p className="text-xs text-muted-foreground">{notification.time}</p>
                  </div>
                  <Badge variant={notification.urgent ? "destructive" : "secondary"}>
                    {notification.type}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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
                    Total Users
                  </p>
                  <p className="text-2xl font-bold text-brand-primary">
                    {totalUsers}
                  </p>
                </div>
                <Users className="h-8 w-8 text-brand-primary" />
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
                <TrendingUp className="h-8 w-8 text-brand-success" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Pending Transactions - Admin Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Pending Transactions Requiring Approval</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pendingTransactions.length > 0 ? (
                pendingTransactions.map((transaction) => (
                  <div key={transaction.id} className="border border-border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className="font-semibold text-foreground">
                          £{transaction.gbpAmount} → {transaction.usdtAmount} USDT
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Ref: {transaction.paymentReference}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          User ID: {transaction.userId}
                        </p>
                      </div>
                      <Badge variant="outline" className="text-brand-warning border-brand-warning">
                        Awaiting Payment Confirmation
                      </Badge>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        className="btn-primary"
                        onClick={() => handleApproveTransaction(transaction.id)}
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Confirm Payment Received
                      </Button>
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4 mr-1" />
                        View Details
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-muted-foreground py-4">
                  No pending transactions
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* KYC Management */}
        <Card>
          <CardHeader>
            <CardTitle>KYC Documents Pending Review</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pendingKYC.length > 0 ? (
                pendingKYC.map((user) => (
                  <div key={user.id} className="border border-border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className="font-semibold text-foreground">
                          {user.firstName} {user.lastName}
                        </p>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                      </div>
                      <Badge variant="outline" className="text-brand-warning border-brand-warning">
                        Under Review
                      </Badge>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4 mr-1" />
                        View Documents
                      </Button>
                      <Button 
                        size="sm" 
                        className="btn-primary"
                        onClick={() => handleKYCAction(user.id, 'approve')}
                      >
                        <UserCheck className="h-4 w-4 mr-1" />
                        Approve
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="text-brand-error border-brand-error hover:bg-brand-error hover:text-white"
                        onClick={() => handleKYCAction(user.id, 'reject')}
                      >
                        <UserX className="h-4 w-4 mr-1" />
                        Reject
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-muted-foreground py-4">
                  No pending KYC reviews
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* User Management Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>User Management</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockUsers.filter(u => u.role === 'user').slice(0, 3).map((user) => (
                <div key={user.id} className="flex justify-between items-center p-3 border border-border rounded-lg">
                  <div>
                    <p className="font-medium text-foreground">
                      {user.firstName} {user.lastName}
                    </p>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={user.kycStatus === 'verified' ? 'default' : 'secondary'}>
                      {user.kycStatus}
                    </Badge>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-brand-error border-brand-error hover:bg-brand-error hover:text-white"
                      onClick={() => handleDeleteUser(user.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            <div className="pt-4">
              <Button variant="outline" onClick={() => navigate('/admin/users')} className="w-full">
                View All Users
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Quick Navigation */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button 
            variant="outline" 
            onClick={() => navigate('/admin/transactions')}
            className="p-6 h-auto"
          >
            <div className="text-center">
              <CreditCard className="h-8 w-8 mx-auto mb-2 text-brand-primary" />
              <p className="font-semibold">All Transactions</p>
              <p className="text-sm text-muted-foreground">Manage all transactions</p>
            </div>
          </Button>
          
          <Button 
            variant="outline" 
            onClick={() => navigate('/admin/kyc')}
            className="p-6 h-auto"
          >
            <div className="text-center">
              <Users className="h-8 w-8 mx-auto mb-2 text-brand-secondary" />
              <p className="font-semibold">KYC Reviews</p>
              <p className="text-sm text-muted-foreground">Review KYC documents</p>
            </div>
          </Button>
          
          <Button 
            variant="outline" 
            onClick={() => navigate('/admin/users')}
            className="p-6 h-auto"
          >
            <div className="text-center">
              <Users className="h-8 w-8 mx-auto mb-2 text-brand-primary" />
              <p className="font-semibold">User Management</p>
              <p className="text-sm text-muted-foreground">Manage all users</p>
            </div>
          </Button>
        </div>
      </main>
    </div>
  );
}
