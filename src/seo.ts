import { BlogPost, Tool } from "./types";

// Search-result title, description, and canonical address for each page.
// The site is mainly a collection of free tools that run in the browser, plus
// Lumora's apps (Doquarium, Code Tiara), a journal, and an about page, so each
// page describes itself instead of reusing one site-wide title.

export const SITE_ORIGIN = "https://www.lumora.tools";
const SITE_NAME = "Lumora Tools";

export interface Seo {
  title: string;
  description: string;
}

const PAGES: Record<string, Seo> = {
  home: {
    title: "Lumora Tools — Free, Private Web Tools for PDF, Images & More",
    description:
      "A small, playful collection of free web tools: make and merge PDFs, convert and compress images, format JSON, build barcodes, and more. Everything runs right in your browser. No sign-up, no uploads.",
  },
  utilities: {
    title: "All Tools — Free PDF, Image & Developer Utilities | Lumora Tools",
    description:
      "Browse 15 free browser tools: PDF studio, PDF merger, PDF to image, image to PDF, PNG/JPG, HEIC to JPG, ICO converter, image compressor, JSON formatter, Markdown editor, gradients, barcodes, and size charts.",
  },
  insights: {
    title: "Journal — Quiet Thoughts on Rest, Focus & Life Offline | Lumora Tools",
    description:
      "Personal notes and weekend reflections on rest, stillness, paper notebooks, AI, and life outside the screen.",
  },
  studio: {
    title: "About Lumora — The Maker Behind Lumora Tools",
    description:
      "Less friction, more focus. Lumora is a maker who obsesses over quality, beautiful design, and efficient automation, building simple tools so people can focus on their craft.",
  },
  "code-tiara": {
    title: "Code Tiara — A Noiseless To-Do App for Deep Focus | Lumora",
    description:
      "Code Tiara is a distraction-free to-do app with a built-in Pomodoro timer, floating desktop notes, and themes. Download for Mac and Windows.",
  },
  doquarium: {
    title: "Doquarium — Grow Your Aquarium with To-Dos | Lumora",
    description:
      "Doquarium is a neon to-do app for Android and iPhone: every task you finish feeds the fish in your tank. Coming soon.",
  },
};
// The Doquarium privacy and account-deletion pages (English / Korean) set their
// own title from the document heading: see DoquariumDocView.

export function seoForTool(tool: Tool): Seo {
  return {
    title: `${tool.name} — Free Online Tool | ${SITE_NAME}`,
    description: `${tool.description} Free, no sign-up, and it runs right in your browser.`,
  };
}

export function seoForPost(post: BlogPost): Seo {
  return { title: `${post.title} | Lumora Journal`, description: post.excerpt };
}

export function seoForView(view: string): Seo {
  return PAGES[view] ?? PAGES.home;
}

function setMeta(attr: "name" | "property", key: string, value: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.content = value;
}

/**
 * Writes the page's title, description, and canonical link into <head>.
 * The canonical address is always the www address of the current path, so
 * Google treats lumora.tools and www.lumora.tools as one site.
 */
export function applySeo({ title, description }: Seo, pathname = window.location.pathname) {
  const path = pathname.replace(/\/+$/, "") || "/";
  const url = `${SITE_ORIGIN}${path === "/" ? "/" : path}`;
  document.title = title;
  setMeta("name", "description", description);
  setMeta("property", "og:title", title);
  setMeta("property", "og:description", description);
  setMeta("property", "og:url", url);
  let link = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!link) {
    link = document.createElement("link");
    link.rel = "canonical";
    document.head.appendChild(link);
  }
  link.href = url;
}
