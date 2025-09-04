import { TopNavigation } from '@/components/layout/TopNavigation';
import { BottomNavigation } from '@/components/layout/BottomNavigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function TermsPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <TopNavigation />
      
      <main className="container mx-auto px-4 py-8 space-y-8 max-w-4xl">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold text-foreground">Terms and Conditions</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>BridgePay Terms of Service</CardTitle>
            <p className="text-sm text-muted-foreground">Last updated: January 1, 2024</p>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none space-y-6">
            <section>
              <h3 className="text-lg font-semibold text-foreground">1. Acceptance of Terms</h3>
              <p className="text-muted-foreground">
                By accessing and using BridgePay's services, you accept and agree to be bound by the terms and provision of this agreement. 
                If you do not agree to abide by the above, please do not use this service.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-foreground">2. Service Description</h3>
              <p className="text-muted-foreground">
                BridgePay provides a platform for converting British Pounds (GBP) to Tether (USDT) cryptocurrency. 
                Our service facilitates secure, fast, and transparent currency exchange transactions.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-foreground">3. User Eligibility</h3>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>You must be at least 18 years of age</li>
                <li>You must be legally capable of entering into binding contracts</li>
                <li>You must complete our KYC (Know Your Customer) verification process</li>
                <li>You must not be located in a restricted jurisdiction</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-foreground">4. KYC and Compliance</h3>
              <p className="text-muted-foreground">
                To comply with anti-money laundering (AML) and counter-terrorism financing (CTF) regulations, 
                we require all users to complete identity verification. This includes providing valid identification 
                documents and proof of address.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-foreground">5. Transaction Limits and Fees</h3>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>Minimum transaction: £10 GBP</li>
                <li>Maximum transaction: £10,000 GBP per transaction</li>
                <li>Service fee: 2.5% of transaction amount</li>
                <li>Network fee: £1 per transaction</li>
                <li>Exchange rates are updated in real-time and may fluctuate</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-foreground">6. Payment Processing</h3>
              <p className="text-muted-foreground">
                Payments must be made via bank transfer within 2 hours of transaction creation. 
                Payments must include the exact reference number provided. USDT will be sent to your 
                provided wallet address once payment is confirmed.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-foreground">7. Risk Disclosure</h3>
              <p className="text-muted-foreground">
                Cryptocurrency transactions are irreversible. You acknowledge that digital assets are volatile 
                and their value may fluctuate significantly. BridgePay is not responsible for market price movements 
                or losses incurred due to volatility.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-foreground">8. Privacy Policy</h3>
              <p className="text-muted-foreground">
                We are committed to protecting your privacy. Personal information collected during KYC is used solely 
                for compliance purposes and is stored securely. We do not sell or share personal data with third parties 
                except as required by law.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-foreground">9. Limitation of Liability</h3>
              <p className="text-muted-foreground">
                BridgePay's liability is limited to the amount of the transaction in question. We are not liable 
                for indirect, incidental, special, or consequential damages arising from the use of our service.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-foreground">10. Dispute Resolution</h3>
              <p className="text-muted-foreground">
                Any disputes arising from the use of our service will be resolved through binding arbitration 
                in accordance with the laws of the United Kingdom.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-foreground">11. Contact Information</h3>
              <p className="text-muted-foreground">
                For questions about these terms or our service, please contact us at:
              </p>
              <ul className="list-none text-muted-foreground">
                <li>Email: support@bridgepay.com</li>
                <li>Phone: +44 20 1234 5678</li>
                <li>Address: 123 Financial District, London, UK</li>
              </ul>
            </section>
          </CardContent>
        </Card>
      </main>

      <BottomNavigation />
    </div>
  );
}