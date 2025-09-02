
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShieldCheck, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';

interface KYCVerificationPromptProps {
  onClose?: () => void;
}

export function KYCVerificationPrompt({ onClose }: KYCVerificationPromptProps) {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  // Don't show the prompt if user is verified
  if (user?.kycStatus === 'verified') {
    return null;
  }

  // Show different messages based on KYC status
  const getStatusMessage = () => {
    switch (user?.kycStatus) {
      case 'under_review':
        return {
          title: 'Verification Under Review',
          description: 'Your identity verification is being reviewed. This usually takes 1-2 business days.',
          buttonText: 'Check Status',
          buttonAction: () => navigate('/kyc'),
          color: 'brand-warning'
        };
      case 'rejected':
        return {
          title: 'Verification Required',
          description: 'Your previous verification was rejected. Please resubmit with clearer documents.',
          buttonText: 'Resubmit Documents', 
          buttonAction: () => navigate('/kyc'),
          color: 'brand-error'
        };
      default:
        return {
          title: 'Identity Verification Required',
          description: 'Complete your identity verification to send money.',
          buttonText: 'Start Verification',
          buttonAction: () => navigate('/kyc'),
          color: 'brand-warning'
        };
    }
  };

  const statusInfo = getStatusMessage();

  return (
    <Card className={`border-${statusInfo.color} bg-${statusInfo.color}/5`}>
      <CardHeader>
        <CardTitle className={`text-${statusInfo.color} flex items-center gap-2`}>
          <AlertTriangle className="h-5 w-5" />
          {statusInfo.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-start gap-3">
          <ShieldCheck className="h-6 w-6 text-brand-primary mt-1 flex-shrink-0" />
          <div>
            <p className="font-medium text-foreground mb-2">
              {statusInfo.description}
            </p>
            {user?.kycStatus === 'pending' && (
              <>
                <p className="text-sm text-muted-foreground mb-4">
                  This is a one-time process that usually takes 1-2 business days.
                </p>
                <ul className="text-sm text-muted-foreground space-y-1 mb-4">
                  <li>• Upload your driver's license</li>
                  <li>• Provide your phone number</li>
                  <li>• Complete address verification</li>
                </ul>
              </>
            )}
          </div>
        </div>
        
        <div className="flex gap-3">
          <Button 
            className="btn-primary flex-1"
            onClick={statusInfo.buttonAction}
          >
            {statusInfo.buttonText}
          </Button>
          {onClose && user?.kycStatus === 'pending' && (
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
