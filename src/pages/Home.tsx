import Hero from '../components/Hero';
import Card from '../components/Card';

export default function Home() {
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100 fill-mode-both">
              <Card 
                title="Himalayan Heritage Home"
                description="A traditional stone and wood house offering panoramic views of the Trishul peaks. Includes home-cooked organic meals."
                image="/images/himalayan_home_1782036868366.png"
                actionText="View Details"
                actionLink="/dashboard?select=Himalayan Heritage Home"
              />
            </div>
            <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200 fill-mode-both">
              <Card 
                title="Chopta Eco Retreat"
                description="Nestled in the lush meadows of Chopta, this retreat offers panoramic views of the Trishul peak and runs entirely on solar power."
                image="/images/forest_retreat_1782036881847.png"
                actionText="View Details"
                actionLink="/dashboard?select=Chopta Eco Retreat"
              />
            </div>
            <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300 fill-mode-both">
              <Card 
                title="Garhwal Valley Homestay"
                description="A traditional home run by local village village women. Learn Garhwali cooking, participate in organic farming, and explore remote mountain paths."
                image="/images/village_stay_1782036896920.png"
                actionText="View Details"
                actionLink="/dashboard?select=Garhwal Valley"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
