import { useState, useEffect } from 'react';
import Hero from '../components/Hero';
import Card from '../components/Card';
import { Loader } from '../components/ui/Loader';

interface Room {
  id: number;
  name: string;
  price: number;
  description: string;
  image_url: string;
  is_available: boolean;
}

export default function Home() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('/api/rooms')
      .then((res) => {
        if (!res.ok) throw new Error("Network response was not ok");
        return res.json();
      })
      .then((data) => {
        setRooms(Array.isArray(data) ? data : []);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch rooms:", err);
        setRooms([]);
        setIsLoading(false);
      });
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Hero 
        headline="Discover Authentic Village Tourism"
        subheadline="Stay with local communities in Chopta, Uttarakhand. Experience sustainable travel that preserves nature and empowers locals."
        ctaText="Explore Homestays"
        ctaLink="/dashboard"
        image="/images/hero_banner_1782036855076.png"
      />
      
      <section className="py-20 bg-background dark:bg-gray-950">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-text-primary dark:text-white mb-4">Featured Eco-Homestays</h2>
            <div className="w-24 h-1 bg-primary mx-auto rounded-full" />
          </div>
          
          {isLoading ? (
            <div className="flex justify-center py-10">
              <Loader size="lg" className="text-primary" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {rooms.slice(0, 3).map((room, index) => (
                <div key={room.id} className={`animate-in fade-in slide-in-from-bottom-8 duration-700 delay-${(index + 1) * 100} fill-mode-both`}>
                  <Card 
                    title={room.name}
                    description={room.description || "A beautiful homestay."}
                    image={room.image_url || "/images/himalayan_home_1782036868366.png"}
                    actionText="View Details"
                    actionLink={`/dashboard?select=${encodeURIComponent(room.name)}`}
                  />
                </div>
              ))}
              {rooms.length === 0 && (
                <div className="col-span-full text-center text-text-secondary py-10">
                  No homestays available right now.
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
