
import { ArrowRight, Shield, Zap, Globe, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const features = [
  {
    icon: Zap,
    title: 'Instant Transfers',
    description: 'Send GBP and receive USDT in minutes, not hours.',
  },
  {
    icon: Shield,
    title: 'Bank-Level Security',
    description: 'Your transactions are protected with enterprise-grade security.',
  },
  {
    icon: Globe,
    title: 'Global Reach',
    description: 'Send money anywhere in the world with cryptocurrency.',
  },
];

const benefits = [
  'No hidden fees - transparent pricing',
  'Competitive exchange rates',
  'Real-time transaction tracking',
  'KYC verified platform',
  '24/7 customer support',
  'Mobile-first design',
];

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="page-container">
      {/* Navigation */}
      <nav className="container-padding py-4 flex justify-between items-center border-b border-border">
        <div className="text-2xl font-bold text-brand-primary">BridgePay</div>
        <div className="flex gap-4">
          <Button variant="ghost" onClick={() => navigate('/login')}>
            Sign In
          </Button>
          <Button className="btn-primary" onClick={() => navigate('/signup')}>
            Get Started
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container-padding py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold text-foreground mb-6">
            Send GBP, Receive{' '}
            <span className="text-brand-primary">USDT</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            The fastest and most secure way to convert your British Pounds to USDT cryptocurrency. 
            Trusted by thousands of users worldwide.
          </p>
          <div className="flex gap-4 justify-center">
            <Button 
              className="btn-primary text-lg px-8 py-4" 
              onClick={() => navigate('/signup')}
            >
              Start Sending Money
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              variant="outline" 
              className="btn-outline text-lg px-8 py-4"
              onClick={() => navigate('/login')}
            >
              Sign In
            </Button>
          </div>
        </div>
      </section>

      {/* Exchange Rate Preview */}
      <section className="container-padding py-16 bg-muted/30">
        <div className="max-w-2xl mx-auto">
          <div className="card-primary p-8 text-center">
            <h3 className="text-lg font-semibold text-muted-foreground mb-2">Current Exchange Rate</h3>
            <div className="text-4xl font-bold text-brand-primary mb-4">
              1 GBP = 1.25 USDT
            </div>
            <p className="text-muted-foreground">
              Live rates updated every 30 seconds
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container-padding py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Why Choose BridgePay?
            </h2>
            <p className="text-xl text-muted-foreground">
              The most trusted GBP to USDT payment gateway
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="card-primary p-8 text-center hover-lift">
                  <div className="mb-6 inline-flex p-4 bg-brand-primary/10 rounded-full">
                    <Icon className="h-8 w-8 text-brand-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="container-padding py-20 bg-muted/30">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Everything You Need
            </h2>
            <p className="text-xl text-muted-foreground">
              Built for modern digital transactions
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-center gap-4">
                <CheckCircle className="h-6 w-6 text-brand-success flex-shrink-0" />
                <span className="text-foreground font-medium">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container-padding py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-foreground mb-6">
            Ready to Start Sending Money?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join thousands of users who trust BridgePay for their GBP to USDT transfers
          </p>
          <Button 
            className="btn-primary text-lg px-8 py-4"
            onClick={() => navigate('/signup')}
          >
            Create Your Account
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border container-padding py-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-2xl font-bold text-brand-primary mb-4 md:mb-0">
              BridgePay
            </div>
            <div className="text-muted-foreground text-sm">
              © 2025 BridgePay. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
