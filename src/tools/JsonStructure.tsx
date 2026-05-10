import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import Toast from "../components/Toast";
import { 
  Braces, 
  Copy, 
  Trash2, 
  Zap, 
  AlertCircle,
  Maximize2,
  Minimize2,
  FileJson
} from "lucide-react";


export default function JsonStructure() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [isAutoFormat, setIsAutoFormat] = useState(true);

  const formatJson = (val: string, indent: number = 2) => {
    // ... (rest of formatJson logic remains unchanged)
    if (!val.trim()) {
      setOutput("");
      setError(null);
      return;
    }
    try {
      const parsed = JSON.parse(val);
      setOutput(JSON.stringify(parsed, null, indent));
      setError(null);
    } catch (e: any) {
      setError(e.message);
      setOutput("");
    }
  };

  const handleMinify = () => {
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed));
      setError(null);
    } catch (e: any) {
      setError(e.message);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output || input);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  const handleClear = () => {
    setInput("");
    setOutput("");
    setError(null);
  };

  useEffect(() => {
    if (isAutoFormat && input) {
      const timer = setTimeout(() => {
        formatJson(input);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [input, isAutoFormat]);

  return (
    <div className="w-full h-full flex flex-col gap-6">
      <Toast 
        isVisible={showToast} 
        message="복사되었습니다" 
        onClose={() => setShowToast(false)} 
      />
      {/* Tool Header/Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white/[0.02] border border-white/5 p-4 rounded-2xl">
        <div className="flex items-center gap-4">
          <button
            onClick={() => formatJson(input)}
            className="px-4 py-2 bg-lumora-highlight/10 hover:bg-lumora-highlight/20 text-lumora-highlight text-xs font-display font-bold rounded-xl transition-all border border-lumora-highlight/20"
          >
            Prettify
          </button>
          <button
            onClick={handleMinify}
            className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white/70 text-xs font-display font-bold rounded-xl transition-all border border-white/10"
          >
            Minify
          </button>
          <div className="w-px h-4 bg-white/10 mx-1" />
          <label className="flex items-center gap-2 cursor-pointer group">
            <div 
              onClick={() => setIsAutoFormat(!isAutoFormat)}
              className={`w-8 h-4 rounded-full relative transition-colors ${isAutoFormat ? 'bg-lumora-highlight' : 'bg-white/10'}`}
            >
              <div 
                className="absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all"
                style={{ left: isAutoFormat ? '18px' : '2px' }}
              />
            </div>
            <span className="text-[10px] font-display font-bold text-white/40 group-hover:text-white/60 transition-colors uppercase tracking-widest">Auto</span>
          </label>
        </div>

        <div className="flex items-center gap-2">
          <motion.button
            onClick={handleCopy}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="p-2.5 bg-white/5 hover:bg-white/10 text-white/50 hover:text-white rounded-xl transition-all border border-white/10 group relative"
            title="Copy Output"
          >
            <Copy className="h-4 w-4 text-white/40 group-hover:text-white transition-colors" />
          </motion.button>
          <button
            onClick={handleClear}
            className="p-2.5 bg-white/5 hover:bg-red-500/10 text-white/50 hover:text-red-400 rounded-xl transition-all border border-white/10"
            title="Clear All"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>


      {/* Editor Main Area */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-[400px]">
        {/* Input Pane */}
        <div className="flex flex-col gap-3 h-full">
          <div className="flex items-center justify-between px-2">
            <span className="text-[10px] font-display font-bold text-white/30 uppercase tracking-widest flex items-center gap-2">
              <Maximize2 className="h-3 w-3" /> Raw Input
            </span>
            {error && (
              <span className="text-[10px] font-display font-bold text-red-400 uppercase tracking-widest flex items-center gap-1.5 animate-pulse">
                <AlertCircle className="h-3 w-3" /> Invalid JSON
              </span>
            )}
          </div>
          <div className="flex-1 relative group">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder='Paste your JSON here... e.g. {"name": "Lumora"}'
              className={`w-full h-full bg-[#0a0a0c] border rounded-[24px] p-6 text-sm font-mono text-white/80 placeholder:text-white/10 focus:outline-none focus:ring-2 transition-all resize-none ${error ? 'border-red-500/30 focus:ring-red-500/20' : 'border-white/5 focus:border-lumora-highlight/30 focus:ring-lumora-highlight/10'}`}
              spellCheck="false"
            />
            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <Braces className="h-4 w-4 text-white/10" />
            </div>
          </div>
        </div>

        {/* Output Pane */}
        <div className="flex flex-col gap-3 h-full">
          <div className="flex items-center justify-between px-2">
            <span className="text-[10px] font-display font-bold text-white/30 uppercase tracking-widest flex items-center gap-2">
              <Minimize2 className="h-3 w-3" /> Formatted Result
            </span>
            {output && (
              <span className="text-[10px] font-display font-bold text-lumora-blue uppercase tracking-widest">
                {output.length} characters
              </span>
            )}
          </div>
          <div className="flex-1 relative overflow-hidden bg-[#0a0a0c]/50 border border-white/5 rounded-[24px] group">
            <div className="absolute inset-0 overflow-auto p-6 no-scrollbar">
              {output ? (
                <pre className="text-sm font-mono leading-relaxed text-lumora-text/90">
                  {output.split('\n').map((line, i) => {
                    // Very basic syntax highlighting logic
                    const isKey = line.match(/"([^"]+)":/);
                    const isString = line.match(/: "([^"]*)"/);
                    const isNumber = line.match(/: ([\d.]+)/);
                    const isBool = line.match(/: (true|false|null)/);

                    return (
                      <div key={i} className="hover:bg-white/5 px-2 -mx-2 rounded transition-colors group/line">
                        <span className="inline-block w-6 text-white/10 text-right mr-4 select-none font-mono text-[10px]">
                          {i + 1}
                        </span>
                        <span className="whitespace-pre">
                          {line.split(':').map((part, index, arr) => {
                            if (index === 0 && arr.length > 1) {
                              return <span key={index} className="text-lumora-highlight">{part}:</span>;
                            }
                            if (part.includes('"')) {
                              return <span key={index} className="text-lumora-blue">{part}</span>;
                            }
                            if (part.match(/(true|false|null)/)) {
                              return <span key={index} className="text-orange-300">{part}</span>;
                            }
                            if (part.match(/[\d.]+/)) {
                              return <span key={index} className="text-amber-200">{part}</span>;
                            }
                            return <span key={index}>{part}</span>;
                          })}
                        </span>
                      </div>
                    );
                  })}
                </pre>
              ) : error ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-8">
                  <div className="h-16 w-16 rounded-3xl bg-red-500/10 flex items-center justify-center mb-6 border border-red-500/20">
                    <AlertCircle className="h-8 w-8 text-red-400" />
                  </div>
                  <h4 className="text-white font-display font-bold mb-2">Parsing Error</h4>
                  <p className="text-xs text-white/40 font-mono max-w-[200px] break-words">{error}</p>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center opacity-20">
                  <FileJson className="h-12 w-12 mb-4" />
                  <p className="text-xs font-display font-bold uppercase tracking-widest">Waiting for input</p>
                </div>
              )}
            </div>
            {/* Visual Flare */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-lumora-highlight/5 blur-3xl pointer-events-none rounded-full" />
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="flex items-center gap-4 px-4 py-3 bg-white/[0.01] border border-white/5 rounded-xl">
        <Zap className="h-3 w-3 text-lumora-highlight" />
        <p className="text-[10px] font-display font-bold text-white/30 uppercase tracking-widest">
          Local-first processing. Your data never leaves your browser.
        </p>
      </div>
    </div>
  );
}
