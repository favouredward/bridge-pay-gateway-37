
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
  X
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { NotificationBell } from '@/components/layout/NotificationBell';
import { ThemeToggle } from '@/components/layout/ThemeToggle';

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
  const { logout, user } = useAuthStore();
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

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 xl:w-72 lg:fixed lg:inset-y-0 lg:z-50 lg:bg-card lg:border-r lg:border-border">
        <div className="flex flex-col flex-1 min-h-0">
          {/* Logo */}
          <div className="flex items-center h-16 px-4 xl:px-6 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-brand-primary to-brand-secondary rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-sm">B</span>
              </div>
              <h1 className="text-lg xl:text-xl font-bold text-brand-primary">BridgePay Admin</h1>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 xl:px-6 py-4 space-y-2">
            {navigationItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Button
                  key={item.path}
                  variant={isActive ? "default" : "ghost"}
                  className={cn(
                    'w-full justify-start text-left h-11',
                    isActive 
                      ? 'bg-brand-primary text-white shadow-lg' 
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  )}
                  onClick={() => handleNavigation(item.path)}
                >
                  <item.icon className="h-4 w-4 mr-3 flex-shrink-0" />
                  <span className="truncate">{item.label}</span>
                  {item.badge && (
                    <Badge variant="destructive" className="ml-auto flex-shrink-0">
                      {item.badge > 99 ? '99+' : item.badge}
                    </Badge>
                  )}
                </Button>
              );
            })}
          </nav>

          {/* Bottom Actions */}
          <div className="p-4 xl:p-6 border-t border-border space-y-2">
            <div className="text-xs text-muted-foreground mb-2 truncate">
              Signed in as {user?.firstName}
            </div>
            <Button
              variant="ghost"
              className="w-full justify-start text-muted-foreground hover:text-foreground h-11"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4 mr-3" />
              Logout
            </Button>
          </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="lg:hidden flex items-center justify-between h-14 sm:h-16 px-4 sm:px-6 bg-card border-b border-border sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-2"
          >
            <Menu className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 sm:w-7 sm:h-7 bg-gradient-to-r from-brand-primary to-brand-secondary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xs">B</span>
            </div>
            <h1 className="text-sm sm:text-lg font-bold text-brand-primary">Admin</h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <NotificationBell />
          <Button variant="outline" size="sm" onClick={handleLogout} className="p-2">
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/50" onClick={() => setIsMobileMenuOpen(false)}>
          <div className="fixed inset-y-0 left-0 w-72 sm:w-80 bg-card border-r border-border" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between h-16 px-4 sm:px-6 border-b border-border">
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

            <nav className="px-4 sm:px-6 py-4 space-y-2">
              {navigationItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Button
                    key={item.path}
                    variant={isActive ? "default" : "ghost"}
                    className={cn(
                      'w-full justify-start h-12',
                      isActive 
                        ? 'bg-brand-primary text-white' 
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                    )}
                    onClick={() => handleNavigation(item.path)}
                  >
                    <item.icon className="h-4 w-4 mr-3" />
                    {item.label}
                    {item.badge && (
                      <Badge variant="destructive" className="ml-auto">
                        {item.badge > 99 ? '99+' : item.badge}
                      </Badge>
                    )}
                  </Button>
                );
              })}
            </nav>

            <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 border-t border-border bg-card">
              <div className="text-xs text-muted-foreground mb-3">
                Signed in as <span className="font-medium">{user?.firstName} {user?.lastName}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
