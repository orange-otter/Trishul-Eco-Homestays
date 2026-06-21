import { Link } from 'react-router-dom';
import { Globe, MessageCircle, Camera, Mail, ArrowRight } from 'lucide-react';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-container">
        <div className="footer-brand">
          <h3>Trishul <span>Eco-Homestays</span></h3>
          <p>Experience the authentic beauty of Chopta, Uttarakhand. Sustainable tourism preserving local communities and the pristine Himalayan environment.</p>
        </div>
        
        <div className="footer-links-group">
          <h4>Explore</h4>
          <Link to="/">Home</Link>
          <Link to="/about">Our Story</Link>
          <Link to="/dashboard">Homestays</Link>
          <Link to="/login">Host Login</Link>
        </div>

        <div className="footer-links-group">
          <h4>Legal</h4>
          <Link to="#">Privacy Policy</Link>
          <Link to="#">Terms of Service</Link>
          <Link to="#">Cancellation Policy</Link>
        </div>

        <div className="footer-newsletter">
          <h4>Stay Connected</h4>
          <p>Join our newsletter for updates on new homestays and eco-tourism initiatives.</p>
          <form className="newsletter-form" onSubmit={(e) => e.preventDefault()}>
            <input type="email" placeholder="Your email address" aria-label="Email address" />
            <button type="submit" aria-label="Subscribe"><ArrowRight size={20} /></button>
          </form>
          <div className="social-icons">
            <a href="#" aria-label="Website"><Globe size={18} /></a>
            <a href="#" aria-label="Social"><MessageCircle size={18} /></a>
            <a href="#" aria-label="Media"><Camera size={18} /></a>
            <a href="#" aria-label="Email"><Mail size={18} /></a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Trishul Eco-Homestays. All rights reserved.</p>
      </div>
    </footer>
  );
}
