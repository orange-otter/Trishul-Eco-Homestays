import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/Card';
import { FadeUpReveal, MagneticButton } from '../components/ui';
import { Loader } from '../components/ui/Loader';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-hot-toast';
import { AIAssistant } from '../components/AIAssistant';
import { X } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function Dashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [rooms, setRooms] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<any | null>(null);
  const [checkIn, setCheckIn] = useState<string>('');
  const [checkOut, setCheckOut] = useState<string>('');
  const [isBookingStep, setIsBookingStep] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user, session } = useAuth();
  const navigate = useNavigate();

  const fetchBookings = () => {
    if (!session?.access_token) return;
    fetch('/api/bookings/me', {
      headers: { 'Authorization': `Bearer ${session.access_token}` }
    })
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch bookings");
        return res.json();
      })
      .then(data => setBookings(Array.isArray(data) ? data : []))
      .catch(err => {
        console.error(err);
        setBookings([]);
      });
  };

  const handleBook = (roomId: number) => {
    if (!user) {
      toast.error('Please log in to book a homestay');
      navigate('/login');
      return;
    } 
    if (!checkIn || !checkOut) {
      toast.error('Please select check-in and check-out dates');
      return;
    }

    const room = rooms.find(r => r.id === roomId);
    if (!room) return;

    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const nights = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    
    if (nights <= 0) {
      toast.error('Check-out must be after check-in');
      return;
    }

    setIsSubmitting(true);
    fetch('/api/bookings', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session?.access_token}`
      },
      body: JSON.stringify({
        room_id: roomId,
        check_in: checkIn,
        check_out: checkOut,
        total_price: room.price * nights
      })
    })
    .then(res => {
      if (!res.ok) throw new Error("Failed to book");
      return res.json();
    })
    .then(() => {
      toast.success('Successfully booked homestay!');
      confetti({
        particleCount: 150,
        spread: 90,
        origin: { y: 0.6 },
        colors: ['#059669', '#10b981', '#fbbf24', '#f59e0b']
      });
      setSelectedRoom(null);
      setIsBookingStep(false);
      setCheckIn('');
      setCheckOut('');
      fetchBookings();
    })
    .catch(err => {
      console.error(err);
      toast.error('Failed to book homestay.');
    })
    .finally(() => {
      setIsSubmitting(false);
    });
  };

  const handleCancelBooking = (bookingId: number) => {
    if (window.confirm("Are you sure you want to cancel this trip?")) {
      fetch(`/api/bookings/${bookingId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${session?.access_token}` }
      })
      .then(res => {
        if (!res.ok) throw new Error("Failed to cancel booking");
        toast.success("Trip cancelled successfully");
        fetchBookings();
      })
      .catch(err => {
        console.error(err);
        toast.error("Failed to cancel trip");
      });
    }
  };

  useEffect(() => {
    const cachedRooms = sessionStorage.getItem('homestays_rooms');
    
    if (cachedRooms) {
      const roomsData = JSON.parse(cachedRooms);
      setRooms(roomsData);
      setIsLoading(false);
      
      const searchParams = new URLSearchParams(window.location.search);
      const selectParam = searchParams.get('select');
      if (selectParam && roomsData.length > 0) {
        const found = roomsData.find((r: any) => 
          r.name.toLowerCase().includes(selectParam.toLowerCase())
        );
        if (found) {
          setSelectedRoom(found);
        }
      }
    } else {
      fetch('/api/rooms')
        .then((res) => {
          if (!res.ok) throw new Error("Failed to fetch rooms");
          return res.json();
        })
        .then((data) => {
          const roomsData = Array.isArray(data) ? data : [];
          setRooms(roomsData);
          sessionStorage.setItem('homestays_rooms', JSON.stringify(roomsData));
          setIsLoading(false);
  
          // Check for URL select parameter
          const searchParams = new URLSearchParams(window.location.search);
          const selectParam = searchParams.get('select');
          if (selectParam && roomsData.length > 0) {
            const found = roomsData.find((r: any) => 
              r.name.toLowerCase().includes(selectParam.toLowerCase())
            );
            if (found) {
              setSelectedRoom(found);
            }
          }
        })
        .catch((err) => {
          console.error("Failed to fetch rooms:", err);
          setRooms([]);
          setIsLoading(false);
        });
    }
      
    if (user && session?.access_token) {
      fetchBookings();
    }
  }, [user, session]);

  return (
    <div className="min-h-[60vh] py-16 md:py-24 px-6 max-w-[1200px] mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 border-b border-border dark:border-gray-800 pb-6">
        <div>
          <FadeUpReveal delay={0.1}>
            <h1 className="text-4xl md:text-5xl font-bold font-serif text-primary-hover dark:text-primary-light mb-4">
              Homestays Dashboard
            </h1>
          </FadeUpReveal>
          <FadeUpReveal delay={0.2}>
            <p className="text-lg md:text-xl text-text-secondary dark:text-gray-400 max-w-[800px] leading-relaxed">
              Welcome back, Traveler! Here are your upcoming trips and new eco-homestays to discover.
            </p>
          </FadeUpReveal>
        </div>
        <FadeUpReveal delay={0.3}>
          <MagneticButton 
            className="mt-6 md:mt-0 shadow-lg shadow-primary/20"
            onClick={() => {
              document.getElementById('recommended-section')?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            Book New Stay
          </MagneticButton>
        </FadeUpReveal>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <Loader size="lg" className="text-primary" />
        </div>
      ) : (
        <div className="flex flex-col gap-12">
          {/* Top Section: AI Assistant */}
          <FadeUpReveal delay={0.4}>
            <section className="w-full">
              <AIAssistant />
            </section>
          </FadeUpReveal>
          
          {/* Middle Section: User Bookings */}
          {bookings.length > 0 && (
            <FadeUpReveal delay={0.5}>
              <section className="flex flex-col gap-6">
                <h3 className="text-2xl font-serif font-bold text-primary-hover dark:text-primary-light mb-2">
                  Your Upcoming Trips
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {bookings.map((booking) => {
                    const room = rooms.find(r => r.id === booking.room_id);
                    return (
                      <Card 
                        key={booking.id}
                        title={room?.name || "Unknown Homestay"}
                        description={`Check-in: ${booking.check_in} | Check-out: ${booking.check_out} | Total: ₹${booking.total_price}`}
                        image={room?.image_url || "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?auto=format&fit=crop&w=800&q=80"}
                        actionText="View Details"
                        onAction={() => room && setSelectedRoom(room)}
                      >
                        <button 
                          onClick={() => handleCancelBooking(booking.id)}
                          className="text-red-500 hover:text-red-700 dark:hover:text-red-400 font-semibold text-sm transition-colors flex items-center gap-1 cursor-pointer bg-transparent border-none p-0"
                        >
                          <X size={16} /> Cancel Trip
                        </button>
                      </Card>
                    );
                  })}
                </div>
              </section>
            </FadeUpReveal>
          )}
          
          {/* Bottom Section: Recommended Homestays */}
          <section id="recommended-section" className="flex flex-col gap-6">
            <FadeUpReveal delay={0.2}>
              <h3 className="text-2xl font-serif font-bold text-primary-hover dark:text-primary-light mb-2">
                Recommended for You
              </h3>
            </FadeUpReveal>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {rooms.map((stay, i) => (
                <FadeUpReveal key={stay.id} delay={0.1 * (i + 1)}>
                  <Card 
                    title={stay.name}
                    description={stay.description || "A wonderful homestay in Chopta."}
                    image={stay.image_url || "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?auto=format&fit=crop&w=800&q=80"}
                    actionText="View Details & Book"
                    onAction={() => setSelectedRoom(stay)}
                  />
                </FadeUpReveal>
              ))}
            </div>
          </section>
        </div>
      )}

      {/* Homestay Detail Modal Box */}
      {selectedRoom && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 md:p-6">
          <div className="bg-white dark:bg-gray-900 rounded-3xl overflow-hidden max-w-[900px] w-full shadow-2xl relative flex flex-col md:flex-row animate-in fade-in zoom-in-95 duration-300 max-h-[95vh] md:max-h-[85vh]">
            
            {/* Modal Image */}
            <div className="w-full md:w-5/12 h-56 md:h-auto relative shrink-0">
              <img 
                src={selectedRoom.image_url} 
                alt={selectedRoom.name} 
                className="absolute inset-0 w-full h-full object-cover" 
              />
            </div>

            {/* Modal Body */}
            <div className="w-full md:w-7/12 p-5 md:p-7 flex flex-col relative overflow-y-auto">
              {/* Close Button */}
              <button 
                onClick={() => setSelectedRoom(null)}
                className="absolute top-4 right-4 md:top-6 md:right-6 p-2 bg-stone-100 hover:bg-stone-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-stone-500 dark:text-stone-400 rounded-full transition-colors z-10"
                aria-label="Close details"
              >
                <X size={20} />
              </button>

              <div className="flex flex-col h-full">
                <h2 className="text-2xl md:text-3xl font-serif font-bold text-primary-hover dark:text-primary-light pr-12 mb-3 leading-tight mt-1 md:mt-0">
                  {selectedRoom.name}
                </h2>
                
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <span className="text-xl font-bold text-emerald-700 dark:text-emerald-400">
                    ₹{selectedRoom.price} <span className="text-sm text-stone-500 dark:text-stone-400 font-normal">/ night</span>
                  </span>
                  <span className={`text-sm px-3 py-1 rounded-full font-medium ${
                    selectedRoom.is_available 
                      ? 'bg-emerald-100/80 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-400' 
                      : 'bg-red-100/80 text-red-800 dark:bg-red-900/50 dark:text-red-400'
                  }`}>
                    {selectedRoom.is_available ? 'Available' : 'Sold Out'}
                  </span>
                </div>

                {/* Extra Details / Amenities */}
                {!isBookingStep ? (
                  <div className="flex flex-col flex-grow">
                    <p className="text-text-secondary dark:text-gray-400 leading-relaxed text-[15px] mb-5 flex-grow">
                      {selectedRoom.description}
                    </p>
                    
                    <div className="mb-6">
                      <h4 className="text-xs font-bold uppercase tracking-widest text-stone-400 mb-2.5">Features & Amenities</h4>
                      <div className="flex flex-wrap gap-2 text-sm font-medium">
                        <span className="bg-stone-50 dark:bg-gray-800 text-stone-600 dark:text-stone-300 px-3 py-1.5 rounded-lg border border-stone-100 dark:border-gray-700">100% Eco-Friendly</span>
                        <span className="bg-stone-50 dark:bg-gray-800 text-stone-600 dark:text-stone-300 px-3 py-1.5 rounded-lg border border-stone-100 dark:border-gray-700">Organic Meals</span>
                        <span className="bg-stone-50 dark:bg-gray-800 text-stone-600 dark:text-stone-300 px-3 py-1.5 rounded-lg border border-stone-100 dark:border-gray-700">Guided Treks</span>
                        <span className="bg-stone-50 dark:bg-gray-800 text-stone-600 dark:text-stone-300 px-3 py-1.5 rounded-lg border border-stone-100 dark:border-gray-700">Solar Powered</span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 mt-auto pt-4 border-t border-stone-100 dark:border-gray-800">
                      <button 
                        onClick={() => { setSelectedRoom(null); setIsBookingStep(false); }}
                        className="flex-1 py-3 px-5 rounded-xl border-2 border-stone-200 dark:border-gray-700 text-stone-700 dark:text-stone-300 font-bold hover:bg-stone-50 dark:hover:bg-gray-800 transition-colors"
                      >
                        Cancel
                      </button>
                      <button 
                        onClick={() => {
                          if (!user) {
                            toast.error('Please log in to book a homestay');
                            navigate('/login');
                          } else {
                            setIsBookingStep(true);
                          }
                        }}
                        disabled={!selectedRoom.is_available}
                        className={`flex-[2] py-3 px-5 rounded-xl font-bold tracking-wide transition-all duration-300 text-center text-white ${
                          selectedRoom.is_available
                            ? 'bg-emerald-700 hover:bg-emerald-800 hover:-translate-y-0.5 shadow-lg shadow-emerald-900/20 dark:bg-emerald-600 dark:hover:bg-emerald-700'
                            : 'bg-stone-300 cursor-not-allowed dark:bg-gray-700 dark:text-stone-500'
                        }`}
                      >
                        Book Stay Now
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col flex-grow">
                    <div className="flex flex-col gap-4 flex-grow mb-6">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-semibold text-stone-700 dark:text-stone-300">Check-in Date</label>
                        <input 
                          type="date" 
                          value={checkIn}
                          onChange={(e) => setCheckIn(e.target.value)}
                          min={new Date().toISOString().split('T')[0]}
                          className="p-3 rounded-xl border-2 border-stone-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-stone-800 dark:text-stone-200 focus:outline-none focus:border-emerald-500 focus:ring-0 transition-colors"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-semibold text-stone-700 dark:text-stone-300">Check-out Date</label>
                        <input 
                          type="date" 
                          value={checkOut}
                          onChange={(e) => setCheckOut(e.target.value)}
                          min={checkIn || new Date().toISOString().split('T')[0]}
                          className="p-3 rounded-xl border-2 border-stone-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-stone-800 dark:text-stone-200 focus:outline-none focus:border-emerald-500 focus:ring-0 transition-colors"
                        />
                      </div>
                      
                      {checkIn && checkOut && new Date(checkOut) > new Date(checkIn) && (
                        <div className="mt-2 p-4 bg-emerald-50/50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-900/30 rounded-xl flex justify-between items-center">
                          <span className="font-semibold text-stone-700 dark:text-stone-300">Total for Stay:</span>
                          <span className="font-bold text-xl text-emerald-700 dark:text-emerald-400">
                            ₹{selectedRoom.price * Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24))}
                          </span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex gap-3 mt-auto pt-4 border-t border-stone-100 dark:border-gray-800">
                      <button 
                        onClick={() => setIsBookingStep(false)}
                        className="flex-1 py-3 px-5 rounded-xl border-2 border-stone-200 dark:border-gray-700 text-stone-700 dark:text-stone-300 font-bold hover:bg-stone-50 dark:hover:bg-gray-800 transition-colors"
                      >
                        Back
                      </button>
                      <button 
                        onClick={() => handleBook(selectedRoom.id)}
                        disabled={isSubmitting || !checkIn || !checkOut || new Date(checkOut) <= new Date(checkIn)}
                        className={`flex-[2] py-3 px-5 rounded-xl font-bold transition-all duration-300 text-white ${
                          !isSubmitting && checkIn && checkOut && new Date(checkOut) > new Date(checkIn)
                            ? 'bg-emerald-700 hover:bg-emerald-800 hover:-translate-y-0.5 shadow-lg shadow-emerald-900/20 dark:bg-emerald-600 dark:hover:bg-emerald-700'
                            : 'bg-stone-300 cursor-not-allowed dark:bg-gray-700 dark:text-stone-500'
                        }`}
                      >
                        {isSubmitting ? 'Booking...' : 'Confirm Booking'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
