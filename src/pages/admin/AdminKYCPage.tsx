
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LoadingSkeleton } from '@/components/ui/loading-skeleton';
import { EmptyState } from '@/components/ui/empty-state';
import { CheckCircle, XCircle, Clock, Eye, AlertTriangle, RefreshCw } from 'lucide-react';
import AdminNavigation from '@/components/admin/AdminNavigation';
import { useAdminData } from '@/hooks/useAdminData';

export default function AdminKYCPage() {
  const navigate = useNavigate();
  const { users, kycDocuments, loading, error, refetch, stats, approveKYC, rejectKYC } = useAdminData();

  const kycApplications = users.filter(user => 
    user.kyc_status === 'under_review' || user.kyc_status === 'pending'
  );

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
              <h3 className="text-lg font-semibold text-foreground">Error Loading KYC Data</h3>
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

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'under_review':
        return { icon: Clock, color: 'text-brand-warning', bg: 'bg-brand-warning/10' };
      case 'pending':
        return { icon: Clock, color: 'text-muted-foreground', bg: 'bg-muted/50' };
      case 'verified':
        return { icon: CheckCircle, color: 'text-brand-success', bg: 'bg-brand-success/10' };
      case 'rejected':
        return { icon: XCircle, color: 'text-brand-error', bg: 'bg-brand-error/10' };
      default:
        return { icon: Clock, color: 'text-muted-foreground', bg: 'bg-muted/50' };
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <AdminNavigation pendingCount={pendingCount} />
      
      <div className="px-4 lg:px-6 py-6">
        {/* Page Header */}
        <div className="mb-6">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-brand-primary">KYC Management</h1>
            <p className="text-sm text-muted-foreground">
              Review KYC applications and documents
            </p>
          </div>
        </div>

        <main className="space-y-6">
        {/* KYC Applications */}
        <Card>
          <CardHeader>
            <CardTitle>
              Pending KYC Applications ({kycApplications.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {kycApplications.length > 0 ? (
                kycApplications.map((user) => {
                  const status = getStatusConfig(user.kyc_status);
                  const StatusIcon = status.icon;
                  
                  return (
                    <div key={user.id} className="border border-border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <p className="font-semibold text-foreground">
                            {user.first_name} {user.last_name}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {user.user_id}
                          </p>
                        </div>
                        <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${status.bg}`}>
                          <StatusIcon className={`h-4 w-4 ${status.color}`} />
                          <span className={`text-sm font-medium ${status.color}`}>
                            {user.kyc_status.replace('_', ' ')}
                          </span>
                        </div>
                      </div>
                      
                      <div className="text-sm text-muted-foreground mb-4">
                        <p>Submitted: {new Date(user.created_at).toLocaleDateString()}</p>
                        {user.phone && <p>Phone: {user.phone}</p>}
                      </div>

                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="flex items-center gap-2"
                          onClick={() => navigate(`/admin/users/${user.id}`)}
                        >
                          <Eye className="h-4 w-4" />
                          Review Documents
                        </Button>
                        <Button 
                          size="sm" 
                          className="btn-primary flex items-center gap-2"
                          onClick={() => approveKYC(user.id)}
                        >
                          <CheckCircle className="h-4 w-4" />
                          Approve
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="text-brand-error border-brand-error hover:bg-brand-error hover:text-white flex items-center gap-2"
                          onClick={() => rejectKYC(user.id, 'Documents insufficient')}
                        >
                          <XCircle className="h-4 w-4" />
                          Reject
                        </Button>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No pending KYC applications</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* KYC Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-2xl font-bold text-brand-warning">
                {kycApplications.length}
              </p>
              <p className="text-sm text-muted-foreground">Pending Review</p>
            </CardContent>
          </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-2xl font-bold text-brand-success">
                  {users.filter(u => u.kyc_status === 'verified').length}
                </p>
                <p className="text-sm text-muted-foreground">Verified</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-2xl font-bold text-brand-error">
                  {users.filter(u => u.kyc_status === 'rejected').length}
                </p>
                <p className="text-sm text-muted-foreground">Rejected</p>
              </CardContent>
            </Card>
        </div>
        </main>
      </div>
    </div>
  );
}
