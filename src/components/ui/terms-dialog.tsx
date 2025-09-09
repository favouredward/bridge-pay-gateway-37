import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

interface TermsDialogProps {
  open: boolean;
  onAccept: () => void;
  onCancel: () => void;
}

export function TermsDialog({ open, onAccept, onCancel }: TermsDialogProps) {
  const [accepted, setAccepted] = useState(false);

  const handleAccept = () => {
    if (accepted) {
      onAccept();
    }
  };

  const handleReject = () => {
    onCancel();
  };

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onCancel()}>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Terms and Conditions</DialogTitle>
          <DialogDescription>
            Please read and accept our terms and conditions to continue with your first transaction.
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="h-96 w-full border rounded p-4">
          <div className="space-y-4 text-sm">
            <section>
              <h4 className="font-semibold text-foreground">1. Service Agreement</h4>
              <p className="text-muted-foreground">
                By using BridgePay, you agree to convert GBP to USDT through our secure platform with transparent fees and real-time exchange rates.
              </p>
            </section>

            <section>
              <h4 className="font-semibold text-foreground">2. Transaction Terms</h4>
              <ul className="list-disc pl-4 text-muted-foreground space-y-1">
                <li>Minimum transaction: £10 GBP</li>
                <li>Maximum transaction: £10,000 GBP</li>
                <li>Service fee: 2.5% + £1 network fee</li>
                <li>Payment deadline: 2 hours from transaction creation</li>
              </ul>
            </section>

            <section>
              <h4 className="font-semibold text-foreground">3. KYC Requirements</h4>
              <p className="text-muted-foreground">
                Identity verification is required for all users to comply with financial regulations and ensure secure transactions.
              </p>
            </section>

            <section>
              <h4 className="font-semibold text-foreground">4. Risk Acknowledgment</h4>
              <p className="text-muted-foreground">
                Cryptocurrency transactions are irreversible. Exchange rates may fluctuate. You acknowledge the risks associated with digital asset transactions.
              </p>
            </section>

            <section>
              <h4 className="font-semibold text-foreground">5. Privacy & Security</h4>
              <p className="text-muted-foreground">
                Your personal information is protected and used solely for compliance purposes. We employ industry-standard security measures.
              </p>
            </section>

            <section>
              <h4 className="font-semibold text-foreground">6. Limitation of Liability</h4>
              <p className="text-muted-foreground">
                BridgePay's liability is limited to the transaction amount. We are not responsible for market volatility or external factors.
              </p>
            </section>
          </div>
        </ScrollArea>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="accept-terms"
            checked={accepted}
            onCheckedChange={(checked) => setAccepted(checked === true)}
          />
          <label
            htmlFor="accept-terms"
            className="text-sm text-muted-foreground leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            I have read and agree to the{' '}
            <Link to="/terms" className="text-brand-primary hover:underline inline-flex items-center gap-1">
              Terms and Conditions
              <ExternalLink className="h-3 w-3" />
            </Link>
          </label>
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4">
          <Button 
            variant="outline" 
            onClick={handleReject}
            className="w-full sm:w-auto order-2 sm:order-1 h-11 text-base font-semibold border-2 hover:bg-muted/50 transition-all duration-200"
            size="lg"
          >
            Reject Terms
          </Button>
          <Button 
            onClick={handleAccept} 
            disabled={!accepted}
            className="w-full sm:w-auto order-1 sm:order-2 h-11 text-base font-semibold bg-gradient-to-r from-primary to-primary-foreground hover:from-primary/90 hover:to-primary-foreground/90 shadow-lg transform hover:scale-[1.02] transition-all duration-200 disabled:transform-none disabled:hover:scale-100"
            size="lg"
          >
            Accept & Continue
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}