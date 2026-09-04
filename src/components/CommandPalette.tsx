import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  Command, 
  X, 
  ArrowRight, 
  CornerDownLeft, 
  Wrench, 
  BookOpen, 
  Sparkles, 
  Compass, 
  Layers 
} from 'lucide-react';
import { useEffect, useState, useMemo, useRef } from 'react';
import { Tool, BlogPost } from '../types';
import { tools } from '../data/tools';
import { blogPosts } from '../data/posts';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onViewChange: (view: string) => void;
  onSelectTool?: (tool: Tool) => void;
  onSelectPost?: (post: BlogPost) => void;
}

type ItemType = 'tool' | 'post' | 'page';

interface SearchItem {
  id: string;
  type: ItemType;
  title: string;
  subtitle: string;
  category: string;
  badge?: string;
  iconType: 'tool' | 'post' | 'sparkles' | 'compass' | 'layers';
  tool?: Tool;
  post?: BlogPost;
  view?: string;
  keywords?: string[];
}

const PAGE_ITEMS: SearchItem[] = [
  {
    id: 'page-code-tiara',
    type: 'page',
    title: 'Code Tiara',
    subtitle: 'Beautiful code snapshot and presentation card studio',
    category: 'App',
    iconType: 'sparkles',
    view: 'code-tiara',
    keywords: ['code', 'tiara', '코드', '티아라', '스니펫', 'snippet', 'screenshot', 'carbon', '카드'],
  },
  {
    id: 'page-utilities',
    type: 'page',
    title: 'All Utilities',
    subtitle: 'Browse complete catalog of 15+ high-precision utilities',
    category: 'Navigation',
    iconType: 'layers',
    view: 'utilities',
    keywords: ['utilities', 'tools', '도구', '유틸리티', '전체 도구', '목록', '카탈로그'],
  },
  {
    id: 'page-insights',
    type: 'page',
    title: 'Journal & Essays',
    subtitle: 'Thoughtful reflections on technology, stillness, and life',
    category: 'Navigation',
    iconType: 'post',
    view: 'insights',
    keywords: ['journal', 'blog', 'essays', '저널', '블로그', '글', '에세이', '생각'],
  },
  {
    id: 'page-studio',
    type: 'page',
    title: 'About Lumora Studio',
    subtitle: 'Philosophy, principles, and craft behind lumora.tools',
    category: 'Studio',
    iconType: 'compass',
    view: 'studio',
    keywords: ['about', 'studio', 'philosophy', '소개', '루모라', '철학'],
  },
];

