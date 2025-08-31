import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, RefreshCw } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface ExchangeRate {
  id: string;
  from_currency: string;
  to_currency: string;
  rate: number;
  timestamp: string;
  source: string;
}

export function ExchangeRateCard() {
  const [currentRate, setCurrentRate] = useState<ExchangeRate | null>(null);
  const [previousRate, setPreviousRate] = useState<ExchangeRate | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchExchangeRates = async () => {
    try {
      const { data: rates, error } = await supabase
        .from('exchange_rates')
        .select('*')
        .eq('from_currency', 'GBP')
        .eq('to_currency', 'USDT')
        .order('timestamp', { ascending: false })
        .limit(2);

      if (error) throw error;

      if (rates && rates.length > 0) {
        setCurrentRate(rates[0]);
        setPreviousRate(rates[1] || rates[0]);
      } else {
        const fallbackRate = {
          id: 'fallback',
          from_currency: 'GBP',
          to_currency: 'USDT',
          rate: 1.25,
          timestamp: new Date().toISOString(),
          source: 'system',
        };
        setCurrentRate(fallbackRate);
        setPreviousRate(fallbackRate);
      }
    } catch (error) {
      console.error('Error fetching exchange rates:', error);
      const fallbackRate = {
        id: 'fallback',
        from_currency: 'GBP',
        to_currency: 'USDT',
        rate: 1.25,
        timestamp: new Date().toISOString(),
        source: 'system',
      };
      setCurrentRate(fallbackRate);
      setPreviousRate(fallbackRate);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExchangeRates();
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchExchangeRates();
    setIsRefreshing(false);
  };

  if (loading || !currentRate || !previousRate) {
    return (
      <Card className="h-32 flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading exchange rate...</div>
      </Card>
    );
  }

  const change = currentRate.rate - previousRate.rate;
  const changePercent = previousRate.rate !== 0 ? ((change / previousRate.rate) * 100).toFixed(2) : '0.00';
  const isPositive = change >= 0;

  return (
    <Card className="overflow-hidden bg-gradient-to-r from-emerald-500/5 to-blue-500/5 border-emerald-500/10">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-bold text-foreground flex items-center gap-2">
            💱 Live Exchange Rate
          </CardTitle>
          <Badge variant={isPositive ? "default" : "destructive"} className="flex items-center gap-1">
            {isPositive ? (
              <TrendingUp className="h-3 w-3" />
            ) : (
              <TrendingDown className="h-3 w-3" />
            )}
            {isPositive ? '+' : ''}{changePercent}%
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="text-3xl font-bold text-foreground">
                1 GBP = {currentRate.rate.toFixed(4)} USDT
              </div>
              <div className="text-sm text-muted-foreground">
                Updated: {new Date(currentRate.timestamp).toLocaleTimeString()}
              </div>
            </div>
            
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="p-2 hover:bg-muted rounded-full transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`h-5 w-5 ${isRefreshing ? 'animate-spin' : ''}`} />
            </button>
          </div>
          
          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border">
            <div className="text-center">
              <div className="text-sm text-muted-foreground">Previous</div>
              <div className="font-semibold">{previousRate.rate.toFixed(4)}</div>
            </div>
            <div className="text-center">
              <div className="text-sm text-muted-foreground">Change</div>
              <div className={`font-semibold ${isPositive ? 'text-emerald-500' : 'text-red-500'}`}>
                {isPositive ? '+' : ''}{change.toFixed(4)}
              </div>
            </div>
            <div className="text-center">
              <div className="text-sm text-muted-foreground">Source</div>
              <div className="font-semibold capitalize">{currentRate.source}</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}