
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TopNavigation } from '@/components/layout/TopNavigation';
import { BottomNavigation } from '@/components/layout/BottomNavigation';
import { AmountCalculator } from '@/components/calculator/AmountCalculator';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { ArrowLeft, Copy, Clock, CheckCircle } from 'lucide-react';
import { generatePaymentReference, getCurrentExchangeRate } from '@/data/mockData';
import { useAuthStore } from '@/store/authStore';
import { supabase } from '@/integrations/supabase/client';
import { TermsDialog } from '@/components/ui/terms-dialog';
import { useAuth } from '@/hooks/useAuth';

type Step = 'amount' | 'recipient' | 'payment' | 'confirmation';

export default function SendMoneyPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [currentStep, setCurrentStep] = useState<Step>('amount');
  const [showTermsDialog, setShowTermsDialog] = useState(false);
  const [formData, setFormData] = useState({
    gbpAmount: 0,
    usdtAmount: 0,
    walletAddress: '',
    paymentReference: '',
  });

  // Fetch user profile
  useEffect(() => {
    if (user?.id) {
      const fetchProfile = async () => {
        const { data } = await supabase
          .from('profiles')
          .select('terms_accepted')
          .eq('user_id', user.id)
          .single();
        setProfile(data);
      };
      fetchProfile();
    }
  }, [user?.id]);

  // Check if user needs to accept terms for their first transaction
  useEffect(() => {
    if (profile && !profile.terms_accepted && currentStep === 'confirmation') {
      setShowTermsDialog(true);
    }
  }, [profile, currentStep]);

  // Check if user is KYC verified
  if (user?.kycStatus !== 'verified') {
    return (
      <div className="min-h-screen bg-background">
        <TopNavigation />
        <main className="container mx-auto px-4 py-8 space-y-8 max-w-7xl">
          <div className="card-premium p-6 text-center">
            <h2 className="text-xl font-semibold text-foreground mb-4">
              KYC Verification Required
            </h2>
            <p className="text-muted-foreground mb-6">
              Please complete your KYC verification to start sending money.
            </p>
            <Button
              onClick={() => navigate('/kyc')}
            >
              Complete KYC
            </Button>
          </div>
        </main>
        <BottomNavigation />
      </div>
    );
  }

  const steps = [
    { id: 'amount', title: 'Amount', description: 'Enter amount to send' },
    { id: 'recipient', title: 'Recipient', description: 'USDT wallet address' },
    { id: 'payment', title: 'Payment', description: 'Bank transfer details' },
    { id: 'confirmation', title: 'Confirm', description: 'Confirm transaction' },
  ];

  const currentStepIndex = steps.findIndex(step => step.id === currentStep);
  const progress = ((currentStepIndex + 1) / steps.length) * 100;

  const handleAmountChange = (gbp: number, usdt: number) => {
    setFormData(prev => ({
      ...prev,
      gbpAmount: gbp,
      usdtAmount: usdt,
    }));
  };

  const handleNext = () => {
    if (currentStep === 'amount') {
      if (formData.gbpAmount < 10) {
        toast.error('Minimum amount is £10');
        return;
      }
      if (formData.gbpAmount > 10000) {
        toast.error('Maximum amount is £10,000');
        return;
      }
      setCurrentStep('recipient');
    } else if (currentStep === 'recipient') {
      if (!formData.walletAddress) {
        toast.error('Please enter USDT wallet address');
        return;
      }
      if (!isValidUSDTAddress(formData.walletAddress)) {
        toast.error('Please enter a valid USDT wallet address');
        return;
      }
      const reference = generatePaymentReference();
      setFormData(prev => ({ ...prev, paymentReference: reference }));
      setCurrentStep('payment');
    } else if (currentStep === 'payment') {
      setCurrentStep('confirmation');
    } else if (currentStep === 'confirmation') {
      handleSubmitTransaction();
    }
  };

  const handleBack = () => {
    if (currentStep === 'recipient') {
      setCurrentStep('amount');
    } else if (currentStep === 'payment') {
      setCurrentStep('recipient');
    } else if (currentStep === 'confirmation') {
      setCurrentStep('payment');
    }
  };

  const isValidUSDTAddress = (address: string): boolean => {
    return /^0x[a-fA-F0-9]{40}$/.test(address);
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard`);
  };

  const handleAcceptTerms = async () => {
    try {
      // Update user profile to mark terms as accepted
      const { error } = await supabase
        .from('profiles')
        .update({ 
          terms_accepted: true, 
          terms_accepted_at: new Date().toISOString() 
        })
        .eq('user_id', user?.id);

      if (error) {
        console.error('Error updating terms acceptance:', error);
        toast.error('Failed to accept terms. Please try again.');
        return;
      }

      setShowTermsDialog(false);
      // Refresh profile data
      if (user?.id) {
        const { data } = await supabase
          .from('profiles')
          .select('terms_accepted')
          .eq('user_id', user.id)
          .single();
        setProfile(data);
      }
      handleSubmitTransaction();
    } catch (err) {
      console.error('Unexpected error accepting terms:', err);
      toast.error('Failed to accept terms. Please try again.');
    }
  };

  const handleSubmitTransaction = async () => {
    // Check if terms need to be accepted first
    if (profile && !profile.terms_accepted) {
      setShowTermsDialog(true);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('transactions')
        .insert([
          {
            user_id: user?.id,
            gbp_amount: formData.gbpAmount,
            usdt_amount: formData.usdtAmount,
            exchange_rate: getCurrentExchangeRate(),
            wallet_address: formData.walletAddress,
            status: 'pending',
            payment_reference: formData.paymentReference,
            payment_deadline: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
            bridge_pay_fee: formData.gbpAmount * 0.025,
            network_fee: 1,
            total_fees: formData.gbpAmount * 0.025 + 1,
          }
        ])
        .select()
        .single();

      if (error) {
        console.error('Transaction creation error:', error);
        toast.error('Failed to create transaction. Please try again.');
        return;
      }

      toast.success('Transaction created successfully!');
      navigate(`/transactions/${data.id}`);
    } catch (err) {
      console.error('Unexpected error creating transaction:', err);
      toast.error('Failed to create transaction. Please try again.');
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 'amount':
        return (
          <div className="space-y-6">
            <AmountCalculator
              onAmountChange={handleAmountChange}
              defaultGbpAmount={formData.gbpAmount}
            />
            
            <div className="card-primary p-4 space-y-2">
              <h3 className="font-semibold text-foreground">Transaction Limits</h3>
              <p className="text-sm text-muted-foreground">
                Minimum: £10 | Maximum: £10,000 per transaction
              </p>
              <p className="text-sm text-muted-foreground">
                Fee: 2.5% + £1 network fee
              </p>
            </div>

            {/* Send Money Button */}
            <div className="flex justify-center pt-6">
              <Button 
                onClick={handleNext} 
                className="w-full h-14 text-xl font-bold bg-gradient-to-r from-primary to-primary-foreground hover:from-primary/90 hover:to-primary-foreground/90 shadow-lg"
                size="lg"
              >
                Send Money →
              </Button>
            </div>
          </div>
        );

      case 'recipient':
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="wallet" className="form-label">
                USDT Wallet Address
              </Label>
              <Input
                id="wallet"
                type="text"
                value={formData.walletAddress}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  walletAddress: e.target.value
                }))}
                className="form-input font-mono text-sm"
                placeholder="0x..."
              />
              <p className="text-xs text-muted-foreground">
                Enter the recipient's USDT wallet address (ERC-20)
              </p>
            </div>

            <div className="card-primary p-4">
              <h3 className="font-semibold text-foreground mb-2">Transaction Summary</h3>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">You send:</span>
                  <span className="font-medium">£{formData.gbpAmount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Recipient gets:</span>
                  <span className="font-medium">{formData.usdtAmount} USDT</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Exchange rate:</span>
                  <span className="font-medium">1 GBP = {getCurrentExchangeRate()} USDT</span>
                </div>
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex gap-4 pt-6">
              <Button 
                variant="outline"
                onClick={() => navigate(-1)}
                className="w-32 h-14 text-lg font-semibold"
                size="lg"
              >
                ← Back
              </Button>
              <Button 
                onClick={handleNext} 
                className="flex-1 h-14 text-xl font-bold bg-gradient-to-r from-primary to-primary-foreground hover:from-primary/90 hover:to-primary-foreground/90 shadow-lg"
                size="lg"
              >
                Continue to Payment →
              </Button>
            </div>
          </div>
        );

      case 'payment':
        const paymentDeadline = new Date(Date.now() + 2 * 60 * 60 * 1000); // 2 hours from now
        
        return (
          <div className="space-y-6">
            <div className="card-primary p-4 border-l-4 border-l-brand-warning bg-brand-warning/5">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="h-4 w-4 text-brand-warning" />
                <h3 className="font-semibold text-foreground">Payment Deadline</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Complete payment by {paymentDeadline.toLocaleString()}
              </p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Bank Transfer Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Account Name:</span>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">BridgePay Ltd</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard('BridgePay Ltd', 'Account name')}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Account Number:</span>
                    <div className="flex items-center gap-2">
                      <span className="font-medium font-mono">12345678</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard('12345678', 'Account number')}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Sort Code:</span>
                    <div className="flex items-center gap-2">
                      <span className="font-medium font-mono">12-34-56</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard('12-34-56', 'Sort code')}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Reference:</span>
                    <div className="flex items-center gap-2">
                      <span className="font-medium font-mono text-brand-primary">
                        {formData.paymentReference}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(formData.paymentReference, 'Reference')}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-2 border-t">
                    <span className="text-sm text-muted-foreground">Amount:</span>
                    <span className="font-bold text-lg">£{formData.gbpAmount}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="card-primary p-4 bg-muted/30">
              <p className="text-sm text-muted-foreground">
                <strong>Important:</strong> Include the exact reference so we can match your payment at 
                our end. Your USDT will be sent once payment is received.
              </p>
            </div>

            {/* Navigation Buttons */}
            <div className="flex gap-4 pt-6">
              <Button 
                variant="outline"
                onClick={handleBack}
                className="w-32 h-14 text-lg font-semibold"
                size="lg"
              >
                ← Back
              </Button>
              <Button 
                onClick={handleNext} 
                className="flex-1 h-14 text-xl font-bold bg-gradient-to-r from-primary to-primary-foreground hover:from-primary/90 hover:to-primary-foreground/90 shadow-lg"
                size="lg"
              >
                I've Made Payment →
              </Button>
            </div>
          </div>
        );

      case 'confirmation':
        return (
          <div className="space-y-6">
            <div className="text-center space-y-4">
              <div className="inline-flex p-4 bg-brand-success/10 rounded-full">
                <CheckCircle className="h-8 w-8 text-brand-success" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-foreground">
                  Ready to Submit?
                </h2>
                <p className="text-muted-foreground">
                  Please confirm your transaction details
                </p>
              </div>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Transaction Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Amount to send:</span>
                  <span className="font-medium">£{formData.gbpAmount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Recipient gets:</span>
                  <span className="font-medium">{formData.usdtAmount} USDT</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Wallet address:</span>
                  <span className="font-medium font-mono text-sm">
                    {formData.walletAddress.slice(0, 6)}...{formData.walletAddress.slice(-4)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Reference:</span>
                  <span className="font-medium font-mono">{formData.paymentReference}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Exchange rate:</span>
                  <span className="font-medium">1 GBP = {getCurrentExchangeRate()} USDT</span>
                </div>
              </CardContent>
            </Card>

            {/* Navigation Buttons */}
            <div className="flex gap-4 pt-6">
              <Button 
                variant="outline"
                onClick={handleBack}
                className="w-32 h-14 text-lg font-semibold"
                size="lg"
              >
                ← Back
              </Button>
              <Button 
                onClick={handleNext} 
                className="flex-1 h-14 text-xl font-bold bg-gradient-to-r from-primary to-primary-foreground hover:from-primary/90 hover:to-primary-foreground/90 shadow-lg"
                size="lg"
              >
                Submit Transaction →
              </Button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <TopNavigation />
      
      <main className="container mx-auto px-4 py-8 space-y-8 max-w-7xl">
        {/* Progress */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-foreground">
              {steps[currentStepIndex].title}
            </h2>
            <span className="text-sm text-muted-foreground">
              {currentStepIndex + 1} of {steps.length}
            </span>
          </div>
          <Progress value={progress} className="h-2" />
          <p className="text-sm text-muted-foreground">
            {steps[currentStepIndex].description}
          </p>
        </div>

        {/* Step Content */}
        <div className="min-h-[400px]">
          {renderStepContent()}
        </div>

        {/* Navigation */}
        <div className="flex gap-3 pt-6">
          {currentStepIndex > 0 && (
            <Button variant="outline" onClick={handleBack} className="flex-1">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          )}
          <Button 
            onClick={handleNext} 
            className="flex-1 h-12 text-lg font-semibold"
            size="lg"
          >
            {currentStep === 'amount' ? 'Send Money' : 
             currentStep === 'confirmation' ? 'Submit Transaction' : 'Next'}
          </Button>
        </div>
      </main>

      <BottomNavigation />

      <TermsDialog
        open={showTermsDialog}
        onAccept={handleAcceptTerms}
        onCancel={() => setShowTermsDialog(false)}
      />
    </div>
  );
}
