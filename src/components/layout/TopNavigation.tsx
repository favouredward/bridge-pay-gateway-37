
import { Bell, Menu, User, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/authStore';
import { NavLink, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

const navigation = [
  { name: 'Home', href: '/dashboard' },
  { name: 'Send', href: '/send' },
  { name: 'History', href: '/history' },
  { name: 'Profile', href: '/profile' },
];

export function TopNavigation() {
  const { user } = useAuthStore();
  const location = useLocation();
  const isMobile = useIsMobile();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4">
          {/* Logo and Brand */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-brand-primary to-brand-secondary rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-sm">B</span>
              </div>
              <h1 className="text-xl font-bold gradient-text">BridgePay</h1>
            </div>

            {/* Desktop Navigation */}
            {!isMobile && (
              <nav className="hidden md:flex items-center space-x-1">
                {navigation.map((item) => {
                  const isActive = location.pathname === item.href;
                  return (
                    <NavLink
                      key={item.name}
                      to={item.href}
                      className={cn(
                        'px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200',
                        isActive
                          ? 'bg-brand-primary/10 text-brand-primary'
                          : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                      )}
                    >
                      {item.name}
                    </NavLink>
                  );
                })}
              </nav>
            )}
          </div>

          {/* Right Side - Notifications and Profile */}
          <div className="flex items-center gap-3">
            {/* Welcome message - hidden on mobile */}
            {!isMobile && (
              <div className="text-sm text-muted-foreground mr-4">
                Welcome back, <span className="font-medium text-foreground">{user?.firstName}</span>
              </div>
            )}

            {/* Notifications */}
            <Button 
              variant="ghost" 
              size="sm" 
              className="relative p-3 hover:bg-brand-primary/10 hover:text-brand-primary rounded-xl"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 h-4 w-4 bg-gradient-to-r from-brand-error to-red-500 rounded-full text-xs text-white font-bold flex items-center justify-center text-[10px]">
                3
              </span>
            </Button>

            {/* Profile */}
            <Button 
              variant="ghost" 
              size="sm" 
              className="p-2 hover:bg-brand-primary/10 hover:text-brand-primary rounded-xl"
            >
              <div className="w-8 h-8 bg-gradient-to-r from-brand-secondary to-brand-accent rounded-xl flex items-center justify-center">
                <User className="h-4 w-4 text-white" />
              </div>
            </Button>

            {/* Mobile menu button */}
            {isMobile && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 hover:bg-brand-primary/10 hover:text-brand-primary rounded-xl md:hidden"
              >
                {isMobileMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </Button>
            )}
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobile && isMobileMenuOpen && (
          <div className="md:hidden border-t border-border/40 bg-background/95 backdrop-blur">
            <nav className="container px-4 py-4 space-y-2">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <NavLink
                    key={item.name}
                    to={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={cn(
                      'block px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200',
                      isActive
                        ? 'bg-brand-primary/10 text-brand-primary'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                    )}
                  >
                    {item.name}
                  </NavLink>
                );
              })}
              
              {/* Mobile user info */}
              <div className="px-4 py-3 mt-4 border-t border-border/40">
                <div className="text-sm text-muted-foreground">
                  Signed in as <span className="font-medium text-foreground">{user?.firstName} {user?.lastName}</span>
                </div>
                <div className="text-xs text-muted-foreground mt-1">{user?.email}</div>
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* Mobile menu overlay */}
      {isMobile && isMobileMenuOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm md:hidden" 
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
}
