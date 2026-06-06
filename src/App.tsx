import { motion, AnimatePresence } from "motion/react";
import GNB from "./components/GNB";
import ToolCard from "./components/ToolCard";
import PostModal from "./components/PostModal";
import StudioView from "./components/StudioView";
import ToolDetailView from "./components/ToolDetailView";
import CodeTiaraView from "./components/CodeTiaraView";
import { Tool, BlogPost } from "./types";
import {
  Sparkles,
  ArrowRight,
  Github,
  ExternalLink,
  MousePointer2,
  Type,
  Cpu,
  Shield,
  Zap,
  Search,
  CheckSquare,
} from "lucide-react";
import { useState, useMemo, MouseEvent, useEffect } from "react";

const tools: Tool[] = [
  {
    id: "1",
    name: "Lumora PDF Studio",
    slug: "pdf-studio",
    description:
      "High-fidelity HTML to PDF synthesis. Maintain typography and layout precision with our custom rendering engine.",
    icon: "FileCode",
    category: "Synthesis",
    link: "#",
    usageSteps: [
      { step: "Pick a template", detail: "Choose between Note, Resume, or Invoice to match your purpose." },
      { step: "Fill in your content", detail: "Edit the fields on the left — title, body, items, and more." },
      { step: "Preview in real time", detail: "Watch the A4 preview on the right update instantly as you type." },
      { step: "Export as PDF", detail: "Hit 'Export PDF' and your file downloads immediately." },
    ],
  },
  {
    id: "3",
    name: "Vector Lab: Gradients",
    slug: "gradients",
    description:
      "Visual SVG mesh and linear gradient composer. Export production-ready code with artistic precision.",
    icon: "Paintbrush",
    category: "Design",
    link: "#",
    usageSteps: [
      { step: "Start with a preset", detail: "Click any swatch in Popular Presets to load a curated color combo." },
      { step: "Adjust the color stops", detail: "Click each color node to change its hue, or hit + to add a new stop." },
      { step: "Set the angle", detail: "Drag the Rotation Angle slider to control the gradient direction." },
      { step: "Copy the CSS", detail: "Click 'Copy CSS' to grab production-ready gradient code for your project." },
    ],
  },
  {
    id: "4",
    name: "Structure: JSON",
    slug: "json",
    description:
      "Developer-grade JSON visualization and formalization. Instant syntax correction and nested mapping.",
    icon: "Braces",
    category: "Dev Tools",
    link: "#",
    usageSteps: [
      { step: "Paste your JSON", detail: "Drop any raw or minified JSON into the left input panel." },
      { step: "Auto-format", detail: "With Auto mode on, the output is formatted and validated instantly." },
      { step: "Copy the result", detail: "Click the copy icon to grab the clean, indented JSON output." },
    ],
  },
  {
    id: "5",
    name: "Ether: Markdown",
    slug: "markdown",
    description:
      "A distraction-free markdown environment. Live fluid preview with elegant Github-flavored syntax.",
    icon: "Edit3",
    category: "Content",
    link: "#",
    usageSteps: [
      { step: "Write your Markdown", detail: "Type freely in the left editor. GitHub Flavored Markdown is fully supported." },
      { step: "See it live", detail: "The right panel renders your content in real time as you write." },
      { step: "Copy MD or HTML", detail: "Use the MD or HTML buttons to copy the output in your preferred format." },
    ],
  },
  {
    id: "6",
    name: "Chromatic Extractor",
    slug: "chromatic-extractor",
    description:
      "Intelligent color identity extraction. Upload any visual and generate a harmonious 8-bit palette.",
    icon: "Palette",
    category: "Analysis",
    link: "#",
    usageSteps: [
      { step: "Upload an image", detail: "Drag and drop any image onto the canvas, or click to browse your files." },
      { step: "Palette extracted", detail: "The tool analyzes pixel data locally and surfaces up to 8 dominant colors." },
      { step: "Copy any color", detail: "Click a color card to instantly copy its HEX code to your clipboard." },
    ],
  },
  {
    id: "7",
    name: "Gems: Workout Canvas",
    slug: "workout-canvas",
    description:
      "Log your training sessions, adjust weights/reps dynamically, and export structured, publication-ready fitness reports.",
    icon: "Dumbbell",
    category: "Synthesis",
    link: "#",
    usageSteps: [
      { step: "Select your active day", detail: "Choose your active training day from the weekly navigation tabs (customizable via Settings)." },
      { step: "Log your weights & reps", detail: "Mark sets as completed, and adjust target values using the plus/minus controls." },
      { step: "Add notes & comments", detail: "Write down any pain points, energy levels, or session feedback in the comment bar." },
      { step: "Copy blog/coach report", detail: "Click 'Complete & Copy AI Coach Report' to copy a formatted text summary for your blog, coach, or AI." },
    ],
  },
];

