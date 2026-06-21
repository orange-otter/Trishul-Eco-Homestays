import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from './ui';

interface HeroProps {
  headline: string;
  subheadline: string;
  ctaText: string;
  ctaLink: string;
  image?: string;
}

export default function Hero({ headline, subheadline, ctaText, ctaLink, image }: HeroProps) {
  return (
    <section className="py-16 md:py-24 overflow-hidden">
      <div className="max-w-[1200px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="flex flex-col gap-6 lg:pr-8">
          <h1 className="text-5xl md:text-6xl font-bold font-serif text-text-primary dark:text-white leading-tight animate-in slide-in-from-bottom-4 duration-700">
            {headline}
          </h1>
          <p className="text-lg md:text-xl text-text-secondary dark:text-gray-400 leading-relaxed animate-in slide-in-from-bottom-4 duration-700 delay-150">
            {subheadline}
          </p>
          <div className="mt-4 animate-in slide-in-from-bottom-4 duration-700 delay-300">
            <Link to={ctaLink}>
              <Button size="lg" className="gap-2">
                {ctaText} <ArrowRight size={20} />
              </Button>
            </Link>
          </div>
        </div>
        {image && (
          <div className="relative rounded-2xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-1000 delay-200 aspect-[4/3] md:aspect-auto h-full min-h-[400px] group">
            <img 
              src={image} 
              alt={headline} 
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" 
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent pointer-events-none" />
          </div>
        )}
      </div>
    </section>
  );
}
