# 🧶 Lumora Tools — Official AI & Developer Guidelines

> **This document is the canonical design, architecture, and coding standard for Lumora Tools.**
> All AI assistants, peer agents, and human developers MUST consult and follow these rules to maintain consistent visual quality, responsive balance, and performance across all pages and tools.

---

## 🌍 Target Audience & Language Policy

> [!IMPORTANT]
> **Lumora Tools is an English-first product targeting an international audience.**
> - All UI copy, button labels, tooltips, placeholder text, and `usageSteps` must be written in **English**.
> - The codebase, comments, commit messages, and guidelines may be written in Korean for developer convenience, but all user-facing strings MUST be English.
> - Do **not** use Korean in user-facing elements: `step`, `detail`, `placeholder`, `title`, `aria-label`, or any visible UI text in components.

---

## 📁 Project Structure & Key Files

```
c:\Github\lumora.tools\lumora.tools\
├── TOOL_GUIDELINES.md         ← Official AI Developer Guidelines (this file)
├── src/
│   ├── App.tsx                ← Global state routing, URL mapping, tool list (tools[]) definition
│   ├── types.ts               ← Tool, BlogPost type definitions
│   ├── components/
│   │   ├── GNB.tsx            ← Floating global navigation bar (max-w-4xl)
│   │   ├── ToolCard.tsx       ← Card component shown in utilities list
│   │   ├── ToolDetailView.tsx ← Tool workspace frame (max-w-6xl)
│   │   ├── CodeTiaraView.tsx  ← Flagship Code Tiara product page (max-w-6xl)
│   │   ├── StudioView.tsx     ← About Lumora page (max-w-6xl)
│   │   └── Toast.tsx          ← Global centered toast notification component
│   └── tools/
│       ├── PdfStudio.tsx          ← ID: "1" — Lumora PDF Studio
│       ├── VectorLabGradients.tsx ← ID: "3" — Vector Lab: Gradients
│       ├── JsonStructure.tsx      ← ID: "4" — Structure: JSON
│       ├── MarkdownEther.tsx      ← ID: "5" — Ether: Markdown
│       ├── ChromaticExtractor.tsx ← ID: "6" — Chromatic Extractor
│       ├── WorkoutCanvas.tsx      ← ID: "7" — Workout Canvas
│       ├── PngJpgConverter.tsx    ← ID: "8" — PNG/JPG Converter
│       ├── IcoConverter.tsx       ← ID: "9" — ICO Converter
│       ├── ImageCompressor.tsx    ← ID: "10" — Image Compressor
│       ├── HeicToJpg.tsx          ← ID: "11" — HEIC to JPG
│       ├── ImageToPdf.tsx         ← ID: "12" — Image to PDF
│       ├── PdfToImage.tsx         ← ID: "13" — PDF to Image Converter
│       ├── PdfMerger.tsx          ← ID: "14" — PDF Merger
│       ├── GlobalSizeConverter.tsx← ID: "15" — Global Size Converter
│       └── BarcodeStudio.tsx      ← ID: "16" — Barcode & Label Studio
```

---

## 📐 Page Layout & Container Max-Width Standard

> [!IMPORTANT]
> **Never use unconstrained `container mx-auto px-6` without a `max-w-6xl` limit.**
> On 2K, 4K, and 34"+ Ultrawide monitors, unconstrained containers expand across 2500px+, causing elements to stretch awkwardly apart and text to stick to far left walls.

### 1. Main Page Container Rule
All main pages (`Home`, `Utilities`, `Code Tiara`, `About / Studio`, `Journal / Insights`, `ToolDetailView`) MUST wrap their main content in:

```tsx
<div className="container max-w-6xl mx-auto px-6">
```
*`max-w-6xl` (1152px) is the official project container width.*

### 2. Header & Manifesto Centering
- Do NOT use `lg:mx-0` or `lg:items-start` on section header text blocks if it causes text to stick to the far left screen edge while leaving empty black void on the right.
- Use `max-w-4xl mx-auto text-center` or `max-w-4xl mx-auto` to keep section titles, quotes, and descriptions balanced and centered in the viewport.

---

## 🎨 Design System & Color Tokens

### Color Tokens (Tailwind)

| Token | Purpose | Example Usage |
|---|---|---|
| `lumora-highlight` | Purple / primary highlight | Buttons, focus rings, step number badges |
| `lumora-accent` | Pink / accent | Hero text, CTA buttons |
| `lumora-blue` | Blue / info accent | Info elements, links, output indicators |
| `lumora-sub` | Subdued text | Description copy, labels |
| `lumora-text` | Body text | Monospace output text |

### ✏️ Text Input, Select & Textarea Standard

All text inputs, textareas, and select dropdowns inside tool components MUST use translucent glassmorphic styling rather than heavy solid pitch-black (`bg-[#0a0a0c]`):

