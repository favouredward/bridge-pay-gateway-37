
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShieldCheck, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface KYCVerificationPromptProps {
  onClose?: () => void;
}

export function KYCVerificationPrompt({ onClose }: KYCVerificationPromptProps) {
  const navigate = useNavigate();

  return (
    <Card className="border-brand-warning bg-brand-warning/5">
      <CardHeader>
        <CardTitle className="text-brand-warning flex items-center gap-2">
          <AlertTriangle className="h-5 w-5" />
          Identity Verification Required
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-start gap-3">
          <ShieldCheck className="h-6 w-6 text-brand-primary mt-1 flex-shrink-0" />
          <div>
            <p className="font-medium text-foreground mb-2">
              Complete your identity verification to send money
            </p>
            <p className="text-sm text-muted-foreground mb-4">
              For your security and regulatory compliance, we need to verify your identity 
              before you can send money. This is a one-time process that usually takes 1-2 business days.
            </p>
            <ul className="text-sm text-muted-foreground space-y-1 mb-4">
              <li>• Upload a government-issued ID</li>
              <li>• Provide proof of address</li>
              <li>• Take a verification selfie</li>
            </ul>
          </div>
        </div>
        
        <div className="flex gap-3">
          <Button 
            className="btn-primary flex-1"
            onClick={() => navigate('/kyc')}
          >
            Start Verification
          </Button>
          {onClose && (
            <Button 
              variant="outline" 
              onClick={onClose}
            >
              Later
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
