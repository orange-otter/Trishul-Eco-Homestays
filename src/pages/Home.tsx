import Hero from '../components/Hero';
import Card from '../components/Card';
import './Home.css';

export default function Home() {
  return (
    <div className="home-page">
      <Hero 
        headline="Discover Authentic Village Tourism"
        subheadline="Stay with local communities in Chopta, Uttarakhand. Experience sustainable travel that preserves nature and empowers locals."
        ctaText="Explore Homestays"
        ctaLink="/dashboard"
        image="/images/hero_banner_1782036855076.png"
      />
      
      <section className="featured-section">
        <div className="container">
          <h2 className="section-title text-center mb-8">Featured Eco-Homestays</h2>
          <div className="card-grid">
            <div className="animate-fade-in delay-100">
              <Card 
                title="Himalayan Heritage Home"
                description="A traditional stone and wood house offering panoramic views of the Trishul peaks. Includes home-cooked organic meals."
                image="/images/himalayan_home_1782036868366.png"
                actionText="View Details"
                actionLink="/dashboard"
              />
            </div>
            <div className="animate-fade-in delay-200">
              <Card 
                title="Forest Edge Retreat"
                description="Located near the Kedarnath Wildlife Sanctuary border. Perfect for bird watchers and nature enthusiasts."
                image="/images/forest_retreat_1782036881847.png"
                actionText="View Details"
                actionLink="/dashboard"
              />
            </div>
            <div className="animate-fade-in delay-300">
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
