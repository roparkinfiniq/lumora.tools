import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, ArrowLeft, Share2, Bookmark, Clock, Eye, List } from "lucide-react";
import { BlogPost } from "../types";
import Prism from "prismjs";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-css";
import "prismjs/components/prism-json";
import "prismjs/components/prism-python";

interface PostModalProps {
  post: BlogPost | null;
  onClose: () => void;
}

interface TocItem {
  id: string;
  text: string;
  level: number;
}

export default function PostModal({ post, onClose }: PostModalProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [toc, setToc] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    if (contentRef.current) {
      // Syntax highlighting
      const codeBlocks = contentRef.current.querySelectorAll("pre code");
      codeBlocks.forEach((block) => {
        Prism.highlightElement(block);
      });

      // Generate TOC
      const headings = contentRef.current.querySelectorAll("h2, h3");
      const tocItems: TocItem[] = [];
      
      headings.forEach((heading, index) => {
        const text = heading.textContent || "";
        // Create an ID if the heading doesn't have one
        const baseId = text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
        const id = heading.id || `heading-${index}-${baseId}`;
        heading.id = id;
        
        // Ensure some styling for jumping accurately, maybe add scroll-margin-top
        if (heading instanceof HTMLElement) {
          heading.classList.add('scroll-mt-32');
        }

        tocItems.push({
          id,
          text,
          level: parseInt(heading.tagName.replace('H', ''), 10)
        });
      });
      
      setToc(tocItems);
    }
  }, [post]);

  // Track active heading on scroll
  useEffect(() => {
    const handleScroll = () => {
      const container = document.getElementById('post-modal-scroll-container');
      if (!container) return;

      const headings = Array.from(document.querySelectorAll('#post-modal-scroll-container h2, #post-modal-scroll-container h3'));
      
      let currentActiveId = '';
      const offset = 200; // Activation point from top of viewport
      
      for (const heading of headings) {
        const rect = heading.getBoundingClientRect();
        if (rect.top <= offset) {
          currentActiveId = heading.id;
        } else {
          break;
        }
      }
      
      if (currentActiveId) {
        setActiveId(currentActiveId);
      } else if (headings.length > 0) {
        setActiveId(headings[0].id);
      }
    };

    const container = document.getElementById('post-modal-scroll-container');
    if (container) {
      container.addEventListener('scroll', handleScroll);
      handleScroll(); // Trigger once on mount
    }
    
    return () => container?.removeEventListener('scroll', handleScroll);
  }, [toc]);

  if (!post) return null;

  const demoContent = `
    <p class="lead">I used to think that productivity was about doing more things faster. Lately, I've realized it's about doing fewer things, but doing them with absolute intention. In this note, I reflect on the small changes that brought some quiet back to my mornings.</p>
    
    <h2>The first hour</h2>
    <p>We believe that we need to be constantly connected to the world. But for the last three months, I've started leaving my phone in the kitchen when I go to sleep. When I wake up, the first hour of the day belongs completely to me. No notifications, no urgent emails, no scrolling.</p>
    
    <blockquote>
      "The world can wait until 9 AM. Your mind needs space to breathe before it's asked to perform."
    </blockquote>

    <h2>The tools of analog</h2>
    <p>I bought a simple, unlined notebook. Using a pen instead of a keyboard changes how you process thoughts. It's slower. It forces you to construct the sentence in your mind before it becomes permanent on paper.</p>
    
    <div class="code-block my-8">
      <pre><code class="language-javascript">// Current Morning Routine
const morning = () => {
  wake();
  pourOverCoffee();
  journal(15, 'minutes');
  read(1, 'chapter');
}</code></pre>
    </div>

    <h2>Finding the baseline</h2>
    <p>This isn't about rejecting technology—it's about re-establishing the baseline of what feels normal. The constant hum of the internet is not the default state of the human mind. Quiet is.</p>
  `;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100]"
      >
        <div className="fixed inset-0 bg-lumora-bg/95 backdrop-blur-2xl" aria-hidden="true" onClick={onClose} />
        
        <div 
          id="post-modal-scroll-container"
          className="fixed inset-0 overflow-y-auto scroll-smooth"
          style={{ overscrollBehavior: 'contain' }}
        >
          <div className="relative z-10 w-full max-w-7xl mx-auto px-6 py-12 md:py-24 min-h-screen flex lg:gap-8 xl:gap-16 justify-center">
            
            {/* Left Spacer for symmetry */}
            <div className="hidden xl:block w-48 shrink-0"></div>

            <div className="w-full max-w-3xl shrink-0">
              {/* Header Actions */}
          <nav className="flex items-center justify-between mb-16 md:mb-24">
            <button
              onClick={onClose}
              className="group flex items-center gap-3 text-sm text-white/40 hover:text-white transition-colors"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/[0.03] border border-white/5 group-hover:bg-white group-hover:text-black shadow-sm transition-all duration-300">
                <ArrowLeft className="h-4 w-4" />
              </div>
              <span className="font-display font-bold text-sm tracking-widest uppercase">
                Close
              </span>
            </button>

            <div className="flex items-center gap-2">
              <button className="h-10 w-10 flex items-center justify-center rounded-full bg-white/[0.03] border border-white/5 text-white/40 hover:text-white hover:bg-white/10 transition-all duration-300">
                <Bookmark className="h-4 w-4" />
              </button>
            </div>
          </nav>

          <motion.article 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
          >
            {/* Meta */}
            <div className="flex items-center gap-6 mb-8 text-xs font-display font-bold uppercase tracking-widest text-white/40">
              <span className="text-lumora-blue">Journal Entry</span>
              <span className="flex items-center gap-1.5">
                <Clock className="h-3 w-3" /> 4 Min Read
              </span>
            </div>

            <h1 className="text-3xl md:text-5xl font-display font-bold text-white mb-6 md:mb-8 tracking-tight !leading-[1.2]">
              {post.title}
            </h1>

            <div className="flex items-center gap-4 mb-10">
              <div className="h-10 w-10 rounded-full bg-lumora-accent/20 flex items-center justify-center">
                <span className="text-lumora-accent font-display font-bold">
                  R
                </span>
              </div>
              <div>
                <p className="text-base font-display font-bold text-white/80">
                  ro.park
                </p>
                <p className="text-[10px] text-white/40 font-display font-bold uppercase tracking-widest mt-1">
                  {post.date}
                </p>
              </div>
            </div>

            {post.imageUrl && (
              <div className="w-full mb-12 overflow-hidden rounded-[24px] border border-white/10">
                <img
                  src={post.imageUrl}
                  alt={post.title}
                  className="w-full h-auto object-cover max-h-[600px]"
                  referrerPolicy="no-referrer"
                />
              </div>
            )}

            {/* Decorative Divider */}
            {!post.imageUrl && (
              <div className="w-16 h-1 rounded-full bg-lumora-highlight/20 mb-16" />
            )}

            {/* Mobile/Tablet Inline TOC */}
            {toc.length > 0 && (
              <div className="lg:hidden w-full mb-12 border border-white/5 bg-white/[0.02] rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <List className="h-4 w-4 text-white/40" />
                  <h3 className="text-xs font-display font-bold text-white/80 uppercase tracking-widest">Table of Contents</h3>
                </div>
                <ul className="space-y-3">
                  {toc.map((item, idx) => (
                    <li key={`${item.id}-${idx}`} className={`${item.level === 3 ? 'ml-4' : ''}`}>
                      <button 
                        onClick={() => {
                          const el = document.getElementById(item.id);
                          const container = document.getElementById('post-modal-scroll-container');
                          if (el && container) {
                            const top = el.getBoundingClientRect().top + container.scrollTop - container.getBoundingClientRect().top - 80;
                            container.scrollTo({ top, behavior: 'smooth' });
                          }
                        }}
                        className="text-sm text-left text-white/50 hover:text-white/90 transition-colors"
                      >
                        {item.text}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Content Rendering */}
            <div
              ref={contentRef}
              className="prose-custom"
              dangerouslySetInnerHTML={{ __html: post.content || demoContent }}
            />

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap items-center gap-3 mt-16 pt-8 border-t border-white/5">
                <span className="text-xs font-display font-bold text-white/40 uppercase tracking-widest mr-2">
                  Tags:
                </span>
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[12px] font-mono font-medium text-lumora-highlight tracking-wide px-3 py-1.5 rounded-md bg-lumora-highlight/10 border border-lumora-highlight/20"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* Post Footer */}
            <div className="mt-16 pt-12 border-t border-white/5 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6">
              <div>
                <p className="text-base text-lumora-sub font-medium max-w-sm">
                  Thanks for reading. If you have any thoughts, feel free to
                  reach out.
                </p>
              </div>
              <button
                onClick={onClose}
                className="px-6 py-3 rounded-full bg-white text-black text-xs font-display font-bold uppercase tracking-widest hover:bg-white/90 active:scale-95 transition-all duration-300 shadow-md shrink-0"
              >
                Back to Archive
              </button>
            </div>
          </motion.article>
          </div>

          {/* Right TOC Sidebar */}
          <div className="hidden lg:block w-56 xl:w-64 shrink-0 relative mt-24">
            <div className="sticky top-24">
              {toc.length > 0 && (
                <div className="border border-white/5 bg-white/[0.02] rounded-2xl p-6">
                  <h3 className="text-xs font-display font-bold text-white/80 uppercase tracking-widest mb-6">Contents</h3>
                  <ul className="space-y-3">
                    {toc.map((item, idx) => (
                      <li key={`${item.id}-${idx}`} className={`${item.level === 3 ? 'ml-4' : ''}`}>
                        <button 
                          onClick={() => {
                            const el = document.getElementById(item.id);
                            const container = document.getElementById('post-modal-scroll-container');
                            if (el && container) {
                              const top = el.getBoundingClientRect().top + container.scrollTop - container.getBoundingClientRect().top - 80;
                              container.scrollTo({ top, behavior: 'smooth' });
                            }
                          }}
                          className={`text-sm text-left transition-colors font-medium ${activeId === item.id ? 'text-lumora-highlight' : 'text-white/40 hover:text-white/80'}`}
                        >
                          {item.text}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

        </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
