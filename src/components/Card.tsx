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
    <div className="group rounded-2xl overflow-hidden border border-border dark:border-gray-700 shadow-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl relative bg-surface dark:bg-gray-800 flex flex-col h-full">
      <div className="overflow-hidden h-56">
        <img src={image} alt={title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
      </div>
      <div className="p-6 flex flex-col flex-grow bg-surface/90 dark:bg-gray-800/90 backdrop-blur-md">
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
