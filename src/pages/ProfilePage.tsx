
import { TopNavigation } from '@/components/layout/TopNavigation';
import { BottomNavigation } from '@/components/layout/BottomNavigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuthStore } from '@/store/authStore';
import { useNavigate } from 'react-router-dom';
import { 
  User, 
  Mail, 
  Phone, 
  Shield, 
  CreditCard, 
  Settings, 
  LogOut,
  ChevronRight,
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle,
  Edit
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ProfileEditDialog } from '@/components/profile/ProfileEditDialog';
import { useState } from 'react';
import { useOptimizedUserData } from '@/hooks/useOptimizedUserData';

const getKYCStatusConfig = (status: string) => {
  switch (status) {
    case 'verified':
      return {
        icon: CheckCircle,
        label: 'Verified',
        color: 'text-brand-success',
        bgColor: 'bg-brand-success/10',
      };
    case 'under_review':
      return {
        icon: Clock,
        label: 'Under Review',
        color: 'text-brand-warning',
        bgColor: 'bg-brand-warning/10',
      };
    case 'rejected':
      return {
        icon: XCircle,
        label: 'Rejected',
        color: 'text-brand-error',
        bgColor: 'bg-brand-error/10',
      };
    default:
      return {
        icon: AlertCircle,
        label: 'Pending',
        color: 'text-muted-foreground',
        bgColor: 'bg-muted/50',
      };
  }
};

export default function ProfilePage() {
  const { user, signOut } = useAuthStore();
  const navigate = useNavigate();
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const { stats } = useOptimizedUserData();

  if (!user) {
    navigate('/login');
    return null;
  }

  const kycStatus = getKYCStatusConfig(user.kycStatus);
  const StatusIcon = kycStatus.icon;

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  const menuItems = [
    {
      icon: CreditCard,
      label: 'Payment Methods',
      description: 'Manage your bank accounts',
      href: '#',
    },
    {
      icon: Shield,
      label: 'Security',
      description: 'Password & 2FA settings',
      href: '#',
    },
    {
      icon: Settings,
      label: 'App Settings',
      description: 'Notifications & preferences',
      href: '#',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <TopNavigation />
      
      <main className="container mx-auto px-4 py-8 space-y-8 max-w-7xl">
        {/* User Info Card */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 relative">
                <Avatar className="w-16 h-16">
                  <AvatarImage src={user.avatarUrl} alt="Profile" />
                  <AvatarFallback className="bg-brand-primary/10 text-brand-primary text-lg font-semibold">
                    {user.firstName?.[0]}{user.lastName?.[0]}
                  </AvatarFallback>
                </Avatar>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-foreground">
                    {user.firstName} {user.lastName}
                  </h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setEditDialogOpen(true)}
                    className="text-brand-primary hover:text-brand-primary hover:bg-brand-primary/10"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Member since {new Date(user.createdAt).toLocaleDateString()}
                </p>
                
                <div className="mt-3 space-y-2">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Mail className="h-4 w-4 mr-2" />
                    {user.email}
                  </div>
                  {user.phone && (
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Phone className="h-4 w-4 mr-2" />
                      {user.phone}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* KYC Status Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Verification Status
              {user.kycStatus !== 'verified' && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => navigate('/kyc')}
                >
                  {user.kycStatus === 'pending' ? 'Start KYC' : 'Review KYC'}
                </Button>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-full ${kycStatus.bgColor}`}>
                <StatusIcon className={`h-5 w-5 ${kycStatus.color}`} />
              </div>
              <div>
                <p className="font-medium text-foreground">{kycStatus.label}</p>
                <p className="text-sm text-muted-foreground">
                  {user.kycStatus === 'verified' && 'Your identity has been verified'}
                  {user.kycStatus === 'under_review' && 'We\'re reviewing your documents'}
                  {user.kycStatus === 'rejected' && 'Please resubmit your documents'}
                  {user.kycStatus === 'pending' && 'Complete KYC to start sending money'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Account Stats */}
        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-2xl font-bold text-brand-primary">
                {stats?.totalTransactions || 0}
              </p>
              <p className="text-sm text-muted-foreground">Transactions</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-2xl font-bold text-brand-success">
                £{stats?.totalSent || 0}
              </p>
              <p className="text-sm text-muted-foreground">Total Sent</p>
            </CardContent>
          </Card>
        </div>

        {/* Menu Items */}
        <Card>
          <CardHeader>
            <CardTitle>Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            {menuItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <button
                  key={index}
                  onClick={() => {
                    // For demo, just show toast
                    // navigate(item.href);
                  }}
                  className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <Icon className="h-5 w-5 text-muted-foreground" />
                    <div className="text-left">
                      <p className="font-medium text-foreground">{item.label}</p>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </button>
              );
            })}
          </CardContent>
        </Card>

        {/* Logout */}
        <Card>
          <CardContent className="pt-6">
            <Button
              variant="outline"
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 text-brand-error border-brand-error hover:bg-brand-error hover:text-white"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
          </CardContent>
        </Card>

        {/* App Info */}
        <div className="text-center text-sm text-muted-foreground">
          <p>BridgePay v1.0.0</p>
          <p>© 2025 BridgePay. All rights reserved.</p>
        </div>
      </main>

      <BottomNavigation />
      
      <ProfileEditDialog 
        open={editDialogOpen} 
        onOpenChange={setEditDialogOpen} 
      />
    </div>
  );
}
