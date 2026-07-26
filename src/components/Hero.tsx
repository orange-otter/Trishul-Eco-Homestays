import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { MagneticButton, FadeUpReveal } from './ui';

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
        <div className="flex flex-col gap-6 lg:pr-8 text-center lg:text-left items-center lg:items-start">
          <FadeUpReveal delay={0.1}>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-serif text-text-primary dark:text-white leading-tight">
              {headline}
            </h1>
          </FadeUpReveal>
          <FadeUpReveal delay={0.2}>
            <p className="text-lg md:text-xl text-text-secondary dark:text-gray-400 leading-relaxed">
              {subheadline}
            </p>
          </FadeUpReveal>
          <FadeUpReveal delay={0.3} className="mt-4">
            <Link to={ctaLink}>
              <MagneticButton size="lg" className="gap-2">
                {ctaText} <ArrowRight size={20} />
              </MagneticButton>
            </Link>
          </FadeUpReveal>
        </div>
        {image && (
          <FadeUpReveal delay={0.2} className="w-full h-full">
            <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl aspect-[4/3] md:aspect-auto md:min-h-[400px] group">
              <img 
                src={image} 
                alt={headline} 
                className="absolute inset-0 w-full h-full object-cover object-[60%_center] md:object-center group-hover:scale-105 transition-transform duration-1000" 
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent pointer-events-none" />
            </div>
          </FadeUpReveal>
        )}
      </div>
    </section>
  );
}
