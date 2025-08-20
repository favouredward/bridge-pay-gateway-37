
import { useState, useEffect } from 'react';
import { RefreshCw, TrendingUp, TrendingDown, Activity, Lock, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getCurrentExchangeRate } from '@/data/mockData';

export function ExchangeRateCard() {
  const [rate, setRate] = useState(getCurrentExchangeRate());
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [trend, setTrend] = useState<'up' | 'down' | 'neutral'>('neutral');
  const [isRateLocked, setIsRateLocked] = useState(false);
  const [lockTimeRemaining, setLockTimeRemaining] = useState(0);

  const refreshRate = async () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      const newRate = getCurrentExchangeRate() + (Math.random() - 0.5) * 0.02;
      const oldRate = rate;
      setRate(Number(newRate.toFixed(4)));
      setTrend(newRate > oldRate ? 'up' : newRate < oldRate ? 'down' : 'neutral');
      setLastUpdated(new Date());
      setIsLoading(false);
    }, 1000);
  };

  const lockRate = () => {
    setIsRateLocked(true);
    setLockTimeRemaining(15 * 60); // 15 minutes in seconds
  };

  useEffect(() => {
    const interval = setInterval(refreshRate, 30000); // Auto-refresh every 30 seconds
    return () => clearInterval(interval);
  }, [rate]);

  useEffect(() => {
    let countdown: NodeJS.Timeout;
    if (isRateLocked && lockTimeRemaining > 0) {
      countdown = setInterval(() => {
        setLockTimeRemaining(prev => {
          if (prev <= 1) {
            setIsRateLocked(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(countdown);
  }, [isRateLocked, lockTimeRemaining]);

  const getTrendIcon = () => {
    if (trend === 'up') return <TrendingUp className="h-5 w-5 text-emerald-500" />;
    if (trend === 'down') return <TrendingDown className="h-5 w-5 text-red-500" />;
    return <Activity className="h-5 w-5 text-muted-foreground" />;
  };

  const getTrendColor = () => {
    if (trend === 'up') return 'text-emerald-500';
    if (trend === 'down') return 'text-red-500';
    return 'text-muted-foreground';
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="card-premium p-8 bg-gradient-to-br from-brand-primary/5 via-brand-secondary/5 to-surface-elevated relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%233B82F6" fill-opacity="0.1"%3E%3Ccircle cx="7" cy="7" r="3"/%3E%3Ccircle cx="53" cy="7" r="3"/%3E%3Ccircle cx="7" cy="53" r="3"/%3E%3Ccircle cx="53" cy="53" r="3"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] bg-repeat"></div>
      </div>

      <div className="relative z-10">
        <div className="flex justify-between items-start mb-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-gradient-to-r from-brand-primary to-brand-secondary rounded-xl">
                <Activity className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-lg font-bold text-foreground">Live Exchange Rate</h3>
            </div>
            
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center gap-3">
                <p className={`text-4xl font-bold ${getTrendColor()}`}>
                  1 GBP = {rate} USDT
                </p>
                {getTrendIcon()}
              </div>
            </div>

            {isRateLocked ? (
              <div className="flex items-center gap-2 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                <Lock className="h-4 w-4 text-emerald-500" />
                <span className="text-emerald-600 font-semibold text-sm">
                  Rate locked for {formatTime(lockTimeRemaining)}
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-muted-foreground text-sm">
                <div className="w-2 h-2 bg-brand-secondary rounded-full animate-pulse"></div>
                <span>Last updated: {lastUpdated.toLocaleTimeString()}</span>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={refreshRate}
              disabled={isLoading}
              className="p-3 hover:bg-brand-primary/10 hover:text-brand-primary"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>
            
            {!isRateLocked && (
              <Button
                size="sm"
                onClick={lockRate}
                className="btn-secondary text-sm px-4 py-2 h-auto"
              >
                <Lock className="h-3 w-3 mr-1" />
                Lock Rate
              </Button>
            )}
          </div>
        </div>

        {/* Rate Comparison */}
        <div className="border-t border-border/50 pt-6">
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-sm text-muted-foreground mb-1">24h High</div>
              <div className="font-bold text-emerald-500">{(rate + 0.05).toFixed(4)}</div>
            </div>
            <div className="text-center">
              <div className="text-sm text-muted-foreground mb-1">24h Low</div>
              <div className="font-bold text-red-500">{(rate - 0.03).toFixed(4)}</div>
            </div>
            <div className="text-center">
              <div className="text-sm text-muted-foreground mb-1">24h Change</div>
              <div className={`font-bold flex items-center justify-center gap-1 ${getTrendColor()}`}>
                {trend === 'up' ? '+' : trend === 'down' ? '-' : ''}0.{Math.floor(Math.random() * 50)}%
                {getTrendIcon()}
              </div>
            </div>
          </div>
        </div>

        {/* Market Status */}
        <div className="flex items-center justify-between mt-6 p-4 bg-gradient-to-r from-muted/30 to-muted/10 rounded-2xl">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
            <span className="font-semibold text-foreground">Market Open</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground text-sm">
            <AlertCircle className="h-4 w-4" />
            <span>Rates update every 30s</span>
          </div>
        </div>
      </div>
    </div>
  );
}
