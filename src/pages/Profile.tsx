import { useAuth } from '../contexts/AuthContext';
import { LogOut } from 'lucide-react';
import { Button } from '../components/ui';

export default function Profile() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-[70vh] py-16 px-6 max-w-[800px] mx-auto animate-in fade-in duration-700">
      <h1 className="text-3xl font-bold font-serif text-primary-hover dark:text-primary-light mb-8">My Profile</h1>
      
      <div className="bg-surface dark:bg-gray-900 p-8 rounded-2xl shadow-sm border border-border dark:border-gray-800">
        <div className="flex flex-col gap-6">
          <div className="border-b border-border dark:border-gray-800 pb-6">
            <span className="text-text-secondary text-sm uppercase tracking-wider font-semibold">Account Information</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <span className="text-text-secondary text-sm block mb-1">Email Address</span>
              <p className="text-lg font-medium text-text-primary dark:text-white">{user?.email}</p>
            </div>
            
            <div>
              <span className="text-text-secondary text-sm block mb-1">Account ID</span>
              <p className="text-sm font-medium text-text-secondary truncate">{user?.id}</p>
            </div>
          </div>
          
          <div className="pt-6 border-t border-border dark:border-gray-800 mt-4">
            <Button variant="outline" onClick={logout} className="flex items-center gap-2 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 border-red-200 dark:border-red-900/50">
              <LogOut size={18} /> Sign Out
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
