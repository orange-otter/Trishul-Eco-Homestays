export default function About() {
  return (
    <div className="min-h-[60vh] py-16 md:py-24 px-6 max-w-[1200px] mx-auto">
      <h1 className="text-4xl md:text-5xl font-bold font-serif text-primary-hover dark:text-primary-light mb-6 animate-in slide-in-from-bottom-4 duration-700">
        About Trishul Eco-Homestays
      </h1>
      <p className="text-lg md:text-xl text-text-secondary dark:text-gray-400 max-w-[800px] leading-relaxed mb-16 animate-in slide-in-from-bottom-4 duration-700 delay-150">
        We are a platform dedicated to sustainable village tourism in Chopta, Uttarakhand. Our mission is to provide travelers with authentic cultural immersion while bringing sustainable livelihood opportunities to local village communities, preserving their eco-sensitive region.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in slide-in-from-bottom-8 duration-700 delay-300">
        <div className="bg-surface dark:bg-gray-800 p-8 rounded-2xl border border-border dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
          <h3 className="text-2xl font-serif font-bold text-primary-hover dark:text-primary-light mb-4">For Travelers</h3>
          <p className="text-text-secondary dark:text-gray-400 leading-relaxed">Conscious travelers looking for authentic village tourism experiences, community hospitality, and cultural immersion packages.</p>
        </div>
        <div className="bg-surface dark:bg-gray-800 p-8 rounded-2xl border border-border dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
          <h3 className="text-2xl font-serif font-bold text-primary-hover dark:text-primary-light mb-4">For Local Communities</h3>
          <p className="text-text-secondary dark:text-gray-400 leading-relaxed">Residents of remote villages who provide hospitality services. We bring sustainable livelihood opportunities while preserving the region.</p>
        </div>
      </div>
    </div>
  );
}
