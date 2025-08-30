
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { mockUsers } from '@/data/mockData';
import { CheckCircle, XCircle, Clock, Eye } from 'lucide-react';
import AdminNavigation from '@/components/admin/AdminNavigation';

export default function AdminKYCPage() {
  const navigate = useNavigate();

  const kycApplications = mockUsers.filter(user => 
    user.kycStatus === 'under_review' || user.kycStatus === 'pending'
  );

  const pendingCount = {
    transactions: 0,
    kyc: kycApplications.length,
    notifications: 0
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'under_review':
        return { icon: Clock, color: 'text-brand-warning', bg: 'bg-brand-warning/10' };
      case 'pending':
        return { icon: Clock, color: 'text-muted-foreground', bg: 'bg-muted/50' };
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
                  const status = getStatusConfig(user.kycStatus);
                  const StatusIcon = status.icon;
                  
                  return (
                    <div key={user.id} className="border border-border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <p className="font-semibold text-foreground">
                            {user.firstName} {user.lastName}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {user.email}
                          </p>
                        </div>
                        <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${status.bg}`}>
                          <StatusIcon className={`h-4 w-4 ${status.color}`} />
                          <span className={`text-sm font-medium ${status.color}`}>
                            {user.kycStatus.replace('_', ' ')}
                          </span>
                        </div>
                      </div>
                      
                      <div className="text-sm text-muted-foreground mb-4">
                        <p>Submitted: {new Date(user.createdAt).toLocaleDateString()}</p>
                        {user.phone && <p>Phone: {user.phone}</p>}
                      </div>

                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="flex items-center gap-2">
                          <Eye className="h-4 w-4" />
                          Review Documents
                        </Button>
                        <Button size="sm" className="btn-primary flex items-center gap-2">
                          <CheckCircle className="h-4 w-4" />
                          Approve
                        </Button>
                        <Button size="sm" variant="outline" className="text-brand-error border-brand-error hover:bg-brand-error hover:text-white flex items-center gap-2">
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
                {mockUsers.filter(u => u.kycStatus === 'verified').length}
              </p>
              <p className="text-sm text-muted-foreground">Verified</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-2xl font-bold text-brand-error">
                {mockUsers.filter(u => u.kycStatus === 'rejected').length}
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
