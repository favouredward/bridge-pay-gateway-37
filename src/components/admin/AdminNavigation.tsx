
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  LayoutDashboard, 
  Users, 
  CreditCard, 
  FileCheck, 
  Settings, 
  LogOut,
  Menu,
  X,
  User,
  Plus
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { NotificationBell } from '@/components/layout/NotificationBell';
import { ThemeToggle } from '@/components/layout/ThemeToggle';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { UserManagementDialog } from '@/components/admin/UserManagementDialog';
import { SendNotificationDialog } from '@/components/admin/SendNotificationDialog';

interface AdminNavigationProps {
  pendingCount: {
    transactions: number;
    kyc: number;
    notifications: number;
  };
}

export default function AdminNavigation({ pendingCount }: AdminNavigationProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { signOut, user } = useAuthStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigationItems = [
    {
      icon: LayoutDashboard,
      label: 'Dashboard',
      path: '/admin/dashboard',
      badge: null
    },
    {
      icon: CreditCard,
      label: 'Transactions',
      path: '/admin/transactions',
      badge: pendingCount.transactions > 0 ? pendingCount.transactions : null
    },
    {
      icon: FileCheck,
      label: 'KYC Reviews',
      path: '/admin/kyc',
      badge: pendingCount.kyc > 0 ? pendingCount.kyc : null
    },
    {
      icon: Users,
      label: 'Users',
      path: '/admin/users',
      badge: null
    },
    {
      icon: Settings,
      label: 'Settings',
      path: '/admin/settings',
      badge: null
    }
  ];

  const handleLogout = async () => {
    await signOut();
    navigate('/admin/login');
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-card border-b border-border">
      <div className="flex h-16 items-center justify-between px-4 lg:px-6">
        {/* Left side - Logo and Navigation */}
        <div className="flex items-center gap-6">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-r from-brand-primary to-brand-secondary rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-sm">B</span>
            </div>
            <h1 className="text-lg font-bold text-brand-primary hidden sm:block">BridgePay Admin</h1>
            <h1 className="text-lg font-bold text-brand-primary sm:hidden">Admin</h1>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navigationItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Button
                  key={item.path}
                  variant={isActive ? "default" : "ghost"}
                  size="sm"
                  className={cn(
                    'relative h-9 rounded-lg',
                    isActive 
                      ? 'bg-brand-primary text-white shadow-sm' 
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  )}
                  onClick={() => handleNavigation(item.path)}
                >
                  <item.icon className="h-4 w-4 mr-2" />
                  <span className="font-medium">{item.label}</span>
                  {item.badge && (
                    <Badge variant="destructive" className="ml-2 text-xs h-5 min-w-5 px-1">
                      {item.badge > 99 ? '99+' : item.badge}
                    </Badge>
                  )}
                </Button>
              );
            })}
          </nav>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden p-2"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>

        {/* Right side - Actions and Profile */}
        <div className="flex items-center gap-2">
          {/* Action Buttons - Hidden on small screens */}
          <div className="hidden lg:flex items-center gap-2">
            <UserManagementDialog />
            <SendNotificationDialog />
          </div>

          {/* Quick Add Button - Mobile */}
          <Button 
            size="sm" 
            className="md:hidden btn-primary"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Plus className="h-4 w-4" />
          </Button>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <NotificationBell />
            
            {/* Profile Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 rounded-full">
                  <User className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <div className="px-2 py-1.5 text-sm text-muted-foreground">
                  {user?.firstName} {user?.lastName}
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate('/admin/settings')}>
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-black/50" onClick={() => setIsMobileMenuOpen(false)}>
          <div className="fixed inset-y-0 left-0 w-80 bg-card border-r border-border" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between h-16 px-4 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 bg-gradient-to-r from-brand-primary to-brand-secondary rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-sm">B</span>
                </div>
                <h1 className="text-lg font-bold text-brand-primary">BridgePay Admin</h1>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="p-4 space-y-4">
              {/* Mobile Actions */}
              <div className="space-y-2">
                <UserManagementDialog />
                <SendNotificationDialog />
              </div>

              <div className="border-t border-border pt-4">
                <nav className="space-y-2">
                  {navigationItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                      <Button
                        key={item.path}
                        variant={isActive ? "default" : "ghost"}
                        className={cn(
                          'w-full justify-start h-12 rounded-lg',
                          isActive 
                            ? 'bg-brand-primary text-white' 
                            : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                        )}
                        onClick={() => handleNavigation(item.path)}
                      >
                        <item.icon className="h-5 w-5 mr-3" />
                        <span className="font-medium">{item.label}</span>
                        {item.badge && (
                          <Badge variant="destructive" className="ml-auto text-xs">
                            {item.badge > 99 ? '99+' : item.badge}
                          </Badge>
                        )}
                      </Button>
                    );
                  })}
                </nav>
              </div>
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border bg-card">
              <div className="flex items-center justify-between">
                <div className="text-sm">
                  <span className="font-medium text-foreground">{user?.firstName} {user?.lastName}</span>
                  <p className="text-xs text-muted-foreground">Administrator</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="text-destructive hover:text-destructive"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
