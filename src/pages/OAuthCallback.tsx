import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Loader } from '../components/ui/Loader';
import { toast } from 'react-hot-toast';

export default function OAuthCallback() {
  const { session } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (session) {
      toast.success('Successfully logged in!');
      navigate('/');
    }
  }, [session, navigate]);

  return (
    <div className="flex h-[50vh] items-center justify-center flex-col gap-4">
      <Loader size="lg" className="text-primary" />
      <p className="text-text-secondary">Completing authentication...</p>
    </div>
  );
}
