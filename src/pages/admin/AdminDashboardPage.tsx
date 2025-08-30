
import { useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { mockTransactions, mockUsers, mockAdminStats } from '@/data/mockData';
import { 
  CheckCircle, 
  Eye,
  Trash2,
  UserCheck,
  UserX,
  Clock,
  AlertTriangle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AdminNavigation from '@/components/admin/AdminNavigation';
import AdminStatsGrid from '@/components/admin/AdminStatsGrid';
import { useAdminActions } from '@/hooks/useAdminActions';
import { useNotificationStore } from '@/store/notificationStore';
import { CreateNotificationDialog } from '@/components/admin/CreateNotificationDialog';
import { UserManagementDialog } from '@/components/admin/UserManagementDialog';
import { SendNotificationDialog } from '@/components/admin/SendNotificationDialog';

export default function AdminDashboardPage() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const { addNotification } = useNotificationStore();
  
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
  const completedTransactions = mockTransactions.filter(tx => tx.status === 'completed' || tx.status === 'usdt_sent').length;
  const pendingKYC = mockUsers.filter(u => u.kycStatus === 'under_review');
  const totalUsers = mockUsers.filter(u => u.role === 'user').length;

  const pendingCount = {
    transactions: pendingTransactions.length,
    kyc: pendingKYC.length,
    notifications: notifications.filter(n => n.urgent).length
  };

  const {
    isProcessing,
    handleApproveTransaction,
    handleKYCAction,
    handleDeleteUser,
    handleViewDetails
  } = useAdminActions();

  return (
    <div className="min-h-screen bg-background">
      <AdminNavigation pendingCount={pendingCount} />
      
      {/* Main Content */}
      <div className="px-4 lg:px-6 py-6">
        {/* Page Header */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-brand-primary">Dashboard</h1>
              <p className="text-sm text-muted-foreground">
                Welcome back, {user?.firstName}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="hidden sm:inline-flex">
                {pendingCount.transactions + pendingCount.kyc} items need attention
              </Badge>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <main className="space-y-6">

          {/* Urgent Notifications */}
          {notifications.some(n => n.urgent) && (
            <Card className="border-brand-warning bg-brand-warning/5">
              <CardHeader className="pb-3">
                <CardTitle className="text-brand-warning flex items-center gap-2 text-base sm:text-lg">
                  <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5" />
                  Urgent Notifications
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {notifications.filter(n => n.urgent).map((notification) => (
                    <div key={notification.id} className="flex flex-col gap-2 p-3 border border-border rounded-lg bg-background">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-foreground">
                          {notification.message}
                        </p>
                        <div className="flex items-center justify-between mt-2">
                          <p className="text-xs text-muted-foreground">{notification.time}</p>
                          <Badge variant="destructive" className="text-xs">
                            {notification.type}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Stats Grid */}
          <AdminStatsGrid 
            stats={stats} 
            totalUsers={totalUsers} 
            completedTransactions={completedTransactions}
          />

          {/* Pending Transactions */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <CardTitle className="text-base sm:text-lg">Pending Transactions</CardTitle>
                <Badge variant="outline" className="w-fit text-xs">
                  {pendingTransactions.length} pending
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 sm:space-y-4">
                {pendingTransactions.length > 0 ? (
                  pendingTransactions.slice(0, 5).map((transaction) => (
                    <div key={transaction.id} className="border border-border rounded-lg p-3 sm:p-4">
                      <div className="flex flex-col gap-3 sm:gap-4">
                        <div className="flex-1 space-y-2">
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                            <p className="font-semibold text-foreground text-sm sm:text-base">
                              £{transaction.gbpAmount} → {transaction.usdtAmount} USDT
                            </p>
                            <Badge variant="outline" className="text-brand-warning border-brand-warning w-fit text-xs">
                              <Clock className="h-3 w-3 mr-1" />
                              Pending
                            </Badge>
                          </div>
                          <div className="text-xs sm:text-sm text-muted-foreground space-y-1">
                            <p>Ref: {transaction.paymentReference}</p>
                            <p>User ID: {transaction.userId}</p>
                            <p className="break-all">Wallet: {transaction.walletAddress}</p>
                          </div>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row gap-2">
                          <Button 
                            size="sm" 
                            className="btn-primary text-xs sm:text-sm"
                            disabled={isProcessing}
                            onClick={() => handleApproveTransaction(transaction.id)}
                          >
                            <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                            Approve
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            className="text-xs sm:text-sm"
                            onClick={() => handleViewDetails('transaction', transaction.id)}
                          >
                            <Eye className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                            Details
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6 sm:py-8">
                    <CheckCircle className="h-10 w-10 sm:h-12 sm:w-12 mx-auto text-brand-success mb-3" />
                    <p className="text-muted-foreground text-sm">No pending transactions</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Pending KYC */}
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <CardTitle className="text-base sm:text-lg">KYC Documents Pending Review</CardTitle>
                <Badge variant="outline" className="w-fit text-xs">
                  {pendingKYC.length} pending
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pendingKYC.length > 0 ? (
                  pendingKYC.slice(0, 3).map((user) => (
                    <div key={user.id} className="border border-border rounded-lg p-3 sm:p-4">
                      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        <div className="flex-1 space-y-2">
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                            <p className="font-semibold text-foreground text-sm sm:text-base">
                              {user.firstName} {user.lastName}
                            </p>
                            <Badge variant="outline" className="text-brand-warning border-brand-warning w-fit text-xs">
                              Under Review
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                        </div>
                        
                        <div className="flex flex-wrap gap-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            className="text-xs"
                            onClick={() => handleViewDetails('kyc', user.id)}
                          >
                            <Eye className="h-3 w-3 mr-1" />
                            Documents
                          </Button>
                          <Button 
                            size="sm" 
                            className="btn-primary text-xs"
                            disabled={isProcessing}
                            onClick={() => handleKYCAction(user.id, 'approve')}
                          >
                            <UserCheck className="h-3 w-3 mr-1" />
                            Approve
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            className="text-brand-error border-brand-error hover:bg-brand-error hover:text-white text-xs"
                            disabled={isProcessing}
                            onClick={() => handleKYCAction(user.id, 'reject')}
                          >
                            <UserX className="h-3 w-3 mr-1" />
                            Reject
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6 sm:py-8">
                    <CheckCircle className="h-10 w-10 sm:h-12 sm:w-12 mx-auto text-brand-success mb-3" />
                    <p className="text-muted-foreground text-sm">No pending KYC reviews</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Recent Users */}
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <CardTitle className="text-base sm:text-lg">Recent Users</CardTitle>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="w-fit text-xs"
                  onClick={() => navigate('/admin/users')}
                >
                  View All Users
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 sm:space-y-4">
                {mockUsers.filter(u => u.role === 'user').slice(0, 3).map((user) => (
                  <div key={user.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 p-3 border border-border rounded-lg">
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                        <p className="font-medium text-foreground text-sm sm:text-base">
                          {user.firstName} {user.lastName}
                        </p>
                        <Badge variant={user.kycStatus === 'verified' ? 'default' : 'secondary'} className="w-fit text-xs">
                          {user.kycStatus}
                        </Badge>
                      </div>
                      <p className="text-xs sm:text-sm text-muted-foreground">{user.email}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-xs p-2"
                        onClick={() => handleViewDetails('user', user.id)}
                      >
                        <Eye className="h-3 w-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-brand-error border-brand-error hover:bg-brand-error hover:text-white text-xs p-2"
                        disabled={isProcessing}
                        onClick={() => handleDeleteUser(user.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
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
