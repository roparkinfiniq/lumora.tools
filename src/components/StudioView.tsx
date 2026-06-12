import { motion } from 'motion/react';
import { 
  Github, 
  Mail, 
  Layers, 
  ArrowRight,
  Sparkles,
  PenTool,
  Bot,
  Heart
} from 'lucide-react';

export default function StudioView() {
  const identities = [
    { 
      title: 'QA Engineer', 
      desc: 'obsessed with perfect operation and smooth user experiences.',
      icon: Layers,
      color: 'text-lumora-blue',
      bg: 'bg-lumora-blue/10'
    },
    { 
      title: 'Designer', 
      desc: 'thinking about pretty and intuitive UI/UX all the time.',
      icon: PenTool,
      color: 'text-lumora-accent',
      bg: 'bg-lumora-accent/10'
    },
    { 
      title: 'AI Enthusiast', 
      desc: 'solving repetitive inefficiency with AI and scripts.',
      icon: Bot,
      color: 'text-lumora-highlight',
      bg: 'bg-lumora-highlight/10'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="pb-32 pt-24"
    >
      {/* Friendly Header with Character Placeholder */}
      <section className="container mx-auto px-6 mb-32 pt-12">
        <div className="flex flex-col items-center text-center lg:items-start lg:text-left max-w-4xl mx-auto lg:mx-0">
          <motion.div 
            initial={{ scale: 0.8, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            whileHover={{ scale: 1.05, rotate: 5 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="w-16 h-16 rounded-3xl bg-lumora-accent flex items-center justify-center mb-10 shadow-[0_10px_40px_rgba(251,207,232,0.4)] relative cursor-pointer"
          >
            <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-white animate-pulse" />
            <Sparkles className="h-8 w-8 text-black" />
          </motion.div>
          
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-display font-medium text-white tracking-tight mb-6 md:mb-8 !leading-[1.1]">
            Quality meets <br />
            <span className="text-lumora-accent italic">Creativity.</span>
          </h1>
          
          <p className="text-lg sm:text-xl md:text-2xl text-lumora-sub font-medium leading-relaxed max-w-2xl text-balance">
            I'm a maker who obsesses over quality while pursuing beautiful design 
            and efficient automation at the same time.
          </p>
        </div>
      </section>

      {/* The Hybrid Creator Section */}
      <section className="container mx-auto px-6 mb-40">
        <div className="flex items-center gap-4 mb-16">
          <span className="text-[10px] font-display font-bold uppercase tracking-[0.3em] text-white/30">The Hybrid Creator</span>
          <div className="h-px flex-1 bg-white/5" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {identities.map((item, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ y: -2 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
              className="bento-card p-8 md:p-10 flex flex-col items-center text-center md:items-start md:text-left hover:bg-white/[0.03] transition-all duration-500 hover:shadow-lg group"
            >
              <div className={`h-14 w-14 rounded-3xl ${item.bg} ${item.color} flex items-center justify-center mb-8 group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-500`}>
                <item.icon className="h-7 w-7" />
              </div>
              <h3 className="text-2xl font-display font-bold text-white mb-4">{item.title}</h3>
              <p className="text-lumora-sub font-medium leading-relaxed">
                {item.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Simple Philosophy Section */}
      <section className="container mx-auto px-6 mb-40">
        <motion.div 
          whileHover={{ y: -2, backgroundColor: "rgba(255,255,255,0.03)" }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto bg-white/[0.02] border border-white/5 rounded-[48px] p-8 md:p-24 text-center cursor-default"
        >
          <span className="text-[10px] font-display font-bold uppercase tracking-[0.4em] text-lumora-accent mb-10 block">Mission</span>
          <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-8 tracking-tight">
            "Less friction, More focus."
          </h2>
          <p className="text-lg md:text-xl text-lumora-sub font-medium leading-relaxed max-w-2xl mx-auto">
            My goal is to provide the simplest and most powerful workflow so 
            people don't have to worry about the tools and can focus entirely 
            on their craft.
          </p>
        </motion.div>
      </section>

      {/* Connect & Footer Teaser */}
      <section className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto p-8 md:p-12 lg:p-16 border border-white/10 rounded-[48px] bg-white/[0.02] relative overflow-hidden group shadow-[0_20px_50px_rgba(0,0,0,0.2)]">
          <div className="absolute inset-0 bg-lumora-highlight/5 opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <Heart className="h-5 w-5 text-lumora-accent animate-pulse" />
              <h2 className="text-3xl font-display font-bold text-white">Reach Out</h2>
            </div>
            <p className="text-lg text-lumora-sub font-medium mb-10">I'm always open to discussing new tools, fun ideas, and design.</p>
            <div className="flex flex-col sm:flex-row gap-6">
              <a href="https://github.com/roparkinfiniq/lumora.tools" target="_blank" rel="noopener noreferrer" className="flex-1 p-6 rounded-3xl bg-white/[0.04] border border-white/5 hover:bg-white/[0.08] hover:border-white/10 transition-all duration-300 flex items-center justify-between group/link hover:-translate-y-1 active:scale-[0.98] shadow-sm hover:shadow-md">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-white/5 flex items-center justify-center group-hover/link:bg-white/10 transition-colors duration-300">
                    <Github className="h-6 w-6 text-white/60 group-hover/link:text-white transition-colors duration-300" />
                  </div>
                  <span className="font-display font-bold text-sm uppercase tracking-widest text-white/60 group-hover/link:text-white transition-colors duration-300">GitHub</span>
                </div>
                <ArrowRight className="h-5 w-5 text-white/20 group-hover/link:text-white group-hover/link:-rotate-45 transition-all duration-300" />
              </a>
              <a href="mailto:raonepark@gmail.com" className="flex-1 p-6 rounded-3xl bg-white/[0.04] border border-white/5 hover:bg-white/[0.08] hover:border-white/10 transition-all duration-300 flex items-center justify-between group/link hover:-translate-y-1 active:scale-[0.98] shadow-sm hover:shadow-md">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-white/5 flex items-center justify-center group-hover/link:bg-white/10 transition-colors duration-300">
                    <Mail className="h-6 w-6 text-white/60 group-hover/link:text-white transition-colors duration-300" />
                  </div>
                  <span className="font-display font-bold text-sm uppercase tracking-widest text-white/60 group-hover/link:text-white transition-colors duration-300">Email</span>
                </div>
                <ArrowRight className="h-5 w-5 text-white/20 group-hover/link:text-white group-hover/link:-rotate-45 transition-all duration-300" />
              </a>
            </div>
          </div>
        </div>
      </section>
    </motion.div>
  );
}
