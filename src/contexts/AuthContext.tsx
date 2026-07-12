import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: number;
  name: string;
  email: string;
  is_admin: boolean;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
      fetchUserProfile(token);
    } else {
      localStorage.removeItem('token');
      setUser(null);
      setIsLoading(false);
    }
  }, [token]);

  const fetchUserProfile = async (tokenStr: string) => {
    try {
      const res = await fetch('/api/auth/me', {
        headers: { Authorization: `Bearer ${tokenStr}` },
      });
      if (res.ok) {
        const userData = await res.json();
        setUser(userData);
      } else {
        setToken(null);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      setToken(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = (newToken: string) => {
    setToken(newToken);
  };

  const logout = () => {
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
