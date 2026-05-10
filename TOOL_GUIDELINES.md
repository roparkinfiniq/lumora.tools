# 🧶 Lumora Tools — AI Developer Guidelines

> **This document is the canonical reference for building new utility tools in the Lumora Tools project.**
> All AI assistants and developers must follow these rules to maintain consistent quality, design, and UX across all tools.

---

## 🌍 Target Audience & Language Policy

> [!IMPORTANT]
> **Lumora Tools is an English-first product targeting an international audience.**
> - All UI copy, button labels, tooltips, placeholder text, and `usageSteps` must be written in **English**.
> - The codebase, comments, and this guidelines document may be in Korean for the developer's reference, but all user-facing strings must be English.
> - Do **not** use Korean in: `step`, `detail`, `placeholder`, `title`, `aria-label`, or any visible text in tool components.

---

## 📁 Project Structure

```
src/
├── App.tsx                    ← Global routing, tool list (tools[]) definition
├── types.ts                   ← Tool, BlogPost type definitions
├── components/
│   ├── GNB.tsx                ← Global navigation bar
│   ├── ToolCard.tsx           ← Card component shown in the utilities list
│   ├── ToolDetailView.tsx     ← Tool detail page layout (left: info panel, right: tool)
│   └── Toast.tsx              ← Global toast notification component
└── tools/
    ├── PdfStudio.tsx          ← ID: "1" — Lumora PDF Studio
    ├── VectorLabGradients.tsx ← ID: "3" — Vector Lab: Gradients
    ├── JsonStructure.tsx      ← ID: "4" — Structure: JSON
    ├── MarkdownEther.tsx      ← ID: "5" — Ether: Markdown
    └── ChromaticExtractor.tsx ← ID: "6" — Chromatic Extractor
```

---

## 🛠 How to Add a New Tool (Checklist)

### Step 1 — Add an entry to `tools[]` in `src/App.tsx`

```ts
{
  id: "7",                       // Next available numeric string ID
  name: "Tool Name",
  description: "One or two sentences. Lead with the function, then the benefit.",
  icon: "LucideIconName",        // lucide-react icon name (type-only, not rendered)
  category: "Dev Tools",         // "Synthesis" | "Design" | "Dev Tools" | "Content" | "Analysis"
  link: "#",
  usageSteps: [
    { step: "Step title",  detail: "Short, specific instruction. Reference button/label names exactly." },
    { step: "Step title",  detail: "..." },
    // 3–4 steps recommended. 5 max.
  ],
}
```

> [!IMPORTANT]
> `step` and `detail` must always be in **English**.

### Step 2 — Create `src/tools/MyNewTool.tsx`

Follow the **Component Template** section below.

### Step 3 — Wire routing in `src/components/ToolDetailView.tsx`

```tsx
// Add to the renderToolLogic() switch statement:
case "7":
  return <MyNewTool />;
```

### Step 4 — Hide the "Playground" label

Add the new ID to the exclusion array in `ToolDetailView.tsx`:
```tsx
{!["1", "3", "4", "5", "6", "7"].includes(tool.id) && (
```

---

## 🎨 Design System

### Color Tokens (Custom Tailwind)

| Token | Purpose | Example use |
|-------|---------|-------------|
| `lumora-highlight` | Purple / primary highlight | Buttons, focus rings, step number badges |
| `lumora-accent` | Pink / accent | Hero text, CTA buttons |
| `lumora-blue` | Blue / info accent | Info elements, links, output indicators |
| `lumora-sub` | Subdued text | Description copy, labels |
| `lumora-text` | Body text | Monospace output text |

### Color Usage Rules Inside Tool Components

```tsx
// ✅ DO: Use tokens with opacity modifiers
className="bg-lumora-highlight/10 text-lumora-highlight border border-lumora-highlight/20"

// ✅ DO: Dark backgrounds
className="bg-[#0a0a0c]"          // Editor / input area background
className="bg-white/[0.02]"        // Inner card section background

// ❌ DON'T: Use modern CSS color functions
// oklch(), oklab() break html2canvas and other rendering libraries
// ❌ DON'T: Hardcode arbitrary hex colors — prefer tokens
```

### Typography Rules

```tsx
// Section label badge (always UPPERCASE)
className="text-[10px] font-display font-bold uppercase tracking-widest text-white/30"

// General body text inside tools
className="text-sm font-medium text-white/80"

// Monospace (code / JSON / HEX values)
className="text-sm font-mono text-lumora-text/90"

// Error messages
className="text-xs text-red-400 font-mono"
```

### Border Radius Rules

| Element | Class |
|---------|-------|
| Card containers | `rounded-[32px]` or `rounded-[24px]` |
| Pill buttons | `rounded-full` |
| Small buttons | `rounded-xl` or `rounded-2xl` |
| Textareas / editors | `rounded-[24px]` |
| Icon containers | `rounded-3xl` or `rounded-2xl` |
| Tags / badges | `rounded-full` |

---

## 📐 Tool Component Template

Every new tool **must** follow this structure:

