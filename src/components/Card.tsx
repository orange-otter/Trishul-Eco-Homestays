import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

interface CardProps {
  title: string;
  description: string;
  image: string;
  actionText?: string;
  actionLink?: string;
}

export default function Card({ title, description, image, actionText, actionLink }: CardProps) {
  return (
    <div className="bg-surface dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-border dark:border-gray-700 group flex flex-col h-full hover:-translate-y-1">
      <div className="relative h-56 overflow-hidden">
        <img src={image} alt={title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-xl font-serif font-bold text-text-primary dark:text-white mb-3 group-hover:text-primary transition-colors">{title}</h3>
        <p className="text-text-secondary dark:text-gray-400 text-sm leading-relaxed mb-6 flex-grow">{description}</p>
        {actionText && actionLink && (
          <Link to={actionLink} className="inline-flex items-center gap-2 text-primary dark:text-primary-light font-semibold hover:text-secondary dark:hover:text-white transition-colors mt-auto">
            {actionText} <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
          </Link>
        )}
      </div>
    </div>
  );
}
