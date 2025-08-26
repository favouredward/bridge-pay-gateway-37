
import { ArrowRight, Shield, Zap, Globe, CheckCircle, Star, Users, TrendingUp, Play, Download, Smartphone, CreditCard, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const features = [
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: 'Send GBP and receive USDT in under 5 minutes with our advanced processing system.',
    color: 'from-blue-500 to-blue-600',
  },
  {
    icon: Shield,
    title: 'Bank-Grade Security',
    description: 'Military-grade encryption and compliance with UK financial regulations.',
    color: 'from-emerald-500 to-emerald-600',
  },
  {
    icon: Globe,
    title: 'Global Network',
    description: 'Connect to the world with cryptocurrency. Send anywhere, anytime.',
    color: 'from-purple-500 to-purple-600',
  },
];

const benefits = [
  'Zero hidden fees - Complete transparency',
  'Real-time competitive exchange rates',
  'Instant transaction notifications', 
  'FCA regulated and compliant',
  '24/7 premium customer support',
  'Mobile-first design for modern users',
];

const testimonials = [
  {
    name: 'Sarah Johnson',
    role: 'Crypto Trader',
    content: 'BridgePay has revolutionized how I move money. The speed and reliability are unmatched. Best platform I\'ve used for GBP to USDT transfers.',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=64&h=64&fit=crop&crop=face',
  },
  {
    name: 'Michael Chen', 
    role: 'Business Owner',
    content: 'Great service overall. The only minor issue was a slight delay during peak hours, but customer support sorted it quickly. Would recommend.',
    rating: 4,
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop&crop=face',
  },
  {
    name: 'Emma Wilson',
    role: 'Digital Nomad',
    content: 'BridgePay makes international payments effortless. I can focus on my work, not currency conversion. Absolutely love the mobile app.',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=64&h=64&fit=crop&crop=face',
  },
  {
    name: 'James Rodriguez',
    role: 'Freelancer',
    content: 'Solid platform with competitive rates. The interface could be more intuitive, but once you get used to it, transfers are smooth.',
    rating: 4,
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=64&h=64&fit=crop&crop=face',
  },
  {
    name: 'Lisa Thompson',
    role: 'Investment Manager',
    content: 'Impressed with the security features and FCA regulation. Had one transaction that took longer than expected, but generally reliable.',
    rating: 4,
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=64&h=64&fit=crop&crop=face',
  },
  {
    name: 'David Park',
    role: 'Tech Entrepreneur',
    content: 'Amazing platform! Lightning-fast transfers and transparent fees. This is exactly what the crypto space needed. Game changer!',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop&crop=face',
  },
];

const stats = [
  { value: '£50M+', label: 'Volume Processed' },
  { value: '25K+', label: 'Happy Customers' },
  { value: '99.9%', label: 'Uptime Guarantee' },
  { value: '<5min', label: 'Average Transfer' },
];

