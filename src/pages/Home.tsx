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
                actionLink="/dashboard"
              />
            </div>
            <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200 fill-mode-both">
              <Card 
                title="Forest Edge Retreat"
                description="Located near the Kedarnath Wildlife Sanctuary border. Perfect for bird watchers and nature enthusiasts."
                image="/images/forest_retreat_1782036881847.png"
                actionText="View Details"
                actionLink="/dashboard"
              />
            </div>
            <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300 fill-mode-both">
              <Card 
                title="Village Community Stay"
                description="Immerse yourself in local culture. Participate in farming, traditional cooking, and village walks."
                image="/images/village_stay_1782036896920.png"
                actionText="View Details"
                actionLink="/dashboard"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