```tsx
// Text Input / Select Dropdown
className="w-full bg-black/30 border border-white/10 hover:border-white/20 focus:border-lumora-highlight/40 focus:bg-black/50 focus:outline-none rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-white/20 transition-all"

// Select Dropdown Options (ensures readable dropdown menus)
<option value="val" className="bg-[#0a0a0c]">Option Label</option>

// Textarea / Code Editor
className="w-full bg-black/30 border border-white/10 hover:border-white/20 focus:border-lumora-highlight/40 focus:bg-black/50 focus:outline-none rounded-[24px] p-5 text-xs font-mono text-white/90 placeholder:text-white/20 transition-all resize-none"
```

### Typography Rules

```tsx
// Section label badge (always UPPERCASE)
className="text-[10px] font-display font-bold uppercase tracking-widest text-white/30"

// Body text
className="text-sm font-medium text-white/80"

// Monospace (code / JSON / HEX values)
className="text-sm font-mono text-lumora-text/90"

// Error messages
className="text-xs text-red-400 font-mono"
```

---

## 🔎 Zoom, Magnification & Document Viewer Engine Standard

For tools featuring canvas zoom, document viewing, or page extraction (e.g. `PdfToImage.tsx`, `ImageCompressor.tsx`):

### 1. Zoom Multiplier & Pan Support
- Zoom range MUST support from **100% up to 800% (8.0x)**.
- Transform wrapper style:
  ```tsx
  style={{
    transform: `translate(${transX}px, ${transY}px) scale(${scale})`,
    transition: isPanning ? "none" : "transform 0.15s ease-out",
    transformOrigin: "center center"
  }}
  ```
- Do NOT add `max-w-full max-h-full` CSS constraints on the canvas container wrapper that clamp the element size during `scale()`.

### 2. High-DPI Vector Clarity (PDF Rendering)
- When rendering PDF pages via PDF.js to HTML5 Canvas, incorporate `resolutionScale * devicePixelRatio * currentZoom`:
  ```tsx
  const dpr = window.devicePixelRatio || 1;
  const targetScale = baseScale * Math.max(resolutionScale, 1.5) * dpr * Math.min(currentZoom, 2.5);
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ```
- This ensures PDF text glyphs, table lines, and seals remain **100% vector-sharp and crystal clear** at any zoom level.

### 3. Viewer Container Height
- Document stage containers MUST have generous vertical height:
  ```tsx
  className="flex-1 min-h-[580px] md:min-h-[640px] bg-lumora-bg/40 border border-white/5 rounded-2xl relative overflow-hidden flex items-center justify-center cursor-grab"
  ```
- This prevents portrait A4 documents from being vertically squished or clipped.

---

## 🛠 How to Add a New Tool (Checklist)

### Step 1 — Add entry to `tools[]` in `src/App.tsx`

```ts
{
  id: "17",                      // Next numeric string ID
  name: "Tool Name",
  description: "Lead with function, then the benefit.",
  icon: "LucideIconName",
  category: "Dev Tools",        // "Synthesis" | "Design" | "Dev Tools" | "Content" | "Analysis"
  link: "#",
  usageSteps: [
    { step: "Step title",  detail: "Short, specific English instruction." },
    { step: "Step title",  detail: "..." },
  ],
}
```

### Step 2 — Create `src/tools/MyNewTool.tsx`
Equip with `<Toast>`, Tool Header, Translucent Glass Inputs, and Local-First Footer Info Bar.

### Step 3 — Wire routing in `src/components/ToolDetailView.tsx`
Add `case "17": return <MyNewTool />;` to `renderToolLogic()`.

---

## ✅ UX Rules & Prohibitions

- **Toast Notification**: Use `<Toast>` for every copy/download action.
- **Local-First Bar**: Every tool component must end with a footer bar emphasizing local processing.
- **No Korean User Strings**: All visible UI text must be in English.
- **No Blocking Alerts**: Use inline toast notifications or red error labels.
- **Animate State Transitions**: Use `AnimatePresence` + `motion.div` (`duration: 0.5` with `ease: "easeInOut"`).

---

## 💡 Quick Checklist for AI Assistants

1. **Check container width**: Keep all page sections wrapped in `container max-w-6xl mx-auto px-6`.
2. **Check input styling**: Apply `bg-black/30 border border-white/10 hover:border-white/20 focus:border-lumora-highlight/40 focus:bg-black/50`.
3. **Check zoom scaling**: Ensure `transform: scale()` wrapper is unconstrained up to 800%.
4. **Run lint and build**: Execute `npm.cmd run lint` (`tsc --noEmit`) and `npm.cmd run build` (`vite build`) after making edits to guarantee zero compilation errors.