export default function LandingPage() {
  const navigate = useNavigate();
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  return (
    <div className="page-container">
      {/* Navigation */}
      <nav className="glass-nav sticky top-0 z-50 container-padding py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-brand-primary to-brand-secondary rounded-2xl flex items-center justify-center">
              <DollarSign className="h-6 w-6 text-white" />
            </div>
            <div className="text-2xl font-bold gradient-text">BridgePay</div>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <button className="text-foreground/70 hover:text-foreground font-medium transition-colors">Features</button>
            <button className="text-foreground/70 hover:text-foreground font-medium transition-colors">Pricing</button>
            <button className="text-foreground/70 hover:text-foreground font-medium transition-colors">About</button>
            <button className="text-foreground/70 hover:text-foreground font-medium transition-colors">Support</button>
          </div>
          <div className="flex gap-3">
            <Button variant="ghost" onClick={() => navigate('/login')} className="font-semibold">
              Sign In
            </Button>
            <Button className="btn-primary" onClick={() => navigate('/signup')}>
              Get Started
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=1920&h=1080&fit=crop&crop=center')] bg-cover bg-center opacity-5"></div>
        <div className="container-padding py-20 lg:py-32 relative">
          <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
            <div className="animate-fade-in">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-brand-primary/10 to-brand-secondary/10 border border-brand-primary/20 rounded-full px-4 py-2 mb-8">
                <div className="w-2 h-2 bg-brand-secondary rounded-full animate-pulse"></div>
                <span className="text-sm font-semibold text-brand-primary">Now FCA Regulated</span>
              </div>
              
              <h1 className="text-5xl lg:text-7xl font-bold text-foreground mb-6 leading-tight">
                Send GBP,{' '}
                <span className="gradient-text">Receive USDT</span>
              </h1>
              
              <p className="text-xl lg:text-2xl text-muted-foreground mb-8 max-w-2xl leading-relaxed">
                The fastest, most secure way to convert British Pounds to USDT cryptocurrency. 
                Join thousands who trust BridgePay for their digital transactions.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <Button 
                  className="btn-primary text-lg px-8 py-4 h-16 shadow-2xl shadow-blue-500/25" 
                  onClick={() => navigate('/signup')}
                >
                  Start Sending Money
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button 
                  variant="outline" 
                  className="btn-outline text-lg px-8 py-4 h-16"
                  onClick={() => setIsVideoPlaying(true)}
                >
                  <Play className="mr-2 h-5 w-5" />
                  Watch Demo
                </Button>
              </div>

              {/* Trust Indicators */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-2">
                    {testimonials.slice(0, 4).map((testimonial, index) => (
                      <img
                        key={index}
                        src={testimonial.avatar}
                        alt={testimonial.name}
                        className="w-10 h-10 rounded-full border-2 border-background shadow-lg object-cover"
                      />
                    ))}
                  </div>
                  <div className="text-sm">
                    <div className="flex items-center gap-1 mb-1">
                      {[...Array(4)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      ))}
                      <Star className="h-4 w-4 fill-yellow-400/50 text-yellow-400" />
                      <span className="ml-1 text-xs text-muted-foreground">4.6/5</span>
                    </div>
                    <span className="text-muted-foreground">25,000+ customers</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Shield className="h-4 w-4 text-brand-secondary" />
                  <span>FCA Regulated & Secure</span>
                </div>
              </div>
            </div>

            <div className="animate-slide-up lg:animate-float">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-brand-primary to-brand-secondary rounded-3xl blur-3xl opacity-20 animate-pulse"></div>
                <img
                  src="https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=600&h=600&fit=crop&crop=center"
                  alt="Modern fintech dashboard"
                  className="relative z-10 w-full max-w-lg mx-auto rounded-3xl shadow-2xl"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="container-padding py-16 bg-gradient-to-r from-surface-primary to-surface-secondary">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center animate-scale-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="text-4xl lg:text-5xl font-bold gradient-text mb-2">{stat.value}</div>
                <div className="text-muted-foreground font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Exchange Rate Preview */}
      <section className="container-padding py-20">
        <div className="max-w-4xl mx-auto">
          <div className="card-premium p-12 text-center bg-gradient-to-br from-brand-primary/5 via-brand-secondary/5 to-surface-elevated">
            <div className="inline-flex items-center gap-3 mb-6">
              <TrendingUp className="h-8 w-8 text-brand-secondary" />
              <h3 className="text-2xl font-bold text-foreground">Live Exchange Rate</h3>
            </div>
            <div className="text-6xl font-bold gradient-text mb-6">
              1 GBP = 1.2547 USDT
            </div>
            <div className="flex items-center justify-center gap-4 text-muted-foreground mb-8">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-brand-secondary rounded-full animate-pulse"></div>
                <span>Live rates updated every 30 seconds</span>
              </div>
            </div>
            <Button className="btn-secondary text-lg px-8 py-4" onClick={() => navigate('/signup')}>
              Lock This Rate
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container-padding py-20 bg-gradient-to-br from-surface-primary to-surface-secondary">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl lg:text-5xl font-bold gradient-text mb-6">
              Why Choose BridgePay?
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Built for the modern digital economy with enterprise-grade security and lightning-fast processing
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="feature-card animate-slide-up" style={{ animationDelay: `${index * 0.2}s` }}>
                  <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/5 to-brand-secondary/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative">
                    <div className={`mb-8 inline-flex p-4 bg-gradient-to-r ${feature.color} rounded-2xl shadow-lg`}>
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-foreground mb-4">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground text-lg leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="container-padding py-20">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-8">
                Everything You Need for{' '}
                <span className="gradient-text">Digital Payments</span>
              </h2>
              <p className="text-xl text-muted-foreground mb-12">
                Built for businesses and individuals who demand excellence in financial technology
              </p>

              <div className="grid gap-6">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-4 animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
                    <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-brand-secondary to-brand-accent rounded-full flex items-center justify-center">
                      <CheckCircle className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-foreground font-semibold text-lg">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative lg:justify-self-end">
              <div className="absolute inset-0 bg-gradient-to-r from-brand-primary to-brand-secondary rounded-3xl blur-3xl opacity-20"></div>
              <img
                src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=800&fit=crop&crop=center"
                alt="Professional fintech interface"
                className="relative z-10 w-full max-w-md mx-auto lg:mx-0 rounded-3xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="container-padding py-20 bg-gradient-to-br from-surface-primary to-surface-secondary">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold gradient-text mb-6">
              Trusted by Thousands
            </h2>
            <p className="text-xl text-muted-foreground">
              See what our customers say about their BridgePay experience
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="card-premium p-8 animate-slide-up" style={{ animationDelay: `${index * 0.15}s` }}>
                <div className="flex items-center gap-2 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`h-5 w-5 ${
                        i < testimonial.rating 
                          ? 'fill-yellow-400 text-yellow-400' 
                          : 'fill-gray-200 text-gray-200'
                      }`} 
                    />
                  ))}
                  <span className="text-sm text-muted-foreground ml-2">
                    {testimonial.rating}/5
                  </span>
                </div>
                <p className="text-foreground text-lg mb-6 leading-relaxed">
                  "{testimonial.content}"
                </p>
                <div className="flex items-center gap-4">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full border-2 border-border object-cover"
                  />
                  <div>
                    <div className="font-semibold text-foreground">{testimonial.name}</div>
                    <div className="text-muted-foreground text-sm">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container-padding py-20 bg-gradient-to-r from-brand-primary via-brand-secondary to-brand-accent relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=1920&h=1080&fit=crop&crop=center')] bg-cover bg-center opacity-10"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-4xl lg:text-6xl font-bold text-white mb-8">
            Ready to Transform Your Payments?
          </h2>
          <p className="text-xl lg:text-2xl text-white/90 mb-12">
            Join thousands of users who trust BridgePay for their GBP to USDT transfers
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              className="bg-white text-brand-primary hover:bg-white/90 text-lg px-8 py-4 h-16 font-bold shadow-2xl"
              onClick={() => navigate('/signup')}
            >
              Create Your Account
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              variant="outline"
              className="border-2 border-white text-white bg-transparent hover:bg-white hover:text-brand-primary text-lg px-8 py-4 h-16 font-bold"
              onClick={() => navigate('/login')}
            >
              <Download className="mr-2 h-5 w-5" />
              Get Mobile App
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-surface-elevated border-t border-border container-padding py-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-4 gap-12 mb-12">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-brand-primary to-brand-secondary rounded-2xl flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-white" />
                </div>
                <div className="text-2xl font-bold gradient-text">BridgePay</div>
              </div>
              <p className="text-muted-foreground mb-6">
                The future of GBP to USDT transfers. Fast, secure, and reliable.
              </p>
              <div className="flex gap-4">
                <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center hover:bg-brand-primary hover:text-white transition-colors cursor-pointer">
                  <Users className="h-5 w-5" />
                </div>
                <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center hover:bg-brand-primary hover:text-white transition-colors cursor-pointer">
                  <Globe className="h-5 w-5" />
                </div>
                <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center hover:bg-brand-primary hover:text-white transition-colors cursor-pointer">
                  <Smartphone className="h-5 w-5" />
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-bold text-foreground mb-4">Product</h3>
              <div className="space-y-3">
                <div className="text-muted-foreground hover:text-brand-primary cursor-pointer transition-colors">Features</div>
                <div className="text-muted-foreground hover:text-brand-primary cursor-pointer transition-colors">Pricing</div>
                <div className="text-muted-foreground hover:text-brand-primary cursor-pointer transition-colors">Security</div>
                <div className="text-muted-foreground hover:text-brand-primary cursor-pointer transition-colors">API</div>
              </div>
            </div>

            <div>
              <h3 className="font-bold text-foreground mb-4">Company</h3>
              <div className="space-y-3">
                <div className="text-muted-foreground hover:text-brand-primary cursor-pointer transition-colors">About</div>
                <div className="text-muted-foreground hover:text-brand-primary cursor-pointer transition-colors">Careers</div>
                <div className="text-muted-foreground hover:text-brand-primary cursor-pointer transition-colors">Press</div>
                <div className="text-muted-foreground hover:text-brand-primary cursor-pointer transition-colors">Contact</div>
              </div>
            </div>

            <div>
              <h3 className="font-bold text-foreground mb-4">Support</h3>
              <div className="space-y-3">
                <div className="text-muted-foreground hover:text-brand-primary cursor-pointer transition-colors">Help Center</div>
                <div className="text-muted-foreground hover:text-brand-primary cursor-pointer transition-colors">Documentation</div>
                <div className="text-muted-foreground hover:text-brand-primary cursor-pointer transition-colors">Status</div>
                <div className="text-muted-foreground hover:text-brand-primary cursor-pointer transition-colors">Community</div>
              </div>
            </div>
          </div>

          <div className="border-t border-border pt-8 flex flex-col lg:flex-row justify-between items-center">
            <div className="text-muted-foreground text-sm mb-4 lg:mb-0">
              © 2025 BridgePay. All rights reserved. FCA Regulated.
            </div>
            <div className="flex gap-6 text-sm">
              <div className="text-muted-foreground hover:text-brand-primary cursor-pointer transition-colors">Privacy Policy</div>
              <div className="text-muted-foreground hover:text-brand-primary cursor-pointer transition-colors">Terms of Service</div>
              <div className="text-muted-foreground hover:text-brand-primary cursor-pointer transition-colors">Cookies</div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
