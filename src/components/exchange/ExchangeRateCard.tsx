
import { useState, useEffect } from 'react';
import { RefreshCw, TrendingUp, TrendingDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getCurrentExchangeRate } from '@/data/mockData';

export function ExchangeRateCard() {
  const [rate, setRate] = useState(getCurrentExchangeRate());
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [trend, setTrend] = useState<'up' | 'down' | 'neutral'>('neutral');

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

  useEffect(() => {
    const interval = setInterval(refreshRate, 30000); // Auto-refresh every 30 seconds
    return () => clearInterval(interval);
  }, [rate]);

  const getTrendIcon = () => {
    if (trend === 'up') return <TrendingUp className="h-4 w-4 text-brand-success" />;
    if (trend === 'down') return <TrendingDown className="h-4 w-4 text-brand-error" />;
    return null;
  };

  return (
    <div className="card-primary p-6 bg-gradient-to-br from-brand-primary/5 to-brand-secondary/5">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-1">Exchange Rate</h3>
          <div className="flex items-center gap-2">
            <p className="text-2xl font-bold text-brand-primary">
              1 GBP = {rate} USDT
            </p>
            {getTrendIcon()}
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={refreshRate}
          disabled={isLoading}
          className="p-2"
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
        </Button>
      </div>

      <div className="text-xs text-muted-foreground">
        Last updated: {lastUpdated.toLocaleTimeString()}
      </div>
    </div>
  );
}
