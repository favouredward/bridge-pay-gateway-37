
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuthStore } from '@/store/authStore';
import { mockUsers } from '@/data/mockData';
import { toast } from 'sonner';
import { Eye, EyeOff, Shield } from 'lucide-react';

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const { signIn, setLoading } = useAuthStore();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);

    try {
      const { error } = await signIn(formData.email, formData.password);
      
      if (error) {
        toast.error(error);
        return;
      }

      toast.success('Admin login successful!');
      navigate('/admin/dashboard');
    } catch (error) {
      toast.error('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="page-container flex items-center justify-center container-padding">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex p-4 bg-brand-secondary/10 rounded-full">
            <Shield className="h-8 w-8 text-brand-secondary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-brand-primary">BridgePay Admin</h1>
            <p className="text-muted-foreground">Sign in to admin dashboard</p>
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="form-label">Admin Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              className="form-input"
              placeholder="admin@bridgepay.com"
            />
            {errors.email && <p className="form-error">{errors.email}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="form-label">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => handleChange('password', e.target.value)}
                className="form-input pr-10"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {errors.password && <p className="form-error">{errors.password}</p>}
          </div>

          <Button type="submit" className="btn-secondary w-full">
            Sign In to Admin
          </Button>
        </form>

        {/* Demo Credentials */}
        <div className="card-primary p-4 bg-muted/30">
          <h3 className="font-semibold text-foreground mb-2">Demo Admin Credentials</h3>
          <div className="space-y-1 text-sm">
            <p><strong>Email:</strong> admin@bridgepay.com</p>
            <p><strong>Password:</strong> admin123</p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center">
          <button
            onClick={() => navigate('/')}
            className="text-brand-primary hover:underline text-sm"
          >
            Back to main site
          </button>
        </div>
      </div>
    </div>
  );
}
