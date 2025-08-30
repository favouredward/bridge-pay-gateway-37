
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { mockUsers } from '@/data/mockData';
import { Search, User } from 'lucide-react';
import AdminNavigation from '@/components/admin/AdminNavigation';

export default function AdminUsersPage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const users = mockUsers.filter(user => user.role === 'user');
  const filteredUsers = users.filter(user =>
    user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const pendingCount = {
    transactions: 0,
    kyc: users.filter(u => u.kycStatus === 'under_review').length,
    notifications: 0
  };

  const getKYCStatusConfig = (status: string) => {
    switch (status) {
      case 'verified':
        return { label: 'Verified', color: 'text-brand-success', bg: 'bg-brand-success/10' };
      case 'under_review':
        return { label: 'Under Review', color: 'text-brand-warning', bg: 'bg-brand-warning/10' };
      case 'rejected':
        return { label: 'Rejected', color: 'text-brand-error', bg: 'bg-brand-error/10' };
      default:
        return { label: 'Pending', color: 'text-muted-foreground', bg: 'bg-muted/50' };
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <AdminNavigation pendingCount={pendingCount} />
      
      <div className="px-4 lg:px-6 py-6">
        {/* Page Header */}
        <div className="mb-6">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-brand-primary">User Management</h1>
            <p className="text-sm text-muted-foreground">
              Manage user accounts and permissions
            </p>
          </div>
        </div>

        <main className="space-y-6">
        {/* Search */}
        <Card>
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Users List */}
        <Card>
          <CardHeader>
            <CardTitle>
              Users ({filteredUsers.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredUsers.map((user) => {
                const kycStatus = getKYCStatusConfig(user.kycStatus);
                
                return (
                  <div key={user.id} className="border border-border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-brand-primary/10 rounded-full flex items-center justify-center">
                          <User className="h-5 w-5 text-brand-primary" />
                        </div>
                        <div>
                          <p className="font-semibold text-foreground">
                            {user.firstName} {user.lastName}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {user.email}
                          </p>
                        </div>
                      </div>
                      <div className={`px-3 py-1 rounded-full ${kycStatus.bg}`}>
                        <span className={`text-sm font-medium ${kycStatus.color}`}>
                          {kycStatus.label}
                        </span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                      <div>
                        <span className="text-muted-foreground">Joined:</span>{' '}
                        {new Date(user.createdAt).toLocaleDateString()}
                      </div>
                      <div>
                        <span className="text-muted-foreground">Last Login:</span>{' '}
                        {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never'}
                      </div>
                      {user.phone && (
                        <div>
                          <span className="text-muted-foreground">Phone:</span>{' '}
                          {user.phone}
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        View Profile
                      </Button>
                      <Button size="sm" variant="outline">
                        View Transactions
                      </Button>
                      {user.kycStatus !== 'verified' && (
                        <Button size="sm" className="btn-primary">
                          Review KYC
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* User Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-2xl font-bold text-foreground">
                {users.length}
              </p>
              <p className="text-sm text-muted-foreground">Total Users</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-2xl font-bold text-brand-success">
                {users.filter(u => u.kycStatus === 'verified').length}
              </p>
              <p className="text-sm text-muted-foreground">Verified</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-2xl font-bold text-brand-warning">
                {users.filter(u => u.kycStatus === 'under_review').length}
              </p>
              <p className="text-sm text-muted-foreground">Under Review</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-2xl font-bold text-brand-primary">
                {users.filter(u => u.lastLogin && new Date(u.lastLogin) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length}
              </p>
              <p className="text-sm text-muted-foreground">Active This Week</p>
            </CardContent>
          </Card>
        </div>
        </main>
      </div>
    </div>
  );
}