```tsx
// src/tools/MyNewTool.tsx

import { useState } from "react";
import { motion } from "motion/react";
import Toast from "../components/Toast";
import { SomeLucideIcon, Trash2 } from "lucide-react";

export default function MyNewTool() {
  const [showToast, setShowToast] = useState(false);

  const triggerToast = () => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  return (
    <div className="w-full h-full flex flex-col gap-6">

      {/* 1. Global Toast — always include */}
      <Toast
        isVisible={showToast}
        message="Copied!"
        onClose={() => setShowToast(false)}
      />

      {/* 2. Tool Header — tool name + primary action buttons */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white/[0.02] border border-white/5 p-4 rounded-2xl">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-lumora-highlight/20 flex items-center justify-center text-lumora-highlight">
            <SomeLucideIcon className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-display font-bold text-white uppercase tracking-wider">Tool Name</h3>
            <p className="text-[10px] text-white/30 font-display font-bold uppercase tracking-widest">Subtitle V1.0</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Primary CTA */}
          <button
            onClick={() => { /* action */ triggerToast(); }}
            className="px-5 py-2 bg-white text-black hover:bg-white/90 text-[11px] font-display font-bold uppercase tracking-wider rounded-xl transition-all shadow-lg active:scale-95 flex items-center gap-2"
          >
            <SomeLucideIcon className="h-3.5 w-3.5" />
            Main Action
          </button>
          {/* Secondary action (e.g. reset) */}
          <button
            className="p-2.5 bg-white/5 hover:bg-red-500/10 text-white/50 hover:text-red-400 rounded-xl transition-all border border-white/10"
            title="Clear"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* 3. Main Workspace — tool-specific content here */}
      <div className="flex-1 min-h-[450px]">
        {/* ... core tool functionality ... */}
      </div>

      {/* 4. Footer Info Bar — always include */}
      <div className="flex items-center gap-4 px-5 py-3 bg-white/[0.01] border border-white/5 rounded-2xl">
        <SomeLucideIcon className="h-3.5 w-3.5 text-lumora-highlight" />
        <p className="text-[10px] font-display font-bold text-white/30 uppercase tracking-widest">
          Local-first processing. Your data never leaves your browser.
        </p>
      </div>
    </div>
  );
}
```

---

## ✅ UX Rules & Prohibitions

### Required Elements (never omit these)

- **Toast notification**: Use `<Toast>` for every copy/download action. Never create a custom alert.
- **Empty state**: When there's no input or output, show a clear visual prompt. Never leave an empty area.
- **Error state**: Invalid input → show a specific error message using `text-red-400`.
- **Loading state**: Any async operation (image analysis, PDF generation) requires a loading indicator.
- **Footer bar**: Each tool must have a bottom info bar showing "Local-first" or a key usage hint.

### Prohibited Patterns

- ❌ Do not add `Run Logic`, `Copy`, `Download`, or `Share` buttons to `ToolDetailView` — each tool manages its own actions internally.
- ❌ No buttons without real `onClick` handlers.
- ❌ No placeholder text like "Coming Soon" or "Under Construction".
- ❌ No `oklch()` or `oklab()` CSS color functions — breaks `html2canvas` and similar libs.
- ❌ No identical fake specs ("0.2s", "V3.2", "Safe") across all tools — these were removed.
- ❌ **No Korean user-facing strings** — all copy must be English.

---

## 🔔 Toast Component Usage

```tsx
import Toast from "../components/Toast";

const [showToast, setShowToast] = useState(false);

const triggerToast = () => {
  setShowToast(true);
  setTimeout(() => setShowToast(false), 2000);
};

<Toast
  isVisible={showToast}
  message="Copied!"           // or "Downloaded!", "Saved!" etc.
  onClose={() => setShowToast(false)}
/>
```

> **Note**: Toast is positioned `fixed bottom-8 left-1/2 -translate-x-1/2` — it always appears centered at the bottom of the screen, regardless of scroll position.

---

## 📋 Category Reference

Use one of these existing categories. Adding a new category requires updating both `App.tsx` and this doc.

| Category | Description | Example Tool |
|---|---|---|
| `Synthesis` | Generation & conversion tools | PDF Studio |
| `Design` | Visual / creative tools | Vector Lab: Gradients |
| `Dev Tools` | Developer utilities | Structure: JSON |
| `Content` | Writing & editing tools | Ether: Markdown |
| `Analysis` | Extraction & analysis tools | Chromatic Extractor |

---

## 🌐 Routing Rules

This project uses **state-based routing** + `window.history.replaceState` instead of React Router.

```ts
// URL mapping in App.tsx
const URL_TO_VIEW: Record<string, string> = {
  "/": "home",
  "/utilities": "utilities",
  "/journal": "insights",
  "/about": "studio",
  "/code-tiara": "code-tiara",
};
```

For new top-level pages, add entries to both `URL_TO_VIEW` and `VIEW_TO_URL`.  
Individual tools have no URL — they're managed via the `selectedTool` state.

---

## 📦 Key Dependencies

| Package | Purpose |
|---------|---------|
| `motion/react` (Framer Motion v12) | Animations & transitions |
| `lucide-react` | Icon set |
| `marked` | Markdown → HTML parsing |
| `jspdf` | PDF generation |
| `html2canvas` | DOM → image capture (for PDF export) |

---

## 💡 Tips for AI Assistants

1. **Check existing tools first.** `JsonStructure.tsx` is the simplest and cleanest pattern to follow.
2. **Tool IDs are strings.** Use `"7"`, `"8"`, etc.
3. **`usageSteps` is required.** Without it, the "How to Use" section won't render in the left panel.
4. **Component length.** If a single `.tsx` file exceeds ~300 lines, consider extracting sub-components.
5. **Tokens over raw colors.** Use `bg-lumora-highlight` instead of `bg-purple-500`. Always check for a token first.
6. **Animate state transitions.** Use `AnimatePresence` + `motion.div` for empty↔filled and tab-switch transitions.
7. **All copy is English.** If you're tempted to write a Korean string in the UI, don't — translate it first.
