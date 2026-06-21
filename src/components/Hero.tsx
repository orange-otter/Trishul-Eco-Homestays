import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import './Hero.css';

interface HeroProps {
  headline: string;
  subheadline: string;
  ctaText: string;
  ctaLink: string;
  image?: string;
}

export default function Hero({ headline, subheadline, ctaText, ctaLink, image }: HeroProps) {
  return (
    <section className="hero">
      <div className="container hero-container">
        <div className="hero-content">
          <h1 className="hero-title animate-fade-in">{headline}</h1>
          <p className="hero-subtitle animate-fade-in delay-100">{subheadline}</p>
          <div className="animate-fade-in delay-200">
            <Link to={ctaLink} className="btn btn-primary hero-btn">
              {ctaText} <ArrowRight size={20} />
            </Link>
          </div>
        </div>
        {image && (
          <div className="hero-image-wrapper animate-fade-in delay-300">
            <img src={image} alt={headline} className="hero-image" />
          </div>
        )}
      </div>
    </section>
  );
}
