import { Menu, X, Sparkles, Search, Command } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import CommandPalette from './CommandPalette';

interface GNBProps {
  currentView: string;
  onViewChange: (view: string) => void;
}

export default function GNB({ currentView, onViewChange }: GNBProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isCommandOpen, setIsCommandOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const navItems = [
    { name: 'Code Tiara', id: 'code-tiara' },
    { name: 'Utilities', id: 'utilities' },
    { name: 'Journal', id: 'insights' },
    { name: 'About', id: 'studio' },
  ];

  return (
    <>
      <nav className="fixed top-4 md:top-6 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-1.5rem)] md:w-[calc(100%-2rem)] max-w-4xl">
        <div className="glass-card rounded-full px-4 py-2 md:px-6 md:py-3 flex items-center justify-between shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
          {/* Logo */}
          <button 
            onClick={() => onViewChange('home')}
            className="group flex items-center gap-2 font-display text-lg md:text-xl font-bold tracking-tight text-white transition-colors"
          >
            <div className="flex h-8 w-8 md:h-10 md:w-10 items-center justify-center rounded-xl md:rounded-2xl bg-white shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-all duration-500 group-hover:shadow-[0_0_30px_rgba(255,255,255,0.5)]">
              <Sparkles className="h-4 w-4 md:h-5 md:w-5 text-black" />
            </div>
            <span className="hidden sm:block">lumora<span className="text-lumora-accent group-hover:text-lumora-highlight transition-colors">.tools</span></span>
          </button>

          {/* Desktop Nav */}
          <div className="hidden items-center gap-1 md:flex">
            {navItems.map((item) => {
              const isActive = currentView === item.id || (item.id === 'utilities' && currentView === 'utility-detail');
              const isSpecial = item.id === 'code-tiara';
              
              let styles = 'text-white/60 hover:text-white hover:bg-white/10';
              let iconColor = 'opacity-40';
              
              if (isActive) {
                styles = isSpecial ? 'text-pink-950 bg-pink-50 shadow-md shadow-pink-500/10' : 'text-black bg-white shadow-md';
                iconColor = isSpecial ? 'text-pink-500' : '';
              }

              return (
                <button
                  key={item.id}
                  onClick={() => onViewChange(item.id)}
                  className={`text-sm font-display font-bold px-5 py-2.5 rounded-full transition-all duration-300 tracking-wide flex items-center gap-1.5 ${styles}`}
                >
                  {item.name}
                  {isSpecial && <Sparkles className={`w-3.5 h-3.5 mb-0.5 ${iconColor}`} />}
                </button>
              );
            })}
            <div className="w-px h-6 bg-white/10 mx-2" />
            <button 
              onClick={() => setIsCommandOpen(true)}
              className="flex items-center justify-center w-10 h-10 rounded-full text-white/50 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Search"
            >
              <Search className="h-5 w-5" />
            </button>
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="rounded-full p-2 md:p-2.5 text-white/50 hover:bg-white/10 hover:text-white md:hidden transition-colors"
          >
            {isOpen ? <X className="h-5 w-5 md:h-6 md:w-6" /> : <Menu className="h-5 w-5 md:h-6 md:w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="absolute top-full mt-4 inset-x-0 glass-card rounded-[24px] p-5 md:hidden shadow-2xl"
            >
              <nav className="flex flex-col gap-3">
                <button
                  onClick={() => { setIsCommandOpen(true); setIsOpen(false); }}
                  className="text-base text-left font-display font-medium text-white/60 hover:text-lumora-accent transition-colors flex items-center gap-3"
                >
                  <Search className="h-5 w-5" /> Search
                </button>
                <div className="h-px w-full bg-white/10 my-1" />
                <button
                  onClick={() => { onViewChange('home'); setIsOpen(false); }}
                  className="text-base text-left font-display font-medium text-white/60 hover:text-lumora-accent transition-colors"
                >
                  Home
                </button>
                {navItems.map((item) => {
                  const isActive = currentView === item.id || (item.id === 'utilities' && currentView === 'utility-detail');
                  const isSpecial = item.id === 'code-tiara';
                  
                  return (
                    <button
                      key={item.id}
                      onClick={() => { onViewChange(item.id); setIsOpen(false); }}
                      className={`text-base text-left font-display font-medium transition-colors py-1 flex justify-between items-center ${
                        isActive
                          ? 'text-lumora-accent' 
                          : 'text-white/60 hover:text-lumora-accent'
                      }`}
                    >
                      {item.name}
                      {isSpecial && <Sparkles className={`w-4 h-4 ${isActive ? 'text-lumora-accent' : 'opacity-40'}`} />}
                    </button>
                  );
                })}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <CommandPalette isOpen={isCommandOpen} onClose={() => setIsCommandOpen(false)} onViewChange={onViewChange} />
    </>
  );
}
