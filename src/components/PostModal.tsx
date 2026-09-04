import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, ArrowLeft, Share2, Clock, Eye, List } from "lucide-react";
import { BlogPost } from "../types";
import Prism from "prismjs";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-css";
import "prismjs/components/prism-json";
import "prismjs/components/prism-python";

interface PostModalProps {
  post: BlogPost;
  onClose: () => void;
}

interface TocItem {
  id: string;
  text: string;
  level: number;
}

export default function PostModal({ post, onClose }: PostModalProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [toc, setToc] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState<string>('');

  // Close modal on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  // Keep active TOC item visible inside sidebar when card has internal scroll
  useEffect(() => {
    if (activeId) {
      const activeBtn = document.querySelector(`[data-toc-btn="${activeId}"]`);
      if (activeBtn && typeof activeBtn.scrollIntoView === "function") {
        activeBtn.scrollIntoView({ block: "nearest", behavior: "smooth" });
      }
    }
  }, [activeId]);

  useEffect(() => {
    if (contentRef.current) {
      // Syntax highlighting
      const codeBlocks = contentRef.current.querySelectorAll("pre code");
      codeBlocks.forEach((block) => {
        Prism.highlightElement(block);
      });

      // Generate TOC (H2 headings only for clean, executive structure)
      const headings = contentRef.current.querySelectorAll("h2");
      const tocItems: TocItem[] = [];
      
      headings.forEach((heading, index) => {
        const text = heading.textContent || "";
        const baseSlug = text
          .toLowerCase()
          .replace(/[^a-z0-9\u3131-\uD79D]+/g, "-")
          .replace(/(^-|-$)/g, "");
        const id = heading.id || `heading-${index}${baseSlug ? `-${baseSlug}` : ""}`;
        heading.id = id;
        heading.setAttribute("data-toc-id", id);

        tocItems.push({
          id,
          text,
          level: parseInt(heading.tagName.replace("H", ""), 10),
        });
      });
      
      setToc(tocItems);
      if (tocItems.length > 0) {
        setActiveId(tocItems[0].id);
      }
    }
  }, [post]);

  // Track active heading on scroll
  useEffect(() => {
    const container = scrollContainerRef.current || document.getElementById("post-modal-scroll-container");
    if (!container || toc.length === 0) return;

    let ticking = false;

    const updateActiveHeading = () => {
      // 1. If at the very top of the post, highlight the first heading
      if (container.scrollTop < 80) {
        setActiveId(toc[0].id);
        return;
      }

      // 2. If scrolled near the bottom, highlight the last heading
      const isAtBottom = container.scrollHeight - container.scrollTop <= container.clientHeight + 60;
      if (isAtBottom && toc.length > 0) {
        setActiveId(toc[toc.length - 1].id);
        return;
      }

      const headingElements = contentRef.current
        ? (Array.from(contentRef.current.querySelectorAll("h2")) as HTMLElement[])
        : [];

      if (headingElements.length === 0) return;

      // 3. Eye-line reading threshold: 40% from top of viewport
      const readingLine = window.innerHeight * 0.4;

      // Find the last heading whose top has passed the reading line
      let activeIndex = 0;
      for (let i = 0; i < headingElements.length; i++) {
        const top = headingElements[i].getBoundingClientRect().top;
        if (top <= readingLine) {
          activeIndex = i;
        }
      }

      if (toc[activeIndex]) {
        setActiveId(toc[activeIndex].id);
      }
    };

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          try {
            updateActiveHeading();
          } finally {
            ticking = false;
          }
        });
        ticking = true;
      }
    };

    container.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("scroll", handleScroll, { capture: true, passive: true });

    // Initial check
    updateActiveHeading();

    return () => {
      container.removeEventListener("scroll", handleScroll);
      window.removeEventListener("scroll", handleScroll, { capture: true });
    };
  }, [toc]);

  const scrollToHeading = (id: string) => {
    const container = scrollContainerRef.current || document.getElementById("post-modal-scroll-container");
    if (!container) return;

    const targetIndex = toc.findIndex((t) => t.id === id);
    if (targetIndex === -1) return;

    const headingElements = contentRef.current
      ? (Array.from(contentRef.current.querySelectorAll("h2")) as HTMLElement[])
      : [];
    const el = headingElements[targetIndex];
    if (!el) return;

    setActiveId(id);

    const containerRect = container.getBoundingClientRect();
    const elRect = el.getBoundingClientRect();
    const targetScrollTop = container.scrollTop + (elRect.top - containerRect.top) - 100;

    container.scrollTo({
      top: Math.max(0, targetScrollTop),
      behavior: "smooth",
    });
  };


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
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      className="fixed inset-0 z-[100]"
    >
        <div className="fixed inset-0 bg-lumora-bg/95 backdrop-blur-2xl" aria-hidden="true" onClick={onClose} />
        
        <div 
          ref={scrollContainerRef}
          id="post-modal-scroll-container"
          className="fixed inset-0 overflow-y-auto"
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

            {/* Author Info */}
            <div className="flex items-center gap-4 mb-12">
              <div className="h-10 w-10 rounded-full bg-lumora-highlight/20 border border-lumora-highlight/30 flex items-center justify-center font-display font-bold text-lumora-highlight">
                L
              </div>
              <div>
                <p className="text-base font-display font-bold text-white/80">
                  Lumora
                </p>
                <p className="text-[10px] text-white/40 font-display font-bold uppercase tracking-widest mt-1">
                  {post.date}
                </p>
              </div>
            </div>

            {post.imageUrl && !post.hideThumbnailInModal && (
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
            {(!post.imageUrl || post.hideThumbnailInModal) && (
              <div className="w-16 h-1 rounded-full bg-lumora-highlight/20 mb-16" />
            )}

            {/* Mobile/Tablet Inline TOC */}
            {toc.length > 0 && (
              <div className="lg:hidden w-full mb-12 border border-white/5 bg-white/[0.02] rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <List className="h-4 w-4 text-lumora-highlight" />
                  <h3 className="text-xs font-display font-bold text-white/80 uppercase tracking-widest">Table of Contents</h3>
                </div>
                <ul className="space-y-2 border-l border-white/10 pl-3">
                  {toc.map((item, idx) => {
                    const isActive = activeId === item.id;
                    return (
                      <li key={`${item.id}-${idx}`}>
                        <button 
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            scrollToHeading(item.id);
                          }}
                          className={`text-sm text-left transition-all block w-full py-1 ${
                            isActive
                              ? 'text-lumora-highlight font-semibold translate-x-1'
                              : 'text-white/40 hover:text-white/80'
                          }`}
                        >
                          {item.text}
                        </button>
                      </li>
                    );
                  })}
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
          <div className="hidden lg:block w-64 xl:w-72 shrink-0 relative mt-24">
            <div className="sticky top-28">
              {toc.length > 0 && (
                <div className="border border-white/10 bg-white/[0.02] backdrop-blur-xl rounded-2xl p-6 shadow-xl max-h-[calc(100vh-9rem)] flex flex-col">
                  <div className="flex items-center gap-2 mb-4 pb-3 border-b border-white/5 shrink-0">
                    <span className="h-1.5 w-1.5 rounded-full bg-lumora-highlight shadow-[0_0_8px_rgba(196,181,253,0.8)]" />
                    <h3 className="text-xs font-display font-bold text-white uppercase tracking-widest">
                      Contents
                    </h3>
                  </div>

                  <nav className="relative overflow-y-auto pr-1.5 scrollbar-thin scrollbar-thumb-white/10 hover:scrollbar-thumb-white/20">
                    <ul className="space-y-1 relative">
                      {toc.map((item, idx) => {
                        const isActive = activeId === item.id;
                        return (
                          <li key={`${item.id}-${idx}`}>
                            <button 
                              type="button"
                              data-toc-btn={item.id}
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                scrollToHeading(item.id);
                              }}
                              className={`text-[13px] text-left transition-all duration-200 flex items-start gap-2.5 w-full py-2 px-2.5 rounded-lg group ${
                                isActive 
                                  ? 'text-lumora-highlight font-semibold bg-lumora-highlight/10 border border-lumora-highlight/20 shadow-sm' 
                                  : 'text-white/40 hover:text-white/80 hover:bg-white/[0.02] border border-transparent'
                              }`}
                            >
                              <span 
                                className={`mt-1.5 h-1.5 w-1.5 rounded-full shrink-0 transition-all duration-200 ${
                                  isActive 
                                    ? 'bg-lumora-highlight scale-125 shadow-[0_0_8px_rgba(196,181,253,0.9)]' 
                                    : 'bg-white/20 group-hover:bg-white/40'
                                }`} 
                              />
                              <span className="leading-snug">
                                {item.text}
                              </span>
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  </nav>
                </div>
              )}
            </div>
          </div>

        </div>
        </div>
      </motion.div>
  );
}