const blogPosts: BlogPost[] = [
  {
    id: "1",
    title: "Finding stillness in a hyper-connected world",
    excerpt:
      "Lately, I’ve been leaving my phone in another room until 10 AM. The silence is deafening, then comforting.",
    date: "APR 28, 2026",
    link: "#",
    tags: ["Mindfulness", "Focus"],
    content: `
      <p class="lead">I used to think that productivity was about doing more things faster. Lately, I've realized it's about doing fewer things, but doing them with absolute intention. In this note, I reflect on the small changes that brought some quiet back to my mornings.</p>
      
      <h2>The first hour</h2>
      <p>We believe that we need to be constantly connected to the world. But for the last three months, I've started leaving my phone in the kitchen when I go to sleep. When I wake up, the first hour of the day belongs completely to me. No notifications, no urgent emails, no scrolling.</p>
      
      <blockquote>
        "The world can wait until 9 AM. Your mind needs space to breathe before it's asked to perform."
      </blockquote>

      <h2>The tools of analog</h2>
      <p>I bought a simple, unlined notebook. Using a pen instead of a keyboard changes how you process thoughts. It's slower. It forces you to construct the sentence in your mind before it becomes permanent on paper. This analog delay acts as a natural filter for the inconsequential.</p>
    `,
  },
  {
    id: "2",
    title: "Why I went back to a paper notebook",
    excerpt:
      "There is something undeniably satisfying about crossing a task out with ink rather than checking a pixelated box.",
    date: "APR 24, 2026",
    link: "#",
    imageUrl:
      "https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=1200&q=80",
    tags: ["Analogue", "Journaling"],
    content: `
      <p class="lead">Digital tools are infinite. A Notion page can scroll forever; an Apple Note has no boundaries. But human attention is undeniably finite. Returning to physical paper was an exercise in embracing boundaries.</p>

      <h2>The tactile feedback of completion</h2>
      <p>There is a specific, visceral joy in striking a line through a completed task with a heavy pen. It requires physical effort. It leaves a permanent mark. Clicking a checkbox that magically disappears into a 'Done' list feels sterile by comparison. With paper, you see everything you've accomplished at the end of the day, immortalized in ink.</p>

      <img src="https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=1200&q=80" alt="Writing in a notebook" referrerpolicy="no-referrer" />

      <h2>Forced prioritization</h2>
      <p>A standard A5 page only holds about 20 lines of writing comfortably. You cannot schedule 50 tasks for a Tuesday. The physical constraint forces actual prioritization. If it doesn't fit on the page, it cannot be done today.</p>
    `,
  },
  {
    id: "3",
    title: "A weekend without plans",
    excerpt:
      "No itinerary. No reservations. Just a camera, comfortable shoes, and nowhere to be.",
    date: "APR 18, 2026",
    link: "#",
    imageUrl:
      "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1200&q=80",
    tags: ["Life", "Travel"],
    content: `
      <p class="lead">We spend our weeks scheduling every hour—meetings, deep work blocks, gym sessions, dinner dates. When the weekend arrives, the instinct is to schedule leisure just as aggressively. Last weekend, I decided to do nothing.</p>

      <h2>The art of wandering</h2>
      <p>I left my apartment with only my keys and a camera. No destination in Google Maps. No goal to 'see the sights'. It's astonishing how different a city feels when you aren't using it as a transit corridor to get from Point A to Point B.</p>

      <blockquote>
        "Not all those who wander are lost. Sometimes, they are just finally paying attention."
      </blockquote>

      <h2>Serendipity requires space</h2>
      <p>When every minute is planned, serendipity is impossible. By leaving my schedule blank, I accidentally spent two hours in a tiny used bookstore I would have otherwise walked right past. Planning is necessary for progress, but emptiness is necessary for discovery.</p>
    `,
  },
  {
    id: "4",
    title: "The perfect cup of pour-over",
    excerpt:
      "It took me three years to realize the temperature of the water matters just as much as the beans.",
    date: "MAR 02, 2026",
    link: "#",
    tags: ["Coffee", "Routine"],
    content: `
      <p class="lead">Coffee is a ritual disguised as a beverage. The process of making a pour-over forces you to stand still for four minutes. It demands your attention. You cannot multi-task while pouring a slow concentric circle over a bed of blooming grounds.</p>

      <h2>The three variables</h2>
      <p>There are only three things you can control: the grind size, the water temperature, and the ratio. Yet, from these three variables emerges infinite complexity.</p>
      
      <ul>
        <li><strong>Grind Size:</strong> Too fine, and it's bitter. Too coarse, and it's sour. Finding the sweet spot is a daily negotiation.</li>
        <li><strong>Temperature:</strong> Never boiling. Around 200°F (93°C) is where the delicate aromatics survive without being scorched.</li>
        <li><strong>Ratio:</strong> 1:15 is the golden mean. 20 grams of coffee, 300 grams of water.</li>
      </ul>

      <h2>A lesson in patience</h2>
      <p>You cannot rush gravity. The water pulls through the grounds at its own pace. It's a gentle morning reminder that not everything responds to urgency.</p>
    `,
  },
];

