
import { NavLink, useLocation } from 'react-router-dom';
import { Home, History, User, Send } from 'lucide-react';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Home', href: '/dashboard', icon: Home },
  { name: 'Send', href: '/send', icon: Send },
  { name: 'History', href: '/history', icon: History },
  { name: 'Profile', href: '/profile', icon: User },
];

export function BottomNavigation() {
  const location = useLocation();

  return (
    <div className="bottom-nav">
      <nav className="flex items-center justify-around py-2">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href;
          const Icon = item.icon;
          
          return (
            <NavLink
              key={item.name}
              to={item.href}
              className={cn(
                'flex flex-col items-center justify-center px-3 py-2 rounded-lg transition-colors duration-200',
                isActive
                  ? 'text-brand-primary'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <Icon className={cn('h-5 w-5 mb-1', isActive && 'text-brand-primary')} />
              <span className={cn('text-xs font-medium', isActive && 'text-brand-primary')}>
                {item.name}
              </span>
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
}