export default function CommandPalette({ 
  isOpen, 
  onClose, 
  onViewChange,
  onSelectTool,
  onSelectPost,
}: CommandPaletteProps) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Combine all items
  const allSearchItems = useMemo<SearchItem[]>(() => {
    const toolItems: SearchItem[] = tools.map((t) => ({
      id: `tool-${t.id}`,
      type: 'tool',
      title: t.name,
      subtitle: t.description,
      category: t.category,
      badge: 'Utility',
      iconType: 'tool',
      tool: t,
      keywords: t.keywords || [],
    }));

    const postItems: SearchItem[] = blogPosts.map((p) => ({
      id: `post-${p.id}`,
      type: 'post',
      title: p.title,
      subtitle: p.excerpt,
      category: 'Journal',
      badge: p.date,
      iconType: 'post',
      post: p,
      keywords: [...(p.tags || []), 'journal', 'blog', '아티클', '글', '에세이'],
    }));

    return [...PAGE_ITEMS, ...toolItems, ...postItems];
  }, []);

  // Filter items based on query
  const filteredItems = useMemo(() => {
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) {
      // Default curated recommendations
      const featuredIds = [
        'page-code-tiara',
        'tool-1',
        'tool-16',
        'tool-7',
        'tool-10',
        'tool-4',
        'tool-3',
        'post-ai-dilemma',
        'post-need-rest',
        'page-utilities',
        'page-studio',
      ];
      return allSearchItems.filter((item) => featuredIds.includes(item.id));
    }

    const tokens = trimmed.split(/\s+/).filter(Boolean);

    return allSearchItems.filter((item) => {
      const searchTarget = [
        item.title,
        item.subtitle,
        item.category,
        ...(item.keywords || []),
        item.tool?.slug || '',
        ...(item.post?.tags || []),
      ]
        .join(' ')
        .toLowerCase();

      return tokens.every((token) => searchTarget.includes(token));
    });
  }, [query, allSearchItems]);

  // Reset query and selected index on open
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    }
  }, [isOpen]);

  // Reset selected index when query changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  // Handle item selection
  const handleSelect = (item: SearchItem) => {
    if (item.type === 'tool' && item.tool) {
      if (onSelectTool) {
        onSelectTool(item.tool);
      } else {
        onViewChange('utility-detail');
      }
    } else if (item.type === 'post' && item.post) {
      if (onSelectPost) {
        onSelectPost(item.post);
      } else {
        onViewChange('insights');
      }
    } else if (item.view) {
      onViewChange(item.view);
    }
    onClose();
  };

  // Keep active item scrolled into view in container
  useEffect(() => {
    if (!listRef.current) return;
    const activeEl = listRef.current.querySelector<HTMLElement>(`[data-search-idx="${selectedIndex}"]`);
    if (!activeEl) return;

    const container = listRef.current;
    const elTop = activeEl.offsetTop;
    const elBottom = elTop + activeEl.offsetHeight;

    if (elTop < container.scrollTop) {
      container.scrollTop = elTop - 8;
    } else if (elBottom > container.scrollTop + container.clientHeight) {
      container.scrollTop = elBottom - container.clientHeight + 8;
    }
  }, [selectedIndex]);

  // Global key navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (filteredItems.length > 0 ? (prev + 1) % filteredItems.length : 0));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (filteredItems.length > 0 ? (prev - 1 + filteredItems.length) % filteredItems.length : 0));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredItems[selectedIndex]) {
          handleSelect(filteredItems[selectedIndex]);
        }
      } else if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredItems, selectedIndex]);

  const renderItemIcon = (iconType: SearchItem['iconType'], isSelected: boolean) => {
    const baseClass = "h-4 w-4 transition-colors duration-200";
    switch (iconType) {
      case 'sparkles':
        return <Sparkles className={`${baseClass} text-pink-400`} />;
      case 'tool':
        return <Wrench className={`${baseClass} ${isSelected ? 'text-lumora-highlight' : 'text-lumora-highlight/70'}`} />;
      case 'post':
        return <BookOpen className={`${baseClass} ${isSelected ? 'text-emerald-300' : 'text-emerald-400/70'}`} />;
      case 'compass':
        return <Compass className={`${baseClass} ${isSelected ? 'text-amber-300' : 'text-amber-400/70'}`} />;
      case 'layers':
      default:
        return <Layers className={`${baseClass} ${isSelected ? 'text-blue-300' : 'text-blue-400/70'}`} />;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-md"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -16 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed left-1/2 top-[12%] z-[101] w-[calc(100%-2rem)] max-w-2xl -translate-x-1/2 rounded-2xl bg-[#111113]/95 backdrop-blur-2xl border border-white/10 shadow-[0_32px_80px_rgba(0,0,0,0.85)] overflow-hidden flex flex-col"
          >
            {/* Search Input Bar */}
            <div className="flex items-center gap-3 border-b border-white/10 px-4 md:px-5 py-4 bg-white/[0.01]">
              <Search className="h-5 w-5 text-lumora-highlight shrink-0" />
              <input
                ref={inputRef}
                placeholder="Search utilities, articles, tools, keywords (e.g. PDF, Barcode, 운동, 이미지)..."
                className="flex-1 bg-transparent text-sm md:text-base text-white outline-none placeholder:text-white/30 tracking-wide"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              {query && (
                <button
                  onClick={() => setQuery('')}
                  className="text-xs font-mono text-white/40 hover:text-white px-2 py-1 rounded bg-white/5 hover:bg-white/10 transition-colors"
                >
                  Clear
                </button>
              )}
              <button 
                onClick={onClose}
                className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-white/10 text-white/40 hover:text-white transition-colors shrink-0"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Results Header / Category */}
            <div className="px-5 pt-3 pb-1 flex items-center justify-between text-[11px] font-mono text-white/30 uppercase tracking-wider">
              <span>{query ? `Results (${filteredItems.length})` : 'Recommended & Quick Access'}</span>
              <span>Navigate with ↑ ↓</span>
            </div>

            {/* Results List */}
            <div 
              ref={listRef}
              className="p-2 max-h-[60vh] overflow-y-auto space-y-1 scrollbar-thin scrollbar-thumb-white/10"
            >
              {filteredItems.length > 0 ? (
                filteredItems.map((item, idx) => {
                  const isSelected = selectedIndex === idx;
                  return (
                    <button
                      key={item.id}
                      data-search-idx={idx}
                      onClick={() => handleSelect(item)}
                      onMouseEnter={() => setSelectedIndex(idx)}
                      className={`flex w-full items-center justify-between rounded-xl px-3.5 py-3 transition-all duration-150 text-left group cursor-pointer ${
                        isSelected 
                          ? 'bg-white/10 text-white shadow-sm' 
                          : 'hover:bg-white/5 text-white/70 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-3.5 min-w-0 flex-1 pr-3">
                        <div className={`flex h-9 w-9 items-center justify-center rounded-xl shrink-0 transition-colors ${
                          isSelected ? 'bg-white/10' : 'bg-white/[0.03] border border-white/5'
                        }`}>
                          {renderItemIcon(item.iconType, isSelected)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-white truncate group-hover:text-white">
                              {item.title}
                            </span>
                            {item.badge && (
                              <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border shrink-0 ${
                                item.type === 'tool' 
                                  ? 'bg-lumora-highlight/10 text-lumora-highlight border-lumora-highlight/20'
                                  : item.type === 'post'
                                  ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20'
                                  : 'bg-white/5 text-white/50 border-white/10'
                              }`}>
                                {item.badge}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-white/40 truncate font-normal mt-0.5">
                            {item.subtitle}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <span className="hidden sm:inline-block text-[11px] font-mono text-white/30 group-hover:text-white/60 transition-colors">
                          {item.category}
                        </span>
                        <div className={`h-6 w-6 rounded-md flex items-center justify-center transition-all ${
                          isSelected ? 'text-lumora-highlight bg-lumora-highlight/15 scale-105' : 'opacity-0 text-white/20'
                        }`}>
                          <CornerDownLeft className="h-3.5 w-3.5" />
                        </div>
                      </div>
                    </button>
                  );
                })
              ) : (
                <div className="px-6 py-16 text-center">
                  <p className="text-white/70 text-sm font-medium mb-1">
                    No results found for &ldquo;{query}&rdquo;
                  </p>
                  <p className="text-xs text-white/40 max-w-sm mx-auto leading-relaxed">
                    Try searching with different keywords like <span className="text-lumora-highlight">PDF</span>, <span className="text-lumora-highlight">Barcode</span>, <span className="text-lumora-highlight">운동</span>, <span className="text-lumora-highlight">Image</span>, or <span className="text-lumora-highlight">JSON</span>.
                  </p>
                </div>
              )}
            </div>

            {/* Footer Shortcut Hints */}
            <div className="hidden sm:flex items-center justify-between border-t border-white/5 bg-white/[0.02] px-5 py-3">
              <div className="flex items-center gap-5 text-[10px] font-mono text-white/30 uppercase tracking-widest">
                <span className="flex items-center gap-1.5">
                  <span className="px-1.5 py-0.5 rounded bg-white/10 text-white/70">↑↓</span> to Navigate
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="px-1.5 py-0.5 rounded bg-white/10 text-white/70">↵</span> to Select
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="px-1.5 py-0.5 rounded bg-white/10 text-white/70">Esc</span> to Close
                </span>
              </div>
              <div className="text-[10px] font-mono text-white/30">
                <span className="flex items-center gap-1">
                  <Command className="h-3 w-3" />K Toggle
                </span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
