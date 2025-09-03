
import { Bell, Menu, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/authStore';

interface HeaderProps {
  title?: string;
  showMenu?: boolean;
  onMenuClick?: () => void;
}

export function Header({ title, showMenu = false, onMenuClick }: HeaderProps) {
  const { user } = useAuthStore();

  return (
    <header className="glass-nav sticky top-0 z-40 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        {showMenu && (
          <Button variant="ghost" size="sm" onClick={onMenuClick} className="p-2">
            <Menu className="h-5 w-5" />
          </Button>
        )}
        
        <div>
          {title ? (
            <h1 className="text-xl font-bold text-foreground">{title}</h1>
          ) : (
            <div>
              <div className="flex items-center gap-3 mb-1">
                <div className="w-8 h-8 bg-gradient-to-r from-brand-primary to-brand-secondary rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-sm">B</span>
                </div>
                <h1 className="text-xl font-bold gradient-text">BridgePay</h1>
              </div>
              <p className="text-sm text-muted-foreground">
                Welcome back, {user?.firstName}
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Notifications */}
        <Button 
          variant="ghost" 
          size="sm" 
          className="relative p-3 hover:bg-brand-primary/10 hover:text-brand-primary rounded-2xl"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute -top-1 -right-1 h-5 w-5 bg-gradient-to-r from-brand-error to-red-500 rounded-full text-xs text-white font-bold flex items-center justify-center shadow-lg">
            3
          </span>
        </Button>

        {/* Profile */}
        <Button 
          variant="ghost" 
          size="sm" 
          className="p-2 hover:bg-brand-primary/10 hover:text-brand-primary rounded-2xl"
        >
          {user?.avatarUrl ? (
            <img 
              src={user.avatarUrl} 
              alt="Profile" 
              className="w-8 h-8 rounded-xl object-cover"
            />
          ) : (
            <div className="w-8 h-8 bg-gradient-to-r from-brand-secondary to-brand-accent rounded-xl flex items-center justify-center">
              <User className="h-4 w-4 text-white" />
            </div>
          )}
        </Button>
      </div>
    </header>
  );
}
