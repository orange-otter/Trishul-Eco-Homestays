import React, { useState, useEffect } from 'react';
import Card from '../components/Card';
import { Calendar, MapPin, Star } from 'lucide-react';
import { Button } from '../components/ui';
import { Loader } from '../components/ui/Loader';

export default function Dashboard() {
  const [isLoading, setIsLoading] = useState(true);

  const [rooms, setRooms] = useState<any[]>([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/rooms')
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 animate-in fade-in duration-1000">
          {/* Left Column: Upcoming Bookings */}
          <div className="lg:col-span-1 flex flex-col gap-6">
            <h3 className="text-2xl font-serif font-bold text-primary-hover dark:text-primary-light flex items-center gap-2">
              <Calendar className="text-secondary" /> Upcoming Stays
            </h3>
            
            <div className="bg-surface dark:bg-gray-900 rounded-2xl p-6 border border-border dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="font-bold text-lg text-text-primary dark:text-white">Tungnath Trail House</h4>
                  <p className="text-sm text-text-secondary dark:text-gray-400 flex items-center gap-1 mt-1">
                    <MapPin size={14} /> Sari Village, Chopta
                  </p>
                </div>
                <span className="bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-light text-xs font-bold px-2 py-1 rounded-full">
                  CONFIRMED
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm mb-6 bg-background dark:bg-gray-800 p-4 rounded-xl border border-border dark:border-gray-700">
                <div>
                  <p className="text-text-secondary dark:text-gray-500 text-xs uppercase tracking-wider mb-1">Check-in</p>
                  <p className="font-semibold dark:text-gray-200">Oct 12, 2026</p>
                </div>
                <div>
                  <p className="text-text-secondary dark:text-gray-500 text-xs uppercase tracking-wider mb-1">Check-out</p>
                  <p className="font-semibold dark:text-gray-200">Oct 15, 2026</p>
                </div>
              </div>
              <Button variant="outline" className="w-full justify-center">View Itinerary</Button>
            </div>
            
            <div className="bg-surface dark:bg-gray-900 rounded-2xl p-8 border border-dashed border-border dark:border-gray-700 text-center flex flex-col items-center justify-center gap-3 opacity-70">
              <Star className="text-gray-400" size={32} />
              <p className="text-text-secondary dark:text-gray-400 font-medium">No other upcoming trips</p>
            </div>
          </div>
          
          {/* Right Column: Discover */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <h3 className="text-2xl font-serif font-bold text-primary-hover dark:text-primary-light mb-2">
              Recommended for You
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {rooms.map((stay) => (
                <Card 
                  key={stay.id}
                  title={stay.name}
                  description={stay.description || "A wonderful homestay in Chopta."}
                  image={"https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?auto=format&fit=crop&w=800&q=80"}
                  actionText={`Book for ₹${stay.price}`}
                  actionLink={`/dashboard`}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