function CursorSpotlight() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: globalThis.MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
      setIsVisible(true);
    };
    const handleMouseLeave = () => {
      setIsVisible(false);
    };
    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <div
      className={`pointer-events-none fixed z-[110] h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.06)_0%,transparent_70%)] mix-blend-screen transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
      style={{
        left: isVisible ? mousePos.x : -1000,
        top: isVisible ? mousePos.y : -1000,
      }}
    />
  );
}

// Map URL paths to internal view names
const URL_TO_VIEW: Record<string, string> = {
  "/": "home",
  "/utilities": "utilities",
  "/journal": "insights",
  "/about": "studio",
  "/code-tiara": "code-tiara",
};

const VIEW_TO_URL: Record<string, string> = {
  home: "/",
  utilities: "/utilities",
  "utility-detail": "/utilities",
  insights: "/journal",
  studio: "/about",
  "code-tiara": "/code-tiara",
};

const getToolSlug = (name: string) => {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
};

export default function App() {
  // Initialize from URL on first load only
  const [currentView, setCurrentView] = useState<string>(() => {
    const path = window.location.pathname;
    if (path.startsWith("/utilities/")) {
      return "utility-detail";
    }
    return URL_TO_VIEW[path] ?? "home";
  });
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [selectedTool, setSelectedTool] = useState<Tool | null>(() => {
    const path = window.location.pathname;
    if (path.startsWith("/utilities/")) {
      const parts = path.substring("/utilities/".length).split("/");
      const toolSlug = parts[0];
      return tools.find((t) => t.slug === toolSlug || getToolSlug(t.name) === toolSlug) ?? null;
    }
    return null;
  });
  const [journalView, setJournalView] = useState<"journal" | "photos">(
    "journal",
  );
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  // Sync state → URL (non-blocking)
  useEffect(() => {
    let url = VIEW_TO_URL[currentView] ?? "/";
    if (currentView === "utility-detail" && selectedTool) {
      const slug = selectedTool.slug || getToolSlug(selectedTool.name);
      if (selectedTool.id === "7") {
        const path = window.location.pathname;
        let currentLang = "en";
        if (path.includes("/workout-canvas/ko")) {
          currentLang = "ko";
        } else if (path.includes("/workout-canvas/en")) {
          currentLang = "en";
        } else {
          const savedLang = localStorage.getItem("gems_workout_lang");
          if (savedLang === "ko" || savedLang === "en") {
            currentLang = savedLang;
          }
        }
        url = `/utilities/${slug}/${currentLang}`;
      } else {
        url = `/utilities/${slug}`;
      }
    }
    if (window.location.pathname !== url) {
      window.history.pushState({ view: currentView }, "", url);
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentView, selectedTool]);

  // Handle browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      if (path.startsWith("/utilities/")) {
        const parts = path.substring("/utilities/".length).split("/");
        const toolSlug = parts[0];
        const foundTool = tools.find((t) => t.slug === toolSlug || getToolSlug(t.name) === toolSlug) ?? null;
        setCurrentView("utility-detail");
        setSelectedTool(foundTool);
      } else {
        const view = URL_TO_VIEW[path] ?? "home";
        setCurrentView(view);
        setSelectedTool(null);
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  const categories = useMemo(() => {
    const cats = ["All", ...new Set(tools.map((t) => t.category))];
    return cats;
  }, []);

  const allTags = useMemo(() => {
    return Array.from(new Set(blogPosts.flatMap((post) => post.tags || [])));
  }, []);

  const filteredBlogPosts = useMemo(() => {
    return blogPosts.filter((post) => {
      if (journalView === "photos" && !post.imageUrl) return false;
      if (selectedTag && (!post.tags || !post.tags.includes(selectedTag)))
        return false;
      return true;
    });
  }, [journalView, selectedTag]);

  const filteredTools = useMemo(() => {
    return tools.filter((t) => {
      const matchesCategory =
        activeCategory === "All" || t.category === activeCategory;
      const matchesSearch =
        t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  const getToolCount = (category: string) => {
    if (category === "All") return tools.length;
    return tools.filter((t) => t.category === category).length;
  };

  return (
    <div
      className={`min-h-screen relative overflow-x-hidden ${selectedPost ? "h-screen overflow-hidden" : ""}`}
    >
      {/* Modern Grid Background */}
      <div
        className="fixed inset-0 z-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      />

      {currentView !== "utility-detail" && !selectedPost && (
        <GNB currentView={currentView} onViewChange={(view) => {
          setCurrentView(view);
        }} />
      )}

      <CursorSpotlight />

      <main className={`relative transition-all duration-300 ${
        currentView === "utility-detail" || selectedPost
          ? "pt-6 lg:pt-16"
          : "pt-32 lg:pt-48"
      }`}>
        <AnimatePresence mode="wait">
          {currentView === "home" && (
            <motion.div
              key="home"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="container mx-auto px-6"
            >
              {/* Bento Hero Section */}
              <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-12">
                {/* Main Headline Block */}
                <div className="lg:col-span-8 bento-card p-8 lg:p-20 flex flex-col justify-center relative group min-h-[500px]">
                  <div className="shimmer-effect absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-lumora-highlight/10 border border-lumora-highlight/20 text-[11px] font-display font-bold tracking-wide text-lumora-highlight mb-8 shadow-sm">
                      <Sparkles className="h-4 w-4" />
                      <span>Welcome to my desk</span>
                    </div>
                    <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-[80px] font-display font-medium tracking-tight text-white mb-6 md:mb-8 !leading-[1.1] text-balance">
                      My little <br />
                      <span className="text-lumora-accent">toolbelt 🧶</span>
                    </h1>

                    <p className="max-w-xl text-lg md:text-xl text-lumora-sub leading-relaxed mb-10 md:mb-12 font-medium">
                      A small, playful collection of handy utilities I built to
                      make everyday tasks on the web just a little bit easier
                      and nicer.
                    </p>

                    <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                      <button
                        onClick={() => setCurrentView("utilities")}
                        className="px-6 md:px-8 py-3.5 md:py-4 bg-lumora-accent text-[#1a1921] font-display font-bold text-sm md:text-base rounded-2xl transition-all duration-300 shadow-sm hover:bg-[#ffdfed] hover:shadow-md hover:-translate-y-0.5 active:scale-[0.98]"
                      >
                        Explore Tools
                      </button>
                      <button
                        onClick={() => setCurrentView("studio")}
                        className="px-6 md:px-8 py-3.5 md:py-4 bg-lumora-card text-white font-display font-bold text-sm md:text-base rounded-2xl border border-white/5 hover:bg-white/[0.08] hover:border-white/10 transition-all duration-300 tracking-wide hover:-translate-y-0.5 active:scale-[0.98]"
                      >
                        About Lumora
                      </button>
                    </div>
                  </motion.div>
                </div>

                {/* Side Stats/Teaser Blocks */}
                <div className="lg:col-span-4 grid grid-cols-1 lg:grid-rows-2 gap-6">
                  <div className="bento-card p-8 md:p-10 flex flex-col justify-center relative group overflow-hidden">
                    <div className="shimmer-effect absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                    <div className="relative z-10">
                      <div className="h-14 w-14 rounded-3xl bg-lumora-highlight/20 text-lumora-highlight flex items-center justify-center mb-6 transition-transform group-hover:scale-110 group-hover:rotate-6 shadow-[0_0_20px_rgba(196,181,253,0.3)]">
                        <Zap className="h-7 w-7" />
                      </div>
                      <h3 className="text-2xl font-display font-bold text-white mb-3">
                        Snappy Fast
                      </h3>
                      <p className="text-lumora-sub font-medium leading-relaxed">
                        Local-first processing means everything happens
                        instantly on your device.
                      </p>
                    </div>
                  </div>
                  <div className="bento-card p-8 md:p-10 flex flex-col justify-center relative group overflow-hidden">
                    <div className="shimmer-effect absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                    <div className="relative z-10">
                      <div className="h-14 w-14 rounded-3xl bg-lumora-blue/20 text-lumora-blue flex items-center justify-center mb-6 transition-transform group-hover:scale-110 group-hover:-rotate-6 shadow-[0_0_20px_rgba(186,230,253,0.3)]">
                        <Shield className="h-7 w-7" />
                      </div>
                      <h3 className="text-2xl font-display font-bold text-white mb-3">
                        Super Private
                      </h3>
                      <p className="text-lumora-sub font-medium leading-relaxed">
                        No tracking, no server uploads. Your data stays right
                        here with you.
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Flagship Product Teaser */}
              <section className="mb-12">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  onClick={() => setCurrentView("code-tiara")}
                  className="bento-card relative overflow-hidden group cursor-pointer bg-gradient-to-br from-[#1a1921] to-[#0f0e13] border border-white/10 p-0"
                >
                  <div className="absolute inset-0 bg-lumora-highlight/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                  <div className="flex flex-col md:flex-row">
                    <div className="p-8 md:p-16 md:w-1/2 flex flex-col justify-center">
                      <div className="inline-flex px-3 py-1.5 rounded-full bg-white/10 w-fit mb-6 items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-lumora-highlight animate-pulse" />
                        <span className="text-[10px] font-display font-bold text-white uppercase tracking-widest">
                          New App Released
                        </span>
                      </div>
                      <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-4 tracking-tight group-hover:text-amber-50 transition-colors">
                        Code Tiara.
                      </h2>
                      <p className="text-xl text-lumora-sub font-medium mb-8 leading-relaxed">
                        A completely noiseless to-do list for creators.
                        Available now on Play Store and PC.
                      </p>
                      <div className="flex items-center gap-3 text-sm font-display font-bold text-white/50 group-hover:text-white transition-colors">
                        Learn More{" "}
                        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                    {/* Visual Graphic */}
                    <div className="md:w-1/2 relative bg-white/[0.02] border-t md:border-t-0 md:border-l border-white/5 flex items-center justify-center p-8 md:p-12 overflow-hidden min-h-[300px]">
                      <div className="w-full max-w-xs bg-[#0a0a0c] rounded-[24px] border border-white/10 shadow-2xl p-6 relative z-10 group-hover:scale-105 transition-transform duration-700 ease-out">
                        <div className="flex items-center justify-between mb-6">
                          <div className="h-2 w-16 bg-white/20 rounded-full" />
                          <CheckSquare className="h-4 w-4 text-white/40" />
                        </div>
                        <div className="flex flex-col gap-3">
                          <div className="h-10 w-full rounded-xl bg-white/5 border border-white/10" />
                          <div className="h-10 w-full rounded-xl bg-white/10 border border-white/20 flex items-center px-4 gap-3">
                            <div className="h-3 w-3 rounded bg-white" />
                            <div className="h-2 w-24 bg-white/60 rounded-full" />
                          </div>
                          <div className="h-10 w-full rounded-xl bg-white/5 border border-white/10" />
                        </div>
                      </div>
                      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#0a0a0c] to-transparent pointer-events-none" />
                    </div>
                  </div>
                </motion.div>
              </section>

              {/* Home Grid Teaser */}
              <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-24">
                <div className="lg:col-span-1 bento-card p-8 md:p-10 flex flex-col justify-between">
                  <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-lumora-blue/20 text-lumora-blue mb-6">
                      <span className="text-xs font-display font-bold tracking-wide">
                        Mini Apps
                      </span>
                    </div>
                    <h2 className="text-3xl lg:text-4xl font-display font-bold text-white leading-tight mb-4">
                      Small parts, <br />
                      big help.
                    </h2>
                    <p className="text-lumora-sub font-medium text-base mb-8">
                      Here's a curated list of converters and visualizers
                      designed for daily use.
                    </p>
                  </div>
                  <button
                    onClick={() => setCurrentView("utilities")}
                    className="group flex items-center gap-3 text-sm font-bold text-white/50 hover:text-white transition-colors"
                  >
                    View All{" "}
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>

                {tools.slice(0, 2).map((tool) => (
                  <div
                    key={tool.id}
                    className="lg:col-span-1 bento-card p-8 md:p-10 flex flex-col justify-start gap-6 cursor-pointer group"
                    onClick={() => {
                      setSelectedTool(tool);
                      setCurrentView("utility-detail");
                    }}
                  >
                    <div className="flex justify-between items-start">
                      <div className="px-3 py-1 rounded-full bg-white/5 text-[10px] font-display font-bold text-white/60 uppercase tracking-widest">
                        {tool.category}
                      </div>
                      <div className="h-10 w-10 rounded-2xl bg-lumora-accent/10 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center group-hover:scale-110">
                        <ArrowRight className="h-5 w-5 text-lumora-accent" />
                      </div>
                    </div>
                    <div>
                      <h4 className="text-2xl font-display font-bold text-white mb-2">
                        {tool.name}
                      </h4>
                      <p className="text-lumora-sub text-base font-medium line-clamp-2">
                        {tool.description}
                      </p>
                    </div>
                  </div>
                ))}
              </section>

              {/* Bold Manifesto Quote */}
              <section className="mb-24 py-16 md:py-24 border-t border-b border-white/[0.05] bg-white/[0.01] rounded-[24px] md:rounded-[40px]">
                <div className="max-w-4xl mx-auto text-center px-6">
                  <h2 className="text-3xl md:text-5xl font-display font-light text-white tracking-tight leading-relaxed">
                    "Tools shouldn't feel like{" "}
                    <span className="text-white/40">work</span>.<br /> They
                    should feel like{" "}
                    <span className="font-bold text-lumora-highlight">
                      magic
                    </span>
                    ."
                  </h2>
                </div>
              </section>

              {/* Insights Bento Block */}
              <section className="mb-24">
                <div className="flex items-center justify-between mb-10">
                  <h2 className="text-3xl font-display font-bold text-white">
                    Recent Notes
                  </h2>
                  <button
                    onClick={() => setCurrentView("insights")}
                    className="text-sm font-display font-bold text-white/50 hover:text-white transition-colors flex items-center gap-2 group"
                  >
                    View All{" "}
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {blogPosts.slice(0, 2).map((post) => (
                    <button
                      key={post.id}
                      onClick={() => setSelectedPost(post)}
                      className="bento-card p-8 md:p-10 text-left group hover:bg-white/[0.04]"
                    >
                      <span className="inline-block px-3 py-1 rounded-full bg-white/5 text-[10px] font-display font-bold text-white/40 mb-6 uppercase tracking-widest">
                        {post.date}
                      </span>
                      <h3 className="text-2xl font-display font-bold text-white mb-4 group-hover:text-lumora-blue transition-colors">
                        {post.title}
                      </h3>
                      <p className="text-lumora-sub font-medium line-clamp-2 text-base leading-relaxed">
                        {post.excerpt}
                      </p>
                    </button>
                  ))}
                </div>
              </section>
            </motion.div>
          )}

          {currentView === "utilities" && (
            <motion.div
              key="utilities"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="container mx-auto px-6"
            >
              <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-start pb-24 border-t border-white/5 pt-12">
                {/* Left Sidebar: Sticky */}
                <div className="lg:w-1/4 lg:sticky lg:top-32 shrink-0 w-full flex flex-col gap-10">
                  <div>
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-lumora-blue/10 border border-lumora-blue/20 mb-6 group">
                      <div className="h-1.5 w-1.5 rounded-full bg-lumora-blue group-hover:animate-pulse transition-colors" />
                      <span className="text-[10px] font-display font-bold text-lumora-blue uppercase tracking-widest">
                        Library / V3.2
                      </span>
                    </div>
                    <h2 className="text-3xl lg:text-5xl font-display font-bold text-white tracking-tight mb-3 sm:mb-4 leading-tight">
                      All Tools.
                    </h2>
                    <p className="text-base text-lumora-sub font-medium leading-relaxed max-w-sm">
                      A cheerful collection of mini-applications, formatters,
                      and utilities to brighten up your workflow.
                    </p>
                  </div>

                  {/* Horizontal visual divider */}
                  <div className="hidden lg:block w-8 h-px bg-white/20" />

                  {/* Category Navigation */}
                  <div className="w-full relative">
                    <div className="flex lg:flex-col gap-3 lg:gap-2 overflow-x-auto lg:overflow-visible no-scrollbar pb-2 lg:pb-0">
                      {categories.map((cat) => {
                        const count =
                          cat === "All"
                            ? tools.length
                            : tools.filter((t) => t.category === cat).length;
                        return (
                          <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`shrink-0 flex items-center justify-center lg:justify-between gap-2.5 lg:gap-4 lg:w-full px-5 py-2.5 lg:px-5 lg:py-4 rounded-full lg:rounded-2xl text-[13.5px] lg:text-[14px] font-display font-medium transition-all ${
                              activeCategory === cat
                                ? "bg-white text-black shadow-md shadow-white/5"
                                : "bg-white/[0.04] lg:bg-transparent border border-white/5 lg:border-transparent lg:hover:bg-white/10 text-white/50 hover:text-white"
                            }`}
                          >
                            <div className="flex items-center gap-2 lg:gap-3">
                              <div
                                className={`hidden lg:block h-2 w-2 rounded-full transition-all duration-300 ${activeCategory === cat ? "bg-black" : "bg-transparent lg:group-hover:bg-white/40"}`}
                              />
                              {cat}
                            </div>
                            <span
                              className={`font-mono text-[11px] lg:text-[12px] bg-black/5 lg:bg-transparent px-1.5 py-0.5 rounded-md ${activeCategory === cat ? "text-black/50" : "text-white/20"}`}
                            >
                              {count.toString().padStart(2, "0")}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Right Content Area */}
                <div className="lg:w-3/4 w-full xl:pl-8 flex flex-col gap-8 lg:min-h-[600px]">
                  {/* Search Input Bar */}
                  <div className="relative group">
                    <div className="absolute inset-0 bg-white/5 border border-white/10 rounded-full group-hover:border-lumora-highlight/30 transition-all pointer-events-none group-focus-within:border-lumora-highlight/50 group-focus-within:bg-white/10" />
                    <div className="absolute -inset-1 bg-lumora-highlight/0 group-focus-within:bg-lumora-highlight/20 blur-2xl transition-all rounded-full pointer-events-none duration-500" />

                    <div className="relative flex items-center px-6 py-5">
                      <Search className="h-5 w-5 text-lumora-highlight/50 group-focus-within:text-lumora-highlight transition-colors flex-shrink-0" />
                      <input
                        type="text"
                        placeholder="Search for something fun..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-transparent border-0 ring-0 text-white placeholder:text-white/30 px-4 text-base font-medium font-sans focus:outline-none focus:ring-0 focus:border-transparent focus-visible:outline-none focus-visible:ring-0"
                        style={{ outline: "none", boxShadow: "none", border: "none" }}
                        autoComplete="off"
                        spellCheck="false"
                      />
                      <div className="hidden md:flex items-center gap-1.5 text-[10px] font-display text-white/30 font-bold uppercase tracking-wider bg-black/20 border border-white/5 px-3 py-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                        <span>Cmd</span>{" "}
                        <span className="text-white/40">+</span> <span>K</span>
                      </div>
                    </div>
                  </div>

                  {/* Featured App Showcase */}
                  {activeCategory === "All" && searchQuery === "" && (
                    <motion.div
                      key="featured"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                      onClick={() => setCurrentView("code-tiara")}
                      className="w-full relative rounded-[32px] overflow-hidden border border-white/10 group cursor-pointer bg-[#0f0e13]"
                    >
                      <div className="absolute inset-0 bg-lumora-highlight/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                      <div className="flex flex-col lg:flex-row min-h-[340px]">
                        {/* Text Content */}
                        <div className="p-8 md:p-10 lg:w-[45%] flex flex-col justify-center relative z-10 lg:pr-0">
                          <div className="inline-flex px-3 py-1.5 rounded-full bg-lumora-highlight/10 text-lumora-highlight border border-lumora-highlight/20 w-fit mb-6 items-center gap-2">
                            <span className="h-1.5 w-1.5 rounded-full bg-lumora-highlight animate-pulse" />
                            <span className="text-[10px] font-display font-bold uppercase tracking-widest">
                              Flagship Product
                            </span>
                          </div>
                          <h3 className="text-3xl md:text-4xl font-display font-bold text-white mb-4 tracking-tight group-hover:text-amber-50 transition-colors">
                            Code Tiara.
                          </h3>
                          <p className="text-lumora-sub text-lg font-medium mb-8 leading-relaxed">
                            A completely noiseless to-do list for deep focus.
                            Available for Android & PC.
                          </p>
                          <div className="flex items-center gap-3 text-sm font-display font-bold text-white/50 group-hover:text-white transition-colors">
                            Explore Product{" "}
                            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                          </div>
                        </div>

                        {/* Visual Mockup */}
                        <div className="lg:w-[55%] relative flex items-center justify-center pointer-events-none min-h-[250px] lg:min-h-0 pt-0 lg:pt-0">
                          <div className="w-[85%] max-w-sm lg:max-w-md lg:w-[85%] bg-gradient-to-br from-[#1e1d24] to-[#121116] rounded-2xl lg:rounded-3xl border border-white/10 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] p-6 lg:p-8 group-hover:-translate-y-2 transition-transform duration-500 ease-out mb-8 lg:mb-0 lg:mr-8 lg:mt-8">
                            <div className="flex items-center gap-4 border-b border-white/5 pb-4 mb-5">
                              <span className="text-white font-display font-bold text-xl tracking-wide">
                                Tasks
                              </span>
                              <div className="px-2.5 py-0.5 rounded-full bg-white/10 text-white/50 text-xs font-mono font-medium">
                                12
                              </div>
                            </div>
                            <div className="flex flex-col gap-3.5">
                              <div className="h-14 w-full rounded-xl bg-white/[0.03] border border-white/5 flex items-center px-4 gap-4">
                                <div className="h-5 w-5 rounded-md border-2 border-white/20" />
                                <div className="h-2 w-1/3 bg-white/30 rounded-full" />
                              </div>
                              <div className="h-14 w-full rounded-xl bg-lumora-highlight/10 border border-lumora-highlight/20 flex items-center px-4 gap-4">
                                <div className="h-5 w-5 rounded-md bg-lumora-highlight flex items-center justify-center">
                                  <CheckSquare className="h-3.5 w-3.5 text-white" />
                                </div>
                                <div className="h-2 w-1/2 bg-lumora-highlight/90 rounded-full" />
                              </div>
                              <div className="h-14 w-full rounded-xl bg-white/[0.02] border border-white/5 flex items-center px-4 gap-4 opacity-50">
                                <div className="h-5 w-5 rounded-md border-2 border-white/20" />
                                <div className="h-2 w-1/4 bg-white/30 rounded-full" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Tools Grid */}
                  {filteredTools.length > 0 ? (
                    <motion.div
                      layout
                      className="grid grid-cols-1 md:grid-cols-2 gap-6 relative"
                    >
                      <AnimatePresence mode="popLayout">
                        {filteredTools.map((tool) => (
                          <motion.div
                            key={tool.id}
                            layout
                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: -10 }}
                            transition={{
                              duration: 0.4,
                              ease: [0.16, 1, 0.3, 1],
                            }}
                            onClick={() => {
                              setSelectedTool(tool);
                              setCurrentView("utility-detail");
                            }}
                            className="cursor-pointer h-full"
                          >
                            <ToolCard tool={tool} />
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </motion.div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="py-32 flex flex-col items-center justify-center text-center border border-white/5 border-dashed rounded-3xl bg-white/[0.01]"
                    >
                      <div className="inline-flex h-16 w-16 items-center justify-center rounded-3xl bg-lumora-accent/10 border border-lumora-accent/20 mb-6 group-hover:scale-105 transition-transform shadow-[0_0_20px_rgba(251,207,232,0.2)]">
                        <Search className="h-8 w-8 text-lumora-accent" />
                      </div>
                      <h3 className="text-2xl font-display font-medium text-white mb-3">
                        Oops, nothing found!
                      </h3>
                      <p className="text-base text-lumora-sub font-medium mb-8 max-w-sm">
                        It looks like this tool hasn't been built yet. Maybe
                        spell it differently?
                      </p>
                      <button
                        onClick={() => {
                          setSearchQuery("");
                          setActiveCategory("All");
                        }}
                        className="px-8 py-3.5 rounded-full bg-white text-black text-sm font-display font-bold hover:-translate-y-0.5 active:scale-95 transition-all shadow-md"
                      >
                        Reset Search
                      </button>
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {currentView === "insights" && (
            <motion.div
              key="insights"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.5 }}
              className="container mx-auto px-6 pb-24"
            >
              <div className="max-w-3xl mx-auto mb-20 text-center lg:text-left mt-12">
                <div className="inline-flex items-center justify-center p-2 rounded-full bg-white/5 border border-white/10 mb-8 max-w-fit mx-auto lg:mx-0 relative">
                  <button
                    onClick={() => setJournalView("journal")}
                    className={`px-5 py-2 rounded-full text-xs uppercase tracking-widest font-bold transition-all duration-300 z-10 ${journalView === "journal" ? "text-black" : "text-white/40 hover:text-white/80"}`}
                  >
                    Journal
                  </button>
                  <button
                    onClick={() => setJournalView("photos")}
                    className={`px-5 py-2 rounded-full text-xs uppercase tracking-widest font-bold transition-all duration-300 z-10 ${journalView === "photos" ? "text-black" : "text-white/40 hover:text-white/80"}`}
                  >
                    Photos
                  </button>
                  <div
                    className="absolute top-2 bottom-2 bg-white rounded-full transition-all duration-300 shadow-md"
                    style={{
                      left:
                        journalView === "journal" ? "8px" : "calc(50% + 4px)",
                      width: "calc(50% - 12px)",
                    }}
                  />
                </div>
                <h2 className="text-4xl md:text-6xl font-display font-bold text-white tracking-tight mb-6 leading-tight">
                  {journalView === "photos"
                    ? "Captured Moments."
                    : "Quiet Thoughts."}
                </h2>
                <p className="text-xl text-lumora-sub font-medium max-w-xl lg:mx-0 mx-auto">
                  {journalView === "photos"
                    ? "A visual diary of places, things, and moments worth remembering."
                    : "A collection of personal notes, weekend reflections, and life outside the screen."}
                </p>

                {/* Tags Filter */}
                <div className="flex flex-wrap items-center gap-2 mt-8 lg:justify-start justify-center">
                  <button
                    onClick={() => setSelectedTag(null)}
                    className={`px-4 py-2 rounded-full text-xs font-mono font-medium transition-all ${
                      selectedTag === null
                        ? "bg-white text-black"
                        : "bg-white/5 text-white/50 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    All
                  </button>
                  {allTags.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => setSelectedTag(tag)}
                      className={`px-4 py-2 rounded-full text-xs font-mono font-medium transition-all ${
                        selectedTag === tag
                          ? "bg-lumora-highlight text-white"
                          : "bg-lumora-highlight/10 text-lumora-highlight hover:bg-lumora-highlight/20 border border-lumora-highlight/20"
                      }`}
                    >
                      #{tag}
                    </button>
                  ))}
                </div>
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={journalView}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className={
                    journalView === "photos"
                      ? "max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full"
                      : "max-w-3xl mx-auto flex flex-col gap-8 w-full"
                  }
                >
                  <AnimatePresence mode="popLayout">
                    {filteredBlogPosts.map((post, idx) => (
                      <motion.button
                        key={post.id}
                        layout
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        onClick={() => setSelectedPost(post)}
                        whileHover={
                          journalView === "photos" ? { scale: 1.02 } : {}
                        }
                        whileTap={{ scale: 0.98 }}
                        transition={{ duration: 0.3 }}
                        className={
                          journalView === "photos"
                            ? "text-left group relative flex flex-col h-[300px] rounded-3xl overflow-hidden border border-white/10 transition-all cursor-pointer w-full"
                            : "text-left group relative flex flex-col gap-6 py-10 border-b border-white/5 transition-all w-full items-start"
                        }
                      >
                      {journalView === "photos" ? (
                        <>
                          <img
                            src={post.imageUrl}
                            alt={post.title}
                            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

                          <div className="relative z-10 p-6 flex flex-col h-full justify-between w-full">
                            <div className="flex justify-between items-start w-full">
                              <span className="text-[10px] font-display font-bold text-white tracking-widest uppercase bg-black/40 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-full">
                                {post.date}
                              </span>
                            </div>
                            <div>
                              <h3 className="text-xl font-display font-bold text-white mb-2 line-clamp-1">
                                {post.title}
                              </h3>
                              <div className="flex flex-wrap items-center gap-2">
                                {post.tags?.map((tag) => (
                                  <span
                                    key={tag}
                                    className="text-[10px] font-mono text-white/80 bg-white/10 px-2 py-0.5 rounded backdrop-blur-sm"
                                  >
                                    #{tag}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="flex flex-wrap items-center gap-3">
                            <span className="text-[11px] font-display font-bold text-white/40 tracking-widest uppercase bg-white/5 px-3 py-1.5 rounded-full">
                              {post.date}
                            </span>
                            {post.tags && post.tags.length > 0 && (
                              <div className="flex flex-wrap items-center gap-2">
                                {post.tags.map((tag) => (
                                  <button
                                    key={tag}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setSelectedTag(tag);
                                    }}
                                    className="text-[11px] font-mono font-medium text-lumora-highlight tracking-wide px-2 py-1 rounded-md bg-lumora-highlight/10 border border-lumora-highlight/20 hover:bg-lumora-highlight hover:text-white transition-colors"
                                  >
                                    #{tag}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>

                          <div className="w-full">
                            {post.imageUrl && (
                              <div className="w-full h-[240px] sm:h-[400px] mb-8 overflow-hidden rounded-[24px] border border-white/10 relative">
                                <img
                                  src={post.imageUrl}
                                  alt={post.title}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                                  referrerPolicy="no-referrer"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
                              </div>
                            )}
                            <h3 className="text-3xl font-display font-bold text-white mb-4 group-hover:text-amber-50 transition-colors duration-300 line-clamp-2">
                              {post.title}
                            </h3>
                            <p className="text-lg text-lumora-sub font-medium leading-relaxed group-hover:text-white/80 transition-colors duration-300">
                              {post.excerpt}
                            </p>
                          </div>

                          <div className="flex items-center gap-2 text-sm font-display font-bold text-white/50 group-hover:text-white transition-colors mt-2">
                            Read Entry{" "}
                            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                          </div>
                        </>
                      )}
                    </motion.button>
                  ))}
                </AnimatePresence>

                {filteredBlogPosts.length === 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="py-24 flex flex-col items-center justify-center text-center col-span-full"
                  >
                    <h3 className="text-2xl font-display font-medium text-white mb-3">
                      No thoughts found.
                    </h3>
                    <p className="text-base text-lumora-sub font-medium mb-8 max-w-sm">
                      Try selecting a different tag, or resetting the filter.
                    </p>
                    <button
                      onClick={() => setSelectedTag(null)}
                      className="px-6 py-3 rounded-full bg-white/10 text-white text-sm font-display font-bold hover:bg-white hover:text-black transition-all"
                    >
                      Clear Filters
                    </button>
                  </motion.div>
                )}
                </motion.div>
              </AnimatePresence>
            </motion.div>
          )}

          {currentView === "studio" && (
            <motion.div
              key="studio"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.5 }}
            >
              <StudioView />
            </motion.div>
          )}

          {currentView === "code-tiara" && (
            <motion.div
              key="code-tiara"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.5 }}
            >
              <CodeTiaraView />
            </motion.div>
          )}

          {currentView === "utility-detail" && selectedTool && (
            <motion.div
              key="utility-detail"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.5 }}
            >
              <ToolDetailView
                tool={selectedTool}
                onBack={() => setCurrentView("utilities")}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="bg-lumora-bg/80 border-t border-white/5 py-24 pb-12">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-24">
            <div className="md:col-span-2">
              <button
                onClick={() => setCurrentView("home")}
                className="font-display text-3xl font-bold text-white mb-6 block text-left group"
              >
                lumora
                <span className="text-lumora-accent group-hover:text-lumora-highlight transition-colors">
                  .tools
                </span>
              </button>
              <p className="max-w-sm text-lumora-sub font-medium leading-relaxed">
                A playground of curious little web applications. Built with lots
                of coffee and a little bit of magic.
              </p>
            </div>
            <div>
              <h4 className="text-xs font-display font-bold text-white/50 mb-6 uppercase tracking-widest">
                Connect
              </h4>
              <nav className="flex flex-col gap-4 text-base font-medium text-lumora-sub">
                <a
                  href="#"
                  className="hover:text-white transition-colors flex items-center gap-3"
                >
                  <Github className="h-5 w-5 text-white/40" /> Github
                </a>
                <a
                  href="#"
                  className="hover:text-white transition-colors flex items-center gap-3"
                >
                  <ExternalLink className="h-5 w-5 text-white/40" /> Twitter
                </a>
                <a
                  href="#"
                  className="hover:text-white transition-colors flex items-center gap-3"
                >
                  <Type className="h-5 w-5 text-white/40" /> Tistory
                </a>
              </nav>
            </div>
            <div>
              <h4 className="text-xs font-display font-bold text-white/50 mb-6 uppercase tracking-widest">
                Explore
              </h4>
              <nav className="flex flex-col gap-4 text-base font-medium text-lumora-sub">
                <button
                  onClick={() => setCurrentView("utilities")}
                  className="hover:text-white transition-colors text-left flex items-center gap-2"
                >
                  <ArrowRight className="h-4 w-4 text-lumora-highlight/50" />{" "}
                  Utilities
                </button>
                <button
                  onClick={() => setCurrentView("insights")}
                  className="hover:text-white transition-colors text-left flex items-center gap-2"
                >
                  <ArrowRight className="h-4 w-4 text-lumora-blue/50" /> Journal
                </button>
                <button
                  onClick={() => setCurrentView("studio")}
                  className="hover:text-white transition-colors text-left flex items-center gap-2"
                >
                  <ArrowRight className="h-4 w-4 text-lumora-accent/50" /> About
                </button>
              </nav>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between pt-12 border-t border-white/5 gap-6">
            <span className="text-xs font-display font-bold text-white/30 uppercase tracking-widest whitespace-nowrap">
              © 2026 Lumora. Made with 🤍.
            </span>
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-3 text-xs font-display font-bold uppercase tracking-widest text-lumora-sub">
                <span className="h-2 w-2 rounded-full bg-lumora-highlight animate-pulse" />
                SYSTEM OPTIMAL
              </div>
            </div>
          </div>
        </div>
      </footer>

      <PostModal post={selectedPost} onClose={() => setSelectedPost(null)} />
    </div>
  );
}
