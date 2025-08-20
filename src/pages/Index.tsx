
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';

const Index = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    // Redirect based on auth status
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    } else {
      // Show landing page instead of redirecting
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  // This component should not render anything as it redirects immediately
  return null;
};

export default Index;
