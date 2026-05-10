import { useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import Toast from "../components/Toast";
import { 
  FileText, 
  Download, 
  Layout, 
  Type, 
  User, 
  Receipt,
  Plus,
  Trash2,
  ChevronRight,
  Monitor,
  Printer
} from "lucide-react";

type TemplateType = "note" | "resume" | "invoice";

export default function PdfStudio() {
  const [template, setTemplate] = useState<TemplateType>("note");
  const [showToast, setShowToast] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  // Note Data
  const [noteData, setNoteData] = useState({
    title: "Untitled Project Note",
    date: new Date().toLocaleDateString(),
    content: "Write your important notes here. Lumora PDF Studio ensures your typography remains crisp and professional when synthesized into a PDF document."
  });

  // Resume Data
  const [resumeData, setResumeData] = useState({
    name: "Alex Lumora",
    role: "Senior Creative Technologist",
    email: "hello@lumora.tools",
    summary: "Dedicated to building immersive web experiences that bridge the gap between design and high-performance engineering.",
    experience: [
      { id: "1", company: "Lumora Labs", role: "Founder", period: "2024 - Present" },
      { id: "2", company: "Design Infiniq", role: "Lead Dev", period: "2021 - 2023" }
    ]
  });

  // Invoice Data
  const [invoiceData, setInvoiceData] = useState({
    billTo: "Client Name",
    invoiceNo: "INV-2026-001",
    items: [
      { id: "1", desc: "Consulting Services", qty: 1, price: 1200 },
      { id: "2", desc: "Design Synthesis", qty: 1, price: 850 }
    ]
  });

  const handleExport = async () => {
    if (!previewRef.current) return;
    
    setIsExporting(true);
    try {
      const canvas = await html2canvas(previewRef.current, {
        scale: 2, // Higher quality
        useCORS: true,
        backgroundColor: "#ffffff"
      });
      
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4"
      });
      
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`lumora-${template}-${Date.now()}.pdf`);
      
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
    } catch (error) {
      console.error("Export failed:", error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="w-full h-full flex flex-col gap-6">
      <Toast 
        isVisible={showToast} 
        message="PDF가 다운로드되었습니다" 
        onClose={() => setShowToast(false)} 
      />

      {/* Tool Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white/[0.02] border border-white/5 p-4 rounded-2xl">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-lumora-blue/20 flex items-center justify-center text-lumora-blue">
            <Printer className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-display font-bold text-white uppercase tracking-wider">Synthesis Studio</h3>
            <p className="text-[10px] text-white/30 font-display font-bold uppercase tracking-widest">A4 High-Fidelity PDF Engine</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex bg-white/5 p-1 rounded-xl border border-white/10 mr-2">
            {[
              { id: "note", icon: Type, label: "Note" },
              { id: "resume", icon: User, label: "Resume" },
              { id: "invoice", icon: Receipt, label: "Invoice" },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setTemplate(t.id as TemplateType)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-display font-bold uppercase tracking-wider transition-all ${
                  template === t.id ? "bg-white text-black shadow-lg" : "text-white/30 hover:text-white"
                }`}
              >
                <t.icon className="h-3 w-3" />
                <span className="hidden sm:inline">{t.label}</span>
              </button>
            ))}
          </div>
          <motion.button
            onClick={handleExport}
            disabled={isExporting}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`px-5 py-2 bg-white text-black text-[11px] font-display font-bold uppercase tracking-wider rounded-xl transition-all shadow-lg flex items-center gap-2 ${isExporting ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {isExporting ? (
              <div className="h-3.5 w-3.5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
            ) : (
              <Download className="h-3.5 w-3.5" />
            )}
            {isExporting ? "Synthesizing..." : "Export PDF"}
          </motion.button>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 min-h-[500px]">
        {/* Left: Inputs */}
        <div className="lg:col-span-5 flex flex-col gap-4 overflow-y-auto no-scrollbar max-h-[700px] lg:max-h-none">
          <div className="bg-white/[0.02] border border-white/5 rounded-[32px] p-8 space-y-8">
            <h4 className="text-[10px] font-display font-bold text-white/30 uppercase tracking-widest flex items-center gap-2">
              <Layout className="h-3 w-3" /> Synthesis Context
            </h4>

            {template === "note" && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[11px] font-display font-bold text-white/40 uppercase tracking-widest px-1">Document Title</label>
                  <input 
                    type="text" 
                    value={noteData.title}
                    onChange={(e) => setNoteData({...noteData, title: e.target.value})}
                    className="w-full bg-[#0a0a0c] border border-white/5 rounded-2xl px-5 py-4 text-sm text-white focus:outline-none focus:border-lumora-blue/50 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-display font-bold text-white/40 uppercase tracking-widest px-1">Main Content</label>
                  <textarea 
                    value={noteData.content}
                    onChange={(e) => setNoteData({...noteData, content: e.target.value})}
                    className="w-full h-48 bg-[#0a0a0c] border border-white/5 rounded-2xl px-5 py-4 text-sm text-white/80 focus:outline-none focus:border-lumora-blue/50 transition-all resize-none leading-relaxed"
                  />
                </div>
              </div>
            )}

            {template === "resume" && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[11px] font-display font-bold text-white/40 uppercase tracking-widest px-1">Full Name</label>
                  <input 
                    type="text" 
                    value={resumeData.name}
                    onChange={(e) => setResumeData({...resumeData, name: e.target.value})}
                    className="w-full bg-[#0a0a0c] border border-white/5 rounded-2xl px-5 py-4 text-sm text-white focus:outline-none focus:border-lumora-blue/50 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-display font-bold text-white/40 uppercase tracking-widest px-1">Summary</label>
                  <textarea 
                    value={resumeData.summary}
                    onChange={(e) => setResumeData({...resumeData, summary: e.target.value})}
                    className="w-full h-24 bg-[#0a0a0c] border border-white/5 rounded-2xl px-5 py-4 text-sm text-white/80 focus:outline-none focus:border-lumora-blue/50 transition-all resize-none"
                  />
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between px-1">
                    <label className="text-[11px] font-display font-bold text-white/40 uppercase tracking-widest">Experience</label>
                    <button onClick={() => setResumeData({...resumeData, experience: [...resumeData.experience, { id: Date.now().toString(), company: "Company", role: "Role", period: "Period" }]})} className="p-1 hover:text-white text-white/40"><Plus className="h-4 w-4" /></button>
                  </div>
                  {resumeData.experience.map((exp) => (
                    <div key={exp.id} className="p-4 bg-white/5 rounded-2xl border border-white/5 flex flex-col gap-3 group">
                      <div className="flex justify-between items-center">
                        <input className="bg-transparent border-none p-0 text-white font-bold text-sm focus:ring-0" value={exp.company} onChange={(e) => setResumeData({...resumeData, experience: resumeData.experience.map(x => x.id === exp.id ? {...x, company: e.target.value} : x)})} />
                        <button onClick={() => setResumeData({...resumeData, experience: resumeData.experience.filter(x => x.id !== exp.id)})} className="opacity-0 group-hover:opacity-100 p-1 text-red-400 hover:bg-red-400/10 rounded-lg"><Trash2 className="h-3.5 w-3.5" /></button>
                      </div>
                      <input className="bg-transparent border-none p-0 text-white/50 text-xs focus:ring-0" value={exp.role} onChange={(e) => setResumeData({...resumeData, experience: resumeData.experience.map(x => x.id === exp.id ? {...x, role: e.target.value} : x)})} />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {template === "invoice" && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[11px] font-display font-bold text-white/40 uppercase tracking-widest px-1">Bill To</label>
                  <input 
                    type="text" 
                    value={invoiceData.billTo}
                    onChange={(e) => setInvoiceData({...invoiceData, billTo: e.target.value})}
                    className="w-full bg-[#0a0a0c] border border-white/5 rounded-2xl px-5 py-4 text-sm text-white focus:outline-none focus:border-lumora-blue/50 transition-all"
                  />
                </div>
                <div className="space-y-4">
                  <label className="text-[11px] font-display font-bold text-white/40 uppercase tracking-widest px-1">Items</label>
                  {invoiceData.items.map((item) => (
                    <div key={item.id} className="grid grid-cols-12 gap-3">
                      <input 
                        className="col-span-8 bg-[#0a0a0c] border border-white/5 rounded-xl px-4 py-3 text-xs text-white"
                        value={item.desc}
                        onChange={(e) => setInvoiceData({...invoiceData, items: invoiceData.items.map(x => x.id === item.id ? {...x, desc: e.target.value} : x)})}
                      />
                      <input 
                        className="col-span-4 bg-[#0a0a0c] border border-white/5 rounded-xl px-4 py-3 text-xs text-white text-right font-mono"
                        type="number"
                        value={item.price}
                        onChange={(e) => setInvoiceData({...invoiceData, items: invoiceData.items.map(x => x.id === item.id ? {...x, price: parseInt(e.target.value) || 0} : x)})}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right: Preview (A4 Page) */}
        <div className="lg:col-span-7 flex flex-col gap-3 h-full overflow-hidden">
          <div className="flex items-center justify-between px-2">
            <span className="text-[10px] font-display font-bold text-white/30 uppercase tracking-widest flex items-center gap-2">
              <Monitor className="h-3 w-3" /> Live Synthesis Preview
            </span>
            <div className="flex items-center gap-4">
              <span className="text-[10px] font-display font-bold text-white/20 uppercase tracking-widest">Scale: 1:1 A4</span>
              <div className="h-px w-8 bg-white/10" />
              <div className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-lumora-blue animate-pulse" />
                <span className="text-[10px] font-display font-bold text-lumora-blue/50 uppercase tracking-widest">Processing</span>
              </div>
            </div>
          </div>

          <div className="flex-1 bg-white/[0.03] border border-white/5 rounded-[40px] overflow-auto no-scrollbar p-12 flex justify-center shadow-inner">
            {/* The Actual A4 Page */}
            <div 
              ref={previewRef}
              className="bg-[#ffffff] w-[210mm] min-h-[297mm] shadow-[0_30px_100px_rgba(0,0,0,0.5)] flex flex-col p-[20mm] text-[#000000] overflow-hidden origin-top transform"
              style={{ 
                fontFamily: "Inter, system-ui, sans-serif",
                transform: "scale(0.8)", // Fixed scale for desktop preview visibility
                backgroundColor: "#ffffff",
                color: "#000000"
              }}
            >
              {template === "note" && (
                <div className="h-full flex flex-col">
                  <div className="flex items-center justify-between border-b-2 border-[#000000] pb-8 mb-12">
                    <div>
                      <h1 className="text-4xl font-bold tracking-tighter mb-2">{noteData.title}</h1>
                      <p className="text-sm font-medium opacity-40">{noteData.date}</p>
                    </div>
                    <div className="h-12 w-12 bg-[#000000] rounded-2xl flex items-center justify-center">
                      <div className="h-4 w-4 border-2 border-[#ffffff] rounded-full" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="text-lg leading-[1.8] whitespace-pre-wrap">{noteData.content}</p>
                  </div>
                  <div className="pt-20 border-t border-[#f0f0f0]">
                    <p className="text-[10px] font-bold uppercase tracking-widest opacity-20">Synthesized by Lumora PDF Studio — Confidential</p>
                  </div>
                </div>
              )}

              {template === "resume" && (
                <div className="h-full flex flex-col">
                  <div className="mb-20">
                    <h1 className="text-6xl font-bold tracking-tighter mb-4">{resumeData.name}</h1>
                    <p className="text-xl font-medium text-[#444444] mb-6">{resumeData.role}</p>
                    <p className="text-sm font-mono opacity-40">{resumeData.email}</p>
                  </div>
                  
                  <div className="grid grid-cols-12 gap-12 flex-1">
                    <div className="col-span-4">
                      <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] mb-6 opacity-30">Profile</h3>
                      <p className="text-sm leading-relaxed">{resumeData.summary}</p>
                    </div>
                    <div className="col-span-8">
                      <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] mb-8 opacity-30">Career Path</h3>
                      <div className="space-y-12">
                        {resumeData.experience.map(exp => (
                          <div key={exp.id} className="relative pl-8 border-l border-[#eeeeee]">
                            <div className="absolute left-[-4px] top-1.5 h-2 w-2 rounded-full bg-[#000000]" />
                            <h4 className="text-xl font-bold mb-1">{exp.company}</h4>
                            <p className="text-sm font-medium text-[#666666] mb-2">{exp.role}</p>
                            <p className="text-[10px] font-mono opacity-30 uppercase">{exp.period}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-auto pt-12 flex items-center justify-between opacity-20">
                    <p className="text-[10px] font-bold uppercase tracking-widest">Portfolio 2026</p>
                    <p className="text-[10px] font-bold uppercase tracking-widest">Page 01</p>
                  </div>
                </div>
              )}

              {template === "invoice" && (
                <div className="h-full flex flex-col">
                  <div className="flex justify-between items-start mb-24">
                    <div>
                      <div className="h-10 w-10 bg-[#000000] rounded-xl mb-6" />
                      <p className="text-[10px] font-bold uppercase tracking-widest opacity-30 mb-2">Invoice To</p>
                      <p className="text-2xl font-bold">{invoiceData.billTo}</p>
                    </div>
                    <div className="text-right">
                      <h1 className="text-5xl font-bold tracking-tighter mb-4">Invoice</h1>
                      <p className="text-sm font-mono opacity-40">{invoiceData.invoiceNo}</p>
                    </div>
                  </div>

                  <div className="flex-1">
                    <div className="grid grid-cols-12 border-b border-[#000000] pb-4 mb-6 opacity-30">
                      <div className="col-span-9 text-[10px] font-bold uppercase tracking-widest">Description</div>
                      <div className="col-span-3 text-[10px] font-bold uppercase tracking-widest text-right">Amount</div>
                    </div>
                    <div className="space-y-6">
                      {invoiceData.items.map(item => (
                        <div key={item.id} className="grid grid-cols-12 items-center">
                          <div className="col-span-9 font-bold text-lg">{item.desc}</div>
                          <div className="col-span-3 text-right font-mono text-lg">${item.price.toLocaleString()}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-auto border-t-2 border-[#000000] pt-12 flex justify-between items-end">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest opacity-30 mb-2">Payment Info</p>
                      <p className="text-sm font-medium">Bank Transfer / Lumora Pay</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-bold uppercase tracking-widest opacity-30 mb-2">Total Synthesis</p>
                      <p className="text-6xl font-bold tracking-tighter">${invoiceData.items.reduce((acc, i) => acc + i.price, 0).toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4 px-5 py-3 bg-white/[0.01] border border-white/5 rounded-2xl">
        <ChevronRight className="h-3.5 w-3.5 text-lumora-blue" />
        <p className="text-[10px] font-display font-bold text-white/30 uppercase tracking-widest">
          High-Fidelity PDF synthesis utilizing browser-native GPU acceleration. Your data never leaves your browser.
        </p>
      </div>
    </div>
  );
}
