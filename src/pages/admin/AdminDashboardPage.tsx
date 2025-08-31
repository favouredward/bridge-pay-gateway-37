
import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LoadingSkeleton } from '@/components/ui/loading-skeleton';
import { 
  CheckCircle, 
  Eye,
  Trash2,
  UserCheck,
  UserX,
  Clock,
  AlertTriangle,
  RefreshCw
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AdminNavigation from '@/components/admin/AdminNavigation';
import AdminStatsGrid from '@/components/admin/AdminStatsGrid';
import { useNotificationStore } from '@/store/notificationStore';
import { useAdminData } from '@/hooks/useAdminData';

export default function AdminDashboardPage() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const { addNotification } = useNotificationStore();
  
  const {
    stats,
    transactions,
    users,
    kycDocuments,
    loading,
    error,
    refetch,
    approveTransaction,
    rejectTransaction,
    approveKYC,
    rejectKYC,
  } = useAdminData();

  const [processingIds, setProcessingIds] = useState<Set<string>>(new Set());
  
  // Mock urgent notifications (you can replace with real notification system)
  const [notifications] = useState([
    {
      id: 1,
      type: 'payment',
      message: 'System monitoring active',
      time: 'Real-time',
      urgent: false
    }
  ]);

  const pendingTransactions = transactions.filter(tx => tx.status === 'pending');
  const pendingKYC = kycDocuments.filter(doc => doc.status === 'pending');
  const recentUsers = users.filter(u => u.role === 'user').slice(0, 5);

  const pendingCount = {
    transactions: pendingTransactions.length,
    kyc: pendingKYC.length,
    notifications: notifications.filter(n => n.urgent).length
  };

  const handleApproveTransaction = async (transactionId: string) => {
    setProcessingIds(prev => new Set([...prev, transactionId]));
    try {
      await approveTransaction(transactionId);
    } finally {
      setProcessingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(transactionId);
        return newSet;
      });
    }
  };

  const handleKYCAction = async (userId: string, action: 'approve' | 'reject') => {
    setProcessingIds(prev => new Set([...prev, userId]));
    try {
      if (action === 'approve') {
        await approveKYC(userId);
      } else {
        await rejectKYC(userId, 'Documents require resubmission');
      }
    } finally {
      setProcessingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(userId);
        return newSet;
      });
    }
  };

  const handleViewDetails = (type: 'transaction' | 'user' | 'kyc', id: string) => {
    if (type === 'transaction') {
      navigate(`/admin/transactions`);
    } else if (type === 'user') {
      navigate(`/admin/users`);
    } else if (type === 'kyc') {
      navigate(`/admin/kyc`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <AdminNavigation pendingCount={{ transactions: 0, kyc: 0, notifications: 0 }} />
        <div className="px-4 lg:px-6 py-6">
          <LoadingSkeleton />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <AdminNavigation pendingCount={{ transactions: 0, kyc: 0, notifications: 0 }} />
        <div className="px-4 lg:px-6 py-6">
          <Card className="border-destructive">
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
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
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

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
            stats={{
              totalTransactions: {
                today: Math.floor(stats.totalTransactions * 0.1),
                week: Math.floor(stats.totalTransactions * 0.7),
                month: stats.totalTransactions,
              },
              pendingTransactions: stats.pendingTransactions,
              pendingKYC: stats.pendingKYC,
              revenue: stats.revenue,
            }} 
            totalUsers={stats.totalUsers} 
            completedTransactions={stats.completedTransactions}
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
                              £{transaction.gbp_amount} → {transaction.usdt_amount} USDT
                            </p>
                            <Badge variant="outline" className="text-brand-warning border-brand-warning w-fit text-xs">
                              <Clock className="h-3 w-3 mr-1" />
                              Pending
                            </Badge>
                          </div>
                          <div className="text-xs sm:text-sm text-muted-foreground space-y-1">
                            <p>Ref: {transaction.payment_reference}</p>
                            <p>User: {transaction.user_profile ? `${transaction.user_profile.first_name} ${transaction.user_profile.last_name}` : 'Unknown'}</p>
                            <p className="break-all">Wallet: {transaction.wallet_address}</p>
                            <p>Created: {new Date(transaction.created_at).toLocaleDateString()}</p>
                          </div>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row gap-2">
                          <Button 
                            size="sm" 
                            className="btn-primary text-xs sm:text-sm"
                            disabled={processingIds.has(transaction.id)}
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
                  pendingKYC.slice(0, 3).map((document) => (
                    <div key={document.id} className="border border-border rounded-lg p-3 sm:p-4">
                      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        <div className="flex-1 space-y-2">
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                            <p className="font-semibold text-foreground text-sm sm:text-base">
                              {document.user_profile ? `${document.user_profile.first_name} ${document.user_profile.last_name}` : 'Unknown User'}
                            </p>
                            <Badge variant="outline" className="text-brand-warning border-brand-warning w-fit text-xs">
                              {document.document_type.toUpperCase()}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Submitted: {new Date(document.submitted_at).toLocaleDateString()}
                          </p>
                        </div>
                        
                        <div className="flex flex-wrap gap-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            className="text-xs"
                            onClick={() => handleViewDetails('kyc', document.id)}
                          >
                            <Eye className="h-3 w-3 mr-1" />
                            Documents
                          </Button>
                          <Button 
                            size="sm" 
                            className="btn-primary text-xs"
                            disabled={processingIds.has(document.user_id)}
                            onClick={() => handleKYCAction(document.user_id, 'approve')}
                          >
                            <UserCheck className="h-3 w-3 mr-1" />
                            Approve
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            className="text-brand-error border-brand-error hover:bg-brand-error hover:text-white text-xs"
                            disabled={processingIds.has(document.user_id)}
                            onClick={() => handleKYCAction(document.user_id, 'reject')}
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
                {recentUsers.map((user) => (
                  <div key={user.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 p-3 border border-border rounded-lg">
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                        <p className="font-medium text-foreground text-sm sm:text-base">
                          {user.first_name} {user.last_name}
                        </p>
                        <Badge variant={user.kyc_status === 'verified' ? 'default' : 'secondary'} className="w-fit text-xs">
                          {user.kyc_status}
                        </Badge>
                      </div>
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        Joined: {new Date(user.created_at).toLocaleDateString()}
                      </p>
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
