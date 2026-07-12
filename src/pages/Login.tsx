import { useState } from 'react';
import { Button, Input } from '../components/ui';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const url = isLogin ? '/api/auth/login' : '/api/auth/register';
    const body = isLogin 
      ? { email, password } 
      : { name, email, password };

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.detail || 'Authentication failed');
      }

      login(data.access_token);
      toast.success(isLogin ? 'Successfully logged in!' : 'Account created successfully!');
      navigate('/');
    } catch (err: any) {
      toast.error(err.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = '/api/auth/login/google';
  };

  const handleGithubLogin = () => {
    window.location.href = '/api/auth/login/github';
  };

  return (
    <div className="min-h-[60vh] py-16 flex justify-center items-center px-4">
      <div className="w-full max-w-[450px] bg-surface dark:bg-gray-800 p-10 rounded-2xl shadow-md border border-border dark:border-gray-700">
        <h1 className="text-4xl font-bold text-primary-hover dark:text-primary-light text-center mb-4 font-serif">
          {isLogin ? 'Welcome Back' : 'Create Account'}
        </h1>
        <p className="text-lg text-text-secondary dark:text-gray-400 text-center mb-8">
          {isLogin ? 'Login to manage your bookings and homestays.' : 'Sign up to start booking your next eco-friendly stay.'}
        </p>
        
        <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
          {!isLogin && (
            <Input 
              label="Full Name" 
              type="text" 
              placeholder="John Doe" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          )}
          <Input 
            label="Email Address" 
            type="email" 
            placeholder="hello@example.com" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input 
            label="Password" 
            type="password" 
            placeholder="••••••••" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Button variant="primary" size="lg" className="w-full mt-4" disabled={isLoading}>
            {isLoading ? 'Processing...' : (isLogin ? 'Sign In' : 'Sign Up')}
          </Button>
        </form>

        <div className="relative flex items-center py-5 mt-4">
          <div className="flex-grow border-t border-gray-300 dark:border-gray-600"></div>
          <span className="flex-shrink-0 mx-4 text-gray-400 text-sm">Or continue with</span>
          <div className="flex-grow border-t border-gray-300 dark:border-gray-600"></div>
        </div>

        <div className="flex flex-col gap-3">
          <Button variant="outline" className="w-full" onClick={handleGoogleLogin}>
            Google
          </Button>
          <Button variant="outline" className="w-full" onClick={handleGithubLogin}>
            GitHub
          </Button>
        </div>
        
        <p className="text-center mt-8 text-text-secondary dark:text-gray-400 text-sm">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <span 
            className="text-primary dark:text-primary-light font-medium cursor-pointer hover:underline"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? 'Sign up' : 'Sign in'}
          </span>
        </p>
      </div>
    </div>
  );
}
