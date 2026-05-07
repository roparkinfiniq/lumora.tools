import { motion, AnimatePresence } from 'motion/react';
import { Search, Command, X, ArrowRight } from 'lucide-react';
import { useEffect, useState } from 'react';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onViewChange: (view: string) => void;
}

export default function CommandPalette({ isOpen, onClose, onViewChange }: CommandPaletteProps) {
  const [query, setQuery] = useState('');

  // Reset query when palette opens
  useEffect(() => {
    if (isOpen) {
      setQuery('');
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        isOpen ? onClose() : null; // Handled by parent but listener is good practice
      }
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const suggestions = [
    { name: 'Code Tiara', category: 'App', view: 'code-tiara' },
    { name: 'Convert to PDF', category: 'Utilities', view: 'utilities' },
    { name: 'Color Palette Gen', category: 'Analysis', view: 'utilities' },
    { name: 'Read Blog', category: 'Journal', view: 'insights' },
    { name: 'Task Manager', category: 'Productivity', view: 'utilities' },
    { name: 'About Lumora', category: 'Studio', view: 'studio' },
  ];

  const filteredSuggestions = suggestions.filter((item) => {
    if (!query) return true;
    const searchLower = query.toLowerCase();
    return (
      item.name.toLowerCase().includes(searchLower) ||
      item.category.toLowerCase().includes(searchLower)
    );
  });

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="fixed left-1/2 top-[15%] z-[101] w-[calc(100%-2rem)] max-w-xl -translate-x-1/2 rounded-2xl bg-[#111113] border border-white/10 shadow-[0_32px_64px_rgba(0,0,0,0.8)] overflow-hidden"
          >
            <div className="flex items-center gap-3 border-b border-white/5 px-4 md:px-5 py-4">
              <Search className="h-5 w-5 text-white/40" />
              <input
                autoFocus
                placeholder="Search utilities, articles, documentation..."
                className="flex-1 bg-transparent text-base md:text-lg text-white outline-none placeholder:text-white/30"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <button 
                onClick={onClose}
                className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-white/10 text-white/40 hover:text-white transition-colors"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="p-2 max-h-[60vh] overflow-y-auto">
              {filteredSuggestions.length > 0 ? (
                <div className="space-y-1">
                  {filteredSuggestions.map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        onViewChange(item.view);
                        onClose();
                      }}
                      className="flex w-full items-center justify-between rounded-xl px-3 md:px-4 py-3 hover:bg-white/5 transition-colors text-left group"
                    >
                      <div className="flex items-center gap-4">
                        <div className="h-2 w-2 rounded-full bg-white/20 group-hover:bg-lumora-highlight transition-colors" />
                        <span className="text-sm font-medium text-white/80 group-hover:text-white transition-colors">{item.name}</span>
                      </div>
                      <span className="text-xs font-mono text-white/30 group-hover:text-lumora-highlight/80 transition-colors">{item.category}</span>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="px-4 py-12 text-center text-white/40 text-sm">
                  No results found for "{query}"
                </div>
              )}
            </div>

            <div className="hidden sm:flex items-center justify-between border-t border-white/5 bg-white/[0.02] px-5 py-3">
              <div className="flex items-center gap-4 text-[10px] font-mono text-white/30 uppercase tracking-widest">
                <span className="flex items-center gap-1.5"><Command className="h-3 w-3" />K to Toggle</span>
                <span className="flex items-center gap-1.5">Esc to Close</span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
