export interface Tool {
  id: string;
  name: string;
  slug?: string;
  description: string;
  icon: string;
  category: string;
  link: string;
  usageSteps?: { step: string; detail: string }[];
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  link: string;
  content?: string;
  imageUrl?: string;
  tags?: string[];
  hideThumbnailInModal?: boolean;
}
