
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
      <nav className="flex items-center justify-around py-3 px-4">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href;
          const Icon = item.icon;
          
          return (
            <NavLink
              key={item.name}
              to={item.href}
              className={cn(
                'flex flex-col items-center justify-center px-4 py-2 rounded-2xl transition-all duration-300 relative group',
                isActive
                  ? 'text-brand-primary'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {/* Active Background */}
              {isActive && (
                <div className="absolute inset-0 bg-gradient-to-r from-brand-primary/10 to-brand-secondary/10 border border-brand-primary/20 rounded-2xl"></div>
              )}
              
              {/* Icon Container */}
              <div className={cn(
                'p-2 rounded-xl transition-all duration-300 relative z-10',
                isActive 
                  ? 'bg-gradient-to-r from-brand-primary to-brand-secondary shadow-lg scale-110' 
                  : 'group-hover:bg-muted'
              )}>
                <Icon 
                  className={cn(
                    'h-5 w-5 transition-colors duration-300', 
                    isActive ? 'text-white' : 'text-current'
                  )} 
                />
              </div>
              
              {/* Label */}
              <span className={cn(
                'text-xs font-semibold mt-1 transition-all duration-300 relative z-10',
                isActive ? 'text-brand-primary scale-105' : 'text-current'
              )}>
                {item.name}
              </span>

              {/* Active Indicator */}
              {isActive && (
                <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-gradient-to-r from-brand-primary to-brand-secondary rounded-full"></div>
              )}
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
}
