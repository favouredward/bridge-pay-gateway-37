
import { Menu, User, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/authStore';
import { NavLink, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { NotificationBell } from './NotificationBell';
import { ThemeToggle } from './ThemeToggle';

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
        <div className="container flex h-14 sm:h-16 items-center justify-between px-4 sm:px-6">
          {/* Logo and Brand */}
          <div className="flex items-center gap-4 sm:gap-6">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-r from-brand-primary to-brand-secondary rounded-lg sm:rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-xs sm:text-sm">B</span>
              </div>
              <h1 className="text-lg sm:text-xl font-bold gradient-text">BridgePay</h1>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-1">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <NavLink
                    key={item.name}
                    to={item.href}
                    className={cn(
                      'px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200',
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
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Welcome message - hidden on small screens */}
            <div className="hidden xl:block text-sm text-muted-foreground">
              Welcome back, <span className="font-medium text-foreground">{user?.firstName}</span>
            </div>

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Notifications */}
            <NotificationBell />

            {/* Profile */}
            <Button 
              variant="ghost" 
              size="sm" 
              className="p-2 hover:bg-brand-primary/10 hover:text-brand-primary rounded-xl"
            >
              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-r from-brand-secondary to-brand-accent rounded-lg sm:rounded-xl flex items-center justify-center">
                <User className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
              </div>
            </Button>

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 hover:bg-brand-primary/10 hover:text-brand-primary rounded-xl lg:hidden"
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-border/40 bg-background/95 backdrop-blur">
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
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm lg:hidden" 
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
}
