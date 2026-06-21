import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import './Card.css';

interface CardProps {
  title: string;
  description: string;
  image: string;
  actionText?: string;
  actionLink?: string;
}

export default function Card({ title, description, image, actionText, actionLink }: CardProps) {
  return (
    <div className="card">
      <div className="card-image-container">
        <img src={image} alt={title} className="card-image" />
      </div>
      <div className="card-content">
        <h3 className="card-title">{title}</h3>
        <p className="card-description">{description}</p>
        {actionText && actionLink && (
          <Link to={actionLink} className="card-action">
            {actionText} <ArrowRight size={16} />
          </Link>
        )}
      </div>
    </div>
  );
}
