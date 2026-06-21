import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { User, Menu, X, Sun, Moon } from 'lucide-react';
import { Button } from './ui';
import { useTheme } from '../contexts/ThemeContext';

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const navLinks = [
    { name: 'HOME', path: '/' },
    { name: 'OUR STORY', path: '/about' },
    { name: 'HOMESTAYS', path: '/dashboard' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-background/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-white/20 dark:border-white/5 shadow-sm transition-colors duration-300">
      <nav className="max-w-[1200px] mx-auto px-6 h-20 flex items-center justify-between">
        <Link to="/" className="text-xl md:text-2xl font-bold font-serif text-primary-hover dark:text-primary-light tracking-wide flex items-center gap-1">
          <span>Trishul</span> <span className="font-normal italic text-secondary">Eco-Homestays</span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center gap-10">
          <ul className="flex gap-10">
            {navLinks.map((link) => (
              <li key={link.path}>
                <Link
                  to={link.path}
                  className={`text-sm font-semibold tracking-wider transition-colors hover:text-secondary ${
                    location.pathname === link.path ? 'text-primary dark:text-primary-light border-b-2 border-primary pb-1' : 'text-text-secondary dark:text-gray-400'
                  }`}
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
          
          <div className="flex items-center gap-6 border-l border-border dark:border-gray-700 pl-6">
            <button 
              onClick={toggleTheme} 
              className="text-text-primary dark:text-gray-200 hover:text-secondary dark:hover:text-secondary transition-colors"
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? <Sun size={22} /> : <Moon size={22} />}
            </button>
            <Button variant="outline" size="sm">
              BOOK NOW
            </Button>
            <Link to="/login" className="text-text-primary dark:text-gray-200 hover:text-secondary dark:hover:text-secondary transition-colors">
              <User size={24} />
            </Link>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <div className="lg:hidden flex items-center gap-4">
          <button 
            onClick={toggleTheme} 
            className="text-text-primary dark:text-white"
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? <Sun size={24} /> : <Moon size={24} />}
          </button>
          <button className="text-text-primary dark:text-white" onClick={toggleMobileMenu}>
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-20 left-0 w-full bg-surface dark:bg-gray-900 border-b border-border dark:border-gray-800 shadow-lg px-6 py-4 flex flex-col gap-4 animate-in slide-in-from-top-4">
          <ul className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <li key={link.path}>
                <Link
                  to={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block py-2 font-semibold tracking-wide ${
                    location.pathname === link.path ? 'text-primary dark:text-primary-light' : 'text-text-secondary dark:text-gray-400'
                  }`}
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
          <div className="pt-4 border-t border-border dark:border-gray-800 flex flex-col gap-4">
            <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 font-semibold text-text-secondary dark:text-gray-400">
              <User size={20} /> Login / Profile
            </Link>
            <Button variant="primary" className="w-full">
              BOOK NOW
            </Button>
          </div>
        </div>
      )}
    </header>
  );
};
