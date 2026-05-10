import { useState, useMemo } from "react";
import { motion } from "motion/react";
import { marked } from "marked";
import Toast from "../components/Toast";
import { 
  Edit3, 
  Eye, 
  Copy, 
  Trash2, 
  Code, 
  FileText,
  Layout
} from "lucide-react";


export default function MarkdownEther() {
  const [markdown, setMarkdown] = useState<string>(
    "# Welcome to Ether\n\nEdit this text to see the magic happen.\n\n### Features\n- **Live Preview**: See changes instantly.\n- **Premium Typography**: Built-in support for Lumora styles.\n- **HTML Export**: Copy your work as clean HTML.\n\n```javascript\nconsole.log('Hello from Lumora!');\n```\n\n> \"Tools should feel like magic.\""
  );
  const [showToast, setShowToast] = useState(false);
  const [viewMode, setViewMode] = useState<"split" | "edit" | "preview">("split");

  const htmlContent = useMemo(() => {
    try {
      return marked(markdown);
    } catch (e) {
      return "<p class='text-red-400'>Error parsing markdown</p>";
    }
  }, [markdown]);

  const handleCopy = (type: "md" | "html") => {
    const text = type === "md" ? markdown : htmlContent;
    navigator.clipboard.writeText(text as string);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  const handleClear = () => {
    setMarkdown("");
  };

  return (
    <div className="w-full h-full flex flex-col gap-6">
      <Toast 
        isVisible={showToast} 
        message="복사되었습니다" 
        onClose={() => setShowToast(false)} 
      />
      {/* Tool Header/Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white/[0.02] border border-white/5 p-4 rounded-2xl">
        <div className="flex items-center gap-2">
          {[
            { id: "split", icon: Layout, label: "Split" },
            { id: "edit", icon: Edit3, label: "Edit" },
            { id: "preview", icon: Eye, label: "Preview" },
          ].map((mode) => (
            <button
              key={mode.id}
              onClick={() => setViewMode(mode.id as any)}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-all text-[11px] font-display font-bold uppercase tracking-wider ${
                viewMode === mode.id
                  ? "bg-white text-black shadow-lg"
                  : "bg-white/5 text-white/40 hover:bg-white/10 hover:text-white"
              }`}
            >
              <mode.icon className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">{mode.label}</span>
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <motion.button
            onClick={() => handleCopy("md")}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-white/50 hover:text-white rounded-xl transition-all border border-white/10 group relative"
          >
            <FileText className="h-3.5 w-3.5" />
            <span className="text-[11px] font-display font-bold uppercase tracking-wider">MD</span>
          </motion.button>
          <motion.button
            onClick={() => handleCopy("html")}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-4 py-2 bg-lumora-highlight/10 hover:bg-lumora-highlight/20 text-lumora-highlight rounded-xl transition-all border border-lumora-highlight/20 group relative"
          >
            <Code className="h-3.5 w-3.5" />
            <span className="text-[11px] font-display font-bold uppercase tracking-wider">HTML</span>
          </motion.button>
          <div className="w-px h-4 bg-white/10 mx-1" />
          <button
            onClick={handleClear}
            className="p-2.5 bg-white/5 hover:bg-red-500/10 text-white/50 hover:text-red-400 rounded-xl transition-all border border-white/10"
            title="Clear All"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>


      {/* Main Workspace */}
      <div className="flex-1 min-h-[500px] relative overflow-hidden">
        <div className={`h-full grid gap-6 transition-all duration-500 ${
          viewMode === "split" ? "grid-cols-1 lg:grid-cols-2" : "grid-cols-1"
        }`}>
          {/* Editor Pane */}
          {(viewMode === "split" || viewMode === "edit") && (
            <motion.div 
              layout
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex flex-col gap-3 h-full"
            >
              <div className="flex items-center justify-between px-2">
                <span className="text-[10px] font-display font-bold text-white/30 uppercase tracking-widest flex items-center gap-2">
                  <Edit3 className="h-3 w-3" /> Markdown Editor
                </span>
                <span className="text-[10px] font-display font-bold text-white/20 uppercase tracking-widest">
                  {markdown.length} chars
                </span>
              </div>
              <textarea
                value={markdown}
                onChange={(e) => setMarkdown(e.target.value)}
                placeholder="Write your markdown here..."
                className="w-full h-full bg-[#0a0a0c] border border-white/5 rounded-[24px] p-8 text-sm font-mono text-white/80 placeholder:text-white/10 focus:outline-none focus:border-lumora-highlight/30 focus:ring-2 focus:ring-lumora-highlight/5 transition-all resize-none leading-relaxed"
                spellCheck="false"
              />
            </motion.div>
          )}

          {/* Preview Pane */}
          {(viewMode === "split" || viewMode === "preview") && (
            <motion.div 
              layout
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex flex-col gap-3 h-full overflow-hidden"
            >
              <div className="flex items-center justify-between px-2">
                <span className="text-[10px] font-display font-bold text-white/30 uppercase tracking-widest flex items-center gap-2">
                  <Eye className="h-3 w-3" /> Live Preview
                </span>
                <div className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-[10px] font-display font-bold text-green-400/50 uppercase tracking-widest">Active</span>
                </div>
              </div>
              <div className="w-full h-full bg-[#0a0a0c]/40 border border-white/5 rounded-[24px] overflow-auto no-scrollbar p-8 prose-custom shadow-inner">
                <div 
                  dangerouslySetInnerHTML={{ __html: htmlContent }} 
                  className="w-full h-full"
                />
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Footer Info */}
      <div className="flex flex-wrap items-center gap-6 px-5 py-3 bg-white/[0.01] border border-white/5 rounded-2xl">
        <div className="flex items-center gap-3">
          <Edit3 className="h-3.5 w-3.5 text-lumora-highlight" />
          <p className="text-[10px] font-display font-bold text-white/40 uppercase tracking-widest">
            GitHub Flavored Markdown Supported
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-3 ml-auto">
          <p className="text-[10px] font-display font-bold text-white/20 uppercase tracking-widest">
            {markdown.split(/\s+/).filter(Boolean).length} words · {markdown.length} chars
          </p>
        </div>
      </div>
    </div>
  );
}
