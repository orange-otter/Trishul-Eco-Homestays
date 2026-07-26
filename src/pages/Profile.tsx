import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LogOut } from 'lucide-react';
import { Button } from '../components/ui';
import { Loader } from '../components/ui/Loader';
import Card from '../components/Card';

export default function Profile() {
  const { user, session, logout } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<any[]>([]);
  const [rooms, setRooms] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!session?.access_token) return;

    const cachedRooms = sessionStorage.getItem('homestays_rooms');
    const roomsPromise = cachedRooms 
      ? Promise.resolve(JSON.parse(cachedRooms))
      : fetch('/api/rooms').then(res => res.json());

    Promise.all([
      roomsPromise,
      fetch('/api/bookings/me', {
        headers: { 'Authorization': `Bearer ${session.access_token}` }
      }).then(res => res.json())
    ])
    .then(([roomsData, bookingsData]) => {
      const parsedRooms = Array.isArray(roomsData) ? roomsData : [];
      setRooms(parsedRooms);
      if (!cachedRooms) {
        sessionStorage.setItem('homestays_rooms', JSON.stringify(parsedRooms));
      }
      setBookings(Array.isArray(bookingsData) ? bookingsData : []);
    })
    .finally(() => setIsLoading(false));
  }, [session]);

  return (
    <div className="min-h-[70vh] py-16 px-6 max-w-[1200px] mx-auto animate-in fade-in duration-700">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">
        {/* Account Info Sidebar */}
        <div className="lg:col-span-1">
          <h1 className="text-3xl font-bold font-serif text-primary-hover dark:text-primary-light mb-6">My Profile</h1>
          <div className="h-fit bg-surface dark:bg-gray-900 p-8 rounded-2xl shadow-sm border border-border dark:border-gray-800">
            <div className="flex flex-col gap-6">
              <div className="border-b border-border dark:border-gray-800 pb-6">
                <span className="text-text-secondary text-sm uppercase tracking-wider font-semibold">Account Information</span>
              </div>
              
              <div className="flex flex-col gap-4">
                <div>
                  <span className="text-text-secondary text-sm block mb-1">Email Address</span>
                  <p className="text-lg font-medium text-text-primary dark:text-white break-all">{user?.email}</p>
                </div>
                
                <div>
                  <span className="text-text-secondary text-sm block mb-1">Account ID</span>
                  <p className="text-sm font-medium text-text-secondary truncate">{user?.id}</p>
                </div>
              </div>
              
              <div className="pt-6 border-t border-border dark:border-gray-800 mt-4">
                <Button variant="outline" onClick={logout} className="w-full flex items-center justify-center gap-2 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 border-red-200 dark:border-red-900/50">
                  <LogOut size={18} /> Sign Out
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Trips Section */}
        <div className="lg:col-span-2">
          <h1 className="text-3xl font-bold font-serif text-primary-hover dark:text-primary-light mb-6">My Trips</h1>
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader size="md" className="text-primary" />
            </div>
          ) : bookings.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {bookings.map(booking => {
                const room = rooms.find(r => r.id === booking.room_id);
                return (
                  <Card 
                    key={booking.id}
                    title={room?.name || "Unknown Homestay"}
                    description={`Check-in: ${booking.check_in} | Check-out: ${booking.check_out} | Total: ₹${booking.total_price}`}
                    image={room?.image_url || "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?auto=format&fit=crop&w=800&q=80"}
                    actionText="View Receipt"
                    onAction={() => alert('Receipt feature coming soon!')}
                  />
                );
              })}
            </div>
          ) : (
            <div className="bg-surface dark:bg-gray-900 p-8 rounded-2xl border border-dashed border-stone-300 dark:border-gray-700 text-center flex flex-col items-center justify-center min-h-[200px]">
              <p className="text-stone-500 dark:text-stone-400 mb-6">You haven't booked any trips yet.</p>
              <Button onClick={() => navigate('/dashboard')}>Explore Homestays</Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
