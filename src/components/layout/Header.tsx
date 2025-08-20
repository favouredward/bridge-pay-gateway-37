
import { Bell, Menu } from 'lucide-react';
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
    <header className="bg-card border-b border-border px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-3">
        {showMenu && (
          <Button variant="ghost" size="sm" onClick={onMenuClick}>
            <Menu className="h-5 w-5" />
          </Button>
        )}
        <div>
          {title ? (
            <h1 className="text-lg font-semibold text-foreground">{title}</h1>
          ) : (
            <div>
              <h1 className="text-lg font-bold text-brand-primary">BridgePay</h1>
              <p className="text-sm text-muted-foreground">
                Welcome back, {user?.firstName}
              </p>
            </div>
          )}
        </div>
      </div>

      <Button variant="ghost" size="sm" className="relative">
        <Bell className="h-5 w-5" />
        <span className="absolute -top-1 -right-1 h-3 w-3 bg-brand-error rounded-full text-xs"></span>
      </Button>
    </header>
  );
}
