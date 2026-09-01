export type Role = 'super_admin' | 'editor' | 'author' | 'reporter';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  password?: string;
  avatar?: string;
  designation?: string;
  bio?: string;
  createdAt: string;
}

export interface Author {
  id: string;
  name: string;
  nameEn?: string;
  slug: string;
  photo: string;
  avatar?: string;
  designation: string;
  bio: string;
  email?: string;
  isColumnist?: boolean;
  socialLinks?: {
    facebook?: string;
    twitter?: string;
    linkedin?: string;
  };
  articleCount?: number;
}


export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  color?: string;
  order: number;
  showInNav: boolean;
  showOnHome: boolean;
  subcategories?: string[];
  postCount?: number;
}

export type ArticleStatus = 'published' | 'draft' | 'scheduled' | 'archived';
export type HomepagePlacement = 'hero_main' | 'hero_sub' | 'hero_secondary' | 'featured' | 'standard' | 'editor_pick' | 'trending';

export interface Article {
  id: string;
  title: string;
  slug: string;
  subtitle?: string;
  excerpt: string;
  content: string; // HTML / Rich text
  categoryId: string;
  categoryName: string;
  categorySlug: string;
  subcategory?: string;
  authorId: string;
  authorName: string;
  authorPhoto?: string;
  reporter?: string;
  location?: string;
  featuredImage: string;
  imageCaption?: string;
  imageCredit?: string;
  galleryImages?: string[];
  tags: string[];
  status: ArticleStatus;
  homepagePlacement: HomepagePlacement;
  isFeatured: boolean;
  isBreaking: boolean;
  isEditorPick: boolean;
  videoUrl?: string; // YouTube / Facebook / Direct
  videoDuration?: string;
  views: number;
  viewsCount?: number;
  publishedAt: string;
  updatedAt: string;
  scheduledAt?: string;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string[];
  canonicalUrl?: string;
  ogImage?: string;
}

export interface BreakingNews {
  id: string;
  title: string;
  link?: string;
  articleId?: string;
  priority: number; // 1 = highest
  isActive: boolean;
  startTime?: string;
  endTime?: string;
  category?: string;
  createdAt: string;
}

export type AdPlacement = 
  | 'header_top'
  | 'home_top'
  | 'home_middle'
  | 'home_bottom'
  | 'sidebar'
  | 'article_top'
  | 'article_middle'
  | 'article_bottom'
  | 'before_footer'
  | 'popunder'
  | 'social_bar';

export type AdType = 'banner' | 'popunder' | 'social_bar' | 'native' | 'custom_html';
export type AdDevice = 'all' | 'desktop' | 'mobile';

export interface Advertisement {
  id: string;
  name: string;
  title?: string;
  type: AdType;
  placement: AdPlacement;
  device: AdDevice;
  isActive: boolean;
  bannerSize?: string; // e.g. "728x90", "300x250", "970x250", "300x600"
  adCode: string; // Adsterra code or custom HTML script
  imageUrl?: string;
  targetUrl?: string;
  altText?: string;
  startDate?: string;
  endDate?: string;
  views?: number;
  clicks?: number;
}

export interface Comment {
  id: string;
  articleId: string;
  articleTitle?: string;
  userName: string;
  userEmail: string;
  authorName?: string;
  authorEmail?: string;
  content: string;
  status: 'approved' | 'pending' | 'spam' | 'rejected';
  likes: number;
  likesCount?: number;
  createdAt: string;
}

export interface MediaItem {
  id: string;
  name: string;
  url: string;
  size: number;
  mimeType: string;
  dimensions?: string;
  altText?: string;
  caption?: string;
  credit?: string;
  tags?: string[];
  uploadedAt: string;
}

export interface HomepageSectionConfig {
  id: string;
  categoryId?: string;
  categorySlug?: string;
  title: string;
  type?: 'hero' | 'latest' | 'category_grid' | 'sports_layout' | 'entertainment_layout' | 'tech_layout' | 'video_section' | 'opinion_section' | 'photo_gallery' | 'trending_sidebar';
  sectionKey?: string;
  layoutStyle?: string;
  order: number;
  enabled?: boolean;
  isEnabled?: boolean;
  postCount?: number;
}

export interface SiteSettings {
  siteName: string;
  siteTagline: string;
  siteDescription?: string;
  logoUrl: string;
  faviconUrl: string;
  contactPhone: string;
  contactEmail: string;
  address: string;
  editorName: string;
  editorInChief?: string;
  registrationNo?: string;
  publisherName: string;
  copyrightText: string;
  footerDescription: string;
  homepageSections?: HomepageSectionConfig[];
  socialLinks: {
    facebook: string;
    youtube: string;
    twitter: string;
    instagram: string;
    telegram: string;
    whatsapp: string;
  };
  seoDefaults: {
    metaTitle: string;
    metaDescription: string;
    metaKeywords: string;
    defaultOgImage: string;
    googleAnalyticsId?: string;
    googleSearchConsoleTag?: string;
  };
  adsConfig: {
    enableAdsterra: boolean;
    adsterraPublisherId?: string;
    globalPopunderActive: boolean;
    globalSocialBarActive: boolean;
  };
  themeSettings: {
    primaryColor: string;
    darkModeDefault: boolean;
  };
}

export interface AnalyticsSummary {
  totalArticles: number;
  publishedArticles: number;
  draftArticles: number;
  scheduledArticles: number;
  breakingNewsCount: number;
  totalViews: number;
  todayViews: number;
  totalCategories?: number;
  activeAds?: number;
  viewsTrend: { date: string; views: number; visitors: number }[];
  categoryViews: { category: string; count: number; views: number }[];
  topArticles: { id: string; title: string; views: number; category: string }[];
  deviceBreakdown: { name: string; value: number }[];
}

export interface SystemLog {
  id: string;
  action: string;
  user: string;
  userName?: string;
  details: string;
  ip: string;
  timestamp: string;
}
