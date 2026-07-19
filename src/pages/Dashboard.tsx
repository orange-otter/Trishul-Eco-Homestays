import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/Card';
import { Button } from '../components/ui';
import { Loader } from '../components/ui/Loader';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-hot-toast';
import { AIAssistant } from '../components/AIAssistant';

export default function Dashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [rooms, setRooms] = useState<any[]>([]);
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleBook = (_roomId: number) => {
    if (!user) {
      toast.error('Please log in to book a homestay');
      navigate('/login');
    } else {
      toast.success('Booking functionality coming soon!');
      // navigate(`/book/${roomId}`);
    }
  };

  useEffect(() => {
    fetch('/api/rooms')
      .then((res) => res.json())
      .then((data) => {
        setRooms(data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch rooms:", err);
        setIsLoading(false);
      });
  }, []);

  return (
    <div className="min-h-[60vh] py-16 md:py-24 px-6 max-w-[1200px] mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 border-b border-border dark:border-gray-800 pb-6">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold font-serif text-primary-hover dark:text-primary-light mb-4 animate-in slide-in-from-bottom-4 duration-700">
            Homestays Dashboard
          </h1>
          <p className="text-lg md:text-xl text-text-secondary dark:text-gray-400 max-w-[800px] leading-relaxed animate-in slide-in-from-bottom-4 duration-700 delay-150">
            Welcome back, Traveler! Here are your upcoming trips and new eco-homestays to discover.
          </p>
        </div>
        <Button className="mt-6 md:mt-0 shadow-lg shadow-primary/20">
          Book New Stay
        </Button>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <Loader size="lg" className="text-primary" />
        </div>
      ) : (
        <div className="flex flex-col gap-12 animate-in fade-in duration-1000">
          {/* Top Section: AI Assistant */}
          <section className="w-full">
            <AIAssistant />
          </section>
          
          {/* Bottom Section: Recommended Homestays (expanded to 3 columns) */}
          <section className="flex flex-col gap-6">
            <h3 className="text-2xl font-serif font-bold text-primary-hover dark:text-primary-light mb-2">
              Recommended for You
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {rooms.map((stay) => (
                <Card 
                  key={stay.id}
                  title={stay.name}
                  description={stay.description || "A wonderful homestay in Chopta."}
                  image={stay.image_url || "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?auto=format&fit=crop&w=800&q=80"}
                  actionText={`Book for ₹${stay.price}`}
                  onAction={() => handleBook(stay.id)}
                />
              ))}
            </div>
          </section>
        </div>
      )}
    </div>
  );
}

