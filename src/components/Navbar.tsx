import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, UserCircle } from 'lucide-react';
import './Navbar.css';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          Trishul <span>Eco-Homestays</span>
        </Link>
        <div className="navbar-links">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/about" className="nav-link">Our Story</Link>
          <Link to="/dashboard" className="nav-link">Homestays</Link>
        </div>
        <div className="navbar-actions">
          <Link to="/login" className="btn btn-primary nav-cta">
            Book Now
          </Link>
          <Link to="/login" className="icon-btn" aria-label="Profile">
            <UserCircle size={26} strokeWidth={1.5} />
          </Link>
          <button className="icon-btn mobile-menu-btn" aria-label="Menu" onClick={() => setIsOpen(!isOpen)}>
            <Menu size={26} strokeWidth={1.5} />
          </button>
        </div>
      </div>
      {isOpen && (
        <div className="mobile-menu animate-fade-in">
          <Link to="/" className="mobile-link" onClick={() => setIsOpen(false)}>Home</Link>
          <Link to="/about" className="mobile-link" onClick={() => setIsOpen(false)}>Our Story</Link>
          <Link to="/dashboard" className="mobile-link" onClick={() => setIsOpen(false)}>Homestays</Link>
          <Link to="/login" className="btn btn-primary" style={{marginTop: '1rem', width: 'fit-content'}} onClick={() => setIsOpen(false)}>Book Now</Link>
        </div>
      )}
    </nav>
  );
}
