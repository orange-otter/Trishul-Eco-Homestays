import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Loader } from '../components/ui/Loader';
import { toast } from 'react-hot-toast';

export default function OAuthCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    const token = searchParams.get('token');
    
    if (token) {
      login(token);
      toast.success('Successfully logged in!');
      navigate('/');
    } else {
      toast.error('Authentication failed. No token received.');
      navigate('/login');
    }
  }, [searchParams, navigate, login]);

  return (
    <div className="flex h-[50vh] items-center justify-center flex-col gap-4">
      <Loader size="lg" className="text-primary" />
      <p className="text-text-secondary">Completing authentication...</p>
    </div>
  );
}
