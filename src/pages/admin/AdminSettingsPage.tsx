
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Save } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminSettingsPage() {
  const navigate = useNavigate();
  const [settings, setSettings] = useState({
    exchangeRate: '1.25',
    minTransactionLimit: '10',
    maxTransactionLimit: '10000',
    bridgePayFee: '2.5',
    networkFee: '1.0',
  });

  const handleSave = () => {
    // Simulate saving settings
    toast.success('Settings saved successfully!');
  };

  const handleChange = (field: string, value: string) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="page-container">
      {/* Header */}
      <header className="bg-card border-b border-border px-6 py-4">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/admin/dashboard')}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-xl font-semibold text-foreground">System Settings</h1>
            <p className="text-sm text-muted-foreground">
              Configure platform settings and limits
            </p>
          </div>
        </div>
      </header>

      <main className="container-padding py-6 space-y-6">
        {/* Exchange Rate Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Exchange Rate</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="form-label">GBP to USDT Rate</Label>
              <Input
                type="number"
                step="0.001"
                value={settings.exchangeRate}
                onChange={(e) => handleChange('exchangeRate', e.target.value)}
                className="form-input"
              />
              <p className="text-sm text-muted-foreground mt-1">
                Current rate: 1 GBP = {settings.exchangeRate} USDT
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Transaction Limits */}
        <Card>
          <CardHeader>
            <CardTitle>Transaction Limits</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="form-label">Minimum Amount (GBP)</Label>
                <Input
                  type="number"
                  value={settings.minTransactionLimit}
                  onChange={(e) => handleChange('minTransactionLimit', e.target.value)}
                  className="form-input"
                />
              </div>
              <div>
                <Label className="form-label">Maximum Amount (GBP)</Label>
                <Input
                  type="number"
                  value={settings.maxTransactionLimit}
                  onChange={(e) => handleChange('maxTransactionLimit', e.target.value)}
                  className="form-input"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Fee Structure */}
        <Card>
          <CardHeader>
            <CardTitle>Fee Structure</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="form-label">BridgePay Fee (%)</Label>
                <Input
                  type="number"
                  step="0.1"
                  value={settings.bridgePayFee}
                  onChange={(e) => handleChange('bridgePayFee', e.target.value)}
                  className="form-input"
                />
              </div>
              <div>
                <Label className="form-label">Network Fee (GBP)</Label>
                <Input
                  type="number"
                  step="0.1"
                  value={settings.networkFee}
                  onChange={(e) => handleChange('networkFee', e.target.value)}
                  className="form-input"
                />
              </div>
            </div>
            <div className="card-primary p-4 bg-muted/30">
              <p className="text-sm text-muted-foreground">
                <strong>Example:</strong> For a £100 transaction, the total fee would be 
                £{((100 * parseFloat(settings.bridgePayFee) / 100) + parseFloat(settings.networkFee)).toFixed(2)}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button onClick={handleSave} className="btn-primary flex items-center gap-2">
            <Save className="h-4 w-4" />
            Save Settings
          </Button>
        </div>
      </main>
    </div>
  );
}
