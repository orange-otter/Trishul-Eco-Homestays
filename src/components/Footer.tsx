import React from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle, Camera, Mail, Globe } from 'lucide-react';
import { Button, Input } from './ui';

export default function Footer() {
  return (
    <footer className="bg-primary-hover dark:bg-gray-950 text-white pt-16 pb-8 px-6 border-t-8 border-secondary">
      <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
        <div className="flex flex-col gap-4">
          <h3 className="text-2xl font-serif font-bold mb-2 tracking-wide">
            Trishul <span className="text-secondary font-normal italic">Eco-Homestays</span>
          </h3>
          <p className="text-primary-light opacity-80 text-sm leading-relaxed">
            Experience the authentic beauty of Chopta, Uttarakhand. Sustainable tourism preserving local communities and the pristine Himalayan environment.
          </p>
        </div>
        
        <div className="flex flex-col gap-4">
          <h4 className="text-lg font-serif font-bold text-white mb-2">
            <span className="border-b-2 border-secondary pb-1">Explore</span>
          </h4>
          <ul className="flex flex-col gap-3 mt-2">
            <li><Link to="/" className="text-primary-light opacity-80 hover:opacity-100 hover:text-white transition-colors">Home</Link></li>
            <li><Link to="/about" className="text-primary-light opacity-80 hover:opacity-100 hover:text-white transition-colors">Our Story</Link></li>
            <li><Link to="/dashboard" className="text-primary-light opacity-80 hover:opacity-100 hover:text-white transition-colors">Homestays</Link></li>
            <li><Link to="/login" className="text-primary-light opacity-80 hover:opacity-100 hover:text-white transition-colors">Host Login</Link></li>
          </ul>
        </div>
        
        <div className="flex flex-col gap-4">
          <h4 className="text-lg font-serif font-bold text-white mb-2">
            <span className="border-b-2 border-secondary pb-1">Legal</span>
          </h4>
          <ul className="flex flex-col gap-3 mt-2">
            <li><Link to="#" className="text-primary-light opacity-80 hover:opacity-100 hover:text-white transition-colors">Privacy Policy</Link></li>
            <li><Link to="#" className="text-primary-light opacity-80 hover:opacity-100 hover:text-white transition-colors">Terms of Service</Link></li>
            <li><Link to="#" className="text-primary-light opacity-80 hover:opacity-100 hover:text-white transition-colors">Cancellation Policy</Link></li>
          </ul>
        </div>
        
        <div className="flex flex-col gap-4">
          <h4 className="text-lg font-serif font-bold text-white mb-2">
            <span className="border-b-2 border-secondary pb-1">Stay Connected</span>
          </h4>
          <p className="text-primary-light opacity-80 text-sm mb-2 mt-2">
            Join our newsletter for updates on new homestays and eco-tourism initiatives.
          </p>
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              import('./ui/Toast').then(({ toast }) => {
                toast.success('Successfully subscribed to the newsletter!');
              });
            }} 
            className="flex flex-col gap-3"
          >
            <Input 
              type="email" 
              required
              placeholder="Your email address" 
              className="bg-primary/50 border-primary-light/20 text-white placeholder:text-gray-400"
            />
            <Button variant="secondary" className="w-full" type="submit">
              Subscribe
            </Button>
          </form>
          <div className="flex gap-4 mt-4">
            <a href="#" className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-light hover:bg-secondary hover:text-white transition-colors"><Globe size={20} /></a>
            <a href="#" className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-light hover:bg-secondary hover:text-white transition-colors"><Camera size={20} /></a>
            <a href="#" className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-light hover:bg-secondary hover:text-white transition-colors"><MessageCircle size={20} /></a>
            <a href="#" className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-light hover:bg-secondary hover:text-white transition-colors"><Mail size={20} /></a>
          </div>
        </div>
      </div>
      
      <div className="max-w-[1200px] mx-auto pt-8 border-t border-primary/50 text-center text-primary-light opacity-60 text-sm">
        <p>&copy; {new Date().getFullYear()} Trishul Eco-Homestays. All rights reserved.</p>
      </div>
    </footer>
  );
};;
