
import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { getCurrentExchangeRate } from '@/data/mockData';
import { ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AmountCalculatorProps {
  onAmountChange?: (gbp: number, usdt: number) => void;
  defaultGbpAmount?: number;
}

export function AmountCalculator({ onAmountChange, defaultGbpAmount = 0 }: AmountCalculatorProps) {
  const [gbpAmount, setGbpAmount] = useState(defaultGbpAmount.toString());
  const [usdtAmount, setUsdtAmount] = useState('0');
  const [isGbpFocused, setIsGbpFocused] = useState(true);
  const exchangeRate = getCurrentExchangeRate();

  // Initialize with default amount on first load
  useEffect(() => {
    if (defaultGbpAmount > 0) {
      const usdt = (defaultGbpAmount * exchangeRate).toFixed(2);
      setUsdtAmount(usdt);
      onAmountChange?.(defaultGbpAmount, parseFloat(usdt));
    } else {
      // Start with 0 amounts
      setGbpAmount('0');
      setUsdtAmount('0');
      onAmountChange?.(0, 0);
    }
  }, []);

  useEffect(() => {
    if (isGbpFocused) {
      const gbp = parseFloat(gbpAmount) || 0;
      const usdt = (gbp * exchangeRate).toFixed(2);
      setUsdtAmount(usdt);
      onAmountChange?.(gbp, parseFloat(usdt));
    } else {
      const usdt = parseFloat(usdtAmount) || 0;
      const gbp = (usdt / exchangeRate).toFixed(2);
      setGbpAmount(gbp);
      onAmountChange?.(parseFloat(gbp), usdt);
    }
  }, [gbpAmount, usdtAmount, exchangeRate, isGbpFocused, onAmountChange]);

  const handleGbpChange = (value: string) => {
    setGbpAmount(value);
    setIsGbpFocused(true);
  };

  const handleUsdtChange = (value: string) => {
    setUsdtAmount(value);
    setIsGbpFocused(false);
  };

  const swapAmounts = () => {
    const temp = gbpAmount;
    setGbpAmount((parseFloat(usdtAmount) / exchangeRate).toFixed(2));
    setUsdtAmount((parseFloat(temp) * exchangeRate).toFixed(2));
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="gbp-amount" className="form-label">
          You send (GBP)
        </Label>
        <Input
          id="gbp-amount"
          type="number"
          value={gbpAmount}
          onChange={(e) => handleGbpChange(e.target.value)}
          placeholder="0.00"
          className="form-input text-lg font-semibold"
          step="0.01"
          min="0"
        />
      </div>

      <div className="flex justify-center">
        <Button
          variant="outline"
          size="sm"
          onClick={swapAmounts}
          className="rounded-full p-2"
        >
          <ArrowUpDown className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-2">
        <Label htmlFor="usdt-amount" className="form-label">
          Recipient gets (USDT)
        </Label>
        <Input
          id="usdt-amount"
          type="number"
          value={usdtAmount}
          onChange={(e) => handleUsdtChange(e.target.value)}
          placeholder="0.00"
          className="form-input text-lg font-semibold"
          step="0.01"
          min="0"
        />
      </div>

      <div className="text-center text-sm text-muted-foreground">
        Rate: 1 GBP = {exchangeRate} USDT
      </div>
    </div>
  );
}
